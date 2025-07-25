require('dotenv').config();

console.log('🔍 Environment Variables Test\n');

console.log('1. Instagram Configuration:');
console.log('   INSTAGRAM_APP_ID:', process.env.INSTAGRAM_APP_ID);
console.log('   INSTAGRAM_APP_SECRET:', process.env.INSTAGRAM_APP_SECRET ? '***SET***' : '***NOT SET***');
console.log('   INSTAGRAM_CALLBACK_URL:', process.env.INSTAGRAM_CALLBACK_URL);

console.log('\n2. Other Configuration:');
console.log('   FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('   PORT:', process.env.PORT);

console.log('\n3. Environment Check:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   .env file loaded:', process.env.INSTAGRAM_APP_ID ? 'YES' : 'NO');

if (!process.env.INSTAGRAM_APP_ID) {
  console.log('\n❌ INSTAGRAM_APP_ID is not set!');
  console.log('Please check your .env file in the backend directory.');
} else {
  console.log('\n✅ INSTAGRAM_APP_ID is set correctly');
}

if (!process.env.INSTAGRAM_APP_SECRET) {
  console.log('❌ INSTAGRAM_APP_SECRET is not set!');
  console.log('Please check your .env file in the backend directory.');
} else {
  console.log('✅ INSTAGRAM_APP_SECRET is set correctly');
}

console.log('\n📋 Next Steps:');
console.log('1. Make sure you have a .env file in the backend directory');
console.log('2. Copy the values from env.example to .env');
console.log('3. Set your actual Instagram App ID and Secret');
console.log('4. Restart the backend server'); 