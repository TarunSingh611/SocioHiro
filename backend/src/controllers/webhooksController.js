const crypto = require('crypto');
const automationService = require('../services/automationService');
const { requireAuth } = require('../middleware/auth');

// Verify webhook signature from Instagram
const { getBaseUrl, getOriginUrl, getWebhookUrl } = require('../utils/urlUtils');

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
  const { id, time, messaging, changes } = event;
  
  // Handle messaging events (DMs)
  if (messaging && messaging.length > 0) {
    for (const message of messaging) {
      await processMessage(message);
    }
  }
  
  // Handle changes events (comments, mentions, etc.)
  if (changes && changes.length > 0) {
    for (const change of changes) {
      await processChange(change);
    }
  }
};

// Process Instagram messages (DMs)
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
      case 'story_mentions':
        await handleStoryMentions(value);
        break;
      case 'follows':
        await handleFollows(value);
        break;
      case 'likes':
        await handleLikes(value);
        break;
      default:
        console.log(`Unhandled change field: ${field}`);
    }
  } catch (error) {
    console.error('Error processing change:', error);
  }
};

// Handle text messages (DMs)
const handleTextMessage = async (senderId, recipientId, text) => {
  try {
    console.log(`Processing DM from ${senderId}: ${text}`);
    
    // Process DM automations
    await automationService.processDirectMessage({
      id: `dm_${Date.now()}`,
      text,
      from: { id: senderId },
      timestamp: new Date().toISOString()
    }, recipientId);
    
  } catch (error) {
    console.error('Error handling text message:', error);
  }
};

// Handle postback actions
const handlePostback = async (senderId, recipientId, postback) => {
  try {
    console.log(`Processing postback from ${senderId}: ${postback.payload}`);
    
    // Handle specific postback actions
    switch (postback.payload) {
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
        console.log(`Unhandled postback: ${postback.payload}`);
    }
  } catch (error) {
    console.error('Error handling postback:', error);
  }
};

// Handle mentions
const handleMentions = async (mentions) => {
  try {
    for (const mention of mentions) {
      console.log(`Processing mention: ${mention.id}`);
      
      await automationService.processMention({
        id: mention.id,
        text: mention.text || '',
        from: { id: mention.from?.id, username: mention.from?.username },
        media_id: mention.media_id,
        timestamp: mention.timestamp || new Date().toISOString()
      }, mention.instagram_account_id);
    }
  } catch (error) {
    console.error('Error handling mentions:', error);
  }
};

// Process Instagram comments
const handleComments = async (comments) => {
  try {
    for (const comment of comments) {
      console.log(`Processing comment: ${comment.id}`);
      
      // Get the media ID and comment text
      const mediaId = comment.media_id;
      const commentText = comment.text || '';
      const userId = comment.from?.id;
      const username = comment.from?.username;
      
      // Process comment automations
      await automationService.processComment({
        id: comment.id,
        text: commentText,
        from: { id: userId, username: username },
        media_id: mediaId,
        timestamp: comment.timestamp || new Date().toISOString()
      }, comment.instagram_account_id);
    }
  } catch (error) {
    console.error('Error handling comments:', error);
  }
};

// Handle messages
const handleMessages = async (messages) => {
  try {
    for (const message of messages) {
      console.log(`Processing message: ${message.id}`);
      
      if (message.text) {
        await automationService.processDirectMessage({
          id: message.id,
          text: message.text,
          from: { id: message.from?.id, username: message.from?.username },
          timestamp: message.timestamp || new Date().toISOString()
        }, message.instagram_account_id);
      }
    }
  } catch (error) {
    console.error('Error handling messages:', error);
  }
};

// Handle story mentions
const handleStoryMentions = async (storyMentions) => {
  try {
    for (const mention of storyMentions) {
      console.log(`Processing story mention: ${mention.id}`);
      
      // Process story mention automations
      await automationService.processMention({
        id: mention.id,
        text: mention.text || '',
        from: { id: mention.from?.id, username: mention.from?.username },
        media_id: mention.story_id,
        timestamp: mention.timestamp || new Date().toISOString()
      }, mention.instagram_account_id);
    }
  } catch (error) {
    console.error('Error handling story mentions:', error);
  }
};

