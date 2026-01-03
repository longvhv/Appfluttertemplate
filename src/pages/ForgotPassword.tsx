import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast, ToastContainer } from '../src/components/Toast';
import { Spinner } from '../src/components/Spinner';

interface ForgotPasswordProps {
  onNavigate: (page: string) => void;
}

export function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
  const { t } = useLanguage();
  const { toasts, success, error, info } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error('Please enter a valid email address', 'Invalid Email');
      return;
    }

    setLoading(true);
    info('Sending password reset email...', 'Processing');

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setLoading(false);
    setSubmitted(true);
    success('Password reset email sent successfully!', 'Email Sent');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 flex items-center justify-center p-adaptive">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-card dark:bg-card rounded-3xl shadow-xl card-padding-xl border border-border/50 dark:border-border text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 bg-green-50 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto mb-adaptive"
            >
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </motion.div>

            <h2 className="text-foreground text-2xl mb-adaptive-sm">{t('forgot.success')}</h2>
            <p className="text-muted-foreground mb-adaptive-lg">{t('forgot.successDesc')}</p>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('login')}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-adaptive-sm rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              {t('forgot.backToLogin')}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

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
            <Lock className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-foreground text-3xl mb-adaptive-sm">{t('forgot.title')}</h1>
          <p className="text-muted-foreground">{t('forgot.subtitle')}</p>
        </div>

        {/* Form */}
        <div className="bg-card dark:bg-card rounded-3xl shadow-xl card-padding-xl border border-border/50 dark:border-border">
          <form onSubmit={handleSubmit} className="space-adaptive-y">
            <div>
              <label className="block text-sm text-muted-foreground mb-adaptive-sm">{t('forgot.email')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-adaptive-sm bg-background dark:bg-background border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-adaptive-sm rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? <Spinner size="sm" /> : t('forgot.sendLink')}
            </motion.button>
          </form>

          {/* Back to Login */}
          <div className="mt-adaptive-lg text-center">
            <button
              onClick={() => onNavigate('login')}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center justify-center gap-adaptive-sm mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('forgot.backToLogin')}
            </button>
          </div>
        </div>
      </motion.div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}