const InstagramApiService = require('./instagramApi');
const Content = require('../models/Content');
const User = require('../models/User');
const AutomationRule = require('../models/AutomationRule');
const Campaign = require('../models/Campaign');

class ContentSyncService {
  constructor() {
    this.syncInterval = 30 * 60 * 1000; // 30 minutes
    this.lastSync = new Map(); // Track last sync time per user
  }

  // Sync Instagram content metadata (not the actual content data)
  async syncInstagramContent(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.accessToken) {
        throw new Error('User not found or no Instagram access token');
      }

      const instagramApi = new InstagramApiService(user.accessToken);
      // Get Instagram media IDs and basic metadata only
      const instagramMedia = await instagramApi.getInstagramMedia(50);
      
      // Store only our app data, not Instagram content
      const syncedContent = [];
      for (const media of instagramMedia) {
        // Check if we already have app data for this Instagram post
        let existingContent = await Content.findOne({ 
          instagramId: media.id,
          userId: userId 
        });

        if (!existingContent) {
          // Create new app data entry for this Instagram post
          const appData = {
            userId: userId,
            instagramId: media.id,
            source: 'instagram',
            // Store minimal metadata for reference
            instagramMediaType: media.media_type,
            permalink: media.permalink,
            publishedAt: new Date(media.timestamp),
            // Initialize our app data
            campaigns: [],
            automations: [],
            watchLists: [],
            performance: {
              isHighPerforming: false,
              isUnderperforming: false,
              performanceScore: 0,
              lastAnalyzed: null
            },
            status: 'published'
          };

          const newContent = new Content(appData);
          await newContent.save();
          syncedContent.push(newContent);
        }
      }

      // Update last sync time
      this.lastSync.set(userId.toString(), new Date());

