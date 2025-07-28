const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Support both Facebook and Instagram OAuth
  facebookId: { type: String, unique: true, sparse: true },
  instagramId: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  username: { type: String, unique: true, sparse: true },
  password: String, // Hashed password for email/password login
  accessToken: String,
  refreshToken: String,
  profilePic: String,
  accountType: String, // 'instagram', 'facebook', etc.
  instagramAccounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InstagramAccount' }],
  
  // Session management
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: Date.now },
  lastLogoutAt: { type: Date },
  sessionCount: { type: Number, default: 0 },
  
  // Multi-device session management
  activeSessions: [{
    sessionId: { type: String, required: true },
    deviceInfo: {
      userAgent: String,
      platform: String,
      browser: String,
      ipAddress: String
    },
    loginAt: { type: Date, default: Date.now },
    lastActivityAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  }],
  
  // Recent session history (last 10 sessions)
  recentSessions: [{
    sessionId: { type: String, required: true },
    deviceInfo: {
      userAgent: String,
      platform: String,
      browser: String,
      ipAddress: String
    },
    loginAt: { type: Date, default: Date.now },
    logoutAt: { type: Date },
    duration: Number, // in minutes
    isActive: { type: Boolean, default: false }
  }],
  
  // Session limits and settings
  maxConcurrentSessions: { type: Number, default: 5 },
  sessionTimeoutMinutes: { type: Number, default: 1440 }, // 24 hours
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema); 