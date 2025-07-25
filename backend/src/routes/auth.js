const express = require('express');
const router = express.Router();
const instagramOAuthRoutes = require('./instagramOAuth.js');

router.use('/instagram', instagramOAuthRoutes);

// Check if user is authenticated
router.get('/status', (req, res) => {
  res.json({ 
    authenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? {
      id: req.user._id,
      instagramId: req.user.instagramId,
      username: req.user.username
    } : null
  });
});

module.exports = router; 