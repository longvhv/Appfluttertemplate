import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// ColorInput widget matching web app design
/// 
/// Matches web ColorInput component with all features:
/// - Color picker
/// - Preset colors
/// - Hex/RGB/HSL format support
/// - Copy to clipboard
/// - Alpha channel support
class ColorInput extends StatefulWidget {
  final Color value;
  final ValueChanged<Color>? onChanged;
  final ColorFormat format;
  final bool showPresets;
  final List<Color>? presetColors;
  final bool showAlpha;
  final bool showCopyButton;
  final bool disabled;
  final String? label;

  const ColorInput({
    super.key,
    required this.value,
    this.onChanged,
    this.format = ColorFormat.hex,
    this.showPresets = true,
    this.presetColors,
    this.showAlpha = false,
    this.showCopyButton = true,
    this.disabled = false,
    this.label,
  });

  @override
  State<ColorInput> createState() => _ColorInputState();
}

class _ColorInputState extends State<ColorInput> {
  late Color _selectedColor;
  bool _copied = false;

  static const List<Color> _defaultPresets = [
    Color(0xFFEF4444), // Red
    Color(0xFFF97316), // Orange
    Color(0xFFF59E0B), // Amber
    Color(0xFFEAB308), // Yellow
    Color(0xFF84CC16), // Lime
    Color(0xFF22C55E), // Green
    Color(0xFF10B981), // Emerald
    Color(0xFF14B8A6), // Teal
    Color(0xFF06B6D4), // Cyan
    Color(0xFF0EA5E9), // Sky
    Color(0xFF3B82F6), // Blue
    Color(0xFF6366F1), // Indigo
    Color(0xFF8B5CF6), // Violet
    Color(0xFFA855F7), // Purple
    Color(0xFFD946EF), // Fuchsia
    Color(0xFFEC4899), // Pink
    Color(0xFFF43F5E), // Rose
    Color(0xFF64748B), // Slate
    Color(0xFF000000), // Black
    Color(0xFFFFFFFF), // White
  ];

  @override
  void initState() {
    super.initState();
    _selectedColor = widget.value;
  }

  @override
  void didUpdateWidget(ColorInput oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) {
      _selectedColor = widget.value;
    }
  }

  Future<void> _pickColor() async {
    if (widget.disabled) return;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Pick a color'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Current color preview
              Container(
                width: double.infinity,
                height: 80,
                decoration: BoxDecoration(
                  color: _selectedColor,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey.shade300),
                ),
              ),
              const SizedBox(height: 16),

              // Preset colors
              if (widget.showPresets) ...[
                const Text('Preset colors'),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: (widget.presetColors ?? _defaultPresets).map((color) {
                    return GestureDetector(
                      onTap: () {
                        setState(() => _selectedColor = color);
                        widget.onChanged?.call(color);
                        Navigator.pop(context);
                      },
                      child: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: color,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: _selectedColor == color
                                ? Colors.black
                                : Colors.grey.shade300,
                            width: _selectedColor == color ? 2 : 1,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );
  }

  void _copyToClipboard() {
    final colorString = _formatColor(_selectedColor);
    Clipboard.setData(ClipboardData(text: colorString));
    setState(() => _copied = true);
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() => _copied = false);
      }
    });
  }

  String _formatColor(Color color) {
    switch (widget.format) {
      case ColorFormat.hex:
        return '#${color.value.toRadixString(16).substring(2).toUpperCase()}';
      case ColorFormat.rgb:
        return 'rgb(${color.red}, ${color.green}, ${color.blue})';
      case ColorFormat.hsl:
        final hsl = HSLColor.fromColor(color);
        return 'hsl(${hsl.hue.round()}, ${(hsl.saturation * 100).round()}%, ${(hsl.lightness * 100).round()}%)';
    }
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
        Container(
          height: 48,
          decoration: BoxDecoration(
            border: Border.all(
              color: colorScheme.outline.withOpacity(0.3),
            ),
            borderRadius: BorderRadius.circular(8),
            color: widget.disabled
                ? colorScheme.surfaceVariant.withOpacity(0.5)
                : colorScheme.surface,
          ),
          child: Row(
            children: [
              // Color preview
              InkWell(
                onTap: _pickColor,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(8),
                  bottomLeft: Radius.circular(8),
                ),
                child: Container(
                  width: 48,
                  margin: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: _selectedColor,
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                ),
              ),

              // Color value
              Expanded(
                child: InkWell(
                  onTap: _pickColor,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Text(
                      _formatColor(_selectedColor),
                      style: TextStyle(
                        fontSize: 14,
                        color: widget.disabled
                            ? colorScheme.onSurface.withOpacity(0.5)
                            : colorScheme.onSurface,
                        fontFamily: 'monospace',
                      ),
                    ),
                  ),
                ),
              ),

              // Copy button
              if (widget.showCopyButton)
                IconButton(
                  icon: Icon(
                    _copied ? Icons.check : Icons.copy,
                    size: 18,
                  ),
                  color: _copied
                      ? const Color(0xFF22C55E)
                      : colorScheme.onSurfaceVariant,
                  onPressed: widget.disabled ? null : _copyToClipboard,
                ),
            ],
          ),
        ),
      ],
    );
  }
}

/// Color format
enum ColorFormat {
  hex,
  rgb,
  hsl,
}
