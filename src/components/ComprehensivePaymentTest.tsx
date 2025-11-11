import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CreditCard, DollarSign, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise, isLiveMode } from '../lib/stripe';
import { supabase } from '../lib/supabase';


interface Transaction {
  id: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  timestamp: Date;
  paymentIntentId?: string;
}

export const ComprehensivePaymentTest: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const testAmounts = [1, 5, 10, 25, 50, 100];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: selectedAmount || 0,
      status: 'success',
      timestamp: new Date(),
      paymentIntentId
    };
    setTransactions([newTransaction, ...transactions]);
    setShowPaymentForm(false);
    setSelectedAmount(null);
  };

  const handlePaymentError = () => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: selectedAmount || 0,
      status: 'failed',
      timestamp: new Date()
    };
    setTransactions([newTransaction, ...transactions]);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-500">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Comprehensive Payment Testing
          </h2>
          <Badge className={isLiveMode ? 'bg-green-600' : 'bg-yellow-600'}>
            {isLiveMode ? 'LIVE MODE' : 'TEST MODE'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {testAmounts.map(amount => (
            <Button
              key={amount}
              onClick={() => handleAmountSelect(amount)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
            >
              <DollarSign className="w-4 h-4 mr-1" />
              {amount}
            </Button>
          ))}
        </div>

        {showPaymentForm && selectedAmount && (
          <Card className="p-4 bg-gray-800 border-gray-700">
            <p className="text-white text-center">Payment form for ${selectedAmount} - Component under development</p>
            <Button 
              onClick={() => {
                setShowPaymentForm(false);
                setSelectedAmount(null);
              }}
              className="w-full mt-4"
            >
              Cancel
            </Button>
          </Card>
        )}

      </Card>

      {transactions.length > 0 && (
        <Card className="p-6 bg-gray-800 border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Transaction History
          </h3>
          <div className="space-y-2">
            {transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {tx.status === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                  {tx.status === 'failed' && <XCircle className="w-5 h-5 text-red-400" />}
                  <div>
                    <div className="text-white font-semibold">${tx.amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-400">{tx.timestamp.toLocaleString()}</div>
                  </div>
                </div>
                <Badge className={tx.status === 'success' ? 'bg-green-600' : 'bg-red-600'}>
                  {tx.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
