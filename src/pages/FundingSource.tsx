import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

export default function FundingSource() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  if (!session) {
    navigate("/sign-in");
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Funding Source</h1>
        <p className="text-muted-foreground mt-2">
          Add and manage your underlying funding card (SetupIntent only).
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 text-red-400">
          {error}
        </div>
      )}

      <Elements stripe={stripePromise}>
        <AddFundingCard
          onSuccess={() => navigate("/funding-source/details")}
          onError={(msg) => setError(msg)}
        />
      </Elements>

      <button
        className="text-sm text-muted-foreground"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}

function AddFundingCard({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.functions.invoke(
        "create-setup-intent"
      );
      if (error) {
        onError("Failed to create SetupIntent.");
        return;
      }
      setClientSecret(data?.clientSecret || data?.client_secret);
    }
    init();
  }, []);

  async function saveCard() {
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { setupIntent, error } = await stripe.confirmCardSetup(
      clientSecret,
      {
        payment_method: { card },
      }
    );

    if (error) {
      onError(error.message || "Card confirmation failed.");
      setLoading(false);
      return;
    }

    const { error: saveError } = await supabase.functions.invoke(
      "save-funding-card",
      {
        body: { payment_method_id: setupIntent.payment_method },
      }
    );

    if (saveError) {
      onError("Failed to save funding card.");
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess();
  }

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <CardElement />

      <button
        onClick={saveCard}
        disabled={loading}
        className="w-full rounded-lg bg-primary text-primary-foreground py-2"
      >
        {loading ? "Saving..." : "Save Funding Card"}
      </button>
    </div>
  );
}
