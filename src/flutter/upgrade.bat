@echo off
REM Flutter Dependencies Upgrade Script for Windows
REM Automates the upgrade and migration process

echo ======================================
echo Flutter Dependencies Upgrade Script
echo ======================================
echo.

REM Check if Flutter is installed
where flutter >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Flutter not found!
    echo Please install Flutter first: https://flutter.dev/docs/get-started/install
    pause
    exit /b 1
)

echo [Step 1] Cleaning previous builds...
call flutter clean
echo Done.
echo.

echo [Step 2] Getting dependencies...
call flutter pub get
echo Done.
echo.

echo [Step 3] Upgrading dependencies...
call flutter pub upgrade --major-versions
echo Done.
echo.

echo [Step 4] Checking outdated packages...
call flutter pub outdated
echo.

echo [Step 5] Running build_runner (code generation)...
call flutter pub run build_runner build --delete-conflicting-outputs 2>nul
if %errorlevel% equ 0 (
    echo Code generation complete.
) else (
    echo No code generation needed or build_runner not configured.
)
echo.

echo [Step 6] Analyzing code...
call flutter analyze
if %errorlevel% equ 0 (
    echo No issues found.
) else (
    echo Please fix analyzer warnings.
)
echo.

echo [Step 7] Running tests...
call flutter test 2>nul
if %errorlevel% equ 0 (
    echo All tests passed.
) else (
    echo Some tests failed or no tests found.
)
echo.

echo [Step 8] Building debug APK...
call flutter build apk --debug
if %errorlevel% equ 0 (
    echo Debug APK built successfully.
    echo Location: build\app\outputs\flutter-apk\app-debug.apk
) else (
    echo Debug build failed.
)
echo.

echo ======================================
echo Upgrade Process Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Review DEPENDENCIES_UPGRADE.md for changes
echo 2. Check MIGRATION_GUIDE.md for code updates
echo 3. Replace deprecated packages (QR scanner, pull to refresh)
echo 4. Test app thoroughly on device
echo.

echo Dependency Status:
call flutter pub outdated --mode=null-safety
echo.

echo IMPORTANT REMINDERS:
echo - Replace qr_code_scanner with mobile_scanner
echo - Replace pull_to_refresh with pull_to_refresh_flutter3
echo - Test all navigation (go_router 14.x)
echo - Test all forms (validators 11.x)
echo.

echo Ready to build release:
echo flutter build apk --release
echo flutter build appbundle --release
echo.

echo Happy coding!
pause
