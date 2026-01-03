import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast, ToastContainer } from '../src/components/Toast';

interface LanguagePageProps {
  onBack: () => void;
}

export function LanguagePage({ onBack }: LanguagePageProps) {
  const { t, language, setLanguage } = useLanguage();
  const { toasts, success, info } = useToast();

  const languages = [
    { code: 'en' as const, name: t('language.english'), flag: '🇺🇸', nativeName: 'English' },
    { code: 'vi' as const, name: t('language.vietnamese'), flag: '🇻🇳', nativeName: 'Tiếng Việt' },
  ];

  const handleLanguageChange = (lang: 'en' | 'vi') => {
    setLanguage(lang);
    const langName = lang === 'en' ? 'English' : 'Tiếng Việt';
    success(`Language changed to ${langName}`, 'Language Updated');
  };

  return (
    <>
      <PageHeader title={t('language.title')} onBack={onBack} />

      <div className="max-w-lg mx-auto px-adaptive py-adaptive-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card dark:bg-card rounded-2xl shadow-sm border border-border dark:border-border"
        >
          {languages.map((lang, index) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleLanguageChange(lang.code as 'en' | 'vi')}
              className={`w-full flex items-center justify-between card-padding hover:bg-muted/50 dark:hover:bg-muted/50 transition-all ${
                index !== languages.length - 1 ? 'border-b border-border/50 dark:border-border/50' : ''
              } ${language === lang.code ? 'bg-indigo-50/50 dark:bg-indigo-950/30' : ''}`}
            >
              <div className="flex items-center gap-adaptive">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  language === lang.code
                    ? 'bg-indigo-100 dark:bg-indigo-950/50'
                    : 'bg-muted dark:bg-muted'
                }`}>
                  {lang.flag}
                </div>
                <div className="text-left">
                  <p className="text-foreground">{lang.name}</p>
                  <p className="text-sm text-muted-foreground">{lang.nativeName}</p>
                </div>
              </div>
              {language === lang.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-adaptive-lg bg-blue-50 dark:bg-blue-950/30 rounded-xl card-padding border border-blue-200 dark:border-blue-800"
        >
          <p className="text-sm text-blue-900 dark:text-blue-100">
            🌍 {t('language.info')}
          </p>
        </motion.div>
      </div>
      
      <ToastContainer toasts={toasts} />
    </>
  );
}