#!/bin/bash

# Upgrade to Latest Versions Script
# Automatically upgrades all dependencies to their latest versions

echo "=========================================="
echo "🚀 Upgrade to Latest Versions"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Step 1: Backup current pubspec.yaml${NC}"
cp pubspec.yaml pubspec.yaml.backup.$(date +%Y%m%d_%H%M%S)
echo -e "${GREEN}✓ Backup created${NC}"
echo ""

echo -e "${BLUE}📊 Step 2: Checking current versions${NC}"
flutter pub outdated --mode=all | head -30
echo ""

echo -e "${YELLOW}⚠️  This will upgrade ALL packages to their LATEST versions (including major updates)${NC}"
echo -e "${YELLOW}   This may include breaking changes!${NC}"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${RED}❌ Upgrade cancelled${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🧹 Step 3: Cleaning previous builds${NC}"
flutter clean
echo -e "${GREEN}✓ Clean complete${NC}"
echo ""

echo -e "${BLUE}📦 Step 4: Upgrading dependencies to latest versions${NC}"
flutter pub upgrade --major-versions

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies upgraded successfully!${NC}"
else
    echo -e "${RED}❌ Upgrade failed. Restoring backup...${NC}"
    cp pubspec.yaml.backup.* pubspec.yaml
    flutter pub get
    exit 1
fi
echo ""

echo -e "${BLUE}🔍 Step 5: Getting new dependencies${NC}"
flutter pub get
echo ""

echo -e "${BLUE}🔧 Step 6: Applying automated fixes${NC}"
dart fix --apply
echo ""

echo -e "${BLUE}📊 Step 7: Checking final versions${NC}"
echo ""
flutter pub outdated --mode=all | head -30
echo ""

echo -e "${BLUE}🔍 Step 8: Analyzing code for issues${NC}"
flutter analyze

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Analysis passed!${NC}"
else
    echo -e "${YELLOW}⚠️  Some analysis issues found. Review them above.${NC}"
fi
echo ""

echo -e "${BLUE}🧪 Step 9: Running tests${NC}"
flutter test

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
else
    echo -e "${YELLOW}⚠️  Some tests failed. Review them above.${NC}"
fi
echo ""

echo "=========================================="
echo -e "${GREEN}✅ Upgrade Complete!${NC}"
echo "=========================================="
echo ""

echo -e "${BLUE}📊 Summary:${NC}"
echo "   • Backup: pubspec.yaml.backup.*"
echo "   • Dependencies: Upgraded to latest"
echo "   • Code: Analyzed and fixed"
echo "   • Tests: Executed"
echo ""

echo -e "${YELLOW}⚠️  Important:${NC}"
echo "   1. Review CHANGELOG files for breaking changes"
echo "   2. Test your app thoroughly"
echo "   3. Update code for major version changes"
echo "   4. If issues occur, restore from backup"
echo ""

echo -e "${BLUE}📚 Backups created:${NC}"
ls -lt pubspec.yaml.backup.* 2>/dev/null | head -5
echo ""

echo -e "${GREEN}🎉 Enjoy the latest features!${NC}"
echo ""
