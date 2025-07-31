# Vercel Deployment Guide

This guide will help you deploy your SocioHiro application to Vercel for the frontend and a suitable platform for the backend.

## 🚀 Quick Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy Frontend**
```bash
cd frontend
vercel --prod
```

4. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add the following environment variables:
     - `VITE_API_URL` - Your backend API URL (e.g., https://your-backend.railway.app)
     - `VITE_INSTAGRAM_CLIENT_ID` - Your Instagram Client ID

### Backend Deployment (Railway/Render)

#### Option 1: Railway (Recommended)

1. **Connect to Railway**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub
   - Create a new project
   - Connect your GitHub repository

2. **Configure Environment Variables**
   Add these variables in Railway dashboard:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   SESSION_SECRET=your_session_secret_key
   INSTAGRAM_CLIENT_ID=your_instagram_client_id
   INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
   INSTAGRAM_CALLBACK_URL=https://your-backend.railway.app/api/auth/instagram/callback
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=production
   PORT=5000
   ```

3. **Deploy**
   - Railway will automatically detect your Node.js app
   - It will build and deploy from the `backend/` directory
   - Get your deployment URL from the dashboard

#### Option 2: Render

1. **Create Render Account**
   - Go to [Render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New Web Service"
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Set build command: `npm install`
   - Set start command: `npm start`

3. **Configure Environment Variables**
   Add the same environment variables as listed above

## 🔧 Environment Setup

### Required Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com
VITE_INSTAGRAM_CLIENT_ID=your_instagram_client_id
```

#### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/instagramstore
SESSION_SECRET=your-super-secret-session-key
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_CALLBACK_URL=https://your-backend-url.com/api/auth/instagram/callback
JWT_SECRET=your-jwt-secret-key
NODE_ENV=production
PORT=5000
```

### Instagram API Setup

1. **Create Instagram App**
   - Go to [Facebook Developers](https://developers.facebook.com)
   - Create a new app
   - Add "Instagram Basic Display" product
   - Configure OAuth redirect URIs:
     - `https://your-frontend.vercel.app/auth/callback`
     - `https://your-backend-url.com/api/auth/instagram/callback`

2. **Get API Credentials**
   - Copy Client ID and Client Secret
   - Add to environment variables

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Instagram API credentials set up
- [ ] MongoDB database created and accessible
- [ ] All dependencies installed
- [ ] Build process tested locally

### Frontend (Vercel)
- [ ] Vercel CLI installed and logged in
- [ ] Repository connected to Vercel
- [ ] Environment variables set in Vercel dashboard
- [ ] Build command working: `npm run build`
- [ ] Custom domain configured (optional)

### Backend (Railway/Render)
- [ ] Railway/Render account created
- [ ] Repository connected
- [ ] Environment variables configured
- [ ] Build and start commands working
- [ ] Health check endpoint responding

### Post-Deployment
- [ ] Frontend accessible at Vercel URL
- [ ] Backend API responding
- [ ] Instagram OAuth working
- [ ] Database connections successful
- [ ] Webhooks configured (if using)

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables**
   - Ensure all variables are set in deployment platform
   - Check for typos in variable names
   - Verify API URLs are correct

3. **CORS Issues**
   - Configure CORS in backend
   - Add frontend URL to allowed origins
   - Check API URL configuration

4. **Database Connection**
   - Verify MongoDB connection string
   - Check network access
   - Ensure database exists

### Debug Commands

```bash
# Test frontend build locally
cd frontend
npm run build

# Test backend locally
cd backend
npm start

# Check environment variables
echo $VITE_API_URL
echo $MONGODB_URI
```

## 🚀 Production Optimization

### Frontend Optimizations
- Enable Vercel's edge caching
- Configure image optimization
- Set up CDN for static assets
- Enable compression

### Backend Optimizations
- Set up database connection pooling
- Configure caching headers
- Enable rate limiting
- Set up monitoring and logging

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics for frontend
- Monitor performance metrics
- Track user interactions

### Backend Monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Track database performance

## 🔐 Security

### Environment Variables
- Never commit sensitive data to Git
- Use deployment platform's secret management
- Rotate secrets regularly

### API Security
- Validate all inputs
- Implement rate limiting
- Use HTTPS everywhere
- Set up proper CORS

## 📞 Support

If you encounter issues during deployment:

1. **Check Logs**
   - Vercel: Dashboard → Functions → Logs
   - Railway: Dashboard → Deployments → Logs
   - Render: Dashboard → Services → Logs

2. **Common Solutions**
   - Restart deployment
   - Clear cache
   - Check environment variables
   - Verify API endpoints

3. **Get Help**
   - Check the main README.md
   - Review error logs
   - Contact support if needed

---

**Your SocioHiro is now ready for production!** 🎉

The application is deployed and ready to handle real users with proper scaling, monitoring, and security measures in place. 