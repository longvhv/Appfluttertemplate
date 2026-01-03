/**
 * EXAMPLE: Login Page Refactored with New Design System
 * 
 * This shows how to use the new components to create cleaner, more maintainable code
 * that's ready for React Native migration.
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

// ✨ Import from centralized UI index
import { 
  Button, 
  Input, 
  FormField, 
  Text, 
  Card,
  Badge 
} from '../components/ui';

export function RefactoredLogin() {
  const { login } = useAuth();
  const { t } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-adaptive">
      <Card variant="elevated" padding="xl" className="w-full max-w-md">
        {/* Header */}
        <Card.Header>
          <div className="text-center mb-adaptive-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-adaptive">
              <Text variant="h2" className="text-white">🚀</Text>
            </div>
            <Text variant="h2" weight="bold" className="mb-2">
              {t('login.welcome')}
            </Text>
            <Text variant="body" color="muted">
              {t('login.subtitle')}
            </Text>
          </div>
        </Card.Header>

        {/* Form */}
        <Card.Body>
          <div className="space-adaptive-y">
            {/* Error Message */}
            {error && (
              <Card variant="filled" padding="sm" className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <Text variant="caption" color="error">
                  {error}
                </Text>
              </Card>
            )}

            {/* Email Input */}
            <FormField
              label={t('login.email')}
              type="email"
              value={email}
              onChange={setEmail}
              leftIcon={Mail}
              placeholder="you@example.com"
              validationRules={{
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              }}
            />

            {/* Password Input */}
            <Input
              label={t('login.password')}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              leftIcon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              placeholder="••••••••"
            />

            {/* Forgot Password Link */}
            <div className="text-right">
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                {t('login.forgotPassword')}
              </button>
            </div>

            {/* Login Button */}
            <Button
              variant="gradient"
              size="lg"
              fullWidth
              loading={loading}
              onClick={handleLogin}
            >
              {t('login.signIn')}
            </Button>

            {/* Divider */}
            <div className="relative my-adaptive-lg">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border dark:border-border" />
              </div>
              <div className="relative flex justify-center">
                <Badge variant="default" size="sm">
                  {t('login.orContinueWith')}
                </Badge>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-3 gap-adaptive-sm">
              <Button variant="outline" size="md">
                <img src="/google.svg" alt="Google" className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="md">
                <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="md">
                <img src="/zalo.svg" alt="Zalo" className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card.Body>

        {/* Footer */}
        <Card.Footer>
          <div className="text-center">
            <Text variant="caption" color="muted">
              {t('login.noAccount')}{' '}
              <button className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                {t('login.signUp')}
              </button>
            </Text>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}

/**
 * BENEFITS OF THIS APPROACH:
 * 
 * 1. ✅ Cleaner Code
 *    - No inline className mess
 *    - Self-documenting component names
 *    - Clear component hierarchy
 * 
 * 2. ✅ Type Safety
 *    - All props are typed
 *    - IntelliSense autocomplete
 *    - Compile-time errors
 * 
 * 3. ✅ Consistency
 *    - Same styling across app
 *    - Reusable components
 *    - Easy to maintain
 * 
 * 4. ✅ React Native Ready
 *    - Replace Button → keep same props
 *    - Replace Input → keep same props
 *    - Replace Card → keep same structure
 *    - Business logic stays identical
 * 
 * 5. ✅ Built-in Features
 *    - Loading states
 *    - Validation
 *    - Dark mode
 *    - Responsive sizing
 */
