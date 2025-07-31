# Instagram Webhook Setup Guide

## Overview
Instagram API with Instagram Login does **NOT** support webhook creation via API calls. Webhooks must be configured manually through the Facebook App dashboard.

## Prerequisites
1. ✅ Instagram app created in Facebook Developer Console
2. ✅ Instagram Graph API product added to your app
3. ✅ Backend server running with webhook endpoint
4. ✅ ngrok running for HTTPS webhook URL (development)
5. ✅ Environment variables configured

## Step-by-Step Webhook Configuration

### 1. Prepare Your Backend Server
```bash
# Start your backend server
cd backend
npm run dev

# In another terminal, start ngrok
ngrok http 8080
```

### 2. Configure Environment Variables
Make sure these are set in your `.env` file:
```env
WEBHOOK_VERIFY_TOKEN=SocioHiroSuperSecretWebhookVerifyToken2025
WEBHOOK_CALLBACK_URL=https://your-ngrok-url.ngrok-free.app/api/webhooks/instagram
BASE_URL=https://your-ngrok-url.ngrok-free.app
```

### 3. Facebook App Dashboard Configuration

#### Step 1: Access Facebook App Dashboard
1. Go to [Facebook Developer Console](https://developers.facebook.com/apps/)
2. Select your Instagram app

#### Step 2: Navigate to Webhooks
1. In the left sidebar, click **Instagram Graph API**
2. Click **Webhooks** in the submenu

#### Step 3: Configure Webhook Settings
1. Click **Add Callback URL**
2. Enter your webhook URL: `https://your-ngrok-url.ngrok-free.app/api/webhooks/instagram`
3. Enter your verify token: `SocioHiroSuperSecretWebhookVerifyToken2025`
4. Click **Verify and Save**

#### Step 4: Subscribe to Fields
After verification, subscribe to these fields:
- ✅ `messages` - Direct messages to your account
- ✅ `mentions` - Mentions of your account
- ✅ `comments` - Comments on your posts

### 4. Test Webhook Configuration

#### Test 1: Verification Endpoint
```bash
# Test webhook verification (replace with your ngrok URL)
curl "https://your-ngrok-url.ngrok-free.app/api/webhooks/instagram?hub.mode=subscribe&hub.verify_token=SocioHiroSuperSecretWebhookVerifyToken2025&hub.challenge=test123"
```

Expected response: `test123`

#### Test 2: Webhook Events
1. Comment on one of your Instagram posts
2. Send a DM to your Instagram account
3. Check your backend logs for webhook events

### 5. Troubleshooting

#### Common Issues

**Issue: "Webhook verification failed"**
- ✅ Check that your backend server is running
- ✅ Verify ngrok URL is accessible
- ✅ Ensure verify token matches exactly (case-sensitive)
- ✅ Check that webhook endpoint is responding correctly

**Issue: "No webhook events received"**
- ✅ Verify webhook is configured in Facebook App dashboard
- ✅ Check that fields are subscribed (messages, mentions, comments)
- ✅ Ensure your Instagram account has proper permissions
- ✅ Test with Facebook App dashboard's "Send Test Event" feature

**Issue: "ngrok URL not accessible"**
- ✅ Restart ngrok: `ngrok http 8080`
- ✅ Update webhook URL in Facebook App dashboard
- ✅ Check ngrok tunnel status

#### Debug Commands
```bash
# Test webhook endpoint
curl -X POST https://your-ngrok-url.ngrok-free.app/api/webhooks/instagram \
  -H "Content-Type: application/json" \
  -d '{"object":"instagram","entry":[{"id":"test","time":1234567890}]}'

# Check ngrok status
curl http://localhost:4040/api/tunnels

# Test Instagram API connection
node testing/test-instagram-webhook-setup.js
```

### 6. Production Deployment

When deploying to production:

1. **Update Environment Variables**
   ```env
   WEBHOOK_CALLBACK_URL=https://your-domain.com/api/webhooks/instagram
   BASE_URL=https://your-domain.com
   ```

2. **Update Facebook App Settings**
   - Go to Facebook App dashboard
   - Update webhook URL to your production domain
   - Re-verify webhook

3. **SSL Certificate**
   - Ensure your domain has valid SSL certificate
   - Webhook URLs must be HTTPS

### 7. Automation Testing

After webhook setup, test your automation:

1. **Comment Automation**
   - Comment on your Instagram post with trigger keywords
   - Check if automated response is sent

2. **DM Automation**
   - Send DM to your Instagram account
   - Check if automated response is sent

3. **Monitor Logs**
   ```bash
   # Watch backend logs for webhook events
   tail -f logs/app.log
   ```

## Important Notes

- ⚠️ **Instagram API with Instagram Login** does not support webhook creation via API
- ⚠️ Webhooks must be configured manually in Facebook App dashboard
- ⚠️ Webhook URL must be HTTPS (ngrok provides this for development)
- ⚠️ Verify token must match exactly (case-sensitive)
- ⚠️ Your backend server must be running for webhook verification
- ⚠️ Instagram account must have proper permissions for webhook events

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Facebook App dashboard logs
3. Check your backend server logs
4. Test with Facebook App dashboard's test features 