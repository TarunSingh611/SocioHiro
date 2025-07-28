const cron = require('node-cron');
const axios = require('axios');
const User = require('../models/User');

function startInstagramTokenRefreshJob() {
  // Runs every week on Monday at 4:00 AM to check for tokens that need refresh
  cron.schedule('0 4 * * 1', async () => {
    console.log('🔄 Starting scheduled Instagram token refresh...');

    // Find users whose tokens need refresh (expire within 50 days or are expired)
    const usersToRefresh = await User.find({
      accessToken: { $exists: true, $ne: null },
      $or: [
        { tokenExpiresAt: { $lte: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000) } }, // Expires within 50 days
        { tokenExpiresAt: { $exists: false } }, // No expiration date set
        { lastTokenRefresh: { $exists: false } } // Never refreshed
      ]
    });

    console.log(`Found ${usersToRefresh.length} users with tokens needing refresh`);

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

        console.log(`✅ Refreshed token for user ${user.username || user._id}`);
      } catch (err) {
        console.error(`❌ Failed to refresh token for user ${user.username || user._id}:`, err.response?.data || err.message);
        
        // If refresh fails, mark the token as potentially invalid
        if (err.response?.status === 400 || err.response?.status === 401) {
          console.log(`⚠️ Token for user ${user.username || user._id} appears to be invalid, may need re-authentication`);
        }
      }
    }

    console.log('🔄 Instagram token refresh job complete.');
  });
}

module.exports = { startInstagramTokenRefreshJob }; 