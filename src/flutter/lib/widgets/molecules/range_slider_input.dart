/// Range Slider Input Widget
/// 
/// A specialized input for selecting a range of values with dual sliders.
/// 
/// Features:
/// - Dual slider controls
/// - Min/Max value display
/// - Custom range limits
/// - Step support
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppRangeSliderInput(
///   min: 0,
///   max: 100,
///   onChanged: (start, end) => print('$start - $end'),
/// )
/// ```

library;

import 'package:flutter/material.dart';

class AppRangeSliderInput extends StatefulWidget {
  final double min;
  final double max;
  final double? initialStart;
  final double? initialEnd;
  final ValueChanged<RangeValues>? onChanged;
  final String? label;
  final int? divisions;
  final bool showValues;
  final bool enabled;
  final String? prefix;
  final String? suffix;

  const AppRangeSliderInput({
    super.key,
    required this.min,
    required this.max,
    this.initialStart,
    this.initialEnd,
    this.onChanged,
    this.label,
    this.divisions,
    this.showValues = true,
    this.enabled = true,
    this.prefix,
    this.suffix,
  });

  @override
  State<AppRangeSliderInput> createState() => _AppRangeSliderInputState();
}

class _AppRangeSliderInputState extends State<AppRangeSliderInput> {
  late RangeValues _currentRange;

  @override
  void initState() {
    super.initState();
    _currentRange = RangeValues(
      widget.initialStart ?? widget.min,
      widget.initialEnd ?? widget.max,
    );
  }

  void _onChanged(RangeValues values) {
    setState(() {
      _currentRange = values;
    });
    widget.onChanged?.call(values);
  }

  String _formatValue(double value) {
    final prefix = widget.prefix ?? '';
    final suffix = widget.suffix ?? '';
    final valueStr = widget.divisions != null
        ? value.toInt().toString()
        : value.toStringAsFixed(1);
    return '$prefix$valueStr$suffix';
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

        // Values display
        if (widget.showValues)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  _formatValue(_currentRange.start),
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onPrimaryContainer,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Text(
                'to',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  _formatValue(_currentRange.end),
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onPrimaryContainer,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),

        const SizedBox(height: 8),

        // Range Slider
        RangeSlider(
          values: _currentRange,
          min: widget.min,
          max: widget.max,
          divisions: widget.divisions,
          labels: RangeLabels(
            _formatValue(_currentRange.start),
            _formatValue(_currentRange.end),
          ),
          onChanged: widget.enabled ? _onChanged : null,
        ),

        // Min/Max labels
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              _formatValue(widget.min),
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
            Text(
              _formatValue(widget.max),
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
