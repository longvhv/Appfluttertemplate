import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

/// State for LocaleBloc
class LocaleState extends Equatable {
  final Locale locale;
  final String languageCode;
  final String languageName;

  const LocaleState({
    required this.locale,
    required this.languageCode,
    required this.languageName,
  });

  /// Initial state with English
  factory LocaleState.initial() {
    return const LocaleState(
      locale: Locale('en'),
      languageCode: 'en',
      languageName: 'English',
    );
  }

  /// English locale
  factory LocaleState.english() {
    return const LocaleState(
      locale: Locale('en'),
      languageCode: 'en',
      languageName: 'English',
    );
  }

  /// Vietnamese locale
  factory LocaleState.vietnamese() {
    return const LocaleState(
      locale: Locale('vi'),
      languageCode: 'vi',
      languageName: 'Tiếng Việt',
    );
  }

  /// Create from locale
  factory LocaleState.fromLocale(Locale locale) {
    switch (locale.languageCode) {
      case 'vi':
        return LocaleState.vietnamese();
      case 'en':
      default:
        return LocaleState.english();
    }
  }

  /// Create a copy with updated fields
  LocaleState copyWith({
    Locale? locale,
    String? languageCode,
    String? languageName,
  }) {
    return LocaleState(
      locale: locale ?? this.locale,
      languageCode: languageCode ?? this.languageCode,
      languageName: languageName ?? this.languageName,
    );
  }

  /// Check if current locale is English
  bool get isEnglish => languageCode == 'en';

  /// Check if current locale is Vietnamese
  bool get isVietnamese => languageCode == 'vi';

  @override
  List<Object?> get props => [locale, languageCode, languageName];

  @override
  String toString() =>
      'LocaleState(locale: $locale, languageCode: $languageCode, languageName: $languageName)';
}
