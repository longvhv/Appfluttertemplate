# 🎨 Design System Documentation

## Overview

This design system follows **Atomic Design principles** and is built to be **platform-agnostic**, making it easy to migrate to React Native.

## Architecture

```
components/
├── atoms/          # Basic building blocks
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Text.tsx
│   ├── Badge.tsx
│   ├── Avatar.tsx
│   └── Switch.tsx
├── molecules/      # Combinations of atoms
│   ├── Card.tsx
│   ├── ListItem.tsx
│   ├── SearchBar.tsx
│   └── FormField.tsx
├── organisms/      # Complex components
│   └── Modal.tsx
└── ui/
    └── index.ts    # Centralized exports
```

---

## 🧱 Atoms (Basic Components)

### Button

**Purpose:** Primary interaction component with multiple variants and states.

**Usage:**
```tsx
import { Button } from '@/components/ui';
import { Save } from 'lucide-react';

// Basic
<Button variant="primary" size="md">
  Click Me
</Button>

// With Icon
<Button variant="gradient" icon={Save} iconPosition="left">
  Save Changes
</Button>

// Loading State
<Button loading variant="primary">
  Processing...
</Button>

// Full Width
<Button fullWidth variant="secondary">
  Submit
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `icon`: LucideIcon component
- `iconPosition`: 'left' | 'right'
- `fullWidth`: boolean
- `disabled`: boolean
- `loading`: boolean

**React Native Migration:**
- Replace `motion.button` with `Pressable`
- Replace Tailwind with StyleSheet
- Keep props interface identical

---

### Input

**Purpose:** Text input with validation, icons, and multiple variants.

**Usage:**
```tsx
import { Input } from '@/components/ui';
import { Mail, Eye } from 'lucide-react';

// Basic
<Input
  value={email}
  onChange={setEmail}
  placeholder="Enter email"
/>

// With Label & Icons
<Input
  label="Email Address"
  type="email"
  value={email}
  onChange={setEmail}
  leftIcon={Mail}
  required
/>

// Password with toggle
<Input
  label="Password"
  type={showPassword ? 'text' : 'password'}
  value={password}
  onChange={setPassword}
  rightIcon={Eye}
  onRightIconClick={() => setShowPassword(!showPassword)}
/>

// With Error
<Input
  value={username}
  onChange={setUsername}
  error="Username already exists"
/>
```

**Props:**
- `value`: string (required)
- `onChange`: (value: string) => void (required)
- `type`: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
- `label`: string
- `error`: string
- `hint`: string
- `size`: 'sm' | 'md' | 'lg'
- `variant`: 'default' | 'filled' | 'flushed'
- `leftIcon` / `rightIcon`: LucideIcon

**React Native Migration:**
- Replace `<input>` with `<TextInput>`
- Keep onChange interface
- Icon positioning similar with absolute positioning

---

### Text

**Purpose:** Typography component with consistent styling.

**Usage:**
```tsx
import { Text } from '@/components/ui';

// Headings
<Text variant="h1" weight="bold">Main Title</Text>
<Text variant="h2">Subtitle</Text>

// Body Text
<Text variant="body" color="muted">
  This is body text with muted color
</Text>

// Truncation
<Text variant="body" numberOfLines={2}>
  This is a very long text that will be truncated after 2 lines...
</Text>

// Colors
<Text color="primary">Primary Color</Text>
<Text color="error">Error Message</Text>
<Text color="success">Success!</Text>
```

**Props:**
- `variant`: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label'
- `color`: 'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'error' | 'warning'
- `align`: 'left' | 'center' | 'right'
- `weight`: 'normal' | 'medium' | 'semibold' | 'bold'
- `numberOfLines`: number (for truncation)

**React Native Migration:**
- Direct 1:1 mapping to `<Text>`
- numberOfLines works natively in RN

---

### Badge

**Purpose:** Status indicators and labels.

**Usage:**
```tsx
import { Badge } from '@/components/ui';

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="primary" dot>New</Badge>
```

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `dot`: boolean

---

### Avatar

**Purpose:** User profile images with fallbacks.

**Usage:**
```tsx
import { Avatar } from '@/components/ui';
import { Badge } from '@/components/ui';

