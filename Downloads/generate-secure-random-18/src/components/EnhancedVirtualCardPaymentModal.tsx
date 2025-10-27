import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { CreditCard, ShoppingCart, CheckCircle, XCircle, Package, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface VirtualCard {
  number: string;
  cvv: string;
  expiry: string;
  expiresAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  description: string;
  category: string;
}

interface EnhancedVirtualCardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  virtualCard: VirtualCard;
  accountName: string;
  selectedProduct?: Product;
}

export const EnhancedVirtualCardPaymentModal: React.FC<EnhancedVirtualCardPaymentModalProps> = ({
  isOpen,
  onClose,
  virtualCard,
  accountName,
  selectedProduct
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const totalAmount = selectedProduct ? (selectedProduct.price * quantity).toFixed(2) : '0.00';

  const handlePayment = async () => {
    if (!selectedProduct) return;
    
    setIsProcessing(true);
    setPaymentResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          virtualCardNumber: virtualCard.number,
          amount: parseFloat(totalAmount),
          merchantName: 'SecurePay Store',
          productName: selectedProduct.name,
          quantity: quantity
        }
      });

      if (error) throw error;
      setPaymentResult({
        ...data,
        productName: selectedProduct.name,
        quantity: quantity,
        unitPrice: selectedProduct.price
      });
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentResult({ 
        success: false, 
        error: 'Payment processing failed. Please check your configuration.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setPaymentResult(null);
    setQuantity(1);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!selectedProduct) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-400" />
            Complete Your Purchase
          </DialogTitle>
        </DialogHeader>

        {!paymentResult ? (
          <div className="space-y-4">
            {/* Product Details */}
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{selectedProduct.image}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{selectedProduct.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < Math.floor(selectedProduct.rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-500'
                          }`} 
                        />
                      ))}
                      <span className="text-sm text-gray-300 ml-1">({selectedProduct.rating})</span>
                    </div>
                    <p className="text-sm text-gray-300">{selectedProduct.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">${selectedProduct.price}</div>
                    <div className="text-sm text-gray-400">each</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity Selection */}
            <div>
              <Label htmlFor="quantity" className="text-gray-300">Quantity</Label>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  -
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-gray-700 border-gray-600 text-white text-center w-20"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(quantity + 1)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Total */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-400">${totalAmount}</span>
              </div>
            </div>

            {/* Secure Purchase Card Number */}
            <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5" />
                  <span className="font-semibold">{accountName}</span>
                </div>
                <div className="text-sm opacity-80">
                  Virtual: •••• •••• •••• {virtualCard.number.slice(-4)}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? 'Processing...' : `Pay $${totalAmount}`}
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            {paymentResult.success ? (
              <>
                <div className="text-green-400 text-6xl mb-4">
                  <CheckCircle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-green-400">Payment Successful!</h3>
                <div className="bg-gray-700 p-4 rounded-lg space-y-2 text-sm text-left">
                  <div className="flex justify-between">
                    <span>Product:</span>
                    <span>{paymentResult.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{paymentResult.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unit Price:</span>
                    <span>${paymentResult.unitPrice}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${paymentResult.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Card Used:</span>
                    <span>{paymentResult.maskedCard || `•••• ${virtualCard.number.slice(-4)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono text-xs">{paymentResult.transactionId || 'TXN-' + Date.now()}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-red-400 text-6xl mb-4">
                  <XCircle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-red-400">Payment Failed</h3>
                <p className="text-gray-300">{paymentResult.error}</p>
              </>
            )}
            
            <Button
              onClick={handleClose}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};