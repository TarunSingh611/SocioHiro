const AutomationService = require('../services/automationService');
const { requireAuth } = require('../middleware/auth');

// Create new automation
const createAutomation = async (req, res) => {
  try {
    const automationService = new AutomationService(req.user);
    const automation = await automationService.createAutomation(req.body);
    res.status(201).json(automation);
  } catch (error) {
    console.error('Error creating automation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all automations for user
const getAutomations = async (req, res) => {
  try {
    const automationService = new AutomationService(req.user);
    const automations = await automationService.getAutomations();
    res.json(automations);
  } catch (error) {
    console.error('Error getting automations:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get automation by ID
const getAutomation = async (req, res) => {
  try {
    const automationService = new AutomationService(req.user);
    const automation = await automationService.getAutomation(req.params.id);
    res.json(automation);
  } catch (error) {
    console.error('Error getting automation:', error);
    if (error.message === 'Automation not found') {
      res.status(404).json({ error: 'Automation not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Update automation
const updateAutomation = async (req, res) => {
  try {
    const automationService = new AutomationService(req.user);
    const automation = await automationService.updateAutomation(req.params.id, req.body);
    res.json(automation);
  } catch (error) {
    console.error('Error updating automation:', error);
    if (error.message === 'Automation not found') {
      res.status(404).json({ error: 'Automation not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Delete automation
const deleteAutomation = async (req, res) => {
  try {
    const automationService = new AutomationService(req.user);
    await automationService.deleteAutomation(req.params.id);
    res.json({ message: 'Automation deleted successfully' });
  } catch (error) {
    console.error('Error deleting automation:', error);
    if (error.message === 'Automation not found') {
      res.status(404).json({ error: 'Automation not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Toggle automation status
const toggleAutomationStatus = async (req, res) => {
  try {
    const automationService = new AutomationService(req.user);
    const automation = await automationService.toggleAutomationStatus(req.params.id);
    res.json(automation);
  } catch (error) {
    console.error('Error toggling automation status:', error);
    if (error.message === 'Automation not found') {
      res.status(404).json({ error: 'Automation not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Test automation
const testAutomation = async (req, res) => {
  try {
    const automationService = new AutomationService(req.user);
    const result = await automationService.testAutomation(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error testing automation:', error);
    if (error.message === 'Automation not found') {
      res.status(404).json({ error: 'Automation not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Execute automation
const executeAutomation = async (req, res) => {
  try {
    const automationService = new AutomationService(req.user);
    const result = await automationService.executeAutomation(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error executing automation:', error);
    if (error.message === 'Automation not found') {
      res.status(404).json({ error: 'Automation not found' });
    } else if (error.message.includes('cannot be executed') || error.message.includes('conditions not met')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Get automation logs
const getAutomationLogs = async (req, res) => {
  try {
    const automationService = new AutomationService(req.user);
    const automationId = req.query.automationId || null;
    const logs = await automationService.getAutomationLogs(automationId);
    res.json(logs);
  } catch (error) {
    console.error('Error getting automation logs:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get automation statistics
const getAutomationStats = async (req, res) => {
  try {
    const automationService = new AutomationService(req.user);
    const stats = await automationService.getAutomationStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting automation stats:', error);
    res.status(500).json({ error: error.message });
  }
};

// Bulk delete automations
const bulkDeleteAutomations = async (req, res) => {
  try {
    const { automationIds } = req.body;
    
    if (!automationIds || !Array.isArray(automationIds) || automationIds.length === 0) {
      return res.status(400).json({ error: 'automationIds array is required' });
    }

    const automationService = new AutomationService(req.user);
    const result = await automationService.bulkDeleteAutomations(automationIds);
    res.json({ 
      message: `${result.deletedCount} automations deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error bulk deleting automations:', error);
    res.status(500).json({ error: error.message });
  }
};

// Process webhook events
const processWebhookEvent = async (req, res) => {
  try {
    const automationService = new AutomationService(req.user);
    const results = await automationService.processWebhookEvent(req.body);
    res.json({ 
      message: 'Webhook event processed',
      results 
    });
  } catch (error) {
    console.error('Error processing webhook event:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get automation templates
const getAutomationTemplates = async (req, res) => {
  try {
    const templates = [
      {
        id: 'welcome_comment',
        name: 'Welcome Comment Response',
        description: 'Automatically respond to comments with a welcome message',
        triggerType: 'comment',
        actionType: 'send_dm',
        keywords: ['hello', 'hi', 'hey'],
        responseMessage: 'Thanks for commenting! We appreciate your engagement. 😊',
        exactMatch: false,
        caseSensitive: false
      },
      {
        id: 'mention_response',
        name: 'Mention Response',
        description: 'Respond when someone mentions your account',
        triggerType: 'mention',
        actionType: 'send_dm',
        keywords: [],
        responseMessage: 'Thanks for the mention! We love connecting with our community. 💙',
        exactMatch: false,
        caseSensitive: false
      },
      {
        id: 'follow_back',
        name: 'Follow Back',
        description: 'Automatically follow users who follow you',
        triggerType: 'follow',
        actionType: 'follow',
        keywords: [],
        responseMessage: '',
        exactMatch: false,
        caseSensitive: false
      },
      {
        id: 'hashtag_engagement',
        name: 'Hashtag Engagement',
        description: 'Engage with posts using specific hashtags',
        triggerType: 'hashtag',
        actionType: 'like',
        keywords: ['yourbrand', 'yourniche'],
        responseMessage: '',
        exactMatch: false,
        caseSensitive: false
      },
      {
        id: 'customer_support',
        name: 'Customer Support',
        description: 'Provide immediate response to support inquiries',
        triggerType: 'comment',
        actionType: 'send_dm',
        keywords: ['help', 'support', 'question', 'issue'],
        responseMessage: 'Hi! Thanks for reaching out. Our support team will get back to you within 24 hours. In the meantime, you can check our FAQ at [your-website.com/faq]',
        exactMatch: false,
        caseSensitive: false
      }
    ];

    res.json(templates);
  } catch (error) {
    console.error('Error getting automation templates:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create automation from template
const createAutomationFromTemplate = async (req, res) => {
  try {
    const { templateId, customizations = {} } = req.body;
    
    const templates = [
      {
        id: 'welcome_comment',
        name: 'Welcome Comment Response',
        description: 'Automatically respond to comments with a welcome message',
        triggerType: 'comment',
        actionType: 'send_dm',
        keywords: ['hello', 'hi', 'hey'],
        responseMessage: 'Thanks for commenting! We appreciate your engagement. 😊',
        exactMatch: false,
        caseSensitive: false
      },
      {
        id: 'mention_response',
        name: 'Mention Response',
        description: 'Respond when someone mentions your account',
        triggerType: 'mention',
        actionType: 'send_dm',
        keywords: [],
        responseMessage: 'Thanks for the mention! We love connecting with our community. 💙',
        exactMatch: false,
        caseSensitive: false
      },
      {
        id: 'follow_back',
        name: 'Follow Back',
        description: 'Automatically follow users who follow you',
        triggerType: 'follow',
        actionType: 'follow',
        keywords: [],
        responseMessage: '',
        exactMatch: false,
        caseSensitive: false
      },
      {
        id: 'hashtag_engagement',
        name: 'Hashtag Engagement',
        description: 'Engage with posts using specific hashtags',
        triggerType: 'hashtag',
        actionType: 'like',
        keywords: ['yourbrand', 'yourniche'],
        responseMessage: '',
        exactMatch: false,
        caseSensitive: false
      },
      {
        id: 'customer_support',
        name: 'Customer Support',
        description: 'Provide immediate response to support inquiries',
        triggerType: 'comment',
        actionType: 'send_dm',
        keywords: ['help', 'support', 'question', 'issue'],
        responseMessage: 'Hi! Thanks for reaching out. Our support team will get back to you within 24 hours. In the meantime, you can check our FAQ at [your-website.com/faq]',
        exactMatch: false,
        caseSensitive: false
      }
    ];

    const template = templates.find(t => t.id === templateId);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const automationData = {
      ...template,
      ...customizations,
      name: customizations.name || template.name,
      description: customizations.description || template.description,
      keywords: customizations.keywords || template.keywords,
      responseMessage: customizations.responseMessage || template.responseMessage
    };

    const automationService = new AutomationService(req.user);
    const automation = await automationService.createAutomation(automationData);
    
    res.status(201).json(automation);
  } catch (error) {
    console.error('Error creating automation from template:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get automation performance metrics
const getAutomationPerformance = async (req, res) => {
  try {
    const automationService = new AutomationService(req.user);
    const automations = await automationService.getAutomations();
    const logs = await automationService.getAutomationLogs();

    const performance = {
      totalAutomations: automations.length,
      activeAutomations: automations.filter(a => a.isActive).length,
      totalExecutions: logs.length,
      successRate: logs.length > 0 ? (logs.filter(l => l.success).length / logs.length) * 100 : 0,
      averageExecutionsPerDay: 0,
      topPerformingAutomations: [],
      recentActivity: logs.slice(0, 10)
    };

    // Calculate average executions per day
    if (logs.length > 0) {
      const firstLog = logs[logs.length - 1];
      const lastLog = logs[0];
      const daysDiff = (lastLog.executedAt - firstLog.executedAt) / (1000 * 60 * 60 * 24);
      performance.averageExecutionsPerDay = daysDiff > 0 ? logs.length / daysDiff : logs.length;
    }

    // Get top performing automations
    const automationStats = {};
    logs.forEach(log => {
      if (log.automationId) {
        const automationId = log.automationId.toString();
        if (!automationStats[automationId]) {
          automationStats[automationId] = { executions: 0, successes: 0 };
        }
        automationStats[automationId].executions++;
        if (log.success) {
          automationStats[automationId].successes++;
        }
      }
    });

    performance.topPerformingAutomations = Object.entries(automationStats)
      .map(([automationId, stats]) => ({
        automationId,
        executions: stats.executions,
        successes: stats.successes,
        successRate: (stats.successes / stats.executions) * 100
      }))
      .sort((a, b) => b.executions - a.executions)
      .slice(0, 5);

    res.json(performance);
  } catch (error) {
    console.error('Error getting automation performance:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAutomation,
  getAutomations,
  getAutomation,
  updateAutomation,
  deleteAutomation,
  toggleAutomationStatus,
  testAutomation,
  executeAutomation,
  getAutomationLogs,
  getAutomationStats,
  bulkDeleteAutomations,
  processWebhookEvent,
  getAutomationTemplates,
  createAutomationFromTemplate,
  getAutomationPerformance
}; 