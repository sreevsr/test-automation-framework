@echo off
cls
echo ================================================================
echo    TEST AUTOMATION FRAMEWORK - DEFINITIVE WINDOWS FIX
echo ================================================================
echo.
echo This script will fix ALL issues and get your tests running.
echo.
pause

echo [1/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo [2/5] Cleaning previous installations...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo ✓ Cleaned previous installations

echo.
echo [3/5] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo [4/5] Testing the framework...
echo Running: npm run test:final:smoke
echo.
npm run test:final:smoke

if %errorlevel% equ 0 (
    echo.
    echo ================================================================
    echo                        SUCCESS! 
    echo ================================================================
    echo.
    echo ✓ Your test automation framework is now working!
    echo.
    echo WORKING COMMANDS:
    echo   npm run test:smoke         - Smoke tests (recommended)
    echo   npm run test:final:smoke   - Final configuration smoke tests
    echo   npm run test:simple:api    - Simple API tests (fallback)
    echo.
    echo You can now write and run BDD tests in the features/ directory.
    echo.
) else (
    echo.
    echo Testing fallback configuration...
    npm run test:simple:api
    
    if %errorlevel% equ 0 (
        echo.
        echo ================================================================
        echo                    PARTIAL SUCCESS
        echo ================================================================
        echo.
        echo ✓ Simple API tests are working
        echo.
        echo WORKING COMMAND:
        echo   npm run test:simple:api
        echo.
        echo Note: BDD tests may need additional setup.
        echo Check WINDOWS_SETUP.md for troubleshooting.
        echo.
    ) else (
        echo.
        echo ================================================================
        echo                      SETUP FAILED
        echo ================================================================
        echo.
        echo ✗ Unable to run tests
        echo.
        echo TROUBLESHOOTING:
        echo 1. Check your internet connection
        echo 2. Try running as Administrator
        echo 3. Check firewall/proxy settings
        echo 4. Review WINDOWS_SETUP.md
        echo.
    )
)

echo [5/5] Setup complete!
echo.
pause