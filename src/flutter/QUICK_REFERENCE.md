# 🚀 Quick Reference Guide

**Flutter 3.38.0 Enterprise App Template**  
**Date:** January 3, 2026

---

## 📊 Project Overview

| Metric | Value |
|--------|-------|
| **Flutter Version** | 3.38.0 ✨ Latest |
| **Dart Version** | 3.8.0 ✨ Latest |
| **Total Components** | 42 (15 atoms + 27 molecules) |
| **Total Screens** | 15 production-ready |
| **Dependencies** | 57 packages (all latest) |
| **Lines of Code** | ~9,730 (components only) |
| **Platforms** | Android, iOS, Web, Desktop |
| **Languages** | English, Vietnamese |

---

## ⚡ Quick Commands

### **Setup & Run**
```bash
# Navigate to project
cd flutter

# Install dependencies
flutter pub get

# Run on Android
flutter run -d android

# Run on iOS
flutter run -d ios

# Run on Web
flutter run -d chrome

# Run on Desktop
flutter run -d windows  # or macos, linux
```

### **Development**
```bash
# Hot reload (in running app)
r

# Hot restart (in running app)
R

# Clean build
flutter clean

# Analyze code
flutter analyze

# Format code
dart format .

# Fix issues
dart fix --apply

# Run tests
flutter test
```

### **Build for Production**
```bash
# Android APK
flutter build apk --release

# Android App Bundle
flutter build appbundle --release

# iOS
flutter build ios --release

# Web
flutter build web --release

# Windows
flutter build windows --release
```

### **Upgrades**
```bash
# Upgrade Flutter SDK
flutter upgrade

# Upgrade dependencies
./upgrade_dependencies.sh  # macOS/Linux
upgrade_dependencies.bat   # Windows

# Check outdated packages
flutter pub outdated
```

---

## 📦 Key Dependencies

### **Core (Must-Have)**
```yaml
flutter_riverpod: ^2.7.0      # State management
go_router: ^15.0.0             # Navigation
hive_flutter: ^1.2.0           # Local storage
dio: ^5.8.0                    # Network requests
```

### **Forms**
```yaml
flutter_form_builder: ^10.0.0
form_builder_validators: ^12.0.0
```

### **UI Components**
```yaml
cached_network_image: ^3.5.0
flutter_svg: ^2.0.15
shimmer: ^3.0.0
lottie: ^3.3.0
fl_chart: ^0.70.0
```

### **Authentication**
```yaml
local_auth: ^2.4.0
flutter_secure_storage: ^10.0.0
```

---

## 🎨 Component Library (42 Components)

### **Atoms (15)**
Avatar, Badge, Button, Checkbox, Chip, Divider, IconButton, Input, ProgressBar, Radio, Rating, Skeleton, Slider, Switch, Tooltip

### **Molecules (27)**
Accordion, AutoComplete, Breadcrumbs, Card, DatePicker, Dropdown, EmptyState, FileUpload, ListItem, MultiSelect, Navbar, NotificationBanner, OTPInput, Pagination, PasswordInput, PhoneInput, Popover, ProgressIndicator, QuickActions, SearchBar, SegmentedControl, Stepper, Tabs, TimeInput, Timeline, Toast, ToggleGroup, Toolbar

**Import:**
```dart
import 'package:basic_app_template/widgets/atoms/atoms.dart';
import 'package:basic_app_template/widgets/molecules/molecules.dart';
```

---

## 📱 Screens (15)

1. **Home** - `/`
2. **Login** - `/login`
3. **Register** - `/register`
4. **Forgot Password** - `/forgot-password`
5. **Profile** - `/profile`
6. **Settings** - `/settings`
7. **Notifications** - `/notifications`
8. **Appearance** - `/settings/appearance`
9. **Language** - `/settings/language`
10. **Privacy & Security** - `/settings/privacy`
11. **Devices** - `/settings/devices`
12. **Change Password** - `/settings/change-password`
13. **Help** - `/help`
14. **FAQ** - `/faq`
15. **What's New** - `/whats-new`

