# SocioHiro - App Review Testing Guide

## 🧪 Testing Instructions for Facebook App Review Team

### 📋 Pre-Testing Setup

#### 1. Test Account Creation
**For Facebook App Review Team**:

1. **Access the App**:
   - URL: https://sociohiro.vercel.app
   - No registration required - direct Instagram OAuth

2. **Test Instagram Account**:
   - Use the test Instagram account provided by your team
   - Ensure the account has some posts for testing
   - Business/Creator account preferred for full functionality

3. **OAuth Flow**:
   - Click "Continue with Instagram"
   - Grant all requested permissions
   - Complete the authorization flow

---

## 🔍 Core Functionality Testing

### 1. Instagram OAuth Authentication

#### Test Steps:
1. **Navigate to App**: https://sociohiro.vercel.app
2. **Click Login**: "Continue with Instagram" button
3. **Grant Permissions**: Allow all requested permissions
4. **Verify Success**: Should redirect to dashboard

#### Expected Results:
- ✅ OAuth flow completes successfully
- ✅ User is redirected to main dashboard
- ✅ Instagram profile information is displayed
- ✅ No authentication errors

#### Test Commands:
```bash
# Test OAuth endpoint
curl -X GET "https://sociohiro-backend.railway.app/api/auth/instagram"

# Test callback endpoint
curl -X GET "https://sociohiro-backend.railway.app/api/auth/instagram/callback?code=test_code"
```

### 2. Instagram Content Display

#### Test Steps:
1. **Navigate to Content Section**: Click "Content" in sidebar
2. **View Instagram Posts**: Check if user's posts are displayed
3. **Test Media Types**: Verify images, videos, carousel posts
4. **Check Flip View**: Toggle between Instagram and app views

#### Expected Results:
- ✅ User's Instagram posts are displayed
- ✅ Media types (images, videos) render correctly
- ✅ Post captions and timestamps are shown
- ✅ Flip view functionality works
- ✅ Performance indicators are visible

#### Test API Calls:
```bash
# Test content retrieval
curl -X GET "https://sociohiro-backend.railway.app/api/content" \
  -H "Authorization: Bearer {access_token}"

# Expected Response:
{
  "content": [
    {
      "id": "instagram_post_id",
      "type": "IMAGE",
      "mediaUrl": "https://...",
      "caption": "Post caption",
      "timestamp": "2024-01-01T00:00:00Z",
      "engagement": {
        "likes": 100,
        "comments": 10
      }
    }
  ]
}
```

### 3. Analytics & Performance Metrics

#### Test Steps:
1. **Navigate to Analytics**: Click "Analytics" in sidebar
2. **View Performance Data**: Check engagement metrics
3. **Test Date Filtering**: Use date range selectors
4. **Check Performance Indicators**: Look for visual performance badges

#### Expected Results:
- ✅ Engagement metrics are displayed
- ✅ Performance indicators are shown
- ✅ Date filtering works
- ✅ Analytics data is accurate

#### Test API Calls:
```bash
# Test analytics endpoint
curl -X GET "https://sociohiro-backend.railway.app/api/content/analytics" \
  -H "Authorization: Bearer {access_token}"

# Expected Response:
{
  "analytics": {
    "totalPosts": 50,
    "totalLikes": 5000,
    "totalComments": 500,
    "engagementRate": 5.2,
    "performance": {
      "highPerforming": 10,
      "underperforming": 5
    }
  }
}
```

### 4. Automation Features

#### Test Steps:
1. **Navigate to Automation**: Click "Automation" in sidebar
2. **Create New Rule**: Click "Create New Automation"
3. **Set Trigger Conditions**: Configure automation triggers
4. **Configure Responses**: Set up automated responses
5. **Test Automation**: Trigger automation manually

#### Expected Results:
- ✅ Automation creation works
- ✅ Trigger conditions can be set
- ✅ Response actions can be configured
- ✅ Automation logs are displayed
- ✅ Performance tracking works

#### Test API Calls:
```bash
# Test automation creation
curl -X POST "https://sociohiro-backend.railway.app/api/automation" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Automation",
    "trigger": "mention",
    "response": "Thank you for mentioning us!",
    "enabled": true
  }'

# Test automation logs
curl -X GET "https://sociohiro-backend.railway.app/api/automation/logs" \
  -H "Authorization: Bearer {access_token}"
```

### 5. Webhook Functionality

#### Test Steps:
1. **Verify Webhook Endpoint**: Check webhook URL accessibility
2. **Test Webhook Verification**: Verify webhook signature
3. **Test Event Processing**: Send test webhook events
4. **Check Real-time Updates**: Monitor automation triggers

#### Expected Results:
- ✅ Webhook endpoint is accessible
- ✅ Webhook verification works
- ✅ Events are processed correctly
- ✅ Real-time updates function

#### Test Commands:
```bash
# Test webhook verification
curl -X GET "https://sociohiro-backend.railway.app/api/webhooks/instagram" \
  -d "hub.mode=subscribe&hub.verify_token=sociohiro_webhook_token&hub.challenge=test_challenge"

# Expected Response: 200 OK with challenge parameter

# Test webhook event processing
curl -X POST "https://sociohiro-backend.railway.app/api/webhooks/instagram" \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=..." \
  -d '{
    "object": "page",
    "entry": [{
      "id": "test_page_id",
      "time": 1234567890,
      "instagram": [{
        "type": "mention",
        "data": {
          "id": "test_mention_id",
          "username": "test_user",
          "text": "@sociohiro great post!"
        }
      }]
    }]
  }'

# Expected Response: 200 OK
```

