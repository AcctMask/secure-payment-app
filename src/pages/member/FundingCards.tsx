import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";

type FundingCard = {
  id?: string;
  brand?: string;
  last4?: string;
  exp_month?: number;
  exp_year?: number;
  created_at?: string;
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

function CardRow({ card }: { card: FundingCard }) {
  const label = `${(card.brand || "Card").toUpperCase()} •••• ${card.last4 || "—"}`;
  const exp =
    card.exp_month && card.exp_year
      ? `Exp ${String(card.exp_month).padStart(2, "0")}/${String(card.exp_year).slice(-2)}`
      : "";
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-4 py-3">
      <div className="text-white/80">{label}</div>
      <div className="text-sm text-white/60">{exp}</div>
    </div>
  );
}

function AddFundingCardInner({ onSaved }: { onSaved: () => Promise<void> }) {
  const stripe = useStripe();
  const elements = useElements();

  const [busy, setBusy] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  async function ensureSetupIntent() {
    setError(null);

    const { data, error } = await supabase.functions.invoke("create-setup-intent", { body: {} });
    if (error) throw new Error(error.message);

    const secret = (data as any)?.clientSecret || (data as any)?.client_secret;
    if (!secret) throw new Error("create-setup-intent did not return a client secret.");

    setClientSecret(secret);
  }

  useEffect(() => {
    ensureSetupIntent().catch((e: any) =>
      setError(e?.message ?? "Failed to initialize setup intent.")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit() {
    if (!stripe || !elements) return;
    if (!clientSecret) return;

    setBusy(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not ready.");

      const { setupIntent, error: confirmErr } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (confirmErr) throw new Error(confirmErr.message || "Card confirmation failed.");

      const paymentMethodId = (setupIntent as any)?.payment_method;
      if (!paymentMethodId) throw new Error("SetupIntent returned no payment_method id.");

      const { error: saveErr } = await supabase.functions.invoke("save-funding-card", {
        body: { payment_method_id: paymentMethodId },
      });

      if (saveErr) throw new Error(saveErr.message || "save-funding-card failed.");

      await onSaved();

      setReady(false);
      setClientSecret(null);
      await ensureSetupIntent();
    } catch (e: any) {
      setError(e?.message ?? "Failed to save funding card.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-6">
      <h2 className="text-lg font-semibold text-white">Add Funding Card</h2>
      <p className="mt-2 text-sm text-white/70">
        SetupIntent → confirmCardSetup → save-funding-card
      </p>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
        <CardElement
          onReady={() => setReady(true)}
          options={{
            style: {
              base: {
                color: "#fff",
                fontSize: "16px",
                "::placeholder": { color: "rgba(255,255,255,0.5)" },
              },
              invalid: { color: "#ff8080" },
            },
          }}
        />
      </div>

      <button
        className="mt-4 w-full rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/15 disabled:opacity-50"
        disabled={!stripe || !elements || !clientSecret || !ready || busy}
        onClick={onSubmit}
      >
        {busy ? "Saving…" : "Save Funding Card"}
      </button>
    </div>
  );
}

export default function FundingCards() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<FundingCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const email = useMemo(() => session?.user?.email ?? "", [session]);

  async function loadCards() {
    setError(null);
    setRefreshing(true);

    const { data, error } = await supabase.functions.invoke("get-funding-cards", { body: {} });

    if (error) {
      setError(`get-funding-cards failed (${error.status || "?"}). ${error.message}`);
      setCards([]);
      setRefreshing(false);
      return;
    }

    const list = (data as any)?.cards || (data as any)?.funding_cards || [];
    setCards(Array.isArray(list) ? list : []);
    setRefreshing(false);
  }

  useEffect(() => {
    let mounted = true;

    async function boot() {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const s = data.session ?? null;
      setSession(s);

      if (s) await loadCards();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="text-white/80">Loading Funding Source…</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-2xl font-semibold text-white">Funding Source</h1>
          <p className="mt-2 text-white/70">Please sign in to manage your funding card.</p>
          <button
            className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/15"
            onClick={() => navigate("/sign-in")}
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Funding Source</h1>
          <p className="mt-2 text-white/70">
            Add and manage your underlying funding card. This uses SetupIntent (no checkout/payment mode).
          </p>
          <p className="mt-1 text-sm text-white/50">Signed in as {email}</p>
        </div>

        <button
          className="rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/15 disabled:opacity-50"
          disabled={refreshing}
          onClick={loadCards}
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-5">
          <div className="font-semibold text-red-200">get-funding-cards Error</div>
          <div className="mt-1 text-sm text-red-200">{error}</div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Stored Funding Cards</h2>
          <div className="mt-4 space-y-3">
            {cards.length === 0 ? (
              <div className="text-white/60">No funding cards found.</div>
            ) : (
              cards.map((c, idx) => <CardRow key={c.id || String(idx)} card={c} />)
            )}
          </div>
        </div>

        <Elements stripe={stripePromise} options={{}}>
          <AddFundingCardInner onSaved={loadCards} />
        </Elements>
      </div>

      <div className="mt-8">
        <button
          className="rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/15"
          onClick={() => navigate("/member")}
        >
          Back to Member Dashboard
        </button>
      </div>
    </div>
  );
}
