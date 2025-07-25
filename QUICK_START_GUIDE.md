# Quick Start Guide: Instagram Graph API Testing

## 🚀 TL;DR - How to Test Without Live Mode

### **The Problem**
- Instagram Graph API webhooks require "Live" mode
- But you can test **authentication** and **basic API calls** in Development mode
- Webhooks are only needed for real-time events (mentions, comments, etc.)

### **The Solution**
1. **Test authentication** ✅ (works in Development mode)
2. **Test basic API calls** ✅ (works in Development mode)  
3. **Mock webhook events** ✅ (for testing webhook handlers)
4. **Use ngrok** for webhook testing (optional)

---

## 📋 Step-by-Step Testing

### 1. **Update Your Environment Variables**

```env
# backend/.env
INSTAGRAM_APP_ID=532563143212029
INSTAGRAM_APP_SECRET=your_app_secret_here
INSTAGRAM_CALLBACK_URL=http://localhost:5000/api/auth/instagram/callback
WEBHOOK_VERIFY_TOKEN=sociohiro_webhook_token
```

### 2. **Install Dependencies**

```bash
cd backend
npm install passport-facebook
```

### 3. **Start Your Servers**

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

### 4. **Test Authentication**

1. Visit: `http://localhost:5173`
2. Click "Continue with Social Media"
3. Complete Facebook OAuth
4. Check if user is created in database

### 5. **Run Webhook Tests**

```bash
cd backend
npm test
```

This will test:
- ✅ Health endpoint
- ✅ Authentication redirect
- ✅ Webhook verification
- ✅ Webhook event processing

---

## 🔧 What Works in Development Mode

### ✅ **Authentication & Basic Features**
- Facebook OAuth login
- Getting user's Facebook pages
- Reading Instagram Business Account info
- Basic account data retrieval

### ❌ **Requires Live Mode**
- Real webhook events
- Publishing content (requires app review)
- Advanced permissions

---

## 🧪 Testing Webhooks Locally

### Option 1: Mock Testing (Recommended)

```javascript
// Test webhook manually
const testEvent = {
  object: 'page',
  entry: [{
    id: 'test_page_id',
    time: Date.now(),
    instagram: [{
      type: 'mention',
      data: {
        id: 'test_mention_id',
        username: 'test_user',
        text: 'Great post! @sociohiro'
      }
    }]
  }]
};

fetch('http://localhost:5000/api/webhooks/instagram', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testEvent)
});
```

### Option 2: ngrok Tunnel (For Real Webhook Testing)

```bash
# Install ngrok
npm install -g ngrok

# Start tunnel
ngrok http 5000

# Use the HTTPS URL in your Facebook App webhook settings
# Example: https://abc123.ngrok.io/api/webhooks/instagram
```

---

## 📊 Testing Checklist

### Development Testing
- [ ] Server starts without errors
- [ ] Facebook OAuth redirects correctly
- [ ] User creation works
- [ ] Webhook verification responds
- [ ] Mock webhook events processed
- [ ] All tests pass (`npm test`)

### Production Preparation
- [ ] App review submitted
- [ ] Live mode enabled
- [ ] Production domain configured
- [ ] SSL certificate installed
- [ ] Real webhook events working

---

## 🚨 Common Issues & Solutions

### **"App not in live mode"**
- **Solution**: This is expected for development
- **Workaround**: Use mock webhook testing

### **"Invalid scope" errors**
- **Solution**: Some permissions require app review
- **Workaround**: Use basic permissions for testing

### **"No Instagram Business Account found"**
- **Solution**: Ensure user has Business/Creator account
- **Check**: Instagram connected to Facebook Page

### **"Webhook verification failed"**
- **Solution**: Check verify token matches exactly
- **Check**: Webhook URL is accessible

---

## 🎯 Next Steps

1. **Complete development testing** using the methods above
2. **Test with real users** (add them as test users in Facebook App)
3. **Submit for app review** when ready for production
4. **Configure production webhooks** after app review
5. **Monitor and optimize** webhook performance

---

## 📚 Additional Resources

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api/)
- [Facebook App Review Guidelines](https://developers.facebook.com/docs/app-review/)
- [Webhook Testing Guide](./WEBHOOK_TESTING_GUIDE.md)
- [Instagram Graph API Setup](./INSTAGRAM_GRAPH_API_SETUP.md)

---

**Remember**: You can test 90% of your app's functionality in Development mode. Webhooks are only needed for real-time features! 