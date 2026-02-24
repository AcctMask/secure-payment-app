import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return json(200, { ok: true });

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return json(401, { error: "Missing Authorization header" });

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return json(500, { error: "Supabase env not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)" });
    }

    // One stable client: service-role + Authorization header
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return json(401, { error: "Unauthenticated" });

    // Ensure member exists
    const { error: memberErr } = await supabase
      .from("members")
      .upsert(
        {
          user_id: user.id,
          email: user.email,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (memberErr) return json(500, { error: memberErr.message });

    const { data, error } = await supabase
      .from("funding_cards")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return json(500, { error: error.message });

    return json(200, { cards: data ?? [] });
  } catch (err) {
    return json(500, { error: String(err) });
  }
});
