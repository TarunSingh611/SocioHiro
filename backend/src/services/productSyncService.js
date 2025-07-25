const InstagramApiService = require('./instagramApi');
const Product = require('../models/Product');

class ProductSyncService {
  constructor(user) {
    this.user = user;
    this.instagramApi = new InstagramApiService(user.accessToken);
  }

  // Sync a single product to Instagram
  async syncProductToInstagram(productData) {
    try {
      // Get Instagram Business Account
      const instagramBusinessAccountId = await this.instagramApi.getInstagramBusinessAccount();
      
      // Get product catalog
      const catalog = await this.instagramApi.getProductCatalog(instagramBusinessAccountId);
      
      // Create or update product in Instagram
      let instagramProduct;
      if (productData.instagramProductId) {
        // Update existing product
        instagramProduct = await this.instagramApi.updateProduct(productData.instagramProductId, productData);
      } else {
        // Create new product
        instagramProduct = await this.instagramApi.createProduct(catalog.id, productData);
      }
      
      // Update local product with Instagram ID
      const localProduct = await Product.findByIdAndUpdate(
        productData._id,
        { 
          instagramProductId: instagramProduct.id,
          updatedAt: new Date()
        },
        { new: true }
      );
      
      return localProduct;
    } catch (error) {
      throw new Error(`Product sync failed: ${error.message}`);
    }
  }

  // Sync all products to Instagram
  async syncAllProducts() {
    try {
      const products = await Product.find({ userId: this.user._id });
      const results = [];
      
      for (const product of products) {
        try {
          const syncedProduct = await this.syncProductToInstagram(product);
          results.push({ success: true, product: syncedProduct });
        } catch (error) {
          results.push({ success: false, product: product._id, error: error.message });
        }
      }
      
      return results;
    } catch (error) {
      throw new Error(`Bulk sync failed: ${error.message}`);
    }
  }

  // Sync products from Instagram to local database
  async syncFromInstagram() {
    try {
      const instagramBusinessAccountId = await this.instagramApi.getInstagramBusinessAccount();
      const catalog = await this.instagramApi.getProductCatalog(instagramBusinessAccountId);
      const instagramProducts = await this.instagramApi.getProducts(catalog.id);
      
      const results = [];
      
      for (const instagramProduct of instagramProducts) {
        try {
          // Check if product exists locally
          let localProduct = await Product.findOne({ 
            instagramProductId: instagramProduct.id,
            userId: this.user._id
          });
          
          if (!localProduct) {
            // Create new local product
            localProduct = new Product({
              instagramProductId: instagramProduct.id,
              title: instagramProduct.name,
              description: instagramProduct.description,
              imageUrl: instagramProduct.image_url,
              price: instagramProduct.price,
              currency: instagramProduct.currency,
              stock: instagramProduct.availability === 'in stock' ? 1 : 0,
              userId: this.user._id
            });
          } else {
            // Update existing local product
            localProduct.title = instagramProduct.name;
            localProduct.description = instagramProduct.description;
            localProduct.imageUrl = instagramProduct.image_url;
            localProduct.price = instagramProduct.price;
            localProduct.currency = instagramProduct.currency;
            localProduct.stock = instagramProduct.availability === 'in stock' ? 1 : 0;
            localProduct.updatedAt = new Date();
          }
          
          await localProduct.save();
          results.push({ success: true, product: localProduct });
        } catch (error) {
          results.push({ success: false, product: instagramProduct.id, error: error.message });
        }
      }
      
      return results;
    } catch (error) {
      throw new Error(`Instagram sync failed: ${error.message}`);
    }
  }

  // Delete product from Instagram
  async deleteFromInstagram(productId) {
    try {
      const product = await Product.findById(productId);
      if (!product || product.userId.toString() !== this.user._id.toString()) {
        throw new Error('Product not found or access denied');
      }
      
      if (product.instagramProductId) {
        await this.instagramApi.deleteProduct(product.instagramProductId);
      }
      
      await Product.findByIdAndDelete(productId);
      return { success: true };
    } catch (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }
}

module.exports = ProductSyncService; 