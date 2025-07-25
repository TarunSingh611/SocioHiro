# SocioHiro - Social Media Management Platform

A modern, unified SaaS platform for managing and automating business activities across multiple social media platforms.

## 🚀 Features

### Core Functionality
- **Multi-Platform Management**: Connect and manage Instagram, Facebook, WhatsApp, and more
- **Automated Messaging**: Create rules for personalized DM responses
- **Campaign Scheduling**: Schedule posts, stories, and campaigns across platforms
- **Product Management**: Sync product catalogs and manage shoppable posts
- **Order Management**: Track orders and sales from social channels
- **Analytics Dashboard**: Comprehensive business metrics and insights
- **Multi-Account Support**: Manage multiple social accounts and brands
- **Real-Time Automation**: Webhooks and instant automation triggers

### Technical Stack
- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js with OAuth
- **API**: RESTful endpoints with proper error handling

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Instagram Developer Account

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
SocioHiro/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── middleware/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_CALLBACK_URL=http://localhost:5000/api/auth/instagram/callback
```

## 🚀 Usage

1. **Start the backend server**: `npm run dev` (in backend directory)
2. **Start the frontend**: `npm run dev` (in frontend directory)
3. **Access the application**: http://localhost:5173
4. **Connect your Instagram account** and start managing your social media presence

## 📊 API Endpoints

### Authentication
- `GET /api/auth/instagram` - Instagram OAuth login
- `GET /api/auth/instagram/callback` - OAuth callback
- `GET /api/auth/logout` - Logout
- `GET /api/auth/status` - Check authentication status

### Campaigns
- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create new campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `POST /api/campaigns/:id/publish` - Publish to Instagram

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/sync` - Sync to Instagram

### Orders
- `GET /api/orders` - List all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Analytics
- `GET /api/analytics/summary` - Dashboard summary
- `GET /api/analytics/orders` - Order analytics
- `GET /api/analytics/products` - Product analytics
- `GET /api/analytics/engagement` - Engagement analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, email support@sociohiro.com or create an issue in this repository.

---

**SocioHiro** - Empowering businesses to manage their social media presence efficiently and effectively. 