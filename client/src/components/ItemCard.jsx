import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function ItemCard({ item }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please sign in to add items to cart');
      return;
    }

    try {
      setLoading(true);
      await addToCart(item.id, quantity);
      setQuantity(1);
      alert('Item added to cart!');
    } catch (error) {
      alert(error.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-4xl">🛒</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <span className="text-orange-600 font-bold text-lg">
            ${item.price.toFixed(2)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(item.stock_quantity, quantity + 1))}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!item.is_available || item.stock_quantity === 0 || loading}
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm">Add</span>
          </button>
        </div>

        {/* Stock Status */}
        {item.stock_quantity < 10 && item.stock_quantity > 0 && (
          <p className="text-orange-500 text-xs mt-2">
            Only {item.stock_quantity} left!
          </p>
        )}
        {item.stock_quantity === 0 && (
          <p className="text-red-500 text-xs mt-2">Out of stock</p>
        )}
      </div>
    </div>
  );
}

