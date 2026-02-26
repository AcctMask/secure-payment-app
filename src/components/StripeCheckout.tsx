import React, { useState } from "react";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";

import { supabase } from "@/lib/supabase";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

type Props = {
  amount: number; // dollars (or whatever you’ve been passing in)
  onSuccess?: (paymentIntent: any) => void;
  onError?: (message: string) => void;
};

function CheckoutForm({ amount, onSuccess, onError }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) {
      const m = "Card form not ready. Please refresh and try again.";
      setMessage(m);
      onError?.(m);
      return;
    }

    setIsProcessing(true);

    try {
      // Create PaymentIntent via Supabase Edge Function
      // NOTE: This assumes you have an edge function named "create-payment-intent".
      // If yours is named differently, tell me the exact function name and I’ll adjust.
      const amountCents = Math.round(Number(amount) * 100);

      const { data, error } = await supabase.functions.invoke("create-payment-intent", {
        body: {
          amount: amountCents,
          currency: "usd",
        },
      });

      if (error) throw error;
      const clientSecret = (data as any)?.clientSecret || (data as any)?.client_secret;
      if (!clientSecret) {
        throw new Error("Missing clientSecret from create-payment-intent response.");
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed.");
      }

      if (result.paymentIntent?.status === "succeeded") {
        onSuccess?.(result.paymentIntent);
      } else {
        onSuccess?.(result.paymentIntent);
      }
    } catch (err: any) {
      const m = err?.message || "Payment failed.";
      console.error("StripeCheckout error:", err);
      setMessage(m);
      onError?.(m);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#ffffff",
                "::placeholder": { color: "rgba(255,255,255,0.55)" },
              },
              invalid: { color: "#ff6b6b" },
            },
          }}
        />
      </div>

      {message ? (
        <Alert className="border-red-500/30 bg-red-500/10 text-white">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}

      <Button type="submit" disabled={!stripe || isProcessing} className="w-full">
        {isProcessing ? "Processing..." : `Pay $${Number(amount).toFixed(2)}`}
      </Button>
    </form>
  );
}

export default function StripeCheckout(props: Props) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <CreditCard className="w-5 h-5" />
          Secure Payment
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* IMPORTANT: No "mode: payment" options here — avoids currency/amount integration error */}
        <Elements stripe={stripePromise}>
          <CheckoutForm {...props} />
        </Elements>

        <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700">
          <h4 className="text-sm font-medium text-blue-400 mb-2">Test Card Numbers:</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <div>• 4242 4242 4242 4242 (Visa - Success)</div>
            <div>• 4000 0000 0000 0002 (Declined)</div>
            <div>• Use any future date for expiry</div>
            <div>• Use any 3-digit CVC</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
