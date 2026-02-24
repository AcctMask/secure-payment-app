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
      return json(500, {
        error: "Supabase env not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)",
      });
    }

    // Service role client, but user identity still comes from Authorization JWT
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) return json(401, { error: "Unauthenticated" });

    const body = await req.json().catch(() => ({} as any));

    // Accept multiple payload shapes (frontend may send camelCase)
    const payment_method_id =
      body?.payment_method_id ||
      body?.paymentMethodId ||
      body?.payment_method ||
      body?.paymentMethodID;

    if (!payment_method_id) {
      return json(400, {
        error: "Missing payment_method_id (accepted: payment_method_id or paymentMethodId)",
      });
    }

    // Ensure member row exists
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

    // Save funding card
    const { error: insertErr } = await supabase.from("funding_cards").insert({
      user_id: user.id,
      payment_method_id,
    });

    if (insertErr) return json(500, { error: insertErr.message });

    return json(200, { success: true });
  } catch (err) {
    return json(500, { error: String(err) });
  }
});
