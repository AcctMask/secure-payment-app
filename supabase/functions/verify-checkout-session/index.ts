import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        "Missing required environment variables (STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)"
      );
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json().catch(() => null);
    const sessionId = payload?.sessionId;

    if (!sessionId || typeof sessionId !== "string") {
      throw new Error("Missing sessionId");
    }

    // Pull everything we might need for BOTH one-time + subscription checkouts
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [
        "customer",
        "payment_intent",
        "subscription",
        "subscription.latest_invoice",
        "subscription.latest_invoice.payment_intent",
      ],
    });

    if (!session) throw new Error("Checkout session not found");

    // You can relax this if you want, but it's a good safety check
    if (session.payment_status !== "paid") {
      throw new Error(`Checkout session not paid (status=${session.payment_status})`);
    }

    // Email
    const email =
      session.customer_details?.email ||
      (typeof session.customer === "object"
        ? (session.customer as any).email ?? null
        : null) ||
      session.customer_email ||
      null;

    if (!email) throw new Error("Unable to determine customer email");

    // Customer id
    const stripeCustomerId =
      typeof session.customer === "string"
        ? session.customer
        : ((session.customer as any)?.id ?? null);

    // Subscription id (if subscription mode)
    const stripeSubscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : ((session.subscription as any)?.id ?? null);

    // Membership type from metadata (fallback premium)
    const membershipType =
      (session.metadata?.membershipType as string) || payload?.plan || "premium";

    // PaymentIntent id:
    // 1) direct one-time checkout session payment_intent
    // 2) subscription.latest_invoice.payment_intent
    let paymentIntentId: string | null = null;

    const piAny = session.payment_intent as any;
    if (typeof piAny === "string") paymentIntentId = piAny;
    else if (piAny?.id) paymentIntentId = piAny.id;

    if (!paymentIntentId) {
      const subAny = session.subscription as any;
      const latestInvoice = subAny?.latest_invoice;
      const invPI = latestInvoice?.payment_intent;

      if (typeof invPI === "string") paymentIntentId = invPI;
      else if (invPI?.id) paymentIntentId = invPI.id;
    }

    if (!paymentIntentId) {
      throw new Error(
        "Could not determine payment_intent_id from the Checkout session. Check session mode/expansions."
      );
    }

    const now = new Date().toISOString();

    // Log payment (optional; won’t block)
    try {
      await supabase.from("payment_logs").upsert(
        {
          payment_intent_id: paymentIntentId,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? "usd",
          status: session.payment_status ?? "paid",
          customer_email: email,
          metadata: {
            source: "checkout",
            sessionId,
            stripeCustomerId,
            stripeSubscriptionId,
            mode: session.mode,
          },
          created_at: now,
        },
        { onConflict: "payment_intent_id" }
      );
    } catch (_e) {}

    // Ensure member exists (your schema uses user_id, NOT email column)
    // We use email as user_id for now.
    let memberId: string | null = null;

    const { data: existingMember } = await supabase
      .from("members")
      .select("id")
      .eq("user_id", email)
      .limit(1)
      .maybeSingle();

    if (existingMember?.id) {
      memberId = existingMember.id;
      await supabase
        .from("members")
        .update({
          stripe_customer_id: stripeCustomerId,
          membership_status: "active",
          updated_at: now,
        })
        .eq("id", memberId);
    } else {
      const { data: insertedMember } = await supabase
        .from("members")
        .insert({
          user_id: email,
          stripe_customer_id: stripeCustomerId,
          membership_status: "active",
          created_at: now,
          updated_at: now,
        })
        .select("id")
        .single();

      memberId = insertedMember?.id ?? null;
    }

    // Record membership (unique on payment_intent_id already exists in your schema)
    await supabase.from("memberships").upsert(
      {
        payment_intent_id: paymentIntentId,
        user_id: email,
        plan: membershipType,
        status: "active",
        activated_at: now,
        created_at: now,
        updated_at: now,
      },
      { onConflict: "payment_intent_id" }
    );

    return new Response(
      JSON.stringify({
        ok: true,
        memberData: {
          email,
          membershipActive: true,
          membershipType,
          stripeCustomerId,
          stripeSubscriptionId,
          paymentIntentId,
          memberId,
          activated_at: now,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err?.message ?? String(err) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

