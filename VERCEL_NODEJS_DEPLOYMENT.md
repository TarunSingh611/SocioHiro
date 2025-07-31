# 🚀 Vercel Node.js Deployment Guide

This guide explains how to deploy a Node.js backend on Vercel without requiring a build step.

## 🔧 How Vercel Handles Node.js

Vercel automatically detects Node.js applications and handles them as serverless functions. Here's how it works:

### 1. **No Build Step Required**
- Node.js applications don't need a build step like React apps
- Vercel automatically installs dependencies and runs the server
- The `@vercel/node` builder handles everything

### 2. **Automatic Detection**
- Vercel detects `package.json` files
- Automatically installs dependencies
- Runs the entry point (usually `server.js` or `index.js`)

## 📁 Project Structure for Vercel

```
your-project/
├── frontend/           # React app (needs build)
│   ├── package.json
│   └── src/
├── backend/           # Node.js app (no build needed)
│   ├── package.json
│   └── src/
│       └── server.js  # Entry point
├── vercel.json        # Vercel configuration
└── package.json       # Root package.json
```

## ⚙️ Vercel Configuration

### vercel.json
```json
{
  "version": 2,
  "name": "your-app",
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "backend/src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/src/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/$1"
    }
  ]
}
```

## 🔧 Backend Setup

### 1. **Entry Point**
Make sure your backend has a clear entry point:

```javascript
// backend/src/server.js
const express = require('express');
const app = express();

// Your routes and middleware here

// For Vercel, export the app
module.exports = app;

// For local development, listen on port
if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port', process.env.PORT || 3000);
  });
}
```

### 2. **Package.json**
Your backend `package.json` should have:

```json
{
  "name": "backend",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    // ... other dependencies
  }
}
```

## 🚀 Deployment Steps

### 1. **Connect to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 2. **Set Environment Variables**
In Vercel dashboard, add:
```env
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
NODE_ENV=production
# ... other variables
```

### 3. **Deploy**
- Vercel will automatically:
  - Install dependencies for both frontend and backend
  - Build the frontend (React app)
  - Deploy the backend as serverless functions
  - Set up routing

## 🔍 Troubleshooting

### Common Issues

1. **"Function Runtimes must have a valid version"**
   - Remove `runtime` property from `vercel.json`
   - Use only `maxDuration` in functions config

2. **Backend not found**
   - Check the path in `vercel.json`
   - Ensure `server.js` exists at the specified path

3. **Dependencies not installed**
   - Make sure `package.json` exists in backend folder
   - Check that all dependencies are listed

4. **Environment variables not working**
   - Set variables in Vercel dashboard
   - Restart deployment after adding variables

### Debug Commands

```bash
# Test locally
npm run dev

# Check Vercel configuration
vercel --debug

# View deployment logs
vercel logs
```

## 📊 Monitoring

### Vercel Dashboard
- **Functions**: Monitor API performance
- **Logs**: View server logs
- **Analytics**: Track usage

### Environment Variables
- Set in Vercel dashboard
- Available to both frontend and backend
- Automatically injected at runtime

## 🎯 Best Practices

### 1. **Entry Point**
- Use a single entry point (`server.js`)
- Export the Express app
- Handle both development and production

### 2. **Dependencies**
- Keep dependencies in respective `package.json` files
- Don't mix frontend and backend dependencies

### 3. **Environment Variables**
- Set all variables in Vercel dashboard
- Use different variables for development and production

### 4. **File Structure**
- Keep frontend and backend separate
- Use clear paths in `vercel.json`
- Follow Vercel's recommended structure

## 🚀 Advanced Configuration

### Custom Domains
1. Add domain in Vercel dashboard
2. Update environment variables
3. Configure DNS records

### Edge Functions
- API routes automatically use edge functions
- Faster response times globally
- No additional configuration needed

### Caching
- Vercel automatically caches static assets
- Configure cache headers for API responses
- Use CDN for better performance

---

**🎉 Your Node.js backend is now running on Vercel!**

The backend will be available at `https://your-app.vercel.app/api/*` and the frontend at `https://your-app.vercel.app`. 