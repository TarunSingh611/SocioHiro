const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const campaignController = require('../controllers/campaignController');

// All routes require authentication
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

module.exports = router; 