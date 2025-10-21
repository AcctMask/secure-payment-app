import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { StripeHostedCheckout } from './StripeHostedCheckout';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CreditCard, DollarSign, CheckCircle, ArrowLeft } from 'lucide-react';

interface PaymentTestModalProps {
  onClose: () => void;
}

export const PaymentTestModal: React.FC<PaymentTestModalProps> = ({ onClose }) => {
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [testAmount] = useState(29.99);

  useEffect(() => {
    // Check URL parameters for payment success/failure
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      setPaymentResult({
        id: sessionId,
        amount: testAmount * 100,
        status: 'succeeded',
        type: 'subscription'
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'cancelled') {
      setError('Payment was cancelled. Please try again.');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [testAmount]);

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setPaymentResult(null);
  };

  const resetTest = () => {
    setPaymentResult(null);
    setError('');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Test Recurring Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!paymentResult && !error && (
            <>
              <div className="text-center">
                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700 mb-4">
                  <h3 className="font-semibold text-blue-400 mb-2">Test Mode Active</h3>
                  <p className="text-sm text-gray-300">
                    This will redirect you to Stripe to set up a test recurring payment.
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl font-bold">${testAmount}/month</span>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    Recurring
                  </Badge>
                </div>
              </div>

              <StripeHostedCheckout
                amount={testAmount}
                onError={handlePaymentError}
              />
            </>
          )}

          {paymentResult && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <div className="bg-green-600 p-3 rounded-full">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-2">Subscription Active!</h3>
                <p className="text-gray-300 mb-4">Your recurring payment has been set up successfully.</p>
                
                <div className="bg-gray-700 p-4 rounded-lg text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Session ID:</span>
                    <span className="text-white font-mono text-sm">{paymentResult.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white">${(paymentResult.amount / 100).toFixed(2)}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <Badge className="bg-green-600">{paymentResult.status}</Badge>
                  </div>
                </div>
              </div>

              <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700">
                Start Using the App
              </Button>
            </div>
          )}

          {error && (
            <div className="text-center space-y-4">
              <div className="bg-red-900/30 p-4 rounded-lg border border-red-700">
                <h3 className="font-semibold text-red-400 mb-2">Payment Issue</h3>
                <p className="text-sm text-gray-300">{error}</p>
              </div>

              <div className="flex gap-3">
                <Button onClick={resetTest} variant="outline" className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={onClose} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};