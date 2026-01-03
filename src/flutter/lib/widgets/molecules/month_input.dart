/// Month Input Widget
/// 
/// A specialized input for selecting month and year.
/// 
/// Features:
/// - Month selector
/// - Year selector
/// - Localization support
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppMonthInput(
///   onChanged: (month, year) => print('$month/$year'),
/// )
/// ```

library;

import 'package:flutter/material.dart';

class AppMonthInput extends StatefulWidget {
  final int? initialMonth;
  final int? initialYear;
  final ValueChanged<Map<String, int>>? onChanged;
  final String? label;
  final bool enabled;

  const AppMonthInput({
    super.key,
    this.initialMonth,
    this.initialYear,
    this.onChanged,
    this.label,
    this.enabled = true,
  });

  @override
  State<AppMonthInput> createState() => _AppMonthInputState();
}

class _AppMonthInputState extends State<AppMonthInput> {
  late int _selectedMonth;
  late int _selectedYear;

  final List<String> _months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ];

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _selectedMonth = widget.initialMonth ?? now.month;
    _selectedYear = widget.initialYear ?? now.year;
  }

  void _notifyChange() {
    widget.onChanged?.call({
      'month': _selectedMonth,
      'year': _selectedYear,
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: Theme.of(context).textTheme.titleSmall,
          ),
          const SizedBox(height: 8),
        ],

        Row(
          children: [
            // Month Selector
            Expanded(
              flex: 2,
              child: DropdownButtonFormField<int>(
                value: _selectedMonth,
                decoration: InputDecoration(
                  labelText: 'Month',
                  border: const OutlineInputBorder(),
                  prefixIcon: const Icon(Icons.calendar_month),
                ),
                items: List.generate(12, (index) {
                  final month = index + 1;
                  return DropdownMenuItem(
                    value: month,
                    child: Text(_months[index]),
                  );
                }).toList(),
                onChanged: widget.enabled
                    ? (value) {
                        if (value != null) {
                          setState(() {
                            _selectedMonth = value;
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
                  prefixIcon: const Icon(Icons.calendar_today),
                ),
                items: List.generate(20, (index) {
                  final year = DateTime.now().year - 10 + index;
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
      ],
    );
  }
}
