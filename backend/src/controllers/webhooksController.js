const crypto = require('crypto');
const { requireAuth } = require('../middleware/auth');

// Verify webhook signature from Instagram
const verifyWebhookSignature = (req, res, next) => {
  const signature = req.headers['x-hub-signature-256'];
  const body = JSON.stringify(req.body);
  
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', process.env.WEBHOOK_VERIFY_TOKEN)
    .update(body)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }
  
  next();
};

// Handle Instagram webhook verification
const handleWebhookVerification = async (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.log('Webhook verification failed');
    res.status(403).json({ error: 'Verification failed' });
  }
};

// Handle Instagram webhook events
const handleWebhookEvent = async (req, res) => {
  try {
    const { object, entry } = req.body;
    
    if (object === 'instagram') {
      for (const event of entry) {
        await processInstagramEvent(event);
      }
    }
    
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Process individual Instagram events
const processInstagramEvent = async (event) => {
  const { id, time, messaging } = event;
  
  if (messaging && messaging.length > 0) {
    for (const message of messaging) {
      await processMessage(message);
    }
  }
  
  // Handle other event types (mentions, comments, etc.)
  if (event.changes && event.changes.length > 0) {
    for (const change of event.changes) {
      await processChange(change);
    }
  }
};

// Process Instagram messages
const processMessage = async (message) => {
  try {
    const { sender, recipient, message: msg, postback } = message;
    
    if (msg && msg.text) {
      // Handle text messages
      await handleTextMessage(sender.id, recipient.id, msg.text);
    }
    
    if (postback) {
      // Handle postback actions
      await handlePostback(sender.id, recipient.id, postback);
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
};

// Process Instagram changes (comments, mentions, etc.)
const processChange = async (change) => {
  try {
    const { field, value } = change;
    
    switch (field) {
      case 'mentions':
        await handleMentions(value);
        break;
      case 'comments':
        await handleComments(value);
        break;
      case 'messages':
        await handleMessages(value);
        break;
      default:
        console.log('Unhandled change field:', field);
    }
  } catch (error) {
    console.error('Error processing change:', error);
  }
};

// Handle text messages
const handleTextMessage = async (senderId, recipientId, text) => {
  try {
    // Find user by Instagram ID
    const User = require('../models/User');
    const user = await User.findOne({ instagramId: recipientId });
    
    if (!user) {
      console.log('User not found for Instagram ID:', recipientId);
      return;
    }
    
    // Check for automation rules
    const AutomationRule = require('../models/AutomationRule');
    const rules = await AutomationRule.find({ 
      userId: user._id,
      isActive: true,
      triggerType: 'message'
    });
    
    for (const rule of rules) {
      if (matchesRule(text, rule)) {
        await executeAutomation(rule, senderId, text);
      }
    }
  } catch (error) {
    console.error('Error handling text message:', error);
  }
};

// Handle postback actions
const handlePostback = async (senderId, recipientId, postback) => {
  try {
    const { payload } = postback;
    
    // Handle different postback payloads
    switch (payload) {
      case 'GET_STARTED':
        await handleGetStarted(senderId, recipientId);
        break;
      case 'SHOP_NOW':
        await handleShopNow(senderId, recipientId);
        break;
      case 'CONTACT_SUPPORT':
        await handleContactSupport(senderId, recipientId);
        break;
      default:
        console.log('Unhandled postback payload:', payload);
    }
  } catch (error) {
    console.error('Error handling postback:', error);
  }
};

// Handle mentions
const handleMentions = async (mentions) => {
  try {
    for (const mention of mentions) {
      const { from, post } = mention;
      
      // Find user by Instagram ID
      const User = require('../models/User');
      const user = await User.findOne({ instagramId: post.owner.id });
      
      if (!user) continue;
      
      // Check for mention automation rules
      const AutomationRule = require('../models/AutomationRule');
      const rules = await AutomationRule.find({ 
        userId: user._id,
        isActive: true,
        triggerType: 'mention'
      });
      
      for (const rule of rules) {
        if (matchesRule(mention.text || '', rule)) {
          await executeAutomation(rule, from.id, mention.text);
        }
      }
    }
  } catch (error) {
    console.error('Error handling mentions:', error);
  }
};

// Handle comments
const handleComments = async (comments) => {
  try {
    for (const comment of comments) {
      const { from, post, text } = comment;
      
      // Find user by Instagram ID
      const User = require('../models/User');
      const user = await User.findOne({ instagramId: post.owner.id });
      
      if (!user) continue;
      
      // Check for comment automation rules
      const AutomationRule = require('../models/AutomationRule');
      const rules = await AutomationRule.find({ 
        userId: user._id,
        isActive: true,
        triggerType: 'comment'
      });
      
      for (const rule of rules) {
        if (matchesRule(text, rule)) {
          await executeAutomation(rule, from.id, text);
        }
      }
    }
  } catch (error) {
    console.error('Error handling comments:', error);
  }
};

// Handle messages
const handleMessages = async (messages) => {
  try {
    for (const message of messages) {
      const { from, text } = message;
      
      // Find user by Instagram ID
      const User = require('../models/User');
      const user = await User.findOne({ instagramId: message.recipient?.id });
      
      if (!user) continue;
      
      // Check for message automation rules
      const AutomationRule = require('../models/AutomationRule');
      const rules = await AutomationRule.find({ 
        userId: user._id,
        isActive: true,
        triggerType: 'message'
      });
      
      for (const rule of rules) {
        if (matchesRule(text, rule)) {
          await executeAutomation(rule, from.id, text);
        }
      }
    }
  } catch (error) {
    console.error('Error handling messages:', error);
  }
};

// Check if message matches automation rule
const matchesRule = (text, rule) => {
  if (!rule.keywords || rule.keywords.length === 0) {
    return true; // No keywords means match all
  }
  
  const lowerText = text.toLowerCase();
  return rule.keywords.some(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
};

// Execute automation rule
const executeAutomation = async (rule, senderId, triggerText) => {
  try {
    // Send automated response
    await sendAutomatedMessage(senderId, rule.responseMessage);
    
    // Log automation execution
    const AutomationLog = require('../models/AutomationLog');
    await new AutomationLog({
      userId: rule.userId,
      ruleId: rule._id,
      triggerType: rule.triggerType,
      triggerText,
      senderId,
      responseMessage: rule.responseMessage,
      executedAt: new Date()
    }).save();
    
  } catch (error) {
    console.error('Error executing automation:', error);
  }
};

// Send automated message
const sendAutomatedMessage = async (recipientId, message) => {
  try {
    // This would integrate with Instagram Graph API to send messages
    // For now, we'll log the message
    console.log(`Sending automated message to ${recipientId}: ${message}`);
  } catch (error) {
    console.error('Error sending automated message:', error);
  }
};

// Handle get started postback
const handleGetStarted = async (senderId, recipientId) => {
  const welcomeMessage = "Welcome! I'm here to help you with your questions and orders. How can I assist you today?";
  await sendAutomatedMessage(senderId, welcomeMessage);
};

// Handle shop now postback
const handleShopNow = async (senderId, recipientId) => {
  const shopMessage = "Check out our latest products! Visit our website or browse our catalog.";
  await sendAutomatedMessage(senderId, shopMessage);
};

// Handle contact support postback
const handleContactSupport = async (senderId, recipientId) => {
  const supportMessage = "Our support team is here to help! Please describe your issue and we'll get back to you soon.";
  await sendAutomatedMessage(senderId, supportMessage);
};

// Get webhook configuration
const getWebhookConfig = async (req, res) => {
  try {
    const config = {
      verifyToken: process.env.WEBHOOK_VERIFY_TOKEN,
      webhookUrl: `${process.env.FRONTEND_URL}/api/webhooks/instagram`,
      fields: ['messages', 'mentions', 'comments'],
      object: 'instagram'
    };
    
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  verifyWebhookSignature,
  handleWebhookVerification,
  handleWebhookEvent,
  processInstagramEvent,
  processMessage,
  processChange,
  handleTextMessage,
  handlePostback,
  handleMentions,
  handleComments,
  handleMessages,
  matchesRule,
  executeAutomation,
  sendAutomatedMessage,
  handleGetStarted,
  handleShopNow,
  handleContactSupport,
  getWebhookConfig
}; 