import 'package:flutter/material.dart';

/// Custom button widget matching web app design
/// 
/// Matches web Button component with all variants and features:
/// - 6 variants: primary, secondary, outline, ghost, danger, gradient
/// - 4 sizes: sm, md, lg, xl
/// - Icon support (left/right position)
/// - Loading state
/// - Full width option
/// - Animations
class AppButton extends StatelessWidget {
  final String? label;
  final Widget? child;
  final VoidCallback? onPressed;
  final ButtonVariant variant;
  final ButtonSize size;
  final bool isLoading;
  final bool isFullWidth;
  final IconData? icon;
  final IconPosition iconPosition;
  final Color? backgroundColor;
  final Color? textColor;
  final BorderRadius? borderRadius;
  final bool disabled;

  const AppButton({
    super.key,
    this.label,
    this.child,
    this.onPressed,
    this.variant = ButtonVariant.primary,
    this.size = ButtonSize.md,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.iconPosition = IconPosition.left,
    this.backgroundColor,
    this.textColor,
    this.borderRadius,
    this.disabled = false,
  });

  /// Primary button variant
  const AppButton.primary({
    super.key,
    this.label,
    this.child,
    this.onPressed,
    this.size = ButtonSize.md,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.iconPosition = IconPosition.left,
    this.backgroundColor,
    this.textColor,
    this.borderRadius,
    this.disabled = false,
  }) : variant = ButtonVariant.primary;

  /// Secondary button variant
  const AppButton.secondary({
    super.key,
    this.label,
    this.child,
    this.onPressed,
    this.size = ButtonSize.md,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.iconPosition = IconPosition.left,
    this.backgroundColor,
    this.textColor,
    this.borderRadius,
    this.disabled = false,
  }) : variant = ButtonVariant.secondary;

  /// Outline button variant
  const AppButton.outline({
    super.key,
    this.label,
    this.child,
    this.onPressed,
    this.size = ButtonSize.md,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.iconPosition = IconPosition.left,
    this.backgroundColor,
    this.textColor,
    this.borderRadius,
    this.disabled = false,
  }) : variant = ButtonVariant.outline;

  /// Ghost button variant
  const AppButton.ghost({
    super.key,
    this.label,
    this.child,
    this.onPressed,
    this.size = ButtonSize.md,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.iconPosition = IconPosition.left,
    this.backgroundColor,
    this.textColor,
    this.borderRadius,
    this.disabled = false,
  }) : variant = ButtonVariant.ghost;

  /// Danger button variant
  const AppButton.danger({
    super.key,
    this.label,
    this.child,
    this.onPressed,
    this.size = ButtonSize.md,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.iconPosition = IconPosition.left,
    this.backgroundColor,
    this.textColor,
    this.borderRadius,
    this.disabled = false,
  }) : variant = ButtonVariant.danger;

  /// Gradient button variant
  const AppButton.gradient({
    super.key,
    this.label,
    this.child,
    this.onPressed,
    this.size = ButtonSize.md,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.iconPosition = IconPosition.left,
    this.backgroundColor,
    this.textColor,
    this.borderRadius,
    this.disabled = false,
  }) : variant = ButtonVariant.gradient;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final content = _buildContent(context);
    
    final isDisabled = disabled || isLoading || onPressed == null;

