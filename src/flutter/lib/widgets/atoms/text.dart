import 'package:flutter/material.dart';

/// Custom Text widget with consistent styling
/// 
/// Provides:
/// - Multiple text variants (h1, h2, h3, body, caption, etc.)
/// - Color variants
/// - Weight variants
/// - Responsive text sizing
class AppText extends StatelessWidget {
  final String text;
  final TextVariant variant;
  final Color? color;
  final FontWeight? fontWeight;
  final TextAlign? textAlign;
  final int? maxLines;
  final TextOverflow? overflow;
  final bool? softWrap;
  final TextDecoration? decoration;

  const AppText(
    this.text, {
    super.key,
    this.variant = TextVariant.body,
    this.color,
    this.fontWeight,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.softWrap,
    this.decoration,
  });

  /// Heading 1
  const AppText.h1(
    this.text, {
    super.key,
    this.color,
    this.fontWeight,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.softWrap,
    this.decoration,
  }) : variant = TextVariant.h1;

  /// Heading 2
  const AppText.h2(
    this.text, {
    super.key,
    this.color,
    this.fontWeight,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.softWrap,
    this.decoration,
  }) : variant = TextVariant.h2;

  /// Heading 3
  const AppText.h3(
    this.text, {
    super.key,
    this.color,
    this.fontWeight,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.softWrap,
    this.decoration,
  }) : variant = TextVariant.h3;

  /// Body text
  const AppText.body(
    this.text, {
    super.key,
    this.color,
    this.fontWeight,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.softWrap,
    this.decoration,
  }) : variant = TextVariant.body;

  /// Caption text
  const AppText.caption(
    this.text, {
    super.key,
    this.color,
    this.fontWeight,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.softWrap,
    this.decoration,
  }) : variant = TextVariant.caption;

  /// Small text
  const AppText.small(
    this.text, {
    super.key,
    this.color,
    this.fontWeight,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.softWrap,
    this.decoration,
  }) : variant = TextVariant.small;

  /// Button text
  const AppText.button(
    this.text, {
    super.key,
    this.color,
    this.fontWeight,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.softWrap,
    this.decoration,
  }) : variant = TextVariant.button;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    TextStyle? baseStyle;
    switch (variant) {
      case TextVariant.h1:
        baseStyle = theme.textTheme.displayLarge;
        break;
      case TextVariant.h2:
        baseStyle = theme.textTheme.displayMedium;
        break;
      case TextVariant.h3:
        baseStyle = theme.textTheme.displaySmall;
        break;
      case TextVariant.body:
        baseStyle = theme.textTheme.bodyLarge;
        break;
      case TextVariant.caption:
        baseStyle = theme.textTheme.bodySmall;
        break;
      case TextVariant.small:
        baseStyle = theme.textTheme.labelSmall;
        break;
      case TextVariant.button:
        baseStyle = theme.textTheme.labelLarge;
        break;
    }

    return Text(
      text,
      style: baseStyle?.copyWith(
        color: color,
        fontWeight: fontWeight,
        decoration: decoration,
      ),
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
      softWrap: softWrap,
    );
  }
}

/// Text variants
enum TextVariant {
  h1,
  h2,
  h3,
  body,
  caption,
  small,
  button,
}
