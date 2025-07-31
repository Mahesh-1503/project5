#!/bin/bash

echo "🚀 Starting deployment build process..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install and build client
echo "📦 Installing client dependencies..."
cd client
npm install

echo "🔨 Building React app..."
npm run build

# Check if build was successful
if [ -f "build/index.html" ]; then
    echo "✅ React build successful! Found build/index.html"
    echo "📁 Build directory contents:"
    ls -la build/
else
    echo "❌ React build failed! build/index.html not found"
    echo "📁 Current directory contents:"
    ls -la
    exit 1
fi

cd ..

echo "✅ Build process completed successfully!"
echo "🚀 Ready to deploy!" 