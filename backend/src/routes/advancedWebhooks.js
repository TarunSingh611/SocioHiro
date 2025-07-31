const express = require('express');
const router = express.Router();
const {
  verifyWebhookSignature,
  handleWebhookVerification,
  handleAdvancedWebhookEvent,
  getAdvancedWebhookConfig,
  testAdvancedWebhook
} = require('../controllers/advancedWebhooksController');

// Advanced webhook verification endpoint
router.get('/instagram/advanced', handleWebhookVerification);

// Advanced webhook event processing endpoint
router.post('/instagram/advanced', verifyWebhookSignature, handleAdvancedWebhookEvent);

// Get advanced webhook configuration
router.get('/instagram/advanced/config', getAdvancedWebhookConfig);

// Test advanced webhook functionality
router.post('/instagram/advanced/test', testAdvancedWebhook);

module.exports = router; 