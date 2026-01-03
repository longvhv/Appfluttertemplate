import 'package:flutter/material.dart';

/// Custom button widget matching web app design
class AppButton extends StatelessWidget {
  final String? label;
  final Widget? child;
  final VoidCallback? onPressed;
  final ButtonVariant variant;
  final ButtonSize size;
  final bool isLoading;
  final bool isFullWidth;
  final IconData? icon;
  final IconData? suffixIcon;
  final Color? backgroundColor;
  final Color? textColor;
  final BorderRadius? borderRadius;

  const AppButton({
    Key? key,
    this.label,
    this.child,
    this.onPressed,
    this.variant = ButtonVariant.primary,
    this.size = ButtonSize.medium,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.suffixIcon,
    this.backgroundColor,
    this.textColor,
    this.borderRadius,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final content = _buildContent(context);
    final style = _buildButtonStyle(theme);

    Widget button;

    switch (variant) {
      case ButtonVariant.primary:
      case ButtonVariant.secondary:
      case ButtonVariant.success:
      case ButtonVariant.warning:
      case ButtonVariant.error:
        button = ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: style,
          child: content,
        );
        break;
      case ButtonVariant.outlined:
        button = OutlinedButton(
          onPressed: isLoading ? null : onPressed,
          style: style,
          child: content,
        );
        break;
      case ButtonVariant.text:
        button = TextButton(
          onPressed: isLoading ? null : onPressed,
          style: style,
          child: content,
        );
        break;
    }

    if (isFullWidth) {
      return SizedBox(
        width: double.infinity,
        child: button,
      );
    }

    return button;
  }

  Widget _buildContent(BuildContext context) {
    if (isLoading) {
      return SizedBox(
        height: _getButtonHeight(),
        child: Center(
          child: SizedBox(
            width: 16,
            height: 16,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(
                _getTextColor(Theme.of(context)),
              ),
            ),
          ),
        ),
      );
    }

    final contentWidget = child ?? Text(label ?? '');

    if (icon != null || suffixIcon != null) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (icon != null) ...[
            Icon(icon, size: _getIconSize()),
            const SizedBox(width: 8),
          ],
          contentWidget,
          if (suffixIcon != null) ...[
            const SizedBox(width: 8),
            Icon(suffixIcon, size: _getIconSize()),
          ],
        ],
      );
    }

    return contentWidget;
  }

  ButtonStyle _buildButtonStyle(ThemeData theme) {
    return ButtonStyle(
      backgroundColor: MaterialStateProperty.resolveWith<Color>((states) {
        if (states.contains(MaterialState.disabled)) {
          return Colors.grey.shade300;
        }
        return _getBackgroundColor(theme);
      }),
      foregroundColor: MaterialStateProperty.all(_getTextColor(theme)),
      padding: MaterialStateProperty.all(_getPadding()),
      minimumSize: MaterialStateProperty.all(Size.zero),
      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      shape: MaterialStateProperty.all(
        RoundedRectangleBorder(
          borderRadius: borderRadius ?? BorderRadius.circular(8),
        ),
      ),
      elevation: MaterialStateProperty.resolveWith<double>((states) {
        if (variant == ButtonVariant.outlined || variant == ButtonVariant.text) {
          return 0;
        }
        if (states.contains(MaterialState.pressed)) {
          return 2;
        }
        return 1;
      }),
    );
  }

  Color _getBackgroundColor(ThemeData theme) {
    if (backgroundColor != null) return backgroundColor!;

    switch (variant) {
      case ButtonVariant.primary:
        return theme.colorScheme.primary;
      case ButtonVariant.secondary:
        return theme.colorScheme.secondary;
      case ButtonVariant.success:
        return Colors.green;
      case ButtonVariant.warning:
        return Colors.orange;
      case ButtonVariant.error:
        return Colors.red;
      case ButtonVariant.outlined:
        return Colors.transparent;
      case ButtonVariant.text:
        return Colors.transparent;
    }
  }

  Color _getTextColor(ThemeData theme) {
    if (textColor != null) return textColor!;

    switch (variant) {
      case ButtonVariant.outlined:
      case ButtonVariant.text:
        return theme.colorScheme.primary;
      default:
        return Colors.white;
    }
  }

  EdgeInsets _getPadding() {
    switch (size) {
      case ButtonSize.small:
        return const EdgeInsets.symmetric(horizontal: 12, vertical: 8);
      case ButtonSize.medium:
        return const EdgeInsets.symmetric(horizontal: 16, vertical: 12);
      case ButtonSize.large:
        return const EdgeInsets.symmetric(horizontal: 24, vertical: 16);
    }
  }

  double _getIconSize() {
    switch (size) {
      case ButtonSize.small:
        return 16;
      case ButtonSize.medium:
        return 20;
      case ButtonSize.large:
        return 24;
    }
  }

  double _getButtonHeight() {
    switch (size) {
      case ButtonSize.small:
        return 32;
      case ButtonSize.medium:
        return 40;
      case ButtonSize.large:
        return 48;
    }
  }
}

enum ButtonVariant {
  primary,
  secondary,
  success,
  warning,
  error,
  outlined,
  text,
}

enum ButtonSize {
  small,
  medium,
  large,
}
