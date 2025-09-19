#!/bin/bash

# Vaidya Dhara Frontend Setup Script
# This script sets up the React frontend for the Vaidya Dhara project

echo "🏥 Setting up Vaidya Dhara Frontend..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to v16 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if command -v yarn &> /dev/null; then
    echo "   Using Yarn..."
    yarn install
else
    echo "   Using npm..."
    npm install
fi

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo ""
    echo "🔧 Creating environment configuration..."
    cat > .env << EOF
# Vaidya Dhara Frontend Configuration
VITE_APP_NAME=Vaidya Dhara
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_ENVIRONMENT=development

# Features flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_GAMIFICATION=true
VITE_ENABLE_MULTILINGUAL=true

# Default settings
VITE_DEFAULT_LANGUAGE=en
VITE_DEFAULT_LOCATION=India
EOF
    echo "✅ Environment file created (.env)"
else
    echo "✅ Environment file already exists"
fi

# Check if backend is running
echo ""
echo "🔍 Checking backend connection..."
if curl -s http://localhost:8000 > /dev/null; then
    echo "✅ Backend is running on http://localhost:8000"
else
    echo "⚠️  Backend is not running on http://localhost:8000"
    echo "   Please make sure to start the backend server before using the frontend."
fi

# Create development script
cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Vaidya Dhara Frontend Development Server..."
echo "=================================================="

# Check if backend is running
if ! curl -s http://localhost:8000 > /dev/null; then
    echo "⚠️  WARNING: Backend server is not running on http://localhost:8000"
    echo "   Some features may not work properly."
    echo ""
fi

# Start development server
if command -v yarn &> /dev/null; then
    yarn dev
else
    npm run dev
fi
EOF

chmod +x start-dev.sh

echo ""
echo "🎉 Setup completed successfully!"
echo "================================"
echo ""
echo "📋 Next steps:"
echo "   1. Start the backend server (if not already running)"
echo "   2. Run: ./start-dev.sh  (or npm run dev)"
echo "   3. Open: http://localhost:5173"
echo ""
echo "🔧 Available scripts:"
echo "   ./start-dev.sh    - Start development server"
echo "   npm run build     - Build for production"
echo "   npm run preview   - Preview production build"
echo "   npm run lint      - Run ESLint"
echo ""
echo "📚 Documentation:"
echo "   - Frontend README: ./README.md"
echo "   - Main project: ../README.md"
echo ""
echo "🆘 Need help?"
echo "   - Check the documentation"
echo "   - Verify backend is running on port 8000"
echo "   - Ensure all dependencies are installed"
echo ""
echo "Happy coding! 🚀"
