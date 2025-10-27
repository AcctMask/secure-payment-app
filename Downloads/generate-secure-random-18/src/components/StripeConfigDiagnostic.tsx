import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, AlertCircle, Copy, ExternalLink, PlayCircle } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../lib/supabase';
import { isDemoMode } from '../lib/demoMode';

export const StripeConfigDiagnostic: React.FC = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const demoMode = isDemoMode();

  const config = {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    premiumPriceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
    proPriceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
  };

  const checks = [
    {
      name: 'Stripe Publishable Key',
      value: config.publishableKey,
      valid: config.publishableKey && config.publishableKey.startsWith('pk_live_'),
      required: true
    },
    {
      name: 'Premium Price ID',
      value: config.premiumPriceId,
      valid: config.premiumPriceId && config.premiumPriceId.startsWith('price_'),
      required: true
    },
    {
      name: 'Pro Price ID',
      value: config.proPriceId,
      valid: config.proPriceId && config.proPriceId.startsWith('price_'),
      required: true
    },
    {
      name: 'Supabase URL',
      value: config.supabaseUrl,
      valid: config.supabaseUrl && config.supabaseUrl.includes('supabase.co'),
      required: true
    },
    {
      name: 'Supabase Anon Key',
      value: config.supabaseAnonKey,
      valid: config.supabaseAnonKey && config.supabaseAnonKey.length > 20,
      required: true
    }
  ];


  const testCheckout = async () => {
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          priceId: config.premiumPriceId,
          email: 'test@example.com',
          membershipType: 'premium'
        }
      });
      
      setTestResult({ success: !error, data, error: error?.message });
    } catch (err: any) {
      setTestResult({ success: false, error: err.message });
    }
    setTesting(false);
  };

  const allValid = checks.filter(c => c.required).every(c => c.valid);

  return (
    <Card className="bg-gray-800 border-gray-700">

      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          {allValid ? <CheckCircle className="text-green-400" /> : <XCircle className="text-red-400" />}
          Stripe & Supabase Configuration Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">


        {checks.map((check, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
            {check.valid ? (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            ) : demoMode ? (
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white">{check.name}</div>
              <div className="text-sm text-gray-400 font-mono break-all">
                {check.value ? check.value.substring(0, 30) + '...' : demoMode ? 'Using demo values' : 'Not set'}
              </div>
            </div>
          </div>
        ))}

        {!demoMode && !allValid && (
          <Alert className="bg-yellow-900/20 border-yellow-600">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Setup Required:</strong> Add these to your .env file:
              <ul className="mt-2 space-y-1 list-disc list-inside">
                {!checks[0].valid && <li>VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...</li>}
                {!checks[1].valid && <li>VITE_STRIPE_PREMIUM_PRICE_ID=price_...</li>}
                {!checks[2].valid && <li>VITE_STRIPE_PRO_PRICE_ID=price_...</li>}
              </ul>
              <div className="mt-3">
                <a 
                  href="https://dashboard.stripe.com/apikeys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  Get Stripe Keys <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {!demoMode && allValid && (
          <Button onClick={testCheckout} disabled={testing} className="w-full">
            {testing ? 'Testing...' : 'Test Checkout Session'}
          </Button>
        )}

        {testResult && (
          <Alert className={testResult.success ? 'bg-green-900/20 border-green-600' : 'bg-red-900/20 border-red-600'}>
            <AlertDescription>
              {testResult.success ? '✅ Checkout session created successfully!' : `❌ Error: ${testResult.error}`}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};