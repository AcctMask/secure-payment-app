import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle2, Circle, AlertCircle, CreditCard, User, ShoppingCart, Activity } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface TestFlowPanelProps {
  onOpenMembership: () => void;
  onOpenPurchase: () => void;
  onOpenProfile: () => void;
}

export const TestFlowPanel: React.FC<TestFlowPanelProps> = ({
  onOpenMembership,
  onOpenPurchase,
  onOpenProfile
}) => {
  const { memberData, issuingCards } = useAppContext();
  
  const hasMember = memberData && memberData.membershipActive;
  const hasCards = issuingCards.length > 0;
  
  const steps = [
    {
      id: 1,
      title: 'Create Member & Pay',
      description: 'Sign up for membership and complete payment',
      completed: hasMember,
      icon: User,
      action: onOpenMembership,
      buttonText: hasMember ? 'View Profile' : 'Start Membership',
      buttonAction: hasMember ? onOpenProfile : onOpenMembership
    },
    {
      id: 2,
      title: 'Virtual Card Issued',
      description: 'Stripe virtual card automatically created',
      completed: hasCards,
      icon: CreditCard,
      action: null,
      buttonText: 'Auto-Generated',
      disabled: !hasMember
    },
    {
      id: 3,
      title: 'Make Test Purchase',
      description: 'Use virtual card for a transaction',
      completed: false,
      icon: ShoppingCart,
      action: onOpenPurchase,
      buttonText: 'Make Purchase',
      disabled: !hasCards
    },
    {
      id: 4,
      title: 'View Webhook Events',
      description: 'Check Stripe webhook logs',
      completed: false,
      icon: Activity,
      action: () => window.open('https://dashboard.stripe.com/test/webhooks', '_blank'),
      buttonText: 'Open Stripe Dashboard'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30 p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">🧪 Test Complete Flow</h3>
        <p className="text-gray-300">Follow these steps to test the full payment and transaction system</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`flex items-start gap-4 p-4 rounded-lg border ${
                step.completed
                  ? 'bg-green-900/20 border-green-500/30'
                  : step.disabled
                  ? 'bg-gray-900/20 border-gray-700/30 opacity-50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex-shrink-0">
                {step.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-5 h-5 text-blue-400" />
                  <h4 className="font-semibold text-white">Step {step.id}: {step.title}</h4>
                </div>
                <p className="text-sm text-gray-400 mb-3">{step.description}</p>
                
                {step.buttonText && (
                  <Button
                    onClick={step.buttonAction || step.action}
                    disabled={step.disabled}
                    size="sm"
                    className={step.completed ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
                  >
                    {step.buttonText}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-200">
            <strong>Testing Mode:</strong> Use test card <code className="bg-black/30 px-2 py-1 rounded">4242 4242 4242 4242</code> with any future date and CVC
          </div>
        </div>
      </div>
    </Card>
  );
};
