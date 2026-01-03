#!/bin/bash

# Android Debug Keystore Generator
# This script generates the debug keystore required for Android development

echo "🔐 Generating Android Debug Keystore..."
echo ""

# Check if keytool is available
if ! command -v keytool &> /dev/null; then
    echo "❌ Error: keytool not found!"
    echo "Please install JDK 17 and make sure keytool is in your PATH"
    exit 1
fi

# Navigate to app directory
cd "$(dirname "$0")"

# Check if keystore already exists
if [ -f "debug.keystore" ]; then
    echo "⚠️  Warning: debug.keystore already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled."
        exit 0
    fi
    rm debug.keystore
fi

# Generate keystore
echo "🔨 Generating keystore..."
keytool -genkey -v -keystore debug.keystore \
  -storepass android \
  -alias androiddebugkey \
  -keypass android \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=Android Debug,O=Android,C=US"

# Check if successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Debug keystore generated successfully!"
    echo ""
    echo "📍 Location: $(pwd)/debug.keystore"
    echo ""
    echo "🔑 Keystore details:"
    echo "  Store password: android"
    echo "  Key alias: androiddebugkey"
    echo "  Key password: android"
    echo ""
    echo "⚠️  IMPORTANT: This is for DEVELOPMENT ONLY!"
    echo "   Do NOT use for production releases."
    echo ""
    echo "🚀 You can now run: npm run android"
else
    echo ""
    echo "❌ Failed to generate keystore!"
    exit 1
fi
