const Content = require('../models/Content');
const User = require('../models/User');
const AutomationRule = require('../models/AutomationRule');
const Campaign = require('../models/Campaign');
const Order = require('../models/Order');

class AnalyticsService {
  constructor(user) {
    this.user = user;
  }

  // Get comprehensive dashboard analytics
  async getDashboardAnalytics() {
    try {
      const [
        contentStats,
        accountStats,
        automationStats,
        campaignStats,
        recentActivity
      ] = await Promise.all([
        this.getContentAnalytics(),
        this.getAccountAnalytics(),
        this.getAutomationAnalytics(),
        this.getCampaignAnalytics(),
        this.getRecentActivity()
      ]);

      return {
        summary: {
          totalPosts: contentStats.totalPosts,
          totalEngagement: contentStats.totalEngagement,
          hasInstagramConnected: this.user.hasInstagramConnected(),
          activeAutomations: automationStats.activeAutomations,
          activeCampaigns: campaignStats.activeCampaigns,
          totalRevenue: contentStats.totalRevenue || 0
        },
        content: contentStats,
        account: accountStats,
        automation: automationStats,
        campaigns: campaignStats,
        recentActivity
      };
    } catch (error) {
      console.error('Error getting dashboard analytics:', error);
      throw error;
    }
  }

  // Get content analytics
  async getContentAnalytics() {
    try {
      const contents = await Content.find({ userId: this.user._id });
      
      const stats = {
        totalPosts: contents.length,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        totalReach: 0,
        totalImpressions: 0,
        totalSaved: 0,
        totalEngagement: 0,
        avgEngagementRate: 0,
        posts: 0,
        reels: 0,
        stories: 0,
        highPerforming: 0,
        underperforming: 0,
        totalRevenue: 0
      };

      contents.forEach(content => {
        const insights = content.insights || {};
        const stats_data = content.stats || {};
        
        stats.totalLikes += (insights.likes || stats_data.likes || 0);
        stats.totalComments += (insights.comments || stats_data.comments || 0);
        stats.totalShares += (stats_data.shares || 0);
        stats.totalReach += (insights.reach || stats_data.reach || 0);
        stats.totalImpressions += (insights.impressions || 0);
        stats.totalSaved += (insights.saved || 0);
        
        // Count content types
        if (content.type === 'post' || content.instagramMediaType === 'IMAGE') {
          stats.posts++;
        } else if (content.type === 'reel' || content.instagramMediaType === 'VIDEO') {
          stats.reels++;
        } else if (content.type === 'story') {
          stats.stories++;
        }

        // Performance classification
        const performance = content.performance || {};
        if (performance.isHighPerforming) {
          stats.highPerforming++;
        } else if (performance.isUnderperforming) {
          stats.underperforming++;
        }

        // Revenue calculation (if applicable)
        if (content.revenue) {
          stats.totalRevenue += content.revenue;
        }
      });

      stats.totalEngagement = stats.totalLikes + stats.totalComments + stats.totalShares;
      
      if (stats.totalPosts > 0) {
        stats.avgEngagementRate = (stats.totalEngagement / stats.totalPosts) * 100;
      }

      return stats;
    } catch (error) {
      console.error('Error getting content analytics:', error);
      throw error;
    }
  }

  // Get account analytics (single account)
  async getAccountAnalytics() {
    try {
      const stats = {
        hasInstagramConnected: this.user.hasInstagramConnected(),
        accountType: this.user.instagramAccountType,
        username: this.user.username,
        connectedAt: this.user.createdAt,
        lastTokenRefresh: this.user.lastTokenRefresh,
        tokenExpiresAt: this.user.tokenExpiresAt
      };

      return stats;
    } catch (error) {
      console.error('Error getting account analytics:', error);
      throw error;
    }
  }

