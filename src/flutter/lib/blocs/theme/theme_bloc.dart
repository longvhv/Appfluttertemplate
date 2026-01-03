import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';
import 'theme_event.dart';
import 'theme_state.dart';

/// BLoC for managing app theme
class ThemeBloc extends HydratedBloc<ThemeEvent, ThemeState> {
  ThemeBloc() : super(ThemeState.initial()) {
    on<ChangeThemeModeEvent>(_onChangeThemeMode);
    on<ToggleThemeEvent>(_onToggleTheme);
    on<LoadThemeEvent>(_onLoadTheme);
    on<ResetThemeEvent>(_onResetTheme);
  }

  /// Handle theme mode change
  void _onChangeThemeMode(
    ChangeThemeModeEvent event,
    Emitter<ThemeState> emit,
  ) {
    emit(state.copyWith(
      themeMode: event.themeMode,
      isDark: event.themeMode == ThemeMode.dark,
    ));
  }

  /// Handle theme toggle
  void _onToggleTheme(
    ToggleThemeEvent event,
    Emitter<ThemeState> emit,
  ) {
    final newMode = state.themeMode == ThemeMode.dark
        ? ThemeMode.light
        : ThemeMode.dark;

    emit(state.copyWith(
      themeMode: newMode,
      isDark: newMode == ThemeMode.dark,
    ));
  }

  /// Handle theme load
  void _onLoadTheme(
    LoadThemeEvent event,
    Emitter<ThemeState> emit,
  ) {
    // Theme is automatically loaded from HydratedBloc storage
    // This event can trigger manual reload if needed
  }

  /// Handle theme reset
  void _onResetTheme(
    ResetThemeEvent event,
    Emitter<ThemeState> emit,
  ) {
    emit(ThemeState.initial());
  }

  /// Serialize state to JSON for persistence
  @override
  ThemeState? fromJson(Map<String, dynamic> json) {
    try {
      final themeModeIndex = json['themeMode'] as int? ?? 0;
      final themeMode = ThemeMode.values[themeModeIndex];
      
      return ThemeState(
        themeMode: themeMode,
        isDark: json['isDark'] as bool? ?? false,
      );
    } catch (e) {
      return ThemeState.initial();
    }
  }

  /// Deserialize state from JSON
  @override
  Map<String, dynamic>? toJson(ThemeState state) {
    return {
      'themeMode': state.themeMode.index,
      'isDark': state.isDark,
    };
  }
}
