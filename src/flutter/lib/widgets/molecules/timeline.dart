import 'package:flutter/material.dart';

/// Timeline widget matching web app design
class Timeline extends StatelessWidget {
  final List<TimelineItem> items;
  final TimelineOrientation orientation;

  const Timeline({
    Key? key,
    required this.items,
    this.orientation = TimelineOrientation.vertical,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (orientation == TimelineOrientation.horizontal) {
      return SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            for (var i = 0; i < items.length; i++) ...[
              _TimelineItemWidget(
                item: items[i],
                isLast: i == items.length - 1,
                orientation: orientation,
              ),
              if (i < items.length - 1)
                Padding(
                  padding: const EdgeInsets.only(top: 16),
                  child: Container(
                    width: 40,
                    height: 2,
                    color: Colors.grey.shade300,
                  ),
                ),
            ],
          ],
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (var i = 0; i < items.length; i++)
          _TimelineItemWidget(
            item: items[i],
            isLast: i == items.length - 1,
            orientation: orientation,
          ),
      ],
    );
  }
}

class _TimelineItemWidget extends StatelessWidget {
  final TimelineItem item;
  final bool isLast;
  final TimelineOrientation orientation;

  const _TimelineItemWidget({
    required this.item,
    required this.isLast,
    required this.orientation,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (orientation == TimelineOrientation.horizontal) {
      return SizedBox(
        width: 200,
        child: Column(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: item.color ?? theme.colorScheme.primary,
                shape: BoxShape.circle,
              ),
              child: item.icon != null
                  ? Icon(item.icon, size: 16, color: Colors.white)
                  : null,
            ),
            const SizedBox(height: 12),
            Text(
              item.title,
              style: theme.textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
            if (item.subtitle != null) ...[
              const SizedBox(height: 4),
              Text(
                item.subtitle!,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: Colors.grey.shade600,
                ),
                textAlign: TextAlign.center,
              ),
            ],
            if (item.timestamp != null) ...[
              const SizedBox(height: 8),
              Text(
                item.timestamp!,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: Colors.grey.shade500,
                  fontSize: 11,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ],
        ),
      );
    }

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Timeline indicator column
          Column(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: item.color ?? theme.colorScheme.primary,
                  shape: BoxShape.circle,
                ),
                child: item.icon != null
                    ? Icon(item.icon, size: 16, color: Colors.white)
                    : null,
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: Colors.grey.shade300,
                    margin: const EdgeInsets.symmetric(vertical: 8),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 16),
          // Content
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          item.title,
                          style: theme.textTheme.bodyLarge?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      if (item.timestamp != null)
                        Text(
                          item.timestamp!,
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: Colors.grey.shade500,
                          ),
                        ),
                    ],
                  ),
                  if (item.subtitle != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      item.subtitle!,
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                  if (item.content != null) ...[
                    const SizedBox(height: 12),
                    item.content!,
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class TimelineItem {
  final String title;
  final String? subtitle;
  final String? timestamp;
  final Widget? content;
  final IconData? icon;
  final Color? color;

  const TimelineItem({
    required this.title,
    this.subtitle,
    this.timestamp,
    this.content,
    this.icon,
    this.color,
  });
}

enum TimelineOrientation {
  vertical,
  horizontal,
}
