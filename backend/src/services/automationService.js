const AutomationRule = require('../models/AutomationRule');
const AutomationLog = require('../models/AutomationLog');
const InstagramApi = require('./instagramApi');
const Content = require('../models/Content');
const instagramWebhookService = require('./instagramWebhookService');

class AutomationService {
  constructor() {
    this.executionCache = new Map(); // Cache to prevent duplicate executions
  }

  // Create a new automation
  async createAutomation(userId, automationData) {
    try {
      const processedData = this.processAutomationData(automationData);
      processedData.userId = userId;
      
      // Handle content association
      if (processedData.contentId) {
        // Link automation to specific content
        processedData.applyToAllContent = false;
        
        // Also update the content to reference this automation
        const Content = require('../models/Content');
        await Content.findByIdAndUpdate(
          processedData.contentId,
          { $addToSet: { automations: processedData._id } }
        );
      } else {
        // Apply to all content
        processedData.applyToAllContent = true;
        processedData.contentId = null;
        processedData.instagramMediaId = null;
      }
      
      const automation = new AutomationRule(processedData);
      await automation.save();
      
      // Populate content information for response
      await automation.populate('contentId', 'instagramId permalink instagramMediaType caption');
      
      // Set up Instagram webhook for this automation
      try {
        
        await instagramWebhookService.ensureWebhookForAutomation(userId, automation);
      } catch (webhookError) {
        console.warn('Webhook setup failed, but automation was created:', webhookError.message);
        // Don't fail the automation creation if webhook setup fails
      }
      
      return automation;
    } catch (error) {
      throw new Error(`Failed to create automation: ${error.message}`);
    }
  }

  // Process automation data to support both legacy and new formats
  processAutomationData(data) {
    const processed = { ...data };
    
    // Convert single trigger to triggers array if needed
    if (data.triggerType && !data.triggers) {
      processed.triggers = [{
        type: data.triggerType,
        keywords: data.keywords || [],
        exactMatch: data.exactMatch || false,
        caseSensitive: data.caseSensitive || false
      }];
    }
    
    // Convert single action to actions array if needed
    if (data.actionType && !data.actions) {
      processed.actions = [{
        type: data.actionType,
        responseMessage: data.responseMessage || '',
        delaySeconds: 0
      }];
    }
    
    // Handle content association
    if (data.contentId) {
      processed.contentId = data.contentId;
      processed.applyToAllContent = false;
    } else {
      processed.applyToAllContent = true;
    }
    
    return processed;
  }

