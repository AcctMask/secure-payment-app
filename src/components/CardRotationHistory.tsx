import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { supabase } from '@/lib/supabase';
import { RefreshCw, Shield, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface RotationRecord {
  id: string;
  old_card_id: string;
  new_card_id: string;
  rotation_reason: string;
  transaction_id: string;
  merchant_name: string;
  transaction_amount: number;
  rotated_at: string;
  wallet_provisioned: boolean;
}

interface CardRotationHistoryProps {
  memberId: string;
  rotationCount: number;
  lastRotation: string | null;
}

export const CardRotationHistory: React.FC<CardRotationHistoryProps> = ({
  memberId,
  rotationCount,
  lastRotation,
}) => {
  const [history, setHistory] = useState<RotationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [memberId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('card_rotation_history')
        .select('*')
        .eq('member_id', memberId)
        .order('rotated_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
    } catch (error: any) {
      console.error('Error loading rotation history:', error);
      toast.error('Failed to load rotation history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          Card Rotation History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600">Total Rotations</div>
            <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              {rotationCount || 0}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Last Rotation</div>
            <div className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {lastRotation 
                ? new Date(lastRotation).toLocaleString()
                : 'Never'}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-700">Recent Rotations</h4>
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No rotations yet. Card will rotate after first transaction.
            </div>
          ) : (
            history.map((record) => (
              <div
                key={record.id}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-sm">
                      {record.merchant_name || 'Purchase'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(record.rotated_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      ${record.transaction_amount?.toFixed(2) || '0.00'}
                    </div>
                    {record.wallet_provisioned && (
                      <div className="text-xs text-blue-600">
                        Wallet Updated
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span>Card rotated for security</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-sm text-blue-900 mb-2">
            🔐 Patent-Protected Security
          </h4>
          <p className="text-xs text-blue-800">
            Your card automatically rotates after every transaction. The "just used" 
            card is immediately frozen, making fraud impossible. This is the core of 
            our patent-protected technology.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
