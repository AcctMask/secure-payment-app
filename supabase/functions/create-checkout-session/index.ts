// supabase/functions/create-checkout-session/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function ensureSessionIdParam(url: string) {
  // If caller already included the placeholder, leave it alone.
  if (url.includes("{CHECKOUT_SESSION_ID}")) return url;

  // If they already added a session_id key, also leave it alone.
  if (url.includes("session_id=")) return url;

  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}session_id={CHECKOUT_SESSION_ID}`;
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
    const STRIPE_PREMIUM_PRICE_ID = Deno.env.get("STRIPE_PREMIUM_PRICE_ID") ?? "";
    const STRIPE_SUCCESS_URL = Deno.env.get("STRIPE_SUCCESS_URL") ?? "";
    const STRIPE_CANCEL_URL = Deno.env.get("STRIPE_CANCEL_URL") ?? "";

    if (!STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY secret");
    if (!STRIPE_PREMIUM_PRICE_ID) throw new Error("Missing STRIPE_PREMIUM_PRICE_ID secret");
    if (!STRIPE_SUCCESS_URL) throw new Error("Missing STRIPE_SUCCESS_URL secret");
    if (!STRIPE_CANCEL_URL) throw new Error("Missing STRIPE_CANCEL_URL secret");

    const body = await req.json().catch(() => ({}));
    const plan = (body.plan ?? "premium") as string;
    const email = (body.email ?? "") as string;

    const priceId =
      (body.priceId as string | undefined) ??
      (plan === "premium" ? STRIPE_PREMIUM_PRICE_ID : STRIPE_PREMIUM_PRICE_ID);

    if (!priceId) throw new Error("Missing priceId (and no default configured)");
    if (!email) throw new Error("Missing email");

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    const successUrl = ensureSessionIdParam(STRIPE_SUCCESS_URL);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: STRIPE_CANCEL_URL,
      allow_promotion_codes: true,
      metadata: {
        plan,
        email,
      },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

