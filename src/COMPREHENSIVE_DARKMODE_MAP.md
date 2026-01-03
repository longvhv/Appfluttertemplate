# Comprehensive Dark Mode Mapping

## Color Replacement Pattern (Apply to ALL pages)

### Background Colors
```tsx
// Cards, containers, modals
bg-white → bg-card dark:bg-card

// Hover states  
bg-gray-50 → bg-muted/50 dark:bg-muted/50
hover:bg-gray-50 → hover:bg-muted/50 dark:hover:bg-muted/50

// Secondary backgrounds
bg-gray-100 → bg-muted dark:bg-muted
bg-gray-200 → bg-muted dark:bg-muted

// Gradient backgrounds (auth pages)
bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100
→ bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950

// Colored backgrounds (info cards)
bg-blue-50 → bg-blue-50 dark:bg-blue-950/30
bg-red-50 → bg-red-50 dark:bg-red-950/30
bg-green-50 → bg-green-50 dark:bg-green-950/30
bg-indigo-50 → bg-indigo-50 dark:bg-indigo-950/30
```

### Text Colors
```tsx
// Headings, primary text
text-gray-900 → text-foreground

// Body text, labels
text-gray-700 → text-muted-foreground
text-gray-600 → text-muted-foreground

// Secondary text, descriptions
text-gray-500 → text-muted-foreground/70
text-gray-400 → text-muted-foreground/70

// Tertiary text (timestamps, meta)
text-gray-400 → text-muted-foreground/60
```

### Border Colors
```tsx
// Standard borders
border-gray-200 → border-border dark:border-border
border-gray-300 → border-border dark:border-border

// Subtle borders (dividers)
border-gray-100 → border-border/50 dark:border-border/50

// Input borders
border-gray-300 → border-border dark:border-border
```

### Interactive Elements
```tsx
// Links
text-indigo-600 → text-indigo-600 dark:text-indigo-400
hover:text-indigo-700 → hover:text-indigo-700 dark:hover:text-indigo-300

// Icon colors
text-gray-400 → text-muted-foreground/70
text-gray-600 → text-muted-foreground
hover:text-gray-600 → hover:text-foreground

// Disabled states
text-gray-400 → text-muted-foreground/50
opacity-50 → opacity-50 (keep as is)
```

### Form Elements
```tsx
// Input fields
className="... border border-gray-300 ..."
→ className="... bg-background dark:bg-background border border-border dark:border-border text-foreground ..."

// Placeholders (handled by CSS)
placeholder:text-gray-400 → placeholder:text-muted-foreground/60

// Labels
text-gray-700 → text-muted-foreground
```

### Special Cases
```tsx
// Toggle switches (bg-white for thumb is OK - creates contrast)
bg-white → bg-white (keep for switch thumbs)

// Overlay backgrounds
bg-black/50 → bg-black/50 (keep as is)

// Color-coded elements (badges, status)
bg-indigo-100 → bg-indigo-100 dark:bg-indigo-950/50
text-indigo-600 → text-indigo-600 dark:text-indigo-400

bg-green-100 → bg-green-100 dark:bg-green-950/50
text-green-600 → text-green-600 dark:text-green-400

bg-red-100 → bg-red-100 dark:bg-red-950/50
text-red-600 → text-red-600 dark:text-red-400
```

## Page-by-Page Migration Status

### ✅ Completed (Dark Mode + Density)
- [x] Home.tsx
- [x] Settings.tsx
- [x] Notifications.tsx
- [x] Login.tsx
- [x] PageHeader.tsx
- [x] BottomNav.tsx

### 🔄 Auth Pages (Priority 1)
- [ ] Register.tsx - Same pattern as Login
- [ ] ForgotPassword.tsx - Same pattern as Login

### 🔄 Settings Pages (Priority 2)
- [ ] Profile.tsx
- [ ] ChangePassword.tsx
- [ ] Devices.tsx
- [ ] Privacy.tsx
- [ ] LanguagePage.tsx
- [ ] Appearance.tsx

### 🔄 Support Pages (Priority 3)
- [ ] HelpCenter.tsx - Most complex
- [ ] FAQ.tsx
- [ ] WhatsNew.tsx

## Common Patterns by Component Type

### Authentication Forms
```tsx
// Container
<div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950">
  
  // Form card
  <div className="bg-card dark:bg-card border border-border/50 dark:border-border">
    
    // Heading
    <h1 className="text-foreground">Title</h1>
    
    // Subtitle
    <p className="text-muted-foreground">Subtitle</p>
    
    // Input
    <input className="bg-background dark:bg-background border border-border dark:border-border text-foreground" />
    
    // Icon
    <Icon className="text-muted-foreground/70" />
    
    // Social buttons
    <button className="bg-card dark:bg-card border-2 border-border dark:border-border hover:bg-muted/50 dark:hover:bg-muted/50">
```

### Settings List Items
```tsx
<div className="bg-card dark:bg-card border border-border dark:border-border">
  {items.map(item => (
    <div className="hover:bg-muted/50 dark:hover:bg-muted/50 border-b border-border/50 dark:border-border/50">
      <p className="text-foreground">{item.title}</p>
      <p className="text-muted-foreground">{item.desc}</p>
    </div>
  ))}
</div>
```

### Cards with Headers
```tsx
<div className="bg-card dark:bg-card border border-border dark:border-border">
  <h3 className="text-foreground">Card Title</h3>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Modals/Overlays
```tsx
<div className="fixed inset-0 bg-black/50 z-50">
  <div className="bg-card dark:bg-card">
    <div className="border-b border-border dark:border-border">
      <h3 className="text-foreground">Modal Title</h3>
    </div>
    <div className="text-muted-foreground">
      Content
    </div>
  </div>
</div>
```

### Info/Alert Cards
```tsx
<div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
  <p className="text-blue-900 dark:text-blue-100">Info message</p>
  <p className="text-blue-700 dark:text-blue-300">Details</p>
</div>
```

## Testing Checklist

After applying dark mode to each page:

1. **Light Mode**
   - Check all text is readable
   - Borders are visible but subtle
   - Hover states work
   - Cards have proper elevation

2. **Dark Mode**
   - Check all text contrasts well
   - No #FFFFFF or #000000 (use semantic colors)
   - Gradients don't look washed out
   - Icons are visible
   - Input fields are distinguishable from background

3. **Transitions**
   - Theme switch is smooth
   - No flash of unstyled content
   - All elements transition together

4. **Interactive States**
   - Hover colors work in both modes
   - Focus rings visible
   - Active states clear
   - Disabled states appropriate

## Priority Order

1. **Phase 1: Authentication** (User's first impression)
   - Register.tsx
   - ForgotPassword.tsx

2. **Phase 2: Core Settings** (Most used)
   - Profile.tsx
   - ChangePassword.tsx
   - Devices.tsx

3. **Phase 3: Privacy & Language** (Important but less frequent)
   - Privacy.tsx
   - LanguagePage.tsx
   - Appearance.tsx

4. **Phase 4: Support Pages** (Occasional use)
   - HelpCenter.tsx
   - FAQ.tsx
   - WhatsNew.tsx
