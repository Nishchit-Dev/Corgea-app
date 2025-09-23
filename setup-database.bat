@echo off
echo 🔧 AISecure Database Setup
echo ========================
echo.

echo Step 1: Creating .env file...
node Backend\scripts\create-env-interactive.js

echo.
echo Step 2: Setting up database...
node Backend\scripts\setup-complete-database.js

echo.
echo Step 3: Starting backend server...
cd Backend
npm start

pause


