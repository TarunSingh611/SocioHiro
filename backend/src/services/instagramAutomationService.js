const InstagramApiService = require('./instagramApi');

class InstagramAutomationService {
  constructor() {
    this.pollingInterval = 5 * 60 * 1000; // 5 minutes
    this.lastCheckTime = new Map(); // Track last check time per account
  }

  // Start polling-based automation for an Instagram account
  async startPollingAutomation(accessToken, instagramAccountId, automations) {
    try {
      console.log(`🚀 Starting polling-based automation for account: ${instagramAccountId}`);
      
      const instagramApi = new InstagramApiService(accessToken);
      
      // Verify account access
      const accountInfo = await instagramApi.getInstagramUserInfo();
      console.log(`✅ Connected to Instagram account: ${accountInfo.username}`);
      
      // Start polling for new content
      this.startPolling(accessToken, instagramAccountId, automations);
      
      return {
        success: true,
        message: 'Polling-based automation started',
        account: accountInfo.username
      };
    } catch (error) {
      console.error('❌ Error starting polling automation:', error.message);
      throw error;
    }
  }

  // Start polling for new content
  startPolling(accessToken, instagramAccountId, automations) {
    const pollKey = `${instagramAccountId}_${accessToken}`;
    
    // Clear existing interval if any
    if (this.pollingIntervals && this.pollingIntervals[pollKey]) {
      clearInterval(this.pollingIntervals[pollKey]);
    }
    
    // Initialize polling intervals map if not exists
    if (!this.pollingIntervals) {
      this.pollingIntervals = new Map();
    }
    
    // Start polling
    const interval = setInterval(async () => {
      try {
        await this.checkForNewContent(accessToken, instagramAccountId, automations);
      } catch (error) {
        console.error('Error during polling:', error.message);
      }
    }, this.pollingInterval);
    
    this.pollingIntervals.set(pollKey, interval);
    console.log(`📡 Started polling every ${this.pollingInterval / 1000} seconds`);
  }

  // Check for new content and trigger automations
  async checkForNewContent(accessToken, instagramAccountId, automations) {
    try {
      const instagramApi = new InstagramApiService(accessToken);
      const lastCheck = this.lastCheckTime.get(instagramAccountId) || new Date(0);
      
      console.log(`🔍 Checking for new content since: ${lastCheck.toISOString()}`);
      
      // Get recent media
      const recentMedia = await instagramApi.getInstagramMedia(10);
      
      // Check for new comments
      for (const media of recentMedia) {
        if (new Date(media.timestamp) > lastCheck) {
          await this.checkCommentsForAutomation(instagramApi, media, automations);
        }
      }
      
      // Check for new mentions
      await this.checkMentionsForAutomation(instagramApi, automations, lastCheck);
      
      // Update last check time
      this.lastCheckTime.set(instagramAccountId, new Date());
      
    } catch (error) {
      console.error('Error checking for new content:', error.message);
    }
  }

  // Check comments for automation triggers
  async checkCommentsForAutomation(instagramApi, media, automations) {
    try {
      const comments = await instagramApi.getComments(media.id);
      
      for (const comment of comments) {
        // Find automations that trigger on comments
        const commentAutomations = automations.filter(auto => 
          auto.triggerType === 'comment' || 
          (auto.triggers && auto.triggers.some(t => t.type === 'comment'))
        );
        
        for (const automation of commentAutomations) {
          await this.executeAutomation(automation, {
            type: 'comment',
            comment: comment,
            media: media
          });
        }
      }
    } catch (error) {
      console.error('Error checking comments for automation:', error.message);
    }
  }

  // Check mentions for automation triggers
  async checkMentionsForAutomation(instagramApi, automations, lastCheck) {
    try {
      const mentions = await instagramApi.getMentions();
      
      for (const mention of mentions) {
        if (new Date(mention.timestamp) > lastCheck) {
          // Find automations that trigger on mentions
          const mentionAutomations = automations.filter(auto => 
            auto.triggerType === 'mention' || 
            (auto.triggers && auto.triggers.some(t => t.type === 'mention'))
          );
          
          for (const automation of mentionAutomations) {
            await this.executeAutomation(automation, {
              type: 'mention',
              mention: mention
            });
          }
        }
      }
    } catch (error) {
      console.error('Error checking mentions for automation:', error.message);
    }
  }

