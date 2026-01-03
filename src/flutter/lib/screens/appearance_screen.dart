import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/l10n/app_localizations.dart';
import '../providers/theme_provider.dart';

class AppearanceScreen extends ConsumerWidget {
  const AppearanceScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final themeMode = ref.watch(themeModeProvider);
    final themeNotifier = ref.read(themeModeProvider.notifier);
    
    return Scaffold(
      appBar: AppBar(title: Text(l10n.appearance)),
      body: ListView(
        children: [
          RadioListTile<ThemeMode>(
            title: Text(l10n.lightMode),
            value: ThemeMode.light,
            groupValue: themeMode,
            onChanged: (value) => themeNotifier.setThemeMode(value!),
          ),
          RadioListTile<ThemeMode>(
            title: Text(l10n.darkMode),
            value: ThemeMode.dark,
            groupValue: themeMode,
            onChanged: (value) => themeNotifier.setThemeMode(value!),
          ),
          RadioListTile<ThemeMode>(
            title: Text(l10n.systemDefault),
            value: ThemeMode.system,
            groupValue: themeMode,
            onChanged: (value) => themeNotifier.setThemeMode(value!),
          ),
        ],
      ),
    );
  }
}
