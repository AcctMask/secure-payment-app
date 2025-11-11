import React, { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise, isStripeConfigured } from '../lib/stripe';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CreditCard, CheckCircle, AlertCircle, Shield, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Check if we're in test mode
const isTestMode = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_');

interface PaymentFormProps {
  amount: number;
  description: string;
  metadata?: Record<string, string>;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
}


const PaymentForm: React.FC<PaymentFormProps> = ({ 
  amount, 
  description, 
  metadata = {}, 
  onSuccess, 
  onError, 
  onCancel 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    // Check if Stripe is configured before creating payment intent
    if (!stripe) {
      onError('Stripe is not configured. Please check your environment variables.');
      return;
    }

    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: {
            amount,
            currency: 'usd',
            metadata: {
              ...metadata,
              description,
              timestamp: new Date().toISOString()
            }
          }
        });

        if (error) {
          console.error('Supabase function error:', error);
          throw new Error(error.message || 'Failed to create payment intent');
        }

        if (!data || !data.clientSecret) {
          throw new Error('Invalid response from payment service');
        }

        setClientSecret(data.clientSecret);
      } catch (err: any) {
        console.error('Payment intent creation failed:', err);
        onError(err.message || 'Failed to initialize payment');
      }
    };

    if (amount > 0 && stripe) {
      createPaymentIntent();
    }
  }, [amount, description, metadata, stripe]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setMessage('');

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      onError('Card element not found');
      return;
    }

    try {
      // Confirm payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer', // You can collect this from a form field
          },
        }
      });

      if (confirmError) {
        // Handle specific error types
        let errorMessage = confirmError.message || 'Payment failed';
        
        switch (confirmError.code) {
          case 'card_declined':
            errorMessage = 'Your card was declined. Please try a different payment method.';
            break;
          case 'insufficient_funds':
            errorMessage = 'Insufficient funds. Please try a different card.';
            break;
          case 'expired_card':
            errorMessage = 'Your card has expired. Please use a different card.';
            break;
          case 'incorrect_cvc':
            errorMessage = 'Your card\'s security code is incorrect.';
            break;
          case 'processing_error':
            errorMessage = 'An error occurred while processing your card. Please try again.';
            break;
          case 'incorrect_number':
            errorMessage = 'Your card number is incorrect.';
            break;
        }
        
        onError(errorMessage);
      } else if (paymentIntent?.status === 'succeeded') {
        setMessage('Payment successful!');
        onSuccess(paymentIntent);
      } else if (paymentIntent?.status === 'requires_action') {
        onError('Payment requires additional authentication');
      } else {
        onError('Payment was not completed successfully');
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
        iconColor: '#9ca3af',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
      complete: {
        color: '#10b981',
        iconColor: '#10b981',
      },
    },
    hidePostalCode: false,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">Card Information</span>
        </div>
        <CardElement options={cardElementOptions} />
      </div>
      
      {message && (
        <Alert className="border-green-600 bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-white">{message}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing || !clientSecret}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Pay ${amount.toFixed(2)}
            </>
          )}
        </Button>
        
        {onCancel && (
          <Button 
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
        )}
      </div>

      {isTestMode && (
        <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700">
          <h4 className="text-sm font-medium text-blue-400 mb-2">Test Card Numbers:</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <div>• <span className="font-mono">4242 4242 4242 4242</span> (Visa - Success)</div>
            <div>• <span className="font-mono">4000 0000 0000 0002</span> (Generic Decline)</div>
            <div>• <span className="font-mono">4000 0000 0000 9995</span> (Insufficient Funds)</div>
            <div>• <span className="font-mono">4000 0000 0000 0069</span> (Expired Card)</div>
            <div className="mt-2 text-gray-400">Use any future date for expiry and any 3-digit CVC</div>
          </div>
        </div>
      )}
    </form>

};

interface StripePaymentFormProps {
  amount: number;
  description: string;
  metadata?: Record<string, string>;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = (props) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Shield className="w-5 h-5 text-blue-400" />
          Secure Payment
        </CardTitle>
        <p className="text-sm text-gray-400">{props.description}</p>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise}>
          <PaymentForm {...props} />
        </Elements>
      </CardContent>
    </Card>
  );
};