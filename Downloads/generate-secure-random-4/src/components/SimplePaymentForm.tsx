import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface SimplePaymentFormProps {
  plan: any;
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
  onCancel: () => void;
  stripeKey?: string;
}

export const SimplePaymentForm: React.FC<SimplePaymentFormProps> = ({
  plan,
  onSuccess,
  onError,
  onCancel,
  stripeKey
}) => {
  const { setMemberData } = useAppContext();
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleInputChange = (field: string, value: string) => {
    // Format card number with spaces
    if (field === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // For testing, accept test card 4242 4242 4242 4242
      if (formData.cardNumber.replace(/\s/g, '') === '4242424242424242') {
        // Generate member account number
        const memberAccountNumber = 'MEM' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Set member data in context
        const memberData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          memberAccountNumber,
          membershipActive: true
        };
        
        setMemberData(memberData);
        localStorage.setItem('memberData', JSON.stringify(memberData));
        
        onSuccess({
          subscriptionId: 'sub_' + Math.random().toString(36).substr(2, 9),
          plan: plan.name,
          amount: plan.price,
          memberData
        });
      } else {
        onError('Please use test card: 4242 4242 4242 4242');
      }
      setProcessing(false);
    }, 2000);
  };

  const isFormValid = () => {
    return formData.email && 
           formData.cardNumber.replace(/\s/g, '').length === 16 &&
           formData.expMonth && 
           formData.expYear && 
           formData.cvc.length === 3 &&
           formData.firstName &&
           formData.lastName &&
           formData.phone;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!stripeKey && (
        <Alert className="bg-blue-900/20 border-blue-600">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Test Mode - Use these test card details:</strong><br />
            Card: 4242 4242 4242 4242<br />
            Expiry: Any future date (e.g., 12/25)<br />
            CVC: Any 3 digits (e.g., 123)
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="John"
            className="bg-gray-700 border-gray-600"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Doe"
            className="bg-gray-700 border-gray-600"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="your@email.com"
          className="bg-gray-700 border-gray-600"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
          className="bg-gray-700 border-gray-600"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          type="text"
          required
          value={formData.cardNumber}
          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
          placeholder="4242 4242 4242 4242"
          maxLength={19}
          className="bg-gray-700 border-gray-600"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="expMonth">Month</Label>
          <Input
            id="expMonth"
            type="text"
            required
            value={formData.expMonth}
            onChange={(e) => handleInputChange('expMonth', e.target.value)}
            placeholder="MM"
            maxLength={2}
            className="bg-gray-700 border-gray-600"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expYear">Year</Label>
          <Input
            id="expYear"
            type="text"
            required
            value={formData.expYear}
            onChange={(e) => handleInputChange('expYear', e.target.value)}
            placeholder="YY"
            maxLength={2}
            className="bg-gray-700 border-gray-600"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input
            id="cvc"
            type="text"
            required
            value={formData.cvc}
            onChange={(e) => handleInputChange('cvc', e.target.value)}
            placeholder="123"
            maxLength={3}
            className="bg-gray-700 border-gray-600"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1"
          disabled={processing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!isFormValid() || processing}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Subscribe ${plan.price}/mo
            </>
          )}
        </Button>
      </div>
    </form>
  );
};