const mongoose = require('mongoose');

const automationRuleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  
  // Content association - can be specific posts or all content
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' },
  instagramMediaId: String, // Instagram media ID for specific posts
  applyToAllContent: { type: Boolean, default: false }, // If true, applies to all content
  
  // Multiple triggers support
  triggers: [{
    type: { 
      type: String, 
      required: true,
      enum: ['comment', 'mention', 'dm', 'like', 'follow', 'hashtag']
    },
    keywords: [String],
    exactMatch: { type: Boolean, default: false },
    caseSensitive: { type: Boolean, default: false }
  }],
  
  // Legacy single trigger (for backward compatibility)
  triggerType: { 
    type: String, 
    enum: ['comment', 'mention', 'dm', 'like', 'follow', 'hashtag']
  },
  
  // Multiple actions support
  actions: [{
    type: {
      type: String,
      required: true,
      enum: ['send_dm', 'like_comment', 'reply_comment', 'follow_user', 'send_story_reply']
    },
    responseMessage: String,
    delaySeconds: { type: Number, default: 0 } // Delay before executing action
  }],
  
  // Legacy single action (for backward compatibility)
  actionType: {
    type: String,
    enum: ['send_dm', 'like_comment', 'reply_comment', 'follow_user', 'send_story_reply']
  },
  
  // Legacy response message (for backward compatibility)
  responseMessage: { type: String },
  
  // Enhanced conditions
  conditions: {
    timeOfDay: {
      start: String, // HH:MM format
      end: String    // HH:MM format
    },
    daysOfWeek: [Number], // 0-6 (Sunday-Saturday)
    maxExecutionsPerDay: { type: Number, default: 10 },
    userFollowerCount: {
      min: Number,
      max: Number
    },
    userAccountAge: {
      min: Number, // days
      max: Number
    },
    excludeKeywords: [String],
    requireVerifiedUser: { type: Boolean, default: false },
    excludeUsers: [String], // Array of user IDs to exclude
    includeUsers: [String], // Array of user IDs to include only
    userEngagementLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'any']
    }
  },
  
  // Status and tracking
  isActive: { type: Boolean, default: true },
  executionCount: { type: Number, default: 0 },
  lastExecuted: Date,
  
  // Rate limiting
  cooldownMinutes: { type: Number, default: 5 },
  maxExecutionsPerUser: { type: Number, default: 1 },
  
  // Instagram specific
  instagramAccountId: String,
  
  // Priority for multiple automations
  priority: { type: Number, default: 1 }, // Higher number = higher priority
  
  // Tags for organization
  tags: [String],
  
  // Schedule settings
  schedule: {
    enabled: { type: Boolean, default: false },
    startDate: Date,
    endDate: Date,
    timezone: { type: String, default: 'UTC' }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better performance
automationRuleSchema.index({ userId: 1, isActive: 1 });
automationRuleSchema.index({ contentId: 1 });
automationRuleSchema.index({ instagramMediaId: 1 });
automationRuleSchema.index({ 'triggers.type': 1 });
automationRuleSchema.index({ triggerType: 1 });
automationRuleSchema.index({ keywords: 1 });
automationRuleSchema.index({ priority: -1 });
automationRuleSchema.index({ tags: 1 });

// Method to check if automation can be executed
automationRuleSchema.methods.canExecute = function() {
  if (!this.isActive) return false;
  
  // Check schedule if enabled
  if (this.schedule && this.schedule.enabled) {
    const now = new Date();
    if (this.schedule.startDate && now < this.schedule.startDate) return false;
    if (this.schedule.endDate && now > this.schedule.endDate) return false;
  }
  
  // Check daily execution limit
  if (this.executionCount >= this.conditions.maxExecutionsPerDay) {
    return false;
  }
  
  // Check time restrictions
  if (this.conditions.timeOfDay && this.conditions.timeOfDay.start && this.conditions.timeOfDay.end) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (currentTime < this.conditions.timeOfDay.start || currentTime > this.conditions.timeOfDay.end) {
      return false;
    }
  }
  
  // Check day restrictions
  if (this.conditions.daysOfWeek && this.conditions.daysOfWeek.length > 0) {
    const now = new Date();
    const currentDay = now.getDay();
    if (!this.conditions.daysOfWeek.includes(currentDay)) {
      return false;
    }
  }
  
  return true;
};

// Method to check if text matches keywords for a specific trigger
automationRuleSchema.methods.matchesKeywords = function(text, triggerIndex = 0) {
  // Support both new triggers array and legacy triggerType
  let keywords = [];
  let exactMatch = false;
  let caseSensitive = false;
  
  if (this.triggers && this.triggers[triggerIndex]) {
    const trigger = this.triggers[triggerIndex];
    keywords = trigger.keywords || [];
    exactMatch = trigger.exactMatch || false;
    caseSensitive = trigger.caseSensitive || false;
  } else {
    // Legacy support
    keywords = this.keywords || [];
    exactMatch = this.exactMatch || false;
    caseSensitive = this.caseSensitive || false;
  }
  
  if (!keywords || keywords.length === 0) return true;
  
  const searchText = caseSensitive ? text : text.toLowerCase();
  
  for (const keyword of keywords) {
    const searchKeyword = caseSensitive ? keyword : keyword.toLowerCase();
    
    if (exactMatch) {
      if (searchText === searchKeyword) return true;
    } else {
      if (searchText.includes(searchKeyword)) return true;
    }
  }
  
  return false;
};

// Method to get all triggers
automationRuleSchema.methods.getAllTriggers = function() {
  if (this.triggers && this.triggers.length > 0) {
    return this.triggers;
  }
  // Legacy support
  if (this.triggerType) {
    return [{
      type: this.triggerType,
      keywords: this.keywords || [],
      exactMatch: this.exactMatch || false,
      caseSensitive: this.caseSensitive || false
    }];
  }
  return [];
};

// Method to get all actions
automationRuleSchema.methods.getAllActions = function() {
  if (this.actions && this.actions.length > 0) {
    return this.actions;
  }
  // Legacy support
  if (this.actionType) {
    return [{
      type: this.actionType,
      responseMessage: this.responseMessage || '',
      delaySeconds: 0
    }];
  }
  return [];
};

// Method to check if automation applies to specific content
automationRuleSchema.methods.appliesToContent = function(contentId, instagramMediaId) {
  if (this.applyToAllContent) return true;
  if (this.contentId && this.contentId.toString() === contentId?.toString()) return true;
  if (this.instagramMediaId && this.instagramMediaId === instagramMediaId) return true;
  return false;
};

// Pre-save middleware to update timestamps
automationRuleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('AutomationRule', automationRuleSchema); 