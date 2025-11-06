import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';

// Import middleware
import { requestLogger, errorLogger } from '../../server/middleware/logger.js';
import { errorHandler } from '../../server/middleware/errorHandler.js';
import { sanitizeInput } from '../../server/middleware/validation.js';

// Import routes
import authRoutes from '../../server/routes/auth.js';
import usersRoutes from '../../server/routes/users.js';
import categoriesRoutes from '../../server/routes/categories.js';
import itemsRoutes from '../../server/routes/items.js';
import cartRoutes from '../../server/routes/cart.js';
import ordersRoutes from '../../server/routes/orders.js';
import addressesRoutes from '../../server/routes/addresses.js';

// Load environment variables
dotenv.config();

// Log environment check (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log('Environment variables check:');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Missing');
  console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'Set' : 'Missing');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');
}

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: true,
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
    timestamp: new Date().toISOString(),
    env: {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV
    }
  });
});

// Debug endpoint (remove after testing)
app.get('/api/debug/env', (req, res) => {
  res.status(200).json({
    success: true,
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL ? 'Set' : 'Missing',
      SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? 'Set (starts with: ' + process.env.SUPABASE_SERVICE_KEY?.substring(0, 10) + '...)' : 'Missing',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Missing',
      ADMIN_EMAILS: process.env.ADMIN_EMAILS || 'Missing',
      NODE_ENV: process.env.NODE_ENV || 'Not set'
    }
  });
});

// API Routes - Note: Netlify functions are served at /.netlify/functions/api
// So routes should be relative to /api
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

// Export as Netlify serverless function
export const handler = serverless(app);
