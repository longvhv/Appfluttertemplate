@echo off
REM Check Latest Package Versions Script for Windows

echo ==========================================
echo 📦 Checking Latest Package Versions
echo ==========================================
echo.

echo 🔍 Step 1: Checking for outdated packages...
echo.

flutter pub outdated --mode=all

echo.
echo ==========================================
echo 📊 Analysis Complete!
echo ==========================================
echo.

echo 💡 Next Steps:
echo.
echo 1. Review the output above for 'Upgradable' packages
echo 2. Run automatic upgrade:
echo    upgrade_to_latest.bat
echo.
echo 3. Or manual upgrade:
echo    flutter pub upgrade --major-versions
echo.
echo 4. Check specific package:
echo    flutter pub outdated [package_name]
echo.

echo 📚 Useful Commands:
echo.
echo • Show dependency tree:
echo   flutter pub deps
echo.
echo • Show outdated packages:
echo   flutter pub outdated
echo.
echo • Upgrade all to latest:
echo   flutter pub upgrade --major-versions
echo.
echo • Upgrade specific package:
echo   flutter pub add [package]:[version]
echo.

echo ✅ Done!
echo.
pause