// With Image
<Avatar src="https://..." alt="John Doe" size="md" />

// With Initials
<Avatar name="John Doe" size="lg" />

// With Badge
<Avatar 
  src="https://..." 
  name="John Doe"
  badge={<Badge variant="success" dot />}
/>
```

**Props:**
- `src`: string (image URL)
- `name`: string (for initials fallback)
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
- `badge`: ReactNode
- `fallback`: ReactNode

---

### Switch

**Purpose:** Toggle/switch component.

**Usage:**
```tsx
import { Switch } from '@/components/ui';

// Basic
<Switch checked={enabled} onChange={setEnabled} />

// With Label
<Switch
  checked={notifications}
  onChange={setNotifications}
  label="Enable Notifications"
  description="Receive push notifications"
/>
```

**Props:**
- `checked`: boolean (required)
- `onChange`: (checked: boolean) => void (required)
- `size`: 'sm' | 'md' | 'lg'
- `label`: string
- `description`: string

---

## 🧩 Molecules (Compound Components)

### Card

**Purpose:** Container component with variants.

**Usage:**
```tsx
import { Card } from '@/components/ui';

// Basic Card
<Card variant="elevated" padding="lg">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>

// Pressable Card
<Card
  variant="default"
  pressable
  onPress={() => console.log('Pressed')}
  hover
>
  Click me!
</Card>

// Compound Pattern
<Card variant="outlined">
  <Card.Header>
    <Text variant="h3">Header</Text>
  </Card.Header>
  <Card.Body>
    <Text>Content here</Text>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

**Props:**
- `variant`: 'default' | 'elevated' | 'outlined' | 'filled'
- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `hover`: boolean
- `pressable`: boolean
- `onPress`: () => void

---

### ListItem

**Purpose:** Reusable list item with icons and actions.

**Usage:**
```tsx
import { ListItem } from '@/components/ui';
import { Settings, ChevronRight } from 'lucide-react';

<ListItem
  title="Settings"
  subtitle="Manage your preferences"
  leftIcon={Settings}
  showChevron
  onPress={() => navigate('settings')}
/>

// With Custom Elements
<ListItem
  title="John Doe"
  subtitle="Software Engineer"
  leftElement={<Avatar name="John Doe" />}
  rightElement={<Badge variant="success">Online</Badge>}
/>
```

**Props:**
- `title`: string (required)
- `subtitle`: string
- `leftIcon` / `rightIcon`: LucideIcon
- `leftElement` / `rightElement`: ReactNode
- `showChevron`: boolean
- `onPress`: () => void

---

### SearchBar

**Purpose:** Search input with clear functionality.

**Usage:**
```tsx
import { SearchBar } from '@/components/ui';

<SearchBar
  value={query}
  onChange={setQuery}
  placeholder="Search users..."
  onClear={() => console.log('Cleared')}
/>
```

---

### FormField

**Purpose:** Input with built-in validation.

**Usage:**
```tsx
import { FormField } from '@/components/ui';

<FormField
  label="Username"
  value={username}
  onChange={setUsername}
  validationRules={{
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
  }}
/>

// Custom Validation
<FormField
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  validationRules={{
    custom: (val) => {
      if (!val.includes('@')) return 'Invalid email';
      return undefined;
    }
  }}
/>
```

---

## 🏗️ Organisms (Complex Components)

### Modal

**Purpose:** Dialog/modal component with multiple sizes and positions.