---

## 📊 Data Handling Verification

### 1. Data Collection Verification

#### Test Data Collection:
- ✅ Instagram profile information (username, profile picture)
- ✅ User's media posts and metadata
- ✅ Engagement metrics (likes, comments)
- ✅ Performance analytics data
- ✅ User preferences and settings

#### Verify Data NOT Collected:
- ❌ Private messages or DMs
- ❌ User passwords or credentials
- ❌ Personal information beyond Instagram profile
- ❌ Financial information

### 2. Data Storage Security

#### Test Security Measures:
- ✅ All data encrypted in transit (HTTPS)
- ✅ Access tokens stored securely
- ✅ User data isolated per account
- ✅ No sensitive data exposed in logs
- ✅ Database connections secure

### 3. Data Usage Verification

#### Verify Data Usage:
- ✅ Data used only for app functionality
- ✅ No third-party data sharing
- ✅ User consent obtained through OAuth
- ✅ Data deletion available upon request
- ✅ GDPR compliance measures in place

---

## 🔧 API Endpoint Testing

### Instagram Basic Display API

#### 1. User Profile Endpoint
```bash
curl -X GET "https://graph.instagram.com/me?fields=id,username,account_type&access_token={access_token}"

# Expected Response:
{
  "id": "instagram_user_id",
  "username": "test_user",
  "account_type": "BUSINESS"
}
```

#### 2. Media Endpoint
```bash
curl -X GET "https://graph.instagram.com/me/media?fields=id,media_type,media_url,caption,timestamp&access_token={access_token}"

# Expected Response:
{
  "data": [
    {
      "id": "media_id",
      "media_type": "IMAGE",
      "media_url": "https://...",
      "caption": "Post caption",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Instagram Graph API (Business Accounts)

#### 1. Insights Endpoint
```bash
curl -X GET "https://graph.facebook.com/{media-id}/insights?metric=reach,impressions,engagement&access_token={access_token}"

# Expected Response:
{
  "data": [
    {
      "name": "reach",
      "value": 1000
    },
    {
      "name": "impressions", 
      "value": 1500
    },
    {
      "name": "engagement",
      "value": 50
    }
  ]
}
```

---

## 🚨 Common Issues & Troubleshooting

### 1. OAuth Flow Issues

#### Problem: OAuth redirect fails
**Solution**:
- Check OAuth redirect URIs in Facebook App settings
- Verify callback URL is correct
- Ensure app is in Development mode for testing

#### Problem: Permission denied
**Solution**:
- Grant all requested permissions during OAuth
- Check if Instagram account is connected to Facebook
- Verify account type (Business/Creator for full features)

### 2. API Call Issues

#### Problem: API calls return errors
**Solution**:
- Verify access token is valid
- Check API permissions are granted
- Ensure correct API endpoints are used

#### Problem: No data returned
**Solution**:
- Check if Instagram account has posts
- Verify account type supports requested features
- Test with different Instagram account

### 3. Webhook Issues

#### Problem: Webhook verification fails
**Solution**:
- Check webhook URL is accessible
- Verify verify token matches
- Ensure HTTPS is used

#### Problem: Webhook events not processed
**Solution**:
- Check webhook signature verification
- Verify event data format
- Monitor webhook logs

---

## ✅ Testing Checklist

### Authentication Testing
- [ ] OAuth flow completes successfully
- [ ] User is redirected to dashboard
- [ ] Instagram profile information is displayed
- [ ] Access token is stored securely
- [ ] No authentication errors occur

### Content Display Testing
- [ ] Instagram posts are displayed correctly
- [ ] Media types (images, videos) render properly
- [ ] Post metadata (captions, timestamps) is shown
- [ ] Flip view functionality works
- [ ] Performance indicators are visible

### Analytics Testing
- [ ] Engagement metrics are displayed
- [ ] Performance data is accurate
- [ ] Date filtering works correctly
- [ ] Analytics calculations are correct
- [ ] Performance indicators are meaningful

### Automation Testing
- [ ] Automation rules can be created
- [ ] Trigger conditions work properly
- [ ] Response actions are configured correctly
- [ ] Automation logs are displayed
- [ ] Performance tracking functions

### Webhook Testing
- [ ] Webhook endpoint is accessible
- [ ] Webhook verification works
- [ ] Events are processed correctly
- [ ] Real-time updates function
- [ ] Error handling works properly

### Data Handling Testing
- [ ] Only necessary data is collected
- [ ] Data is stored securely
- [ ] No sensitive data is exposed
- [ ] User consent is obtained
- [ ] Data deletion is available

---

## 📞 Support During Testing

### Technical Support
- **Email**: support@sociohiro.com
- **Documentation**: https://github.com/yourusername/sociohiro
- **Live Demo**: https://sociohiro.vercel.app

### Testing Assistance
- **Test Credentials**: Available upon request
- **Demo Account**: Can be provided for testing
- **Technical Questions**: Email support@sociohiro.com

### App Review Questions
- **Review Process**: Contact support@sociohiro.com
- **Additional Information**: Available upon request
- **Demo Access**: Live demo available for review team

---

**SocioHiro App Review Testing Team**  
Email: support@sociohiro.com  
Website: https://sociohiro.vercel.app  
Documentation: https://github.com/yourusername/sociohiro

*This testing guide ensures all Instagram API functionality can be verified by the Facebook App Review team.* 