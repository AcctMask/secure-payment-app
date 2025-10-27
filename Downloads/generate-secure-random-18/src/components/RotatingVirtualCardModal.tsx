import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CreditCard, Shield, RefreshCw, Loader2, Copy, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface RotatingVirtualCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberEmail: string;
}

export const RotatingVirtualCardModal: React.FC<RotatingVirtualCardModalProps> = ({
  isOpen,
  onClose,
  memberEmail,
}) => {
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && memberEmail) {
      fetchCardDetails();
    }
  }, [isOpen, memberEmail]);

  const fetchCardDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-card-details', {
        body: { memberEmail }
      });

      if (error) throw error;
      setCardDetails(data);
    } catch (err) {
      console.error('Failed to fetch card:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Rotating Virtual Card
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : cardDetails ? (
          <div className="space-y-4">
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                <RefreshCw className="w-4 h-4 text-blue-400 mt-1" />
                <div className="text-sm text-blue-200">
                  This card automatically rotates after each purchase for maximum security
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-purple-600 to-blue-700 text-white border-0">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <CreditCard className="w-8 h-8" />
                  <span className="text-xs opacity-80">VIRTUAL</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs opacity-70 mb-1">CARD NUMBER</div>
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-lg tracking-wider">
                        {cardDetails.number}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(cardDetails.number, 'number')}
                        className="h-8 w-8 p-0"
                      >
                        {copied === 'number' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="text-xs opacity-70 mb-1">EXPIRY</div>
                      <div className="font-mono">{cardDetails.exp_month}/{cardDetails.exp_year}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs opacity-70 mb-1">CVV</div>
                      <div className="flex items-center gap-2">
                        <div className="font-mono">{cardDetails.cvc}</div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(cardDetails.cvc, 'cvc')}
                          className="h-6 w-6 p-0"
                        >
                          {copied === 'cvc' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs opacity-70 mb-1">CARDHOLDER</div>
                    <div className="uppercase">{cardDetails.cardholder?.name || 'Member'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gray-700 rounded-lg p-4 space-y-2 text-sm">
              <h4 className="font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                How It Works
              </h4>
              <ul className="space-y-1 text-gray-300 text-xs">
                <li>• Use this card on Amazon, eBay, or any website</li>
                <li>• After each purchase, a new card is automatically generated</li>
                <li>• Old card is instantly canceled for security</li>
                <li>• Refresh this page to see your new card details</li>
              </ul>
            </div>

            <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700">
              Close
            </Button>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No active card found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};