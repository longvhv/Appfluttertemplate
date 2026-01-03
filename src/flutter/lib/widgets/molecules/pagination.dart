import 'package:flutter/material.dart';

/// Pagination widget matching web app design
class Pagination extends StatelessWidget {
  final int currentPage;
  final int totalPages;
  final ValueChanged<int> onPageChanged;
  final int maxVisiblePages;
  final bool showFirstLast;

  const Pagination({
    Key? key,
    required this.currentPage,
    required this.totalPages,
    required this.onPageChanged,
    this.maxVisiblePages = 5,
    this.showFirstLast = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final pageNumbers = _generatePageNumbers();

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        // First page button
        if (showFirstLast) ...[
          _PaginationButton(
            icon: Icons.first_page,
            onPressed: currentPage > 1 ? () => onPageChanged(1) : null,
          ),
          const SizedBox(width: 4),
        ],
        // Previous button
        _PaginationButton(
          icon: Icons.chevron_left,
          onPressed: currentPage > 1 ? () => onPageChanged(currentPage - 1) : null,
        ),
        const SizedBox(width: 8),
        // Page numbers
        ...pageNumbers.map((pageNum) {
          if (pageNum == -1) {
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: Text(
                '...',
                style: theme.textTheme.bodyMedium,
              ),
            );
          }
          
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: _PaginationButton(
              label: pageNum.toString(),
              isActive: pageNum == currentPage,
              onPressed: () => onPageChanged(pageNum),
            ),
          );
        }),
        const SizedBox(width: 8),
        // Next button
        _PaginationButton(
          icon: Icons.chevron_right,
          onPressed: currentPage < totalPages
              ? () => onPageChanged(currentPage + 1)
              : null,
        ),
        // Last page button
        if (showFirstLast) ...[
          const SizedBox(width: 4),
          _PaginationButton(
            icon: Icons.last_page,
            onPressed:
                currentPage < totalPages ? () => onPageChanged(totalPages) : null,
          ),
        ],
      ],
    );
  }

  List<int> _generatePageNumbers() {
    if (totalPages <= maxVisiblePages) {
      return List.generate(totalPages, (index) => index + 1);
    }

    final half = maxVisiblePages ~/ 2;
    int start = currentPage - half;
    int end = currentPage + half;

    if (start < 1) {
      start = 1;
      end = maxVisiblePages;
    }

    if (end > totalPages) {
      end = totalPages;
      start = totalPages - maxVisiblePages + 1;
    }

    final pages = <int>[];

    if (start > 1) {
      pages.add(1);
      if (start > 2) pages.add(-1); // Ellipsis
    }

    for (int i = start; i <= end; i++) {
      pages.add(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.add(-1); // Ellipsis
      pages.add(totalPages);
    }

    return pages;
  }
}

class _PaginationButton extends StatelessWidget {
  final String? label;
  final IconData? icon;
  final bool isActive;
  final VoidCallback? onPressed;

  const _PaginationButton({
    this.label,
    this.icon,
    this.isActive = false,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Material(
      color: isActive ? theme.colorScheme.primary : Colors.transparent,
      borderRadius: BorderRadius.circular(6),
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(6),
        child: Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            border: Border.all(
              color: isActive
                  ? theme.colorScheme.primary
                  : Colors.grey.shade300,
            ),
            borderRadius: BorderRadius.circular(6),
          ),
          child: Center(
            child: icon != null
                ? Icon(
                    icon,
                    size: 18,
                    color: onPressed == null
                        ? Colors.grey.shade400
                        : (isActive ? Colors.white : Colors.grey.shade700),
                  )
                : Text(
                    label ?? '',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: onPressed == null
                          ? Colors.grey.shade400
                          : (isActive ? Colors.white : Colors.grey.shade700),
                      fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
                    ),
                  ),
          ),
        ),
      ),
    );
  }
}
