# React Native CLI - Complete Setup Guide 📱

## Project Structure

```
/mobile/                          # New React Native app
├── android/                      # Android native code
├── ios/                         # iOS native code
├── src/
│   ├── components/
│   │   ├── atoms/              # Basic components
│   │   ├── molecules/          # Composite components
│   │   └── organisms/          # Complex components
│   ├── contexts/               # Shared contexts (migrated)
│   ├── screens/                # Screen components (pages)
│   ├── navigation/             # Navigation setup
│   ├── hooks/                  # Custom hooks
│   ├── utils/                  # Utilities
│   ├── services/               # API services
│   ├── types/                  # TypeScript types
│   ├── theme/                  # Design tokens
│   └── App.tsx                 # Root component
├── package.json
└── tsconfig.json

/                                # Current web app (unchanged)
├── components/                  # Web components
├── contexts/                   # Web contexts
├── pages/                      # Web pages
└── App.tsx                     # Web root
```

---

## Step 1: Initialize React Native Project

### 1.1 Prerequisites

```bash
# Install Node.js 18+ (already have)
node --version

# Install Watchman (macOS)
brew install watchman

# Install Java Development Kit (for Android)
brew install --cask zulu11

# Install Xcode (for iOS - macOS only)
# Download from App Store

# Install Android Studio (for Android)
# Download from https://developer.android.com/studio
```

### 1.2 Create React Native Project

```bash
# Navigate to project root
cd /path/to/your/project

# Create new React Native app with TypeScript
npx react-native@latest init EnterpriseAppMobile --template react-native-template-typescript

# Rename folder to 'mobile'
mv EnterpriseAppMobile mobile

# Enter mobile directory
cd mobile
```

---

## Step 2: Install Core Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated

# State Management & Storage
npm install @react-native-async-storage/async-storage

# Icons
npm install react-native-svg
npm install lucide-react-native

# Forms & Validation
npm install react-hook-form@7.55.0

# Date & Time
npm install @react-native-community/datetimepicker
npm install react-native-date-picker

# UI Components
npm install react-native-paper
npm install react-native-vector-icons

# Utilities
npm install lodash
npm install @types/lodash --save-dev

# Device Info
npm install react-native-device-info

# Geolocation
npm install @react-native-community/geolocation

# Camera (for BarcodeInput)
npm install react-native-vision-camera
npm install vision-camera-code-scanner

# Clipboard
npm install @react-native-clipboard/clipboard

# Image Picker
npm install react-native-image-picker

# Network Info
npm install @react-native-community/netinfo
```

### 2.1 iOS Setup

```bash
cd ios
pod install
cd ..
```

### 2.2 Android Setup

```bash
# Update android/app/build.gradle
# Add necessary permissions in AndroidManifest.xml
```

---

## Step 3: Configure React Native Reanimated

Add to `babel.config.js`:

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // Must be last
  ],
};
```

Update `index.js`:

```javascript
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

---

## Step 4: Setup Project Structure

```bash
cd mobile
mkdir -p src/components/atoms
mkdir -p src/components/molecules
mkdir -p src/components/organisms
mkdir -p src/contexts
mkdir -p src/screens
mkdir -p src/navigation
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/services
mkdir -p src/types
mkdir -p src/theme
```

---

## Step 5: Run the App

### iOS (macOS only):
```bash
npx react-native run-ios
```

### Android:
```bash
# Start Android emulator first, then:
npx react-native run-android
```

### Metro Bundler:
```bash
npx react-native start
# or
npm start
```

---

## Step 6: Key Differences from Web

### 6.1 Styling

**Web (Tailwind):**
```tsx
<div className="flex-1 bg-blue-500 p-4 rounded-lg">
  <p className="text-white text-lg font-bold">Hello</p>
</div>
```

**React Native (StyleSheet):**
```tsx
import { View, Text, StyleSheet } from 'react-native';

<View style={styles.container}>
  <Text style={styles.text}>Hello</Text>
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

### 6.2 Components Mapping

| Web | React Native |
|-----|--------------|
| `<div>` | `<View>` |
| `<span>`, `<p>`, `<h1>` | `<Text>` |
| `<input>` | `<TextInput>` |
| `<button>` | `<TouchableOpacity>`, `<Pressable>` |
| `<img>` | `<Image>` |
| `<a>` | `<TouchableOpacity>` + `Linking.openURL()` |
| `<select>` | `<Picker>` from `@react-native-picker/picker` |
| Scrollable div | `<ScrollView>`, `<FlatList>` |

### 6.3 Events

| Web | React Native |
|-----|--------------|
| `onClick` | `onPress` |
| `onChange` | `onChangeText` (TextInput) |
| `onSubmit` | Manual handling |
| `onMouseEnter` | `onPressIn` |
| `onMouseLeave` | `onPressOut` |

