#!/bin/bash

echo "🚀 SocioHiro Vercel Deployment Script"
echo "======================================"

echo ""
echo "📋 Prerequisites Check:"
echo "- Make sure you have Vercel CLI installed"
echo "- Make sure you're logged in to Vercel"
echo "- Make sure your code is in a GitHub repository"
echo ""

echo "🔧 Installing dependencies..."
npm run install:all

echo ""
echo "🏗️ Building the application..."
npm run build

echo ""
echo "📦 Preparing for Vercel deployment..."
echo ""
echo "⚠️  IMPORTANT: Make sure you have set up your environment variables in Vercel!"
echo ""
echo "Environment variables needed:"
echo "- MONGODB_URI"
echo "- SESSION_SECRET"
echo "- JWT_SECRET"
echo "- INSTAGRAM_CLIENT_ID"
echo "- INSTAGRAM_CLIENT_SECRET"
echo "- INSTAGRAM_CALLBACK_URL"
echo "- FRONTEND_URL"
echo "- VITE_API_URL"
echo "- NODE_ENV=production"
echo ""

echo "🚀 Ready to deploy!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Import your GitHub repository"
echo "3. Set the environment variables above"
echo "4. Deploy!"
echo ""
echo "📖 For detailed instructions, see VERCEL_QUICK_DEPLOY.md"
echo ""

read -p "Press Enter to continue..." 