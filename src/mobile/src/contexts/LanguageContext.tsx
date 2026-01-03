import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Language Context - React Native Version
 * 
 * Migrated from web version with AsyncStorage instead of localStorage
 */

export type Language = 'en' | 'vi';

interface Translations {
  [key: string]: {
    en: string;
    vi: string;
  };
}

export const translations: Translations = {
  // App Name
  'app.name': {
    en: 'Enterprise App',
    vi: 'Ứng Dụng Doanh Nghiệp',
  },
  
  // Navigation
  'nav.home': {
    en: 'Home',
    vi: 'Trang Chủ',
  },
  'nav.notifications': {
    en: 'Notifications',
    vi: 'Thông Báo',
  },
  'nav.settings': {
    en: 'Settings',
    vi: 'Cài Đặt',
  },
  'nav.profile': {
    en: 'Profile',
    vi: 'Hồ Sơ',
  },
  
  // Authentication
  'auth.login': {
    en: 'Login',
    vi: 'Đăng Nhập',
  },
  'auth.register': {
    en: 'Register',
    vi: 'Đăng Ký',
  },
  'auth.logout': {
    en: 'Logout',
    vi: 'Đăng Xuất',
  },
  'auth.email': {
    en: 'Email',
    vi: 'Email',
  },
  'auth.password': {
    en: 'Password',
    vi: 'Mật Khẩu',
  },
  'auth.forgotPassword': {
    en: 'Forgot Password?',
    vi: 'Quên Mật Khẩu?',
  },
  'auth.rememberMe': {
    en: 'Remember me',
    vi: 'Ghi nhớ đăng nhập',
  },
  'auth.noAccount': {
    en: "Don't have an account?",
    vi: 'Chưa có tài khoản?',
  },
  'auth.haveAccount': {
    en: 'Already have an account?',
    vi: 'Đã có tài khoản?',
  },
  
  // Common
  'common.save': {
    en: 'Save',
    vi: 'Lưu',
  },
  'common.cancel': {
    en: 'Cancel',
    vi: 'Hủy',
  },
  'common.delete': {
    en: 'Delete',
    vi: 'Xóa',
  },
  'common.edit': {
    en: 'Edit',
    vi: 'Sửa',
  },
  'common.submit': {
    en: 'Submit',
    vi: 'Gửi',
  },
  'common.back': {
    en: 'Back',
    vi: 'Quay Lại',
  },
  'common.next': {
    en: 'Next',
    vi: 'Tiếp Theo',
  },
  'common.search': {
    en: 'Search',
    vi: 'Tìm Kiếm',
  },
  'common.loading': {
    en: 'Loading...',
    vi: 'Đang Tải...',
  },
  'common.error': {
    en: 'Error',
    vi: 'Lỗi',
  },
  'common.success': {
    en: 'Success',
    vi: 'Thành Công',
  },
  
  // Settings
  'settings.title': {
    en: 'Settings',
    vi: 'Cài Đặt',
  },
  'settings.account': {
    en: 'Account',
    vi: 'Tài Khoản',
  },
  'settings.language': {
    en: 'Language',
    vi: 'Ngôn Ngữ',
  },
  'settings.appearance': {
    en: 'Appearance',
    vi: 'Giao Diện',
  },
  'settings.privacy': {
    en: 'Privacy & Security',
    vi: 'Riêng Tư & Bảo Mật',
  },
  'settings.help': {
    en: 'Help & Support',
    vi: 'Trợ Giúp & Hỗ Trợ',
  },
  
  // Profile
  'profile.name': {
    en: 'Full Name',
    vi: 'Họ và Tên',
  },
  'profile.phone': {
    en: 'Phone Number',
    vi: 'Số Điện Thoại',
  },
  'profile.changePassword': {
    en: 'Change Password',
    vi: 'Đổi Mật Khẩu',
  },
  'profile.devices': {
    en: 'Manage Devices',
    vi: 'Quản Lý Thiết Bị',
  },
  
  // Dashboard
  'dashboard.welcome': {
    en: 'Welcome back',
    vi: 'Chào mừng trở lại',
  },
  'dashboard.stats': {
    en: 'Statistics',
    vi: 'Thống Kê',
  },
  
  // Notifications
  'notifications.title': {
    en: 'Notifications',
    vi: 'Thông Báo',
  },
  'notifications.markAllRead': {
    en: 'Mark all as read',
    vi: 'Đánh dấu đã đọc tất cả',
  },
  'notifications.noNew': {
    en: 'No new notifications',
    vi: 'Không có thông báo mới',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = '@app_language';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Load language from AsyncStorage on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedLanguage === 'en' || storedLanguage === 'vi') {
          setLanguageState(storedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
