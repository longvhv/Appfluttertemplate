import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast, ToastContainer } from '../src/components/Toast';
import { Badge } from '../src/components/Badge';
import { Timeline } from '../src/components/Timeline';

interface WhatsNewProps {
  onBack: () => void;
}

export function WhatsNew({ onBack }: WhatsNewProps) {
  const { t } = useLanguage();
  const { toasts, success, info } = useToast();

  const handleFeatureClick = (feature: string) => {
    info(`Learn more about: ${feature}`, 'Feature Info');
  };

  const updates = [
    {
      version: '2.5.0',
      date: 'January 2, 2026',
      features: [
        {
          title: 'Enhanced Security Features',
          description: 'Two-factor authentication with multiple authentication methods including authenticator apps and SMS.',
          icon: '🔒',
        },
        {
          title: 'Dark Mode Support',
          description: 'Switch between light and dark themes based on your preference or system settings.',
          icon: '🌙',
        },
        {
          title: 'Improved Performance',
          description: '30% faster loading times and smoother animations throughout the app.',
          icon: '⚡',
        },
      ],
    },
    {
      version: '2.4.0',
      date: 'December 15, 2025',
      features: [
        {
          title: 'Team Collaboration',
          description: 'Invite team members, assign roles, and collaborate in real-time with shared workspaces.',
          icon: '👥',
        },
        {
          title: 'Advanced Analytics',
          description: 'Get detailed insights with new charts, graphs, and exportable reports.',
          icon: '📊',
        },
        {
          title: 'Mobile App Updates',
          description: 'Redesigned mobile interface with gesture controls and offline mode.',
          icon: '📱',
        },
      ],
    },
    {
      version: '2.3.0',
      date: 'November 28, 2025',
      features: [
        {
          title: 'File Management',
          description: 'Upload, organize, and share files with advanced search and filtering options.',
          icon: '📁',
        },
        {
          title: 'Custom Notifications',
          description: 'Configure notification preferences for different types of events and activities.',
          icon: '🔔',
        },
        {
          title: 'API Integration',
          description: 'Connect with third-party services using our new API and webhook system.',
          icon: '🔗',
        },
      ],
    },
  ];

  return (
    <div className="pb-20">
      <PageHeader title={t('whatsNew.title')} subtitle={t('whatsNew.subtitle')} onBack={onBack} />

      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl mb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
          <div className="relative p-6 text-center">
            <Sparkles className="w-12 h-12 text-white mx-auto mb-3" />
            <h2 className="text-white text-xl mb-2">Discover New Features</h2>
            <p className="text-white/90 text-sm">Stay up to date with the latest improvements and additions</p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600" />

          {/* Updates */}
          <div className="space-y-8">
            {updates.map((update, updateIndex) => (
              <motion.div
                key={update.version}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: updateIndex * 0.1 }}
              >
                {/* Version Header */}
                <div className="flex items-center gap-adaptive mb-adaptive">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg z-10">
                      <span className="text-white text-xl">🎉</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-foreground">
                      {t('whatsNew.version')} {update.version}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('whatsNew.released')}: {update.date}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="ml-16 space-adaptive-y-sm">
                  {update.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: updateIndex * 0.1 + featureIndex * 0.05 }}
                      className="bg-card dark:bg-card rounded-xl card-padding shadow-sm border border-border dark:border-border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-adaptive">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{feature.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-adaptive-sm mb-1">
                            <p className="text-foreground">{feature.title}</p>
                            <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                          </div>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feedback Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-adaptive-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl card-padding-lg text-center border border-indigo-200 dark:border-indigo-800"
        >
          <p className="text-foreground mb-2">Have feedback or feature requests?</p>
          <p className="text-muted-foreground text-sm mb-adaptive">We'd love to hear from you!</p>
          <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg">
            Share Feedback
          </button>
        </motion.div>
      </div>
    </div>
  );
}