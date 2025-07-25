const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAuth, requireInstagramToken } = require('../middleware/auth');

// Development-only mock data routes (no auth required)
if (process.env.NODE_ENV === 'development') {
  router.get('/', (req, res) => {
    const mockProducts = Array.from({ length: 8 }, (_, i) => ({
      _id: `product_${i + 1}`,
      title: `Product ${i + 1}`,
      description: `This is a sample product description for product ${i + 1}.`,
      price: Math.floor(Math.random() * 200) + 20,
      currency: 'USD',
      stock: Math.floor(Math.random() * 100) + 10,
      imageUrl: `https://picsum.photos/400/300?random=${i + 1}`,
      category: ['Electronics', 'Clothing', 'Home', 'Sports'][Math.floor(Math.random() * 4)],
      tags: ['featured', 'new', 'trending'],
      sku: `SKU-${i + 1}`,
      weight: Math.random() * 2 + 0.1,
      dimensions: {
        length: Math.random() * 50 + 10,
        width: Math.random() * 30 + 5,
        height: Math.random() * 20 + 5
      },
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
    res.json(mockProducts);
  });

  router.post('/', (req, res) => {
    const newProduct = {
      _id: `product_${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    res.status(201).json(newProduct);
  });

  router.put('/:id', (req, res) => {
    const updatedProduct = {
      _id: req.params.id,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    res.json(updatedProduct);
  });

  router.delete('/:id', (req, res) => {
    res.json({ message: 'Product deleted successfully' });
  });

  router.post('/:id/sync', (req, res) => {
    res.json({ message: 'Product synced to Instagram successfully' });
  });
} else {
  // Apply authentication middleware to all routes in production
  router.use(requireAuth);

  // Get all products
  router.get('/', productController.getProducts);

  // Get single product
  router.get('/:id', productController.getProduct);

  // Create new product
  router.post('/', productController.createProduct);

  // Update product
  router.put('/:id', productController.updateProduct);

  // Delete product
  router.delete('/:id', productController.deleteProduct);

  // Sync routes (require Instagram token)
  router.use(requireInstagramToken);

  // Sync single product to Instagram
  router.post('/:id/sync', productController.syncProductToInstagram);

  // Sync all products to Instagram
  router.post('/sync/all', productController.syncAllProductsToInstagram);

  // Sync products from Instagram
  router.get('/sync/from-instagram', productController.syncFromInstagram);

  // Delete product from Instagram
  router.delete('/:id/instagram', productController.deleteFromInstagram);
}

module.exports = router; 