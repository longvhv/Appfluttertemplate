# 🏗️ Architecture Overview

## System Design

This application follows **enterprise-grade architecture** with **platform-agnostic design** for seamless React Native migration.

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     PRESENTATION                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Pages     │  │  Components  │  │   Layouts    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   DESIGN SYSTEM                          │
│  ┌──────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │  Atoms   │→ │  Molecules  │→ │   Organisms      │   │
│  └──────────┘  └─────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  BUSINESS LOGIC                          │
│  ┌──────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │  Hooks   │  │  Contexts   │  │   Services       │   │
│  └──────────┘  └─────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                      DATA LAYER                          │
│  ┌──────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │   API    │  │   Storage   │  │   State Mgmt     │   │
│  └──────────┘  └─────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Design Principles

### 1. **Separation of Concerns**
- UI components handle presentation only
- Business logic in hooks and contexts
- Data layer abstracts API and storage

### 2. **Atomic Design**
- **Atoms**: Basic building blocks (Button, Input, Text)
- **Molecules**: Simple combinations (Card, ListItem, SearchBar)
- **Organisms**: Complex components (Modal, Header, Navigation)
- **Pages**: Full screens composed of organisms

### 3. **Platform Agnostic**
- Components use props interface, not implementation
- Styling separated from logic
- Platform-specific code isolated

### 4. **Type Safety**
- Full TypeScript coverage
- Strict prop types
- Inference where possible

### 5. **Composition Over Inheritance**
- Small, focused components
- Compound patterns (Card.Header, Card.Body)
- Higher-order components for cross-cutting concerns

---

## 📁 Project Structure

```
src/
├── components/
│   ├── atoms/              # ⚛️ Basic UI elements
│   │   ├── Button.tsx      # Buttons with variants
│   │   ├── Input.tsx       # Form inputs
│   │   ├── Text.tsx        # Typography
│   │   ├── Badge.tsx       # Status indicators
│   │   ├── Avatar.tsx      # User avatars
│   │   └── Switch.tsx      # Toggle switches
│   │
│   ├── molecules/          # 🧩 Component combinations
│   │   ├── Card.tsx        # Content containers
│   │   ├── ListItem.tsx    # List row component
│   │   ├── SearchBar.tsx   # Search input
│   │   └── FormField.tsx   # Input with validation
│   │
│   ├── organisms/          # 🏗️ Complex components
│   │   └── Modal.tsx       # Dialog/modal component
│   │
│   ├── ui/                 # 📦 Centralized exports
│   │   └── index.ts        # Export all components
│   │
│   └── legacy/             # 🗂️ Old components (to refactor)
│       ├── PageHeader.tsx
│       └── BottomNav.tsx
│
├── pages/                  # 📄 Full page components
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ForgotPassword.tsx
│   ├── core/
│   │   ├── Home.tsx
│   │   ├── Settings.tsx
│   │   └── Notifications.tsx
│   ├── settings/
│   │   ├── Profile.tsx
│   │   ├── ChangePassword.tsx
│   │   ├── Privacy.tsx
│   │   ├── Appearance.tsx
│   │   └── LanguagePage.tsx
│   └── support/
│       ├── HelpCenter.tsx
│       ├── FAQ.tsx
│       └── WhatsNew.tsx
│
├── contexts/               # 🎭 Global state
│   ├── AuthContext.tsx     # Authentication state
│   ├── LanguageContext.tsx # i18n state
│   └── AppearanceContext.tsx # Theme/density state
│
├── hooks/                  # 🪝 Custom hooks
│   ├── useAuth.ts          # Auth operations
│   ├── useLanguage.ts      # Language helpers
│   └── useTheme.ts         # Theme helpers
│
├── utils/                  # 🛠️ Helper functions
│   ├── validation.ts       # Form validation
│   ├── formatting.ts       # Date/number formatting
│   └── storage.ts          # localStorage abstraction
│
├── types/                  # 📝 TypeScript types
│   └── index.ts            # Shared types
│
├── constants/              # 🔒 Constants
│   ├── theme.ts            # Colors, spacing, fonts
│   └── translations.ts     # i18n strings
│
└── styles/                 # 🎨 Global styles
    └── globals.css         # CSS variables, Tailwind
```

---

## 🔄 Data Flow

### 1. **User Interaction** → Component
```tsx
// User clicks button
<Button onPress={() => handleLogin()} />
```

### 2. **Component** → Hook
```tsx
// Component calls hook
const { login } = useAuth();
await login(email, password);
```

### 3. **Hook** → API
```tsx
// Hook calls API
const response = await fetch('/api/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

### 4. **API** → Context
```tsx
// Hook updates context
setUser(response.data.user);
```

### 5. **Context** → Components
```tsx
// All components re-render with new data
const { user } = useAuth();
```

---

## 🎨 Styling System

### CSS Variables (Web)
```css
/* globals.css */
:root {
  --background: #f9fafb;
  --foreground: #111827;
  --card: #ffffff;
  --spacing-adaptive: 1rem;
}

.dark {
  --background: #111827;
  --foreground: #f9fafb;
  --card: #1f2937;
}

.density-compact {
  --spacing-adaptive: 0.75rem;
}

.density-comfortable {
  --spacing-adaptive: 1.5rem;
}
```

### Tailwind Classes
```tsx
// Use utility classes
<div className="bg-card dark:bg-card px-adaptive py-adaptive" />
```

### Design System Components (Preferred)
```tsx
// Use design system
<Card variant="elevated" padding="md">
  <Text variant="h2">Title</Text>
