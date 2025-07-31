const mongoose = require('mongoose');
const automationExecutionService = require('../src/services/automationExecutionService');
const automationService = require('../src/services/automationService');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/instagram-store';

async function testAutomationFlow() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

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

    console.log('🚀 Testing automation flow with mock webhook event:');
    console.log(JSON.stringify(mockWebhookEvent, null, 2));

    // Process the webhook event
    await automationExecutionService.handleInstagramEvent(mockWebhookEvent);

    console.log('✅ Automation flow test completed');

  } catch (error) {
    console.error('❌ Error testing automation flow:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the test
testAutomationFlow(); 