import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

type MemberMeta = {
  email: string;
  memberId: string;
  memberSince: string; // MM/DD/YYYY
};

function formatMMDDYYYY(dateLike?: string | null) {
  if (!dateLike) return "";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  return `${mm}/${dd}/${yyyy}`;
}

function fallbackMemberIdFromUserId(userId?: string) {
  if (!userId) return "UNKNOWN";
  return userId.replace(/-/g, "").slice(0, 8).toUpperCase();
}

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<MemberMeta | null>(null);
  const [error, setError] = useState<string | null>(null);

  const email = useMemo(() => session?.user?.email ?? "", [session]);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      setLoading(true);
      setError(null);

      const { data, error: sessErr } = await supabase.auth.getSession();
      if (!mounted) return;

      if (sessErr) {
        setSession(null);
        setMeta(null);
        setError(sessErr.message);
        setLoading(false);
        return;
      }

      const s = data.session ?? null;
      setSession(s);

      if (!s?.user) {
        setMeta(null);
        setLoading(false);
        return;
      }

      // One responsibility: show member identity + navigation.
      // Pull "member_id" + "member_since" from DB if present, otherwise fallback to user metadata.
      try {
        const user = s.user;

        // Try to read from "members" table if it exists.
        // If table/columns don't exist, this will fail harmlessly and we'll fallback.
        const { data: memberRow, error: memberErr } = await supabase
          .from("members")
          .select("member_id, created_at, full_name")
          .eq("user_id", user.id)
          .maybeSingle();

        const memberId =
          (memberRow as any)?.member_id ||
          fallbackMemberIdFromUserId(user.id);

        const memberSince =
          formatMMDDYYYY((memberRow as any)?.created_at || user.created_at);

        const derivedEmail = user.email ?? "";

        if (!mounted) return;

        // ignore memberErr; fallback works even if table doesn't exist
        void memberErr;

        setMeta({
          email: derivedEmail,
          memberId,
          memberSince,
        });
      } catch (e: any) {
        if (!mounted) return;
        setMeta({
          email: s.user.email ?? "",
          memberId: fallbackMemberIdFromUserId(s.user.id),
          memberSince: formatMMDDYYYY(s.user.created_at),
        });
        setError(e?.message ?? null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      // update session only; do NOT navigate here (prevents loops)
      setSession(newSession ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="text-white/80">Loading dashboard…</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-2xl font-semibold text-white">Member Dashboard</h1>
          <p className="mt-2 text-white/70">
            You’re not signed in. Use the Sign In button in the header.
          </p>
          {error ? (
            <p className="mt-3 text-sm text-red-300">Auth error: {error}</p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-white">PashLoc Member Dashboard</h1>

        <div className="mt-3 space-y-1 text-white/75">
          <div>Signed in as: {meta?.email || email}</div>
          <div>Member ID: {meta?.memberId ?? "—"}</div>
          <div>Member since: {meta?.memberSince ?? "—"}</div>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
            Note: {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/10 p-6">
            <h2 className="text-lg font-semibold text-white">Funding Source</h2>
            <p className="mt-2 text-sm text-white/70">
              Store and manage the card used as your underlying funding method.
              This is separate from PashLoc issuing cards.
            </p>
            <button
              className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/15"
              onClick={() => navigate("/funding-source")}
            >
              Manage Funding Source
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/10 p-6">
            <h2 className="text-lg font-semibold text-white">PashLoc Protected Cards</h2>
            <p className="mt-2 text-sm text-white/70">
              Rotating virtual cards (Issuing). Used at merchants once issuing + transaction flow is enabled.
            </p>
            <button
              className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/15"
              onClick={() => navigate("/member/pashloc-cards")}
            >
              View PashLoc Protected Cards
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/60">
          Funding Source = stored payment method (SetupIntent). PashLoc Protected Cards = issuing virtual cards.
          Keeping these separate prevents Stripe config conflicts.
        </div>
      </div>
    </div>
  );
}
