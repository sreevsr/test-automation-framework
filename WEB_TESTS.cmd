@echo off
cls
echo ================================================================
echo                       WEB TESTS ONLY
echo ================================================================
echo.
echo Running web tests (@web tag) to validate UI functionality
echo Testing user interface, forms, navigation, and interactions
echo.

echo Command: npx codeceptjs run --config codecept.final.conf.js --grep web
echo.

npx codeceptjs run --config codecept.final.conf.js --grep web

echo.
echo ================================================================
echo                    WEB TESTS COMPLETED
echo ================================================================
echo.

if %errorlevel% equ 0 (
    echo ✅ PERFECT! All web tests passed!
    echo Your user interface is working correctly.
) else if %errorlevel% equ 1 (
    echo ⚠️ Web tests ran but some may have failed
    echo Review browser interactions and element locators
) else (
    echo ❌ Web tests failed to execute properly
    echo Check browser setup and configuration
)

echo.
echo 🌐 Web Test Coverage:
echo   ✓ Page loading and navigation
echo   ✓ Form interactions
echo   ✓ User interface elements
echo   ✓ Cross-browser compatibility
echo.
echo 🎯 Next Steps:
echo   - For backend testing: API_TESTS.cmd  
echo   - For full suite: REGRESSION_TESTS.cmd
echo   - For quick validation: SMOKE_TESTS.cmd
echo.
pause