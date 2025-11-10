import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise, isStripeConfigured, TEST_CARDS } from '../lib/stripe';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { CreditCard, CheckCircle, AlertCircle, Loader2, Info } from 'lucide-react';

interface CardSetupFormProps {
  onSuccess: (paymentMethod: any) => void;
  onError: (error: string) => void;
}

const CardSetupForm: React.FC<CardSetupFormProps> = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe is not properly initialized. Please check your configuration.');
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
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error('Stripe error:', error);
        onError(error.message || 'Card setup failed');
        setMessage(error.message || 'Card setup failed');
        setIsProcessing(false);
        return;
      }

      if (paymentMethod) {
        setMessage('Card added successfully!');
        onSuccess(paymentMethod);
      }
      setIsProcessing(false);
    } catch (err: any) {
      console.error('Card setup error:', err);
      onError(err.message || 'An unexpected error occurred');
      setIsProcessing(false);
    }
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
    hidePostalCode: false,
  };

  return (
    <div className="space-y-4">
      <Alert className="border-blue-600 bg-blue-900/20">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-white">
          Use test card: {TEST_CARDS.VISA} with any future expiry date and CVC
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
          <CardElement options={cardElementOptions} />
        </div>
        
        {message && (
          <Alert className={message.includes('successfully') ? 'border-green-600 bg-green-900/20' : 'border-red-600 bg-red-900/20'}>
            {message.includes('successfully') ? (
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
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Add Card
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

// Configuration error component
const StripeConfigError: React.FC = () => (
  <Alert className="border-red-600 bg-red-900/20">
    <AlertCircle className="h-4 w-4 text-red-400" />
    <AlertDescription className="text-white">
      Stripe is not configured. Please add your VITE_STRIPE_PUBLISHABLE_KEY to .env.local
      <br />
      <span className="text-sm text-gray-400 mt-2 block">
        Get your key from: https://dashboard.stripe.com/test/apikeys
      </span>
    </AlertDescription>
  </Alert>
);

interface StripeCardSetupProps {
  onSuccess: (paymentMethod: any) => void;
  onError: (error: string) => void;
}

export const StripeCardSetup: React.FC<StripeCardSetupProps> = ({ onSuccess, onError }) => {
  // Check if Stripe is properly configured
  if (!isStripeConfigured) {
    return <StripeConfigError />;
  }

  // Production mode with real Stripe
  return (
    <Elements stripe={stripePromise}>
      <CardSetupForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};