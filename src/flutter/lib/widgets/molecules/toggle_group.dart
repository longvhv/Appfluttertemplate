import 'package:flutter/material.dart';

/// Toggle group widget (multiple buttons as group)
class ToggleGroup<T> extends StatelessWidget {
  final List<T> values;
  final T? selected;
  final ValueChanged<T>? onChanged;
  final String Function(T) labelBuilder;
  final IconData? Function(T)? iconBuilder;
  final ToggleGroupOrientation orientation;
  final bool allowDeselect;

  const ToggleGroup({
    Key? key,
    required this.values,
    this.selected,
    this.onChanged,
    required this.labelBuilder,
    this.iconBuilder,
    this.orientation = ToggleGroupOrientation.horizontal,
    this.allowDeselect = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (orientation == ToggleGroupOrientation.vertical) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: List.generate(values.length, (index) {
          final value = values[index];
          final isSelected = value == selected;
          final isFirst = index == 0;
          final isLast = index == values.length - 1;

          return _ToggleButton(
            value: value,
            isSelected: isSelected,
            label: labelBuilder(value),
            icon: iconBuilder?.call(value),
            onTap: () {
              if (allowDeselect && isSelected) {
                onChanged?.call(value);
              } else if (!isSelected) {
                onChanged?.call(value);
              }
            },
            borderRadius: BorderRadius.vertical(
              top: isFirst ? const Radius.circular(8) : Radius.zero,
              bottom: isLast ? const Radius.circular(8) : Radius.zero,
            ),
            showTopBorder: isFirst,
            showBottomBorder: true,
          );
        }),
      );
    }

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(values.length, (index) {
        final value = values[index];
        final isSelected = value == selected;
        final isFirst = index == 0;
        final isLast = index == values.length - 1;

        return _ToggleButton(
          value: value,
          isSelected: isSelected,
          label: labelBuilder(value),
          icon: iconBuilder?.call(value),
          onTap: () {
            if (allowDeselect && isSelected) {
              onChanged?.call(value);
            } else if (!isSelected) {
              onChanged?.call(value);
            }
          },
          borderRadius: BorderRadius.horizontal(
            left: isFirst ? const Radius.circular(8) : Radius.zero,
            right: isLast ? const Radius.circular(8) : Radius.zero,
          ),
          showTopBorder: true,
          showBottomBorder: true,
          showLeftBorder: isFirst,
          showRightBorder: true,
        );
      }),
    );
  }
}

class _ToggleButton extends StatelessWidget {
  final dynamic value;
  final bool isSelected;
  final String label;
  final IconData? icon;
  final VoidCallback onTap;
  final BorderRadius borderRadius;
  final bool showTopBorder;
  final bool showBottomBorder;
  final bool showLeftBorder;
  final bool showRightBorder;

  const _ToggleButton({
    required this.value,
    required this.isSelected,
    required this.label,
    this.icon,
    required this.onTap,
    required this.borderRadius,
    this.showTopBorder = true,
    this.showBottomBorder = true,
    this.showLeftBorder = true,
    this.showRightBorder = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Material(
      color: isSelected
          ? theme.colorScheme.primary
          : Colors.transparent,
      borderRadius: borderRadius,
      child: InkWell(
        onTap: onTap,
        borderRadius: borderRadius,
        child: Container(
          padding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 12,
          ),
          decoration: BoxDecoration(
            border: Border(
              top: showTopBorder
                  ? BorderSide(color: Colors.grey.shade300)
                  : BorderSide.none,
              bottom: showBottomBorder
                  ? BorderSide(color: Colors.grey.shade300)
                  : BorderSide.none,
              left: showLeftBorder
                  ? BorderSide(color: Colors.grey.shade300)
                  : BorderSide.none,
              right: showRightBorder
                  ? BorderSide(color: Colors.grey.shade300)
                  : BorderSide.none,
            ),
            borderRadius: borderRadius,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) ...[
                Icon(
                  icon,
                  size: 18,
                  color: isSelected ? Colors.white : Colors.grey.shade700,
                ),
                const SizedBox(width: 8),
              ],
              Text(
                label,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: isSelected ? Colors.white : Colors.grey.shade700,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

enum ToggleGroupOrientation {
  horizontal,
  vertical,
}

/// Multi-select toggle group
class MultiToggleGroup<T> extends StatelessWidget {
  final List<T> values;
  final List<T> selected;
  final ValueChanged<List<T>>? onChanged;
  final String Function(T) labelBuilder;
  final IconData? Function(T)? iconBuilder;
  final ToggleGroupOrientation orientation;
  final int? maxSelections;

  const MultiToggleGroup({
    Key? key,
    required this.values,
    required this.selected,
    this.onChanged,
    required this.labelBuilder,
    this.iconBuilder,
    this.orientation = ToggleGroupOrientation.horizontal,
    this.maxSelections,
  }) : super(key: key);

  void _handleToggle(T value) {
    final newSelected = List<T>.from(selected);
    if (newSelected.contains(value)) {
      newSelected.remove(value);
    } else {
      if (maxSelections == null || newSelected.length < maxSelections!) {
        newSelected.add(value);
      }
    }
    onChanged?.call(newSelected);
  }

  @override
  Widget build(BuildContext context) {
    if (orientation == ToggleGroupOrientation.vertical) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: List.generate(values.length, (index) {
          final value = values[index];
          final isSelected = selected.contains(value);
          final isFirst = index == 0;
          final isLast = index == values.length - 1;

          return _ToggleButton(
            value: value,
            isSelected: isSelected,
            label: labelBuilder(value),
            icon: iconBuilder?.call(value),
            onTap: () => _handleToggle(value),
            borderRadius: BorderRadius.vertical(
              top: isFirst ? const Radius.circular(8) : Radius.zero,
              bottom: isLast ? const Radius.circular(8) : Radius.zero,
            ),
            showTopBorder: isFirst,
            showBottomBorder: true,
          );
        }),
      );
    }

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: values.map((value) {
        final isSelected = selected.contains(value);
        return _ToggleButton(
          value: value,
          isSelected: isSelected,
          label: labelBuilder(value),
          icon: iconBuilder?.call(value),
          onTap: () => _handleToggle(value),
          borderRadius: BorderRadius.circular(8),
          showTopBorder: true,
          showBottomBorder: true,
          showLeftBorder: true,
          showRightBorder: true,
        );
      }).toList(),
    );
  }
}
