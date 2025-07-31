const express = require('express');
const router = express.Router();
const instagramAccountController = require('../controllers/instagramAccountController');
const { requireAuth } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(requireAuth);

// Get current user's Instagram account
router.get('/current', instagramAccountController.getCurrentAccount);

// Connect Instagram account
router.post('/connect', instagramAccountController.connectAccount);

// Disconnect Instagram account
router.delete('/disconnect', instagramAccountController.disconnectAccount);

// Refresh Instagram tokens
router.post('/refresh-tokens', instagramAccountController.refreshTokens);

// Get connection status
router.get('/status', instagramAccountController.getConnectionStatus);

// Get account analytics
router.get('/analytics', instagramAccountController.getAccountAnalytics);

// Update account settings
router.put('/settings', instagramAccountController.updateAccountSettings);

module.exports = router; 