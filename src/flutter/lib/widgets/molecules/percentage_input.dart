/// Percentage Input Widget
/// 
/// A specialized input for entering percentage values with validation.
/// 
/// Features:
/// - Percentage symbol
/// - Range validation (0-100)
/// - Slider integration
/// - Decimal support
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppPercentageInput(
///   initialValue: 75.5,
///   onChanged: (value) => print('$value%'),
/// )
/// ```

library;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AppPercentageInput extends StatefulWidget {
  final double? initialValue;
  final ValueChanged<double>? onChanged;
  final String? label;
  final String? hint;
  final double min;
  final double max;
  final int decimals;
  final bool showSlider;
  final bool enabled;
  final String? errorText;

  const AppPercentageInput({
    super.key,
    this.initialValue,
    this.onChanged,
    this.label,
    this.hint,
    this.min = 0,
    this.max = 100,
    this.decimals = 0,
    this.showSlider = false,
    this.enabled = true,
    this.errorText,
  });

  @override
  State<AppPercentageInput> createState() => _AppPercentageInputState();
}

class _AppPercentageInputState extends State<AppPercentageInput> {
  late TextEditingController _controller;
  late double _sliderValue;

  @override
  void initState() {
    super.initState();
    _sliderValue = (widget.initialValue ?? 0).clamp(widget.min, widget.max);
    _controller = TextEditingController(
      text: widget.initialValue != null
          ? widget.initialValue!.toStringAsFixed(widget.decimals)
          : '',
    );
    _controller.addListener(_onTextChanged);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTextChanged() {
    final text = _controller.text;
    if (text.isEmpty) {
      _sliderValue = widget.min;
      widget.onChanged?.call(widget.min);
      return;
    }

    final value = double.tryParse(text);
    if (value != null) {
      setState(() {
        _sliderValue = value.clamp(widget.min, widget.max);
      });
      widget.onChanged?.call(value);
    }
  }

  void _onSliderChanged(double value) {
    setState(() {
      _sliderValue = value;
      _controller.text = value.toStringAsFixed(widget.decimals);
    });
    widget.onChanged?.call(value);
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
          keyboardType: TextInputType.numberWithOptions(
            decimal: widget.decimals > 0,
          ),
          inputFormatters: [
            FilteringTextInputFormatter.allow(
              RegExp(widget.decimals > 0 ? r'^\d*\.?\d*' : r'^\d*'),
            ),
          ],
          decoration: InputDecoration(
            labelText: widget.label,
            hintText: widget.hint ?? '0',
            suffixText: '%',
            border: const OutlineInputBorder(),
            prefixIcon: const Icon(Icons.percent),
            errorText: widget.errorText,
            helperText: '${widget.min}% - ${widget.max}%',
          ),
        ),

        if (widget.showSlider) ...[
          const SizedBox(height: 16),
          Row(
            children: [
              Text(
                '${widget.min.toInt()}%',
                style: theme.textTheme.bodySmall,
              ),
              Expanded(
                child: Slider(
                  value: _sliderValue,
                  min: widget.min,
                  max: widget.max,
                  divisions: widget.decimals == 0
                      ? (widget.max - widget.min).toInt()
                      : null,
                  label: '${_sliderValue.toStringAsFixed(widget.decimals)}%',
                  onChanged: widget.enabled ? _onSliderChanged : null,
                ),
              ),
              Text(
                '${widget.max.toInt()}%',
                style: theme.textTheme.bodySmall,
              ),
            ],
          ),
        ],
      ],
    );
  }
}
