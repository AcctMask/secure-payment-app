import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, Crown, Shield, Star, Zap, Users, Clock, CheckIcon, CreditCard, XCircle } from 'lucide-react';
import { StripePaymentForm } from './StripePaymentForm';
import { StripeConfigAlert } from './StripeConfigAlert';
import { isStripeConfigured } from '../lib/stripe';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'pro' | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const plans = [
    {
      id: 'premium' as const,
      name: 'Premium',
      price: 29.99,
      period: 'month',
      icon: Crown,
      color: 'from-purple-600 to-blue-600',
      popular: true,
      features: [
        'Unlimited secure purchases',
        'Advanced account protection',
        'Priority customer support',
        'Real-time transaction monitoring',
        'Custom security codes',
        'Mobile app access'
      ]
    },
    {
      id: 'pro' as const,
      name: 'Professional',
      price: 49.99,
      period: 'month',
      icon: Zap,
      color: 'from-orange-600 to-red-600',
      popular: false,
      features: [
        'Everything in Premium',
        'Business account management',
        'Team collaboration tools',
        'Advanced analytics dashboard',
        'API access for integrations',
        'White-label solutions',
        'Dedicated account manager'
      ]
    }
  ];

  const handleSelectPlan = (planId: 'premium' | 'pro') => {
    setSelectedPlan(planId);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    const plan = plans.find(p => p.id === selectedPlan);
    setPaymentResult({
      success: true,
      plan: plan?.name,
      amount: plan?.price,
      transactionId: paymentIntent.id
    });
    setShowPaymentForm(false);
  };

  const handlePaymentError = (error: string) => {
    setPaymentResult({
      success: false,
      error: error
    });
    setShowPaymentForm(false);
  };

  const resetModal = () => {
    setSelectedPlan(null);
    setShowPaymentForm(false);
    setPaymentResult(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Payment Form View
  if (showPaymentForm && selectedPlan) {
    const plan = plans.find(p => p.id === selectedPlan)!;
    const IconComponent = plan.icon;

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconComponent className="w-5 h-5 text-blue-400" />
              Complete {plan.name} Membership
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Card className={`bg-gradient-to-br ${plan.color} text-white border-0`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5" />
                    <span className="font-semibold">{plan.name} Plan</span>
                  </div>
                  {plan.popular && (
                    <Badge className="bg-yellow-500 text-yellow-900">Popular</Badge>
                  )}
                </div>
                <div className="text-2xl font-bold">${plan.price}</div>
                <div className="text-sm opacity-80">per {plan.period}</div>
              </CardContent>
            </Card>

            <StripePaymentForm
              amount={plan.price}
              description={`${plan.name} Membership - $${plan.price}/${plan.period}`}
              metadata={{
                plan: plan.id,
                planName: plan.name,
                type: 'membership'
              }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={() => setShowPaymentForm(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Success/Error Result View
  if (paymentResult) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-center">
              {paymentResult.success ? 'Welcome to Premium!' : 'Payment Failed'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-center">
            {paymentResult.success ? (
              <>
                <CheckCircle className="w-16 h-16 mx-auto text-green-400" />
                <h3 className="text-xl font-bold text-green-400">Membership Activated!</h3>
                <div className="bg-gray-700 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span>{paymentResult.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>${paymentResult.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono text-xs">{paymentResult.transactionId}</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Your premium features are now active. Enjoy unlimited secure purchases!
                </p>
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
              {paymentResult.success ? 'Continue' : 'Try Again'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Plan Selection View
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crown className="w-6 h-6 text-yellow-400" />
            Choose Your Membership Plan
          </DialogTitle>
        </DialogHeader>
        
        <StripeConfigAlert />
        
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card key={plan.id} className="bg-gray-700 border-gray-600 relative">
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-500 text-yellow-900 px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-white">
                    ${plan.price}
                    <span className="text-lg font-normal text-gray-400">/{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={false}
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity`}
                    title={`Choose ${plan.name} plan`}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Choose {plan.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Secure Payment</span>
          </div>
          <p className="text-xs text-gray-300">
            All payments are processed securely through Stripe. Cancel anytime. No hidden fees.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};