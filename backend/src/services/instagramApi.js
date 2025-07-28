const axios = require('axios');

class InstagramApiService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://graph.instagram.com';
    
    // Configure axios with longer timeout for Instagram API
    this.axiosInstance = axios.create({
      timeout: 45000, // 45 seconds timeout
      headers: {
        'User-Agent': 'InstagramStore/1.0'
      }
    });
  }

  // Test token validity and get basic user info
  async testToken() {
    try {
      const url = `${this.baseUrl}/me`;
      const params = {
        access_token: this.accessToken,
        fields: 'id,username,account_type'
      };
      
      const response = await this.axiosInstance.get(url, { params });
      return response.data;
    } catch (error) {
      throw new Error(`Token test failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Check if token is valid and not expired
  async isTokenValid() {
    try {
      await this.testToken();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get token expiration info
  async getTokenInfo() {
    try {
      const url = `${this.baseUrl}/debug_token`;
      const params = {
        input_token: this.accessToken,
        access_token: this.accessToken
      };
      
      const response = await this.axiosInstance.get(url, { params });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to get token info: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Get Instagram user ID and username
  async getInstagramUserInfo() {
    try {
      const url = `${this.baseUrl}/me`;
      const params = {
        access_token: this.accessToken,
        fields: 'user_id,username'
      };
      const response = await this.axiosInstance.get(url, { params });
      return response.data; // { user_id, username }
    } catch (error) {
      throw new Error(`Failed to get Instagram user info: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Get media objects for a given IG user ID
  async getInstagramMediaByUserId(igUserId) {
    try {
      const url = `${this.baseUrl}/${igUserId}/media`;
      const params = {
        access_token: this.accessToken
      };
      const response = await this.axiosInstance.get(url, { params });
      return response.data.data; // array of media objects
    } catch (error) {
      throw new Error(`Failed to get Instagram media: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Get Instagram media (posts)
  async getInstagramMedia(limit = 25) {
    try {
      const url = `${this.baseUrl}/me/media`;
      const params = {
        access_token: this.accessToken,
        fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count',
        limit: limit
      };
      
      const response = await this.axiosInstance.get(url, { params });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to get Instagram media: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Get media insights (for a single media item)
  async getMediaInsights(mediaId, mediaType = null) {
    try {
      // Define metrics based on media type
      let metrics;
      if (mediaType === 'VIDEO' || mediaType === 'REELS') {
        metrics = 'reach,likes,comments,saved,video_views';
      } else if (mediaType === 'STORY') {
        metrics = 'reach,exits,replies';
      } else {
        // For IMAGE and CAROUSEL_ALBUM, try without impressions first
        metrics = 'reach,likes,comments,saved';
      }
      
      const url = `${this.baseUrl}/${mediaId}/insights`;
      const params = {
        access_token: this.accessToken,
        metric: metrics
      };
      
      const response = await this.axiosInstance.get(url, { params });
      return response.data.data;
    } catch (error) {
      // If the first attempt fails, try with minimal metrics
      if (error.response?.data?.error?.message?.includes('impressions') || 
          error.response?.data?.error?.message?.includes('not support')) {
        try {
          const url = `${this.baseUrl}/${mediaId}/insights`;
          const params = {
            access_token: this.accessToken,
            metric: 'likes,comments'
          };
          
          const response = await this.axiosInstance.get(url, { params });
          return response.data.data;
        } catch (retryError) {
          throw new Error(`Failed to get media insights (retry): ${retryError.response?.data?.error?.message || retryError.message}`);
        }
      }
      
      throw new Error(`Failed to get media insights: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Get media by ID
  async getMediaById(mediaId) {
    try {
      const url = `${this.baseUrl}/${mediaId}`;
      const params = {
        access_token: this.accessToken,
        fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count'
      };
      
      const response = await this.axiosInstance.get(url, { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get media by ID: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Get available metrics for media type
  getAvailableMetrics(mediaType) {
    const metricsMap = {
      'IMAGE': ['reach', 'likes', 'comments', 'saved'],
      'VIDEO': ['reach', 'likes', 'comments', 'saved', 'video_views'],
      'CAROUSEL_ALBUM': ['reach', 'likes', 'comments', 'saved'],
      'STORY': ['reach', 'exits', 'replies'],
      'REELS': ['reach', 'likes', 'comments', 'saved', 'video_views']
    };
    
    return metricsMap[mediaType] || ['likes', 'comments'];
  }

  // Get comments for a post
  async getComments(mediaId) {
    try {
      const url = `${this.baseUrl}/${mediaId}/comments`;
      const params = {
        access_token: this.accessToken,
        fields: 'id,text,from,timestamp'
      };
      
      const response = await this.axiosInstance.get(url, { params });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to get comments: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Reply to a comment
  async replyToComment(commentId, replyText) {
    try {
      const url = `${this.baseUrl}/${commentId}/replies`;
      const data = {
        access_token: this.accessToken,
        message: replyText
      };
      
      const response = await this.axiosInstance.post(url, data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to reply to comment: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Upload media to Instagram
  async uploadMedia(mediaData) {
    try {
      const { mediaUrl, caption, mediaType = 'IMAGE' } = mediaData;
      
      const url = `${this.baseUrl}/me/media`;
      const data = {
        access_token: this.accessToken,
        image_url: mediaUrl,
        caption: caption,
        media_type: mediaType
      };
      
      console.log('Instagram API Request:', { url, data: { ...data, access_token: '***' } });
      
      // Create media container
      const mediaResponse = await this.axiosInstance.post(url, data);
      const creationId = mediaResponse.data.id;
      
      // Publish the media
      const publishUrl = `${this.baseUrl}/me/media_publish`;
      const publishData = {
        access_token: this.accessToken,
        creation_id: creationId
      };
      
      console.log('Instagram API Request:', { url: publishUrl, data: { ...publishData, access_token: '***' } });
      
      const publishResponse = await this.axiosInstance.post(publishUrl, publishData);
      return publishResponse.data;
    } catch (error) {
      console.error('Instagram API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        errorMessage: error.response?.data?.error?.message,
        errorType: error.response?.data?.error?.type,
        errorCode: error.response?.data?.error?.code,
        fullError: error.response?.data
      });
      throw new Error(`Failed to upload media: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Upload carousel (multiple images)
  async uploadCarousel(carouselData) {
    try {
      const { mediaUrls, caption } = carouselData;
      
      const url = `${this.baseUrl}/me/media`;
      const data = {
        access_token: this.accessToken,
        media_type: 'CAROUSEL',
        children: mediaUrls.map(url => ({ image_url: url })),
        caption: caption
      };
      
      console.log('Instagram API Request:', { url, data: { ...data, access_token: '***' } });
      
      // Create carousel container
      const carouselResponse = await this.axiosInstance.post(url, data);
      const creationId = carouselResponse.data.id;
      
      // Publish the carousel
      const publishUrl = `${this.baseUrl}/me/media_publish`;
      const publishData = {
        access_token: this.accessToken,
        creation_id: creationId
      };
      
      console.log('Instagram API Request:', { url: publishUrl, data: { ...publishData, access_token: '***' } });
      
      const publishResponse = await this.axiosInstance.post(publishUrl, publishData);
      return publishResponse.data;
    } catch (error) {
      console.error('Instagram API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        errorMessage: error.response?.data?.error?.message,
        errorType: error.response?.data?.error?.type,
        errorCode: error.response?.data?.error?.code,
        fullError: error.response?.data
      });
      throw new Error(`Failed to upload carousel: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Upload story
  async uploadStory(storyData) {
    try {
      const { mediaUrl, caption } = storyData;
      
      const url = `${this.baseUrl}/me/media`;
      const data = {
        access_token: this.accessToken,
        image_url: mediaUrl,
        caption: caption,
        media_type: 'STORY'
      };
      
      console.log('Instagram API Request:', { url, data: { ...data, access_token: '***' } });
      
      // Create story container
      const storyResponse = await this.axiosInstance.post(url, data);
      const creationId = storyResponse.data.id;
      
      // Publish the story
      const publishUrl = `${this.baseUrl}/me/media_publish`;
      const publishData = {
        access_token: this.accessToken,
        creation_id: creationId
      };
      
      console.log('Instagram API Request:', { url: publishUrl, data: { ...publishData, access_token: '***' } });
      
      const publishResponse = await this.axiosInstance.post(publishUrl, publishData);
      return publishResponse.data;
    } catch (error) {
      console.error('Instagram API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        errorMessage: error.response?.data?.error?.message,
        errorType: error.response?.data?.error?.type,
        errorCode: error.response?.data?.error?.code,
        fullError: error.response?.data
      });
      throw new Error(`Failed to upload story: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Get mentions
  async getMentions() {
    try {
      const url = `${this.baseUrl}/me/tags`;
      const params = {
        access_token: this.accessToken,
        fields: 'id,media_type,media_url,permalink,timestamp'
      };
      
      console.log('Instagram API Request:', { url, params: { ...params, access_token: '***' } });
      
      const response = await this.axiosInstance.get(url, { params });
      return response.data.data;
    } catch (error) {
      console.error('Instagram API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        errorMessage: error.response?.data?.error?.message,
        errorType: error.response?.data?.error?.type,
        errorCode: error.response?.data?.error?.code,
        fullError: error.response?.data
      });
      throw new Error(`Failed to get mentions: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Product catalog and commerce endpoints are not supported for Instagram API with Instagram Login
  async getProductCatalog() {
    throw new Error('Product catalog is not supported by the Instagram API with Instagram Login.');
  }
  async createProduct() {
    throw new Error('Product catalog is not supported by the Instagram API with Instagram Login.');
  }
  async updateProduct() {
    throw new Error('Product catalog is not supported by the Instagram API with Instagram Login.');
  }
  async deleteProduct() {
    throw new Error('Product catalog is not supported by the Instagram API with Instagram Login.');
  }
  async getProducts() {
    throw new Error('Product catalog is not supported by the Instagram API with Instagram Login.');
  }

  // Create webhook subscription
  async createWebhookSubscription(webhookConfig) {
    try {
      const response = await this.axiosInstance.post(`${this.baseUrl}/me/webhooks`, webhookConfig);
      return response.data;
    } catch (error) {
      console.error('Error creating webhook subscription:', error);
      throw error;
    }
  }

  // Get webhook subscriptions
  async getWebhookSubscriptions() {
    try {
      const response = await this.axiosInstance.get(`${this.baseUrl}/me/webhooks`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error getting webhook subscriptions:', error);
      throw error;
    }
  }

  // Delete webhook subscription
  async deleteWebhookSubscription(subscriptionId) {
    try {
      await this.axiosInstance.delete(`${this.baseUrl}/me/webhooks/${subscriptionId}`);
      return true;
    } catch (error) {
      console.error('Error deleting webhook subscription:', error);
      throw error;
    }
  }

  // Update webhook fields
  async updateWebhookFields(fields) {
    try {
      const response = await this.axiosInstance.post(`${this.baseUrl}/me/webhooks`, {
        object: 'instagram',
        callback_url: process.env.WEBHOOK_CALLBACK_URL,
        verify_token: process.env.WEBHOOK_VERIFY_TOKEN,
        fields: fields
      });
      return response.data;
    } catch (error) {
      console.error('Error updating webhook fields:', error);
      throw error;
    }
  }
}

module.exports = InstagramApiService; 