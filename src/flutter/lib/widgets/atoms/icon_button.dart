import 'package:flutter/material.dart';

/// Icon button widget matching web app design
class AppIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onPressed;
  final IconButtonVariant variant;
  final IconButtonSize size;
  final Color? color;
  final Color? backgroundColor;
  final String? tooltip;
  final bool isLoading;

  const AppIconButton({
    Key? key,
    required this.icon,
    this.onPressed,
    this.variant = IconButtonVariant.standard,
    this.size = IconButtonSize.medium,
    this.color,
    this.backgroundColor,
    this.tooltip,
    this.isLoading = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final iconColor = color ?? _getDefaultColor(theme);
    final bgColor = backgroundColor ?? _getBackgroundColor(theme);

    Widget button = Container(
      width: _getSize(),
      height: _getSize(),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(_getBorderRadius()),
        border: variant == IconButtonVariant.outlined
            ? Border.all(color: iconColor.withOpacity(0.3))
            : null,
      ),
      child: isLoading
          ? Center(
              child: SizedBox(
                width: _getIconSize(),
                height: _getIconSize(),
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(iconColor),
                ),
              ),
            )
          : Icon(
              icon,
              size: _getIconSize(),
              color: iconColor,
            ),
    );

    if (tooltip != null) {
      button = Tooltip(
        message: tooltip!,
        child: button,
      );
    }

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: isLoading ? null : onPressed,
        borderRadius: BorderRadius.circular(_getBorderRadius()),
        child: button,
      ),
    );
  }

  Color _getDefaultColor(ThemeData theme) {
    switch (variant) {
      case IconButtonVariant.standard:
        return Colors.grey.shade700;
      case IconButtonVariant.filled:
        return Colors.white;
      case IconButtonVariant.outlined:
        return theme.colorScheme.primary;
      case IconButtonVariant.tonal:
        return theme.colorScheme.primary;
    }
  }

  Color _getBackgroundColor(ThemeData theme) {
    switch (variant) {
      case IconButtonVariant.standard:
        return Colors.transparent;
      case IconButtonVariant.filled:
        return theme.colorScheme.primary;
      case IconButtonVariant.outlined:
        return Colors.transparent;
      case IconButtonVariant.tonal:
        return theme.colorScheme.primary.withOpacity(0.1);
    }
  }

  double _getSize() {
    switch (size) {
      case IconButtonSize.small:
        return 32;
      case IconButtonSize.medium:
        return 40;
      case IconButtonSize.large:
        return 48;
    }
  }

  double _getIconSize() {
    switch (size) {
      case IconButtonSize.small:
        return 16;
      case IconButtonSize.medium:
        return 20;
      case IconButtonSize.large:
        return 24;
    }
  }

  double _getBorderRadius() {
    return _getSize() / 2;
  }
}

enum IconButtonVariant {
  standard,
  filled,
  outlined,
  tonal,
}

enum IconButtonSize {
  small,
  medium,
  large,
}
