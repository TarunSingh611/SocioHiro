const axios = require('axios');

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