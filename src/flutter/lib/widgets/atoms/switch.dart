import 'package:flutter/material.dart';

/// Switch widget matching web app design
/// 
/// Matches web Switch component with all features:
/// - 3 sizes: sm, md, lg
/// - Label and description support
/// - Disabled state
/// - Custom colors
/// - Smooth animations
class AppSwitch extends StatelessWidget {
  final bool checked;
  final ValueChanged<bool>? onChanged;
  final bool disabled;
  final SwitchSize size;
  final String? label;
  final String? description;
  final Color? activeColor;
  final Color? inactiveColor;

  const AppSwitch({
    super.key,
    required this.checked,
    this.onChanged,
    this.disabled = false,
    this.size = SwitchSize.md,
    this.label,
    this.description,
    this.activeColor,
    this.inactiveColor,
  });

  /// Small switch
  const AppSwitch.sm({
    super.key,
    required this.checked,
    this.onChanged,
    this.disabled = false,
    this.label,
    this.description,
    this.activeColor,
    this.inactiveColor,
  }) : size = SwitchSize.sm;

  /// Medium switch
  const AppSwitch.md({
    super.key,
    required this.checked,
    this.onChanged,
    this.disabled = false,
    this.label,
    this.description,
    this.activeColor,
    this.inactiveColor,
  }) : size = SwitchSize.md;

  /// Large switch
  const AppSwitch.lg({
    super.key,
    required this.checked,
    this.onChanged,
    this.disabled = false,
    this.label,
    this.description,
    this.activeColor,
    this.inactiveColor,
  }) : size = SwitchSize.lg;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    // If no label/description, return switch only
    if (label == null && description == null) {
      return _buildSwitch(colorScheme);
    }

    // Return switch with label
    return InkWell(
      onTap: disabled || onChanged == null ? null : () => onChanged!(!checked),
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
        child: Row(
          children: [
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
            const SizedBox(width: 16),
            _buildSwitch(colorScheme),
          ],
        ),
      ),
    );
  }

  Widget _buildSwitch(ColorScheme colorScheme) {
    final trackSize = _getTrackSize();
    final thumbSize = _getThumbSize();

    return GestureDetector(
      onTap: disabled || onChanged == null ? null : () => onChanged!(!checked),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: trackSize.width,
        height: trackSize.height,
        decoration: BoxDecoration(
          color: _getTrackColor(colorScheme),
          borderRadius: BorderRadius.circular(trackSize.height / 2),
        ),
        child: Stack(
          children: [
            AnimatedPositioned(
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeInOut,
              left: checked ? trackSize.width - thumbSize - 2 : 2,
              top: (trackSize.height - thumbSize) / 2,
              child: Container(
                width: thumbSize,
                height: thumbSize,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getTrackColor(ColorScheme colorScheme) {
    if (disabled) {
      return checked
          ? (activeColor ?? const Color(0xFF6366F1)).withOpacity(0.5)
          : (inactiveColor ?? colorScheme.surfaceVariant).withOpacity(0.5);
    }
    return checked
        ? (activeColor ?? const Color(0xFF6366F1))
        : (inactiveColor ?? colorScheme.surfaceVariant);
  }

  Size _getTrackSize() {
    switch (size) {
      case SwitchSize.sm:
        return const Size(32, 16);
      case SwitchSize.md:
        return const Size(44, 24);
      case SwitchSize.lg:
        return const Size(56, 32);
    }
  }

  double _getThumbSize() {
    switch (size) {
      case SwitchSize.sm:
        return 12;
      case SwitchSize.md:
        return 20;
      case SwitchSize.lg:
        return 24;
    }
  }

  double _getLabelFontSize() {
    switch (size) {
      case SwitchSize.sm:
        return 14;
      case SwitchSize.md:
        return 16;
      case SwitchSize.lg:
        return 18;
    }
  }

  double _getDescriptionFontSize() {
    switch (size) {
      case SwitchSize.sm:
        return 12;
      case SwitchSize.md:
        return 14;
      case SwitchSize.lg:
        return 16;
    }
  }
}

/// Switch sizes matching web app
enum SwitchSize {
  sm,
  md,
  lg,
}