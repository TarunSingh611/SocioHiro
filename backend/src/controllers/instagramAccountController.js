const User = require('../models/User');
const InstagramApiService = require('../services/instagramApi');
const { requireAuth } = require('../middleware/auth');

// Get current user's Instagram account info
const getCurrentAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.hasInstagramConnected()) {
      return res.status(404).json({ error: 'No Instagram account connected' });
    }
    
    // Create Instagram API service with user's access token
    const instagramApi = new InstagramApiService(user.accessToken);
    
    // Get detailed account info from Instagram API
    let instagramData;
    try {
      instagramData = await instagramApi.getDetailedAccountInfo();
    } catch (apiError) {
      console.error('Instagram API error:', apiError.message);


      // Fallback to stored data if API fails
      instagramData = {

        username: instagramData.username || user.username,
        fullName: instagramData.name || user.instagramFullName || user.username,
        bio: instagramData.biography || user.instagramBio || '',
        profilePic: instagramData.profile_picture_url || user.profilePic || '',
        
        // Account Stats
        posts: instagramData.media_count || user.instagramPostsCount || 0,
        followers: (instagramData.followers_count || user.instagramFollowersCount || 0).toLocaleString(),
        following: instagramData.follows_count || user.instagramFollowingCount || 0,
        
        // Account Details
        accountType: instagramData.account_type || user.accountType || 'PERSONAL',
        isVerified: user.instagramIsVerified || false, // Not available from API, use stored value
        
        
        // Dates
        joinedDate: user.instagramJoinedDate || user.createdAt, // Not available from API, use stored value
        
        // Connection Info
        instagramId: instagramData.id || user.instagramId,
        connectedAt: user.createdAt,

      };
    }
    
    // Format the response according to the enhanced structure
    const accountInfo = {
      // Basic Profile Info
      username: instagramData.username || user.username,
      fullName: instagramData.name || user.instagramFullName || user.username,
      bio: instagramData.biography || user.instagramBio || '',
      profilePic: instagramData.profile_picture_url || user.profilePic || '',
      
      // Account Stats
      posts: instagramData.media_count || user.instagramPostsCount || 0,
      followers: (instagramData.followers_count || user.instagramFollowersCount || 0).toLocaleString(),
      following: instagramData.follows_count || user.instagramFollowingCount || 0,
      
      // Account Details
      accountType: instagramData.account_type || user.accountType || 'PERSONAL',
      isVerified: user.instagramIsVerified || false, // Not available from API, use stored value
      
      
      // Dates
      joinedDate: user.instagramJoinedDate || user.createdAt, // Not available from API, use stored value
      
      // Connection Info
      instagramId: instagramData.id || user.instagramId,
      connectedAt: user.createdAt,
    };
    
    res.json(accountInfo);
  } catch (error) {
    console.error('Error in getCurrentAccount:', error);
    res.status(500).json({ error: error.message });
  }
};

