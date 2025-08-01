# Vercel Deployment Fix Guide

## 🚨 Current Issue
Your app is deployed but the serverless function is crashing due to missing environment variables.

## ✅ Quick Fix Steps

### 1. **Set Up MongoDB Atlas (Free Database)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user with password
5. Get your connection string

### 2. **Configure Vercel Environment Variables**

Go to your Vercel dashboard → Project Settings → Environment Variables

Add these variables:

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/sociohiro
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
NODE_ENV=production
FRONTEND_URL=https://socio-hiro.vercel.app
```

### 3. **Generate Session Secret**

Run this command to generate a secure session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. **Test Your Deployment**

After adding environment variables, redeploy and test:

- **Health Check**: `https://socio-hiro.vercel.app/health`
- **Main App**: `https://socio-hiro.vercel.app`

## 🔧 What I Fixed

1. **Enhanced Error Handling**: The API now provides clear error messages when environment variables are missing
2. **Separate Health Endpoint**: Created `/api/health.js` that works without database connection
3. **Better Logging**: Added detailed logging to help debug issues
4. **Graceful Degradation**: App won't crash if database is unavailable

## 📊 Expected Results

After fixing:

- ✅ `/health` endpoint will show environment variable status
- ✅ Main app will load properly
- ✅ API endpoints will work with database
- ✅ No more 500 errors

## 🚀 Next Steps

1. Add the environment variables in Vercel
2. Redeploy your app
3. Test the health endpoint
4. Your app should be fully functional!

## 📞 Need Help?

If you still get errors after adding environment variables, check the Vercel function logs for specific error messages. 