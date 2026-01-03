import 'package:flutter/material.dart';

/// Floating Action Button widget
/// 
/// Provides:
/// - Primary action button
/// - Extended FAB with label
/// - Mini FAB variant
/// - Custom icons and colors
class AppFloatingActionButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final IconData icon;
  final String? label;
  final bool mini;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final String? tooltip;

  const AppFloatingActionButton({
    super.key,
    required this.onPressed,
    required this.icon,
    this.label,
    this.mini = false,
    this.backgroundColor,
    this.foregroundColor,
    this.tooltip,
  });

  /// Extended FAB with label
  const AppFloatingActionButton.extended({
    super.key,
    required this.onPressed,
    required this.icon,
    required this.label,
    this.backgroundColor,
    this.foregroundColor,
    this.tooltip,
  }) : mini = false;

  /// Mini FAB variant
  const AppFloatingActionButton.small({
    super.key,
    required this.onPressed,
    required this.icon,
    this.label,
    this.backgroundColor,
    this.foregroundColor,
    this.tooltip,
  }) : mini = true;

  @override
  Widget build(BuildContext context) {
    if (label != null && !mini) {
      // Extended FAB
      return FloatingActionButton.extended(
        onPressed: onPressed,
        icon: Icon(icon),
        label: Text(label!),
        backgroundColor: backgroundColor,
        foregroundColor: foregroundColor,
        tooltip: tooltip,
      );
    } else if (mini) {
      // Mini FAB
      return FloatingActionButton.small(
        onPressed: onPressed,
        backgroundColor: backgroundColor,
        foregroundColor: foregroundColor,
        tooltip: tooltip ?? label,
        child: Icon(icon),
      );
    } else {
      // Regular FAB
      return FloatingActionButton(
        onPressed: onPressed,
        backgroundColor: backgroundColor,
        foregroundColor: foregroundColor,
        tooltip: tooltip ?? label,
        child: Icon(icon),
      );
    }
  }
}
