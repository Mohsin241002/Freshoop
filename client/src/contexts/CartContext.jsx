import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { cartApi } from '../lib/api';

const CartContext = createContext({});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ cart_id: null, items: [], total_items: 0, total_amount: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ cart_id: null, items: [], total_items: 0, total_amount: 0 });
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await cartApi.get();
      // Handle new backend response format
      setCart(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId, quantity = 1) => {
    if (!user) {
      alert('Please sign in to add items to cart');
      return;
    }

    try {
      const response = await cartApi.addItem({ item_id: itemId, quantity });
      // Update cart from response
      setCart(response.data.data || response.data);
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to add to cart';
      throw new Error(errorMessage);
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    if (!user) return;

    try {
      const response = await cartApi.updateItem(cartItemId, { quantity });
      // Update cart from response
      setCart(response.data.data || response.data);
    } catch (error) {
      console.error('Error updating cart item:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update cart';
      throw new Error(errorMessage);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!user) return;

    try {
      const response = await cartApi.removeItem(cartItemId);
      // Update cart from response
      setCart(response.data.data || response.data);
    } catch (error) {
      console.error('Error removing from cart:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to remove item';
      throw new Error(errorMessage);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const response = await cartApi.clear();
      // Update cart from response
      setCart(response.data.data || response.data);
    } catch (error) {
      console.error('Error clearing cart:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to clear cart';
      throw new Error(errorMessage);
    }
  };

  const getCartTotal = () => {
    // Handle both old format (item.items.price) and new format (item.price)
    return cart.items.reduce((total, item) => {
      const price = item.price || item.items?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    refreshCart: fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

