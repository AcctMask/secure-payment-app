import React from 'react';
import { CreditCard, Trash2, Building2, Wallet } from 'lucide-react';

interface PaymentAccount {
  id: string;
  name: string;
  type: 'credit' | 'debit' | 'bank';
  lastFour: string;
  expiryDate?: string;
}

interface PaymentAccountCardProps {
  account: PaymentAccount;
  onDelete: () => void;
}

export const PaymentAccountCard: React.FC<PaymentAccountCardProps> = ({ account, onDelete }) => {
  const getIcon = () => {
    switch (account.type) {
      case 'bank':
        return <Building2 className="w-5 h-5 text-white" />;
      case 'credit':
        return <CreditCard className="w-5 h-5 text-white" />;
      case 'debit':
        return <Wallet className="w-5 h-5 text-white" />;
      default:
        return <CreditCard className="w-5 h-5 text-white" />;
    }
  };

  const getTypeLabel = () => {
    switch (account.type) {
      case 'bank':
        return 'Bank Account';
      case 'credit':
        return 'Credit Card';
      case 'debit':
        return 'Debit Card';
      default:
        return 'Payment Method';
    }
  };

  const getGradient = () => {
    switch (account.type) {
      case 'bank':
        return 'from-slate-600 to-purple-600';
      case 'credit':
        return 'from-blue-600 to-slate-600';
      case 'debit':
        return 'from-purple-600 to-blue-600';
      default:
        return 'from-blue-600 to-purple-600';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/40 via-purple-800/30 to-blue-800/20 backdrop-blur-sm border border-slate-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`bg-gradient-to-r ${getGradient()} p-2 rounded-lg`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="text-white font-semibold">{account.name}</h3>
            <p className="text-slate-200 text-sm">{getTypeLabel()}</p>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="text-red-400 hover:text-red-300 transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-slate-200 text-sm mb-1">
            {account.type === 'bank' ? 'Account' : 'Card'} Number
          </p>
          <p className="text-white font-mono text-lg">
            **** **** **** {account.lastFour}
          </p>
        </div>

        {account.expiryDate && (
          <div>
            <p className="text-slate-200 text-sm mb-1">Expires</p>
            <p className="text-white font-mono">{account.expiryDate}</p>
          </div>
        )}

        <div className="border-t border-slate-500/20 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-200 text-sm">Status</span>
            <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};