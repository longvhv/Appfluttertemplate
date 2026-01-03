import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

/// DateRangeInput widget matching web app design
/// 
/// Matches web DateRangeInput component with all features:
/// - Start and end date selection
/// - Min/max date validation
/// - Clearable option
/// - Short/long format
/// - Label support
class DateRangeInput extends StatefulWidget {
  final DateTimeRange? value;
  final ValueChanged<DateTimeRange?>? onChanged;
  final DateTime? minDate;
  final DateTime? maxDate;
  final bool disabled;
  final String placeholder;
  final DateRangeFormat format;
  final bool clearable;
  final String? label;

  const DateRangeInput({
    super.key,
    this.value,
    this.onChanged,
    this.minDate,
    this.maxDate,
    this.disabled = false,
    this.placeholder = 'Select date range...',
    this.format = DateRangeFormat.short,
    this.clearable = true,
    this.label,
  });

  @override
  State<DateRangeInput> createState() => _DateRangeInputState();
}

class _DateRangeInputState extends State<DateRangeInput> {
  DateTimeRange? _selectedRange;

  @override
  void initState() {
    super.initState();
    _selectedRange = widget.value;
  }

  @override
  void didUpdateWidget(DateRangeInput oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) {
      _selectedRange = widget.value;
    }
  }

  Future<void> _pickDateRange() async {
    if (widget.disabled) return;

    final range = await showDateRangePicker(
      context: context,
      firstDate: widget.minDate ?? DateTime(1900),
      lastDate: widget.maxDate ?? DateTime(2100),
      initialDateRange: _selectedRange,
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: Theme.of(context).colorScheme.copyWith(
                  primary: const Color(0xFF6366F1),
                ),
          ),
          child: child!,
        );
      },
    );

    if (range != null) {
      setState(() => _selectedRange = range);
      widget.onChanged?.call(range);
    }
  }

  void _clear() {
    setState(() => _selectedRange = null);
    widget.onChanged?.call(null);
  }

  String _formatDateRange() {
    if (_selectedRange == null) {
      return widget.placeholder;
    }

    final startFormat = widget.format == DateRangeFormat.short
        ? DateFormat('MMM dd')
        : DateFormat('MMM dd, yyyy');
    final endFormat = widget.format == DateRangeFormat.short
        ? DateFormat('MMM dd, yyyy')
        : DateFormat('MMM dd, yyyy');

    return '${startFormat.format(_selectedRange!.start)} - ${endFormat.format(_selectedRange!.end)}';
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
          onTap: _pickDateRange,
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
                Icon(
                  Icons.calendar_today,
                  size: 18,
                  color: widget.disabled
                      ? colorScheme.onSurface.withOpacity(0.5)
                      : colorScheme.onSurfaceVariant,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    _formatDateRange(),
                    style: TextStyle(
                      fontSize: 14,
                      color: _selectedRange != null
                          ? (widget.disabled
                              ? colorScheme.onSurface.withOpacity(0.5)
                              : colorScheme.onSurface)
                          : colorScheme.onSurfaceVariant,
                    ),
                  ),
                ),
                if (_selectedRange != null && widget.clearable)
                  IconButton(
                    icon: const Icon(Icons.close, size: 18),
                    onPressed: widget.disabled ? null : _clear,
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

/// Date range format
enum DateRangeFormat {
  short,
  long,
}
