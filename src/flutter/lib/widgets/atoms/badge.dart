import 'package:flutter/material.dart';

/// Badge widget for displaying notifications, status, or counts
class AppBadge extends StatelessWidget {
  final String? label;
  final int? count;
  final Color? backgroundColor;
  final Color? textColor;
  final BadgeVariant variant;
  final BadgeSize size;
  final Widget? child;
  final bool showZero;

  const AppBadge({
    Key? key,
    this.label,
    this.count,
    this.backgroundColor,
    this.textColor,
    this.variant = BadgeVariant.primary,
    this.size = BadgeSize.medium,
    this.child,
    this.showZero = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    // Don't show badge if count is 0 and showZero is false
    if (count != null && count! <= 0 && !showZero && label == null) {
      return child ?? const SizedBox.shrink();
    }

    final badgeContent = _buildBadgeContent(context);
    
    if (child != null) {
      return Stack(
        clipBehavior: Clip.none,
        children: [
          child!,
          Positioned(
            top: -8,
            right: -8,
            child: badgeContent,
          ),
        ],
      );
    }

    return badgeContent;
  }

  Widget _buildBadgeContent(BuildContext context) {
    final theme = Theme.of(context);
    final bgColor = _getBackgroundColor(theme);
    final fgColor = _getTextColor(theme);
    final padding = _getPadding();
    final fontSize = _getFontSize();

    String text = '';
    if (count != null) {
      text = count! > 99 ? '99+' : count.toString();
    } else if (label != null) {
      text = label!;
    }

    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(100),
        border: Border.all(
          color: theme.scaffoldBackgroundColor,
          width: 2,
        ),
      ),
      constraints: BoxConstraints(
        minWidth: size == BadgeSize.small ? 16 : 20,
        minHeight: size == BadgeSize.small ? 16 : 20,
      ),
      child: text.isNotEmpty
          ? Text(
              text,
              style: TextStyle(
                color: fgColor,
                fontSize: fontSize,
                fontWeight: FontWeight.w600,
                height: 1,
              ),
              textAlign: TextAlign.center,
            )
          : null,
    );
  }

  Color _getBackgroundColor(ThemeData theme) {
    if (backgroundColor != null) return backgroundColor!;

    switch (variant) {
      case BadgeVariant.primary:
        return theme.colorScheme.primary;
      case BadgeVariant.secondary:
        return theme.colorScheme.secondary;
      case BadgeVariant.success:
        return Colors.green;
      case BadgeVariant.warning:
        return Colors.orange;
      case BadgeVariant.error:
        return Colors.red;
      case BadgeVariant.info:
        return Colors.blue;
      case BadgeVariant.neutral:
        return Colors.grey;
    }
  }

  Color _getTextColor(ThemeData theme) {
    if (textColor != null) return textColor!;
    return Colors.white;
  }

  EdgeInsets _getPadding() {
    switch (size) {
      case BadgeSize.small:
        return const EdgeInsets.symmetric(horizontal: 4, vertical: 2);
      case BadgeSize.medium:
        return const EdgeInsets.symmetric(horizontal: 6, vertical: 2);
      case BadgeSize.large:
        return const EdgeInsets.symmetric(horizontal: 8, vertical: 4);
    }
  }

  double _getFontSize() {
    switch (size) {
      case BadgeSize.small:
        return 10;
      case BadgeSize.medium:
        return 12;
      case BadgeSize.large:
        return 14;
    }
  }
}

enum BadgeVariant {
  primary,
  secondary,
  success,
  warning,
  error,
  info,
  neutral,
}

enum BadgeSize {
  small,
  medium,
  large,
}
