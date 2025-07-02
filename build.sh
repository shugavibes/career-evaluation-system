#!/bin/bash
set -e

echo "🚀 Starting Career Evaluation System build process..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm ci --include=dev

# Clean and install frontend dependencies
echo "🧹 Cleaning frontend dependencies..."
cd frontend
rm -rf node_modules package-lock.json || true
rm -rf .cache || true

echo "📦 Installing frontend dependencies..."
npm install

echo "🏗️  Building frontend..."
npm run build

echo "✅ Build completed successfully!"
cd ..

echo "📊 Build summary:"
echo "  Backend: Ready"
echo "  Frontend: Built to frontend/build/"
echo "  Ready for deployment!" 