const express = require('express');
const router = express.Router();
const instagramAccountController = require('../controllers/instagramAccountController');
const { requireAuth, requireInstagramToken } = require('../middleware/auth');

// Development-only mock data routes (no auth required)
if (process.env.NODE_ENV === 'development') {
  router.get('/accounts', (req, res) => {
    const mockAccounts = [
      {
        _id: "1",
        username: "@yourbrand",
        followers: 12500,
        isConnected: true,
        accountType: "BUSINESS",
        profilePic: null,
        lastSync: new Date().toISOString()
      }
    ];
    res.json(mockAccounts);
  });
} else {
  // Apply authentication middleware to all routes in production
  router.use(requireAuth);

  // Multi-account management routes
  router.get('/accounts', instagramAccountController.getAccounts);
  router.get('/accounts/:id', instagramAccountController.getAccount);
  router.post('/accounts', instagramAccountController.addAccount);
  router.put('/accounts/:id', instagramAccountController.updateAccount);
  router.delete('/accounts/:id', instagramAccountController.deleteAccount);
  router.put('/accounts/:id/toggle', instagramAccountController.toggleAccountStatus);
  router.put('/accounts/:id/refresh', instagramAccountController.refreshAccountTokens);
  router.get('/accounts/:id/analytics', instagramAccountController.getAccountAnalytics);

  // Primary account management
  router.get('/accounts/primary', instagramAccountController.getPrimaryAccount);
  router.put('/accounts/:id/primary', instagramAccountController.setPrimaryAccount);
  router.get('/accounts/status', instagramAccountController.getConnectionStatus);

  // Instagram-specific endpoints (require Instagram token)
  router.use(requireInstagramToken);

  // Check token status and validity
  router.get('/token-status', async (req, res) => {
    try {
      const InstagramApiService = require('../services/instagramApi');
      const instagramApi = new InstagramApiService(req.user.accessToken);
      
      const tokenInfo = await instagramApi.getTokenInfo();
      const isValid = await instagramApi.isTokenValid();
      
      res.json({
        isValid,
        tokenInfo,
        message: isValid ? 'Token is valid' : 'Token is invalid or expired'
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to check token status',
        details: error.message 
      });
    }
  });

  // TODO: Add Instagram-specific endpoints here
  router.get('/', (req, res) => {
    res.json({ message: 'Instagram route placeholder' });
  });
}

module.exports = router; 