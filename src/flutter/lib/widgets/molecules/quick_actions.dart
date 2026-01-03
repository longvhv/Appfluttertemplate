import 'package:flutter/material.dart';

/// Quick actions grid widget
class QuickActions extends StatelessWidget {
  final List<QuickAction> actions;
  final int crossAxisCount;
  final double spacing;
  final double runSpacing;

  const QuickActions({
    Key? key,
    required this.actions,
    this.crossAxisCount = 4,
    this.spacing = 16,
    this.runSpacing = 16,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: crossAxisCount,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: runSpacing,
      crossAxisSpacing: spacing,
      children: actions
          .map((action) => _QuickActionItem(action: action))
          .toList(),
    );
  }
}

class _QuickActionItem extends StatelessWidget {
  final QuickAction action;

  const _QuickActionItem({required this.action});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: action.onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          decoration: BoxDecoration(
            color: action.backgroundColor ?? theme.colorScheme.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: Colors.grey.shade200,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (action.badge != null)
                Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: (action.iconColor ?? theme.colorScheme.primary)
                            .withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        action.icon,
                        size: 28,
                        color: action.iconColor ?? theme.colorScheme.primary,
                      ),
                    ),
                    Positioned(
                      right: -4,
                      top: -4,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: Colors.red,
                          shape: BoxShape.circle,
                        ),
                        constraints: const BoxConstraints(
                          minWidth: 18,
                          minHeight: 18,
                        ),
                        child: Center(
                          child: Text(
                            action.badge!,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                )
              else
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: (action.iconColor ?? theme.colorScheme.primary)
                        .withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    action.icon,
                    size: 28,
                    color: action.iconColor ?? theme.colorScheme.primary,
                  ),
                ),
              const SizedBox(height: 8),
              Text(
                action.label,
                style: theme.textTheme.bodySmall?.copyWith(
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class QuickAction {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color? iconColor;
  final Color? backgroundColor;
  final String? badge;

  const QuickAction({
    required this.icon,
    required this.label,
    required this.onTap,
    this.iconColor,
    this.backgroundColor,
    this.badge,
  });
}

/// Floating Action Button with menu
class FloatingActionMenu extends StatefulWidget {
  final List<FloatingActionMenuItem> items;
  final IconData icon;
  final Color? backgroundColor;
  final Color? foregroundColor;

  const FloatingActionMenu({
    Key? key,
    required this.items,
    this.icon = Icons.add,
    this.backgroundColor,
    this.foregroundColor,
  }) : super(key: key);

  @override
  State<FloatingActionMenu> createState() => _FloatingActionMenuState();
}

class _FloatingActionMenuState extends State<FloatingActionMenu>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  bool _isOpen = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 250),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _toggle() {
    setState(() {
      _isOpen = !_isOpen;
      if (_isOpen) {
        _controller.forward();
      } else {
        _controller.reverse();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        ...List.generate(widget.items.length, (index) {
          final item = widget.items[index];
          return ScaleTransition(
            scale: CurvedAnimation(
              parent: _controller,
              curve: Interval(
                0.0,
                1.0 - index / widget.items.length / 2,
                curve: Curves.easeOut,
              ),
            ),
            child: Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Material(
                    elevation: 4,
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      child: Text(
                        item.label,
                        style: theme.textTheme.bodySmall,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  FloatingActionButton.small(
                    heroTag: 'fab_${item.label}',
                    onPressed: () {
                      _toggle();
                      item.onTap();
                    },
                    backgroundColor: item.backgroundColor,
                    child: Icon(item.icon),
                  ),
                ],
              ),
            ),
          );
        }).reversed,
        FloatingActionButton(
          heroTag: 'fab_main',
          onPressed: _toggle,
          backgroundColor: widget.backgroundColor ?? theme.colorScheme.primary,
          foregroundColor: widget.foregroundColor ?? Colors.white,
          child: AnimatedRotation(
            turns: _isOpen ? 0.125 : 0,
            duration: const Duration(milliseconds: 250),
            child: Icon(widget.icon),
          ),
        ),
      ],
    );
  }
}

class FloatingActionMenuItem {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color? backgroundColor;

  const FloatingActionMenuItem({
    required this.icon,
    required this.label,
    required this.onTap,
    this.backgroundColor,
  });
}
