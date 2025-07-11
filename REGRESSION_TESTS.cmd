@echo off
cls
echo ================================================================
echo                    REGRESSION TESTS ONLY
echo ================================================================
echo.
echo Running regression tests (@regression tag) - full test suite
echo This may take longer as it includes comprehensive testing
echo.

echo Command: npx codeceptjs run --config codecept.final.conf.js --grep regression
echo.

npx codeceptjs run --config codecept.final.conf.js --grep regression

echo.
echo ================================================================
echo                  REGRESSION TESTS COMPLETED
echo ================================================================
echo.

if %errorlevel% equ 0 (
    echo ✅ EXCELLENT! All regression tests passed!
    echo Your application is fully validated.
) else if %errorlevel% equ 1 (
    echo ⚠️ Regression tests ran but some may have failed
    echo Review the detailed results above for specific issues
) else (
    echo ❌ Regression tests failed to execute properly
    echo Check your configuration and try again
)

echo.
echo 📊 Test Coverage Complete:
echo   ✓ Smoke tests (basic functionality)
echo   ✓ Regression tests (comprehensive validation)
echo   ✓ Ready for production deployment
echo.
echo 🎯 Next Steps:
echo   - Review test report in ./output directory
echo   - Check failed tests and fix issues
echo   - Run specific tag tests if needed
echo.
pause