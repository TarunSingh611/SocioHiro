# Vercel Configuration Fix

## ✅ **Fixed: Functions vs Builds Conflict**

The error was caused by having both `functions` and `builds` properties in `vercel.json`. Vercel doesn't allow both.

## 🔧 **Final Working Configuration:**

### `vercel.json`
```json
{
  "version": 2,
  "name": "sociohiro",
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "functions": {
    "api/index.js": {
      "maxDuration": 30
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/health",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### `api/package.json`
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
    // ... all backend dependencies
  }
}
```

## 🚀 **How It Works:**

1. **Frontend**: Built from `frontend/` → served from `frontend/dist/`
2. **API Function**: Uses `api/index.js` with dependencies from `api/package.json`
3. **Routes**: Properly mapped to handle both frontend and API

## 📊 **Expected Result:**

After redeploying:
- ✅ **No more configuration errors**
- ✅ **API function has all dependencies**
- ✅ **Frontend and backend both work**
- ✅ **Health endpoint accessible**

## 🎯 **Next Steps:**

1. **Redeploy**: Go to Vercel Dashboard → Redeploy
2. **Add Environment Variables**: MongoDB URI and Session Secret
3. **Test**: Health endpoint should work

Your configuration is now correct and should deploy successfully! 