import React from "react";

/**
 * StripeCheckout (SAFE PLACEHOLDER)
 * ----------------------------------------------------
 * We are intentionally disabling checkout UI until:
 * 1) Issuing is enabled
 * 2) Virtual cards exist
 * 3) We wire a proper PaymentIntent/Checkout flow
 *
 * This prevents Stripe Elements "mode/currency/amount" integration errors
 * from breaking the Funding Source / dashboard experience.
 *
 * To re-enable later: set VITE_ENABLE_CHECKOUT="true" and implement the flow.
 */

export default function StripeCheckout() {
  const enabled = String(import.meta.env.VITE_ENABLE_CHECKOUT || "").toLowerCase() === "true";

  if (!enabled) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-white">
        <h2 className="text-xl font-semibold">Checkout (disabled for now)</h2>
        <p className="mt-2 text-white/70">
          Checkout will be enabled once virtual card issuing + transaction flow are live.
        </p>
        <p className="mt-2 text-sm text-white/60">
          Funding Source (stored payment method via SetupIntent) is separate and should work independently.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-white">
      <h2 className="text-xl font-semibold">Checkout</h2>
      <p className="mt-2 text-white/70">
        VITE_ENABLE_CHECKOUT is true, but checkout flow is not implemented in this placeholder.
      </p>
    </div>
  );
}