    Widget button = Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: isDisabled ? null : onPressed,
        borderRadius: borderRadius ?? BorderRadius.circular(12),
        child: Ink(
          decoration: _buildDecoration(colorScheme, isDisabled),
          child: Container(
            padding: _getPadding(),
            constraints: BoxConstraints(
              minHeight: _getMinHeight(),
            ),
            child: content,
          ),
        ),
      ),
    );

    if (isFullWidth) {
      return SizedBox(
        width: double.infinity,
        child: button,
      );
    }

    return button;
  }

  BoxDecoration _buildDecoration(ColorScheme colorScheme, bool isDisabled) {
    if (variant == ButtonVariant.gradient) {
      return BoxDecoration(
        gradient: LinearGradient(
          colors: isDisabled
              ? [Colors.grey.shade300, Colors.grey.shade400]
              : [
                  const Color(0xFF6366F1), // Indigo
                  const Color(0xFF8B5CF6), // Purple
                ],
        ),
        borderRadius: borderRadius ?? BorderRadius.circular(12),
        border: variant == ButtonVariant.outline
            ? Border.all(
                color: isDisabled
                    ? colorScheme.outline.withOpacity(0.3)
                    : colorScheme.outline,
                width: 2,
              )
            : null,
      );
    }

    return BoxDecoration(
      color: backgroundColor ?? _getBackgroundColor(colorScheme, isDisabled),
      borderRadius: borderRadius ?? BorderRadius.circular(12),
      border: variant == ButtonVariant.outline
          ? Border.all(
              color: isDisabled
                  ? colorScheme.outline.withOpacity(0.3)
                  : colorScheme.outline,
              width: 2,
            )
          : null,
    );
  }

  Widget _buildContent(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    if (isLoading) {
      return Center(
        child: SizedBox(
          width: _getIconSize(),
          height: _getIconSize(),
          child: CircularProgressIndicator(
            strokeWidth: 2,
            valueColor: AlwaysStoppedAnimation<Color>(
              _getTextColor(colorScheme, false),
            ),
          ),
        ),
      );
    }

    final contentWidget = child ??
        Text(
          label ?? '',
          style: TextStyle(
            fontSize: _getFontSize(),
            fontWeight: FontWeight.w500,
            color: _getTextColor(colorScheme, disabled || onPressed == null),
          ),
        );

    if (icon != null) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (iconPosition == IconPosition.left) ...[
            Icon(
              icon,
              size: _getIconSize(),
              color: _getTextColor(colorScheme, disabled || onPressed == null),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(child: contentWidget),
          if (iconPosition == IconPosition.right) ...[
            const SizedBox(width: 8),
            Icon(
              icon,
              size: _getIconSize(),
              color: _getTextColor(colorScheme, disabled || onPressed == null),
            ),
          ],
        ],
      );
    }

    return contentWidget;
  }

  Color _getBackgroundColor(ColorScheme colorScheme, bool isDisabled) {
    if (isDisabled) {
      return variant == ButtonVariant.ghost
          ? Colors.transparent
          : Colors.grey.shade300;
    }

    switch (variant) {
      case ButtonVariant.primary:
        return const Color(0xFF6366F1); // Indigo
      case ButtonVariant.secondary:
        return colorScheme.surfaceVariant;
      case ButtonVariant.outline:
        return Colors.transparent;
      case ButtonVariant.ghost:
        return Colors.transparent;
      case ButtonVariant.danger:
        return const Color(0xFFDC2626); // Red
      case ButtonVariant.gradient:
        return Colors.transparent; // Handled by gradient
    }
  }

  Color _getTextColor(ColorScheme colorScheme, bool isDisabled) {
    if (textColor != null) return textColor!;

    if (isDisabled) {
      return Colors.grey.shade600;
    }

    switch (variant) {
      case ButtonVariant.primary:
      case ButtonVariant.danger:
      case ButtonVariant.gradient:
        return Colors.white;
      case ButtonVariant.secondary:
        return colorScheme.onSurfaceVariant;
      case ButtonVariant.outline:
      case ButtonVariant.ghost:
        return colorScheme.onSurface;
    }
  }

  EdgeInsets _getPadding() {
    switch (size) {
      case ButtonSize.sm:
        return const EdgeInsets.symmetric(horizontal: 12, vertical: 6);
      case ButtonSize.md:
        return const EdgeInsets.symmetric(horizontal: 16, vertical: 10);
      case ButtonSize.lg:
        return const EdgeInsets.symmetric(horizontal: 24, vertical: 12);
      case ButtonSize.xl:
        return const EdgeInsets.symmetric(horizontal: 32, vertical: 16);
    }
  }

  double _getIconSize() {
    switch (size) {
      case ButtonSize.sm:
        return 16;
      case ButtonSize.md:
        return 18;
      case ButtonSize.lg:
        return 20;
      case ButtonSize.xl:
        return 24;
    }
  }

  double _getFontSize() {
    switch (size) {
      case ButtonSize.sm:
        return 14;
      case ButtonSize.md:
        return 14;
      case ButtonSize.lg:
        return 16;
      case ButtonSize.xl:
        return 18;
    }
  }

  double _getMinHeight() {
    switch (size) {
      case ButtonSize.sm:
        return 32;
      case ButtonSize.md:
        return 40;
      case ButtonSize.lg:
        return 48;
      case ButtonSize.xl:
        return 56;
    }
  }
}

/// Button variants matching web app
enum ButtonVariant {
  primary,
  secondary,
  outline,
  ghost,
  danger,
  gradient,
}

/// Button sizes matching web app
enum ButtonSize {
  sm,
  md,
  lg,
  xl,
}

/// Icon position
enum IconPosition {
  left,
  right,
}