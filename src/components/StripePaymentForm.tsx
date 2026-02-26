import React, { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

/**
 * This component is intentionally "safe":
 * - It does NOT use Elements `mode: "payment"` (which requires currency/amount and can crash if missing).
 * - It uses the classic CardElement + confirmCardPayment flow.
 *
 * You can keep it in the repo without it breaking Funding Cards routes.
 * When you’re ready to implement payments, wire the `/api/create-payment-intent` endpoint (or a Supabase Edge function)
 * to return `{ clientSecret }`.
 */

function InnerPaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function submit() {
    setError(null);
    setStatus(null);

    if (!stripe || !elements) {
      setError("Stripe is still loading. Try again in a moment.");
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card input not ready. Please refresh and try again.");
      return;
    }

    setBusy(true);
    try {
      // IMPORTANT: This endpoint is a placeholder.
      // Implement later (server/edge) to create a PaymentIntent and return clientSecret.
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Example payload; adjust when you implement real checkout
        body: JSON.stringify({ amount: 1999, currency: "usd" }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Create PaymentIntent failed: ${res.status} ${t}`);
      }

      const data = (await res.json()) as { clientSecret?: string };
      if (!data.clientSecret) {
        throw new Error("Missing clientSecret from /api/create-payment-intent");
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed.");
      }

      if (result.paymentIntent?.status === "succeeded") {
        setStatus("Payment succeeded.");
      } else {
        setStatus(`Payment status: ${result.paymentIntent?.status ?? "unknown"}`);
      }
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-6 text-white">
      <h3 className="text-lg font-semibold">Test Payment</h3>
      <p className="mt-1 text-sm text-white/70">
        This is a safe placeholder component. It should not impact Funding Cards.
      </p>

      <div className="mt-4 rounded-lg border border-white/15 bg-black/20 p-3">
        <CardElement
          options={{
            style: {
              base: {
                color: "#ffffff",
                fontSize: "16px",
                "::placeholder": { color: "#b8b8c7" },
              },
              invalid: { color: "#ff6b6b" },
            },
          }}
        />
      </div>

      <button
        onClick={submit}
        disabled={busy || !stripe || !elements}
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95 disabled:opacity-50"
      >
        {busy ? "Processing…" : "Submit"}
      </button>

      {error ? (
        <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {status ? (
        <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
          {status}
        </div>
      ) : null}
    </div>
  );
}

export default function StripePaymentForm() {
  // No `mode: "payment"` here — avoids the currency/amount integration crash.
  const options = useMemo(() => ({}), []);
  return (
    <Elements stripe={stripePromise} options={options}>
      <InnerPaymentForm />
    </Elements>
  );
}
