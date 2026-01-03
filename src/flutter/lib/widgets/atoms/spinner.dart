import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Spinner widget for numeric input
/// 
/// Provides:
/// - Increment/decrement buttons
/// - Direct input
/// - Min/max values
/// - Step control
class AppSpinner extends StatefulWidget {
  final String? label;
  final double initialValue;
  final double min;
  final double max;
  final double step;
  final int decimals;
  final String? prefix;
  final String? suffix;
  final bool enabled;
  final ValueChanged<double>? onChanged;

  const AppSpinner({
    super.key,
    this.label,
    this.initialValue = 0,
    this.min = 0,
    this.max = 100,
    this.step = 1,
    this.decimals = 0,
    this.prefix,
    this.suffix,
    this.enabled = true,
    this.onChanged,
  });

  @override
  State<AppSpinner> createState() => _AppSpinnerState();
}

class _AppSpinnerState extends State<AppSpinner> {
  late double _value;
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _value = widget.initialValue.clamp(widget.min, widget.max);
    _controller = TextEditingController(text: _formatValue(_value));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _formatValue(double value) {
    return value.toStringAsFixed(widget.decimals);
  }

  void _updateValue(double newValue) {
    final clampedValue = newValue.clamp(widget.min, widget.max);
    setState(() {
      _value = clampedValue;
      _controller.text = _formatValue(clampedValue);
    });
    widget.onChanged?.call(clampedValue);
  }

  void _increment() {
    _updateValue(_value + widget.step);
  }

  void _decrement() {
    _updateValue(_value - widget.step);
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
        Container(
          decoration: BoxDecoration(
            border: Border.all(
              color: widget.enabled
                  ? colorScheme.outline
                  : colorScheme.outline.withOpacity(0.3),
            ),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            children: [
              // Decrement button
              Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: widget.enabled && _value > widget.min
                      ? _decrement
                      : null,
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    child: Icon(
                      Icons.remove,
                      size: 20,
                      color: widget.enabled && _value > widget.min
                          ? colorScheme.primary
                          : colorScheme.onSurface.withOpacity(0.3),
                    ),
                  ),
                ),
              ),

              // Input field
              Expanded(
                child: TextField(
                  controller: _controller,
                  enabled: widget.enabled,
                  textAlign: TextAlign.center,
                  keyboardType: TextInputType.numberWithOptions(
                    decimal: widget.decimals > 0,
                  ),
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(
                      RegExp(widget.decimals > 0
                          ? r'^\d*\.?\d*'
                          : r'^\d*'),
                    ),
                  ],
                  decoration: InputDecoration(
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 12,
                    ),
                    prefixText: widget.prefix,
                    suffixText: widget.suffix,
                  ),
                  onSubmitted: (value) {
                    final parsed = double.tryParse(value);
                    if (parsed != null) {
                      _updateValue(parsed);
                    } else {
                      _controller.text = _formatValue(_value);
                    }
                  },
                ),
              ),

              // Increment button
              Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: widget.enabled && _value < widget.max
                      ? _increment
                      : null,
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    child: Icon(
                      Icons.add,
                      size: 20,
                      color: widget.enabled && _value < widget.max
                          ? colorScheme.primary
                          : colorScheme.onSurface.withOpacity(0.3),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
