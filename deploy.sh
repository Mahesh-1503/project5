#!/bin/bash

# MERN Registration App Deployment Script
# This script helps prepare your application for deployment

echo "🚀 Preparing MERN Registration App for deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Please create one from .env.example"
    echo "   cp .env.example .env"
    echo "   Then update the MONGODB_URI with your production database URL"
fi

# Check if client/.env.local exists
if [ ! -f "client/.env.local" ]; then
    echo "⚠️  Warning: client/.env.local not found. Please create one for local development"
    echo "   cd client && cp .env.example .env.local"
fi

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
cd client && npm install && cd ..

# Build frontend
echo "🔨 Building frontend..."
cd client && npm run build && cd ..

# Test the build
echo "🧪 Testing production build..."
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test API endpoint
echo "🔍 Testing API endpoint..."
curl -s http://localhost:5000/api/health > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend is running successfully"
else
    echo "❌ Backend test failed"
fi

# Kill the test server
kill $SERVER_PID 2>/dev/null

echo ""
echo "🎉 Deployment preparation completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up MongoDB Atlas database"
echo "2. Update environment variables in your deployment platform"
echo "3. Deploy to Render or Vercel using the provided guides"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "🔧 Configuration files created:"
echo "   - render.yaml (for Render deployment)"
echo "   - vercel.json (for Vercel deployment)"
echo "   - client/vercel.json (for frontend deployment)"
echo ""
echo "🌐 Your app will be available at:"
echo "   - Render: https://your-app-name.onrender.com"
echo "   - Vercel: https://your-app-name.vercel.app" 