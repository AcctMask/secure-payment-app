import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { ExternalLink, Shield, CreditCard, Lock, CheckCircle, ArrowRight } from 'lucide-react';

interface StripeAccountSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StripeAccountSetupModal: React.FC<StripeAccountSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const handleCreateAccount = () => {
    // Simulate Stripe account creation and redirect to home with member data
    simulateStripeAccountCreation();
  };

  const simulateStripeAccountCreation = () => {
    // Get member data from MembershipModal if it exists
    const existingMemberData = JSON.parse(localStorage.getItem('memberData') || '{}');
    
    // Generate member account number if not exists
    const memberAccountNumber = existingMemberData.memberAccountNumber || `SP-${Date.now().toString().slice(-6)}`;
    
    // Create member data using existing data or defaults
    const memberData = {
      firstName: existingMemberData.firstName || 'John',
      lastName: existingMemberData.lastName || 'Doe',
      email: existingMemberData.email || 'john.doe@example.com',
      phone: existingMemberData.phone || '+1 (555) 123-4567',
      memberAccountNumber,
      membershipActive: true,
      membershipType: existingMemberData.membershipType || 'Premium',
      monthlyFee: existingMemberData.monthlyFee || 3.99,
      joinedAt: existingMemberData.joinedAt || new Date().toISOString()
    };

    // Store member data in localStorage
    localStorage.setItem('memberData', JSON.stringify(memberData));
    
    // Close modal and trigger page refresh to show member info
    onClose();
    window.location.reload();
  };

  const handleLoginToStripe = () => {
    window.open('https://dashboard.stripe.com/login', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-6 h-6 text-blue-600" />
            Set Up Stripe for Secure Payments
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Connect with <strong>Stripe</strong> to securely store your payment methods and authorize membership payments for Secure Purchase
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Step 1: Create Stripe Account</h3>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Sign up for a free Stripe account to get started with secure payment processing.
              </p>
              <Button 
                onClick={handleCreateAccount}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Create Stripe Account
              </Button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Step 2: Add Payment Method</h3>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">2</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                In your Stripe dashboard, add and verify your preferred payment method (credit/debit card).
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4" />
                <span>Bank-level encryption</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Step 3: Authorize Membership</h3>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">3</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Return to Secure Purchase and connect your Stripe account to enable secure payments.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ArrowRight className="w-4 h-4" />
                <span>Complete setup in app</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Lock className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm text-green-800">Bank-Level Security</h4>
                <p className="text-xs text-green-700">Your payment information is encrypted and never stored by our app</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm text-green-800">PCI Compliant</h4>
                <p className="text-xs text-green-700">Industry standard security for payment processing</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleLoginToStripe}
              variant="outline"
              className="flex-1"
            >
              Already have Stripe?
            </Button>
            <Button 
              onClick={handleCreateAccount}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </div>

          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              I'll set this up later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};