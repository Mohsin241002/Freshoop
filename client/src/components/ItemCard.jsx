import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function ItemCard({ item }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await addToCart(item.id, quantity);
      setQuantity(1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      alert(error.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-cream-200 group">
      {/* Image */}
      <div className="h-52 bg-gradient-to-br from-cream-100 via-cream-50 to-cream-200 flex items-center justify-center relative overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="text-gray-400 text-7xl">🛒</div>
        )}
        {!item.is_available && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-xl bg-red-500 px-4 py-2 rounded-xl">Unavailable</span>
          </div>
        )}
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-brand text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
          ₹{Math.round(item.price)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1 group-hover:text-brand transition-colors">
          {item.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Stock Status */}
        {item.stock_quantity < 10 && item.stock_quantity > 0 && (
          <div className="mb-3 flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-2 rounded-xl">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <p className="text-orange-700 text-xs font-bold">
              Only {item.stock_quantity} left!
            </p>
          </div>
        )}
        {item.stock_quantity === 0 && (
          <div className="mb-3 flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <p className="text-red-700 text-xs font-bold">
              Out of stock
            </p>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center gap-1 bg-cream-100 rounded-xl p-1 border-2 border-cream-200">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 rounded-lg hover:bg-white transition-colors text-brand"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-bold text-gray-800">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(item.stock_quantity, quantity + 1))}
              className="p-2 rounded-lg hover:bg-white transition-colors text-brand"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!item.is_available || item.stock_quantity === 0 || loading || added}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex-1 justify-center hover:scale-105 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-brand to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500'
            }`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

