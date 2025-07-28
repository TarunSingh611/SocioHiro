const axios = require('axios');

class InstagramApiService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://graph.instagram.com';
  }

  // Test token validity and get basic user info
  async testToken() {
    try {
      const url = `${this.baseUrl}/me`;
      const params = {
        access_token: this.accessToken,
        fields: 'id,username,account_type'
      };
      
      console.log('Testing Instagram token:', { url, params: { ...params, access_token: '***' } });
      
      const response = await axios.get(url, { params });
      console.log('Token test successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Token test failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        errorMessage: error.response?.data?.error?.message,
        errorType: error.response?.data?.error?.type,
        errorCode: error.response?.data?.error?.code,
        fullError: error.response?.data
      });
      throw new Error(`Token test failed: ${error.response?.data?.error?.message || error.message}`);
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
      console.log('Instagram API Request:', { url, params: { ...params, access_token: '***' } });
      const response = await axios.get(url, { params });
      return response.data; // { user_id, username }
    } catch (error) {
      console.error('Instagram API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        errorMessage: error.response?.data?.error?.message,
        errorType: error.response?.data?.error?.type,
        errorCode: error.response?.data?.error?.code,
        fullError: error.response?.data
      });
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
      console.log('Instagram API Request:', { url, params: { ...params, access_token: '***' } });
      const response = await axios.get(url, { params });
      return response.data.data; // array of media objects
    } catch (error) {
      console.error('Instagram API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        errorMessage: error.response?.data?.error?.message,
        errorType: error.response?.data?.error?.type,
        errorCode: error.response?.data?.error?.code,
        fullError: error.response?.data
      });
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
      
      console.log('Instagram API Request:', { url, params: { ...params, access_token: '***' } });
      
      const response = await axios.get(url, { params });
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
      throw new Error(`Failed to get Instagram media: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Get media insights (for a single media item)
  async getMediaInsights(mediaId, metrics = 'impressions,reach,engagement,saved') {
    try {
      const url = `${this.baseUrl}/${mediaId}/insights`;
      const params = {
        access_token: this.accessToken,
        metric: metrics
      };
      
      console.log('Instagram API Request:', { url, params: { ...params, access_token: '***' } });
      
      const response = await axios.get(url, { params });
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
      throw new Error(`Failed to get media insights: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Get comments for a post
  async getComments(mediaId) {
    try {
      const url = `${this.baseUrl}/${mediaId}/comments`;
      const params = {
        access_token: this.accessToken,
        fields: 'id,text,from,timestamp'
      };
      
      console.log('Instagram API Request:', { url, params: { ...params, access_token: '***' } });
      
      const response = await axios.get(url, { params });
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
      
      console.log('Instagram API Request:', { url, data: { ...data, access_token: '***' } });
      
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      console.error('Instagram API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        errorMessage: error.response?.data?.error?.message,
        errorType: error.response?.data?.error?.type,
        errorCode: error.response?.data?.error?.code,
        fullError: error.response?.data
      });
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
      const mediaResponse = await axios.post(url, data);
      const creationId = mediaResponse.data.id;
      
      // Publish the media
      const publishUrl = `${this.baseUrl}/me/media_publish`;
      const publishData = {
        access_token: this.accessToken,
        creation_id: creationId
      };
      
      console.log('Instagram API Request:', { url: publishUrl, data: { ...publishData, access_token: '***' } });
      
      const publishResponse = await axios.post(publishUrl, publishData);
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
      const carouselResponse = await axios.post(url, data);
      const creationId = carouselResponse.data.id;
      
      // Publish the carousel
      const publishUrl = `${this.baseUrl}/me/media_publish`;
      const publishData = {
        access_token: this.accessToken,
        creation_id: creationId
      };
      
      console.log('Instagram API Request:', { url: publishUrl, data: { ...publishData, access_token: '***' } });
      
      const publishResponse = await axios.post(publishUrl, publishData);
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
      const storyResponse = await axios.post(url, data);
      const creationId = storyResponse.data.id;
      
      // Publish the story
      const publishUrl = `${this.baseUrl}/me/media_publish`;
      const publishData = {
        access_token: this.accessToken,
        creation_id: creationId
      };
      
      console.log('Instagram API Request:', { url: publishUrl, data: { ...publishData, access_token: '***' } });
      
      const publishResponse = await axios.post(publishUrl, publishData);
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
      
      const response = await axios.get(url, { params });
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
}

module.exports = InstagramApiService; 