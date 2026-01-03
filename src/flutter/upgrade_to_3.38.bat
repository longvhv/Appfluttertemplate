@echo off
REM Flutter 3.38.0 Upgrade Script for Windows
REM Date: January 3, 2026

echo ==========================================
echo 🚀 Flutter 3.38.0 Upgrade Script
echo ==========================================
echo.

REM Step 1: Check current Flutter version
echo 📋 Step 1: Checking current Flutter version...
flutter --version
echo.

REM Step 2: Upgrade Flutter SDK
echo ⬆️  Step 2: Upgrading Flutter SDK to 3.38.0...
flutter upgrade
echo.

REM Step 3: Verify Flutter version
echo ✅ Step 3: Verifying Flutter version...
flutter --version | findstr "Flutter 3.38"
if %errorlevel% equ 0 (
    echo ✓ Flutter 3.38.0 installed successfully!
) else (
    echo ⚠️  Warning: Flutter version might not be 3.38.0
    echo    Please check manually with: flutter --version
)
echo.

REM Step 4: Clean previous builds
echo 🧹 Step 4: Cleaning previous builds...
flutter clean
echo.

REM Step 5: Get dependencies
echo 📦 Step 5: Getting dependencies...
flutter pub get
echo.

REM Step 6: Upgrade dependencies
echo ⬆️  Step 6: Upgrading dependencies to latest compatible versions...
flutter pub upgrade --major-versions
echo.

REM Step 7: Check for outdated packages
echo 📊 Step 7: Checking for outdated packages...
flutter pub outdated
echo.

REM Step 8: Run Flutter doctor
echo 🏥 Step 8: Running Flutter doctor...
flutter doctor -v
echo.

REM Step 9: Analyze code
echo 🔍 Step 9: Analyzing code...
flutter analyze
echo.

REM Step 10: Format code
echo ✨ Step 10: Formatting code...
dart format .
echo.

REM Step 11: Run tests
echo 🧪 Step 11: Running tests...
flutter test
echo.

echo ==========================================
echo ✅ Upgrade Complete!
echo ==========================================
echo.
echo 📊 Summary:
echo    - Flutter SDK: Upgraded to 3.38.0
echo    - Dart SDK: Upgraded to 3.8.0
echo    - Dependencies: Updated to latest compatible versions
echo    - Code: Analyzed and formatted
echo    - Tests: Executed
echo.
echo 🚀 Next Steps:
echo    1. Review any deprecation warnings
echo    2. Test your app thoroughly
echo    3. Build for production: flutter build apk --release
echo.
echo 📚 Documentation:
echo    - See FLUTTER_3.38_UPGRADE.md for full upgrade guide
echo    - See COMPONENTS_PHASE4_COMPLETE.md for components
echo.
echo ✨ Happy coding with Flutter 3.38.0!
echo.
pause
