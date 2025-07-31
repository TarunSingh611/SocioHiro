const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Instagram OAuth credentials (single account per user)
  instagramId: { type: String, unique: true, sparse: true },
  username: { type: String }, // Instagram username
  accessToken: String,
  refreshToken: String,
  profilePic: String,
  accountType: String, // 'BUSINESS', 'PERSONAL', 'CREATOR'
  
  // Additional Instagram profile fields
  instagramFullName: String,
  instagramBio: String,
  instagramWebsite: String,
  instagramEmail: String,
  instagramPhone: String,
  instagramLocation: String,
  instagramIsVerified: { type: Boolean, default: false },
  instagramPostsCount: { type: Number, default: 0 },
  instagramFollowersCount: { type: Number, default: 0 },
  instagramFollowingCount: { type: Number, default: 0 },
  instagramJoinedDate: Date,
  
  // Basic user info
  email: { type: String },
  username: { type: String, unique: true, sparse: true },
  
  // Instagram token management
  tokenExpiresIn: Number, // Token expiration time in seconds
  lastTokenRefresh: Date, // When the token was last refreshed
  tokenExpiresAt: Date, // Calculated expiration date
  
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

// Pre-save middleware to calculate token expiration date
userSchema.pre('save', function(next) {
  if (this.tokenExpiresIn && this.lastTokenRefresh) {
    // Calculate when the token will expire
    this.tokenExpiresAt = new Date(this.lastTokenRefresh.getTime() + (this.tokenExpiresIn * 1000));
  }
  this.updatedAt = new Date();
  next();
});

// Method to check if token is expired or will expire soon
userSchema.methods.isTokenExpired = function() {
  if (!this.tokenExpiresAt) return true;
  // Consider token expired if it expires within the next 24 hours
  const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return this.tokenExpiresAt <= oneDayFromNow;
};

// Method to check if token needs refresh (expires within 7 days)
userSchema.methods.needsTokenRefresh = function() {
  if (!this.tokenExpiresAt) return true;
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return this.tokenExpiresAt <= sevenDaysFromNow;
};

// Method to check if user has Instagram connected
userSchema.methods.hasInstagramConnected = function() {
  return !!(this.instagramId && this.accessToken);
};

// Method to disconnect Instagram account
userSchema.methods.disconnectInstagram = function() {
  this.instagramId = null;
  this.username = null;
  this.accessToken = null;
  this.refreshToken = null;
  this.profilePic = null;
  this.accountType = null;
  this.tokenExpiresIn = null;
  this.lastTokenRefresh = null;
  this.tokenExpiresAt = null;
  
  // Clear additional Instagram fields
  this.instagramFullName = null;
  this.instagramBio = null;
  this.instagramWebsite = null;
  this.instagramEmail = null;
  this.instagramPhone = null;
  this.instagramLocation = null;
  this.instagramIsVerified = false;
  this.instagramPostsCount = 0;
  this.instagramFollowersCount = 0;
  this.instagramFollowingCount = 0;
  this.instagramJoinedDate = null;
};

module.exports = mongoose.model('User', userSchema); 