import 'package:flutter/material.dart';

/// Navbar widget matching web app design
class AppNavbar extends StatelessWidget implements PreferredSizeWidget {
  final String? title;
  final Widget? titleWidget;
  final Widget? leading;
  final List<Widget>? actions;
  final bool centerTitle;
  final Color? backgroundColor;
  final double elevation;
  final PreferredSizeWidget? bottom;

  const AppNavbar({
    Key? key,
    this.title,
    this.titleWidget,
    this.leading,
    this.actions,
    this.centerTitle = true,
    this.backgroundColor,
    this.elevation = 0,
    this.bottom,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: titleWidget ?? (title != null ? Text(title!) : null),
      leading: leading,
      actions: actions,
      centerTitle: centerTitle,
      backgroundColor: backgroundColor,
      elevation: elevation,
      bottom: bottom,
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(
        kToolbarHeight + (bottom?.preferredSize.height ?? 0.0),
      );
}

/// Bottom navigation bar
class AppBottomNavbar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final List<BottomNavItem> items;
  final Color? selectedColor;
  final Color? unselectedColor;
  final bool showLabels;

  const AppBottomNavbar({
    Key? key,
    required this.currentIndex,
    required this.onTap,
    required this.items,
    this.selectedColor,
    this.unselectedColor,
    this.showLabels = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: onTap,
      selectedItemColor: selectedColor ?? theme.colorScheme.primary,
      unselectedItemColor: unselectedColor ?? Colors.grey.shade600,
      showSelectedLabels: showLabels,
      showUnselectedLabels: showLabels,
      type: BottomNavigationBarType.fixed,
      items: items
          .map((item) => BottomNavigationBarItem(
                icon: item.badge != null
                    ? Badge(
                        label: Text(item.badge!),
                        child: Icon(item.icon),
                      )
                    : Icon(item.icon),
                activeIcon: item.activeIcon != null
                    ? Icon(item.activeIcon)
                    : Icon(item.icon),
                label: item.label,
              ))
          .toList(),
    );
  }
}

class BottomNavItem {
  final IconData icon;
  final IconData? activeIcon;
  final String label;
  final String? badge;

  const BottomNavItem({
    required this.icon,
    this.activeIcon,
    required this.label,
    this.badge,
  });
}
