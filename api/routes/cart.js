import express from 'express';
import {
  getUserCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All cart routes are protected - require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/cart
 * @desc    Get user's cart with all items and total
 * @access  Protected
 */
router.get('/', getUserCart);

/**
 * @route   POST /api/cart/items
 * @desc    Add item to cart (or increase quantity if already exists)
 * @access  Protected
 * @body    { item_id: string, quantity: number }
 */
router.post('/items', addItemToCart);

/**
 * @route   PUT /api/cart/items/:cartItemId
 * @desc    Update cart item quantity (set to 0 to remove)
 * @access  Protected
 * @body    { quantity: number }
 */
router.put('/items/:cartItemId', updateCartItem);

/**
 * @route   DELETE /api/cart/items/:cartItemId
 * @desc    Remove item from cart
 * @access  Protected
 */
router.delete('/items/:cartItemId', removeCartItem);

/**
 * @route   DELETE /api/cart
 * @desc    Clear entire cart (remove all items)
 * @access  Protected
 */
router.delete('/', clearCart);

export default router;
