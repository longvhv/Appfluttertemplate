@echo off
REM Android Icon Setup Script - Windows
REM Creates mipmap directories for app icons

echo 🎨 Setting up Android icon directories...
echo.

cd /d "%~dp0app\src\main\res"

REM Create mipmap directories
set DENSITIES=mdpi hdpi xhdpi xxhdpi xxxhdpi

for %%d in (%DENSITIES%) do (
    if not exist "mipmap-%%d" (
        mkdir "mipmap-%%d"
        echo ✅ Created mipmap-%%d
    ) else (
        echo ⏭️  mipmap-%%d already exists
    )
)

echo.
echo 📁 Icon directory structure:
dir /ad /b mipmap-*

echo.
echo ⚠️  PNG icon files need to be generated!
echo.
echo Choose a method:
echo 1. Use flutter_launcher_icons (Recommended)
echo    Add to pubspec.yaml and run: flutter pub run flutter_launcher_icons
echo.
echo 2. Use Android Studio
echo    Open android/ folder ^> Right-click res ^> New ^> Image Asset
echo.
echo 3. Use online tool
echo    Visit https://icon.kitchen/ or https://appicon.co/
echo.
echo See GENERATE_ICONS.md for detailed instructions.
echo.
echo ✅ Directory setup complete!
pause
