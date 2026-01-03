import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/l10n/app_localizations.dart';
import '../providers/locale_provider.dart';

class LanguageScreen extends ConsumerWidget {
  const LanguageScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final locale = ref.watch(localeProvider);
    final localeNotifier = ref.read(localeProvider.notifier);
    
    return Scaffold(
      appBar: AppBar(title: Text(l10n.language)),
      body: ListView(
        children: [
          RadioListTile<String>(
            title: Text(l10n.english),
            subtitle: const Text('English'),
            value: 'en',
            groupValue: locale.languageCode,
            onChanged: (value) => localeNotifier.setLocale(Locale(value!)),
          ),
          RadioListTile<String>(
            title: Text(l10n.vietnamese),
            subtitle: const Text('Tiếng Việt'),
            value: 'vi',
            groupValue: locale.languageCode,
            onChanged: (value) => localeNotifier.setLocale(Locale(value!)),
          ),
        ],
      ),
    );
  }
}
