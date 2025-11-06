import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress
} from '../controllers/addressController.js';

const router = express.Router();

// All address routes require authentication
router.use(authenticateToken);

// Get default address
router.get('/default', getDefaultAddress);

// Get all user addresses
router.get('/', getUserAddresses);

// Get specific address
router.get('/:id', getAddressById);

// Create new address
router.post('/', createAddress);

// Update address
router.put('/:id', updateAddress);

// Delete address
router.delete('/:id', deleteAddress);

// Set address as default
router.patch('/:id/default', setDefaultAddress);

export default router;
