import React, { useState, lazy, Suspense } from 'react';
import { ToastProvider } from './components/ui';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppearanceProvider } from './contexts/AppearanceContext';
import { BottomNav } from './components/BottomNav';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { Spinner } from './src/components/Spinner';

// Lazy-loaded Pages with proper named export handling
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Notifications = lazy(() => import('./pages/Notifications').then(m => ({ default: m.Notifications })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const ChangePassword = lazy(() => import('./pages/ChangePassword').then(m => ({ default: m.ChangePassword })));
const Devices = lazy(() => import('./pages/Devices').then(m => ({ default: m.Devices })));
const Privacy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const LanguagePage = lazy(() => import('./pages/LanguagePage').then(m => ({ default: m.LanguagePage })));
const HelpCenter = lazy(() => import('./pages/HelpCenter').then(m => ({ default: m.HelpCenter })));
const FAQ = lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const WhatsNew = lazy(() => import('./pages/WhatsNew').then(m => ({ default: m.WhatsNew })));
const Appearance = lazy(() => import('./pages/Appearance').then(m => ({ default: m.Appearance })));

type Page = 
  | 'home' 
  | 'notifications' 
  | 'settings' 
  | 'login' 
  | 'register' 
  | 'forgot-password'
  | 'profile'
  | 'change-password'
  | 'devices'
  | 'privacy'
  | 'language'
  | 'appearance'
  | 'help-center'
  | 'faq'
  | 'whats-new';

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background">
      <Spinner size="lg" />
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('login');

  // Update currentPage when authentication status changes
  React.useEffect(() => {
    if (isAuthenticated && (currentPage === 'login' || currentPage === 'register' || currentPage === 'forgot-password')) {
      setCurrentPage('home');
    } else if (!isAuthenticated && currentPage !== 'register' && currentPage !== 'forgot-password') {
      setCurrentPage('login');
    }
  }, [isAuthenticated]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('settings');
  };

  // Authentication pages
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<PageLoader />}>
        {currentPage === 'register' && <Register onNavigate={handleNavigate} />}
        {currentPage === 'forgot-password' && <ForgotPassword onNavigate={handleNavigate} />}
        {(currentPage === 'login' || (!['register', 'forgot-password'].includes(currentPage))) && (
          <Login onNavigate={handleNavigate} />
        )}
      </Suspense>
    );
  }

  // Main app pages
  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Suspense fallback={<PageLoader />}>
        {currentPage === 'home' && <Home />}
        {currentPage === 'notifications' && <Notifications />}
        {currentPage === 'settings' && <Settings onNavigate={handleNavigate} />}
        {currentPage === 'profile' && <Profile onBack={handleBack} />}
        {currentPage === 'change-password' && <ChangePassword onBack={handleBack} />}
        {currentPage === 'devices' && <Devices onBack={handleBack} />}
        {currentPage === 'privacy' && <Privacy onBack={handleBack} />}
        {currentPage === 'language' && <LanguagePage onBack={handleBack} />}
        {currentPage === 'appearance' && <Appearance onBack={handleBack} />}
        {currentPage === 'help-center' && <HelpCenter onBack={handleBack} />}
        {currentPage === 'faq' && <FAQ onBack={handleBack} />}
        {currentPage === 'whats-new' && <WhatsNew onBack={handleBack} />}
      </Suspense>

      {/* Show bottom navigation only on main pages */}
      {['home', 'notifications', 'settings'].includes(currentPage) && (
        <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log errors to your error tracking service (e.g., Sentry)
        console.error('Application Error:', error, errorInfo);
        
        // You can integrate with error tracking services here:
        // if (import.meta.env.PROD) {
        //   Sentry.captureException(error, { contexts: { react: errorInfo } });
        // }
      }}
    >
      <LanguageProvider>
        <AuthProvider>
          <AppearanceProvider>
            <ToastProvider position="top-right" maxToasts={3}>
              <AppContent />
            </ToastProvider>
          </AppearanceProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}