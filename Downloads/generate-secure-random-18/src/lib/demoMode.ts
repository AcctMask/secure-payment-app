// Demo Mode Utilities - DISABLED FOR LIVE MODE
export const isDemoMode = (): boolean => {
  // Only enable demo mode if explicitly set to 'true'
  return import.meta.env.VITE_DEMO_MODE === 'true';
};


export const simulateMembershipPurchase = async (membershipType: string, email: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    memberData: {
      email,
      firstName: 'Demo',
      lastName: 'User',
      membershipType,
      membershipActive: true,
      memberAccountNumber: `DEMO-${Math.floor(Math.random() * 100000)}`,
      joinDate: new Date().toISOString(),
    }
  };
};

export const getDemoConfig = () => ({
  premiumPrice: '$29.99',
  proPrice: '$49.99',
  features: {
    premium: ['Virtual Cards', 'Secure Codes', 'Priority Support'],
    pro: ['All Premium Features', 'Advanced Analytics', 'API Access', 'White Label']
  }
});
