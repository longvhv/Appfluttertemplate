# Installation Guide - React Native Mobile App 🚀

**Last Updated:** January 2, 2026  
**React Native Version:** 0.73.9  
**Status:** ✅ Ready for Installation

---

## 📋 QUICK START

### For macOS (iOS + Android)

```bash
# 1. Navigate to mobile directory
cd mobile

# 2. Install npm dependencies
npm install

# 3. Install iOS pods (macOS only)
cd ios && pod install && cd ..

# 4. Make gradlew executable
chmod +x android/gradlew

# 5. Start Metro bundler
npm start

# 6. In another terminal - Run the app
npm run android  # For Android
npm run ios      # For iOS
```

### For Linux/Windows (Android only)

```bash
# 1. Navigate to mobile directory
cd mobile

# 2. Install npm dependencies
npm install

# 3. Make gradlew executable (Linux only)
chmod +x android/gradlew

# 4. Start Metro bundler
npm start

# 5. In another terminal - Run the app
npm run android
```

---

## ✅ PREREQUISITES

### All Platforms

- [x] **Node.js** >= 18 (LTS recommended)
- [x] **npm** >= 9
- [x] **Git**
- [ ] **Watchman** (optional but recommended)

**Check versions:**
```bash
node -v    # Should be >= 18
npm -v     # Should be >= 9
git --version
```

**Install Node.js:**
- Download from: https://nodejs.org/
- Or use nvm: `nvm install 18 && nvm use 18`

**Install Watchman (optional):**
```bash
# macOS
brew install watchman

# Linux
# Follow: https://facebook.github.io/watchman/docs/install
```

---

### For Android Development

#### 1. Java Development Kit (JDK) 17

**macOS:**
```bash
brew install openjdk@17

# Add to ~/.zshrc or ~/.bash_profile
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH=$JAVA_HOME/bin:$PATH
```

**Linux:**
```bash
sudo apt update
sudo apt install openjdk-17-jdk

# Set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

**Windows:**
- Download from: https://adoptium.net/
- Set JAVA_HOME in Environment Variables

**Verify:**
```bash
java -version  # Should show version 17.x.x
```

#### 2. Android Studio

**Download:**
- https://developer.android.com/studio

**Install Components:**
1. Android SDK
2. Android SDK Platform (API 34)
3. Android SDK Build-Tools 34.0.0
4. Android Emulator
5. Android SDK Platform-Tools

**Set Environment Variables:**

**macOS/Linux - Add to ~/.zshrc or ~/.bash_profile:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

**Windows - Add to System Environment Variables:**
```
ANDROID_HOME = C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
Path = %ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%ANDROID_HOME%\tools
```

**Reload shell:**
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

**Verify:**
```bash
echo $ANDROID_HOME  # Should show path
adb --version       # Should work
```

#### 3. Create Android Virtual Device (AVD)

1. Open Android Studio
2. Tools → Device Manager (or AVD Manager)
3. Create Virtual Device
4. Choose: **Pixel 5** or **Pixel 6**
5. System Image: **Android 14 (API 34)** - Download if needed
6. Click Finish

**Start emulator:**
```bash
# List available devices
emulator -list-avds

# Start specific device
emulator @Pixel_5_API_34 &
```

---

### For iOS Development (macOS only)

#### 1. Xcode

**Install from App Store:**
- Open App Store
- Search "Xcode"
- Install (requires ~15GB)

**Or download:**
- https://developer.apple.com/xcode/

**After installation:**
```bash
# Open Xcode to accept license
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer

# Verify
xcodebuild -version  # Should show version 15.x
```

#### 2. Xcode Command Line Tools

```bash
xcode-select --install
```

If already installed:
```bash
sudo rm -rf /Library/Developer/CommandLineTools
xcode-select --install
```

#### 3. CocoaPods

```bash
# Install CocoaPods
sudo gem install cocoapods

# Verify
pod --version  # Should show 1.14.x or higher
```

If gem install fails:
```bash
# Use Homebrew
brew install cocoapods
```

#### 4. iOS Simulator

Simulators are included with Xcode.

**List available simulators:**
```bash
xcrun simctl list devices
```

**Boot simulator:**
```bash
xcrun simctl boot "iPhone 15 Pro"
```

**Or:** Open Xcode → Window → Devices and Simulators

---

## 🚀 INSTALLATION STEPS

### Step 1: Clone or Navigate to Project

```bash
# If you have the code
cd path/to/mobile

