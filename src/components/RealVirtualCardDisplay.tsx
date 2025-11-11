import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Copy, Eye, EyeOff, CreditCard, Loader2, Smartphone, RefreshCw, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { CardRotationHistory } from './CardRotationHistory';

interface CardDetails {
  number: string;
  cvc: string;
  exp_month: number;
  exp_year: number;
  brand: string;
  last4: string;
  status: string;
}

interface MemberData {
  id: string;
  card_rotation_count: number;
  last_card_rotation_at: string | null;
}

interface RealVirtualCardDisplayProps {
  memberId: string;
}

export const RealVirtualCardDisplay: React.FC<RealVirtualCardDisplayProps> = ({ memberId }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null);
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCardDetails();
    fetchMemberData();
  }, [memberId]);

  const fetchMemberData = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, card_rotation_count, last_card_rotation_at')
        .eq('id', memberId)
        .single();

      if (error) throw error;
      setMemberData(data);
    } catch (error: any) {
      console.error('Error fetching member data:', error);
    }
  };


  const fetchCardDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('get-card-details', {
        body: { memberId },
      });

      if (error) throw error;
      setCardDetails(data);
    } catch (error: any) {
      console.error('Error fetching card:', error);
      toast.error('Failed to load card details');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!cardDetails) {
    return (
      <Card className="bg-gradient-to-br from-gray-600 to-gray-700 text-white border-0">
        <CardContent className="p-6">
          <p className="text-center">No card available</p>
        </CardContent>
      </Card>
    );
  }

  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              <span className="font-semibold">Virtual Card</span>
            </div>
            <span className="text-xs uppercase bg-white/20 px-2 py-1 rounded">
              {cardDetails.brand}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs opacity-80 mb-1">CARD NUMBER</div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg tracking-wider">
                  {showDetails ? formatCardNumber(cardDetails.number) : `•••• •••• •••• ${cardDetails.last4}`}
                </span>
                {showDetails && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => copyToClipboard(cardDetails.number, 'Card number')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex gap-6">
              <div>
                <div className="text-xs opacity-80 mb-1">EXPIRY</div>
                <span className="font-mono text-lg">
                  {String(cardDetails.exp_month).padStart(2, '0')}/{String(cardDetails.exp_year).slice(-2)}
                </span>
              </div>
              <div>
                <div className="text-xs opacity-80 mb-1">CVV</div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg">
                    {showDetails ? cardDetails.cvc : '•••'}
                  </span>
                  {showDetails && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => copyToClipboard(cardDetails.cvc, 'CVV')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 w-full"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            How to Use Your Card
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Use on any website (Amazon, eBay, etc.)</li>
            <li>✓ Add to Apple Pay or Google Pay for tap-to-pay</li>
            <li>✓ Monthly spending limit: $1,000</li>
            <li>✓ Card rotates after EVERY transaction for security</li>
          </ul>
        </CardContent>
      </Card>

      {memberData && (
        <CardRotationHistory
          memberId={memberId}
          rotationCount={memberData.card_rotation_count || 0}
          lastRotation={memberData.last_card_rotation_at}
        />
      )}
    </div>
  );
