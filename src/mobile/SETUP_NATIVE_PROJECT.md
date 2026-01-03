# React Native CLI Setup Guide 🚀

## ⚠️ IMPORTANT: Complete Native Setup Required

Tôi đã tạo sẵn cấu trúc cơ bản cho Android và iOS, nhưng bạn cần **chạy React Native CLI để generate đầy đủ native code**.

---

## 🎯 QUICK SETUP (Recommended)

### Option 1: Initialize Fresh Project (Easiest)

```bash
# 1. Tạo project mới với React Native CLI
npx react-native@latest init EnterpriseApp --template react-native-template-typescript

# 2. Copy code của chúng ta vào
cd EnterpriseApp
cp -r ../mobile/src ./
cp -r ../mobile/android ./
cp -r ../mobile/ios ./
cp ../mobile/package.json ./
cp ../mobile/tsconfig.json ./
cp ../mobile/babel.config.js ./
cp ../mobile/metro.config.js ./
cp ../mobile/index.js ./
cp ../mobile/app.json ./

# 3. Install dependencies
npm install

# 4. iOS only - Install pods
cd ios && pod install && cd ..

# 5. Run the app
npm run android  # For Android
npm run ios      # For iOS
```

---

## 📋 PREREQUISITES

### For Both Platforms:
- Node.js >= 18
- npm >= 9
- Watchman (recommended)

### For Android:
- Java Development Kit (JDK) 17
- Android Studio
- Android SDK (API 34)
- Android Emulator hoặc real device

### For iOS (macOS only):
- Xcode 14+
- CocoaPods
- iOS Simulator hoặc real device

---

## 🔧 DETAILED SETUP

### Step 1: Install React Native CLI

```bash
npm install -g react-native-cli
```

### Step 2: Verify Environment

```bash
npx react-native doctor
```

This will check:
- ✅ Node version
- ✅ npm version
- ✅ Watchman
- ✅ Android SDK
- ✅ Xcode (macOS)
- ✅ CocoaPods (macOS)

### Step 3: Android Setup

#### A. Install Android Studio
1. Download from https://developer.android.com/studio
2. Install Android SDK, Android SDK Platform, Android Virtual Device
3. Add to PATH:

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Windows:**
```
ANDROID_HOME = C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
```

#### B. Create Android Virtual Device (AVD)
1. Open Android Studio
2. Tools → Device Manager
3. Create Device → Pixel 5 → API 34
4. Finish

### Step 4: iOS Setup (macOS only)

#### A. Install Xcode
```bash
# Install from App Store
# Or download from https://developer.apple.com/xcode/
```

#### B. Install Xcode Command Line Tools
```bash
xcode-select --install
```

#### C. Install CocoaPods
```bash
sudo gem install cocoapods
```

#### D. Install iOS dependencies
```bash
cd mobile/ios
pod install
cd ..
```

---

## 🚀 RUNNING THE APP

### Android

#### Method 1: Using npm script
```bash
cd mobile
npm run android
```

#### Method 2: Manual
```bash
# Terminal 1 - Start Metro bundler
npm start

# Terminal 2 - Run on Android
npx react-native run-android
```

### iOS (macOS only)

#### Method 1: Using npm script
```bash
cd mobile
npm run ios
```

#### Method 2: Specific simulator
```bash
npm run ios -- --simulator="iPhone 15 Pro"
```

#### Method 3: Manual
```bash
# Terminal 1 - Start Metro bundler
npm start

# Terminal 2 - Run on iOS
npx react-native run-ios
```

---

## 📱 TESTING ON REAL DEVICE

### Android

1. Enable Developer Options on your device
   - Settings → About Phone → Tap Build Number 7 times
2. Enable USB Debugging
   - Settings → Developer Options → USB Debugging
3. Connect via USB
4. Run: `adb devices` to verify
5. Run: `npm run android`

### iOS

1. Open Xcode
2. File → Open → `/mobile/ios/mobile.xcworkspace`
3. Select your device from dropdown
4. Click Run (▶️)
5. Trust developer certificate on device

---

## 🛠️ TROUBLESHOOTING

### Common Issues

#### 1. Metro bundler port already in use
```bash
# Kill existing process
npx react-native start --reset-cache
```

#### 2. Android build fails
```bash
cd android
./gradlew clean
cd ..
npm run android
```

