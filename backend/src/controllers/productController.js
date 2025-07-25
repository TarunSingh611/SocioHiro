const Product = require('../models/Product');
const ProductSyncService = require('../services/productSyncService');
const { requireAuth, requireInstagramToken } = require('../middleware/auth');

class ProductController {
  // Get all products for user
  async getProducts(req, res) {
    try {
      const products = await Product.find({ userId: req.user._id });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get single product
  async getProduct(req, res) {
    try {
      const product = await Product.findOne({ 
        _id: req.params.id, 
        userId: req.user._id 
      });
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create new product
  async createProduct(req, res) {
    try {
      const productData = {
        ...req.body,
        userId: req.user._id
      };
      
      const product = new Product(productData);
      await product.save();
      
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update product
  async updateProduct(req, res) {
    try {
      const product = await Product.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete product
  async deleteProduct(req, res) {
    try {
      const product = await Product.findOneAndDelete({ 
        _id: req.params.id, 
        userId: req.user._id 
      });
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Sync single product to Instagram
  async syncProductToInstagram(req, res) {
    try {
      const product = await Product.findOne({ 
        _id: req.params.id, 
        userId: req.user._id 
      });
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const syncService = new ProductSyncService(req.user);
      const syncedProduct = await syncService.syncProductToInstagram(product);
      
      res.json(syncedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Sync all products to Instagram
  async syncAllProductsToInstagram(req, res) {
    try {
      const syncService = new ProductSyncService(req.user);
      const results = await syncService.syncAllProducts();
      
      res.json({ results });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Sync products from Instagram
  async syncFromInstagram(req, res) {
    try {
      const syncService = new ProductSyncService(req.user);
      const results = await syncService.syncFromInstagram();
      
      res.json({ results });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete product from Instagram
  async deleteFromInstagram(req, res) {
    try {
      const syncService = new ProductSyncService(req.user);
      const result = await syncService.deleteFromInstagram(req.params.id);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProductController(); 