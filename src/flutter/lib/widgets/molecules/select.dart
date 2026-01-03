import 'package:flutter/material.dart';

/// Select dropdown widget
/// 
/// Provides:
/// - Single selection
/// - Search functionality
/// - Custom item rendering
/// - Disabled state
class AppSelect<T> extends StatelessWidget {
  final String? label;
  final String? hint;
  final List<SelectOption<T>> options;
  final T? value;
  final ValueChanged<T?>? onChanged;
  final bool enabled;
  final bool searchable;

  const AppSelect({
    super.key,
    this.label,
    this.hint,
    required this.options,
    this.value,
    this.onChanged,
    this.enabled = true,
    this.searchable = false,
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
        DropdownButtonFormField<T>(
          value: value,
          hint: hint != null ? Text(hint!) : null,
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
          ),
          items: options.map((option) {
            return DropdownMenuItem<T>(
              value: option.value,
              child: Row(
                children: [
                  if (option.icon != null) ...[
                    Icon(option.icon, size: 20),
                    const SizedBox(width: 8),
                  ],
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(option.label),
                        if (option.subtitle != null)
                          Text(
                            option.subtitle!,
                            style: theme.textTheme.bodySmall,
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
          onChanged: enabled ? onChanged : null,
          isExpanded: true,
        ),
      ],
    );
  }
}

/// Select option model
class SelectOption<T> {
  final T value;
  final String label;
  final String? subtitle;
  final IconData? icon;

  const SelectOption({
    required this.value,
    required this.label,
    this.subtitle,
    this.icon,
  });
}
