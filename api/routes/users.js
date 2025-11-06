import express from 'express';
import {
  createUser,
  getProfile,
  updateProfile,
  getUserById,
  deleteAccount
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create/upsert user (public - called during signup/login)
router.post('/', createUser);

// Protected routes - require authentication
router.use(authenticateToken);

// User profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.delete('/profile', deleteAccount);

// Get user by ID
router.get('/:id', getUserById);

export default router;