// Connect Instagram account (update user's Instagram credentials)
const connectAccount = async (req, res) => {
  try {
    const { instagramId, username, accessToken, refreshToken, profilePic, accountType } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Update user's Instagram credentials
    user.instagramId = instagramId;
    user.username = username;
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    user.profilePic = profilePic;
    user.accountType = accountType;
    user.lastTokenRefresh = new Date();
    
    // Fetch and store detailed Instagram data
    try {
      const instagramApi = new InstagramApiService(accessToken);
      const instagramData = await instagramApi.getDetailedAccountInfo();
      
      // Store additional Instagram profile data
      user.instagramFullName = instagramData.name;
      user.instagramBio = instagramData.biography;
      user.profilePic = instagramData.profile_picture_url || user.profilePic;
      // Note: website, email, phone, location, verified, and created_time are not available from Instagram API
      // These fields will remain null/empty unless manually set
      user.instagramPostsCount = instagramData.media_count || 0;
      user.instagramFollowersCount = instagramData.followers_count || 0;
      user.instagramFollowingCount = instagramData.follows_count || 0;
      // Note: created_time is not available from Instagram API, will remain null
    } catch (apiError) {
      console.error('Failed to fetch detailed Instagram data:', apiError.message);
      // Continue with basic connection even if detailed data fetch fails
    }
    
    await user.save();
    
    res.json({
      message: 'Instagram account connected successfully',
      account: {
        instagramId: user.instagramId,
        username: user.username,
        profilePic: user.profilePic,
        accountType: user.accountType
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Disconnect Instagram account
const disconnectAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.hasInstagramConnected()) {
      return res.status(404).json({ error: 'No Instagram account connected' });
    }
    
    // Disconnect Instagram account
    user.disconnectInstagram();
    await user.save();
    
    res.json({ message: 'Instagram account disconnected successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Refresh Instagram tokens
const refreshTokens = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.hasInstagramConnected()) {
      return res.status(404).json({ error: 'No Instagram account connected' });
    }
    
    // Note: This would require implementing token refresh logic with Instagram API
    // For now, we'll return the current account info
    res.json({
      message: 'Token refresh initiated',
      account: {
        instagramId: user.instagramId,
        username: user.username,
        lastTokenRefresh: user.lastTokenRefresh,
        tokenExpiresAt: user.tokenExpiresAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get account connection status
const getConnectionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const status = {
      isConnected: user.hasInstagramConnected(),
      account: user.hasInstagramConnected() ? {
        instagramId: user.instagramId,
        username: user.username,
        profilePic: user.profilePic,
        accountType: user.accountType,
        connectedAt: user.createdAt,
        lastTokenRefresh: user.lastTokenRefresh,
        tokenExpiresAt: user.tokenExpiresAt,
        // Enhanced data
        fullName: user.instagramFullName,
        bio: user.instagramBio,
        website: user.instagramWebsite,
        email: user.instagramEmail,
        phone: user.instagramPhone,
        location: user.instagramLocation,
        isVerified: user.instagramIsVerified,
        postsCount: user.instagramPostsCount,
        followersCount: user.instagramFollowersCount,
        followingCount: user.instagramFollowingCount,
        joinedDate: user.instagramJoinedDate
      } : null
    };
    
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get account analytics (basic info)
const getAccountAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.hasInstagramConnected()) {
      return res.status(404).json({ error: 'No Instagram account connected' });
    }
    
    // Create Instagram API service with user's access token
    const instagramApi = new InstagramApiService(user.accessToken);
    
    // Get enhanced account analytics
    const analytics = {
      instagramId: user.instagramId,
      username: user.username,
      accountType: user.accountType,
      connectedAt: user.createdAt,
      lastTokenRefresh: user.lastTokenRefresh,
      tokenExpiresAt: user.tokenExpiresAt,
      
      // Enhanced analytics data
      profile: {
        fullName: user.instagramFullName,
        bio: user.instagramBio,
        website: user.instagramWebsite,
        email: user.instagramEmail,
        phone: user.instagramPhone,
        location: user.instagramLocation,
        isVerified: user.instagramIsVerified,
        joinedDate: user.instagramJoinedDate
      },
      
      stats: {
        posts: user.instagramPostsCount,
        followers: user.instagramFollowersCount,
        following: user.instagramFollowingCount,
        followersFormatted: user.instagramFollowersCount ? user.instagramFollowersCount.toLocaleString() : '0'
      }
    };
    
    // Try to get fresh data from Instagram API
    try {
      const instagramData = await instagramApi.getDetailedAccountInfo();
      
      // Update analytics with fresh data
      analytics.profile.fullName = instagramData.name || analytics.profile.fullName;
      analytics.profile.bio = instagramData.biography || analytics.profile.bio;
      // Note: website, email, phone, location, verified, and created_time are not available from Instagram API
      // These fields will remain as stored values
      
      analytics.stats.posts = instagramData.media_count || analytics.stats.posts;
      analytics.stats.followers = instagramData.followers_count || analytics.stats.followers;
      analytics.stats.following = instagramData.follows_count || analytics.stats.following;
      analytics.stats.followersFormatted = (instagramData.followers_count || analytics.stats.followers).toLocaleString();
      
    } catch (apiError) {
      console.error('Failed to fetch fresh Instagram data for analytics:', apiError.message);
      // Continue with stored data
    }
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update account settings
const updateAccountSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.hasInstagramConnected()) {
      return res.status(404).json({ error: 'No Instagram account connected' });
    }
    
    // Update allowed fields
    const { username, profilePic } = req.body;
    
    if (username) user.username = username;
    if (profilePic) user.instagramProfilePic = profilePic;
    
    await user.save();
    
    res.json({
      message: 'Account settings updated successfully',
      account: {
        instagramId: user.instagramId,
        username: user.username,
        profilePic: user.instagramProfilePic,
        accountType: user.instagramAccountType
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCurrentAccount,
  connectAccount,
  disconnectAccount,
  refreshTokens,
  getConnectionStatus,
  getAccountAnalytics,
  updateAccountSettings
}; 