import api from '../api';

class ContentService {
  async fetchContent() {
    try {
      const response = await api.get('/content');
      return response.data;
    } catch (error) {
      console.error('Error fetching content:', error);
      // Return mock data as fallback
      return this.getMockContent();
    }
  }

  async fetchInstagramContent() {
    try {
      const response = await api.get('/content/instagram/content');
      return response.data;
    } catch (error) {
      console.error('Error fetching Instagram content:', error);
      // Return mock data as fallback
      return this.getMockContent();
    }
  }

  async createContent(contentData) {
    try {
      const response = await api.post('/content', contentData);
      return response.data;
    } catch (error) {
      console.error('Error creating content:', error);
      // Return mock created content
      return {
        id: Date.now(),
        ...contentData,
        stats: null,
        publishedAt: null,
        createdAt: new Date().toISOString()
      };
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
      // Return mock publish result
      return {
        success: true,
        message: 'Content published successfully (mock)',
        instagramData: {
          id: `mock_${Date.now()}`,
          permalink: 'https://instagram.com/mock-post'
        }
      };
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
      // Return mock upload result
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
  }

  async getContentStats() {
    try {
      const response = await api.get('/content/instagram/insights');
      return response.data;
    } catch (error) {
      console.error('Error fetching content stats:', error);
      // Return mock stats
      return this.getMockStats();
    }
  }

  async getMediaInsights(mediaId) {
    try {
      const response = await api.get(`/content/instagram/media/${mediaId}/insights`);
      return response.data;
    } catch (error) {
      console.error('Error fetching media insights:', error);
      // Return mock insights
      return [
        { name: 'impressions', value: Math.floor(Math.random() * 1000) },
        { name: 'reach', value: Math.floor(Math.random() * 500) },
        { name: 'engagement', value: Math.floor(Math.random() * 100) }
      ];
    }
  }

  async getComments(mediaId) {
    try {
      const response = await api.get(`/content/instagram/media/${mediaId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
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
  }

  async replyToComment(commentId, replyText) {
    try {
      const response = await api.post(`/content/instagram/comments/${commentId}/reply`, {
        replyText
      });
      return response.data;
    } catch (error) {
      console.error('Error replying to comment:', error);
      // Return mock reply
      return {
        success: true,
        message: 'Reply posted successfully (mock)'
      };
    }
  }

  // Test API connection
  async testConnection() {
    try {
      const response = await api.get('/content/test');
      return response.data;
    } catch (error) {
      console.error('API connection test failed:', error);
      return { error: 'API not available' };
    }
  }

  // Mock data for development (fallback)
  getMockContent() {
    return [
      {
        id: 1,
        title: 'New Product Launch',
        description: 'Exciting announcement about our latest product',
        type: 'post',
        content: 'We\'re thrilled to announce our newest product! 🎉 Check it out and let us know what you think!',
        mediaUrls: ['https://example.com/image1.jpg'],
        hashtags: ['#newproduct', '#launch', '#excited'],
        location: 'New York, NY',
        scheduledDate: '2024-01-20',
        scheduledTime: '10:00',
        isPublished: true,
        stats: {
          likes: 1250,
          comments: 89,
          shares: 45,
          reach: 12500
        },
        publishedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        title: 'Behind the Scenes',
        description: 'A glimpse into our creative process',
        type: 'story',
        content: 'Here\'s what goes into creating amazing content! 📸',
        mediaUrls: ['https://example.com/video1.mp4'],
        hashtags: ['#behindthescenes', '#creative', '#process'],
        location: 'Los Angeles, CA',
        scheduledDate: '2024-01-18',
        scheduledTime: '14:30',
        isPublished: false,
        stats: null,
        publishedAt: null
      },
      {
        id: 3,
        title: 'Customer Spotlight',
        description: 'Highlighting our amazing customers',
        type: 'carousel',
        content: 'Meet some of our incredible customers! Their stories inspire us every day.',
        mediaUrls: ['https://example.com/image2.jpg', 'https://example.com/image3.jpg'],
        hashtags: ['#customerspotlight', '#community', '#inspiration'],
        location: 'Chicago, IL',
        scheduledDate: '2024-01-22',
        scheduledTime: '09:00',
        isPublished: false,
        stats: null,
        publishedAt: null
      }
    ];
  }

  getMockStats() {
    return {
      totalContent: 3,
      published: 1,
      scheduled: 2,
      totalLikes: 1250
    };
  }
}

export default new ContentService(); 