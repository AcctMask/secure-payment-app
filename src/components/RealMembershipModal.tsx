import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, Crown, Shield, Zap, CheckIcon, CreditCard, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../lib/supabase';
import { SimplePaymentForm } from './SimplePaymentForm';
import { Alert, AlertDescription } from './ui/alert';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StripeCheckoutButton: React.FC<{
  plan: any;
  onError: (error: string) => void;
}> = ({ plan, onError }) => {
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      onError('Please enter your email address');
      return;
    }

    setProcessing(true);
    try {
      // Use Stripe Price IDs from environment variables
      const priceIds = {
        premium: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
        pro: import.meta.env.VITE_STRIPE_PRO_PRICE_ID
      };

      const priceId = priceIds[plan.id as keyof typeof priceIds];
      
      if (!priceId || priceId.includes('REPLACE_ME') || priceId.includes('1234567890')) {
        throw new Error('Stripe Price IDs not configured. Please add VITE_STRIPE_PREMIUM_PRICE_ID and VITE_STRIPE_PRO_PRICE_ID to your .env file');
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          priceId: priceId,
          email,
          membershipType: plan.id
        }
      });

      if (error) throw error;
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      onError(err.message || 'Failed to start checkout');
      setProcessing(false);
    }
  };



  return (
    <form onSubmit={handleCheckout} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Email Address</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="your@email.com"
        />
      </div>

      <Button
        type="submit"
        disabled={processing}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
      >
        {processing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Redirecting to Stripe...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Subscribe ${plan.price}/mo
          </>
        )}
      </Button>
      
      <p className="text-xs text-gray-400 text-center">
        You'll be redirected to Stripe's secure checkout page
      </p>
    </form>
  );
};


export const RealMembershipModal: React.FC<MembershipModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'pro' | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const plans = [
    {
      id: 'premium',
      name: 'Premium',
      price: 29.99,
      icon: Crown,
      color: 'from-purple-600 to-blue-600',
      popular: true,
      features: [
        'Unlimited secure purchases',
        'Virtual card generation',
        'Real-time transaction monitoring',
        '$5,000 daily spending limit',
        'Priority support',
        'Mobile app access'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 49.99,
      icon: Zap,
      color: 'from-orange-600 to-red-600',
      features: [
        'Everything in Premium',
        'Multiple virtual cards',
        '$10,000 daily spending limit',
        'Team collaboration',
        'API access',
        'Dedicated account manager'
      ]
    }
  ];

  const handleSelectPlan = (planId: 'premium' | 'pro') => {
    setSelectedPlan(planId);
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
    setSelectedPlan(null);
    setShowPaymentForm(false);
    setPaymentResult(null);
    onClose();
  };

  if (showPaymentForm && selectedPlan) {
    const plan = plans.find(p => p.id === selectedPlan)!;
    
    // Use SimplePaymentForm if Stripe is not configured
    if (!stripePromise) {
      return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-lg bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle>Complete {plan.name} Subscription</DialogTitle>
            </DialogHeader>
            <SimplePaymentForm
              plan={plan}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={() => setShowPaymentForm(false)}
              stripeKey={stripeKey}
            />
          </DialogContent>
        </Dialog>
      );
    }

    // Use Stripe Checkout
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Complete {plan.name} Subscription</DialogTitle>
          </DialogHeader>
          
          {!stripeKey && (
            <Alert className="bg-yellow-900/20 border-yellow-600 mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Stripe is not configured. Add VITE_STRIPE_PUBLISHABLE_KEY to your .env file.
              </AlertDescription>
            </Alert>
          )}
          
          <StripeCheckoutButton
            plan={plan}
            onError={handlePaymentError}
          />
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
                <h3 className="text-xl font-bold">Subscription Active!</h3>
                <p>Your {paymentResult.plan} membership is now active.</p>
                <p className="text-sm text-gray-400">Subscription ID: {paymentResult.subscriptionId}</p>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 mx-auto text-red-400" />
                <h3 className="text-xl font-bold">Payment Failed</h3>
                <p>{paymentResult.error}</p>
              </>
            )}
            <Button onClick={handleClose} className="w-full">
              {paymentResult.success ? 'Continue' : 'Try Again'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Choose Your Membership Plan</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card key={plan.id} className="bg-gray-700 border-gray-600 relative">
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-yellow-900">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    ${plan.price}<span className="text-lg font-normal text-gray-400">/month</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckIcon className="w-4 h-4 text-green-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSelectPlan(plan.id as 'premium' | 'pro')}
                    className={`w-full bg-gradient-to-r ${plan.color}`}
                  >
                    Choose {plan.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-900/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">Secure Payment via Stripe</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};