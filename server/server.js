import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import middleware
import { requestLogger, errorLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sanitizeInput } from './middleware/validation.js';

// Import routes
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import categoriesRoutes from './routes/categories.js';
import itemsRoutes from './routes/items.js';
import cartRoutes from './routes/cart.js';
import ordersRoutes from './routes/orders.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

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
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorLogger);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('\x1b[36m%s\x1b[0m', '=================================');
  console.log('\x1b[32m%s\x1b[0m', `✓ Server running on port ${PORT}`);
  console.log('\x1b[36m%s\x1b[0m', `✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\x1b[36m%s\x1b[0m', `✓ Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('\x1b[36m%s\x1b[0m', '=================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

export default app;

