#!/bin/bash

echo "🚀 Starting SocioHiro deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build frontend
echo "🔨 Building frontend..."
npm run build:full

# Start backend server (which will serve the frontend)
echo "🌐 Starting server..."
cd backend && npm start 