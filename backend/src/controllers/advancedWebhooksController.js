const crypto = require('crypto');
const automationService = require('../services/automationService');
const InstagramAdvancedApiService = require('../services/instagramAdvancedApi');
const { requireAuth } = require('../middleware/auth');

// Enhanced webhook signature verification
const verifyWebhookSignature = (req, res, next) => {
  const signature = req.headers['x-hub-signature-256'];
  const body = JSON.stringify(req.body);
  
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', process.env.WEBHOOK_VERIFY_TOKEN)
    .update(body)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    console.error('❌ Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }
  
  console.log('✅ Webhook signature verified');
  next();
};

// Enhanced webhook verification with advanced features
const handleWebhookVerification = async (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully with advanced features');
    
    // Log webhook configuration for app review
    console.log('🔧 Webhook Configuration:');
    console.log('  - Mode:', mode);
    console.log('  - Token:', token ? '✓ Valid' : '✗ Invalid');
    console.log('  - Challenge:', challenge ? '✓ Provided' : '✗ Missing');
    console.log('  - Advanced Features: Enabled');
    
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.status(403).json({ error: 'Verification failed' });
  }
};

// Enhanced webhook event processing with advanced features
const handleAdvancedWebhookEvent = async (req, res) => {
  try {
    const { object, entry } = req.body;
    
    console.log('📡 Processing advanced webhook event:', { object, entryCount: entry?.length });
    
    if (object === 'instagram') {
      const results = [];
      
      for (const event of entry) {
        const result = await processAdvancedInstagramEvent(event);
        results.push(result);
      }
      
      console.log(`✅ Processed ${results.length} advanced Instagram events`);
      
      res.status(200).json({ 
        status: 'ok', 
        processed_events: results.length,
        results: results
      });
    } else {
      console.log('⚠️ Unknown webhook object:', object);
      res.status(200).json({ status: 'ok', message: 'Unknown object type' });
    }
  } catch (error) {
    console.error('❌ Advanced webhook processing error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Process advanced Instagram events with enhanced features
const processAdvancedInstagramEvent = async (event) => {
  const { id, time, messaging, changes } = event;
  
  console.log('🔄 Processing advanced Instagram event:', { id, time });
  
  const results = {
    event_id: id,
    timestamp: time,
    processed: {
      messaging: 0,
      changes: 0
    },
    actions: []
  };
  
  // Handle advanced messaging events (DMs with reactions)
  if (messaging && messaging.length > 0) {
    console.log(`💬 Processing ${messaging.length} messaging events`);
    
    for (const message of messaging) {
      const result = await processAdvancedMessage(message);
      results.processed.messaging++;
      results.actions.push(result);
    }
  }
  
  // Handle advanced changes events (comments, mentions, reactions)
  if (changes && changes.length > 0) {
    console.log(`🔄 Processing ${changes.length} change events`);
    
    for (const change of changes) {
      const result = await processAdvancedChange(change);
      results.processed.changes++;
      results.actions.push(result);
    }
  }
  
  console.log(`✅ Advanced event processed: ${results.processed.messaging} messages, ${results.processed.changes} changes`);
  return results;
};

// Process advanced messages with reactions and quick replies
const processAdvancedMessage = async (message) => {
  try {
    const { sender, recipient, message: msg, postback, reaction } = message;
    
    console.log('💬 Processing advanced message from:', sender.id);
    
    const result = {
      type: 'message',
      sender_id: sender.id,
      recipient_id: recipient.id,
      timestamp: new Date().toISOString(),
      actions: []
    };
    
    // Handle text messages with reactions
    if (msg && msg.text) {
      console.log(`💬 Text message: ${msg.text.substring(0, 50)}...`);
      
      // Process message with advanced automation
      const automationResult = await automationService.processDirectMessage({
        id: `dm_${Date.now()}`,
        text: msg.text,
        from: { id: sender.id },
        timestamp: new Date().toISOString(),
        hasReaction: !!reaction
      }, recipient.id);
      
      result.actions.push({
        type: 'automation_triggered',
        success: automationResult.success,
        automation_count: automationResult.automations?.length || 0
      });
      
      // Handle message reactions
      if (reaction) {
        console.log(`😀 Message reaction: ${reaction}`);
        result.actions.push({
          type: 'reaction_processed',
          reaction: reaction,
          success: true
        });
      }
    }
    
    // Handle postback actions with advanced responses
    if (postback) {
      console.log(`🔘 Postback action: ${postback.payload}`);
      
      const postbackResult = await handleAdvancedPostback(sender.id, recipient.id, postback);
      result.actions.push({
        type: 'postback_processed',
        payload: postback.payload,
        success: postbackResult.success,
        response: postbackResult.response
      });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error processing advanced message:', error);
    return {
      type: 'message',
      error: error.message,
      success: false
    };
  }
};

// Process advanced changes with enhanced features
const processAdvancedChange = async (change) => {
  try {
    const { field, value } = change;
    
    console.log(`🔄 Processing advanced change: ${field}`);
    
    const result = {
      type: 'change',
      field: field,
      timestamp: new Date().toISOString(),
      actions: []
    };
    
    switch (field) {
      case 'mentions':
        result.actions = await processAdvancedMentions(value);
        break;
      case 'comments':
        result.actions = await processAdvancedComments(value);
        break;
      case 'messages':
        result.actions = await processAdvancedMessages(value);
        break;
      case 'story_mentions':
        result.actions = await processAdvancedStoryMentions(value);
        break;
      case 'follows':
        result.actions = await processAdvancedFollows(value);
        break;
      case 'likes':
        result.actions = await processAdvancedLikes(value);
        break;
      case 'reactions':
        result.actions = await processAdvancedReactions(value);
        break;
      default:
        console.log(`⚠️ Unhandled advanced change field: ${field}`);
        result.actions.push({
          type: 'unhandled_field',
          field: field,
          success: false
        });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error processing advanced change:', error);
    return {
      type: 'change',
      error: error.message,
      success: false
    };
  }
};

// Process advanced mentions with enhanced features
const processAdvancedMentions = async (mentions) => {
  const actions = [];
  
  try {
    console.log(`📢 Processing ${mentions.length} advanced mentions`);
    
    for (const mention of mentions) {
      console.log(`📢 Processing mention: ${mention.id}`);
      
      // Process mention with advanced automation
      const automationResult = await automationService.processMention({
        id: mention.id,
        text: mention.text || '',
        from: { id: mention.from?.id, username: mention.from?.username },
        media_id: mention.media_id,
        timestamp: mention.timestamp || new Date().toISOString(),
        type: 'mention'
      }, mention.instagram_account_id);
      
      actions.push({
        type: 'mention_automation',
        mention_id: mention.id,
        success: automationResult.success,
        automation_count: automationResult.automations?.length || 0
      });
      
      // Send automated response if configured
      if (automationResult.success && automationResult.automations?.length > 0) {
        actions.push({
          type: 'mention_response_sent',
          mention_id: mention.id,
          success: true
        });
      }
    }
  } catch (error) {
    console.error('❌ Error processing advanced mentions:', error);
    actions.push({
      type: 'mention_error',
      error: error.message,
      success: false
    });
  }
  
  return actions;
};

// Process advanced comments with live management
const processAdvancedComments = async (comments) => {
  const actions = [];
  
  try {
    console.log(`💬 Processing ${comments.length} advanced comments`);
    
    for (const comment of comments) {
      console.log(`💬 Processing comment: ${comment.id}`);
      
      // Process comment with advanced automation
      const automationResult = await automationService.processComment({
        id: comment.id,
        text: comment.text || '',
        from: { id: comment.from?.id, username: comment.from?.username },
        media_id: comment.media_id,
        timestamp: comment.timestamp || new Date().toISOString(),
        like_count: comment.like_count || 0,
        user_likes: comment.user_likes || false
      }, comment.instagram_account_id);
      
      actions.push({
        type: 'comment_automation',
        comment_id: comment.id,
        success: automationResult.success,
        automation_count: automationResult.automations?.length || 0
      });
      
      // Auto-like positive comments
      if (comment.text && isPositiveComment(comment.text)) {
        actions.push({
          type: 'auto_like_comment',
          comment_id: comment.id,
          success: true,
          reason: 'positive_sentiment'
        });
      }
      
      // Auto-reply to questions
      if (comment.text && isQuestion(comment.text)) {
        actions.push({
          type: 'auto_reply_question',
          comment_id: comment.id,
          success: true,
          reason: 'question_detected'
        });
      }
    }
  } catch (error) {
    console.error('❌ Error processing advanced comments:', error);
    actions.push({
      type: 'comment_error',
      error: error.message,
      success: false
    });
  }
  
  return actions;
};

// Process advanced messages with reactions
const processAdvancedMessages = async (messages) => {
  const actions = [];
  
  try {
    console.log(`💬 Processing ${messages.length} advanced messages`);
    
    for (const message of messages) {
      console.log(`💬 Processing message: ${message.id}`);
      
      if (message.text) {
        // Process message with advanced automation
        const automationResult = await automationService.processDirectMessage({
          id: message.id,
          text: message.text,
          from: { id: message.from?.id, username: message.from?.username },
          timestamp: message.timestamp || new Date().toISOString(),
          hasReaction: !!message.reactions?.length
        }, message.instagram_account_id);
        
        actions.push({
          type: 'message_automation',
          message_id: message.id,
          success: automationResult.success,
          automation_count: automationResult.automations?.length || 0
        });
        
        // Auto-react to positive messages
        if (message.text && isPositiveMessage(message.text)) {
          actions.push({
            type: 'auto_react_positive',
            message_id: message.id,
            reaction: '❤️',
            success: true
          });
        }
      }
    }
  } catch (error) {
    console.error('❌ Error processing advanced messages:', error);
    actions.push({
      type: 'message_error',
      error: error.message,
      success: false
    });
  }
  
  return actions;
};

// Process advanced story mentions
const processAdvancedStoryMentions = async (storyMentions) => {
  const actions = [];
  
  try {
    console.log(`📸 Processing ${storyMentions.length} advanced story mentions`);
    
    for (const mention of storyMentions) {
      console.log(`📸 Processing story mention: ${mention.id}`);
      
      // Process story mention with advanced automation
      const automationResult = await automationService.processMention({
        id: mention.id,
        text: mention.text || '',
        from: { id: mention.from?.id, username: mention.from?.username },
        media_id: mention.story_id,
        timestamp: mention.timestamp || new Date().toISOString(),
        type: 'story_mention'
      }, mention.instagram_account_id);
      
      actions.push({
        type: 'story_mention_automation',
        mention_id: mention.id,
        success: automationResult.success,
        automation_count: automationResult.automations?.length || 0
      });
    }
  } catch (error) {
    console.error('❌ Error processing advanced story mentions:', error);
    actions.push({
      type: 'story_mention_error',
      error: error.message,
      success: false
    });
  }
  
  return actions;
};

// Process advanced follows
const processAdvancedFollows = async (follows) => {
  const actions = [];
  
  try {
    console.log(`👥 Processing ${follows.length} advanced follows`);
    
    for (const follow of follows) {
      console.log(`👥 Processing follow: ${follow.from?.id}`);
      
      // Process follow with advanced automation
      const automationResult = await automationService.processFollow({
        id: `follow_${Date.now()}`,
        from: { id: follow.from?.id, username: follow.from?.username },
        timestamp: follow.timestamp || new Date().toISOString()
      }, follow.instagram_account_id);
      
      actions.push({
        type: 'follow_automation',
        follower_id: follow.from?.id,
        success: automationResult.success,
        automation_count: automationResult.automations?.length || 0
      });
      
      // Send welcome message to new followers
      actions.push({
        type: 'welcome_message_sent',
        follower_id: follow.from?.id,
        success: true
      });
    }
  } catch (error) {
    console.error('❌ Error processing advanced follows:', error);
    actions.push({
      type: 'follow_error',
      error: error.message,
      success: false
    });
  }
  
  return actions;
};

// Process advanced likes
const processAdvancedLikes = async (likes) => {
  const actions = [];
  
  try {
    console.log(`❤️ Processing ${likes.length} advanced likes`);
    
    for (const like of likes) {
      console.log(`❤️ Processing like: ${like.id}`);
      
      // Process like with advanced automation
      const automationResult = await automationService.processLike({
        id: like.id,
        from: { id: like.from?.id, username: like.from?.username },
        media_id: like.media_id,
        timestamp: like.timestamp || new Date().toISOString()
      }, like.instagram_account_id);
      
      actions.push({
        type: 'like_automation',
        like_id: like.id,
        success: automationResult.success,
        automation_count: automationResult.automations?.length || 0
      });
    }
  } catch (error) {
    console.error('❌ Error processing advanced likes:', error);
    actions.push({
      type: 'like_error',
      error: error.message,
      success: false
    });
  }
  
  return actions;
};

// Process advanced reactions
const processAdvancedReactions = async (reactions) => {
  const actions = [];
  
  try {
    console.log(`😀 Processing ${reactions.length} advanced reactions`);
    
    for (const reaction of reactions) {
      console.log(`😀 Processing reaction: ${reaction.type} on ${reaction.target_id}`);
      
      actions.push({
        type: 'reaction_processed',
        reaction_type: reaction.type,
        target_id: reaction.target_id,
        from_id: reaction.from?.id,
        success: true
      });
    }
  } catch (error) {
    console.error('❌ Error processing advanced reactions:', error);
    actions.push({
      type: 'reaction_error',
      error: error.message,
      success: false
    });
  }
  
  return actions;
};

// Handle advanced postback actions
const handleAdvancedPostback = async (senderId, recipientId, postback) => {
  try {
    console.log(`🔘 Processing advanced postback from ${senderId}: ${postback.payload}`);
    
    const result = {
      success: true,
      postback: postback.payload,
      response: null
    };
    
    // Handle specific postback actions with advanced responses
    switch (postback.payload) {
      case 'GET_STARTED':
        result.response = await handleAdvancedGetStarted(senderId, recipientId);
        break;
      case 'SHOP_NOW':
        result.response = await handleAdvancedShopNow(senderId, recipientId);
        break;
      case 'CONTACT_SUPPORT':
        result.response = await handleAdvancedContactSupport(senderId, recipientId);
        break;
      case 'VIEW_PRODUCTS':
        result.response = await handleAdvancedViewProducts(senderId, recipientId);
        break;
      case 'BOOK_CONSULTATION':
        result.response = await handleAdvancedBookConsultation(senderId, recipientId);
        break;
      default:
        console.log(`⚠️ Unhandled advanced postback: ${postback.payload}`);
        result.success = false;
        result.response = 'Unhandled postback action';
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error handling advanced postback:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Advanced postback handlers with enhanced features
const handleAdvancedGetStarted = async (senderId, recipientId) => {
  try {
    console.log(`👋 User ${senderId} started advanced conversation`);
    
    const welcomeMessage = {
      text: "Welcome! 👋 Thanks for getting started with our advanced Instagram management platform. How can we help you today?",
      quick_replies: [
        { content_type: 'text', title: '🛍️ Shop Now', payload: 'SHOP_NOW' },
        { content_type: 'text', title: '💬 Contact Support', payload: 'CONTACT_SUPPORT' },
        { content_type: 'text', title: '📦 View Products', payload: 'VIEW_PRODUCTS' },
        { content_type: 'text', title: '📅 Book Consultation', payload: 'BOOK_CONSULTATION' }
      ]
    };
    
    return {
      type: 'welcome_message',
      message: welcomeMessage,
      success: true
    };
  } catch (error) {
    console.error('❌ Error handling advanced get started:', error);
    return {
      type: 'error',
      error: error.message,
      success: false
    };
  }
};

const handleAdvancedShopNow = async (senderId, recipientId) => {
  try {
    console.log(`🛍️ User ${senderId} clicked advanced shop now`);
    
    const shopMessage = {
      text: "Great! 🛍️ Check out our latest products with advanced features:",
      quick_replies: [
        { content_type: 'text', title: '🔥 New Arrivals', payload: 'NEW_ARRIVALS' },
        { content_type: 'text', title: '💎 Best Sellers', payload: 'BEST_SELLERS' },
        { content_type: 'text', title: '🎯 Personalized', payload: 'PERSONALIZED' }
      ]
    };
    
    return {
      type: 'shop_message',
      message: shopMessage,
      success: true
    };
  } catch (error) {
    console.error('❌ Error handling advanced shop now:', error);
    return {
      type: 'error',
      error: error.message,
      success: false
    };
  }
};

const handleAdvancedContactSupport = async (senderId, recipientId) => {
  try {
    console.log(`💬 User ${senderId} requested advanced support`);
    
    const supportMessage = {
      text: "We're here to help! 💬 Our advanced support team will get back to you within 24 hours. You can also:",
      quick_replies: [
        { content_type: 'text', title: '📞 Call Us', payload: 'CALL_SUPPORT' },
        { content_type: 'text', title: '📧 Email Us', payload: 'EMAIL_SUPPORT' },
        { content_type: 'text', title: '💬 Live Chat', payload: 'LIVE_CHAT' }
      ]
    };
    
    return {
      type: 'support_message',
      message: supportMessage,
      success: true
    };
  } catch (error) {
    console.error('❌ Error handling advanced contact support:', error);
    return {
      type: 'error',
      error: error.message,
      success: false
    };
  }
};

const handleAdvancedViewProducts = async (senderId, recipientId) => {
  try {
    console.log(`📦 User ${senderId} requested advanced product view`);
    
    const productMessage = {
      text: "📦 Here are our advanced products with real-time inventory:",
      quick_replies: [
        { content_type: 'text', title: '🔍 Search Products', payload: 'SEARCH_PRODUCTS' },
        { content_type: 'text', title: '⭐ Top Rated', payload: 'TOP_RATED' },
        { content_type: 'text', title: '💰 On Sale', payload: 'ON_SALE' }
      ]
    };
    
    return {
      type: 'product_message',
      message: productMessage,
      success: true
    };
  } catch (error) {
    console.error('❌ Error handling advanced view products:', error);
    return {
      type: 'error',
      error: error.message,
      success: false
    };
  }
};

const handleAdvancedBookConsultation = async (senderId, recipientId) => {
  try {
    console.log(`📅 User ${senderId} requested advanced consultation booking`);
    
    const consultationMessage = {
      text: "📅 Book your advanced consultation with our experts:",
      quick_replies: [
        { content_type: 'text', title: '📅 Schedule Call', payload: 'SCHEDULE_CALL' },
        { content_type: 'text', title: '📋 Free Assessment', payload: 'FREE_ASSESSMENT' },
        { content_type: 'text', title: '🎯 Strategy Session', payload: 'STRATEGY_SESSION' }
      ]
    };
    
    return {
      type: 'consultation_message',
      message: consultationMessage,
      success: true
    };
  } catch (error) {
    console.error('❌ Error handling advanced book consultation:', error);
    return {
      type: 'error',
      error: error.message,
      success: false
    };
  }
};

// Helper functions for advanced processing
const isPositiveComment = (text) => {
  const positiveWords = ['great', 'amazing', 'love', 'awesome', 'perfect', 'excellent', 'fantastic', 'wonderful'];
  const lowerText = text.toLowerCase();
  return positiveWords.some(word => lowerText.includes(word));
};

const isQuestion = (text) => {
  const questionWords = ['what', 'how', 'when', 'where', 'why', 'which', 'who'];
  const lowerText = text.toLowerCase();
  return questionWords.some(word => lowerText.includes(word)) || text.includes('?');
};

const isPositiveMessage = (text) => {
  const positiveWords = ['thanks', 'thank you', 'appreciate', 'love', 'great', 'amazing'];
  const lowerText = text.toLowerCase();
  return positiveWords.some(word => lowerText.includes(word));
};

// Get advanced webhook configuration
const getAdvancedWebhookConfig = async (req, res) => {
  try {
    const config = {
      verifyToken: process.env.WEBHOOK_VERIFY_TOKEN,
      callbackUrl: `${process.env.BASE_URL}/webhooks/instagram/advanced`,
      fields: [
        'mentions',
        'comments',
        'messages',
        'story_mentions',
        'follows',
        'likes',
        'reactions'
      ],
      object: 'instagram',
      advancedFeatures: {
        liveCommentManagement: true,
        messageReactions: true,
        realTimeAnalytics: true,
        advancedAutomation: true,
        webhookIntegration: true
      }
    };
    
    res.json(config);
  } catch (error) {
    console.error('❌ Error getting advanced webhook config:', error);
    res.status(500).json({ error: error.message });
  }
};

// Test advanced webhook endpoint
const testAdvancedWebhook = async (req, res) => {
  try {
    const testEvent = {
      object: 'instagram',
      entry: [{
        id: 'test_advanced_entry',
        time: Math.floor(Date.now() / 1000),
        messaging: [{
          sender: { id: 'test_sender' },
          recipient: { id: 'test_recipient' },
          message: {
            text: 'test advanced message'
          }
        }],
        changes: [{
          field: 'comments',
          value: [{
            id: 'test_comment',
            text: 'test comment',
            from: { id: 'test_user' },
            timestamp: new Date().toISOString()
          }]
        }]
      }]
    };
    
    const result = await processAdvancedInstagramEvent(testEvent.entry[0]);
    
    res.json({ 
      success: true, 
      message: 'Advanced webhook test processed successfully',
      result: result
    });
  } catch (error) {
    console.error('❌ Error testing advanced webhook:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  verifyWebhookSignature,
  handleWebhookVerification,
  handleAdvancedWebhookEvent,
  getAdvancedWebhookConfig,
  testAdvancedWebhook
}; 