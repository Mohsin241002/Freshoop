import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { ordersApi } from '../lib/api';
import { useState } from 'react';
import CheckoutModal from '../components/CheckoutModal';
import OrderSuccessAnimation from '../components/OrderSuccessAnimation';

export default function Cart() {
  const { user } = useAuth();
  const { cart, updateCartItem, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-cream-200">
          <div className="w-24 h-24 bg-gradient-to-br from-brand to-brand-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Sign in to view your cart</h2>
          <p className="text-gray-600 text-lg mb-8">You need to be logged in to access your shopping cart</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-brand to-brand-600 text-white px-10 py-4 rounded-2xl hover:from-brand-600 hover:to-brand-700 transition-all font-bold shadow-brand hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-cream-200">
          <div className="w-24 h-24 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Your cart is empty</h2>
          <p className="text-gray-600 text-lg mb-8">Add some delicious items to get started!</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-gradient-to-r from-brand to-brand-600 text-white px-10 py-4 rounded-2xl hover:from-brand-600 hover:to-brand-700 transition-all font-bold shadow-brand inline-flex items-center gap-2 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Start Shopping
          </button>
        </div>
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

  const handleCheckout = async (deliveryAddressId) => {
    try {
      setLoading(true);
      setShowCheckoutModal(false);
      
      const response = await ordersApi.checkout({ delivery_address_id: deliveryAddressId });
      
      // Store order details
      setOrderDetails({
        orderNumber: response.data.data.order.order_number,
        estimatedDelivery: response.data.data.order.estimated_delivery
      });
      
      // Show success animation
      setShowSuccessAnimation(true);
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

  const handleSuccessClose = () => {
    setShowSuccessAnimation(false);
    setOrderDetails(null);
    navigate('/orders');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-brand via-brand-600 to-brand-700 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Shopping Cart</h1>
            <p className="text-green-100 text-lg">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart</p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="hidden md:flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-semibold transition-all backdrop-blur-sm border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-5">
          {cart.items.map((item) => {
            return (
              <div
                key={item.cart_item_id}
                className="bg-white rounded-3xl shadow-xl p-6 flex gap-5 hover:shadow-2xl transition-all border-2 border-cream-200 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="w-32 h-32 bg-gradient-to-br from-cream-100 to-cream-200 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl">🛒</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-xl text-gray-800">{item.name}</h3>
                    <button
                      onClick={() => handleRemoveItem(item.cart_item_id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-cream-100 rounded-xl p-1 border-2 border-cream-200">
                      <button
                        onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity, -1)}
                        className="p-2 rounded-lg hover:bg-white transition-colors text-brand"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity, 1)}
                        className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-brand"
                        disabled={item.quantity >= item.stock_quantity}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">₹{Math.round(item.price)} each</p>
                      <p className="text-brand font-bold text-2xl">
                        ₹{Math.round(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-24 border-2 border-brand">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Order Summary</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600 text-lg">
                <span>Subtotal ({cart.items.length} items)</span>
                <span className="font-bold text-gray-800">₹{Math.round(getCartTotal())}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-lg">
                <span>Delivery Fee</span>
                <span className="font-bold text-brand">FREE</span>
              </div>
              <div className="border-t-2 border-cream-200 pt-4 flex justify-between font-bold text-2xl">
                <span>Total</span>
                <span className="text-brand">
                  ₹{Math.round(getCartTotal())}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowCheckoutModal(true)}
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand to-brand-600 text-white py-5 rounded-2xl hover:from-brand-600 hover:to-brand-700 transition-all disabled:from-gray-400 disabled:to-gray-400 font-bold text-xl shadow-brand hover:shadow-xl mb-4 hover:scale-105"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <button
              onClick={clearCart}
              className="w-full text-red-600 py-4 hover:bg-red-50 rounded-2xl transition-colors font-bold border-2 border-red-200"
            >
              Clear Cart
            </button>

            {/* Delivery Info */}
            <div className="mt-6 p-5 bg-gradient-to-br from-green-50 to-brand/5 rounded-2xl border-2 border-brand/20">
              <p className="text-sm text-gray-700 leading-relaxed">
                🚚 <span className="font-bold text-brand">Fast Delivery:</span> Your order will be delivered within 30 minutes!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onConfirm={handleCheckout}
        cartTotal={getCartTotal()}
      />

      {/* Success Animation */}
      <OrderSuccessAnimation
        isOpen={showSuccessAnimation}
        onClose={handleSuccessClose}
        orderNumber={orderDetails?.orderNumber}
        estimatedDelivery={orderDetails?.estimatedDelivery}
      />
    </div>
  );
}

