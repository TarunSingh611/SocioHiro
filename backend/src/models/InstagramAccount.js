const mongoose = require('mongoose');

const instagramAccountSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  instagramId: { 
    type: String, 
    required: true,
    unique: true 
  },
  username: { 
    type: String, 
    required: true 
  },
  displayName: { 
    type: String 
  },
  type: { 
    type: String, 
    enum: ['business', 'personal', 'creator'], 
    default: 'personal' 
  },
  status: { 
    type: String, 
    enum: ['connected', 'disconnected', 'pending'], 
    default: 'pending' 
  },
  profileImage: { 
    type: String 
  },
  followers: { 
    type: Number, 
    default: 0 
  },
  following: { 
    type: Number, 
    default: 0 
  },
  posts: { 
    type: Number, 
    default: 0 
  },
  lastSync: { 
    type: Date, 
    default: Date.now 
  },
  accessToken: { 
    type: String 
  },
  refreshToken: { 
    type: String 
  },
  tokenExpiresAt: { 
    type: Date 
  },
  settings: {
    autoSync: { type: Boolean, default: true },
    syncInterval: { type: Number, default: 3600 }, // seconds
    notifications: { type: Boolean, default: true },
    privacy: { type: String, enum: ['public', 'private'], default: 'public' }
  },
  metadata: {
    bio: String,
    website: String,
    location: String,
    verified: { type: Boolean, default: false }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Indexes for better performance
instagramAccountSchema.index({ userId: 1, status: 1 });
instagramAccountSchema.index({ instagramId: 1 });
instagramAccountSchema.index({ username: 1 });
instagramAccountSchema.index({ type: 1 });

// Pre-save middleware to update timestamps
instagramAccountSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to check if account is connected
instagramAccountSchema.methods.isConnected = function() {
  return this.status === 'connected';
};

// Method to check if token is expired
instagramAccountSchema.methods.isTokenExpired = function() {
  if (!this.tokenExpiresAt) return true;
  return new Date() > this.tokenExpiresAt;
};

// Method to get account info for API calls
instagramAccountSchema.methods.getAccountInfo = function() {
  return {
    id: this._id,
    instagramId: this.instagramId,
    username: this.username,
    displayName: this.displayName,
    type: this.type,
    status: this.status,
    followers: this.followers,
    following: this.following,
    posts: this.posts,
    lastSync: this.lastSync,
    profileImage: this.profileImage
  };
};

module.exports = mongoose.model('InstagramAccount', instagramAccountSchema); 