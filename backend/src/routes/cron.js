const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');

// Manual trigger for Instagram token refresh (for testing)
router.get('/refresh-instagram-tokens', async (req, res) => {
  try {
    // Find users whose tokens need refresh (expire within 50 days or are expired)
    const usersToRefresh = await User.find({
      accessToken: { $exists: true, $ne: null },
      $or: [
        { tokenExpiresAt: { $lte: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000) } }, // Expires within 50 days
        { tokenExpiresAt: { $exists: false } }, // No expiration date set
        { lastTokenRefresh: { $exists: false } } // Never refreshed
      ]
    });
    
    let refreshed = 0, failed = 0, invalid = 0;
    
    for (const user of usersToRefresh) {
      try {
        console.log(`🔄 Refreshing token for user ${user.username || user._id}`);
        
        const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
          params: {
            grant_type: 'ig_refresh_token',
            access_token: user.accessToken
          }
        });
        
        user.accessToken = response.data.access_token;
        user.tokenExpiresIn = response.data.expires_in || 60 * 24 * 60 * 60; // Default to 60 days if not provided
        user.lastTokenRefresh = new Date();
        await user.save();
        refreshed++;
        
        console.log(`✅ Refreshed token for user ${user.username || user._id}`);
      } catch (err) {
        console.error(`❌ Failed to refresh token for user ${user.username || user._id}:`, err.response?.data || err.message);
        
        if (err.response?.status === 400 || err.response?.status === 401) {
          invalid++;
          console.log(`⚠️ Token for user ${user.username || user._id} appears to be invalid, may need re-authentication`);
        } else {
          failed++;
        }
      }
    }
    
    res.json({ 
      refreshed, 
      failed, 
      invalid,
      total: usersToRefresh.length,
      message: `Refreshed ${refreshed} tokens, ${failed} failed, ${invalid} invalid tokens`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exchange short-lived tokens for long-lived tokens
router.get('/exchange-short-lived-tokens', async (req, res) => {
  try {
    console.log('🔄 Starting short-lived token exchange...');
    
    // Find all users with Instagram tokens
    const users = await User.find({
      accessToken: { $exists: true, $ne: null },
      instagramId: { $exists: true, $ne: null }
    });
    
    let exchanged = 0, failed = 0, skipped = 0;
    
    for (const user of users) {
      try {
        console.log(`🔄 Checking token for user ${user.username || user._id}`);
        
        // Test if current token is valid
        const testResponse = await axios.get('https://graph.instagram.com/me', {
          params: {
            fields: 'id,username,account_type',
            access_token: user.accessToken
          }
        });
        
        // If token is working, try to exchange it for long-lived token
        const exchangeResponse = await axios.get('https://graph.instagram.com/access_token', {
          params: {
            grant_type: 'ig_exchange_token',
            client_secret: process.env.INSTAGRAM_APP_SECRET,
            access_token: user.accessToken
          }
        });
        
        const longLivedToken = exchangeResponse.data.access_token;
        const expiresIn = exchangeResponse.data.expires_in;
        
        // Update user with long-lived token
        user.accessToken = longLivedToken;
        user.tokenExpiresIn = expiresIn;
        user.lastTokenRefresh = new Date();
        await user.save();
        
        exchanged++;
        console.log(`✅ Exchanged token for user ${user.username || user._id}, expires in ${Math.round(expiresIn / 86400)} days`);
        
      } catch (err) {
        console.error(`❌ Failed to exchange token for user ${user.username || user._id}:`, err.response?.data || err.message);
        
        if (err.response?.status === 400 && err.response?.data?.error?.message?.includes('already a long-lived token')) {
          skipped++;
          console.log(`⏭️ Token for user ${user.username || user._id} is already long-lived`);
        } else {
          failed++;
        }
      }
    }
    
    res.json({ 
      exchanged, 
      failed, 
      skipped,
      total: users.length,
      message: `Exchanged ${exchanged} tokens, ${failed} failed, ${skipped} already long-lived`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 