import 'package:flutter/material.dart';

/// Card widget matching web app design
class AppCard extends StatelessWidget {
  final Widget? child;
  final String? title;
  final String? subtitle;
  final Widget? leading;
  final Widget? trailing;
  final List<Widget>? actions;
  final VoidCallback? onTap;
  final EdgeInsets? padding;
  final Color? backgroundColor;
  final double? elevation;
  final BorderRadius? borderRadius;
  final Border? border;
  final bool showDivider;

  const AppCard({
    Key? key,
    this.child,
    this.title,
    this.subtitle,
    this.leading,
    this.trailing,
    this.actions,
    this.onTap,
    this.padding,
    this.backgroundColor,
    this.elevation,
    this.borderRadius,
    this.border,
    this.showDivider = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    Widget cardContent = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (title != null || subtitle != null || leading != null || trailing != null)
          _buildHeader(theme),
        if (showDivider && (title != null || subtitle != null))
          Divider(height: 1, color: Colors.grey.shade300),
        if (child != null)
          Padding(
            padding: padding ?? const EdgeInsets.all(16),
            child: child!,
          ),
        if (actions != null && actions!.isNotEmpty) _buildActions(),
      ],
    );

    return Card(
      elevation: elevation ?? 1,
      color: backgroundColor,
      shape: RoundedRectangleBorder(
        borderRadius: borderRadius ?? BorderRadius.circular(12),
        side: border != null
            ? BorderSide(
                color: border!.top.color,
                width: border!.top.width,
              )
            : BorderSide.none,
      ),
      child: onTap != null
          ? InkWell(
              onTap: onTap,
              borderRadius: borderRadius ?? BorderRadius.circular(12),
              child: cardContent,
            )
          : cardContent,
    );
  }

  Widget _buildHeader(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          if (leading != null) ...[
            leading!,
            const SizedBox(width: 12),
          ],
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                if (title != null)
                  Text(
                    title!,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                if (subtitle != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    subtitle!,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: Colors.grey.shade600,
                    ),
                  ),
                ],
              ],
            ),
          ),
          if (trailing != null) ...[
            const SizedBox(width: 12),
            trailing!,
          ],
        ],
      ),
    );
  }

  Widget _buildActions() {
    return Padding(
      padding: const EdgeInsets.all(16).copyWith(top: 0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: actions!
            .map((action) => Padding(
                  padding: const EdgeInsets.only(left: 8),
                  child: action,
                ))
            .toList(),
      ),
    );
  }
}

/// Stat Card - for displaying statistics
class StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData? icon;
  final Color? iconColor;
  final String? subtitle;
  final String? trend;
  final bool trendIsPositive;
  final VoidCallback? onTap;

  const StatCard({
    Key? key,
    required this.title,
    required this.value,
    this.icon,
    this.iconColor,
    this.subtitle,
    this.trend,
    this.trendIsPositive = true,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AppCard(
      onTap: onTap,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: Colors.grey.shade600,
                ),
              ),
              if (icon != null)
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: (iconColor ?? theme.colorScheme.primary).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    icon,
                    size: 20,
                    color: iconColor ?? theme.colorScheme.primary,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: theme.textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          if (subtitle != null || trend != null) ...[
            const SizedBox(height: 8),
            Row(
              children: [
                if (trend != null) ...[
                  Icon(
                    trendIsPositive ? Icons.trending_up : Icons.trending_down,
                    size: 16,
                    color: trendIsPositive ? Colors.green : Colors.red,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    trend!,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: trendIsPositive ? Colors.green : Colors.red,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (subtitle != null) const SizedBox(width: 8),
                ],
                if (subtitle != null)
                  Expanded(
                    child: Text(
                      subtitle!,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
