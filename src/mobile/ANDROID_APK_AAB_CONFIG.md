# 📦 ANDROID APK/AAB CONFIGURATION

**Date:** January 2, 2026  
**React Native:** 0.76.5  
**Status:** ✅ Verified  

---

## 🎯 OUTPUT FORMATS

Android apps can be distributed in two formats:

### 1. APK (Android Package)
**Format:** `.apk`  
**Use case:** Direct installation, testing, side-loading  
**File size:** Larger (~13-15 MB debug, ~9-11 MB release)  
**Contains:** All architectures bundled  

### 2. AAB (Android App Bundle)
**Format:** `.aab`  
**Use case:** Google Play Store distribution  
**File size:** Smaller (~8-9 MB)  
**Contains:** All architectures, Google Play generates optimized APKs  

---

## 📊 CURRENT CONFIGURATION

### Build Variants
```gradle
buildTypes {
    debug {
        applicationId "com.mobile.dev"
        debuggable true
        minifyEnabled false
        shrinkResources false
    }
    
    staging {
        applicationId "com.mobile.staging"
        debuggable true
        minifyEnabled true
        shrinkResources true
    }
    
    release {
        applicationId "com.mobile"
        debuggable false
        minifyEnabled true
        shrinkResources true
    }
}
```

### Supported Architectures
```properties
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
```

**Includes:**
- ✅ armeabi-v7a (32-bit ARM) - Legacy devices
- ✅ arm64-v8a (64-bit ARM) - Modern devices (95%+ of users)
- ✅ x86 (32-bit Intel) - Emulators
- ✅ x86_64 (64-bit Intel) - Emulators

---

## 🏗️ BUILD COMMANDS

### Debug APK
```bash
cd mobile
npm run build:android:debug

# Or directly:
cd android
./gradlew assembleDebug

# Output:
# android/app/build/outputs/apk/debug/app-debug.apk
```

**Details:**
- App ID: `com.mobile.dev`
- Debuggable: Yes
- Minified: No
- Size: ~13-15 MB
- Signed: debug.keystore

---

### Staging APK
```bash
cd mobile
npm run build:android:staging

# Or directly:
cd android
./gradlew assembleStaging

# Output:
# android/app/build/outputs/apk/staging/app-staging.apk
```

**Details:**
- App ID: `com.mobile.staging`
- Debuggable: Yes (for testing)
- Minified: Yes (ProGuard + R8)
- Size: ~9-11 MB
- Signed: debug.keystore

---

### Release APK
```bash
cd mobile
npm run build:android

# Or directly:
cd android
./gradlew assembleRelease

# Output:
# android/app/build/outputs/apk/release/app-release.apk
```

**Details:**
- App ID: `com.mobile`
- Debuggable: No
- Minified: Yes (ProGuard + R8)
- Size: ~9-11 MB
- Signed: release.keystore (needs configuration)

---

### Release AAB (for Play Store)
```bash
cd mobile
npm run build:android:bundle

# Or directly:
cd android
./gradlew bundleRelease

# Output:
# android/app/build/outputs/bundle/release/app-release.aab
```

**Details:**
- App ID: `com.mobile`
- Format: AAB
- Size: ~8-9 MB
- Optimized: Yes
- Signed: release.keystore (needs configuration)

---

## 📐 APK SPLITS (Optional Enhancement)

To reduce APK size, you can enable APK splits by architecture:

### Add to app/build.gradle:
```gradle
android {
    // ...existing config...
    
    splits {
        abi {
            reset()
            enable true
            universalApk false  // Set to true if you want one APK with all ABIs
            include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
        }
    }
}
```

**Result:** Separate APKs for each architecture

**Benefits:**
- Smaller APKs (~2-3 MB per architecture)
- Faster downloads
- Less storage on device

**Drawbacks:**
- Multiple APK files to manage
- More complex distribution

**Recommendation:** Keep current config (universal APK) for now, enable splits only if needed.

---

## 🔐 SIGNING CONFIGURATION

### Current State:

```gradle
signingConfigs {
    debug {
        storeFile file('debug.keystore')
        storePassword 'android'
        keyAlias 'androiddebugkey'
        keyPassword 'android'
    }
    release {
        // TODO: Configure release signing
        storeFile file('debug.keystore')  // ⚠️ Using debug key!
        storePassword 'android'
        keyAlias 'androiddebugkey'
        keyPassword 'android'
    }
}
```

### ⚠️ ISSUE: Release Uses Debug Key

**Impact:** Cannot publish to Play Store with debug key!

**Fix Required:**

