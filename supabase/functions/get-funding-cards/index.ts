import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(supabaseUrl, serviceKey);

    const { email } = await req.json().catch(() => ({}));
    if (!email) throw new Error("Missing email");

    const { data: member, error: mErr } = await supabase
      .from("members")
      .select("id,email")
      .eq("email", email)
      .maybeSingle();

    if (mErr) throw mErr;
    if (!member?.id) {
      return new Response(JSON.stringify({ ok: true, cards: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const { data: cards, error: cErr } = await supabase
      .from("funding_sources")
      .select("id,brand,last4,exp_month,exp_year,is_default,created_at,stripe_payment_method_id")
      .eq("member_id", member.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (cErr) throw cErr;

    return new Response(JSON.stringify({ ok: true, cards: cards ?? [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err?.message ?? String(err) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
