import React, { useMemo, useState } from "react";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

/**
 * StripeCardSetup
 *
 * This component uses CardElement (NOT PaymentElement).
 * Stripe still requires Elements to be created with either:
 *  - options.clientSecret (when using PaymentElement), OR
 *  - options.mode ("payment" | "setup") for non-clientSecret flows.
 *
 * To prevent runtime IntegrationError, we always pass mode.
 */

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

type Props = {
  title?: string;
  onCardReady?: () => void;
  onSubmit?: (paymentMethodId: string) => Promise<void> | void;
};

function Inner({ title = "Add a card", onCardReady, onSubmit }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    setError("");
    if (!stripe || !elements) {
      setError("Stripe is not ready yet.");
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card element not found.");
      return;
    }

    setBusy(true);
    try {
      // Create a PaymentMethod (client-side tokenization). No secret keys here.
      const { paymentMethod, error: pmErr } = await stripe.createPaymentMethod({
        type: "card",
        card,
      });

      if (pmErr) throw new Error(pmErr.message || "Failed to create payment method");
      if (!paymentMethod?.id) throw new Error("No paymentMethod id returned");

      // Optional callback to hand off the PM id to your server/edge function
      await onSubmit?.(paymentMethod.id);
    } catch (e: any) {
      setError(e?.message || "Failed to save card.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
      </div>

      <div style={{ marginTop: 12, padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)" }}>
        <CardElement
          onReady={() => onCardReady?.()}
          options={{
            style: {
              base: {
                color: "#ffffff",
                fontSize: "16px",
                "::placeholder": { color: "rgba(255,255,255,0.55)" },
              },
              invalid: { color: "#ff6b6b" },
            },
          }}
        />
      </div>

      {error && (
        <div style={{ marginTop: 10, color: "#ff6b6b", fontSize: 14 }}>
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={busy || !stripe}
        style={{
          marginTop: 14,
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(255,255,255,0.08)",
          color: "#fff",
          cursor: busy ? "not-allowed" : "pointer",
        }}
      >
        {busy ? "Saving…" : "Save Card"}
      </button>
    </div>
  );
}

export default function StripeCardSetup(props: Props) {
  const options = useMemo(() => ({ mode: "setup" as const }), []);
  return (
    <Elements stripe={stripePromise} options={options}>
      <Inner {...props} />
    </Elements>
  );
}
