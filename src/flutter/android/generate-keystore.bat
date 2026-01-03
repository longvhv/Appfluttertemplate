@echo off
REM Generate Android Keystore for Release Signing (Windows)
REM Run this script once to create your release keystore

echo ======================================
echo Android Keystore Generator (Windows)
echo ======================================
echo.

REM Check if keytool is available
where keytool >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: keytool not found!
    echo Please install Java JDK first.
    pause
    exit /b 1
)

REM Configuration
set KEYSTORE_NAME=upload-keystore.jks
set KEY_ALIAS=upload
set VALIDITY_DAYS=10000

echo This will create a new keystore: %KEYSTORE_NAME%
echo Key alias: %KEY_ALIAS%
echo Validity: %VALIDITY_DAYS% days (~27 years)
echo.

REM Check if keystore already exists
if exist "%KEYSTORE_NAME%" (
    echo Warning: %KEYSTORE_NAME% already exists!
    set /p confirm="Do you want to overwrite it? (yes/no): "
    if /i not "%confirm%"=="yes" (
        echo Cancelled.
        pause
        exit /b 0
    )
    del "%KEYSTORE_NAME%"
)

echo.
echo Please provide the following information:
echo Note: Remember these passwords! You'll need them for signing.
echo.

REM Generate keystore
keytool -genkey -v ^
    -keystore %KEYSTORE_NAME% ^
    -alias %KEY_ALIAS% ^
    -keyalg RSA ^
    -keysize 2048 ^
    -validity %VALIDITY_DAYS%

if %errorlevel% equ 0 (
    echo.
    echo Keystore created successfully!
    echo.
    echo Created file: %KEYSTORE_NAME%
    echo.
    echo IMPORTANT NOTES:
    echo 1. Keep this keystore file safe and secure
    echo 2. NEVER commit it to Git
    echo 3. Make a backup in a secure location
    echo 4. You'll lose the ability to update your app if you lose this file
    echo.
    echo Next steps:
    echo 1. Copy key.properties.example to key.properties
    echo 2. Edit key.properties with your keystore information
    echo 3. Keep key.properties private (it's in .gitignore)
    echo.
    echo Example key.properties content:
    echo storePassword=YOUR_KEYSTORE_PASSWORD
    echo keyPassword=YOUR_KEY_PASSWORD
    echo keyAlias=%KEY_ALIAS%
    echo storeFile=../%KEYSTORE_NAME%
    echo.
) else (
    echo Error creating keystore
    pause
    exit /b 1
)

pause
