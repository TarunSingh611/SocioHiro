const automationService = require('./automationService');

// Helper function to check if user meets automation conditions
const checkUserConditions = async (automation, triggerData) => {
  const conditions = automation.conditions;
  
  // Check exclude keywords
  if (conditions.excludeKeywords && conditions.excludeKeywords.length > 0) {
    const triggerText = triggerData.triggerText.toLowerCase();
    for (const keyword of conditions.excludeKeywords) {
      if (triggerText.includes(keyword.toLowerCase())) {
        return false;
      }
    }
  }
  
  // Check user restrictions
  if (conditions.excludeUsers && conditions.excludeUsers.includes(triggerData.userId)) {
    return false;
  }
  
  if (conditions.includeUsers && conditions.includeUsers.length > 0) {
    if (!conditions.includeUsers.includes(triggerData.userId)) {
      return false;
    }
  }
  
  // Check verified user requirement
  if (conditions.requireVerifiedUser && !triggerData.isVerified) {
    return false;
  }
  
  // TODO: Add more user condition checks like:
  // - User follower count (requires Instagram API call)
  // - User account age (requires Instagram API call)
  // - User engagement level
  
  return true;
};

// Helper function to validate Instagram event data
const validateEventData = (eventData) => {
  if (!eventData || typeof eventData !== 'object') {
    return false;
  }
  
  // Check required fields for comment events
  if (eventData.from && eventData.id && eventData.media && eventData.text) {
    return true;
  }
  
  return false;
};

  const handleInstagramEvent = async (event) => {
    console.log('Instagram event received:', event);

    switch (event.field) {
      case 'live_comments':
        handleLiveComments(event);
        break;
      case 'comments':
        handleComment(event);
        break;
      case 'message_reactions':
        handleMessageReactions(event);
        break;
      case 'messages':
        handleMessage(event);
        break;
      default:
        console.log('Unknown Instagram event type:', event.type);
    }
  };

  const handleLiveComments = async (value) => {
    console.log('Live comments event received:', value);
    // Similar logic to handleComment but for live comments
    if (value && value.length > 0) {
      for (const comment of value) {
        await handleComment(comment);
      }
    }
  };

  const handleComment = async (event) => {

    const value = event?.value;
    console.log('Comment event received:', value);

    // Validate event data
    if (!validateEventData(value)) {
      console.error('Invalid comment event data:', value);
      return;
    }
    

    const { from, id, media, parent_id, text } = value;

    // Validate required fields
    if (!from || !from.id || !from.username) {
      console.error('Invalid webhook data: missing from user info', { from });
      return;
    }
    
    if (!media || !media.id) {
      console.error('Invalid webhook data: missing media info', { media });
      return;
    }
    
    if (!text) {
      console.error('Invalid webhook data: missing comment text', { text });
      return;
    }
    
    const { id: fromId, username: fromUsername } = from;
    const { id: mediaId, media_product_type: mediaProductType } = media;

    console.log('Processing real webhook comment data:', {
      fromId,
      fromUsername,
      mediaId,
      mediaProductType,
      commentId: id,
      parentId: parent_id,
      text: text.substring(0, 50) + (text.length > 50 ? '...' : '')
    });

    const automations = await automationService.getAutomationsByMediaId(mediaId);

    if (automations.length > 0) {
      for (const automation of automations) {
        // Check if automation applies to this content
        if (!automation.appliesToContent(automation.contentId?._id, mediaId)) {
          continue;
        }

        // Check if automation can execute (conditions, schedule, etc.)
        if (!automation.canExecute()) {
          console.log(`Automation ${automation._id} cannot execute - conditions not met`);
          continue;
        }

        // Check user-specific conditions
        if (!(await checkUserConditions(automation, {
          userId: fromId,
          username: fromUsername,
          triggerText: text,
          isVerified: false // Assuming user is not verified for testing
        }))) {
          console.log(`Automation ${automation._id} - user conditions not met`);
          continue;
        }

        // Check if comment matches any trigger keywords
        const triggers = automation.getAllTriggers();
        let triggerMatched = false;
        let matchedTriggerIndex = 0;

        for (let i = 0; i < triggers.length; i++) {
          const trigger = triggers[i];
          if (trigger.type === 'comment' && automation.matchesKeywords(text, i)) {
            triggerMatched = true;
            matchedTriggerIndex = i;
            break;
          }
        }

        if (!triggerMatched) {
          console.log(`Automation ${automation._id} - comment does not match trigger keywords`);
          continue;
        }

        // Prepare trigger data for execution
        const triggerData = {
          userId: fromId,
          username: fromUsername,
          commentId: id,
          mediaId: mediaId,
          mediaProductType: mediaProductType,
          parentId: parent_id,
          triggerText: text,
          triggerIndex: matchedTriggerIndex,
          triggerType: 'comment'
        };

        // Check and execute automation
        try {
          await automationService.checkAndExecuteAutomation(automation, triggerData);
          console.log(`Automation ${automation._id} executed successfully for comment from ${fromUsername}`);
        } catch (error) {
          console.error(`Error executing automation ${automation._id}:`, error.message);
        }
      }
    }

    console.log('Comment event processed:', { fromId, fromUsername, mediaId, mediaProductType, parent_id, text });
  };

  const handleMessageReactions = async (value) => {
    console.log('Message reactions event received:', value);
    // TODO: Implement message reaction handling
    // This would trigger automations based on message reactions
  };

  const handleMessage = async (value) => {
    console.log('Message event received:', value);
    // TODO: Implement direct message handling
    // This would trigger automations based on direct messages
  };

  module.exports = {
    handleInstagramEvent,
    handleComment,
    handleLiveComments,
    handleMessageReactions,
    handleMessage
  };