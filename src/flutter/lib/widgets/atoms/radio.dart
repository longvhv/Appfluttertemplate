import 'package:flutter/material.dart';

/// Radio button widget matching web app design
class AppRadio<T> extends StatelessWidget {
  final T value;
  final T? groupValue;
  final ValueChanged<T?>? onChanged;
  final Color? activeColor;
  final RadioSize size;

  const AppRadio({
    Key? key,
    required this.value,
    required this.groupValue,
    this.onChanged,
    this.activeColor,
    this.size = RadioSize.medium,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scale = _getScale();

    return Transform.scale(
      scale: scale,
      child: Radio<T>(
        value: value,
        groupValue: groupValue,
        onChanged: onChanged,
        activeColor: activeColor ?? theme.colorScheme.primary,
      ),
    );
  }

  double _getScale() {
    switch (size) {
      case RadioSize.small:
        return 0.8;
      case RadioSize.medium:
        return 1.0;
      case RadioSize.large:
        return 1.2;
    }
  }
}

enum RadioSize {
  small,
  medium,
  large,
}

/// Radio with label
class LabeledRadio<T> extends StatelessWidget {
  final String label;
  final String? subtitle;
  final T value;
  final T? groupValue;
  final ValueChanged<T?>? onChanged;
  final Color? activeColor;

  const LabeledRadio({
    Key? key,
    required this.label,
    this.subtitle,
    required this.value,
    required this.groupValue,
    this.onChanged,
    this.activeColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return InkWell(
      onTap: onChanged != null ? () => onChanged!(value) : null,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        child: Row(
          children: [
            AppRadio<T>(
              value: value,
              groupValue: groupValue,
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

/// Radio group
class RadioGroup<T> extends StatelessWidget {
  final List<RadioOption<T>> options;
  final T? value;
  final ValueChanged<T?> onChanged;
  final RadioGroupDirection direction;

  const RadioGroup({
    Key? key,
    required this.options,
    required this.value,
    required this.onChanged,
    this.direction = RadioGroupDirection.vertical,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final items = options.map((option) => LabeledRadio<T>(
          label: option.label,
          subtitle: option.subtitle,
          value: option.value,
          groupValue: value,
          onChanged: onChanged,
        ));

    if (direction == RadioGroupDirection.vertical) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: items.toList(),
      );
    } else {
      return Wrap(
        spacing: 16,
        runSpacing: 8,
        children: items.toList(),
      );
    }
  }
}

class RadioOption<T> {
  final String label;
  final String? subtitle;
  final T value;

  const RadioOption({
    required this.label,
    this.subtitle,
    required this.value,
  });
}

enum RadioGroupDirection {
  vertical,
  horizontal,
}
