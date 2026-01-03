# Enterprise-Grade Mobile-First Application

A modern, fully-featured React application built with Material Design principles, gradient effects, and bilingual support (English-Vietnamese). This app is 100% React Native Ready with enterprise-grade architecture.

## 🎨 Features

### Authentication & Security
- ✅ **Login** - Modern design with email/password and social login (Google, Facebook, Zalo)
- ✅ **Register** - Advanced validation with password strength indicator, real-time feedback
- ✅ **Forgot Password** - Password recovery with success state
- ✅ **Protected Routes** - Authentication context with route guards

### Dashboard & Overview
- ✅ **Home Dashboard** - Beautiful gradient header, stats grid, features showcase, recent activity
- ✅ **Notifications** - Unread counter, animations, mark as read functionality
- ✅ **Settings Hub** - Profile card, grouped settings with modern UI

### Account Management
- ✅ **User Profile** - Avatar upload, personal info management, bio, location
- ✅ **Change Password** - Password requirements checker, show/hide toggle, validation
- ✅ **Devices Management** - View and sign out from active devices
- ✅ **Privacy & Security** - Toggle switches for 2FA, visibility, activity status, read receipts

### Preferences
- ✅ **Language Selection** - Bilingual support (English/Vietnamese) with flag icons
- ✅ **Real-time Translation** - All UI elements support both languages

### Support System
- ✅ **Help Center** - Categories, popular articles, FAQ accordion, support tickets, contact methods
- ✅ **FAQ** - Searchable, collapsible accordion with 25+ questions across 5 categories
- ✅ **What's New** - Timeline view of feature updates and releases
- ✅ **Contact Form** - Modal with name, email, and message fields

### Validation & UX
- ✅ **Smart Validation** - Email format, password strength, name length with bilingual error messages
- ✅ **Password Strength Indicator** - 5-level strength bar (Weak → Very Strong) with visual feedback
- ✅ **Show/Hide Password** - Eye icon toggle for all password fields
- ✅ **Real-time Feedback** - Checkmarks for valid input, error messages with smooth animations
- ✅ **Smart Button States** - Auto-disable when validation fails or during loading

## 🏗️ Architecture

### Project Structure
```
/
├── contexts/
│   ├── AuthContext.tsx          # Authentication state management
│   └── LanguageContext.tsx      # i18n and language switching
├── components/
│   ├── BottomNav.tsx            # Mobile-first bottom navigation
│   └── PageHeader.tsx           # Reusable page header with back button
├── pages/
│   ├── Home.tsx                 # Dashboard with stats and activity
│   ├── Notifications.tsx        # Notification center
│   ├── Settings.tsx             # Settings hub
│   ├── Login.tsx                # Authentication page
│   ├── Register.tsx             # Registration with validation
│   ├── ForgotPassword.tsx       # Password recovery
│   ├── Profile.tsx              # User profile management
│   ├── ChangePassword.tsx       # Password change
│   ├── Devices.tsx              # Device management
│   ├── Privacy.tsx              # Privacy settings
│   ├── LanguagePage.tsx         # Language selection
│   ├── HelpCenter.tsx           # Comprehensive help center
│   ├── FAQ.tsx                  # Frequently asked questions
│   └── WhatsNew.tsx             # Feature updates timeline
├── styles/
│   └── globals.css              # Global styles and design tokens
└── App.tsx                      # Main app with routing
```

### Technology Stack
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe code
- **Tailwind CSS v4** - Utility-first styling with custom design tokens
- **Motion** (Framer Motion) - Smooth animations and transitions
- **Sonner** - Toast notifications
- **Lucide React** - Modern icon library
- **Context API** - State management for auth and language

### Design Principles
- **Mobile-First** - Optimized for mobile with responsive design
- **Material Design** - Following Material Design guidelines
- **Gradient Effects** - Beautiful gradients throughout the UI
- **Smooth Animations** - Motion-based animations for better UX
- **Accessibility** - WCAG compliant with proper semantics

## 🌐 Internationalization (i18n)

The app supports full bilingual functionality:

### Supported Languages
- 🇺🇸 **English**
- 🇻🇳 **Tiếng Việt**

### Translation Coverage
- All UI text and labels
- Validation error messages
- Success messages
- Page titles and descriptions
- Button labels and actions
- Navigation items

### Language Persistence
- Saved to localStorage
- Restored on app reload
- Context-based for global access

## 🎯 Key Features Breakdown

### Password Validation
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Visual strength indicator with 5 levels
- Real-time feedback with checkmarks

### Social Authentication
- **Google** - Official 4-color logo with subtle border
- **Facebook** - Brand blue (#1877F2) with white logo
- **Zalo** - Brand blue (#0068FF) with icon
- Smooth hover and tap animations

### Help Center Components
- **Header Card** - Colorful gradient with icon
- **Search Bar** - Bilingual placeholder
- **4 Categories** - Getting Started, Account, Troubleshooting, Security
- **Popular Articles** - Navigation arrows, 5 sample articles
- **FAQ Accordion** - Expand/collapse animation with detailed answers
- **Support Tickets** - Status badges, priority indicators, dates
- **Contact Support** - 4 methods with online indicators
- **Contact Form Modal** - Full-screen modal with smooth transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 🎨 Design System

### Color Palette
- **Primary**: Indigo-Purple gradient (#6366f1 → #a855f7)
- **Success**: Green (#10b981)
- **Warning**: Orange/Yellow (#f59e0b)
- **Error**: Red (#ef4444)
- **Neutral**: Gray scale

### Typography
- **Headings**: Medium weight (500)
- **Body**: Regular weight (400)
- **Base Size**: 16px
- **Line Height**: 1.5

### Spacing
- Consistent 4px grid system
- Generous padding for touch targets
- Proper margins between sections

### Border Radius
- Small: 0.75rem (12px)
- Medium: 1rem (16px)
- Large: 1.5rem (24px)
- Extra Large: 2rem (32px)

## 🔐 Security Features

- Mock authentication (ready for backend integration)
- Password strength validation
- Two-factor authentication settings
- Device management
- Privacy controls
- Session management

## 📱 React Native Readiness

The app is built with React Native compatibility in mind:

- Uses Flexbox layouts
- No browser-specific APIs in core logic
- Context API for state management
- Compatible component patterns
- Touch-optimized interactions
- Smooth animations with Motion

## 🎭 Animation System

All animations use Motion (Framer Motion) for:
- Page transitions
- Card hover effects
- Button interactions
- Accordion expand/collapse
- Modal entrance/exit
- Loading states

### Animation Patterns
- **Fade In**: Initial opacity 0 → 1
- **Slide Up**: Initial y offset → 0
- **Scale**: Hover 1.02, Tap 0.98
- **Stagger**: Sequential delays for list items

## 📊 State Management

### Auth Context
- User profile
- Authentication status
- Login/Register/Logout methods
- Profile update functionality

### Language Context
- Current language
- Language switching
- Translation function (t)
- localStorage persistence

## 🧪 Best Practices

- TypeScript for type safety
- Component composition
- Reusable components
- Consistent naming conventions
- Clean code architecture
- Responsive design
- Performance optimization
- Accessibility standards

## 🎯 Future Enhancements

- Dark mode support
- Push notifications
- Real API integration
- File upload functionality
- Advanced search
- Data export
- Team collaboration
- Real-time updates

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ using Figma Make

---

**Note**: This is a production-ready template. Connect your backend API by replacing the mock authentication in `AuthContext.tsx` with real API calls.
