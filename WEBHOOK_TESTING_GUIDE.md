# Instagram Graph API Webhook Testing Guide

## Overview

This guide explains how to test Instagram Graph API webhooks in development mode and how to work around the "Live mode" requirement.

## Webhook Setup for Development

### 1. Local Development Setup

**Option A: Using ngrok (Recommended)**

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Start your backend server:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start ngrok tunnel:**
   ```bash
   ngrok http 5000
   ```

4. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

5. **Configure webhook in Facebook App:**
   - Go to your Facebook App → Instagram Graph API → Webhooks
   - **Callback URL**: `https://abc123.ngrok.io/api/webhooks/instagram`
   - **Verify Token**: `sociohiro_webhook_token`
   - **Fields to subscribe**: Select the events you want to test

**Option B: Using ngrok with custom domain**

1. **Create a custom domain** (optional):
   ```bash
   ngrok http 5000 --subdomain=sociohiro-webhooks
   ```

2. **Use the custom URL**: `https://sociohiro-webhooks.ngrok.io/api/webhooks/instagram`

### 2. Environment Configuration

Update your `.env` file:

```env
# Webhook Configuration
WEBHOOK_VERIFY_TOKEN=sociohiro_webhook_token
WEBHOOK_CALLBACK_URL=https://your-ngrok-url.ngrok.io/api/webhooks/instagram
```

### 3. Test Webhook Verification

1. **Manual verification test:**
   ```
   GET https://your-ngrok-url.ngrok.io/api/webhooks/instagram?hub.mode=subscribe&hub.verify_token=sociohiro_webhook_token&hub.challenge=test_challenge
   ```

2. **Expected response:**
   ```
   HTTP 200 OK
   test_challenge
   ```

## Testing Authentication Without Live Mode

### 1. Development Mode Testing

**What works in Development mode:**
- ✅ **Facebook OAuth login**
- ✅ **Basic Instagram API calls**
- ✅ **Getting user pages and Instagram accounts**
- ✅ **Reading basic account info**

**What doesn't work in Development mode:**
- ❌ **Webhooks** (require Live mode)
- ❌ **Advanced permissions** (require app review)
- ❌ **Publishing content** (require app review)

### 2. Testing Authentication Flow

1. **Start your servers:**
   ```bash
   # Backend
   cd backend
   npm run dev
   
   # Frontend
   cd frontend
   npm run dev
   ```

2. **Test login flow:**
   - Visit: `http://localhost:5173`
   - Click "Continue with Social Media"
   - Complete Facebook OAuth
   - Check if user is created in database

3. **Test API calls:**
   ```bash
   # Test authentication status
   curl http://localhost:5000/api/auth/status
   
   # Test Instagram accounts
   curl http://localhost:5000/api/instagram/accounts
   ```

### 3. Mock Webhook Testing

Since webhooks don't work in development mode, create mock webhook events:

```javascript
// Test webhook endpoint manually
const testWebhook = {
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

// Send test webhook
fetch('http://localhost:5000/api/webhooks/instagram', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testWebhook)
});
```

## Production Setup

### 1. App Review Process

To enable webhooks in production:

1. **Submit app for review:**
   - Go to App Review → Permissions and Features
   - Request permissions:
     - `instagram_content_publish`
     - `instagram_manage_comments`
     - `instagram_manage_insights`
     - `pages_manage_posts`

2. **Switch to Live mode:**
   - Go to App Settings → Basic
   - Change App Mode to "Live"

3. **Configure production webhooks:**
   - Use your production domain
   - Set up SSL certificate
   - Configure webhook events

### 2. Production Webhook URL

```env
# Production webhook configuration
WEBHOOK_CALLBACK_URL=https://your-domain.com/api/webhooks/instagram
WEBHOOK_VERIFY_TOKEN=your_secure_verify_token
```

## Troubleshooting

### Common Issues

1. **"Webhook verification failed"**
   - Check verify token matches exactly
   - Ensure webhook URL is accessible
   - Verify HTTPS is used (required for production)

2. **"ngrok tunnel not working"**
   - Check if ngrok is running
   - Verify port 5000 is correct
   - Try different ngrok subdomain

3. **"Authentication works but webhooks don't"**
   - This is expected in development mode
   - Use mock webhook testing
   - Wait for app review for production

### Debug Mode

Enable detailed logging:

```env
LOG_LEVEL=debug
```

Check server logs for webhook events:

```bash
# Watch server logs
tail -f backend/logs/app.log
```

## Testing Checklist

### Development Testing
- [ ] Facebook OAuth login works
- [ ] User creation in database
- [ ] Instagram account linking
- [ ] Basic API calls work
- [ ] Webhook verification endpoint responds
- [ ] Mock webhook events processed

### Production Testing
- [ ] App review completed
- [ ] Live mode enabled
- [ ] Production webhook URL configured
- [ ] SSL certificate installed
- [ ] Real webhook events received
- [ ] All permissions granted

## Next Steps

1. **Complete development testing** using the methods above
2. **Submit app for review** when ready for production
3. **Configure production webhooks** after app review
4. **Monitor webhook events** in production
5. **Implement webhook handlers** for your specific use cases

---

**Remember:** Webhooks require Live mode, but you can test everything else in Development mode! 