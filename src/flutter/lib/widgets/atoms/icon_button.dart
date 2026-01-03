import 'package:flutter/material.dart';

/// IconButton widget matching web app design
/// 
/// Matches web IconButton component with all features:
/// - 5 variants: default, primary, secondary, ghost, danger
/// - 4 sizes: sm, md, lg, xl
/// - Loading state
/// - Disabled state
/// - Tooltip support
/// - Circular shape
class AppIconButton extends StatelessWidget {
  final IconData icon;
  final IconButtonVariant variant;
  final IconButtonSize size;
  final bool disabled;
  final bool loading;
  final VoidCallback? onPressed;
  final String? tooltip;

  const AppIconButton({
    super.key,
    required this.icon,
    this.variant = IconButtonVariant.defaultVariant,
    this.size = IconButtonSize.md,
    this.disabled = false,
    this.loading = false,
    this.onPressed,
    this.tooltip,
  });

  /// Default icon button
  const AppIconButton.defaultVariant({
    super.key,
    required this.icon,
    this.size = IconButtonSize.md,
    this.disabled = false,
    this.loading = false,
    this.onPressed,
    this.tooltip,
  }) : variant = IconButtonVariant.defaultVariant;

  /// Primary icon button
  const AppIconButton.primary({
    super.key,
    required this.icon,
    this.size = IconButtonSize.md,
    this.disabled = false,
    this.loading = false,
    this.onPressed,
    this.tooltip,
  }) : variant = IconButtonVariant.primary;

  /// Secondary icon button
  const AppIconButton.secondary({
    super.key,
    required this.icon,
    this.size = IconButtonSize.md,
    this.disabled = false,
    this.loading = false,
    this.onPressed,
    this.tooltip,
  }) : variant = IconButtonVariant.secondary;

  /// Ghost icon button
  const AppIconButton.ghost({
    super.key,
    required this.icon,
    this.size = IconButtonSize.md,
    this.disabled = false,
    this.loading = false,
    this.onPressed,
    this.tooltip,
  }) : variant = IconButtonVariant.ghost;

  /// Danger icon button
  const AppIconButton.danger({
    super.key,
    required this.icon,
    this.size = IconButtonSize.md,
    this.disabled = false,
    this.loading = false,
    this.onPressed,
    this.tooltip,
  }) : variant = IconButtonVariant.danger;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    final button = Material(
      color: _getBackgroundColor(colorScheme),
      shape: const CircleBorder(),
      child: InkWell(
        onTap: disabled || loading || onPressed == null ? null : onPressed,
        customBorder: const CircleBorder(),
        child: Container(
          width: _getSize(),
          height: _getSize(),
          alignment: Alignment.center,
          child: loading
              ? SizedBox(
                  width: _getIconSize() * 0.6,
                  height: _getIconSize() * 0.6,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation(_getIconColor(colorScheme)),
                  ),
                )
              : Icon(
                  icon,
                  size: _getIconSize(),
                  color: _getIconColor(colorScheme),
                ),
        ),
      ),
    );

    if (tooltip != null) {
      return Tooltip(
        message: tooltip!,
        child: button,
      );
    }

    return button;
  }

  Color _getBackgroundColor(ColorScheme colorScheme) {
    if (disabled) {
      return colorScheme.surfaceVariant.withOpacity(0.5);
    }

    switch (variant) {
      case IconButtonVariant.defaultVariant:
        return colorScheme.surfaceVariant;
      case IconButtonVariant.primary:
        return const Color(0xFF6366F1);
      case IconButtonVariant.secondary:
        return colorScheme.surface;
      case IconButtonVariant.ghost:
        return Colors.transparent;
      case IconButtonVariant.danger:
        return const Color(0xFFDC2626);
    }
  }

  Color _getIconColor(ColorScheme colorScheme) {
    if (disabled) {
      return colorScheme.onSurface.withOpacity(0.5);
    }

    switch (variant) {
      case IconButtonVariant.defaultVariant:
        return colorScheme.onSurface;
      case IconButtonVariant.primary:
        return Colors.white;
      case IconButtonVariant.secondary:
        return colorScheme.onSurface;
      case IconButtonVariant.ghost:
        return colorScheme.onSurface;
      case IconButtonVariant.danger:
        return Colors.white;
    }
  }

  double _getSize() {
    switch (size) {
      case IconButtonSize.sm:
        return 32;
      case IconButtonSize.md:
        return 40;
      case IconButtonSize.lg:
        return 48;
      case IconButtonSize.xl:
        return 56;
    }
  }

  double _getIconSize() {
    switch (size) {
      case IconButtonSize.sm:
        return 16;
      case IconButtonSize.md:
        return 20;
      case IconButtonSize.lg:
        return 24;
      case IconButtonSize.xl:
        return 28;
    }
  }
}

/// Icon button variants matching web app
enum IconButtonVariant {
  defaultVariant,
  primary,
  secondary,
  ghost,
  danger,
}

/// Icon button sizes matching web app
enum IconButtonSize {
  sm,
  md,
  lg,
  xl,
}