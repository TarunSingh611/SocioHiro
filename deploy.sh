#!/bin/bash

# SocioHiro Deployment Script
# This script helps deploy the application to Vercel (frontend) and Railway (backend)

echo "🚀 SocioHiro Deployment Script"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI is not installed. Installing now..."
        npm install -g vercel
    fi
    
    print_success "All dependencies are installed!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install frontend dependencies
    cd frontend
    npm install
    cd ..
    
    # Install backend dependencies
    cd backend
    npm install
    cd ..
    
    print_success "All dependencies installed!"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    cd frontend
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_warning "Frontend .env file not found. Please create one with:"
        echo "VITE_API_URL=http://localhost:5000"
        echo "VITE_INSTAGRAM_CLIENT_ID=your_instagram_client_id"
        read -p "Press Enter to continue..."
    fi
    
    # Build the frontend
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Frontend built successfully!"
    else
        print_error "Frontend build failed!"
        exit 1
    fi
    
    cd ..
}

# Deploy frontend to Vercel
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    cd frontend
    
    # Check if user is logged in to Vercel
    if ! vercel whoami &> /dev/null; then
        print_warning "Not logged in to Vercel. Please login first:"
        vercel login
    fi
    
    # Deploy to Vercel
    print_status "Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        print_success "Frontend deployed to Vercel!"
        print_status "Please configure environment variables in Vercel dashboard:"
        echo "- VITE_API_URL (your backend URL)"
        echo "- VITE_INSTAGRAM_CLIENT_ID (your Instagram Client ID)"
    else
        print_error "Frontend deployment failed!"
        exit 1
    fi
    
    cd ..
}

# Deploy backend to Railway
deploy_backend() {
    print_status "Deploying backend to Railway..."
    
    print_status "Please follow these steps to deploy backend:"
    echo "1. Go to https://railway.app"
    echo "2. Sign up/Login with GitHub"
    echo "3. Create a new project"
    echo "4. Connect your GitHub repository"
    echo "5. Set root directory to 'backend'"
    echo "6. Configure environment variables:"
    echo "   - MONGODB_URI"
    echo "   - SESSION_SECRET"
    echo "   - INSTAGRAM_CLIENT_ID"
    echo "   - INSTAGRAM_CLIENT_SECRET"
    echo "   - INSTAGRAM_CALLBACK_URL"
    echo "   - JWT_SECRET"
    echo "   - NODE_ENV=production"
    echo "   - PORT=5000"
    
    read -p "Press Enter when backend is deployed and you have the URL..."
    
    print_success "Backend deployment instructions provided!"
}

# Test the application
test_application() {
    print_status "Testing application..."
    
    # Test frontend build
    cd frontend
    npm run build
    cd ..
    
    # Test backend start
    cd backend
    npm start &
    BACKEND_PID=$!
    
    # Wait a moment for backend to start
    sleep 5
    
    # Test backend health endpoint
    if curl -f http://localhost:5000/api/health &> /dev/null; then
        print_success "Backend is running and responding!"
    else
        print_warning "Backend health check failed. Make sure backend is running."
    fi
    
    # Stop backend
    kill $BACKEND_PID 2>/dev/null
    
    cd ..
}

# Main deployment function
main() {
    echo ""
    print_status "Starting deployment process..."
    
    # Check dependencies
    check_dependencies
    
    # Install dependencies
    install_dependencies
    
    # Test application
    test_application
    
    # Build frontend
    build_frontend
    
    # Deploy frontend
    deploy_frontend
    
    # Deploy backend
    deploy_backend
    
    echo ""
    print_success "Deployment process completed!"
    echo ""
    print_status "Next steps:"
    echo "1. Configure environment variables in Vercel dashboard"
    echo "2. Update Instagram OAuth redirect URIs with production URLs"
    echo "3. Test the complete application flow"
    echo "4. Monitor the application for any issues"
    echo ""
    print_status "For detailed instructions, see:"
    echo "- README.md (main documentation)"
    echo "- VERCEL_DEPLOYMENT_GUIDE.md (deployment guide)"
    echo "- DEPLOYMENT_CHECKLIST.md (deployment checklist)"
}

# Check if script is run with arguments
if [ "$1" = "frontend" ]; then
    check_dependencies
    install_dependencies
    build_frontend
    deploy_frontend
elif [ "$1" = "backend" ]; then
    check_dependencies
    install_dependencies
    deploy_backend
elif [ "$1" = "test" ]; then
    check_dependencies
    install_dependencies
    test_application
elif [ "$1" = "build" ]; then
    check_dependencies
    install_dependencies
    build_frontend
else
    main
fi 