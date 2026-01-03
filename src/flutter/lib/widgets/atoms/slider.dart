import 'package:flutter/material.dart';

/// Slider widget matching web app design
/// 
/// Matches web Slider component with all features:
/// - 3 sizes: sm, md, lg
/// - Min/max/step support
/// - Show value option
/// - Show min/max labels
/// - Disabled state
/// - Custom colors
/// - Marks support
class AppSlider extends StatelessWidget {
  final double value;
  final ValueChanged<double>? onChanged;
  final double min;
  final double max;
  final double step;
  final bool disabled;
  final SliderSize size;
  final bool showValue;
  final bool showMinMax;
  final Color? color;
  final String Function(double)? formatValue;
  final List<SliderMark>? marks;

  const AppSlider({
    super.key,
    required this.value,
    this.onChanged,
    this.min = 0.0,
    this.max = 100.0,
    this.step = 1.0,
    this.disabled = false,
    this.size = SliderSize.md,
    this.showValue = false,
    this.showMinMax = false,
    this.color,
    this.formatValue,
    this.marks,
  });

  /// Small slider
  const AppSlider.sm({
    super.key,
    required this.value,
    this.onChanged,
    this.min = 0.0,
    this.max = 100.0,
    this.step = 1.0,
    this.disabled = false,
    this.showValue = false,
    this.showMinMax = false,
    this.color,
    this.formatValue,
    this.marks,
  }) : size = SliderSize.sm;

  /// Medium slider
  const AppSlider.md({
    super.key,
    required this.value,
    this.onChanged,
    this.min = 0.0,
    this.max = 100.0,
    this.step = 1.0,
    this.disabled = false,
    this.showValue = false,
    this.showMinMax = false,
    this.color,
    this.formatValue,
    this.marks,
  }) : size = SliderSize.md;

  /// Large slider
  const AppSlider.lg({
    super.key,
    required this.value,
    this.onChanged,
    this.min = 0.0,
    this.max = 100.0,
    this.step = 1.0,
    this.disabled = false,
    this.showValue = false,
    this.showMinMax = false,
    this.color,
    this.formatValue,
    this.marks,
  }) : size = SliderSize.lg;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        // Value display
        if (showValue)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  formatValue?.call(value) ?? value.toStringAsFixed(0),
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: colorScheme.onSurface,
                  ),
                ),
              ],
            ),
          ),

        // Slider
        SliderTheme(
          data: SliderThemeData(
            activeTrackColor: disabled
                ? (color ?? const Color(0xFF6366F1)).withOpacity(0.5)
                : (color ?? const Color(0xFF6366F1)),
            inactiveTrackColor: colorScheme.surfaceVariant,
            thumbColor: disabled
                ? (color ?? const Color(0xFF6366F1)).withOpacity(0.5)
                : (color ?? const Color(0xFF6366F1)),
            overlayColor: (color ?? const Color(0xFF6366F1)).withOpacity(0.2),
            trackHeight: _getTrackHeight(),
            thumbShape: RoundSliderThumbShape(enabledThumbRadius: _getThumbRadius()),
            overlayShape: RoundSliderOverlayShape(overlayRadius: _getThumbRadius() * 2),
          ),
          child: Slider(
            value: value.clamp(min, max),
            onChanged: disabled ? null : onChanged,
            min: min,
            max: max,
            divisions: ((max - min) / step).round(),
          ),
        ),

        // Min/Max labels
        if (showMinMax)
          Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  formatValue?.call(min) ?? min.toStringAsFixed(0),
                  style: TextStyle(
                    fontSize: 12,
                    color: colorScheme.onSurfaceVariant,
                  ),
                ),
                Text(
                  formatValue?.call(max) ?? max.toStringAsFixed(0),
                  style: TextStyle(
                    fontSize: 12,
                    color: colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),

        // Marks
        if (marks != null && marks!.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: marks!.map((mark) {
                return Text(
                  mark.label,
                  style: TextStyle(
                    fontSize: 10,
                    color: colorScheme.onSurfaceVariant,
                  ),
                );
              }).toList(),
            ),
          ),
      ],
    );
  }

  double _getTrackHeight() {
    switch (size) {
      case SliderSize.sm:
        return 4;
      case SliderSize.md:
        return 8;
      case SliderSize.lg:
        return 12;
    }
  }

  double _getThumbRadius() {
    switch (size) {
      case SliderSize.sm:
        return 6;
      case SliderSize.md:
        return 8;
      case SliderSize.lg:
        return 10;
    }
  }
}

/// Slider sizes matching web app
enum SliderSize {
  sm,
  md,
  lg,
}

/// Slider mark
class SliderMark {
  final double value;
  final String label;

  const SliderMark({
    required this.value,
    required this.label,
  });
}

/// Range slider widget (two thumbs)
class AppRangeSlider extends StatelessWidget {
  final RangeValues value;
  final ValueChanged<RangeValues>? onChanged;
  final double min;
  final double max;
  final double step;
  final bool disabled;
  final SliderSize size;
  final bool showValue;
  final bool showMinMax;
  final Color? color;

  const AppRangeSlider({
    super.key,
    required this.value,
    this.onChanged,
    this.min = 0.0,
    this.max = 100.0,
    this.step = 1.0,
    this.disabled = false,
    this.size = SliderSize.md,
    this.showValue = false,
    this.showMinMax = false,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        // Value display
        if (showValue)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  value.start.toStringAsFixed(0),
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: colorScheme.onSurface,
                  ),
                ),
                Text(
                  value.end.toStringAsFixed(0),
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: colorScheme.onSurface,
                  ),
                ),
              ],
            ),
          ),

        // Range Slider
        SliderTheme(
          data: SliderThemeData(
            activeTrackColor: disabled
                ? (color ?? const Color(0xFF6366F1)).withOpacity(0.5)
                : (color ?? const Color(0xFF6366F1)),
            inactiveTrackColor: colorScheme.surfaceVariant,
            thumbColor: disabled
                ? (color ?? const Color(0xFF6366F1)).withOpacity(0.5)
                : (color ?? const Color(0xFF6366F1)),
            overlayColor: (color ?? const Color(0xFF6366F1)).withOpacity(0.2),
            trackHeight: _getTrackHeight(),
            thumbShape: RoundSliderThumbShape(enabledThumbRadius: _getThumbRadius()),
            overlayShape: RoundSliderOverlayShape(overlayRadius: _getThumbRadius() * 2),
          ),
          child: RangeSlider(
            values: value,
            onChanged: disabled ? null : onChanged,
            min: min,
            max: max,
            divisions: ((max - min) / step).round(),
          ),
        ),

        // Min/Max labels
        if (showMinMax)
          Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  min.toStringAsFixed(0),
                  style: TextStyle(
                    fontSize: 12,
                    color: colorScheme.onSurfaceVariant,
                  ),
                ),
                Text(
                  max.toStringAsFixed(0),
                  style: TextStyle(
                    fontSize: 12,
                    color: colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  double _getTrackHeight() {
    switch (size) {
      case SliderSize.sm:
        return 4;
      case SliderSize.md:
        return 8;
      case SliderSize.lg:
        return 12;
    }
  }

  double _getThumbRadius() {
    switch (size) {
      case SliderSize.sm:
        return 6;
      case SliderSize.md:
        return 8;
      case SliderSize.lg:
        return 10;
    }
  }
}