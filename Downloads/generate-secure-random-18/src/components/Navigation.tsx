import React, { useState } from 'react';
import { Button } from './ui/button';
import { RealMembershipModal } from './RealMembershipModal';
import { StripeAccountSetupModal } from './StripeAccountSetupModal';
import { StripeConnectionModal } from './StripeConnectionModal';
import { ProfileModal } from './ProfileModal';
import { MemberPurchaseModal } from './MemberPurchaseModal';
import { StripeConfigDiagnostic } from './StripeConfigDiagnostic';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useAppContext } from '../contexts/AppContext';


export const Navigation: React.FC = () => {
  const { memberData, setMemberData } = useAppContext();
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);



  const handleStripeConnection = (accountId: string) => {
    console.log('Connected Stripe account:', accountId);
  };

  const isPremiumMember = memberData && memberData.membershipActive;

  return (
    <nav className="bg-black/40 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68bd89ae8305b7b3c57e9be2_1759512497165_fe3c963a.webp"
              alt="Secure Card Generator Logo" 
              className="h-10 w-10 object-cover rounded-lg"
            />
            <h1 className="text-2xl font-bold text-white">Secure Card Generator</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isPremiumMember ? (
              // Non-members only see Join Premium button
              <Button
                onClick={() => setShowMembershipModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Join Premium
              </Button>
            ) : (
              // Premium members see member features
              <>
                <Button
                  onClick={() => setShowPurchaseModal(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  Make a Purchase
                </Button>
                <Button
                  onClick={() => setShowProfileModal(true)}
                  variant="outline"
                  className="border-green-400/50 text-green-300 hover:bg-green-400/10"
                >
                  My Profile
                </Button>
                <Button
                  onClick={() => setShowStripeModal(true)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Set Up Stripe
                </Button>
                <Button
                  onClick={() => setShowConnectionModal(true)}
                  variant="outline"
                  className="border-blue-400/50 text-blue-300 hover:bg-blue-400/10"
                >
                  Connect Account
                </Button>
                <Button
                  onClick={() => setShowDiagnostic(true)}
                  variant="outline"
                  className="border-yellow-400/50 text-yellow-300 hover:bg-yellow-400/10"
                >
                  🔍 Check Config
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <RealMembershipModal 
        isOpen={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
      />
      
      <StripeAccountSetupModal 
        isOpen={showStripeModal}
        onClose={() => setShowStripeModal(false)}
      />

      <StripeConnectionModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        onConnect={handleStripeConnection}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        memberData={memberData}
      />

      <MemberPurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />

      <Dialog open={showDiagnostic} onOpenChange={setShowDiagnostic}>
        <DialogContent className="sm:max-w-2xl bg-gray-900 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Stripe Configuration Diagnostic</DialogTitle>
          </DialogHeader>
          <StripeConfigDiagnostic />
        </DialogContent>
      </Dialog>
    </nav>

  );
};
