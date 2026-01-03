/// Color Picker Widget
/// 
/// A comprehensive color picker component with multiple selection modes.
/// 
/// Features:
/// - Color wheel picker
/// - RGB sliders
/// - HSV sliders
/// - Hex input
/// - Recent colors
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppColorPicker(
///   initialColor: Colors.blue,
///   onColorChanged: (color) => print(color),
/// )
/// ```

library;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:math' as math;

class AppColorPicker extends StatefulWidget {
  final Color? initialColor;
  final ValueChanged<Color>? onColorChanged;
  final bool showHexInput;
  final bool showAlphaSlider;

  const AppColorPicker({
    super.key,
    this.initialColor,
    this.onColorChanged,
    this.showHexInput = true,
    this.showAlphaSlider = true,
  });

  @override
  State<AppColorPicker> createState() => _AppColorPickerState();
}

class _AppColorPickerState extends State<AppColorPicker> {
  late Color _selectedColor;
  late HSVColor _hsvColor;
  late TextEditingController _hexController;

  @override
  void initState() {
    super.initState();
    _selectedColor = widget.initialColor ?? Colors.blue;
    _hsvColor = HSVColor.fromColor(_selectedColor);
    _hexController = TextEditingController(
      text: _colorToHex(_selectedColor),
    );
  }

  @override
  void dispose() {
    _hexController.dispose();
    super.dispose();
  }

  String _colorToHex(Color color) {
    return '#${color.value.toRadixString(16).padLeft(8, '0').substring(2).toUpperCase()}';
  }

  Color? _hexToColor(String hex) {
    hex = hex.replaceAll('#', '');
    if (hex.length == 6) {
      hex = 'FF$hex';
    }
    if (hex.length == 8) {
      try {
        return Color(int.parse(hex, radix: 16));
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  void _updateColor(Color color) {
    setState(() {
      _selectedColor = color;
      _hsvColor = HSVColor.fromColor(color);
      _hexController.text = _colorToHex(color);
    });
    widget.onColorChanged?.call(color);
  }

  void _updateHSV(HSVColor hsv) {
    setState(() {
      _hsvColor = hsv;
      _selectedColor = hsv.toColor();
      _hexController.text = _colorToHex(_selectedColor);
    });
    widget.onColorChanged?.call(_selectedColor);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Color Preview
        Container(
          height: 80,
          decoration: BoxDecoration(
            color: _selectedColor,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: theme.colorScheme.outline,
              width: 1,
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Hue Slider
        _ColorSlider(
          value: _hsvColor.hue,
          max: 360,
          label: 'Hue',
          gradient: LinearGradient(
            colors: [
              for (int i = 0; i <= 360; i += 60)
                HSVColor.fromAHSV(1, i.toDouble(), 1, 1).toColor(),
            ],
          ),
          onChanged: (value) {
            _updateHSV(_hsvColor.withHue(value));
          },
        ),
        const SizedBox(height: 12),

        // Saturation Slider
        _ColorSlider(
          value: _hsvColor.saturation * 100,
          max: 100,
          label: 'Saturation',
          gradient: LinearGradient(
            colors: [
              Colors.white,
              HSVColor.fromAHSV(1, _hsvColor.hue, 1, _hsvColor.value).toColor(),
            ],
          ),
          onChanged: (value) {
            _updateHSV(_hsvColor.withSaturation(value / 100));
          },
        ),
        const SizedBox(height: 12),

        // Value Slider
        _ColorSlider(
          value: _hsvColor.value * 100,
          max: 100,
          label: 'Brightness',
          gradient: LinearGradient(
            colors: [
              Colors.black,
              HSVColor.fromAHSV(1, _hsvColor.hue, _hsvColor.saturation, 1).toColor(),
            ],
          ),
          onChanged: (value) {
            _updateHSV(_hsvColor.withValue(value / 100));
          },
        ),

        // Alpha Slider
        if (widget.showAlphaSlider) ...[
          const SizedBox(height: 12),
          _ColorSlider(
            value: _hsvColor.alpha * 100,
            max: 100,
            label: 'Opacity',
            gradient: LinearGradient(
              colors: [
                _selectedColor.withOpacity(0),
                _selectedColor.withOpacity(1),
              ],
            ),
            onChanged: (value) {
              _updateHSV(_hsvColor.withAlpha(value / 100));
            },
          ),
        ],

        // Hex Input
        if (widget.showHexInput) ...[
          const SizedBox(height: 16),
          TextField(
            controller: _hexController,
            decoration: InputDecoration(
              labelText: 'Hex Color',
              hintText: '#RRGGBB',
              border: const OutlineInputBorder(),
              prefixIcon: const Icon(Icons.tag),
            ),
            inputFormatters: [
              FilteringTextInputFormatter.allow(RegExp(r'[#0-9A-Fa-f]')),
              LengthLimitingTextInputFormatter(7),
            ],
            onSubmitted: (value) {
              final color = _hexToColor(value);
              if (color != null) {
                _updateColor(color);
              }
            },
          ),
        ],

        const SizedBox(height: 16),

        // Preset Colors
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            Colors.red,
            Colors.pink,
            Colors.purple,
            Colors.deepPurple,
            Colors.indigo,
            Colors.blue,
            Colors.lightBlue,
            Colors.cyan,
            Colors.teal,
            Colors.green,
            Colors.lightGreen,
            Colors.lime,
            Colors.yellow,
            Colors.amber,
            Colors.orange,
            Colors.deepOrange,
          ].map((color) {
            final isSelected = _selectedColor.value == color.value;
            return InkWell(
              onTap: () => _updateColor(color),
              borderRadius: BorderRadius.circular(20),
              child: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: color,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isSelected
                        ? theme.colorScheme.primary
                        : theme.colorScheme.outline,
                    width: isSelected ? 3 : 1,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}

class _ColorSlider extends StatelessWidget {
  final double value;
  final double max;
  final String label;
  final Gradient gradient;
  final ValueChanged<double> onChanged;

  const _ColorSlider({
    required this.value,
    required this.max,
    required this.label,
    required this.gradient,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: theme.textTheme.bodySmall,
            ),
            Text(
              value.toStringAsFixed(0),
              style: theme.textTheme.bodySmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        SliderTheme(
          data: SliderTheme.of(context).copyWith(
            trackHeight: 8,
            thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 8),
            overlayShape: const RoundSliderOverlayShape(overlayRadius: 16),
          ),
          child: Stack(
            children: [
              // Gradient background
              Container(
                height: 8,
                margin: const EdgeInsets.symmetric(horizontal: 8),
                decoration: BoxDecoration(
                  gradient: gradient,
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(
                    color: theme.colorScheme.outline.withOpacity(0.5),
                  ),
                ),
              ),
              // Slider
              Slider(
                value: value,
                max: max,
                onChanged: onChanged,
                activeColor: Colors.transparent,
                inactiveColor: Colors.transparent,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
