const InstagramApiService = require('./instagramApi');

class InstagramWebhookService {
  constructor() {
    this.webhookUrl = process.env.WEBHOOK_CALLBACK_URL || `${process.env.BASE_URL}/api/webhooks/instagram`;
    this.verifyToken = process.env.WEBHOOK_VERIFY_TOKEN || 'sociohiro_webhook_token';
  }

  // Set up webhook for an Instagram account
  async setupWebhook(accessToken, instagramAccountId) {
    try {
      console.log(`Setting up webhook for Instagram account: ${instagramAccountId}`);
      
      const instagramApi = new InstagramApiService(accessToken);
      
      // Subscribe to webhook events
      const webhookConfig = {
        object: 'instagram',
        callback_url: this.webhookUrl,
        verify_token: this.verifyToken,
        fields: [
          'mentions',
          'comments', 
          'messages',
          'story_mentions',
          'follows',
          'likes'
        ]
      };

      // Create webhook subscription
      const result = await instagramApi.createWebhookSubscription(webhookConfig);
      
      console.log('Webhook setup successful:', result);
      return result;
    } catch (error) {
      console.error('Error setting up webhook:', error);
      throw error;
    }
  }

  // Check if webhook is already set up
  async checkWebhookStatus(accessToken, instagramAccountId) {
    try {
      const instagramApi = new InstagramApiService(accessToken);
      const subscriptions = await instagramApi.getWebhookSubscriptions();
      
      // Check if our webhook is already subscribed
      const existingSubscription = subscriptions.find(sub => 
        sub.callback_url === this.webhookUrl && 
        sub.object === 'instagram'
      );
      
      return {
        isSetup: !!existingSubscription,
        subscription: existingSubscription
      };
    } catch (error) {
      console.error('Error checking webhook status:', error);
      return { isSetup: false, subscription: null };
    }
  }

  // Remove webhook subscription
  async removeWebhook(accessToken, subscriptionId) {
    try {
      const instagramApi = new InstagramApiService(accessToken);
      await instagramApi.deleteWebhookSubscription(subscriptionId);
      
      console.log('Webhook removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing webhook:', error);
      throw error;
    }
  }

  // Update webhook fields based on active automations
  async updateWebhookFields(accessToken, instagramAccountId, activeAutomations) {
    try {
      // Determine which fields we need based on active automations
      const neededFields = new Set();
      
      activeAutomations.forEach(automation => {
        // Handle new triggers array format
        if (automation.triggers && automation.triggers.length > 0) {
          automation.triggers.forEach(trigger => {
            switch (trigger.type) {
              case 'comment':
                neededFields.add('comments');
                break;
              case 'mention':
                neededFields.add('mentions');
                break;
              case 'dm':
                neededFields.add('messages');
                break;
              case 'follow':
                neededFields.add('follows');
                break;
              case 'like':
                neededFields.add('likes');
                break;
              case 'hashtag':
                neededFields.add('mentions');
                break;
            }
          });
        }
        // Handle legacy single triggerType
        else if (automation.triggerType) {
          switch (automation.triggerType) {
            case 'comment':
              neededFields.add('comments');
              break;
            case 'mention':
              neededFields.add('mentions');
              break;
            case 'dm':
              neededFields.add('messages');
              break;
            case 'follow':
              neededFields.add('follows');
              break;
            case 'like':
              neededFields.add('likes');
              break;
            case 'hashtag':
              neededFields.add('mentions');
              break;
          }
        }
      });

      // Check for story-related actions in both new and legacy formats
      const hasStoryAction = activeAutomations.some(automation => {
        // Check new actions array format
        if (automation.actions && automation.actions.length > 0) {
          return automation.actions.some(action => action.type === 'send_story_reply');
        }
        // Check legacy single actionType
        return automation.actionType === 'send_story_reply';
      });

      if (hasStoryAction) {
        neededFields.add('story_mentions');
      }

      const fields = Array.from(neededFields);
      
      if (fields.length > 0) {
        const instagramApi = new InstagramApiService(accessToken);
        await instagramApi.updateWebhookFields(fields);
        
        console.log(`Updated webhook fields: ${fields.join(', ')}`);
      }
    } catch (error) {
      console.error('Error updating webhook fields:', error);
      throw error;
    }
  }

  // Ensure webhook is set up when automation is created
  async ensureWebhookForAutomation(userId, automation) {
    try {
      // Get user's Instagram access token
      const User = require('../models/User');
      const user = await User.findById(userId);
      
      if (!user || !user.accessToken) {
        throw new Error('User not found or no Instagram access token');
      }

      // Check if webhook is already set up
      const webhookStatus = await this.checkWebhookStatus(user.accessToken, user.instagramId);
      
      if (!webhookStatus.isSetup) {
        // Set up webhook
        await this.setupWebhook(user.accessToken, user.instagramId);
        console.log('Webhook set up for new automation');
      } else {
        // Update webhook fields if needed - directly query database to avoid circular dependency
        const AutomationRule = require('../models/AutomationRule');
        const activeAutomations = await AutomationRule.find({
          userId: userId,
          isActive: true
        }).select('triggerType actionType triggers actions');
        
        await this.updateWebhookFields(user.accessToken, user.instagramId, activeAutomations);
      }
    } catch (error) {
      console.error('Error ensuring webhook for automation:', error);
      // Don't throw error - automation can still be created without webhook
    }
  }

  // Update webhook fields after automation changes (create, update, delete, toggle)
  async updateWebhookFieldsAfterAutomationChange(userId) {
    try {
      // Get user's Instagram access token
      const User = require('../models/User');
      const user = await User.findById(userId);
      
      if (!user || !user.accessToken) {
        throw new Error('User not found or no Instagram access token');
      }

      // Directly query for active automations to avoid circular dependency
      const AutomationRule = require('../models/AutomationRule');
      const activeAutomations = await AutomationRule.find({
        userId: userId,
        isActive: true
      }).select('triggerType actionType triggers actions');

      // Update webhook fields based on active automations
      await this.updateWebhookFields(user.accessToken, user.instagramAccountId, activeAutomations);
      
      console.log(`Updated webhook fields for user ${userId} after automation change`);
    } catch (error) {
      console.error('Error updating webhook fields after automation change:', error);
      // Don't throw error - automation changes can still succeed without webhook updates
    }
  }
}

module.exports = new InstagramWebhookService(); 