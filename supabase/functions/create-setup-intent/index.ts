import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.11.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // 🔥 HANDLE PREFLIGHT FIRST
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization" }),
        {
          headers: corsHeaders,
          status: 401,
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          headers: corsHeaders,
          status: 401,
        }
      );
    }

    const stripe = new Stripe(
      Deno.env.get("STRIPE_SECRET_KEY")!,
      { apiVersion: "2023-10-16" }
    );

    const { data: member } = await supabase
      .from("members")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (!member?.stripe_customer_id) {
      return new Response(
        JSON.stringify({ error: "Stripe customer not found" }),
        {
          headers: corsHeaders,
          status: 400,
        }
      );
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: member.stripe_customer_id,
      usage: "off_session",
    });

    return new Response(
      JSON.stringify({ clientSecret: setupIntent.client_secret }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      {
        headers: corsHeaders,
        status: 500,
      }
    );
  }
});
