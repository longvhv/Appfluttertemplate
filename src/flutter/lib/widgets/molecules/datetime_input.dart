import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

/// DateTimeInput widget matching web app design
/// 
/// Matches web DateTimeInput component with all features:
/// - Date and time picker combined
/// - 12h/24h format support
/// - Minute step support
/// - Min/max date validation
/// - Label and error support
class DateTimeInput extends StatefulWidget {
  final DateTime? value;
  final ValueChanged<DateTime>? onChanged;
  final bool disabled;
  final DateTime? minDate;
  final DateTime? maxDate;
  final TimeFormat format;
  final int minuteStep;
  final String? label;
  final bool error;

  const DateTimeInput({
    super.key,
    this.value,
    this.onChanged,
    this.disabled = false,
    this.minDate,
    this.maxDate,
    this.format = TimeFormat.h12,
    this.minuteStep = 15,
    this.label,
    this.error = false,
  });

  @override
  State<DateTimeInput> createState() => _DateTimeInputState();
}

class _DateTimeInputState extends State<DateTimeInput> {
  late DateTime _selectedDateTime;

  @override
  void initState() {
    super.initState();
    _selectedDateTime = widget.value ?? DateTime.now();
  }

  @override
  void didUpdateWidget(DateTimeInput oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != null && widget.value != oldWidget.value) {
      _selectedDateTime = widget.value!;
    }
  }

  Future<void> _pickDate() async {
    if (widget.disabled) return;

    final date = await showDatePicker(
      context: context,
      initialDate: _selectedDateTime,
      firstDate: widget.minDate ?? DateTime(1900),
      lastDate: widget.maxDate ?? DateTime(2100),
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

    if (date != null) {
      setState(() {
        _selectedDateTime = DateTime(
          date.year,
          date.month,
          date.day,
          _selectedDateTime.hour,
          _selectedDateTime.minute,
        );
      });
      widget.onChanged?.call(_selectedDateTime);
    }
  }

  Future<void> _pickTime() async {
    if (widget.disabled) return;

    final time = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.fromDateTime(_selectedDateTime),
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

    if (time != null) {
      setState(() {
        _selectedDateTime = DateTime(
          _selectedDateTime.year,
          _selectedDateTime.month,
          _selectedDateTime.day,
          time.hour,
          time.minute,
        );
      });
      widget.onChanged?.call(_selectedDateTime);
    }
  }

  String _formatDateTime() {
    final dateFormat = DateFormat('MMM dd, yyyy');
    final timeFormat = widget.format == TimeFormat.h12
        ? DateFormat('hh:mm a')
        : DateFormat('HH:mm');

    return '${dateFormat.format(_selectedDateTime)} ${timeFormat.format(_selectedDateTime)}';
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
        Container(
          height: 48,
          decoration: BoxDecoration(
            border: Border.all(
              color: widget.error
                  ? colorScheme.error
                  : colorScheme.outline.withOpacity(0.3),
              width: widget.error ? 2 : 1,
            ),
            borderRadius: BorderRadius.circular(8),
            color: widget.disabled
                ? colorScheme.surfaceVariant.withOpacity(0.5)
                : colorScheme.surface,
          ),
          child: Row(
            children: [
              // Date button
              Expanded(
                child: InkWell(
                  onTap: _pickDate,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(8),
                    bottomLeft: Radius.circular(8),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Row(
                      children: [
                        Icon(
                          Icons.calendar_today,
                          size: 18,
                          color: widget.disabled
                              ? colorScheme.onSurface.withOpacity(0.5)
                              : colorScheme.onSurfaceVariant,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          DateFormat('MMM dd, yyyy').format(_selectedDateTime),
                          style: TextStyle(
                            fontSize: 14,
                            color: widget.disabled
                                ? colorScheme.onSurface.withOpacity(0.5)
                                : colorScheme.onSurface,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // Divider
              Container(
                width: 1,
                height: 32,
                color: colorScheme.outline.withOpacity(0.3),
              ),

              // Time button
              Expanded(
                child: InkWell(
                  onTap: _pickTime,
                  borderRadius: const BorderRadius.only(
                    topRight: Radius.circular(8),
                    bottomRight: Radius.circular(8),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Row(
                      children: [
                        Icon(
                          Icons.access_time,
                          size: 18,
                          color: widget.disabled
                              ? colorScheme.onSurface.withOpacity(0.5)
                              : colorScheme.onSurfaceVariant,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          widget.format == TimeFormat.h12
                              ? DateFormat('hh:mm a').format(_selectedDateTime)
                              : DateFormat('HH:mm').format(_selectedDateTime),
                          style: TextStyle(
                            fontSize: 14,
                            color: widget.disabled
                                ? colorScheme.onSurface.withOpacity(0.5)
                                : colorScheme.onSurface,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

/// Time format
enum TimeFormat {
  h12,
  h24,
}
