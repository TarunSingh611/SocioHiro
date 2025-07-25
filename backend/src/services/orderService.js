const InstagramApiService = require('./instagramApi');
const Order = require('../models/Order');
const Product = require('../models/Product');

class OrderService {
  constructor(user) {
    this.user = user;
    this.instagramApi = new InstagramApiService(user.accessToken);
  }

  // Fetch orders from Instagram
  async fetchOrdersFromInstagram() {
    try {
      const instagramBusinessAccountId = await this.instagramApi.getInstagramBusinessAccount();
      
      // Note: Instagram Graph API doesn't directly provide order endpoints
      // This would typically integrate with Facebook Commerce or external systems
      // For now, we'll create a placeholder structure
      
      const mockOrders = [
        {
          instagramOrderId: 'mock_order_1',
          products: [
            {
              productId: 'mock_product_1',
              quantity: 2,
              price: 29.99
            }
          ],
          total: 59.98,
          status: 'pending',
          createdAt: new Date()
        }
      ];
      
      return mockOrders;
    } catch (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  }

  // Create local order
  async createOrder(orderData) {
    try {
      const order = new Order({
        ...orderData,
        userId: this.user._id
      });
      
      await order.save();
      return order;
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  // Get all orders for user
  async getOrders() {
    try {
      const orders = await Order.find({ userId: this.user._id })
        .populate('products.productId')
        .sort({ createdAt: -1 });
      
      return orders;
    } catch (error) {
      throw new Error(`Failed to get orders: ${error.message}`);
    }
  }

  // Get single order
  async getOrder(orderId) {
    try {
      const order = await Order.findOne({ 
        _id: orderId, 
        userId: this.user._id 
      }).populate('products.productId');
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    } catch (error) {
      throw new Error(`Failed to get order: ${error.message}`);
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const order = await Order.findOneAndUpdate(
        { _id: orderId, userId: this.user._id },
        { status, updatedAt: new Date() },
        { new: true }
      ).populate('products.productId');
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    } catch (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }

  // Sync orders from Instagram
  async syncOrdersFromInstagram() {
    try {
      const instagramOrders = await this.fetchOrdersFromInstagram();
      const results = [];
      
      for (const instagramOrder of instagramOrders) {
        try {
          // Check if order already exists
          let localOrder = await Order.findOne({ 
            instagramOrderId: instagramOrder.instagramOrderId,
            userId: this.user._id
          });
          
          if (!localOrder) {
            // Create new local order
            localOrder = new Order({
              instagramOrderId: instagramOrder.instagramOrderId,
              products: instagramOrder.products,
              total: instagramOrder.total,
              status: instagramOrder.status,
              userId: this.user._id
            });
          } else {
            // Update existing order
            localOrder.products = instagramOrder.products;
            localOrder.total = instagramOrder.total;
            localOrder.status = instagramOrder.status;
            localOrder.updatedAt = new Date();
          }
          
          await localOrder.save();
          results.push({ success: true, order: localOrder });
        } catch (error) {
          results.push({ success: false, order: instagramOrder.instagramOrderId, error: error.message });
        }
      }
      
      return results;
    } catch (error) {
      throw new Error(`Order sync failed: ${error.message}`);
    }
  }

  // Get order analytics
  async getOrderAnalytics() {
    try {
      const orders = await Order.find({ userId: this.user._id });
      
      const analytics = {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
        averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
        statusBreakdown: {},
        monthlyRevenue: {},
        topProducts: {}
      };
      
      // Calculate status breakdown
      orders.forEach(order => {
        analytics.statusBreakdown[order.status] = (analytics.statusBreakdown[order.status] || 0) + 1;
      });
      
      // Calculate monthly revenue
      orders.forEach(order => {
        const month = order.createdAt.toISOString().slice(0, 7); // YYYY-MM
        analytics.monthlyRevenue[month] = (analytics.monthlyRevenue[month] || 0) + order.total;
      });
      
      // Calculate top products
      orders.forEach(order => {
        order.products.forEach(product => {
          const productId = product.productId.toString();
          analytics.topProducts[productId] = (analytics.topProducts[productId] || 0) + product.quantity;
        });
      });
      
      return analytics;
    } catch (error) {
      throw new Error(`Failed to get analytics: ${error.message}`);
    }
  }
}

module.exports = OrderService; 