import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Button, 
  Input, 
  FormField,
  Card,
  Divider,
  IconButton,
  useForm 
} from '../components/ui';
import { useToast, ToastContainer } from '../src/components/Toast';
import { Checkbox } from '../src/components/Checkbox';
import { Spinner } from '../src/components/Spinner';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export function Login({ onNavigate }: LoginProps) {
  const { t } = useLanguage();
  const { login } = useAuth();
  const { toasts, success, error, info } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { values, errors, touched, isSubmitting, getFieldProps, handleSubmit } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      password: {
        required: true,
        minLength: 6,
      },
    },
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        success('Login successful! Welcome back.', 'Success');
      } catch (err) {
        error('Invalid email or password. Please try again.', 'Login Failed');
        console.error('Login error:', err);
      }
    },
  });

  const handleSocialLogin = (provider: string) => {
    info(`Connecting to ${provider}...`, 'Social Login');
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 flex items-center justify-center p-adaptive">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-adaptive-lg">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-adaptive shadow-lg"
          >
            <span className="text-4xl">🚀</span>
          </motion.div>
          <h1 className="text-foreground text-3xl mb-adaptive-sm">{t('login.title')}</h1>
          <p className="text-muted-foreground">{t('login.subtitle')}</p>
        </div>

        {/* Form Card */}
        <Card variant="elevated" padding="xl">
          <form onSubmit={handleSubmit} className="space-adaptive-y">
            {/* Email Field */}
            <FormField
              {...getFieldProps('email')}
              type="email"
              label={t('login.email')}
              placeholder="you@example.com"
              leftIcon={Mail}
            />

            {/* Password Field */}
            <Input
              {...getFieldProps('password')}
              type={showPassword ? 'text' : 'password'}
              label={t('login.password')}
              placeholder="••••••••"
              leftIcon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
            />

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <Checkbox
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                label={t('login.rememberMe')}
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                {t('login.forgotPassword')}
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              loading={isSubmitting}
            >
              {t('login.signIn')}
            </Button>

            {/* Divider */}
            <Divider label={t('login.orContinueWith')} />

            {/* Social Login */}
            <div className="grid grid-cols-3 gap-adaptive-sm">
              <IconButton
                icon={Mail}
                variant="secondary"
                size="lg"
                onClick={() => handleSocialLogin('google')}
              />
              <IconButton
                icon={Mail}
                variant="secondary"
                size="lg"
                onClick={() => handleSocialLogin('facebook')}
              />
              <IconButton
                icon={Mail}
                variant="secondary"
                size="lg"
                onClick={() => handleSocialLogin('zalo')}
              />
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-adaptive">
              <p className="text-sm text-muted-foreground">
                {t('login.noAccount')}{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                >
                  {t('login.signUp')}
                </button>
              </p>
            </div>
          </form>
        </Card>
      </motion.div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}