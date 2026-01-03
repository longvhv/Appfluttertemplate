import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// PIN input widget for OTP/PIN entry
/// 
/// Provides:
/// - Fixed-length PIN input
/// - Auto-focus next field
/// - Masked/visible toggle
/// - Custom styling
class AppPinInput extends StatefulWidget {
  final int length;
  final bool obscureText;
  final bool autofocus;
  final ValueChanged<String>? onCompleted;
  final ValueChanged<String>? onChanged;

  const AppPinInput({
    super.key,
    this.length = 4,
    this.obscureText = false,
    this.autofocus = true,
    this.onCompleted,
    this.onChanged,
  });

  @override
  State<AppPinInput> createState() => _AppPinInputState();
}

class _AppPinInputState extends State<AppPinInput> {
  late List<TextEditingController> _controllers;
  late List<FocusNode> _focusNodes;
  String _pin = '';

  @override
  void initState() {
    super.initState();
    _controllers = List.generate(
      widget.length,
      (_) => TextEditingController(),
    );
    _focusNodes = List.generate(
      widget.length,
      (_) => FocusNode(),
    );
    
    if (widget.autofocus && _focusNodes.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _focusNodes[0].requestFocus();
      });
    }
  }

  @override
  void dispose() {
    for (var controller in _controllers) {
      controller.dispose();
    }
    for (var node in _focusNodes) {
      node.dispose();
    }
    super.dispose();
  }

  void _onChanged(int index, String value) {
    if (value.isEmpty) {
      // Handle backspace
      if (index > 0) {
        _focusNodes[index - 1].requestFocus();
      }
    } else if (value.length == 1) {
      // Move to next field
      if (index < widget.length - 1) {
        _focusNodes[index + 1].requestFocus();
      } else {
        _focusNodes[index].unfocus();
      }
    }

    // Update PIN
    _pin = _controllers.map((c) => c.text).join();
    widget.onChanged?.call(_pin);

    // Check if complete
    if (_pin.length == widget.length) {
      widget.onCompleted?.call(_pin);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(widget.length, (index) {
        return Container(
          width: 56,
          height: 56,
          margin: EdgeInsets.only(
            right: index < widget.length - 1 ? 12 : 0,
          ),
          child: TextFormField(
            controller: _controllers[index],
            focusNode: _focusNodes[index],
            obscureText: widget.obscureText,
            textAlign: TextAlign.center,
            keyboardType: TextInputType.number,
            maxLength: 1,
            style: theme.textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
            decoration: InputDecoration(
              counterText: '',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: colorScheme.primary,
                  width: 2,
                ),
              ),
            ),
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(1),
            ],
            onChanged: (value) => _onChanged(index, value),
          ),
        );
      }),
    );
  }
}
