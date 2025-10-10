import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CreditCard, User, Mail, Phone } from 'lucide-react';

interface MembershipFormProps {
  onSubmit: (data: any) => void;
  isProcessing: boolean;
}

export const MembershipForm: React.FC<MembershipFormProps> = ({
  onSubmit,
  isProcessing
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name *
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="John"
            disabled={isProcessing}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name *
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Doe"
            disabled={isProcessing}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address *
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
            className="pl-10"
            disabled={isProcessing}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone" className="text-sm font-medium">
          Phone Number
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
            className="pl-10"
            disabled={isProcessing}
          />
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Secure Payment</span>
        </div>
        <p className="text-xs text-blue-700">
          You'll be redirected to Stripe for secure card storage and payment processing.
        </p>
      </div>

      <Button 
        type="submit"
        disabled={!isFormValid || isProcessing}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
      >
        {isProcessing ? (
          'Processing...'
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Continue to Secure Payment
          </>
        )}
      </Button>
    </form>
  );
};