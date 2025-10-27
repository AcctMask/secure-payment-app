import { loadStripe } from '@stripe/stripe-js';

// Get Stripe publishable key from environment
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Initialize Stripe with the publishable key
export const stripePromise = stripePublishableKey 
  ? loadStripe(stripePublishableKey)
  : null;

// Check if Stripe is properly configured
export const isStripeConfigured = !!stripePublishableKey && stripePublishableKey.startsWith('pk_');

// Test card numbers for Stripe testing
export const TEST_CARDS = {
  VISA: '4242424242424242',
  VISA_DEBIT: '4000056655665556',
  MASTERCARD: '5555555555554444',
  AMEX: '378282246310005',
  DECLINED: '4000000000000002',
  INSUFFICIENT_FUNDS: '4000000000009995',
  EXPIRED: '4000000000000069'
};

// Helper function to format card number for display
export const formatCardNumber = (cardNumber: string): string => {
  return cardNumber.replace(/(.{4})/g, '$1 ').trim();
};

// Helper function to detect card type
export const detectCardType = (cardNumber: string): string => {
  const number = cardNumber.replace(/\s/g, '');
  
  if (number.startsWith('4')) return 'visa';
  if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
  if (number.startsWith('3')) return 'amex';
  if (number.startsWith('6')) return 'discover';
  
  return 'unknown';
};

// Validate Stripe key format
export const validateStripeKey = (key: string): boolean => {
  return key.startsWith('pk_test_') || key.startsWith('pk_live_');
};

// Log Stripe configuration status
if (stripePublishableKey) {
  if (validateStripeKey(stripePublishableKey)) {
    console.log('✅ Stripe configured with valid key:', stripePublishableKey.substring(0, 20) + '...');
  } else {
    console.error('❌ Invalid Stripe key format. Key should start with pk_test_ or pk_live_');
    console.error('Current key:', stripePublishableKey);
  }
} else {
  console.warn('⚠️ No Stripe publishable key found. Add VITE_STRIPE_PUBLISHABLE_KEY to .env.local');
  console.warn('💡 Some features like Premium/Professional plans will be disabled');

}