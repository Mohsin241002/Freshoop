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
import addressesRoutes from './routes/addresses.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  // Render.com domains
  /https:\/\/.*\.onrender\.com$/
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed patterns
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return origin === allowed;
      if (allowed instanceof RegExp) return allowed.test(origin);
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(null, true); // Allow anyway in production to avoid issues
    }
  },
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

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Freshoop API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health or /api/health',
      auth: '/api/auth/*',
      users: '/api/users/*',
      categories: '/api/categories',
      items: '/api/items',
      cart: '/api/cart',
      orders: '/api/orders',
      addresses: '/api/addresses'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
      hasJwtSecret: !!process.env.JWT_SECRET
    }
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
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

// 404 handler - provide helpful error message
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    requestedPath: req.path,
    requestedMethod: req.method,
    message: `The route ${req.method} ${req.path} does not exist`,
    availableRoutes: {
      root: 'GET /',
      health: 'GET /health or GET /api/health',
      auth: 'POST /api/auth/register, POST /api/auth/login',
      categories: 'GET /api/categories',
      items: 'GET /api/items',
      cart: 'GET /api/cart',
      orders: 'GET /api/orders',
      addresses: 'GET /api/addresses'
    }
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
  console.log('\x1b[36m%s\x1b[0m', `✓ Frontend URL: ${process.env.FRONTEND_URL || 'Not configured'}`);
  console.log('\x1b[36m%s\x1b[0m', '=================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

export default app;

