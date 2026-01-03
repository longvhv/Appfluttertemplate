import 'package:flutter/material.dart';

/// Divider widget matching web app design
class AppDivider extends StatelessWidget {
  final double? height;
  final double? thickness;
  final Color? color;
  final double? indent;
  final double? endIndent;
  final DividerOrientation orientation;

  const AppDivider({
    Key? key,
    this.height,
    this.thickness,
    this.color,
    this.indent,
    this.endIndent,
    this.orientation = DividerOrientation.horizontal,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (orientation == DividerOrientation.vertical) {
      return VerticalDivider(
        width: height,
        thickness: thickness ?? 1,
        color: color ?? Colors.grey.shade300,
        indent: indent,
        endIndent: endIndent,
      );
    }

    return Divider(
      height: height,
      thickness: thickness ?? 1,
      color: color ?? Colors.grey.shade300,
      indent: indent,
      endIndent: endIndent,
    );
  }
}

enum DividerOrientation {
  horizontal,
  vertical,
}

/// Divider with text
class DividerWithText extends StatelessWidget {
  final String text;
  final Color? color;
  final double? thickness;

  const DividerWithText({
    Key? key,
    required this.text,
    this.color,
    this.thickness,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final dividerColor = color ?? Colors.grey.shade300;

    return Row(
      children: [
        Expanded(
          child: Divider(
            thickness: thickness ?? 1,
            color: dividerColor,
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            text,
            style: theme.textTheme.bodySmall?.copyWith(
              color: Colors.grey.shade600,
            ),
          ),
        ),
        Expanded(
          child: Divider(
            thickness: thickness ?? 1,
            color: dividerColor,
          ),
        ),
      ],
    );
  }
}
