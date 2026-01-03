/// IP Address Input Widget
/// 
/// A specialized input for entering IPv4 and IPv6 addresses.
/// 
/// Features:
/// - IPv4 and IPv6 support
/// - Real-time validation
/// - Format enforcement
/// - Auto-formatting
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppIPAddressInput(
///   ipVersion: IPVersion.v4,
///   onChanged: (ip) => print(ip),
/// )
/// ```

library;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

enum IPVersion { v4, v6 }

class AppIPAddressInput extends StatefulWidget {
  final String? initialValue;
  final ValueChanged<String>? onChanged;
  final IPVersion ipVersion;
  final String? label;
  final bool enabled;
  final String? errorText;

  const AppIPAddressInput({
    super.key,
    this.initialValue,
    this.onChanged,
    this.ipVersion = IPVersion.v4,
    this.label,
    this.enabled = true,
    this.errorText,
  });

  @override
  State<AppIPAddressInput> createState() => _AppIPAddressInputState();
}

class _AppIPAddressInputState extends State<AppIPAddressInput> {
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
    setState(() {
      _validationError = _validateIP(value);
    });
    
    if (_validationError == null && value.isNotEmpty) {
      widget.onChanged?.call(value);
    }
  }

  String? _validateIP(String value) {
    if (value.isEmpty) return null;

    if (widget.ipVersion == IPVersion.v4) {
      return _validateIPv4(value);
    } else {
      return _validateIPv6(value);
    }
  }

  String? _validateIPv4(String value) {
    final parts = value.split('.');
    if (parts.length != 4) {
      return 'IPv4 must have 4 octets';
    }

    for (final part in parts) {
      final num = int.tryParse(part);
      if (num == null || num < 0 || num > 255) {
        return 'Each octet must be 0-255';
      }
    }

    return null;
  }

  String? _validateIPv6(String value) {
    // Basic IPv6 validation
    if (!value.contains(':')) {
      return 'Invalid IPv6 format';
    }

    final parts = value.split(':');
    if (parts.length > 8) {
      return 'IPv6 has max 8 groups';
    }

    for (final part in parts) {
      if (part.isEmpty) continue; // Allow :: notation
      if (part.length > 4) {
        return 'Each group max 4 hex digits';
      }
      if (!RegExp(r'^[0-9a-fA-F]*$').hasMatch(part)) {
        return 'Only hex digits allowed';
      }
    }

    return null;
  }

  String get _hintText {
    return widget.ipVersion == IPVersion.v4 
        ? '192.168.1.1' 
        : '2001:0db8:85a3::8a2e:0370:7334';
  }

  String get _helperText {
    return widget.ipVersion == IPVersion.v4
        ? 'Format: xxx.xxx.xxx.xxx (0-255)'
        : 'Format: xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx';
  }

  List<TextInputFormatter> get _formatters {
    if (widget.ipVersion == IPVersion.v4) {
      return [
        FilteringTextInputFormatter.allow(RegExp(r'[0-9.]')),
      ];
    } else {
      return [
        FilteringTextInputFormatter.allow(RegExp(r'[0-9a-fA-F:]')),
      ];
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
          inputFormatters: _formatters,
          decoration: InputDecoration(
            labelText: widget.label ?? 'IP Address',
            hintText: _hintText,
            border: const OutlineInputBorder(),
            prefixIcon: const Icon(Icons.computer),
            suffixIcon: _validationError == null && _controller.text.isNotEmpty
                ? Icon(Icons.check_circle, color: theme.colorScheme.primary)
                : null,
            errorText: _validationError ?? widget.errorText,
            helperText: _helperText,
            helperMaxLines: 2,
          ),
          keyboardType: widget.ipVersion == IPVersion.v4
              ? TextInputType.number
              : TextInputType.text,
        ),
      ],
    );
  }
}
