import 'package:flutter/material.dart';

/// Empty state widget for displaying when no data is available
class EmptyState extends StatelessWidget {
  final IconData? icon;
  final String? title;
  final String? message;
  final Widget? action;
  final Widget? illustration;
  final double iconSize;

  const EmptyState({
    Key? key,
    this.icon,
    this.title,
    this.message,
    this.action,
    this.illustration,
    this.iconSize = 80,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            if (illustration != null)
              illustration!
            else if (icon != null)
              Icon(
                icon,
                size: iconSize,
                color: Colors.grey.shade400,
              ),
            if (title != null) ...[
              const SizedBox(height: 24),
              Text(
                title!,
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: theme.textTheme.bodyLarge?.color,
                ),
                textAlign: TextAlign.center,
              ),
            ],
            if (message != null) ...[
              const SizedBox(height: 12),
              Text(
                message!,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: Colors.grey.shade600,
                ),
                textAlign: TextAlign.center,
              ),
            ],
            if (action != null) ...[
              const SizedBox(height: 24),
              action!,
            ],
          ],
        ),
      ),
    );
  }
}

/// Pre-defined empty states
class EmptyStateType {
  static Widget noData({
    String? title,
    String? message,
    Widget? action,
  }) {
    return EmptyState(
      icon: Icons.inbox_outlined,
      title: title ?? 'No Data',
      message: message ?? 'There is no data to display',
      action: action,
    );
  }

  static Widget noResults({
    String? title,
    String? message,
    Widget? action,
  }) {
    return EmptyState(
      icon: Icons.search_off,
      title: title ?? 'No Results',
      message: message ?? 'No results found for your search',
      action: action,
    );
  }

  static Widget noNotifications({
    String? title,
    String? message,
    Widget? action,
  }) {
    return EmptyState(
      icon: Icons.notifications_none,
      title: title ?? 'No Notifications',
      message: message ?? 'You have no notifications at this time',
      action: action,
    );
  }

  static Widget error({
    String? title,
    String? message,
    Widget? action,
  }) {
    return EmptyState(
      icon: Icons.error_outline,
      title: title ?? 'Something Went Wrong',
      message: message ?? 'An error occurred. Please try again',
      action: action,
    );
  }

  static Widget offline({
    String? title,
    String? message,
    Widget? action,
  }) {
    return EmptyState(
      icon: Icons.cloud_off,
      title: title ?? 'Offline',
      message: message ?? 'No internet connection',
      action: action,
    );
  }
}
