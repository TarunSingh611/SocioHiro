const AutomationRule = require('../models/AutomationRule');
const AutomationLog = require('../models/AutomationLog');
const Content = require('../models/Content');
const InstagramApiService = require('./instagramApi');

class AutomationService {
  constructor(user) {
    this.user = user;
    this.instagramApi = new InstagramApiService(user.accessToken);
  }

  // Create new automation
  async createAutomation(automationData) {
    try {
      const automation = new AutomationRule({
        userId: this.user._id,
        name: automationData.name,
        description: automationData.description,
        triggerType: automationData.triggerType,
        actionType: automationData.actionType,
        keywords: automationData?.keywords,
        responseMessage: automationData.responseMessage,
        exactMatch: automationData.exactMatch || false,
        caseSensitive: automationData.caseSensitive || false,
        isActive: automationData.isActive !== false,
        conditions: {
          maxExecutionsPerDay: automationData.conditions?.maxExecutionsPerDay || 10,
          cooldownMinutes: automationData.conditions?.cooldownMinutes || 5,
          maxExecutionsPerUser: automationData.conditions?.maxExecutionsPerUser || 1
        },
        executionCount: 0,
        lastExecuted: null,
        createdAt: new Date()
      });

      await automation.save();
      return automation;
    } catch (error) {
      console.error('Error creating automation:', error);
      throw error;
    }
  }

