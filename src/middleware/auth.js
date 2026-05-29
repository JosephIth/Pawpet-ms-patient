const jwt = require('jsonwebtoken');
const axios = require('axios');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify token by calling auth service
    const authResponse = await axios.get(
      `${process.env.AUTH_SERVICE_URL || 'http://localhost:3001'}/api/auth/verify`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!authResponse.data.success) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Add user info to request
    req.user = authResponse.data.data.user;
    next();
  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication service unavailable'
    });
  }
};

module.exports = { authMiddleware };
