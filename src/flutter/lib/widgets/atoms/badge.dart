import 'package:flutter/material.dart';

/// Badge widget matching web app design
/// 
/// Matches web Badge component with all features:
/// - 6 variants: default, primary, success, warning, error, info
/// - 3 sizes: sm, md, lg
/// - Dot indicator support
/// - Standalone or wrapped around widget
class AppBadge extends StatelessWidget {
  final String label;
  final BadgeVariant variant;
  final BadgeSize size;
  final bool dot;
  final Color? backgroundColor;
  final Color? textColor;

  const AppBadge({
    super.key,
    required this.label,
    this.variant = BadgeVariant.defaultVariant,
    this.size = BadgeSize.md,
    this.dot = false,
    this.backgroundColor,
    this.textColor,
  });

  /// Default badge variant
  const AppBadge.defaultVariant({
    super.key,
    required this.label,
    this.size = BadgeSize.md,
    this.dot = false,
    this.backgroundColor,
    this.textColor,
  })  : variant = BadgeVariant.defaultVariant;

  /// Primary badge variant
  const AppBadge.primary({
    super.key,
    required this.label,
    this.size = BadgeSize.md,
    this.dot = false,
    this.backgroundColor,
    this.textColor,
  })  : variant = BadgeVariant.primary;

  /// Success badge variant
  const AppBadge.success({
    super.key,
    required this.label,
    this.size = BadgeSize.md,
    this.dot = false,
    this.backgroundColor,
    this.textColor,
  })  : variant = BadgeVariant.success;

  /// Warning badge variant
  const AppBadge.warning({
    super.key,
    required this.label,
    this.size = BadgeSize.md,
    this.dot = false,
    this.backgroundColor,
    this.textColor,
  })  : variant = BadgeVariant.warning;

  /// Error badge variant
  const AppBadge.error({
    super.key,
    required this.label,
    this.size = BadgeSize.md,
    this.dot = false,
    this.backgroundColor,
    this.textColor,
  })  : variant = BadgeVariant.error;

  /// Info badge variant
  const AppBadge.info({
    super.key,
    required this.label,
    this.size = BadgeSize.md,
    this.dot = false,
    this.backgroundColor,
    this.textColor,
  })  : variant = BadgeVariant.info;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Container(
      padding: _getPadding(),
      decoration: BoxDecoration(
        color: backgroundColor ?? _getBackgroundColor(colorScheme),
        borderRadius: BorderRadius.circular(100),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (dot) ...[
            Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(
                color: _getDotColor(colorScheme),
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 6),
          ],
          Text(
            label,
            style: TextStyle(
              color: textColor ?? _getTextColor(colorScheme),
              fontSize: _getFontSize(),
              fontWeight: FontWeight.w500,
              height: 1,
            ),
          ),
        ],
      ),
    );
  }

  Color _getBackgroundColor(ColorScheme colorScheme) {
    switch (variant) {
      case BadgeVariant.defaultVariant:
        return colorScheme.surfaceVariant;
      case BadgeVariant.primary:
        return const Color(0xFFEEF2FF); // Indigo-100
      case BadgeVariant.success:
        return const Color(0xFFDCFCE7); // Green-100
      case BadgeVariant.warning:
        return const Color(0xFFFFEDD5); // Orange-100
      case BadgeVariant.error:
        return const Color(0xFFFEE2E2); // Red-100
      case BadgeVariant.info:
        return const Color(0xFFDBEAFE); // Blue-100
    }
  }

  Color _getTextColor(ColorScheme colorScheme) {
    switch (variant) {
      case BadgeVariant.defaultVariant:
        return colorScheme.onSurfaceVariant;
      case BadgeVariant.primary:
        return const Color(0xFF4338CA); // Indigo-700
      case BadgeVariant.success:
        return const Color(0xFF15803D); // Green-700
      case BadgeVariant.warning:
        return const Color(0xFFC2410C); // Orange-700
      case BadgeVariant.error:
        return const Color(0xFFB91C1C); // Red-700
      case BadgeVariant.info:
        return const Color(0xFF1D4ED8); // Blue-700
    }
  }

  Color _getDotColor(ColorScheme colorScheme) {
    switch (variant) {
      case BadgeVariant.defaultVariant:
        return colorScheme.onSurfaceVariant;
      case BadgeVariant.primary:
        return const Color(0xFF6366F1); // Indigo-500
      case BadgeVariant.success:
        return const Color(0xFF22C55E); // Green-500
      case BadgeVariant.warning:
        return const Color(0xFFF97316); // Orange-500
      case BadgeVariant.error:
        return const Color(0xFFEF4444); // Red-500
      case BadgeVariant.info:
        return const Color(0xFF3B82F6); // Blue-500
    }
  }

  EdgeInsets _getPadding() {
    switch (size) {
      case BadgeSize.sm:
        return const EdgeInsets.symmetric(horizontal: 8, vertical: 2);
      case BadgeSize.md:
        return const EdgeInsets.symmetric(horizontal: 10, vertical: 4);
      case BadgeSize.lg:
        return const EdgeInsets.symmetric(horizontal: 12, vertical: 6);
    }
  }

  double _getFontSize() {
    switch (size) {
      case BadgeSize.sm:
        return 12;
      case BadgeSize.md:
        return 14;
      case BadgeSize.lg:
        return 16;
    }
  }
}

/// Badge variants matching web app
enum BadgeVariant {
  defaultVariant,
  primary,
  success,
  warning,
  error,
  info,
}

/// Badge sizes matching web app
enum BadgeSize {
  sm,
  md,
  lg,
}