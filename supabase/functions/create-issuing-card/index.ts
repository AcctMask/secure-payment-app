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

    const { email } = await req.json();
    if (!email) throw new Error("Missing email");

    // Ensure member exists
    const { data: member, error: memberErr } = await supabase
      .from("members")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (memberErr) throw memberErr;
    if (!member) throw new Error("Member not found. Complete membership first.");

    // Create/Reuse cardholder
    let cardholderId: string | null = null;

    const { data: chRow } = await supabase
      .from("issuing_cardholders")
      .select("stripe_cardholder_id")
      .eq("email", email)
      .maybeSingle();

    if (chRow?.stripe_cardholder_id) {
      cardholderId = chRow.stripe_cardholder_id;
    } else {
      const created = await stripe.issuing.cardholders.create({
        type: "individual",
        name: "PashLoc Member",
        email,
      });
      cardholderId = created.id;

      const { error: upsertChErr } = await supabase
        .from("issuing_cardholders")
        .upsert({ email, stripe_cardholder_id: cardholderId }, { onConflict: "email" });

      if (upsertChErr) throw upsertChErr;
    }

    // Create virtual issuing card (spends from YOUR issuing balance)
    // Controls can be tightened later (MCC allowlists, limits, etc).
    const card = await stripe.issuing.cards.create({
      type: "virtual",
      cardholder: cardholderId!,
      currency: "usd",
    });

    // Save masked metadata for UI
    const row = {
      stripe_card_id: card.id,
      email,
      brand: card.brand ?? null,
      last4: card.last4 ?? null,
      exp_month: card.exp_month ?? null,
      exp_year: card.exp_year ?? null,
      status: card.status ?? null,
    };

    const { error: saveErr } = await supabase.from("issuing_cards").upsert(row, { onConflict: "stripe_card_id" });
    if (saveErr) throw saveErr;

    return new Response(JSON.stringify({ ok: true, card: row }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message ?? String(e) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
