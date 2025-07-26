const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class InstagramApiService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://graph.facebook.com/v18.0';
  }

  // Get user's Instagram Business Account
  async getInstagramBusinessAccount() {
    try {
      const response = await axios.get(`${this.baseUrl}/me/accounts`, {
        params: {
          access_token: this.accessToken,
          fields: 'instagram_business_account'
        }
      });
      
      const page = response.data.data[0];
      if (page && page.instagram_business_account) {
        return page.instagram_business_account.id;
      }
      throw new Error('No Instagram Business Account found');
    } catch (error) {
      throw new Error(`Failed to get Instagram Business Account: ${error.message}`);
    }
  }

  // Get Instagram user info
  async getInstagramUserInfo(instagramBusinessAccountId) {
    try {
      const response = await axios.get(`${this.baseUrl}/${instagramBusinessAccountId}`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,username,account_type,media_count,followers_count,follows_count,biography,website,profile_picture_url'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get Instagram user info: ${error.message}`);
    }
  }

  // Get Instagram media (posts)
  async getInstagramMedia(instagramBusinessAccountId, limit = 25) {
    try {
      const response = await axios.get(`${this.baseUrl}/${instagramBusinessAccountId}/media`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,insights.metric(impressions,reach,engagement)',
          limit: limit
        }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to get Instagram media: ${error.message}`);
    }
  }

  // Get Instagram insights
  async getInstagramInsights(instagramBusinessAccountId, metric = 'impressions,reach,profile_views,follower_count') {
    try {
      const response = await axios.get(`${this.baseUrl}/${instagramBusinessAccountId}/insights`, {
        params: {
          access_token: this.accessToken,
          metric: metric,
          period: 'day'
        }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to get Instagram insights: ${error.message}`);
    }
  }

  // Upload media to Instagram
  async uploadMedia(instagramBusinessAccountId, mediaData) {
    try {
      const { mediaUrl, caption, mediaType = 'IMAGE' } = mediaData;
      
      // Create media container
      const mediaResponse = await axios.post(`${this.baseUrl}/${instagramBusinessAccountId}/media`, {
        access_token: this.accessToken,
        image_url: mediaUrl,
        caption: caption,
        media_type: mediaType
      });

      const creationId = mediaResponse.data.id;
      
      // Publish the media
      const publishResponse = await axios.post(`${this.baseUrl}/${instagramBusinessAccountId}/media_publish`, {
        access_token: this.accessToken,
        creation_id: creationId
      });

      return publishResponse.data;
    } catch (error) {
      throw new Error(`Failed to upload media: ${error.message}`);
    }
  }

  // Upload carousel (multiple images)
  async uploadCarousel(instagramBusinessAccountId, carouselData) {
    try {
      const { mediaUrls, caption } = carouselData;
      
      // Create carousel container
      const carouselResponse = await axios.post(`${this.baseUrl}/${instagramBusinessAccountId}/media`, {
        access_token: this.accessToken,
        media_type: 'CAROUSEL',
        children: mediaUrls.map(url => ({ image_url: url })),
        caption: caption
      });

      const creationId = carouselResponse.data.id;
      
      // Publish the carousel
      const publishResponse = await axios.post(`${this.baseUrl}/${instagramBusinessAccountId}/media_publish`, {
        access_token: this.accessToken,
        creation_id: creationId
      });

      return publishResponse.data;
    } catch (error) {
      throw new Error(`Failed to upload carousel: ${error.message}`);
    }
  }

  // Upload story
  async uploadStory(instagramBusinessAccountId, storyData) {
    try {
      const { mediaUrl, caption } = storyData;
      
      // Create story container
      const storyResponse = await axios.post(`${this.baseUrl}/${instagramBusinessAccountId}/media`, {
        access_token: this.accessToken,
        image_url: mediaUrl,
        caption: caption,
        media_type: 'STORY'
      });

      const creationId = storyResponse.data.id;
      
      // Publish the story
      const publishResponse = await axios.post(`${this.baseUrl}/${instagramBusinessAccountId}/media_publish`, {
        access_token: this.accessToken,
        creation_id: creationId
      });

      return publishResponse.data;
    } catch (error) {
      throw new Error(`Failed to upload story: ${error.message}`);
    }
  }

  // Get media insights
  async getMediaInsights(mediaId, metrics = 'impressions,reach,engagement,saved') {
    try {
      const response = await axios.get(`${this.baseUrl}/${mediaId}/insights`, {
        params: {
          access_token: this.accessToken,
          metric: metrics
        }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to get media insights: ${error.message}`);
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
  async replyToComment(commentId, replyText) {
    try {
      const response = await axios.post(`${this.baseUrl}/${commentId}/replies`, {
        access_token: this.accessToken,
        message: replyText
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to reply to comment: ${error.message}`);
    }
  }

  // Get product catalog
  async getProductCatalog(instagramBusinessAccountId) {
    try {
      const response = await axios.get(`${this.baseUrl}/${instagramBusinessAccountId}/product_catalog`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,name,vertical'
        }
      });
      return response.data.data[0];
    } catch (error) {
      throw new Error(`Failed to get product catalog: ${error.message}`);
    }
  }

  // Create product in catalog
  async createProduct(catalogId, productData) {
    try {
      const response = await axios.post(`${this.baseUrl}/${catalogId}/products`, {
        access_token: this.accessToken,
        name: productData.title,
        description: productData.description,
        image_url: productData.imageUrl,
        price: productData.price,
        currency: productData.currency,
        availability: productData.stock > 0 ? 'in stock' : 'out of stock',
        condition: 'new',
        url: productData.url || '',
        brand: productData.brand || '',
        category: productData.category || ''
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  // Update product
  async updateProduct(productId, productData) {
    try {
      const response = await axios.post(`${this.baseUrl}/${productId}`, {
        access_token: this.accessToken,
        name: productData.title,
        description: productData.description,
        image_url: productData.imageUrl,
        price: productData.price,
        currency: productData.currency,
        availability: productData.stock > 0 ? 'in stock' : 'out of stock'
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  // Delete product
  async deleteProduct(productId) {
    try {
      const response = await axios.delete(`${this.baseUrl}/${productId}`, {
        params: {
          access_token: this.accessToken
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  // Get all products in catalog
  async getProducts(catalogId) {
    try {
      const response = await axios.get(`${this.baseUrl}/${catalogId}/products`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,name,description,image_url,price,currency,availability,url'
        }
      });
      
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to get products: ${error.message}`);
    }
  }
}

module.exports = InstagramApiService; 