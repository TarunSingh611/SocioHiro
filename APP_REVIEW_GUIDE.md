# SocioHiro - Facebook App Review Guide

## 📋 App Review Overview

**App Name**: SocioHiro  
**App ID**: [Your Facebook App ID]  
**App Type**: Social Media Management Platform  
**Primary Use Case**: Instagram content management, analytics, and automation

## 🎯 App Review Requirements

### ✅ App Review is Required
- **Reason**: App will be used by users without roles on the app
- **Target Users**: Instagram business accounts and creators
- **Public Access**: Yes, any Instagram user can access the platform

### 📅 Important Dates
- **App Review Deadline**: June 16, 2025 (incorporates Data Access Renewal)
- **Current Status**: Development mode (testing with app users)
- **Production Target**: After App Review approval

---

## 🔐 Permissions & Features Requested

### Instagram Basic Display API
**Permission**: `instagram_basic`  
**Purpose**: Access user's Instagram profile and media  
**Usage**: 
- Display user's Instagram posts, reels, and stories
- Show profile information (username, profile picture)
- Access media metadata (captions, timestamps, media type)

**User Data Collected**:
- Instagram user ID
- Username
- Profile picture URL
- Media posts (images, videos, carousel)
- Media captions and timestamps
- Media engagement metrics (likes, comments)

### Instagram Graph API (Business/Creator Accounts)
**Permission**: `instagram_manage_insights`  
**Purpose**: Access business account analytics and insights  
**Usage**:
- View post performance metrics
- Access reach and engagement data
- Monitor content performance over time

**User Data Collected**:
- Post reach and impressions
- Engagement rates
- Follower growth metrics
- Content performance analytics

### Webhook Subscriptions
**Permission**: `instagram_manage_comments`  
**Purpose**: Real-time notifications for comments and mentions  
**Usage**:
- Monitor new comments on posts
- Track user mentions
- Enable automated responses

**User Data Collected**:
- Comment text and author
- Mention notifications
- Real-time engagement data

---

## 🏢 Business Information

### Company Details
- **Business Name**: SocioHiro
- **Business Type**: SaaS Platform
- **Industry**: Social Media Management
- **Website**: https://sociohiro.vercel.app
- **Contact Email**: support@sociohiro.com

### Business Model
- **Revenue Stream**: Subscription-based SaaS
- **Target Market**: Instagram business accounts and creators
- **Value Proposition**: Streamline Instagram content management and automation

### Data Collection Purpose
1. **Content Management**: Help users organize and analyze their Instagram content
2. **Performance Analytics**: Provide insights into content performance
3. **Automation**: Enable automated responses and workflows
4. **Campaign Management**: Assist with marketing campaign tracking

---

## 📊 Data Handling & Privacy

### Data Collection Practices
**What We Collect**:
- Instagram profile information (username, profile picture)
- User's Instagram posts and media
- Engagement metrics (likes, comments, shares)
- Content performance data
- User preferences and settings

**What We DON'T Collect**:
- Private messages or DMs
- User passwords or login credentials
- Personal information beyond Instagram profile
- Financial information

### Data Storage & Security
- **Storage**: MongoDB Atlas (cloud database)
- **Encryption**: All data encrypted in transit and at rest
- **Access Control**: Role-based access with JWT authentication
- **Data Retention**: User data deleted upon account deletion
- **GDPR Compliance**: Yes, users can export/delete their data

### Data Usage
**Primary Uses**:
- Display user's Instagram content in our dashboard
- Calculate and show performance analytics
- Enable automation features
- Provide content management tools

**No Third-Party Sharing**: We do not sell, rent, or share user data with third parties

---

## 🔧 Technical Implementation

### API Integration Points

#### 1. Instagram OAuth Flow
```javascript
// OAuth redirect flow
GET /api/auth/instagram
→ Redirect to Instagram authorization
→ User grants permissions
→ Instagram redirects to callback URL
→ Exchange code for access token
→ Store token securely
```

#### 2. Content Sync Process
```javascript
// Fetch user's Instagram content
GET /me/media
→ Retrieve user's posts, reels, stories
→ Store media metadata in our database
→ Update engagement metrics
→ Display in user dashboard
```

#### 3. Analytics Collection
```javascript
// Fetch post insights
GET /{media-id}/insights
→ Collect reach, impressions, engagement
→ Calculate performance metrics
→ Store analytics data
→ Display in analytics dashboard
```

#### 4. Webhook Processing
```javascript
// Handle real-time events
POST /api/webhooks/instagram
→ Verify webhook signature
→ Process comment/mention events
→ Trigger automation rules
→ Update engagement data
```

### Testing Endpoints

#### Authentication Testing
```bash
# Test OAuth flow
curl -X GET "https://sociohiro-backend.railway.app/api/auth/instagram"

# Test callback
curl -X GET "https://sociohiro-backend.railway.app/api/auth/instagram/callback?code=test_code"
```

#### Content API Testing
```bash
# Test content retrieval
curl -X GET "https://sociohiro-backend.railway.app/api/content" \
  -H "Authorization: Bearer {access_token}"

# Test analytics
curl -X GET "https://sociohiro-backend.railway.app/api/content/analytics" \
  -H "Authorization: Bearer {access_token}"
```

#### Webhook Testing
```bash
# Test webhook verification
curl -X GET "https://sociohiro-backend.railway.app/api/webhooks/instagram" \
  -d "hub.mode=subscribe&hub.verify_token=sociohiro_webhook_token&hub.challenge=test_challenge"

# Test webhook events
curl -X POST "https://sociohiro-backend.railway.app/api/webhooks/instagram" \
  -H "Content-Type: application/json" \
  -d '{"object":"page","entry":[{"id":"test_page","time":1234567890,"instagram":[{"type":"mention","data":{"id":"test_mention","username":"test_user","text":"@sociohiro great post!"}}]}]}'
```

