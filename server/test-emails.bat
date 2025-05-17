@echo off
echo ===================================================
echo    Preplings Email Template Tester
echo ===================================================
echo.
echo This script will:
echo  1. Render all email templates with sample data
echo  2. Create enhanced golden yellow versions
echo  3. Open a preview page in your browser
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Running email template test...
echo.
node test-emails.js

echo.
echo ===================================================
echo    Test completed! Check your browser.
echo ===================================================
echo.
echo If the browser didn't open automatically, you can find
echo the templates in the server\test-emails directory.
echo.
pause
