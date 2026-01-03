import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// URL input widget with validation
/// 
/// Provides:
/// - URL validation
/// - Protocol detection
/// - Open URL action
class AppUrlInput extends StatefulWidget {
  final String? label;
  final String? hint;
  final String? initialValue;
  final bool enabled;
  final bool showOpenButton;
  final ValueChanged<String?>? onChanged;
  final String? Function(String?)? validator;

  const AppUrlInput({
    super.key,
    this.label,
    this.hint = 'https://example.com',
    this.initialValue,
    this.enabled = true,
    this.showOpenButton = true,
    this.onChanged,
    this.validator,
  });

  @override
  State<AppUrlInput> createState() => _AppUrlInputState();
}

class _AppUrlInputState extends State<AppUrlInput> {
  late TextEditingController _controller;
  bool _isValid = false;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialValue);
    _validateUrl(_controller.text);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  bool _validateUrl(String url) {
    if (url.isEmpty) {
      setState(() => _isValid = false);
      return false;
    }

    final urlPattern = RegExp(
      r'^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$',
      caseSensitive: false,
    );

    final valid = urlPattern.hasMatch(url);
    setState(() => _isValid = valid);
    return valid;
  }

  String _ensureProtocol(String url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://$url';
    }
    return url;
  }

  void _openUrl() async {
    if (_isValid && _controller.text.isNotEmpty) {
      final url = _ensureProtocol(_controller.text);
      // TODO: Launch URL
      // await launchUrl(Uri.parse(url));
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Opening: $url')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
        ],
        TextFormField(
          controller: _controller,
          enabled: widget.enabled,
          decoration: InputDecoration(
            hintText: widget.hint,
            border: const OutlineInputBorder(),
            prefixIcon: Icon(
              Icons.link,
              color: _isValid
                  ? colorScheme.primary
                  : colorScheme.onSurfaceVariant,
            ),
            suffixIcon: widget.showOpenButton && _isValid
                ? IconButton(
                    icon: const Icon(Icons.open_in_new, size: 20),
                    onPressed: _openUrl,
                    tooltip: 'Open URL',
                  )
                : _controller.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, size: 20),
                        onPressed: () {
                          _controller.clear();
                          setState(() => _isValid = false);
                          widget.onChanged?.call(null);
                        },
                      )
                    : null,
          ),
          keyboardType: TextInputType.url,
          textInputAction: TextInputAction.done,
          onChanged: (value) {
            _validateUrl(value);
            widget.onChanged?.call(value.isNotEmpty ? value : null);
          },
          validator: (value) {
            if (widget.validator != null) {
              return widget.validator!(value);
            }
            if (value != null && value.isNotEmpty && !_isValid) {
              return 'Please enter a valid URL';
            }
            return null;
          },
        ),
        if (_controller.text.isNotEmpty) ...[
          const SizedBox(height: 4),
          Row(
            children: [
              Icon(
                _isValid ? Icons.check_circle : Icons.error,
                size: 16,
                color: _isValid
                    ? colorScheme.primary
                    : colorScheme.error,
              ),
              const SizedBox(width: 4),
              Text(
                _isValid ? 'Valid URL' : 'Invalid URL',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: _isValid
                      ? colorScheme.primary
                      : colorScheme.error,
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }
}
