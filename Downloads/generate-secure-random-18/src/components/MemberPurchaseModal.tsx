import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { CreditCard, Shield, CheckCircle, XCircle, Loader2, Copy, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../contexts/AppContext';
import { Alert, AlertDescription } from './ui/alert';

interface MemberPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemberPurchaseModal: React.FC<MemberPurchaseModalProps> = ({ isOpen, onClose }) => {
  const { memberData } = useAppContext();
  const [amount, setAmount] = useState('25.00');
  const [merchantName, setMerchantName] = useState('');
  const [description, setDescription] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberData?.currentCode) {
      setResult({ success: false, error: 'No member code available' });
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-member-payment', {
        body: {
          code: memberData.currentCode,
          amount: parseFloat(amount),
          merchantName: merchantName || 'Test Merchant',
          description: description || 'Member purchase'
        }
      });

      if (error) throw error;

      setResult({ success: true, ...data });
    } catch (err: any) {
      setResult({ success: false, error: err.message || 'Payment failed' });
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setAmount('25.00');
    setMerchantName('');
    setDescription('');
    onClose();
  };

  if (!memberData?.membershipActive) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You must be an active member to make purchases.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  if (result) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4">
            {result.success ? (
              <>
                <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                <h3 className="text-xl font-bold">Payment Successful!</h3>
                <Card className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">${result.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Merchant:</span>
                    <span className="font-semibold">{result.merchant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-xs">{result.transactionId}</span>
                  </div>
                </Card>
                {result.newCode && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Your new secure code:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 font-mono font-bold text-lg">{result.newCode}</code>
                      <Button size="sm" variant="outline" onClick={() => copyCode(result.newCode)}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 mx-auto text-red-500" />
                <h3 className="text-xl font-bold">Payment Failed</h3>
                <p className="text-gray-600">{result.error}</p>
              </>
            )}
            <Button onClick={handleClose} className="w-full">
              {result.success ? 'Done' : 'Try Again'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            Make Secure Purchase
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handlePurchase} className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-sm">Your Secure Code</span>
            </div>
            <code className="font-mono font-bold text-lg">{memberData.currentCode}</code>
            <p className="text-xs text-gray-600 mt-2">
              This code will be used for the purchase and automatically rotated
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchant">Merchant Name</Label>
            <Input
              id="merchant"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              placeholder="e.g., Amazon, Best Buy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you buying?"
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={processing} className="flex-1 bg-green-600 hover:bg-green-700">
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ${amount}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
