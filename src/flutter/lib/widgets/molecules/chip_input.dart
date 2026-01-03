import 'package:flutter/material.dart';

/// ChipInput widget matching web app design
/// 
/// Matches web ChipInput component with all features:
/// - Add/remove chips
/// - Suggestions support
/// - Max chips limit
/// - Duplicate prevention
/// - Variant styles (default/colored)
/// - Size variants
class ChipInput extends StatefulWidget {
  final List<String> value;
  final ValueChanged<List<String>>? onChanged;
  final String placeholder;
  final List<String> suggestions;
  final int? maxChips;
  final bool allowDuplicates;
  final bool disabled;
  final ChipInputVariant variant;
  final ChipInputSize size;
  final String? label;

  const ChipInput({
    super.key,
    this.value = const [],
    this.onChanged,
    this.placeholder = 'Type and press Enter...',
    this.suggestions = const [],
    this.maxChips,
    this.allowDuplicates = false,
    this.disabled = false,
    this.variant = ChipInputVariant.defaultVariant,
    this.size = ChipInputSize.md,
    this.label,
  });

  @override
  State<ChipInput> createState() => _ChipInputState();
}

class _ChipInputState extends State<ChipInput> {
  late List<String> _chips;
  final TextEditingController _controller = TextEditingController();
  final FocusNode _focusNode = FocusNode();

  static const List<Color> _chipColors = [
    Color(0xFFEF4444), // Red
    Color(0xFF3B82F6), // Blue
    Color(0xFF22C55E), // Green
    Color(0xFFFBBF24), // Yellow
    Color(0xFF8B5CF6), // Purple
    Color(0xFFEC4899), // Pink
  ];

  @override
  void initState() {
    super.initState();
    _chips = List.from(widget.value);
  }

  @override
  void didUpdateWidget(ChipInput oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) {
      _chips = List.from(widget.value);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _addChip(String text) {
    final trimmed = text.trim();
    if (trimmed.isEmpty) return;

    if (!widget.allowDuplicates && _chips.contains(trimmed)) {
      _controller.clear();
      return;
    }

    if (widget.maxChips != null && _chips.length >= widget.maxChips!) {
      _controller.clear();
      return;
    }

    setState(() {
      _chips.add(trimmed);
      _controller.clear();
    });
    widget.onChanged?.call(_chips);
  }

  void _removeChip(int index) {
    setState(() => _chips.removeAt(index));
    widget.onChanged?.call(_chips);
  }

  Color _getChipColor(int index) {
    if (widget.variant == ChipInputVariant.colored) {
      return _chipColors[index % _chipColors.length];
    }
    return const Color(0xFF6366F1); // Indigo
  }

  double _getChipFontSize() {
    switch (widget.size) {
      case ChipInputSize.sm:
        return 12;
      case ChipInputSize.md:
        return 14;
      case ChipInputSize.lg:
        return 16;
    }
  }

  double _getChipHeight() {
    switch (widget.size) {
      case ChipInputSize.sm:
        return 24;
      case ChipInputSize.md:
        return 32;
      case ChipInputSize.lg:
        return 40;
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
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            border: Border.all(
              color: colorScheme.outline.withOpacity(0.3),
            ),
            borderRadius: BorderRadius.circular(8),
            color: widget.disabled
                ? colorScheme.surfaceVariant.withOpacity(0.5)
                : colorScheme.surface,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Chips display
              if (_chips.isNotEmpty)
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _chips.asMap().entries.map((entry) {
                    final index = entry.key;
                    final chip = entry.value;
                    final color = _getChipColor(index);

                    return Container(
                      height: _getChipHeight(),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: color.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            chip,
                            style: TextStyle(
                              fontSize: _getChipFontSize(),
                              color: color,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          if (!widget.disabled) ...[
                            const SizedBox(width: 6),
                            GestureDetector(
                              onTap: () => _removeChip(index),
                              child: Icon(
                                Icons.close,
                                size: _getChipFontSize() + 2,
                                color: color,
                              ),
                            ),
                          ],
                        ],
                      ),
                    );
                  }).toList(),
                ),

              // Input field
              if (_chips.isNotEmpty) const SizedBox(height: 8),
              TextField(
                controller: _controller,
                focusNode: _focusNode,
                enabled: !widget.disabled &&
                    (widget.maxChips == null || _chips.length < widget.maxChips!),
                decoration: InputDecoration(
                  hintText: widget.placeholder,
                  border: InputBorder.none,
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 4,
                    vertical: 8,
                  ),
                ),
                style: TextStyle(fontSize: _getChipFontSize()),
                onSubmitted: _addChip,
              ),

              // Suggestions
              if (widget.suggestions.isNotEmpty &&
                  _controller.text.isNotEmpty &&
                  _focusNode.hasFocus) ...[
                const SizedBox(height: 8),
                const Divider(height: 1),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: widget.suggestions
                      .where((s) =>
                          s.toLowerCase().contains(_controller.text.toLowerCase()) &&
                          !_chips.contains(s))
                      .take(5)
                      .map((suggestion) {
                    return InkWell(
                      onTap: () => _addChip(suggestion),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: colorScheme.surfaceVariant,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          suggestion,
                          style: TextStyle(
                            fontSize: 12,
                            color: colorScheme.onSurfaceVariant,
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
      ],
    );
  }
}

/// Chip input variants matching web app
enum ChipInputVariant {
  defaultVariant,
  colored,
}

/// Chip input sizes matching web app
enum ChipInputSize {
  sm,
  md,
  lg,
}
