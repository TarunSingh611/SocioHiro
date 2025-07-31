# Instagram Webhook Setup Guide

This guide will help you set up Instagram webhooks to enable automated messaging to commenters and DM senders.

## 🎯 What We're Building

Your app will automatically:
- ✅ **Send DMs to commenters** when they comment on your posts
- ✅ **Send DMs to users** who send you messages
- ✅ **Process webhook events** from Instagram
- ✅ **Apply automation rules** based on keywords and conditions

## 📋 Prerequisites

1. **Instagram Business Account** (not personal account)
2. **Facebook Developer Account** with Instagram Graph API access
3. **HTTPS webhook URL** (use ngrok for development)
4. **Valid Instagram access token** with proper permissions

## 🔧 Step 1: Facebook App Configuration

### 1.1 Create/Configure Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Create a new app or use existing app
3. Add **Instagram Graph API** product
4. Add **Webhooks** product

### 1.2 Configure Instagram Graph API
1. In your app dashboard, go to **Instagram Graph API**
2. Add your Instagram Business Account
3. Request these permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `instagram_manage_comments`
   - `instagram_manage_insights`
   - `instagram_manage_messages`

### 1.3 Configure Webhooks
1. Go to **Webhooks** in your app dashboard
2. Add webhook subscription:
   - **Callback URL**: `https://your-domain.com/api/webhooks/instagram`
   - **Verify Token**: `SocioHiroSuperSecretWebhookVerifyToken2025`
   - **Fields**: `messages`, `mentions`, `comments`

## 🔧 Step 2: Environment Configuration

Update your `.env` file with these settings:

```env
# Instagram App Configuration
INSTAGRAM_APP_ID=your_instagram_app_id_from_facebook_developers
INSTAGRAM_APP_SECRET=your_instagram_app_secret_from_facebook_developers
INSTAGRAM_CALLBACK_URL=https://your-domain.com/api/instagram-oauth/callback

# Webhook Configuration
WEBHOOK_VERIFY_TOKEN=SocioHiroSuperSecretWebhookVerifyToken2025
WEBHOOK_CALLBACK_URL=https://your-domain.com/api/webhooks/instagram
BASE_URL=https://your-domain.com

# For development with ngrok
# BASE_URL=https://your-ngrok-url.ngrok-free.app
# WEBHOOK_CALLBACK_URL=https://your-ngrok-url.ngrok-free.app/api/webhooks/instagram
```

## 🔧 Step 3: Test Your Setup

### 3.1 Run the Webhook Test
```bash
node testing/test-instagram-webhook-setup.js
```

This will test:
- ✅ Token validity
- ✅ Account permissions
- ✅ Webhook subscription creation
- ✅ Messaging capabilities
- ✅ Comment reply capabilities

### 3.2 Test Webhook Events
1. **Comment on your Instagram post** - should trigger webhook
2. **Send DM to your Instagram account** - should trigger webhook
3. **Check server logs** for webhook processing

## 🔧 Step 4: Automation Rules

### 4.1 Create Automation Rules
Your app supports these automation types:

#### Comment Automation
```javascript
{
  eventType: 'comment',
  conditions: [
    { type: 'keyword_match', value: 'hello,hi,hey' },
    { type: 'time_of_day', value: '9-17' }
  ],
  response: 'Thanks for commenting! How can I help you today?'
}
```

#### Message Automation
```javascript
{
  eventType: 'message',
  conditions: [
    { type: 'keyword_match', value: 'price,cost,how much' }
  ],
  response: 'Thanks for your message! Here are our pricing details...'
}
```

### 4.2 Automation Features
- ✅ **Keyword matching** - respond to specific words
- ✅ **Time-based rules** - only respond during business hours
- ✅ **Custom responses** - personalized messages
- ✅ **Conditional logic** - complex automation rules

## 🔧 Step 5: Production Deployment

### 5.1 HTTPS Requirements
Instagram requires HTTPS for webhooks:
- Use **ngrok** for development
- Use **HTTPS domain** for production
- Configure SSL certificates

### 5.2 App Review Process
For production use:
1. Submit app for **Facebook App Review**
2. Request **Instagram Messaging** permissions
3. Provide **use case documentation**
4. Test with **Instagram test users**

## 🚀 Testing Your Automation

### Test 1: Comment Automation
1. Comment on your Instagram post: "Hello, I need help"
2. Check if webhook receives the event
3. Verify automated DM is sent to commenter

### Test 2: Message Automation
1. Send DM to your Instagram account: "What's the price?"
2. Check if webhook receives the event
3. Verify automated response is sent

### Test 3: Webhook Verification
```bash
# Test webhook verification
curl "https://your-domain.com/api/webhooks/instagram?hub.mode=subscribe&hub.verify_token=SocioHiroSuperSecretWebhookVerifyToken2025&hub.challenge=test123"
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Webhook Not Receiving Events
- ✅ Check webhook URL is accessible
- ✅ Verify webhook subscription is active
- ✅ Check Instagram app permissions
- ✅ Ensure HTTPS is configured

#### 2. Messages Not Sending
- ✅ Verify access token is valid
- ✅ Check Instagram Business Account permissions
- ✅ Ensure user has interacted with your account
- ✅ Test with Instagram test users

#### 3. User ID Issues
- ✅ Instagram user IDs are different from Facebook user IDs
- ✅ Use Instagram Graph API to get correct user IDs
- ✅ Some users may have privacy restrictions

### Debug Commands

```bash
# Test Instagram API connection
node testing/test-connection.js

# Test webhook setup
node testing/test-instagram-webhook-setup.js

# Test user ID resolution
node testing/test-user-id-debug.js

# Test automation flow
node testing/test-automation-flow.js
```

## 📚 API Reference

### Webhook Events
- `messages` - Direct messages received
- `mentions` - @mentions in comments
- `comments` - Comments on your posts

### Automation Methods
- `sendDirectMessage(userId, message)` - Send DM to user
- `sendPrivateReplyToComment(commentId, message)` - Reply to comment
- `getCommenters(mediaId)` - Get users who commented
- `getRecentMessages(limit)` - Get recent DM conversations

## 🎯 Next Steps

1. **Set up your Facebook app** with Instagram Graph API
2. **Configure webhook URL** in Facebook Developer Console
3. **Test with Instagram test users** before going live
4. **Submit for app review** when ready for production
5. **Monitor webhook events** and automation performance

## 📞 Support

If you encounter issues:
1. Check [Facebook Developer Community](https://developers.facebook.com/community)
2. Review [Instagram API Documentation](https://developers.facebook.com/docs/instagram-platform/)
3. Test with Instagram test users first
4. Ensure all permissions are properly configured

---

**Note**: Instagram API with Instagram Login now supports webhooks and cross-user messaging, making it perfect for your automation needs! 