# 📱 Android App Icons Guide

Hướng dẫn tạo và thêm app icons cho Flutter Android app.

---

## 🎨 ICON REQUIREMENTS

### **Standard Icons**
Place icons in these folders with corresponding sizes:

| Folder | Size (px) | DPI |
|--------|-----------|-----|
| `mipmap-mdpi/` | 48x48 | 160 |
| `mipmap-hdpi/` | 72x72 | 240 |
| `mipmap-xhdpi/` | 96x96 | 320 |
| `mipmap-xxhdpi/` | 144x144 | 480 |
| `mipmap-xxxhdpi/` | 192x192 | 640 |

### **Adaptive Icons (Android 8.0+)**
- **Foreground:** 108x108 dp canvas, 72x72 dp safe zone
- **Background:** Solid color or drawable
- Files: `ic_launcher_foreground.png`

### **Required Files**
```
mipmap-mdpi/
├── ic_launcher.png (48x48)
└── ic_launcher_round.png (48x48)

mipmap-hdpi/
├── ic_launcher.png (72x72)
└── ic_launcher_round.png (72x72)

mipmap-xhdpi/
├── ic_launcher.png (96x96)
└── ic_launcher_round.png (96x96)

mipmap-xxhdpi/
├── ic_launcher.png (144x144)
├── ic_launcher_round.png (144x144)
└── ic_launcher_foreground.png (432x432)

mipmap-xxxhdpi/
├── ic_launcher.png (192x192)
├── ic_launcher_round.png (192x192)
└── ic_launcher_foreground.png (432x432)

mipmap-anydpi-v26/
├── ic_launcher.xml
└── ic_launcher_round.xml
```

---

## 🚀 QUICK SETUP - Automated Tools

### **Option 1: flutter_launcher_icons (Recommended)**

**1. Install package:**
```yaml
# pubspec.yaml
dev_dependencies:
  flutter_launcher_icons: ^0.13.1
```

**2. Configure:**
```yaml
# pubspec.yaml
flutter_launcher_icons:
  android: true
  ios: false
  image_path: "assets/icon/app_icon.png"
  adaptive_icon_background: "#6366F1"
  adaptive_icon_foreground: "assets/icon/app_icon_foreground.png"
```

**3. Generate:**
```bash
flutter pub get
flutter pub run flutter_launcher_icons
```

### **Option 2: Android Studio Asset Studio**

