import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { CreditCard, Shield, CheckCircle, XCircle, Loader2, Copy, Check } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../lib/supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface Account {
  id: string;
  name: string;
  lastFour: string;
  code: string;
  virtualCardId?: string;
}

interface SecurePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account;
  generatedCode: string;
}

const VirtualCardPaymentForm: React.FC<{
  account: Account;
  code: string;
  amount: number;
  merchant: string;
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}> = ({ account, code, amount, merchant, onSuccess, onError, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      // Process payment through virtual card
      const { data, error } = await supabase.functions.invoke('process-virtual-payment', {
        body: {
          virtualCardId: account.virtualCardId,
          amount: Math.round(amount * 100), // Convert to cents
          merchant,
          code
        }
      });

      if (error) throw error;

      onSuccess({
        transactionId: data.transactionId,
        amount,
        merchant,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      onError(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="bg-gray-700 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm text-gray-300 mb-2">Processing payment via virtual card</div>
          <div className="text-2xl font-bold">${amount.toFixed(2)}</div>
          <div className="text-sm text-gray-400">to {merchant}</div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1"
          disabled={processing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 bg-gradient-to-r from-green-600 to-blue-600"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Confirm Payment
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export const EnhancedSecurePurchaseModal: React.FC<SecurePurchaseModalProps> = ({
  isOpen,
  onClose,
  account,
  generatedCode
}) => {
  const [amount, setAmount] = useState('29.99');
  const [merchantName, setMerchantName] = useState('');
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [creatingCard, setCreatingCard] = useState(false);

  useEffect(() => {
    if (!account.virtualCardId && isOpen) {
      createVirtualCard();
    }
  }, [account, isOpen]);

  const createVirtualCard = async () => {
    setCreatingCard(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-virtual-card', {
        body: {
          accountName: account.name,
          accountType: 'standard',
          userId: 'user_' + account.id
        }
      });

      if (error) throw error;
      
      // Update account with virtual card ID
      account.virtualCardId = data.cardId;
    } catch (err) {
      console.error('Failed to create virtual card:', err);
    } finally {
      setCreatingCard(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayment = () => {
    if (!account.virtualCardId) {
      createVirtualCard();
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (result: any) => {
    setPaymentResult({ success: true, ...result });
    setShowPaymentForm(false);
  };

  const handlePaymentError = (error: string) => {
    setPaymentResult({ success: false, error });
    setShowPaymentForm(false);
  };

  const handleClose = () => {
    setPaymentResult(null);
    setAmount('29.99');
    setMerchantName('');
    setShowPaymentForm(false);
    onClose();
  };

  if (showPaymentForm) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Confirm Virtual Card Payment</DialogTitle>
          </DialogHeader>
          <Elements stripe={stripePromise}>
            <VirtualCardPaymentForm
              account={account}
              code={generatedCode}
              amount={parseFloat(amount)}
              merchant={merchantName}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={() => setShowPaymentForm(false)}
            />
          </Elements>
        </DialogContent>
      </Dialog>
    );
  }

  if (paymentResult) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
          <div className="text-center space-y-4">
            {paymentResult.success ? (
              <>
                <CheckCircle className="w-16 h-16 mx-auto text-green-400" />
                <h3 className="text-xl font-bold">Payment Successful!</h3>
                <div className="bg-gray-700 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>${paymentResult.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Merchant:</span>
                    <span>{paymentResult.merchant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono text-xs">{paymentResult.transactionId}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 mx-auto text-red-400" />
                <h3 className="text-xl font-bold">Payment Failed</h3>
                <p>{paymentResult.error}</p>
              </>
            )}
            <Button onClick={handleClose} className="w-full">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Secure Virtual Card Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-green-600 to-blue-700 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5" />
                <span className="font-semibold">Virtual Card Active</span>
              </div>
              <div className="text-sm opacity-80 mb-3">
                {account.name} ending in {account.lastFour}
              </div>
              <div className="bg-black/20 rounded p-3">
                <div className="text-xs text-green-200 mb-2">Payment Token (Use at any merchant):</div>
                <div className="flex items-center gap-2">
                  <div className="font-mono text-lg font-bold tracking-wider flex-1">
                    {generatedCode}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyCode}
                    className="text-white hover:bg-white/20"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
            <p className="text-sm text-blue-300">
              This code can be pasted into any merchant's payment field to process a secure transaction through your virtual card.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="amount">Test Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="merchant">Test Merchant</Label>
              <Input
                id="merchant"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                placeholder="Enter merchant name"
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handlePayment}
              disabled={!amount || !merchantName || creatingCard}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600"
            >
              {creatingCard ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Card...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Test Payment
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-gray-600"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};