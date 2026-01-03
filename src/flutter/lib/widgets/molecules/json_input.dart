/// JSON Input Widget
/// 
/// A specialized input for entering and editing JSON data.
/// 
/// Features:
/// - JSON validation
/// - Syntax highlighting (basic)
/// - Format/Pretty print
/// - Error display
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppJSONInput(
///   onChanged: (json) => print(json),
///   initialValue: '{"key": "value"}',
/// )
/// ```

library;

import 'package:flutter/material.dart';
import 'dart:convert';

class AppJSONInput extends StatefulWidget {
  final String? initialValue;
  final ValueChanged<String>? onChanged;
  final ValueChanged<Map<String, dynamic>>? onValidJSON;
  final String? label;
  final bool enabled;
  final int minLines;
  final int maxLines;

  const AppJSONInput({
    super.key,
    this.initialValue,
    this.onChanged,
    this.onValidJSON,
    this.label,
    this.enabled = true,
    this.minLines = 5,
    this.maxLines = 15,
  });

  @override
  State<AppJSONInput> createState() => _AppJSONInputState();
}

class _AppJSONInputState extends State<AppJSONInput> {
  late TextEditingController _controller;
  String? _validationError;
  bool _isValid = false;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialValue);
    _controller.addListener(_onChanged);
    _validateJSON(_controller.text);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onChanged() {
    _validateJSON(_controller.text);
    widget.onChanged?.call(_controller.text);
  }

  void _validateJSON(String value) {
    if (value.trim().isEmpty) {
      setState(() {
        _validationError = null;
        _isValid = false;
      });
      return;
    }

    try {
      final decoded = json.decode(value);
      setState(() {
        _validationError = null;
        _isValid = true;
      });
      
      if (decoded is Map<String, dynamic>) {
        widget.onValidJSON?.call(decoded);
      }
    } catch (e) {
      setState(() {
        _validationError = e.toString().replaceAll('FormatException: ', '');
        _isValid = false;
      });
    }
  }

  void _formatJSON() {
    try {
      final decoded = json.decode(_controller.text);
      final formatted = const JsonEncoder.withIndent('  ').convert(decoded);
      _controller.text = formatted;
    } catch (e) {
      // Show error snackbar
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Cannot format: Invalid JSON'),
          backgroundColor: Theme.of(context).colorScheme.error,
        ),
      );
    }
  }

  void _minifyJSON() {
    try {
      final decoded = json.decode(_controller.text);
      final minified = json.encode(decoded);
      _controller.text = minified;
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Cannot minify: Invalid JSON'),
          backgroundColor: Theme.of(context).colorScheme.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: theme.textTheme.titleSmall,
          ),
          const SizedBox(height: 8),
        ],

        TextField(
          controller: _controller,
          enabled: widget.enabled,
          minLines: widget.minLines,
          maxLines: widget.maxLines,
          style: TextStyle(
            fontFamily: 'monospace',
            fontSize: 13,
          ),
          decoration: InputDecoration(
            hintText: '{\n  "key": "value"\n}',
            border: const OutlineInputBorder(),
            prefixIcon: const Padding(
              padding: EdgeInsets.only(top: 12),
              child: Icon(Icons.code),
            ),
            suffixIcon: _isValid
                ? Padding(
                    padding: const EdgeInsets.only(top: 12),
                    child: Icon(
                      Icons.check_circle,
                      color: theme.colorScheme.primary,
                    ),
                  )
                : null,
            errorText: _validationError,
            errorMaxLines: 3,
          ),
        ),

        const SizedBox(height: 8),

        // Actions
        Row(
          children: [
            OutlinedButton.icon(
              onPressed: widget.enabled ? _formatJSON : null,
              icon: const Icon(Icons.format_indent_increase, size: 16),
              label: const Text('Format'),
            ),
            const SizedBox(width: 8),
            OutlinedButton.icon(
              onPressed: widget.enabled ? _minifyJSON : null,
              icon: const Icon(Icons.compress, size: 16),
              label: const Text('Minify'),
            ),
            const Spacer(),
            if (_isValid)
              Chip(
                avatar: Icon(
                  Icons.check_circle,
                  size: 16,
                  color: theme.colorScheme.primary,
                ),
                label: const Text('Valid JSON'),
                backgroundColor: theme.colorScheme.primaryContainer,
              ),
          ],
        ),
      ],
    );
  }
}
