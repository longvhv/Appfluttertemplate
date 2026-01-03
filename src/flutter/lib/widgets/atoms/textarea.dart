import 'package:flutter/material.dart';

/// TextArea widget for multi-line text input
/// 
/// Provides:
/// - Multi-line text editing
/// - Auto-expand height
/// - Min/max lines control
/// - Character counter
/// - Validation
class AppTextArea extends StatefulWidget {
  final String? label;
  final String? hint;
  final String? initialValue;
  final int? minLines;
  final int? maxLines;
  final int? maxLength;
  final bool showCounter;
  final bool enabled;
  final bool readOnly;
  final TextInputAction? textInputAction;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final String? Function(String?)? validator;
  final TextEditingController? controller;

  const AppTextArea({
    super.key,
    this.label,
    this.hint,
    this.initialValue,
    this.minLines = 3,
    this.maxLines = 8,
    this.maxLength,
    this.showCounter = true,
    this.enabled = true,
    this.readOnly = false,
    this.textInputAction,
    this.onChanged,
    this.onSubmitted,
    this.validator,
    this.controller,
  });

  @override
  State<AppTextArea> createState() => _AppTextAreaState();
}

class _AppTextAreaState extends State<AppTextArea> {
  late final TextEditingController _controller;
  bool _isControllerInternal = false;

  @override
  void initState() {
    super.initState();
    if (widget.controller != null) {
      _controller = widget.controller!;
    } else {
      _controller = TextEditingController(text: widget.initialValue);
      _isControllerInternal = true;
    }
  }

  @override
  void dispose() {
    if (_isControllerInternal) {
      _controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

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
          decoration: InputDecoration(
            hintText: widget.hint,
            border: const OutlineInputBorder(),
            counter: widget.showCounter ? null : const SizedBox.shrink(),
          ),
          minLines: widget.minLines,
          maxLines: widget.maxLines,
          maxLength: widget.maxLength,
          enabled: widget.enabled,
          readOnly: widget.readOnly,
          textInputAction: widget.textInputAction,
          onChanged: widget.onChanged,
          onFieldSubmitted: widget.onSubmitted,
          validator: widget.validator,
        ),
      ],
    );
  }
}
