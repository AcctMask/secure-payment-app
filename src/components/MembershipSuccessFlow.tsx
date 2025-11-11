import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle, CreditCard, Shield, Sparkles } from 'lucide-react';
import { StripeAccountSetupModal } from './StripeAccountSetupModal';
import { useAppContext } from '../contexts/AppContext';

interface MembershipSuccessFlowProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId?: string;
  membershipType?: string;
}

export const MembershipSuccessFlow: React.FC<MembershipSuccessFlowProps> = ({
  isOpen,
  onClose,
  sessionId,
  membershipType
}) => {
  const [step, setStep] = useState<'success' | 'stripe-setup' | 'complete'>('success');
  const { setMemberData } = useAppContext();

  const handleContinueToStripeSetup = () => {
    setStep('stripe-setup');
  };

  const handleStripeSetupComplete = () => {
    setStep('complete');
    // Store member data
    const memberData = {
      membershipActive: true,
      membershipType: membershipType || 'Premium',
      sessionId,
      joinedAt: new Date().toISOString()
    };
    setMemberData(memberData);
    localStorage.setItem('memberData', JSON.stringify(memberData));
  };

  if (step === 'stripe-setup') {
    return (
      <StripeAccountSetupModal 
        isOpen={isOpen} 
        onClose={handleStripeSetupComplete} 
      />
    );
  }

  if (step === 'complete') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-gray-800 text-white">
          <div className="text-center space-y-4 py-6">
            <Sparkles className="w-16 h-16 mx-auto text-yellow-400" />
            <h3 className="text-2xl font-bold">You're All Set!</h3>
            <p className="text-gray-300">Your account is ready. You can now generate virtual cards for secure purchases.</p>
            <Button onClick={onClose} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
              Start Using Virtual Cards
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 text-white">
        <div className="text-center space-y-6 py-6">
          <CheckCircle className="w-20 h-20 mx-auto text-green-400" />
          <div>
            <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
            <p className="text-gray-300">Your {membershipType} membership is now active.</p>
          </div>
          
          <div className="bg-blue-900/30 p-4 rounded-lg space-y-3">
            <h4 className="font-semibold flex items-center gap-2 justify-center">
              <Shield className="w-5 h-5" />
              Next Steps
            </h4>
            <ol className="text-sm text-left space-y-2 text-gray-300">
              <li>1. Create your Stripe Connect account</li>
              <li>2. Add your payment method securely</li>
              <li>3. Get your first virtual card issued</li>
            </ol>
          </div>

          <Button 
            onClick={handleContinueToStripeSetup}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Continue to Account Setup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
