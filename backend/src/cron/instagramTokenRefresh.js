const cron = require('node-cron');
const axios = require('axios');
const User = require('../models/User');

function startInstagramTokenRefreshJob() {
  // Runs every Monday at 4:00 AM
  cron.schedule('0 4 * * 1', async () => {
    console.log('🔄 Starting scheduled Instagram token refresh...');

    const fiftyDaysAgo = new Date(Date.now() - 50 * 24 * 60 * 60 * 1000);

    // Find users whose token hasn't been refreshed in 50 days
    const usersToRefresh = await User.find({
      accessToken: { $exists: true, $ne: null },
      lastTokenRefresh: { $lte: fiftyDaysAgo }
    });

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

        console.log(`✅ Refreshed token for user ${user.username || user._id}`);
      } catch (err) {
        console.error(`❌ Failed to refresh token for user ${user.username || user._id}:`, err.response?.data || err.message);
      }
    }

    console.log('🔄 Instagram token refresh job complete.');
  });
}

module.exports = startInstagramTokenRefreshJob; 