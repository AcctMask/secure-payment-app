import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CreditCard, ExternalLink, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface StripeHostedCheckoutProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const StripeHostedCheckout: React.FC<StripeHostedCheckoutProps> = ({ 
  amount, 
  onSuccess, 
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleCheckout = async () => {
    setIsLoading(true);
    setError('');

    try {
      const currentUrl = window.location.origin;
      const successUrl = `${currentUrl}?payment=success&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${currentUrl}?payment=cancelled`;

      const { data, error: functionError } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: 'price_test_recurring', // Test price ID
          successUrl,
          cancelUrl
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create checkout session';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <CreditCard className="w-5 h-5" />
          Stripe Hosted Checkout
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
          <h4 className="text-sm font-medium text-blue-400 mb-2">What happens next:</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <div>• You'll be redirected to Stripe's secure checkout</div>
            <div>• Create your Stripe account or sign in</div>
            <div>• Add your payment method</div>
            <div>• Authorize recurring payments (${amount.toFixed(2)}/month)</div>
            <div>• Return to the app to start using it</div>
          </div>
        </div>

        {error && (
          <Alert className="border-red-600 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-white">{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            'Redirecting to Stripe...'
          ) : (
            <>
              Continue to Stripe Checkout
              <ExternalLink className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        <div className="text-xs text-gray-400 text-center">
          Secure payment processing by Stripe
        </div>
      </CardContent>
    </Card>
  );
};