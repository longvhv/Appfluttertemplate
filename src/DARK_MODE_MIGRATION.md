# Dark Mode Migration Pattern

## Chuẩn hóa Semantic Colors

### Background Colors
- `bg-white` → `bg-card dark:bg-card`
- `bg-gray-50` → `bg-muted/50 dark:bg-muted/50` (for hover)
- `bg-gray-100` → `bg-muted dark:bg-muted`

### Text Colors
- `text-gray-900` → `text-foreground`
- `text-gray-700` → `text-muted-foreground`
- `text-gray-600` → `text-muted-foreground`
- `text-gray-500` → `text-muted-foreground/70`
- `text-gray-400` → `text-muted-foreground/70`

### Border Colors
- `border-gray-200` → `border-border dark:border-border`
- `border-gray-300` → `border-border dark:border-border`
- `border-gray-100` → `border-border/50 dark:border-border/50`

### Input/Form Fields
- Add `bg-background dark:bg-background` for inputs
- Add `text-foreground` for input text
- Use `text-muted-foreground/70` for icons and placeholders

### Gradient Backgrounds (auth pages)
- Add dark variants: `dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950`

### Brand Colors (keep original)
- Indigo/Purple gradients: Add `dark:text-indigo-400` variants for links
- Green/Red: Keep original but adjust opacity for dark mode

## Files Migrated
✅ Login.tsx
✅ Home.tsx  
✅ Notifications.tsx
✅ Settings.tsx
✅ PageHeader.tsx

## Files Pending
- Register.tsx
- ForgotPassword.tsx
- Profile.tsx
- ChangePassword.tsx
- Devices.tsx
- Privacy.tsx
- LanguagePage.tsx
- HelpCenter.tsx
- FAQ.tsx
- WhatsNew.tsx
- Appearance.tsx
