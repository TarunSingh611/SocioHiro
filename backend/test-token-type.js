const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sociohiro', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function testTokenType() {
  try {
    console.log('🔍 Testing Instagram token types...\n');

    // Find all users with Instagram tokens
    const users = await User.find({
      accessToken: { $exists: true, $ne: null },
      instagramId: { $exists: true, $ne: null }
    });

    console.log(`Found ${users.length} users with Instagram tokens\n`);

    for (const user of users) {
      console.log(`👤 User: ${user.username || user._id}`);
      console.log(`   Instagram ID: ${user.instagramId}`);
      console.log(`   Account Type: ${user.accountType}`);
      
      try {
        // Test if token is valid
        const testResponse = await axios.get('https://graph.instagram.com/me', {
          params: {
            fields: 'id,username,account_type',
            access_token: user.accessToken
          }
        });
        
        console.log(`   ✅ Token is valid`);
        
        // Try to exchange for long-lived token
        try {
          const exchangeResponse = await axios.get('https://graph.instagram.com/access_token', {
            params: {
              grant_type: 'ig_exchange_token',
              client_secret: process.env.INSTAGRAM_APP_SECRET,
              access_token: user.accessToken
            }
          });
          
          const expiresIn = exchangeResponse.data.expires_in;
          const days = Math.round(expiresIn / 86400);
          
          if (days > 30) {
            console.log(`   ✅ Token is LONG-LIVED (${days} days)`);
          } else {
            console.log(`   ⚠️ Token is SHORT-LIVED (${days} days) - needs exchange`);
          }
          
        } catch (exchangeError) {
          if (exchangeError.response?.data?.error?.message?.includes('already a long-lived token')) {
            console.log(`   ✅ Token is already LONG-LIVED`);
          } else {
            console.log(`   ❌ Token exchange failed: ${exchangeError.response?.data?.error?.message || exchangeError.message}`);
          }
        }
        
      } catch (error) {
        console.log(`   ❌ Token is INVALID: ${error.response?.data?.error?.message || error.message}`);
      }
      
      console.log('');
    }

    console.log('✅ Token type test complete!');
    console.log('\n📋 Summary:');
    console.log('- If tokens are SHORT-LIVED, they will expire in 1 hour');
    console.log('- If tokens are LONG-LIVED, they will expire in 60 days');
    console.log('- Use /api/cron/exchange-short-lived-tokens to convert short-lived tokens');

  } catch (error) {
    console.error('❌ Error testing token types:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the test
testTokenType(); 