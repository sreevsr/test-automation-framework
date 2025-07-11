@echo off
cls
echo ================================================================
echo              TAG-BASED TEST EXECUTION MENU
echo ================================================================
echo.
echo Choose the type of tests you want to run:
echo.
echo  1. Smoke Tests        - Quick basic functionality validation
echo  2. Regression Tests   - Comprehensive full test suite  
echo  3. API Tests          - Backend/API endpoint testing
echo  4. Web Tests          - Frontend/UI testing
echo  5. Product Tests      - Product-related functionality
echo  6. Cart Tests         - Shopping cart operations
echo  7. Login Tests        - Authentication flows
echo  8. Security Tests     - Security and authorization
echo  9. Performance Tests  - Performance and load testing
echo 10. All Tests          - Run everything (no filtering)
echo.
echo  0. Exit
echo.
set /p choice="Enter your choice (0-10): "

if "%choice%"=="1" goto smoke
if "%choice%"=="2" goto regression
if "%choice%"=="3" goto api
if "%choice%"=="4" goto web
if "%choice%"=="5" goto products
if "%choice%"=="6" goto cart
if "%choice%"=="7" goto login
if "%choice%"=="8" goto security
if "%choice%"=="9" goto performance
if "%choice%"=="10" goto all
if "%choice%"=="0" goto exit

echo Invalid choice. Please try again.
pause
goto menu

:smoke
echo.
echo Running Smoke Tests...
call SMOKE_TESTS.cmd
goto end

:regression
echo.
echo Running Regression Tests...
call REGRESSION_TESTS.cmd
goto end

:api
echo.
echo Running API Tests...
call API_TESTS.cmd
goto end

:web
echo.
echo Running Web Tests...
call WEB_TESTS.cmd
goto end

:products
echo.
echo Running Product Tests...
npx codeceptjs run --config codecept.final.conf.js --grep products
goto end

:cart
echo.
echo Running Cart Tests...
npx codeceptjs run --config codecept.final.conf.js --grep cart
goto end

:login
echo.
echo Running Login Tests...
npx codeceptjs run --config codecept.final.conf.js --grep login
goto end

:security
echo.
echo Running Security Tests...
npx codeceptjs run --config codecept.final.conf.js --grep security
goto end

:performance
echo.
echo Running Performance Tests...
npx codeceptjs run --config codecept.final.conf.js --grep performance
goto end

:all
echo.
echo Running All Tests...
call QUICK_TEST.cmd
goto end

:exit
echo.
echo Goodbye!
exit /b 0

:end
echo.
echo ================================================================
echo                    EXECUTION COMPLETED
echo ================================================================
echo.
echo 🎯 Other Options:
echo   - Run TAG_MENU.cmd again for different test types
echo   - Use npm run test:by-tag ^<tag^> for command line
echo   - Check ./output directory for detailed reports
echo.
pause