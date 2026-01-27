import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!stripeKey || !supabaseUrl || !serviceKey) throw new Error("Missing required env vars");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const supabase = createClient(supabaseUrl, serviceKey);

    const body = await req.json();
    const email = body?.email;
    const setupIntentId = body?.setupIntentId;
    const setAsDefault = body?.setAsDefault === true;

    if (!email) throw new Error("Missing email");
    if (!setupIntentId) throw new Error("Missing setupIntentId");

    // Retrieve SetupIntent to find the PaymentMethod
    const si = await stripe.setupIntents.retrieve(setupIntentId);
    const pmId = typeof si.payment_method === "string" ? si.payment_method : si.payment_method?.id;
    if (!pmId) throw new Error("SetupIntent missing payment_method");

    // Retrieve PaymentMethod for metadata
    const pm = await stripe.paymentMethods.retrieve(pmId);
    const card = (pm as any).card;

    // Ensure member exists
    let memberId: string | null = null;

    const { data: existing, error: exErr } = await supabase
      .from("members")
      .select("id,email")
      .eq("email", email)
      .maybeSingle();

    if (exErr) throw exErr;

    if (existing?.id) {
      memberId = existing.id;
    } else {
      const { data: created, error: cErr } = await supabase
        .from("members")
        .insert({ email, membership_status: "active" })
        .select("id")
        .single();
      if (cErr) throw cErr;
      memberId = created.id;
    }

    if (!memberId) throw new Error("Unable to resolve member");

    // If setting default, unset other defaults
    if (setAsDefault) {
      await supabase
        .from("funding_sources")
        .update({ is_default: false, updated_at: new Date().toISOString() })
        .eq("member_id", memberId);
    }

    // Upsert funding source by unique payment_method_id
    const insertRow = {
      member_id: memberId,
      stripe_payment_method_id: pmId,
      brand: card?.brand ?? null,
      last4: card?.last4 ?? null,
      exp_month: card?.exp_month ?? null,
      exp_year: card?.exp_year ?? null,
      is_default: setAsDefault,
      updated_at: new Date().toISOString(),
    };

    const { data: saved, error: sErr } = await supabase
      .from("funding_sources")
      .upsert(insertRow, { onConflict: "stripe_payment_method_id" })
      .select("id,brand,last4,exp_month,exp_year,is_default,created_at,stripe_payment_method_id")
      .single();

    if (sErr) throw sErr;

    return new Response(JSON.stringify({ ok: true, card: saved }), {
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
