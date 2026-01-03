import 'package:flutter/material.dart';

/// Checkbox widget matching web app design
/// 
/// Matches web Checkbox component with all features:
/// - 3 sizes: sm, md, lg
/// - Label and description support
/// - Error state
/// - Disabled state
/// - Custom colors
/// - Animations
class AppCheckbox extends StatelessWidget {
  final bool checked;
  final ValueChanged<bool>? onChanged;
  final String? label;
  final String? description;
  final bool disabled;
  final CheckboxSize size;
  final String? error;
  final Color? activeColor;
  final Color? checkColor;

  const AppCheckbox({
    super.key,
    required this.checked,
    this.onChanged,
    this.label,
    this.description,
    this.disabled = false,
    this.size = CheckboxSize.md,
    this.error,
    this.activeColor,
    this.checkColor,
  });

  /// Small checkbox
  const AppCheckbox.sm({
    super.key,
    required this.checked,
    this.onChanged,
    this.label,
    this.description,
    this.disabled = false,
    this.error,
    this.activeColor,
    this.checkColor,
  }) : size = CheckboxSize.sm;

  /// Medium checkbox
  const AppCheckbox.md({
    super.key,
    required this.checked,
    this.onChanged,
    this.label,
    this.description,
    this.disabled = false,
    this.error,
    this.activeColor,
    this.checkColor,
  }) : size = CheckboxSize.md;

  /// Large checkbox
  const AppCheckbox.lg({
    super.key,
    required this.checked,
    this.onChanged,
    this.label,
    this.description,
    this.disabled = false,
    this.error,
    this.activeColor,
    this.checkColor,
  }) : size = CheckboxSize.lg;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    // If no label/description, return checkbox only
    if (label == null && description == null) {
      return _buildCheckbox(colorScheme);
    }

    // Return checkbox with label
    return InkWell(
      onTap: disabled || onChanged == null ? null : () => onChanged!(!checked),
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildCheckbox(colorScheme),
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
                  if (error != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      error!,
                      style: TextStyle(
                        fontSize: _getDescriptionFontSize(),
                        color: colorScheme.error,
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

  Widget _buildCheckbox(ColorScheme colorScheme) {
    final boxSize = _getBoxSize();
    final checkSize = _getCheckSize();

    return GestureDetector(
      onTap: disabled || onChanged == null ? null : () => onChanged!(!checked),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: boxSize,
        height: boxSize,
        decoration: BoxDecoration(
          color: _getBackgroundColor(colorScheme),
          border: Border.all(
            color: _getBorderColor(colorScheme),
            width: 2,
          ),
          borderRadius: BorderRadius.circular(6),
        ),
        child: checked
            ? Icon(
                Icons.check,
                size: checkSize,
                color: checkColor ?? Colors.white,
              )
            : null,
      ),
    );
  }

  Color _getBackgroundColor(ColorScheme colorScheme) {
    if (disabled) {
      return checked
          ? (activeColor ?? const Color(0xFF6366F1)).withOpacity(0.5)
          : colorScheme.surface.withOpacity(0.5);
    }
    return checked
        ? (activeColor ?? const Color(0xFF6366F1))
        : colorScheme.surface;
  }

  Color _getBorderColor(ColorScheme colorScheme) {
    if (error != null) return colorScheme.error;
    if (disabled) {
      return checked
          ? (activeColor ?? const Color(0xFF6366F1)).withOpacity(0.5)
          : colorScheme.outline.withOpacity(0.5);
    }
    return checked
        ? (activeColor ?? const Color(0xFF6366F1))
        : colorScheme.outline;
  }

  double _getBoxSize() {
    switch (size) {
      case CheckboxSize.sm:
        return 16;
      case CheckboxSize.md:
        return 20;
      case CheckboxSize.lg:
        return 24;
    }
  }

  double _getCheckSize() {
    switch (size) {
      case CheckboxSize.sm:
        return 12;
      case CheckboxSize.md:
        return 16;
      case CheckboxSize.lg:
        return 20;
    }
  }

  double _getLabelFontSize() {
    switch (size) {
      case CheckboxSize.sm:
        return 14;
      case CheckboxSize.md:
        return 16;
      case CheckboxSize.lg:
        return 18;
    }
  }

  double _getDescriptionFontSize() {
    switch (size) {
      case CheckboxSize.sm:
        return 12;
      case CheckboxSize.md:
        return 14;
      case CheckboxSize.lg:
        return 16;
    }
  }
}

/// Checkbox sizes matching web app
enum CheckboxSize {
  sm,
  md,
  lg,
}