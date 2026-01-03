import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

/// Events for LocaleBloc
abstract class LocaleEvent extends Equatable {
  const LocaleEvent();

  @override
  List<Object?> get props => [];
}

/// Event to change app locale
class ChangeLocaleEvent extends LocaleEvent {
  final Locale locale;

  const ChangeLocaleEvent(this.locale);

  @override
  List<Object?> get props => [locale];
}

/// Event to load saved locale from storage
class LoadLocaleEvent extends LocaleEvent {
  const LoadLocaleEvent();
}

/// Event to reset locale to system default
class ResetLocaleEvent extends LocaleEvent {
  const ResetLocaleEvent();
}

/// Event to change to English
class ChangeToEnglishEvent extends LocaleEvent {
  const ChangeToEnglishEvent();
}

/// Event to change to Vietnamese
class ChangeToVietnameseEvent extends LocaleEvent {
  const ChangeToVietnameseEvent();
}
