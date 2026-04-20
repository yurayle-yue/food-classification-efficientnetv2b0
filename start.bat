@echo off

:menu
cls
echo ====================================
echo  Food Classification CNN - TensorFlow.js
echo ====================================
echo.
echo [1] Install Dependencies
echo [2] Start Application
echo [3] Build for Production
echo [4] Exit
echo.
set /p choice="Select option: "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto start
if "%choice%"=="3" goto build
if "%choice%"=="4" goto end
goto menu

:install
echo.
echo ====================================
echo  Installing Dependencies...
echo ====================================
echo.
echo Installing npm packages...
call npm install
echo.
echo ====================================
echo  Installation Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Pastikan file model ada di public/models/
echo    - model.json
echo    - classes.json
echo    - nutrition.json
echo    - group1-shard*.bin (15 files)
echo.
echo 2. Pilih opsi [2] untuk menjalankan aplikasi
echo.
pause
goto menu

:start
echo.
echo ====================================
echo  Starting Application...
echo ====================================
echo.
echo React + TensorFlow.js
echo.
echo Application will open at:
echo http://localhost:3000
echo.
echo Press Ctrl+C to stop
echo.
call npm start
pause
goto menu

:build
echo.
echo ====================================
echo  Building for Production...
echo ====================================
echo.
call npm run build
echo.
echo Build complete! Files in /build folder
echo.
pause
goto menu

:end
echo.
echo Goodbye!