---

## 🎯 Common Tasks

### **1. Create New Screen**

```dart
// lib/screens/my_screen.dart
import 'package:flutter/material.dart';

class MyScreen extends StatelessWidget {
  const MyScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Screen')),
      body: const Center(child: Text('Content')),
    );
  }
}

// Add route in lib/core/router/app_router.dart
GoRoute(
  path: '/my-screen',
  builder: (context, state) => const MyScreen(),
),
```

### **2. Add State Management**

```dart
// lib/providers/my_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

class MyState {
  final int counter;
  MyState({required this.counter});
}

class MyNotifier extends StateNotifier<MyState> {
  MyNotifier() : super(MyState(counter: 0));
  
  void increment() {
    state = MyState(counter: state.counter + 1);
  }
}

final myProvider = StateNotifierProvider<MyNotifier, MyState>(
  (ref) => MyNotifier(),
);

// Use in widget
final state = ref.watch(myProvider);
ref.read(myProvider.notifier).increment();
```

### **3. Create Form**

```dart
import 'package:flutter_form_builder/flutter_form_builder.dart';

final _formKey = GlobalKey<FormBuilderState>();

FormBuilder(
  key: _formKey,
  child: Column(
    children: [
      FormBuilderTextField(
        name: 'email',
        decoration: InputDecoration(labelText: 'Email'),
        validator: FormBuilderValidators.email(),
      ),
      ElevatedButton(
        onPressed: () {
          if (_formKey.currentState!.saveAndValidate()) {
            print(_formKey.currentState!.value);
          }
        },
        child: Text('Submit'),
      ),
    ],
  ),
)
```

### **4. Make API Call**

```dart
import 'package:dio/dio.dart';

final dio = Dio();

Future<void> fetchData() async {
  try {
    final response = await dio.get('https://api.example.com/data');
    print(response.data);
  } catch (e) {
    print('Error: $e');
  }
}
```

### **5. Store Data Locally**

```dart
import 'package:shared_preferences/shared_preferences.dart';

// Save
final prefs = await SharedPreferences.getInstance();
await prefs.setString('key', 'value');

// Read
final value = prefs.getString('key');

// For complex data, use Hive
import 'package:hive_flutter/hive_flutter.dart';

await Hive.initFlutter();
final box = await Hive.openBox('myBox');
box.put('key', 'value');
final value = box.get('key');
```

### **6. Change Theme**

```dart
// Use ThemeProvider
final themeMode = ref.watch(themeModeProvider);

ref.read(themeModeProvider.notifier).setThemeMode(ThemeMode.dark);
```

### **7. Change Language**

```dart
// Use LocaleProvider
final locale = ref.watch(localeProvider);

ref.read(localeProvider.notifier).setLocale(const Locale('vi'));
```

### **8. Show Toast/Dialog**

```dart
// Toast
import 'package:fluttertoast/fluttertoast.dart';

Fluttertoast.showToast(
  msg: "This is a toast",
  toastLength: Toast.LENGTH_SHORT,
);

// Dialog
showDialog(
  context: context,
  builder: (context) => AlertDialog(
    title: Text('Title'),
    content: Text('Message'),
    actions: [
      TextButton(
        onPressed: () => Navigator.pop(context),
        child: Text('OK'),
      ),
    ],
  ),
);
```

---

## 🎨 Theming

### **Colors**
```dart
// Access theme colors
final theme = Theme.of(context);
theme.colorScheme.primary
theme.colorScheme.secondary
theme.colorScheme.surface
theme.colorScheme.error

// Custom colors defined in app_theme.dart
primaryColor: Color(0xFF6366F1)  // Indigo
secondaryColor: Color(0xFF8B5CF6) // Purple
accentColor: Color(0xFF06B6D4)   // Cyan
```