**Usage:**
```tsx
import { Modal, Button } from '@/components/ui';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
  position="center"
  footer={
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        Confirm
      </Button>
    </Modal.Footer>
  }
>
  <Text>Are you sure you want to proceed?</Text>
</Modal>

// Bottom Sheet Style
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  position="bottom"
  size="full"
>
  <Text>Bottom sheet content</Text>
</Modal>
```

**Props:**
- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `position`: 'center' | 'bottom'
- `showCloseButton`: boolean
- `closeOnBackdrop`: boolean
- `footer`: ReactNode

---

## 🚀 Migration to React Native

### Key Principles:

1. **Keep Props Interface Identical**
   - All component props stay the same
   - Business logic doesn't change

2. **Replace Platform-Specific Elements**
   ```tsx
   // Web
   <button> → <Pressable>
   <input> → <TextInput>
   <div> → <View>
   <motion.div> → <Animated.View>
   ```

3. **Replace Styling**
   ```tsx
   // Web: Tailwind classes
   className="bg-card px-4 py-2"
   
   // React Native: StyleSheet
   style={styles.card}
   const styles = StyleSheet.create({
     card: { backgroundColor: theme.card, paddingHorizontal: 16, paddingVertical: 8 }
   })
   ```

4. **Use Theme Object**
   ```tsx
   // Both platforms use same theme
   const theme = {
     colors: {
       card: isDark ? '#1f2937' : '#ffffff',
       foreground: isDark ? '#f9fafb' : '#111827',
       // ...
     }
   }
   ```

### Example Migration:

**Web (Current):**
```tsx
export function Button({ variant, children, onClick }: ButtonProps) {
  return (
    <motion.button
      className={`px-4 py-2 ${variantStyles[variant]}`}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}
```

**React Native:**
```tsx
export function Button({ variant, children, onPress }: ButtonProps) {
  return (
    <Pressable
      style={[styles.base, variantStyles[variant]]}
      onPress={onPress}
    >
      <Animated.View entering={FadeIn}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
```

---

## 📝 Best Practices

### 1. Import from Central Index
```tsx
// ✅ Good
import { Button, Card, Text } from '@/components/ui';

// ❌ Avoid
import { Button } from '@/components/atoms/Button';
```

### 2. Use Compound Patterns
```tsx
// ✅ Good - Self-documenting
<Card>
  <Card.Header>...</Card.Header>
  <Card.Body>...</Card.Body>
  <Card.Footer>...</Card.Footer>
</Card>

// ❌ Avoid - Less clear
<Card>
  <div className="header">...</div>
  <div className="body">...</div>
</Card>
```

### 3. Prefer Component Props Over className
```tsx
// ✅ Good - Platform agnostic
<Button variant="primary" size="lg" fullWidth />

// ❌ Avoid - Web specific
<Button className="bg-blue-600 w-full px-8 py-4" />
```

### 4. Keep Business Logic Separate
```tsx
// ✅ Good - UI component only
function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <Avatar name={user.name} src={user.avatar} />
      <Text>{user.name}</Text>
    </Card>
  );
}

// Container handles logic
function UserCardContainer({ userId }: { userId: string }) {
  const user = useUser(userId);
  return <UserCard user={user} />;
}
```

---

## 🎯 Future Roadmap

- [ ] **IconButton** component
- [ ] **Checkbox** component
- [ ] **Radio** component
- [ ] **Select/Dropdown** component
- [ ] **Tabs** component
- [ ] **Accordion** component
- [ ] **Toast/Snackbar** component
- [ ] **Skeleton** loader
- [ ] **Progress** indicators
- [ ] **DatePicker** component
- [ ] **Slider** component
- [ ] **Tooltip** component

---

## 💡 Contributing

When adding new components:

1. Follow the atomic design hierarchy
2. Keep components platform-agnostic
3. Use TypeScript for all props
4. Document with examples
5. Test on both light and dark modes
6. Consider React Native compatibility

---

## 📚 Resources

- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- [React Native Documentation](https://reactnative.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
