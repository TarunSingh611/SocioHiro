import api from '../api';

class ContentService {
  async fetchContent(retryCount = 0) {
    try {
      const response = await api.get('/content');
      return response.data;
    } catch (error) {
      // Retry logic for timeout and network errors
      if ((error.isTimeout || !error.response) && retryCount < 2) {
        console.log(`Retrying fetchContent (attempt ${retryCount + 1})`);
        // Wait 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.fetchContent(retryCount + 1);
      }
      
      console.error('Error fetching content:', error);
      throw error;
    }
  }

  async fetchInstagramContent() {
    try {
      const response = await api.get('/content/instagram/content');
      return response.data;
    } catch (error) {
      console.error('Error fetching Instagram content:', error);
      throw error;
    }
  }

  async createContent(contentData) {
    try {
      const response = await api.post('/content', contentData);
      return response.data;
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  }

  async updateContent(contentId, contentData) {
    try {
      const response = await api.put(`/content/${contentId}`, contentData);
      return response.data;
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  }

  async deleteContent(contentId) {
    try {
      await api.delete(`/content/${contentId}`);
      return true;
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  }

  async publishContent(contentId) {
    try {
      const response = await api.post(`/content/${contentId}/publish`);
      return response.data;
    } catch (error) {
      console.error('Error publishing content:', error);
      throw error;
    }
  }

  async uploadMedia(files) {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('media', file);
      });

      const response = await api.post('/content/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  async getContentStats() {
    try {
      const response = await api.get('/content/instagram/insights');
      return response.data;
    } catch (error) {
      console.error('Error fetching content stats:', error);
      throw error;
    }
  }

  async getMediaInsights(mediaId) {
    try {
      const response = await api.get(`/content/instagram/media/${mediaId}/insights`);
      return response.data;
    } catch (error) {
      console.error('Error fetching media insights:', error);
      throw error;
    }
  }

  async getComments(mediaId) {
    try {
      const response = await api.get(`/content/instagram/media/${mediaId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async replyToComment(commentId, replyText) {
    try {
      const response = await api.post(`/content/instagram/comments/${commentId}/reply`, {
        replyText
      });
      return response.data;
    } catch (error) {
      console.error('Error replying to comment:', error);
      throw error;
    }
  }

  // New methods for associations and performance

  async getContentByAssociations(associationType, associationId) {
    try {
      const response = await api.get(`/content/associations/${associationType}/${associationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching content by associations:', error);
      throw error;
    }
  }

  async getHighPerformingContent(limit = 10) {
    try {
      const response = await api.get(`/content/performance/high?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching high performing content:', error);
      throw error;
    }
  }

  async getUnderperformingContent(limit = 10) {
    try {
      const response = await api.get(`/content/performance/low?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching underperforming content:', error);
      throw error;
    }
  }

  async updateContentAssociations(contentId, associations) {
    try {
      const response = await api.put(`/content/${contentId}/associations`, associations);
      return response.data;
    } catch (error) {
      console.error('Error updating content associations:', error);
      throw error;
    }
  }

  async addToWatchList(contentId, watchListName) {
    try {
      const response = await api.post(`/content/${contentId}/watchlist`, { watchListName });
      return response.data;
    } catch (error) {
      console.error('Error adding content to watch list:', error);
      throw error;
    }
  }

  async removeFromWatchList(contentId, watchListName) {
    try {
      const response = await api.delete(`/content/${contentId}/watchlist/${watchListName}`);
      return response.data;
    } catch (error) {
      console.error('Error removing content from watch list:', error);
      throw error;
    }
  }

  async getContentPerformance(contentId) {
    try {
      const response = await api.get(`/content/${contentId}/performance`);
      return response.data;
    } catch (error) {
      console.error('Error fetching content performance:', error);
      throw error;
    }
  }

  // Test API connection
  async testConnection() {
    try {
      const response = await api.get('/content/test');
      return response.data;
    } catch (error) {
      console.error('API connection test failed:', error);
      throw error;
    }
  }
}

export default new ContentService(); 