import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import middleware
import { requestLogger, errorLogger } from '../server/middleware/logger.js';
import { errorHandler } from '../server/middleware/errorHandler.js';
import { sanitizeInput } from '../server/middleware/validation.js';

// Import routes
import authRoutes from '../server/routes/auth.js';
import usersRoutes from '../server/routes/users.js';
import categoriesRoutes from '../server/routes/categories.js';
import itemsRoutes from '../server/routes/items.js';
import cartRoutes from '../server/routes/cart.js';
import ordersRoutes from '../server/routes/orders.js';
import addressesRoutes from '../server/routes/addresses.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);
app.use(requestLogger);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/addresses', addressesRoutes);

// Error handling middleware
app.use(errorLogger);
app.use(errorHandler);

export default app;
