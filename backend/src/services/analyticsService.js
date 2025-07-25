const InstagramApiService = require('./instagramApi');
const Order = require('../models/Order');
const Product = require('../models/Product');

class AnalyticsService {
  constructor(user) {
    this.user = user;
    this.instagramApi = new InstagramApiService(user.accessToken);
  }

  // Get comprehensive analytics dashboard data
  async getDashboardAnalytics() {
    try {
      const [
        orderAnalytics,
        productAnalytics,
        engagementAnalytics,
        revenueAnalytics
      ] = await Promise.all([
        this.getOrderAnalytics(),
        this.getProductAnalytics(),
        this.getEngagementAnalytics(),
        this.getRevenueAnalytics()
      ]);

      return {
        orders: orderAnalytics,
        products: productAnalytics,
        engagement: engagementAnalytics,
        revenue: revenueAnalytics,
        summary: this.generateSummary(orderAnalytics, productAnalytics, engagementAnalytics, revenueAnalytics)
      };
    } catch (error) {
      throw new Error(`Failed to get dashboard analytics: ${error.message}`);
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
        monthlyOrders: {},
        monthlyRevenue: {}
      };

      // Calculate status breakdown
      orders.forEach(order => {
        analytics.statusBreakdown[order.status] = (analytics.statusBreakdown[order.status] || 0) + 1;
      });

      // Calculate monthly data
      orders.forEach(order => {
        const month = order.createdAt.toISOString().slice(0, 7); // YYYY-MM
        analytics.monthlyOrders[month] = (analytics.monthlyOrders[month] || 0) + 1;
        analytics.monthlyRevenue[month] = (analytics.monthlyRevenue[month] || 0) + order.total;
      });

      return analytics;
    } catch (error) {
      throw new Error(`Failed to get order analytics: ${error.message}`);
    }
  }

  // Get product analytics
  async getProductAnalytics() {
    try {
      const products = await Product.find({ userId: this.user._id });
      const orders = await Order.find({ userId: this.user._id }).populate('products.productId');

      const analytics = {
        totalProducts: products.length,
        activeProducts: products.filter(p => p.stock > 0).length,
        lowStockProducts: products.filter(p => p.stock > 0 && p.stock <= 5).length,
        outOfStockProducts: products.filter(p => p.stock === 0).length,
        topSellingProducts: [],
        categoryBreakdown: {},
        priceRangeBreakdown: {}
      };

      // Calculate top selling products
      const productSales = {};
      orders.forEach(order => {
        order.products.forEach(product => {
          const productId = product.productId.toString();
          if (!productSales[productId]) {
            productSales[productId] = { quantity: 0, revenue: 0 };
          }
          productSales[productId].quantity += product.quantity;
          productSales[productId].revenue += product.price * product.quantity;
        });
      });

      // Get top selling products
      const topProducts = Object.entries(productSales)
        .sort(([,a], [,b]) => b.quantity - a.quantity)
        .slice(0, 10);

      for (const [productId, sales] of topProducts) {
        const product = products.find(p => p._id.toString() === productId);
        if (product) {
          analytics.topSellingProducts.push({
            product,
            sales: sales.quantity,
            revenue: sales.revenue
          });
        }
      }

      // Calculate category breakdown
      products.forEach(product => {
        const category = product.category || 'Uncategorized';
        analytics.categoryBreakdown[category] = (analytics.categoryBreakdown[category] || 0) + 1;
      });

      // Calculate price range breakdown
      products.forEach(product => {
        let priceRange = 'Unknown';
        if (product.price <= 10) priceRange = '$0-$10';
        else if (product.price <= 25) priceRange = '$11-$25';
        else if (product.price <= 50) priceRange = '$26-$50';
        else if (product.price <= 100) priceRange = '$51-$100';
        else priceRange = '$100+';
        
        analytics.priceRangeBreakdown[priceRange] = (analytics.priceRangeBreakdown[priceRange] || 0) + 1;
      });

      return analytics;
    } catch (error) {
      throw new Error(`Failed to get product analytics: ${error.message}`);
    }
  }

  // Get engagement analytics (Instagram posts, stories, etc.)
  async getEngagementAnalytics() {
    try {
      // Note: This would require Instagram Graph API permissions for insights
      // For now, we'll return mock data structure
      const analytics = {
        totalPosts: 0,
        totalStories: 0,
        totalReels: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        averageEngagementRate: 0,
        topPerformingContent: [],
        engagementTrend: {},
        contentTypeBreakdown: {
          posts: 0,
          stories: 0,
          reels: 0
        }
      };

      // Mock data for demonstration
      analytics.totalPosts = 25;
      analytics.totalStories = 15;
      analytics.totalReels = 8;
      analytics.totalLikes = 1250;
      analytics.totalComments = 89;
      analytics.totalShares = 45;
      analytics.averageEngagementRate = 3.2;

      return analytics;
    } catch (error) {
      throw new Error(`Failed to get engagement analytics: ${error.message}`);
    }
  }

  // Get revenue analytics
  async getRevenueAnalytics() {
    try {
      const orders = await Order.find({ userId: this.user._id });
      
      const analytics = {
        totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
        averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
        revenueGrowth: 0,
        monthlyRevenue: {},
        revenueByProduct: {},
        revenueByStatus: {}
      };

      // Calculate monthly revenue
      orders.forEach(order => {
        const month = order.createdAt.toISOString().slice(0, 7);
        analytics.monthlyRevenue[month] = (analytics.monthlyRevenue[month] || 0) + order.total;
      });

      // Calculate revenue by status
      orders.forEach(order => {
        analytics.revenueByStatus[order.status] = (analytics.revenueByStatus[order.status] || 0) + order.total;
      });

      // Calculate revenue by product
      orders.forEach(order => {
        order.products.forEach(product => {
          const productId = product.productId.toString();
          analytics.revenueByProduct[productId] = (analytics.revenueByProduct[productId] || 0) + (product.price * product.quantity);
        });
      });

      // Calculate revenue growth (comparing current month to previous month)
      const months = Object.keys(analytics.monthlyRevenue).sort();
      if (months.length >= 2) {
        const currentMonth = months[months.length - 1];
        const previousMonth = months[months.length - 2];
        const currentRevenue = analytics.monthlyRevenue[currentMonth];
        const previousRevenue = analytics.monthlyRevenue[previousMonth];
        
        if (previousRevenue > 0) {
          analytics.revenueGrowth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
        }
      }

      return analytics;
    } catch (error) {
      throw new Error(`Failed to get revenue analytics: ${error.message}`);
    }
  }

  // Generate summary metrics
  generateSummary(orderAnalytics, productAnalytics, engagementAnalytics, revenueAnalytics) {
    return {
      totalRevenue: revenueAnalytics.totalRevenue,
      totalOrders: orderAnalytics.totalOrders,
      totalProducts: productAnalytics.totalProducts,
      averageOrderValue: orderAnalytics.averageOrderValue,
      engagementRate: engagementAnalytics.averageEngagementRate,
      revenueGrowth: revenueAnalytics.revenueGrowth
    };
  }

  // Get time-based analytics (daily, weekly, monthly)
  async getTimeBasedAnalytics(timeframe = 'monthly') {
    try {
      const orders = await Order.find({ userId: this.user._id });
      const analytics = {};

      orders.forEach(order => {
        let timeKey;
        const date = new Date(order.createdAt);
        
        switch (timeframe) {
          case 'daily':
            timeKey = date.toISOString().slice(0, 10); // YYYY-MM-DD
            break;
          case 'weekly':
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            timeKey = weekStart.toISOString().slice(0, 10);
            break;
          case 'monthly':
          default:
            timeKey = date.toISOString().slice(0, 7); // YYYY-MM
            break;
        }

        if (!analytics[timeKey]) {
          analytics[timeKey] = {
            orders: 0,
            revenue: 0,
            averageOrderValue: 0
          };
        }

        analytics[timeKey].orders += 1;
        analytics[timeKey].revenue += order.total;
      });

      // Calculate average order value for each time period
      Object.keys(analytics).forEach(key => {
        if (analytics[key].orders > 0) {
          analytics[key].averageOrderValue = analytics[key].revenue / analytics[key].orders;
        }
      });

      return analytics;
    } catch (error) {
      throw new Error(`Failed to get time-based analytics: ${error.message}`);
    }
  }
}

module.exports = AnalyticsService; 