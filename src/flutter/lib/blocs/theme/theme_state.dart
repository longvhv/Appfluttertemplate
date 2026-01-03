import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

/// State for ThemeBloc
class ThemeState extends Equatable {
  final ThemeMode themeMode;
  final bool isDark;

  const ThemeState({
    required this.themeMode,
    required this.isDark,
  });

  /// Initial state with system theme
  factory ThemeState.initial() {
    return const ThemeState(
      themeMode: ThemeMode.system,
      isDark: false,
    );
  }

  /// Create a copy with updated fields
  ThemeState copyWith({
    ThemeMode? themeMode,
    bool? isDark,
  }) {
    return ThemeState(
      themeMode: themeMode ?? this.themeMode,
      isDark: isDark ?? this.isDark,
    );
  }

  @override
  List<Object?> get props => [themeMode, isDark];

  @override
  String toString() => 'ThemeState(themeMode: $themeMode, isDark: $isDark)';
}
