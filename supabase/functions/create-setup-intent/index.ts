export const config = { auth: false };

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) throw new Error("Missing STRIPE_SECRET_KEY");

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });

    const { email } = await req.json();
    if (!email) throw new Error("Missing email");

    // Find or create customer by email
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer =
      customers.data.length > 0
        ? customers.data[0]
        : await stripe.customers.create({ email });

    // Create SetupIntent so Stripe can tokenize a funding card for future use
    const si = await stripe.setupIntents.create({
      customer: customer.id,
      usage: "off_session",
      payment_method_types: ["card"],
      metadata: {
        type: "pashloc_funding_card",
        email,
      },
    });

    return new Response(
      JSON.stringify({
        ok: true,
        customerId: customer.id,
        setupIntentId: si.id,
        clientSecret: si.client_secret,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ ok: false, error: e?.message || "Unknown error" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

