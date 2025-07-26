# Instagram Content Publishing Setup Guide

## 🚀 Overview

This guide will help you set up real Instagram content publishing and data integration for your SocioHiro application. You'll be able to:

- ✅ Upload content to your test Instagram account
- ✅ Fetch real Instagram posts and data
- ✅ Get insights and analytics
- ✅ Manage comments and engagement
- ✅ Schedule content for publishing

## 📋 Prerequisites

### 1. Instagram Business Account
- Convert your personal Instagram to a **Business or Creator account**
- Connect it to a **Facebook Page**
- Ensure you have **admin access** to the Facebook Page

### 2. Facebook Developer Account
- Create a Facebook Developer account at [developers.facebook.com](https://developers.facebook.com)
- Create a Facebook App for Instagram Graph API

## 🔧 Step-by-Step Setup

### Step 1: Create Facebook App

1. **Go to Facebook Developers**
   ```
   https://developers.facebook.com/apps/
   ```

2. **Create New App**
   - Click "Create App"
   - Select "Business" as app type
   - Fill in app details:
     - **App Name**: `SocioHiro-Content`
     - **Contact Email**: Your email
     - **Business Account**: Select your business account

3. **Add Instagram Graph API**
   - In your app dashboard, click "Add Product"
   - Find and add "Instagram Graph API"
   - Click "Set Up"

### Step 2: Configure App Settings

#### Basic Settings
1. Go to "Settings" → "Basic"
2. Add your app domain: `localhost` (for development)
3. Add privacy policy URL (required for app review)

#### Instagram Graph API Settings
1. Go to "Instagram Graph API" → "Basic Display"
2. Add OAuth Redirect URIs:
   ```
   http://localhost:8080/api/auth/instagram/callback
   ```
3. Save changes

### Step 3: Get Your Credentials

From your app dashboard, copy:
- **App ID**: `532563143212029` (your app ID)
- **App Secret**: (hidden, click "Show" to reveal)

### Step 4: Update Environment Variables

Update your `backend/.env` file:

```env
# Instagram Graph API Configuration
INSTAGRAM_APP_ID=your_app_id_here
INSTAGRAM_APP_SECRET=your_app_secret_here
INSTAGRAM_CALLBACK_URL=http://localhost:8080/api/auth/instagram/callback

# Content Publishing Configuration
CONTENT_UPLOAD_PATH=uploads/
MAX_FILE_SIZE=10485760
```

### Step 5: Install Dependencies

```bash
cd backend
npm install multer form-data
```

### Step 6: Create Uploads Directory

```bash
cd backend
mkdir uploads
```

### Step 7: Update App Routes

Add the content routes to your main app file (`backend/src/app.js`):

```javascript
const contentRoutes = require('./routes/content');
app.use('/api/content', contentRoutes);
```

## 🧪 Testing Your Setup

### 1. Test Authentication

1. **Start your servers:**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

2. **Visit your app:**
   ```
   http://localhost:5173
   ```

3. **Connect Instagram:**
   - Click "Connect Instagram Account"
   - Complete Facebook OAuth
   - Grant permissions to your Instagram Business Account

### 2. Test Content Publishing

1. **Create a test post:**
   - Go to Content page
   - Click "New Content"
   - Fill in the form with test data
   - Upload an image
   - Click "Create Content"

2. **Publish to Instagram:**
   - Click "Publish" on your test content
   - Check your Instagram account for the published post

### 3. Test Data Fetching

1. **View real Instagram data:**
   - Go to Content page
   - You should see your real Instagram posts
   - Check insights and engagement data

## 📊 Features Available

### ✅ **Content Publishing**
- **Posts**: Single image/video posts
- **Stories**: 24-hour stories
- **Reels**: Short-form video content
- **Carousels**: Multiple image posts

### ✅ **Content Management**
- **Draft content**: Save as drafts
- **Scheduled content**: Schedule for future publishing
- **Published content**: View published posts
- **Content editing**: Edit before publishing

### ✅ **Analytics & Insights**
- **Post insights**: Impressions, reach, engagement
- **Account insights**: Follower growth, profile views
- **Comment management**: View and reply to comments
- **Performance tracking**: Track content performance

### ✅ **Media Upload**
- **Drag & drop**: Easy file upload
- **Multiple formats**: Images (JPG, PNG, GIF) and videos (MP4, MOV)
- **File validation**: Size and format checking
- **Preview**: See uploaded files before publishing

## 🔒 Security & Permissions

### Required Instagram Permissions

For full functionality, you need these permissions:

1. **Basic Display** (Development mode)
   - `instagram_basic`
   - `instagram_content_publish`

2. **Advanced Permissions** (Requires app review)
   - `instagram_manage_comments`
   - `instagram_manage_insights`
   - `instagram_manage_messages`

### Development vs Production

**Development Mode:**
- ✅ Basic content publishing
- ✅ Read account data
- ✅ Limited to 25 users
- ✅ Test with your own account

**Production Mode:**
- ✅ Full functionality
- ✅ Unlimited users
- ✅ Requires app review
- ✅ All permissions available

## 🚨 Troubleshooting

### Common Issues

1. **"No Instagram Business Account found"**
   - Ensure your Instagram is a Business/Creator account
   - Ensure Instagram is connected to Facebook Page
   - Ensure you're admin of the Facebook Page

2. **"Invalid scope" errors**
   - Some permissions require app review
   - Use only basic permissions for development
   - Check your app's permission settings

3. **"App not in live mode"**
   - Keep app in development mode for testing
   - Add test users in app settings
   - Only switch to live mode after app review

4. **"File upload failed"**
   - Check uploads directory exists
   - Check file size limits
   - Check file format restrictions

### Error Messages

| Error | Solution |
|-------|----------|
| `Instagram access token required` | Complete Instagram OAuth |
| `No Instagram Business Account found` | Convert to Business account |
| `Invalid media type` | Check file format |
| `File too large` | Reduce file size |
| `Permission denied` | Check app permissions |

## 📈 Next Steps

### 1. **Test with Real Content**
- Create posts with your actual content
- Test different content types
- Verify publishing works correctly

### 2. **Set Up Scheduling**
- Test content scheduling
- Verify scheduled posts publish correctly
- Check timezone handling

### 3. **Monitor Analytics**
- Check post insights
- Track engagement metrics
- Monitor account growth

### 4. **Prepare for Production**
- Submit app for review
- Get advanced permissions
- Scale to multiple users

## 🎯 Success Checklist

- [ ] Instagram Business account created
- [ ] Facebook App configured
- [ ] Environment variables set
- [ ] Authentication working
- [ ] Content creation working
- [ ] Content publishing working
- [ ] Real data fetching working
- [ ] Media upload working
- [ ] Analytics working

## 📞 Support

If you encounter issues:

1. **Check the logs**: Look at backend console for error messages
2. **Verify permissions**: Ensure all required permissions are granted
3. **Test step by step**: Follow the testing guide above
4. **Check documentation**: Refer to Instagram Graph API docs

---

**Need help?** Check the [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api/) or create an issue in the project repository. 