import 'package:flutter/material.dart';

/// Slider widget matching web app design
class AppSlider extends StatelessWidget {
  final double value;
  final ValueChanged<double>? onChanged;
  final double min;
  final double max;
  final int? divisions;
  final String? label;
  final Color? activeColor;
  final Color? inactiveColor;
  final bool showValue;

  const AppSlider({
    Key? key,
    required this.value,
    this.onChanged,
    this.min = 0.0,
    this.max = 100.0,
    this.divisions,
    this.label,
    this.activeColor,
    this.inactiveColor,
    this.showValue = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null || showValue) ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (label != null)
                Text(
                  label!,
                  style: theme.textTheme.bodyMedium,
                ),
              if (showValue)
                Text(
                  value.toStringAsFixed(0),
                  style: theme.textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8),
        ],
        SliderTheme(
          data: SliderThemeData(
            activeTrackColor: activeColor ?? theme.colorScheme.primary,
            inactiveTrackColor: inactiveColor ?? Colors.grey.shade300,
            thumbColor: activeColor ?? theme.colorScheme.primary,
            overlayColor: (activeColor ?? theme.colorScheme.primary).withOpacity(0.2),
            trackHeight: 4,
          ),
          child: Slider(
            value: value.clamp(min, max),
            onChanged: onChanged,
            min: min,
            max: max,
            divisions: divisions,
            label: value.toStringAsFixed(0),
          ),
        ),
      ],
    );
  }
}

/// Range slider widget
class AppRangeSlider extends StatelessWidget {
  final RangeValues values;
  final ValueChanged<RangeValues>? onChanged;
  final double min;
  final double max;
  final int? divisions;
  final String? label;
  final Color? activeColor;
  final Color? inactiveColor;
  final bool showValues;

  const AppRangeSlider({
    Key? key,
    required this.values,
    this.onChanged,
    this.min = 0.0,
    this.max = 100.0,
    this.divisions,
    this.label,
    this.activeColor,
    this.inactiveColor,
    this.showValues = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null || showValues) ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (label != null)
                Text(
                  label!,
                  style: theme.textTheme.bodyMedium,
                ),
              if (showValues)
                Text(
                  '${values.start.toStringAsFixed(0)} - ${values.end.toStringAsFixed(0)}',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8),
        ],
        SliderTheme(
          data: SliderThemeData(
            activeTrackColor: activeColor ?? theme.colorScheme.primary,
            inactiveTrackColor: inactiveColor ?? Colors.grey.shade300,
            thumbColor: activeColor ?? theme.colorScheme.primary,
            overlayColor: (activeColor ?? theme.colorScheme.primary).withOpacity(0.2),
            trackHeight: 4,
          ),
          child: RangeSlider(
            values: RangeValues(
              values.start.clamp(min, max),
              values.end.clamp(min, max),
            ),
            onChanged: onChanged,
            min: min,
            max: max,
            divisions: divisions,
            labels: RangeLabels(
              values.start.toStringAsFixed(0),
              values.end.toStringAsFixed(0),
            ),
          ),
        ),
      ],
    );
  }
}
