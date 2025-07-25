const AnalyticsService = require('../services/analyticsService');
const { requireAuth } = require('../middleware/auth');

class AnalyticsController {
  // Get comprehensive dashboard analytics
  async getDashboardAnalytics(req, res) {
    try {
      const analyticsService = new AnalyticsService(req.user);
      const analytics = await analyticsService.getDashboardAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get order analytics
  async getOrderAnalytics(req, res) {
    try {
      const analyticsService = new AnalyticsService(req.user);
      const analytics = await analyticsService.getOrderAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get product analytics
  async getProductAnalytics(req, res) {
    try {
      const analyticsService = new AnalyticsService(req.user);
      const analytics = await analyticsService.getProductAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get engagement analytics
  async getEngagementAnalytics(req, res) {
    try {
      const analyticsService = new AnalyticsService(req.user);
      const analytics = await analyticsService.getEngagementAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get revenue analytics
  async getRevenueAnalytics(req, res) {
    try {
      const analyticsService = new AnalyticsService(req.user);
      const analytics = await analyticsService.getRevenueAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get time-based analytics
  async getTimeBasedAnalytics(req, res) {
    try {
      const { timeframe = 'monthly' } = req.query;
      const analyticsService = new AnalyticsService(req.user);
      const analytics = await analyticsService.getTimeBasedAnalytics(timeframe);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get summary metrics
  async getSummaryMetrics(req, res) {
    try {
      const analyticsService = new AnalyticsService(req.user);
      const [orderAnalytics, productAnalytics, engagementAnalytics, revenueAnalytics] = await Promise.all([
        analyticsService.getOrderAnalytics(),
        analyticsService.getProductAnalytics(),
        analyticsService.getEngagementAnalytics(),
        analyticsService.getRevenueAnalytics()
      ]);

      const summary = analyticsService.generateSummary(
        orderAnalytics,
        productAnalytics,
        engagementAnalytics,
        revenueAnalytics
      );

      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get analytics export (CSV format)
  async exportAnalytics(req, res) {
    try {
      const { type = 'orders', timeframe = 'monthly' } = req.query;
      const analyticsService = new AnalyticsService(req.user);
      
      let data;
      switch (type) {
        case 'orders':
          data = await analyticsService.getOrderAnalytics();
          break;
        case 'products':
          data = await analyticsService.getProductAnalytics();
          break;
        case 'revenue':
          data = await analyticsService.getRevenueAnalytics();
          break;
        case 'time-based':
          data = await analyticsService.getTimeBasedAnalytics(timeframe);
          break;
        default:
          return res.status(400).json({ error: 'Invalid analytics type' });
      }

      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${type}_analytics.csv"`);

      // Convert data to CSV format (simplified)
      const csvData = this.convertToCSV(data);
      res.send(csvData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Helper method to convert data to CSV format
  convertToCSV(data) {
    if (typeof data === 'object' && data !== null) {
      const rows = [];
      
      // Add headers
      const headers = Object.keys(data);
      rows.push(headers.join(','));
      
      // Add data row
      const values = headers.map(header => {
        const value = data[header];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      rows.push(values.join(','));
      
      return rows.join('\n');
    }
    
    return JSON.stringify(data);
  }

  // Get analytics comparison (compare different time periods)
  async getAnalyticsComparison(req, res) {
    try {
      const { period1, period2 } = req.query;
      const analyticsService = new AnalyticsService(req.user);
      
      const [analytics1, analytics2] = await Promise.all([
        analyticsService.getTimeBasedAnalytics(period1 || 'monthly'),
        analyticsService.getTimeBasedAnalytics(period2 || 'monthly')
      ]);

      const comparison = {
        period1: { name: period1 || 'monthly', data: analytics1 },
        period2: { name: period2 || 'monthly', data: analytics2 },
        changes: this.calculateChanges(analytics1, analytics2)
      };

      res.json(comparison);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Helper method to calculate changes between two periods
  calculateChanges(data1, data2) {
    const changes = {};
    
    // Calculate total revenue changes
    const totalRevenue1 = Object.values(data1).reduce((sum, period) => sum + (period.revenue || 0), 0);
    const totalRevenue2 = Object.values(data2).reduce((sum, period) => sum + (period.revenue || 0), 0);
    
    changes.revenue = {
      period1: totalRevenue1,
      period2: totalRevenue2,
      change: totalRevenue2 - totalRevenue1,
      percentageChange: totalRevenue1 > 0 ? ((totalRevenue2 - totalRevenue1) / totalRevenue1) * 100 : 0
    };

    // Calculate total orders changes
    const totalOrders1 = Object.values(data1).reduce((sum, period) => sum + (period.orders || 0), 0);
    const totalOrders2 = Object.values(data2).reduce((sum, period) => sum + (period.orders || 0), 0);
    
    changes.orders = {
      period1: totalOrders1,
      period2: totalOrders2,
      change: totalOrders2 - totalOrders1,
      percentageChange: totalOrders1 > 0 ? ((totalOrders2 - totalOrders1) / totalOrders1) * 100 : 0
    };

    return changes;
  }
}

module.exports = new AnalyticsController(); 