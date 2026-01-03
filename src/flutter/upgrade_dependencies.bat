@echo off
REM Dependencies Upgrade Script for Windows
REM Date: January 3, 2026
REM Upgrades all dependencies to latest versions

echo ==========================================
echo 📦 Dependencies Upgrade Script
echo ==========================================
echo.

REM Step 1: Backup current pubspec.yaml
echo 💾 Step 1: Backing up pubspec.yaml...
copy pubspec.yaml pubspec.yaml.backup
echo ✓ Backup created: pubspec.yaml.backup
echo.

REM Step 2: Clean previous builds
echo 🧹 Step 2: Cleaning previous builds...
flutter clean
echo.

REM Step 3: Show current dependencies
echo 📋 Step 3: Current dependencies:
flutter pub deps | more
echo.

REM Step 4: Get dependencies
echo 📦 Step 4: Getting dependencies...
flutter pub get
echo.

REM Step 5: Check for outdated packages
echo 📊 Step 5: Checking for outdated packages...
flutter pub outdated
echo.

REM Step 6: Upgrade dependencies (with confirmation)
echo ⬆️  Step 6: Upgrading dependencies to latest versions...
echo This will upgrade all dependencies including major versions.
set /p CONTINUE="Continue? (y/n): "
if /i "%CONTINUE%"=="y" (
    flutter pub upgrade --major-versions
    echo ✓ Dependencies upgraded!
) else (
    echo ⚠️  Upgrade cancelled.
    exit /b 1
)
echo.

REM Step 7: Show updated dependencies
echo 📊 Step 7: Updated dependencies:
flutter pub deps | more
echo.

REM Step 8: Apply automated fixes
echo 🔧 Step 8: Applying automated fixes...
dart fix --apply
echo.

REM Step 9: Analyze code
echo 🔍 Step 9: Analyzing code for issues...
flutter analyze
echo.

REM Step 10: Format code
echo ✨ Step 10: Formatting code...
dart format .
echo.

REM Step 11: Run tests
echo 🧪 Step 11: Running tests...
flutter test
if %errorlevel% equ 0 (
    echo ✓ All tests passed!
) else (
    echo ⚠️  Some tests failed. Please review.
)
echo.

REM Step 12: Final verification
echo ✅ Step 12: Final verification...
flutter pub outdated
echo.

echo ==========================================
echo ✅ Dependencies Upgrade Complete!
echo ==========================================
echo.
echo 📊 Summary:
echo    - Backup: pubspec.yaml.backup
echo    - Dependencies: Upgraded to latest
echo    - Code: Analyzed and formatted
echo    - Tests: Executed
echo.
echo 📚 Next Steps:
echo    1. Review DEPENDENCIES_UPGRADE.md for breaking changes
echo    2. Test your app thoroughly
echo    3. Update code if needed for major version changes
echo    4. If issues occur, restore backup:
echo       copy pubspec.yaml.backup pubspec.yaml
echo       flutter pub get
echo.
echo 📦 Package Highlights:
echo    - GoRouter: 15.0.0 (major update)
echo    - Riverpod: 2.7.0
echo    - Form Builder: 10.0.0 (major update)
echo    - Dio: 5.8.0
echo    - Secure Storage: 10.0.0 (major update)
echo.
echo 🎉 Enjoy the latest features!
echo.
pause
