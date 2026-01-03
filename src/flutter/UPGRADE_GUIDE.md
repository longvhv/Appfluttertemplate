# 📦 Dependency Upgrade Guide

**Quick Reference for Keeping Dependencies Up-to-Date**

---

## 🚀 Quick Commands

### **Check What's Outdated**

```bash
cd flutter
flutter pub outdated
```

### **Upgrade Automatically**

**macOS/Linux:**
```bash
./upgrade_to_latest.sh
```

**Windows:**
```cmd
upgrade_to_latest.bat
```

### **Check Specific Package**

```bash
flutter pub outdated <package_name>
```

**Examples:**
```bash
flutter pub outdated flutter_bloc
flutter pub outdated dio
flutter pub outdated go_router
```

---

## 📋 Current Dependencies (As of Setup)

### **State Management - BLoC Pattern**
```yaml
flutter_bloc: ^8.1.6
bloc: ^8.1.4
bloc_concurrency: ^0.2.5
equatable: ^2.1.0
hydrated_bloc: ^9.1.5
replay_bloc: ^0.2.7
```

**Check Latest:**
```bash
flutter pub outdated flutter_bloc bloc bloc_concurrency equatable hydrated_bloc replay_bloc
```

### **Navigation**
```yaml
go_router: ^15.0.0
```

**Check Latest:**
```bash
flutter pub outdated go_router
```

### **Storage**
```yaml
hive: ^2.3.0
hive_flutter: ^1.2.0
shared_preferences: ^2.4.0
flutter_secure_storage: ^10.0.0
path_provider: ^2.2.0
```

**Check Latest:**
```bash
flutter pub outdated hive hive_flutter shared_preferences flutter_secure_storage path_provider
```

### **Network**
```yaml
dio: ^5.8.0
http: ^1.3.0
connectivity_plus: ^6.2.0
```

**Check Latest:**
```bash
flutter pub outdated dio http connectivity_plus
```

### **UI Components**
```yaml
material_design_icons_flutter: ^8.0.7296
flutter_svg: ^2.0.15
cached_network_image: ^3.5.0
shimmer: ^3.0.0
lottie: ^3.3.0
```

**Check Latest:**
```bash
flutter pub outdated material_design_icons_flutter flutter_svg cached_network_image shimmer lottie
```

### **Forms**
```yaml
flutter_form_builder: ^10.0.0
form_builder_validators: ^12.0.0
```

**Check Latest:**
```bash
flutter pub outdated flutter_form_builder form_builder_validators
```

### **Charts**
```yaml
fl_chart: ^0.70.0
```

**Check Latest:**
```bash
flutter pub outdated fl_chart
```

### **All Dependencies**
```yaml
# Total: 63 packages
# Check all at once:
flutter pub outdated
```

---

## 🎯 Upgrade Strategies

### **Strategy 1: Aggressive (All Major Updates)**

**Use when:** You want all latest features

```bash
flutter pub upgrade --major-versions
```

**Pros:** Latest features, best performance  
**Cons:** May have breaking changes

---

### **Strategy 2: Conservative (Minor/Patch Only)**

**Use when:** Stability is critical

```bash
flutter pub upgrade
```

**Pros:** Fewer breaking changes  
**Cons:** Missing latest features

---

### **Strategy 3: Selective (Per Package)**

**Use when:** You need control

```bash
flutter pub upgrade <package_name>
```

**Example:**
```bash
flutter pub upgrade flutter_bloc
flutter pub upgrade dio
```

**Pros:** Full control, easy debugging  
**Cons:** Time-consuming

---

### **Strategy 4: Pin Critical Packages**

**Use when:** Certain versions must be fixed

```yaml
dependencies:
  flutter_bloc: 8.1.6  # Exact version (no ^)
  dio: ^5.8.0          # Allow updates
```

**Pros:** Prevents unexpected changes  
**Cons:** May miss important updates

---

## 🔍 How to Check Latest Real Versions

### **Method 1: Flutter CLI** ⭐ Recommended

```bash
flutter pub outdated
```

**Output tells you:**
- Current version
- Upgradable version
- Resolvable version
- **Latest version** ← This is what you want!

---

### **Method 2: Visit pub.dev**

**Template:**
```
https://pub.dev/packages/<package_name>
```

**Examples:**
- flutter_bloc: https://pub.dev/packages/flutter_bloc
- dio: https://pub.dev/packages/dio
- go_router: https://pub.dev/packages/go_router
- hive: https://pub.dev/packages/hive

**Look for:** "Installing" tab shows latest version

---

### **Method 3: API Call**

```bash
curl https://pub.dev/api/packages/<package_name> | grep version
```

**Example:**
```bash
curl https://pub.dev/api/packages/flutter_bloc | grep version
```

---

## 📊 Upgrade Priority

### **High Priority (Upgrade Immediately)**

These should always be latest:

1. **Security packages**
   - `flutter_secure_storage`
   - `local_auth`

2. **Network packages**
   - `dio`
   - `http`

**Check:**
```bash
flutter pub outdated flutter_secure_storage local_auth dio http
```

**Upgrade:**
```bash
flutter pub upgrade flutter_secure_storage local_auth dio http
```

---

### **Medium Priority (Monthly)**

Upgrade regularly but test thoroughly:

1. **State management**
   - `flutter_bloc`, `bloc`

2. **Navigation**
   - `go_router`

3. **Storage**
   - `hive`, `shared_preferences`

**Check:**
```bash
flutter pub outdated flutter_bloc bloc go_router hive shared_preferences
```

---

### **Low Priority (Quarterly)**

Stable packages, upgrade when convenient:

1. **UI components**
   - `shimmer`, `lottie`, etc.

