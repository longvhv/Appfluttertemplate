@echo off
REM Upgrade to Latest Versions Script for Windows

echo ==========================================
echo 🚀 Upgrade to Latest Versions
echo ==========================================
echo.

echo 📋 Step 1: Backup current pubspec.yaml
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set mytime=%mytime: =0%
copy pubspec.yaml pubspec.yaml.backup.%mydate%_%mytime%
echo ✓ Backup created: pubspec.yaml.backup.%mydate%_%mytime%
echo.

echo 📊 Step 2: Checking current versions
flutter pub outdated --mode=all | more
echo.

echo ⚠️  This will upgrade ALL packages to their LATEST versions (including major updates)
echo    This may include breaking changes!
echo.
set /p CONTINUE="Continue? (y/n): "

if /i not "%CONTINUE%"=="y" (
    echo ❌ Upgrade cancelled
    exit /b 1
)

echo.
echo 🧹 Step 3: Cleaning previous builds
flutter clean
echo ✓ Clean complete
echo.

echo 📦 Step 4: Upgrading dependencies to latest versions
flutter pub upgrade --major-versions

if %errorlevel% equ 0 (
    echo ✓ Dependencies upgraded successfully!
) else (
    echo ❌ Upgrade failed. Please check errors above.
    exit /b 1
)
echo.

echo 🔍 Step 5: Getting new dependencies
flutter pub get
echo.

echo 🔧 Step 6: Applying automated fixes
dart fix --apply
echo.

echo 📊 Step 7: Checking final versions
echo.
flutter pub outdated --mode=all | more
echo.

echo 🔍 Step 8: Analyzing code for issues
flutter analyze

if %errorlevel% equ 0 (
    echo ✓ Analysis passed!
) else (
    echo ⚠️  Some analysis issues found. Review them above.
)
echo.

echo 🧪 Step 9: Running tests
flutter test

if %errorlevel% equ 0 (
    echo ✓ All tests passed!
) else (
    echo ⚠️  Some tests failed. Review them above.
)
echo.

echo ==========================================
echo ✅ Upgrade Complete!
echo ==========================================
echo.

echo 📊 Summary:
echo    • Backup: pubspec.yaml.backup.%mydate%_%mytime%
echo    • Dependencies: Upgraded to latest
echo    • Code: Analyzed and fixed
echo    • Tests: Executed
echo.

echo ⚠️  Important:
echo    1. Review CHANGELOG files for breaking changes
echo    2. Test your app thoroughly
echo    3. Update code for major version changes
echo    4. If issues occur, restore from backup
echo.

echo 🎉 Enjoy the latest features!
echo.
pause
