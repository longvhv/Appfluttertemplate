import 'package:flutter/material.dart';

/// Chip widget matching web app design
/// 
/// Matches web Chip component with all features:
/// - 6 variants: default, primary, success, warning, error, info
/// - 3 sizes: sm, md, lg
/// - Icon support
/// - Avatar support
/// - Remove button
/// - Clickable
class AppChip extends StatelessWidget {
  final String label;
  final ChipVariant variant;
  final ChipSize size;
  final VoidCallback? onRemove;
  final IconData? icon;
  final String? avatar;
  final bool clickable;
  final VoidCallback? onClick;

  const AppChip({
    super.key,
    required this.label,
    this.variant = ChipVariant.defaultVariant,
    this.size = ChipSize.md,
    this.onRemove,
    this.icon,
    this.avatar,
    this.clickable = false,
    this.onClick,
  });

  /// Default chip
  const AppChip.defaultVariant({
    super.key,
    required this.label,
    this.size = ChipSize.md,
    this.onRemove,
    this.icon,
    this.avatar,
    this.clickable = false,
    this.onClick,
  }) : variant = ChipVariant.defaultVariant;

  /// Primary chip
  const AppChip.primary({
    super.key,
    required this.label,
    this.size = ChipSize.md,
    this.onRemove,
    this.icon,
    this.avatar,
    this.clickable = false,
    this.onClick,
  }) : variant = ChipVariant.primary;

  /// Success chip
  const AppChip.success({
    super.key,
    required this.label,
    this.size = ChipSize.md,
    this.onRemove,
    this.icon,
    this.avatar,
    this.clickable = false,
    this.onClick,
  }) : variant = ChipVariant.success;

  /// Warning chip
  const AppChip.warning({
    super.key,
    required this.label,
    this.size = ChipSize.md,
    this.onRemove,
    this.icon,
    this.avatar,
    this.clickable = false,
    this.onClick,
  }) : variant = ChipVariant.warning;

  /// Error chip
  const AppChip.error({
    super.key,
    required this.label,
    this.size = ChipSize.md,
    this.onRemove,
    this.icon,
    this.avatar,
    this.clickable = false,
    this.onClick,
  }) : variant = ChipVariant.error;

  /// Info chip
  const AppChip.info({
    super.key,
    required this.label,
    this.size = ChipSize.md,
    this.onRemove,
    this.icon,
    this.avatar,
    this.clickable = false,
    this.onClick,
  }) : variant = ChipVariant.info;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Material(
      color: _getBackgroundColor(colorScheme),
      borderRadius: BorderRadius.circular(100),
      child: InkWell(
        onTap: clickable || onClick != null ? onClick : null,
        borderRadius: BorderRadius.circular(100),
        child: Container(
          padding: _getPadding(),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (avatar != null) ...[
                CircleAvatar(
                  radius: _getAvatarSize() / 2,
                  backgroundImage: NetworkImage(avatar!),
                ),
                SizedBox(width: _getGap()),
              ],
              if (icon != null) ...[
                Icon(
                  icon,
                  size: _getIconSize(),
                  color: _getTextColor(colorScheme),
                ),
                SizedBox(width: _getGap()),
              ],
              Text(
                label,
                style: TextStyle(
                  fontSize: _getFontSize(),
                  fontWeight: FontWeight.w500,
                  color: _getTextColor(colorScheme),
                ),
              ),
              if (onRemove != null) ...[
                SizedBox(width: _getGap()),
                GestureDetector(
                  onTap: onRemove,
                  child: Icon(
                    Icons.close,
                    size: _getIconSize(),
                    color: _getTextColor(colorScheme),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Color _getBackgroundColor(ColorScheme colorScheme) {
    switch (variant) {
      case ChipVariant.defaultVariant:
        return const Color(0xFFF3F4F6); // Gray-100
      case ChipVariant.primary:
        return const Color(0xFFEEF2FF); // Indigo-100
      case ChipVariant.success:
        return const Color(0xFFDCFCE7); // Green-100
      case ChipVariant.warning:
        return const Color(0xFFFEF3C7); // Yellow-100
      case ChipVariant.error:
        return const Color(0xFFFEE2E2); // Red-100
      case ChipVariant.info:
        return const Color(0xFFDBEAFE); // Blue-100
    }
  }

  Color _getTextColor(ColorScheme colorScheme) {
    switch (variant) {
      case ChipVariant.defaultVariant:
        return const Color(0xFF374151); // Gray-700
      case ChipVariant.primary:
        return const Color(0xFF4338CA); // Indigo-700
      case ChipVariant.success:
        return const Color(0xFF15803D); // Green-700
      case ChipVariant.warning:
        return const Color(0xFFA16207); // Yellow-700
      case ChipVariant.error:
        return const Color(0xFFB91C1C); // Red-700
      case ChipVariant.info:
        return const Color(0xFF1D4ED8); // Blue-700
    }
  }

  EdgeInsets _getPadding() {
    switch (size) {
      case ChipSize.sm:
        return const EdgeInsets.symmetric(horizontal: 8, vertical: 2);
      case ChipSize.md:
        return const EdgeInsets.symmetric(horizontal: 12, vertical: 4);
      case ChipSize.lg:
        return const EdgeInsets.symmetric(horizontal: 16, vertical: 8);
    }
  }

  double _getFontSize() {
    switch (size) {
      case ChipSize.sm:
        return 12;
      case ChipSize.md:
        return 14;
      case ChipSize.lg:
        return 16;
    }
  }

  double _getIconSize() {
    switch (size) {
      case ChipSize.sm:
        return 12;
      case ChipSize.md:
        return 16;
      case ChipSize.lg:
        return 20;
    }
  }

  double _getAvatarSize() {
    switch (size) {
      case ChipSize.sm:
        return 16;
      case ChipSize.md:
        return 20;
      case ChipSize.lg:
        return 24;
    }
  }

  double _getGap() {
    switch (size) {
      case ChipSize.sm:
        return 4;
      case ChipSize.md:
        return 6;
      case ChipSize.lg:
        return 8;
    }
  }
}

/// Chip variants matching web app
enum ChipVariant {
  defaultVariant,
  primary,
  success,
  warning,
  error,
  info,
}

/// Chip sizes matching web app
enum ChipSize {
  sm,
  md,
  lg,
}