const express = require('express');
const router = express.Router();
const automationService = require('../services/automationService');
const { handleInstagramEvent } = require('../services/automationExecutionService');
const InstagramApiService = require('../services/instagramApi');
const User = require('../models/User');

// Instagram Graph API Webhook Handler
class InstagramWebhookHandler {
  constructor() {
    this.verifyToken = process.env.WEBHOOK_VERIFY_TOKEN || 'SocioHiroSuperSecretWebhookVerifyToken2025';
  }

  // Handle webhook verification (GET request)
  handleVerification(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('Webhook verification request:', {
      mode,
      token,
      challenge,
      expectedToken: this.verifyToken
    });

    // Check if mode and token are correct
    if (mode === 'subscribe' && token === this.verifyToken) {
      console.log('Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      console.log('Webhook verification failed');
      res.status(403).send('Forbidden');
    }
  }

  // Handle incoming webhook events (POST request)
  handleWebhook(req, res) {
    const body = req.body;

    console.log('Webhook received:', JSON.stringify(body, null, 2));

    // Check if this is an Instagram webhook
    if (body.object === 'instagram') {
      body.entry.forEach(entry => {
        if (entry.changes) {
          entry.changes.forEach(change => {
            console.log('Processing Instagram webhook change:', change);
            handleInstagramEvent(change);
          });
        }
        
        // Handle Instagram messaging events
        if (entry.messaging) {
          entry.messaging.forEach(message => {
            console.log('Processing Instagram message:', message);
            handleInstagramMessage(message);
          });
        }
        
        // Handle Instagram comment events
        if (entry.comments) {
          entry.comments.forEach(comment => {
            console.log('Processing Instagram comment:', comment);
            handleInstagramComment(comment);
          });
        }
      });

      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.status(404).send('Not Found');
    }
  }

  // Handle Instagram messaging events
  async handleInstagramMessage(message) {
    try {
      console.log('Processing Instagram message event:', message);
      
      // Extract sender information
      const senderId = message.sender?.id;
      const messageText = message.message?.text;
      
      if (!senderId || !messageText) {
        console.log('Missing sender ID or message text');
        return;
      }

      // Get the Instagram account that received the message
      const instagramAccount = await this.getInstagramAccountFromWebhook(message);
      
      if (!instagramAccount) {
        console.log('No Instagram account found for webhook');
        return;
      }

      // Create Instagram API instance
      const instagramApi = new InstagramApiService(instagramAccount.accessToken);
      
      // Check if we should send an automated response
      const shouldRespond = await this.checkAutomationRules('message', {
        senderId,
        messageText,
        instagramAccountId: instagramAccount._id
      });

      if (shouldRespond) {
        const responseMessage = await this.generateAutomatedResponse('message', {
          senderId,
          messageText,
          instagramAccountId: instagramAccount._id
        });

        if (responseMessage) {
          const result = await instagramApi.sendDirectMessage(senderId, responseMessage);
          console.log('Automated message response result:', result);
        }
      }

    } catch (error) {
      console.error('Error handling Instagram message:', error);
    }
  }

  // Handle Instagram comment events
  async handleInstagramComment(comment) {
    try {
      console.log('Processing Instagram comment event:', comment);
      
      // Extract comment information
      const commentId = comment.id;
      const commenterId = comment.from?.id;
      const commentText = comment.text;
      const mediaId = comment.media_id;
      
      if (!commentId || !commenterId || !commentText) {
        console.log('Missing comment information');
        return;
      }

      // Get the Instagram account that received the comment
      const instagramAccount = await this.getInstagramAccountFromWebhook(comment);
      
      if (!instagramAccount) {
        console.log('No Instagram account found for webhook');
        return;
      }

      // Create Instagram API instance
      const instagramApi = new InstagramApiService(instagramAccount.accessToken);
      
      // Check if we should send an automated response
      const shouldRespond = await this.checkAutomationRules('comment', {
        commentId,
        commenterId,
        commentText,
        mediaId,
        instagramAccountId: instagramAccount._id
      });

      if (shouldRespond) {
        const responseMessage = await this.generateAutomatedResponse('comment', {
          commentId,
          commenterId,
          commentText,
          mediaId,
          instagramAccountId: instagramAccount._id
        });

        if (responseMessage) {
          // Send private reply to comment
          const result = await instagramApi.sendPrivateReplyToComment(commentId, responseMessage);
          console.log('Automated comment response result:', result);
        }
      }

    } catch (error) {
      console.error('Error handling Instagram comment:', error);
    }
  }

  // Helper method to get Instagram account from webhook data
  async getInstagramAccountFromWebhook(webhookData) {
    try {
      // Extract Instagram account ID from webhook data
      const instagramAccountId = webhookData.instagram_account_id || webhookData.recipient?.id;
      
      if (!instagramAccountId) {
        console.log('No Instagram account ID found in webhook data');
        return null;
      }

      // Find the Instagram account in our database
      const instagramAccount = await User.findOne({ instagramId: instagramAccountId });
      
      if (!instagramAccount) {
        console.log('Instagram account not found in database:', instagramAccountId);
        return null;
      }

      return instagramAccount;
    } catch (error) {
      console.error('Error getting Instagram account from webhook:', error);
      return null;
    }
  }

  // Check automation rules for the event
  async checkAutomationRules(eventType, eventData) {
    try {
      // This is a simplified check - you can implement more complex logic
      const automationRules = await automationService.getAutomationRules(eventData.instagramAccountId);
      
      for (const rule of automationRules) {
        if (rule.eventType === eventType && rule.isActive) {
          // Check if the rule conditions are met
          const conditionsMet = await this.evaluateRuleConditions(rule, eventData);
          if (conditionsMet) {
            return true;
          }
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking automation rules:', error);
      return false;
    }
  }

  // Evaluate rule conditions
  async evaluateRuleConditions(rule, eventData) {
    try {
      // Simple condition evaluation - you can make this more sophisticated
      if (rule.conditions && rule.conditions.length > 0) {
        for (const condition of rule.conditions) {
          switch (condition.type) {
            case 'keyword_match':
              if (eventData.messageText || eventData.commentText) {
                const text = (eventData.messageText || eventData.commentText).toLowerCase();
                const keywords = condition.value.toLowerCase().split(',');
                return keywords.some(keyword => text.includes(keyword.trim()));
              }
              break;
            case 'time_of_day':
              const hour = new Date().getHours();
              const [startHour, endHour] = condition.value.split('-').map(h => parseInt(h));
              return hour >= startHour && hour <= endHour;
            default:
              return true;
          }
        }
      }
      
      return true; // Default to true if no conditions
    } catch (error) {
      console.error('Error evaluating rule conditions:', error);
      return false;
    }
  }

  // Generate automated response
  async generateAutomatedResponse(eventType, eventData) {
    try {
      // This is a simplified response generation - you can implement more complex logic
      const automationRules = await automationService.getAutomationRules(eventData.instagramAccountId);
      
      for (const rule of automationRules) {
        if (rule.eventType === eventType && rule.isActive) {
          const conditionsMet = await this.evaluateRuleConditions(rule, eventData);
          if (conditionsMet && rule.response) {
            return rule.response;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error generating automated response:', error);
      return null;
    }
  }

}

const webhookHandler = new InstagramWebhookHandler();

// Webhook verification endpoint (GET)
router.get('/instagram', (req, res) => {
  webhookHandler.handleVerification(req, res);
});

// Webhook event endpoint (POST)
router.post('/instagram', express.json({ verify: false }), (req, res) => {
  webhookHandler.handleWebhook(req, res);
});

module.exports = router; 