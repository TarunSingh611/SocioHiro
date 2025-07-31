const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const InstagramAccount = require('../models/InstagramAccount');
const InstagramApiService = require('../services/instagramApi');

// Note: Basic CRUD operations for Instagram accounts are handled in /instagram-accounts
// This route file is for Instagram API operations (sync, analytics, media, etc.)

// Handle /instagram/accounts redirect
router.get('/accounts', requireAuth, async (req, res) => {
  res.status(200).json({ 
    message: 'Instagram accounts are managed at /instagram-accounts endpoint',
    redirect: '/instagram-accounts',
    note: 'Use /instagram-accounts for basic CRUD operations on Instagram accounts'
  });
});

// Handle root route with helpful information
router.get('/', requireAuth, async (req, res) => {
  res.json({
    message: 'Instagram API operations',
    availableEndpoints: {
      accounts: '/instagram-accounts',
      sync: '/instagram/:id/sync',
      analytics: '/instagram/:id/analytics',
      media: '/instagram/:id/media'
    },
    note: 'For basic CRUD operations on Instagram accounts, use /instagram-accounts endpoint'
  });
});

// Sync Instagram account data
router.post('/:id/sync', requireAuth, async (req, res) => {
  try {
    const account = await InstagramAccount.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!account) {
      return res.status(404).json({ error: 'Instagram account not found' });
    }

    if (account.status !== 'connected') {
      return res.status(400).json({ error: 'Account is not connected' });
    }

    // Get user's access token
    const accessToken = req.user.accessToken;
    if (!accessToken) {
      return res.status(400).json({ error: 'No access token available' });
    }

    const instagramApi = new InstagramApiService(accessToken);

    // Fetch updated account data from Instagram
    const accountData = await instagramApi.getAccountInfo();
    
    // Update account with fresh data
    account.followers = accountData.followers_count || account.followers;
    account.following = accountData.follows_count || account.following;
    account.posts = accountData.media_count || account.posts;
    account.displayName = accountData.name || account.displayName;
    account.profileImage = accountData.profile_picture_url || account.profileImage;
    account.lastSync = new Date();

    await account.save();

    res.json({
      message: 'Account synced successfully',
      account
    });
  } catch (error) {
    console.error('Error syncing Instagram account:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Instagram account analytics
router.get('/:id/analytics', requireAuth, async (req, res) => {
  try {
    const account = await InstagramAccount.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!account) {
      return res.status(404).json({ error: 'Instagram account not found' });
    }

    if (account.status !== 'connected') {
      return res.status(400).json({ error: 'Account is not connected' });
    }

    // Get user's access token
    const accessToken = req.user.accessToken;
    if (!accessToken) {
      return res.status(400).json({ error: 'No access token available' });
    }

    const instagramApi = new InstagramApiService(accessToken);

    // Fetch analytics data
    const analytics = await instagramApi.getAccountAnalytics();

    res.json(analytics);
  } catch (error) {
    console.error('Error getting Instagram account analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Instagram account media
router.get('/:id/media', requireAuth, async (req, res) => {
  try {
    const account = await InstagramAccount.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!account) {
      return res.status(404).json({ error: 'Instagram account not found' });
    }

    if (account.status !== 'connected') {
      return res.status(400).json({ error: 'Account is not connected' });
    }

    // Get user's access token
    const accessToken = req.user.accessToken;
    if (!accessToken) {
      return res.status(400).json({ error: 'No access token available' });
    }

    const instagramApi = new InstagramApiService(accessToken);

    // Fetch media data
    const { limit = 20, offset = 0 } = req.query;
    const media = await instagramApi.getUserMedia(parseInt(limit), parseInt(offset));

    res.json(media);
  } catch (error) {
    console.error('Error getting Instagram account media:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Instagram account insights
router.get('/:id/insights', requireAuth, async (req, res) => {
  try {
    const account = await InstagramAccount.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!account) {
      return res.status(404).json({ error: 'Instagram account not found' });
    }

    if (account.status !== 'connected') {
      return res.status(400).json({ error: 'Account is not connected' });
    }

    // Get user's access token
    const accessToken = req.user.accessToken;
    if (!accessToken) {
      return res.status(400).json({ error: 'No access token available' });
    }

    const instagramApi = new InstagramApiService(accessToken);

    // Fetch insights data
    const insights = await instagramApi.getAccountInsights();

    res.json(insights);
  } catch (error) {
    console.error('Error getting Instagram account insights:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test Instagram account connection
router.post('/:id/test', requireAuth, async (req, res) => {
  try {
    const account = await InstagramAccount.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!account) {
      return res.status(404).json({ error: 'Instagram account not found' });
    }

    if (account.status !== 'connected') {
      return res.status(400).json({ error: 'Account is not connected' });
    }

    // Get user's access token
    const accessToken = req.user.accessToken;
    if (!accessToken) {
      return res.status(400).json({ error: 'No access token available' });
    }

    const instagramApi = new InstagramApiService(accessToken);

    // Test connection by fetching basic account info
    const accountInfo = await instagramApi.getAccountInfo();

    res.json({
      success: true,
      message: 'Connection test successful',
      accountInfo
    });
  } catch (error) {
    console.error('Error testing Instagram account connection:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Bulk sync all connected accounts
router.post('/bulk-sync', requireAuth, async (req, res) => {
  try {
    const accounts = await InstagramAccount.find({
      userId: req.user._id,
      status: 'connected'
    });

    if (accounts.length === 0) {
      return res.status(400).json({ error: 'No connected accounts found' });
    }

    // Get user's access token
    const accessToken = req.user.accessToken;
    if (!accessToken) {
      return res.status(400).json({ error: 'No access token available' });
    }

    const instagramApi = new InstagramApiService(accessToken);
    const results = [];

    for (const account of accounts) {
      try {
        // Fetch updated account data from Instagram
        const accountData = await instagramApi.getAccountInfo();
        
        // Update account with fresh data
        account.followers = accountData.followers_count || account.followers;
        account.following = accountData.follows_count || account.following;
        account.posts = accountData.media_count || account.posts;
        account.displayName = accountData.name || account.displayName;
        account.profileImage = accountData.profile_picture_url || account.profileImage;
        account.lastSync = new Date();

        await account.save();

        results.push({
          accountId: account._id,
          success: true,
          message: 'Account synced successfully'
        });
      } catch (error) {
        console.error(`Error syncing account ${account._id}:`, error);
        results.push({
          accountId: account._id,
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      message: 'Bulk sync completed',
      results
    });
  } catch (error) {
    console.error('Error bulk syncing Instagram accounts:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 