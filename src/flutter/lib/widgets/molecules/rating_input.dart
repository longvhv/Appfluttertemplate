import 'package:flutter/material.dart';

/// RatingInput widget matching web app design
/// 
/// Matches web RatingInput component with all features:
/// - Interactive rating selection
/// - Label and description
/// - Custom max rating
/// - Size variants
/// - Disabled state
class RatingInput extends StatefulWidget {
  final double value;
  final ValueChanged<double>? onChanged;
  final int max;
  final bool disabled;
  final RatingInputSize size;
  final String? label;
  final String? description;

  const RatingInput({
    super.key,
    required this.value,
    this.onChanged,
    this.max = 5,
    this.disabled = false,
    this.size = RatingInputSize.md,
    this.label,
    this.description,
  });

  /// Small rating input
  const RatingInput.sm({
    super.key,
    required this.value,
    this.onChanged,
    this.max = 5,
    this.disabled = false,
    this.label,
    this.description,
  }) : size = RatingInputSize.sm;

  /// Medium rating input
  const RatingInput.md({
    super.key,
    required this.value,
    this.onChanged,
    this.max = 5,
    this.disabled = false,
    this.label,
    this.description,
  }) : size = RatingInputSize.md;

  /// Large rating input
  const RatingInput.lg({
    super.key,
    required this.value,
    this.onChanged,
    this.max = 5,
    this.disabled = false,
    this.label,
    this.description,
  }) : size = RatingInputSize.lg;

  @override
  State<RatingInput> createState() => _RatingInputState();
}

class _RatingInputState extends State<RatingInput> {
  double? _hoverValue;

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
        Row(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(widget.max, (index) {
            final displayValue = _hoverValue ?? widget.value;
            final isFilled = displayValue >= (index + 1);

            return GestureDetector(
              onTap: widget.disabled || widget.onChanged == null
                  ? null
                  : () {
                      widget.onChanged!(index + 1.0);
                      setState(() => _hoverValue = null);
                    },
              child: MouseRegion(
                onEnter: widget.disabled || widget.onChanged == null
                    ? null
                    : (_) => setState(() => _hoverValue = index + 1.0),
                onExit: widget.disabled || widget.onChanged == null
                    ? null
                    : (_) => setState(() => _hoverValue = null),
                cursor: widget.disabled || widget.onChanged == null
                    ? SystemMouseCursors.basic
                    : SystemMouseCursors.click,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 2),
                  child: Icon(
                    isFilled ? Icons.star : Icons.star_border,
                    size: _getIconSize(),
                    color: isFilled
                        ? (widget.disabled
                            ? const Color(0xFFFBBF24).withOpacity(0.5)
                            : const Color(0xFFFBBF24))
                        : (widget.disabled
                            ? colorScheme.outline.withOpacity(0.5)
                            : colorScheme.outline),
                  ),
                ),
              ),
            );
          }),
        ),
        if (widget.description != null) ...[
          const SizedBox(height: 8),
          Text(
            widget.description!,
            style: TextStyle(
              fontSize: 12,
              color: colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ],
    );
  }

  double _getIconSize() {
    switch (widget.size) {
      case RatingInputSize.sm:
        return 20;
      case RatingInputSize.md:
        return 28;
      case RatingInputSize.lg:
        return 36;
    }
  }
}

/// Rating input sizes matching web app
enum RatingInputSize {
  sm,
  md,
  lg,
}