      return {
        success: true,
        syncedCount: syncedContent.length,
        message: `Successfully synced ${syncedContent.length} Instagram posts metadata`
      };

    } catch (error) {
      throw error;
    }
  }

  // Get combined content (Instagram + our app data)
  async getCombinedContent(userId, options = {}) {
    const { limit = 25, source = 'all' } = options;
    
    let query = { userId: userId };
    
    if (source === 'instagram') {
      query.source = 'instagram';
    } else if (source === 'local') {
      query.source = 'local';
    }

    // Get our app data
    const appData = await Content.find(query)
      .populate('campaigns', 'name description status')
      .populate('automations', 'name description triggerType isActive')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Fetch fresh Instagram data and combine
    const user = await User.findById(userId);
    if (!user || !user.accessToken) {
      throw new Error('User not found or no Instagram access token');
    }

    const instagramApi = new InstagramApiService(user.accessToken);
    const combinedContent = [];

    for (const content of appData) {
      if (content.instagramId) {
        try {
          // Fetch fresh Instagram data
          const instagramData = await this.getInstagramMediaData(instagramApi, content.instagramId);
          
          // Combine Instagram data with our app data
          const combined = this.combineInstagramAndAppData(instagramData, content);
          combinedContent.push(combined);
        } catch (error) {
          // Create minimal combined data with app data only
          const minimalData = {
            _id: content._id,
            userId: content.userId,
            campaigns: content.campaigns,
            automations: content.automations,
            watchLists: content.watchLists,
            performance: content.performance,
            status: content.status,
            createdAt: content.createdAt,
            updatedAt: content.updatedAt,
            instagramId: content.instagramId,
            source: 'instagram',
            // Provide fallback data
            title: 'Instagram Post (Data Unavailable)',
            description: '',
            type: 'post',
            content: '',
            mediaUrls: [],
            hashtags: [],
            stats: { likes: 0, comments: 0, reach: 0 },
            insights: { impressions: 0, reach: 0, likes: 0, comments: 0, saved: 0, videoViews: 0 }
          };
          combinedContent.push(minimalData);
        }
      } else {
        // Local content without Instagram ID
        combinedContent.push(content.toObject());
      }
    }

    // Analyze performance for each content item
    const contentWithAnalysis = combinedContent.map(item => {
      const analyzedItem = item;
      
      // Calculate performance score
      const performanceScore = this.calculatePerformanceScore(item);
      analyzedItem.performanceScore = performanceScore;
      
      // Determine if high/under performing
      analyzedItem.performance.isHighPerforming = performanceScore >= 70;
      analyzedItem.performance.isUnderperforming = performanceScore <= 30;
      analyzedItem.performance.lastAnalyzed = new Date();
      
      return analyzedItem;
    });

    return {
      content: contentWithAnalysis,
      source: source,
      totalCount: contentWithAnalysis.length
    };
  }

  // Fetch Instagram media data (content + insights)
  async getInstagramMediaData(instagramApi, mediaId) {
    try {
      // Get basic media data
      const mediaData = await instagramApi.getMediaById(mediaId);
      
      // Get insights with media type
      let insights = null;
      try {
        insights = await instagramApi.getMediaInsights(mediaId, mediaData.media_type);
      } catch (error) {
        // Silently fail - insights are optional
      }

      return {
        ...mediaData,
        insights
      };
    } catch (error) {
      throw new Error(`Failed to get Instagram media data: ${error.message}`);
    }
  }

  // Combine Instagram data with our app data
  combineInstagramAndAppData(instagramData, appData) {
    const hashtags = this.extractHashtags(instagramData.caption || '');
    
    return {
      // Our app data
      _id: appData._id,
      userId: appData.userId,
      campaigns: appData.campaigns,
      automations: appData.automations,
      watchLists: appData.watchLists,
      performance: appData.performance,
      status: appData.status,
      createdAt: appData.createdAt,
      updatedAt: appData.updatedAt,
      
      // Instagram data (fresh from API)
      instagramId: instagramData.id,
      title: instagramData.caption?.substring(0, 100) || 'Instagram Post',
      description: instagramData.caption || '',
      type: this.mapInstagramMediaType(instagramData.media_type),
      content: instagramData.caption || '',
      mediaUrls: [instagramData.media_url],
      hashtags: hashtags,
      isPublished: true,
      publishedAt: new Date(instagramData.timestamp),
      permalink: instagramData.permalink,
      source: 'instagram',
      instagramMediaType: instagramData.media_type,
      thumbnailUrl: instagramData.thumbnail_url,
      
      // Stats from Instagram (only real data)
      stats: {
        likes: instagramData.like_count || 0,
        comments: instagramData.comments_count || 0,
        reach: instagramData.insights?.find(i => i.name === 'reach')?.values?.[0]?.value || 0
      },
      
      // Insights from Instagram (only real data)
      insights: {
        impressions: instagramData.insights?.find(i => i.name === 'impressions')?.values?.[0]?.value || 0,
        reach: instagramData.insights?.find(i => i.name === 'reach')?.values?.[0]?.value || 0,
        likes: instagramData.insights?.find(i => i.name === 'likes')?.values?.[0]?.value || instagramData.like_count || 0,
        comments: instagramData.insights?.find(i => i.name === 'comments')?.values?.[0]?.value || instagramData.comments_count || 0,
        saved: instagramData.insights?.find(i => i.name === 'saved')?.values?.[0]?.value || 0,
        videoViews: instagramData.insights?.find(i => i.name === 'video_views')?.values?.[0]?.value || 0
      }
    };
  }

  // Map Instagram media type to our content type
  mapInstagramMediaType(instagramType) {
    const typeMap = {
      'IMAGE': 'post',
      'VIDEO': 'reel',
      'CAROUSEL_ALBUM': 'carousel',
      'STORY': 'story'
    };
    return typeMap[instagramType] || 'post';
  }

  // Extract hashtags from caption
  extractHashtags(caption) {
    if (!caption) return [];
    const hashtagRegex = /#[\w]+/g;
    return caption.match(hashtagRegex) || [];
  }

  // Calculate performance score for content
  calculatePerformanceScore(content) {
    let score = 0;
    // Engagement rate (40% weight)
    const engagementRate = content.getEngagementRate ? content.getEngagementRate() : 0;
    if (engagementRate > 5) score += 40;
    else if (engagementRate > 3) score += 30;
    else if (engagementRate > 1) score += 20;
    else if (engagementRate > 0.5) score += 10;
    
    // Reach (30% weight)
    const reach = content.stats?.reach || 0;
    if (reach > 10000) score += 30;
    else if (reach > 5000) score += 25;
    else if (reach > 1000) score += 20;
    else if (reach > 500) score += 15;
    else if (reach > 100) score += 10;
    
    // Likes (20% weight)
    const likes = content.stats?.likes || 0;
    if (likes > 1000) score += 20;
    else if (likes > 500) score += 15;
    else if (likes > 100) score += 10;
    else if (likes > 50) score += 5;
    
    // Comments (10% weight)
    const comments = content.stats?.comments || 0;
    if (comments > 100) score += 10;
    else if (comments > 50) score += 8;
    else if (comments > 20) score += 5;
    else if (comments > 5) score += 2;
    
    return Math.min(score, 100);
  }

  // Update content associations
  async updateContentAssociations(contentId, associations) {
    const { campaigns, automations, watchLists } = associations;
    
    const updateData = {};
    if (campaigns) updateData.campaigns = campaigns;
    if (automations) updateData.automations = automations;
    if (watchLists) updateData.watchLists = watchLists;
    
    const content = await Content.findByIdAndUpdate(
      contentId,
      { $set: updateData },
      { new: true }
    );
    
    return content;
  }

  // Add content to watch list
  async addToWatchList(contentId, watchListName) {
    const content = await Content.findByIdAndUpdate(
      contentId,
      { 
        $addToSet: { 
          watchLists: { 
            type: watchListName,
            addedAt: new Date()
          }
        }
      },
      { new: true }
    );
    
    return content;
  }

  // Remove content from watch list
  async removeFromWatchList(contentId, watchListName) {
    const content = await Content.findByIdAndUpdate(
      contentId,
      { 
        $pull: { 
          watchLists: { type: watchListName }
        }
      },
      { new: true }
    );
    
    return content;
  }

  // Get content by associations
  async getContentByAssociations(userId, associationType, associationId) {
    let query = { userId: userId };
    
    switch (associationType) {
      case 'campaign':
        query.campaigns = associationId;
        break;
      case 'automation':
        query.automations = associationId;
        break;
      case 'watchlist':
        query['watchLists.type'] = associationId;
        break;
      default:
        throw new Error('Invalid association type');
    }
    
    const content = await Content.find(query)
      .populate('campaigns', 'name description status')
      .populate('automations', 'name description triggerType isActive')
      .sort({ createdAt: -1 });
    
    return content;
  }

  // Get high performing content
  async getHighPerformingContent(userId, limit = 10) {
    const content = await Content.find({
      userId: userId,
      'performance.isHighPerforming': true
    })
    .populate('campaigns', 'name description status')
    .populate('automations', 'name description triggerType isActive')
    .sort({ 'performance.performanceScore': -1 })
    .limit(limit);
    
    return content;
  }

  // Get underperforming content
  async getUnderperformingContent(userId, limit = 10) {
    const content = await Content.find({
      userId: userId,
      'performance.isUnderperforming': true
    })
    .populate('campaigns', 'name description status')
    .populate('automations', 'name description triggerType isActive')
    .sort({ 'performance.performanceScore': 1 })
    .limit(limit);
    
    return content;
  }

  // Get content statistics
  async getContentStats(userId) {
    const stats = await Content.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
          totalLikes: { $sum: '$stats.likes' },
          totalComments: { $sum: '$stats.comments' },
          totalReach: { $sum: '$stats.reach' },
          totalImpressions: { $sum: '$insights.impressions' },
          avgEngagementRate: { $avg: { $divide: ['$stats.likes', { $max: ['$stats.reach', 1] }] } }
        }
      }
    ]);

    return stats;
  }

  // Check if sync is needed
  isSyncNeeded(userId) {
    const lastSyncTime = this.lastSync.get(userId.toString());
    if (!lastSyncTime) return true;
    
    const timeSinceLastSync = Date.now() - lastSyncTime.getTime();
    return timeSinceLastSync > this.syncInterval;
  }

  // Get last sync time for user
  getLastSyncTime(userId) {
    return this.lastSync.get(userId.toString());
  }

  // Manual sync trigger
  async triggerSync(userId) {
    try {
      const result = await this.syncInstagramContent(userId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Delete old Instagram content (cleanup)
  async cleanupOldContent(userId, daysOld = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Content.deleteMany({
      userId: userId,
      source: 'instagram',
      createdAt: { $lt: cutoffDate }
    });

    return {
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} old Instagram posts`
    };
  }
}

module.exports = new ContentSyncService(); 