import 'package:flutter/material.dart';

/// Notification banner widget matching web app design
class NotificationBanner extends StatelessWidget {
  final String message;
  final NotificationBannerType type;
  final IconData? icon;
  final VoidCallback? onClose;
  final List<Widget>? actions;
  final bool showIcon;

  const NotificationBanner({
    Key? key,
    required this.message,
    this.type = NotificationBannerType.info,
    this.icon,
    this.onClose,
    this.actions,
    this.showIcon = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final bannerColor = _getColor();
    final bannerIcon = icon ?? _getDefaultIcon();

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bannerColor.withOpacity(0.1),
        border: Border.all(
          color: bannerColor.withOpacity(0.3),
        ),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          if (showIcon) ...[
            Icon(
              bannerIcon,
              color: bannerColor,
              size: 24,
            ),
            const SizedBox(width: 12),
          ],
          Expanded(
            child: Text(
              message,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: bannerColor,
              ),
            ),
          ),
          if (actions != null) ...actions!,
          if (onClose != null) ...[
            const SizedBox(width: 8),
            IconButton(
              icon: const Icon(Icons.close, size: 20),
              onPressed: onClose,
              color: bannerColor,
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
            ),
          ],
        ],
      ),
    );
  }

  Color _getColor() {
    switch (type) {
      case NotificationBannerType.success:
        return Colors.green;
      case NotificationBannerType.warning:
        return Colors.orange;
      case NotificationBannerType.error:
        return Colors.red;
      case NotificationBannerType.info:
        return Colors.blue;
    }
  }

  IconData _getDefaultIcon() {
    switch (type) {
      case NotificationBannerType.success:
        return Icons.check_circle;
      case NotificationBannerType.warning:
        return Icons.warning;
      case NotificationBannerType.error:
        return Icons.error;
      case NotificationBannerType.info:
        return Icons.info;
    }
  }
}

enum NotificationBannerType {
  success,
  warning,
  error,
  info,
}
