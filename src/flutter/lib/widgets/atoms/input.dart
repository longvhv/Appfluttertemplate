import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Input field widget matching web app design
/// 
/// Matches web Input component with all features:
/// - 3 sizes: sm, md, lg
/// - 3 variants: default, filled, flushed
/// - Left/Right icon support
/// - Error/Hint/Helper text
/// - Required indicator
/// - Full width option
class AppInput extends StatelessWidget {
  final String? label;
  final String? hintText;
  final String? helperText;
  final String? errorText;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onTap;
  final ValueChanged<String>? onSubmitted;
  final bool obscureText;
  final TextInputType? keyboardType;
  final List<TextInputFormatter>? inputFormatters;
  final IconData? leftIcon;
  final IconData? rightIcon;
  final VoidCallback? onRightIconTap;
  final int? maxLines;
  final int? minLines;
  final int? maxLength;
  final bool enabled;
  final bool readOnly;
  final bool required;
  final FocusNode? focusNode;
  final TextInputAction? textInputAction;
  final String? initialValue;
  final InputSize size;
  final InputVariant variant;
  final bool fullWidth;
  final String? autoComplete;

  const AppInput({
    super.key,
    this.label,
    this.hintText,
    this.helperText,
    this.errorText,
    this.controller,
    this.onChanged,
    this.onTap,
    this.onSubmitted,
    this.obscureText = false,
    this.keyboardType,
    this.inputFormatters,
    this.leftIcon,
    this.rightIcon,
    this.onRightIconTap,
    this.maxLines = 1,
    this.minLines,
    this.maxLength,
    this.enabled = true,
    this.readOnly = false,
    this.required = false,
    this.focusNode,
    this.textInputAction,
    this.initialValue,
    this.size = InputSize.md,
    this.variant = InputVariant.defaultVariant,
    this.fullWidth = true,
    this.autoComplete,
  });

  /// Email input variant
  const AppInput.email({
    super.key,
    this.label,
    this.hintText = 'email@example.com',
    this.helperText,
    this.errorText,
    this.controller,
    this.onChanged,
    this.onTap,
    this.onSubmitted,
    this.required = false,
    this.enabled = true,
    this.focusNode,
    this.initialValue,
    this.size = InputSize.md,
    this.variant = InputVariant.defaultVariant,
    this.fullWidth = true,
  })  : obscureText = false,
        keyboardType = TextInputType.emailAddress,
        inputFormatters = null,
        leftIcon = Icons.email_outlined,
        rightIcon = null,
        onRightIconTap = null,
        maxLines = 1,
        minLines = null,
        maxLength = null,
        readOnly = false,
        textInputAction = TextInputAction.next,
        autoComplete = 'email';

  /// Password input variant
  const AppInput.password({
    super.key,
    this.label,
    this.hintText = '••••••••',
    this.helperText,
    this.errorText,
    this.controller,
    this.onChanged,
    this.onTap,
    this.onSubmitted,
    this.required = false,
    this.enabled = true,
    this.focusNode,
    this.initialValue,
    this.size = InputSize.md,
    this.variant = InputVariant.defaultVariant,
    this.fullWidth = true,
    this.onRightIconTap,
  })  : obscureText = true,
        keyboardType = TextInputType.visiblePassword,
        inputFormatters = null,
        leftIcon = Icons.lock_outlined,
        rightIcon = Icons.visibility_outlined,
        maxLines = 1,
        minLines = null,
        maxLength = null,
        readOnly = false,
        textInputAction = TextInputAction.done,
        autoComplete = 'password';

  /// Phone input variant
  const AppInput.phone({
    super.key,
    this.label,
    this.hintText = '(555) 123-4567',
    this.helperText,
    this.errorText,
    this.controller,
    this.onChanged,
    this.onTap,
    this.onSubmitted,
    this.required = false,
    this.enabled = true,
    this.focusNode,
    this.initialValue,
    this.size = InputSize.md,
    this.variant = InputVariant.defaultVariant,
    this.fullWidth = true,
  })  : obscureText = false,
        keyboardType = TextInputType.phone,
        inputFormatters = null,
        leftIcon = Icons.phone_outlined,
        rightIcon = null,
        onRightIconTap = null,
        maxLines = 1,
        minLines = null,
        maxLength = null,
        readOnly = false,
        textInputAction = TextInputAction.done,
        autoComplete = 'tel';

