import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Number input widget with validation
/// 
/// Provides:
/// - Integer or decimal input
/// - Min/max validation
/// - Step control
/// - Prefix/suffix
class AppNumberInput extends StatefulWidget {
  final String? label;
  final String? hint;
  final double? initialValue;
  final double? min;
  final double? max;
  final double step;
  final int decimals;
  final String? prefix;
  final String? suffix;
  final bool enabled;
  final ValueChanged<double?>? onChanged;
  final String? Function(double?)? validator;

  const AppNumberInput({
    super.key,
    this.label,
    this.hint,
    this.initialValue,
    this.min,
    this.max,
    this.step = 1,
    this.decimals = 0,
    this.prefix,
    this.suffix,
    this.enabled = true,
    this.onChanged,
    this.validator,
  });

  @override
  State<AppNumberInput> createState() => _AppNumberInputState();
}

class _AppNumberInputState extends State<AppNumberInput> {
  late TextEditingController _controller;
  double? _value;

  @override
  void initState() {
    super.initState();
    _value = widget.initialValue;
    _controller = TextEditingController(
      text: _value?.toStringAsFixed(widget.decimals) ?? '',
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onChanged(String text) {
    if (text.isEmpty) {
      _value = null;
      widget.onChanged?.call(null);
      return;
    }

    final parsed = double.tryParse(text);
    if (parsed != null) {
      // Validate min/max
      if (widget.min != null && parsed < widget.min!) return;
      if (widget.max != null && parsed > widget.max!) return;
      
      _value = parsed;
      widget.onChanged?.call(parsed);
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
            prefixText: widget.prefix,
            suffixText: widget.suffix,
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
          keyboardType: TextInputType.numberWithOptions(
            decimal: widget.decimals > 0,
            signed: widget.min != null && widget.min! < 0,
          ),
          inputFormatters: [
            FilteringTextInputFormatter.allow(
              RegExp(widget.decimals > 0 ? r'^-?\d*\.?\d*' : r'^-?\d*'),
            ),
          ],
          onChanged: _onChanged,
          validator: (value) {
            if (widget.validator != null) {
              final parsed = value != null && value.isNotEmpty
                  ? double.tryParse(value)
                  : null;
              return widget.validator!(parsed);
            }
            return null;
          },
        ),
        if (widget.min != null || widget.max != null) ...[
          const SizedBox(height: 4),
          Text(
            'Range: ${widget.min ?? '-∞'} to ${widget.max ?? '∞'}',
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ],
    );
  }
}
