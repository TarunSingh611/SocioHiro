const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Instagram ID to link with Instagram data
  instagramId: {
    type: String
  },
  // Source field to distinguish between Instagram and local content
  source: {
    type: String,
    enum: ['instagram', 'local'],
    default: 'local'
  },
  // Minimal Instagram metadata for reference
  instagramMediaType: {
    type: String,
    enum: ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM', 'STORY']
  },
  permalink: {
    type: String
  },
  publishedAt: {
    type: Date
  },
  // Our app-specific data
  campaigns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  }],
  automations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AutomationRule'
  }],
  // Watch list associations (for monitoring specific content)
  watchLists: [{
    type: String, // Watch list name/identifier
    addedAt: { type: Date, default: Date.now }
  }],
  // Performance tracking
  performance: {
    isHighPerforming: { type: Boolean, default: false },
    isUnderperforming: { type: Boolean, default: false },
    performanceScore: { type: Number, default: 0 }, // 0-100 score
    lastAnalyzed: { type: Date }
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Index for better query performance
contentSchema.index({ userId: 1, createdAt: -1 });
contentSchema.index({ userId: 1, status: 1 });
contentSchema.index({ userId: 1, source: 1 });
contentSchema.index({ instagramId: 1 }, { sparse: true });
contentSchema.index({ campaigns: 1 });
contentSchema.index({ automations: 1 });
contentSchema.index({ 'performance.isHighPerforming': 1 });
contentSchema.index({ 'performance.isUnderperforming': 1 });

// Method to check if content is from Instagram
contentSchema.methods.isFromInstagram = function() {
  return this.source === 'instagram' || this.instagramId;
};

// Method to get engagement rate (this will be calculated from fresh Instagram data)
contentSchema.methods.getEngagementRate = function() {
  // This method will be called with stats from fresh Instagram data
  if (this.stats && this.stats.reach > 0) {
    return parseFloat(((this.stats.likes + this.stats.comments) / this.stats.reach * 100).toFixed(2));
  }
  return 0;
};

// Method to check if content has associations
contentSchema.methods.hasAssociations = function() {
  return (this.campaigns && this.campaigns.length > 0) ||
         (this.automations && this.automations.length > 0) ||
         (this.watchLists && this.watchLists.length > 0);
};

// Method to get association count
contentSchema.methods.getAssociationCount = function() {
  let count = 0;
  if (this.campaigns) count += this.campaigns.length;
  if (this.automations) count += this.automations.length;
  if (this.watchLists) count += this.watchLists.length;
  return count;
};

// Pre-save middleware to update status
contentSchema.pre('save', function(next) {
  // Update source based on Instagram ID
  if (this.instagramId) {
    this.source = 'instagram';
  }
  
  next();
});

module.exports = mongoose.model('Content', contentSchema); 