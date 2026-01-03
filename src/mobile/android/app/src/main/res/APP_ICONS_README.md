# 🎨 Android App Icons - Required

**Status:** ⚠️ Missing - Must Generate Before Release  
**Priority:** HIGH for production, Optional for development  

---

## 📋 REQUIRED ICON FOLDERS

You need to create these folders with icons:

```
/mobile/android/app/src/main/res/
├── mipmap-mdpi/          (48x48 dp, ~48px)
├── mipmap-hdpi/          (72x72 dp, ~72px)
├── mipmap-xhdpi/         (96x96 dp, ~96px)
├── mipmap-xxhdpi/        (144x144 dp, ~144px)
└── mipmap-xxxhdpi/       (192x192 dp, ~192px)
```

---

## 🖼️ REQUIRED ICONS IN EACH FOLDER

Each folder needs these 4 files:

### 1. `ic_launcher.png`
- **Square icon** (legacy launcher)
- Full bleed, no transparency
- Size varies by density (see below)

### 2. `ic_launcher_round.png`
- **Round icon** (for round launcher displays)
- Circular design
- Same size as ic_launcher.png

### 3. `ic_launcher_foreground.png`
- **Adaptive icon foreground** (Android 8+)
- Transparent background
- Content in safe zone (108dp total, 72dp safe zone)
- Size: Same as ic_launcher.png

### 4. `ic_launcher_background.png`
- **Adaptive icon background** (Android 8+)
- No transparency
- Full 108dp canvas
- Size: Same as ic_launcher.png

---

## 📐 ICON SIZES BY DENSITY

| Density | Folder | ic_launcher.png | All other icons |
|---------|--------|-----------------|-----------------|
| **mdpi** | mipmap-mdpi | 48x48 px | 48x48 px |
| **hdpi** | mipmap-hdpi | 72x72 px | 72x72 px |
| **xhdpi** | mipmap-xhdpi | 96x96 px | 96x96 px |
| **xxhdpi** | mipmap-xxhdpi | 144x144 px | 144x144 px |
| **xxxhdpi** | mipmap-xxxhdpi | 192x192 px | 192x192 px |

---

## ✅ ADAPTIVE ICON XML (Already Created)

These XML files are already created and configured:

- ✅ `/res/mipmap-anydpi-v26/ic_launcher.xml`
- ✅ `/res/mipmap-anydpi-v26/ic_launcher_round.xml`

