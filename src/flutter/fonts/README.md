# Fonts Directory

Custom fonts for the Flutter application.

## Current Fonts

The `pubspec.yaml` references these fonts (need to be added):

```
fonts/
├── Roboto-Regular.ttf
└── Roboto-Bold.ttf
```

## ⚠️ Font Files Missing

The font files referenced in `pubspec.yaml` are not included (binary files).

## How to Add Fonts

### Option 1: Use Google Fonts (Recommended)

Instead of bundling fonts, use the `google_fonts` package:

**1. Add dependency to `pubspec.yaml`:**
```yaml
dependencies:
  google_fonts: ^6.2.1
```

**2. Use in code:**
```dart
import 'package:google_fonts/google_fonts.dart';

Text(
  'Hello World',
  style: GoogleFonts.roboto(
    fontSize: 20,
    fontWeight: FontWeight.bold,
  ),
)
```

**3. Set as default theme:**
```dart
MaterialApp(
  theme: ThemeData(
    textTheme: GoogleFonts.robotoTextTheme(),
  ),
)
```

### Option 2: Download and Bundle Fonts

**1. Download fonts:**
- [Google Fonts](https://fonts.google.com/)
- [Font Squirrel](https://www.fontsquirrel.com/)
- [DaFont](https://www.dafont.com/)

**2. Place in fonts directory:**
```
fonts/
├── Roboto-Regular.ttf
├── Roboto-Bold.ttf
├── Roboto-Italic.ttf
└── Roboto-BoldItalic.ttf
```

**3. Reference in pubspec.yaml:**
```yaml
flutter:
  fonts:
    - family: Roboto
      fonts:
        - asset: fonts/Roboto-Regular.ttf
          weight: 400
        - asset: fonts/Roboto-Bold.ttf
          weight: 700
        - asset: fonts/Roboto-Italic.ttf
          style: italic
```

**4. Use in code:**
```dart
Text(
  'Hello World',
  style: TextStyle(
    fontFamily: 'Roboto',
    fontWeight: FontWeight.bold,
  ),
)
```

## Font Files for Roboto

Download Roboto from:
- **Google Fonts:** https://fonts.google.com/specimen/Roboto
- **Direct Download:** https://github.com/googlefonts/roboto/releases

**Required files:**
```bash
# Download Roboto
curl -L https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Regular.ttf \
  -o fonts/Roboto-Regular.ttf

curl -L https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Bold.ttf \
  -o fonts/Roboto-Bold.ttf
```

## Recommended Approach

**Use `google_fonts` package instead of bundling:**

✅ **Advantages:**
- No manual font downloads
- Smaller app size
- Easy font switching
- Automatic font loading
- Supports all Google Fonts

❌ **Bundling fonts:**
- Increases app size
- Manual updates needed
- More maintenance

## Usage Example

```dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        textTheme: GoogleFonts.robotoTextTheme(
          Theme.of(context).textTheme,
        ),
        primaryTextTheme: GoogleFonts.robotoTextTheme(
          Theme.of(context).primaryTextTheme,
        ),
      ),
      home: MyHomePage(),
    );
  }
}
```

## Font Weights

```dart
// Using google_fonts
GoogleFonts.roboto(fontWeight: FontWeight.w100) // Thin
GoogleFonts.roboto(fontWeight: FontWeight.w300) // Light
GoogleFonts.roboto(fontWeight: FontWeight.w400) // Regular
GoogleFonts.roboto(fontWeight: FontWeight.w500) // Medium
GoogleFonts.roboto(fontWeight: FontWeight.w700) // Bold
GoogleFonts.roboto(fontWeight: FontWeight.w900) // Black
```

## Next Steps

1. **Recommended:** Add `google_fonts` to pubspec.yaml
2. **Or:** Download Roboto font files and place in `/fonts/` directory
3. Run `flutter pub get`
4. Hot restart the app