---

## 🧪 Testing Instructions for Reviewers

### 1. App Access Setup
**For Facebook App Review Team**:

1. **Create Test Account**:
   - Go to https://sociohiro.vercel.app
   - Click "Continue with Instagram"
   - Use test Instagram account provided by review team

2. **Grant Permissions**:
   - Authorize SocioHiro to access Instagram profile
   - Grant permissions for content and insights
   - Complete OAuth flow

### 2. Core Functionality Testing

#### Content Management
1. **View Instagram Content**:
   - Navigate to "Content" section
   - Verify Instagram posts are displayed
   - Check media types (images, videos, carousel)
   - Test flip view between Instagram and app data

2. **Performance Analytics**:
   - Click on any post to view analytics
   - Verify engagement metrics are shown
   - Check performance indicators
   - Test date range filtering

#### Automation Features
1. **Create Automation Rule**:
   - Go to "Automation" section
   - Click "Create New Automation"
   - Set up trigger conditions
   - Configure response actions
   - Save and activate rule

2. **Test Automation**:
   - Trigger automation manually
   - Verify response is generated
   - Check automation logs
   - Monitor performance metrics

#### Analytics Dashboard
1. **View Analytics**:
   - Navigate to "Analytics" section
   - Check engagement overview
   - View performance trends
   - Test data filtering options

### 3. API Functionality Verification

#### Instagram API Calls
```bash
# Test user profile retrieval
GET /me
Response: User profile data with Instagram ID, username, profile picture

# Test media retrieval
GET /me/media
Response: Array of user's Instagram posts with metadata

# Test insights retrieval
GET /{media-id}/insights
Response: Performance metrics for specific post
```

#### Webhook Functionality
```bash
# Test webhook verification
GET /api/webhooks/instagram?hub.mode=subscribe&hub.verify_token=...
Response: 200 OK with challenge parameter

# Test webhook event processing
POST /api/webhooks/instagram
Body: Instagram webhook event data
Response: 200 OK, event processed
```

### 4. Data Handling Verification

#### Data Collection
- ✅ Instagram profile information collected
- ✅ User's media posts retrieved
- ✅ Engagement metrics captured
- ✅ Analytics data processed

#### Data Storage
- ✅ Data stored securely in MongoDB
- ✅ Access tokens encrypted
- ✅ User data isolated per account
- ✅ No sensitive data exposed

#### Data Usage
- ✅ Data used only for app functionality
- ✅ No third-party sharing
- ✅ User consent obtained
- ✅ Data deletion available

---

## 🚨 Common Issues & Solutions

### Development Mode Limitations
**Issue**: Some features require "Live" mode  
**Solution**: 
- Test authentication and basic API calls in Development mode
- Use mock data for webhook testing
- Document which features require app review

### Permission Scopes
**Issue**: Advanced permissions require app review  
**Solution**:
- Start with basic permissions (instagram_basic)
- Request additional permissions through app review
- Document use case for each permission

### Webhook Testing
**Issue**: Webhooks require HTTPS and public URL  
**Solution**:
- Use ngrok for local testing
- Deploy to production for real webhook testing
- Provide test webhook endpoints

---

## 📞 Support & Contact

### Technical Support
- **Email**: support@sociohiro.com
- **Documentation**: https://github.com/yourusername/sociohiro
- **Issues**: GitHub Issues for technical problems

### App Review Support
- **Review Questions**: support@sociohiro.com
- **Testing Assistance**: Available for review team
- **Demo Access**: Live demo available at https://sociohiro.vercel.app

### Business Contact
- **Company**: SocioHiro
- **Contact**: support@sociohiro.com
- **Website**: https://sociohiro.vercel.app

---

## ✅ App Review Checklist

### Pre-Submission
- [ ] All permissions documented with use cases
- [ ] Testing instructions provided
- [ ] Data handling practices documented
- [ ] Privacy policy updated
- [ ] App functionality tested thoroughly
- [ ] Webhook endpoints accessible
- [ ] OAuth flow working correctly
- [ ] API endpoints responding properly

### Submission Requirements
- [ ] App review form completed
- [ ] Business information provided
- [ ] Technical documentation included
- [ ] Testing credentials provided
- [ ] Demo access available
- [ ] Contact information verified

### Post-Submission
- [ ] Monitor review status
- [ ] Respond to reviewer questions
- [ ] Provide additional information if needed
- [ ] Test any requested changes
- [ ] Prepare for production deployment

---

## 🎯 Success Criteria

### App Review Approval Requirements
1. **Clear Use Case**: SocioHiro's Instagram management features are well-defined
2. **Proper Data Handling**: User data is collected, stored, and used appropriately
3. **Testable Functionality**: All features can be tested by reviewers
4. **Compliance**: App follows Facebook's platform policies
5. **Security**: User data is protected and secure

### Expected Outcomes
- ✅ Instagram Basic Display API access approved
- ✅ Instagram Graph API access approved (for business accounts)
- ✅ Webhook subscriptions approved
- ✅ App moved to "Live" mode
- ✅ Ready for public users

---

**SocioHiro App Review Team**  
Email: support@sociohiro.com  
Website: https://sociohiro.vercel.app  
Documentation: https://github.com/yourusername/sociohiro

*This guide ensures SocioHiro meets all Facebook App Review requirements and provides clear testing instructions for reviewers.* 