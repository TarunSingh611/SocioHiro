# SocioHiro - Social Media Management Platform

A modern, full-stack web application for managing Instagram content, campaigns, and automation. Built with React, Node.js, and MongoDB, this platform provides comprehensive social media management capabilities with a beautiful, responsive UI.

## 🚀 Live Demo

**Frontend**: [Deployed on Vercel](https://sociohiro.vercel.app)  
**Backend**: [Deployed on Railway/Render](https://sociohiro-backend.railway.app)

## ✨ Key Features

### 📱 Content Management
- **Instagram Content Sync**: Automatically sync and display Instagram posts, reels, and stories
- **Content Analytics**: Track likes, comments, shares, reach, and engagement metrics
- **Media Support**: Handle images, videos, and carousel posts
- **Performance Tracking**: Monitor content performance with visual indicators

### 🤖 Automation System
- **Smart Automation Rules**: Create automated responses based on content triggers
- **Campaign Management**: Schedule and manage marketing campaigns
- **Real-time Monitoring**: Track automation performance and logs
- **Multi-condition Triggers**: Set up complex automation workflows

### 📊 Analytics Dashboard
- **Engagement Metrics**: Comprehensive Instagram analytics
- **Performance Insights**: Track content performance over time
- **Campaign Analytics**: Monitor campaign effectiveness
- **Real-time Data**: Live updates from Instagram API

### 🔐 Authentication & Security
- **Instagram OAuth**: Secure login with Instagram accounts
- **Session Management**: Robust session handling
- **API Security**: Protected endpoints with proper authentication
- **Data Privacy**: Secure handling of user data

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload handling
- **Node-cron** - Task scheduling

### APIs & Services
- **Instagram Graph API** - Content and analytics
- **Instagram Webhooks** - Real-time updates
- **RESTful APIs** - Clean API architecture

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Instagram Developer Account
- ngrok (for local webhook testing)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/sociohiro.git
cd sociohiro
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Environment Setup**

Create `.env` files in both `backend/` and `frontend/` directories:

**Backend (.env)**
```env
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret_key
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_CALLBACK_URL=http://localhost:5000/api/auth/instagram/callback
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5000
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000
VITE_INSTAGRAM_CLIENT_ID=your_instagram_client_id
```

4. **Start the application**
```bash
# Development mode (both frontend and backend)
npm run dev

# Or start separately
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🚀 Deployment

### 🚀 Quick Vercel Deployment (Recommended)

The easiest way to deploy SocioHiro is using Vercel's unified deployment. This deploys both frontend and backend to Vercel in one go!

#### One-Click Deploy

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

2. **Set Environment Variables**
   Add these in your Vercel project settings:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/instagramstore
   SESSION_SECRET=your-super-secret-session-key
   JWT_SECRET=your-jwt-secret-key
   INSTAGRAM_CLIENT_ID=your_instagram_client_id
   INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
   INSTAGRAM_CALLBACK_URL=https://your-app.vercel.app/api/auth/instagram/callback
   FRONTEND_URL=https://your-app.vercel.app
   VITE_API_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

3. **Deploy**
   - Click "Deploy" in Vercel
   - Your app will be live in minutes!

📖 **Detailed Guide**: See [VERCEL_QUICK_DEPLOY.md](./VERCEL_QUICK_DEPLOY.md) for complete setup instructions.

### Alternative: Separate Frontend/Backend Deployment

#### Frontend Deployment (Vercel)

1. **Connect to Vercel**
```bash
npm install -g vercel
vercel login
```

2. **Deploy frontend**
```bash
cd frontend
vercel --prod
```

3. **Configure environment variables in Vercel dashboard**
- `VITE_API_URL` - Your backend API URL
- `VITE_INSTAGRAM_CLIENT_ID` - Instagram Client ID

#### Backend Deployment (Railway/Render)

1. **Deploy to Railway**
```bash
# Connect your GitHub repository
# Railway will auto-detect Node.js and deploy
```

2. **Configure environment variables**
- Add all backend environment variables
- Set `NODE_ENV=production`

3. **Update frontend API URL**
- Update `VITE_API_URL` in Vercel to point to your backend URL

### 🚀 Unified Deployment (Recommended)

The application now supports unified deployment where the backend serves the React frontend build. This simplifies deployment and reduces complexity.

#### Quick Unified Deployment

1. **Build and serve from backend**
```bash
# Build frontend and start backend server
npm run start:full

# Or use the deployment script
./deploy.sh          # Linux/Mac
deploy.bat           # Windows
```

2. **Development with unified setup**
```bash
# Start both frontend and backend in development mode
npm run dev:full

# Or start backend serving frontend build
npm run build:full && npm run start
```

#### Benefits of Unified Deployment
- **Single Server**: Only one server to deploy and manage
- **Simplified CORS**: No CORS issues since everything is served from same origin
- **Better Performance**: Reduced network requests
- **Easier Deployment**: Single deployment target
- **Production Ready**: Optimized for production environments

#### Environment Variables for Unified Deployment

**Backend (.env)**
```env
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret_key
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_CALLBACK_URL=http://localhost:5000/api/auth/instagram/callback
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://localhost:5000
```

#### Deployment Scripts

The project includes convenient deployment scripts:

- `deploy.sh` - Linux/Mac deployment script
- `deploy.bat` - Windows deployment script
- `npm run start:full` - Build frontend and start backend
- `npm run build:full` - Build frontend only

## 📁 Project Structure

```
SocioHiro/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── content/     # Content management components
│   │   │   └── automation/  # Automation components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Node.js backend application
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Custom middleware
│   │   └── utils/           # Utility functions
│   ├── testing/             # Test scripts
│   └── package.json
├── docs/                    # Documentation
└── README.md
```

## 🔧 Configuration

### Instagram API Setup

1. **Create Instagram App**
   - Go to [Facebook Developers](https://developers.facebook.com)
   - Create a new app
   - Add Instagram Basic Display product
   - Configure OAuth redirect URIs

2. **Get API Credentials**
   - Copy Client ID and Client Secret
   - Add to environment variables

3. **Configure Webhooks**
   - Set up webhook endpoints for real-time updates
   - Verify webhook signature

### Database Setup

1. **MongoDB Atlas** (Recommended)
   - Create free cluster
   - Get connection string
   - Add to environment variables

2. **Local MongoDB**
   - Install MongoDB locally
   - Create database
   - Configure connection

## 📊 API Endpoints

### Authentication
- `GET /api/auth/instagram` - Instagram OAuth login
- `GET /api/auth/instagram/callback` - OAuth callback
- `GET /api/auth/logout` - Logout
- `GET /api/auth/status` - Check auth status

### Content Management
- `GET /api/content` - List all content
- `POST /api/content` - Create content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content
- `GET /api/content/:id/analytics` - Get content analytics

### Automation
- `GET /api/automation` - List automations
- `POST /api/automation` - Create automation
- `PUT /api/automation/:id` - Update automation
- `DELETE /api/automation/:id` - Delete automation
- `GET /api/automation/:id/logs` - Get automation logs

### Campaigns
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

## 🎯 Key Features Demo

### Content Management
- **Flip View**: Toggle between Instagram view and app data view
- **Performance Tracking**: Visual indicators for content performance
- **Media Support**: Handle images, videos, and carousel posts
- **Analytics**: Real-time engagement metrics

### Automation System
- **Rule Creation**: Build complex automation rules
- **Trigger Conditions**: Set up multiple trigger conditions
- **Response Actions**: Configure automated responses
- **Performance Monitoring**: Track automation effectiveness

### Analytics Dashboard
- **Engagement Metrics**: Comprehensive Instagram analytics
- **Performance Insights**: Track content performance over time
- **Campaign Analytics**: Monitor campaign effectiveness
- **Real-time Data**: Live updates from Instagram API

## 🔍 Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run dev:full         # Start both with unified setup

# Building & Unified Deployment
npm run build            # Build frontend for production
npm run build:full       # Build frontend and install dependencies
npm run start            # Start production server
npm run start:full       # Build frontend and start backend server

# Testing
npm run test             # Run backend tests
npm run lint             # Lint frontend code

# Utilities
npm run clean            # Clean node_modules
npm run install:all      # Install all dependencies
```

### Debugging

The project includes comprehensive debugging tools:
- Debug scripts for backend development
- Error logging and monitoring
- Webhook testing utilities
- API testing scripts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: support@instagramstore.com

## 🚀 Roadmap

- [ ] Multi-platform support (Facebook, Twitter, TikTok)
- [ ] Advanced analytics and reporting
- [ ] AI-powered content suggestions
- [ ] Team collaboration features
- [ ] Mobile app development
- [ ] Advanced automation workflows
- [ ] Integration with e-commerce platforms

---

**SocioHiro** - Empowering businesses to manage their Instagram presence efficiently and effectively. Built with modern technologies and best practices for scalability and maintainability.

*Ready for production deployment and team collaboration.* 