They reference:
- Background color: `@color/ic_launcher_background` (#2196F3)
- Foreground: `@mipmap/ic_launcher_foreground`

---

## 🚀 HOW TO GENERATE ICONS

### Option 1: Android Studio (Recommended) ⭐

1. Open project in Android Studio
2. Right-click `res/` folder
3. Select **New > Image Asset**
4. Choose **Launcher Icons (Adaptive and Legacy)**
5. Upload your icon design (512x512 px minimum)
6. Configure foreground and background
7. Preview all sizes
8. Click **Next** then **Finish**

**This will automatically generate all required icons!**

### Option 2: Online Tools

**Icon Kitchen:** https://icon.kitchen/
- Upload your design
- Customize adaptive icon
- Download all Android sizes
- Free and easy to use

**App Icon Generator:** https://appicon.co/
- Generate icons for Android & iOS
- Multiple formats
- Batch generation

**Android Asset Studio:** https://romannurik.github.io/AndroidAssetStudio/
- Official Google tool
- Launcher icon generator
- Adaptive icon support

### Option 3: Manual Design

If you're designing manually:

1. Create base icon: **512x512 px**
2. Use tools like:
   - Figma
   - Adobe Illustrator
   - Sketch
   - Canva

3. Export at different scales:
   - mdpi: 48x48 (9.375% of 512)
   - hdpi: 72x72 (14.0625% of 512)
   - xhdpi: 96x96 (18.75% of 512)
   - xxhdpi: 144x144 (28.125% of 512)
   - xxxhdpi: 192x192 (37.5% of 512)

---

## 🎨 DESIGN GUIDELINES

### Adaptive Icon Guidelines (Android 8+)

**Canvas:** 108x108 dp  
**Safe Zone:** 72x72 dp (centered)  
**Outer 18dp on each side:** May be cropped on some devices

**Layers:**
1. **Background:** Full color or pattern, no transparency
2. **Foreground:** Your icon design, can have transparency

**Important:**
- Keep important content in 72x72 safe zone
- Background extends full 108x108
- System may apply various masks (circle, squircle, rounded square)
- Icon may have parallax effect

### Legacy Icon Guidelines

**Canvas:** Full square (48dp base)  
**Content:** Can fill entire canvas  
**Format:** PNG with transparency  
**Style:** Material Design recommended

**Tips:**
- Use consistent style across all densities
- Avoid text (use symbols/graphics)
- High contrast for visibility
- Test on light and dark backgrounds

---

## 🔍 CURRENT STATUS

### ✅ Already Created:
- ✅ Adaptive icon XML files
- ✅ Icon background color defined (#2196F3)
- ✅ Folder structure ready

### ❌ Still Need:
- ❌ Generate PNG icons for all densities
- ❌ Create 5 folders (mdpi to xxxhdpi)
- ❌ Place 4 icons in each folder (20 files total)

---

## ⚠️ IMPACT OF MISSING ICONS

### During Development:
- ⚠️ App will use default Android icon (robot)
- ⚠️ May see placeholder icon on home screen
- ✅ App will still build and run normally

### For Production:
- ❌ **Must have proper icons before release!**
- ❌ Play Store will reject app without icons
- ❌ Poor user experience with default icon

---

## 🎯 QUICK START (Use Android Studio)

### Fastest way to generate icons:

```bash
# 1. Open project in Android Studio
open -a "Android Studio" /path/to/mobile/android

# 2. In Android Studio:
# - Right-click: app/src/main/res
# - New > Image Asset
# - Launcher Icons (Adaptive and Legacy)
# - Upload your 512x512 icon
# - Generate!

# 3. Verify icons created:
ls -la app/src/main/res/mipmap-*/
```

**Done!** All 20 icon files will be generated automatically.

---

## 📦 TEMPORARY SOLUTION (Development Only)

For quick testing, you can use a placeholder icon:

1. Download a simple icon (512x512)
2. Use Icon Kitchen to generate all sizes
3. Extract to proper folders
4. Test app with placeholder
5. Replace with real icon later

**⚠️ DO NOT ship to production with placeholder!**

---

## ✅ VERIFICATION

After generating icons, verify:

```bash
cd /mobile/android/app/src/main/res

# Check all folders exist:
ls -d mipmap-*/

# Should show:
# mipmap-anydpi-v26/
# mipmap-hdpi/
# mipmap-mdpi/
# mipmap-xhdpi/
# mipmap-xxhdpi/
# mipmap-xxxhdpi/

# Check icon files in each:
find mipmap-* -name "ic_launcher*" -type f

# Should show 20+ files:
# - 2 XML files in mipmap-anydpi-v26/
# - 4 PNG files x 5 densities = 20 PNG files
```

**Total:** 22 files (2 XML + 20 PNG)

---

## 📚 REFERENCES

**Official Docs:**
- [Android App Icons Guide](https://developer.android.com/distribute/google-play/resources/icon-design-specifications)
- [Adaptive Icons](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)
- [Material Design Icons](https://material.io/design/iconography/product-icons.html)

**Tools:**
- [Icon Kitchen](https://icon.kitchen/) - Best for Android
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)
- [App Icon Generator](https://appicon.co/)

---

## 🎉 NEXT STEPS

1. **Design your app icon** (512x512 px minimum)
2. **Use Android Studio** to generate all sizes
3. **Verify** 22 files created
4. **Test** on device/emulator
5. **Update** before production release

---

**Created:** January 2, 2026  
**Status:** ⚠️ Icons Missing - Use Android Studio to Generate  
**Priority:** LOW (dev), HIGH (production)  
**Time to Generate:** ~5 minutes with Android Studio
