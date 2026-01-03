# Flutter Assets Directory

This directory contains all static assets for the Flutter application.

## Directory Structure

```
assets/
├── images/          # Images and photos
├── icons/           # App icons and UI icons
├── animations/      # Lottie animations
└── fonts/           # Custom fonts (referenced from root/fonts/)
```

## Usage

Assets are referenced in the application like this:

```dart
// Images
Image.asset('assets/images/logo.png')

// Icons
Image.asset('assets/icons/icon_home.png')

// Animations
Lottie.asset('assets/animations/loading.json')
```

## Adding Assets

1. Place files in the appropriate subdirectory
2. Make sure assets are declared in `pubspec.yaml`:
   ```yaml
   flutter:
     assets:
       - assets/images/
       - assets/icons/
       - assets/animations/
   ```
3. Run `flutter pub get` to update assets
4. Use hot restart (not hot reload) to see new assets

## File Naming Convention

- Use lowercase with underscores: `my_image.png`
- Use descriptive names: `logo.png`, `icon_home.png`
- Include size suffix for variants: `logo@2x.png`, `logo@3x.png`

## Supported Formats

### Images
- PNG (recommended for transparency)
- JPG (for photos)
- WebP (for smaller sizes)
- SVG (via flutter_svg package)

### Animations
- JSON (Lottie animations)
- GIF

## Asset Generation

You can use tools to generate assets:
- **Images**: [ImageMagick](https://imagemagick.org/)
- **Icons**: [Flutter Launcher Icons](https://pub.dev/packages/flutter_launcher_icons)
- **Animations**: [LottieFiles](https://lottiefiles.com/)

## Best Practices

1. **Optimize images** before adding them
2. **Use vector graphics** (SVG) when possible
3. **Provide multiple resolutions** for raster images
4. **Keep file sizes small** (<500KB per image)
5. **Remove unused assets** regularly

## Current Assets

Run `flutter pub run` to see all registered assets.