  // Execute automation action
  async executeAutomation(automation, triggerData) {
    try {
      console.log(`⚡ Executing automation: ${automation.name}`);
      
      // Determine action to execute
      const action = automation.actionType || (automation.actions && automation.actions[0]?.type);
      
      switch (action) {
        case 'reply_comment':
          await this.replyToComment(automation, triggerData);
          break;
        case 'send_dm':
          await this.sendDirectMessage(automation, triggerData);
          break;
        case 'like_comment':
          await this.likeComment(automation, triggerData);
          break;
        default:
          console.log(`⚠️  Unsupported action type: ${action}`);
      }
      
      // Log automation execution
      await this.logAutomationExecution(automation, triggerData);
      
    } catch (error) {
      console.error('Error executing automation:', error.message);
    }
  }

  // Reply to a comment
  async replyToComment(automation, triggerData) {
    try {
      if (triggerData.type === 'comment' && automation.responseMessage) {
        const instagramApi = new InstagramApiService(automation.accessToken);
        
        // Reply to the comment
        await instagramApi.replyToComment(
          triggerData.comment.id, 
          automation.responseMessage
        );
        
        console.log(`💬 Replied to comment: ${automation.responseMessage}`);
      }
    } catch (error) {
      console.error('Error replying to comment:', error.message);
    }
  }

  // Send direct message (placeholder - requires different API)
  async sendDirectMessage(automation, triggerData) {
    try {
      console.log(`📱 Would send DM: ${automation.responseMessage}`);
      console.log(`📱 Note: Instagram Login doesn't support sending DMs via API`);
      console.log(`📱 Consider using Facebook Login for Business for DM automation`);
    } catch (error) {
      console.error('Error sending DM:', error.message);
    }
  }

  // Like a comment (placeholder - not supported in Instagram API)
  async likeComment(automation, triggerData) {
    try {
      console.log(`👍 Would like comment: ${triggerData.comment.id}`);
      console.log(`👍 Note: Instagram API doesn't support liking comments`);
    } catch (error) {
      console.error('Error liking comment:', error.message);
    }
  }

  // Log automation execution
  async logAutomationExecution(automation, triggerData) {
    try {
      const AutomationLog = require('../models/AutomationLog');
      
      await AutomationLog.create({
        automationId: automation._id,
        triggerType: triggerData.type,
        triggerData: triggerData,
        actionType: automation.actionType,
        responseMessage: automation.responseMessage,
        executedAt: new Date(),
        status: 'success'
      });
      
      console.log(`📝 Logged automation execution: ${automation.name}`);
    } catch (error) {
      console.error('Error logging automation execution:', error.message);
    }
  }

  // Stop polling for an account
  stopPolling(instagramAccountId, accessToken) {
    const pollKey = `${instagramAccountId}_${accessToken}`;
    
    if (this.pollingIntervals && this.pollingIntervals.has(pollKey)) {
      clearInterval(this.pollingIntervals.get(pollKey));
      this.pollingIntervals.delete(pollKey);
      console.log(`🛑 Stopped polling for account: ${instagramAccountId}`);
    }
  }

  // Get polling status
  getPollingStatus(instagramAccountId, accessToken) {
    const pollKey = `${instagramAccountId}_${accessToken}`;
    const isPolling = this.pollingIntervals && this.pollingIntervals.has(pollKey);
    const lastCheck = this.lastCheckTime.get(instagramAccountId);
    
    return {
      isPolling,
      lastCheck: lastCheck ? lastCheck.toISOString() : null,
      pollingInterval: this.pollingInterval / 1000
    };
  }
}

module.exports = new InstagramAutomationService(); 