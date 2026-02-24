import React, { useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "../lib/stripe";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { CreditCard, AlertCircle, CheckCircle } from "lucide-react";

interface CheckoutFormProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError("Stripe not ready");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError("Card element not found");
      return;
    }

    setProcessing(true);
    setMessage(null);

    try {
      // NOTE: This assumes you already created a PaymentIntent server-side
      // and returned its client_secret
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret, error } = await res.json();
      if (error || !clientSecret) {
        throw new Error(error || "Missing client secret");
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed");
      }

      if (result.paymentIntent?.status === "succeeded") {
        setSuccess(true);
        onSuccess(result.paymentIntent);
      }
    } catch (err: any) {
      const msg = err.message || "Payment error";
      setMessage(msg);
      onError(msg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 bg-gray-900 rounded border border-gray-700">
        <CardElement
          options={{
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

      {message && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-700 bg-green-900/30 text-green-400">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Payment successful</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={processing || !stripe} className="w-full">
        {processing ? "Processing…" : `Pay $${(amount / 100).toFixed(2)}`}
      </Button>
    </form>
  );
};

export default function StripeCheckout(props: CheckoutFormProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <CreditCard className="w-5 h-5" />
          Secure Payment
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Elements stripe={stripePromise} options={{ mode: "payment" }}>
          <CheckoutForm {...props} />
        </Elements>

        <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700">
          <h4 className="text-sm font-medium text-blue-400 mb-2">Test Card Numbers</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <div>• 4242 4242 4242 4242 (Success)</div>
            <div>• 4000 0000 0000 0002 (Declined)</div>
            <div>• Any future expiry date</div>
            <div>• Any 3-digit CVC</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
