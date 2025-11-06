import express from 'express';
import multer from 'multer';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  updateStock
} from '../controllers/itemsController.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// Configure multer for image upload (memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'));
    }
  }
});

// Public routes
router.get('/', getAllItems);
router.get('/:id', getItemById);

// Admin only routes
router.post('/', isAdmin, upload.single('image'), createItem);
router.put('/:id', isAdmin, upload.single('image'), updateItem);
router.delete('/:id', isAdmin, deleteItem);
router.patch('/:id/stock', isAdmin, updateStock);

export default router;
