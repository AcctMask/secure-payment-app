import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/member", { replace: true });
    });
  }, [navigate]);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSentTo(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setSending(true);
    try {
      const redirectTo = `${window.location.origin}/member`;

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: true,
        },
      });

      if (signInError) throw signInError;

      setSentTo(trimmed);
    } catch (err: any) {
      setError(err?.message ?? "Failed to send magic link.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
      <div className="mx-auto max-w-xl px-6 pt-16 pb-20">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-6 shadow-xl">
          <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 text-white/70">
            Enter your email and we’ll send a magic link. After clicking it, you’ll return to your dashboard.
          </p>

          <form onSubmit={sendMagicLink} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm text-white/80">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@domain.com"
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/25"
              />
            </label>

            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 text-sm font-medium text-white shadow hover:opacity-95 disabled:opacity-60"
            >
              {sending ? "Sending magic link…" : "Send magic link"}
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => navigate("/", { replace: true })}
                className="text-sm text-white/70 hover:text-white"
              >
                ← Back to Home
              </button>

              <button
                type="button"
                onClick={() => navigate("/member", { replace: true })}
                className="text-sm text-white/70 hover:text-white"
              >
                Continue →
              </button>
            </div>

            {sentTo ? (
              <div className="mt-2 rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                Magic link sent to <span className="font-semibold">{sentTo}</span>. Check your email and click the link.
              </div>
            ) : null}

            {error ? (
              <div className="mt-2 rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
