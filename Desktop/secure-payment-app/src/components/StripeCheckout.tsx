import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CheckoutFormProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage('');

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment intent on backend
      const { data, error: functionError } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount,
          currency: 'usd',
          metadata: {
            type: 'membership',
            amount: amount.toString()
          }
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      const { clientSecret } = data;

      // Confirm payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (confirmError) {
        onError(confirmError.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        setMessage('Payment successful!');
        onSuccess(paymentIntent);
      } else {
        onError('Payment was not successful');
      }
    } catch (err: any) {
      onError(err.message || 'Payment processing failed');
    }

    setIsProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': {
          color: '#9ca3af',
        },
        backgroundColor: 'transparent',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
        <CardElement options={cardElementOptions} />
      </div>
      
      {message && (
        <Alert className={message.includes('successful') ? 'border-green-600 bg-green-900/20' : 'border-red-600 bg-red-900/20'}>
          {message.includes('successful') ? (
            <CheckCircle className="h-4 w-4 text-green-400" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-400" />
          )}
          <AlertDescription className="text-white">{message}</AlertDescription>
        </Alert>
      )}

      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
};

interface StripeCheckoutProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({ amount, onSuccess, onError }) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <CreditCard className="w-5 h-5" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise}>
          <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
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
};