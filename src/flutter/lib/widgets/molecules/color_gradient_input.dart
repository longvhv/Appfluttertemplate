/// Color Gradient Input Widget
/// 
/// A specialized input for creating and editing color gradients.
/// 
/// Features:
/// - Multiple color stops
/// - Gradient preview
/// - Linear/Radial gradients
/// - Color picker integration
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppColorGradientInput(
///   initialGradient: LinearGradient(
///     colors: [Colors.blue, Colors.purple],
///   ),
///   onChanged: (gradient) => print(gradient),
/// )
/// ```

library;

import 'package:flutter/material.dart';

class GradientStop {
  final Color color;
  final double position;

  const GradientStop({
    required this.color,
    required this.position,
  });

  GradientStop copyWith({
    Color? color,
    double? position,
  }) {
    return GradientStop(
      color: color ?? this.color,
      position: position ?? this.position,
    );
  }
}

enum GradientType { linear, radial }

class AppColorGradientInput extends StatefulWidget {
  final List<GradientStop>? initialStops;
  final GradientType gradientType;
  final ValueChanged<List<GradientStop>>? onChanged;
  final String? label;

  const AppColorGradientInput({
    super.key,
    this.initialStops,
    this.gradientType = GradientType.linear,
    this.onChanged,
    this.label,
  });

  @override
  State<AppColorGradientInput> createState() => _AppColorGradientInputState();
}

class _AppColorGradientInputState extends State<AppColorGradientInput> {
  late List<GradientStop> _stops;

  @override
  void initState() {
    super.initState();
    _stops = widget.initialStops ??
        [
          const GradientStop(color: Colors.blue, position: 0.0),
          const GradientStop(color: Colors.purple, position: 1.0),
        ];
  }

  void _notifyChange() {
    widget.onChanged?.call(_stops);
  }

  void _addStop() {
    setState(() {
      _stops.add(
        GradientStop(
          color: Colors.primaries[_stops.length % Colors.primaries.length],
          position: 0.5,
        ),
      );
      _sortStops();
    });
    _notifyChange();
  }

  void _removeStop(int index) {
    if (_stops.length > 2) {
      setState(() {
        _stops.removeAt(index);
      });
      _notifyChange();
    }
  }

  void _updateStopColor(int index, Color color) {
    setState(() {
      _stops[index] = _stops[index].copyWith(color: color);
    });
    _notifyChange();
  }

  void _updateStopPosition(int index, double position) {
    setState(() {
      _stops[index] = _stops[index].copyWith(position: position);
      _sortStops();
    });
    _notifyChange();
  }

  void _sortStops() {
    _stops.sort((a, b) => a.position.compareTo(b.position));
  }

  Gradient get _gradient {
    final colors = _stops.map((s) => s.color).toList();
    final stops = _stops.map((s) => s.position).toList();

    if (widget.gradientType == GradientType.radial) {
      return RadialGradient(colors: colors, stops: stops);
    }
    return LinearGradient(colors: colors, stops: stops);
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
            style: theme.textTheme.titleSmall,
          ),
          const SizedBox(height: 8),
        ],

        // Gradient Preview
        Container(
          height: 100,
          decoration: BoxDecoration(
            gradient: _gradient,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: theme.colorScheme.outline,
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Color Stops
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Color Stops',
              style: theme.textTheme.titleSmall,
            ),
            IconButton.filledTonal(
              icon: const Icon(Icons.add),
              onPressed: _addStop,
              tooltip: 'Add Color Stop',
            ),
          ],
        ),
        const SizedBox(height: 8),

        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _stops.length,
          itemBuilder: (context, index) {
            final stop = _stops[index];
            return Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        // Color Preview
                        InkWell(
                          onTap: () => _showColorPicker(index),
                          borderRadius: BorderRadius.circular(8),
                          child: Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: stop.color,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: theme.colorScheme.outline,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),

                        // Position Slider
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Position: ${(stop.position * 100).toInt()}%',
                                style: theme.textTheme.bodySmall,
                              ),
                              Slider(
                                value: stop.position,
                                onChanged: (value) {
                                  _updateStopPosition(index, value);
                                },
                              ),
                            ],
                          ),
                        ),

                        // Remove Button
                        if (_stops.length > 2)
                          IconButton(
                            icon: const Icon(Icons.delete_outline),
                            onPressed: () => _removeStop(index),
                            tooltip: 'Remove',
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  void _showColorPicker(int index) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Choose Color'),
        content: SingleChildScrollView(
          child: Wrap(
            spacing: 8,
            runSpacing: 8,
            children: Colors.primaries.map((color) {
              return InkWell(
                onTap: () {
                  _updateStopColor(index, color);
                  Navigator.pop(context);
                },
                child: Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: color,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: _stops[index].color == color
                          ? Colors.white
                          : Colors.transparent,
                      width: 3,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}
