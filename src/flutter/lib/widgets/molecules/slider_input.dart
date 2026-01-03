import 'package:flutter/material.dart';

/// SliderInput widget matching web app design
/// 
/// Matches web SliderInput component with all features:
/// - Slider with value display
/// - Increment/decrement buttons
/// - Input field for direct value entry
/// - Min/max/step support
/// - Unit/format support
/// - Marks support
class SliderInput extends StatefulWidget {
  final double value;
  final ValueChanged<double>? onChanged;
  final double min;
  final double max;
  final double step;
  final bool disabled;
  final bool showValue;
  final bool showButtons;
  final bool showInput;
  final List<SliderMark>? marks;
  final String Function(double)? formatValue;
  final String? label;
  final String? unit;

  const SliderInput({
    super.key,
    required this.value,
    this.onChanged,
    this.min = 0,
    this.max = 100,
    this.step = 1,
    this.disabled = false,
    this.showValue = true,
    this.showButtons = true,
    this.showInput = true,
    this.marks,
    this.formatValue,
    this.label,
    this.unit,
  });

  @override
  State<SliderInput> createState() => _SliderInputState();
}

class _SliderInputState extends State<SliderInput> {
  late double _currentValue;
  final TextEditingController _controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    _currentValue = widget.value;
    _updateController();
  }

  @override
  void didUpdateWidget(SliderInput oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) {
      _currentValue = widget.value;
      _updateController();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _updateController() {
    _controller.text = _formatDisplayValue(_currentValue);
  }

  String _formatDisplayValue(double value) {
    if (widget.formatValue != null) {
      return widget.formatValue!(value);
    }
    return widget.unit != null ? '${value.toInt()}${widget.unit}' : value.toInt().toString();
  }

  void _handleChange(double value) {
    final clampedValue = value.clamp(widget.min, widget.max);
    setState(() => _currentValue = clampedValue);
    _updateController();
    widget.onChanged?.call(clampedValue);
  }

  void _increment() {
    _handleChange(_currentValue + widget.step);
  }

  void _decrement() {
    _handleChange(_currentValue - widget.step);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 8),
        ],

        // Top row with value and input
        if (widget.showValue || widget.showInput)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (widget.showValue)
                Text(
                  _formatDisplayValue(_currentValue),
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: colorScheme.onSurface,
                  ),
                ),
              if (widget.showInput)
                SizedBox(
                  width: 100,
                  child: TextField(
                    controller: _controller,
                    enabled: !widget.disabled,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      isDense: true,
                    ),
                    style: const TextStyle(fontSize: 14),
                    onSubmitted: (value) {
                      final parsed = double.tryParse(
                        value.replaceAll(RegExp(r'[^\d.]'), ''),
                      );
                      if (parsed != null) {
                        _handleChange(parsed);
                      }
                    },
                  ),
                ),
            ],
          ),

        const SizedBox(height: 12),

        // Slider row with buttons
        Row(
          children: [
            if (widget.showButtons)
              IconButton(
                icon: const Icon(Icons.remove),
                onPressed: widget.disabled || _currentValue <= widget.min
                    ? null
                    : _decrement,
                iconSize: 20,
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(
                  minWidth: 32,
                  minHeight: 32,
                ),
              ),
            Expanded(
              child: SliderTheme(
                data: SliderTheme.of(context).copyWith(
                  activeTrackColor: const Color(0xFF6366F1),
                  inactiveTrackColor: colorScheme.surfaceVariant,
                  thumbColor: const Color(0xFF6366F1),
                  overlayColor: const Color(0xFF6366F1).withOpacity(0.2),
                  trackHeight: 4,
                  thumbShape: const RoundSliderThumbShape(
                    enabledThumbRadius: 8,
                  ),
                ),
                child: Slider(
                  value: _currentValue,
                  min: widget.min,
                  max: widget.max,
                  divisions: ((widget.max - widget.min) / widget.step).round(),
                  onChanged: widget.disabled ? null : _handleChange,
                ),
              ),
            ),
            if (widget.showButtons)
              IconButton(
                icon: const Icon(Icons.add),
                onPressed: widget.disabled || _currentValue >= widget.max
                    ? null
                    : _increment,
                iconSize: 20,
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(
                  minWidth: 32,
                  minHeight: 32,
                ),
              ),
          ],
        ),

        // Marks
        if (widget.marks != null && widget.marks!.isNotEmpty) ...[
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: widget.marks!.map((mark) {
              return Text(
                mark.label,
                style: TextStyle(
                  fontSize: 12,
                  color: colorScheme.onSurfaceVariant,
                ),
              );
            }).toList(),
          ),
        ],
      ],
    );
  }
}

/// Slider mark data
class SliderMark {
  final double value;
  final String label;

  const SliderMark({
    required this.value,
    required this.label,
  });
}
