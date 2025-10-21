import React, { useState } from 'react';
import { Button } from './ui/button';
import { CreditCard, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface IssuingCardDisplayProps {
  card: any;
  onViewDetails: (cardId: string) => void;
}

export const IssuingCardDisplay: React.FC<IssuingCardDisplayProps> = ({ card, onViewDetails }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchCardDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-card-details', {
        body: { cardId: card.id }
      });

      if (error) throw error;
      setCardDetails(data);
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching card details:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const getCardBrand = () => {
    return card.brand?.toUpperCase() || 'VISA';
  };

  const getStatusColor = () => {
    if (card.status === 'active') return 'text-green-400';
    if (card.status === 'inactive') return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm border border-white/20 rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">{getCardBrand()} Card</h3>
          </div>
          <p className="text-sm text-gray-400">•••• {card.last4}</p>
          <p className={`text-xs ${getStatusColor()} mt-1`}>
            {card.status.toUpperCase()}
          </p>
        </div>
      </div>

      {!showDetails ? (
        <Button
          onClick={fetchCardDetails}
          disabled={loading || card.status !== 'active'}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Eye className="w-4 h-4 mr-2" />
          {loading ? 'Loading...' : 'View Card Details'}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="bg-black/30 rounded-lg p-4 space-y-3">
            <div>
              <label className="text-xs text-gray-400">Card Number</label>
              <div className="flex items-center justify-between">
                <code className="text-white font-mono">{cardDetails?.number || '•••• •••• •••• ••••'}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(cardDetails?.number, 'number')}
                >
                  {copied === 'number' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400">Expiry</label>
                <div className="flex items-center justify-between">
                  <code className="text-white font-mono">{cardDetails?.exp_month}/{cardDetails?.exp_year}</code>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400">CVV</label>
                <div className="flex items-center justify-between">
                  <code className="text-white font-mono">{cardDetails?.cvc || '•••'}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(cardDetails?.cvc, 'cvc')}
                  >
                    {copied === 'cvc' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setShowDetails(false)}
            variant="outline"
            className="w-full"
          >
            <EyeOff className="w-4 h-4 mr-2" />
            Hide Details
          </Button>
        </div>
      )}
    </div>
  );
};