#### 3. iOS build fails
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npm run ios
```

#### 4. Module not found errors
```bash
npm install
# Android
cd android && ./gradlew clean && cd ..
# iOS
cd ios && pod install && cd ..
```

#### 5. Gradle daemon issues (Android)
```bash
cd android
./gradlew --stop
./gradlew clean
cd ..
```

#### 6. "Could not find tools.jar" (Android)
- Make sure JDK 17 is installed
- Set JAVA_HOME environment variable

---

## 📦 PROJECT STRUCTURE

```
mobile/
├── android/              # Android native code
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/mobile/
│   │   │   │   ├── MainActivity.kt
│   │   │   │   └── MainApplication.kt
│   │   │   ├── AndroidManifest.xml
│   │   │   └── res/
│   │   └── build.gradle
│   ├── build.gradle
│   ├── settings.gradle
│   └── gradlew
├── ios/                  # iOS native code
│   ├── mobile/
│   │   ├── AppDelegate.h
│   │   ├── AppDelegate.mm
│   │   ├── Info.plist
│   │   └── main.m
│   ├── mobile.xcodeproj/
│   ├── Podfile
│   └── Pods/
├── src/                  # React Native code
│   ├── components/
│   ├── screens/
│   ├── contexts/
│   ├── theme/
│   ├── navigation/
│   └── App.tsx
├── index.js             # Entry point
├── package.json
├── tsconfig.json
├── babel.config.js
└── metro.config.js
```

---

## ⚡ QUICK COMMANDS

### Development
```bash
npm start              # Start Metro bundler
npm run android        # Run on Android
npm run ios           # Run on iOS
npm run start:reset   # Clear cache and start
```

### Building
```bash
npm run build:android  # Build Android APK
npm run build:ios     # Build iOS app
```

### Cleaning
```bash
npm run clean         # Clean all
npm run clean:android # Clean Android only
npm run clean:ios     # Clean iOS only
```

### iOS Pods
```bash
npm run pod-install   # Install iOS dependencies
```

---

## 🔍 VERIFICATION CHECKLIST

Before running the app, verify:

- [ ] Node.js installed (>= 18)
- [ ] npm installed (>= 9)
- [ ] Android Studio installed (for Android)
- [ ] Xcode installed (for iOS, macOS only)
- [ ] Android SDK installed (API 34)
- [ ] CocoaPods installed (for iOS, macOS only)
- [ ] Java JDK 17 installed (for Android)
- [ ] Environment variables set (ANDROID_HOME, JAVA_HOME)
- [ ] `npm install` completed
- [ ] `pod install` completed (iOS only)
- [ ] Emulator/Simulator running OR device connected

---

## 📝 NOTES

### Current Project Status
- ✅ **60% Complete** - 30 components built
- ✅ All screens working in web version
- ✅ All components use React Native compatible code
- ✅ Navigation setup complete
- ✅ Theme system ready
- ✅ Contexts migrated

### What's Working
- ✅ Complete auth flow
- ✅ Dark/light theme
- ✅ Language switching
- ✅ All form components
- ✅ Feedback components
- ✅ Layout components

### Dependencies Installed
- `react-native` 0.73.0
- `@react-navigation` (bottom tabs + stack)
- `lucide-react-native` (icons)
- `@react-native-async-storage/async-storage`
- `@react-native-community/datetimepicker`

### Additional Setup Required
After getting the app running, you may want to:
1. Configure app icons (`android/app/src/main/res/mipmap-*/`)
2. Configure splash screen
3. Setup deep linking
4. Configure push notifications
5. Add app signing for release builds

---

## 🆘 GETTING HELP

### Official Documentation
- React Native: https://reactnative.dev/
- Android Setup: https://reactnative.dev/docs/environment-setup?os=android
- iOS Setup: https://reactnative.dev/docs/environment-setup?os=ios

### Debugging
```bash
# Enable debug menu on device
# Android: Shake device or Ctrl+M (emulator)
# iOS: Cmd+D (simulator)

# View logs
npx react-native log-android
npx react-native log-ios
```

### Common Commands
```bash
# Check environment
npx react-native doctor

# List devices
adb devices                    # Android
xcrun simctl list devices      # iOS

# Reverse port (Android)
adb reverse tcp:8081 tcp:8081

# Reload app
# Press 'r' in Metro bundler
# Or shake device → Reload
```

---

## 🎯 NEXT STEPS AFTER SETUP

1. **Run the app** - Verify everything works
2. **Test all screens** - Navigate through the app
3. **Test components** - Check FormComponentsDemo and LayoutComponentsDemo
4. **Customize** - Change app name, icon, colors
5. **Build remaining 40%** - Complete to MVP
6. **Test on real devices** - iOS and Android
7. **Optimize** - Performance, bundle size
8. **Deploy** - App Store & Play Store

---

## 📞 SUPPORT

If you encounter issues:
1. Check this guide first
2. Run `npx react-native doctor`
3. Check official React Native docs
4. Clean and rebuild
5. Create new project and copy code

---

**Last Updated:** January 2, 2026
**React Native Version:** 0.73.0
**Minimum iOS:** 13.4
**Minimum Android:** API 23 (Android 6.0)

**Status:** ✅ Ready for setup
**Next:** Run initialization commands above
