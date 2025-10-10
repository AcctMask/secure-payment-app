import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ExternalLink, Shield, CreditCard, CheckCircle, AlertCircle, Copy } from 'lucide-react';

interface StripeConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (accountId: string) => void;
}

export const StripeConnectionModal: React.FC<StripeConnectionModalProps> = ({
  isOpen,
  onClose,
  onConnect
}) => {
  const [accountId, setAccountId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleConnect = async () => {
    if (!accountId.trim()) return;

    setIsConnecting(true);
    setConnectionStatus('idle');

    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation - in real app this would verify with Stripe API
      if (accountId.startsWith('acct_') || accountId.includes('stripe')) {
        setConnectionStatus('success');
        
        // Generate member account number and create member data
        const memberAccountNumber = `SP-${Date.now().toString().slice(-6)}`;
        const memberData = {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+1 (555) 987-6543',
          memberAccountNumber,
          membershipActive: true
        };

        // Store member data in localStorage
        localStorage.setItem('memberData', JSON.stringify(memberData));
        
        setTimeout(() => {
          onConnect(accountId);
          handleClose();
          // Redirect to home page
          window.location.reload();
        }, 1500);
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionStatus('error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleClose = () => {
    setAccountId('');
    setConnectionStatus('idle');
    onClose();
  };

  const copyExampleId = () => {
    setAccountId('acct_1234567890stripe');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Connect Your Stripe Account
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {connectionStatus === 'success' ? (
            <div className="text-center space-y-3">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <h3 className="text-lg font-semibold text-green-700">Successfully Connected!</h3>
              <p className="text-sm text-gray-600">
                Your Stripe account is now connected to Secure Purchase.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Connect Your Account</h4>
                    <p className="text-sm text-blue-700">
                      Enter your Stripe account ID to authorize secure payments through Secure Purchase.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="accountId" className="text-sm font-medium">
                    Stripe Account ID
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="accountId"
                      placeholder="acct_1234567890..."
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Find this in your Stripe Dashboard under Settings → Account details
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">For demo purposes, use:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyExampleId}
                      className="h-auto p-1 text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <code className="text-xs text-gray-800 font-mono">acct_1234567890stripe</code>
                </div>

                {connectionStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-700">
                        Invalid account ID. Please check and try again.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConnect}
                  disabled={!accountId.trim() || isConnecting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Account'}
                </Button>
              </div>

              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open Stripe Dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};