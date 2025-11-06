import express from 'express';
import {
  processCheckout,
  getUserOrders,
  getOrderByNumber,
  getAllOrders,
  updateOrderStatus
} from '../controllers/ordersController.js';
import { authenticateToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/orders/checkout
 * @desc    Process checkout - create order from cart
 * @access  Protected
 */
router.post('/checkout', processCheckout);

/**
 * @route   GET /api/orders
 * @desc    Get user's order history
 * @access  Protected
 */
router.get('/', getUserOrders);

/**
 * @route   GET /api/orders/admin/all
 * @desc    Get all orders (admin only)
 * @access  Admin
 */
router.get('/admin/all', isAdmin, getAllOrders);

/**
 * @route   GET /api/orders/:orderNumber
 * @desc    Get specific order by order number
 * @access  Protected (user must own the order)
 */
router.get('/:orderNumber', getOrderByNumber);

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order status (admin only)
 * @access  Admin
 */
router.patch('/:id/status', isAdmin, updateOrderStatus);

export default router;