# Or clone from git
# git clone <repository-url>
# cd mobile
```

### Step 2: Install Dependencies

```bash
npm install
```

**What this installs:**
- React Native 0.73.9
- React Navigation
- Lucide icons
- AsyncStorage
- DateTimePicker
- Gesture Handler
- Reanimated
- Safe Area Context
- Screens
- SVG support
- All dev dependencies

**Expected time:** 2-5 minutes depending on internet speed

### Step 3: iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

**What this does:**
- Installs native iOS dependencies
- Links libraries to Xcode project
- Creates `.xcworkspace` file

**Expected time:** 3-10 minutes (first time)

**Common issues:**

**Error: "Unable to find a specification for..."**
```bash
# Update CocoaPods repo
pod repo update
pod install
```

**Error: "Multiple targets match implicit dependency..."**
```bash
# Clean and reinstall
rm -rf Pods Podfile.lock
pod install
```

### Step 4: Make Gradlew Executable (Unix systems)

```bash
chmod +x android/gradlew
```

### Step 5: Verify Environment

```bash
npx react-native doctor
```

**Should show:**
- ✅ Node.js
- ✅ npm
- ✅ Android SDK
- ✅ Android Studio
- ✅ Xcode (macOS)
- ✅ CocoaPods (macOS)

**Fix any ❌ issues before proceeding**

---

## 📱 RUNNING THE APP

### Option 1: Using npm scripts (Recommended)

**Start Metro Bundler (Terminal 1):**
```bash
npm start
```

**Run on Android (Terminal 2):**
```bash
npm run android
```

**Run on iOS - macOS only (Terminal 2):**
```bash
npm run ios
```

**Or specific simulator:**
```bash
npm run ios -- --simulator="iPhone 15 Pro"
npm run ios -- --simulator="iPhone SE (3rd generation)"
```

### Option 2: Using React Native CLI

**Start Metro:**
```bash
npx react-native start
```

**Run Android:**
```bash
npx react-native run-android
```

**Run iOS:**
```bash
npx react-native run-ios
```

### Option 3: Using Android Studio / Xcode

**Android:**
1. Open `android/` folder in Android Studio
2. Wait for Gradle sync
3. Click Run (▶️)

**iOS:**
1. Open `ios/mobile.xcworkspace` in Xcode (NOT .xcodeproj!)
2. Select simulator from dropdown
3. Click Run (▶️)

---

## 🎯 TESTING ON REAL DEVICES

### Android Real Device

**1. Enable Developer Options:**
- Settings → About Phone
- Tap "Build Number" 7 times

**2. Enable USB Debugging:**
- Settings → Developer Options
- Turn on "USB Debugging"

**3. Connect Device:**
```bash
# Connect via USB
# Accept debugging prompt on phone

# Verify connection
adb devices

# Should show:
# List of devices attached
# DEVICE_ID    device
```

**4. Run app:**
```bash
npm run android
```

**Troubleshooting:**

**Device not showing:**
```bash
# Kill adb server
adb kill-server
adb start-server
adb devices
```

**Multiple devices:**
```bash
# List devices
adb devices

# Run on specific device
npx react-native run-android --deviceId=DEVICE_ID
```

### iOS Real Device

**1. Apple Developer Account:**
- Free account works for development
- Sign in to Xcode: Xcode → Settings → Accounts

**2. Trust Certificate:**
- Settings → General → VPN & Device Management
- Trust your developer certificate

**3. Run from Xcode:**
- Open `ios/mobile.xcworkspace`
- Select your device from dropdown
- Click Run (▶️)

**First run:**
- Xcode will install certificate on device
- You may need to trust certificate on device

---

## 🐛 TROUBLESHOOTING

### Common Issues

#### 1. Metro Bundler - Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::8081`

**Fix:**
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill

# Or start on different port
npx react-native start --port 8088
```

#### 2. Android - Build Failed

**Error:** `Execution failed for task ':app:mergeDebugResources'`

**Fix:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**Error:** `Could not find tools.jar`

**Fix:**
```bash
# Ensure JDK 17 is installed
java -version

# Set JAVA_HOME
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

#### 3. iOS - Build Failed

**Error:** `No bundle URL present`

**Fix:**
```bash
# Clean Metro cache
npm start -- --reset-cache

# Clean Xcode build
cd ios
rm -rf build
cd ..
```

**Error:** `Could not find iPhone simulator`

**Fix:**
```bash
# List available simulators
xcrun simctl list devices

# Boot simulator first
xcrun simctl boot "iPhone 15 Pro"

# Then run app
npm run ios
```

#### 4. Pods Installation Failed

**Error:** `Unable to find a specification for...`

**Fix:**
```bash
cd ios
pod repo update
pod install
cd ..
```

**Error:** `LoadError - dlopen(...): image not found`

**Fix:**
```bash
# Reinstall CocoaPods
sudo gem uninstall cocoapods
sudo gem install cocoapods

cd ios
pod install
cd ..
```

#### 5. Module Not Found

**Error:** `Unable to resolve module...`

**Fix:**
```bash
# Clear all caches
npm start -- --reset-cache
watchman watch-del-all
rm -rf $TMPDIR/react-* $TMPDIR/metro-*

# Reinstall dependencies
rm -rf node_modules
npm install

# iOS - reinstall pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

#### 6. Gradle Daemon Issues

**Error:** `Gradle build daemon disappeared unexpectedly`

**Fix:**
```bash
cd android
./gradlew --stop
./gradlew clean
cd ..
npm run android
```

#### 7. Android Emulator Won't Start

**Fix:**
```bash
# Check virtualization
# macOS: sysctl kern.hv_support
# Linux: egrep -c '(vmx|svm)' /proc/cpuinfo

