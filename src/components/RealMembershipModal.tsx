import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, Crown, Shield, Zap, CheckIcon, CreditCard, XCircle, Loader2, AlertCircle, PlayCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../lib/supabase';
import { SimplePaymentForm } from './SimplePaymentForm';
import { Alert, AlertDescription } from './ui/alert';
import { isDemoMode, simulateMembershipPurchase } from '../lib/demoMode';
import { useAppContext } from '../contexts/AppContext';
// Import Stripe configuration
import { stripePromise, isStripeConfigured, isLiveMode } from '../lib/stripe';

// Debug Stripe configuration
console.log('🎯 RealMembershipModal Stripe Status:', {
  isConfigured: isStripeConfigured,
  isLiveMode: isLiveMode,
  hasStripePromise: !!stripePromise,
  premiumPriceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
  proPriceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID
});

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
      const priceIds = {
        premium: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
        pro: import.meta.env.VITE_STRIPE_PRO_PRICE_ID
      };

      const priceId = priceIds[plan.id as keyof typeof priceIds];
      
      if (!priceId || priceId === '' || priceId === 'undefined' || priceId.includes('REPLACE_ME')) {
        throw new Error(`Stripe Price IDs not configured. Please add them to your .env.local file.`);
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
        throw new Error('Supabase is not configured. Please add credentials to your .env.local file.');
      }

      console.log('📞 Calling edge function...');

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          priceId: priceId,
          email,
          membershipType: plan.id
        }
      });

      console.log('📥 Response:', { data, error });

      if (error) {
        console.error('❌ Error:', error);
        if (error.message?.includes('Failed to send')) {
          throw new Error('Cannot connect to payment service. Please check:\n1. Internet connection\n2. Supabase configuration\n3. Edge function deployment');
        }
        throw new Error(`Payment service error: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No response from payment service. Edge function may not be deployed.');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.url) {
        console.log('✅ Redirecting to Stripe...');
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('❌ Checkout error:', err);
      onError(err.message || 'Failed to start checkout');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleCheckout} className="space-y-4">
      <Alert className="bg-green-900/20 border-green-600">
        <CreditCard className="h-4 w-4" />
        <AlertDescription>
          <strong>🔒 LIVE MODE - Real Payment Processing</strong><br />
          You will be redirected to Stripe's secure checkout page to complete your purchase with your personal credit card.
        </AlertDescription>
      </Alert>

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
            Pay ${plan.price}/mo with Stripe
          </>
        )}
      </Button>
      
      <p className="text-xs text-gray-400 text-center">
        🔐 Secure checkout powered by Stripe • Use any credit or debit card
      </p>
    </form>
  );

};



export const RealMembershipModal: React.FC<MembershipModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'pro' | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const { setMemberData } = useAppContext();
  const demoMode = isDemoMode();

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
    
    // Demo Mode - Use simulated checkout
    if (demoMode) {
      return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-lg bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-blue-400" />
                Demo: {plan.name} Subscription
              </DialogTitle>
            </DialogHeader>
            
            <Alert className="bg-blue-900/20 border-blue-600">
              <PlayCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Demo Mode Active:</strong> This is a simulated purchase. No real payment will be processed.
                To enable real payments, configure your Stripe keys in the .env file.
              </AlertDescription>
            </Alert>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const email = (e.target as any).email.value;
              try {
                const result = await simulateMembershipPurchase(plan.id, email);
                if (result.success) {
                  setMemberData(result.memberData);
                  handlePaymentSuccess({
                    plan: plan.name,
                    subscriptionId: `demo_sub_${Date.now()}`,
                    ...result.memberData
                  });
                }
              } catch (err: any) {
                handlePaymentError(err.message || 'Demo purchase failed');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue="demo@example.com"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                Try {plan.name} (Demo)
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      );
    }
    
    // ALWAYS use Stripe Checkout for live payments (no test mode fallback)
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Complete {plan.name} Subscription</DialogTitle>
          </DialogHeader>
          
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