import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { User, Crown, Calendar, CreditCard, Mail, Phone, Shield } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberData: any;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  memberData,
}) => {
  if (!memberData) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="w-6 h-6 text-blue-600" />
            My Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Member Status */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-gray-800">Premium Member</span>
            </div>
            <div className="text-sm text-gray-600">
              Active since {formatDate(memberData.joinedAt)}
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {memberData.firstName} {memberData.lastName}
                  </div>
                  <div className="text-xs text-gray-500">Full Name</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{memberData.email}</div>
                  <div className="text-xs text-gray-500">Email Address</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{memberData.phone}</div>
                  <div className="text-xs text-gray-500">Phone Number</div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Account Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900 font-mono">
                    {memberData.memberAccountNumber}
                  </div>
                  <div className="text-xs text-gray-500">Member Account Number</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    ${memberData.monthlyFee}/month
                  </div>
                  <div className="text-xs text-gray-500">Membership Fee</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(memberData.joinedAt)}
                  </div>
                  <div className="text-xs text-gray-500">Member Since</div>
                </div>
              </div>
            </div>
          </div>

          {/* Membership Benefits */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Your Benefits</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Unlimited secure code generation</li>
              <li>• Priority payment processing</li>
              <li>• Advanced security features</li>
              <li>• 24/7 customer support</li>
            </ul>
          </div>

          <Button 
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Close Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};