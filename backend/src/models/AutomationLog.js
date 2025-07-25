const mongoose = require('mongoose');

const automationLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ruleId: { type: mongoose.Schema.Types.ObjectId, ref: 'AutomationRule', required: true },
  triggerType: { 
    type: String, 
    required: true,
    enum: ['message', 'comment', 'mention', 'keyword']
  },
  triggerText: String,
  senderId: String,
  responseMessage: String,
  executedAt: { type: Date, default: Date.now },
  success: { type: Boolean, default: true },
  errorMessage: String
});

module.exports = mongoose.model('AutomationLog', automationLogSchema); 