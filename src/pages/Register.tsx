import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User, Check, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast, ToastContainer } from '../src/components/Toast';
import { Checkbox } from '../src/components/Checkbox';
import { ProgressBar } from '../src/components/ProgressBar';
import { Spinner } from '../src/components/Spinner';

interface RegisterProps {
  onNavigate: (page: string) => void;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function Register({ onNavigate }: RegisterProps) {
  const { t } = useLanguage();
  const { register } = useAuth();
  const { toasts, success, error, info } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    // Validate password strength
    const checks = {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?\":{}|<>]/.test(password),
    };
    setPasswordChecks(checks);

    const strength = Object.values(checks).filter(Boolean).length;
    setPasswordStrength(strength);
  }, [password]);

  useEffect(() => {
    // Validate form fields
    const newErrors: ValidationErrors = {};

    if (name && name.length < 2) {
      newErrors.name = t('validation.nameTooShort');
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('validation.emailInvalid');
    }

    if (password && password.length < 8) {
      newErrors.password = t('validation.passwordTooShort');
    }

    if (confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = t('validation.passwordsNotMatch');
    }

    setErrors(newErrors);
  }, [name, email, password, confirmPassword, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!name || !email || !password || !confirmPassword) {
      error('Please fill in all fields', 'Validation Error');
      return;
    }

    if (Object.keys(errors).length > 0) {
      error('Please fix the errors in the form', 'Validation Error');
      return;
    }

    if (!agreeToTerms) {
      error('You must agree to the Terms and Conditions', 'Agreement Required');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      success('Account created successfully! Please verify your email.', 'Success');
      setTimeout(() => onNavigate('login'), 2000);
    } catch (err) {
      error('Registration failed. Please try again.', 'Error');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`Register with ${provider}`);
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-orange-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength === 4) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return t('register.weak');
    if (passwordStrength <= 2) return t('register.fair');
    if (passwordStrength <= 3) return t('register.good');
    if (passwordStrength === 4) return t('register.strong');
    return t('register.veryStrong');
  };

  const isFormValid = name && email && password && confirmPassword && Object.keys(errors).length === 0;

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
            <span className="text-4xl">🎉</span>
          </motion.div>
          <h1 className="text-foreground text-3xl mb-adaptive-sm">{t('register.title')}</h1>
          <p className="text-muted-foreground">{t('register.subtitle')}</p>
        </div>

        {/* Form */}
        <div className="bg-card dark:bg-card rounded-3xl shadow-xl card-padding-xl border border-border/50 dark:border-border">
          <form onSubmit={handleSubmit} className="space-adaptive-y">
            {/* Name */}
            <div>
              <label className="block text-sm text-muted-foreground mb-adaptive-sm">{t('register.name')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-12 pr-4 py-adaptive-sm bg-background dark:bg-background border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground ${
                    errors.name ? 'border-red-500 dark:border-red-500' : 'border-border dark:border-border'
                  }`}
                  placeholder="John Doe"
                  required
                />
              </div>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 dark:text-red-400 text-sm mt-1"
                >
                  {errors.name}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-muted-foreground mb-adaptive-sm">{t('register.email')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-adaptive-sm bg-background dark:bg-background border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground ${
                    errors.email ? 'border-red-500 dark:border-red-500' : 'border-border dark:border-border'
                  }`}
                  placeholder="you@example.com"
                  required
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 dark:text-red-400 text-sm mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-muted-foreground mb-adaptive-sm">{t('register.password')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-adaptive-sm bg-background dark:bg-background border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground ${
                    errors.password ? 'border-red-500 dark:border-red-500' : 'border-border dark:border-border'
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              <AnimatePresence>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-adaptive-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{t('register.passwordStrength')}</span>
                      <span className="text-xs font-medium">{getStrengthText()}</span>
                    </div>
                    <div className="h-2 bg-muted dark:bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                        className={`h-full ${getStrengthColor()} transition-all`}
                      />
                    </div>

                    {/* Password Requirements */}
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-muted-foreground mb-1">{t('register.requirements')}</p>
                      {[
                        { key: 'minLength', label: t('register.minLength') },
                        { key: 'uppercase', label: t('register.uppercase') },
                        { key: 'lowercase', label: t('register.lowercase') },
                        { key: 'number', label: t('register.number') },
                        { key: 'special', label: t('register.special') },
                      ].map((req) => (
                        <div key={req.key} className="flex items-center gap-adaptive-sm">
                          {passwordChecks[req.key as keyof typeof passwordChecks] ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-muted-foreground/50" />
                          )}
                          <span
                            className={`text-xs ${
                              passwordChecks[req.key as keyof typeof passwordChecks]
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-muted-foreground/70'
                            }`}
                          >
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-muted-foreground mb-adaptive-sm">{t('register.confirmPassword')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-adaptive-sm bg-background dark:bg-background border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground ${
                    errors.confirmPassword ? 'border-red-500 dark:border-red-500' : confirmPassword && !errors.confirmPassword ? 'border-green-500 dark:border-green-500' : 'border-border dark:border-border'
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {confirmPassword && !errors.confirmPassword && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-12 top-1/2 -translate-y-1/2"
                  >
                    <Check className="w-5 h-5 text-green-500" />
                  </motion.div>
                )}
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 dark:text-red-400 text-sm mt-1"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
              {confirmPassword && !errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-500 dark:text-green-400 text-sm mt-1"
                >
                  {t('validation.passwordMatch')}
                </motion.p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center gap-adaptive-sm">
              <Checkbox
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="text-sm text-muted-foreground/70"
              />
              <span className="text-sm text-muted-foreground/70">
                {t('register.agreeToTerms')}
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  {t('register.termsAndConditions')}
                </button>
              </span>
            </div>

            <motion.button
              whileHover={{ scale: isFormValid ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid ? 0.98 : 1 }}
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-adaptive-sm rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <Spinner className="w-5 h-5" />
              ) : (
                t('register.signUp')
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-adaptive-lg">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border dark:border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-adaptive bg-card dark:bg-card text-muted-foreground">{t('register.orContinueWith')}</span>
            </div>
          </div>

          {/* Social Register */}
          <div className="space-adaptive-y-sm">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSocialRegister('google')}
              className="w-full bg-card dark:bg-card border-2 border-border dark:border-border py-adaptive-sm rounded-xl hover:bg-muted/50 dark:hover:bg-muted/50 transition-all flex items-center justify-center gap-adaptive"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-muted-foreground">Google</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSocialRegister('facebook')}
              className="w-full bg-[#1877F2] text-white py-adaptive-sm rounded-xl hover:bg-[#1664D8] transition-all flex items-center justify-center gap-adaptive"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSocialRegister('zalo')}
              className="w-full bg-[#0068FF] text-white py-adaptive-sm rounded-xl hover:bg-[#0052CC] transition-all flex items-center justify-center gap-adaptive"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              <span>Zalo</span>
            </motion.button>
          </div>

          {/* Sign In Link */}
          <div className="mt-adaptive-lg text-center">
            <p className="text-muted-foreground">
              {t('register.haveAccount')}{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                {t('register.signIn')}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}