import React, { useEffect, useState } from "react";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type FundingCardRow = {
  id: string;
  brand: string | null;
  last4: string | null;
  exp_month: number | null;
  exp_year: number | null;
  is_default: boolean | null;
  created_at: string;
  stripe_payment_method_id: string;
};

const CardSetupInner: React.FC<{ onSaved: () => Promise<void> }> = ({ onSaved }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { memberData } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const email = memberData?.email;

  const handleAddCard = async () => {
    setErr(null);
    if (!stripe || !elements) return;
    if (!email) {
      setErr("No member email found. Please complete membership verification first.");
      return;
    }

    setLoading(true);
    try {
      // 1) Create SetupIntent server-side
      const { data: siData, error: siErr } = await supabase.functions.invoke("create-setup-intent", {
        body: { email },
      });
      if (siErr) throw siErr;
      if (!siData?.clientSecret || !siData?.setupIntentId) throw new Error("Missing SetupIntent response");

      // 2) Confirm card setup in Stripe.js
      const cardEl = elements.getElement(CardElement);
      if (!cardEl) throw new Error("Card element not found");

      const result = await stripe.confirmCardSetup(siData.clientSecret, {
        payment_method: {
          card: cardEl,
          billing_details: { email },
        },
      });

      console.log("confirmCardSetup result:", result);

      if (result.error) {
        console.error("Stripe confirmCardSetup error:", result.error);
        throw new Error(result.error.message || "Card setup failed");
      }
      if (!result.setupIntent || result.setupIntent.status !== "succeeded") {
        throw new Error(`SetupIntent did not succeed (status: ${result.setupIntent?.status ?? "unknown"})`);
      }

      // 3) Save funding card metadata in Supabase via Edge Function
      const { data: saveData, error: saveErr } = await supabase.functions.invoke("save-funding-card", {
        body: {
          setupIntentId: siData.setupIntentId,
          email,
          setAsDefault: true,
        },
      });
      if (saveErr) throw saveErr;
      if (!saveData?.ok) throw new Error(saveData?.error || "save-funding-card failed");

      await onSaved();
    } catch (e: any) {
      setErr(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black/20 backdrop-blur-sm border border-white/10">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Add a Funding Card</h2>
        <p className="text-sm text-white/70">
          Stripe tokenizes your card. PashLoc never stores full card numbers or CVC (PCI).
          Link/autofill display is normal.
        </p>

        <div className="rounded-lg border border-white/10 p-4 bg-black/30">
          <CardElement options={{ hidePostalCode: false }} />
        </div>

        {err && (
          <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {err}
          </div>
        )}

        <Button onClick={handleAddCard} disabled={loading || !stripe} className="w-full">
          {loading ? "Saving…" : "Save Funding Card"}
        </Button>
      </CardContent>
    </Card>
  );
};

const FundingCardsPage: React.FC = () => {
  const { memberData } = useAppContext();
  const [cards, setCards] = useState<FundingCardRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const email = memberData?.email;

  const loadCards = async () => {
    setErr(null);
    setMsg(null);
    if (!email) return;

    const { data, error } = await supabase.functions.invoke("get-funding-cards", {
      body: { email },
    });

    if (error) {
      setErr(error.message);
      return;
    }
    if (!data?.ok) {
      setErr(data?.error || "Failed to load funding cards");
      return;
    }

    setCards(data.cards || []);
  };

  useEffect(() => {
    void loadCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <div className="px-6 py-10 max-w-4xl mx-auto text-white space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Funding Cards</h1>
            <p className="text-white/70 mt-2">
              Add or manage the payment methods that fund your PashLoc virtual cards.
            </p>
            <p className="text-sm text-white/60 mt-3">
              Signed in as: <span className="text-white font-medium">{email ?? "—"}</span>
            </p>
          </div>

          <Button
            variant="outline"
            className="border-white/15 bg-white/5 hover:bg-white/10"
            onClick={() => navigate("/member")}
          >
            Back to Dashboard
          </Button>
        </div>

        {msg && <div className="text-sm text-green-300">{msg}</div>}
        {err && <div className="text-sm text-red-300">{err}</div>}

        <Elements stripe={stripePromise}>
          <CardSetupInner
            onSaved={async () => {
              setMsg("✅ Funding card saved. Next: virtual card issuance.");
              await loadCards();
            }}
          />
        </Elements>

        <Card className="bg-black/20 backdrop-blur-sm border border-white/10">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">Saved Funding Cards</h2>

            {cards.length === 0 ? (
              <p className="text-sm text-white/60">No saved cards found yet.</p>
            ) : (
              <div className="space-y-3">
                {cards.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between border border-white/10 rounded-lg p-4 bg-black/30"
                  >
                    <div className="text-sm">
                      <div className="font-medium text-white">
                        {(c.brand || "CARD").toUpperCase()} •••• {c.last4 ?? "—"} {c.is_default ? "• Default" : ""}
                      </div>
                      <div className="text-white/70">
                        Exp {c.exp_month ?? "—"}/{c.exp_year ?? "—"}
                      </div>
                      <div className="text-white/50 text-xs mt-1">
                        PM: {c.stripe_payment_method_id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <Button
                variant="outline"
                className="border-white/15 bg-white/5 hover:bg-white/10"
                onClick={() => void loadCards()}
                disabled={!email}
              >
                Refresh List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FundingCardsPage;
