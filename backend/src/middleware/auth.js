const JWTService = require('../utils/jwt');
const User = require('../models/User');
const SessionService = require('../services/sessionService');

// Middleware to check if user is authenticated via JWT
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    // Extract and verify JWT token
    const token = JWTService.extractTokenFromHeader(authHeader);
    const decoded = JWTService.verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Validate session if sessionId is present
    if (decoded.sessionId) {
      const isValidSession = await SessionService.validateSession(decoded.userId, decoded.sessionId);
      if (!isValidSession) {
        return res.status(401).json({ error: 'Session expired or invalid' });
      }
    }

    // Attach user to request object
    req.user = user;
    req.token = decoded;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Middleware to check if user has Instagram access token
const requireInstagramToken = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!req.user.accessToken) {
      return res.status(401).json({ error: 'Instagram access token required' });
    }

    next();
  } catch (error) {
    console.error('Instagram token check error:', error.message);
    res.status(401).json({ error: 'Instagram authentication required' });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next(); // Continue without authentication
    }

    // Extract and verify JWT token
    const token = JWTService.extractTokenFromHeader(authHeader);
    const decoded = JWTService.verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    if (user) {
      req.user = user;
      req.token = decoded;
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

module.exports = {
  requireAuth,
  requireInstagramToken,
  optionalAuth
}; 