  // Get all automations for a user
  async getAutomations(userId, filters = {}) {
    try {
      const query = { userId };
      
      if (filters.isActive !== undefined) {
        query.isActive = filters.isActive;
      }
      
      if (filters.triggerType) {
        query.$or = [
          { triggerType: filters.triggerType },
          { 'triggers.type': filters.triggerType }
        ];
      }
      
      if (filters.contentId) {
        query.$or = [
          { contentId: filters.contentId },
          { applyToAllContent: true }
        ];
      }
      
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }
      
      const automations = await AutomationRule.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .populate('contentId', 'instagramId permalink instagramMediaType caption mediaUrls')
        .lean();
      
      // Add execution count and last executed info
      const automationsWithStats = await Promise.all(
        automations.map(async (automation) => {
          const executionCount = await AutomationLog.countDocuments({
            ruleId: automation._id
          });
          
          const lastExecution = await AutomationLog.findOne({
            ruleId: automation._id
          }).sort({ executedAt: -1 }).select('executedAt');
          
          return {
            ...automation,
            executionCount,
            lastExecuted: lastExecution?.executedAt
          };
        })
      );
      
      return automationsWithStats;
    } catch (error) {
      throw new Error(`Failed to get automations: ${error.message}`);
    }
  }

  // Get automation by ID
  async getAutomationById(automationId, userId) {
    try {
      const automation = await AutomationRule.findOne({ _id: automationId, userId })
        .populate('contentId', 'instagramId permalink instagramMediaType');
      
      return automation;
    } catch (error) {
      throw new Error(`Failed to get automation: ${error.message}`);
    }
  }

  // Update automation
  async updateAutomation(automationId, userId, updateData) {
    try {
      const processedData = this.processAutomationData(updateData);
      
      const automation = await AutomationRule.findOneAndUpdate(
        { _id: automationId, userId },
        { ...processedData, updatedAt: new Date() },
        { new: true }
      );
      
      // Update webhook fields after automation update
      try {
        const instagramWebhookService = require('./instagramWebhookService');
        await instagramWebhookService.ensureWebhookForAutomation(userId, automation);
      } catch (webhookError) {
        console.warn('Webhook update failed after automation update:', webhookError.message);
        // Don't fail the automation update if webhook update fails
      }
      
      return automation;
    } catch (error) {
      throw new Error(`Failed to update automation: ${error.message}`);
    }
  }

  // Delete automation
  async deleteAutomation(automationId, userId) {
    try {
      // Get the automation before deleting to check if we need to update webhooks
      const automation = await AutomationRule.findOne({ _id: automationId, userId });
      
      await AutomationRule.findOneAndDelete({ _id: automationId, userId });
      
      // Update webhook fields after automation deletion
      try {
        const instagramWebhookService = require('./instagramWebhookService');
        await instagramWebhookService.updateWebhookFieldsAfterAutomationChange(userId);
      } catch (webhookError) {
        console.warn('Webhook update failed after automation deletion:', webhookError.message);
        // Don't fail the automation deletion if webhook update fails
      }
      
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete automation: ${error.message}`);
    }
  }

  // Toggle automation status
  async toggleAutomationStatus(automationId, userId) {
    try {
      const automation = await AutomationRule.findOne({ _id: automationId, userId });
      if (!automation) {
        throw new Error('Automation not found');
      }
      
      automation.isActive = !automation.isActive;
      automation.updatedAt = new Date();
      await automation.save();
      
      // Update webhook fields after status toggle
      try {
        const instagramWebhookService = require('./instagramWebhookService');
        await instagramWebhookService.updateWebhookFieldsAfterAutomationChange(userId);
      } catch (webhookError) {
        console.warn('Webhook update failed after automation status toggle:', webhookError.message);
        // Don't fail the status toggle if webhook update fails
      }
      
      return automation;
    } catch (error) {
      throw new Error(`Failed to toggle automation: ${error.message}`);
    }
  }

  // Process Instagram comment events
  async processComment(commentData, instagramAccountId) {
    try {
      console.log(`Processing comment automation for: ${commentData.text}`);
      
      // Get all active comment automations for this account
      const automations = await AutomationRule.find({
        userId: await this.getUserIdFromInstagramAccount(instagramAccountId),
        triggerType: 'comment',
        isActive: true,
        $or: [
          { applyToAllContent: true },
          { instagramMediaId: commentData.media_id }
        ]
      });
      
      // Process each automation
      for (const automation of automations) {
        await this.checkAndExecuteAutomation(automation, {
          triggerType: 'comment',
          triggerText: commentData.text,
          triggerIndex: 0, // First trigger
          userId: commentData.from.id,
          username: commentData.from.username,
          mediaId: commentData.media_id,
          commentId: commentData.id,
          timestamp: commentData.timestamp
        });
      }
    } catch (error) {
      console.error('Error processing comment automation:', error);
    }
  }

  // Process Instagram mention events
  async processMention(mentionData, instagramAccountId) {
    try {
      console.log(`Processing mention automation for: ${mentionData.text}`);
      
      // Get all active mention automations for this account
      const automations = await AutomationRule.find({
        userId: await this.getUserIdFromInstagramAccount(instagramAccountId),
        triggerType: 'mention',
        isActive: true,
        $or: [
          { applyToAllContent: true },
          { instagramMediaId: mentionData.media_id }
        ]
      });
      
      // Process each automation
      for (const automation of automations) {
        await this.checkAndExecuteAutomation(automation, {
          triggerType: 'mention',
          triggerText: mentionData.text,
          triggerIndex: 0,
          userId: mentionData.from.id,
          username: mentionData.from.username,
          mediaId: mentionData.media_id,
          mentionId: mentionData.id,
          timestamp: mentionData.timestamp
        });
      }
    } catch (error) {
      console.error('Error processing mention automation:', error);
    }
  }

  // Process Instagram direct message events
  async processDirectMessage(messageData, instagramAccountId) {
    try {
      console.log(`Processing DM automation for: ${messageData.text}`);
      
      // Get all active DM automations for this account
      const automations = await AutomationRule.find({
        userId: await this.getUserIdFromInstagramAccount(instagramAccountId),
        triggerType: 'dm',
        isActive: true
      });
      
      // Process each automation
      for (const automation of automations) {
        await this.checkAndExecuteAutomation(automation, {
          triggerType: 'dm',
          triggerText: messageData.text,
          triggerIndex: 0,
          userId: messageData.from.id,
          username: messageData.from.username,
          messageId: messageData.id,
          timestamp: messageData.timestamp
        });
      }
    } catch (error) {
      console.error('Error processing DM automation:', error);
    }
  }

  // Process Instagram follow events
  async processFollow(followData, instagramAccountId) {
    try {
      console.log(`Processing follow automation for user: ${followData.from.id}`);
      
      // Get all active follow automations for this account
      const automations = await AutomationRule.find({
        userId: await this.getUserIdFromInstagramAccount(instagramAccountId),
        triggerType: 'follow',
        isActive: true
      });
      
      // Process each automation
      for (const automation of automations) {
        await this.checkAndExecuteAutomation(automation, {
          triggerType: 'follow',
          triggerText: 'follow',
          triggerIndex: 0,
          userId: followData.from.id,
          username: followData.from.username,
          followId: followData.id,
          timestamp: followData.timestamp
        });
      }
    } catch (error) {
      console.error('Error processing follow automation:', error);
    }
  }

  // Process Instagram like events
  async processLike(likeData, instagramAccountId) {
    try {
      console.log(`Processing like automation for media: ${likeData.media_id}`);
      
      // Get all active like automations for this account
      const automations = await AutomationRule.find({
        userId: await this.getUserIdFromInstagramAccount(instagramAccountId),
        triggerType: 'like',
        isActive: true,
        $or: [
          { applyToAllContent: true },
          { instagramMediaId: likeData.media_id }
        ]
      });
      
      // Process each automation
      for (const automation of automations) {
        await this.checkAndExecuteAutomation(automation, {
          triggerType: 'like',
          triggerText: 'like',
          triggerIndex: 0,
          userId: likeData.from.id,
          username: likeData.from.username,
          mediaId: likeData.media_id,
          likeId: likeData.id,
          timestamp: likeData.timestamp
        });
      }
    } catch (error) {
      console.error('Error processing like automation:', error);
    }
  }

  // Check if automation should be executed and execute it
  async checkAndExecuteAutomation(automation, triggerData) {
    try {
      // Check if automation can execute
      if (!automation.canExecute()) {
        return;
      }
      
      // Check if text matches keywords
      if (!automation.matchesKeywords(triggerData.triggerText, triggerData.triggerIndex)) {
        return;
      }
      
      // Check user restrictions
      if (automation.conditions.excludeUsers && automation.conditions.excludeUsers.includes(triggerData.userId)) {
        return;
      }
      
      if (automation.conditions.includeUsers && automation.conditions.includeUsers.length > 0) {
        if (!automation.conditions.includeUsers.includes(triggerData.userId)) {
          return;
        }
      }
      
      // Check cooldown
      const cacheKey = `${automation._id}_${triggerData.userId}`;
      const lastExecution = this.executionCache.get(cacheKey);
      const now = Date.now();
      
      if (lastExecution && (now - lastExecution) < (automation.cooldownMinutes * 60 * 1000)) {
        return;
      }
      
      // Check user execution limit
      const userExecutionCount = await AutomationLog.countDocuments({
        ruleId: automation._id,
        senderId: triggerData.userId,
        executedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
      });
      
      if (userExecutionCount >= automation.maxExecutionsPerUser) {
        return;
      }
      
      // Execute all actions for this automation
      const actions = automation.getAllActions();
      for (const action of actions) {
        await this.executeAction(automation, action, triggerData);
      }
      
      // Update cache
      this.executionCache.set(cacheKey, now);
      
    } catch (error) {
      console.error('Error checking automation:', error);
    }
  }

  // Execute a single action
  async executeAction(automation, action, triggerData) {
    try {
      let success = false;
      let errorMessage = '';
      
      // Add delay if specified
      if (action.delaySeconds > 0) {
        await new Promise(resolve => setTimeout(resolve, action.delaySeconds * 1000));
      }
      
      switch (action.type) {
        case 'send_dm':
          success = await this.sendDirectMessage(automation, action, triggerData);
          break;
        case 'like_comment':
          success = await this.likeComment(automation, action, triggerData);
          break;
        case 'reply_comment':
          success = await this.replyToComment(automation, action, triggerData);
          break;
        case 'follow_user':
          success = await this.followUser(automation, action, triggerData);
          break;
        case 'send_story_reply':
          success = await this.sendStoryReply(automation, action, triggerData);
          break;
        default:
          errorMessage = 'Unknown action type';
      }
      
      // Log execution
      await this.logAutomationExecution(automation, triggerData, success, errorMessage, action);
      
      // Update automation stats
      automation.executionCount += 1;
      automation.lastExecuted = new Date();
      await automation.save();
      
      return success;
    } catch (error) {
      console.error('Error executing action:', error);
      await this.logAutomationExecution(automation, triggerData, false, error.message, action);
      return false;
    }
  }

  // Legacy method for backward compatibility
  async executeAutomation(automation, triggerData) {
    const actions = automation.getAllActions();
    if (actions.length === 0) return false;
    
    return await this.executeAction(automation, actions[0], triggerData);
  }

  // Send direct message
  async sendDirectMessage(automation, action, triggerData) {
    try {
      const message = action.responseMessage || automation.responseMessage;
      if (!message) {
        throw new Error('No response message configured');
      }
      
      // Call Instagram API to send DM
      const result = await InstagramApi.sendDirectMessage(
        triggerData.userId,
        message,
        automation.instagramAccountId
      );
      
      return result.success;
    } catch (error) {
      console.error('Error sending DM:', error);
      return false;
    }
  }

  // Like comment
  async likeComment(automation, action, triggerData) {
    try {
      if (!triggerData.commentId) {
        throw new Error('No comment ID provided');
      }
      
      // Call Instagram API to like comment
      const result = await InstagramApi.likeComment(
        triggerData.commentId,
        automation.instagramAccountId
      );
      
      return result.success;
    } catch (error) {
      console.error('Error liking comment:', error);
      return false;
    }
  }

  // Reply to comment
  async replyToComment(automation, action, triggerData) {
    try {
      const message = action.responseMessage || automation.responseMessage;
      if (!message) {
        throw new Error('No response message configured');
      }
      
      if (!triggerData.commentId) {
        throw new Error('No comment ID provided');
      }
      
      // Call Instagram API to reply to comment
      const result = await InstagramApi.replyToComment(
        triggerData.commentId,
        message,
        automation.instagramAccountId
      );
      
      return result.success;
    } catch (error) {
      console.error('Error replying to comment:', error);
      return false;
    }
  }

  // Follow user
  async followUser(automation, action, triggerData) {
    try {
      // Call Instagram API to follow user
      const result = await InstagramApi.followUser(
        triggerData.userId,
        automation.instagramAccountId
      );
      
      return result.success;
    } catch (error) {
      console.error('Error following user:', error);
      return false;
    }
  }

  // Send story reply
  async sendStoryReply(automation, action, triggerData) {
    try {
      const message = action.responseMessage || automation.responseMessage;
      if (!message) {
        throw new Error('No response message configured');
      }
      
      // Call Instagram API to send story reply
      const result = await InstagramApi.sendStoryReply(
        triggerData.userId,
        message,
        automation.instagramAccountId
      );
      
      return result.success;
    } catch (error) {
      console.error('Error sending story reply:', error);
      return false;
    }
  }

  // Log automation execution
  async logAutomationExecution(automation, triggerData, success, errorMessage = '', action = null) {
    try {
      const log = new AutomationLog({
        userId: automation.userId,
        ruleId: automation._id,
        triggerType: triggerData.triggerType,
        triggerText: triggerData.triggerText,
        senderId: triggerData.userId,
        responseMessage: action?.responseMessage || automation.responseMessage,
        executedAt: new Date(),
        success,
        errorMessage,
        actionType: action?.type || automation.actionType
      });
      
      await log.save();
    } catch (error) {
      console.error('Error logging automation execution:', error);
    }
  }

  // Get automation statistics
  async getAutomationStats(userId) {
    try {
      const stats = await AutomationRule.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: null,
            totalAutomations: { $sum: 1 },
            activeAutomations: { $sum: { $cond: ['$isActive', 1, 0] } },
            totalExecutions: { $sum: '$executionCount' }
          }
        }
      ]);
      
      const successfulExecutions = await AutomationLog.countDocuments({
        userId: userId,
        success: true
      });
      
      return {
        totalAutomations: stats[0]?.totalAutomations || 0,
        activeAutomations: stats[0]?.activeAutomations || 0,
        totalExecutions: stats[0]?.totalExecutions || 0,
        successfulExecutions
      };
    } catch (error) {
      throw new Error(`Failed to get automation stats: ${error.message}`);
    }
  }

  // Get automation logs
  async getAutomationLogs(userId, filters = {}) {
    try {
      const query = { userId };
      
      if (filters.ruleId) {
        query.ruleId = filters.ruleId;
      }
      
      if (filters.success !== undefined) {
        query.success = filters.success;
      }
      
      const logs = await AutomationLog.find(query)
        .sort({ executedAt: -1 })
        .limit(filters.limit || 50);
      
      return logs;
    } catch (error) {
      throw new Error(`Failed to get automation logs: ${error.message}`);
    }
  }

  // Test automation
  async testAutomation(automationId, userId, testData) {
    try {
      const automation = await this.getAutomationById(automationId, userId);
      if (!automation) {
        throw new Error('Automation not found');
      }
      
      // Execute automation with test data
      const result = await this.checkAndExecuteAutomation(automation, {
        ...testData,
        triggerIndex: 0
      });
      
      return { success: true, result };
    } catch (error) {
      throw new Error(`Failed to test automation: ${error.message}`);
    }
  }

  // Helper method to get user ID from Instagram account ID
  async getUserIdFromInstagramAccount(instagramAccountId) {
    try {
      // This would typically query your database to find the user who owns this Instagram account
      // For now, we'll use a simple mapping or query
      const User = require('../models/User');
      const user = await User.findOne({ 
        'instagramAccounts.instagramAccountId': instagramAccountId 
      });
      
      return user?._id;
    } catch (error) {
      console.error('Error getting user ID from Instagram account:', error);
      return null;
    }
  }

  // Get active automations for a user
  async getActiveAutomations(userId) {
    try {
      const automations = await AutomationRule.find({
        userId: userId,
        isActive: true
      }).select('triggerType actionType');
      
      return automations;
    } catch (error) {
      console.error('Error getting active automations:', error);
      return [];
    }
  }
}

module.exports = new AutomationService(); 