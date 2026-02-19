import Stripe from "https://esm.sh/stripe@14.25.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const SB_URL = Deno.env.get("SB_URL");
    const SB_SERVICE_ROLE_KEY = Deno.env.get("SB_SERVICE_ROLE_KEY");

    if (!STRIPE_SECRET_KEY) return json({ error: "Missing STRIPE_SECRET_KEY" }, 500);
    if (!SB_URL) return json({ error: "Missing SB_URL" }, 500);
    if (!SB_SERVICE_ROLE_KEY) return json({ error: "Missing SB_SERVICE_ROLE_KEY" }, 500);

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    const body = await req.json().catch(() => ({}));
    const userId = body?.userId ?? null;
    const email = body?.email ?? null;

    if (!userId && !email) return json({ error: "Provide userId or email" }, 400);

    const identity = String(userId ?? email);

    const sbRes = await fetch(
      `${SB_URL}/rest/v1/members?select=id,user_id,stripe_customer_id&user_id=eq.${encodeURIComponent(identity)}`,
      {
        headers: {
          apikey: SB_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SB_SERVICE_ROLE_KEY}`,
        },
      },
    );

    const rows = await sbRes.json();
    const member = Array.isArray(rows) ? rows[0] : null;

    let stripeCustomerId = member?.stripe_customer_id ?? null;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: email ?? undefined,
        metadata: { user_id: identity, source: "pashloc" },
      });

      stripeCustomerId = customer.id;

      const upsertRes = await fetch(`${SB_URL}/rest/v1/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SB_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SB_SERVICE_ROLE_KEY}`,
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          user_id: identity,
          stripe_customer_id: stripeCustomerId,
          membership_status: "active",
        }),
      });

      if (!upsertRes.ok) {
        const t = await upsertRes.text();
        return json({ error: "Failed to upsert member", details: t }, 500);
      }
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      usage: "off_session",
      payment_method_types: ["card"],
      metadata: { user_id: identity, plan: "premium" },
    });

    return json({
      ok: true,
      customerId: stripeCustomerId,
      setupIntentId: setupIntent.id,
      clientSecret: setupIntent.client_secret,
    });
  } catch (err) {
    return json({ ok: false, error: String(err?.message ?? err) }, 500);
  }
});

