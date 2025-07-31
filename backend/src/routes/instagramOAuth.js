const express = require('express');
const axios = require('axios');
const qs = require('qs');
const router = express.Router();
const cron = require('node-cron');
const User = require('../models/User');
const JWTService = require('../utils/jwt');
const SessionService = require('../services/sessionService');
const { getBaseUrl } = require('../utils/urlUtils');

// Initiate Instagram OAuth login
router.get('/login', (req, res) => {
    // Use Instagram Business API scopes (these are the NEW correct scopes)
    // Instagram is transitioning TO these scopes, not away from them
    const instagramLoginUrl = `https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=532563143212029&redirect_uri=${getBaseUrl()}/api/auth/instagram/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights`;
    
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

      // Exchange short-lived token for long-lived token
      console.log('🔄 Exchanging short-lived token for long-lived token...');
      
      const longLivedTokenResponse = await axios.get('https://graph.instagram.com/access_token', {
        params: {
          grant_type: 'ig_exchange_token',
          client_secret: process.env.INSTAGRAM_APP_SECRET,
          access_token: access_token
        }
      });

      const longLivedToken = longLivedTokenResponse.data.access_token;
      const expiresIn = longLivedTokenResponse.data.expires_in;
      
      console.log(`✅ Long-lived token obtained, expires in ${expiresIn} seconds (${Math.round(expiresIn / 86400)} days)`);

      // Get user information with long-lived token
      const userResponse = await axios.get(`https://graph.instagram.com/me`, {
        params: {
          fields: 'id,username,account_type',
          access_token: longLivedToken
        }
      });
  
      const userInfo = userResponse.data;
  
      // Store user data in database with long-lived token
      
      let user = await User.findOne({ instagramId: userInfo.id });
      
      if (!user) {
        // Create new user - only set fields that have values
        const userData = {
          instagramId: userInfo.id,
          username: userInfo.username,
          accountType: userInfo.account_type,
          accessToken: longLivedToken, // Store the long-lived token
          profilePic: null, // Instagram doesn't provide profile pic in this API
          tokenExpiresIn: expiresIn, // Use actual expiration from API
          lastTokenRefresh: new Date()
        };
        
        user = new User(userData);
      } else {
        // Update existing user's tokens
        user.accessToken = longLivedToken; // Store the long-lived token
        user.username = userInfo.username;
        user.accountType = userInfo.account_type;
        user.tokenExpiresIn = expiresIn; // Use actual expiration from API
        user.lastTokenRefresh = new Date();
        user.updatedAt = new Date();
      }
      
      await user.save();
      
      // Generate session ID and add session
      const sessionId = SessionService.generateSessionId();
      const deviceInfo = SessionService.getDeviceInfo(req);
      await SessionService.addSession(user._id, sessionId, deviceInfo);
      
      // Generate JWT token with session ID
      const jwtToken = JWTService.generateToken(user, sessionId);
  
      // Redirect to frontend with JWT token
      const userData = encodeURIComponent(JSON.stringify({
        success: true,
        user: userInfo,
        accessToken: longLivedToken, // Send long-lived token to frontend
        jwtToken: jwtToken,
        message: 'Successfully authenticated with Instagram'
      }));
  
      res.redirect(`${process.env.FRONTEND_URL || getBaseUrl()}/auth/callback?data=${userData}`);
  
    } catch (error) {
      console.error('Instagram OAuth callback error:', error.response?.data || error.message);
      
      const errorData = encodeURIComponent(JSON.stringify({
        success: false,
        error: 'Instagram authentication failed',
        details: error.response?.data || error.message
      }));
  
      res.redirect(`${process.env.FRONTEND_URL || getBaseUrl()}/auth/callback?data=${errorData}`);
    }
  });
  
  // Get Instagram user info (protected route)
  router.get('/user', async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
  
      const { accessToken } = req.user;
  
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
  
  // Note: Logout is now handled in /api/auth/logout


module.exports = router;
