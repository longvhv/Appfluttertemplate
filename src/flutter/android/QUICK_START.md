# 🚀 Android Quick Start Guide

## ⚡ **Fast Build - 3 Steps**

### **Step 1: Verify Flutter Setup**
```bash
flutter doctor -v
```

Expected output:
```
✅ Flutter (Channel stable, 3.38.0)
✅ Android toolchain - develop for Android devices
✅ Android Studio
```

---

### **Step 2: First Build** (Auto-generates missing files)
```bash
cd flutter
flutter build apk --debug
```

This will:
- ✅ Download gradle-wrapper.jar
- ✅ Create local.properties
- ✅ Install dependencies
- ✅ Build debug APK

**Time:** ~2-5 minutes (first time)

---

### **Step 3: Install & Run**
```bash
# Connect device or start emulator
flutter devices

# Install app
flutter install

# Or run directly
flutter run
```

---

## 📱 **BUILD COMMANDS**

### **Quick Commands:**

```bash
# Debug APK (fastest)
flutter build apk --debug

# Release APK (optimized)
flutter build apk --release

# App Bundle (Play Store)
flutter build appbundle --release

# Split by ABI (smaller files)
flutter build apk --release --split-per-abi
```

---

## 🎯 **OUTPUT FILES**

### **Debug APK:**
```
flutter/build/app/outputs/flutter-apk/app-debug.apk
Size: ~30-50 MB
```

### **Release APK:**
```
flutter/build/app/outputs/flutter-apk/app-release.apk
Size: ~20-40 MB (with R8 optimization)
```

### **App Bundle:**
```
flutter/build/app/outputs/bundle/release/app-release.aab
Size: ~15-30 MB
```

---

## 🔧 **CONFIGURATION (Optional)**

### **Change App Name:**
Edit `android/app/src/main/AndroidManifest.xml`:
```xml
<application
    android:label="Your App Name"
    ...>
```

### **Change Package Name:**
1. Edit `android/app/build.gradle`:
   ```gradle
   defaultConfig {
       applicationId "com.yourcompany.yourapp"
   }
   ```

2. Rename folders:
   ```
   android/app/src/main/kotlin/com/yourcompany/yourapp/
   ```

3. Update `MainActivity.kt`:
   ```kotlin
   package com.yourcompany.yourapp
   ```

---

## 🔐 **RELEASE SIGNING (Production)**

### **Generate Keystore:**
```bash
cd flutter/android

# Linux/Mac
./generate-keystore.sh

# Windows
generate-keystore.bat
```

### **Create key.properties:**
```properties
storePassword=YourStorePassword
keyPassword=YourKeyPassword
keyAlias=upload
storeFile=upload-keystore.jks
```

**Location:** `android/key.properties`

---

## 🐛 **COMMON ISSUES & FIXES**

### **Issue 1: SDK not found**
```bash
# Create local.properties with SDK path
echo "sdk.dir=/path/to/Android/Sdk" > android/local.properties
```

**Find SDK path:**
- **Mac:** `~/Library/Android/sdk`
- **Linux:** `~/Android/Sdk`
- **Windows:** `C:\Users\YourName\AppData\Local\Android\Sdk`

---

### **Issue 2: Gradle build failed**
```bash
# Clean & rebuild
flutter clean
cd android
./gradlew clean
cd ..
flutter build apk
```

---

### **Issue 3: gradle-wrapper.jar missing**
```bash
# Just run build, it will auto-download
flutter build apk
```

---

### **Issue 4: License not accepted**
```bash
flutter doctor --android-licenses
# Press 'y' to accept all
```

---

## 📊 **BUILD VARIANTS**

### **Debug** (Development)
```bash
flutter build apk --debug
# or
flutter run
```
- ✅ Fast build
- ✅ Hot reload
- ✅ Debug tools
- ❌ Larger size
- ❌ Slower performance

### **Release** (Production)
```bash
flutter build apk --release
```
- ✅ Optimized
- ✅ Smaller size
- ✅ Fast performance
- ✅ ProGuard/R8
- ❌ No debugging

### **Profile** (Performance Testing)
```bash
flutter build apk --profile
```
- ✅ Performance profiling
- ✅ Optimized build
- ✅ Debug tools

---

## 🎯 **QUICK REFERENCE**

### **Most Used Commands:**

| Command | Purpose | Time |
|---------|---------|------|
| `flutter run` | Run on device | ~30s |
| `flutter build apk --debug` | Debug APK | ~1-2 min |
| `flutter build apk --release` | Release APK | ~2-3 min |
| `flutter install` | Install APK | ~10s |
| `flutter clean` | Clean build | ~5s |

---

## ✅ **CHECKLIST**

Before building:
- [ ] Flutter installed (`flutter --version`)
- [ ] Android SDK installed (`flutter doctor`)
- [ ] Device connected or emulator running (`flutter devices`)
- [ ] In flutter directory (`cd flutter`)

First build will:
- [x] Download dependencies (~100 MB)
- [x] Generate gradle-wrapper.jar
- [x] Create local.properties
- [x] Build APK

---

## 🎊 **SUCCESS!**

After successful build:

```bash
✓ Built build/app/outputs/flutter-apk/app-release.apk (XX.XMB)
```

**Install it:**
```bash
adb install build/app/outputs/flutter-apk/app-release.apk
```

**Or share it:**
The APK file can be directly installed on any Android device!

---

## 📚 **NEXT STEPS**

### **For Development:**
```bash
flutter run --hot
# Code changes auto-reload
```

### **For Testing:**
```bash
flutter build apk --release
# Share APK with testers
```

### **For Play Store:**
```bash
# 1. Create release keystore
./android/generate-keystore.sh

# 2. Build app bundle
flutter build appbundle --release

# 3. Upload to Play Console
# build/app/outputs/bundle/release/app-release.aab
```

---

## 🔗 **USEFUL LINKS**

- [Flutter Android Setup](https://docs.flutter.dev/get-started/install/windows#android-setup)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [Play Store Publishing](https://support.google.com/googleplay/android-developer/answer/9859152)

---

**Last Updated:** January 3, 2026  
**Flutter Version:** 3.38.0  
**Gradle Version:** 8.3  
**Status:** ✅ Ready to Build
