# Vite Build Fix Guide

## 🚨 **Current Issue: crypto.hash Error**

```
[vite:build-html] crypto.hash is not a function
Error: Command "cd frontend && npm install && npm run build" exited with 1
```

## ✅ **What I Fixed:**

### 1. **Updated Vite Version**
- Changed from `vite: ^7.0.4` to `vite: ^5.0.0`
- Vite 7.x has compatibility issues with Node.js 18.x

### 2. **Updated Node.js Version**
- Changed from `node: 18.x` to `node: 20.x`
- Better compatibility with Vite 5.x

### 3. **Package.json Changes**
```json
// frontend/package.json
"vite": "^5.0.0"

// package.json (root)
"engines": {
  "node": "20.x",
  "npm": ">=8.0.0"
}
```

## 🚀 **Next Steps:**

### **Option 1: Force Redeploy**
1. Go to Vercel Dashboard
2. Click "Redeploy" → "Clear Cache and Deploy"
3. This will use the updated package.json files

### **Option 2: Manual Deploy**
```bash
vercel --force
```

## 🔧 **Why This Happened:**

1. **Vite 7.x**: Has crypto.hash compatibility issues
2. **Node.js 18.x**: Not fully compatible with Vite 7.x
3. **Build Process**: Failed during HTML processing

## 📊 **Expected Result:**

After fixing:
- ✅ Build completes successfully
- ✅ No more crypto.hash errors
- ✅ Vite 5.x works with Node.js 20.x
- ✅ Frontend builds to `frontend/dist/`

## 🎯 **Alternative Fix (if still issues):**

If the above doesn't work, try:
```json
// frontend/package.json
"vite": "^4.5.0"
```

The Vite version downgrade should resolve the crypto.hash compatibility issue! 