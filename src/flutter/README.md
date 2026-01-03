# 📱 Basic App Template - Flutter Edition

Enterprise-grade Flutter application with **Material Design 3**, **dark mode**, **bilingual support (EN/VI)**, and **15 production-ready screens**.

**🎉 NEW: Dependencies upgraded to latest versions (January 2026)!**

---

## ✨ Features

### **🎨 UI & Design**
- ✅ Material Design 3
- ✅ Gradient effects (Primary & Accent)
- ✅ Dark mode support
- ✅ Smooth animations
- ✅ Responsive layout
- ✅ Custom theme system

### **🌍 Internationalization**
- ✅ English (EN)
- ✅ Vietnamese (VI)
- ✅ Easy to add more languages
- ✅ RTL support ready

### **🔐 Authentication**
- ✅ Login screen
- ✅ Register screen
- ✅ Forgot password
- ✅ Biometric authentication ready
- ✅ Secure storage

### **📄 15 Screens**
1. **Home** - Dashboard with quick actions
2. **Login** - Authentication
3. **Register** - Account creation
4. **Forgot Password** - Password recovery
5. **Profile** - User profile
6. **Settings** - App settings
7. **Notifications** - Notification center
8. **Appearance** - Theme settings
9. **Language** - Language selection
10. **Privacy & Security** - Privacy settings
11. **Devices** - Device management
12. **Change Password** - Password change
13. **Help** - Help center
14. **FAQ** - Frequently asked questions
15. **What's New** - Release notes

### **🛠️ Technical Stack**
- **Framework:** Flutter 3.x
- **Language:** Dart 3.x
- **State Management:** Riverpod
- **Routing:** GoRouter
- **Storage:** Hive + SharedPreferences
- **Network:** Dio + HTTP
- **UI Components:** Material 3

---

## 🚀 Getting Started

### **Prerequisites**
- Flutter SDK 3.2.0 or higher
- Dart SDK 3.2.0 or higher
- Android Studio / Xcode (for mobile development)
- VS Code (recommended)

### **Installation**

1. **Navigate to Flutter directory:**
```bash
cd flutter
```

2. **Install dependencies:**
```bash
flutter pub get
```

3. **Run the app:**

**Android:**
```bash
flutter run -d android
```

**iOS:**
```bash
flutter run -d ios
```

**Web:**
```bash
flutter run -d chrome
```

**Desktop:**
```bash
# Windows
flutter run -d windows

# macOS
flutter run -d macos

# Linux
flutter run -d linux
```

---

## 📁 Project Structure

```
flutter/
├── lib/
│   ├── core/
│   │   ├── l10n/                    # Localization
│   │   │   ├── app_localizations.dart
│   │   │   ├── app_localizations_en.dart
│   │   │   └── app_localizations_vi.dart
│   │   ├── router/                  # Navigation
│   │   │   └── app_router.dart
│   │   └── theme/                   # Theme & styles
│   │       └── app_theme.dart
│   │
│   ├── models/                      # Data models
│   ├── providers/                   # State management
│   │   ├── theme_provider.dart
│   │   ├── locale_provider.dart
│   │   └── auth_provider.dart
│   │
│   ├── screens/                     # All screens (15)
│   │   ├── home_screen.dart
│   │   ├── login_screen.dart
│   │   ├── register_screen.dart
│   │   ├── forgot_password_screen.dart
│   │   ├── profile_screen.dart
│   │   ├── settings_screen.dart
│   │   ├── notifications_screen.dart
│   │   ├── appearance_screen.dart
│   │   ├── language_screen.dart
│   │   ├── privacy_security_screen.dart
│   │   ├── devices_screen.dart
│   │   ├── change_password_screen.dart
│   │   ├── help_screen.dart
│   │   ├── faq_screen.dart
│   │   └── whats_new_screen.dart
│   │
│   ├── widgets/                     # Reusable widgets
│   │   ├── atoms/                   # Basic components
│   │   ├── molecules/               # Composite components
│   │   └── layout/                  # Layout components
│   │       └── main_layout.dart
│   │
│   ├── services/                    # API & services
│   │   ├── api_service.dart
│   │   ├── auth_service.dart
│   │   └── storage_service.dart
│   │
│   └── main.dart                    # App entry point
│
├── assets/                          # Assets
│   ├── images/
│   ├── icons/
│   ├── animations/
│   └── fonts/
│
├── test/                            # Tests
├── pubspec.yaml                     # Dependencies
└── README.md                        # This file
```

---

## 🎨 Theme System

### **Light Theme**
```dart
// Use default light theme
ThemeMode.light
```

### **Dark Theme**
```dart
// Use default dark theme
ThemeMode.dark
```

### **System Default**
```dart
// Follow system theme
ThemeMode.system
```

