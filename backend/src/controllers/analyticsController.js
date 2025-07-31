const AnalyticsService = require('../services/analyticsService');
const { requireAuth } = require('../middleware/auth');

// Get comprehensive dashboard analytics
const getDashboardAnalytics = async (req, res) => {
  try {
    const analyticsService = new AnalyticsService(req.user);
    const analytics = await analyticsService.getDashboardAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order analytics (placeholder - no order system implemented yet)
const getOrderAnalytics = async (req, res) => {
  try {
    res.json({
      totalOrders: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      message: 'Order analytics not implemented yet'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product analytics (placeholder - no product system implemented yet)
const getProductAnalytics = async (req, res) => {
  try {
    res.json({
      totalProducts: 0,
      activeProducts: 0,
      totalSales: 0,
      message: 'Product analytics not implemented yet'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get engagement analytics
const getEngagementAnalytics = async (req, res) => {
  try {
    const analyticsService = new AnalyticsService(req.user);
    const analytics = await analyticsService.getEngagementAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get revenue analytics
const getRevenueAnalytics = async (req, res) => {
  try {
    const analyticsService = new AnalyticsService(req.user);
    const analytics = await analyticsService.getRevenueAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get time-based analytics
const getTimeBasedAnalytics = async (req, res) => {
  try {
    const { timeframe = 'monthly' } = req.query;
    const analyticsService = new AnalyticsService(req.user);
    const analytics = await analyticsService.getTimeBasedAnalytics(timeframe);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get summary metrics
const getSummaryMetrics = async (req, res) => {
  try {
    const analyticsService = new AnalyticsService(req.user);
    const [contentAnalytics, engagementAnalytics, revenueAnalytics] = await Promise.all([
      analyticsService.getContentAnalytics(),
      analyticsService.getEngagementAnalytics(),
      analyticsService.getRevenueAnalytics()
    ]);

    const summary = analyticsService.generateSummary(
      { totalOrders: 0 }, // Placeholder for order analytics
      { totalProducts: 0 }, // Placeholder for product analytics
      engagementAnalytics,
      revenueAnalytics
    );

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get analytics export (CSV format)
const exportAnalytics = async (req, res) => {
  try {
    const { type = 'content', timeframe = 'monthly' } = req.query;
    const analyticsService = new AnalyticsService(req.user);
    
    let data;
    switch (type) {
      case 'content':
        data = await analyticsService.getContentAnalytics();
        break;
      case 'engagement':
        data = await analyticsService.getEngagementAnalytics();
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
    const csvData = convertToCSV(data);
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper method to convert data to CSV format
const convertToCSV = (data) => {
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
};

// Get analytics comparison (compare different time periods)
const getAnalyticsComparison = async (req, res) => {
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
      changes: calculateChanges(analytics1, analytics2)
    };

    res.json(comparison);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper method to calculate changes between two periods
const calculateChanges = (data1, data2) => {
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
};

module.exports = {
  getDashboardAnalytics,
  getOrderAnalytics,
  getProductAnalytics,
  getEngagementAnalytics,
  getRevenueAnalytics,
  getTimeBasedAnalytics,
  getSummaryMetrics,
  exportAnalytics,
  convertToCSV,
  getAnalyticsComparison,
  calculateChanges
}; 