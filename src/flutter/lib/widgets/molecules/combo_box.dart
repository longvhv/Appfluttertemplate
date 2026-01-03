import 'package:flutter/material.dart';

/// ComboBox widget matching web app design
/// 
/// Matches web ComboBox component with all features:
/// - Searchable dropdown
/// - Clearable option
/// - Custom placeholder
/// - Group support
/// - Disabled state
class ComboBox extends StatefulWidget {
  final List<ComboBoxOption> options;
  final String? value;
  final ValueChanged<String?>? onChanged;
  final String placeholder;
  final String searchPlaceholder;
  final String emptyText;
  final bool disabled;
  final bool clearable;
  final String? label;

  const ComboBox({
    super.key,
    required this.options,
    this.value,
    this.onChanged,
    this.placeholder = 'Select option...',
    this.searchPlaceholder = 'Search...',
    this.emptyText = 'No results found',
    this.disabled = false,
    this.clearable = true,
    this.label,
  });

  @override
  State<ComboBox> createState() => _ComboBoxState();
}

class _ComboBoxState extends State<ComboBox> {
  String? _selectedValue;
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _searchFocusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _selectedValue = widget.value;
  }

  @override
  void didUpdateWidget(ComboBox oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) {
      _selectedValue = widget.value;
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  void _showDropdown() async {
    if (widget.disabled) return;

    final RenderBox renderBox = context.findRenderObject() as RenderBox;
    final offset = renderBox.localToGlobal(Offset.zero);
    final size = renderBox.size;

    final result = await showDialog<String>(
      context: context,
      barrierDismissible: true,
      barrierColor: Colors.transparent,
      builder: (context) => _ComboBoxDropdown(
        options: widget.options,
        selectedValue: _selectedValue,
        searchPlaceholder: widget.searchPlaceholder,
        emptyText: widget.emptyText,
        offset: offset,
        width: size.width,
        onSelect: (value) {
          Navigator.pop(context, value);
        },
      ),
    );

    if (result != null) {
      setState(() => _selectedValue = result);
      widget.onChanged?.call(result);
    }
  }

  void _clear() {
    setState(() => _selectedValue = null);
    widget.onChanged?.call(null);
  }

  ComboBoxOption? get _selectedOption {
    return widget.options.firstWhere(
      (opt) => opt.value == _selectedValue,
      orElse: () => ComboBoxOption(value: '', label: ''),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 8),
        ],
        InkWell(
          onTap: _showDropdown,
          borderRadius: BorderRadius.circular(8),
          child: Container(
            height: 48,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              border: Border.all(
                color: colorScheme.outline.withOpacity(0.3),
              ),
              borderRadius: BorderRadius.circular(8),
              color: widget.disabled
                  ? colorScheme.surfaceVariant.withOpacity(0.5)
                  : colorScheme.surface,
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    _selectedValue != null
                        ? _selectedOption?.label ?? widget.placeholder
                        : widget.placeholder,
                    style: TextStyle(
                      fontSize: 14,
                      color: _selectedValue != null
                          ? colorScheme.onSurface
                          : colorScheme.onSurfaceVariant,
                    ),
                  ),
                ),
                if (_selectedValue != null && widget.clearable)
                  IconButton(
                    icon: const Icon(Icons.close, size: 18),
                    onPressed: widget.disabled ? null : _clear,
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  )
                else
                  Icon(
                    Icons.unfold_more,
                    size: 18,
                    color: colorScheme.onSurfaceVariant,
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

/// ComboBox option data
class ComboBoxOption {
  final String value;
  final String label;
  final String? description;
  final bool disabled;
  final String? group;

  const ComboBoxOption({
    required this.value,
    required this.label,
    this.description,
    this.disabled = false,
    this.group,
  });
}

/// Dropdown widget
class _ComboBoxDropdown extends StatefulWidget {
  final List<ComboBoxOption> options;
  final String? selectedValue;
  final String searchPlaceholder;
  final String emptyText;
  final Offset offset;
  final double width;
  final ValueChanged<String> onSelect;

  const _ComboBoxDropdown({
    required this.options,
    required this.selectedValue,
    required this.searchPlaceholder,
    required this.emptyText,
    required this.offset,
    required this.width,
    required this.onSelect,
  });

  @override
  State<_ComboBoxDropdown> createState() => _ComboBoxDropdownState();
}

class _ComboBoxDropdownState extends State<_ComboBoxDropdown> {
  final TextEditingController _searchController = TextEditingController();
  List<ComboBoxOption> _filteredOptions = [];

  @override
  void initState() {
    super.initState();
    _filteredOptions = widget.options;
    _searchController.addListener(_filterOptions);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _filterOptions() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      _filteredOptions = widget.options.where((opt) {
        return opt.label.toLowerCase().contains(query) ||
            (opt.description?.toLowerCase().contains(query) ?? false);
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Stack(
      children: [
        Positioned(
          top: widget.offset.dy + 52,
          left: widget.offset.dx,
          width: widget.width,
          child: Material(
            elevation: 8,
            borderRadius: BorderRadius.circular(8),
            child: Container(
              constraints: const BoxConstraints(maxHeight: 300),
              decoration: BoxDecoration(
                color: colorScheme.surface,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: colorScheme.outline.withOpacity(0.3),
                ),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Search field
                  Padding(
                    padding: const EdgeInsets.all(8),
                    child: TextField(
                      controller: _searchController,
                      autofocus: true,
                      decoration: InputDecoration(
                        hintText: widget.searchPlaceholder,
                        prefixIcon: const Icon(Icons.search, size: 18),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(6),
                          borderSide: BorderSide(
                            color: colorScheme.outline.withOpacity(0.3),
                          ),
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        isDense: true,
                      ),
                      style: const TextStyle(fontSize: 14),
                    ),
                  ),

                  const Divider(height: 1),

                  // Options list
                  Flexible(
                    child: _filteredOptions.isEmpty
                        ? Padding(
                            padding: const EdgeInsets.all(16),
                            child: Text(
                              widget.emptyText,
                              style: TextStyle(
                                fontSize: 14,
                                color: colorScheme.onSurfaceVariant,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          )
                        : ListView.builder(
                            shrinkWrap: true,
                            itemCount: _filteredOptions.length,
                            itemBuilder: (context, index) {
                              final option = _filteredOptions[index];
                              final isSelected = option.value == widget.selectedValue;

                              return ListTile(
                                dense: true,
                                enabled: !option.disabled,
                                selected: isSelected,
                                title: Text(
                                  option.label,
                                  style: const TextStyle(fontSize: 14),
                                ),
                                subtitle: option.description != null
                                    ? Text(
                                        option.description!,
                                        style: const TextStyle(fontSize: 12),
                                      )
                                    : null,
                                trailing: isSelected
                                    ? const Icon(Icons.check, size: 18)
                                    : null,
                                onTap: option.disabled
                                    ? null
                                    : () => widget.onSelect(option.value),
                              );
                            },
                          ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
