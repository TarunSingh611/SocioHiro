const express = require('express');
const router = express.Router();
const User = require('../models/User');
const JWTService = require('../utils/jwt');
const SessionService = require('../services/sessionService');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const instagramOAuthRoutes = require('./instagramOAuth.js');

router.use('/instagram', instagramOAuthRoutes);

// Verify JWT token
router.get('/verify', optionalAuth, (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        instagramId: req.user.instagramId,
        accountType: req.user.accountType
      },
      hasInstagramToken: !!req.user.accessToken
    });
  } else {
    res.status(401).json({ error: 'Invalid or missing token' });
  }
});

// Auth status endpoint
router.get('/status', optionalAuth, (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      authenticated: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        instagramId: req.user.instagramId,
        accountType: req.user.accountType,
        email: req.user.email,
        profilePic: req.user.profilePic
      },
      hasInstagramToken: !!req.user.accessToken
    });
  } else {
    res.json({
      success: true,
      authenticated: false,
      user: null,
      hasInstagramToken: false
    });
  }
});

// Logout route - remove specific session
router.post('/logout', requireAuth, async (req, res) => {
  try {
    const sessionId = req.user.sessionId;
    if (sessionId) {
      await SessionService.removeSession(req.user._id, sessionId);
    }

    res.json({ 
      success: true, 
      message: 'Logged out successfully. Session removed.' 
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Logout all devices route
router.post('/logout-all', requireAuth, async (req, res) => {
  try {
    await SessionService.removeAllSessions(req.user._id);

    res.json({ 
      success: true, 
      message: 'Logged out from all devices successfully.' 
    });

  } catch (error) {
    console.error('Logout all devices error:', error);
    res.status(500).json({ error: 'Logout all devices failed' });
  }
});

// Get current user profile
router.get('/profile', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      instagramId: req.user.instagramId,
      accountType: req.user.accountType,
      profilePic: req.user.profilePic,
      hasInstagramToken: !!req.user.accessToken,
      isActive: req.user.isActive,
      lastLoginAt: req.user.lastLoginAt,
      lastLogoutAt: req.user.lastLogoutAt,
      sessionCount: req.user.sessionCount
    }
  });
});

// Get session status
router.get('/session-status', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const activeSessions = await SessionService.getActiveSessions(req.user._id);
    
    res.json({
      success: true,
      session: {
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        lastLogoutAt: user.lastLogoutAt,
        sessionCount: user.sessionCount,
        hasInstagramToken: !!user.accessToken,
        activeSessions: activeSessions.length,
        maxConcurrentSessions: user.maxConcurrentSessions
      }
    });
  } catch (error) {
    console.error('Session status error:', error);
    res.status(500).json({ error: 'Failed to get session status' });
  }
});

// Get active sessions for user
router.get('/active-sessions', requireAuth, async (req, res) => {
  try {
    const activeSessions = await SessionService.getActiveSessions(req.user._id);
    
    res.json({
      success: true,
      sessions: activeSessions.map(session => ({
        sessionId: session.sessionId,
        deviceInfo: session.deviceInfo,
        loginAt: session.loginAt,
        lastActivityAt: session.lastActivityAt,
        isCurrentSession: session.sessionId === req.user.sessionId
      }))
    });
  } catch (error) {
    console.error('Get active sessions error:', error);
    res.status(500).json({ error: 'Failed to get active sessions' });
  }
});

// Get recent sessions for user
router.get('/recent-sessions', requireAuth, async (req, res) => {
  try {
    const recentSessions = await SessionService.getRecentSessions(req.user._id);
    
    res.json({
      success: true,
      sessions: recentSessions.map(session => ({
        sessionId: session.sessionId,
        deviceInfo: session.deviceInfo,
        loginAt: session.loginAt,
        logoutAt: session.logoutAt,
        duration: session.duration,
        isActive: session.isActive
      }))
    });
  } catch (error) {
    console.error('Get recent sessions error:', error);
    res.status(500).json({ error: 'Failed to get recent sessions' });
  }
});

// Remove specific session
router.delete('/sessions/:sessionId', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    await SessionService.removeSession(req.user._id, sessionId);
    
    res.json({
      success: true,
      message: 'Session removed successfully'
    });
  } catch (error) {
    console.error('Remove session error:', error);
    res.status(500).json({ error: 'Failed to remove session' });
  }
});

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { username, email } = req.body;
    
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        instagramId: updatedUser.instagramId,
        accountType: updatedUser.accountType
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

module.exports = router; 