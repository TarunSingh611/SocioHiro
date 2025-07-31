const mongoose = require('mongoose');
const automationExecutionService = require('../src/services/automationExecutionService');
const automationService = require('../src/services/automationService');
const AutomationRule = require('../src/models/AutomationRule');
const User = require('../src/models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/instagram-store';

async function testAutomationFlowDetailed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if the automation exists in the database
    const automationId = '6888794d825ae75e83454ee1';
    const automation = await AutomationRule.findById(automationId);
    
    if (!automation) {
      console.log('❌ Automation not found in database');
      console.log('Please make sure the automation with ID:', automationId, 'exists in the database');
      return;
    }

    console.log('✅ Found automation in database:');
    console.log('   Name:', automation.name);
    console.log('   Description:', automation.description);
    console.log('   Instagram ID:', automation.instagramId);
    console.log('   Is Active:', automation.isActive);
    console.log('   Triggers:', automation.triggers);
    console.log('   Actions:', automation.actions);

    // Check if the user exists
    const userId = '68823379150e46174ace598e'; // dev._.tarun's user ID
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('❌ User not found in database');
      console.log('Please make sure the user with ID:', userId, 'exists in the database');
      return;
    }

    console.log('✅ Found user in database:');
    console.log('   Username:', user.username);
    console.log('   Instagram ID:', user.instagramId);
    console.log('   Is Active:', user.isActive);

    // Simulate Instagram webhook event
    const mockWebhookEvent = {
      field: 'comments',
      value: {
        from: {
          id: '24884966311106046', // s.tarun_rajput's Instagram ID
          username: 's.tarun_rajput'
        },
        media: {
          id: '18039975077650076', // Media ID from automation data
          media_product_type: 'FEED'
        },
        id: '17865799348089039', // Comment ID
        parent_id: null,
        text: 'second' // This should trigger the automation with keyword "second"
      }
    };

    console.log('\n🚀 Testing automation flow with mock webhook event:');
    console.log('   Comment from:', mockWebhookEvent.value.from.username);
    console.log('   Comment text:', mockWebhookEvent.value.text);
    console.log('   Media ID:', mockWebhookEvent.value.media.id);

    // Check if automation applies to this media ID
    const automations = await automationService.getAutomationsByMediaId(mockWebhookEvent.value.media.id);
    console.log('\n📋 Found automations for media ID:', automations.length);

    if (automations.length === 0) {
      console.log('❌ No automations found for this media ID');
      console.log('   This could be because:');
      console.log('   - The automation is not active');
      console.log('   - The automation does not apply to this media ID');
      console.log('   - The automation is not configured for this user');
      return;
    }

    // Process the webhook event
    console.log('\n🔄 Processing webhook event...');
    await automationExecutionService.handleInstagramEvent(mockWebhookEvent);

    console.log('\n✅ Automation flow test completed');

  } catch (error) {
    console.error('❌ Error testing automation flow:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the test
testAutomationFlowDetailed(); 