import 'package:flutter/material.dart';

/// Custom checkbox widget matching web app design
class AppCheckbox extends StatelessWidget {
  final bool value;
  final ValueChanged<bool?>? onChanged;
  final Color? activeColor;
  final CheckboxSize size;
  final bool tristate;

  const AppCheckbox({
    Key? key,
    required this.value,
    this.onChanged,
    this.activeColor,
    this.size = CheckboxSize.medium,
    this.tristate = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scale = _getScale();

    return Transform.scale(
      scale: scale,
      child: Checkbox(
        value: value,
        onChanged: onChanged,
        activeColor: activeColor ?? theme.colorScheme.primary,
        tristate: tristate,
      ),
    );
  }

  double _getScale() {
    switch (size) {
      case CheckboxSize.small:
        return 0.8;
      case CheckboxSize.medium:
        return 1.0;
      case CheckboxSize.large:
        return 1.2;
    }
  }
}

enum CheckboxSize {
  small,
  medium,
  large,
}

/// Checkbox with label
class LabeledCheckbox extends StatelessWidget {
  final String label;
  final String? subtitle;
  final bool value;
  final ValueChanged<bool?>? onChanged;
  final Color? activeColor;

  const LabeledCheckbox({
    Key? key,
    required this.label,
    this.subtitle,
    required this.value,
    this.onChanged,
    this.activeColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return InkWell(
      onTap: onChanged != null ? () => onChanged!(!value) : null,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        child: Row(
          children: [
            AppCheckbox(
              value: value,
              onChanged: onChanged,
              activeColor: activeColor,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    label,
                    style: theme.textTheme.bodyLarge,
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      subtitle!,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: Colors.grey.shade600,
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
}
