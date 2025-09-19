@echo off
echo 🏥 Setting up Vaidya Dhara Frontend...
echo ======================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js ^(v16 or higher^) first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Check if we're in the frontend directory
if not exist package.json (
    echo ❌ package.json not found. Please run this script from the frontend directory.
    pause
    exit /b 1
)

REM Install dependencies
echo.
echo 📦 Installing dependencies...
npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create .env file if it doesn't exist
if not exist .env (
    echo.
    echo 🔧 Creating environment configuration...
    (
        echo # Vaidya Dhara Frontend Configuration
        echo VITE_APP_NAME=Vaidya Dhara
        echo VITE_APP_VERSION=1.0.0
        echo VITE_API_BASE_URL=http://localhost:8000
        echo VITE_APP_ENVIRONMENT=development
        echo.
        echo # Features flags
        echo VITE_ENABLE_ANALYTICS=true
        echo VITE_ENABLE_GAMIFICATION=true
        echo VITE_ENABLE_MULTILINGUAL=true
        echo.
        echo # Default settings
        echo VITE_DEFAULT_LANGUAGE=en
        echo VITE_DEFAULT_LOCATION=India
    ) > .env
    echo ✅ Environment file created ^(.env^)
) else (
    echo ✅ Environment file already exists
)

REM Create development script
(
    echo @echo off
    echo echo 🚀 Starting Vaidya Dhara Frontend Development Server...
    echo echo ==================================================
    echo.
    echo echo ⚠️  Make sure the backend server is running on http://localhost:8000
    echo echo.
    echo npm run dev
    echo pause
) > start-dev.bat

echo.
echo 🎉 Setup completed successfully!
echo ================================
echo.
echo 📋 Next steps:
echo    1. Start the backend server ^(if not already running^)
echo    2. Run: start-dev.bat  ^(or npm run dev^)
echo    3. Open: http://localhost:5173
echo.
echo 🔧 Available scripts:
echo    start-dev.bat     - Start development server
echo    npm run build     - Build for production
echo    npm run preview   - Preview production build
echo    npm run lint      - Run ESLint
echo.
echo 📚 Documentation:
echo    - Frontend README: README.md
echo    - Main project: ../README.md
echo.
echo 🆘 Need help?
echo    - Check the documentation
echo    - Verify backend is running on port 8000
echo    - Ensure all dependencies are installed
echo.
echo Happy coding! 🚀
pause
