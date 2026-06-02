import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function BecomeMember() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {},
      });

      if (error) {
        throw new Error(`${error.message} (status ${error.status || "?"})`);
      }

      const url = (data as any)?.url;
      if (!url) {
        throw new Error("Checkout session failed: no URL returned by create-checkout-session.");
      }

      window.location.href = url;
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Checkout session failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-white">
      <h1 className="text-4xl font-bold mb-6">Become a PashLoc Member</h1>

      <p className="text-white/70 mb-8">
        Join PashLoc to protect your payment cards. Your real card is never used directly.
        Every purchase is made through a protected flow.
      </p>

      <button
        onClick={startCheckout}
        disabled={loading}
        className="rounded-xl bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-500 disabled:opacity-60"
      >
        {loading ? "Redirecting..." : "Start Membership"}
      </button>

      <p className="mt-4 max-w-md text-sm leading-6 text-white/55">
        By continuing, you agree to our{" "}
        <Link to="/terms" className="text-white/80 underline underline-offset-4 hover:text-white">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-white/80 underline underline-offset-4 hover:text-white">
          Privacy Policy
        </Link>
        .
      </p>

      {error ? (
        <div className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}
    </div>
  );
}
