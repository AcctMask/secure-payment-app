// supabase/functions/get-funding-cards/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return json({ ok: true }, 200);

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return json({ error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" }, 500);
    }

    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) return json({ error: "Missing bearer token" }, 401);

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Validate the user via the JWT
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return json({ error: "Invalid user session" }, 401);
    }

    const authUserId = userData.user.id;
    const email = (userData.user.email ?? "").toLowerCase().trim();
    if (!email) return json({ error: "User email not available" }, 400);

    /**
     * IMPORTANT:
     * Do NOT "insert member" on every request.
     * Instead: upsert by email (or select existing).
     *
     * This fixes: members_email_unique violations.
     */
    const { data: memberUpsert, error: upsertErr } = await supabaseAdmin
      .from("members")
      .upsert(
        {
          email,
          auth_user_id: authUserId,
          // optional fields if your schema has them:
          // name: null,
        },
        { onConflict: "email" }
      )
      .select("id,email,auth_user_id")
      .single();

    if (upsertErr || !memberUpsert) {
      return json(
        { error: "Failed to upsert member", details: upsertErr?.message ?? "unknown" },
        500
      );
    }

    const memberId = memberUpsert.id;

    // Fetch stored funding cards (table name must match your DB)
    const { data: cards, error: cardsErr } = await supabaseAdmin
      .from("funding_cards")
      .select("id,brand,last4,exp_month,exp_year,is_default,created_at")
      .eq("member_id", memberId)
      .order("created_at", { ascending: false });

    if (cardsErr) {
      return json({ error: "Failed to fetch cards", details: cardsErr.message }, 500);
    }

    return json({
      ok: true,
      member: { id: memberId, email },
      cards: cards ?? [],
    });
  } catch (e) {
    return json({ error: "Unhandled error", details: String(e) }, 500);
  }
});
