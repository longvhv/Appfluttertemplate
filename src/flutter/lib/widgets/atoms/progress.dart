import 'package:flutter/material.dart';

/// Progress bar widget for showing progress
class AppProgressBar extends StatelessWidget {
  final double value; // 0.0 to 1.0
  final Color? color;
  final Color? backgroundColor;
  final double height;
  final bool showLabel;
  final String? label;
  final ProgressBarVariant variant;

  const AppProgressBar({
    Key? key,
    required this.value,
    this.color,
    this.backgroundColor,
    this.height = 8,
    this.showLabel = false,
    this.label,
    this.variant = ProgressBarVariant.primary,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final progressColor = color ?? _getColor(theme);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (showLabel || label != null) ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (label != null)
                Text(
                  label!,
                  style: theme.textTheme.bodySmall,
                ),
              Text(
                '${(value * 100).toInt()}%',
                style: theme.textTheme.bodySmall?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
        ],
        ClipRRect(
          borderRadius: BorderRadius.circular(height / 2),
          child: LinearProgressIndicator(
            value: value.clamp(0.0, 1.0),
            backgroundColor: backgroundColor ?? Colors.grey.shade200,
            valueColor: AlwaysStoppedAnimation<Color>(progressColor),
            minHeight: height,
          ),
        ),
      ],
    );
  }

  Color _getColor(ThemeData theme) {
    switch (variant) {
      case ProgressBarVariant.primary:
        return theme.colorScheme.primary;
      case ProgressBarVariant.secondary:
        return theme.colorScheme.secondary;
      case ProgressBarVariant.success:
        return Colors.green;
      case ProgressBarVariant.warning:
        return Colors.orange;
      case ProgressBarVariant.error:
        return Colors.red;
    }
  }
}

enum ProgressBarVariant {
  primary,
  secondary,
  success,
  warning,
  error,
}

/// Circular progress indicator
class AppSpinner extends StatelessWidget {
  final double size;
  final Color? color;
  final double strokeWidth;

  const AppSpinner({
    Key? key,
    this.size = 24,
    this.color,
    this.strokeWidth = 3,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CircularProgressIndicator(
        strokeWidth: strokeWidth,
        valueColor: AlwaysStoppedAnimation<Color>(
          color ?? Theme.of(context).colorScheme.primary,
        ),
      ),
    );
  }
}