  // Get automation analytics
  async getAutomationAnalytics() {
    try {
      const automations = await AutomationRule.find({ userId: this.user._id });
      
      const stats = {
        totalAutomations: automations.length,
        activeAutomations: 0,
        inactiveAutomations: 0,
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        avgExecutionTime: 0,
        topTriggers: {}
      };

      automations.forEach(automation => {
        if (automation.isActive) {
          stats.activeAutomations++;
        } else {
          stats.inactiveAutomations++;
        }

        stats.totalExecutions += (automation.executionCount || 0);
        
        // Count trigger types
        const triggerType = automation.triggerType || 'unknown';
        stats.topTriggers[triggerType] = (stats.topTriggers[triggerType] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting automation analytics:', error);
      throw error;
    }
  }

  // Get campaign analytics
  async getCampaignAnalytics() {
    try {
      const campaigns = await Campaign.find({ userId: this.user._id });
      
      const stats = {
        totalCampaigns: campaigns.length,
        activeCampaigns: 0,
        pausedCampaigns: 0,
        scheduledCampaigns: 0,
        completedCampaigns: 0,
        totalReach: 0,
        totalEngagement: 0,
        avgEngagementRate: 0
      };

      campaigns.forEach(campaign => {
        switch (campaign.status) {
          case 'active':
            stats.activeCampaigns++;
            break;
          case 'paused':
            stats.pausedCampaigns++;
            break;
          case 'scheduled':
            stats.scheduledCampaigns++;
            break;
          case 'completed':
            stats.completedCampaigns++;
            break;
        }

        if (campaign.analytics) {
          stats.totalReach += (campaign.analytics.reach || 0);
          stats.totalEngagement += (campaign.analytics.engagement || 0);
        }
      });

      if (stats.totalCampaigns > 0) {
        stats.avgEngagementRate = (stats.totalEngagement / stats.totalCampaigns);
      }

      return stats;
    } catch (error) {
      console.error('Error getting campaign analytics:', error);
      throw error;
    }
  }

  // Get recent activity
  async getRecentActivity() {
    try {
      const recentContent = await Content.find({ userId: this.user._id })
        .sort({ createdAt: -1 })
        .limit(10);

      const recentAutomations = await AutomationRule.find({ userId: this.user._id })
        .sort({ lastExecuted: -1 })
        .limit(5);

      const recentCampaigns = await Campaign.find({ userId: this.user._id })
        .sort({ createdAt: -1 })
        .limit(5);

      return {
        content: recentContent.map(content => ({
          id: content._id,
          type: 'content',
          title: content.title || 'Untitled Post',
          action: 'created',
          timestamp: content.createdAt,
          metadata: {
            type: content.type,
            engagement: content.insights?.likes || 0
          }
        })),
        automations: recentAutomations.map(automation => ({
          id: automation._id,
          type: 'automation',
          title: automation.name,
          action: automation.lastExecuted ? 'executed' : 'created',
          timestamp: automation.lastExecuted || automation.createdAt,
          metadata: {
            triggerType: automation.triggerType,
            executionCount: automation.executionCount
          }
        })),
        campaigns: recentCampaigns.map(campaign => ({
          id: campaign._id,
          type: 'campaign',
          title: campaign.name,
          action: campaign.status === 'active' ? 'activated' : 'created',
          timestamp: campaign.updatedAt || campaign.createdAt,
          metadata: {
            status: campaign.status,
            type: campaign.type
          }
        }))
      };
    } catch (error) {
      console.error('Error getting recent activity:', error);
      throw error;
    }
  }

  // Get time-based analytics
  async getTimeBasedAnalytics(timeframe = 'monthly') {
    try {
      const now = new Date();
      let startDate;

      switch (timeframe) {
        case 'daily':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'weekly':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'yearly':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const contents = await Content.find({
        userId: this.user._id,
        createdAt: { $gte: startDate }
      });

      const analytics = {
        timeframe,
        totalPosts: contents.length,
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          total: 0
        },
        reach: 0,
        impressions: 0,
        performance: {
          highPerforming: 0,
          underperforming: 0,
          average: 0
        }
      };

      contents.forEach(content => {
        const insights = content.insights || {};
        const stats = content.stats || {};
        
        analytics.engagement.likes += (insights.likes || stats.likes || 0);
        analytics.engagement.comments += (insights.comments || stats.comments || 0);
        analytics.engagement.shares += (stats.shares || 0);
        analytics.reach += (insights.reach || stats.reach || 0);
        analytics.impressions += (insights.impressions || 0);

        const performance = content.performance || {};
        if (performance.isHighPerforming) {
          analytics.performance.highPerforming++;
        } else if (performance.isUnderperforming) {
          analytics.performance.underperforming++;
        } else {
          analytics.performance.average++;
        }
      });

      analytics.engagement.total = analytics.engagement.likes + analytics.engagement.comments + analytics.engagement.shares;

      return analytics;
    } catch (error) {
      console.error('Error getting time-based analytics:', error);
      throw error;
    }
  }

  // Get engagement analytics
  async getEngagementAnalytics() {
    try {
      const contents = await Content.find({ userId: this.user._id });
      
      const analytics = {
        totalEngagement: 0,
        avgEngagementRate: 0,
        engagementByType: {
          likes: 0,
          comments: 0,
          shares: 0,
          saved: 0
        },
        topPerformingPosts: [],
        engagementTrend: []
      };

      contents.forEach(content => {
        const insights = content.insights || {};
        const stats = content.stats || {};
        
        const likes = insights.likes || stats.likes || 0;
        const comments = insights.comments || stats.comments || 0;
        const shares = stats.shares || 0;
        const saved = insights.saved || 0;
        
        analytics.engagementByType.likes += likes;
        analytics.engagementByType.comments += comments;
        analytics.engagementByType.shares += shares;
        analytics.engagementByType.saved += saved;
        
        const totalEngagement = likes + comments + shares;
        analytics.totalEngagement += totalEngagement;

        // Track top performing posts
        analytics.topPerformingPosts.push({
          id: content._id,
          title: content.title || 'Untitled',
          engagement: totalEngagement,
          likes,
          comments,
          shares,
          createdAt: content.createdAt
        });
      });

      if (contents.length > 0) {
        analytics.avgEngagementRate = analytics.totalEngagement / contents.length;
      }

      // Sort top performing posts
      analytics.topPerformingPosts.sort((a, b) => b.engagement - a.engagement);
      analytics.topPerformingPosts = analytics.topPerformingPosts.slice(0, 10);

      return analytics;
    } catch (error) {
      console.error('Error getting engagement analytics:', error);
      throw error;
    }
  }

  // Get revenue analytics (if applicable)
  async getRevenueAnalytics() {
    try {
      const contents = await Content.find({ userId: this.user._id });
      const orders = await Order.find({ userId: this.user._id });
      
      const analytics = {
        totalRevenue: 0,
        totalOrders: orders.length,
        avgOrderValue: 0,
        revenueByContent: {},
        topRevenuePosts: []
      };

      contents.forEach(content => {
        if (content.revenue) {
          analytics.totalRevenue += content.revenue;
          
          analytics.revenueByContent[content.type] = (analytics.revenueByContent[content.type] || 0) + content.revenue;
          
          analytics.topRevenuePosts.push({
            id: content._id,
            title: content.title || 'Untitled',
            revenue: content.revenue,
            type: content.type,
            createdAt: content.createdAt
          });
        }
      });

      if (orders.length > 0) {
        const totalOrderValue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        analytics.avgOrderValue = totalOrderValue / orders.length;
      }

      // Sort top revenue posts
      analytics.topRevenuePosts.sort((a, b) => b.revenue - a.revenue);
      analytics.topRevenuePosts = analytics.topRevenuePosts.slice(0, 10);

      return analytics;
    } catch (error) {
      console.error('Error getting revenue analytics:', error);
      throw error;
    }
  }

  // Generate summary metrics
  generateSummary(orderAnalytics, productAnalytics, engagementAnalytics, revenueAnalytics) {
    return {
      totalRevenue: revenueAnalytics.totalRevenue || 0,
      totalOrders: orderAnalytics.totalOrders || 0,
      totalEngagement: engagementAnalytics.totalEngagement || 0,
      avgEngagementRate: engagementAnalytics.avgEngagementRate || 0,
      totalProducts: productAnalytics.totalProducts || 0,
      topPerformingContent: engagementAnalytics.topPerformingPosts?.slice(0, 5) || [],
      revenueTrend: revenueAnalytics.revenueByContent || {},
      hasInstagramConnected: this.user.hasInstagramConnected()
    };
  }
}

module.exports = AnalyticsService; 