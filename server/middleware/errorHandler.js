/**
 * Global error handler middleware
 * Catches all errors and sends appropriate response
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Supabase specific errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        statusCode = 409;
        message = 'Resource already exists';
        break;
      case '23503': // Foreign key violation
        statusCode = 400;
        message = 'Invalid reference';
        break;
      case '23502': // Not null violation
        statusCode = 400;
        message = 'Required field missing';
        break;
      case 'PGRST116': // No rows returned
        statusCode = 404;
        message = 'Resource not found';
        break;
      default:
        message = 'Database error';
    }
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

