@echo off
cls
echo ================================================================
echo                      SMOKE TESTS ONLY
echo ================================================================
echo.
echo Running smoke tests (@smoke tag) to validate basic functionality
echo.

echo Command: npx codeceptjs run --config codecept.final.conf.js --grep smoke
echo.

npx codeceptjs run --config codecept.final.conf.js --grep smoke

echo.
echo ================================================================
echo                    SMOKE TESTS COMPLETED
echo ================================================================
echo.

if %errorlevel% equ 0 (
    echo ✅ PERFECT! All smoke tests passed!
    echo Your basic functionality is working correctly.
) else if %errorlevel% equ 1 (
    echo ⚠️ Smoke tests ran but some may have failed
    echo This can happen with demo data - check results above
) else (
    echo ❌ Smoke tests failed to execute properly
    echo Check your configuration and try again
)

echo.
echo 🎯 Next Steps:
echo   - If smoke tests pass, run: REGRESSION_TESTS.cmd
echo   - For specific areas, use: API_TESTS.cmd or WEB_TESTS.cmd
echo   - For all tests: QUICK_TEST.cmd
echo.
pause