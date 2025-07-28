const express = require('express');
const router = express.Router();
const automationController = require('../controllers/automationController');
const { requireAuth } = require('../middleware/auth');

// All routes require authentication
router.use(requireAuth);

// Get all automations
router.get('/', automationController.getAutomations);

// Get automation statistics
router.get('/stats', automationController.getAutomationStats);

// Get automation analytics
router.get('/analytics', automationController.getAutomationAnalytics);

// Get automation logs
router.get('/logs', automationController.getAutomationLogs);

// Export automation template
router.get('/template', automationController.exportAutomationTemplate);

// Create new automation
router.post('/', automationController.createAutomation);

// Bulk operations
router.post('/bulk/update', automationController.bulkUpdateAutomations);
router.post('/bulk/delete', automationController.bulkDeleteAutomations);

// Get automation by ID
router.get('/:id', automationController.getAutomationById);

// Update automation
router.put('/:id', automationController.updateAutomation);

// Delete automation
router.delete('/:id', automationController.deleteAutomation);

// Toggle automation status
router.patch('/:id/toggle', automationController.toggleAutomationStatus);

// Test automation
router.post('/:id/test', automationController.testAutomation);

module.exports = router; 