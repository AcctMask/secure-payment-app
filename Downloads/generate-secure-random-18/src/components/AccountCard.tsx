import React, { useState } from 'react';
import { Edit2, Trash2, Copy, RefreshCw } from 'lucide-react';
import { generateSecureCode } from '../utils/codeGenerator';
import { SecurePurchaseModal } from './SecurePurchaseModal';
import { EditAccountModal } from './EditAccountModal';
import { useToast } from '../hooks/use-toast';

interface Account {
  id: string;
  name: string;
  lastFour: string;
  code: string;
}

interface AccountCardProps {
  account: Account;
  onDelete: () => void;
  onEdit?: (id: string, updates: any) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onDelete, onEdit }) => {
  const [currentCode, setCurrentCode] = useState(account.code);
  const [showSecurePurchase, setShowSecurePurchase] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [purchaseCode, setPurchaseCode] = useState('');
  const { toast } = useToast();

  const handleGenerateNewCode = () => {
    const newCode = generateSecureCode();
    setCurrentCode(newCode);
    toast({
      title: "New Code Generated",
      description: `New secure code: ${newCode}`,
    });
  };

  const handleCopyCode = () => {
    // Copy code without spaces for easy pasting into any website
    const codeWithoutSpaces = currentCode.replace(/\s/g, '');
    navigator.clipboard.writeText(codeWithoutSpaces)
      .then(() => {
        toast({
          title: "Code Copied!",
          description: "The code has been copied to your clipboard and can be pasted into any website.",
        });
      })
      .catch(() => {
        toast({
          title: "Copy Failed",
          description: "Please try copying the code manually.",
          variant: "destructive",
        });
      });
  };

  const handleTapForSecurePurchase = () => {
    setPurchaseCode(currentCode);
    setShowSecurePurchase(true);
  };

  const handleCodeRegenerated = (newCode: string) => {
    setCurrentCode(newCode);
    if (onEdit) {
      onEdit(account.id, { code: newCode });
    }
    toast({
      title: "Code Auto-Regenerated",
      description: `Your secure code has been updated to: ${newCode}`,
    });
  };


  const handleEditAccount = (id: string, updates: any) => {
    if (onEdit) {
      onEdit(id, updates);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {account.name} ending in {account.lastFour}
            </h3>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowEditModal(true)}
              className="text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={onDelete}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="text-2xl font-mono font-bold text-gray-900 tracking-wider mb-3">
            {currentCode}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleGenerateNewCode}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generate New Code
            </button>
            <button
              onClick={handleCopyCode}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Code
            </button>
          </div>
          <button
            onClick={handleTapForSecurePurchase}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 mt-2"
          >
            Tap for Secure Purchase
          </button>
        </div>
      </div>

      <SecurePurchaseModal
        isOpen={showSecurePurchase}
        onClose={() => setShowSecurePurchase(false)}
        account={account}
        generatedCode={purchaseCode}
        onCodeRegenerated={handleCodeRegenerated}
      />


      <EditAccountModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        account={{
          id: account.id,
          accountName: account.name,
          accountNumber: account.lastFour,
          routingNumber: '',
          accountType: 'checking',
          bankName: '',
          secureCode: account.code
        }}
        onUpdate={handleEditAccount}
      />
  );
};
