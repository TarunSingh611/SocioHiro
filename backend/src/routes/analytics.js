const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { requireAuth } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(requireAuth);

// Get comprehensive dashboard analytics
router.get('/dashboard', analyticsController.getDashboardAnalytics);

// Get specific analytics
router.get('/orders', analyticsController.getOrderAnalytics);
router.get('/products', analyticsController.getProductAnalytics);
router.get('/engagement', analyticsController.getEngagementAnalytics);
router.get('/revenue', analyticsController.getRevenueAnalytics);

// Get time-based analytics
router.get('/time-based', analyticsController.getTimeBasedAnalytics);

// Get summary metrics
router.get('/summary', analyticsController.getSummaryMetrics);

// Export analytics (CSV)
router.get('/export', analyticsController.exportAnalytics);

// Get analytics comparison
router.get('/comparison', analyticsController.getAnalyticsComparison);

module.exports = router; 