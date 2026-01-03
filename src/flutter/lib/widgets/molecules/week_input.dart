/// Week Input Widget
/// 
/// A specialized input for selecting week and year.
/// 
/// Features:
/// - Week number selector
/// - Year selector
/// - Week range display
/// - ISO 8601 week format
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppWeekInput(
///   onChanged: (week, year) => print('Week $week, $year'),
/// )
/// ```

library;

import 'package:flutter/material.dart';

class AppWeekInput extends StatefulWidget {
  final int? initialWeek;
  final int? initialYear;
  final ValueChanged<Map<String, int>>? onChanged;
  final String? label;
  final bool enabled;

  const AppWeekInput({
    super.key,
    this.initialWeek,
    this.initialYear,
    this.onChanged,
    this.label,
    this.enabled = true,
  });

  @override
  State<AppWeekInput> createState() => _AppWeekInputState();
}

class _AppWeekInputState extends State<AppWeekInput> {
  late int _selectedWeek;
  late int _selectedYear;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _selectedWeek = widget.initialWeek ?? _getWeekNumber(now);
    _selectedYear = widget.initialYear ?? now.year;
  }

  int _getWeekNumber(DateTime date) {
    final firstDayOfYear = DateTime(date.year, 1, 1);
    final dayOfYear = date.difference(firstDayOfYear).inDays + 1;
    return ((dayOfYear - date.weekday + 10) / 7).floor();
  }

  DateTimeRange _getWeekRange(int week, int year) {
    final jan1 = DateTime(year, 1, 1);
    final daysToAdd = (week - 1) * 7 + (8 - jan1.weekday);
    final weekStart = jan1.add(Duration(days: daysToAdd));
    final weekEnd = weekStart.add(const Duration(days: 6));
    return DateTimeRange(start: weekStart, end: weekEnd);
  }

  void _notifyChange() {
    widget.onChanged?.call({
      'week': _selectedWeek,
      'year': _selectedYear,
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final range = _getWeekRange(_selectedWeek, _selectedYear);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: theme.textTheme.titleSmall,
          ),
          const SizedBox(height: 8),
        ],

        Row(
          children: [
            // Week Selector
            Expanded(
              child: DropdownButtonFormField<int>(
                value: _selectedWeek,
                decoration: InputDecoration(
                  labelText: 'Week',
                  border: const OutlineInputBorder(),
                  prefixIcon: const Icon(Icons.calendar_today),
                ),
                items: List.generate(52, (index) => index + 1).map((week) {
                  return DropdownMenuItem(
                    value: week,
                    child: Text('Week $week'),
                  );
                }).toList(),
                onChanged: widget.enabled
                    ? (value) {
                        if (value != null) {
                          setState(() {
                            _selectedWeek = value;
                          });
                          _notifyChange();
                        }
                      }
                    : null,
              ),
            ),
            const SizedBox(width: 12),

            // Year Selector
            Expanded(
              child: DropdownButtonFormField<int>(
                value: _selectedYear,
                decoration: InputDecoration(
                  labelText: 'Year',
                  border: const OutlineInputBorder(),
                  prefixIcon: const Icon(Icons.calendar_month),
                ),
                items: List.generate(10, (index) {
                  final year = DateTime.now().year - 5 + index;
                  return DropdownMenuItem(
                    value: year,
                    child: Text('$year'),
                  );
                }).toList(),
                onChanged: widget.enabled
                    ? (value) {
                        if (value != null) {
                          setState(() {
                            _selectedYear = value;
                          });
                          _notifyChange();
                        }
                      }
                    : null,
              ),
            ),
          ],
        ),

        const SizedBox(height: 8),

        // Week Range Display
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: theme.colorScheme.surfaceContainerHighest,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            children: [
              Icon(
                Icons.date_range,
                size: 16,
                color: theme.colorScheme.onSurfaceVariant,
              ),
              const SizedBox(width: 8),
              Text(
                '${_formatDate(range.start)} - ${_formatDate(range.end)}',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  String _formatDate(DateTime date) {
    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${months[date.month - 1]} ${date.day}';
  }
}
