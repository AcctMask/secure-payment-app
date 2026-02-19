import React, { useEffect, useMemo, useState } from "react";
import { useElements, useStripe, PaymentElement } from "@stripe/react-stripe-js";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

type FundingCard = {
  id?: string;
  brand?: string;
  last4?: string;
  exp_month?: number;
  exp_year?: number;
  is_default?: boolean;
  created?: string;
  [key: string]: any;
};

function prettyError(e: any) {
  if (!e) return "Unknown error";
  if (typeof e === "string") return e;
  if (e.message) return e.message;
  if (e.error) return e.error;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

const FundingCardsPage: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [cards, setCards] = useState<FundingCard[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isSignedIn = useMemo(() => !!session?.access_token, [session]);

  // --- Session bootstrap ---
  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoadingSession(true);
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (error) {
        setError(`Auth session error: ${prettyError(error)}`);
        setSession(null);
      } else {
        setSession(data.session ?? null);
      }
      setLoadingSession(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // --- Load cards when signed in ---
  useEffect(() => {
    if (!isSignedIn) return;
    void refreshCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  async function refreshCards() {
    setError(null);
    setNotice(null);
    setLoadingCards(true);
    try {
      // IMPORTANT: invoke via supabase-js so Authorization is handled
      const { data, error } = await supabase.functions.invoke("get-funding-cards", {
        body: {},
      });

      if (error) throw error;

      // Accept a few possible shapes
      const list: FundingCard[] =
        data?.cards ?? data?.data ?? (Array.isArray(data) ? data : []);

      setCards(Array.isArray(list) ? list : []);
    } catch (e: any) {
      setError(`Failed to load funding cards: ${prettyError(e)}`);
    } finally {
      setLoadingCards(false);
    }
  }

  async function handleAddFundingCard(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!stripe || !elements) {
      setError("Stripe is not ready yet. Wait 1–2 seconds and try again.");
      return;
    }
    if (!isSignedIn) {
      setError("Not signed in (no session access token). Go back to Home and sign in again.");
      return;
    }

    setBusy(true);
    try {
      // 1) Ask backend for a SetupIntent client_secret
      const { data: siData, error: siErr } = await supabase.functions.invoke("create-setup-intent", {
        body: {},
      });
      if (siErr) throw siErr;

      const clientSecret: string | undefined =
        siData?.clientSecret || siData?.client_secret || siData?.setup_intent_client_secret;

      if (!clientSecret) {
        throw new Error(`create-setup-intent did not return a clientSecret. Got: ${JSON.stringify(siData)}`);
      }

      // 2) Confirm setup with Stripe (no redirect unless required)
      const result = await stripe.confirmSetup({
        elements,
        clientSecret,
        confirmParams: {},
        redirect: "if_required",
      });

      if (result.error) {
        throw new Error(result.error.message || "Stripe confirmSetup failed");
      }

      const setupIntent = result.setupIntent;
      if (!setupIntent) {
        throw new Error("No setupIntent returned from Stripe.");
      }
      if (setupIntent.status !== "succeeded" && setupIntent.status !== "processing") {
        throw new Error(`SetupIntent status = ${setupIntent.status}`);
      }

      // 3) Optional: if you have save-funding-card function, call it (safe if missing)
      try {
        await supabase.functions.invoke("save-funding-card", {
          body: {
            setupIntentId: setupIntent.id,
            paymentMethodId: setupIntent.payment_method,
          },
        });
      } catch {
        // If the function doesn't exist or isn't needed, ignore.
      }

      setNotice("Funding card saved. Refreshing list…");
      await refreshCards();
      setNotice("Funding card saved ✅");
    } catch (e: any) {
      setError(prettyError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "28px 18px" }}>
      <h1 style={{ fontSize: 44, marginBottom: 6 }}>Funding Cards</h1>
      <p style={{ opacity: 0.85, marginTop: 0 }}>
        Add or manage the payment methods that fund your PashLoc virtual cards.
      </p>

      {loadingSession ? (
        <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.06)" }}>
          Loading session…
        </div>
      ) : !isSignedIn ? (
        <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "rgba(255,80,80,0.12)", border: "1px solid rgba(255,80,80,0.35)" }}>
          <b>Error:</b> Not signed in (no session access token). <br />
          Go back to Home, sign in again, then return to <code>/member/funding</code>.
        </div>
      ) : null}

      {error ? (
        <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "rgba(255,80,80,0.12)", border: "1px solid rgba(255,80,80,0.35)" }}>
          <b>Edge/Client error:</b> {error}
        </div>
      ) : null}

      {notice ? (
        <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "rgba(80,160,255,0.12)", border: "1px solid rgba(80,160,255,0.35)" }}>
          {notice}
        </div>
      ) : null}

      <div style={{ marginTop: 18, padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.06)" }}>
        <h2 style={{ marginTop: 0 }}>Current Funding Cards</h2>
        {loadingCards ? (
          <div>Loading…</div>
        ) : cards.length === 0 ? (
          <div style={{ opacity: 0.85 }}>No funding cards found yet.</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {cards.map((c, i) => (
              <li key={c.id ?? `${c.last4 ?? "x"}-${i}`}>
                <b>{(c.brand || "card").toUpperCase()}</b> •••• {c.last4 ?? "????"}{" "}
                {c.exp_month && c.exp_year ? (
                  <span style={{ opacity: 0.85 }}>
                    (exp {c.exp_month}/{String(c.exp_year).slice(-2)})
                  </span>
                ) : null}{" "}
                {c.is_default ? <span style={{ marginLeft: 8, opacity: 0.9 }}>(default)</span> : null}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => void refreshCards()}
          disabled={!isSignedIn || loadingCards}
          style={{
            marginTop: 12,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.08)",
            color: "white",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      <div style={{ marginTop: 18, padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.06)" }}>
        <h2 style={{ marginTop: 0 }}>Add a Funding Card</h2>
        <p style={{ opacity: 0.85 }}>
          Stripe tokenizes your card. PashLoc never stores full card numbers or CVC (PCI). Link/autofill display is normal.
        </p>

        <form onSubmit={handleAddFundingCard}>
          <div style={{ padding: 12, borderRadius: 12, background: "rgba(0,0,0,0.22)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <PaymentElement />
          </div>

          <button
            type="submit"
            disabled={!isSignedIn || busy || !stripe || !elements}
            style={{
              marginTop: 12,
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "none",
              background: busy ? "rgba(80,160,255,0.55)" : "rgba(80,160,255,0.85)",
              color: "white",
              fontSize: 16,
              fontWeight: 600,
              cursor: busy ? "not-allowed" : "pointer",
            }}
          >
            {busy ? "Saving…" : "Save Funding Card"}
          </button>
        </form>

        <div style={{ marginTop: 10, opacity: 0.7, fontSize: 13 }}>
          If you see “Stripe.js must use HTTPS” in local dev: that’s expected when using LIVE keys on http://127.0.0.1.
          Production on Vercel is HTTPS.
        </div>
      </div>
    </div>
  );
};

export default FundingCardsPage;

