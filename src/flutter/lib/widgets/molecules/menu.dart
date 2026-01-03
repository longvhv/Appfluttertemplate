/// Menu Widget
/// 
/// A flexible menu component with nested items support.
/// 
/// Features:
/// - Context menus
/// - Nested submenus
/// - Icons and shortcuts
/// - Dividers
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppMenu(
///   items: [
///     MenuItem(label: 'Edit', icon: Icons.edit),
///     MenuItem(label: 'Delete', icon: Icons.delete),
///   ],
///   onSelected: (item) => print(item.label),
/// )
/// ```

library;

import 'package:flutter/material.dart';

class MenuItem<T> {
  final String label;
  final IconData? icon;
  final T? value;
  final List<MenuItem<T>>? children;
  final bool enabled;
  final bool isDivider;
  final String? shortcut;

  const MenuItem({
    required this.label,
    this.icon,
    this.value,
    this.children,
    this.enabled = true,
    this.isDivider = false,
    this.shortcut,
  });

  MenuItem.divider()
      : label = '',
        icon = null,
        value = null,
        children = null,
        enabled = false,
        isDivider = true,
        shortcut = null;
}

class AppMenu<T> extends StatelessWidget {
  final List<MenuItem<T>> items;
  final ValueChanged<MenuItem<T>>? onSelected;
  final Widget? child;

  const AppMenu({
    super.key,
    required this.items,
    this.onSelected,
    this.child,
  });

  @override
  Widget build(BuildContext context) {
    return MenuAnchor(
      builder: (context, controller, child) {
        return IconButton(
          icon: this.child ?? const Icon(Icons.more_vert),
          onPressed: () {
            if (controller.isOpen) {
              controller.close();
            } else {
              controller.open();
            }
          },
        );
      },
      menuChildren: items.map((item) => _buildMenuItem(context, item)).toList(),
    );
  }

  Widget _buildMenuItem(BuildContext context, MenuItem<T> item) {
    if (item.isDivider) {
      return const Divider();
    }

    if (item.children != null && item.children!.isNotEmpty) {
      return SubmenuButton(
        leadingIcon: item.icon != null ? Icon(item.icon) : null,
        menuChildren: item.children!
            .map((child) => _buildMenuItem(context, child))
            .toList(),
        child: Text(item.label),
      );
    }

    return MenuItemButton(
      leadingIcon: item.icon != null ? Icon(item.icon) : null,
      trailingIcon: item.shortcut != null
          ? Text(
              item.shortcut!,
              style: Theme.of(context).textTheme.bodySmall,
            )
          : null,
      onPressed: item.enabled
          ? () {
              onSelected?.call(item);
            }
          : null,
      child: Text(item.label),
    );
  }
}

/// Context Menu Widget
class AppContextMenu<T> extends StatelessWidget {
  final List<MenuItem<T>> items;
  final ValueChanged<MenuItem<T>>? onSelected;
  final Widget child;

  const AppContextMenu({
    super.key,
    required this.items,
    required this.child,
    this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onSecondaryTapDown: (details) {
        _showContextMenu(context, details.globalPosition);
      },
      onLongPressStart: (details) {
        _showContextMenu(context, details.globalPosition);
      },
      child: child,
    );
  }

  void _showContextMenu(BuildContext context, Offset position) {
    final RenderBox overlay =
        Overlay.of(context).context.findRenderObject() as RenderBox;

    showMenu<MenuItem<T>>(
      context: context,
      position: RelativeRect.fromRect(
        Rect.fromLTWH(position.dx, position.dy, 0, 0),
        Offset.zero & overlay.size,
      ),
      items: _buildPopupMenuItems(),
    ).then((selectedItem) {
      if (selectedItem != null) {
        onSelected?.call(selectedItem);
      }
    });
  }

  List<PopupMenuEntry<MenuItem<T>>> _buildPopupMenuItems() {
    final List<PopupMenuEntry<MenuItem<T>>> entries = [];

    for (final item in items) {
      if (item.isDivider) {
        entries.add(const PopupMenuDivider());
      } else if (item.children != null && item.children!.isNotEmpty) {
        // Submenu - flatten for popup menu
        entries.add(
          PopupMenuItem<MenuItem<T>>(
            value: item,
            child: Row(
              children: [
                if (item.icon != null) ...[
                  Icon(item.icon, size: 20),
                  const SizedBox(width: 12),
                ],
                Expanded(child: Text(item.label)),
                const Icon(Icons.chevron_right, size: 20),
              ],
            ),
          ),
        );
      } else {
        entries.add(
          PopupMenuItem<MenuItem<T>>(
            value: item,
            enabled: item.enabled,
            child: Row(
              children: [
                if (item.icon != null) ...[
                  Icon(item.icon, size: 20),
                  const SizedBox(width: 12),
                ],
                Expanded(child: Text(item.label)),
                if (item.shortcut != null) ...[
                  const SizedBox(width: 12),
                  Text(
                    item.shortcut!,
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ],
            ),
          ),
        );
      }
    }

    return entries;
  }
}
