import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../core/l10n/app_localizations.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    
    return Scaffold(
      appBar: AppBar(title: Text(l10n.settings)),
      body: ListView(
        children: [
          ListTile(
            leading: const Icon(Icons.palette_outlined),
            title: Text(l10n.appearance),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => context.push('/appearance'),
          ),
          ListTile(
            leading: const Icon(Icons.language_outlined),
            title: Text(l10n.language),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => context.push('/language'),
          ),
          ListTile(
            leading: const Icon(Icons.security_outlined),
            title: Text(l10n.privacySecurity),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => context.push('/privacy-security'),
          ),
          ListTile(
            leading: const Icon(Icons.devices_outlined),
            title: Text(l10n.devices),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => context.push('/devices'),
          ),
          ListTile(
            leading: const Icon(Icons.lock_outlined),
            title: Text(l10n.changePassword),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => context.push('/change-password'),
          ),
          ListTile(
            leading: const Icon(Icons.help_outlined),
            title: Text(l10n.help),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => context.push('/help'),
          ),
        ],
      ),
    );
  }
}
