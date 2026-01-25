import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { supabase } from "../../lib/supabaseClient";
import type { FundingCardRow } from "../../types";

type Props = {
  email: string;
  onSaved: (card: FundingCardRow) => void;
};

export default function FundingCards({ email, onSaved }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSave = async () => {
    if (!stripe || !elements) return;

    setErr(null);
    setLoading(true);

    try {
      // 1) Create SetupIntent (server-side)
      const { data: siData, error: siErr } =
        await supabase.functions.invoke("create-setup-intent", {
          body: { email },
        });

      if (siErr) throw siErr;
      if (!siData?.clientSecret || !siData?.setupIntentId) {
        throw new Error("Missing SetupIntent response");
      }

      // 2) Confirm card setup with Stripe.js
      const cardEl = elements.getElement(CardElement);
      if (!cardEl) throw new Error("Card element not found");

      const result = await stripe.confirmCardSetup(
        siData.clientSecret,
        {
          payment_method: {
            card: cardEl,
            billing_details: { email },
          },
        }
      );

      console.log("confirmCardSetup result:", result);

      if (result.error) {
        console.error("Stripe confirmCardSetup error:", result.error);
        throw new Error(result.error.message || "Card setup failed");
      }

      if (!result.setupIntent || result.setupIntent.status !== "succeeded") {
        throw new Error("SetupIntent did not succeed");
      }

      // 3) Save funding card metadata
      const { data: saveData, error: saveErr } =
        await supabase.functions.invoke("save-funding-card", {
          body: {
            setupIntentId: siData.setupIntentId,
            email,
            setAsDefault: true,
          },
        });

      if (saveErr) throw saveErr;
      if (!saveData?.card) {
        throw new Error("No saved card returned");
      }

      onSaved(saveData.card as FundingCardRow);
    } catch (e: any) {
      setErr(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {err && <div className="error">{err}</div>}
      <CardElement />
      <button onClick={handleSave} disabled={loading}>
        {loading ? "Saving…" : "Save Funding Card"}
      </button>
    </div>
  );
}
