import 'package:flutter/material.dart';
import '../core/l10n/app_localizations.dart';

class FAQScreen extends StatelessWidget {
  const FAQScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return Scaffold(
      appBar: AppBar(title: Text(l10n.faq)),
      body: Center(child: Text(l10n.faq)),
    );
  }
}