  // Update automation
  async updateAutomation(automationId, updateData) {
    try {
      const automation = await AutomationRule.findOneAndUpdate(
        { _id: automationId, userId: this.user._id },
        {
          ...updateData,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!automation) {
        throw new Error('Automation not found');
      }

      return automation;
    } catch (error) {
      console.error('Error updating automation:', error);
      throw error;
    }
  }

  // Delete automation
  async deleteAutomation(automationId) {
    try {
      const automation = await AutomationRule.findOneAndDelete({
        _id: automationId,
        userId: this.user._id
      });

      if (!automation) {
        throw new Error('Automation not found');
      }

      // Also delete related logs
      await AutomationLog.deleteMany({ automationId });

      return automation;
    } catch (error) {
      console.error('Error deleting automation:', error);
      throw error;
    }
  }

  // Get all automations for user
  async getAutomations() {
    try {
      const automations = await AutomationRule.find({ userId: this.user._id })
        .sort({ createdAt: -1 });
      return automations;
    } catch (error) {
      console.error('Error getting automations:', error);
      throw error;
    }
  }

  // Get automation by ID
  async getAutomation(automationId) {
    try {
      const automation = await AutomationRule.findOne({
        _id: automationId,
        userId: this.user._id
      });

      if (!automation) {
        throw new Error('Automation not found');
      }

      return automation;
    } catch (error) {
      console.error('Error getting automation:', error);
      throw error;
    }
  }

  // Toggle automation status
  async toggleAutomationStatus(automationId) {
    try {
      const automation = await AutomationRule.findOne({
        _id: automationId,
        userId: this.user._id
      });

      if (!automation) {
        throw new Error('Automation not found');
      }

      automation.isActive = !automation.isActive;
      automation.updatedAt = new Date();
      await automation.save();

      return automation;
    } catch (error) {
      console.error('Error toggling automation status:', error);
      throw error;
    }
  }

  // Test automation
  async testAutomation(automationId, testData) {
    try {
      const automation = await this.getAutomation(automationId);
      
      // Check if automation can be executed
      const canExecute = await this.canExecuteAutomation(automation, testData);
      
      // Check if trigger conditions are met
      const matched = this.checkTriggerConditions(automation, testData);
      
      return {
        automationId,
        matched,
        canExecute,
        reason: canExecute ? 'Ready to execute' : 'Cannot execute due to conditions'
      };
    } catch (error) {
      console.error('Error testing automation:', error);
      throw error;
    }
  }

  // Execute automation
  async executeAutomation(automationId, triggerData) {
    try {
      const automation = await this.getAutomation(automationId);
      
      // Check if automation can be executed
      const canExecute = await this.canExecuteAutomation(automation, triggerData);
      if (!canExecute) {
        throw new Error('Automation cannot be executed due to conditions');
      }

      // Check if trigger conditions are met
      const matched = this.checkTriggerConditions(automation, triggerData);
      if (!matched) {
        throw new Error('Trigger conditions not met');
      }

      // Execute the action
      const result = await this.executeAction(automation, triggerData);
      
      // Update automation stats
      automation.executionCount += 1;
      automation.lastExecuted = new Date();
      await automation.save();

      // Log the execution
      await this.logExecution(automation, triggerData, result);

      return result;
    } catch (error) {
      console.error('Error executing automation:', error);
      throw error;
    }
  }

  // Check if automation can be executed
  async canExecuteAutomation(automation, triggerData) {
    try {
      // Check if automation is active
      if (!automation.isActive) {
        return false;
      }

      // Check daily execution limit
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayExecutions = await AutomationLog.countDocuments({
        automationId: automation._id,
        executedAt: { $gte: today }
      });

      if (todayExecutions >= automation.conditions.maxExecutionsPerDay) {
        return false;
      }

      // Check cooldown period
      if (automation.lastExecuted) {
        const cooldownMs = automation.conditions.cooldownMinutes * 60 * 1000;
        const timeSinceLastExecution = Date.now() - automation.lastExecuted.getTime();
        
        if (timeSinceLastExecution < cooldownMs) {
          return false;
        }
      }

      // Check per-user execution limit
      const userExecutions = await AutomationLog.countDocuments({
        automationId: automation._id,
        'triggerData.userId': triggerData.userId,
        executedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
      });

      if (userExecutions >= automation.conditions.maxExecutionsPerUser) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking automation execution:', error);
      return false;
    }
  }

  // Check trigger conditions
  checkTriggerConditions(automation, triggerData) {
    try {
      const triggers = automation.getAllTriggers();
      
      for (const trigger of triggers) {
        switch (trigger.type) {
          case 'comment':
            if (this.checkCommentTrigger(automation, triggerData, trigger)) return true;
            break;
          case 'mention':
            if (this.checkMentionTrigger(automation, triggerData, trigger)) return true;
            break;
          case 'like':
            if (this.checkLikeTrigger(automation, triggerData, trigger)) return true;
            break;
          case 'follow':
            if (this.checkFollowTrigger(automation, triggerData, trigger)) return true;
            break;
          case 'hashtag':
            if (this.checkHashtagTrigger(automation, triggerData, trigger)) return true;
            break;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking trigger conditions:', error);
      return false;
    }
  }

  // Check comment trigger
  checkCommentTrigger(automation, triggerData, trigger) {
    const commentText = triggerData.text || '';
    const keywords = trigger.keywords || [];

    if (keywords.length === 0) {
      return true; // No keywords specified, trigger on all comments
    }

    for (const keyword of keywords) {
      if (trigger.exactMatch) {
        if (trigger.caseSensitive) {
          if (commentText === keyword) return true;
        } else {
          if (commentText.toLowerCase() === keyword.toLowerCase()) return true;
        }
      } else {
        if (trigger.caseSensitive) {
          if (commentText.includes(keyword)) return true;
        } else {
          if (commentText.toLowerCase().includes(keyword.toLowerCase())) return true;
        }
      }
    }

    return false;
  }

  // Check mention trigger
  checkMentionTrigger(automation, triggerData, trigger) {
    const text = triggerData.text || '';
    const username = this.user.username || '';
    
    // Check if user is mentioned
    const mentionPattern = new RegExp(`@${username}`, 'i');
    return mentionPattern.test(text);
  }

  // Check like trigger
  checkLikeTrigger(automation, triggerData, trigger) {
    // Trigger on any like
    return triggerData.type === 'like';
  }

  // Check follow trigger
  checkFollowTrigger(automation, triggerData, trigger) {
    // Trigger on any follow
    return triggerData.type === 'follow';
  }

  // Check hashtag trigger
  checkHashtagTrigger(automation, triggerData, trigger) {
    const text = triggerData.text || '';
    const keywords = trigger.keywords || [];

    for (const keyword of keywords) {
      const hashtagPattern = new RegExp(`#${keyword}`, 'i');
      if (hashtagPattern.test(text)) {
        return true;
      }
    }

    return false;
  }

  // Execute automation action
  async executeAction(automation, triggerData) {
    try {
      const actions = automation.getAllActions();
      
      for (const action of actions) {
        switch (action.type) {
          case 'send_dm':
            return await this.sendDirectMessage(automation, triggerData, action);
          case 'reply_comment':
            return await this.postComment(automation, triggerData, action);
          case 'like_comment':
            return await this.likePost(automation, triggerData, action);
          case 'follow_user':
            return await this.followUser(automation, triggerData, action);
          case 'send_story_reply':
            return await this.sendDirectMessage(automation, triggerData, action);
          default:
            throw new Error(`Unknown action type: ${action.type}`);
        }
      }
      
      throw new Error('No actions found for automation');
    } catch (error) {
      console.error('Error executing automation action:', error);
      throw error;
    }
  }

  // Send direct message
  async sendDirectMessage(automation, triggerData, action) {
    try {
      // This would require Instagram Graph API permissions
      // For now, we'll simulate the action
      const result = {
        action: 'send_dm',
        targetUserId: triggerData.userId,
        message: action.responseMessage || automation.responseMessage,
        success: true,
        timestamp: new Date()
      };

      return result;
    } catch (error) {
      console.error('Error sending direct message:', error);
      throw error;
    }
  }

  // Post comment
  async postComment(automation, triggerData, action) {
    try {
      // This would require Instagram Graph API permissions
      const result = {
        action: 'comment',
        postId: triggerData.postId,
        comment: action.responseMessage || automation.responseMessage,
        success: true,
        timestamp: new Date()
      };

      return result;
    } catch (error) {
      console.error('Error posting comment:', error);
      throw error;
    }
  }

  // Like post
  async likePost(automation, triggerData, action) {
    try {
      const result = {
        action: 'like',
        postId: triggerData.postId,
        success: true,
        timestamp: new Date()
      };

      return result;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  // Follow user
  async followUser(automation, triggerData, action) {
    try {
      const result = {
        action: 'follow',
        targetUserId: triggerData.userId,
        success: true,
        timestamp: new Date()
      };

      return result;
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  // Save post
  async savePost(automation, triggerData, action) {
    try {
      const result = {
        action: 'save_post',
        postId: triggerData.postId,
        success: true,
        timestamp: new Date()
      };

      return result;
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    }
  }

  // Execute custom action
  async executeCustomAction(automation, triggerData) {
    try {
      // Custom action logic can be implemented here
      const result = {
        action: 'custom_action',
        customData: automation.responseMessage,
        success: true,
        timestamp: new Date()
      };

      return result;
    } catch (error) {
      console.error('Error executing custom action:', error);
      throw error;
    }
  }

  // Log automation execution
  async logExecution(automation, triggerData, result) {
    try {
      const triggers = automation.getAllTriggers();
      const actions = automation.getAllActions();
      
      const log = new AutomationLog({
        automationId: automation._id,
        userId: this.user._id,
        triggerType: triggers.length > 0 ? triggers[0].type : automation.triggerType,
        actionType: actions.length > 0 ? actions[0].type : automation.actionType,
        triggerData,
        result,
        executedAt: new Date(),
        success: result.success
      });

      await log.save();
      return log;
    } catch (error) {
      console.error('Error logging automation execution:', error);
      // Don't throw error for logging failures
    }
  }

  // Get automation logs
  async getAutomationLogs(automationId = null) {
    try {
      const query = { userId: this.user._id };
      if (automationId) {
        query.automationId = automationId;
      }

      const logs = await AutomationLog.find(query)
        .populate('automationId', 'name triggerType actionType')
        .sort({ executedAt: -1 })
        .limit(100);

      return logs;
    } catch (error) {
      console.error('Error getting automation logs:', error);
      throw error;
    }
  }

  // Get automation statistics
  async getAutomationStats() {
    try {
      const automations = await AutomationRule.find({ userId: this.user._id });
      const logs = await AutomationLog.find({ userId: this.user._id });

      const stats = {
        totalAutomations: automations.length,
        activeAutomations: automations.filter(a => a.isActive).length,
        totalExecutions: logs.length,
        successfulExecutions: logs.filter(l => l.success).length,
        failedExecutions: logs.filter(l => !l.success).length,
        avgExecutionTime: 0,
        topTriggers: {},
        recentExecutions: logs.slice(0, 10)
      };

      // Calculate average execution time
      const executionTimes = logs
        .filter(l => l.executionTime)
        .map(l => l.executionTime);
      
      if (executionTimes.length > 0) {
        stats.avgExecutionTime = executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length;
      }

      // Count trigger types
      automations.forEach(automation => {
        const triggers = automation.getAllTriggers();
        if (triggers.length > 0) {
          const triggerType = triggers[0].type;
          stats.topTriggers[triggerType] = (stats.topTriggers[triggerType] || 0) + 1;
        } else if (automation.triggerType) {
          stats.topTriggers[automation.triggerType] = (stats.topTriggers[automation.triggerType] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting automation stats:', error);
      throw error;
    }
  }

  // Bulk delete automations
  async bulkDeleteAutomations(automationIds) {
    try {
      const result = await AutomationRule.deleteMany({
        _id: { $in: automationIds },
        userId: this.user._id
      });

      // Also delete related logs
      await AutomationLog.deleteMany({
        automationId: { $in: automationIds }
      });

      return result;
    } catch (error) {
      console.error('Error bulk deleting automations:', error);
      throw error;
    }
  }

  // Process webhook events
  async processWebhookEvent(eventData) {
    try {
      const activeAutomations = await AutomationRule.find({
        userId: this.user._id,
        isActive: true
      });

      const results = [];

      for (const automation of activeAutomations) {
        try {
          // Check if automation should be triggered
          const matched = this.checkTriggerConditions(automation, eventData);
          
          if (matched) {
            const result = await this.executeAutomation(automation._id, eventData);
            results.push({
              automationId: automation._id,
              automationName: automation.name,
              success: true,
              result
            });
          }
        } catch (error) {
          console.error(`Error processing automation ${automation._id}:`, error);
          results.push({
            automationId: automation._id,
            automationName: automation.name,
            success: false,
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error processing webhook event:', error);
      throw error;
    }
  }
}

module.exports = AutomationService; 