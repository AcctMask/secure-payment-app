import React, { useState } from 'react';
import { StripeCardSetup } from './StripeCardSetup';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (accountData: { name: string; lastFour: string; cardType: string; stripePaymentMethodId: string }) => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [accountName, setAccountName] = useState('');
  const [step, setStep] = useState<'name' | 'card'>('name');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accountName.trim()) {
      setStep('card');
    }
  };

  const handleCardSuccess = async (paymentMethod: any) => {
    setIsLoading(true);
    setError('');

    try {
      // Validate payment method has required card data
      if (!paymentMethod?.card?.last4 || !paymentMethod?.card?.brand) {
        throw new Error('Invalid payment method - missing card data');
      }

      // Create account data with required fields
      const accountData = {
        name: accountName.trim(),
        lastFour: paymentMethod.card.last4,
        cardType: paymentMethod.card.brand,
        stripePaymentMethodId: paymentMethod.id
      };

      // Add to local state (no Supabase for now)
      onAdd(accountData);
      
      // Reset and close
      setAccountName('');
      setStep('name');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save payment method');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardError = (error: string) => {
    setError(error);
  };

  const handleBack = () => {
    setStep('name');
    setError('');
  };

  const handleCancel = () => {
    setAccountName('');
    setStep('name');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-white mb-4">
          {step === 'name' ? 'Add New Account' : 'Add Payment Card'}
        </h2>

        {error && (
          <div className="bg-red-900/20 border border-red-600 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {step === 'name' ? (
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Enter account name"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Next
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">Account: {accountName}</p>
              <p className="text-gray-400 text-xs">Enter your card details to enable payments</p>
            </div>
            
            <StripeCardSetup
              onSuccess={handleCardSuccess}
              onError={handleCardError}
            />

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
              <h4 className="text-xs font-medium text-blue-400 mb-1">Test Cards:</h4>
              <div className="text-xs text-gray-300">
                <div>• 4242 4242 4242 4242 (Visa)</div>
                <div>• Use any future date & CVC</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};