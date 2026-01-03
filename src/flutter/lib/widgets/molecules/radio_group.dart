import 'package:flutter/material.dart';

/// Radio group widget for selecting one option
/// 
/// Provides:
/// - Single selection
/// - Horizontal/vertical layout
/// - Custom styling
/// - Disabled state
class AppRadioGroup<T> extends StatelessWidget {
  final String? label;
  final List<RadioOption<T>> options;
  final T? value;
  final ValueChanged<T?>? onChanged;
  final Axis direction;
  final bool enabled;

  const AppRadioGroup({
    super.key,
    this.label,
    required this.options,
    this.value,
    this.onChanged,
    this.direction = Axis.vertical,
    this.enabled = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label != null) ...[
          Text(
            label!,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
        ],
        direction == Axis.vertical
            ? Column(
                children: options.map((option) {
                  return RadioListTile<T>(
                    value: option.value,
                    groupValue: value,
                    onChanged: enabled ? onChanged : null,
                    title: Text(option.label),
                    subtitle: option.subtitle != null
                        ? Text(option.subtitle!)
                        : null,
                    contentPadding: EdgeInsets.zero,
                  );
                }).toList(),
              )
            : Wrap(
                spacing: 16,
                children: options.map((option) {
                  return IntrinsicWidth(
                    child: RadioListTile<T>(
                      value: option.value,
                      groupValue: value,
                      onChanged: enabled ? onChanged : null,
                      title: Text(option.label),
                      contentPadding: EdgeInsets.zero,
                    ),
                  );
                }).toList(),
              ),
      ],
    );
  }
}

/// Radio option model
class RadioOption<T> {
  final T value;
  final String label;
  final String? subtitle;

  const RadioOption({
    required this.value,
    required this.label,
    this.subtitle,
  });
}
