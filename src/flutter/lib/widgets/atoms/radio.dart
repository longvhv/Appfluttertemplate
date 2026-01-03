import 'package:flutter/material.dart';

/// Radio button widget matching web app design
/// 
/// Matches web Radio component with all features:
/// - 3 sizes: sm, md, lg
/// - Label and description support
/// - Disabled state
/// - Custom colors
/// - Animations
class AppRadio<T> extends StatelessWidget {
  final T value;
  final T? groupValue;
  final ValueChanged<T?>? onChanged;
  final String? label;
  final String? description;
  final bool disabled;
  final RadioSize size;
  final Color? activeColor;

  const AppRadio({
    super.key,
    required this.value,
    required this.groupValue,
    this.onChanged,
    this.label,
    this.description,
    this.disabled = false,
    this.size = RadioSize.md,
    this.activeColor,
  });

  /// Small radio
  const AppRadio.sm({
    super.key,
    required this.value,
    required this.groupValue,
    this.onChanged,
    this.label,
    this.description,
    this.disabled = false,
    this.activeColor,
  }) : size = RadioSize.sm;

  /// Medium radio
  const AppRadio.md({
    super.key,
    required this.value,
    required this.groupValue,
    this.onChanged,
    this.label,
    this.description,
    this.disabled = false,
    this.activeColor,
  }) : size = RadioSize.md;

  /// Large radio
  const AppRadio.lg({
    super.key,
    required this.value,
    required this.groupValue,
    this.onChanged,
    this.label,
    this.description,
    this.disabled = false,
    this.activeColor,
  }) : size = RadioSize.lg;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final isChecked = value == groupValue;

    // If no label/description, return radio only
    if (label == null && description == null) {
      return _buildRadio(colorScheme, isChecked);
    }

    // Return radio with label
    return InkWell(
      onTap: disabled || onChanged == null ? null : () => onChanged!(value),
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildRadio(colorScheme, isChecked),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (label != null)
                    Text(
                      label!,
                      style: TextStyle(
                        fontSize: _getLabelFontSize(),
                        color: disabled
                            ? colorScheme.onSurface.withOpacity(0.5)
                            : colorScheme.onSurface,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  if (description != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      description!,
                      style: TextStyle(
                        fontSize: _getDescriptionFontSize(),
                        color: disabled
                            ? colorScheme.onSurfaceVariant.withOpacity(0.5)
                            : colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRadio(ColorScheme colorScheme, bool isChecked) {
    final outerSize = _getOuterSize();
    final innerSize = _getInnerSize();

    return GestureDetector(
      onTap: disabled || onChanged == null ? null : () => onChanged!(value),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: outerSize,
        height: outerSize,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: _getBorderColor(colorScheme, isChecked),
            width: 2,
          ),
          color: colorScheme.surface,
        ),
        child: Center(
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            width: isChecked ? innerSize : 0,
            height: isChecked ? innerSize : 0,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: disabled
                  ? (activeColor ?? const Color(0xFF6366F1)).withOpacity(0.5)
                  : (activeColor ?? const Color(0xFF6366F1)),
            ),
          ),
        ),
      ),
    );
  }

  Color _getBorderColor(ColorScheme colorScheme, bool isChecked) {
    if (disabled) {
      return isChecked
          ? (activeColor ?? const Color(0xFF6366F1)).withOpacity(0.5)
          : colorScheme.outline.withOpacity(0.5);
    }
    return isChecked
        ? (activeColor ?? const Color(0xFF6366F1))
        : colorScheme.outline;
  }

  double _getOuterSize() {
    switch (size) {
      case RadioSize.sm:
        return 16;
      case RadioSize.md:
        return 20;
      case RadioSize.lg:
        return 24;
    }
  }

  double _getInnerSize() {
    switch (size) {
      case RadioSize.sm:
        return 8;
      case RadioSize.md:
        return 10;
      case RadioSize.lg:
        return 12;
    }
  }

  double _getLabelFontSize() {
    switch (size) {
      case RadioSize.sm:
        return 14;
      case RadioSize.md:
        return 16;
      case RadioSize.lg:
        return 18;
    }
  }

  double _getDescriptionFontSize() {
    switch (size) {
      case RadioSize.sm:
        return 12;
      case RadioSize.md:
        return 14;
      case RadioSize.lg:
        return 16;
    }
  }
}

/// Radio sizes matching web app
enum RadioSize {
  sm,
  md,
  lg,
}