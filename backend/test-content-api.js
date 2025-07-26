const axios = require('axios');

const API_BASE = 'http://localhost:8080/api';

async function testContentAPI() {
  console.log('🧪 Testing Content API...\n');

  try {
    // Test 1: Check if content routes are accessible
    console.log('1. Testing content routes accessibility...');
    const testResponse = await axios.get(`${API_BASE}/content/test`);
    console.log('✅ Content routes are working:', testResponse.data);

    // Test 2: Check if we can reach the API
    console.log('\n2. Testing API health...');
    const healthResponse = await axios.get('http://localhost:8080/health');
    console.log('✅ API is healthy:', healthResponse.data);

    // Test 3: Check if uploads directory exists
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, 'uploads');
    
    if (fs.existsSync(uploadsDir)) {
      console.log('✅ Uploads directory exists');
    } else {
      console.log('⚠️  Uploads directory does not exist, creating...');
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Uploads directory created');
    }

    console.log('\n🎉 All tests passed! Content API is ready.');
    console.log('\n📋 Next steps:');
    console.log('1. Start your frontend: cd frontend && npm run dev');
    console.log('2. Visit: http://localhost:5173');
    console.log('3. Go to Content page and test the functionality');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your backend server is running:');
      console.log('cd backend && npm run dev');
    }
    
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

// Run the test
testContentAPI(); 