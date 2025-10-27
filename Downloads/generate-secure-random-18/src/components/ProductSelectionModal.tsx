import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ShoppingCart, Package, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  description: string;
  category: string;
}

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect: (product: Product) => void;
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 79.99,
    image: '🎧',
    rating: 4.5,
    description: 'Premium wireless headphones with noise cancellation',
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    image: '⌚',
    rating: 4.8,
    description: 'Advanced fitness tracking and notifications',
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Coffee Maker',
    price: 89.99,
    image: '☕',
    rating: 4.3,
    description: 'Programmable drip coffee maker with thermal carafe',
    category: 'Kitchen'
  },
  {
    id: '4',
    name: 'Laptop Stand',
    price: 34.99,
    image: '💻',
    rating: 4.6,
    description: 'Adjustable aluminum laptop stand for ergonomic work',
    category: 'Office'
  },
  {
    id: '5',
    name: 'Bluetooth Speaker',
    price: 45.99,
    image: '🔊',
    rating: 4.4,
    description: 'Portable waterproof speaker with 12-hour battery',
    category: 'Electronics'
  },
  {
    id: '6',
    name: 'Desk Lamp',
    price: 29.99,
    image: '💡',
    rating: 4.2,
    description: 'LED desk lamp with adjustable brightness and color',
    category: 'Office'
  }
];

export const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  isOpen,
  onClose,
  onProductSelect
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', ...Array.from(new Set(sampleProducts.map(p => p.category)))];
  const filteredProducts = selectedCategory === 'All' 
    ? sampleProducts 
    : sampleProducts.filter(p => p.category === selectedCategory);

  const handleProductSelect = (product: Product) => {
    onProductSelect(product);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl bg-gray-800 text-white border-gray-700 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            Select Product to Purchase
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <Card 
                key={product.id} 
                className="bg-gray-700 border-gray-600 hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => handleProductSelect(product)}
              >
                <CardContent className="p-4">
                  <div className="text-center mb-3">
                    <div className="text-4xl mb-2">{product.image}</div>
                    <h3 className="font-semibold text-white">{product.name}</h3>
                  </div>
                  
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-500'
                        }`} 
                      />
                    ))}
                    <span className="text-sm text-gray-300 ml-1">({product.rating})</span>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-3 text-center">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-green-400">${product.price}</span>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};