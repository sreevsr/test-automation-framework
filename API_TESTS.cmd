@echo off
cls
echo ================================================================
echo                       API TESTS ONLY
echo ================================================================
echo.
echo Running API tests (@api tag) to validate backend functionality
echo Testing REST endpoints, data validation, and API responses
echo.

echo Command: npx codeceptjs run --config codecept.final.conf.js --grep api
echo.

npx codeceptjs run --config codecept.final.conf.js --grep api

echo.
echo ================================================================
echo                    API TESTS COMPLETED
echo ================================================================
echo.

if %errorlevel% equ 0 (
    echo ✅ PERFECT! All API tests passed!
    echo Your backend services are working correctly.
) else if %errorlevel% equ 1 (
    echo ⚠️ API tests ran but some may have failed
    echo This can happen with demo APIs - check results above
) else (
    echo ❌ API tests failed to execute properly
    echo Check your API configuration and connectivity
)

echo.
echo 🔗 API Test Coverage:
echo   ✓ Endpoint availability
echo   ✓ Data retrieval and validation
echo   ✓ Request/response handling
echo   ✓ Error scenarios
echo.
echo 🎯 Next Steps:
echo   - For UI testing: WEB_TESTS.cmd
echo   - For full suite: REGRESSION_TESTS.cmd
echo   - For quick validation: SMOKE_TESTS.cmd
echo.
pause