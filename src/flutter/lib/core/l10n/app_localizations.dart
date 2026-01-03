import 'package:flutter/material.dart';
import 'app_localizations_en.dart';
import 'app_localizations_vi.dart';

/// App Localizations
abstract class AppLocalizations {
  static const List<Locale> supportedLocales = [
    Locale('en'),
    Locale('vi'),
  ];

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  // Common
  String get appName;
  String get welcome;
  String get hello;
  String get save;
  String get cancel;
  String get delete;
  String get edit;
  String get confirm;
  String get back;
  String get next;
  String get done;
  String get loading;
  String get error;
  String get success;
  String get warning;
  String get info;
  
  // Authentication
  String get login;
  String get logout;
  String get register;
  String get forgotPassword;
  String get resetPassword;
  String get email;
  String get password;
  String get confirmPassword;
  String get rememberMe;
  String get dontHaveAccount;
  String get alreadyHaveAccount;
  String get createAccount;
  
  // Navigation
  String get home;
  String get profile;
  String get settings;
  String get notifications;
  String get help;
  
  // Profile
  String get editProfile;
  String get changePassword;
  String get personalInfo;
  String get fullName;
  String get phoneNumber;
  String get address;
  String get dateOfBirth;
  
  // Settings
  String get appearance;
  String get language;
  String get privacySecurity;
  String get devices;
  String get aboutApp;
  String get version;
  String get termsOfService;
  String get privacyPolicy;
  
  // Theme
  String get lightMode;
  String get darkMode;
  String get systemDefault;
  
  // Language
  String get english;
  String get vietnamese;
  
  // Notifications
  String get notificationSettings;
  String get pushNotifications;
  String get emailNotifications;
  String get smsNotifications;
  
  // Privacy & Security
  String get changePin;
  String get biometricAuth;
  String get twoFactorAuth;
  String get privacySettings;
  String get dataManagement;
  
  // Help & Support
  String get faq;
  String get contactSupport;
  String get whatsNew;
  String get tutorials;
  
  // Validation Messages
  String get fieldRequired;
  String get invalidEmail;
  String get invalidPassword;
  String get passwordsDoNotMatch;
  String get passwordTooShort;
  String get invalidPhoneNumber;
  
  // Error Messages
  String get networkError;
  String get serverError;
  String get unknownError;
  String get sessionExpired;
  
  // Success Messages
  String get savedSuccessfully;
  String get deletedSuccessfully;
  String get updatedSuccessfully;
  String get passwordChangedSuccessfully;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['en', 'vi'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) async {
    switch (locale.languageCode) {
      case 'vi':
        return AppLocalizationsVi();
      case 'en':
      default:
        return AppLocalizationsEn();
    }
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
