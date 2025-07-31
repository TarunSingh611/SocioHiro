const InstagramApiService = require('./instagramApi');
const Content = require('../models/Content');
const User = require('../models/User');
const AutomationRule = require('../models/AutomationRule');
const Campaign = require('../models/Campaign');

class ContentSyncService {
  constructor() {
    // Remove automatic sync interval - we'll sync on-demand only
    this.syncCache = new Map(); // Cache sync results to avoid duplicate API calls
    this.lastSyncCheck = new Map(); // Track last sync check per user
  }

  // Smart sync: Only sync when content is accessed and only if changes detected
  async smartSyncOnAccess(userId, options = {}) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.accessToken) {
        // This is a normal scenario - user hasn't connected Instagram yet
        console.log(`ℹ️ User ${userId} has no Instagram access token - skipping sync`);
        return { 
          success: true, 
          syncedCount: 0, 
          message: 'No Instagram account connected',
          requiresInstagramAuth: true
        };
      }

      // Validate token before attempting sync
      const instagramApi = new InstagramApiService(user.accessToken);
      const isTokenValid = await instagramApi.isTokenValid();
      
      if (!isTokenValid) {
        throw new Error('Instagram access token is invalid or expired. Please re-authenticate with Instagram.');
      }

      // Check if we need to sync by comparing Instagram data with our stored data
      const needsSync = await this.checkIfSyncNeeded(userId, user.accessToken);
      
      if (needsSync) {
        console.log(`🔄 Smart sync triggered for user ${userId} - changes detected`);
        return await this.syncInstagramContent(userId);
      } else {
        console.log(`✅ No sync needed for user ${userId} - data is current`);
        return { success: true, syncedCount: 0, message: 'No changes detected' };
      }
    } catch (error) {
      console.error('Smart sync error:', error);
      throw error;
    }
  }

  // Check if sync is needed by comparing Instagram data with our stored data
  async checkIfSyncNeeded(userId, accessToken) {
    try {
      const instagramApi = new InstagramApiService(accessToken);
      
      // Validate token first
      const isTokenValid = await instagramApi.isTokenValid();
      if (!isTokenValid) {
        throw new Error('Instagram access token is invalid or expired');
      }
      
      // Get recent Instagram posts (last 10 to check for changes)
      const recentInstagramPosts = await instagramApi.getInstagramMedia(10);
      
      // Get our stored Instagram posts
      const storedPosts = await Content.find({ 
        userId: userId, 
        source: 'instagram' 
      }).sort({ createdAt: -1 }).limit(10);

      // If we have no stored posts, we need to sync
      if (storedPosts.length === 0) {
        console.log('No stored posts found - sync needed');
        return true;
      }

      // Check if any recent Instagram posts are missing from our database
      for (const instagramPost of recentInstagramPosts) {
        const exists = storedPosts.some(stored => stored.instagramId === instagramPost.id);
        if (!exists) {
          console.log(`New Instagram post ${instagramPost.id} found - sync needed`);
          return true;
        }
      }

      // Check if any stored posts have been deleted from Instagram
      for (const storedPost of storedPosts) {
        const stillExists = recentInstagramPosts.some(ig => ig.id === storedPost.instagramId);
        if (!stillExists) {
          console.log(`Instagram post ${storedPost.instagramId} no longer exists - cleanup needed`);
          return true;
        }
      }

      // Check if engagement stats have changed significantly
      for (const storedPost of storedPosts) {
        const instagramPost = recentInstagramPosts.find(ig => ig.id === storedPost.instagramId);
        if (instagramPost) {
          const currentLikes = storedPost.stats?.likes || 0;
          const currentComments = storedPost.stats?.comments || 0;
          const newLikes = instagramPost.like_count || 0;
          const newComments = instagramPost.comments_count || 0;
          
          // If engagement changed by more than 5%, sync is needed
          const likeChange = Math.abs(newLikes - currentLikes) / Math.max(currentLikes, 1);
          const commentChange = Math.abs(newComments - currentComments) / Math.max(currentComments, 1);
          
          if (likeChange > 0.05 || commentChange > 0.05) {
            console.log(`Engagement changed for post ${storedPost.instagramId} - sync needed`);
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking if sync needed:', error);
      // If token is invalid, don't sync - let the user know they need to re-authenticate
      if (error.message.includes('token') || error.message.includes('OAuth')) {
        throw new Error('Instagram access token is invalid or expired. Please re-authenticate with Instagram.');
      }
      // If we can't check, assume sync is needed
      return true;
    }
  }

  // Sync Instagram content metadata (not the actual content data)
  async syncInstagramContent(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.accessToken) {
        console.log(`ℹ️ User ${userId} has no Instagram access token - skipping sync`);
        return { 
          success: true, 
          syncedCount: 0, 
          message: 'No Instagram account connected',
          requiresInstagramAuth: true
        };
      }

      const instagramApi = new InstagramApiService(user.accessToken);
      // Get Instagram media IDs and basic metadata only
      const instagramMedia = await instagramApi.getInstagramMedia(50);
      
      // Store only our app data, not Instagram content
      const syncedContent = [];
      const updatedContent = [];
      
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
            status: 'published',
            // Store current stats
            stats: {
              likes: media.like_count || 0,
              comments: media.comments_count || 0,
              reach: 0
            }
          };

          const newContent = new Content(appData);
          await newContent.save();
          syncedContent.push(newContent);
        } else {
          // Update existing content with fresh stats
          const updatedStats = {
            likes: media.like_count || 0,
            comments: media.comments_count || 0,
            reach: existingContent.stats?.reach || 0
          };
          
          if (JSON.stringify(existingContent.stats) !== JSON.stringify(updatedStats)) {
            existingContent.stats = updatedStats;
            existingContent.updatedAt = new Date();
            await existingContent.save();
            updatedContent.push(existingContent);
          }
        }
      }

      // Clean up posts that no longer exist on Instagram
      const instagramIds = instagramMedia.map(m => m.id);
      const deletedCount = await Content.deleteMany({
        userId: userId,
        source: 'instagram',
        instagramId: { $nin: instagramIds }
      });

      return {
        success: true,
        syncedCount: syncedContent.length,
        updatedCount: updatedContent.length,
        deletedCount: deletedCount.deletedCount,
        message: `Synced ${syncedContent.length} new posts, updated ${updatedContent.length} posts, deleted ${deletedCount.deletedCount} old posts`
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
      .populate('automations', 'name description triggerType actionType isActive keywords executionCount')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Get automations that apply to all content
    const AutomationRule = require('../models/AutomationRule');
    const allContentAutomations = await AutomationRule.find({
      userId: userId,
      applyToAllContent: true,
      isActive: true
    }).select('name description triggerType actionType isActive keywords executionCount');

    // Add all-content automations to each content item
    const enrichedAppData = appData.map(content => ({
      ...content.toObject(),
      automations: [
        ...(content.automations || []),
        ...allContentAutomations
      ]
    }));

    // Fetch fresh Instagram data and combine
    const user = await User.findById(userId);
    if (!user || !user.accessToken) {
      throw new Error('User not found or no Instagram access token');
    }

    const instagramApi = new InstagramApiService(user.accessToken);
    const combinedContent = [];

    for (const content of enrichedAppData) {
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
            stats: content.stats || { likes: 0, comments: 0, reach: 0 },
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
    // This method is now deprecated - use checkIfSyncNeeded instead
    // Keeping for backward compatibility but it will always return true
    // to ensure sync happens when called
    return true;
  }

  // Get last sync time for user
  getLastSyncTime(userId) {
    // Since we're not tracking sync times anymore, return null
    return null;
  }

  // Manual sync trigger (now uses smart sync)
  async triggerSync(userId) {
    try {
      const result = await this.smartSyncOnAccess(userId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Force sync (bypasses change detection)
  async forceSync(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.accessToken) {
        console.log(`ℹ️ User ${userId} has no Instagram access token - skipping force sync`);
        return { 
          success: true, 
          syncedCount: 0, 
          message: 'No Instagram account connected',
          requiresInstagramAuth: true
        };
      }

      console.log(`🔄 Force sync triggered for user ${userId}`);
      return await this.syncInstagramContent(userId);
    } catch (error) {
      console.error('Force sync error:', error);
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