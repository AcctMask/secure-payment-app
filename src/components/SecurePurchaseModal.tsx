import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { CreditCard, ShoppingCart, CheckCircle, XCircle, Shield, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';


interface Account {
  id: string;
  name: string;
  lastFour: string;
  code: string;
  stripePaymentMethodId?: string;
}

interface SecurePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account;
  generatedCode: string;
  onCodeRegenerated?: (newCode: string) => void;
}


export const SecurePurchaseModal: React.FC<SecurePurchaseModalProps> = ({
  isOpen,
  onClose,
  account,
  generatedCode,
  onCodeRegenerated
}) => {

  const [amount, setAmount] = useState('29.99');
  const [merchantName, setMerchantName] = useState('Amazon Store');
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [showStripeSetup, setShowStripeSetup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if account has Stripe payment method
  const hasStripePaymentMethod = account.stripePaymentMethodId && account.stripePaymentMethodId !== '';

  const handleStripeAccountSetup = () => {
    window.open('https://dashboard.stripe.com/register', '_blank');
  };

  const handlePayment = async () => {
    // If no Stripe payment method, show setup flow
    if (!hasStripePaymentMethod) {
      setShowStripeSetup(true);
      return;
    }

    // Process payment with code
    setIsProcessing(true);
    try {
      // Check if Supabase is configured
      if (!supabase) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }

      const { data, error } = await supabase.functions.invoke('process-code-payment', {
        body: {
          code: generatedCode,
          amount: parseFloat(amount),
          merchantName,
          paymentMethodId: account.stripePaymentMethodId,
          accountId: account.id
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to send a request to the Edge Function');
      }
      
      if (!data.success) throw new Error(data.error || 'Payment failed');

      // If a new code was generated, notify parent component
      if (data.newCode && onCodeRegenerated) {
        onCodeRegenerated(data.newCode);
      }

      // Success
      setPaymentResult({
        success: true,
        transactionId: data.transactionId,
        amount: parseFloat(amount),
        merchantName,
        timestamp: new Date().toISOString(),
        accountUsed: `${account.name} ending in ${account.lastFour}`,
        secureCodeUsed: generatedCode,
        newCode: data.newCode,
        status: 'completed'
      });
    } catch (err: any) {
      console.error('Payment error:', err);
      setPaymentResult({
        success: false,
        error: err.message || 'Payment processing failed'
      });
    } finally {
      setIsProcessing(false);
    }

  };



  const resetModal = () => {
    setPaymentResult(null);
    setAmount('29.99');
    setMerchantName('Amazon Store');
    setShowStripeSetup(false);
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };


  // Stripe Setup Flow

  if (showStripeSetup) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Set Up Stripe Payment Account
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-300 mb-2">Stripe Account Required</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    To process secure payments, you need to create a Stripe account and authorize membership payments.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-700 rounded-lg p-3">
                <h4 className="font-medium text-white mb-2">Step 1: Create Stripe Account</h4>
                <p className="text-sm text-gray-300 mb-3">
                  Sign up for a free Stripe account to securely store your payment methods.
                </p>
                <Button 
                  onClick={handleStripeAccountSetup}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Create Stripe Account
                </Button>
              </div>

              <div className="bg-gray-700 rounded-lg p-3">
                <h4 className="font-medium text-white mb-2">Step 2: Add Payment Method</h4>
                <p className="text-sm text-gray-300 mb-3">
                  After creating your account, add and verify your payment method in Stripe.
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-3">
                <h4 className="font-medium text-white mb-2">Step 3: Authorize Membership</h4>
                <p className="text-sm text-gray-300">
                  Connect your Stripe account to Secure Purchase for seamless payments.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowStripeSetup(false)}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Back
              </Button>
              <Button
                onClick={handleClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700"
              >
                Close
              </Button>
            </div>
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
            Secure Purchase with Protected Code
          </DialogTitle>
        </DialogHeader>

        {!paymentResult ? (
          <div className="space-y-4">
            {!hasStripePaymentMethod && (
              <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-300">Stripe account setup required</span>
                </div>
              </div>
            )}

            <Card className="bg-gradient-to-br from-green-600 to-blue-700 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Protected Account</span>
                </div>
                <div className="text-sm opacity-80 mb-2">
                  {account.name} ending in {account.lastFour}
                </div>
                <div className="bg-black/20 rounded p-2">
                  <div className="text-xs text-green-200 mb-1">Secure Purchase Code:</div>
                  <div className="font-mono text-lg font-bold tracking-wider">
                    {generatedCode}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div>
                <Label htmlFor="amount" className="text-gray-300">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="merchant" className="text-gray-300">Merchant</Label>
                <Input
                  id="merchant"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handlePayment}
                disabled={!amount || !merchantName || isProcessing}
                className={hasStripePaymentMethod ? "flex-1 bg-green-600 hover:bg-green-700" : "flex-1 bg-blue-600 hover:bg-blue-700"}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : hasStripePaymentMethod ? (
                  `Pay $${amount}`
                ) : (
                  'Set Up Stripe Account'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>

          </div>
        ) : (
          <div className="space-y-4 text-center">
            {paymentResult.success ? (
              <>
                <CheckCircle className="w-16 h-16 mx-auto text-green-400" />
                <h3 className="text-xl font-bold text-green-400">Payment Successful!</h3>
                <div className="bg-gray-700 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>${paymentResult.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Merchant:</span>
                    <span>{paymentResult.merchantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protected Account:</span>
                    <span>{account.name} ending in {account.lastFour}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Secure Code Used:</span>
                    <span className="font-mono">{generatedCode}</span>
                  </div>
                </div>
                {paymentResult.newCode && (
                  <div className="bg-green-900/50 border border-green-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      <span className="font-semibold text-green-300">New Code Generated!</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      Your secure code has been automatically regenerated for enhanced security.
                    </p>
                    <div className="bg-black/30 rounded p-2">
                      <div className="text-xs text-green-200 mb-1">New Secure Code:</div>
                      <div className="font-mono text-lg font-bold tracking-wider text-green-300">
                        {paymentResult.newCode}
                      </div>
                    </div>
                  </div>
                )}
              </>

            ) : (
              <>
                <XCircle className="w-16 h-16 mx-auto text-red-400" />
                <h3 className="text-xl font-bold text-red-400">Payment Failed</h3>
                <p className="text-gray-300">{paymentResult.error}</p>
              </>
            )}
            
            <Button
              onClick={handleClose}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};