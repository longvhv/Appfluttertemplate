import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../core/l10n/app_localizations.dart';

class HelpScreen extends StatelessWidget {
  const HelpScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    
    return Scaffold(
      appBar: AppBar(title: Text(l10n.help)),
      body: ListView(
        children: [
          ListTile(
            leading: const Icon(Icons.question_answer_outlined),
            title: Text(l10n.faq),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => context.push('/faq'),
          ),
          ListTile(
            leading: const Icon(Icons.new_releases_outlined),
            title: Text(l10n.whatsNew),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => context.push('/whats-new'),
          ),
          ListTile(
            leading: const Icon(Icons.contact_support_outlined),
            title: Text(l10n.contactSupport),
            onTap: () {},
          ),
        ],
      ),
    );
  }
}
