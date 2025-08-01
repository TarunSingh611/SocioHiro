# Backend API Fix Guide

## 🚨 **Current Issue: Backend API Crash**

Your frontend is deployed successfully, but the backend API is crashing with a 500 error.

## ✅ **Root Cause: Missing Environment Variables**

The API is failing because these required environment variables are not set:
- `MONGODB_URI` (required for database connection)
- `SESSION_SECRET` (required for authentication)

## 🚀 **Quick Fix Steps:**

### **Step 1: Set Up MongoDB Atlas (Free Database)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user with password
5. Get your connection string

### **Step 2: Add Environment Variables in Vercel**

1. Go to your Vercel Dashboard
2. Find your project: `socio-hiro`
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/sociohiro
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
NODE_ENV=production
FRONTEND_URL=https://socio-hiro.vercel.app
```

### **Step 3: Generate Session Secret**

Run this command to generate a secure session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Step 4: Redeploy**

After adding environment variables:
1. Go to Vercel Dashboard
2. Click **Redeploy** → **Clear Cache and Deploy**

## 🧪 **Test Your Fix:**

### **Health Check (Should Work Immediately)**
Visit: `https://socio-hiro.vercel.app/health`

Expected response:
```json
{
  "status": "OK",
  "hasMongoDB": true,
  "hasSessionSecret": true,
  "missingEnvVars": [],
  "dbConnected": true
}
```

### **API Test**
Visit: `https://socio-hiro.vercel.app/api/analytics/summary`

## 📊 **Expected Results:**

After adding environment variables:
- ✅ **Health endpoint**: Shows database status
- ✅ **API endpoints**: All work properly
- ✅ **Frontend**: Connects to backend successfully
- ✅ **Authentication**: Works with session management

## 🔧 **Troubleshooting:**

### **If Health Check Still Fails:**
1. Check Vercel function logs
2. Verify environment variables are set correctly
3. Ensure MongoDB connection string is valid

### **If Database Connection Fails:**
1. Check MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)
2. Verify username/password in connection string
3. Ensure cluster is running

## 🎯 **Your App Will Work After This!**

Once you add the environment variables, your complete app will be functional:
- Frontend: `https://socio-hiro.vercel.app`
- Backend API: All `/api/*` endpoints
- Database: MongoDB Atlas connection
- Authentication: Session management 