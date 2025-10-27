import React, { useState } from 'react';
import { ProductSelectionModal } from './ProductSelectionModal';
import { EnhancedVirtualCardPaymentModal } from './EnhancedVirtualCardPaymentModal';
import { SecurePurchaseModal } from './SecurePurchaseModal';
import { generateSecureCode } from '../utils/codeGenerator';
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  description: string;
  category: string;
}

export const SimpleAppLayout: React.FC = () => {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSecurePurchase, setShowSecurePurchase] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [purchaseCode, setPurchaseCode] = useState('');
  const [accountCodes, setAccountCodes] = useState({
    personal: '8480 5315 7501 7233',
    work: '9199 8579 4432 4469',
    business: '1391 8663 4607 0362'
  });

  const virtualCard = {
    number: '4532123456789012',
    cvv: '123',
    expiry: '12/25',
    expiresAt: '2024-09-18T21:47:00Z'
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsPaymentModalOpen(true);
  };

  const handleUseVirtualCard = () => {
    setIsProductModalOpen(true);
  };

  const handleUseNewCodeForPurchase = (accountType: string, accountName: string, lastFour: string) => {
    const newCode = generateSecureCode();
    setAccountCodes(prev => ({ ...prev, [accountType]: newCode }));
    setPurchaseCode(newCode);
    setSelectedAccount({ id: accountType, name: accountName, lastFour, code: newCode });
    setShowSecurePurchase(true);
  };

  return (
    <div className="min-h-screen" style={{ 
      background: 'radial-gradient(ellipse at center, #1C3F94 0%, #0F2350 20%, #0A1A3D 40%, #050F26 60%, #1C3F94 80%, #000000 100%)'
    }}>
      {/* Header with Logo */}
      <div style={{ 
        background: 'linear-gradient(90deg, #1C3F94 0%, #0F2350 25%, #C0C0C0 50%, #0F2350 75%, #1C3F94 100%)' 
      }} className="shadow-lg">

        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68bd89ae8305b7b3c57e9be2_1759511843729_a81af0ab.webp"
              alt="Secure Purchase Logo" 
              className="h-12 mr-4"
            />
            <h1 className="text-3xl font-bold text-white">
              Secure Card Generator
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <p className="text-lg text-white mb-8">
            Generate secure 16-digit codes instantly. Manage multiple accounts with enterprise-grade security.
          </p>
          
          {/* Main Code Display */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
            <div className="font-mono text-2xl text-white mb-4">6164 1675 0119 8413</div>
            <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold backdrop-blur-sm border border-white/30 transition-all">
              Generate All Codes
            </button>
          </div>
        </div>

        {/* Your Accounts Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Accounts</h2>
            <span className="text-white/70">Manage 3 secure accounts</span>
          </div>
          
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg mb-6 backdrop-blur-sm border border-white/30 transition-all">
            + Add Account
          </button>

          <div className="space-y-4">
            {/* Personal Account */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Personal Account ending in 4220</h3>
                <div className="flex gap-2">
                  <button className="text-white/70 hover:text-white">✏️</button>
                  <button className="text-white/70 hover:text-white">🗑️</button>
                </div>
              </div>
              <div className="font-mono text-xl text-white mb-4">{accountCodes.personal}</div>
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => setAccountCodes(prev => ({ ...prev, personal: generateSecureCode() }))}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white/30 transition-all"
                >
                  Generate New Code
                </button>
                <button 
                  onClick={() => handleUseNewCodeForPurchase('personal', 'Personal Account', '4220')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  Copy or Tap for Secure Purchase
                </button>
              </div>
            </div>

            {/* Work Account */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Work Account ending in 7891</h3>
                <div className="flex gap-2">
                  <button className="text-white/70 hover:text-white">✏️</button>
                  <button className="text-white/70 hover:text-white">🗑️</button>
                </div>
              </div>
              <div className="font-mono text-xl text-white mb-4">{accountCodes.work}</div>
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => setAccountCodes(prev => ({ ...prev, work: generateSecureCode() }))}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white/30 transition-all"
                >
                  Generate New Code
                </button>
                <button 
                  onClick={() => handleUseNewCodeForPurchase('work', 'Work Account', '7891')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  Copy or Tap for Secure Purchase
                </button>
              </div>
            </div>

            {/* Business Banking */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Business Banking ending in 8929</h3>
                <div className="flex gap-2">
                  <button className="text-white/70 hover:text-white">✏️</button>
                  <button className="text-white/70 hover:text-white">🗑️</button>
                </div>
              </div>
              <div className="font-mono text-xl text-white mb-4">{accountCodes.business}</div>
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => setAccountCodes(prev => ({ ...prev, business: generateSecureCode() }))}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white/30 transition-all"
                >
                  Generate New Code
                </button>
                <button 
                  onClick={() => handleUseNewCodeForPurchase('business', 'Business Banking', '8929')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  Copy or Tap for Secure Purchase
                </button>
              </div>
              </div>
            </div>
          </div>


        {/* Enterprise Features Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Enterprise Features</h2>
            <p className="text-white/70">Built for security professionals, developers, and anyone who needs reliable code generation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
              <div className="text-3xl mb-4">🔐</div>
              <h3 className="font-semibold text-white mb-2">Military-Grade Security</h3>
              <p className="text-white/70">Cryptographically secure random number generation with enterprise-level protection.</p>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="font-semibold text-white mb-2">Instant Generation</h3>
              <p className="text-white/70">Generate new 16-digit codes instantly with a single tap. No delays, no waiting.</p>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="font-semibold text-white mb-2">Multi-Account Support</h3>
              <p className="text-white/70">Manage unlimited accounts, each with unique codes and customizable names.</p>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
              <div className="text-3xl mb-4">🔄</div>
              <h3 className="font-semibold text-white mb-2">Bulk Operations</h3>
              <p className="text-white/70">Generate new codes for all accounts simultaneously with one master button.</p>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
              <div className="text-3xl mb-4">💾</div>
              <h3 className="font-semibold text-white mb-2">Local Storage</h3>
              <p className="text-white/70">All data stored locally on your device. No cloud sync, maximum privacy.</p>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="font-semibold text-white mb-2">Beautiful Interface</h3>
              <p className="text-white/70">Modern, intuitive design with smooth animations and responsive layout.</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Security Professionals</h2>
            <p className="text-white/70">Built to meet the highest standards of security and performance.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <div className="text-3xl font-bold text-white">16</div>
              <div className="text-white/70">Digit Codes</div>
              <div className="text-sm text-white/50">Maximum security length</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <div className="text-3xl font-bold text-white">∞</div>
              <div className="text-white/70">Accounts</div>
              <div className="text-sm text-white/50">Unlimited account support</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <div className="text-3xl font-bold text-white">&lt;1ms</div>
              <div className="text-white/70">Generation Time</div>
              <div className="text-sm text-white/50">Lightning fast performance</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-white/70">Privacy</div>
              <div className="text-sm text-white/50">Local storage only</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProductSelectionModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onProductSelect={handleProductSelect}
      />

      <EnhancedVirtualCardPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        virtualCard={virtualCard}
        accountName="Personal Account"
        selectedProduct={selectedProduct}
      />

      {/* Secure Purchase Modal */}
      {selectedAccount && (
        <SecurePurchaseModal
          isOpen={showSecurePurchase}
          onClose={() => setShowSecurePurchase(false)}
          account={selectedAccount}
          generatedCode={purchaseCode}
        />
      )}
    </div>
  );
};

export default SimpleAppLayout;