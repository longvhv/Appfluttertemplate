import 'package:flutter/material.dart';

/// Multi-select dropdown widget
class MultiSelect<T> extends StatefulWidget {
  final String? label;
  final String? hintText;
  final List<MultiSelectOption<T>> options;
  final List<T> selectedValues;
  final ValueChanged<List<T>> onChanged;
  final String? errorText;
  final bool enabled;
  final int? maxSelections;

  const MultiSelect({
    Key? key,
    this.label,
    this.hintText,
    required this.options,
    required this.selectedValues,
    required this.onChanged,
    this.errorText,
    this.enabled = true,
    this.maxSelections,
  }) : super(key: key);

  @override
  State<MultiSelect<T>> createState() => _MultiSelectState<T>();
}

class _MultiSelectState<T> extends State<MultiSelect<T>> {
  void _showOptionsDialog() {
    showDialog(
      context: context,
      builder: (context) => _MultiSelectDialog<T>(
        title: widget.label ?? 'Select items',
        options: widget.options,
        selectedValues: widget.selectedValues,
        onChanged: widget.onChanged,
        maxSelections: widget.maxSelections,
      ),
    );
  }

  String _getDisplayText() {
    if (widget.selectedValues.isEmpty) {
      return widget.hintText ?? 'Select items';
    }

    final selectedLabels = widget.selectedValues
        .map((value) => widget.options
            .firstWhere((option) => option.value == value)
            .label)
        .take(3)
        .toList();

    if (widget.selectedValues.length > 3) {
      return '${selectedLabels.join(', ')} (+${widget.selectedValues.length - 3})';
    }

    return selectedLabels.join(', ');
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
        ],
        InkWell(
          onTap: widget.enabled ? _showOptionsDialog : null,
          borderRadius: BorderRadius.circular(8),
          child: Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
            decoration: BoxDecoration(
              border: Border.all(
                color: widget.errorText != null
                    ? Colors.red
                    : Colors.grey.shade300,
              ),
              borderRadius: BorderRadius.circular(8),
              color: widget.enabled ? null : Colors.grey.shade100,
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    _getDisplayText(),
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: widget.selectedValues.isEmpty
                          ? Colors.grey.shade600
                          : null,
                    ),
                  ),
                ),
                const Icon(Icons.arrow_drop_down),
              ],
            ),
          ),
        ),
        if (widget.errorText != null) ...[
          const SizedBox(height: 4),
          Text(
            widget.errorText!,
            style: theme.textTheme.bodySmall?.copyWith(
              color: Colors.red,
            ),
          ),
        ],
        if (widget.selectedValues.isNotEmpty) ...[
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: widget.selectedValues.map((value) {
              final option = widget.options.firstWhere(
                (opt) => opt.value == value,
              );
              return Chip(
                label: Text(option.label),
                onDeleted: widget.enabled
                    ? () {
                        final newValues = List<T>.from(widget.selectedValues)
                          ..remove(value);
                        widget.onChanged(newValues);
                      }
                    : null,
              );
            }).toList(),
          ),
        ],
      ],
    );
  }
}

class _MultiSelectDialog<T> extends StatefulWidget {
  final String title;
  final List<MultiSelectOption<T>> options;
  final List<T> selectedValues;
  final ValueChanged<List<T>> onChanged;
  final int? maxSelections;

  const _MultiSelectDialog({
    required this.title,
    required this.options,
    required this.selectedValues,
    required this.onChanged,
    this.maxSelections,
  });

  @override
  State<_MultiSelectDialog<T>> createState() => _MultiSelectDialogState<T>();
}

class _MultiSelectDialogState<T> extends State<_MultiSelectDialog<T>> {
  late List<T> _tempSelected;

  @override
  void initState() {
    super.initState();
    _tempSelected = List.from(widget.selectedValues);
  }

  void _toggleOption(T value) {
    setState(() {
      if (_tempSelected.contains(value)) {
        _tempSelected.remove(value);
      } else {
        if (widget.maxSelections == null ||
            _tempSelected.length < widget.maxSelections!) {
          _tempSelected.add(value);
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AlertDialog(
      title: Text(widget.title),
      content: SizedBox(
        width: double.maxFinite,
        child: ListView.builder(
          shrinkWrap: true,
          itemCount: widget.options.length,
          itemBuilder: (context, index) {
            final option = widget.options[index];
            final isSelected = _tempSelected.contains(option.value);
            final isDisabled = !isSelected &&
                widget.maxSelections != null &&
                _tempSelected.length >= widget.maxSelections!;

            return CheckboxListTile(
              title: Text(option.label),
              subtitle: option.subtitle != null
                  ? Text(option.subtitle!)
                  : null,
              value: isSelected,
              onChanged: isDisabled
                  ? null
                  : (value) => _toggleOption(option.value),
            );
          },
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () {
            widget.onChanged(_tempSelected);
            Navigator.pop(context);
          },
          child: const Text('Apply'),
        ),
      ],
    );
  }
}

class MultiSelectOption<T> {
  final String label;
  final String? subtitle;
  final T value;

  const MultiSelectOption({
    required this.label,
    this.subtitle,
    required this.value,
  });
}
