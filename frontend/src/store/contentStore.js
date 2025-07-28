import { create } from 'zustand';
import contentService from '../services/contentService';

const useContentStore = create((set, get) => ({
  // State
  content: [],
  instagramContent: [],
  lastSync: null,
  totalCount: 0,
  stats: {
    totalContent: 0,
    published: 0,
    scheduled: 0,
    totalLikes: 0
  },
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  fetchContent: async (retryCount = 0) => {
    try {
      set({ loading: true, error: null });
      
      // Fetch real content from database
      const contentData = await contentService.fetchContent();
      console.log('Content data:', contentData);
      // Handle the API response structure
      set({ 
        content: contentData?.content || [], 
        lastSync: contentData?.lastSync || null, 
        totalCount: contentData?.totalCount || 0, 
        loading: false 
      });
    } catch (err) {
      // Handle specific error types for better UX
      let errorMessage = err.message;
      
      if (err.isTimeout) {
        errorMessage = 'Request timeout - Instagram API is taking longer than expected. Please try again.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Authentication required - Please reconnect your Instagram account.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied - Your Instagram permissions may have expired.';
      } else if (err.response?.status === 429) {
        errorMessage = 'Rate limit exceeded - Instagram API is temporarily unavailable. Please try again later.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error - Please try again in a few minutes.';
      } else if (!err.response) {
        errorMessage = 'Network error - Please check your connection and try again.';
      }
      
      // Auto-retry for certain errors
      if ((err.isTimeout || !err.response || err.response?.status >= 500) && retryCount < 2) {
        // Wait 3 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 3000));
        return get().fetchContent(retryCount + 1);
      }
      
      set({ 
        error: errorMessage, 
        loading: false 
      });
      console.error('Error fetching content:', err);
      throw err;
    }
  },

  fetchInstagramContent: async () => {
    try {
      set({ loading: true, error: null });
      
      // Fetch real Instagram content
      const instagramData = await contentService.fetchInstagramContent();
      set({ instagramContent: instagramData, loading: false });
    } catch (err) {
      set({ 
        error: err.message, 
        loading: false 
      });
      console.error('Error fetching Instagram content:', err);
      throw err;
    }
  },

  createContent: async (contentData) => {
    try {
      set({ error: null });
      
      const newContent = await contentService.createContent(contentData);
      set(state => ({
        content: [newContent, ...state.content]
      }));
      return newContent;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  updateContent: async (contentId, contentData) => {
    try {
      set({ error: null });
      
      await contentService.updateContent(contentId, contentData);
      set(state => ({
        content: state.content.map(item => 
          item._id === contentId || item.id === contentId
            ? { ...item, ...contentData }
            : item
        )
      }));
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteContent: async (contentId) => {
    try {
      set({ error: null });
      
      await contentService.deleteContent(contentId);
      set(state => ({
        content: state.content.filter(item => 
          item._id !== contentId && item.id !== contentId
        )
      }));
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  publishContent: async (contentId) => {
    try {
      set({ error: null });
      
      const publishResult = await contentService.publishContent(contentId);
      set(state => ({
        content: state.content.map(item => 
          item._id === contentId || item.id === contentId
            ? { 
                ...item, 
                isPublished: true, 
                publishedAt: new Date().toISOString(),
                instagramId: publishResult.instagramData?.id,
                permalink: publishResult.instagramData?.permalink
              }
            : item
        )
      }));
      return publishResult;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  uploadMedia: async (files) => {
    try {
      set({ error: null });
      
      const uploadResult = await contentService.uploadMedia(files);
      return uploadResult;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  getMediaInsights: async (mediaId) => {
    try {
      return await contentService.getMediaInsights(mediaId);
    } catch (err) {
      console.error('Error fetching media insights:', err);
      throw err;
    }
  },

  getComments: async (mediaId) => {
    try {
      return await contentService.getComments(mediaId);
    } catch (err) {
      console.error('Error fetching comments:', err);
      throw err;
    }
  },

  replyToComment: async (commentId, replyText) => {
    try {
      return await contentService.replyToComment(commentId, replyText);
    } catch (err) {
      console.error('Error replying to comment:', err);
      throw err;
    }
  },

  // Computed selectors
  getPublishedContent: () => {
    const { content } = get();
    return content.filter(item => item.isPublished);
  },

  getScheduledContent: () => {
    const { content } = get();
    return content.filter(item => !item.isPublished && item.scheduledDate);
  },

  getDraftContent: () => {
    const { content } = get();
    return content.filter(item => !item.isPublished && !item.scheduledDate);
  },

  getContentById: (id) => {
    const { content } = get();
    return content.find(item => item._id === id || item.id === id);
  },

  // Get combined content (local + Instagram)
  getCombinedContent: () => {
    const { content, instagramContent } = get();
    return [...content, ...instagramContent];
  },

  // New methods for associations and performance

  fetchContentByAssociations: async (associationType, associationId) => {
    try {
      set({ loading: true, error: null });
      
      const result = await contentService.getContentByAssociations(associationType, associationId);
      set({ content: result.content, loading: false });
      return result;
    } catch (err) {
      set({ 
        error: err.message, 
        loading: false 
      });
      console.error('Error fetching content by associations:', err);
      throw err;
    }
  },

  fetchHighPerformingContent: async (limit = 10) => {
    try {
      set({ loading: true, error: null });
      
      const result = await contentService.getHighPerformingContent(limit);
      set({ content: result.content, loading: false });
      return result;
    } catch (err) {
      set({ 
        error: err.message, 
        loading: false 
      });
      console.error('Error fetching high performing content:', err);
      throw err;
    }
  },

  fetchUnderperformingContent: async (limit = 10) => {
    try {
      set({ loading: true, error: null });
      
      const result = await contentService.getUnderperformingContent(limit);
      set({ content: result.content, loading: false });
      return result;
    } catch (err) {
      set({ 
        error: err.message, 
        loading: false 
      });
      console.error('Error fetching underperforming content:', err);
      throw err;
    }
  },

  updateContentAssociations: async (contentId, associations) => {
    try {
      set({ error: null });
      
      const result = await contentService.updateContentAssociations(contentId, associations);
      
      // Update the content in the store
      set(state => ({
        content: state.content.map(item => 
          item._id === contentId || item.id === contentId
            ? { ...item, ...result.content }
            : item
        )
      }));
      
      return result;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  addToWatchList: async (contentId, watchListName) => {
    try {
      set({ error: null });
      
      const result = await contentService.addToWatchList(contentId, watchListName);
      
      // Update the content in the store
      set(state => ({
        content: state.content.map(item => 
          item._id === contentId || item.id === contentId
            ? { ...item, ...result.content }
            : item
        )
      }));
      
      return result;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  removeFromWatchList: async (contentId, watchListName) => {
    try {
      set({ error: null });
      
      const result = await contentService.removeFromWatchList(contentId, watchListName);
      
      // Update the content in the store
      set(state => ({
        content: state.content.map(item => 
          item._id === contentId || item.id === contentId
            ? { ...item, ...result.content }
            : item
        )
      }));
      
      return result;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  getContentPerformance: async (contentId) => {
    try {
      const result = await contentService.getContentPerformance(contentId);
      return result;
    } catch (err) {
      console.error('Error fetching content performance:', err);
      throw err;
    }
  },

  // Computed selectors for performance
  getHighPerformingContent: () => {
    const { content } = get();
    return content.filter(item => item.performance?.isHighPerforming);
  },

  getUnderperformingContent: () => {
    const { content } = get();
    return content.filter(item => item.performance?.isUnderperforming);
  },

  getContentWithAssociations: () => {
    const { content } = get();
    return content.filter(item => item.hasAssociations?.() || 
      (item.campaigns?.length > 0 || item.automations?.length > 0 || item.watchLists?.length > 0));
  },

  // Content stats calculations
  getContentStats: () => {
    const { content } = get();
  
    // Basic content status stats
    const totalContent = content?.length || 0;
    const published = content?.filter(item => item?.status === 'published')?.length || 0;
    const scheduled = content?.filter(item => item?.status === 'scheduled')?.length || 0;
    const drafts = content?.filter(item => item?.status === 'draft')?.length || 0;
    
    const stats = {
      totalContent,
      published,
      scheduled,
      drafts
    };
    
    return stats;
  },

  // Analytics stats calculations
  getAnalyticsStats: () => {
    const { content } = get();
    
    // Calculate engagement metrics
    const totalLikes = content?.reduce((sum, item) => sum + (item?.stats?.likes || 0), 0) || 0;
    const totalComments = content?.reduce((sum, item) => sum + (item?.stats?.comments || 0), 0) || 0;
    const totalShares = content?.reduce((sum, item) => sum + (item?.stats?.shares || 0), 0) || 0;
    const totalReach = content?.reduce((sum, item) => sum + (item?.stats?.reach || 0), 0) || 0;
    const totalImpressions = content?.reduce((sum, item) => sum + (item?.stats?.impressions || 0), 0) || 0;
    const totalSaved = content?.reduce((sum, item) => sum + (item?.stats?.saved || 0), 0) || 0;
    
    // Calculate average engagement rate
    const totalEngagement = totalLikes + totalComments + totalShares;
    const avgEngagementRate = totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0;
    
    // Count content types
    const posts = content?.filter(item => item?.type === 'post')?.length || 0;
    const reels = content?.filter(item => item?.type === 'reel')?.length || 0;
    const stories = content?.filter(item => item?.type === 'story')?.length || 0;
    
    // Count performance categories
    const highPerforming = content?.filter(item => item?.performance?.isHighPerforming)?.length || 0;
    const underperforming = content?.filter(item => item?.performance?.isUnderperforming)?.length || 0;
    
    return {
      totalLikes,
      totalComments,
      totalShares,
      totalReach,
      totalImpressions,
      totalSaved,
      avgEngagementRate,
      posts,
      reels,
      stories,
      highPerforming,
      underperforming
    };
  }
}));

export default useContentStore; 