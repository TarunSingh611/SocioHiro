const axios = require('axios');

class InstagramApiService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    // Use Instagram Graph API base URL with version 23.0
    this.baseUrl = 'https://graph.instagram.com/v23.0';
    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
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

  // Check if token has messaging permissions
  async checkMessagingPermissions() {
    try {
      const url = `${this.baseUrl}/me`;
      const params = {
        access_token: this.accessToken,
        fields: 'id,username,account_type'
      };
      
      const response = await this.axiosInstance.get(url, { params });
      console.log('Account info for messaging permissions:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking permissions:', error.response?.data || error.message);
      return null;
    }
  }

  // Try to get user info by ID (to verify if user exists and is accessible)
  async getUserInfo(userId) {
    try {
      const url = `${this.baseUrl}/${userId}?fields=id,username,account_type`;
      
      const response = await this.axiosInstance.get(url);
      console.log('User info retrieved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.log('Cannot retrieve user info:', error.response?.data || error.message);
      return null;
    }
  }

  // Try to get user info by ID (for recipient lookup)
  async getUserInfoById(userId) {
    try {
      console.log('🔍 Attempting to get user info for ID:', userId);
      const url = `${this.baseUrl}/${userId}?fields=id,username,account_type`;
      console.log('📡 Making request to:', url);
      
      const response = await this.axiosInstance.get(url);
      console.log('✅ User info retrieved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.log('❌ Cannot get user info for ID:', userId);
      console.log('Error details:', error.response?.data || error.message);
      
      // Provide specific guidance based on error
      if (error.response?.data?.error?.code === 100) {
        console.log('💡 This usually means:');
        console.log('   1. User ID format is incorrect');
        console.log('   2. User has privacy restrictions');
        console.log('   3. User account is private or deleted');
        console.log('   4. Instagram API permissions are insufficient');
      }
      
      return null;
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

  // Get comprehensive Instagram account information
  async getDetailedAccountInfo() {
    try {
      const url = `${this.baseUrl}/me`;
      const params = {
        access_token: this.accessToken,
        fields: 'id,username,account_type,media_count,followers_count,follows_count,biography,website,name,profile_picture_url'
      };
      const response = await this.axiosInstance.get(url, { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get detailed Instagram account info: ${error.response?.data?.error?.message || error.message}`);
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

  // Webhook management for Instagram API with Instagram Login
  // Note: Webhooks must be configured manually in Facebook App dashboard
  // Instagram API with Instagram Login does not support webhook creation via API
  
  async createWebhookSubscription(webhookConfig) {
    throw new Error(
      'Webhook creation via API is not supported for Instagram API with Instagram Login. ' +
      'Please configure webhooks manually in your Facebook App dashboard:\n' +
      '1. Go to https://developers.facebook.com/apps/\n' +
      '2. Select your Instagram app\n' +
      '3. Navigate to: Instagram Graph API → Webhooks\n' +
      '4. Configure webhook URL and verify token\n' +
      '5. Subscribe to desired fields (messages, mentions, comments)'
    );
  }

  async getWebhookSubscriptions() {
    throw new Error(
      'Webhook subscription retrieval via API is not supported for Instagram API with Instagram Login. ' +
      'Webhooks are managed through Facebook App dashboard configuration.'
    );
  }

  async deleteWebhookSubscription(subscriptionId) {
    throw new Error(
      'Webhook deletion via API is not supported for Instagram API with Instagram Login. ' +
      'Webhooks are managed through Facebook App dashboard configuration.'
    );
  }

  async updateWebhookFields(subscriptionId, fields) {
    try {
      const url = `${this.baseUrl}/${subscriptionId}`;
      const data = {
        access_token: this.accessToken,
        fields: fields.join(',')
      };
      
      const response = await this.axiosInstance.post(url, data);
      return response.data;
    } catch (error) {
      console.error('Error updating webhook fields:', error.response?.data || error.message);
      throw new Error(`Failed to update webhook fields: ${error.response?.data?.error?.message || error.message}`);
    }
  }



    // Send direct message to commenter or DM sender
  async sendDirectMessage(userId, message) {
    try {
      // Use the Instagram Business API messaging endpoint
      const url = `${this.baseUrl}/me/messages`;
      
      // Format data as expected by Instagram Business API
      const data = {
        access_token: this.accessToken,
        recipient: { id: userId },
        message: { text: message }
      };
      
      console.log('Sending Instagram Business API DM to user:', { 
        recipientId: userId, 
        message: message.substring(0, 50) + '...' 
      });
      
      const response = await this.axiosInstance.post(url, data);
      
      if (response.data && response.data.message_id) {
        console.log('✅ SUCCESS! DM sent via Instagram Business API');
        return { success: true, message_id: response.data.message_id };
      } else if (response.data && response.data.id) {
        console.log('✅ SUCCESS! DM sent via Instagram Business API');
        return { success: true, message_id: response.data.id };
      } else {
        console.log('❌ No message ID in response');
        return { success: false, error: 'No message ID in response' };
      }
      
    } catch (error) {
      console.error('Error sending Instagram Business API DM:', error.response?.data || error.message);
      
      // Provide helpful error information
      if (error.response?.data?.error?.code === 100) {
        console.log('User not found error. This could be due to:');
        console.log('1. User ID format mismatch');
        console.log('2. User privacy settings');
        console.log('3. Invalid user ID');
        console.log('4. User account type restrictions');
        console.log('5. Instagram Business API permissions insufficient');
      }
      
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Send private reply to comment (Instagram Private Reply)
  async sendPrivateReplyToComment(commentId, message) {
    try {
      const url = `${this.baseUrl}/${commentId}/private_replies`;
      const data = {
        access_token: this.accessToken,
        message: message
      };
      
      console.log('Sending private reply to comment:', { commentId, message: message.substring(0, 50) + '...' });
      
      const response = await this.axiosInstance.post(url, data);
      
      if (response.data && response.data.id) {
        console.log('✅ SUCCESS! Private reply sent');
        return { success: true, reply_id: response.data.id };
      } else {
        return { success: false, error: 'No reply ID in response' };
      }
      
    } catch (error) {
      console.error('Error sending private reply:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Get commenters for a specific post
  async getCommenters(mediaId) {
    try {
      const url = `${this.baseUrl}/${mediaId}/comments`;
      const params = {
        access_token: this.accessToken,
        fields: 'id,text,from,timestamp,username'
      };
      
      const response = await this.axiosInstance.get(url, { params });
      return response.data.data;
    } catch (error) {
      console.error('Error getting commenters:', error.response?.data || error.message);
      throw new Error(`Failed to get commenters: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Get recent messages (for DM senders)
  async getRecentMessages(limit = 25) {
    try {
      const url = `${this.baseUrl}/me/conversations`;
      const params = {
        access_token: this.accessToken,
        fields: 'id,participants,messages{id,from,to,message,created_time}',
        limit: limit
      };
      
      const response = await this.axiosInstance.get(url, { params });
      return response.data.data;
    } catch (error) {
      console.error('Error getting recent messages:', error.response?.data || error.message);
      throw new Error(`Failed to get recent messages: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Like comment
  async likeComment(commentId, instagramAccountId) {
    try {
      const url = `${this.baseUrl}/${commentId}/likes`;
      const data = { access_token: this.accessToken };
      
      console.log('Liking comment:', commentId);
      
      const response = await this.axiosInstance.post(url, data);
      
      if (response.status === 200 || response.status === 201) {
        return { success: true, comment_id: commentId };
      } else {
        return { success: false, error: 'Failed to like comment' };
      }
    } catch (error) {
      console.error('Error liking comment:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Follow user
  async followUser(userId, instagramAccountId) {
    try {
      const url = `${this.baseUrl}/me/follows`;
      const data = {
        target_user_id: userId,
        access_token: this.accessToken
      };
      
      console.log('Following user:', userId);
      
      const response = await this.axiosInstance.post(url, data);
      
      if (response.status === 200 || response.status === 201) {
        return { success: true, user_id: userId };
      } else {
        return { success: false, error: 'Failed to follow user' };
      }
    } catch (error) {
      console.error('Error following user:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Send story reply
  async sendStoryReply(userId, message, instagramAccountId) {
    try {
      const url = `${this.baseUrl}/me/messages`;
      
      const data = {
        recipient: { id: userId },
        message: { 
          text: message,
          story_reply: true
        }
      };
      
      console.log('Sending story reply:', { userId, message: message.substring(0, 50) + '...' });
      
      const response = await this.axiosInstance.post(url, data, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.message_id) {
        return { success: true, message_id: response.data.message_id };
      } else {
        return { success: false, error: 'Failed to send story reply' };
      }
    } catch (error) {
      console.error('Error sending story reply:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

}

module.exports = InstagramApiService; 