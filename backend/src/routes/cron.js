const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');

// Manual trigger for Instagram token refresh (for testing)
router.get('/refresh-instagram-tokens', async (req, res) => {
  try {
    const fiftyDaysAgo = new Date(Date.now() - 50 * 24 * 60 * 60 * 1000);
    const usersToRefresh = await User.find({
      accessToken: { $exists: true, $ne: null },
      lastTokenRefresh: { $lte: fiftyDaysAgo }
    });
    let refreshed = 0, failed = 0;
    for (const user of usersToRefresh) {
      try {
        const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
          params: {
            grant_type: 'ig_refresh_token',
            access_token: user.accessToken
          }
        });
        user.accessToken = response.data.access_token;
        user.tokenExpiresIn = response.data.expires_in;
        user.lastTokenRefresh = new Date();
        await user.save();
        refreshed++;
      } catch (err) {
        failed++;
      }
    }
    res.json({ refreshed, failed, total: usersToRefresh.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 