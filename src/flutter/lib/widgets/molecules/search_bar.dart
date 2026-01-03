import 'package:flutter/material.dart';
import 'dart:async';

/// Search bar widget matching web app design
class AppSearchBar extends StatefulWidget {
  final String? hintText;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final VoidCallback? onClear;
  final TextEditingController? controller;
  final bool autofocus;
  final Widget? leading;
  final List<Widget>? actions;
  final Duration debounceDuration;
  final bool showClearButton;

  const AppSearchBar({
    Key? key,
    this.hintText,
    this.onChanged,
    this.onSubmitted,
    this.onClear,
    this.controller,
    this.autofocus = false,
    this.leading,
    this.actions,
    this.debounceDuration = const Duration(milliseconds: 500),
    this.showClearButton = true,
  }) : super(key: key);

  @override
  State<AppSearchBar> createState() => _AppSearchBarState();
}

class _AppSearchBarState extends State<AppSearchBar> {
  late TextEditingController _controller;
  Timer? _debounce;
  bool _hasText = false;

  @override
  void initState() {
    super.initState();
    _controller = widget.controller ?? TextEditingController();
    _controller.addListener(_onTextChanged);
    _hasText = _controller.text.isNotEmpty;
  }

  @override
  void dispose() {
    _debounce?.cancel();
    if (widget.controller == null) {
      _controller.dispose();
    }
    super.dispose();
  }

  void _onTextChanged() {
    setState(() {
      _hasText = _controller.text.isNotEmpty;
    });

    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(widget.debounceDuration, () {
      widget.onChanged?.call(_controller.text);
    });
  }

  void _onClear() {
    _controller.clear();
    widget.onClear?.call();
    widget.onChanged?.call('');
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.grey.shade300,
        ),
      ),
      child: Row(
        children: [
          if (widget.leading != null)
            Padding(
              padding: const EdgeInsets.only(left: 12),
              child: widget.leading,
            )
          else
            Padding(
              padding: const EdgeInsets.only(left: 12),
              child: Icon(
                Icons.search,
                color: Colors.grey.shade600,
              ),
            ),
          Expanded(
            child: TextField(
              controller: _controller,
              autofocus: widget.autofocus,
              decoration: InputDecoration(
                hintText: widget.hintText ?? 'Search...',
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 14,
                ),
              ),
              onSubmitted: widget.onSubmitted,
            ),
          ),
          if (widget.showClearButton && _hasText)
            IconButton(
              icon: const Icon(Icons.clear),
              onPressed: _onClear,
              color: Colors.grey.shade600,
            ),
          if (widget.actions != null) ...widget.actions!,
        ],
      ),
    );
  }
}

/// Search bar with filters
class SearchBarWithFilters extends StatelessWidget {
  final String? hintText;
  final ValueChanged<String>? onSearch;
  final VoidCallback? onFilter;
  final int? filterCount;
  final TextEditingController? controller;

  const SearchBarWithFilters({
    Key? key,
    this.hintText,
    this.onSearch,
    this.onFilter,
    this.filterCount,
    this.controller,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppSearchBar(
      hintText: hintText,
      onChanged: onSearch,
      controller: controller,
      actions: [
        if (onFilter != null)
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.filter_list),
                onPressed: onFilter,
                color: Colors.grey.shade600,
              ),
              if (filterCount != null && filterCount! > 0)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.primary,
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 16,
                      minHeight: 16,
                    ),
                    child: Text(
                      filterCount.toString(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
      ],
    );
  }
}
