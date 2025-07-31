const axios = require('axios');

class InstagramAdvancedApiService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://graph.instagram.com/v23.0';
    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Advanced Comment Management
  async getLiveComments(mediaId, limit = 50) {
    try {
      const url = `${this.baseUrl}/${mediaId}/comments`;
      const params = {
        access_token: this.accessToken,
        fields: 'id,text,from,timestamp,like_count,user_likes,username',
        limit: limit
      };
      
      console.log('🔍 Fetching live comments for media:', mediaId);
      const response = await this.axiosInstance.get(url, { params });
      
      const comments = response.data.data.map(comment => ({
        id: comment.id,
        text: comment.text,
        from: {
          id: comment.from?.id,
          username: comment.username || comment.from?.username
        },
        timestamp: comment.timestamp,
        likeCount: comment.like_count || 0,
        userLikes: comment.user_likes || false
      }));
      
      console.log(`✅ Retrieved ${comments.length} live comments`);
      return comments;
    } catch (error) {
      console.error('❌ Error fetching live comments:', error.response?.data || error.message);
      throw new Error(`Failed to get live comments: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Reply to comment with advanced options
  async replyToCommentAdvanced(commentId, replyData) {
    try {
      const { message, hideFromPublic = false, replyToUser = true } = replyData;
      
      const url = `${this.baseUrl}/${commentId}/replies`;
      const data = {
        access_token: this.accessToken,
        message: message,
        hide_from_public: hideFromPublic
      };
      
      console.log('💬 Sending advanced reply to comment:', commentId);
      console.log('Reply data:', { message: message.substring(0, 50) + '...', hideFromPublic });
      
      const response = await this.axiosInstance.post(url, data);
      
      if (response.data && response.data.id) {
        console.log('✅ Advanced reply sent successfully');
        return {
          success: true,
          reply_id: response.data.id,
          message: message,
          timestamp: new Date().toISOString()
        };
      } else {
        return { success: false, error: 'No reply ID in response' };
      }
    } catch (error) {
      console.error('❌ Error sending advanced reply:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Like/Unlike comment with reaction tracking
  async toggleCommentLike(commentId, action = 'like') {
    try {
      const url = `${this.baseUrl}/${commentId}/likes`;
      
      if (action === 'like') {
        const data = { access_token: this.accessToken };
        console.log('👍 Liking comment:', commentId);
        
        const response = await this.axiosInstance.post(url, data);
        
        if (response.status === 200 || response.status === 201) {
          console.log('✅ Comment liked successfully');
          return { success: true, action: 'liked', comment_id: commentId };
        }
      } else {
        console.log('👎 Unliking comment:', commentId);
        
        const response = await this.axiosInstance.delete(url, {
          params: { access_token: this.accessToken }
        });
        
        if (response.status === 200) {
          console.log('✅ Comment unliked successfully');
          return { success: true, action: 'unliked', comment_id: commentId };
        }
      }
      
      return { success: false, error: 'Failed to toggle comment like' };
    } catch (error) {
      console.error('❌ Error toggling comment like:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Advanced Message Management
  async getLiveMessages(limit = 50) {
    try {
      const url = `${this.baseUrl}/me/conversations`;
      const params = {
        access_token: this.accessToken,
        fields: 'id,participants,messages{id,from,to,message,created_time,reactions}',
        limit: limit
      };
      
      console.log('💬 Fetching live messages');
      const response = await this.axiosInstance.get(url, { params });
      
      const conversations = response.data.data.map(conv => ({
        id: conv.id,
        participants: conv.participants,
        messages: conv.messages?.data?.map(msg => ({
          id: msg.id,
          from: msg.from,
          to: msg.to,
          message: msg.message,
          created_time: msg.created_time,
          reactions: msg.reactions || []
        })) || []
      }));
      
      console.log(`✅ Retrieved ${conversations.length} conversations with live messages`);
      return conversations;
    } catch (error) {
      console.error('❌ Error fetching live messages:', error.response?.data || error.message);
      throw new Error(`Failed to get live messages: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Send message with reactions
  async sendMessageWithReaction(recipientId, messageData) {
    try {
      const { text, reaction, quickReplies } = messageData;
      
      const url = `${this.baseUrl}/me/messages`;
      const data = {
        access_token: this.accessToken,
        recipient: { id: recipientId },
        message: { 
          text: text,
          quick_replies: quickReplies || []
        }
      };
      
      console.log('💬 Sending message with reaction to user:', recipientId);
      console.log('Message data:', { text: text.substring(0, 50) + '...', reaction });
      
      const response = await this.axiosInstance.post(url, data);
      
      if (response.data && response.data.message_id) {
        console.log('✅ Message sent successfully');
        
        // Add reaction if specified
        if (reaction) {
          await this.addMessageReaction(response.data.message_id, reaction);
        }
        
        return {
          success: true,
          message_id: response.data.message_id,
          text: text,
          reaction: reaction,
          timestamp: new Date().toISOString()
        };
      } else {
        return { success: false, error: 'No message ID in response' };
      }
    } catch (error) {
      console.error('❌ Error sending message with reaction:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Add reaction to message
  async addMessageReaction(messageId, reaction) {
    try {
      const url = `${this.baseUrl}/${messageId}/reactions`;
      const data = {
        access_token: this.accessToken,
        reaction: reaction
      };
      
      console.log('😀 Adding reaction to message:', messageId, reaction);
      
      const response = await this.axiosInstance.post(url, data);
      
      if (response.status === 200 || response.status === 201) {
        console.log('✅ Reaction added successfully');
        return { success: true, message_id: messageId, reaction: reaction };
      } else {
        return { success: false, error: 'Failed to add reaction' };
      }
    } catch (error) {
      console.error('❌ Error adding message reaction:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Advanced Webhook Management
  async getWebhookSubscriptions() {
    try {
      const url = `${this.baseUrl}/me/subscribed_apps`;
      const params = { access_token: this.accessToken };
      
      console.log('🔗 Fetching webhook subscriptions');
      const response = await this.axiosInstance.get(url, { params });
      
      console.log('✅ Webhook subscriptions retrieved');
      return response.data.data || [];
    } catch (error) {
      console.error('❌ Error fetching webhook subscriptions:', error.response?.data || error.message);
      throw new Error(`Failed to get webhook subscriptions: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Subscribe to webhook events
  async subscribeToWebhookEvents(fields = ['mentions', 'comments', 'messages', 'story_mentions']) {
    try {
      const url = `${this.baseUrl}/me/subscribed_apps`;
      const data = {
        access_token: this.accessToken,
        subscribed_fields: fields.join(',')
      };
      
      console.log('🔗 Subscribing to webhook events:', fields);
      
      const response = await this.axiosInstance.post(url, data);
      
      if (response.data && response.data.success) {
        console.log('✅ Successfully subscribed to webhook events');
        return {
          success: true,
          subscribed_fields: fields,
          timestamp: new Date().toISOString()
        };
      } else {
        return { success: false, error: 'Failed to subscribe to webhook events' };
      }
    } catch (error) {
      console.error('❌ Error subscribing to webhook events:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Advanced Automation Features
  async createAdvancedAutomation(automationData) {
    try {
      const { triggerType, conditions, actions, schedule } = automationData;
      
      console.log('🤖 Creating advanced automation:', triggerType);
      
      // This would integrate with your automation service
      const automation = {
        id: `auto_${Date.now()}`,
        triggerType,
        conditions,
        actions,
        schedule,
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      console.log('✅ Advanced automation created');
      return {
        success: true,
        automation_id: automation.id,
        automation: automation
      };
    } catch (error) {
      console.error('❌ Error creating advanced automation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Process real-time events
  async processRealTimeEvent(eventData) {
    try {
      const { object, entry } = eventData;
      
      if (object === 'instagram') {
        console.log('📡 Processing real-time Instagram event');
        
        for (const event of entry) {
          await this.handleInstagramEvent(event);
        }
        
        return { success: true, processed_events: entry.length };
      }
      
      return { success: false, error: 'Invalid event object' };
    } catch (error) {
      console.error('❌ Error processing real-time event:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Handle individual Instagram events
  async handleInstagramEvent(event) {
    try {
      const { id, time, messaging, changes } = event;
      
      console.log('🔄 Processing Instagram event:', { id, time });
      
      // Handle messaging events (DMs)
      if (messaging && messaging.length > 0) {
        for (const message of messaging) {
          await this.handleMessageEvent(message);
        }
      }
      
      // Handle changes events (comments, mentions, etc.)
      if (changes && changes.length > 0) {
        for (const change of changes) {
          await this.handleChangeEvent(change);
        }
      }
      
      return { success: true, event_id: id };
    } catch (error) {
      console.error('❌ Error handling Instagram event:', error);
      return { success: false, error: error.message };
    }
  }

  // Handle message events
  async handleMessageEvent(message) {
    try {
      const { sender, recipient, message: msg, postback } = message;
      
      console.log('💬 Processing message event from:', sender.id);
      
      if (msg && msg.text) {
        // Process text message
        await this.processTextMessage(sender.id, recipient.id, msg.text);
      }
      
      if (postback) {
        // Process postback action
        await this.processPostback(sender.id, recipient.id, postback);
      }
      
      return { success: true, message_type: msg ? 'text' : 'postback' };
    } catch (error) {
      console.error('❌ Error handling message event:', error);
      return { success: false, error: error.message };
    }
  }

  // Handle change events
  async handleChangeEvent(change) {
    try {
      const { field, value } = change;
      
      console.log('🔄 Processing change event:', field);
      
      switch (field) {
        case 'mentions':
          await this.processMentions(value);
          break;
        case 'comments':
          await this.processComments(value);
          break;
        case 'messages':
          await this.processMessages(value);
          break;
        case 'story_mentions':
          await this.processStoryMentions(value);
          break;
        case 'follows':
          await this.processFollows(value);
          break;
        case 'likes':
          await this.processLikes(value);
          break;
        default:
          console.log(`⚠️ Unhandled change field: ${field}`);
      }
      
      return { success: true, field: field };
    } catch (error) {
      console.error('❌ Error handling change event:', error);
      return { success: false, error: error.message };
    }
  }

  // Process text messages
  async processTextMessage(senderId, recipientId, text) {
    try {
      console.log(`💬 Processing text message from ${senderId}: ${text.substring(0, 50)}...`);
      
      // Here you would implement your message processing logic
      // For example, checking for keywords, triggering automations, etc.
      
      return { success: true, sender_id: senderId, text: text };
    } catch (error) {
      console.error('❌ Error processing text message:', error);
      return { success: false, error: error.message };
    }
  }

  // Process postback actions
  async processPostback(senderId, recipientId, postback) {
    try {
      console.log(`🔘 Processing postback from ${senderId}: ${postback.payload}`);
      
      // Handle specific postback actions
      switch (postback.payload) {
        case 'GET_STARTED':
          await this.handleGetStarted(senderId, recipientId);
          break;
        case 'SHOP_NOW':
          await this.handleShopNow(senderId, recipientId);
          break;
        case 'CONTACT_SUPPORT':
          await this.handleContactSupport(senderId, recipientId);
          break;
        default:
          console.log(`⚠️ Unhandled postback: ${postback.payload}`);
      }
      
      return { success: true, postback: postback.payload };
    } catch (error) {
      console.error('❌ Error processing postback:', error);
      return { success: false, error: error.message };
    }
  }

  // Handle specific postback actions
  async handleGetStarted(senderId, recipientId) {
    try {
      console.log(`👋 User ${senderId} started conversation`);
      
      const welcomeMessage = "Welcome! 👋 Thanks for getting started with us. How can we help you today?";
      
      // Send welcome message
      await this.sendMessageWithReaction(senderId, {
        text: welcomeMessage,
        reaction: '❤️'
      });
      
      return { success: true, action: 'get_started' };
    } catch (error) {
      console.error('❌ Error handling get started:', error);
      return { success: false, error: error.message };
    }
  }

  async handleShopNow(senderId, recipientId) {
    try {
      console.log(`🛍️ User ${senderId} clicked shop now`);
      
      const shopMessage = "Great! 🛍️ Check out our latest products: [shop link]";
      
      await this.sendMessageWithReaction(senderId, {
        text: shopMessage,
        reaction: '🛍️'
      });
      
      return { success: true, action: 'shop_now' };
    } catch (error) {
      console.error('❌ Error handling shop now:', error);
      return { success: false, error: error.message };
    }
  }

  async handleContactSupport(senderId, recipientId) {
    try {
      console.log(`💬 User ${senderId} requested support`);
      
      const supportMessage = "We're here to help! 💬 Our support team will get back to you within 24 hours.";
      
      await this.sendMessageWithReaction(senderId, {
        text: supportMessage,
        reaction: '💬'
      });
      
      return { success: true, action: 'contact_support' };
    } catch (error) {
      console.error('❌ Error handling contact support:', error);
      return { success: false, error: error.message };
    }
  }

  // Process different types of events
  async processMentions(mentions) {
    try {
      console.log(`📢 Processing ${mentions.length} mentions`);
      
      for (const mention of mentions) {
        console.log(`📢 Processing mention: ${mention.id}`);
        // Implement mention processing logic
      }
      
      return { success: true, mentions_count: mentions.length };
    } catch (error) {
      console.error('❌ Error processing mentions:', error);
      return { success: false, error: error.message };
    }
  }

  async processComments(comments) {
    try {
      console.log(`💬 Processing ${comments.length} comments`);
      
      for (const comment of comments) {
        console.log(`💬 Processing comment: ${comment.id}`);
        // Implement comment processing logic
      }
      
      return { success: true, comments_count: comments.length };
    } catch (error) {
      console.error('❌ Error processing comments:', error);
      return { success: false, error: error.message };
    }
  }

  async processMessages(messages) {
    try {
      console.log(`💬 Processing ${messages.length} messages`);
      
      for (const message of messages) {
        console.log(`💬 Processing message: ${message.id}`);
        // Implement message processing logic
      }
      
      return { success: true, messages_count: messages.length };
    } catch (error) {
      console.error('❌ Error processing messages:', error);
      return { success: false, error: error.message };
    }
  }

  async processStoryMentions(storyMentions) {
    try {
      console.log(`📸 Processing ${storyMentions.length} story mentions`);
      
      for (const mention of storyMentions) {
        console.log(`📸 Processing story mention: ${mention.id}`);
        // Implement story mention processing logic
      }
      
      return { success: true, story_mentions_count: storyMentions.length };
    } catch (error) {
      console.error('❌ Error processing story mentions:', error);
      return { success: false, error: error.message };
    }
  }

  async processFollows(follows) {
    try {
      console.log(`👥 Processing ${follows.length} follows`);
      
      for (const follow of follows) {
        console.log(`👥 Processing follow: ${follow.from?.id}`);
        // Implement follow processing logic
      }
      
      return { success: true, follows_count: follows.length };
    } catch (error) {
      console.error('❌ Error processing follows:', error);
      return { success: false, error: error.message };
    }
  }

  async processLikes(likes) {
    try {
      console.log(`❤️ Processing ${likes.length} likes`);
      
      for (const like of likes) {
        console.log(`❤️ Processing like: ${like.id}`);
        // Implement like processing logic
      }
      
      return { success: true, likes_count: likes.length };
    } catch (error) {
      console.error('❌ Error processing likes:', error);
      return { success: false, error: error.message };
    }
  }

  // Get advanced analytics
  async getAdvancedAnalytics(timeRange = '30d') {
    try {
      const url = `${this.baseUrl}/me/insights`;
      const params = {
        access_token: this.accessToken,
        metric: 'reach,impressions,profile_views,follower_count',
        period: timeRange
      };
      
      console.log('📊 Fetching advanced analytics');
      const response = await this.axiosInstance.get(url, { params });
      
      console.log('✅ Advanced analytics retrieved');
      return response.data.data || [];
    } catch (error) {
      console.error('❌ Error fetching advanced analytics:', error.response?.data || error.message);
      throw new Error(`Failed to get advanced analytics: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Test all advanced features
  async testAdvancedFeatures() {
    try {
      console.log('🧪 Testing advanced Instagram features...');
      
      const tests = [
        { name: 'Live Comments', test: () => this.getLiveComments('test_media_id') },
        { name: 'Live Messages', test: () => this.getLiveMessages() },
        { name: 'Webhook Subscriptions', test: () => this.getWebhookSubscriptions() },
        { name: 'Advanced Analytics', test: () => this.getAdvancedAnalytics() }
      ];
      
      const results = [];
      
      for (const test of tests) {
        try {
          console.log(`🧪 Testing: ${test.name}`);
          const result = await test.test();
          results.push({ name: test.name, success: true, result });
        } catch (error) {
          console.error(`❌ Test failed: ${test.name}`, error.message);
          results.push({ name: test.name, success: false, error: error.message });
        }
      }
      
      console.log('✅ Advanced features testing completed');
      return {
        success: true,
        tests: results,
        passed: results.filter(r => r.success).length,
        total: results.length
      };
    } catch (error) {
      console.error('❌ Error testing advanced features:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = InstagramAdvancedApiService; 