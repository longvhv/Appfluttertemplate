# Android Debug Keystore

This is a placeholder for the Android debug keystore.

## ⚠️ IMPORTANT: Generate Debug Keystore

The debug keystore is required for development builds but should NOT be committed to git.

### Generate Debug Keystore:

```bash
cd mobile/android/app

keytool -genkey -v -keystore debug.keystore \
  -storepass android \
  -alias androiddebugkey \
  -keypass android \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=Android Debug,O=Android,C=US"
```

### Keystore Details:
- **File:** `debug.keystore`
- **Store Password:** `android`
- **Key Alias:** `androiddebugkey`
- **Key Password:** `android`
- **Algorithm:** RSA
- **Key Size:** 2048
- **Validity:** 10000 days

### ⚠️ For Development ONLY!

This keystore is for **development and debugging only**.

**DO NOT USE FOR PRODUCTION RELEASE!**

For production, generate a proper release keystore:

```bash
keytool -genkey -v -keystore mobile-release-key.keystore \
  -alias mobile-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

Then update `android/app/build.gradle`:

```gradle
signingConfigs {
    release {
        storeFile file('mobile-release-key.keystore')
        storePassword 'YOUR_STORE_PASSWORD'
        keyAlias 'mobile-key-alias'
        keyPassword 'YOUR_KEY_PASSWORD'
    }
}
```

### Git Ignore:
Make sure keystores are in `.gitignore`:

```
# Android keystores
*.keystore
*.jks
```

---

**Created:** January 2, 2026  
**Purpose:** Development signing  
**Status:** ⚠️ Must generate before building