</Card>
```

---

## 🧪 State Management

### Global State (Context API)
- **AuthContext**: User authentication, login/logout
- **LanguageContext**: Current language, translations
- **AppearanceContext**: Theme, density, font size

### Local State (useState)
- Form inputs
- UI toggles
- Modal visibility
- Loading states

### Server State (Future: React Query)
- API data caching
- Optimistic updates
- Background refetching

---

## 🔐 Security Patterns

### Authentication Flow
```
1. User enters credentials
2. Hash password client-side (optional)
3. Send to API over HTTPS
4. API validates & returns JWT
5. Store JWT in HttpOnly cookie (web) or SecureStore (RN)
6. Include JWT in subsequent requests
7. Refresh token before expiry
```

### Data Validation
```tsx
// Client-side validation
<FormField
  validationRules={{
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  }}
/>

// Server-side validation (always!)
// Never trust client
```

---

## 🌍 Internationalization (i18n)

### Translation Structure
```typescript
// constants/translations.ts
export const translations = {
  en: {
    'login.welcome': 'Welcome Back',
    'login.email': 'Email Address',
    // ...
  },
  vi: {
    'login.welcome': 'Chào mừng trở lại',
    'login.email': 'Địa chỉ Email',
    // ...
  },
};
```

### Usage
```tsx
const { t } = useLanguage();
<Text>{t('login.welcome')}</Text>
```

---

## 🎯 Performance Optimization

### Code Splitting (Web)
```tsx
// Lazy load pages
const Settings = lazy(() => import('./pages/Settings'));
```

### Memoization
```tsx
// Expensive calculations
const sortedData = useMemo(() => {
  return data.sort(compareFn);
}, [data]);

// Prevent re-renders
const MemoizedComponent = React.memo(MyComponent);
```

### Virtualization
```tsx
// Long lists (Future)
import { VirtualizedList } from 'react-native';
```

---

## 🧪 Testing Strategy

### Unit Tests
- Test business logic (hooks, utils)
- Test validation functions
- Test formatters

### Component Tests
- Test component rendering
- Test user interactions
- Test prop variations

### Integration Tests
- Test user flows
- Test API integration
- Test context providers

### E2E Tests (Future)
- Test critical paths
- Test on real devices

---

## 📦 Build & Deployment

### Web
```bash
# Development
npm run dev

# Production build
npm run build

# Preview
npm run preview
```

### React Native (Future)
```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android

# Release builds
cd ios && pod install
npx react-native run-ios --configuration Release
```

---

## 🚀 Scalability Considerations

### Current Scale: ✅
- **Pages**: 17
- **Components**: 40+
- **Contexts**: 3
- **Users**: 1-10k

### Medium Scale (10k-100k users):
- Add React Query for server state
- Implement code splitting
- Add error boundaries
- Set up monitoring (Sentry)
- Add analytics

### Large Scale (100k+ users):
- Migrate to monorepo (shared code)
- Add micro-frontends
- Implement CDN for static assets
- Add service workers (PWA)
- Server-side rendering (Next.js)

---

## 🔄 Migration Path to React Native

### Effort Breakdown:
- **0% effort**: Business logic (hooks, contexts, utils)
- **20% effort**: Design system components (just styling)
- **30% effort**: Page components (minor adjustments)
- **50% effort**: Navigation and platform APIs

### Total Migration Time: **6-8 weeks**

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for details.

---

## 📚 Technology Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool

### Styling
- **Tailwind CSS v4** - Utility-first CSS
- **Motion/React** - Animations
- **CSS Variables** - Theming

### State Management
- **Context API** - Global state
- **useState** - Local state
- **localStorage** - Persistence

### Future Additions
- **React Query** - Server state
- **Zod** - Runtime validation
- **React Hook Form** - Form management
- **Supabase** - Backend (optional)

---

## 🎓 Best Practices

1. ✅ Use design system components
2. ✅ Keep components small and focused
3. ✅ Separate business logic from UI
4. ✅ Use TypeScript strictly
5. ✅ Follow naming conventions
6. ✅ Document complex logic
7. ✅ Write tests for critical paths
8. ✅ Optimize performance incrementally
9. ✅ Plan for mobile from day 1
10. ✅ Measure before optimizing

---

## 📖 Documentation

- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Component documentation
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - React Native migration
- [examples/](./examples/) - Usage examples
- [ARCHITECTURE.md](./ARCHITECTURE.md) - This file

---

## 🤝 Contributing

When adding new features:
1. Follow atomic design principles
2. Use existing design system components
3. Add TypeScript types
4. Update documentation
5. Test on light & dark modes
6. Consider React Native compatibility

---

## 📈 Roadmap

### Q1 2025
- ✅ Design system foundation
- ✅ Dark mode implementation
- ✅ Display density system
- ✅ 17 pages complete

### Q2 2025
- [ ] React Native migration
- [ ] Add React Query
- [ ] Implement testing
- [ ] Performance optimization

### Q3 2025
- [ ] Supabase integration
- [ ] Real-time features
- [ ] Push notifications
- [ ] Offline support

### Q4 2025
- [ ] App Store deployment
- [ ] Analytics integration
- [ ] A/B testing
- [ ] Scale to 100k users

---

**Built with ❤️ for scalability and developer experience**
