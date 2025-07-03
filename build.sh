#!/bin/bash
set -e

echo "🚀 Starting Career Evaluation System build process... ($(date -u '+%Y-%m-%d %H:%M:%S UTC'))"

# Check for required commands
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
if [ "$(printf '%s\n' "18.0.0" "$NODE_VERSION" | sort -V | head -n1)" = "18.0.0" ]; then
    echo "✅ Node.js version $NODE_VERSION is compatible"
else
    echo "❌ Node.js version 18.0.0 or higher is required (current: $NODE_VERSION)"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm ci --include=dev || {
    echo "❌ Failed to install backend dependencies"
    exit 1
}

# Clean and install frontend dependencies
echo "🧹 Cleaning frontend dependencies..."
cd frontend || {
    echo "❌ Frontend directory not found"
    exit 1
}

rm -rf node_modules package-lock.json .cache || true

echo "📦 Installing frontend dependencies..."
npm install || {
    echo "❌ Failed to install frontend dependencies"
    cd ..
    exit 1
}

echo "🏗️  Building frontend..."
npm run build || {
    echo "❌ Frontend build failed"
    cd ..
    exit 1
}

echo "✅ Build completed successfully!"
cd ..

# Verify build output
if [ ! -d "frontend/build" ]; then
    echo "❌ Frontend build directory not found"
    exit 1
fi

echo "📊 Build summary:"
echo "  Backend: Ready"
echo "  Frontend: Built to frontend/build/"
echo "  Ready for deployment!" 