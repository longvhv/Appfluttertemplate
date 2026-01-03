#!/bin/bash

# React Native Quick Start Script
# This script helps you initialize the React Native project properly

echo "================================================"
echo "  React Native CLI - Quick Setup"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the /mobile directory"
    exit 1
fi

echo "✅ Current directory: $(pwd)"
echo ""

# Step 1: Check Node version
echo "Step 1: Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"
echo ""

# Step 2: Install dependencies
echo "Step 2: Installing npm dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo ""

# Step 3: Check platform
echo "Step 3: Detecting platform..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "✅ macOS detected - iOS and Android available"
    PLATFORM="macos"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "✅ Linux detected - Android only"
    PLATFORM="linux"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "✅ Windows detected - Android only"
    PLATFORM="windows"
else
    echo "⚠️  Unknown platform: $OSTYPE"
    PLATFORM="unknown"
fi
echo ""

# Step 4: iOS setup (macOS only)
if [ "$PLATFORM" == "macos" ]; then
    echo "Step 4: Setting up iOS (CocoaPods)..."
    
    # Check if CocoaPods is installed
    if ! command -v pod &> /dev/null; then
        echo "⚠️  CocoaPods not found. Installing..."
        sudo gem install cocoapods
    else
        echo "✅ CocoaPods already installed"
    fi
    
    # Install pods
    echo "Installing iOS pods..."
    cd ios
    pod install
    if [ $? -eq 0 ]; then
        echo "✅ iOS pods installed successfully"
    else
        echo "❌ Failed to install iOS pods"
        cd ..
        exit 1
    fi
    cd ..
    echo ""
fi

# Step 5: Android setup
echo "Step 5: Checking Android setup..."
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  ANDROID_HOME not set"
    echo "Please set ANDROID_HOME environment variable"
    echo "Example: export ANDROID_HOME=/Users/YOUR_USERNAME/Library/Android/sdk"
else
    echo "✅ ANDROID_HOME: $ANDROID_HOME"
fi
echo ""

# Step 6: Make gradlew executable (Unix systems)
if [ "$PLATFORM" != "windows" ]; then
    echo "Step 6: Making gradlew executable..."
    chmod +x android/gradlew
    echo "✅ gradlew is now executable"
    echo ""
fi

# Step 7: Summary
echo "================================================"
echo "  ✅ Setup Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Start Metro bundler:"
echo "   npm start"
echo ""
echo "2. Run on Android (in another terminal):"
echo "   npm run android"
echo ""

if [ "$PLATFORM" == "macos" ]; then
    echo "3. Run on iOS (in another terminal):"
    echo "   npm run ios"
    echo ""
fi

echo "For more help, see SETUP_NATIVE_PROJECT.md"
echo ""

# Optional: Ask to start Metro
read -p "Do you want to start Metro bundler now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starting Metro bundler..."
    npm start
fi
