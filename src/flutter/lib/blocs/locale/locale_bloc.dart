import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';
import 'locale_event.dart';
import 'locale_state.dart';

/// BLoC for managing app locale
class LocaleBloc extends HydratedBloc<LocaleEvent, LocaleState> {
  LocaleBloc() : super(LocaleState.initial()) {
    on<ChangeLocaleEvent>(_onChangeLocale);
    on<LoadLocaleEvent>(_onLoadLocale);
    on<ResetLocaleEvent>(_onResetLocale);
    on<ChangeToEnglishEvent>(_onChangeToEnglish);
    on<ChangeToVietnameseEvent>(_onChangeToVietnamese);
  }

  /// Handle locale change
  void _onChangeLocale(
    ChangeLocaleEvent event,
    Emitter<LocaleState> emit,
  ) {
    emit(LocaleState.fromLocale(event.locale));
  }

  /// Handle locale load
  void _onLoadLocale(
    LoadLocaleEvent event,
    Emitter<LocaleState> emit,
  ) {
    // Locale is automatically loaded from HydratedBloc storage
  }

  /// Handle locale reset
  void _onResetLocale(
    ResetLocaleEvent event,
    Emitter<LocaleState> emit,
  ) {
    emit(LocaleState.initial());
  }

  /// Handle change to English
  void _onChangeToEnglish(
    ChangeToEnglishEvent event,
    Emitter<LocaleState> emit,
  ) {
    emit(LocaleState.english());
  }

  /// Handle change to Vietnamese
  void _onChangeToVietnamese(
    ChangeToVietnameseEvent event,
    Emitter<LocaleState> emit,
  ) {
    emit(LocaleState.vietnamese());
  }

  /// Serialize state to JSON for persistence
  @override
  LocaleState? fromJson(Map<String, dynamic> json) {
    try {
      final languageCode = json['languageCode'] as String? ?? 'en';
      return LocaleState.fromLocale(Locale(languageCode));
    } catch (e) {
      return LocaleState.initial();
    }
  }

  /// Deserialize state from JSON
  @override
  Map<String, dynamic>? toJson(LocaleState state) {
    return {
      'languageCode': state.languageCode,
      'languageName': state.languageName,
    };
  }
}
