import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';

/// Currency input widget with formatting
/// 
/// Provides:
/// - Auto-formatting as user types
/// - Currency symbol
/// - Thousand separators
/// - Decimal places
/// - Min/max validation
class AppCurrencyInput extends StatefulWidget {
  final String? label;
  final String? hint;
  final double? initialValue;
  final String currencySymbol;
  final String locale;
  final int decimalDigits;
  final double? min;
  final double? max;
  final bool enabled;
  final ValueChanged<double?>? onChanged;
  final String? Function(double?)? validator;

  const AppCurrencyInput({
    super.key,
    this.label,
    this.hint,
    this.initialValue,
    this.currencySymbol = '\$',
    this.locale = 'en_US',
    this.decimalDigits = 2,
    this.min,
    this.max,
    this.enabled = true,
    this.onChanged,
    this.validator,
  });

  @override
  State<AppCurrencyInput> createState() => _AppCurrencyInputState();
}

class _AppCurrencyInputState extends State<AppCurrencyInput> {
  late TextEditingController _controller;
  late NumberFormat _formatter;
  double? _value;

  @override
  void initState() {
    super.initState();
    _value = widget.initialValue;
    _formatter = NumberFormat.currency(
      locale: widget.locale,
      symbol: widget.currencySymbol,
      decimalDigits: widget.decimalDigits,
    );
    _controller = TextEditingController(
      text: _value != null ? _formatValue(_value!) : '',
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _formatValue(double value) {
    return _formatter.format(value);
  }

  double? _parseValue(String text) {
    // Remove currency symbol and separators
    String cleaned = text
        .replaceAll(widget.currencySymbol, '')
        .replaceAll(',', '')
        .replaceAll(' ', '')
        .trim();
    
    return double.tryParse(cleaned);
  }

  void _onChanged(String text) {
    final parsed = _parseValue(text);
    
    if (parsed != null) {
      // Validate min/max
      if (widget.min != null && parsed < widget.min!) return;
      if (widget.max != null && parsed > widget.max!) return;
      
      _value = parsed;
      widget.onChanged?.call(parsed);
    } else {
      _value = null;
      widget.onChanged?.call(null);
    }
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
            prefixText: widget.currencySymbol,
            suffixIcon: _value != null
                ? IconButton(
                    icon: const Icon(Icons.clear, size: 20),
                    onPressed: () {
                      _controller.clear();
                      _value = null;
                      widget.onChanged?.call(null);
                    },
                  )
                : null,
          ),
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          inputFormatters: [
            FilteringTextInputFormatter.allow(RegExp(r'[\d.,]')),
          ],
          onChanged: _onChanged,
          validator: (value) {
            if (widget.validator != null) {
              final parsed = _parseValue(value ?? '');
              return widget.validator!(parsed);
            }
            return null;
          },
        ),
        if (widget.min != null || widget.max != null) ...[
          const SizedBox(height: 4),
          Text(
            'Range: ${widget.min ?? 0} - ${widget.max ?? 'unlimited'}',
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ],
    );
  }
}
