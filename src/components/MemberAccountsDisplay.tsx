import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { CreditCard, Shield } from 'lucide-react';
import { Card } from './ui/card';

export const MemberAccountsDisplay: React.FC = () => {
  const { accounts, issuingCards } = useAppContext();

  const getVirtualCardForAccount = (accountId: string) => {
    return issuingCards.find(card => card.accountId === accountId);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Shield className="w-6 h-6 text-blue-400" />
        Your Protected Accounts
      </h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        {accounts.map((account) => {
          const virtualCard = getVirtualCardForAccount(account.id);
          
          return (
            <Card key={account.id} className="bg-gradient-to-br from-blue-900 to-blue-950 border-blue-700 p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-blue-300 font-medium">PROTECTED ACCOUNT</p>
                    <h3 className="text-lg font-bold text-white mt-1">{account.name}</h3>
                  </div>
                  <CreditCard className="w-8 h-8 text-blue-400" />
                </div>

                <div className="bg-blue-950/50 rounded-lg p-4 border border-blue-800">
                  <p className="text-xs text-blue-300 mb-1">Current Virtual Assigned Card</p>
                  <p className="text-2xl font-mono font-bold text-white">•••• {account.lastFour}</p>
                </div>


                {virtualCard && (
                  <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-4 border border-purple-700">
                    <p className="text-xs text-purple-300 mb-2">ACTIVE VIRTUAL CARD</p>
                    <p className="text-sm font-mono text-white">{virtualCard.number || account.code}</p>
                    <div className="flex gap-4 mt-2">
                      <div>
                        <p className="text-xs text-purple-300">EXP</p>
                        <p className="text-sm font-mono text-white">{virtualCard.exp || '12/25'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-300">CVV</p>
                        <p className="text-sm font-mono text-white">{virtualCard.cvc || '***'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
