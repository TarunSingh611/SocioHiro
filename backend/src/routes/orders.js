const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAuth, requireInstagramToken } = require('../middleware/auth');

// Development-only mock data routes (no auth required)
if (process.env.NODE_ENV === 'development') {
  router.get('/recent', (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const mockOrders = Array.from({ length: limit }, (_, i) => ({
      _id: `order_${i + 1}`,
      total: Math.floor(Math.random() * 200) + 20,
      status: ["completed", "pending", "processing"][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      customer: `Customer ${i + 1}`,
    }));
    res.json(mockOrders);
  });
} else {
  // Apply authentication middleware to all routes in production
  router.use(requireAuth);

  // Get all orders
  router.get('/', orderController.getOrders);

  // Get single order
  router.get('/:id', orderController.getOrder);

  // Create new order
  router.post('/', orderController.createOrder);

  // Update order status
  router.put('/:id/status', orderController.updateOrderStatus);

  // Get order status options
  router.get('/status/options', orderController.getOrderStatusOptions);

  // Get orders by status
  router.get('/status/:status', orderController.getOrdersByStatus);

  // Get recent orders
  router.get('/recent', orderController.getRecentOrders);

  // Get order analytics
  router.get('/analytics', orderController.getOrderAnalytics);

  // Sync routes (require Instagram token)
  router.use(requireInstagramToken);

  // Sync orders from Instagram
  router.get('/sync/from-instagram', orderController.syncOrdersFromInstagram);
}

module.exports = router; 