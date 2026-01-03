import 'package:flutter/material.dart';

/// Form field wrapper with label, helper text, and error
/// 
/// Provides:
/// - Consistent field layout
/// - Label with optional indicator
/// - Helper text
/// - Error message display
/// - Required indicator
class AppFormField extends StatelessWidget {
  final String? label;
  final String? helperText;
  final String? errorText;
  final bool required;
  final Widget child;

  const AppFormField({
    super.key,
    this.label,
    this.helperText,
    this.errorText,
    this.required = false,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null) ...[
          Row(
            children: [
              Text(
                label!,
                style: theme.textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w500,
                ),
              ),
              if (required) ...[
                const SizedBox(width: 4),
                Text(
                  '*',
                  style: TextStyle(
                    color: colorScheme.error,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 8),
        ],
        child,
        if (helperText != null || errorText != null) ...[
          const SizedBox(height: 4),
          if (errorText != null)
            Row(
              children: [
                Icon(
                  Icons.error_outline,
                  size: 16,
                  color: colorScheme.error,
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    errorText!,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: colorScheme.error,
                    ),
                  ),
                ),
              ],
            )
          else if (helperText != null)
            Text(
              helperText!,
              style: theme.textTheme.bodySmall?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
        ],
      ],
    );
  }
}
