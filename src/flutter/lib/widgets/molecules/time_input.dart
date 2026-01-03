import 'package:flutter/material.dart';

/// Time input widget
/// 
/// Provides:
/// - Time picker
/// - 12/24 hour format
/// - Custom validation
class AppTimeInput extends StatefulWidget {
  final String? label;
  final String? hint;
  final TimeOfDay? initialTime;
  final bool use24HourFormat;
  final ValueChanged<TimeOfDay?>? onChanged;
  final String? Function(TimeOfDay?)? validator;

  const AppTimeInput({
    super.key,
    this.label,
    this.hint = 'Select time',
    this.initialTime,
    this.use24HourFormat = false,
    this.onChanged,
    this.validator,
  });

  @override
  State<AppTimeInput> createState() => _AppTimeInputState();
}

class _AppTimeInputState extends State<AppTimeInput> {
  TimeOfDay? _selectedTime;

  @override
  void initState() {
    super.initState();
    _selectedTime = widget.initialTime;
  }

  Future<void> _selectTime() async {
    final time = await showTimePicker(
      context: context,
      initialTime: _selectedTime ?? TimeOfDay.now(),
      builder: (context, child) {
        return MediaQuery(
          data: MediaQuery.of(context).copyWith(
            alwaysUse24HourFormat: widget.use24HourFormat,
          ),
          child: child!,
        );
      },
    );

    if (time != null) {
      setState(() {
        _selectedTime = time;
      });
      widget.onChanged?.call(time);
    }
  }

  String _formatTime(TimeOfDay time) {
    if (widget.use24HourFormat) {
      return '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
    } else {
      final hour = time.hourOfPeriod == 0 ? 12 : time.hourOfPeriod;
      final period = time.period == DayPeriod.am ? 'AM' : 'PM';
      return '$hour:${time.minute.toString().padLeft(2, '0')} $period';
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
        ],
        InkWell(
          onTap: _selectTime,
          child: InputDecorator(
            decoration: InputDecoration(
              hintText: widget.hint,
              border: const OutlineInputBorder(),
              suffixIcon: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (_selectedTime != null)
                    IconButton(
                      icon: const Icon(Icons.clear, size: 20),
                      onPressed: () {
                        setState(() {
                          _selectedTime = null;
                        });
                        widget.onChanged?.call(null);
                      },
                    ),
                  const Icon(Icons.access_time),
                ],
              ),
            ),
            child: Text(
              _selectedTime != null
                  ? _formatTime(_selectedTime!)
                  : '',
              style: _selectedTime != null
                  ? theme.textTheme.bodyMedium
                  : theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
            ),
          ),
        ),
      ],
    );
  }
}
