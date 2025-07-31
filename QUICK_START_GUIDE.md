# Quick Start Guide - SocioHiro

## 🎯 What is SocioHiro?

SocioHiro is a modern web application that helps businesses manage their Instagram presence efficiently. It provides content management, automation, analytics, and campaign tools all in one platform.

## 🚀 Key Features at a Glance

### 📱 Content Management
- **Instagram Sync**: Automatically sync your Instagram posts, reels, and stories
- **Performance Tracking**: Visual indicators for content performance
- **Media Support**: Handle images, videos, and carousel posts
- **Flip View**: Toggle between Instagram view and app data view

### 🤖 Automation System
- **Smart Rules**: Create automated responses based on content triggers
- **Campaign Management**: Schedule and manage marketing campaigns
- **Real-time Monitoring**: Track automation performance and logs

### 📊 Analytics Dashboard
- **Engagement Metrics**: Comprehensive Instagram analytics
- **Performance Insights**: Track content performance over time
- **Real-time Data**: Live updates from Instagram API

## 🛠️ Tech Stack

**Frontend**: React 19 + Vite + Tailwind CSS  
**Backend**: Node.js + Express + MongoDB  
**APIs**: Instagram Graph API + Webhooks  
**Deployment**: Vercel (Frontend) + Railway (Backend)

## 📦 Installation (5 minutes)

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/sociohiro.git
cd sociohiro
npm run install:all
```

### 2. Environment Setup
Create `.env` files in both `backend/` and `frontend/` directories:

**Backend (.env)**
```env
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_CALLBACK_URL=http://localhost:5000/api/auth/instagram/callback
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5000
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000
VITE_INSTAGRAM_CLIENT_ID=your_instagram_client_id
```

### 3. Start Development
```bash
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🚀 Deployment (10 minutes)

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway)
1. Connect GitHub repository to Railway
2. Set environment variables
3. Deploy automatically

## 🎯 Demo Features

### Content Management
1. **Login with Instagram**: OAuth integration
2. **View Content**: See all your Instagram posts
3. **Performance Tracking**: Visual performance indicators
4. **Flip View**: Toggle between Instagram and app views

### Automation
1. **Create Rules**: Set up automation triggers
2. **Configure Responses**: Define automated actions
3. **Monitor Performance**: Track automation effectiveness

### Analytics
1. **Engagement Metrics**: View likes, comments, shares
2. **Performance Insights**: Track content performance
3. **Campaign Analytics**: Monitor campaign effectiveness

## 📊 Project Structure

```
SocioHiro/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   └── services/    # API services
│   └── package.json
├── backend/           # Node.js API
│   ├── src/
│   │   ├── controllers/  # API controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── services/     # Business logic
│   └── package.json
└── README.md
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only

# Building
npm run build            # Build frontend for production
npm run start            # Start production server

# Utilities
npm run clean            # Clean node_modules
npm run install:all      # Install all dependencies
```

## 🎯 Key Components

### ContentCard.jsx
- Displays Instagram content with performance metrics
- Flip view between Instagram and app data
- Real-time engagement tracking
- Media support (images, videos, carousel)

### Automation System
- Rule-based automation triggers
- Multi-condition workflows
- Performance monitoring
- Real-time execution logs

### Analytics Dashboard
- Comprehensive Instagram metrics
- Performance tracking over time
- Campaign effectiveness monitoring
- Real-time data updates

## 🚀 Ready for Production

### Security Features
- Instagram OAuth authentication
- JWT token management
- Secure API endpoints
- CORS configuration

### Performance Optimizations
- React 19 with latest features
- Vite for fast builds
- Tailwind CSS for styling
- MongoDB for data persistence

### Deployment Ready
- Vercel configuration for frontend
- Railway/Render ready for backend
- Environment variable management
- Production build optimization

## 📞 Support

- **Documentation**: Check `/docs` folder
- **Issues**: GitHub Issues
- **Deployment**: See `VERCEL_DEPLOYMENT_GUIDE.md`
- **Full Guide**: See main `README.md`

---

**SocioHiro** - A modern, production-ready Instagram management platform built with React, Node.js, and MongoDB. Perfect for businesses looking to streamline their social media operations.

*Ready for deployment and team collaboration.* 🚀 