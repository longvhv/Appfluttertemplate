/// MAC Address Input Widget
/// 
/// A specialized input for entering MAC addresses.
/// 
/// Features:
/// - Auto-formatting with colons
/// - Real-time validation
/// - Multiple format support (colon, hyphen, none)
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppMacAddressInput(
///   onChanged: (mac) => print(mac),
/// )
/// ```

library;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

enum MacAddressFormat {
  colon,    // AA:BB:CC:DD:EE:FF
  hyphen,   // AA-BB-CC-DD-EE-FF
  none,     // AABBCCDDEEFF
}

class AppMacAddressInput extends StatefulWidget {
  final String? initialValue;
  final ValueChanged<String>? onChanged;
  final MacAddressFormat format;
  final String? label;
  final bool enabled;
  final String? errorText;

  const AppMacAddressInput({
    super.key,
    this.initialValue,
    this.onChanged,
    this.format = MacAddressFormat.colon,
    this.label,
    this.enabled = true,
    this.errorText,
  });

  @override
  State<AppMacAddressInput> createState() => _AppMacAddressInputState();
}

class _AppMacAddressInputState extends State<AppMacAddressInput> {
  late TextEditingController _controller;
  String? _validationError;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialValue);
    _controller.addListener(_onChanged);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onChanged() {
    final value = _controller.text;
    final formatted = _formatMacAddress(value);
    
    if (formatted != value) {
      final selection = _controller.selection;
      _controller.value = TextEditingValue(
        text: formatted,
        selection: TextSelection.collapsed(
          offset: selection.baseOffset + (formatted.length - value.length),
        ),
      );
    }

    setState(() {
      _validationError = _validateMacAddress(formatted);
    });

    if (_validationError == null && formatted.isNotEmpty) {
      widget.onChanged?.call(formatted);
    }
  }

  String _formatMacAddress(String value) {
    // Remove all separators
    final cleaned = value.replaceAll(RegExp(r'[:-]'), '').toUpperCase();
    
    if (cleaned.isEmpty) return '';
    
    // Limit to 12 characters
    final limited = cleaned.substring(0, cleaned.length > 12 ? 12 : cleaned.length);
    
    if (widget.format == MacAddressFormat.none) {
      return limited;
    }

    // Add separators
    final separator = widget.format == MacAddressFormat.colon ? ':' : '-';
    final parts = <String>[];
    
    for (var i = 0; i < limited.length; i += 2) {
      final end = i + 2 > limited.length ? limited.length : i + 2;
      parts.add(limited.substring(i, end));
    }
    
    return parts.join(separator);
  }

  String? _validateMacAddress(String value) {
    if (value.isEmpty) return null;

    final cleaned = value.replaceAll(RegExp(r'[:-]'), '');
    
    if (cleaned.length != 12) {
      return 'MAC address must be 12 hex digits';
    }

    if (!RegExp(r'^[0-9A-Fa-f]{12}$').hasMatch(cleaned)) {
      return 'Only hex digits allowed (0-9, A-F)';
    }

    return null;
  }

  String get _hintText {
    switch (widget.format) {
      case MacAddressFormat.colon:
        return 'AA:BB:CC:DD:EE:FF';
      case MacAddressFormat.hyphen:
        return 'AA-BB-CC-DD-EE-FF';
      case MacAddressFormat.none:
        return 'AABBCCDDEEFF';
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        TextField(
          controller: _controller,
          enabled: widget.enabled,
          inputFormatters: [
            FilteringTextInputFormatter.allow(RegExp(r'[0-9A-Fa-f:-]')),
            LengthLimitingTextInputFormatter(17), // Max length with separators
          ],
          decoration: InputDecoration(
            labelText: widget.label ?? 'MAC Address',
            hintText: _hintText,
            border: const OutlineInputBorder(),
            prefixIcon: const Icon(Icons.devices),
            suffixIcon: _validationError == null && _controller.text.isNotEmpty
                ? Icon(Icons.check_circle, color: theme.colorScheme.primary)
                : null,
            errorText: _validationError ?? widget.errorText,
            helperText: '12 hexadecimal digits',
          ),
        ),
      ],
    );
  }
}
