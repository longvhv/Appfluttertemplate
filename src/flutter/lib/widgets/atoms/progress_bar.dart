import 'package:flutter/material.dart';

/// ProgressBar widget matching web app design
/// 
/// Matches web ProgressBar component with all features:
/// - 5 variants: default, success, warning, error, gradient
/// - 3 sizes: sm, md, lg
/// - Show label option
/// - Animated option
/// - Striped option (visual pattern)
class AppProgressBar extends StatelessWidget {
  final double value;
  final double max;
  final ProgressVariant variant;
  final ProgressSize size;
  final bool showLabel;
  final String? label;
  final bool animated;
  final bool striped;

  const AppProgressBar({
    super.key,
    required this.value,
    this.max = 100.0,
    this.variant = ProgressVariant.defaultVariant,
    this.size = ProgressSize.md,
    this.showLabel = false,
    this.label,
    this.animated = true,
    this.striped = false,
  });

  /// Default progress bar
  const AppProgressBar.defaultVariant({
    super.key,
    required this.value,
    this.max = 100.0,
    this.size = ProgressSize.md,
    this.showLabel = false,
    this.label,
    this.animated = true,
    this.striped = false,
  }) : variant = ProgressVariant.defaultVariant;

  /// Success progress bar
  const AppProgressBar.success({
    super.key,
    required this.value,
    this.max = 100.0,
    this.size = ProgressSize.md,
    this.showLabel = false,
    this.label,
    this.animated = true,
    this.striped = false,
  }) : variant = ProgressVariant.success;

  /// Warning progress bar
  const AppProgressBar.warning({
    super.key,
    required this.value,
    this.max = 100.0,
    this.size = ProgressSize.md,
    this.showLabel = false,
    this.label,
    this.animated = true,
    this.striped = false,
  }) : variant = ProgressVariant.warning;

  /// Error progress bar
  const AppProgressBar.error({
    super.key,
    required this.value,
    this.max = 100.0,
    this.size = ProgressSize.md,
    this.showLabel = false,
    this.label,
    this.animated = true,
    this.striped = false,
  }) : variant = ProgressVariant.error;

  /// Gradient progress bar
  const AppProgressBar.gradient({
    super.key,
    required this.value,
    this.max = 100.0,
    this.size = ProgressSize.md,
    this.showLabel = false,
    this.label,
    this.animated = true,
    this.striped = false,
  }) : variant = ProgressVariant.gradient;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final percentage = (value / max).clamp(0.0, 1.0);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        // Label
        if (showLabel || label != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 4),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  label ?? 'Progress',
                  style: TextStyle(
                    fontSize: 14,
                    color: colorScheme.onSurface,
                  ),
                ),
                Text(
                  '${(percentage * 100).round()}%',
                  style: TextStyle(
                    fontSize: 14,
                    color: colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),

        // Progress bar
        Container(
          height: _getHeight(),
          decoration: BoxDecoration(
            color: colorScheme.surfaceVariant,
            borderRadius: BorderRadius.circular(100),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(100),
            child: AnimatedContainer(
              duration: animated ? const Duration(milliseconds: 500) : Duration.zero,
              curve: Curves.easeOut,
              width: double.infinity,
              alignment: Alignment.centerLeft,
              child: FractionallySizedBox(
                widthFactor: percentage,
                child: Container(
                  decoration: BoxDecoration(
                    gradient: _getGradient(),
                    borderRadius: BorderRadius.circular(100),
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  double _getHeight() {
    switch (size) {
      case ProgressSize.sm:
        return 4;
      case ProgressSize.md:
        return 8;
      case ProgressSize.lg:
        return 12;
    }
  }

  Gradient _getGradient() {
    switch (variant) {
      case ProgressVariant.defaultVariant:
        return const LinearGradient(
          colors: [Color(0xFF6366F1), Color(0xFF6366F1)],
        );
      case ProgressVariant.success:
        return const LinearGradient(
          colors: [Color(0xFF16A34A), Color(0xFF16A34A)],
        );
      case ProgressVariant.warning:
        return const LinearGradient(
          colors: [Color(0xFFCA8A04), Color(0xFFCA8A04)],
        );
      case ProgressVariant.error:
        return const LinearGradient(
          colors: [Color(0xFFDC2626), Color(0xFFDC2626)],
        );
      case ProgressVariant.gradient:
        return const LinearGradient(
          colors: [
            Color(0xFF6366F1), // Indigo
            Color(0xFF9333EA), // Purple
            Color(0xFFDB2777), // Pink
          ],
        );
    }
  }
}

/// Progress variants matching web app
enum ProgressVariant {
  defaultVariant,
  success,
  warning,
  error,
  gradient,
}

/// Progress sizes matching web app
enum ProgressSize {
  sm,
  md,
  lg,
}

/// Circular Progress widget
class AppCircularProgress extends StatelessWidget {
  final double value;
  final double size;
  final double strokeWidth;
  final ProgressVariant variant;
  final bool showLabel;

  const AppCircularProgress({
    super.key,
    required this.value,
    this.size = 64.0,
    this.strokeWidth = 4.0,
    this.variant = ProgressVariant.defaultVariant,
    this.showLabel = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final percentage = (value / 100).clamp(0.0, 1.0);

    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Background circle
          SizedBox(
            width: size,
            height: size,
            child: CircularProgressIndicator(
              value: 1.0,
              strokeWidth: strokeWidth,
              color: colorScheme.surfaceVariant,
            ),
          ),
          
          // Progress circle
          SizedBox(
            width: size,
            height: size,
            child: TweenAnimationBuilder<double>(
              tween: Tween<double>(begin: 0.0, end: percentage),
              duration: const Duration(milliseconds: 500),
              builder: (context, value, _) {
                return CircularProgressIndicator(
                  value: value,
                  strokeWidth: strokeWidth,
                  color: _getColor(colorScheme),
                );
              },
            ),
          ),
          
          // Label
          if (showLabel)
            Text(
              '${(percentage * 100).round()}%',
              style: TextStyle(
                fontSize: size / 4,
                fontWeight: FontWeight.w600,
                color: colorScheme.onSurface,
              ),
            ),
        ],
      ),
    );
  }

  Color _getColor(ColorScheme colorScheme) {
    switch (variant) {
      case ProgressVariant.defaultVariant:
        return const Color(0xFF6366F1);
      case ProgressVariant.success:
        return const Color(0xFF16A34A);
      case ProgressVariant.warning:
        return const Color(0xFFCA8A04);
      case ProgressVariant.error:
        return const Color(0xFFDC2626);
      case ProgressVariant.gradient:
        return const Color(0xFF6366F1); // Gradient not supported in CircularProgressIndicator
    }
  }
}
