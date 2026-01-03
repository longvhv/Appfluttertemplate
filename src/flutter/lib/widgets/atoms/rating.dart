import 'package:flutter/material.dart';

/// Rating widget matching web app design
class AppRating extends StatelessWidget {
  final double value;
  final ValueChanged<double>? onChanged;
  final int maxRating;
  final double size;
  final Color? color;
  final Color? unratedColor;
  final IconData? icon;
  final bool allowHalfRating;
  final bool readOnly;

  const AppRating({
    Key? key,
    required this.value,
    this.onChanged,
    this.maxRating = 5,
    this.size = 24,
    this.color,
    this.unratedColor,
    this.icon,
    this.allowHalfRating = false,
    this.readOnly = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final activeColor = color ?? Colors.amber;
    final inactiveColor = unratedColor ?? Colors.grey.shade300;
    final starIcon = icon ?? Icons.star;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(maxRating, (index) {
        final starValue = index + 1;
        final fillPercentage = _calculateFillPercentage(starValue);

        return GestureDetector(
          onTap: readOnly
              ? null
              : () {
                  if (onChanged != null) {
                    onChanged!(starValue.toDouble());
                  }
                },
          child: Stack(
            children: [
              // Background (unfilled) star
              Icon(
                starIcon,
                size: size,
                color: inactiveColor,
              ),
              // Foreground (filled) star with clip
              if (fillPercentage > 0)
                ClipRect(
                  clipper: _StarClipper(fillPercentage),
                  child: Icon(
                    starIcon,
                    size: size,
                    color: activeColor,
                  ),
                ),
            ],
          ),
        );
      }),
    );
  }

  double _calculateFillPercentage(int starValue) {
    if (value >= starValue) {
      return 1.0;
    } else if (allowHalfRating && value > starValue - 1) {
      return value - (starValue - 1);
    }
    return 0.0;
  }
}

class _StarClipper extends CustomClipper<Rect> {
  final double fillPercentage;

  _StarClipper(this.fillPercentage);

  @override
  Rect getClip(Size size) {
    return Rect.fromLTWH(0, 0, size.width * fillPercentage, size.height);
  }

  @override
  bool shouldReclip(_StarClipper oldClipper) {
    return fillPercentage != oldClipper.fillPercentage;
  }
}

/// Rating input with interaction
class RatingInput extends StatefulWidget {
  final double initialValue;
  final ValueChanged<double> onChanged;
  final int maxRating;
  final double size;
  final Color? color;
  final bool allowHalfRating;

  const RatingInput({
    Key? key,
    this.initialValue = 0,
    required this.onChanged,
    this.maxRating = 5,
    this.size = 32,
    this.color,
    this.allowHalfRating = true,
  }) : super(key: key);

  @override
  State<RatingInput> createState() => _RatingInputState();
}

class _RatingInputState extends State<RatingInput> {
  late double _currentValue;

  @override
  void initState() {
    super.initState();
    _currentValue = widget.initialValue;
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(widget.maxRating, (index) {
        final starValue = index + 1;

        return GestureDetector(
          onTap: () {
            setState(() {
              _currentValue = starValue.toDouble();
            });
            widget.onChanged(_currentValue);
          },
          onPanUpdate: widget.allowHalfRating
              ? (details) {
                  final RenderBox box = context.findRenderObject() as RenderBox;
                  final position = box.globalToLocal(details.globalPosition);
                  final starWidth = box.size.width / widget.maxRating;
                  final newValue = (position.dx / starWidth).clamp(0, widget.maxRating.toDouble());
                  
                  if (widget.allowHalfRating) {
                    final roundedValue = (newValue * 2).round() / 2;
                    if (roundedValue != _currentValue) {
                      setState(() {
                        _currentValue = roundedValue;
                      });
                      widget.onChanged(_currentValue);
                    }
                  }
                }
              : null,
          child: Icon(
            Icons.star,
            size: widget.size,
            color: _currentValue >= starValue
                ? (widget.color ?? Colors.amber)
                : Colors.grey.shade300,
          ),
        );
      }),
    );
  }
}
