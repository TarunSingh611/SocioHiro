const express = require('express');
const axios = require('axios');
const qs = require('qs');
const router = express.Router();
const cron = require('node-cron');
const User = require('../models/User'); // Adjust path as needed

// Initiate Instagram OAuth login
router.get('/login', (req, res) => {
    const instagramLoginUrl = `https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=532563143212029&redirect_uri=${process.env.INSTAGRAM_CALLBACK_URL}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights`;
    
    res.redirect(instagramLoginUrl);
  });
  
  // Handle Instagram OAuth callback
  router.get('/callback', async (req, res) => {
    try {
      const { code } = req.query;
      
      if (!code) {
        return res.status(400).json({ error: 'Authorization code not provided' });
      }

      if (!process.env.INSTAGRAM_APP_ID || !process.env.INSTAGRAM_APP_SECRET) {
        throw new Error('Instagram App ID or Secret not configured');
      }

      // Exchange authorization code for access token
      const tokenData = {
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTAGRAM_CALLBACK_URL, 
        code: code
      };
    
      
      const tokenResponse = await axios.post(
        'https://api.instagram.com/oauth/access_token',
        qs.stringify(tokenData),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
  
      const { access_token, user_id } = tokenResponse.data;

      // Get user information
      const userResponse = await axios.get(`https://graph.instagram.com/me`, {
        params: {
          fields: 'id,username,account_type',
          access_token: access_token
        }
      });
  
      const userInfo = userResponse.data;
  
      // Store user data in database
      
      let user = await User.findOne({ instagramId: userInfo.id });
      
      if (!user) {
        // Create new user
        user = new User({
          instagramId: userInfo.id,
          username: userInfo.username,
          accountType: userInfo.account_type,
          accessToken: access_token,
          profilePic: null // Instagram doesn't provide profile pic in this API
        });
      } else {
        // Update existing user's tokens
        user.accessToken = access_token;
        user.username = userInfo.username;
        user.accountType = userInfo.account_type;
      }
      
      await user.save();
      
      // Store in session for immediate use
      // DO NOT import useUserStore here
      // Use req.session, JWT, or other backend auth methods
      req.session.user = {
        id: userInfo.id,
        username: userInfo.username,
        accountType: userInfo.account_type,
        accessToken: access_token,
        userId: user._id
      };
  
      // Redirect to frontend with success
      const userData = encodeURIComponent(JSON.stringify({
        success: true,
        user: userInfo,
        accessToken: access_token,
        message: 'Successfully authenticated with Instagram'
      }));
  
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?data=${userData}`);
  
    } catch (error) {
      console.error('Instagram OAuth callback error:', error.response?.data || error.message);
      
      const errorData = encodeURIComponent(JSON.stringify({
        success: false,
        error: 'Instagram authentication failed',
        details: error.response?.data || error.message
      }));
  
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?data=${errorData}`);
    }
  });
  
  // Get Instagram user info (protected route)
  router.get('/user', async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
  
      const { accessToken } = req.session.user;
  
      // Get user's Instagram account info
      const userResponse = await axios.get(`https://graph.instagram.com/me`, {
        params: {
          fields: 'id,username,account_type,media_count',
          access_token: accessToken
        }
      });
  
      res.json(userResponse.data);
    } catch (error) {
      console.error('Error getting Instagram user info:', error);
      res.status(500).json({ error: 'Failed to get user info' });
    }
  });
  
  // Get user's media
  router.get('/media', async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
  
      const { accessToken } = req.session.user;
  
      const mediaResponse = await axios.get(`https://graph.instagram.com/me/media`, {
        params: {
          fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count',
          access_token: accessToken
        }
      });
  
      res.json(mediaResponse.data);
    } catch (error) {
      console.error('Error getting Instagram media:', error);
      res.status(500).json({ error: 'Failed to get media' });
    }
  });
  
  // Create a post (requires app review for production)
  router.post('/media', async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
  
      const { accessToken } = req.session.user;
      const { image_url, caption } = req.body;
  
      // Create media container
      const mediaResponse = await axios.post(`https://graph.instagram.com/me/media`, {
        image_url: image_url,
        caption: caption,
        access_token: accessToken
      });
  
      const mediaId = mediaResponse.data.id;
  
      // Publish the media
      const publishResponse = await axios.post(`https://graph.instagram.com/me/media_publish`, {
        creation_id: mediaId,
        access_token: accessToken
      });
  
      res.json(publishResponse.data);
    } catch (error) {
      console.error('Error creating Instagram post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.session.user = null; // Clear session
    res.json({ message: 'Logged out successfully' });
  });

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


module.exports = router;