// Handle follows
const handleFollows = async (follows) => {
  try {
    for (const follow of follows) {
      console.log(`Processing follow: ${follow.from?.id}`);
      
      // Process follow automations
      await automationService.processFollow({
        id: `follow_${Date.now()}`,
        from: { id: follow.from?.id, username: follow.from?.username },
        timestamp: follow.timestamp || new Date().toISOString()
      }, follow.instagram_account_id);
    }
  } catch (error) {
    console.error('Error handling follows:', error);
  }
};

// Handle likes
const handleLikes = async (likes) => {
  try {
    for (const like of likes) {
      console.log(`Processing like: ${like.id}`);
      
      // Process like automations
      await automationService.processLike({
        id: like.id,
        from: { id: like.from?.id, username: like.from?.username },
        media_id: like.media_id,
        timestamp: like.timestamp || new Date().toISOString()
      }, like.instagram_account_id);
    }
  } catch (error) {
    console.error('Error handling likes:', error);
  }
};

// Handle get started postback
const handleGetStarted = async (senderId, recipientId) => {
  try {
    console.log(`User ${senderId} started conversation`);
    
    // Send welcome message
    const welcomeMessage = "Welcome! 👋 Thanks for getting started with us. How can we help you today?";
    
    // TODO: Implement actual Instagram DM sending
    console.log(`Sending welcome message to ${senderId}: ${welcomeMessage}`);
    
  } catch (error) {
    console.error('Error handling get started:', error);
  }
};

// Handle shop now postback
const handleShopNow = async (senderId, recipientId) => {
  try {
    console.log(`User ${senderId} clicked shop now`);
    
    const shopMessage = "Great! 🛍️ Check out our latest products: [shop link]";
    
    // TODO: Implement actual Instagram DM sending
    console.log(`Sending shop message to ${senderId}: ${shopMessage}`);
    
  } catch (error) {
    console.error('Error handling shop now:', error);
  }
};

// Handle contact support postback
const handleContactSupport = async (senderId, recipientId) => {
  try {
    console.log(`User ${senderId} requested support`);
    
    const supportMessage = "We're here to help! 💬 Our support team will get back to you within 24 hours.";
    
    // TODO: Implement actual Instagram DM sending
    console.log(`Sending support message to ${senderId}: ${supportMessage}`);
    
  } catch (error) {
    console.error('Error handling contact support:', error);
  }
};

// Get webhook configuration
const getWebhookConfig = async (req, res) => {
  try {
    const config = {
      verifyToken: process.env.WEBHOOK_VERIFY_TOKEN,
      callbackUrl: getWebhookUrl(req, 'instagram'),
      originUrl: getOriginUrl(req),
      fields: [
        'mentions',
        'comments',
        'messages',
        'story_mentions',
        'follows',
        'likes'
      ],
      object: 'instagram'
    };
    
    res.json(config);
  } catch (error) {
    console.error('Error getting webhook config:', error);
    res.status(500).json({ error: error.message });
  }
};

// Test webhook endpoint
const testWebhook = async (req, res) => {
  try {
    const testEvent = {
      object: 'instagram',
      entry: [{
        id: 'test_entry',
        time: Math.floor(Date.now() / 1000),
        messaging: [{
          sender: { id: 'test_sender' },
          recipient: { id: 'test_recipient' },
          message: {
            text: 'test message'
          }
        }]
      }]
    };
    
    await processInstagramEvent(testEvent.entry[0]);
    
    res.json({ 
      success: true, 
      message: 'Test webhook processed successfully' 
    });
  } catch (error) {
    console.error('Error testing webhook:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  verifyWebhookSignature,
  handleWebhookVerification,
  handleWebhookEvent,
  getWebhookConfig,
  testWebhook
}; 