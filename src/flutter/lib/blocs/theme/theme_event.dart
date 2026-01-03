import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

/// Events for ThemeBloc
abstract class ThemeEvent extends Equatable {
  const ThemeEvent();

  @override
  List<Object?> get props => [];
}

/// Event to change theme mode
class ChangeThemeModeEvent extends ThemeEvent {
  final ThemeMode themeMode;

  const ChangeThemeModeEvent(this.themeMode);

  @override
  List<Object?> get props => [themeMode];
}

/// Event to toggle theme (light <-> dark)
class ToggleThemeEvent extends ThemeEvent {
  const ToggleThemeEvent();
}

/// Event to load saved theme from storage
class LoadThemeEvent extends ThemeEvent {
  const LoadThemeEvent();
}

/// Event to reset theme to system default
class ResetThemeEvent extends ThemeEvent {
  const ResetThemeEvent();
}
