import 'package:flutter/material.dart';

/// Tooltip widget matching web app design
class AppTooltip extends StatelessWidget {
  final String message;
  final Widget child;
  final TooltipPosition position;
  final Color? backgroundColor;
  final TextStyle? textStyle;

  const AppTooltip({
    Key? key,
    required this.message,
    required this.child,
    this.position = TooltipPosition.top,
    this.backgroundColor,
    this.textStyle,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Tooltip(
      message: message,
      preferBelow: position == TooltipPosition.bottom,
      verticalOffset: position == TooltipPosition.bottom ? 20 : -20,
      decoration: BoxDecoration(
        color: backgroundColor ?? Colors.grey.shade800,
        borderRadius: BorderRadius.circular(6),
      ),
      textStyle: textStyle ??
          theme.textTheme.bodySmall?.copyWith(
            color: Colors.white,
          ),
      waitDuration: const Duration(milliseconds: 500),
      child: child,
    );
  }
}

enum TooltipPosition {
  top,
  bottom,
  left,
  right,
}
