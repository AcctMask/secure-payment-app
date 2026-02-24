import React, { useEffect, useMemo, useState } from "react";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, StripeCardElementOptions } from "@stripe/stripe-js";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

/**
 * Funding Cards Page
 * - Loads saved funding cards (via get-funding-cards Edge Function)
 * - Saves a new card:
 *    1) call create-setup-intent -> client_secret
 *    2) stripe.confirmCardSetup(client_secret, { payment_method: { card }})
 *    3) call save-funding-card with paymentMethodId
 *
 * IMPORTANT:
 * This page MUST provide Elements options with either clientSecret OR mode.
 * We use mode:"setup" so Stripe doesn't throw the PaymentElement integration error.
 */

type FundingCard = {
  id?: string;
  stripe_payment_method_id?: string;
  brand?: string;
  last4?: string;
  exp_month?: number;
  exp_year?: number;
  created_at?: string;
  is_default?: boolean;
};

function env(key: string): string {
  const v = (import.meta as any).env?.[key];
  if (!v) throw new Error(`Missing env var: ${key}`);
  return v;
}

function getSupabaseClient(): SupabaseClient {
  // If your app already has a shared supabase client, you can swap this import
  // to use it instead. This keeps FundingCards.tsx self-contained.
  const url = env("VITE_SUPABASE_URL");
  const anon = env("VITE_SUPABASE_ANON_KEY");
  return createClient(url, anon);
}

