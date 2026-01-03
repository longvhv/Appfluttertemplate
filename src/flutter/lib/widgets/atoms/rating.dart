import 'package:flutter/material.dart';

/// Rating widget matching web app design
/// 
/// Matches web Rating component with all features:
/// - 3 sizes: sm, md, lg
/// - Interactive/readonly modes
/// - Show value option
/// - Custom max rating
/// - Custom colors
class AppRating extends StatefulWidget {
  final double value;
  final ValueChanged<double>? onChanged;
  final int max;
  final bool readonly;
  final RatingSize size;
  final bool showValue;
  final Color? color;
  final Color? emptyColor;

  const AppRating({
    super.key,
    required this.value,
    this.onChanged,
    this.max = 5,
    this.readonly = false,
    this.size = RatingSize.md,
    this.showValue = false,
    this.color,
    this.emptyColor,
  });

  /// Small rating
  const AppRating.sm({
    super.key,
    required this.value,
    this.onChanged,
    this.max = 5,
    this.readonly = false,
    this.showValue = false,
    this.color,
    this.emptyColor,
  }) : size = RatingSize.sm;

  /// Medium rating
  const AppRating.md({
    super.key,
    required this.value,
    this.onChanged,
    this.max = 5,
    this.readonly = false,
    this.showValue = false,
    this.color,
    this.emptyColor,
  }) : size = RatingSize.md;

  /// Large rating
  const AppRating.lg({
    super.key,
    required this.value,
    this.onChanged,
    this.max = 5,
    this.readonly = false,
    this.showValue = false,
    this.color,
    this.emptyColor,
  }) : size = RatingSize.lg;

  @override
  State<AppRating> createState() => _AppRatingState();
}

class _AppRatingState extends State<AppRating> {
  double? _hoverValue;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final isInteractive = !widget.readonly && widget.onChanged != null;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Rating stars
        Row(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(widget.max, (index) {
            final displayValue = _hoverValue ?? widget.value;
            final isFilled = displayValue >= (index + 1);
            final isHalfFilled = displayValue > index && displayValue < (index + 1);

            return GestureDetector(
              onTap: isInteractive
                  ? () {
                      widget.onChanged!(index + 1.0);
                      setState(() => _hoverValue = null);
                    }
                  : null,
              child: MouseRegion(
                onEnter: isInteractive
                    ? (_) => setState(() => _hoverValue = index + 1.0)
                    : null,
                onExit: isInteractive ? (_) => setState(() => _hoverValue = null) : null,
                cursor: isInteractive ? SystemMouseCursors.click : SystemMouseCursors.basic,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 2),
                  child: Icon(
                    isFilled || isHalfFilled ? Icons.star : Icons.star_border,
                    size: _getIconSize(),
                    color: isFilled || isHalfFilled
                        ? (widget.color ?? const Color(0xFFFBBF24)) // Yellow-400
                        : (widget.emptyColor ?? colorScheme.outline),
                  ),
                ),
              ),
            );
          }),
        ),

        // Show value
        if (widget.showValue) ...[
          const SizedBox(width: 8),
          Text(
            widget.value.toStringAsFixed(1),
            style: TextStyle(
              fontSize: _getTextSize(),
              fontWeight: FontWeight.w600,
              color: colorScheme.onSurface,
            ),
          ),
        ],
      ],
    );
  }

  double _getIconSize() {
    switch (widget.size) {
      case RatingSize.sm:
        return 16;
      case RatingSize.md:
        return 24;
      case RatingSize.lg:
        return 32;
    }
  }

  double _getTextSize() {
    switch (widget.size) {
      case RatingSize.sm:
        return 12;
      case RatingSize.md:
        return 14;
      case RatingSize.lg:
        return 16;
    }
  }
}

/// Rating sizes matching web app
enum RatingSize {
  sm,
  md,
  lg,
}