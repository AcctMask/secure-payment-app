import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

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

  const email = useMemo(() => session?.user?.email ?? "", [session]);
  const memberId = useMemo(
    () => fallbackMemberIdFromUserId(session?.user?.id),
    [session]
  );
  const memberSince = useMemo(
    () => formatMMDDYYYY(session?.user?.created_at ?? null),
    [session]
  );

  useEffect(() => {
    let mounted = true;

    async function boot() {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setLoading(false);
    }

    boot();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
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
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-white">PashLoc Member Dashboard</h1>

        <div className="mt-3 space-y-1 text-white/75">
          <div>Signed in as: {email}</div>
          <div>Member ID: {memberId}</div>
          <div>Member since: {memberSince || "—"}</div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/10 p-6">
            <h2 className="text-lg font-semibold text-white">Funding Card</h2>
            <p className="mt-2 text-sm text-white/70">
              Add and manage your underlying funding card. This is separate from Issuing cards.
            </p>
            <button
              className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/15"
              onClick={() => navigate("/member/funding-cards")}
            >
              Manage Funding Card
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/10 p-6">
            <h2 className="text-lg font-semibold text-white">PashLoc Protected Cards</h2>
            <p className="mt-2 text-sm text-white/70">
              Coming soon (Stripe Issuing authority required). This section will enable rotating virtual cards.
            </p>
            <button
              className="mt-4 rounded-xl bg-white/5 px-4 py-2 text-white/60 cursor-not-allowed"
              onClick={() => {}}
              disabled
            >
              Issuing Coming Soon
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/60">
          Funding Card = stored payment method (SetupIntent). PashLoc Protected Cards = rotating Issuing virtual cards (paused).
        </div>
      </div>
    </div>
  );
}
