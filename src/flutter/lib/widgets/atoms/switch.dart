import 'package:flutter/material.dart';

/// Custom switch widget matching web app design
class AppSwitch extends StatelessWidget {
  final bool value;
  final ValueChanged<bool>? onChanged;
  final Color? activeColor;
  final Color? inactiveColor;
  final SwitchSize size;

  const AppSwitch({
    Key? key,
    required this.value,
    this.onChanged,
    this.activeColor,
    this.inactiveColor,
    this.size = SwitchSize.medium,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scale = _getScale();

    return Transform.scale(
      scale: scale,
      child: Switch(
        value: value,
        onChanged: onChanged,
        activeColor: activeColor ?? theme.colorScheme.primary,
        inactiveThumbColor: inactiveColor ?? Colors.grey.shade400,
        inactiveTrackColor: Colors.grey.shade300,
      ),
    );
  }

  double _getScale() {
    switch (size) {
      case SwitchSize.small:
        return 0.8;
      case SwitchSize.medium:
        return 1.0;
      case SwitchSize.large:
        return 1.2;
    }
  }
}

enum SwitchSize {
  small,
  medium,
  large,
}

/// Switch with label
class LabeledSwitch extends StatelessWidget {
  final String label;
  final String? subtitle;
  final bool value;
  final ValueChanged<bool>? onChanged;
  final Color? activeColor;

  const LabeledSwitch({
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
            const SizedBox(width: 16),
            AppSwitch(
              value: value,
              onChanged: onChanged,
              activeColor: activeColor,
            ),
          ],
        ),
      ),
    );
  }
}
