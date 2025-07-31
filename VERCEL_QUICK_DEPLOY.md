# 🚀 Vercel Quick Deployment Guide

This guide will help you deploy SocioHiro to Vercel in minutes!

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **MongoDB Database**: Set up a MongoDB Atlas cluster
4. **Instagram App**: Create an Instagram Basic Display app

## 🚀 Quick Deploy Steps

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository containing SocioHiro

### 2. Configure Build Settings

Vercel will automatically detect the configuration, but verify these settings:

- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install`

### 3. Set Environment Variables

In your Vercel project settings, add these environment variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/instagramstore

# Security
SESSION_SECRET=your-super-secret-session-key
JWT_SECRET=your-jwt-secret-key

# Instagram API
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_CALLBACK_URL=https://your-app.vercel.app/api/auth/instagram/callback

# Frontend
FRONTEND_URL=https://your-app.vercel.app
VITE_API_URL=https://your-app.vercel.app

# Server
NODE_ENV=production
```

### 4. Deploy

Click "Deploy" and wait for the build to complete!

## 🔧 Setup Instructions

### MongoDB Setup

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com](https://mongodb.com)
   - Create a free cluster
   - Get your connection string

2. **Database Configuration**
   - Replace `username`, `password`, and `cluster` in the connection string
   - Add the connection string to Vercel environment variables

### Instagram API Setup

1. **Create Facebook App**
   - Go to [developers.facebook.com](https://developers.facebook.com)
   - Create a new app
   - Add "Instagram Basic Display" product

2. **Configure OAuth**
   - Add redirect URI: `https://your-app.vercel.app/auth/callback`
   - Copy Client ID and Client Secret
   - Add to Vercel environment variables

3. **Update Callback URL**
   - Set `INSTAGRAM_CALLBACK_URL` to your Vercel app URL

## 📱 Post-Deployment

### 1. Test Your App

Visit your Vercel URL and test:
- ✅ Frontend loads correctly
- ✅ Instagram login works
- ✅ API endpoints respond
- ✅ Database connections work

### 2. Configure Custom Domain (Optional)

1. Go to your Vercel project settings
2. Add your custom domain
3. Update environment variables with new domain
4. Update Instagram app settings

### 3. Set Up Monitoring

1. **Enable Vercel Analytics**
   - Go to project settings
   - Enable Analytics
   - Monitor performance

2. **Set Up Error Tracking**
   - Add Sentry DSN to environment variables
   - Monitor errors and performance

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs in Vercel dashboard
   # Verify all dependencies are installed
   npm run build
   ```

2. **Environment Variables**
   - Ensure all variables are set in Vercel
   - Check for typos in variable names
   - Verify API URLs are correct

3. **Database Connection**
   - Verify MongoDB connection string
   - Check network access
   - Ensure database exists

4. **Instagram OAuth**
   - Verify callback URLs match
   - Check app permissions
   - Test OAuth flow

### Debug Commands

```bash
# Test locally before deploying
npm run dev

# Check environment variables
echo $MONGODB_URI
echo $INSTAGRAM_CLIENT_ID

# Test build process
npm run build
```

## 🎯 Performance Optimization

### Vercel Optimizations

1. **Enable Edge Functions**
   - API routes automatically use edge functions
   - Faster response times globally

2. **Static Asset Optimization**
   - Images are automatically optimized
   - Enable compression in settings

3. **Caching**
   - Vercel automatically caches static assets
   - Configure cache headers for API responses

### Database Optimization

1. **Connection Pooling**
   - MongoDB Atlas provides connection pooling
   - Monitor connection usage

2. **Indexing**
   - Add indexes for frequently queried fields
   - Monitor query performance

## 🔐 Security Checklist

- [ ] Environment variables are set in Vercel
- [ ] No sensitive data in code
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place

## 📊 Monitoring

### Vercel Dashboard

- **Functions**: Monitor API performance
- **Analytics**: Track user interactions
- **Logs**: View server logs
- **Speed Insights**: Monitor Core Web Vitals

### External Monitoring

- **MongoDB Atlas**: Monitor database performance
- **Instagram API**: Monitor API usage
- **Sentry**: Track errors and performance

## 🚀 Advanced Features

### Automatic Deployments

1. **Connect GitHub**
   - Push to main branch triggers deployment
   - Preview deployments for pull requests

2. **Branch Deployments**
   - Each branch gets a unique URL
   - Test changes before merging

### Custom Domains

1. **Add Domain**
   - Go to project settings
   - Add your custom domain
   - Configure DNS records

2. **SSL Certificate**
   - Vercel provides automatic SSL
   - No additional configuration needed

## 📞 Support

If you encounter issues:

1. **Check Vercel Logs**
   - Go to Functions tab
   - View detailed error logs

2. **Common Solutions**
   - Restart deployment
   - Clear cache
   - Check environment variables

3. **Get Help**
   - Check the main README.md
   - Review error logs
   - Contact Vercel support

---

**🎉 Your SocioHiro app is now live on Vercel!**

Visit your Vercel URL to start using your social media management platform. 