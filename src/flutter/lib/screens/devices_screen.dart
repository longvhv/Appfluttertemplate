import 'package:flutter/material.dart';
import '../core/l10n/app_localizations.dart';

class DevicesScreen extends StatelessWidget {
  const DevicesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return Scaffold(
      appBar: AppBar(title: Text(l10n.devices)),
      body: Center(child: Text(l10n.devices)),
    );
  }
}
