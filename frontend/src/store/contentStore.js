import { create } from 'zustand';
import contentService from '../services/contentService';

const useContentStore = create((set, get) => ({
  // State
  content: [],
  instagramContent: [],
  stats: {
    totalContent: 0,
    published: 0,
    scheduled: 0,
    totalLikes: 0
  },
  loading: false,
  error: null,
  useRealData: true, // Toggle between real and mock data

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setUseRealData: (useReal) => set({ useRealData: useReal }),

  fetchContent: async () => {
    try {
      set({ loading: true, error: null });
      
      if (get().useRealData) {
        // Fetch real content from database
        const contentData = await contentService.fetchContent();
        set({ content: contentData, loading: false });
      } else {
        // Use mock data for development
        const mockContent = contentService.getMockContent();
        set({ content: mockContent, loading: false });
      }
    } catch (err) {
      set({ 
        error: err.message, 
        loading: false 
      });
      console.error('Error fetching content:', err);
    }
  },

  fetchInstagramContent: async () => {
    try {
      set({ loading: true, error: null });
      
      if (get().useRealData) {
        // Fetch real Instagram content
        const instagramData = await contentService.fetchInstagramContent();
        set({ instagramContent: instagramData, loading: false });
      } else {
        // Use mock data for development
        const mockContent = contentService.getMockContent();
        set({ instagramContent: mockContent, loading: false });
      }
    } catch (err) {
      set({ 
        error: err.message, 
        loading: false 
      });
      console.error('Error fetching Instagram content:', err);
    }
  },

  createContent: async (contentData) => {
    try {
      set({ error: null });
      
      if (get().useRealData) {
        const newContent = await contentService.createContent(contentData);
        set(state => ({
          content: [newContent, ...state.content]
        }));
        return newContent;
      } else {
        // For development, create mock content
        const newContent = {
          id: Date.now(),
          ...contentData,
          stats: null,
          publishedAt: null
        };
        set(state => ({
          content: [newContent, ...state.content]
        }));
        return newContent;
      }
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  updateContent: async (contentId, contentData) => {
    try {
      set({ error: null });
      
      if (get().useRealData) {
        await contentService.updateContent(contentId, contentData);
        set(state => ({
          content: state.content.map(item => 
            item._id === contentId || item.id === contentId
              ? { ...item, ...contentData }
              : item
          )
        }));
      } else {
        // For development, update mock content
        set(state => ({
          content: state.content.map(item => 
            item.id === contentId 
              ? { ...item, ...contentData }
              : item
          )
        }));
      }
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteContent: async (contentId) => {
    try {
      set({ error: null });
      
      if (get().useRealData) {
        await contentService.deleteContent(contentId);
        set(state => ({
          content: state.content.filter(item => 
            item._id !== contentId && item.id !== contentId
          )
        }));
      } else {
        // For development, delete from mock content
        set(state => ({
          content: state.content.filter(item => item.id !== contentId)
        }));
      }
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  publishContent: async (contentId) => {
    try {
      set({ error: null });
      
      if (get().useRealData) {
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
      } else {
        // For development, update mock content
        set(state => ({
          content: state.content.map(item => 
            item.id === contentId 
              ? { 
                  ...item, 
                  isPublished: true, 
                  publishedAt: new Date().toISOString(),
                  stats: { likes: 0, comments: 0, shares: 0, reach: 0 }
                }
              : item
          )
        }));
      }
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  uploadMedia: async (files) => {
    try {
      set({ error: null });
      
      if (get().useRealData) {
        const uploadResult = await contentService.uploadMedia(files);
        return uploadResult;
      } else {
        // For development, return mock upload result
        return {
          message: 'Files uploaded successfully (mock)',
          files: files.map(file => ({
            filename: file.name,
            originalname: file.name,
            mimetype: file.type,
            size: file.size,
            url: URL.createObjectURL(file)
          }))
        };
      }
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  getMediaInsights: async (mediaId) => {
    try {
      if (get().useRealData) {
        return await contentService.getMediaInsights(mediaId);
      } else {
        // Return mock insights
        return [
          { name: 'impressions', value: Math.floor(Math.random() * 1000) },
          { name: 'reach', value: Math.floor(Math.random() * 500) },
          { name: 'engagement', value: Math.floor(Math.random() * 100) }
        ];
      }
    } catch (err) {
      console.error('Error fetching media insights:', err);
      throw err;
    }
  },

  getComments: async (mediaId) => {
    try {
      if (get().useRealData) {
        return await contentService.getComments(mediaId);
      } else {
        // Return mock comments
        return [
          {
            id: '1',
            text: 'Great post! 👍',
            from: { username: 'user1' },
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            text: 'Love this content!',
            from: { username: 'user2' },
            timestamp: new Date().toISOString()
          }
        ];
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      throw err;
    }
  },

  replyToComment: async (commentId, replyText) => {
    try {
      if (get().useRealData) {
        return await contentService.replyToComment(commentId, replyText);
      } else {
        // Return mock reply
        return {
          success: true,
          message: 'Reply posted successfully (mock)'
        };
      }
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
  }
}));

export default useContentStore; 