### **Typography**
```dart
theme.textTheme.displayLarge
theme.textTheme.headlineLarge
theme.textTheme.titleLarge
theme.textTheme.bodyLarge
theme.textTheme.labelLarge
```

### **Spacing**
```dart
SizedBox(height: 8)   // Small
SizedBox(height: 16)  // Medium
SizedBox(height: 24)  // Large
SizedBox(height: 32)  // Extra large
```

---

## 🌍 Localization

### **Add Translation**
```dart
// lib/core/l10n/app_localizations_en.dart
@override
String get myKey => 'My text in English';

// lib/core/l10n/app_localizations_vi.dart
@override
String get myKey => 'Văn bản của tôi bằng tiếng Việt';
```

### **Use Translation**
```dart
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

final l10n = AppLocalizations.of(context)!;
Text(l10n.myKey)
```

---

## 🔧 Troubleshooting

### **Common Issues**

**1. Dependency Conflict**
```bash
flutter pub upgrade --major-versions
```

**2. Build Error**
```bash
flutter clean
flutter pub get
flutter run
```

**3. iOS Pod Install Failed**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

**4. Android Gradle Error**
```bash
cd android
./gradlew clean
cd ..
flutter run
```

**5. Hot Reload Not Working**
```bash
# Press R (capital) for hot restart
R
```

---

## 📚 Resources

### **Documentation**
- [Flutter 3.38 Upgrade](FLUTTER_3.38_UPGRADE.md)
- [Dependencies Upgrade](DEPENDENCIES_UPGRADE.md)
- [Components Phase 4](COMPONENTS_PHASE4_COMPLETE.md)
- [Widget Library](lib/widgets/README.md)

### **Scripts**
- `upgrade_to_3.38.sh` - Upgrade Flutter
- `upgrade_dependencies.sh` - Upgrade packages

### **Official Links**
- [Flutter Docs](https://docs.flutter.dev)
- [Dart Docs](https://dart.dev)
- [Material Design 3](https://m3.material.io)
- [Riverpod](https://riverpod.dev)
- [GoRouter](https://pub.dev/packages/go_router)

---

## ✅ Checklist for New Features

- [ ] Design UI in Figma/Sketch
- [ ] Create reusable components if needed
- [ ] Implement screen with state management
- [ ] Add to navigation (GoRouter)
- [ ] Add translations (EN + VI)
- [ ] Write tests
- [ ] Test on Android
- [ ] Test on iOS
- [ ] Test on Web
- [ ] Update documentation
- [ ] Code review
- [ ] Deploy

---

## 🎯 Performance Tips

1. **Use const constructors** wherever possible
2. **Avoid rebuilding widgets** unnecessarily
3. **Use ListView.builder** for long lists
4. **Lazy load images** with cached_network_image
5. **Profile your app** with Flutter DevTools
6. **Use Impeller** rendering (default in 3.38)
7. **Minimize network calls** with caching
8. **Use Hive** for fast local storage

---

## 🔐 Security Best Practices

1. **Use flutter_secure_storage** for sensitive data
2. **Validate all user inputs**
3. **Use HTTPS** for all API calls
4. **Implement proper authentication**
5. **Don't hardcode secrets** in code
6. **Use environment variables** for configs
7. **Enable ProGuard/R8** for Android release
8. **Use SSL pinning** for critical apps

---

## 📱 Platform-Specific Notes

### **Android**
- Min SDK: 23 (Android 6.0)
- Target SDK: 35 (Android 15)
- Gradle: 8.9
- Kotlin: 2.0

### **iOS**
- Min Version: 13.0
- Target: iOS 18
- Xcode: 16+
- Swift: 6

### **Web**
- WebGPU support
- PWA ready
- Responsive design

### **Desktop**
- Windows 11 optimized
- macOS Sequoia ready
- Linux support

---

**🎉 You're all set! Happy coding with Flutter 3.38.0! 🚀**

**Last Updated:** January 3, 2026  
**Version:** 1.0.0
