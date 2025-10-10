import React from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { isStripeConfigured } from '../lib/stripe';

interface StripeConfigAlertProps {
  onClose?: () => void;
}

export const StripeConfigAlert: React.FC<StripeConfigAlertProps> = ({ onClose }) => {
  if (isStripeConfigured) {
    return null;
  }

  return (
    <Alert className="border-yellow-600 bg-yellow-900/20 mb-4">
      <AlertCircle className="h-4 w-4 text-yellow-400" />
      <AlertDescription className="text-white">
        <div className="space-y-3">
          <div>
            <strong>⚠️ Stripe Configuration Required</strong>
            <p className="text-sm text-gray-300 mt-1">
              The Premium and Professional plan buttons are disabled because Stripe is not configured.
            </p>
          </div>
          
          <div className="text-sm text-gray-300 space-y-2">
            <p><strong>Quick Setup (2 minutes):</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Get your Stripe publishable key from the Stripe Dashboard</li>
              <li>Add it to your .env.local file as VITE_STRIPE_PUBLISHABLE_KEY</li>
              <li>Restart your development server</li>
              <li>The plan selection buttons will become enabled</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/30"
              onClick={() => window.open('https://dashboard.stripe.com/apikeys', '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Get Stripe Keys
            </Button>
            {onClose && (
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white"
                onClick={onClose}
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};