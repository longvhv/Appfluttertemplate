import 'package:flutter/material.dart';

/// Breadcrumbs widget matching web app design
class Breadcrumbs extends StatelessWidget {
  final List<BreadcrumbItem> items;
  final Widget? separator;
  final int? maxItems;

  const Breadcrumbs({
    Key? key,
    required this.items,
    this.separator,
    this.maxItems,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final displayItems = _getDisplayItems();
    final separatorWidget = separator ?? Icon(
      Icons.chevron_right,
      size: 16,
      color: Colors.grey.shade600,
    );

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          for (var i = 0; i < displayItems.length; i++) ...[
            if (i > 0) ...[
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: separatorWidget,
              ),
            ],
            _BreadcrumbItemWidget(
              item: displayItems[i],
              isLast: i == displayItems.length - 1,
            ),
          ],
        ],
      ),
    );
  }

  List<BreadcrumbItem> _getDisplayItems() {
    if (maxItems == null || items.length <= maxItems!) {
      return items;
    }

    // Show first, ellipsis, and last items
    return [
      items.first,
      BreadcrumbItem(label: '...', onTap: null),
      ...items.skip(items.length - (maxItems! - 1)),
    ];
  }
}

class _BreadcrumbItemWidget extends StatelessWidget {
  final BreadcrumbItem item;
  final bool isLast;

  const _BreadcrumbItemWidget({
    required this.item,
    required this.isLast,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    Widget content = Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (item.icon != null) ...[
          Icon(
            item.icon,
            size: 16,
            color: isLast ? theme.colorScheme.primary : Colors.grey.shade600,
          ),
          const SizedBox(width: 6),
        ],
        Text(
          item.label,
          style: theme.textTheme.bodyMedium?.copyWith(
            color: isLast ? theme.colorScheme.primary : Colors.grey.shade600,
            fontWeight: isLast ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
      ],
    );

    if (!isLast && item.onTap != null) {
      return InkWell(
        onTap: item.onTap,
        borderRadius: BorderRadius.circular(4),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
          child: content,
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
      child: content,
    );
  }
}

class BreadcrumbItem {
  final String label;
  final IconData? icon;
  final VoidCallback? onTap;

  const BreadcrumbItem({
    required this.label,
    this.icon,
    this.onTap,
  });
}
