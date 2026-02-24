import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const redirectTo = useMemo(() => {
    // After magic link, go straight to dashboard.
    return `${window.location.origin}/member`;
  }, []);

  useEffect(() => {
    // If already signed in, skip this page.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/member");
    });

    // If the auth state changes (magic link completes), navigate.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/member");
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) throw error;

      setStatus("sent");
      setMessage("Magic link sent. Check your email, then come back here.");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(err?.message || "Failed to send magic link.");
    }
  };

  return (
    <div className="mx-auto max-w-lg px-6 pt-16 pb-20">
      <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-2 text-white/70">
        Enter your email and we’ll send a magic link.
      </p>

      <form onSubmit={sendMagicLink} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm text-white/80">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/30"
            placeholder="you@domain.com"
          />
        </label>

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 text-sm font-medium text-white shadow hover:opacity-95 disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Send Magic Link"}
        </button>

        {message ? (
          <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/80">
            {message}
          </div>
        ) : null}
      </form>
    </div>
  );
}
