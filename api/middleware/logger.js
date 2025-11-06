/**
 * Request logging middleware
 * Logs all incoming requests with timestamp, method, path, and response time
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // Red for errors, green for success
    const resetColor = '\x1b[0m';
    
    console.log(
      `${logColor}[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} - ${duration}ms${resetColor}`
    );
  });
  
  next();
};

/**
 * Error logging middleware
 * Logs detailed error information
 */
export const errorLogger = (err, req, res, next) => {
  console.error('\x1b[31m[ERROR]\x1b[0m', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
  
  next(err);
};

