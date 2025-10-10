import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Copy, Eye, EyeOff, CreditCard, ShoppingCart } from 'lucide-react';
import { VirtualCardPaymentModal } from './VirtualCardPaymentModal';
interface VirtualCard {
  number: string;
  cvv: string;
  expiry: string;
  expiresAt: string;
}

interface VirtualCardDisplayProps {
  virtualCard: VirtualCard;
  onCopy: (text: string) => void;
  accountName?: string;
}

export const VirtualCardDisplay: React.FC<VirtualCardDisplayProps> = ({
  virtualCard,
  onCopy,
  accountName = 'Secure Purchase Card Number'
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const getTimeRemaining = () => {
    const expires = new Date(virtualCard.expiresAt);
    const now = new Date();
    const diff = expires.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    return minutes > 0 ? `${minutes}m remaining` : 'Expired';
  };

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            <span className="font-semibold">Secure Purchase Card Number</span>
          </div>
          <div className="text-sm opacity-80">
            {getTimeRemaining()}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm opacity-80 mb-1">Card Number</div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg">
                {showDetails ? formatCardNumber(virtualCard.number) : '•••• •••• •••• ' + virtualCard.number.slice(-4)}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => onCopy(virtualCard.number)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <div>
              <div className="text-sm opacity-80 mb-1">CVV</div>
              <div className="flex items-center gap-2">
                <span className="font-mono">
                  {showDetails ? virtualCard.cvv : '•••'}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => onCopy(virtualCard.cvv)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <div className="text-sm opacity-80 mb-1">Expiry</div>
              <span className="font-mono">{virtualCard.expiry}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
            
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Use Secure Purchase Card Number for Purchase
            </Button>
          </div>
        </div>
      </CardContent>
      
      <VirtualCardPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        virtualCard={virtualCard}
        accountName={accountName}
      />
    </Card>
  );
};