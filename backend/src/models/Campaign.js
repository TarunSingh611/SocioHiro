const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: {
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
    enum: ['post', 'story', 'carousel'],
    default: 'post'
  },
  content: {
    type: String,
    required: true
  },
  mediaUrls: [{
    type: String,
    trim: true
  }],
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  hashtags: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  accounts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InstagramAccount'
  }],
  publishedAt: {
    type: Date
  },
  publishedTo: [{
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InstagramAccount'
    },
    postId: String,
    publishedAt: Date
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
campaignSchema.index({ user: 1, scheduledDate: 1 });
campaignSchema.index({ status: 1, scheduledDate: 1 });
campaignSchema.index({ isActive: 1 });

module.exports = mongoose.model('Campaign', campaignSchema); 