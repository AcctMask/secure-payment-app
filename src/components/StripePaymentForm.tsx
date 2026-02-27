import React, { useMemo, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";

type StripeMode = "setup" | "payment";

type InnerProps = {
  mode: StripeMode;
  submitLabel?: string;
  returnUrl?: string;
  onSuccess?: () => void;
};

function InnerStripePaymentForm({
  mode,
  submitLabel,
  returnUrl,
  onSuccess,
}: InnerProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalLabel =
    submitLabel ?? (mode === "setup" ? "Save card" : "Pay now");

  const submit = async () => {
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe is still loading. Please try again in a moment.");
      return;
    }

    setBusy(true);
    try {
      // NOTE:
      // - Funding source = SetupIntent => confirmSetup (no currency/amount needed)
      // - Checkout = PaymentIntent => confirmPayment (requires amount/currency on server)
      const result =
        mode === "setup"
          ? await stripe.confirmSetup({
              elements,
              confirmParams: returnUrl ? { return_url: returnUrl } : undefined,
              redirect: returnUrl ? "if_required" : "if_required",
            })
          : await stripe.confirmPayment({
              elements,
              confirmParams: returnUrl ? { return_url: returnUrl } : undefined,
              redirect: returnUrl ? "if_required" : "if_required",
            });

      if (result.error) {
        setError(result.error.message ?? "Something went wrong.");
        return;
      }

      // If redirect is required, Stripe will handle it.
      // If not required, we get here and can notify parent.
      onSuccess?.();
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <PaymentElement />
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={busy || !stripe || !elements}
        className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Processing…" : finalLabel}
      </button>

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      ) : null}
    </div>
  );
}

export type StripePaymentFormProps = {
  /**
   * REQUIRED: clientSecret from your server (SetupIntent or PaymentIntent).
   * Funding source (save card) should always be SetupIntent clientSecret.
   */
  clientSecret: string;

  /**
   * Defaults to "setup" to prevent payment-mode config bugs in Funding Source.
   * Only use "payment" when doing real checkout (PaymentIntent).
   */
  mode?: StripeMode;

  /**
   * Optional: where Stripe should return after any 3DS redirect.
   * For local dev: `${window.location.origin}/member/dashboard` (or wherever you want)
   */
  returnUrl?: string;

  /**
   * Optional: button label
   */
  submitLabel?: string;

  /**
   * Optional callback when Stripe confirms without redirect
   */
  onSuccess?: () => void;
};

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as
  | string
  | undefined;

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export default function StripePaymentForm({
  clientSecret,
  mode = "setup",
  returnUrl,
  submitLabel,
  onSuccess,
}: StripePaymentFormProps) {
  const options: StripeElementsOptions = useMemo(() => {
    // IMPORTANT:
    // - DO NOT pass `mode: "payment"` here for funding cards.
    // - For SetupIntent you only need clientSecret + appearance.
    return {
      clientSecret,
      appearance: {
        theme: "night",
      },
    };
  }, [clientSecret]);

  if (!publishableKey) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
        Missing <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in your environment.
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
        Stripe failed to initialize (publishable key issue).
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
        Loading…
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <InnerStripePaymentForm
        mode={mode}
        submitLabel={submitLabel}
        returnUrl={returnUrl}
        onSuccess={onSuccess}
      />
    </Elements>
  );
}
