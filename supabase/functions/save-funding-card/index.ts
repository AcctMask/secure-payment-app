import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // --- CORS preflight ---
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // --- Auth ---
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const jwt = authHeader.replace("Bearer ", "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY")!;

    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2023-10-16",
    });

    // --- Get user from Supabase ---
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        apikey: serviceKey,
      },
    });

    if (!userRes.ok) {
      throw new Error("Invalid Supabase session");
    }

    const user = await userRes.json();

    // --- Parse body ---
    const { paymentMethodId } = await req.json();
    if (!paymentMethodId) {
      return new Response(
        JSON.stringify({ error: "Missing paymentMethodId" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // --- Get member record ---
    const memberRes = await fetch(
      `${supabaseUrl}/rest/v1/members?user_id=eq.${user.id}&select=*`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    );

    const members = await memberRes.json();
    if (!members.length) {
      throw new Error("Member record not found");
    }

    const member = members[0];

    // --- Ensure Stripe customer ---
    let customerId = member.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });

      customerId = customer.id;

      await fetch(
        `${supabaseUrl}/rest/v1/members?id=eq.${member.id}`,
        {
          method: "PATCH",
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stripe_customer_id: customerId,
          }),
        }
      );
    }

    // --- Attach payment method ---
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // --- Set default ---
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("save-funding-card error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});

