import 'package:flutter/material.dart';

/// Segmented control widget (iOS-style)
class SegmentedControl<T> extends StatelessWidget {
  final Map<T, String> segments;
  final T selected;
  final ValueChanged<T> onChanged;
  final Color? selectedColor;
  final Color? unselectedColor;
  final Color? borderColor;

  const SegmentedControl({
    Key? key,
    required this.segments,
    required this.selected,
    required this.onChanged,
    this.selectedColor,
    this.unselectedColor,
    this.borderColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final activeColor = selectedColor ?? theme.colorScheme.primary;
    final inactiveColor = unselectedColor ?? Colors.grey.shade200;
    final border = borderColor ?? Colors.grey.shade300;

    return Container(
      decoration: BoxDecoration(
        color: inactiveColor,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: border),
      ),
      padding: const EdgeInsets.all(4),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: segments.entries.map((entry) {
          final isSelected = entry.key == selected;
          return Expanded(
            child: GestureDetector(
              onTap: () => onChanged(entry.key),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: isSelected ? activeColor : Colors.transparent,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  entry.value,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: isSelected ? Colors.white : Colors.grey.shade700,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

/// Segmented control with icons
class SegmentedControlWithIcons<T> extends StatelessWidget {
  final Map<T, SegmentItem> segments;
  final T selected;
  final ValueChanged<T> onChanged;
  final Color? selectedColor;
  final Color? unselectedColor;

  const SegmentedControlWithIcons({
    Key? key,
    required this.segments,
    required this.selected,
    required this.onChanged,
    this.selectedColor,
    this.unselectedColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final activeColor = selectedColor ?? theme.colorScheme.primary;
    final inactiveColor = unselectedColor ?? Colors.grey.shade200;

    return Container(
      decoration: BoxDecoration(
        color: inactiveColor,
        borderRadius: BorderRadius.circular(8),
      ),
      padding: const EdgeInsets.all(4),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: segments.entries.map((entry) {
          final isSelected = entry.key == selected;
          final item = entry.value;

          return Expanded(
            child: GestureDetector(
              onTap: () => onChanged(entry.key),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: isSelected ? activeColor : Colors.transparent,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      item.icon,
                      size: 18,
                      color: isSelected ? Colors.white : Colors.grey.shade700,
                    ),
                    if (item.label != null) ...[
                      const SizedBox(width: 6),
                      Text(
                        item.label!,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: isSelected ? Colors.white : Colors.grey.shade700,
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class SegmentItem {
  final IconData icon;
  final String? label;

  const SegmentItem({
    required this.icon,
    this.label,
  });
}
