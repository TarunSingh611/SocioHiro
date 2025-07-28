const automationService = require('../services/automationService');
const { requireAuth } = require('../middleware/auth');

// Get all automations for the authenticated user
const getAutomations = async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = {
      isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
      triggerType: req.query.triggerType,
      contentId: req.query.contentId,
      tags: req.query.tags ? req.query.tags.split(',') : undefined
    };

    const automations = await automationService.getAutomations(userId, filters);
    res.json(automations);
  } catch (error) {
    console.error('Error getting automations:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get automation by ID
const getAutomationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const automationId = req.params.id;

    const automation = await automationService.getAutomationById(automationId, userId);
    if (!automation) {
      return res.status(404).json({ error: 'Automation not found' });
    }

    res.json(automation);
  } catch (error) {
    console.error('Error getting automation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create new automation
const createAutomation = async (req, res) => {
  try {
    const userId = req.user.id;
    const automationData = req.body;

    // Enhanced validation
    if (!automationData.name || automationData.name.trim().length < 3) {
      return res.status(400).json({ error: 'Automation name must be at least 3 characters' });
    }

    // Validate trigger and action
    if (!automationData.triggerType && (!automationData.triggers || automationData.triggers.length === 0)) {
      return res.status(400).json({ error: 'At least one trigger must be specified' });
    }

    if (!automationData.actionType && (!automationData.actions || automationData.actions.length === 0)) {
      return res.status(400).json({ error: 'At least one action must be specified' });
    }

    // Validate response message for actions that require it
    const messageRequiredActions = ['send_dm', 'reply_comment', 'send_story_reply'];
    const actions = automationData.actions || [{ type: automationData.actionType }];
    const hasMessageAction = actions.some(action => messageRequiredActions.includes(action.type));
    
    if (hasMessageAction && (!automationData.responseMessage || automationData.responseMessage.trim().length < 5)) {
      return res.status(400).json({ error: 'Response message is required and must be at least 5 characters for message-based actions' });
    }

    const automation = await automationService.createAutomation(userId, automationData);
    res.status(201).json(automation);
  } catch (error) {
    console.error('Error creating automation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update automation
const updateAutomation = async (req, res) => {
  try {
    const userId = req.user.id;
    const automationId = req.params.id;
    const updateData = req.body;

    // Enhanced validation for updates
    if (updateData.name && updateData.name.trim().length < 3) {
      return res.status(400).json({ error: 'Automation name must be at least 3 characters' });
    }

    const automation = await automationService.updateAutomation(automationId, userId, updateData);
    if (!automation) {
      return res.status(404).json({ error: 'Automation not found' });
    }

    res.json(automation);
  } catch (error) {
    console.error('Error updating automation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete automation
const deleteAutomation = async (req, res) => {
  try {
    const userId = req.user.id;
    const automationId = req.params.id;

    await automationService.deleteAutomation(automationId, userId);
    res.json({ success: true, message: 'Automation deleted successfully' });
  } catch (error) {
    console.error('Error deleting automation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Toggle automation status
const toggleAutomationStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const automationId = req.params.id;

    const automation = await automationService.toggleAutomationStatus(automationId, userId);
    res.json(automation);
  } catch (error) {
    console.error('Error toggling automation status:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get automation statistics
const getAutomationStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await automationService.getAutomationStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Error getting automation stats:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get automation logs
const getAutomationLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = {
      ruleId: req.query.ruleId,
      success: req.query.success !== undefined ? req.query.success === 'true' : undefined,
      limit: parseInt(req.query.limit) || 50
    };

    const logs = await automationService.getAutomationLogs(userId, filters);
    res.json(logs);
  } catch (error) {
    console.error('Error getting automation logs:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get content for automation
const getContentForAutomation = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // This would typically fetch content from the content service
    // For now, we'll return a mock response
    const content = [
      {
        _id: 'content_1',
        instagramId: '17841405793087218',
        caption: 'Sample post 1',
        mediaType: 'IMAGE',
        instagramMediaId: '17841405793087218'
      },
      {
        _id: 'content_2',
        instagramId: '17841405793087219',
        caption: 'Sample post 2',
        mediaType: 'VIDEO',
        instagramMediaId: '17841405793087219'
      }
    ];
    
    res.json(content);
  } catch (error) {
    console.error('Error getting content for automation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Test automation
const testAutomation = async (req, res) => {
  try {
    const userId = req.user.id;
    const automationId = req.params.id;
    const testData = req.body;

    // Validate test data
    if (!testData.triggerType) {
      return res.status(400).json({ error: 'Trigger type is required for testing' });
    }

    const result = await automationService.testAutomation(automationId, userId, testData);
    res.json(result);
  } catch (error) {
    console.error('Error testing automation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Bulk update automations
const bulkUpdateAutomations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { automationIds, updates } = req.body;

    if (!automationIds || !Array.isArray(automationIds) || automationIds.length === 0) {
      return res.status(400).json({ error: 'Automation IDs array is required' });
    }

    const results = [];
    for (const automationId of automationIds) {
      try {
        const automation = await automationService.updateAutomation(automationId, userId, updates);
        results.push({ id: automationId, success: true, automation });
      } catch (error) {
        results.push({ id: automationId, success: false, error: error.message });
      }
    }

    res.json({ results });
  } catch (error) {
    console.error('Error bulk updating automations:', error);
    res.status(500).json({ error: error.message });
  }
};

// Bulk delete automations
const bulkDeleteAutomations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { automationIds } = req.body;

    if (!automationIds || !Array.isArray(automationIds) || automationIds.length === 0) {
      return res.status(400).json({ error: 'Automation IDs array is required' });
    }

    const results = [];
    for (const automationId of automationIds) {
      try {
        await automationService.deleteAutomation(automationId, userId);
        results.push({ id: automationId, success: true });
      } catch (error) {
        results.push({ id: automationId, success: false, error: error.message });
      }
    }

    res.json({ results });
  } catch (error) {
    console.error('Error bulk deleting automations:', error);
    res.status(500).json({ error: error.message });
  }
};

// Export automation template
const exportAutomationTemplate = async (req, res) => {
  try {
    const template = {
      name: 'Sample Automation',
      description: 'Automated response for comments',
      triggerType: 'comment',
      actionType: 'send_dm',
      keywords: ['question', 'help', 'support'],
      responseMessage: 'Thank you for your comment! We\'ll get back to you soon.',
      exactMatch: false,
      caseSensitive: false,
      isActive: true,
      cooldownMinutes: 5,
      maxExecutionsPerUser: 1,
      conditions: {
        maxExecutionsPerDay: 10,
        timeOfDay: {
          start: '09:00',
          end: '17:00'
        },
        daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
        requireVerifiedUser: false
      }
    };

    res.json(template);
  } catch (error) {
    console.error('Error exporting automation template:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get automation analytics
const getAutomationAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30d' } = req.query;

    // This would typically fetch analytics data
    // For now, we'll return mock data
    const analytics = {
      totalExecutions: 150,
      successfulExecutions: 142,
      failedExecutions: 8,
      averageResponseTime: 2.5,
      topTriggers: [
        { trigger: 'comment', count: 85 },
        { trigger: 'dm', count: 45 },
        { trigger: 'mention', count: 20 }
      ],
      topActions: [
        { action: 'send_dm', count: 90 },
        { action: 'like_comment', count: 35 },
        { action: 'reply_comment', count: 25 }
      ],
      dailyExecutions: [
        { date: '2024-01-01', count: 5 },
        { date: '2024-01-02', count: 8 },
        { date: '2024-01-03', count: 12 }
      ]
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error getting automation analytics:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAutomations,
  getAutomationById,
  createAutomation,
  updateAutomation,
  deleteAutomation,
  toggleAutomationStatus,
  getAutomationStats,
  getAutomationLogs,
  getContentForAutomation,
  testAutomation,
  bulkUpdateAutomations,
  bulkDeleteAutomations,
  exportAutomationTemplate,
  getAutomationAnalytics
}; 