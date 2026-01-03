import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

/// Date picker input widget matching web app design
class DatePickerInput extends StatefulWidget {
  final String? label;
  final String? hintText;
  final DateTime? value;
  final ValueChanged<DateTime?>? onChanged;
  final DateTime? firstDate;
  final DateTime? lastDate;
  final String? errorText;
  final bool enabled;
  final DateFormat? dateFormat;

  const DatePickerInput({
    Key? key,
    this.label,
    this.hintText,
    this.value,
    this.onChanged,
    this.firstDate,
    this.lastDate,
    this.errorText,
    this.enabled = true,
    this.dateFormat,
  }) : super(key: key);

  @override
  State<DatePickerInput> createState() => _DatePickerInputState();
}

class _DatePickerInputState extends State<DatePickerInput> {
  late TextEditingController _controller;
  late DateFormat _format;

  @override
  void initState() {
    super.initState();
    _format = widget.dateFormat ?? DateFormat('MMM dd, yyyy');
    _controller = TextEditingController(
      text: widget.value != null ? _format.format(widget.value!) : '',
    );
  }

  @override
  void didUpdateWidget(DatePickerInput oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) {
      _controller.text = widget.value != null ? _format.format(widget.value!) : '';
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _selectDate() async {
    final initialDate = widget.value ?? DateTime.now();
    final firstDate = widget.firstDate ?? DateTime(1900);
    final lastDate = widget.lastDate ?? DateTime(2100);

    final picked = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: firstDate,
      lastDate: lastDate,
    );

    if (picked != null && widget.onChanged != null) {
      widget.onChanged!(picked);
    }
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
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
          ),
          const SizedBox(height: 8),
        ],
        TextFormField(
          controller: _controller,
          readOnly: true,
          enabled: widget.enabled,
          onTap: widget.enabled ? _selectDate : null,
          decoration: InputDecoration(
            hintText: widget.hintText ?? 'Select date',
            errorText: widget.errorText,
            suffixIcon: const Icon(Icons.calendar_today),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
          ),
        ),
      ],
    );
  }
}

/// Date range picker input
class DateRangePickerInput extends StatefulWidget {
  final String? label;
  final String? hintText;
  final DateTimeRange? value;
  final ValueChanged<DateTimeRange?>? onChanged;
  final DateTime? firstDate;
  final DateTime? lastDate;
  final String? errorText;
  final bool enabled;

  const DateRangePickerInput({
    Key? key,
    this.label,
    this.hintText,
    this.value,
    this.onChanged,
    this.firstDate,
    this.lastDate,
    this.errorText,
    this.enabled = true,
  }) : super(key: key);

  @override
  State<DateRangePickerInput> createState() => _DateRangePickerInputState();
}

class _DateRangePickerInputState extends State<DateRangePickerInput> {
  late TextEditingController _controller;
  final _format = DateFormat('MMM dd, yyyy');

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: _formatRange(widget.value));
  }

  @override
  void didUpdateWidget(DateRangePickerInput oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) {
      _controller.text = _formatRange(widget.value);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _formatRange(DateTimeRange? range) {
    if (range == null) return '';
    return '${_format.format(range.start)} - ${_format.format(range.end)}';
  }

  Future<void> _selectDateRange() async {
    final firstDate = widget.firstDate ?? DateTime(1900);
    final lastDate = widget.lastDate ?? DateTime(2100);

    final picked = await showDateRangePicker(
      context: context,
      initialDateRange: widget.value,
      firstDate: firstDate,
      lastDate: lastDate,
    );

    if (picked != null && widget.onChanged != null) {
      widget.onChanged!(picked);
    }
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
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
          ),
          const SizedBox(height: 8),
        ],
        TextFormField(
          controller: _controller,
          readOnly: true,
          enabled: widget.enabled,
          onTap: widget.enabled ? _selectDateRange : null,
          decoration: InputDecoration(
            hintText: widget.hintText ?? 'Select date range',
            errorText: widget.errorText,
            suffixIcon: const Icon(Icons.date_range),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
          ),
        ),
      ],
    );
  }
}

/// Time picker input
class TimePickerInput extends StatefulWidget {
  final String? label;
  final String? hintText;
  final TimeOfDay? value;
  final ValueChanged<TimeOfDay?>? onChanged;
  final String? errorText;
  final bool enabled;

  const TimePickerInput({
    Key? key,
    this.label,
    this.hintText,
    this.value,
    this.onChanged,
    this.errorText,
    this.enabled = true,
  }) : super(key: key);

  @override
  State<TimePickerInput> createState() => _TimePickerInputState();
}

class _TimePickerInputState extends State<TimePickerInput> {
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: _formatTime(widget.value));
  }

  @override
  void didUpdateWidget(TimePickerInput oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) {
      _controller.text = _formatTime(widget.value);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _formatTime(TimeOfDay? time) {
    if (time == null) return '';
    final hour = time.hourOfPeriod;
    final minute = time.minute.toString().padLeft(2, '0');
    final period = time.period == DayPeriod.am ? 'AM' : 'PM';
    return '$hour:$minute $period';
  }

  Future<void> _selectTime() async {
    final initialTime = widget.value ?? TimeOfDay.now();

    final picked = await showTimePicker(
      context: context,
      initialTime: initialTime,
    );

    if (picked != null && widget.onChanged != null) {
      widget.onChanged!(picked);
    }
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
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
          ),
          const SizedBox(height: 8),
        ],
        TextFormField(
          controller: _controller,
          readOnly: true,
          enabled: widget.enabled,
          onTap: widget.enabled ? _selectTime : null,
          decoration: InputDecoration(
            hintText: widget.hintText ?? 'Select time',
            errorText: widget.errorText,
            suffixIcon: const Icon(Icons.access_time),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
          ),
        ),
      ],
    );
  }
}
