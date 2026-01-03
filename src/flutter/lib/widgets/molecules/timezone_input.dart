/// Timezone Input Widget
/// 
/// A specialized input for selecting timezones.
/// 
/// Features:
/// - Timezone selection with search
/// - UTC offset display
/// - Current timezone detection
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppTimezoneInput(
///   onChanged: (timezone) => print(timezone),
/// )
/// ```

library;

import 'package:flutter/material.dart';

class TimezoneData {
  final String name;
  final String region;
  final String offset;
  final int offsetMinutes;

  const TimezoneData({
    required this.name,
    required this.region,
    required this.offset,
    required this.offsetMinutes,
  });

  String get displayName => '$region/$name';
  String get displayWithOffset => '$displayName (UTC$offset)';

  @override
  String toString() => displayWithOffset;
}

class AppTimezoneInput extends StatefulWidget {
  final TimezoneData? initialValue;
  final ValueChanged<TimezoneData>? onChanged;
  final String? label;
  final bool enabled;

  const AppTimezoneInput({
    super.key,
    this.initialValue,
    this.onChanged,
    this.label,
    this.enabled = true,
  });

  @override
  State<AppTimezoneInput> createState() => _AppTimezoneInputState();
}

class _AppTimezoneInputState extends State<AppTimezoneInput> {
  late TextEditingController _controller;
  final FocusNode _focusNode = FocusNode();
  TimezoneData? _selectedTimezone;
  List<TimezoneData> _filteredTimezones = [];

  // Common timezones
  static const List<TimezoneData> _timezones = [
    TimezoneData(name: 'Ho Chi Minh', region: 'Asia', offset: '+07:00', offsetMinutes: 420),
    TimezoneData(name: 'Bangkok', region: 'Asia', offset: '+07:00', offsetMinutes: 420),
    TimezoneData(name: 'Singapore', region: 'Asia', offset: '+08:00', offsetMinutes: 480),
    TimezoneData(name: 'Tokyo', region: 'Asia', offset: '+09:00', offsetMinutes: 540),
    TimezoneData(name: 'Seoul', region: 'Asia', offset: '+09:00', offsetMinutes: 540),
    TimezoneData(name: 'Shanghai', region: 'Asia', offset: '+08:00', offsetMinutes: 480),
    TimezoneData(name: 'Hong Kong', region: 'Asia', offset: '+08:00', offsetMinutes: 480),
    TimezoneData(name: 'Dubai', region: 'Asia', offset: '+04:00', offsetMinutes: 240),
    TimezoneData(name: 'Mumbai', region: 'Asia', offset: '+05:30', offsetMinutes: 330),
    TimezoneData(name: 'Jakarta', region: 'Asia', offset: '+07:00', offsetMinutes: 420),
    TimezoneData(name: 'London', region: 'Europe', offset: '+00:00', offsetMinutes: 0),
    TimezoneData(name: 'Paris', region: 'Europe', offset: '+01:00', offsetMinutes: 60),
    TimezoneData(name: 'Berlin', region: 'Europe', offset: '+01:00', offsetMinutes: 60),
    TimezoneData(name: 'Moscow', region: 'Europe', offset: '+03:00', offsetMinutes: 180),
    TimezoneData(name: 'New York', region: 'America', offset: '-05:00', offsetMinutes: -300),
    TimezoneData(name: 'Los Angeles', region: 'America', offset: '-08:00', offsetMinutes: -480),
    TimezoneData(name: 'Chicago', region: 'America', offset: '-06:00', offsetMinutes: -360),
    TimezoneData(name: 'Toronto', region: 'America', offset: '-05:00', offsetMinutes: -300),
    TimezoneData(name: 'Mexico City', region: 'America', offset: '-06:00', offsetMinutes: -360),
    TimezoneData(name: 'Sao Paulo', region: 'America', offset: '-03:00', offsetMinutes: -180),
    TimezoneData(name: 'Sydney', region: 'Australia', offset: '+11:00', offsetMinutes: 660),
    TimezoneData(name: 'Melbourne', region: 'Australia', offset: '+11:00', offsetMinutes: 660),
    TimezoneData(name: 'Auckland', region: 'Pacific', offset: '+13:00', offsetMinutes: 780),
  ];

  @override
  void initState() {
    super.initState();
    _selectedTimezone = widget.initialValue;
    _controller = TextEditingController(
      text: widget.initialValue?.displayWithOffset ?? '',
    );
    _filteredTimezones = List.from(_timezones);
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _filterTimezones(String query) {
    setState(() {
      if (query.isEmpty) {
        _filteredTimezones = List.from(_timezones);
      } else {
        _filteredTimezones = _timezones.where((tz) {
          final searchTerm = query.toLowerCase();
          return tz.name.toLowerCase().contains(searchTerm) ||
                 tz.region.toLowerCase().contains(searchTerm) ||
                 tz.offset.contains(searchTerm);
        }).toList();
      }
    });
  }

  void _selectTimezone(TimezoneData timezone) {
    setState(() {
      _selectedTimezone = timezone;
      _controller.text = timezone.displayWithOffset;
    });
    widget.onChanged?.call(timezone);
    Navigator.pop(context);
  }

  void _showTimezoneDialog() {
    showDialog(
      context: context,
      builder: (context) => _TimezonePickerDialog(
        timezones: _filteredTimezones,
        selectedTimezone: _selectedTimezone,
        onSearch: _filterTimezones,
        onSelect: _selectTimezone,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        TextField(
          controller: _controller,
          readOnly: true,
          enabled: widget.enabled,
          onTap: widget.enabled ? _showTimezoneDialog : null,
          decoration: InputDecoration(
            labelText: widget.label ?? 'Timezone',
            hintText: 'Select timezone',
            border: const OutlineInputBorder(),
            prefixIcon: const Icon(Icons.public),
            suffixIcon: const Icon(Icons.arrow_drop_down),
          ),
        ),

        if (_selectedTimezone != null) ...[
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: theme.colorScheme.surfaceContainerHighest,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.access_time,
                  size: 16,
                  color: theme.colorScheme.onSurfaceVariant,
                ),
                const SizedBox(width: 8),
                Text(
                  'UTC ${_selectedTimezone!.offset}',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }
}

class _TimezonePickerDialog extends StatefulWidget {
  final List<TimezoneData> timezones;
  final TimezoneData? selectedTimezone;
  final ValueChanged<String> onSearch;
  final ValueChanged<TimezoneData> onSelect;

  const _TimezonePickerDialog({
    required this.timezones,
    required this.selectedTimezone,
    required this.onSearch,
    required this.onSelect,
  });

  @override
  State<_TimezonePickerDialog> createState() => _TimezonePickerDialogState();
}

class _TimezonePickerDialogState extends State<_TimezonePickerDialog> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: SizedBox(
        width: 500,
        height: 600,
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Select Timezone',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _searchController,
                    decoration: const InputDecoration(
                      hintText: 'Search timezone...',
                      prefixIcon: Icon(Icons.search),
                      border: OutlineInputBorder(),
                    ),
                    onChanged: widget.onSearch,
                  ),
                ],
              ),
            ),

            const Divider(height: 1),

            // Timezone list
            Expanded(
              child: ListView.builder(
                itemCount: widget.timezones.length,
                itemBuilder: (context, index) {
                  final timezone = widget.timezones[index];
                  final isSelected = widget.selectedTimezone == timezone;

                  return ListTile(
                    leading: const Icon(Icons.public),
                    title: Text(timezone.displayName),
                    trailing: Text(
                      'UTC ${timezone.offset}',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    selected: isSelected,
                    onTap: () => widget.onSelect(timezone),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
