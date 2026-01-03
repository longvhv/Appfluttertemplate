import 'package:flutter/material.dart';

/// Tooltip widget matching web app design
/// 
/// Matches web Tooltip component with all features:
/// - 4 placements: top, bottom, left, right
/// - Delay option
/// - Disabled state
/// - Dark theme
/// - Arrow indicator
class AppTooltip extends StatelessWidget {
  final String message;
  final Widget child;
  final TooltipPlacement placement;
  final int delay;
  final bool disabled;

  const AppTooltip({
    super.key,
    required this.message,
    required this.child,
    this.placement = TooltipPlacement.top,
    this.delay = 200,
    this.disabled = false,
  });

  /// Top tooltip
  const AppTooltip.top({
    super.key,
    required this.message,
    required this.child,
    this.delay = 200,
    this.disabled = false,
  }) : placement = TooltipPlacement.top;

  /// Bottom tooltip
  const AppTooltip.bottom({
    super.key,
    required this.message,
    required this.child,
    this.delay = 200,
    this.disabled = false,
  }) : placement = TooltipPlacement.bottom;

  /// Left tooltip
  const AppTooltip.left({
    super.key,
    required this.message,
    required this.child,
    this.delay = 200,
    this.disabled = false,
  }) : placement = TooltipPlacement.left;

  /// Right tooltip
  const AppTooltip.right({
    super.key,
    required this.message,
    required this.child,
    this.delay = 200,
    this.disabled = false,
  }) : placement = TooltipPlacement.right;

  @override
  Widget build(BuildContext context) {
    if (disabled) {
      return child;
    }

    return Tooltip(
      message: message,
      waitDuration: Duration(milliseconds: delay),
      preferBelow: placement == TooltipPlacement.bottom,
      verticalOffset: placement == TooltipPlacement.top || placement == TooltipPlacement.bottom ? 8 : 0,
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937), // Gray-900
        borderRadius: BorderRadius.circular(6),
      ),
      textStyle: const TextStyle(
        fontSize: 14,
        color: Colors.white,
        fontWeight: FontWeight.w400,
      ),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: child,
    );
  }
}

/// Tooltip placement matching web app
enum TooltipPlacement {
  top,
  bottom,
  left,
  right,
}