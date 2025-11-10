import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { CreditCard, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface VirtualCard {
  number: string;
  cvv: string;
  expiry: string;
  expiresAt: string;
}

interface VirtualCardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  virtualCard: VirtualCard;
  accountName: string;
}

export const VirtualCardPaymentModal: React.FC<VirtualCardPaymentModalProps> = ({
  isOpen,
  onClose,
  virtualCard,
  accountName
}) => {
  const [amount, setAmount] = useState('29.99');
  const [merchantName, setMerchantName] = useState('Amazon Store');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          virtualCardNumber: virtualCard.number,
          amount: parseFloat(amount),
          merchantName: merchantName
        }
      });

      if (error) throw error;
      setPaymentResult(data);
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentResult({ 
        success: false, 
        error: 'Payment processing failed. Please check your Stripe configuration.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setPaymentResult(null);
    setAmount('29.99');
    setMerchantName('Amazon Store');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-400" />
            Use Secure Purchase Card Number for Purchase
          </DialogTitle>
        </DialogHeader>

        {!paymentResult ? (
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5" />
                  <span className="font-semibold">{accountName}</span>
                </div>
                <div className="text-sm opacity-80">
                  Virtual: •••• •••• •••• {virtualCard.number.slice(-4)}
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
                disabled={isProcessing || !amount || !merchantName}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? 'Processing...' : `Pay $${amount}`}
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
                <div className="text-green-400 text-6xl mb-4">
                  <CheckCircle className="w-16 h-16 mx-auto" />
                </div>
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
                    <span>Card Used:</span>
                    <span>{paymentResult.maskedCard}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono text-xs">{paymentResult.transactionId}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-red-400 text-6xl mb-4">
                  <XCircle className="w-16 h-16 mx-auto" />
                </div>
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