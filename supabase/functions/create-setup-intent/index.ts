import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.11.0";
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
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (req.method !== "POST") return json(405, { error: "Method not allowed" });

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!stripeSecretKey) return json(500, { error: "Missing STRIPE_SECRET_KEY" });
    if (!supabaseUrl || !supabaseAnonKey) {
      return json(500, { error: "Missing SUPABASE_URL or SUPABASE_ANON_KEY" });
    }

    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return json(401, { error: "Missing Authorization Bearer token" });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return json(401, { error: "Invalid/expired session", details: userErr?.message });
    }

    const userId = userData.user.id;

    const { data: member, error: memberErr } = await supabase
      .from("members")
      .select("id, user_id, email, stripe_customer_id, membership_status")
      .eq("user_id", userId)
      .maybeSingle();

    if (memberErr) return json(400, { error: "Failed to load member", details: memberErr.message });
    if (!member) return json(404, { error: "Member record not found for this user" });
    if (member.membership_status !== "active") return json(403, { error: "Membership is not active" });
    if (!member.stripe_customer_id) return json(400, { error: "Member missing stripe_customer_id" });

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });

    const setupIntent = await stripe.setupIntents.create({
      customer: member.stripe_customer_id,
      usage: "off_session",
      payment_method_types: ["card"],
      metadata: { member_id: member.id, user_id: userId },
    });

    return json(200, {
      client_secret: setupIntent.client_secret,
      setup_intent_id: setupIntent.id,
    });
  } catch (err) {
    return json(500, { error: "Unhandled error", details: String(err?.message ?? err) });
  }
});