  /// Search input variant
  const AppInput.search({
    super.key,
    this.label,
    this.hintText = 'Search...',
    this.helperText,
    this.errorText,
    this.controller,
    this.onChanged,
    this.onTap,
    this.onSubmitted,
    this.required = false,
    this.enabled = true,
    this.focusNode,
    this.initialValue,
    this.size = InputSize.md,
    this.variant = InputVariant.defaultVariant,
    this.fullWidth = true,
    this.onRightIconTap,
  })  : obscureText = false,
        keyboardType = TextInputType.text,
        inputFormatters = null,
        leftIcon = Icons.search,
        rightIcon = Icons.clear,
        maxLines = 1,
        minLines = null,
        maxLength = null,
        readOnly = false,
        textInputAction = TextInputAction.search,
        autoComplete = null;

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
        TextFormField(
          controller: controller,
          initialValue: initialValue,
          onChanged: onChanged,
          onTap: onTap,
          onFieldSubmitted: onSubmitted,
          obscureText: obscureText,
          keyboardType: keyboardType,
          inputFormatters: inputFormatters,
          maxLines: maxLines,
          minLines: minLines,
          maxLength: maxLength,
          enabled: enabled,
          readOnly: readOnly,
          focusNode: focusNode,
          textInputAction: textInputAction,
          style: TextStyle(
            fontSize: _getFontSize(),
          ),
          decoration: InputDecoration(
            hintText: hintText,
            errorText: errorText,
            prefixIcon: leftIcon != null
                ? Icon(leftIcon, size: _getIconSize())
                : null,
            suffixIcon: rightIcon != null
                ? IconButton(
                    icon: Icon(rightIcon, size: _getIconSize()),
                    onPressed: onRightIconTap,
                  )
                : null,
            border: _getBorder(colorScheme),
            enabledBorder: _getBorder(colorScheme),
            focusedBorder: _getFocusedBorder(colorScheme),
            errorBorder: _getErrorBorder(),
            focusedErrorBorder: _getFocusedErrorBorder(),
            filled: variant == InputVariant.filled || !enabled,
            fillColor: _getFillColor(colorScheme),
            contentPadding: _getPadding(),
            counterText: maxLength != null ? null : '',
          ),
        ),
        if (helperText != null && errorText == null) ...[
          const SizedBox(height: 4),
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

  InputBorder _getBorder(ColorScheme colorScheme) {
    switch (variant) {
      case InputVariant.defaultVariant:
        return OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: colorScheme.outline),
        );
      case InputVariant.filled:
        return OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        );
      case InputVariant.flushed:
        return UnderlineInputBorder(
          borderSide: BorderSide(color: colorScheme.outline, width: 2),
        );
    }
  }

  InputBorder _getFocusedBorder(ColorScheme colorScheme) {
    switch (variant) {
      case InputVariant.defaultVariant:
        return OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: const Color(0xFF6366F1), // Indigo
            width: 2,
          ),
        );
      case InputVariant.filled:
        return OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: const Color(0xFF6366F1),
            width: 2,
          ),
        );
      case InputVariant.flushed:
        return UnderlineInputBorder(
          borderSide: BorderSide(
            color: const Color(0xFF6366F1),
            width: 2,
          ),
        );
    }
  }

  InputBorder _getErrorBorder() {
    switch (variant) {
      case InputVariant.defaultVariant:
      case InputVariant.filled:
        return OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.red),
        );
      case InputVariant.flushed:
        return const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.red, width: 2),
        );
    }
  }

  InputBorder _getFocusedErrorBorder() {
    switch (variant) {
      case InputVariant.defaultVariant:
      case InputVariant.filled:
        return OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.red, width: 2),
        );
      case InputVariant.flushed:
        return const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.red, width: 2),
        );
    }
  }

  Color _getFillColor(ColorScheme colorScheme) {
    if (!enabled) return colorScheme.surfaceVariant.withOpacity(0.3);
    if (variant == InputVariant.filled) return colorScheme.surfaceVariant;
    return Colors.transparent;
  }

  EdgeInsets _getPadding() {
    switch (size) {
      case InputSize.sm:
        return const EdgeInsets.symmetric(horizontal: 12, vertical: 8);
      case InputSize.md:
        return const EdgeInsets.symmetric(horizontal: 16, vertical: 12);
      case InputSize.lg:
        return const EdgeInsets.symmetric(horizontal: 20, vertical: 16);
    }
  }

  double _getFontSize() {
    switch (size) {
      case InputSize.sm:
        return 14;
      case InputSize.md:
        return 16;
      case InputSize.lg:
        return 18;
    }
  }

  double _getIconSize() {
    switch (size) {
      case InputSize.sm:
        return 18;
      case InputSize.md:
        return 20;
      case InputSize.lg:
        return 24;
    }
  }
}

/// Input sizes matching web app
enum InputSize {
  sm,
  md,
  lg,
}

/// Input variants matching web app
enum InputVariant {
  defaultVariant,
  filled,
  flushed,
}