import React, { useState } from "react";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "@/lib/supabase";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!
);

interface CheckoutFormProps {
  amount: number; // cents
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

function CheckoutForm({ amount, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe not ready.");
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card element not found.");
      return;
    }

    setBusy(true);

    try {
      // 1️⃣ Create PaymentIntent on server (Edge Function)
      const { data, error: fnError } = await supabase.functions.invoke(
        "create-payment-intent",
        {
          body: { amount },
        }
      );

      if (fnError) throw fnError;
      if (!data?.client_secret) {
        throw new Error("Missing client_secret from payment intent.");
      }

      // 2️⃣ Confirm payment with CardElement
      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card,
        },
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed.");
      }

      if (result.paymentIntent?.status === "succeeded") {
        onSuccess?.();
      } else {
        throw new Error("Payment did not succeed.");
      }
    } catch (err: any) {
      const msg = err?.message || "Payment error.";
      setError(msg);
      onError?.(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-white/15 bg-white/5 p-3">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                color: "#ffffff",
                fontSize: "16px",
                "::placeholder": { color: "#9ca3af" },
              },
              invalid: { color: "#f87171" },
            },
          }}
        />
      </div>

      {error && (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-60"
      >
        {busy ? "Processing…" : "Pay Now"}
      </button>
    </form>
  );
}

interface StripeCheckoutProps {
  amount: number; // cents
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export default function StripeCheckout({
  amount,
  onSuccess,
  onError,
}: StripeCheckoutProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
