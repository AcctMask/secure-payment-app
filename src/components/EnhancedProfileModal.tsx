import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, CreditCard, Trash2, Plus } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { AddAccountModal } from './AddAccountModal';
import { Card } from './ui/card';

interface EnhancedProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnhancedProfileModal: React.FC<EnhancedProfileModalProps> = ({ isOpen, onClose }) => {
  const { accounts, memberData, deleteAccount } = useAppContext();
  const [showAddAccount, setShowAddAccount] = useState(false);

  const handleDeleteAccount = (id: string) => {
    if (confirm('Are you sure you want to remove this protected account?')) {
      deleteAccount(id);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl bg-slate-900 text-white border-blue-700">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">Profile & Account Management</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="accounts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-blue-950">
              <TabsTrigger value="accounts">Protected Accounts</TabsTrigger>
              <TabsTrigger value="profile">Member Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="accounts" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-blue-200">Manage your protected payment accounts</p>
                <Button onClick={() => setShowAddAccount(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Account
                </Button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {accounts.map((account) => (
                  <Card key={account.id} className="bg-blue-950 border-blue-800 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-8 h-8 text-blue-400" />
                        <div>
                          <p className="font-semibold text-white">{account.name}</p>
                          <p className="text-sm text-blue-300">•••• {account.lastFour}</p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              {memberData ? (
                <Card className="bg-blue-950 border-blue-800 p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-blue-300">Name</p>
                        <p className="font-semibold text-white">{memberData.firstName} {memberData.lastName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-blue-300">Member Number</p>
                        <p className="font-mono text-white">{memberData.memberAccountNumber}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <p className="text-blue-200 text-center py-8">No member data available</p>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AddAccountModal
        isOpen={showAddAccount}
        onClose={() => setShowAddAccount(false)}
      />
    </>
  );
};
