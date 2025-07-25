const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const automationRoutes = require('./automation');
const productRoutes = require('./products');
const orderRoutes = require('./orders');
const campaignRoutes = require('./campaigns');
const instagramRoutes = require('./instagram');
const webhookRoutes = require('./webhooks');
const analyticsRoutes = require('./analytics');
const cronRoutes = require('./cron');

router.use('/auth', authRoutes);
router.use('/automation', automationRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/instagram', instagramRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/cron', cronRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'API root' });
});

module.exports = router; 