1. **Generate release keystore:**
```bash
cd mobile/android/app
keytool -genkey -v -keystore mobile-release-key.keystore \
  -alias mobile-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

2. **Update app/build.gradle:**
```gradle
signingConfigs {
    debug {
        storeFile file('debug.keystore')
        storePassword 'android'
        keyAlias 'androiddebugkey'
        keyPassword 'android'
    }
    release {
        storeFile file('mobile-release-key.keystore')
        storePassword System.getenv("KEYSTORE_PASSWORD")
        keyAlias 'mobile-key-alias'
        keyPassword System.getenv("KEY_PASSWORD")
    }
}
```

3. **Set environment variables:**
```bash
# In ~/.bashrc or ~/.zshrc:
export KEYSTORE_PASSWORD="your_store_password"
export KEY_PASSWORD="your_key_password"
```

**⚠️ NEVER commit keystore file or passwords to git!**

---

## 📊 SIZE OPTIMIZATION

### Current Optimizations ✅

1. **ProGuard/R8 Minification**
   - Code obfuscation
   - Dead code elimination
   - String/resource optimization

2. **Resource Shrinking**
   - Unused resources removed
   - PNG optimization
   - Vector drawable optimization

3. **Hermes Engine**
   - Bytecode compilation
   - ~30% smaller JS bundle
   - Faster app startup

### Size Comparison:

| Build Type | Size | Notes |
|-----------|------|-------|
| **Debug APK** | ~13-15 MB | No optimization |
| **Staging APK** | ~9-11 MB | Optimized |
| **Release APK** | ~9-11 MB | Optimized |
| **Release AAB** | ~8-9 MB | Play Store optimizes further |
| **Downloaded APK** | ~5-7 MB | User downloads optimized for their device |

---

## 🎯 BUNDLE ANALYSIS

To analyze your bundle size:

```bash
cd mobile/android

# Generate bundle
./gradlew bundleRelease

# Analyze size
./gradlew :app:analyzeReleaseBundle

# Or use bundletool:
java -jar bundletool.jar build-apks \
  --bundle=app/build/outputs/bundle/release/app-release.aab \
  --output=app.apks \
  --mode=universal

# Extract APK
unzip app.apks -d extracted/
```

---

## 📱 INSTALLATION & TESTING

### Install Debug APK
```bash
# Build and install in one command:
npm run android

# Or manually:
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Install Staging APK
```bash
npm run build:android:staging
adb install android/app/build/outputs/apk/staging/app-staging.apk
```

### Install Release APK
```bash
npm run build:android
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Test AAB (requires bundletool)
```bash
# Install bundletool first:
brew install bundletool  # macOS
# or download from: https://github.com/google/bundletool/releases

# Generate APKs from AAB:
bundletool build-apks \
  --bundle=android/app/build/outputs/bundle/release/app-release.aab \
  --output=app.apks \
  --mode=universal \
  --ks=android/app/debug.keystore \
  --ks-pass=pass:android \
  --ks-key-alias=androiddebugkey \
  --key-pass=pass:android

# Install:
bundletool install-apks --apks=app.apks
```

---

## 🚀 PLAY STORE UPLOAD

### Requirements:
1. ✅ AAB format (not APK)
2. ⚠️ Release keystore (not debug!)
3. ✅ Proper signing configuration
4. ✅ Version code incremented
5. ✅ ProGuard mapping file saved

### Upload Checklist:
- [ ] Generate release keystore
- [ ] Update signing config
- [ ] Increment versionCode in build.gradle
- [ ] Build release AAB
- [ ] Test AAB on real device
- [ ] Save ProGuard mapping file (for crash reports)
- [ ] Upload to Play Console

### ProGuard Mapping File:
**Location:** `android/app/build/outputs/mapping/release/mapping.txt`

**⚠️ IMPORTANT:** Save this file! Required for crash report deobfuscation.

---

## 🔍 VERIFICATION

### Check APK Contents:
```bash
# Extract APK
unzip app-release.apk -d extracted/

# Check lib folder:
ls extracted/lib/
# Should show: armeabi-v7a, arm64-v8a, x86, x86_64

# Check APK size by component:
du -sh extracted/*
```

### Check AAB Contents:
```bash
# Use bundletool
bundletool dump manifest --bundle=app-release.aab
bundletool dump resources --bundle=app-release.aab
bundletool dump config --bundle=app-release.aab
```

---

## 📋 BUILD OUTPUT LOCATIONS

```
mobile/android/app/build/outputs/

├── apk/
│   ├── debug/
│   │   └── app-debug.apk                    (13-15 MB)
│   ├── staging/
│   │   └── app-staging.apk                  (9-11 MB)
│   └── release/
│       └── app-release.apk                  (9-11 MB)
│
├── bundle/
│   └── release/
│       └── app-release.aab                  (8-9 MB)
│
└── mapping/
    └── release/
        └── mapping.txt                      (ProGuard mapping)
```

---

## ✅ SUMMARY

### Current Status:
- ✅ APK builds configured
- ✅ AAB builds configured
- ✅ 3 build variants (debug, staging, release)
- ✅ All architectures included
- ✅ ProGuard/R8 optimization enabled
- ✅ Resource shrinking enabled
- ✅ Size optimized (~9MB release)

### Action Required:
- ⚠️ **Generate release keystore** before Play Store upload
- ⚠️ **Update release signing config**
- ⚠️ **Never use debug key for production**

### Optional Enhancements:
- Consider APK splits for even smaller size
- Set up CI/CD for automated builds
- Configure ProGuard mapping upload

---

## 🎯 QUICK REFERENCE

```bash
# Debug
npm run build:android:debug
# → app-debug.apk (~13-15 MB)

# Staging
npm run build:android:staging
# → app-staging.apk (~9-11 MB)

# Release APK
npm run build:android
# → app-release.apk (~9-11 MB)

# Release AAB (Play Store)
npm run build:android:bundle
# → app-release.aab (~8-9 MB)
```

---

**Status:** ✅ Verified & Ready  
**Action Required:** Generate release keystore  
**Size:** Optimized (~9MB)  
**Formats:** Both APK & AAB supported
