import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// OTP (One-Time Password) input widget
class OTPInput extends StatefulWidget {
  final int length;
  final ValueChanged<String>? onCompleted;
  final ValueChanged<String>? onChanged;
  final bool autoFocus;
  final double fieldWidth;
  final double fieldHeight;
  final double spacing;
  final TextInputType keyboardType;

  const OTPInput({
    Key? key,
    this.length = 6,
    this.onCompleted,
    this.onChanged,
    this.autoFocus = false,
    this.fieldWidth = 50,
    this.fieldHeight = 60,
    this.spacing = 8,
    this.keyboardType = TextInputType.number,
  }) : super(key: key);

  @override
  State<OTPInput> createState() => _OTPInputState();
}

class _OTPInputState extends State<OTPInput> {
  late List<TextEditingController> _controllers;
  late List<FocusNode> _focusNodes;
  String _otp = '';

  @override
  void initState() {
    super.initState();
    _controllers = List.generate(
      widget.length,
      (index) => TextEditingController(),
    );
    _focusNodes = List.generate(
      widget.length,
      (index) => FocusNode(),
    );

    if (widget.autoFocus) {
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
    if (value.isNotEmpty) {
      if (index < widget.length - 1) {
        _focusNodes[index + 1].requestFocus();
      } else {
        _focusNodes[index].unfocus();
      }
    }

    _updateOTP();
  }

  void _onBackspace(int index) {
    if (_controllers[index].text.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }
  }

  void _updateOTP() {
    _otp = _controllers.map((c) => c.text).join();
    widget.onChanged?.call(_otp);

    if (_otp.length == widget.length) {
      widget.onCompleted?.call(_otp);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(widget.length, (index) {
        return Padding(
          padding: EdgeInsets.only(
            right: index < widget.length - 1 ? widget.spacing : 0,
          ),
          child: SizedBox(
            width: widget.fieldWidth,
            height: widget.fieldHeight,
            child: TextField(
              controller: _controllers[index],
              focusNode: _focusNodes[index],
              keyboardType: widget.keyboardType,
              textAlign: TextAlign.center,
              maxLength: 1,
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
              inputFormatters: [
                LengthLimitingTextInputFormatter(1),
                if (widget.keyboardType == TextInputType.number)
                  FilteringTextInputFormatter.digitsOnly,
              ],
              decoration: InputDecoration(
                counterText: '',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide(
                    color: theme.colorScheme.primary,
                    width: 2,
                  ),
                ),
                contentPadding: EdgeInsets.zero,
              ),
              onChanged: (value) => _onChanged(index, value),
              onTap: () {
                if (_controllers[index].text.isNotEmpty) {
                  _controllers[index].selection = TextSelection.fromPosition(
                    TextPosition(offset: _controllers[index].text.length),
                  );
                }
              },
            ),
          ),
        );
      }),
    );
  }
}

/// OTP input with label and resend button
class OTPInputWithResend extends StatefulWidget {
  final String? label;
  final int length;
  final ValueChanged<String>? onCompleted;
  final VoidCallback? onResend;
  final int resendTimeout;

  const OTPInputWithResend({
    Key? key,
    this.label,
    this.length = 6,
    this.onCompleted,
    this.onResend,
    this.resendTimeout = 60,
  }) : super(key: key);

  @override
  State<OTPInputWithResend> createState() => _OTPInputWithResendState();
}

class _OTPInputWithResendState extends State<OTPInputWithResend> {
  int _countdown = 0;
  bool _canResend = true;

  void _startCountdown() {
    setState(() {
      _countdown = widget.resendTimeout;
      _canResend = false;
    });

    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 1));
      if (!mounted) return false;

      setState(() {
        _countdown--;
      });

      if (_countdown <= 0) {
        setState(() {
          _canResend = true;
        });
        return false;
      }
      return true;
    });
  }

  void _handleResend() {
    widget.onResend?.call();
    _startCountdown();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
        ],
        OTPInput(
          length: widget.length,
          onCompleted: widget.onCompleted,
          autoFocus: true,
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "Didn't receive code?",
              style: theme.textTheme.bodyMedium,
            ),
            const SizedBox(width: 8),
            TextButton(
              onPressed: _canResend ? _handleResend : null,
              child: Text(
                _canResend ? 'Resend' : 'Resend in ${_countdown}s',
              ),
            ),
          ],
        ),
      ],
    );
  }
}
