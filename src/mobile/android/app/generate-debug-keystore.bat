@echo off
REM Android Debug Keystore Generator (Windows)
REM This script generates the debug keystore required for Android development

echo.
echo Generating Android Debug Keystore...
echo.

REM Check if keytool is available
where keytool >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: keytool not found!
    echo Please install JDK 17 and make sure keytool is in your PATH
    pause
    exit /b 1
)

REM Navigate to app directory
cd /d "%~dp0"

REM Check if keystore already exists
if exist debug.keystore (
    echo Warning: debug.keystore already exists!
    set /p REPLY="Do you want to overwrite it? (y/N): "
    if /i not "%REPLY%"=="y" (
        echo Cancelled.
        pause
        exit /b 0
    )
    del debug.keystore
)

REM Generate keystore
echo.
echo Generating keystore...
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Debug keystore generated successfully!
    echo.
    echo Location: %CD%\debug.keystore
    echo.
    echo Keystore details:
    echo   Store password: android
    echo   Key alias: androiddebugkey
    echo   Key password: android
    echo.
    echo IMPORTANT: This is for DEVELOPMENT ONLY!
    echo Do NOT use for production releases.
    echo.
    echo You can now run: npm run android
) else (
    echo.
    echo Failed to generate keystore!
)

echo.
pause