### **Custom Colors**
- **Primary:** Indigo (#6366F1)
- **Secondary:** Purple (#8B5CF6)
- **Accent:** Cyan (#06B6D4)
- **Gradients:** Primary & Accent gradients

---

## 🌍 Adding New Languages

1. **Create localization file:**
```dart
// lib/core/l10n/app_localizations_es.dart
class AppLocalizationsEs extends AppLocalizations {
  @override
  String get hello => 'Hola';
  // ... add all translations
}
```

2. **Update delegate:**
```dart
// lib/core/l10n/app_localizations.dart
static const List<Locale> supportedLocales = [
  Locale('en'),
  Locale('vi'),
  Locale('es'), // Add new locale
];

@override
Future<AppLocalizations> load(Locale locale) async {
  switch (locale.languageCode) {
    case 'vi':
      return AppLocalizationsVi();
    case 'es':
      return AppLocalizationsEs(); // Add new case
    case 'en':
    default:
      return AppLocalizationsEn();
  }
}
```

---

## 🧪 Testing

### **Run tests:**
```bash
flutter test
```

### **Run tests with coverage:**
```bash
flutter test --coverage
```

### **Integration tests:**
```bash
flutter test integration_test
```

---

## 📦 Build for Production

### **Android APK:**
```bash
flutter build apk --release
```

### **Android App Bundle (AAB):**
```bash
flutter build appbundle --release
```

### **iOS:**
```bash
flutter build ios --release
```

### **Web:**
```bash
flutter build web --release
```

### **Desktop:**
```bash
# Windows
flutter build windows --release

# macOS
flutter build macos --release

# Linux
flutter build linux --release
```

---

## 🔧 Configuration

### **App Name & Bundle ID**

Edit `pubspec.yaml`:
```yaml
name: your_app_name
description: Your app description
```

Edit `android/app/build.gradle`:
```gradle
defaultConfig {
    applicationId "com.yourcompany.yourapp"
}
```

Edit `ios/Runner.xcodeproj/project.pbxproj`:
```
PRODUCT_BUNDLE_IDENTIFIER = com.yourcompany.yourapp
```

### **App Icons**

Place your app icons in:
- Android: `android/app/src/main/res/mipmap-*/ic_launcher.png`
- iOS: `ios/Runner/Assets.xcassets/AppIcon.appiconset/`

Or use `flutter_launcher_icons` package:
```bash
flutter pub run flutter_launcher_icons
```

---

## 📚 Documentation

### **Key Packages Used**

| Package | Version | Purpose |
|---------|---------|---------|
| flutter_riverpod | ^2.5.1 | State management |
| go_router | ^13.2.0 | Navigation |
| hive_flutter | ^1.1.0 | Local storage |
| dio | ^5.4.1 | HTTP client |
| shared_preferences | ^2.2.3 | Simple storage |
| flutter_form_builder | ^9.2.1 | Form building |
| cached_network_image | ^3.3.1 | Image caching |
| fl_chart | ^0.66.2 | Charts |
| animate_do | ^3.3.4 | Animations |

---

## 🎯 Roadmap

- [ ] Add more widgets library
- [ ] Implement all 15 screens
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Add CI/CD pipeline
- [ ] Add Firebase integration
- [ ] Add push notifications
- [ ] Add offline mode
- [ ] Add analytics
- [ ] Add crash reporting

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Tips

### **Hot Reload**
- Press `r` in terminal for hot reload
- Press `R` for hot restart

### **Debug Mode**
```bash
flutter run --debug
```

### **Profile Mode**
```bash
flutter run --profile
```

### **Release Mode**
```bash
flutter run --release
```

### **Clean Build**
```bash
flutter clean
flutter pub get
flutter run
```

---

## 📞 Support

For support, please contact:
- Email: support@example.com
- Issues: https://github.com/yourrepo/issues

---

## 🔄 Recent Updates (January 2026)

### **Dependencies Upgraded to Latest Versions!**

**What's New:**
- ✅ **Flutter 3.24+** with Dart 3.5+
- ✅ **go_router 14.x** - Better navigation
- ✅ **Riverpod 2.6** - Latest state management
- ✅ **Mobile Scanner** - Modern QR scanning (replaced deprecated qr_code_scanner)
- ✅ **11 new packages** added (freezed, logger, equatable, etc.)
- ✅ **28 packages updated** to latest versions

**Documentation:**
- 📚 **DEPENDENCIES_UPGRADE.md** - Complete upgrade report (400+ lines)
- 📚 **MIGRATION_GUIDE.md** - Step-by-step migration guide
- 📚 **UPGRADE_SUMMARY.md** - Quick reference
- 📚 **UPGRADE_COMPLETE.md** - Summary report

**Quick Upgrade:**
```bash
# macOS/Linux
./upgrade.sh

# Windows
upgrade.bat

# Or manually
flutter pub get
flutter pub upgrade --major-versions
```

**See `UPGRADE_COMPLETE.md` for full details!**

---

**Built with ❤️ using Flutter**