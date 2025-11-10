// Version: 3.0 - FORCE DEPLOY - October 21, 2025 @ 3:12 PM
import React, { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { CodeDisplay } from './CodeDisplay';
import { Button } from './ui/button';
import { AddAccountModal } from './AddAccountModal';
import { EnhancedSecurePurchaseModal } from './EnhancedSecurePurchaseModal';
import { RotatingVirtualCardModal } from './RotatingVirtualCardModal';
import { IssuingCardDisplay } from './IssuingCardDisplay';
import { useAppContext } from '../contexts/AppContext';


import { generateSecureCode } from '../utils/codeGenerator';
import { Plus, Shield, Zap, Smartphone, RotateCcw, HardDrive, Palette, Download, Upload, Cloud, User, CreditCard, RefreshCw } from 'lucide-react';
import { ExportModal } from './ExportModal';
import { ImportModal } from './ImportModal';
import SyncStatus from './SyncStatus';
import { StripeEditAccountModal } from './StripeEditAccountModal';
import { MemberProfileModal } from './MemberProfileModal';
import { RealMembershipModal } from './RealMembershipModal';
import { MemberPurchaseModal } from './MemberPurchaseModal';






export const AppLayout: React.FC = () => {
  const { accounts, addAccount, updateAccount, deleteAccount, mainCode, setMainCode, memberData, issuingCards, fetchIssuingCards } = useAppContext();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSecurePurchase, setShowSecurePurchase] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showVirtualCardModal, setShowVirtualCardModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [purchaseCode, setPurchaseCode] = useState('');



  const generateAllCodes = () => {
    setMainCode(generateSecureCode());
    accounts.forEach(account => {
      updateAccount(account.id, { code: generateSecureCode() });
    });
  };

  const handleUseNewCodeForPurchase = (account: any) => {
    const newCode = generateSecureCode();
    updateAccount(account.id, { code: newCode });
    setPurchaseCode(newCode);
    setSelectedAccount(account);
    setShowSecurePurchase(true);
  };

  const handleAddAccount = (accountData: { name: string; lastFour: string; cardType: string; stripePaymentMethodId: string }) => {
    addAccount(accountData);
  };

  // Fetch issuing cards when member data is available
  useEffect(() => {
    if (memberData?.email && memberData.membershipActive) {
      fetchIssuingCards(memberData.email);
    }
  }, [memberData?.email, memberData?.membershipActive]);

  const handleRefreshCards = () => {
    if (memberData?.email) {
      fetchIssuingCards(memberData.email);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Navigation />
      {/* Member Info Bar - Directly Below Header */}
      {memberData && memberData.membershipActive && (
        <div className="bg-gradient-to-r from-green-600/10 to-blue-600/10 backdrop-blur-sm border-b border-white/10 py-3 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-white">
                <span className="text-green-400 font-semibold">Welcome,</span> {memberData.firstName} {memberData.lastName}
              </div>
              <div className="text-blue-300 text-sm">
                Member #{memberData.memberAccountNumber}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProfileModal(true)}
                className="border-green-400/50 text-green-300 hover:bg-green-400/10 bg-green-400/5"
              >
                <User className="w-4 h-4 mr-2" />
                My Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-400/50 text-blue-300 hover:bg-blue-400/10 bg-blue-400/5"
              >
                Transaction History
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Secure Purchase Code Generator
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Generate secure 16-digit codes instantly. Manage multiple accounts with enterprise-grade security.
            </p>
            
            {/* CTA for non-members */}
            {/* CTA for non-members - UPDATED */}
            {!memberData?.membershipActive && (
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">🚀 Ready to Get Started?</h2>
                <p className="text-gray-300 mb-6">Join our premium membership to unlock Stripe virtual cards and advanced features</p>
                <Button 
                  onClick={() => setShowMembershipModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  🎯 Get Real Membership Now
                </Button>
              </div>
            )}

          </div>

          {/* Main Code Display */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <CodeDisplay code={mainCode} size="large" />
            <Button 
              onClick={generateAllCodes}
              className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
            >
              Generate ALL NEW Codes
            </Button>
          </div>
        </div>
      </section>




      {/* Stripe Issuing Virtual Cards Section - Replaces old accounts for active members */}
      {memberData && memberData.membershipActive && memberData.email ? (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Your Stripe Virtual Cards</h2>
                <p className="text-gray-400">
                  {issuingCards.length} rotating virtual {issuingCards.length === 1 ? 'card' : 'cards'} • Auto-synced from Stripe
                </p>
              </div>
              <Button
                onClick={handleRefreshCards}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Cards
              </Button>
            </div>

            {issuingCards.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                <CreditCard className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Virtual Cards Yet</h3>
                <p className="text-gray-400 mb-6">
                  Connect your Stripe account to automatically sync your virtual cards
                </p>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Connect Stripe Account
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issuingCards.map((card) => (
                  <IssuingCardDisplay
                    key={card.id}
                    card={card}
                    onViewDetails={(cardId) => console.log('View details:', cardId)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        /* Legacy Accounts Section - Only show for non-members */
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">Your Accounts</h2>
                <p className="text-gray-400">Manage {accounts.length} secure accounts</p>
              </div>
            </div>
            
            <div className="flex gap-3 mb-8">
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
              <Button 
                onClick={() => setShowExportModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button 
                onClick={() => setShowImportModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Backup
              </Button>
            </div>
            
            <div className="mb-8 flex justify-center">
              <SyncStatus />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <div key={account.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white">{account.name}</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowEditModal(true);
                        }}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Edit and sync with Stripe"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => deleteAccount(account.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete account"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <CodeDisplay code={account.code} />
                  <div className="flex flex-col space-y-2">
                    <Button 
                      onClick={() => updateAccount(account.id, { code: generateSecureCode() })}
                      className="w-full bg-slate-700 hover:bg-slate-600 text-white"
                    >
                      Generate New Code
                    </Button>
                    <Button 
                      onClick={() => handleUseNewCodeForPurchase(account)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Copy or Tap for Secure Purchase
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Enterprise Features</h2>
          <p className="text-gray-400 text-center mb-12">Built for security professionals, developers, and anyone who needs reliable code generation.</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Military-Grade Security</h3>
              <p className="text-gray-400">Cryptographically secure random number generation with enterprise-level protection.</p>
            </div>
            <div className="text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Instant Generation</h3>
              <p className="text-gray-400">Generate new 16-digit codes instantly with a single tap. No delays, no waiting.</p>
            </div>
            <div className="text-center">
              <Smartphone className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Multi-Account Support</h3>
              <p className="text-gray-400">Manage unlimited accounts, each with unique codes and customizable names.</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Bulk Operations</h3>
              <p className="text-gray-400">Generate new codes for all accounts simultaneously with one master button.</p>
            </div>
            <div className="text-center">
              <Cloud className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Cloud Synchronization</h3>
              <p className="text-gray-400">Sync your accounts across multiple devices with real-time updates and conflict resolution.</p>
            </div>
            <div className="text-center">
              <Palette className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Beautiful Interface</h3>
              <p className="text-gray-400">Modern, intuitive design with smooth animations and responsive layout.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Trusted by Security Professionals</h2>
          <p className="text-gray-400 mb-12">Built to meet the highest standards of security and performance.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-white mb-2">16</div>
              <div className="text-gray-400">Digit Codes</div>
              <div className="text-sm text-gray-500">Maximum security length</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">∞</div>
              <div className="text-gray-400">Accounts</div>
              <div className="text-sm text-gray-500">Unlimited account support</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">&lt;1ms</div>
              <div className="text-gray-400">Generation Time</div>
              <div className="text-sm text-gray-500">Lightning fast performance</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400">Privacy</div>
              <div className="text-sm text-gray-500">Local storage only</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Add Account Modal with Stripe Integration */}
      <AddAccountModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddAccount}
      />

      {/* Secure Purchase Modal */}
      {selectedAccount && (
        <EnhancedSecurePurchaseModal
          isOpen={showSecurePurchase}
          onClose={() => setShowSecurePurchase(false)}
          account={selectedAccount}
          generatedCode={purchaseCode}
        />
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
      
      {/* Edit Account Modal */}
      {selectedAccount && (
        <StripeEditAccountModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAccount(null);
          }}
          account={selectedAccount}
          onUpdate={updateAccount}
        />
      )}
      
      {/* Member Profile Modal */}
      <MemberProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      
      {/* Rotating Virtual Card Modal */}
      {memberData && memberData.email && (
        <RotatingVirtualCardModal
          isOpen={showVirtualCardModal}
          onClose={() => setShowVirtualCardModal(false)}
          memberEmail={memberData.email}
        />
      )}
      


      {/* Membership Modal */}
      <RealMembershipModal
        isOpen={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
      />

      {/* Purchase Modal */}
      <MemberPurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />

      {/* System Diagnostics - Floating Button */}
    </div>
  );
};
