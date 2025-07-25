# 🚀 SocioHiro Development Setup Guide

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Git** (for version control)

## 🛠️ Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd SocioHiro

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

#### Backend Setup
```bash
cd backend
cp env.example .env
```

#### Frontend Setup
```bash
cd frontend
cp env.example .env
```

### 3. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# Then update .env with:
MONGODB_URI=mongodb://localhost:27017/sociohiro
```

#### Option B: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `.env` with your Atlas connection string

### 4. Generate Session Secret
```bash
# Run this command to generate a secure session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy the output and update SESSION_SECRET in your .env file
```

## 🔑 Third-Party Credentials Required

### 1. Instagram Graph API (REQUIRED)

**Step-by-step guide:**

1. **Go to Facebook Developers**
   - Visit: https://developers.facebook.com/
   - Log in with your Facebook account

2. **Create a New App**
   - Click "Create App"
   - Select "Business" as app type
   - Fill in app details

3. **Add Instagram Graph API**
   - In your app dashboard, click "Add Product"
   - Find and add "Instagram Graph API"

4. **Configure OAuth Settings**
   - Go to "Instagram Graph API" → "Basic Display"
   - Add OAuth Redirect URIs:
     ```
     http://localhost:8080/api/auth/instagram/callback
     ```

5. **Get Your Credentials**
   - Copy your App ID → `INSTAGRAM_APP_ID`
   - Copy your App Secret → `INSTAGRAM_APP_SECRET`

6. **Update your .env file:**
   ```env
   INSTAGRAM_APP_ID=your_app_id_here
   INSTAGRAM_APP_SECRET=your_app_secret_here
   INSTAGRAM_CALLBACK_URL=http://localhost:8080/api/auth/instagram/callback
   ```

**Important:** Instagram Graph API requires:
- Instagram Business or Creator accounts
- Facebook Pages connected to Instagram
- App review for production use

### 2. Facebook API (OPTIONAL - for future features)

**Follow the same steps as Instagram, but:**
- Add "Facebook Login" product instead
- Use these redirect URIs:
  ```
  http://localhost:5000/api/auth/facebook/callback
  ```

### 3. WhatsApp Business API (OPTIONAL - for future features)

1. **Go to WhatsApp Business**
   - Visit: https://business.whatsapp.com/
   - Create a Business account

2. **Set up WhatsApp Business API**
   - Follow the official documentation
   - Get your access token and phone number ID

3. **Update your .env file:**
   ```env
   WHATSAPP_ACCESS_TOKEN=your_access_token
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
   ```

## 🚀 Running the Application

### Development Mode

#### Start Backend
```bash
cd backend
npm run dev
# Server will start on http://localhost:8080
```

#### Start Frontend
```bash
cd frontend
npm run dev
# App will start on http://localhost:5173
```

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Production Backend
```bash
cd backend
npm start
```

## 🔧 Environment Variables Summary

### Backend (.env) - Required Variables

| Variable | Description | Required | Source |
|----------|-------------|----------|---------|
| `MONGODB_URI` | Database connection string | ✅ | MongoDB Atlas or local |
| `SESSION_SECRET` | Session security key | ✅ | Generate with Node.js |
| `INSTAGRAM_APP_ID` | Instagram App ID | ✅ | Facebook Developers |
| `INSTAGRAM_APP_SECRET` | Instagram App Secret | ✅ | Facebook Developers |
| `PORT` | Server port | ❌ | Default: 5000 |
| `NODE_ENV` | Environment mode | ❌ | Default: development |

### Frontend (.env) - Required Variables

| Variable | Description | Required | Source |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | ✅ | Your backend URL |
| `VITE_APP_NAME` | Application name | ❌ | Default: SocioHiro |

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in .env
   - For Atlas: Check IP whitelist

2. **Instagram OAuth Error**
   - Verify redirect URI matches exactly
   - Check if app is in development mode
   - Ensure Instagram Basic Display is added

3. **CORS Errors**
   - Verify FRONTEND_URL in backend .env
   - Check if frontend is running on correct port

4. **Session Issues**
   - Generate a new SESSION_SECRET
   - Clear browser cookies

### Debug Mode

Enable debug logging:
```env
LOG_LEVEL=debug
```

## 📱 Testing the App

1. **Start both servers** (backend + frontend)
2. **Visit** http://localhost:5173
3. **Click "Continue with Social Media"**
4. **Complete Instagram OAuth**
5. **Explore the dashboard!**

## 🔒 Security Notes

- **Never commit .env files** to version control
- **Use strong session secrets** in production
- **Enable HTTPS** in production
- **Set up proper CORS** for production domains
- **Use environment-specific** configurations

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Check console logs for error messages
4. Create an issue in the repository

---

**Happy coding with SocioHiro! 🎉** 