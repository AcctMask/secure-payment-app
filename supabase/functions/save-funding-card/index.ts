import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return json(200, { ok: true });

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      return json(500, { ok: false, error: "Missing STRIPE_SECRET_KEY / SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY" });
    }

    // Parse JSON SAFELY (this is the main fix)
    const raw = await req.text();
    if (!raw) return json(400, { ok: false, error: "Empty request body" });

    let payload: any;
    try {
      payload = JSON.parse(raw);
    } catch {
      return json(400, { ok: false, error: "Request body is not valid JSON" });
    }

    const setupIntentId = payload?.setupIntentId;
    const email = payload?.email;
    const setAsDefault = !!payload?.setAsDefault;

    if (!setupIntentId || !email) {
      return json(400, { ok: false, error: "Missing setupIntentId or email" });
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Retrieve the SetupIntent so we can read payment_method + card details
    const si = await stripe.setupIntents.retrieve(setupIntentId, {
      expand: ["payment_method", "customer"],
    });

    if (si.status !== "succeeded") {
      return json(400, { ok: false, error: `SetupIntent not succeeded (status: ${si.status})` });
    }

    const pm = si.payment_method as Stripe.PaymentMethod | null;
    if (!pm || pm.type !== "card" || !pm.card) {
      return json(400, { ok: false, error: "SetupIntent has no card payment_method" });
    }

    // Find or create Stripe customer by email, and attach payment method
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer =
      customers.data[0] ??
      (await stripe.customers.create({
        email,
      }));

    // Attach PM to customer (ignore if already attached)
    try {
      await stripe.paymentMethods.attach(pm.id, { customer: customer.id });
    } catch (_e) {
      // ignore "already attached" cases
    }

    if (setAsDefault) {
      await stripe.customers.update(customer.id, {
        invoice_settings: { default_payment_method: pm.id },
      });
    }

    // Store only SAFE metadata in DB
    const cardRow = {
      email,
      stripe_customer_id: customer.id,
      stripe_payment_method_id: pm.id,
      brand: pm.card.brand ?? null,
      last4: pm.card.last4 ?? null,
      exp_month: pm.card.exp_month ?? null,
      exp_year: pm.card.exp_year ?? null,
      is_default: setAsDefault,
      updated_at: new Date().toISOString(),
    };

    // Try to upsert into funding_cards table (won't crash app if table differs)
    try {
      const { error: dbErr } = await supabase
        .from("funding_cards")
        .upsert(cardRow, { onConflict: "email,stripe_payment_method_id" });

      if (dbErr) {
        // Still return a usable response so UI can proceed
        return json(200, { ok: true, warning: `DB write failed: ${dbErr.message}`, card: { id: pm.id, ...cardRow } });
      }
    } catch (e) {
      return json(200, { ok: true, warning: `DB write skipped: ${String(e)}`, card: { id: pm.id, ...cardRow } });
    }

    return json(200, { ok: true, card: { id: pm.id, ...cardRow } });
  } catch (err) {
    return json(500, { ok: false, error: (err as any)?.message ?? String(err) });
  }
});
