const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const campaignController = require('../controllers/campaignController');

// Development-only mock data routes (no auth required)
if (process.env.NODE_ENV === 'development') {
  router.get('/', (req, res) => {
    const mockCampaigns = Array.from({ length: 6 }, (_, i) => ({
      _id: `campaign_${i + 1}`,
      name: `Campaign ${i + 1}`,
      description: `This is a sample campaign description for campaign ${i + 1}.`,
      status: ["active", "paused", "completed"][Math.floor(Math.random() * 3)],
      platform: "Instagram",
      type: ["Post", "Story", "Reel"][Math.floor(Math.random() * 3)],
      scheduledDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: Math.floor(Math.random() * 1000) + 100,
      reach: Math.floor(Math.random() * 5000) + 500,
      content: `Sample content for campaign ${i + 1}`,
      hashtags: ['fashion', 'lifestyle', 'trending'],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
    res.json(mockCampaigns);
  });

  router.post('/', (req, res) => {
    const newCampaign = {
      _id: `campaign_${Date.now()}`,
      ...req.body,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    res.status(201).json(newCampaign);
  });

  router.put('/:id', (req, res) => {
    const updatedCampaign = {
      _id: req.params.id,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    res.json(updatedCampaign);
  });

  router.delete('/:id', (req, res) => {
    res.json({ message: 'Campaign deleted successfully' });
  });
} else {
  // All routes require authentication in production
  router.use(requireAuth);

  // Get all campaigns
  router.get('/', campaignController.getCampaigns);

  // Get campaign statistics
  router.get('/stats', campaignController.getCampaignStats);

  // Get scheduled campaigns
  router.get('/scheduled', campaignController.getScheduledCampaigns);

  // Get single campaign
  router.get('/:id', campaignController.getCampaign);

  // Create new campaign
  router.post('/', campaignController.createCampaign);

  // Update campaign
  router.put('/:id', campaignController.updateCampaign);

  // Delete campaign
  router.delete('/:id', campaignController.deleteCampaign);

  // Publish campaign to Instagram
  router.post('/:id/publish', campaignController.publishCampaign);

  // Schedule campaign
  router.post('/:id/schedule', campaignController.scheduleCampaign);
}

module.exports = router; 