import 'package:flutter/material.dart';

/// Dropdown menu widget matching web app design
class AppDropdownMenu<T> extends StatelessWidget {
  final T? value;
  final List<DropdownMenuItem<T>> items;
  final ValueChanged<T?>? onChanged;
  final String? label;
  final String? hintText;
  final String? errorText;
  final Widget? prefixIcon;
  final bool enabled;

  const AppDropdownMenu({
    Key? key,
    this.value,
    required this.items,
    this.onChanged,
    this.label,
    this.hintText,
    this.errorText,
    this.prefixIcon,
    this.enabled = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null) ...[
          Text(
            label!,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
          ),
          const SizedBox(height: 8),
        ],
        DropdownButtonFormField<T>(
          value: value,
          items: items,
          onChanged: enabled ? onChanged : null,
          decoration: InputDecoration(
            hintText: hintText,
            errorText: errorText,
            prefixIcon: prefixIcon,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(
                color: Theme.of(context).colorScheme.primary,
                width: 2,
              ),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Colors.red),
            ),
            filled: !enabled,
            fillColor: Colors.grey.shade100,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
          ),
        ),
      ],
    );
  }
}

/// Menu widget (PopupMenuButton wrapper)
class AppMenu<T> extends StatelessWidget {
  final Widget child;
  final List<AppMenuItem<T>> items;
  final ValueChanged<T>? onSelected;
  final Offset offset;

  const AppMenu({
    Key? key,
    required this.child,
    required this.items,
    this.onSelected,
    this.offset = Offset.zero,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<T>(
      child: child,
      offset: offset,
      onSelected: onSelected,
      itemBuilder: (context) => items
          .map((item) => PopupMenuItem<T>(
                value: item.value,
                enabled: item.enabled,
                child: Row(
                  children: [
                    if (item.icon != null) ...[
                      Icon(item.icon, size: 20),
                      const SizedBox(width: 12),
                    ],
                    Expanded(
                      child: Text(item.label),
                    ),
                    if (item.trailing != null) ...[
                      const SizedBox(width: 12),
                      item.trailing!,
                    ],
                  ],
                ),
              ))
          .toList(),
    );
  }
}

class AppMenuItem<T> {
  final String label;
  final T value;
  final IconData? icon;
  final Widget? trailing;
  final bool enabled;

  const AppMenuItem({
    required this.label,
    required this.value,
    this.icon,
    this.trailing,
    this.enabled = true,
  });
}
