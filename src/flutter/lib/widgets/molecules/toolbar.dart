import 'package:flutter/material.dart';

/// Toolbar widget matching web app design
class AppToolbar extends StatelessWidget {
  final List<ToolbarItem> items;
  final Color? backgroundColor;
  final double height;
  final EdgeInsets padding;

  const AppToolbar({
    Key? key,
    required this.items,
    this.backgroundColor,
    this.height = 56,
    this.padding = const EdgeInsets.symmetric(horizontal: 16),
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      padding: padding,
      decoration: BoxDecoration(
        color: backgroundColor ?? Theme.of(context).colorScheme.surface,
        border: Border(
          bottom: BorderSide(
            color: Colors.grey.shade300,
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: items.map((item) {
          if (item.type == ToolbarItemType.separator) {
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Container(
                width: 1,
                height: 24,
                color: Colors.grey.shade300,
              ),
            );
          }

          if (item.type == ToolbarItemType.spacer) {
            return const Spacer();
          }

          return _ToolbarButton(item: item);
        }).toList(),
      ),
    );
  }
}

class _ToolbarButton extends StatelessWidget {
  final ToolbarItem item;

  const _ToolbarButton({required this.item});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (item.widget != null) {
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 4),
        child: item.widget!,
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Tooltip(
        message: item.tooltip ?? item.label ?? '',
        child: Material(
          color: item.isActive == true
              ? theme.colorScheme.primary.withOpacity(0.1)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(6),
          child: InkWell(
            onTap: item.enabled ? item.onTap : null,
            borderRadius: BorderRadius.circular(6),
            child: Container(
              padding: const EdgeInsets.all(8),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (item.icon != null)
                    Icon(
                      item.icon,
                      size: 20,
                      color: item.enabled
                          ? (item.isActive == true
                              ? theme.colorScheme.primary
                              : Colors.grey.shade700)
                          : Colors.grey.shade400,
                    ),
                  if (item.icon != null && item.label != null)
                    const SizedBox(width: 6),
                  if (item.label != null)
                    Text(
                      item.label!,
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: item.enabled
                            ? (item.isActive == true
                                ? theme.colorScheme.primary
                                : Colors.grey.shade700)
                            : Colors.grey.shade400,
                        fontWeight: item.isActive == true
                            ? FontWeight.w600
                            : FontWeight.normal,
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class ToolbarItem {
  final ToolbarItemType type;
  final IconData? icon;
  final String? label;
  final String? tooltip;
  final VoidCallback? onTap;
  final bool enabled;
  final bool? isActive;
  final Widget? widget;

  const ToolbarItem({
    this.type = ToolbarItemType.button,
    this.icon,
    this.label,
    this.tooltip,
    this.onTap,
    this.enabled = true,
    this.isActive,
    this.widget,
  });

  const ToolbarItem.separator()
      : type = ToolbarItemType.separator,
        icon = null,
        label = null,
        tooltip = null,
        onTap = null,
        enabled = true,
        isActive = null,
        widget = null;

  const ToolbarItem.spacer()
      : type = ToolbarItemType.spacer,
        icon = null,
        label = null,
        tooltip = null,
        onTap = null,
        enabled = true,
        isActive = null,
        widget = null;

  const ToolbarItem.custom({required Widget widget})
      : type = ToolbarItemType.custom,
        icon = null,
        label = null,
        tooltip = null,
        onTap = null,
        enabled = true,
        isActive = null,
        widget = widget;
}

enum ToolbarItemType {
  button,
  separator,
  spacer,
  custom,
}
