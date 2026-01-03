import 'package:flutter/material.dart';

/// Accordion widget matching web app design
class Accordion extends StatefulWidget {
  final List<AccordionItem> items;
  final bool allowMultiple;
  final List<int>? initiallyExpanded;

  const Accordion({
    Key? key,
    required this.items,
    this.allowMultiple = false,
    this.initiallyExpanded,
  }) : super(key: key);

  @override
  State<Accordion> createState() => _AccordionState();
}

class _AccordionState extends State<Accordion> {
  late Set<int> _expandedIndices;

  @override
  void initState() {
    super.initState();
    _expandedIndices = widget.initiallyExpanded?.toSet() ?? {};
  }

  void _toggleItem(int index) {
    setState(() {
      if (_expandedIndices.contains(index)) {
        _expandedIndices.remove(index);
      } else {
        if (!widget.allowMultiple) {
          _expandedIndices.clear();
        }
        _expandedIndices.add(index);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(
        widget.items.length,
        (index) => _AccordionItemWidget(
          item: widget.items[index],
          isExpanded: _expandedIndices.contains(index),
          onToggle: () => _toggleItem(index),
          isFirst: index == 0,
          isLast: index == widget.items.length - 1,
        ),
      ),
    );
  }
}

class _AccordionItemWidget extends StatelessWidget {
  final AccordionItem item;
  final bool isExpanded;
  final VoidCallback onToggle;
  final bool isFirst;
  final bool isLast;

  const _AccordionItemWidget({
    required this.item,
    required this.isExpanded,
    required this.onToggle,
    required this.isFirst,
    required this.isLast,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      decoration: BoxDecoration(
        border: Border(
          top: isFirst ? BorderSide(color: Colors.grey.shade300) : BorderSide.none,
          bottom: BorderSide(color: Colors.grey.shade300),
          left: BorderSide(color: Colors.grey.shade300),
          right: BorderSide(color: Colors.grey.shade300),
        ),
        borderRadius: BorderRadius.vertical(
          top: isFirst ? const Radius.circular(8) : Radius.zero,
          bottom: isLast ? const Radius.circular(8) : Radius.zero,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          InkWell(
            onTap: onToggle,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  if (item.icon != null) ...[
                    Icon(item.icon, size: 20),
                    const SizedBox(width: 12),
                  ],
                  Expanded(
                    child: Text(
                      item.title,
                      style: theme.textTheme.bodyLarge?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  AnimatedRotation(
                    turns: isExpanded ? 0.5 : 0,
                    duration: const Duration(milliseconds: 200),
                    child: const Icon(Icons.keyboard_arrow_down),
                  ),
                ],
              ),
            ),
          ),
          AnimatedCrossFade(
            firstChild: const SizedBox.shrink(),
            secondChild: Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: item.content,
            ),
            crossFadeState: isExpanded
                ? CrossFadeState.showSecond
                : CrossFadeState.showFirst,
            duration: const Duration(milliseconds: 200),
          ),
        ],
      ),
    );
  }
}

class AccordionItem {
  final String title;
  final Widget content;
  final IconData? icon;

  const AccordionItem({
    required this.title,
    required this.content,
    this.icon,
  });
}
