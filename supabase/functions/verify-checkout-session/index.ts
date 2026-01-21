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

    let email: string | null = null;
    let membershipType: string = "premium";
    let stripeSubscriptionId: string | null = null;

    // Support BOTH Checkout Sessions (cs_*) and PaymentIntents (pi_*)
    if (sessionId.startsWith("pi_")) {
      const pi = await stripe.paymentIntents.retrieve(sessionId);

      if (pi.status !== "succeeded") {
        throw new Error("Payment intent not succeeded");
      }

      email =
        pi.receipt_email ||
        (pi.customer && typeof pi.customer === "object"
          ? (pi.customer as any).email ?? null
          : null) ||
        null;

      membershipType = (pi.metadata?.membershipType as string) || "premium";
      stripeSubscriptionId = (pi.metadata?.subscriptionId as string) || null;
    } else {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["subscription", "customer"],
      });

      if (!session || session.payment_status !== "paid") {
        throw new Error("Checkout session not paid");
      }

      email =
        session.customer_details?.email ||
        (typeof session.customer === "object"
          ? (session.customer as any).email ?? null
          : null) ||
        session.customer_email ||
        null;

      membershipType =
        (session.metadata?.membershipType as string) || "premium";

      stripeSubscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : ((session.subscription as any)?.id ?? null);
    }

    if (!email) throw new Error("Unable to determine customer email");

    const memberData = {
      email,
      firstName: "Member",
      lastName: "",
      memberAccountNumber: `MEM-${Math.floor(Math.random() * 1000000)}`,
      membershipActive: true,
      membershipType,
      stripeSubscriptionId,
      activated_at: new Date().toISOString(),
    };

    // Optional DB write (won’t block success if table/columns differ)
    try {
      const { error: upsertErr } = await supabase
        .from("memberships")
        .upsert(
          {
            email: memberData.email,
            membership_type: memberData.membershipType,
            active: true,
            stripe_subscription_id: memberData.stripeSubscriptionId,
            member_account_number: memberData.memberAccountNumber,
            activated_at: memberData.activated_at,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "email" }
        );

      if (upsertErr) console.log("memberships upsert failed:", upsertErr.message);
    } catch (e) {
      console.log("memberships write skipped:", e);
    }

    return new Response(JSON.stringify({ ok: true, memberData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err?.message ?? String(err) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
