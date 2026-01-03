# 🔄 Migration Guide - Dependencies Upgrade

Guide chi tiết để migrate code sau khi upgrade dependencies.

---

## 📋 TABLE OF CONTENTS

1. [Quick Start](#quick-start)
2. [QR Code Scanner Migration](#qr-code-scanner-migration)
3. [Pull to Refresh Migration](#pull-to-refresh-migration)
4. [go_router Migration](#go_router-migration)
5. [Form Builder Validators Migration](#form-builder-validators-migration)
6. [New Features Usage](#new-features-usage)
7. [Testing After Migration](#testing-after-migration)

---

## 🚀 QUICK START

### **Step 1: Install Dependencies**
```bash
cd flutter
flutter pub get
```

If you get conflicts:
```bash
flutter pub upgrade --major-versions
```

### **Step 2: Run Build Runner (if using code generation)**
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

### **Step 3: Analyze Code**
```bash
flutter analyze
```

### **Step 4: Fix Errors**
Follow the guides below for specific package migrations.

---

## 📱 QR CODE SCANNER MIGRATION

### **Old Package (REMOVED)**
```yaml
dependencies:
  qr_code_scanner: ^1.0.1
```

### **New Package**
```yaml
dependencies:
  mobile_scanner: ^5.2.3
```

### **Migration Steps**

#### **1. Update Imports**

**Before:**
```dart
import 'package:qr_code_scanner/qr_code_scanner.dart';
```

**After:**
```dart
import 'package:mobile_scanner/mobile_scanner.dart';
```

#### **2. Update QR Scanner Widget**

**Before:**
```dart
class QRScannerScreen extends StatefulWidget {
  @override
  _QRScannerScreenState createState() => _QRScannerScreenState();
}

class _QRScannerScreenState extends State<QRScannerScreen> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  QRViewController? controller;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: QRView(
        key: qrKey,
        onQRViewCreated: _onQRViewCreated,
      ),
    );
  }

  void _onQRViewCreated(QRViewController controller) {
    this.controller = controller;
    controller.scannedDataStream.listen((scanData) {
      print('QR Code: ${scanData.code}');
    });
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }
}
```

**After:**
```dart
class QRScannerScreen extends StatefulWidget {
  @override
  _QRScannerScreenState createState() => _QRScannerScreenState();
}

class _QRScannerScreenState extends State<QRScannerScreen> {
  MobileScannerController controller = MobileScannerController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: MobileScanner(
        controller: controller,
        onDetect: (capture) {
          final List<Barcode> barcodes = capture.barcodes;
          for (final barcode in barcodes) {
            print('QR Code: ${barcode.rawValue}');
          }
        },
      ),
    );
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }
}
```

#### **3. Advanced Features**

**Flash/Torch Control:**
```dart
// Toggle flash
controller.toggleTorch();

// Check if flash is available
controller.hasTorch;
```

**Switch Camera:**
```dart
controller.switchCamera();
```

**Start/Stop Scanning:**
```dart
// Start
controller.start();

// Stop
controller.stop();
```

**Complete Example:**
```dart
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

class QRScannerScreen extends StatefulWidget {
  const QRScannerScreen({super.key});

  @override
  State<QRScannerScreen> createState() => _QRScannerScreenState();
}

class _QRScannerScreenState extends State<QRScannerScreen> {
  final MobileScannerController controller = MobileScannerController();
  String? scannedCode;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan QR Code'),
        actions: [
          IconButton(
            icon: const Icon(Icons.flip_camera_ios),
            onPressed: () => controller.switchCamera(),
          ),
          IconButton(
            icon: const Icon(Icons.flash_on),
            onPressed: () => controller.toggleTorch(),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            flex: 5,
            child: MobileScanner(
              controller: controller,
              onDetect: (capture) {
                final List<Barcode> barcodes = capture.barcodes;
                for (final barcode in barcodes) {
                  setState(() {
                    scannedCode = barcode.rawValue;
                  });
                }
              },
            ),
          ),
          Expanded(
            flex: 1,
            child: Center(
              child: scannedCode != null
                  ? Text('Scanned: $scannedCode')
                  : const Text('Scan a QR code'),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }
}
```

---

## 🔄 PULL TO REFRESH MIGRATION

### **Old Package (REMOVED)**
```yaml
dependencies:
  pull_to_refresh: ^2.0.0
```

### **New Package**
```yaml
dependencies:
  pull_to_refresh_flutter3: ^2.0.2
```

### **Migration Steps**

#### **1. Update Import**

**Before:**
```dart
import 'package:pull_to_refresh/pull_to_refresh.dart';
```

**After:**
```dart
import 'package:pull_to_refresh_flutter3/pull_to_refresh_flutter3.dart';
```

#### **2. Code Remains Same**

Good news! The API is 100% compatible. Just change the import!

**Example (works with both):**
```dart
import 'package:pull_to_refresh_flutter3/pull_to_refresh_flutter3.dart';

class MyListScreen extends StatefulWidget {
  @override
  _MyListScreenState createState() => _MyListScreenState();
}

class _MyListScreenState extends State<MyListScreen> {
  RefreshController _refreshController = RefreshController(initialRefresh: false);
  List<String> items = ['Item 1', 'Item 2', 'Item 3'];

  void _onRefresh() async {
    // Simulate network request
    await Future.delayed(Duration(seconds: 2));
    
    // Update data
    items.add('New Item');
    
    setState(() {});
    _refreshController.refreshCompleted();
  }

  void _onLoading() async {
    // Simulate loading more
    await Future.delayed(Duration(seconds: 2));
    
    items.addAll(['More 1', 'More 2']);
    
    setState(() {});
    _refreshController.loadComplete();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SmartRefresher(
        enablePullDown: true,
        enablePullUp: true,
        controller: _refreshController,
        onRefresh: _onRefresh,
        onLoading: _onLoading,
        child: ListView.builder(
          itemCount: items.length,
          itemBuilder: (context, index) {
            return ListTile(
              title: Text(items[index]),
            );
          },
        ),
      ),
    );
  }

  @override
  void dispose() {
    _refreshController.dispose();
    super.dispose();
  }
}
```

---

## 🛣️ GO_ROUTER MIGRATION

### **Version Change: 13.x → 14.x**

#### **1. Route Declaration (No Changes for Basic Usage)**

Most basic usage remains the same:

```dart
import 'package:go_router/go_router.dart';

final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => HomeScreen(),
    ),
    GoRoute(
      path: '/details/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return DetailsScreen(id: id);
      },
    ),
  ],
);
```

#### **2. Navigation (Same)**

```dart
// Navigate
context.go('/details/123');

// Navigate with named route
context.goNamed('details', pathParameters: {'id': '123'});

// Push
context.push('/details/123');

// Pop
context.pop();
```

#### **3. What's New in 14.x**

**Better Type Safety:**
```dart
// Type-safe routes with generated code
import 'package:go_router/go_router.dart';

@TypedGoRoute<HomeRoute>(path: '/')
class HomeRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) {
    return HomeScreen();
  }
}

@TypedGoRoute<DetailsRoute>(path: '/details/:id')
class DetailsRoute extends GoRouteData {
  final String id;
  
  const DetailsRoute({required this.id});
  
  @override
  Widget build(BuildContext context, GoRouterState state) {
    return DetailsScreen(id: id);
  }
}
```

**Improved Redirects:**
```dart
GoRouter(
  redirect: (context, state) {
    final loggedIn = /* check auth */;
    final loggingIn = state.matchedLocation == '/login';
    
    if (!loggedIn && !loggingIn) return '/login';
    if (loggedIn && loggingIn) return '/';
    
    return null;
  },
  routes: [...],
);
```

---

## 📝 FORM BUILDER VALIDATORS MIGRATION

### **Version Change: 9.x → 11.x**

#### **1. Basic Validators (No Changes)**

```dart
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_validators/form_builder_validators.dart';

FormBuilderTextField(
  name: 'email',
  decoration: InputDecoration(labelText: 'Email'),
  validator: FormBuilderValidators.compose([
    FormBuilderValidators.required(),
    FormBuilderValidators.email(),
  ]),
)
```

#### **2. Updated Validators**

**New context parameter (optional for most):**
```dart
// Old (still works)
FormBuilderValidators.required()

// New (recommended)
FormBuilderValidators.required(errorText: 'This field is required')
```

#### **3. Complete Form Example**

```dart
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_validators/form_builder_validators.dart';

class MyFormScreen extends StatefulWidget {
  @override
  _MyFormScreenState createState() => _MyFormScreenState();
}

class _MyFormScreenState extends State<MyFormScreen> {
  final _formKey = GlobalKey<FormBuilderState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Form Example')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: FormBuilder(
          key: _formKey,
          child: Column(
            children: [
              FormBuilderTextField(
                name: 'email',
                decoration: InputDecoration(labelText: 'Email'),
                validator: FormBuilderValidators.compose([
                  FormBuilderValidators.required(
                    errorText: 'Email is required',
                  ),
                  FormBuilderValidators.email(
                    errorText: 'Invalid email address',
                  ),
                ]),
              ),
              SizedBox(height: 16),
              FormBuilderTextField(
                name: 'password',
                decoration: InputDecoration(labelText: 'Password'),
                obscureText: true,
                validator: FormBuilderValidators.compose([
                  FormBuilderValidators.required(
                    errorText: 'Password is required',
                  ),
                  FormBuilderValidators.minLength(
                    8,
                    errorText: 'Password must be at least 8 characters',
                  ),
                ]),
              ),
              SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.saveAndValidate()) {
                    final values = _formKey.currentState!.value;
                    print('Form data: $values');
                  }
                },
                child: Text('Submit'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

---

## ✨ NEW FEATURES USAGE

### **1. Freezed for Data Classes**

#### **Setup**
```yaml
dependencies:
  freezed_annotation: ^2.4.4

dev_dependencies:
  freezed: ^2.5.7
  build_runner: ^2.4.13
```

#### **Create Data Class**
```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'user.freezed.dart';
part 'user.g.dart';

@freezed
class User with _$User {
  const factory User({
    required String id,
    required String name,
    required String email,
    String? avatarUrl,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}
```

#### **Generate Code**
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

#### **Usage**
```dart
// Create
final user = User(
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
);

// Copy with changes
final updatedUser = user.copyWith(name: 'Jane Doe');

// To JSON
final json = user.toJson();

// From JSON
final userFromJson = User.fromJson(json);

// Equality
print(user == updatedUser); // false (different name)
```

### **2. Logger for Better Logging**

#### **Setup**
```dart
import 'package:logger/logger.dart';

final logger = Logger(
  printer: PrettyPrinter(
    methodCount: 2,
    errorMethodCount: 8,
    lineLength: 120,
    colors: true,
    printEmojis: true,
    printTime: true,
  ),
);
```

#### **Usage**
```dart
logger.d('Debug message');
logger.i('Info message');
logger.w('Warning message');
logger.e('Error message', error: exception, stackTrace: stackTrace);
```

#### **Different Log Levels**
```dart
// Verbose
logger.t('Trace message');

// Debug
logger.d('Debug: User logged in');

// Info
logger.i('Info: Data loaded successfully');

// Warning
logger.w('Warning: API response slow');

// Error
logger.e('Error: Failed to fetch data');

// Fatal
logger.f('Fatal: App crashed!');
```

### **3. Equatable for Value Equality**

#### **Setup**
```dart
import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String id;
  final String name;
  final String email;

  const User({
    required this.id,
    required this.name,
    required this.email,
  });

  @override
  List<Object?> get props => [id, name, email];
}
```

#### **Usage**
```dart
final user1 = User(id: '1', name: 'John', email: 'john@example.com');
final user2 = User(id: '1', name: 'John', email: 'john@example.com');
final user3 = User(id: '2', name: 'Jane', email: 'jane@example.com');

print(user1 == user2); // true (same values)
print(user1 == user3); // false (different values)

// Works with collections
final users = {user1, user2}; // Set with 1 element (duplicates removed)
```

### **4. Generate App Icons**

#### **Setup in pubspec.yaml**
```yaml
flutter_launcher_icons:
  android: true
  ios: false
  image_path: "assets/icons/app_icon.png"
  adaptive_icon_background: "#6366F1"
  adaptive_icon_foreground: "assets/icons/app_icon_foreground.png"
```

#### **Generate**
```bash
flutter pub run flutter_launcher_icons
```

### **5. Generate Native Splash Screen**

#### **Setup in pubspec.yaml**
```yaml
flutter_native_splash:
  color: "#6366F1"
  color_dark: "#1E1E1E"
  image: assets/icons/splash_icon.png
  android: true
  ios: false
```

#### **Generate**
```bash
flutter pub run flutter_native_splash:create
```

---

## 🧪 TESTING AFTER MIGRATION

### **1. Analyze Code**
```bash
flutter analyze
```

### **2. Run Tests**
```bash
flutter test
```

### **3. Build Debug**
```bash
flutter build apk --debug
```

### **4. Build Release**
```bash
flutter build apk --release
```

### **5. Test on Device**
```bash
flutter install
flutter run --release
```

---

## ✅ MIGRATION CHECKLIST

### **Phase 1: Dependencies**
- [ ] Updated `pubspec.yaml`
- [ ] Ran `flutter pub get`
- [ ] Resolved any conflicts
- [ ] Ran `flutter pub outdated`

### **Phase 2: Code Changes**
- [ ] Replaced `qr_code_scanner` with `mobile_scanner`
- [ ] Replaced `pull_to_refresh` with `pull_to_refresh_flutter3`
- [ ] Updated all imports
- [ ] Fixed any analyzer warnings

### **Phase 3: Testing**
- [ ] Ran `flutter analyze` (0 issues)
- [ ] Ran `flutter test` (all passing)
- [ ] Tested QR scanning functionality
- [ ] Tested pull-to-refresh functionality
- [ ] Tested all navigation flows
- [ ] Tested all forms

### **Phase 4: Build**
- [ ] Built debug APK successfully
- [ ] Built release APK successfully
- [ ] Tested debug build on device
- [ ] Tested release build on device
- [ ] Verified app size

### **Phase 5: Optional Enhancements**
- [ ] Added freezed for data classes
- [ ] Added logger for better logging
- [ ] Generated app icons
- [ ] Generated splash screen
- [ ] Added equatable where needed

---

## 🎉 MIGRATION COMPLETE!

**Once you've completed all checklists, your app is fully migrated to the latest dependencies!**

**Next steps:**
1. Deploy to testing
2. QA testing
3. Production deployment 🚀

---

**Built with ❤️ for Flutter Migration**
