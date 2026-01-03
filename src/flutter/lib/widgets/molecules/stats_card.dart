import 'package:flutter/material.dart';

/// StatsCard widget matching web app design
/// 
/// Matches web StatsCard component with all features:
/// - 6 colors: primary, success, warning, error, info, default
/// - 3 variants: default, gradient, outlined
/// - 3 sizes: sm, md, lg
/// - Trend indicator (up/down/neutral)
/// - Icon support
/// - Footer support
/// - Click action
class StatsCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData? icon;
  final StatsTrend? trend;
  final StatsCardColor color;
  final StatsCardVariant variant;
  final StatsCardSize size;
  final Widget? footer;
  final VoidCallback? onTap;

  const StatsCard({
    super.key,
    required this.label,
    required this.value,
    this.icon,
    this.trend,
    this.color = StatsCardColor.primary,
    this.variant = StatsCardVariant.defaultVariant,
    this.size = StatsCardSize.md,
    this.footer,
    this.onTap,
  });

  /// Primary stats card
  const StatsCard.primary({
    super.key,
    required this.label,
    required this.value,
    this.icon,
    this.trend,
    this.variant = StatsCardVariant.defaultVariant,
    this.size = StatsCardSize.md,
    this.footer,
    this.onTap,
  }) : color = StatsCardColor.primary;

  /// Success stats card
  const StatsCard.success({
    super.key,
    required this.label,
    required this.value,
    this.icon,
    this.trend,
    this.variant = StatsCardVariant.defaultVariant,
    this.size = StatsCardSize.md,
    this.footer,
    this.onTap,
  }) : color = StatsCardColor.success;

  /// Warning stats card
  const StatsCard.warning({
    super.key,
    required this.label,
    required this.value,
    this.icon,
    this.trend,
    this.variant = StatsCardVariant.defaultVariant,
    this.size = StatsCardSize.md,
    this.footer,
    this.onTap,
  }) : color = StatsCardColor.warning;

  /// Error stats card
  const StatsCard.error({
    super.key,
    required this.label,
    required this.value,
    this.icon,
    this.trend,
    this.variant = StatsCardVariant.defaultVariant,
    this.size = StatsCardSize.md,
    this.footer,
    this.onTap,
  }) : color = StatsCardColor.error;

  /// Info stats card
  const StatsCard.info({
    super.key,
    required this.label,
    required this.value,
    this.icon,
    this.trend,
    this.variant = StatsCardVariant.defaultVariant,
    this.size = StatsCardSize.md,
    this.footer,
    this.onTap,
  }) : color = StatsCardColor.info;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    final card = Container(
      padding: _getPadding(),
      decoration: _getDecoration(colorScheme),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // Icon and Label Row
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      label,
                      style: TextStyle(
                        fontSize: _getLabelFontSize(),
                        color: colorScheme.onSurfaceVariant,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      value,
                      style: TextStyle(
                        fontSize: _getValueFontSize(),
                        fontWeight: FontWeight.bold,
                        color: colorScheme.onSurface,
                      ),
                    ),
                  ],
                ),
              ),
              if (icon != null) ...[
                const SizedBox(width: 16),
                Container(
                  width: _getIconContainerSize(),
                  height: _getIconContainerSize(),
                  decoration: BoxDecoration(
                    color: _getIconBackgroundColor(),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    icon,
                    size: _getIconSize(),
                    color: _getIconColor(),
                  ),
                ),
              ],
            ],
          ),

          // Trend
          if (trend != null) ...[
            const SizedBox(height: 12),
            Row(
              children: [
                Icon(
                  _getTrendIcon(),
                  size: _getTrendIconSize(),
                  color: _getTrendColor(),
                ),
                const SizedBox(width: 4),
                Text(
                  '${trend!.value > 0 ? '+' : ''}${trend!.value}%',
                  style: TextStyle(
                    fontSize: _getTrendFontSize(),
                    color: _getTrendColor(),
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (trend!.label != null) ...[
                  const SizedBox(width: 4),
                  Text(
                    trend!.label!,
                    style: TextStyle(
                      fontSize: _getTrendFontSize(),
                      color: colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ],
            ),
          ],

          // Footer
          if (footer != null) ...[
            const SizedBox(height: 12),
            footer!,
          ],
        ],
      ),
    );

    if (onTap != null) {
      return InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: card,
      );
    }

    return card;
  }

  BoxDecoration _getDecoration(ColorScheme colorScheme) {
    switch (variant) {
      case StatsCardVariant.defaultVariant:
        return BoxDecoration(
          color: colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: colorScheme.outline.withOpacity(0.2)),
        );
      case StatsCardVariant.gradient:
        return BoxDecoration(
          gradient: _getGradient(),
          borderRadius: BorderRadius.circular(12),
        );
      case StatsCardVariant.outlined:
        return BoxDecoration(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: _getIconColor(), width: 2),
        );
    }
  }

  LinearGradient _getGradient() {
    switch (color) {
      case StatsCardColor.primary:
        return const LinearGradient(
          colors: [Color(0xFF6366F1), Color(0xFF9333EA)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        );
      case StatsCardColor.success:
        return const LinearGradient(
          colors: [Color(0xFF22C55E), Color(0xFF10B981)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        );
      case StatsCardColor.warning:
        return const LinearGradient(
          colors: [Color(0xFFFBBF24), Color(0xFFF97316)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        );
      case StatsCardColor.error:
        return const LinearGradient(
          colors: [Color(0xFFEF4444), Color(0xFFEC4899)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        );
      case StatsCardColor.info:
        return const LinearGradient(
          colors: [Color(0xFF3B82F6), Color(0xFF06B6D4)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        );
      case StatsCardColor.defaultColor:
        return const LinearGradient(
          colors: [Color(0xFF6B7280), Color(0xFF9CA3AF)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        );
    }
  }

  Color _getIconBackgroundColor() {
    switch (color) {
      case StatsCardColor.primary:
        return const Color(0xFFEEF2FF); // Indigo-50
      case StatsCardColor.success:
        return const Color(0xFFDCFCE7); // Green-50
      case StatsCardColor.warning:
        return const Color(0xFFFEF3C7); // Yellow-50
      case StatsCardColor.error:
        return const Color(0xFFFEE2E2); // Red-50
      case StatsCardColor.info:
        return const Color(0xFFDBEAFE); // Blue-50
      case StatsCardColor.defaultColor:
        return const Color(0xFFF3F4F6); // Gray-50
    }
  }

  Color _getIconColor() {
    switch (color) {
      case StatsCardColor.primary:
        return const Color(0xFF6366F1); // Indigo-600
      case StatsCardColor.success:
        return const Color(0xFF22C55E); // Green-600
      case StatsCardColor.warning:
        return const Color(0xFFFBBF24); // Yellow-600
      case StatsCardColor.error:
        return const Color(0xFFEF4444); // Red-600
      case StatsCardColor.info:
        return const Color(0xFF3B82F6); // Blue-600
      case StatsCardColor.defaultColor:
        return const Color(0xFF6B7280); // Gray-600
    }
  }

  Color _getTrendColor() {
    if (trend!.direction == TrendDirection.up) {
      return const Color(0xFF22C55E); // Green-600
    } else if (trend!.direction == TrendDirection.down) {
      return const Color(0xFFEF4444); // Red-600
    }
    return const Color(0xFF6B7280); // Gray-600
  }

  IconData _getTrendIcon() {
    if (trend!.direction == TrendDirection.up) {
      return Icons.trending_up;
    } else if (trend!.direction == TrendDirection.down) {
      return Icons.trending_down;
    }
    return Icons.remove;
  }

  EdgeInsets _getPadding() {
    switch (size) {
      case StatsCardSize.sm:
        return const EdgeInsets.all(16);
      case StatsCardSize.md:
        return const EdgeInsets.all(24);
      case StatsCardSize.lg:
        return const EdgeInsets.all(32);
    }
  }

  double _getIconContainerSize() {
    switch (size) {
      case StatsCardSize.sm:
        return 40;
      case StatsCardSize.md:
        return 48;
      case StatsCardSize.lg:
        return 64;
    }
  }

  double _getIconSize() {
    switch (size) {
      case StatsCardSize.sm:
        return 20;
      case StatsCardSize.md:
        return 24;
      case StatsCardSize.lg:
        return 32;
    }
  }

  double _getValueFontSize() {
    switch (size) {
      case StatsCardSize.sm:
        return 20;
      case StatsCardSize.md:
        return 30;
      case StatsCardSize.lg:
        return 36;
    }
  }

  double _getLabelFontSize() {
    switch (size) {
      case StatsCardSize.sm:
        return 12;
      case StatsCardSize.md:
        return 14;
      case StatsCardSize.lg:
        return 16;
    }
  }

  double _getTrendFontSize() {
    switch (size) {
      case StatsCardSize.sm:
        return 12;
      case StatsCardSize.md:
        return 14;
      case StatsCardSize.lg:
        return 16;
    }
  }

  double _getTrendIconSize() {
    switch (size) {
      case StatsCardSize.sm:
        return 14;
      case StatsCardSize.md:
        return 16;
      case StatsCardSize.lg:
        return 18;
    }
  }
}

/// Stats card colors matching web app
enum StatsCardColor {
  primary,
  success,
  warning,
  error,
  info,
  defaultColor,
}

/// Stats card variants matching web app
enum StatsCardVariant {
  defaultVariant,
  gradient,
  outlined,
}

/// Stats card sizes matching web app
enum StatsCardSize {
  sm,
  md,
  lg,
}

/// Stats trend data
class StatsTrend {
  final double value;
  final String? label;
  final TrendDirection direction;

  const StatsTrend({
    required this.value,
    this.label,
    required this.direction,
  });

  /// Auto-detect direction from value
  factory StatsTrend.auto({
    required double value,
    String? label,
  }) {
    TrendDirection direction;
    if (value > 0) {
      direction = TrendDirection.up;
    } else if (value < 0) {
      direction = TrendDirection.down;
    } else {
      direction = TrendDirection.neutral;
    }

    return StatsTrend(
      value: value,
      label: label,
      direction: direction,
    );
  }
}

/// Trend directions
enum TrendDirection {
  up,
  down,
  neutral,
}

/// Stats group widget
class StatsGroup extends StatelessWidget {
  final List<StatsCard> stats;
  final int columns;

  const StatsGroup({
    super.key,
    required this.stats,
    this.columns = 3,
  });

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: columns,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 1.5,
      ),
      itemCount: stats.length,
      itemBuilder: (context, index) => stats[index],
    );
  }
}
