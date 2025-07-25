const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { requireAuth } = require('../middleware/auth');

// Development-only mock data route (no auth required)
if (process.env.NODE_ENV === 'development') {
  router.get('/summary', (req, res) => {
    res.json({
      totalProducts: 156,
      totalOrders: 1247,
      totalRevenue: 45678.9,
      totalCustomers: 892,
      conversionRate: 3.2,
      avgOrderValue: 36.67,
    });
  });
} else {
  // Apply authentication middleware to all routes in production
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
}

module.exports = router; 