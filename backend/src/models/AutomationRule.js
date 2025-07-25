const mongoose = require('mongoose');

const automationRuleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  triggerType: { 
    type: String, 
    required: true,
    enum: ['message', 'comment', 'mention', 'keyword']
  },
  keywords: [String],
  responseMessage: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  conditions: {
    timeOfDay: {
      start: String, // HH:MM format
      end: String    // HH:MM format
    },
    daysOfWeek: [Number], // 0-6 (Sunday-Saturday)
    maxExecutionsPerDay: Number
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AutomationRule', automationRuleSchema); 