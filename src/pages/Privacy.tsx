import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Eye, Activity, CheckCheck, BarChart3, Mail, Download, Trash2, AlertTriangle, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast as useToastUI } from '../components/ui';
import { Modal } from '../src/components/Modal';
import { useToast, ToastContainer } from '../src/components/Toast';
import { Checkbox } from '../src/components/Checkbox';
import { Tooltip } from '../src/components/Tooltip';
import { IconButton } from '../src/components/IconButton';
import { Spinner } from '../src/components/Spinner';

interface PrivacyProps {
  onBack: () => void;
}

interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: any;
}

export function Privacy({ onBack }: PrivacyProps) {
  const { t } = useLanguage();
  const toast = useToastUI();
  const { toasts, success, error, warning } = useToast();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([
    {
      id: 'twoFactor',
      title: t('privacy.twoFactor'),
      description: t('privacy.twoFactorDesc'),
      enabled: false,
      icon: Shield,
    },
    {
      id: 'profileVisibility',
      title: t('privacy.profileVisibility'),
      description: t('privacy.profileVisibilityDesc'),
      enabled: true,
      icon: Eye,
    },
    {
      id: 'activityStatus',
      title: t('privacy.activityStatus'),
      description: t('privacy.activityStatusDesc'),
      enabled: true,
      icon: Activity,
    },
    {
      id: 'readReceipts',
      title: t('privacy.readReceipts'),
      description: t('privacy.readReceiptsDesc'),
      enabled: true,
      icon: CheckCheck,
    },
    {
      id: 'dataAnalytics',
      title: t('privacy.dataAnalytics'),
      description: t('privacy.dataAnalyticsDesc'),
      enabled: false,
      icon: BarChart3,
    },
    {
      id: 'marketing',
      title: t('privacy.marketing'),
      description: t('privacy.marketingDesc'),
      enabled: false,
      icon: Mail,
    },
  ]);

  const handleToggle = (id: string) => {
    setPrivacySettings(prev =>
      prev.map(item =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
    success(t('privacy.settingUpdated'), 'Updated');
    toast.success(t('privacy.settingUpdated'));
  };

  const handleDownloadData = async () => {
    setDownloading(true);
    
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDownloading(false);
    setShowDownloadModal(false);
    success(t('privacy.downloadStarted'), 'Success');
    toast.success(t('privacy.downloadStarted'));
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    
    // Simulate deletion
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDeleting(false);
    setShowDeleteModal(false);
    error(t('privacy.accountDeleted'), 'Account Deleted');
    toast.success(t('privacy.accountDeleted'));
  };

  return (
    <>
      <PageHeader title={t('privacy.title')} onBack={onBack} />

      <div className="max-w-lg mx-auto px-adaptive py-adaptive-lg">
        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card dark:bg-card rounded-2xl shadow-sm border border-border dark:border-border"
        >
          {privacySettings.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between card-padding hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors ${
                index !== privacySettings.length - 1 ? 'border-b border-border/50 dark:border-border/50' : ''
              }`}
            >
              <div className="flex items-center gap-adaptive">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(item.id)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  item.enabled ? 'bg-indigo-600' : 'bg-muted dark:bg-muted'
                }`}
              >
                <motion.div
                  animate={{ x: item.enabled ? 24 : 0 }}
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          ))}
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-adaptive-lg"
        >
          <h3 className="text-foreground mb-adaptive-sm card-padding-x">{t('privacy.dataManagement')}</h3>
          <div className="bg-card dark:bg-card rounded-2xl shadow-sm border border-border dark:border-border overflow-hidden">
            <button
              onClick={handleDownloadData}
              className="w-full flex items-center justify-between card-padding hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors border-b border-border/50 dark:border-border/50"
            >
              <div className="flex items-center gap-adaptive">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center">
                  <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-foreground">{t('privacy.downloadData')}</p>
                  <p className="text-sm text-muted-foreground">{t('privacy.downloadDataDesc')}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/70" />
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-between card-padding hover:bg-red-50/50 dark:hover:bg-red-950/30 transition-colors"
            >
              <div className="flex items-center gap-adaptive">
                <div className="w-10 h-10 bg-red-50 dark:bg-red-950/30 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-left">
                  <p className="text-red-600 dark:text-red-400">{t('privacy.deleteAccount')}</p>
                  <p className="text-sm text-muted-foreground">{t('privacy.deleteAccountDesc')}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-adaptive-lg bg-blue-50 dark:bg-blue-950/30 rounded-xl card-padding border border-blue-200 dark:border-blue-800"
        >
          <p className="text-sm text-blue-900 dark:text-blue-100">
            🔒 {t('privacy.info')}
          </p>
        </motion.div>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-adaptive"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card dark:bg-card rounded-2xl card-padding-xl max-w-md w-full border border-border dark:border-border"
            >
              <div className="text-center mb-adaptive-lg">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-adaptive">
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-foreground text-xl mb-adaptive-sm">{t('privacy.deleteConfirm')}</h3>
                <p className="text-muted-foreground">{t('privacy.deleteWarning')}</p>
              </div>

              <div className="space-adaptive-y-sm">
                <button
                  onClick={handleDeleteAccount}
                  className="w-full bg-red-600 dark:bg-red-600 text-white py-adaptive-sm rounded-xl hover:bg-red-700 dark:hover:bg-red-700 transition-colors"
                >
                  {deleting ? <Spinner className="w-5 h-5" /> : t('privacy.deleteYes')}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full bg-muted dark:bg-muted text-foreground py-adaptive-sm rounded-xl hover:bg-muted/80 dark:hover:bg-muted/80 transition-colors"
                >
                  {t('privacy.deleteNo')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Data Modal */}
      <AnimatePresence>
        {showDownloadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-adaptive"
            onClick={() => setShowDownloadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card dark:bg-card rounded-2xl card-padding-xl max-w-md w-full border border-border dark:border-border"
            >
              <div className="text-center mb-adaptive-lg">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto mb-adaptive">
                  <Download className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-foreground text-xl mb-adaptive-sm">{t('privacy.downloadConfirm')}</h3>
                <p className="text-muted-foreground">{t('privacy.downloadWarning')}</p>
              </div>

              <div className="space-adaptive-y-sm">
                <button
                  onClick={handleDownloadData}
                  className="w-full bg-blue-600 dark:bg-blue-600 text-white py-adaptive-sm rounded-xl hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
                >
                  {downloading ? <Spinner className="w-5 h-5" /> : t('privacy.downloadYes')}
                </button>
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="w-full bg-muted dark:bg-muted text-foreground py-adaptive-sm rounded-xl hover:bg-muted/80 dark:hover:bg-muted/80 transition-colors"
                >
                  {t('privacy.downloadNo')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </>
  );
}