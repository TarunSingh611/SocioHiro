const OrderService = require('../services/orderService');
const { requireAuth, requireInstagramToken } = require('../middleware/auth');

class OrderController {
  // Get all orders for user
  async getOrders(req, res) {
    try {
      const orderService = new OrderService(req.user);
      const orders = await orderService.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get single order
  async getOrder(req, res) {
    try {
      const orderService = new OrderService(req.user);
      const order = await orderService.getOrder(req.params.id);
      res.json(order);
    } catch (error) {
      if (error.message === 'Order not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // Create new order
  async createOrder(req, res) {
    try {
      const orderService = new OrderService(req.user);
      const order = await orderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update order status
  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }
      
      const orderService = new OrderService(req.user);
      const order = await orderService.updateOrderStatus(req.params.id, status);
      res.json(order);
    } catch (error) {
      if (error.message === 'Order not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // Sync orders from Instagram
  async syncOrdersFromInstagram(req, res) {
    try {
      const orderService = new OrderService(req.user);
      const results = await orderService.syncOrdersFromInstagram();
      res.json({ results });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get order analytics
  async getOrderAnalytics(req, res) {
    try {
      const orderService = new OrderService(req.user);
      const analytics = await orderService.getOrderAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get order status options
  async getOrderStatusOptions(req, res) {
    const statusOptions = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    ];
    res.json(statusOptions);
  }

  // Get orders by status
  async getOrdersByStatus(req, res) {
    try {
      const { status } = req.params;
      const orderService = new OrderService(req.user);
      const orders = await orderService.getOrders();
      
      const filteredOrders = orders.filter(order => order.status === status);
      res.json(filteredOrders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get recent orders
  async getRecentOrders(req, res) {
    try {
      const { limit = 10 } = req.query;
      const orderService = new OrderService(req.user);
      const orders = await orderService.getOrders();
      
      const recentOrders = orders.slice(0, parseInt(limit));
      res.json(recentOrders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new OrderController(); 