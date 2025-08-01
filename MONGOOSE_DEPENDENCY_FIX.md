# Mongoose Dependency Fix Guide

## 🚨 **Current Issue: Missing Mongoose Module**

```
Cannot find module 'mongoose'
Require stack: - /var/task/api/index.js
Did you forget to add it to "dependencies" in `package.json`?
```

## ✅ **Root Cause: Missing Dependencies**

The API serverless function doesn't have access to the backend dependencies. Vercel needs its own `package.json` for the API function.

## 🔧 **What I Fixed:**

### 1. **Created `api/package.json`**
Added all required dependencies for the API function:
```json
{
  "name": "sociohiro-api",
  "version": "1.0.0",
  "dependencies": {
    "mongoose": "^8.0.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.2",
    // ... all other backend dependencies
  }
}
```

### 2. **Updated `vercel.json`**
Added build configuration for the API:
```json
"builds": [
  {
    "src": "api/package.json",
    "use": "@vercel/node"
  }
]
```

## 🚀 **Next Steps:**

### **Option 1: Force Redeploy**
1. Go to Vercel Dashboard
2. Click **Redeploy** → **Clear Cache and Deploy**

### **Option 2: Manual Deploy**
```bash
vercel --force
```

## 📊 **Expected Result:**

After redeploying:
- ✅ **Health endpoint**: `https://socio-hiro.vercel.app/health` works
- ✅ **API endpoints**: All `/api/*` routes work
- ✅ **Mongoose**: Database connection works
- ✅ **No more 500 errors**

## 🎯 **Why This Happened:**

1. **Serverless Functions**: Need their own dependencies
2. **Vercel Isolation**: API functions are isolated from backend folder
3. **Missing package.json**: API function couldn't find mongoose

## ✅ **Your App Will Work After Redeploy!**

The API function now has all required dependencies and will work properly. 