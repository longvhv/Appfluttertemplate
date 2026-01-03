import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Lock, Smartphone, Shield, Globe, HelpCircle, 
  MessageSquare, Sparkles, LogOut, Palette
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, ListItem, Avatar, Text, Button, Divider } from '../components/ui';
import { Modal } from '../src/components/Modal';
import { useToast, ToastContainer } from '../src/components/Toast';
import { Spinner } from '../src/components/Spinner';

interface SettingsProps {
  onNavigate: (page: string) => void;
}

export function Settings({ onNavigate }: SettingsProps) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { toasts, success, error, info } = useToast();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const settingsSections = [
    {
      title: t('settings.account'),
      items: [
        { id: 'profile', icon: User, label: t('settings.profile'), desc: t('settings.profileDesc') },
        { id: 'change-password', icon: Lock, label: t('settings.changePassword'), desc: t('settings.changePasswordDesc') },
        { id: 'devices', icon: Smartphone, label: t('settings.devices'), desc: t('settings.devicesDesc') },
        { id: 'privacy', icon: Shield, label: t('settings.privacy'), desc: t('settings.privacyDesc') },
      ],
    },
    {
      title: t('settings.preferences'),
      items: [
        { id: 'language', icon: Globe, label: t('settings.language'), desc: t('settings.languageDesc') },
        { id: 'appearance', icon: Palette, label: t('settings.appearance'), desc: t('settings.appearanceDesc') },
      ],
    },
    {
      title: t('settings.support'),
      items: [
        { id: 'help-center', icon: HelpCircle, label: t('settings.helpCenter'), desc: t('settings.helpCenterDesc') },
        { id: 'faq', icon: MessageSquare, label: t('settings.faq'), desc: t('settings.faqDesc') },
        { id: 'whats-new', icon: Sparkles, label: t('settings.whatsNew'), desc: t('settings.whatsNewDesc') },
      ],
    },
  ];

  return (
    <div className="pb-20 bg-background">
      <PageHeader title={t('settings.title')} />

      <div className="max-w-lg mx-auto px-adaptive py-adaptive">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl mb-adaptive-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
          <div className="relative card-padding flex items-center gap-adaptive">
            <Avatar 
              src={user?.avatar} 
              name={user?.name}
              size="xl"
              className="border-2 border-white/30"
            />
            <div className="flex-1">
              <Text variant="h4" className="text-white">{user?.name}</Text>
              <Text variant="caption" className="text-white/90">{user?.email}</Text>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-adaptive-lg">
            <Text 
              variant="caption" 
              color="muted" 
              className="px-2 mb-adaptive-sm block uppercase tracking-wide"
            >
              {section.title}
            </Text>
            
            <Card variant="default" padding="none">
              {section.items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    title={item.label}
                    subtitle={item.desc}
                    leftIcon={item.icon}
                    showChevron
                    onPress={() => onNavigate(item.id)}
                  />
                  {index < section.items.length - 1 && (
                    <Divider className="mx-adaptive" />
                  )}
                </React.Fragment>
              ))}
            </Card>
          </div>
        ))}

        {/* Logout Button */}
        <Button
          variant="danger"
          size="lg"
          fullWidth
          icon={LogOut}
          onClick={() => setShowLogoutModal(true)}
        >
          {t('settings.logout')}
        </Button>

        {/* Version Info */}
        <div className="text-center mt-adaptive-lg">
          <Text variant="caption" color="muted">
            Version 1.0.0 • Made with ❤️
          </Text>
        </div>
      </div>

      {/* Logout Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title={t('settings.logout')}
        description={t('settings.logoutDesc')}
        actions={[
          {
            label: t('settings.cancel'),
            onClick: () => setShowLogoutModal(false),
          },
          {
            label: t('settings.logout'),
            onClick: async () => {
              setLoggingOut(true);
              try {
                await logout();
                success(t('settings.logoutSuccess'));
              } catch (err) {
                error(t('settings.logoutError'));
              } finally {
                setLoggingOut(false);
                setShowLogoutModal(false);
              }
            },
            variant: 'danger',
            icon: loggingOut ? <Spinner size="sm" /> : LogOut,
          },
        ]}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}