2. **Utilities**
   - `intl`, `logger`, etc.

**Check:**
```bash
flutter pub outdated shimmer lottie intl logger
```

---

## ⚠️ Breaking Changes to Watch

### **flutter_bloc 8.x → 9.x**

**Potential breaking changes:**
- BlocProvider API changes
- BlocListener callback signature
- BlocObserver methods

**Check:**
```bash
flutter pub outdated flutter_bloc
```

**If 9.x is available:**
1. Read changelog: https://pub.dev/packages/flutter_bloc/changelog
2. Test in dev branch first
3. Update code as needed

---

### **go_router 15.x → 16.x**

**Potential breaking changes:**
- Route configuration API
- Redirect logic
- Navigation methods

**Check:**
```bash
flutter pub outdated go_router
```

**Migration:**
1. Read migration guide
2. Update route definitions
3. Test all navigation flows

---

### **dio 5.x → 6.x**

**Potential breaking changes:**
- Interceptor API
- Response type changes
- Error handling

**Check:**
```bash
flutter pub outdated dio
```

**Migration:**
1. Update interceptors
2. Check error handling
3. Test all API calls

---

## 🧪 Testing After Upgrade

### **1. Static Analysis**

```bash
flutter analyze
```

**Expect:** 0 errors

---

### **2. Unit Tests**

```bash
flutter test
```

**Expect:** All tests pass

---

### **3. Run App**

```bash
# Debug mode
flutter run

# Profile mode
flutter run --profile

# Release mode
flutter run --release
```

**Check:**
- No runtime errors
- All features work
- Performance is good

---

### **4. Platform Tests**

```bash
# Android
flutter run -d android

# iOS
flutter run -d ios

# Web
flutter run -d chrome

# Desktop
flutter run -d windows  # or macos, linux
```

**Check:** Works on all platforms

---

## 🔧 Troubleshooting

### **Problem: Version Conflict**

```
Because package_a depends on package_b ^2.0.0...
```

**Solution:**
```bash
# Try automatic resolution
flutter pub upgrade --major-versions

# Or use dependency_overrides (last resort)
```

---

### **Problem: Build Fails**

```bash
# Clean everything
flutter clean
rm -rf build/
rm pubspec.lock

# Reinstall
flutter pub get

# For Android
cd android && ./gradlew clean && cd ..

# For iOS
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

---

### **Problem: Breaking Changes**

```dart
// Old code doesn't work
```

**Solution:**
1. Check package changelog
2. Read migration guide
3. Update code
4. Use `dart fix --apply` for auto-fixes

---

## 📚 Resources

### **Official Documentation**
- Flutter: https://docs.flutter.dev
- Dart: https://dart.dev
- pub.dev: https://pub.dev

### **Package-Specific**
- flutter_bloc: https://bloclibrary.dev
- go_router: https://pub.dev/packages/go_router
- dio: https://pub.dev/packages/dio
- hive: https://pub.dev/packages/hive

### **Our Documentation**
- `HOW_TO_UPGRADE_TO_LATEST.md` - Complete upgrade guide
- `DEPENDENCIES_UPGRADE.md` - Last upgrade details
- `BLOC_IMPLEMENTATION.md` - BLoC guide
- `README.md` - Main documentation

---

## ✅ Upgrade Checklist

**Before Upgrade:**
- [ ] Backup `pubspec.yaml` and `pubspec.lock`
- [ ] Commit current working state to git
- [ ] Read changelogs for major updates
- [ ] Plan downtime if needed

**During Upgrade:**
- [ ] Run `flutter pub outdated`
- [ ] Run upgrade command
- [ ] Run `dart fix --apply`
- [ ] Run `flutter analyze`
- [ ] Fix any errors

**After Upgrade:**
- [ ] Run `flutter test`
- [ ] Test app on all platforms
- [ ] Check performance
- [ ] Update documentation
- [ ] Commit changes

**If Issues:**
- [ ] Check error messages
- [ ] Read migration guides
- [ ] Ask for help (Stack Overflow, GitHub Issues)
- [ ] Rollback if needed

---

## 🎯 Recommended Schedule

| Frequency | Action | Packages |
|-----------|--------|----------|
| **Weekly** | Check for updates | All |
| **Monthly** | Upgrade minor/patch | All |
| **Quarterly** | Upgrade major | Non-critical |
| **Immediately** | Upgrade security | Security-related |
| **As needed** | Upgrade features | When needed |

---

## 📞 Getting Help

### **If Upgrade Fails:**

1. **Check Flutter version**
   ```bash
   flutter --version
   ```

2. **Check for known issues**
   - Package GitHub issues
   - pub.dev changelog
   - Stack Overflow

3. **Ask for help**
   - Flutter Discord
   - Stack Overflow
   - GitHub Issues

4. **Rollback if needed**
   ```bash
   git reset --hard HEAD
   # or
   cp pubspec.yaml.backup pubspec.yaml
   flutter pub get
   ```

---

## 🎉 Success Metrics

**You've successfully upgraded when:**

✅ All packages show "Up-to-date" in `flutter pub outdated`  
✅ `flutter analyze` shows 0 errors  
✅ All tests pass  
✅ App runs on all platforms  
✅ No performance degradation  
✅ All features work correctly

---

**Happy Upgrading! 🚀**

**Scripts:**
- `./check_latest_versions.sh` - Check what's outdated
- `./upgrade_to_latest.sh` - Automatic upgrade

**Documentation:**
- `HOW_TO_UPGRADE_TO_LATEST.md` - Complete guide
- This file - Quick reference

---

**Last Updated:** January 3, 2026  
**Version:** 1.0.0
