const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  // Default error
  let error = { ...err };
  error.message = err.message;

  // Validation error
  if (err.name === 'ValidationError') {
    const message = 'Validation Error';
    error = {
      statusCode: 400,
      message,
      errors: Object.values(err.errors).map(val => ({
        field: val.path,
        message: val.message
      }))
    };
  }

  // Cast error
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      statusCode: 404,
      message
    };
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = {
      statusCode: 400,
      message
    };
  }

  // File upload error
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File size too large';
    error = {
      statusCode: 400,
      message
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(error.errors && { errors: error.errors })
  });
};

module.exports = { errorHandler };
