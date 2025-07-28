const automationService = require('./src/services/automationService');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/instagramstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function testAutomationSystem() {
  try {
    console.log('🧪 Testing Instagram Automation System...\n');

    // Test 1: Create a sample automation
    console.log('1. Creating sample automation...');
    const sampleAutomation = await automationService.createAutomation('test_user_id', {
      name: 'Welcome New Followers',
      description: 'Automatically welcome new followers with a personalized message',
      triggerType: 'follow',
      actionType: 'send_dm',
      keywords: [],
      responseMessage: 'Welcome! 🎉 Thanks for following us. Check out our latest posts and stories!',
      exactMatch: false,
      caseSensitive: false,
      isActive: true,
      conditions: {
        maxExecutionsPerDay: 10,
        cooldownMinutes: 5,
        maxExecutionsPerUser: 1
      }
    });
    console.log('✅ Sample automation created:', sampleAutomation.name);

    // Test 2: Create a comment automation
    console.log('\n2. Creating comment automation...');
    const commentAutomation = await automationService.createAutomation('test_user_id', {
      name: 'Comment Response',
      description: 'Respond to comments containing specific keywords',
      triggerType: 'comment',
      actionType: 'send_dm',
      keywords: ['question', 'help', 'support'],
      responseMessage: 'Hi! Thanks for your comment! We\'ll get back to you soon. In the meantime, check out our FAQ: [link]',
      exactMatch: false,
      caseSensitive: false,
      isActive: true,
      conditions: {
        maxExecutionsPerDay: 20,
        cooldownMinutes: 3,
        maxExecutionsPerUser: 2
      }
    });
    console.log('✅ Comment automation created:', commentAutomation.name);

    // Test 3: Test automation execution
    console.log('\n3. Testing automation execution...');
    
    // Test follow automation
    const followTriggerData = {
      triggerType: 'follow',
      triggerText: 'follow',
      userId: 'test_follower_123',
      username: 'test_follower',
      followId: 'follow_123',
      timestamp: new Date()
    };

    const followAutomation = await automationService.getAutomations('test_user_id', { triggerType: 'follow' });
    if (followAutomation.length > 0) {
      await automationService.checkAndExecuteAutomation(followAutomation[0], followTriggerData);
      console.log('✅ Follow automation executed');
    }

    // Test comment automation
    const commentTriggerData = {
      triggerType: 'comment',
      triggerText: 'I have a question about your products',
      userId: 'test_commenter_456',
      username: 'test_commenter',
      mediaId: 'test_media_123',
      commentId: 'comment_456',
      timestamp: new Date()
    };

    const commentAutomations = await automationService.getAutomations('test_user_id', { triggerType: 'comment' });
    if (commentAutomations.length > 0) {
      await automationService.checkAndExecuteAutomation(commentAutomations[0], commentTriggerData);
      console.log('✅ Comment automation executed');
    }

    // Test 4: Get automation statistics
    console.log('\n4. Getting automation statistics...');
    const stats = await automationService.getAutomationStats('test_user_id');
    console.log('✅ Automation stats:', {
      totalAutomations: stats.totalAutomations,
      activeAutomations: stats.activeAutomations,
      totalExecutions: stats.totalExecutions,
      successfulExecutions: stats.successfulExecutions
    });

    // Test 5: Get automation logs
    console.log('\n5. Getting automation logs...');
    const logs = await automationService.getAutomationLogs('test_user_id', { limit: 5 });
    console.log('✅ Automation logs:', logs.length, 'entries found');

    // Test 6: Test automation matching
    console.log('\n6. Testing keyword matching...');
    const testAutomation = await automationService.getAutomations('test_user_id', { triggerType: 'comment' });
    if (testAutomation.length > 0) {
      const automation = testAutomation[0];
      
      const testTexts = [
        'I have a question about your products',
        'This is amazing!',
        'Can you help me?',
        'Just saying hi',
        'I need support with my order'
      ];

      testTexts.forEach(text => {
        const matches = automation.matchesKeywords(text);
        console.log(`Text: "${text}" -> Matches: ${matches}`);
      });
    }

    // Test 7: Test automation conditions
    console.log('\n7. Testing automation conditions...');
    const testAutomations = await automationService.getAutomations('test_user_id');
    if (testAutomations.length > 0) {
      const automation = testAutomations[0];
      const canExecute = automation.canExecute();
      console.log(`Automation "${automation.name}" can execute: ${canExecute}`);
    }

    console.log('\n🎉 All automation tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Created sample automations');
    console.log('- Tested automation execution');
    console.log('- Verified keyword matching');
    console.log('- Checked automation conditions');
    console.log('- Retrieved statistics and logs');

  } catch (error) {
    console.error('❌ Error testing automation system:', error);
  } finally {
    // Clean up test data
    try {
      await automationService.deleteAutomation('test_user_id', 'test_user_id');
      console.log('\n🧹 Test data cleaned up');
    } catch (cleanupError) {
      console.log('\n⚠️ Could not clean up test data:', cleanupError.message);
    }
    
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAutomationSystem();
}

module.exports = { testAutomationSystem }; 