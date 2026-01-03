/// Signature Input Widget
/// 
/// A specialized input for capturing handwritten signatures.
/// 
/// Features:
/// - Canvas-based drawing
/// - Clear/Undo functionality
/// - Export as image data
/// - Stroke customization
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppSignatureInput(
///   onChanged: (signature) => print('Signature captured'),
/// )
/// ```

library;

import 'package:flutter/material.dart';
import 'dart:ui' as ui;

class SignaturePoint {
  final Offset point;
  final DateTime timestamp;

  SignaturePoint(this.point, this.timestamp);
}

class AppSignatureInput extends StatefulWidget {
  final ValueChanged<List<Offset>>? onChanged;
  final String? label;
  final double height;
  final Color? strokeColor;
  final double strokeWidth;
  final bool enabled;

  const AppSignatureInput({
    super.key,
    this.onChanged,
    this.label,
    this.height = 200,
    this.strokeColor,
    this.strokeWidth = 2.0,
    this.enabled = true,
  });

  @override
  State<AppSignatureInput> createState() => _AppSignatureInputState();
}

class _AppSignatureInputState extends State<AppSignatureInput> {
  final List<List<Offset>> _strokes = [];
  List<Offset> _currentStroke = [];
  bool _isSigned = false;

  void _onPanStart(DragStartDetails details) {
    if (!widget.enabled) return;

    setState(() {
      _currentStroke = [details.localPosition];
      _isSigned = true;
    });
  }

  void _onPanUpdate(DragUpdateDetails details) {
    if (!widget.enabled) return;

    setState(() {
      _currentStroke.add(details.localPosition);
    });
  }

  void _onPanEnd(DragEndDetails details) {
    if (!widget.enabled) return;

    setState(() {
      _strokes.add(List.from(_currentStroke));
      _currentStroke = [];
    });

    // Flatten all strokes into single list
    final allPoints = _strokes.expand((stroke) => stroke).toList();
    widget.onChanged?.call(allPoints);
  }

  void _clear() {
    setState(() {
      _strokes.clear();
      _currentStroke = [];
      _isSigned = false;
    });
    widget.onChanged?.call([]);
  }

  void _undo() {
    if (_strokes.isNotEmpty) {
      setState(() {
        _strokes.removeLast();
        _isSigned = _strokes.isNotEmpty;
      });

      final allPoints = _strokes.expand((stroke) => stroke).toList();
      widget.onChanged?.call(allPoints);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final strokeColor = widget.strokeColor ?? theme.colorScheme.primary;

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

        // Signature Canvas
        Container(
          height: widget.height,
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            border: Border.all(
              color: theme.colorScheme.outline,
              width: 1,
            ),
            borderRadius: BorderRadius.circular(8),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Stack(
              children: [
                // Signature hint
                if (!_isSigned)
                  Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.gesture,
                          size: 48,
                          color: theme.colorScheme.onSurfaceVariant.withOpacity(0.3),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Sign here',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant.withOpacity(0.5),
                          ),
                        ),
                      ],
                    ),
                  ),

                // Canvas
                GestureDetector(
                  onPanStart: _onPanStart,
                  onPanUpdate: _onPanUpdate,
                  onPanEnd: _onPanEnd,
                  child: CustomPaint(
                    painter: _SignaturePainter(
                      strokes: _strokes,
                      currentStroke: _currentStroke,
                      strokeColor: strokeColor,
                      strokeWidth: widget.strokeWidth,
                    ),
                    child: Container(),
                  ),
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 8),

        // Actions
        Row(
          children: [
            OutlinedButton.icon(
              onPressed: widget.enabled && _isSigned ? _clear : null,
              icon: const Icon(Icons.clear, size: 16),
              label: const Text('Clear'),
            ),
            const SizedBox(width: 8),
            OutlinedButton.icon(
              onPressed: widget.enabled && _strokes.isNotEmpty ? _undo : null,
              icon: const Icon(Icons.undo, size: 16),
              label: const Text('Undo'),
            ),
            const Spacer(),
            if (_isSigned)
              Chip(
                avatar: Icon(
                  Icons.check_circle,
                  size: 16,
                  color: theme.colorScheme.primary,
                ),
                label: const Text('Signed'),
                backgroundColor: theme.colorScheme.primaryContainer,
              ),
          ],
        ),
      ],
    );
  }
}

class _SignaturePainter extends CustomPainter {
  final List<List<Offset>> strokes;
  final List<Offset> currentStroke;
  final Color strokeColor;
  final double strokeWidth;

  _SignaturePainter({
    required this.strokes,
    required this.currentStroke,
    required this.strokeColor,
    required this.strokeWidth,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = strokeColor
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..style = PaintingStyle.stroke;

    // Draw completed strokes
    for (final stroke in strokes) {
      _drawStroke(canvas, stroke, paint);
    }

    // Draw current stroke
    if (currentStroke.isNotEmpty) {
      _drawStroke(canvas, currentStroke, paint);
    }
  }

  void _drawStroke(Canvas canvas, List<Offset> points, Paint paint) {
    if (points.isEmpty) return;

    if (points.length == 1) {
      canvas.drawCircle(points[0], strokeWidth / 2, paint);
      return;
    }

    final path = Path();
    path.moveTo(points[0].dx, points[0].dy);

    for (var i = 1; i < points.length; i++) {
      path.lineTo(points[i].dx, points[i].dy);
    }

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(_SignaturePainter oldDelegate) {
    return oldDelegate.strokes != strokes ||
        oldDelegate.currentStroke != currentStroke;
  }
}
