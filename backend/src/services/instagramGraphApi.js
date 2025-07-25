const axios = require('axios');

class InstagramGraphApiService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://graph.facebook.com/v18.0';
  }

  // Get user's Facebook pages
  async getPages() {
    try {
      const response = await axios.get(`${this.baseUrl}/me/accounts`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,name,instagram_business_account'
        }
      });
      
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to get Facebook pages: ${error.message}`);
    }
  }

  // Get Instagram Business Account ID from Facebook page
  async getInstagramBusinessAccount(pageId) {
    try {
      const response = await axios.get(`${this.baseUrl}/${pageId}`, {
        params: {
          access_token: this.accessToken,
          fields: 'instagram_business_account'
        }
      });
      
      if (response.data.instagram_business_account) {
        return response.data.instagram_business_account.id;
      }
      throw new Error('No Instagram Business Account connected to this page');
    } catch (error) {
      throw new Error(`Failed to get Instagram Business Account: ${error.message}`);
    }
  }

  // Get Instagram Business Account details
  async getInstagramAccountInfo(instagramBusinessAccountId) {
    try {
      const response = await axios.get(`${this.baseUrl}/${instagramBusinessAccountId}`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,username,name,profile_picture_url,biography,followers_count,media_count'
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get Instagram account info: ${error.message}`);
    }
  }

  // Get Instagram media (posts)
  async getMedia(instagramBusinessAccountId, limit = 25) {
    try {
      const response = await axios.get(`${this.baseUrl}/${instagramBusinessAccountId}/media`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count',
          limit
        }
      });
      
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to get Instagram media: ${error.message}`);
    }
  }

  // Create a post
  async createPost(instagramBusinessAccountId, { mediaUrl, caption, location }) {
    try {
      // First, create the media container
      const mediaResponse = await axios.post(`${this.baseUrl}/${instagramBusinessAccountId}/media`, {
        image_url: mediaUrl,
        caption: caption,
        access_token: this.accessToken
      });

      const mediaId = mediaResponse.data.id;

      // Then publish the media
      const publishResponse = await axios.post(`${this.baseUrl}/${instagramBusinessAccountId}/media_publish`, {
        creation_id: mediaId,
        access_token: this.accessToken
      });

      return publishResponse.data.id;
    } catch (error) {
      throw new Error(`Failed to create Instagram post: ${error.message}`);
    }
  }

  // Create a story
  async createStory(instagramBusinessAccountId, { mediaUrl, caption }) {
    try {
      const response = await axios.post(`${this.baseUrl}/${instagramBusinessAccountId}/media`, {
        media_type: 'STORIES',
        image_url: mediaUrl,
        caption: caption,
        access_token: this.accessToken
      });

      return response.data.id;
    } catch (error) {
      throw new Error(`Failed to create Instagram story: ${error.message}`);
    }
  }

  // Get insights for posts
  async getPostInsights(mediaId, metrics = ['impressions', 'reach', 'engagement']) {
    try {
      const response = await axios.get(`${this.baseUrl}/${mediaId}/insights`, {
        params: {
          access_token: this.accessToken,
          metric: metrics.join(',')
        }
      });
      
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to get post insights: ${error.message}`);
    }
  }

  // Get account insights
  async getAccountInsights(instagramBusinessAccountId, metrics = ['impressions', 'reach', 'follower_count']) {
    try {
      const response = await axios.get(`${this.baseUrl}/${instagramBusinessAccountId}/insights`, {
        params: {
          access_token: this.accessToken,
          metric: metrics.join(','),
          period: 'day'
        }
      });
      
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to get account insights: ${error.message}`);
    }
  }

  // Get comments for a post
  async getComments(mediaId) {
    try {
      const response = await axios.get(`${this.baseUrl}/${mediaId}/comments`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,text,from,timestamp'
        }
      });
      
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to get comments: ${error.message}`);
    }
  }

  // Reply to a comment
  async replyToComment(commentId, message) {
    try {
      const response = await axios.post(`${this.baseUrl}/${commentId}/replies`, {
        message: message,
        access_token: this.accessToken
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to reply to comment: ${error.message}`);
    }
  }

  // Get mentions
  async getMentions(instagramBusinessAccountId) {
    try {
      const response = await axios.get(`${this.baseUrl}/${instagramBusinessAccountId}/tags`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,media_type,media_url,permalink,timestamp'
        }
      });
      
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to get mentions: ${error.message}`);
    }
  }
}

module.exports = InstagramGraphApiService; 