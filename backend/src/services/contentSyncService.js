const InstagramApiService = require('./instagramApi');
const Content = require('../models/Content');
const User = require('../models/User');

class ContentSyncService {
  constructor() {
    this.syncInterval = 30 * 60 * 1000; // 30 minutes
    this.lastSync = new Map(); // Track last sync time per user
  }

  // Sync Instagram content to local database
  async syncInstagramContent(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.accessToken) {
        throw new Error('User not found or no Instagram access token');
      }

      const instagramApi = new InstagramApiService(user.accessToken);
      const instagramBusinessAccountId = await instagramApi.getInstagramBusinessAccount();
      
      // Get Instagram media
      const instagramMedia = await instagramApi.getInstagramMedia(instagramBusinessAccountId, 50);
      
      // Get insights for each media item
      const mediaWithInsights = await Promise.all(
        instagramMedia.map(async (media) => {
          try {
            const insights = await instagramApi.getMediaInsights(media.id);
            return { ...media, insights };
          } catch (error) {
            console.log(`Failed to get insights for media ${media.id}:`, error.message);
            return media;
          }
        })
      );

      // Transform and save to local database
      const savedContent = [];
      for (const media of mediaWithInsights) {
        const contentData = this.transformInstagramMediaToContent(media, userId);
        
        // Check if content already exists
        let existingContent = await Content.findOne({ 
          instagramId: media.id,
          userId: userId 
        });

        if (existingContent) {
          // Update existing content with latest data
          Object.assign(existingContent, contentData);
          await existingContent.save();
          savedContent.push(existingContent);
        } else {
          // Create new content
          const newContent = new Content(contentData);
          await newContent.save();
          savedContent.push(newContent);
        }
      }

      // Update last sync time
      this.lastSync.set(userId.toString(), new Date());

      return {
        success: true,
        syncedCount: savedContent.length,
        message: `Successfully synced ${savedContent.length} Instagram posts`
      };

    } catch (error) {
      console.error('Error syncing Instagram content:', error);
      throw error;
    }
  }

  // Transform Instagram media to content format
  transformInstagramMediaToContent(media, userId) {
    const hashtags = this.extractHashtags(media.caption || '');
    
    return {
      userId: userId,
      title: media.caption?.substring(0, 100) || 'Instagram Post',
      description: media.caption || '',
      type: this.mapInstagramMediaType(media.media_type),
      content: media.caption || '',
      mediaUrls: [media.media_url],
      hashtags: hashtags,
      location: '',
      isPublished: true,
      publishedAt: new Date(media.timestamp),
      instagramId: media.id,
      permalink: media.permalink,
      source: 'instagram',
      instagramMediaType: media.media_type,
      thumbnailUrl: media.thumbnail_url,
      stats: {
        likes: media.like_count || 0,
        comments: media.comments_count || 0,
        shares: 0,
        reach: 0
      },
      insights: {
        impressions: media.insights?.data?.find(i => i.name === 'impressions')?.values?.[0]?.value || 0,
        reach: media.insights?.data?.find(i => i.name === 'reach')?.values?.[0]?.value || 0,
        engagement: media.insights?.data?.find(i => i.name === 'engagement')?.values?.[0]?.value || 0,
        saved: media.insights?.data?.find(i => i.name === 'saved')?.values?.[0]?.value || 0,
        videoViews: media.insights?.data?.find(i => i.name === 'video_views')?.values?.[0]?.value || 0,
        videoViewRate: media.insights?.data?.find(i => i.name === 'video_view_rate')?.values?.[0]?.value || 0
      },
      status: 'published'
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

  // Get combined content (Instagram + local)
  async getCombinedContent(userId, options = {}) {
    const { limit = 25, source = 'all' } = options;
    
    let query = { userId: userId };
    
    if (source === 'instagram') {
      query.source = 'instagram';
    } else if (source === 'local') {
      query.source = 'local';
    }

    const content = await Content.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    return {
      content: content,
      source: source,
      totalCount: content.length
    };
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
      console.error('Manual sync failed:', error);
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