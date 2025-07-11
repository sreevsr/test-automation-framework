@echo off
echo Windows Test Automation Framework - Fix Script
echo =============================================
echo.

echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)

echo.
echo Cleaning node_modules and package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Testing basic configuration (most reliable)...
npm run test:basic:smoke
if %errorlevel% equ 0 (
    echo SUCCESS: Basic BDD tests are working!
    echo You can now use: npm run test:basic:smoke
) else (
    echo Basic tests failed, trying simple API tests...
    npm run test:simple:api
    if %errorlevel% equ 0 (
        echo SUCCESS: Simple API tests are working!
        echo You can now use: npm run test:simple:api
    ) else (
        echo ERROR: All test configurations failed
        echo Please check the troubleshooting guide in WINDOWS_SETUP.md
    )
)

echo.
echo Available working commands:
echo   npm run test:basic:smoke    - Basic BDD smoke tests (MOST RELIABLE)
echo   npm run test:simple:api     - Simple API tests (fallback)
echo   npm run debug              - Environment validation
echo.
pause