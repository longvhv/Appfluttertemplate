import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Save, Upload } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast as useToastUI } from '../components/ui';
import { Modal } from '../src/components/Modal';
import { useToast, ToastContainer } from '../src/components/Toast';
import { TextArea } from '../src/components/TextArea';
import { Select } from '../src/components/Select';
import { DatePicker } from '../src/components/DatePicker';
import { ProgressBar } from '../src/components/ProgressBar';
import { Spinner } from '../src/components/Spinner';

interface ProfileProps {
  onBack: () => void;
}

export function Profile({ onBack }: ProfileProps) {
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
  const toast = useToastUI();
  const { toasts, success, error, info } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [birthDate, setBirthDate] = useState<Date | undefined>(user?.birthDate);
  const [country, setCountry] = useState(user?.country || 'us');
  const [language, setLanguageValue] = useState(user?.language || 'en');
  
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'vn', label: 'Vietnam' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'vi', label: 'Tiếng Việt' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateUser({ 
      name, 
      email, 
      phone, 
      bio, 
      location, 
      birthDate,
      country,
      language: language 
    });
    
    setSaving(false);
    success(t('profile.saved'), 'Success');
    toast.success(t('profile.saved'));
  };

  const handleAvatarChange = () => {
    setShowAvatarModal(true);
  };

  const simulateUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setShowAvatarModal(false);
          success('Avatar uploaded successfully!', 'Success');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <>
      <PageHeader title={t('profile.title')} onBack={onBack} />

      <div className="max-w-lg mx-auto px-adaptive py-adaptive-lg">
        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-adaptive-lg"
        >
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl">
              {name.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-foreground mt-adaptive">{name}</h2>
          <p className="text-muted-foreground">{email}</p>
        </motion.div>

        {/* Personal Info Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card dark:bg-card rounded-2xl shadow-sm border border-border dark:border-border card-padding-lg"
        >
          <h3 className="text-foreground mb-adaptive">{t('profile.personalInfo')}</h3>

          <form onSubmit={handleSubmit} className="space-adaptive-y">
            <div>
              <label className="block text-sm text-muted-foreground mb-adaptive-sm">{t('profile.name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-adaptive py-adaptive-sm bg-background dark:bg-background border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-adaptive-sm">{t('profile.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-adaptive py-adaptive-sm bg-background dark:bg-background border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-adaptive-sm">{t('profile.phone')}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-adaptive py-adaptive-sm bg-background dark:bg-background border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-adaptive-sm">{t('profile.bio')}</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-adaptive py-adaptive-sm bg-background dark:bg-background border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all resize-none text-foreground"
                placeholder={t('profile.bioPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-adaptive-sm">{t('profile.location')}</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-adaptive py-adaptive-sm bg-background dark:bg-background border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground"
                placeholder={t('profile.locationPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-adaptive-sm">{t('profile.birthDate')}</label>
              <DatePicker
                value={birthDate}
                onChange={(date) => setBirthDate(date)}
                className="w-full px-adaptive py-adaptive-sm bg-background dark:bg-background border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-adaptive-sm">{t('profile.country')}</label>
              <Select
                value={country}
                onChange={(value) => setCountry(value)}
                options={countries}
                className="w-full px-adaptive py-adaptive-sm bg-background dark:bg-background border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-adaptive-sm">{t('profile.language')}</label>
              <Select
                value={language}
                onChange={(value) => setLanguageValue(value)}
                options={languages}
                className="w-full px-adaptive py-adaptive-sm bg-background dark:bg-background border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-adaptive-sm rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              {saving ? <Spinner className="w-5 h-5" /> : t('profile.save')}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Avatar Upload Modal */}
      <Modal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        title="Upload Avatar"
      >
        <div className="space-adaptive-y">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl">
              {name.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center">
            <button
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-adaptive-sm rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              onClick={simulateUpload}
            >
              {uploading ? <Spinner className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
            </button>
          </div>
          {uploading && (
            <ProgressBar
              value={uploadProgress}
              className="w-full h-2 bg-gray-200 rounded-full"
              barClassName="bg-indigo-600 h-2 rounded-full"
            />
          )}
        </div>
      </Modal>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </>
  );
}