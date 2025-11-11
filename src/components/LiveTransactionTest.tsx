import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const LiveTransactionTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
  const isLiveMode = stripeKey.startsWith('pk_live_');
  
  // Check if Supabase URL and anon key match
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  const getProjectIdFromUrl = (url: string) => {
    const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
    return match ? match[1] : null;
  };
  
  const getProjectIdFromKey = (key: string) => {
    try {
      const payload = JSON.parse(atob(key.split('.')[1]));
      return payload.ref || null;
    } catch {
      return null;
    }
  };
  
  const urlProjectId = getProjectIdFromUrl(supabaseUrl);
  const keyProjectId = getProjectIdFromKey(supabaseAnonKey);
  const credentialsMismatch = urlProjectId && keyProjectId && urlProjectId !== keyProjectId;

  const testTransaction = async () => {
    setTesting(true);
    setError('');
    setResult(null);

    try {
      // Test with a $1 charge - send amount in dollars, not cents
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ amount: 1 }) // Send $1 (function converts to cents)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.clientSecret) {
        setResult({
          success: true,
          mode: isLiveMode ? 'LIVE' : 'TEST',
          amount: '$1.00',
          clientSecret: data.clientSecret
        });
      } else {
        throw new Error(data.error || 'No client secret returned');
      }
    } catch (err: any) {
      console.error('Transaction test error:', err);
      setError(err.message || 'Transaction test failed');
    } finally {
      setTesting(false);
    }
  };


  return (
    <Card className="p-6 bg-gradient-to-br from-blue-900 to-purple-900 border-blue-500">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Live Transaction Test
          </h2>
          <Badge className={isLiveMode ? 'bg-green-600' : 'bg-yellow-600'}>
            {isLiveMode ? 'LIVE MODE' : 'TEST MODE'}
          </Badge>
        </div>

        {credentialsMismatch && (
          <div className="bg-red-900/50 border-2 border-red-500 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-red-400">
              <XCircle className="w-5 h-5" />
              <span className="font-bold">Configuration Error</span>
            </div>
            <div className="text-sm text-white space-y-2">
              <p>Your Supabase URL and Anon Key don't match!</p>
              <div className="bg-black/30 p-2 rounded text-xs font-mono">
                <div>URL Project: <span className="text-yellow-400">{urlProjectId}</span></div>
                <div>Key Project: <span className="text-red-400">{keyProjectId}</span></div>
              </div>
              <p className="text-xs text-white/70">
                Please update your .env.local file with the correct VITE_SUPABASE_ANON_KEY for project "{urlProjectId}".
                You can find this in your Supabase project settings.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white/10 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Stripe Key:</span>
            <span className="text-white font-mono text-xs">{stripeKey.substring(0, 20)}...</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Mode:</span>
            <span className={`font-bold ${isLiveMode ? 'text-green-400' : 'text-yellow-400'}`}>
              {isLiveMode ? 'LIVE PAYMENTS' : 'TEST PAYMENTS'}
            </span>
          </div>
        </div>


        {!result && !error && (
          <Button 
            onClick={testTransaction}
            disabled={testing}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {testing ? 'Testing...' : 'Test $1 Transaction'}
          </Button>
        )}

        {result && (
          <div className="bg-green-900/30 border border-green-500 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold">Transaction Capability Confirmed</span>
            </div>
            <div className="text-sm text-white space-y-1">
              <div>Mode: <span className="font-bold">{result.mode}</span></div>
              <div>Amount: <span className="font-bold">{result.amount}</span></div>
              <div className="text-xs text-white/70">Client Secret: {result.clientSecret.substring(0, 30)}...</div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-400">
              <XCircle className="w-5 h-5" />
              <span className="font-bold">Test Failed</span>
            </div>
            <p className="text-sm text-white mt-2">{error}</p>
          </div>
        )}

        <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3">
          <div className="flex items-start gap-2 text-blue-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">About This Test:</p>
              <p className="text-white/70 text-xs">
                This test creates a payment intent to verify your Stripe configuration is working. 
                {isLiveMode ? ' You are in LIVE mode - real transactions are enabled.' : ' You are in TEST mode - use test cards only.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
