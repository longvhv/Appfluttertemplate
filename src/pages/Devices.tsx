import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Smartphone, Monitor, Tablet, MoreVertical } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast as useToastUI } from '../components/ui';
import { useToast, ToastContainer } from '../src/components/Toast';
import { Modal } from '../src/components/Modal';
import { Spinner } from '../src/components/Spinner';
import { EmptyState } from '../src/components/EmptyState';
import { DropdownMenu } from '../src/components/DropdownMenu';
import { Badge } from '../src/components/Badge';
import { IconButton } from '../src/components/IconButton';

interface DevicesProps {
  onBack: () => void;
}

interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export function Devices({ onBack }: DevicesProps) {
  const { t } = useLanguage();
  const toast = useToastUI();
  const { toasts, success, error, warning } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'iPhone 14 Pro',
      type: 'mobile',
      location: 'San Francisco, USA',
      lastActive: 'Active now',
      isCurrent: true,
    },
    {
      id: '2',
      name: 'MacBook Pro',
      type: 'desktop',
      location: 'San Francisco, USA',
      lastActive: '2 hours ago',
      isCurrent: false,
    },
    {
      id: '3',
      name: 'iPad Air',
      type: 'tablet',
      location: 'New York, USA',
      lastActive: '1 day ago',
      isCurrent: false,
    },
  ]);

  const handleSignOut = async (id: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setDevices(devices.filter(d => d.id !== id));
    setLoading(false);
    setShowSignOutModal(false);
    setSelectedDevice(null);
    success('Device signed out successfully', 'Success');
    toast.success('Device signed out successfully');
  };

  const handleSignOutAll = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setDevices(devices.filter(d => d.isCurrent));
    setLoading(false);
    success('All other devices signed out', 'Success');
    toast.success('All other devices signed out');
  };

  const confirmSignOut = (id: string) => {
    setSelectedDevice(id);
    setShowSignOutModal(true);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Monitor;
    }
  };

  return (
    <div className="pb-20">
      <PageHeader 
        title={t('devices.title')} 
        subtitle={t('devices.subtitle')} 
        onBack={onBack} 
      />

      <div className="max-w-lg mx-auto px-adaptive py-adaptive">
        {/* Sign Out All Button */}
        {devices.filter(d => !d.isCurrent).length > 0 && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSignOutAll}
            className="w-full mb-adaptive bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 py-adaptive-sm rounded-xl hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
          >
            {t('devices.signOutAll')}
          </motion.button>
        )}

        {/* Devices List */}
        <div className="space-adaptive-y-sm">
          {devices.map((device, index) => {
            const Icon = getDeviceIcon(device.type);
            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-card dark:bg-card rounded-2xl card-padding shadow-sm border ${
                  device.isCurrent ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-border dark:border-border'
                }`}
              >
                <div className="flex items-start gap-adaptive">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    device.isCurrent
                      ? 'bg-indigo-100 dark:bg-indigo-950/50'
                      : 'bg-muted dark:bg-muted'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      device.isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground'
                    }`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-adaptive-sm mb-1">
                      <p className="text-foreground">{device.name}</p>
                      {device.isCurrent && (
                        <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs rounded-full">
                          {t('devices.current')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{device.location}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {t('devices.lastActive')}: {device.lastActive}
                    </p>
                  </div>

                  {!device.isCurrent && (
                    <button
                      onClick={() => confirmSignOut(device.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm"
                    >
                      {t('devices.signOut')}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-adaptive-lg bg-blue-50 dark:bg-blue-950/30 rounded-xl card-padding border border-blue-200 dark:border-blue-800"
        >
          <p className="text-sm text-blue-900 dark:text-blue-100">
            💡 Signing out will remove this device's access. You'll need to sign in again to continue using the app on that device.
          </p>
        </motion.div>
      </div>

      {/* Sign Out Modal */}
      <Modal
        open={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        title={t('devices.signOut')}
        description={t('devices.signOutDescription')}
        actions={[
          {
            label: t('devices.cancel'),
            onClick: () => setShowSignOutModal(false),
            className: 'bg-gray-50 dark:bg-gray-950/30 text-gray-600 dark:text-gray-400 py-adaptive-sm rounded-xl hover:bg-gray-100 dark:hover:bg-gray-950/50 transition-colors'
          },
          {
            label: t('devices.signOut'),
            onClick: () => handleSignOut(selectedDevice!),
            className: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 py-adaptive-sm rounded-xl hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors'
          }
        ]}
      >
        {loading && <Spinner className="mx-auto" />}
      </Modal>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}