**1. Right-click on `res` folder**
**2. New → Image Asset**
**3. Configure:**
   - Icon Type: Launcher Icons
   - Foreground Layer: Choose image
   - Background Layer: Choose color (#6366F1)
   - Legacy: Yes
   - Round Icon: Yes
   - Google Play Store: Yes (512x512)

**4. Click Finish**

### **Option 3: Online Tools**

**AppIcon.co**
- Go to: https://www.appicon.co
- Upload 1024x1024 icon
- Download Android package
- Extract to `res/` folder

**MakeAppIcon**
- Go to: https://makeappicon.com
- Upload icon
- Generate Android icons
- Download and extract

---

## 🎨 DESIGN GUIDELINES

### **Master Icon Specifications**
- **Size:** 1024x1024 px minimum
- **Format:** PNG with transparency
- **Safe zone:** Keep important content in center 80%
- **Colors:** Use brand colors (#6366F1 primary)

### **Adaptive Icon Guidelines**
- **Foreground:** Logo/symbol only
- **Background:** Solid color or simple pattern
- **No text:** System adds app name
- **Maskable:** Content in safe zone

### **Design Tips**
- ✅ Simple and recognizable
- ✅ Works in small sizes
- ✅ No text (system adds name)
- ✅ Contrasting colors
- ✅ Unique shape
- ❌ Too detailed
- ❌ Thin lines
- ❌ Multiple words

---

## 📝 CURRENT CONFIGURATION

### **App Theme Colors**
```xml
<!-- colors.xml -->
<color name="primary">#6366F1</color>      <!-- Indigo -->
<color name="secondary">#8B5CF6</color>    <!-- Purple -->
<color name="accent">#06B6D4</color>       <!-- Cyan -->
```

### **Icon Background**
Currently using `@color/primary` (#6366F1) for adaptive icon background.

### **Adaptive Icon Configuration**
```xml
<!-- mipmap-anydpi-v26/ic_launcher.xml -->
<adaptive-icon>
    <background android:drawable="@color/primary"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
```

---

## 🛠️ MANUAL ICON CREATION

### **Step 1: Create Master Icon**
- Design 1024x1024 px icon
- Export as PNG with transparency
- Save as `app_icon.png`

### **Step 2: Generate Sizes**

**Using ImageMagick:**
```bash
# Install ImageMagick
brew install imagemagick  # macOS
sudo apt-get install imagemagick  # Linux

# Generate all sizes
convert app_icon.png -resize 48x48 mipmap-mdpi/ic_launcher.png
convert app_icon.png -resize 72x72 mipmap-hdpi/ic_launcher.png
convert app_icon.png -resize 96x96 mipmap-xhdpi/ic_launcher.png
convert app_icon.png -resize 144x144 mipmap-xxhdpi/ic_launcher.png
convert app_icon.png -resize 192x192 mipmap-xxxhdpi/ic_launcher.png
```

**Using Sketch/Figma:**
- Export at different scales: @1x, @1.5x, @2x, @3x, @4x
- Name files: `ic_launcher.png`
- Place in respective `mipmap-*` folders

### **Step 3: Create Round Icons**
- Same sizes as standard icons
- Circular crop or round design
- Save as `ic_launcher_round.png`

### **Step 4: Create Foreground**
- Size: 432x432 px
- Content in center 288x288 px (safe zone)
- Transparent background
- Save as `ic_launcher_foreground.png`

---

## ✅ TESTING ICONS

### **1. Build and Install**
```bash
flutter build apk
flutter install
```

### **2. Check Home Screen**
- Long press home screen
- Add widget/app
- Verify icon appears correctly

### **3. Test Adaptive Icons**
- Different launcher apps
- Different themes
- Different shapes (circle, square, rounded)

### **4. Test Different Android Versions**
- Android 7 (API 24): Standard icons
- Android 8+ (API 26+): Adaptive icons
- Android 13+ (API 33+): Themed icons

---

## 🎯 CHECKLIST

- [ ] Created 1024x1024 master icon
- [ ] Generated all required sizes
- [ ] Created round variants
- [ ] Created adaptive foreground
- [ ] Set background color
- [ ] Tested on device
- [ ] Tested on different launchers
- [ ] Verified on Play Store listing
- [ ] Created Play Store 512x512 icon
- [ ] Backed up source files

---

## 📦 EXAMPLE STRUCTURE

```
res/
├── mipmap-mdpi/
│   ├── ic_launcher.png (48x48)
│   └── ic_launcher_round.png (48x48)
│
├── mipmap-hdpi/
│   ├── ic_launcher.png (72x72)
│   └── ic_launcher_round.png (72x72)
│
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96x96)
│   └── ic_launcher_round.png (96x96)
│
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144x144)
│   ├── ic_launcher_round.png (144x144)
│   └── ic_launcher_foreground.png (432x432)
│
├── mipmap-xxxhdpi/
│   ├── ic_launcher.png (192x192)
│   ├── ic_launcher_round.png (192x192)
│   └── ic_launcher_foreground.png (432x432)
│
├── mipmap-anydpi-v26/
│   ├── ic_launcher.xml
│   └── ic_launcher_round.xml
│
└── values/
    └── colors.xml (icon background color)
```

---

## 🔗 RESOURCES

- **Material Design Icons:** https://material.io/design/iconography
- **Android Icon Guidelines:** https://developer.android.com/guide/practices/ui_guidelines/icon_design_launcher
- **Adaptive Icons:** https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive
- **flutter_launcher_icons:** https://pub.dev/packages/flutter_launcher_icons
- **AppIcon.co:** https://www.appicon.co
- **MakeAppIcon:** https://makeappicon.com

---

## 💡 PRO TIPS

1. **Use vector for master** - Create in SVG/AI, export to PNG
2. **Keep it simple** - Icons should work at 48x48
3. **Test early** - Check on real devices
4. **Brand consistency** - Match your app's design
5. **Safe zone** - Keep content in center 72dp for adaptive
6. **High contrast** - Should work on any background
7. **No text** - App name shows below icon

---

**🎨 READY TO CREATE YOUR ICON!** 🚀