async function callEdge<T>(
  functionName: string,
  session: Session,
  payload: unknown
): Promise<T> {
  const supabaseUrl = env("VITE_SUPABASE_URL");
  const anonKey = env("VITE_SUPABASE_ANON_KEY");

  const url = `${supabaseUrl}/functions/v1/${functionName}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload ?? {}),
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // non-json response
  }

  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      text ||
      `Edge function ${functionName} failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

function FundingCardsInner({
  supabase,
  session,
}: {
  supabase: SupabaseClient;
  session: Session;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [cards, setCards] = useState<FundingCard[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [ok, setOk] = useState<string>("");

  const refresh = async () => {
    setError("");
    setOk("");
    setBusy(true);
    try {
      const resp: any = await callEdge<any>("get-funding-cards", session, {});
      const list = Array.isArray(resp) ? resp : resp?.cards || [];
      setCards(list);
      setOk("Loaded funding cards.");
    } catch (e: any) {
      setError(e?.message || "Failed to load funding cards.");
    } finally {
      setBusy(false);
    }
  };

  const saveFundingCard = async () => {
    setError("");
    setOk("");

    if (!stripe || !elements) {
      setError("Stripe not ready yet.");
      return;
    }

    const cardEl = elements.getElement(CardElement);
    if (!cardEl) {
      setError("Card element not found.");
      return;
    }

    setBusy(true);
    try {
      // 1) Create SetupIntent server-side
      const si: any = await callEdge<any>("create-setup-intent", session, {});
      const clientSecret = si?.client_secret || si?.clientSecret;
      if (!clientSecret) throw new Error("create-setup-intent did not return client_secret");

      // 2) Confirm card setup in browser
      const { setupIntent, error: stripeErr } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardEl },
      });

      if (stripeErr) throw new Error(stripeErr.message || "Stripe confirmCardSetup failed");
      if (!setupIntent?.payment_method) throw new Error("No payment_method returned by Stripe");

      const paymentMethodId =
        typeof setupIntent.payment_method === "string"
          ? setupIntent.payment_method
          : (setupIntent.payment_method as any).id;

      if (!paymentMethodId) throw new Error("Could not determine paymentMethodId");

      // 3) Save it server-side
      await callEdge<any>("save-funding-card", session, { paymentMethodId });

      setOk("Funding card saved.");
      await refresh();
    } catch (e: any) {
      setError(e?.message || "Failed to save funding card.");
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  useEffect(() => {
    refresh().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardElementOptions: StripeCardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
      },
    },
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Funding Cards</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => refresh()} disabled={busy} style={{ padding: "10px 12px" }}>
            Refresh
          </button>
          <button onClick={signOut} disabled={busy} style={{ padding: "10px 12px" }}>
            Sign out
          </button>
        </div>
      </div>

      {error ? (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "#2a0f14", border: "1px solid #ff5a6a" }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: "#ff5a6a" }}>Error</div>
          <div style={{ color: "#ffd6db" }}>{error}</div>
        </div>
      ) : null}

      {ok ? (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "#0f2a17", border: "1px solid #39d98a" }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: "#39d98a" }}>OK</div>
          <div style={{ color: "#c8ffe1" }}>{ok}</div>
        </div>
      ) : null}

      <div style={{ marginTop: 16, padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)" }}>
        <h3 style={{ marginTop: 0 }}>Add a new card</h3>
        <div style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.06)" }}>
          <CardElement options={cardElementOptions} />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button onClick={saveFundingCard} disabled={busy || !stripe || !elements} style={{ padding: "12px 14px" }}>
            {busy ? "Working…" : "Save Funding Card"}
          </button>
        </div>

        <div style={{ marginTop: 10, opacity: 0.8, fontSize: 13 }}>
          Tip: Live Stripe + HTTP local dev can fail. Use your Vercel HTTPS URL for live tests.
        </div>
      </div>

      <div style={{ marginTop: 16, padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)" }}>
        <h3 style={{ marginTop: 0 }}>Saved cards</h3>

        {cards.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No funding cards found.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {cards.map((c, idx) => (
              <div
                key={c.id || c.stripe_payment_method_id || idx}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {c.brand ? c.brand.toUpperCase() : "CARD"} {c.last4 ? `•••• ${c.last4}` : ""}
                    {c.is_default ? "  (Default)" : ""}
                  </div>
                  <div style={{ opacity: 0.8, fontSize: 13 }}>
                    {c.exp_month && c.exp_year ? `Exp ${c.exp_month}/${c.exp_year}` : ""}
                  </div>
                </div>

                <div style={{ opacity: 0.65, fontSize: 12 }}>
                  {c.stripe_payment_method_id ? `pm: ${c.stripe_payment_method_id}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FundingCardsPage() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const session = (supabase as any)?.auth?.getSession
    ? undefined
    : undefined;

  // We should already have a session in your app context normally.
  // But to keep this file standalone + robust, we pull session from supabase directly.
  // If your app passes session via props/context, keep using that and simplify this.

  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [sessionError, setSessionError] = useState<string>("");

  const stripePromise = useMemo(() => {
    const pk = (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!pk) return null;
    return loadStripe(pk);
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!mounted) return;
        if (error) {
          setSessionError(error.message);
          setActiveSession(null);
          return;
        }
        setActiveSession(data.session);
      } catch (e: any) {
        if (!mounted) return;
        setSessionError(e?.message || "Failed to read session");
        setActiveSession(null);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setActiveSession(s);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [supabase]);

  if (sessionError) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Funding Cards</h2>
        <div style={{ padding: 12, borderRadius: 8, background: "#2a0f14", border: "1px solid #ff5a6a" }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: "#ff5a6a" }}>Session Error</div>
          <div style={{ color: "#ffd6db" }}>{sessionError}</div>
        </div>
      </div>
    );
  }

  if (!activeSession) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Funding Cards</h2>
        <div style={{ opacity: 0.85 }}>Please sign in to manage funding cards.</div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Funding Cards</h2>
        <div style={{ padding: 12, borderRadius: 8, background: "#2a0f14", border: "1px solid #ff5a6a" }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: "#ff5a6a" }}>Config Error</div>
          <div style={{ color: "#ffd6db" }}>Missing VITE_STRIPE_PUBLISHABLE_KEY</div>
        </div>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      // ✅ This is the critical fix for the IntegrationError
      // If anything in this subtree uses PaymentElement, Stripe requires clientSecret OR mode.
      options={{ mode: "setup" }}
    >
      <FundingCardsInner supabase={supabase} session={activeSession} />
    </Elements>
  );
}
