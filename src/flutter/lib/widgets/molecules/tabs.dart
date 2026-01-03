import 'package:flutter/material.dart';

/// Custom tabs widget matching web app design
class AppTabs extends StatelessWidget {
  final List<AppTab> tabs;
  final int currentIndex;
  final ValueChanged<int> onChanged;
  final TabVariant variant;
  final bool isScrollable;

  const AppTabs({
    Key? key,
    required this.tabs,
    required this.currentIndex,
    required this.onChanged,
    this.variant = TabVariant.underline,
    this.isScrollable = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    switch (variant) {
      case TabVariant.underline:
        return _buildUnderlineTabs(theme);
      case TabVariant.pills:
        return _buildPillTabs(theme);
      case TabVariant.segmented:
        return _buildSegmentedTabs(theme);
    }
  }

  Widget _buildUnderlineTabs(ThemeData theme) {
    return TabBar(
      tabs: tabs.map((tab) => Tab(
        icon: tab.icon != null ? Icon(tab.icon) : null,
        text: tab.label,
      )).toList(),
      isScrollable: isScrollable,
      onTap: onChanged,
      labelColor: theme.colorScheme.primary,
      unselectedLabelColor: Colors.grey.shade600,
      indicatorColor: theme.colorScheme.primary,
      indicatorWeight: 3,
    );
  }

  Widget _buildPillTabs(ThemeData theme) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: List.generate(tabs.length, (index) {
          final tab = tabs[index];
          final isSelected = index == currentIndex;

          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: Material(
              color: isSelected
                  ? theme.colorScheme.primary
                  : Colors.grey.shade200,
              borderRadius: BorderRadius.circular(20),
              child: InkWell(
                onTap: () => onChanged(index),
                borderRadius: BorderRadius.circular(20),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (tab.icon != null) ...[
                        Icon(
                          tab.icon,
                          size: 18,
                          color: isSelected ? Colors.white : Colors.grey.shade700,
                        ),
                        const SizedBox(width: 6),
                      ],
                      Text(
                        tab.label,
                        style: TextStyle(
                          color: isSelected ? Colors.white : Colors.grey.shade700,
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                        ),
                      ),
                      if (tab.badge != null) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? Colors.white.withOpacity(0.3)
                                : theme.colorScheme.primary,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            tab.badge!,
                            style: TextStyle(
                              color: isSelected
                                  ? Colors.white
                                  : Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          );
        }),
      ),
    );
  }

  Widget _buildSegmentedTabs(ThemeData theme) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        borderRadius: BorderRadius.circular(8),
      ),
      padding: const EdgeInsets.all(4),
      child: Row(
        children: List.generate(tabs.length, (index) {
          final tab = tabs[index];
          final isSelected = index == currentIndex;

          return Expanded(
            child: Material(
              color: isSelected ? Colors.white : Colors.transparent,
              borderRadius: BorderRadius.circular(6),
              elevation: isSelected ? 1 : 0,
              child: InkWell(
                onTap: () => onChanged(index),
                borderRadius: BorderRadius.circular(6),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (tab.icon != null) ...[
                        Icon(
                          tab.icon,
                          size: 18,
                          color: isSelected
                              ? theme.colorScheme.primary
                              : Colors.grey.shade600,
                        ),
                        const SizedBox(width: 6),
                      ],
                      Text(
                        tab.label,
                        style: TextStyle(
                          color: isSelected
                              ? theme.colorScheme.primary
                              : Colors.grey.shade600,
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        }),
      ),
    );
  }
}

class AppTab {
  final String label;
  final IconData? icon;
  final String? badge;

  const AppTab({
    required this.label,
    this.icon,
    this.badge,
  });
}

enum TabVariant {
  underline,
  pills,
  segmented,
}

/// Tab view with content
class AppTabView extends StatelessWidget {
  final List<AppTab> tabs;
  final List<Widget> children;
  final int currentIndex;
  final ValueChanged<int> onChanged;
  final TabVariant variant;

  const AppTabView({
    Key? key,
    required this.tabs,
    required this.children,
    required this.currentIndex,
    required this.onChanged,
    this.variant = TabVariant.underline,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        AppTabs(
          tabs: tabs,
          currentIndex: currentIndex,
          onChanged: onChanged,
          variant: variant,
        ),
        const SizedBox(height: 16),
        Expanded(
          child: IndexedStack(
            index: currentIndex,
            children: children,
          ),
        ),
      ],
    );
  }
}