# Restart ADB
adb kill-server
adb start-server

# Cold boot emulator
emulator @Pixel_5_API_34 -no-snapshot-load
```

---

## ✅ VERIFICATION CHECKLIST

Before reporting issues, verify:

### Environment
- [ ] Node.js >= 18 installed
- [ ] npm >= 9 installed
- [ ] JDK 17 installed (for Android)
- [ ] ANDROID_HOME set (for Android)
- [ ] Xcode installed (for iOS, macOS only)
- [ ] CocoaPods installed (for iOS, macOS only)

### Installation
- [ ] `npm install` completed without errors
- [ ] `pod install` completed (iOS only)
- [ ] `npx react-native doctor` shows all ✅

### Running
- [ ] Emulator/Simulator is running OR device connected
- [ ] `adb devices` shows device (Android)
- [ ] Metro bundler is running
- [ ] No firewall blocking localhost:8081

---

## 🔄 CLEAN INSTALLATION

If everything fails, try clean installation:

```bash
# 1. Clean everything
rm -rf node_modules
rm -rf ios/Pods ios/Podfile.lock
rm -rf android/build android/app/build
rm -rf $TMPDIR/react-* $TMPDIR/metro-*

# 2. Kill all processes
adb kill-server
watchman watch-del-all
pkill -f "react-native"

# 3. Reinstall
npm install

# 4. iOS - reinstall pods (macOS)
cd ios && pod install && cd ..

# 5. Android - clean gradle
cd android && ./gradlew clean && cd ..

# 6. Start fresh
npm start -- --reset-cache

# 7. In another terminal
npm run android  # or npm run ios
```

---

## 📊 WHAT HAPPENS ON FIRST RUN

### Metro Bundler
1. Starts on port 8081
2. Watches for file changes
3. Bundles JavaScript code
4. Serves to app via localhost

### Android
1. Gradle builds Android project (~3-5 min first time)
2. Installs APK on emulator/device
3. Launches app
4. Connects to Metro bundler

### iOS
1. Xcode builds iOS project (~5-10 min first time)
2. Installs app on simulator/device
3. Launches app
4. Connects to Metro bundler

### Expected Timeline
- **First build:** 5-15 minutes
- **Subsequent builds:** 30 seconds - 2 minutes
- **Hot reload:** Instant

---

## 🎯 SUCCESS INDICATORS

### When everything is working:

1. **Metro Bundler shows:**
   ```
   ✔ Metro is ready
   ✔ Bundling complete
   ```

2. **App launches showing:**
   - Login screen
   - Beautiful UI with theme
   - Icons loading
   - No error overlays

3. **You can:**
   - Navigate between screens
   - Toggle dark/light mode
   - Switch language EN/VI
   - See all components working

---

## 📚 USEFUL COMMANDS

### Development
```bash
npm start              # Start Metro
npm start -- --reset-cache  # Clear cache
npm run android        # Run Android
npm run ios           # Run iOS
npm run lint          # Run ESLint
```

### Debugging
```bash
npx react-native log-android  # Android logs
npx react-native log-ios      # iOS logs
adb logcat                    # Android detailed logs
```

### Cleaning
```bash
npm run clean:android  # Clean Android
npm run clean:ios      # Clean iOS
watchman watch-del-all # Clear Watchman
```

### Device Management
```bash
adb devices                   # List Android devices
xcrun simctl list devices     # List iOS simulators
adb reverse tcp:8081 tcp:8081 # Forward port (Android)
```

---

## 🆘 GETTING HELP

### Official Documentation
- React Native: https://reactnative.dev/
- Android Setup: https://reactnative.dev/docs/environment-setup?os=android
- iOS Setup: https://reactnative.dev/docs/environment-setup?os=ios

### Debug in App
- **Android:** Shake device or Ctrl+M (emulator)
- **iOS:** Cmd+D (simulator)
- Select "Toggle Inspector" or "Enable Hot Reload"

### Check Logs
```bash
# Android
npx react-native log-android

# iOS
npx react-native log-ios
```

### React Native Doctor
```bash
npx react-native doctor
```

---

## 🎉 YOU'RE READY!

Once installation succeeds, you'll have:
- ✅ Full development environment
- ✅ 60% complete app with 30 components
- ✅ Hot reload for fast development
- ✅ Debug tools ready

**Next steps:**
1. Explore the app
2. Check `/mobile/src/screens/`
3. Test form components
4. Try theme switching
5. Build your features!

---

**Created:** January 2, 2026  
**Updated:** January 2, 2026  
**React Native:** 0.73.9  
**Status:** ✅ Ready to Install
