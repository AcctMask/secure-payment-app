import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const EdgeFunctionDiagnostic: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testEdgeFunction = async () => {
    setTesting(true);
    setResult(null);
    
    // Demo mode if Supabase not configured
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setResult({ 
          success: true, 
          demo: true,
          message: 'Demo Mode: Edge function simulation successful',
          data: { 
            sessionId: 'demo_session_' + Date.now(),
            url: 'https://checkout.stripe.com/demo'
          }
        });
        setTesting(false);
      }, 1000);
      return;
    }

    try {
      // Get price ID from env or use a test value
      const priceId = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID;
      
      if (!priceId) {
        setResult({ 
          success: false, 
          error: 'Missing Stripe Price ID',
          details: {
            message: 'VITE_STRIPE_PREMIUM_PRICE_ID not set in .env.local',
            instructions: 'Create .env.local from .env.example and add your Stripe price IDs',

            currentEnv: {
              hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
              hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
              hasPremiumPrice: !!import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
              hasProPrice: !!import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
            }
          }
        });
        setTesting(false);
        return;
      }

      console.log('Testing edge function with priceId:', priceId);

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          priceId,
          email: 'test@example.com',
          membershipType: 'premium'
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        setResult({ 
          success: false, 
          error: error.message || 'Edge function error',
          details: {
            errorObject: error,
            context: error.context || {},
            priceIdUsed: priceId,
            timestamp: new Date().toISOString()
          }
        });
      } else if (data?.error) {
        // Edge function returned an error in the data
        setResult({ 
          success: false, 
          error: data.error,
          details: data
        });
      } else {
        setResult({ 
          success: true, 
          data,
          message: 'Edge function executed successfully!'
        });
      }
    } catch (err: any) {
      console.error('Edge function test error:', err);
      setResult({ 
        success: false, 
        error: err.message || 'Unknown error',
        details: {
          name: err.name,
          stack: err.stack,
          fullError: err
        }
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Edge Function Diagnostic</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-400">
            Tests the create-checkout-session edge function
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>Price ID: {import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'Not set'}</div>
            <div>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Not set'}</div>
            <div>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Not set'}</div>
          </div>
        </div>

        <Button 
          onClick={testEdgeFunction} 
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Edge Function'
          )}
        </Button>

        {result && (
          <Alert className={result.success ? 'bg-green-900/20 border-green-600' : 'bg-red-900/20 border-red-600'}>
            {result.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">
                  {result.success ? 'Success!' : 'Error'}
                </p>
                {result.message && (
                  <p className="text-sm">{result.message}</p>
                )}
                {result.error && (
                  <p className="text-sm text-red-400">{result.error}</p>
                )}
                <details className="text-xs">
                  <summary className="cursor-pointer hover:text-white">View Details</summary>
                  <pre className="mt-2 bg-gray-900 p-2 rounded overflow-auto max-h-60">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
