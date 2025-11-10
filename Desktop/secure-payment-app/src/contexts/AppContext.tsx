import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateSecureCode } from '../utils/codeGenerator';

export interface Account {
  id: string;
  name: string;
  code: string;
  lastFour: string;
  createdAt: Date;
  stripePaymentMethodId?: string;
  cardType?: string;
}

export interface MemberData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  memberAccountNumber: string;
  membershipActive: boolean;
}

interface AppContextType {
  accounts: Account[];
  mainCode: string;
  memberData: MemberData | null;
  issuingCards: any[];
  setMainCode: (code: string) => void;
  setMemberData: (data: MemberData | null) => void;
  setIssuingCards: (cards: any[]) => void;
  addAccount: (accountData: Partial<Account>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  fetchIssuingCards: (email: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Personal Account ending in 4220',
      code: '8480 5315 7501 7233',
      lastFour: '4220',
      createdAt: new Date()
    },
    {
      id: '2', 
      name: 'Work Account ending in 7891',
      code: '9199 8579 4432 4469',
      lastFour: '7891',
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Steve\'s Test Account ending in 8929', 
      code: '1391 8663 4607 0362',
      lastFour: '8929',
      createdAt: new Date(),
      stripePaymentMethodId: 'pm_test_steve_8929',
      cardType: 'visa'
    }
  ]);

  const [mainCode, setMainCode] = useState('6164 1675 0119 8413');
  const [issuingCards, setIssuingCards] = useState<any[]>([]);
  const [memberData, setMemberData] = useState<MemberData | null>(() => {
    const stored = localStorage.getItem('memberData');
    return stored ? JSON.parse(stored) : null;
  });

  const fetchIssuingCards = async (email: string) => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase.functions.invoke('get-issuing-cards', {
        body: { email }
      });

      if (error) throw error;
      setIssuingCards(data?.cards || []);
    } catch (error) {
      console.error('Error fetching issuing cards:', error);
      setIssuingCards([]);
    }
  };


  const addAccount = (accountData: Partial<Account>) => {
    if (!accountData.name || !accountData.lastFour || !accountData.stripePaymentMethodId) {
      throw new Error('Account must have name, card data, and payment method');
    }
    
    const newAccount: Account = {
      id: Date.now().toString(),
      name: accountData.name,
      code: generateSecureCode(),
      lastFour: accountData.lastFour,
      cardType: accountData.cardType,
      stripePaymentMethodId: accountData.stripePaymentMethodId,
      createdAt: new Date()
    };
    setAccounts(prev => [...prev, newAccount]);
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts(prev => prev.map(account => 
      account.id === id ? { ...account, ...updates } : account
    ));
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(account => account.id !== id));
  };
  
  // Effect to sync memberData with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('memberData');
      setMemberData(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Effect to persist memberData to localStorage
  useEffect(() => {
    if (memberData) {
      localStorage.setItem('memberData', JSON.stringify(memberData));
    }
  }, [memberData]);
  
  return (
    <AppContext.Provider value={{
      accounts,
      mainCode,
      memberData,
      issuingCards,
      setMainCode,
      setMemberData,
      setIssuingCards,
      addAccount,
      updateAccount,
      deleteAccount,
      fetchIssuingCards
    }}>
      {children}
    </AppContext.Provider>
  );
};



export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};