import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// DurationInput widget matching web app design
/// 
/// Matches web DurationInput component with all features:
/// - Hours, minutes, seconds inputs
/// - Increment/decrement buttons
/// - Max hours limit
/// - Compact/expanded format
/// - Validation (0-59 for minutes/seconds)
class DurationInput extends StatefulWidget {
  final Duration value;
  final ValueChanged<Duration>? onChanged;
  final bool showHours;
  final bool showMinutes;
  final bool showSeconds;
  final int maxHours;
  final bool disabled;
  final DurationFormat format;
  final String? label;

  const DurationInput({
    super.key,
    required this.value,
    this.onChanged,
    this.showHours = true,
    this.showMinutes = true,
    this.showSeconds = true,
    this.maxHours = 99,
    this.disabled = false,
    this.format = DurationFormat.compact,
    this.label,
  });

  @override
  State<DurationInput> createState() => _DurationInputState();
}

class _DurationInputState extends State<DurationInput> {
  late int _hours;
  late int _minutes;
  late int _seconds;

  late TextEditingController _hoursController;
  late TextEditingController _minutesController;
  late TextEditingController _secondsController;

  @override
  void initState() {
    super.initState();
    _hours = widget.value.inHours;
    _minutes = widget.value.inMinutes.remainder(60);
    _seconds = widget.value.inSeconds.remainder(60);

    _hoursController = TextEditingController(text: _hours.toString().padLeft(2, '0'));
    _minutesController = TextEditingController(text: _minutes.toString().padLeft(2, '0'));
    _secondsController = TextEditingController(text: _seconds.toString().padLeft(2, '0'));
  }

  @override
  void didUpdateWidget(DurationInput oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) {
      _hours = widget.value.inHours;
      _minutes = widget.value.inMinutes.remainder(60);
      _seconds = widget.value.inSeconds.remainder(60);
      _updateControllers();
    }
  }

  @override
  void dispose() {
    _hoursController.dispose();
    _minutesController.dispose();
    _secondsController.dispose();
    super.dispose();
  }

  void _updateControllers() {
    _hoursController.text = _hours.toString().padLeft(2, '0');
    _minutesController.text = _minutes.toString().padLeft(2, '0');
    _secondsController.text = _seconds.toString().padLeft(2, '0');
  }

  void _notifyChange() {
    final duration = Duration(
      hours: _hours,
      minutes: _minutes,
      seconds: _seconds,
    );
    widget.onChanged?.call(duration);
  }

  void _incrementHours() {
    if (_hours < widget.maxHours) {
      setState(() => _hours++);
      _updateControllers();
      _notifyChange();
    }
  }

  void _decrementHours() {
    if (_hours > 0) {
      setState(() => _hours--);
      _updateControllers();
      _notifyChange();
    }
  }

  void _incrementMinutes() {
    if (_minutes < 59) {
      setState(() => _minutes++);
    } else {
      setState(() {
        _minutes = 0;
        if (_hours < widget.maxHours) _hours++;
      });
    }
    _updateControllers();
    _notifyChange();
  }

  void _decrementMinutes() {
    if (_minutes > 0) {
      setState(() => _minutes--);
    } else {
      setState(() {
        _minutes = 59;
        if (_hours > 0) _hours--;
      });
    }
    _updateControllers();
    _notifyChange();
  }

  void _incrementSeconds() {
    if (_seconds < 59) {
      setState(() => _seconds++);
    } else {
      setState(() {
        _seconds = 0;
        if (_minutes < 59) {
          _minutes++;
        } else {
          _minutes = 0;
          if (_hours < widget.maxHours) _hours++;
        }
      });
    }
    _updateControllers();
    _notifyChange();
  }

  void _decrementSeconds() {
    if (_seconds > 0) {
      setState(() => _seconds--);
    } else {
      setState(() {
        _seconds = 59;
        if (_minutes > 0) {
          _minutes--;
        } else {
          _minutes = 59;
          if (_hours > 0) _hours--;
        }
      });
    }
    _updateControllers();
    _notifyChange();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    if (widget.format == DurationFormat.compact) {
      return _buildCompactFormat(colorScheme);
    } else {
      return _buildExpandedFormat(colorScheme);
    }
  }

  Widget _buildCompactFormat(ColorScheme colorScheme) {
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
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.access_time,
                size: 18,
                color: colorScheme.onSurfaceVariant,
              ),
              const SizedBox(width: 12),
              if (widget.showHours) ...[
                _buildCompactField(_hoursController, 'HH', widget.maxHours),
                const Text(' : ', style: TextStyle(fontSize: 16)),
              ],
              if (widget.showMinutes) ...[
                _buildCompactField(_minutesController, 'MM', 59),
                if (widget.showSeconds) const Text(' : ', style: TextStyle(fontSize: 16)),
              ],
              if (widget.showSeconds)
                _buildCompactField(_secondsController, 'SS', 59),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCompactField(
    TextEditingController controller,
    String hint,
    int max,
  ) {
    return SizedBox(
      width: 40,
      child: TextField(
        controller: controller,
        enabled: !widget.disabled,
        keyboardType: TextInputType.number,
        textAlign: TextAlign.center,
        inputFormatters: [
          FilteringTextInputFormatter.digitsOnly,
          LengthLimitingTextInputFormatter(2),
        ],
        decoration: InputDecoration(
          border: InputBorder.none,
          hintText: hint,
          isDense: true,
          contentPadding: EdgeInsets.zero,
        ),
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        onChanged: (value) {
          if (value.isEmpty) return;
          final num = int.tryParse(value) ?? 0;
          if (num > max) {
            controller.text = max.toString().padLeft(2, '0');
          }
          _notifyChange();
        },
      ),
    );
  }

  Widget _buildExpandedFormat(ColorScheme colorScheme) {
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
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (widget.showHours) ...[
              _buildExpandedField(
                'Hours',
                _hoursController,
                _incrementHours,
                _decrementHours,
              ),
              const SizedBox(width: 12),
            ],
            if (widget.showMinutes) ...[
              _buildExpandedField(
                'Minutes',
                _minutesController,
                _incrementMinutes,
                _decrementMinutes,
              ),
              const SizedBox(width: 12),
            ],
            if (widget.showSeconds)
              _buildExpandedField(
                'Seconds',
                _secondsController,
                _incrementSeconds,
                _decrementSeconds,
              ),
          ],
        ),
      ],
    );
  }

  Widget _buildExpandedField(
    String label,
    TextEditingController controller,
    VoidCallback onIncrement,
    VoidCallback onDecrement,
  ) {
    return Column(
      children: [
        IconButton(
          icon: const Icon(Icons.arrow_drop_up),
          onPressed: widget.disabled ? null : onIncrement,
          iconSize: 24,
          padding: EdgeInsets.zero,
          constraints: const BoxConstraints(minWidth: 40, minHeight: 40),
        ),
        Container(
          width: 80,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            border: Border.all(
              color: Theme.of(context).colorScheme.outline.withOpacity(0.3),
            ),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            children: [
              Text(
                controller.text,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
        IconButton(
          icon: const Icon(Icons.arrow_drop_down),
          onPressed: widget.disabled ? null : onDecrement,
          iconSize: 24,
          padding: EdgeInsets.zero,
          constraints: const BoxConstraints(minWidth: 40, minHeight: 40),
        ),
      ],
    );
  }
}

/// Duration format
enum DurationFormat {
  compact,
  expanded,
}
