# Dependencies Update Required

## New Components Added - Phase 2

The following new components require additional npm packages to be installed.

### 📦 Required Packages

#### 1. DatePicker Component
```bash
npm install @react-native-community/datetimepicker
```

**iOS Setup:**
```bash
cd ios && pod install && cd ..
```

**Why needed:** Native date/time picker for both iOS and Android

---

## Installation Instructions

### Full Installation Command:
```bash
# Install all required dependencies
npm install @react-native-community/datetimepicker

# iOS only - install pods
cd ios && pod install && cd ..

# Rebuild the app
npm run android  # For Android
npm run ios      # For iOS
```

---

## Component Usage Examples

### 1. DatePicker
```tsx
import DatePicker from '../components/molecules/DatePicker';

const [date, setDate] = useState<Date>();

<DatePicker
  value={date}
  onChange={setDate}
  label="Select Date"
  mode="date"
  format="long"
/>
```

### 2. PasswordInput
```tsx
import PasswordInput from '../components/molecules/PasswordInput';

const [password, setPassword] = useState('');

<PasswordInput
  value={password}
  onChangeText={setPassword}
  showStrengthMeter
  showRequirements
/>
```

### 3. PhoneInput
```tsx
import PhoneInput from '../components/molecules/PhoneInput';

const [phone, setPhone] = useState('');

<PhoneInput
  value={phone}
  onChangeText={setPhone}
  label="Phone Number"
/>
```

### 4. Select
```tsx
import Select from '../components/molecules/Select';

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
];

<Select
  value={selected}
  onChange={setSelected}
  options={options}
  label="Choose"
/>
```

### 5. OTPInput
```tsx
import OTPInput from '../components/molecules/OTPInput';

const [otp, setOtp] = useState('');

<OTPInput
  value={otp}
  onChange={setOtp}
  onComplete={(code) => console.log('Complete:', code)}
  length={6}
/>
```

### 6. SearchBar
```tsx
import SearchBar from '../components/molecules/SearchBar';

const [query, setQuery] = useState('');

<SearchBar
  value={query}
  onChangeText={setQuery}
  onSearch={(text) => console.log('Search:', text)}
  placeholder="Search here..."
/>
```

---

## Verification

After installation, verify the packages are installed:

```bash
npm list @react-native-community/datetimepicker
```

Expected output:
```
@react-native-community/datetimepicker@8.x.x
```

---

## Troubleshooting

### Issue: DatePicker not showing on Android
**Solution:** Make sure you've rebuilt the app after installation
```bash
npm run android
```

### Issue: DatePicker not showing on iOS
**Solution:** Make sure pods are installed
```bash
cd ios && pod install && cd ..
npm run ios
```

### Issue: Module not found
**Solution:** Clear cache and reinstall
```bash
npm start -- --reset-cache
```

---

## Platform Support

| Component | iOS | Android | Web |
|-----------|-----|---------|-----|
| DatePicker | ✅ | ✅ | ❌ |
| PasswordInput | ✅ | ✅ | ✅ |
| PhoneInput | ✅ | ✅ | ✅ |
| Select | ✅ | ✅ | ✅ |
| OTPInput | ✅ | ✅ | ✅ |
| SearchBar | ✅ | ✅ | ✅ |

---

**Last Updated:** January 2, 2026
**React Native Version:** 0.73+
**Tested on:** iOS 14+, Android 8+
