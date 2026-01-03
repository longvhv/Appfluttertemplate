import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast as useToastUI } from '../components/ui';
import { useToast, ToastContainer } from '../src/components/Toast';
import { Spinner } from '../src/components/Spinner';
import { ProgressBar } from '../src/components/ProgressBar';
import { Tooltip } from '../src/components/Tooltip';

interface ChangePasswordProps {
  onBack: () => void;
}

export function ChangePassword({ onBack }: ChangePasswordProps) {
  const { t } = useLanguage();
  const toast = useToastUI();
  const { toasts, success, error, warning } = useToast();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordChecks = {
    minLength: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*(),.?\":{}|<>]/.test(newPassword),
  };

  const isValid = Object.values(passwordChecks).every(Boolean) && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      error('Please fix all errors before submitting', 'Validation Error');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    success('Password updated successfully!', 'Success');
    toast.success('Password updated successfully!');
    
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const getStrengthText = () => {
    if (passwordStrength < 2) return t('changePassword.weak');
    if (passwordStrength < 4) return t('changePassword.moderate');
    return t('changePassword.strong');
  };

  const getStrengthColor = () => {
    if (passwordStrength < 2) return 'bg-red-500';
    if (passwordStrength < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const passwordStrength = Object.values(passwordChecks).reduce((acc, val) => acc + (val ? 1 : 0), 0);

  const isFormValid = isValid && !loading;

  return (
    <>
      <PageHeader title={t('changePassword.title')} onBack={onBack} />

      <div className="max-w-lg mx-auto px-adaptive py-adaptive-lg">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-card dark:bg-card rounded-2xl shadow-sm border border-border dark:border-border card-padding-lg"
        >
          <div className="space-adaptive-y">
            {/* Current Password */}
            <div>
              <label className="block text-sm text-muted-foreground mb-adaptive-sm">{t('changePassword.current')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-adaptive-sm bg-background dark:bg-background border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground"
                >
                  {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm text-muted-foreground mb-adaptive-sm">{t('changePassword.new')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-adaptive-sm bg-background dark:bg-background border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground"
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength */}
              <AnimatePresence>
                {newPassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-adaptive-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{t('changePassword.strength')}</span>
                      <span className="text-xs font-medium">{getStrengthText()}</span>
                    </div>
                    <div className="h-2 bg-muted dark:bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                        className={`h-full ${getStrengthColor()} transition-all`}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-muted-foreground mb-adaptive-sm">{t('changePassword.confirm')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-adaptive-sm bg-background dark:bg-background border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Requirements */}
            {newPassword && (
              <div className="bg-muted/50 dark:bg-muted/50 rounded-xl card-padding">
                <p className="text-sm text-muted-foreground mb-adaptive-sm">{t('changePassword.requirements')}</p>
                <div className="space-y-2">
                  {[
                    { key: 'minLength', label: t('changePassword.minLength') },
                    { key: 'uppercase', label: t('changePassword.uppercase') },
                    { key: 'lowercase', label: t('changePassword.lowercase') },
                    { key: 'number', label: t('changePassword.number') },
                    { key: 'special', label: t('changePassword.special') },
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
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!isFormValid}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-adaptive-sm rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('changePassword.update')}
            </motion.button>
          </div>
        </motion.form>
      </div>
      <ToastContainer />
    </>
  );
}