# Display Density Migration Guide

## Adaptive Spacing Classes - Complete Reference

### Padding Classes
| Hardcoded | Adaptive Class | CSS Variable |
|-----------|----------------|--------------|
| `p-2` | `p-adaptive-sm` | `var(--spacing-2)` |
| `p-4` | `p-adaptive` or `card-padding` | `var(--spacing-4)` |
| `p-6` | `p-adaptive-lg` or `card-padding-lg` | `var(--spacing-6)` |
| `p-8` | `p-adaptive-xl` or `card-padding-xl` | `var(--spacing-8)` |
| `px-4` | `px-adaptive` | `var(--spacing-4)` |
| `py-2` | `py-adaptive-sm` | `var(--spacing-2)` |
| `py-3`, `py-4` | `py-adaptive` | `var(--spacing-4)` |
| `py-6` | `py-adaptive-lg` | `var(--spacing-6)` |

### Gap Classes
| Hardcoded | Adaptive Class | CSS Variable |
|-----------|----------------|--------------|
| `gap-2` | `gap-adaptive-sm` | `var(--spacing-2)` |
| `gap-3`, `gap-4` | `gap-adaptive` | `var(--spacing-3)` |
| `gap-6` | `gap-adaptive-lg` | `var(--spacing-4)` |

### Margin Classes
| Hardcoded | Adaptive Class | CSS Variable |
|-----------|----------------|--------------|
| `mb-2` | `mb-adaptive-sm` | `var(--spacing-2)` |
| `mb-3`, `mb-4` | `mb-adaptive` | `var(--spacing-4)` |
| `mb-6`, `mb-8` | `mb-adaptive-lg` or `section-spacing` | `var(--spacing-6)` |
| `mt-4` | `mt-adaptive` | `var(--spacing-4)` |

### Spacing Stack Classes
| Hardcoded | Adaptive Class | Effect |
|-----------|----------------|--------|
| `space-y-2` | `space-adaptive-y-sm` | Vertical spacing (small) |
| `space-y-3`, `space-y-4` | `space-adaptive-y` | Vertical spacing (normal) |

### Component-Specific Patterns
| Use Case | Class | Context |
|----------|-------|---------|
| Card container | `card-padding` | Standard cards (p-4) |
| Card container (large) | `card-padding-lg` | Forms, modals (p-6) |
| Card container (extra large) | `card-padding-xl` | Auth pages (p-8) |
| List items | `list-item-padding` | Settings items, notifications |
| Section spacing | `section-spacing` | Bottom margin between sections |

## Migration Pattern by Page Type

### Auth Pages (Login, Register, ForgotPassword)
```tsx
// Container
p-4 → p-adaptive
p-8 → card-padding-xl

// Form spacing
space-y-4 → space-adaptive-y
mb-2 → mb-adaptive-sm
mb-4 → mb-adaptive
mb-6 → mb-adaptive-lg
mb-8 → mb-adaptive-lg

// Button spacing
py-3 → py-adaptive-sm
gap-3 → gap-adaptive

// Dividers
my-6 → my-adaptive-lg
px-4 → px-adaptive
```

### Settings Pages (Profile, ChangePassword, Devices, Privacy, etc.)
```tsx
// Page container
px-4 → px-adaptive
py-4 → py-adaptive
py-6 → py-adaptive-lg

// Cards
p-4 → card-padding
p-6 → card-padding-lg

// List items
p-4 → list-item-padding

// Sections
mb-6 → section-spacing
gap-3 → gap-adaptive
```

### Support Pages (HelpCenter, FAQ, WhatsNew)
```tsx
// Similar to settings pages
px-4 → px-adaptive
py-4 → py-adaptive
p-4 → card-padding
mb-6 → section-spacing
gap-3 → gap-adaptive
```

## Files Status

### ✅ Completed (100% Adaptive)
- `/pages/Home.tsx`
- `/pages/Settings.tsx`
- `/pages/Notifications.tsx`
- `/pages/Login.tsx`
- `/components/PageHeader.tsx`
- `/components/BottomNav.tsx`

### 🔄 In Progress
- `/pages/Register.tsx`
- `/pages/ForgotPassword.tsx`
- `/pages/Profile.tsx`
- `/pages/ChangePassword.tsx`
- `/pages/Devices.tsx`
- `/pages/Privacy.tsx`
- `/pages/LanguagePage.tsx`
- `/pages/Appearance.tsx`
- `/pages/HelpCenter.tsx`
- `/pages/FAQ.tsx`
- `/pages/WhatsNew.tsx`

## Testing Checklist

After migration, test each page with all 3 density modes:

1. **Compact** (`density-compact`)
   - Spacing should be tight but still readable
   - No text overlap
   - Click targets still accessible (min 44x44px)

2. **Normal** (`density-normal`)
   - Default comfortable spacing
   - Good balance of information density

3. **Comfortable** (`density-comfortable`)
   - Generous spacing
   - Excellent readability
   - Optimal for accessibility

## CSS Variables Reference

```css
/* Compact */
--spacing-2: 0.25rem;  /* 4px */
--spacing-3: 0.5rem;   /* 8px */
--spacing-4: 0.75rem;  /* 12px */
--spacing-6: 1rem;     /* 16px */
--spacing-8: 1.25rem;  /* 20px */

/* Normal */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */

/* Comfortable */
--spacing-2: 0.75rem;  /* 12px */
--spacing-3: 1rem;     /* 16px */
--spacing-4: 1.5rem;   /* 24px */
--spacing-6: 2rem;     /* 32px */
--spacing-8: 2.5rem;   /* 40px */
```
