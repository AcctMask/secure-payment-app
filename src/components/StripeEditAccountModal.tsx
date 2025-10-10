import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { StripeCardSetup } from './StripeCardSetup';
import { supabase } from '@/lib/supabase';
import { X, CreditCard, RefreshCw } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  lastFour: string;
  cardType: string;
  stripePaymentMethodId?: string;
}

interface StripeEditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account;
  onUpdate: (id: string, updates: Partial<Account>) => void;
}

export const StripeEditAccountModal: React.FC<StripeEditAccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onUpdate
}) => {
  const [accountName, setAccountName] = useState(account.name);
  const [isUpdatingStripe, setIsUpdatingStripe] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleCardSuccess = async (paymentMethod: any) => {
    setIsSyncing(true);
    try {
      // Sync with Stripe to get full card details
      const { data, error } = await supabase.functions.invoke('sync-stripe-accounts', {
        body: { 
          accountId: account.id,
          stripePaymentMethodId: paymentMethod.id 
        },
      });

      if (error) throw error;

      const updates = {
        name: accountName,
        lastFour: data.cardDetails.lastFour,
        cardType: data.cardDetails.brand,
        stripePaymentMethodId: paymentMethod.id
      };
      
      onUpdate(account.id, updates);
      setIsUpdatingStripe(false);
      onClose();
    } catch (error) {
      console.error('Stripe sync error:', error);
      // Fallback to local data if sync fails
      const updates = {
        name: accountName,
        lastFour: paymentMethod.card.last4,
        cardType: paymentMethod.card.brand,
        stripePaymentMethodId: paymentMethod.id
      };
      onUpdate(account.id, updates);
      setIsUpdatingStripe(false);
      onClose();
    } finally {
      setIsSyncing(false);
    }
  };
  const handleCardError = (error: string) => {
    console.error('Card setup error:', error);
    setIsUpdatingStripe(false);
  };

  const handleNameUpdate = () => {
    if (accountName.trim() && accountName !== account.name) {
      onUpdate(account.id, { name: accountName.trim() });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Edit Account & Sync with Stripe
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Account Name */}
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Enter account name"
            />
          </div>

          {/* Current Stripe Info */}
          {account.stripePaymentMethodId && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                <RefreshCw className="w-4 h-4" />
                Stripe Connected
              </div>
              <div className="text-sm text-green-600">
                Card: **** **** **** {account.lastFour} ({account.cardType})
              </div>
            </div>
          )}

          {/* Update Stripe Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Payment Method</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUpdatingStripe(!isUpdatingStripe)}
              >
                {account.stripePaymentMethodId ? 'Update Card' : 'Add Card'}
              </Button>
            </div>

            {isUpdatingStripe && (
              <div className="border rounded-lg p-4">
                <StripeCardSetup
                  onSuccess={handleCardSuccess}
                  onError={handleCardError}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleNameUpdate}
              disabled={!accountName.trim() || accountName === account.name}
              className="flex-1"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};