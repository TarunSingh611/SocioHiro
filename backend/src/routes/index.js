const express = require('express');
const router = express.Router();

console.log('📁 Main routes index loaded');

const authRoutes = require('./auth');
const automationRoutes = require('./automation');
const campaignRoutes = require('./campaigns');
const instagramRoutes = require('./instagram');
const webhookRoutes = require('./webhooks');
const analyticsRoutes = require('./analytics');
const cronRoutes = require('./cron');
const contentRoutes = require('./content');

// Log all requests to main router
router.use('*', (req, res, next) => {
  
  next();
});

router.use('/auth', authRoutes);
router.use('/automation', automationRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/instagram', instagramRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/cron', cronRoutes);
router.use('/content', contentRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'API root' });
});

module.exports = router;
