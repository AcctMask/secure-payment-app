import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

function Inner() {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!stripe || !elements) return;

    setBusy(true);
    setError(null);

    try {
      const card = elements.getElement(CardElement);
      if (!card) throw new Error("Card element missing");

      // This component is for demo/testing only
      // Real payments handled elsewhere
      console.log("Card ready:", card);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <CardElement />
      <button onClick={submit} disabled={busy}>
        {busy ? "Processing…" : "Submit"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default function StripePaymentForm() {
  return (
<Elements stripe={stripePromise}>      <Inner />
    </Elements>
  );
}
