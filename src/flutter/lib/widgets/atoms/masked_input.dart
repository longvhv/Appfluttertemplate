import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Masked input widget with pattern support
/// 
/// Provides:
/// - Custom input masks (phone, date, credit card, etc.)
/// - Auto-formatting
/// - Placeholder characters
class AppMaskedInput extends StatefulWidget {
  final String? label;
  final String? hint;
  final String mask;
  final String placeholder;
  final String? initialValue;
  final bool enabled;
  final ValueChanged<String>? onChanged;
  final String? Function(String?)? validator;

  const AppMaskedInput({
    super.key,
    this.label,
    this.hint,
    required this.mask,
    this.placeholder = '_',
    this.initialValue,
    this.enabled = true,
    this.onChanged,
    this.validator,
  });

  /// Phone number mask (US format)
  const AppMaskedInput.phone({
    super.key,
    this.label,
    this.hint = '(555) 123-4567',
    this.initialValue,
    this.enabled = true,
    this.onChanged,
    this.validator,
  })  : mask = '(###) ###-####',
        placeholder = '_';

  /// Date mask
  const AppMaskedInput.date({
    super.key,
    this.label,
    this.hint = 'MM/DD/YYYY',
    this.initialValue,
    this.enabled = true,
    this.onChanged,
    this.validator,
  })  : mask = '##/##/####',
        placeholder = '_';

  /// Credit card mask
  const AppMaskedInput.creditCard({
    super.key,
    this.label,
    this.hint = '1234 5678 9012 3456',
    this.initialValue,
    this.enabled = true,
    this.onChanged,
    this.validator,
  })  : mask = '#### #### #### ####',
        placeholder = '_';

  /// Time mask
  const AppMaskedInput.time({
    super.key,
    this.label,
    this.hint = 'HH:MM',
    this.initialValue,
    this.enabled = true,
    this.onChanged,
    this.validator,
  })  : mask = '##:##',
        placeholder = '_';

  @override
  State<AppMaskedInput> createState() => _AppMaskedInputState();
}

class _AppMaskedInputState extends State<AppMaskedInput> {
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialValue);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _applyMask(String text) {
    String result = '';
    int textIndex = 0;

    for (int maskIndex = 0; maskIndex < widget.mask.length; maskIndex++) {
      if (textIndex >= text.length) {
        break;
      }

      String maskChar = widget.mask[maskIndex];

      if (maskChar == '#') {
        // Allow digits only
        if (RegExp(r'\d').hasMatch(text[textIndex])) {
          result += text[textIndex];
          textIndex++;
        } else {
          textIndex++;
          maskIndex--;
        }
      } else {
        // Fixed character
        result += maskChar;
        if (text[textIndex] == maskChar) {
          textIndex++;
        }
      }
    }

    return result;
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
          enabled: widget.enabled,
          decoration: InputDecoration(
            hintText: widget.hint,
            border: const OutlineInputBorder(),
            suffixIcon: _controller.text.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.clear, size: 20),
                    onPressed: () {
                      _controller.clear();
                      widget.onChanged?.call('');
                    },
                  )
                : null,
          ),
          keyboardType: TextInputType.number,
          inputFormatters: [
            FilteringTextInputFormatter.digitsOnly,
            TextInputFormatter.withFunction((oldValue, newValue) {
              final masked = _applyMask(newValue.text);
              return TextEditingValue(
                text: masked,
                selection: TextSelection.collapsed(offset: masked.length),
              );
            }),
          ],
          onChanged: widget.onChanged,
          validator: widget.validator,
        ),
      ],
    );
  }
}
