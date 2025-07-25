# Instagram Graph API Setup Guide for SocioHiro

## Overview

SocioHiro uses **Instagram Graph API** (not Instagram Basic Display) to provide advanced business features like:
- Publishing posts and stories
- Reading insights and analytics
- Managing comments and mentions
- Scheduling content
- Multi-account support

## Prerequisites

1. **Facebook Developer Account** - Required for Instagram Graph API
2. **Instagram Business/Creator Account** - Personal accounts won't work
3. **Facebook Page** - Connected to your Instagram Business account

## Step-by-Step Setup

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Select "Business" as app type
4. Fill in app details:
   - **App Name**: `SocioHiro-IG`
   - **Contact Email**: Your email
   - **Business Account**: Select your business account

### 2. Add Instagram Graph API

1. In your app dashboard, click "Add Product"
2. Find and add "Instagram Graph API"
3. Click "Set Up" on Instagram Graph API

### 3. Configure App Settings

#### Basic Settings
1. Go to "Settings" → "Basic"
2. Add your app domain: `localhost` (for development)
3. Add privacy policy URL (required for app review)

#### Instagram Graph API Settings
1. Go to "Instagram Graph API" → "Basic Display"
2. Add OAuth Redirect URIs:
   ```
   http://localhost:5000/api/auth/instagram/callback
   ```
3. Save changes

### 4. Get Your Credentials

From your app dashboard, you'll find:
- **App ID**: `532563143212029` (your app ID)
- **App Secret**: (hidden, click "Show" to reveal)

### 5. Configure Environment Variables

Update your `backend/.env` file:

```env
# Instagram Graph API Configuration
INSTAGRAM_APP_ID=532563143212029
INSTAGRAM_APP_SECRET=your_app_secret_here
INSTAGRAM_CALLBACK_URL=http://localhost:5000/api/auth/instagram/callback
```

### 6. Install Dependencies

```bash
cd backend
npm install passport-facebook
```

### 7. Test the Setup

1. Start your backend server:
   ```bash
   npm run dev
   ```

2. Visit: `http://localhost:5000/api/auth/instagram`

3. You should be redirected to Facebook OAuth

## Important Notes

### Instagram Graph API vs Basic Display

| Feature | Instagram Basic Display | Instagram Graph API |
|---------|------------------------|-------------------|
| **Account Types** | Personal accounts only | Business/Creator accounts only |
| **Publishing** | ❌ Read-only | ✅ Full publishing |
| **Insights** | ❌ No analytics | ✅ Full analytics |
| **Comments** | ❌ No access | ✅ Full management |
| **Scheduling** | ❌ Not available | ✅ Available |
| **Multi-account** | ❌ Limited | ✅ Full support |

### Requirements for Users

Your users must have:
1. **Instagram Business or Creator account**
2. **Facebook Page connected to Instagram**
3. **Admin access to the Facebook Page**

### App Review Process

For production use, you'll need to submit your app for review to get:
- `instagram_content_publish` permission
- `instagram_manage_comments` permission
- `instagram_manage_insights` permission

## Troubleshooting

### Common Issues

1. **"No Instagram Business Account found"**
   - Ensure user has Instagram Business/Creator account
   - Ensure Instagram is connected to Facebook Page
   - Ensure user is admin of the Facebook Page

2. **"Invalid scope" errors**
   - Some permissions require app review
   - Use only basic permissions for development

3. **"App not in live mode"**
   - Keep app in development mode for testing
   - Add test users in app settings

### Development vs Production

**Development Mode:**
- Add test users in app settings
- Limited to 25 users
- Basic permissions only

**Production Mode:**
- Requires app review
- Full permissions available
- Unlimited users

## Next Steps

1. **Test Authentication**: Ensure users can log in
2. **Connect Instagram Accounts**: Implement account linking
3. **Test Publishing**: Try creating posts
4. **Implement Analytics**: Add insights and metrics
5. **Add Scheduling**: Implement post scheduling
6. **Submit for Review**: When ready for production

## API Endpoints

Your app will use these Instagram Graph API endpoints:

- `GET /me/accounts` - Get Facebook pages
- `GET /{page-id}` - Get Instagram Business Account
- `GET /{ig-user-id}/media` - Get posts
- `POST /{ig-user-id}/media` - Create post
- `GET /{ig-user-id}/insights` - Get analytics

## Security Considerations

1. **Store tokens securely** - Use environment variables
2. **Validate permissions** - Check user has required access
3. **Handle token expiration** - Implement refresh logic
4. **Rate limiting** - Respect API limits
5. **Error handling** - Graceful failure handling

---

**Need help?** Check the [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api/) 