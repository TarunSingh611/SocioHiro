const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['post', 'story', 'reel', 'carousel'],
    default: 'post'
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  mediaUrls: [{
    type: String,
    required: true
  }],
  hashtags: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  scheduledDate: {
    type: Date
  },
  scheduledTime: {
    type: String
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  // Instagram-specific fields
  instagramId: {
    type: String
  },
  permalink: {
    type: String
  },
  // Source field to distinguish between Instagram and local content
  source: {
    type: String,
    enum: ['instagram', 'local'],
    default: 'local'
  },
  // Instagram media type
  instagramMediaType: {
    type: String,
    enum: ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM', 'STORY'],
    default: 'IMAGE'
  },
  // Instagram thumbnail URL for videos
  thumbnailUrl: {
    type: String
  },
  stats: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    saved: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed'],
    default: 'draft'
  },
  errorMessage: {
    type: String
  },
  // Instagram insights data
  insights: {
    impressions: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    saved: { type: Number, default: 0 },
    videoViews: { type: Number, default: 0 },
    videoViewRate: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for better query performance
contentSchema.index({ userId: 1, createdAt: -1 });
contentSchema.index({ userId: 1, isPublished: 1 });
contentSchema.index({ userId: 1, status: 1 });
contentSchema.index({ userId: 1, source: 1 });
contentSchema.index({ instagramId: 1 });

// Virtual for full scheduled datetime
contentSchema.virtual('scheduledDateTime').get(function() {
  if (this.scheduledDate && this.scheduledTime) {
    const [hours, minutes] = this.scheduledTime.split(':');
    const scheduled = new Date(this.scheduledDate);
    scheduled.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return scheduled;
  }
  return null;
});

// Method to check if content is scheduled
contentSchema.methods.isScheduled = function() {
  return this.status === 'scheduled' && this.scheduledDateTime && this.scheduledDateTime > new Date();
};

// Method to check if content is ready to publish
contentSchema.methods.isReadyToPublish = function() {
  return this.status === 'scheduled' && this.scheduledDateTime && this.scheduledDateTime <= new Date();
};

// Method to check if content is from Instagram
contentSchema.methods.isFromInstagram = function() {
  return this.source === 'instagram' || this.instagramId;
};

// Method to get engagement rate
contentSchema.methods.getEngagementRate = function() {
  if (this.stats.reach > 0) {
    return ((this.stats.likes + this.stats.comments) / this.stats.reach * 100).toFixed(2);
  }
  return 0;
};

// Pre-save middleware to update status
contentSchema.pre('save', function(next) {
  if (this.isPublished) {
    this.status = 'published';
  } else if (this.scheduledDate && this.scheduledTime) {
    this.status = 'scheduled';
  } else {
    this.status = 'draft';
  }
  
  // Update source based on Instagram ID
  if (this.instagramId) {
    this.source = 'instagram';
  }
  
  next();
});

module.exports = mongoose.model('Content', contentSchema); 