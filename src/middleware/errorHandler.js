/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);
  
  // Handle specific LiveKit errors
  if (err.code === 'not_found') {
    return res.status(404).json({ error: 'Room not found or no active participants yet.' });
  }
  
  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;