### 6.4 Storage

| Web | React Native |
|-----|--------------|
| `localStorage.setItem()` | `AsyncStorage.setItem()` (async) |
| `localStorage.getItem()` | `AsyncStorage.getItem()` (async) |
| `localStorage.removeItem()` | `AsyncStorage.removeItem()` (async) |

### 6.5 Navigation

**Web (State-based):**
```tsx
const [currentPage, setCurrentPage] = useState('home');
```

**React Native (React Navigation):**
```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

navigation.navigate('Home');
```

---

## Step 7: Design Tokens Migration

Create `/mobile/src/theme/tokens.ts`:

```typescript
export const colors = {
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    500: '#6B7280',
    900: '#111827',
  },
  // ... rest from web app
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  // ... rest
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
```

---

## Step 8: Migration Priority

### Phase 1: Foundation (Week 1)
1. ✅ Setup React Native CLI project
2. ✅ Install dependencies
3. ✅ Create theme tokens
4. ✅ Setup navigation
5. ✅ Migrate contexts (AsyncStorage)

### Phase 2: Atoms (Week 2)
1. Button
2. Text
3. Input
4. Checkbox
5. Switch
6. Badge
7. Avatar
8. Spinner
9. Divider
10. IconButton

### Phase 3: Core Molecules (Week 3)
1. Card
2. Modal
3. Toast
4. FormField
5. SearchBar
6. Select
7. DatePicker
8. Accordion
9. ListItem
10. Tabs

### Phase 4: Input Components (Week 4)
1. PasswordInput
2. PhoneInput
3. NumberInput
4. CurrencyInput
5. OTPInput
6. RatingInput
7. SliderInput
8. ColorPicker
9. FileUpload
10. SignatureInput

### Phase 5: Screens (Week 5)
1. Login
2. Register
3. Home
4. Profile
5. Settings
6. Notifications

### Phase 6: Advanced Features (Week 6)
1. Camera/Barcode scanning
2. Geolocation
3. Biometric auth
4. Push notifications
5. Deep linking
6. Analytics

---

## Step 9: Development Workflow

### 9.1 Start Development

```bash
# Terminal 1: Metro Bundler
cd mobile
npm start

# Terminal 2: Run iOS
npm run ios

# Terminal 3: Run Android
npm run android
```

### 9.2 Hot Reload

- Press `r` in Metro to reload
- Press `d` to open dev menu
- Shake device for dev menu

### 9.3 Debug

```bash
# Chrome DevTools
# In dev menu, select "Debug"

# Flipper (recommended)
# Install from https://fbflipper.com/
```

### 9.4 Build for Production

**iOS:**
```bash
cd ios
xcodebuild -workspace YourApp.xcworkspace -scheme YourApp -configuration Release
```

**Android:**
```bash
cd android
./gradlew assembleRelease
```

---

## Step 10: Key Configuration Files

### `package.json`
```json
{
  "name": "EnterpriseAppMobile",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  }
}
```

### `tsconfig.json`
```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@screens/*": ["screens/*"],
      "@contexts/*": ["contexts/*"],
      "@hooks/*": ["hooks/*"],
      "@utils/*": ["utils/*"],
      "@theme/*": ["theme/*"]
    }
  }
}
```

---

## Step 11: Permissions Setup

### Android (`android/app/src/main/AndroidManifest.xml`):
```xml
<manifest>
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.CAMERA" />
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  <!-- ... -->
</manifest>
```

### iOS (`ios/YourApp/Info.plist`):
```xml
<dict>
  <key>NSCameraUsageDescription</key>
  <string>We need camera access for barcode scanning</string>
  
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>We need location access for address input</string>
  
  <key>NSPhotoLibraryUsageDescription</key>
  <string>We need photo library access</string>
  <!-- ... -->
</dict>
```

---

## Step 12: Testing

```bash
# Unit tests
npm test

# E2E tests (Detox)
npm install --save-dev detox
detox build
detox test
```

---

## Next Steps

After setup is complete, I will create:

1. ✅ `/mobile/src/theme/tokens.ts` - Design tokens
2. ✅ `/mobile/src/contexts/` - Migrated contexts
3. ✅ `/mobile/src/navigation/` - Navigation setup
4. ✅ `/mobile/src/components/atoms/` - Base components
5. ✅ `/mobile/src/screens/` - Main screens
6. ✅ `/mobile/src/App.tsx` - Root component

Ready to proceed with implementation!

---

**Estimated Timeline:**
- Week 1: Setup + Foundation
- Week 2-3: Core Components
- Week 4-5: Screens + Features
- Week 6: Polish + Testing

**Total: 6 weeks for MVP native app**
