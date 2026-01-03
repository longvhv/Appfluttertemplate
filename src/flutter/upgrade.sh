#!/bin/bash

# Flutter Dependencies Upgrade Script
# Automates the upgrade and migration process

set -e  # Exit on error

echo "======================================"
echo "Flutter Dependencies Upgrade Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo -e "${RED}❌ Error: Flutter not found!${NC}"
    echo "Please install Flutter first: https://flutter.dev/docs/get-started/install"
    exit 1
fi

echo -e "${BLUE}📦 Step 1: Cleaning previous builds...${NC}"
flutter clean
echo -e "${GREEN}✅ Clean complete${NC}"
echo ""

echo -e "${BLUE}📥 Step 2: Getting dependencies...${NC}"
flutter pub get
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${BLUE}⬆️  Step 3: Upgrading dependencies...${NC}"
flutter pub upgrade --major-versions
echo -e "${GREEN}✅ Upgrade complete${NC}"
echo ""

echo -e "${BLUE}🔍 Step 4: Checking outdated packages...${NC}"
flutter pub outdated
echo ""

echo -e "${BLUE}🏗️  Step 5: Running build_runner (code generation)...${NC}"
if flutter pub run build_runner build --delete-conflicting-outputs 2>/dev/null; then
    echo -e "${GREEN}✅ Code generation complete${NC}"
else
    echo -e "${YELLOW}⚠️  No code generation needed or build_runner not configured${NC}"
fi
echo ""

echo -e "${BLUE}🔬 Step 6: Analyzing code...${NC}"
flutter analyze
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ No issues found${NC}"
else
    echo -e "${YELLOW}⚠️  Please fix analyzer warnings${NC}"
fi
echo ""

echo -e "${BLUE}🧪 Step 7: Running tests...${NC}"
if flutter test 2>/dev/null; then
    echo -e "${GREEN}✅ All tests passed${NC}"
else
    echo -e "${YELLOW}⚠️  Some tests failed or no tests found${NC}"
fi
echo ""

echo -e "${BLUE}🔨 Step 8: Building debug APK...${NC}"
if flutter build apk --debug; then
    echo -e "${GREEN}✅ Debug APK built successfully${NC}"
    echo "Location: build/app/outputs/flutter-apk/app-debug.apk"
else
    echo -e "${RED}❌ Debug build failed${NC}"
fi
echo ""

echo "======================================"
echo -e "${GREEN}🎉 Upgrade Process Complete!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. ✅ Review DEPENDENCIES_UPGRADE.md for changes"
echo "2. ✅ Check MIGRATION_GUIDE.md for code updates"
echo "3. ✅ Replace deprecated packages (QR scanner, pull to refresh)"
echo "4. ✅ Test app thoroughly on device"
echo ""
echo -e "${BLUE}📊 Dependency Status:${NC}"
flutter pub outdated --mode=null-safety
echo ""

echo -e "${YELLOW}⚠️  IMPORTANT REMINDERS:${NC}"
echo "- Replace qr_code_scanner with mobile_scanner"
echo "- Replace pull_to_refresh with pull_to_refresh_flutter3"
echo "- Test all navigation (go_router 14.x)"
echo "- Test all forms (validators 11.x)"
echo ""

echo -e "${GREEN}Ready to build release:${NC}"
echo "flutter build apk --release"
echo "flutter build appbundle --release"
echo ""

echo "Happy coding! 🚀"
