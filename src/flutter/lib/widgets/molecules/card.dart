import 'package:flutter/material.dart';

/// Card widget matching web app design
/// 
/// Matches web Card component with all features:
/// - 4 variants: default, elevated, outlined, filled
/// - 5 padding sizes: none, sm, md, lg, xl
/// - Hover effect support
/// - Pressable/clickable
/// - Sub-components: CardHeader, CardBody, CardFooter
class AppCard extends StatelessWidget {
  final Widget child;
  final CardVariant variant;
  final CardPadding padding;
  final bool hover;
  final bool pressable;
  final VoidCallback? onPress;
  final Color? backgroundColor;
  final BorderRadius? borderRadius;

  const AppCard({
    super.key,
    required this.child,
    this.variant = CardVariant.defaultVariant,
    this.padding = CardPadding.md,
    this.hover = false,
    this.pressable = false,
    this.onPress,
    this.backgroundColor,
    this.borderRadius,
  });

  /// Default card variant
  const AppCard.defaultVariant({
    super.key,
    required this.child,
    this.padding = CardPadding.md,
    this.hover = false,
    this.pressable = false,
    this.onPress,
    this.backgroundColor,
    this.borderRadius,
  }) : variant = CardVariant.defaultVariant;

  /// Elevated card variant
  const AppCard.elevated({
    super.key,
    required this.child,
    this.padding = CardPadding.md,
    this.hover = false,
    this.pressable = false,
    this.onPress,
    this.backgroundColor,
    this.borderRadius,
  }) : variant = CardVariant.elevated;

  /// Outlined card variant
  const AppCard.outlined({
    super.key,
    required this.child,
    this.padding = CardPadding.md,
    this.hover = false,
    this.pressable = false,
    this.onPress,
    this.backgroundColor,
    this.borderRadius,
  }) : variant = CardVariant.outlined;

  /// Filled card variant
  const AppCard.filled({
    super.key,
    required this.child,
    this.padding = CardPadding.md,
    this.hover = false,
    this.pressable = false,
    this.onPress,
    this.backgroundColor,
    this.borderRadius,
  }) : variant = CardVariant.filled;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Card(
      elevation: _getElevation(),
      color: backgroundColor ?? _getBackgroundColor(colorScheme),
      shadowColor: colorScheme.shadow.withOpacity(0.1),
      shape: RoundedRectangleBorder(
        borderRadius: borderRadius ?? BorderRadius.circular(12),
        side: variant == CardVariant.outlined
            ? BorderSide(
                color: colorScheme.outline,
                width: 2,
              )
            : BorderSide.none,
      ),
      child: InkWell(
        onTap: pressable || onPress != null ? onPress : null,
        borderRadius: borderRadius ?? BorderRadius.circular(12),
        child: Container(
          padding: _getPadding(),
          child: child,
        ),
      ),
    );
  }

  double _getElevation() {
    switch (variant) {
      case CardVariant.defaultVariant:
        return hover ? 4 : 1;
      case CardVariant.elevated:
        return hover ? 8 : 4;
      case CardVariant.outlined:
      case CardVariant.filled:
        return 0;
    }
  }

  Color _getBackgroundColor(ColorScheme colorScheme) {
    switch (variant) {
      case CardVariant.defaultVariant:
      case CardVariant.elevated:
        return colorScheme.surface;
      case CardVariant.outlined:
        return Colors.transparent;
      case CardVariant.filled:
        return colorScheme.surfaceVariant;
    }
  }

  EdgeInsets _getPadding() {
    switch (padding) {
      case CardPadding.none:
        return EdgeInsets.zero;
      case CardPadding.sm:
        return const EdgeInsets.all(12);
      case CardPadding.md:
        return const EdgeInsets.all(16);
      case CardPadding.lg:
        return const EdgeInsets.all(24);
      case CardPadding.xl:
        return const EdgeInsets.all(32);
    }
  }
}

/// Card variants matching web app
enum CardVariant {
  defaultVariant,
  elevated,
  outlined,
  filled,
}

/// Card padding sizes matching web app
enum CardPadding {
  none,
  sm,
  md,
  lg,
  xl,
}

/// Card Header sub-component
class CardHeader extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;

  const CardHeader({
    super.key,
    required this.child,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: padding ?? const EdgeInsets.only(bottom: 16),
      child: child,
    );
  }
}

/// Card Body sub-component
class CardBody extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;

  const CardBody({
    super.key,
    required this.child,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: padding ?? EdgeInsets.zero,
      child: child,
    );
  }
}

/// Card Footer sub-component
class CardFooter extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;

  const CardFooter({
    super.key,
    required this.child,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: padding ?? const EdgeInsets.only(top: 16),
      child: child,
    );
  }
}