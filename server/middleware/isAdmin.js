import { authenticateToken } from './auth.js';

/**
 * Admin authorization middleware
 * Checks if authenticated user is an admin
 * Must be used after authenticateToken middleware
 */
export const isAdmin = [
  authenticateToken,
  (req, res, next) => {
    try {
      const userEmail = req.user.email;
      
      // Get admin emails from environment variable
      const adminEmails = process.env.ADMIN_EMAILS 
        ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase())
        : [];

      if (!adminEmails.length) {
        console.warn('⚠️  No admin emails configured in ADMIN_EMAILS environment variable');
        return res.status(500).json({
          success: false,
          error: 'Admin configuration error'
        });
      }

      // Check if user email is in admin list
      if (!adminEmails.includes(userEmail.toLowerCase())) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. Admin privileges required.'
        });
      }

      // User is admin, continue
      next();
    } catch (error) {
      console.error('Admin check error:', error);
      res.status(500).json({
        success: false,
        error: 'Authorization check failed'
      });
    }
  }
];

/**
 * Optional admin check - doesn't fail if user is not admin
 * Attaches isAdmin flag to req object
 */
export const checkAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      req.isAdmin = false;
      return next();
    }

    const userEmail = req.user.email;
    const adminEmails = process.env.ADMIN_EMAILS 
      ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase())
      : [];

    req.isAdmin = adminEmails.includes(userEmail.toLowerCase());
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    req.isAdmin = false;
    next();
  }
};

