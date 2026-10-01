const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: status === 500 ? 'Server Error' : 'Error',
    message: process.env.NODE_ENV === 'production' && status === 500 
      ? 'An unexpected error occurred' 
      : message
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
