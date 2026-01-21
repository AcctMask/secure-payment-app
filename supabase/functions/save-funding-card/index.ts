export const config = { auth: false };

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
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required env vars (STRIPE_SECRET_KEY / SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { setupIntentId, email, setAsDefault } = await req.json();
    if (!setupIntentId) throw new Error("Missing setupIntentId");
    if (!email) throw new Error("Missing email");

    // Retrieve SetupIntent and the PaymentMethod
    const si = await stripe.setupIntents.retrieve(setupIntentId);
    if (si.status !== "succeeded") throw new Error("SetupIntent not succeeded yet");

    const pmId = typeof si.payment_method === "string" ? si.payment_method : si.payment_method?.id;
    if (!pmId) throw new Error("No payment method on SetupIntent");

    const pm = await stripe.paymentMethods.retrieve(pmId);

    const customerId =
      typeof si.customer === "string"
        ? si.customer
        : (si.customer as any)?.id || null;

    // Optionally set as default funding method for invoice/subscription payments
    if (setAsDefault && customerId) {
      await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: pmId },
      });
    }

    // Store minimal safe card metadata
    const card = (pm as any).card || {};
    const insertRow = {
      email,
      stripe_customer_id: customerId,
      stripe_payment_method_id: pmId,
      brand: card.brand || null,
      last4: card.last4 || null,
      exp_month: card.exp_month || null,
      exp_year: card.exp_year || null,
      is_default: !!setAsDefault,
    };

    const { data, error } = await supabase
      .from("funding_cards")
      .insert(insertRow)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return new Response(JSON.stringify({ ok: true, card: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || "Unknown error" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

