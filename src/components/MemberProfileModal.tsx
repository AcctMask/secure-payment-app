import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { User, Mail, Phone, CreditCard, Calendar, Edit2, Save, X, CheckCircle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useToast } from '../hooks/use-toast';

interface MemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({ isOpen, onClose }) => {
  const { memberData, setMemberData } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [profileForm, setProfileForm] = useState({
    firstName: memberData?.firstName || '',
    lastName: memberData?.lastName || '',
    email: memberData?.email || '',
    phone: memberData?.phone || ''
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate save delay
    setTimeout(() => {
      if (memberData) {
        const updatedData = {
          ...memberData,
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          email: profileForm.email,
          phone: profileForm.phone
        };
        setMemberData(updatedData);
        localStorage.setItem('memberData', JSON.stringify(updatedData));
        
        toast({
          title: "Profile Updated",
          description: "Your profile information has been successfully updated.",
        });
        setIsEditing(false);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleCancelEdit = () => {
    setProfileForm({
      firstName: memberData?.firstName || '',
      lastName: memberData?.lastName || '',
      email: memberData?.email || '',
      phone: memberData?.phone || ''
    });
    setIsEditing(false);
  };

  if (!memberData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Member Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Membership Status */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Premium Member
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Account: {memberData.memberAccountNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Profile Information</h3>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{memberData.firstName}</p>
                      <p className="text-sm text-gray-500">First Name</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{memberData.lastName}</p>
                      <p className="text-sm text-gray-500">Last Name</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium">{memberData.email}</p>
                    <p className="text-sm text-gray-500">Email Address</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium">{memberData.phone}</p>
                    <p className="text-sm text-gray-500">Phone Number</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium">{memberData.memberAccountNumber}</p>
                    <p className="text-sm text-gray-500">Member Account Number</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Membership Benefits */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Premium Benefits</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Unlimited secure code generation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Multiple account management</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Cloud synchronization</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Priority customer support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Advanced security features</span>
              </li>
            </ul>
          </div>

          {/* Close Button */}
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};