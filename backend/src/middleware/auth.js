// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

// Middleware to check if user has Instagram access token
const requireInstagramToken = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (!req.user.accessToken) {
    return res.status(403).json({ error: 'Instagram access token required' });
  }
  
  next();
};

module.exports = {
  requireAuth,
  requireInstagramToken
}; 