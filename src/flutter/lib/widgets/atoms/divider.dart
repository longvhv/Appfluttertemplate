import 'package:flutter/material.dart';

/// Divider widget matching web app design
/// 
/// Matches web Divider component with all features:
/// - Horizontal and vertical orientation
/// - Label support (text in the middle)
/// - Custom color and thickness
class AppDivider extends StatelessWidget {
  final DividerOrientation orientation;
  final String? label;
  final double? thickness;
  final Color? color;

  const AppDivider({
    super.key,
    this.orientation = DividerOrientation.horizontal,
    this.label,
    this.thickness,
    this.color,
  });

  /// Horizontal divider
  const AppDivider.horizontal({
    super.key,
    this.label,
    this.thickness,
    this.color,
  }) : orientation = DividerOrientation.horizontal;

  /// Vertical divider
  const AppDivider.vertical({
    super.key,
    this.label,
    this.thickness,
    this.color,
  }) : orientation = DividerOrientation.vertical;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final dividerColor = color ?? colorScheme.outline.withOpacity(0.3);

    // Vertical divider
    if (orientation == DividerOrientation.vertical) {
      return Container(
        width: thickness ?? 1,
        height: double.infinity,
        color: dividerColor,
      );
    }

    // Horizontal divider with label
    if (label != null) {
      return Row(
        children: [
          Expanded(
            child: Container(
              height: thickness ?? 1,
              color: dividerColor,
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Text(
              label!,
              style: TextStyle(
                fontSize: 14,
                color: colorScheme.onSurfaceVariant,
              ),
            ),
          ),
          Expanded(
            child: Container(
              height: thickness ?? 1,
              color: dividerColor,
            ),
          ),
        ],
      );
    }

    // Simple horizontal divider
    return Container(
      height: thickness ?? 1,
      color: dividerColor,
    );
  }
}

/// Divider orientation matching web app
enum DividerOrientation {
  horizontal,
  vertical,
}