import 'package:flutter/material.dart';

/// Password input with visibility toggle
class PasswordInput extends StatefulWidget {
  final String? label;
  final String? hintText;
  final String? helperText;
  final String? errorText;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final bool showStrengthIndicator;
  final bool enabled;
  final String? initialValue;

  const PasswordInput({
    Key? key,
    this.label,
    this.hintText,
    this.helperText,
    this.errorText,
    this.controller,
    this.onChanged,
    this.showStrengthIndicator = false,
    this.enabled = true,
    this.initialValue,
  }) : super(key: key);

  @override
  State<PasswordInput> createState() => _PasswordInputState();
}

class _PasswordInputState extends State<PasswordInput> {
  bool _obscureText = true;
  PasswordStrength _strength = PasswordStrength.weak;

  @override
  void initState() {
    super.initState();
    if (widget.initialValue != null) {
      _updateStrength(widget.initialValue!);
    }
  }

  void _toggleVisibility() {
    setState(() {
      _obscureText = !_obscureText;
    });
  }

  void _updateStrength(String password) {
    setState(() {
      _strength = _calculateStrength(password);
    });
  }

  PasswordStrength _calculateStrength(String password) {
    if (password.isEmpty) return PasswordStrength.weak;
    
    int score = 0;
    
    // Length
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Contains lowercase
    if (password.contains(RegExp(r'[a-z]'))) score++;
    
    // Contains uppercase
    if (password.contains(RegExp(r'[A-Z]'))) score++;
    
    // Contains numbers
    if (password.contains(RegExp(r'[0-9]'))) score++;
    
    // Contains special characters
    if (password.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'))) score++;

    if (score <= 2) return PasswordStrength.weak;
    if (score <= 4) return PasswordStrength.medium;
    return PasswordStrength.strong;
  }

  Color _getStrengthColor() {
    switch (_strength) {
      case PasswordStrength.weak:
        return Colors.red;
      case PasswordStrength.medium:
        return Colors.orange;
      case PasswordStrength.strong:
        return Colors.green;
    }
  }

  String _getStrengthText() {
    switch (_strength) {
      case PasswordStrength.weak:
        return 'Weak';
      case PasswordStrength.medium:
        return 'Medium';
      case PasswordStrength.strong:
        return 'Strong';
    }
  }

  double _getStrengthValue() {
    switch (_strength) {
      case PasswordStrength.weak:
        return 0.33;
      case PasswordStrength.medium:
        return 0.66;
      case PasswordStrength.strong:
        return 1.0;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
        ],
        TextFormField(
          controller: widget.controller,
          initialValue: widget.initialValue,
          obscureText: _obscureText,
          enabled: widget.enabled,
          onChanged: (value) {
            if (widget.showStrengthIndicator) {
              _updateStrength(value);
            }
            widget.onChanged?.call(value);
          },
          decoration: InputDecoration(
            hintText: widget.hintText ?? 'Enter password',
            helperText: widget.helperText,
            errorText: widget.errorText,
            suffixIcon: IconButton(
              icon: Icon(
                _obscureText ? Icons.visibility_off : Icons.visibility,
              ),
              onPressed: _toggleVisibility,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
          ),
        ),
        if (widget.showStrengthIndicator) ...[
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: LinearProgressIndicator(
                  value: _getStrengthValue(),
                  backgroundColor: Colors.grey.shade200,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    _getStrengthColor(),
                  ),
                  minHeight: 4,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                _getStrengthText(),
                style: theme.textTheme.bodySmall?.copyWith(
                  color: _getStrengthColor(),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }
}

enum PasswordStrength {
  weak,
  medium,
  strong,
}
