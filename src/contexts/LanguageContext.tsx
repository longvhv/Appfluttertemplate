import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.notifications': 'Notifications',
    'nav.settings': 'Settings',
    
    // Home
    'home.welcome': 'Welcome Back',
    'home.subtitle': 'Here\'s what\'s happening today',
    'home.totalUsers': 'Total Users',
    'home.activeNow': 'Active Now',
    'home.newMessages': 'New Messages',
    'home.growth': 'Growth',
    'home.features': 'Features',
    'home.recentActivity': 'Recent Activity',
    'home.viewAll': 'View All',
    'home.minutes': 'minutes ago',
    'home.hours': 'hours ago',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.markAllRead': 'Mark All as Read',
    'notifications.noNew': 'No new notifications',
    'notifications.youreAllCaughtUp': 'You\'re all caught up!',
    
    // Settings
    'settings.title': 'Settings',
    'settings.account': 'Account Settings',
    'settings.profile': 'Profile',
    'settings.profileDesc': 'Manage your personal information',
    'settings.changePassword': 'Change Password',
    'settings.changePasswordDesc': 'Update your security password',
    'settings.devices': 'Logged In Devices',
    'settings.devicesDesc': 'Manage your active sessions',
    'settings.privacy': 'Privacy & Security',
    'settings.privacyDesc': 'Control your privacy settings',
    'settings.preferences': 'Preferences',
    'settings.language': 'Language',
    'settings.languageDesc': 'Choose your preferred language',
    'settings.appearance': 'Appearance',
    'settings.appearanceDesc': 'Customize display and theme',
    'settings.support': 'Support',
    'settings.helpCenter': 'Help Center',
    'settings.helpCenterDesc': 'Get help and support',
    'settings.faq': 'FAQ',
    'settings.faqDesc': 'Frequently asked questions',
    'settings.whatsNew': 'What\'s New',
    'settings.whatsNewDesc': 'Latest features and updates',
    'settings.logout': 'Logout',
    
    // Login
    'login.title': 'Welcome Back',
    'login.subtitle': 'Sign in to continue',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.forgotPassword': 'Forgot Password?',
    'login.signIn': 'Sign In',
    'login.noAccount': 'Don\'t have an account?',
    'login.signUp': 'Sign Up',
    'login.orContinueWith': 'Or continue with',
    
    // Register
    'register.title': 'Create Account',
    'register.subtitle': 'Sign up to get started',
    'register.name': 'Full Name',
    'register.email': 'Email',
    'register.password': 'Password',
    'register.confirmPassword': 'Confirm Password',
    'register.signUp': 'Sign Up',
    'register.haveAccount': 'Already have an account?',
    'register.signIn': 'Sign In',
    'register.orContinueWith': 'Or continue with',
    'register.passwordStrength': 'Password Strength',
    'register.weak': 'Weak',
    'register.fair': 'Fair',
    'register.good': 'Good',
    'register.strong': 'Strong',
    'register.veryStrong': 'Very Strong',
    'register.requirements': 'Password Requirements:',
    'register.minLength': 'At least 8 characters',
    'register.uppercase': 'One uppercase letter',
    'register.lowercase': 'One lowercase letter',
    'register.number': 'One number',
    'register.special': 'One special character',
    
    // Validation
    'validation.nameRequired': 'Name is required',
    'validation.nameTooShort': 'Name must be at least 2 characters',
    'validation.emailRequired': 'Email is required',
    'validation.emailInvalid': 'Please enter a valid email',
    'validation.passwordRequired': 'Password is required',
    'validation.passwordTooShort': 'Password must be at least 8 characters',
    'validation.passwordsNotMatch': 'Passwords do not match',
    'validation.passwordMatch': 'Passwords match',
    
    // Forgot Password
    'forgot.title': 'Forgot Password',
    'forgot.subtitle': 'Enter your email to reset password',
    'forgot.email': 'Email',
    'forgot.sendLink': 'Send Reset Link',
    'forgot.backToLogin': 'Back to Login',
    'forgot.success': 'Reset link sent!',
    'forgot.successDesc': 'Check your email for password reset instructions',
    
    // Profile
    'profile.title': 'Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.name': 'Full Name',
    'profile.email': 'Email',
    'profile.phone': 'Phone Number',
    'profile.bio': 'Bio',
    'profile.bioPlaceholder': 'Tell us about yourself',
    'profile.location': 'Location',
    'profile.locationPlaceholder': 'City, Country',
    'profile.saveChanges': 'Save Changes',
    'profile.changeAvatar': 'Change Avatar',
    'profile.uploadNew': 'Upload New Photo',
    
    // Change Password
    'changePassword.title': 'Change Password',
    'changePassword.current': 'Current Password',
    'changePassword.new': 'New Password',
    'changePassword.confirm': 'Confirm New Password',
    'changePassword.update': 'Update Password',
    'changePassword.requirements': 'Password Requirements',
    
    // Devices
    'devices.title': 'Logged In Devices',
    'devices.subtitle': 'Manage devices where you\'re logged in',
    'devices.current': 'Current Device',
    'devices.active': 'Active',
    'devices.lastActive': 'Last Active',
    'devices.signOut': 'Sign Out',
    'devices.signOutAll': 'Sign Out All Other Devices',
    
    // Privacy
    'privacy.title': 'Privacy & Security',
    'privacy.subtitle': 'Manage your privacy and security settings',
    'privacy.twoFactor': 'Two-Factor Authentication',
    'privacy.twoFactorDesc': 'Add an extra layer of security',
    'privacy.profileVisibility': 'Profile Visibility',
    'privacy.profileVisibilityDesc': 'Control who can see your profile',
    'privacy.activityStatus': 'Activity Status',
    'privacy.activityStatusDesc': 'Show when you\'re online',
    'privacy.readReceipts': 'Read Receipts',
    'privacy.readReceiptsDesc': 'Show when you\'ve read messages',
    'privacy.dataSharing': 'Data Sharing',
    'privacy.dataAnalytics': 'Analytics & Performance',
    'privacy.dataAnalyticsDesc': 'Help improve our service',
    'privacy.marketing': 'Marketing Communications',
    'privacy.marketingDesc': 'Receive promotional emails',
    
    // Language
    'language.title': 'Language',
    'language.subtitle': 'Choose your preferred language',
    'language.english': 'English',
    'language.vietnamese': 'Tiếng Việt',
    'language.selected': 'Selected',
    
    // Help Center
    'help.title': 'Help Center',
    'help.subtitle': 'How can we help you today?',
    'help.search': 'Search for help...',
    'help.categories': 'Categories',
    'help.articles': 'articles',
    'help.popularArticles': 'Popular Articles',
    'help.supportTickets': 'My Support Tickets',
    'help.newTicket': 'New',
    'help.contactSupport': 'Contact Support',
    'help.email': 'Email Support',
    'help.phone': 'Phone Support',
    'help.videoChat': 'Video Chat',
    'help.liveChat': 'Live Chat',
    'help.online': 'Online',
    'help.offline': 'Offline',
    'help.contactForm': 'Contact Support',
    'help.yourName': 'Your Name',
    'help.yourEmail': 'Your Email',
    'help.message': 'Message',
    'help.messagePlaceholder': 'Describe your issue...',
    'help.send': 'Send Message',
    'help.cancel': 'Cancel',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Find answers to common questions',
    'faq.search': 'Search FAQ...',
    
    // What's New
    'whatsNew.title': 'What\'s New',
    'whatsNew.subtitle': 'Latest features and improvements',
    'whatsNew.version': 'Version',
    'whatsNew.released': 'Released',
    
    // Appearance
    'appearance.title': 'Appearance',
    'appearance.subtitle': 'Customize how the app looks',
    'appearance.theme': 'Theme',
    'appearance.light': 'Light',
    'appearance.dark': 'Dark',
    'appearance.auto': 'Auto',
    'appearance.fontSize': 'Font Size',
    'appearance.small': 'Small',
    'appearance.medium': 'Medium',
    'appearance.large': 'Large',
    'appearance.extraLarge': 'Extra Large',
    'appearance.density': 'Display Density',
    'appearance.compact': 'Compact',
    'appearance.compactDesc': 'More content on screen',
    'appearance.normal': 'Normal',
    'appearance.normalDesc': 'Balanced spacing',
    'appearance.comfortable': 'Comfortable',
    'appearance.comfortableDesc': 'More breathing room',
    'appearance.advanced': 'Advanced',
    'appearance.animations': 'Animations',
    'appearance.animationsDesc': 'Enable smooth transitions',
    'appearance.highContrast': 'High Contrast',
    'appearance.highContrastDesc': 'Improve readability',
    'appearance.preview': 'Preview',
    'appearance.previewTitle': 'Example Title',
    'appearance.previewText': 'This is how your text will appear with the current settings. Adjust the options above to customize your experience.',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.done': 'Done',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.close': 'Close',
  },
  vi: {
    // Navigation
    'nav.home': 'Trang Chủ',
    'nav.notifications': 'Thông Báo',
    'nav.settings': 'Cài Đặt',
    
    // Home
    'home.welcome': 'Chào Mừng Trở Lại',
    'home.subtitle': 'Những gì đang diễn ra hôm nay',
    'home.totalUsers': 'Tổng Người Dùng',
    'home.activeNow': 'Đang Hoạt Động',
    'home.newMessages': 'Tin Nhắn Mới',
    'home.growth': 'Tăng Trưởng',
    'home.features': 'Tính Năng',
    'home.recentActivity': 'Hoạt Động Gần Đây',
    'home.viewAll': 'Xem Tất Cả',
    'home.minutes': 'phút trước',
    'home.hours': 'giờ trước',
    
    // Notifications
    'notifications.title': 'Thông Báo',
    'notifications.markAllRead': 'Đánh Dấu Tất Cả Đã Đọc',
    'notifications.noNew': 'Không có thông báo mới',
    'notifications.youreAllCaughtUp': 'Bạn đã xem hết thông báo!',
    
    // Settings
    'settings.title': 'Cài Đặt',
    'settings.account': 'Cài Đặt Tài Khoản',
    'settings.profile': 'Hồ Sơ',
    'settings.profileDesc': 'Quản lý thông tin cá nhân',
    'settings.changePassword': 'Đổi Mật Khẩu',
    'settings.changePasswordDesc': 'Cập nhật mật khẩu bảo mật',
    'settings.devices': 'Thiết Bị Đã Đăng Nhập',
    'settings.devicesDesc': 'Quản lý các phiên đăng nhập',
    'settings.privacy': 'Riêng Tư & Bảo Mật',
    'settings.privacyDesc': 'Kiểm soát cài đặt riêng tư',
    'settings.preferences': 'Tùy Chọn',
    'settings.language': 'Ngôn Ngữ',
    'settings.languageDesc': 'Chọn ngôn ngữ ưa thích',
    'settings.appearance': 'Giao Diện',
    'settings.appearanceDesc': 'Tùy chỉnh hiển thị và chủ đề',
    'settings.support': 'Hỗ Trợ',
    'settings.helpCenter': 'Trung Tâm Hỗ Trợ',
    'settings.helpCenterDesc': 'Nhận trợ giúp và hỗ trợ',
    'settings.faq': 'Câu Hỏi Thường Gặp',
    'settings.faqDesc': 'Các câu hỏi thường gặp',
    'settings.whatsNew': 'Tính Năng Mới',
    'settings.whatsNewDesc': 'Tính năng và cập nhật mới nhất',
    'settings.logout': 'Đăng Xuất',
    
    // Login
    'login.title': 'Chào Mừng Trở Lại',
    'login.subtitle': 'Đăng nhập để tiếp tục',
    'login.email': 'Email',
    'login.password': 'Mật Khẩu',
    'login.forgotPassword': 'Quên Mật Khẩu?',
    'login.signIn': 'Đăng Nhập',
    'login.noAccount': 'Chưa có tài khoản?',
    'login.signUp': 'Đăng Ký',
    'login.orContinueWith': 'Hoặc tiếp tục với',
    
    // Register
    'register.title': 'Tạo Tài Khoản',
    'register.subtitle': 'Đăng ký để bắt đầu',
    'register.name': 'Họ Và Tên',
    'register.email': 'Email',
    'register.password': 'Mật Khẩu',
    'register.confirmPassword': 'Xác Nhận Mật Khẩu',
    'register.signUp': 'Đăng Ký',
    'register.haveAccount': 'Đã có tài khoản?',
    'register.signIn': 'Đăng Nhập',
    'register.orContinueWith': 'Hoặc tiếp tục với',
    'register.passwordStrength': 'Độ Mạnh Mật Khẩu',
    'register.weak': 'Yếu',
    'register.fair': 'Trung Bình',
    'register.good': 'Tốt',
    'register.strong': 'Mạnh',
    'register.veryStrong': 'Rất Mạnh',
    'register.requirements': 'Yêu Cầu Mật Khẩu:',
    'register.minLength': 'Ít nhất 8 ký tự',
    'register.uppercase': 'Một chữ hoa',
    'register.lowercase': 'Một chữ thường',
    'register.number': 'Một chữ số',
    'register.special': 'Một ký tự đặc biệt',
    
    // Validation
    'validation.nameRequired': 'Vui lòng nhập họ tên',
    'validation.nameTooShort': 'Họ tên phải có ít nhất 2 ký tự',
    'validation.emailRequired': 'Vui lòng nhập email',
    'validation.emailInvalid': 'Vui lòng nhập email hợp lệ',
    'validation.passwordRequired': 'Vui lòng nhập mật khẩu',
    'validation.passwordTooShort': 'Mật khẩu phải có ít nhất 8 ký tự',
    'validation.passwordsNotMatch': 'Mật khẩu không khớp',
    'validation.passwordMatch': 'Mật khẩu khớp',
    
    // Forgot Password
    'forgot.title': 'Quên Mật Khẩu',
    'forgot.subtitle': 'Nhập email để đặt lại mật khẩu',
    'forgot.email': 'Email',
    'forgot.sendLink': 'Gửi Liên Kết',
    'forgot.backToLogin': 'Quay Lại Đăng Nhập',
    'forgot.success': 'Đã gửi liên kết!',
    'forgot.successDesc': 'Kiểm tra email để biết hướng dẫn đặt lại mật khẩu',
    
    // Profile
    'profile.title': 'Hồ Sơ',
    'profile.personalInfo': 'Thông Tin Cá Nhân',
    'profile.name': 'Họ Và Tên',
    'profile.email': 'Email',
    'profile.phone': 'Số Điện Thoại',
    'profile.bio': 'Giới Thiệu',
    'profile.bioPlaceholder': 'Giới thiệu về bản thân',
    'profile.location': 'Vị Trí',
    'profile.locationPlaceholder': 'Thành phố, Quốc gia',
    'profile.saveChanges': 'Lưu Thay Đổi',
    'profile.changeAvatar': 'Đổi Ảnh Đại Diện',
    'profile.uploadNew': 'Tải Ảnh Mới',
    
    // Change Password
    'changePassword.title': 'Đổi Mật Khẩu',
    'changePassword.current': 'Mật Khẩu Hiện Tại',
    'changePassword.new': 'Mật Khẩu Mới',
    'changePassword.confirm': 'Xác Nhận Mật Khẩu Mới',
    'changePassword.update': 'Cập Nhật Mật Khẩu',
    'changePassword.requirements': 'Yêu Cầu Mật Khẩu',
    
    // Devices
    'devices.title': 'Thiết Bị Đã Đăng Nhập',
    'devices.subtitle': 'Quản lý các thiết bị đã đăng nhập',
    'devices.current': 'Thiết Bị Hiện Tại',
    'devices.active': 'Đang Hoạt Động',
    'devices.lastActive': 'Hoạt Động Lần Cuối',
    'devices.signOut': 'Đăng Xuất',
    'devices.signOutAll': 'Đăng Xuất Tất Cả Thiết Bị Khác',
    
    // Privacy
    'privacy.title': 'Riêng Tư & Bảo Mật',
    'privacy.subtitle': 'Quản lý cài đặt riêng tư và bảo mật',
    'privacy.twoFactor': 'Xác Thực Hai Yếu Tố',
    'privacy.twoFactorDesc': 'Thêm lớp bảo mật bổ sung',
    'privacy.profileVisibility': 'Hiển Thị Hồ Sơ',
    'privacy.profileVisibilityDesc': 'Kiểm soát ai có thể xem hồ sơ',
    'privacy.activityStatus': 'Trạng Thái Hoạt Động',
    'privacy.activityStatusDesc': 'Hiển thị khi bạn trực tuyến',
    'privacy.readReceipts': 'Xác Nhận Đã Đọc',
    'privacy.readReceiptsDesc': 'Hiển thị khi bạn đã đọc tin nhắn',
    'privacy.dataSharing': 'Chia Sẻ Dữ Liệu',
    'privacy.dataAnalytics': 'Phân Tích & Hiệu Suất',
    'privacy.dataAnalyticsDesc': 'Giúp cải thiện dịch vụ',
    'privacy.marketing': 'Thông Tin Marketing',
    'privacy.marketingDesc': 'Nhận email quảng cáo',
    
    // Language
    'language.title': 'Ngôn Ngữ',
    'language.subtitle': 'Chọn ngôn ngữ ưa thích',
    'language.english': 'English',
    'language.vietnamese': 'Tiếng Việt',
    'language.selected': 'Đã Chọn',
    
    // Help Center
    'help.title': 'Trung Tâm Hỗ Trợ',
    'help.subtitle': 'Chúng tôi có thể giúp gì cho bạn?',
    'help.search': 'Tìm kiếm trợ giúp...',
    'help.categories': 'Danh Mục',
    'help.articles': 'bài viết',
    'help.popularArticles': 'Bài Viết Phổ Biến',
    'help.supportTickets': 'Yêu Cầu Hỗ Trợ Của Tôi',
    'help.newTicket': 'Mới',
    'help.contactSupport': 'Liên Hệ Hỗ Trợ',
    'help.email': 'Hỗ Trợ Email',
    'help.phone': 'Hỗ Trợ Điện Thoại',
    'help.videoChat': 'Video Chat',
    'help.liveChat': 'Chat Trực Tuyến',
    'help.online': 'Trực Tuyến',
    'help.offline': 'Ngoại Tuyến',
    'help.contactForm': 'Liên Hệ Hỗ Trợ',
    'help.yourName': 'Tên Của Bạn',
    'help.yourEmail': 'Email Của Bạn',
    'help.message': 'Tin Nhắn',
    'help.messagePlaceholder': 'Mô tả vấn đề của bạn...',
    'help.send': 'Gửi Tin Nhắn',
    'help.cancel': 'Hủy',
    
    // FAQ
    'faq.title': 'Câu Hỏi Thường Gặp',
    'faq.subtitle': 'Tìm câu trả lời cho các câu hỏi phổ biến',
    'faq.search': 'Tìm kiếm câu hỏi...',
    
    // What's New
    'whatsNew.title': 'Tính Năng Mới',
    'whatsNew.subtitle': 'Tính năng và cải tiến mới nhất',
    'whatsNew.version': 'Phiên Bản',
    'whatsNew.released': 'Phát Hành',
    
    // Appearance
    'appearance.title': 'Giao Diện',
    'appearance.subtitle': 'Tùy chỉnh cách hiển thị ứng dụng',
    'appearance.theme': 'Chủ Đề',
    'appearance.light': 'Sáng',
    'appearance.dark': 'Tối',
    'appearance.auto': 'Tự Động',
    'appearance.fontSize': 'Kích Thước Chữ',
    'appearance.small': 'Nhỏ',
    'appearance.medium': 'Trung Bình',
    'appearance.large': 'Lớn',
    'appearance.extraLarge': 'Rất Lớn',
    'appearance.density': 'Độ Dày Mỏng',
    'appearance.compact': 'Nhỏ Ngắt',
    'appearance.compactDesc': 'Nhiều nội dung trên màn hình',
    'appearance.normal': 'Bình Thường',
    'appearance.normalDesc': 'Khoảng cách cân đối',
    'appearance.comfortable': 'Thích Ứng',
    'appearance.comfortableDesc': 'Không gian hít thở rộng rãi',
    'appearance.advanced': 'Nâng Cao',
    'appearance.animations': 'Hiệu Ứng',
    'appearance.animationsDesc': 'Bật chuyển đổi mượt mà',
    'appearance.highContrast': 'Độ Chênh Lệch Cao',
    'appearance.highContrastDesc': 'Tăng khả năng đọc',
    'appearance.preview': 'Xem Trước',
    'appearance.previewTitle': 'Tiêu Đề Ví Dụ',
    'appearance.previewText': 'Đây là cách văn bản của bạn sẽ hiển thị với các cài đặt hiện tại. Điều chỉnh các tùy chọn trên để tùy chỉnh trải nghiệm của bạn.',
    
    // Common
    'common.loading': 'Đang tải...',
    'common.save': 'Lưu',
    'common.cancel': 'Hủy',
    'common.delete': 'Xóa',
    'common.edit': 'Sửa',
    'common.done': 'Xong',
    'common.back': 'Quay Lại',
    'common.next': 'Tiếp Theo',
    'common.close': 'Đóng',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'vi' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}