// supabase/functions/create-setup-intent/index.ts
// Creates a Stripe SetupIntent for the authenticated user.
// ALSO guarantees the user has a Stripe Customer ID stored in public.profiles.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Json = Record<string, unknown>;

function corsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function json(status: number, body: Json, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

async function stripeCreateCustomer(stripeSecretKey: string, email: string | null, supabaseUid: string) {
  const params = new URLSearchParams();
  if (email) params.set("email", email);
  params.set("metadata[supabase_uid]", supabaseUid);

  const res = await fetch("https://api.stripe.com/v1/customers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Stripe customer create failed: ${data?.error?.message ?? res.statusText}`);
  }
  return data as { id: string };
}

async function stripeCreateSetupIntent(stripeSecretKey: string, customerId: string) {
  const params = new URLSearchParams();
  params.set("customer", customerId);
  params.set("payment_method_types[]", "card");

  const res = await fetch("https://api.stripe.com/v1/setup_intents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Stripe setup_intent failed: ${data?.error?.message ?? res.statusText}`);
  }
  return data as { id: string; client_secret: string };
}

async function ensureStripeCustomerId(args: {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  stripeSecretKey: string;
  authHeader: string;
}) {
  const { supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey, stripeSecretKey, authHeader } = args;

  // Client for auth (user-scoped)
  const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userErr } = await supabaseAuth.auth.getUser();
  if (userErr || !userData?.user) {
    throw new Error("Not signed in (invalid or missing session token).");
  }
  const user = userData.user;

  // Service client for DB writes
  const supabaseSvc = createClient(supabaseUrl, supabaseServiceRoleKey);

  // Load or create profile row
  const { data: profile, error: profErr } = await supabaseSvc
    .from("profiles")
    .select("id,email,stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profErr) throw new Error(`Failed to read profile: ${profErr.message}`);

  let stripeCustomerId = profile?.stripe_customer_id ?? null;

  if (!profile) {
    const { error: insErr } = await supabaseSvc
      .from("profiles")
      .insert([{ id: user.id, email: user.email ?? null, stripe_customer_id: null }]);
    if (insErr) throw new Error(`Failed to create profile: ${insErr.message}`);
  }

  if (!stripeCustomerId) {
    const created = await stripeCreateCustomer(stripeSecretKey, user.email ?? null, user.id);
    stripeCustomerId = created.id;

    const { error: updErr } = await supabaseSvc
      .from("profiles")
      .update({ stripe_customer_id: stripeCustomerId, email: user.email ?? null })
      .eq("id", user.id);

    if (updErr) throw new Error(`Failed to save stripe_customer_id: ${updErr.message}`);
  }

  return { userId: user.id, email: user.email ?? null, stripeCustomerId };
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");

  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders(origin) });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const authHeader = req.headers.get("Authorization") ?? "";

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase env (SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY).");
    }
    if (!stripeSecretKey) throw new Error("Missing STRIPE_SECRET_KEY secret.");
    if (!authHeader.startsWith("Bearer ")) throw new Error("Missing Authorization: Bearer <token> header.");

    const ensured = await ensureStripeCustomerId({
      supabaseUrl,
      supabaseAnonKey,
      supabaseServiceRoleKey,
      stripeSecretKey,
      authHeader,
    });

    const setupIntent = await stripeCreateSetupIntent(stripeSecretKey, ensured.stripeCustomerId);

    return json(200, {
      ok: true,
      stripeCustomerId: ensured.stripeCustomerId,
      setupIntentId: setupIntent.id,
      clientSecret: setupIntent.client_secret,
    }, origin);
  } catch (e) {
    return json(400, { ok: false, error: (e as Error).message }, origin);
  }
});
