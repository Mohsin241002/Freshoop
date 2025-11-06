import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { ordersApi } from '../lib/api';
import { useState } from 'react';

export default function Cart() {
  const { user } = useAuth();
  const { cart, updateCartItem, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-4">Sign in to view your cart</h2>
        <button
          onClick={() => navigate('/auth')}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  const handleUpdateQuantity = async (cartItemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    try {
      await updateCartItem(cartItemId, newQuantity);
    } catch (error) {
      alert(error.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
    } catch (error) {
      alert(error.message || 'Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const response = await ordersApi.checkout();
      alert(response.data.message || 'Order placed successfully! Your order will be delivered in 2 minutes.');
      navigate('/orders');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      const unavailable = error.response?.data?.unavailable_items;
      const insufficient = error.response?.data?.insufficient_stock;
      
      let message = 'Failed to place order: ' + errorMsg;
      if (unavailable && unavailable.length > 0) {
        message += '\n\nUnavailable items:\n' + unavailable.map(i => `- ${i.name}: ${i.reason}`).join('\n');
      }
      if (insufficient && insufficient.length > 0) {
        message += '\n\nInsufficient stock:\n' + insufficient.map(i => `- ${i.name}: Requested ${i.requested}, Available ${i.available}`).join('\n');
      }
      
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            return (
              <div
                key={item.cart_item_id}
                className="bg-white rounded-lg shadow p-4 flex gap-4"
              >
                {/* Image */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-3xl">🛒</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <p className="text-orange-600 font-bold">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity & Actions */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemoveItem(item.cart_item_id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity, -1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity, 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      disabled={item.quantity >= item.stock_quantity}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>$0.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-orange-600">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition disabled:bg-gray-400 font-semibold"
            >
              {loading ? 'Processing...' : 'Checkout'}
            </button>

            <button
              onClick={clearCart}
              className="w-full mt-2 text-red-500 py-2 hover:text-red-700"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

