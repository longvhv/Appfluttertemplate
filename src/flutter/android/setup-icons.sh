#!/bin/bash

# Android Icon Setup Script
# Creates mipmap directories for app icons

echo "🎨 Setting up Android icon directories..."

cd "$(dirname "$0")/app/src/main/res"

# Create mipmap directories
DENSITIES=("mdpi" "hdpi" "xhdpi" "xxhdpi" "xxxhdpi")

for density in "${DENSITIES[@]}"; do
    DIR="mipmap-$density"
    if [ ! -d "$DIR" ]; then
        mkdir -p "$DIR"
        echo "✅ Created $DIR"
    else
        echo "⏭️  $DIR already exists"
    fi
done

echo ""
echo "📁 Icon directory structure:"
ls -la mipmap-* 2>/dev/null | grep "^d"

echo ""
echo "⚠️  PNG icon files need to be generated!"
echo ""
echo "Choose a method:"
echo "1. Use flutter_launcher_icons (Recommended)"
echo "   Add to pubspec.yaml and run: flutter pub run flutter_launcher_icons"
echo ""
echo "2. Use Android Studio"
echo "   Open android/ folder > Right-click res > New > Image Asset"
echo ""
echo "3. Use online tool"
echo "   Visit https://icon.kitchen/ or https://appicon.co/"
echo ""
echo "See GENERATE_ICONS.md for detailed instructions."
echo ""
echo "✅ Directory setup complete!"
