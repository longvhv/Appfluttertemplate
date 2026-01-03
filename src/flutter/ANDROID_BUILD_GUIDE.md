# 📱 Android Build Guide - Flutter App

Complete guide để build và deploy Flutter app lên Android! 🚀

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Debug Build](#debug-build)
4. [Release Build](#release-build)
5. [Signing Configuration](#signing-configuration)
6. [Build APK](#build-apk)
7. [Build AAB (App Bundle)](#build-aab)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)
10. [Play Store Deployment](#play-store-deployment)

---

## ✅ PREREQUISITES

### **1. Flutter SDK**
```bash
# Check Flutter installation
flutter doctor -v
```

**Requirements:**
- ✅ Flutter SDK 3.2.0+
- ✅ Dart SDK 3.2.0+

### **2. Android Development Tools**
- ✅ Android Studio or IntelliJ IDEA
- ✅ Android SDK (API 34)
- ✅ Android SDK Build-Tools
- ✅ Android SDK Platform-Tools
- ✅ Android Emulator (optional)

### **3. Java JDK**
```bash
# Check Java version
java -version
```
**Required:** JDK 17 or higher

### **4. Environment Variables**
```bash
# Add to ~/.bashrc or ~/.zshrc (macOS/Linux)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator

# Windows (Environment Variables)
ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
```

---

## 🔧 PROJECT SETUP

### **1. Navigate to Flutter Project**
```bash
cd flutter
```

### **2. Get Dependencies**
```bash
flutter pub get
```

### **3. Configure Android**
```bash
# Create local.properties
cp android/local.properties.example android/local.properties

# Edit android/local.properties with your paths
# Example:
flutter.sdk=/Users/yourname/flutter
sdk.dir=/Users/yourname/Library/Android/sdk
```

### **4. Verify Android Setup**
```bash
flutter doctor --android-licenses  # Accept licenses
flutter doctor -v                   # Check status
```

---

## 🐛 DEBUG BUILD

### **1. Connect Device or Start Emulator**

**Physical Device:**
```bash
# Enable USB Debugging on device
# Connect via USB
adb devices  # Should show your device
```

**Emulator:**
```bash
# List available emulators
flutter emulators

# Start emulator
flutter emulators --launch <emulator_id>

# Or use Android Studio AVD Manager
```

### **2. Run Debug Build**
```bash
# Run on connected device/emulator
flutter run

# Run on specific device
flutter run -d <device_id>

# Run with hot reload
flutter run --hot
```

### **3. Build Debug APK**
```bash
flutter build apk --debug

# Output: build/app/outputs/flutter-apk/app-debug.apk
```

**Install Debug APK:**
```bash
flutter install

# Or manually
adb install build/app/outputs/flutter-apk/app-debug.apk
```

---

## 🚀 RELEASE BUILD

### **⚠️ IMPORTANT: Complete Signing Configuration First!**
See [Signing Configuration](#signing-configuration) section below.

---

## 🔐 SIGNING CONFIGURATION

### **Step 1: Generate Keystore**

**macOS/Linux:**
```bash
cd android
chmod +x generate-keystore.sh
./generate-keystore.sh
```

**Windows:**
```cmd
cd android
generate-keystore.bat
```

**Manual Generation:**
```bash
keytool -genkey -v \
  -keystore upload-keystore.jks \
  -alias upload \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**⚠️ IMPORTANT:**
- Remember your passwords!
- Keep keystore file safe
- Never commit to Git
- Make backups!

### **Step 2: Create key.properties**
```bash
cd android
cp key.properties.example key.properties
```

**Edit `android/key.properties`:**
```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=upload
storeFile=../upload-keystore.jks
```

### **Step 3: Verify Configuration**
```bash
# Check if key.properties exists
ls -la android/key.properties

# Check if keystore exists
ls -la android/upload-keystore.jks
```

---

## 📦 BUILD APK

### **Release APK (Single File)**
```bash
# Build release APK
flutter build apk --release

# Output location:
# build/app/outputs/flutter-apk/app-release.apk
```

**File sizes:**
- Debug: ~40-60 MB
- Release: ~15-25 MB (with ProGuard)

### **Split APKs (Per ABI)**
```bash
# Build split APKs (smaller size)
flutter build apk --release --split-per-abi

# Output files:
# app-armeabi-v7a-release.apk   (~8 MB)
# app-arm64-v8a-release.apk     (~10 MB)
# app-x86_64-release.apk        (~12 MB)
```

**Benefits:**
- ✅ Smaller download size
- ✅ Faster installation
- ✅ Better for Play Store

### **Install Release APK**
```bash
# Install on device
flutter install --release

# Or manually
adb install build/app/outputs/flutter-apk/app-release.apk
```

---

## 📦 BUILD AAB (APP BUNDLE)

**⭐ RECOMMENDED for Google Play Store**

### **Build App Bundle**
```bash
flutter build appbundle --release

# Output location:
# build/app/outputs/bundle/release/app-release.aab
```

**Why AAB?**
- ✅ Required by Google Play (August 2021+)
- ✅ Smaller download size for users
- ✅ Optimized for each device
- ✅ Dynamic delivery support

**File size:**
- AAB: ~15-20 MB
- User downloads: ~8-12 MB (optimized)

### **Test AAB Locally**
```bash
# Install bundletool
# Download from: https://github.com/google/bundletool/releases

# Extract APKs from AAB
java -jar bundletool.jar build-apks \
  --bundle=build/app/outputs/bundle/release/app-release.aab \
  --output=app.apks \
  --ks=android/upload-keystore.jks \
  --ks-key-alias=upload

# Install to device
java -jar bundletool.jar install-apks --apks=app.apks
```

---

## 🧪 TESTING

### **1. Run Tests**
```bash
# Unit tests
flutter test

# Integration tests
flutter test integration_test
```

### **2. Test on Multiple Devices**
```bash
# List all devices
flutter devices

# Run on all devices
flutter run -d all

# Run on specific device
flutter run -d <device_id>
```

### **3. Performance Profiling**
```bash
# Profile mode
flutter run --profile

# Release mode performance
flutter run --release
```

### **4. App Size Analysis**
```bash
# Analyze APK size
flutter build apk --release --analyze-size

# Detailed breakdown
flutter build apk --release --target-platform android-arm64 --analyze-size
```

---

## 🔍 TROUBLESHOOTING

### **Common Issues**

#### **1. Gradle Build Failed**
```bash
# Clean build
cd android
./gradlew clean

cd ..
flutter clean
flutter pub get
flutter build apk
```

#### **2. SDK Not Found**
```bash
# Set ANDROID_HOME
export ANDROID_HOME=$HOME/Library/Android/sdk

# Or edit android/local.properties
sdk.dir=/Users/yourname/Library/Android/sdk
```

#### **3. License Not Accepted**
```bash
flutter doctor --android-licenses
# Accept all licenses
```

#### **4. OutOfMemoryError**
```bash
# Edit android/gradle.properties
org.gradle.jvmargs=-Xmx4096m
```

#### **5. Keystore Issues**
```bash
# Verify keystore
keytool -list -v -keystore android/upload-keystore.jks
```

#### **6. ADB Not Found**
```bash
# Add platform-tools to PATH
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### **7. Multidex Issue**
```bash
# Already configured in build.gradle
# defaultConfig { multiDexEnabled true }
```

---

## 🏪 PLAY STORE DEPLOYMENT

### **Step 1: Prepare Assets**

**📱 App Icon**
- Size: 512x512 px
- Format: PNG
- No transparency

**📸 Screenshots**
- Phone: 16:9 ratio (1080x1920)
- Tablet: Various sizes
- Minimum 2 screenshots

**🎬 Feature Graphic**
- Size: 1024x500 px
- Format: PNG/JPEG

**📝 Store Listing**
- App name (50 chars)
- Short description (80 chars)
- Full description (4000 chars)
- Privacy policy URL

### **Step 2: Build Release AAB**
```bash
flutter build appbundle --release
```

### **Step 3: Create Release in Play Console**

1. **Go to:** https://play.google.com/console
2. **Create app** → Fill details
3. **Production** → Create new release
4. **Upload AAB:** `build/app/outputs/bundle/release/app-release.aab`
5. **Fill release notes**
6. **Review and rollout**

### **Step 4: Version Management**

**Update version in `pubspec.yaml`:**
```yaml
version: 1.0.1+2  # 1.0.1 = version name, 2 = version code
```

**Build number convention:**
- Major.Minor.Patch+BuildNumber
- Example: 1.0.0+1, 1.0.1+2, 1.1.0+3

---

## 📊 BUILD CONFIGURATION SUMMARY

### **Files Created:**

| File | Purpose |
|------|---------|
| `build.gradle` | App build configuration |
| `AndroidManifest.xml` | App permissions & components |
| `MainActivity.kt` | Main activity in Kotlin |
| `proguard-rules.pro` | Code obfuscation rules |
| `strings.xml` | String resources |
| `colors.xml` | Color resources |
| `styles.xml` | Theme styles |
| `key.properties` | Signing configuration |
| `upload-keystore.jks` | Release signing key |

### **Build Variants:**

| Variant | Purpose | Size | Debuggable |
|---------|---------|------|------------|
| Debug | Development | ~50 MB | ✅ Yes |
| Profile | Performance testing | ~20 MB | ❌ No |
| Release | Production | ~15 MB | ❌ No |

### **APK vs AAB:**

| Feature | APK | AAB |
|---------|-----|-----|
| Play Store | ✅ Supported | ✅ Required |
| Direct Install | ✅ Yes | ❌ No |
| Size | Larger | Smaller |
| Optimization | Manual | Automatic |
| Recommended | Testing | Production |

---

## 🎯 QUICK COMMANDS

### **Development**
```bash
# Run app
flutter run

# Hot reload
r (in terminal)

# Hot restart
R (in terminal)

# Debug info
flutter logs
```

### **Build**
```bash
# Debug APK
flutter build apk --debug

# Release APK
flutter build apk --release

# Release AAB (Play Store)
flutter build appbundle --release

# Split APKs
flutter build apk --release --split-per-abi
```

### **Install**
```bash
# Install debug
flutter install

# Install release
flutter install --release

# Manual install
adb install path/to/app.apk
```

### **Clean**
```bash
# Flutter clean
flutter clean

# Full clean
flutter clean
cd android && ./gradlew clean && cd ..
flutter pub get
```

---

## 📝 CHECKLIST

### **Before Building Release:**
- [ ] Updated version in `pubspec.yaml`
- [ ] Created and configured `key.properties`
- [ ] Generated release keystore
- [ ] Backed up keystore file
- [ ] Updated app icons
- [ ] Updated app name in `strings.xml`
- [ ] Reviewed `AndroidManifest.xml` permissions
- [ ] Tested on multiple devices
- [ ] Ran `flutter test`
- [ ] Checked app size with `--analyze-size`

### **Before Play Store Upload:**
- [ ] Built release AAB
- [ ] Prepared screenshots
- [ ] Prepared feature graphic
- [ ] Written store description
- [ ] Created privacy policy
- [ ] Set up content rating
- [ ] Configured pricing
- [ ] Added release notes

---

## 🔗 USEFUL LINKS

- **Flutter Android Docs:** https://docs.flutter.dev/deployment/android
- **Play Console:** https://play.google.com/console
- **Android Studio:** https://developer.android.com/studio
- **Bundletool:** https://github.com/google/bundletool
- **Flutter DevTools:** https://docs.flutter.dev/tools/devtools

---

## 💡 PRO TIPS

1. **Use AAB for Play Store** - Always upload AAB instead of APK
2. **Test on Real Devices** - Emulators don't show all issues
3. **Enable ProGuard** - Already configured for release builds
4. **Backup Keystore** - Store in multiple secure locations
5. **Version Consistently** - Use semantic versioning
6. **Monitor App Size** - Use `--analyze-size` flag
7. **Test Before Release** - Use internal testing track
8. **Keep Dependencies Updated** - Run `flutter pub outdated`

---

## 🎉 SUMMARY

### **You Now Have:**
- ✅ Complete Android build configuration
- ✅ Gradle setup with ProGuard
- ✅ Signing configuration for release
- ✅ Build scripts for keystore generation
- ✅ Optimized AndroidManifest.xml
- ✅ Material Design theme resources
- ✅ Launch screen with gradient
- ✅ File provider configuration
- ✅ Backup rules for security
- ✅ Complete build guide

### **Ready to:**
- 🚀 Build debug APK
- 🚀 Build release APK
- 🚀 Build release AAB for Play Store
- 🚀 Deploy to Google Play
- 🚀 Update app versions
- 🚀 Test on devices

---

**🎊 ANDROID BUILD CONFIGURATION COMPLETE! 🎊**

**Need help?** Check the troubleshooting section or Flutter documentation!

**Built with ❤️ for Android**
