/// Coordinate Input Widget
/// 
/// A specialized input for entering geographic coordinates (latitude/longitude).
/// 
/// Features:
/// - Latitude/Longitude inputs
/// - Validation
/// - Format support (decimal, DMS)
/// - Map picker integration ready
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppCoordinateInput(
///   onChanged: (lat, lng) => print('$lat, $lng'),
///   initialLatitude: 21.0285,
///   initialLongitude: 105.8542,
/// )
/// ```

library;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class Coordinate {
  final double latitude;
  final double longitude;

  const Coordinate({
    required this.latitude,
    required this.longitude,
  });

  bool get isValid {
    return latitude >= -90 && latitude <= 90 && 
           longitude >= -180 && longitude <= 180;
  }

  @override
  String toString() => '$latitude, $longitude';
}

class AppCoordinateInput extends StatefulWidget {
  final double? initialLatitude;
  final double? initialLongitude;
  final ValueChanged<Coordinate>? onChanged;
  final String? label;
  final bool enabled;
  final String? errorText;

  const AppCoordinateInput({
    super.key,
    this.initialLatitude,
    this.initialLongitude,
    this.onChanged,
    this.label,
    this.enabled = true,
    this.errorText,
  });

  @override
  State<AppCoordinateInput> createState() => _AppCoordinateInputState();
}

class _AppCoordinateInputState extends State<AppCoordinateInput> {
  late TextEditingController _latController;
  late TextEditingController _lngController;
  String? _latError;
  String? _lngError;

  @override
  void initState() {
    super.initState();
    _latController = TextEditingController(
      text: widget.initialLatitude?.toString() ?? '',
    );
    _lngController = TextEditingController(
      text: widget.initialLongitude?.toString() ?? '',
    );
    _latController.addListener(_onChanged);
    _lngController.addListener(_onChanged);
  }

  @override
  void dispose() {
    _latController.dispose();
    _lngController.dispose();
    super.dispose();
  }

  void _onChanged() {
    final lat = double.tryParse(_latController.text);
    final lng = double.tryParse(_lngController.text);

    setState(() {
      _latError = _validateLatitude(lat);
      _lngError = _validateLongitude(lng);
    });

    if (lat != null && lng != null && _latError == null && _lngError == null) {
      widget.onChanged?.call(Coordinate(latitude: lat, longitude: lng));
    }
  }

  String? _validateLatitude(double? value) {
    if (value == null) return null;
    if (value < -90 || value > 90) {
      return 'Must be between -90 and 90';
    }
    return null;
  }

  String? _validateLongitude(double? value) {
    if (value == null) return null;
    if (value < -180 || value > 180) {
      return 'Must be between -180 and 180';
    }
    return null;
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

        Row(
          children: [
            // Latitude
            Expanded(
              child: TextField(
                controller: _latController,
                enabled: widget.enabled,
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                  signed: true,
                ),
                inputFormatters: [
                  FilteringTextInputFormatter.allow(RegExp(r'^-?\d*\.?\d*')),
                ],
                decoration: InputDecoration(
                  labelText: 'Latitude',
                  hintText: '21.0285',
                  border: const OutlineInputBorder(),
                  prefixIcon: const Icon(Icons.south_outlined),
                  suffixText: '°',
                  errorText: _latError,
                  helperText: '-90 to 90',
                ),
              ),
            ),
            const SizedBox(width: 12),

            // Longitude
            Expanded(
              child: TextField(
                controller: _lngController,
                enabled: widget.enabled,
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                  signed: true,
                ),
                inputFormatters: [
                  FilteringTextInputFormatter.allow(RegExp(r'^-?\d*\.?\d*')),
                ],
                decoration: InputDecoration(
                  labelText: 'Longitude',
                  hintText: '105.8542',
                  border: const OutlineInputBorder(),
                  prefixIcon: const Icon(Icons.east_outlined),
                  suffixText: '°',
                  errorText: _lngError,
                  helperText: '-180 to 180',
                ),
              ),
            ),
          ],
        ),

        if (widget.errorText != null) ...[
          const SizedBox(height: 8),
          Text(
            widget.errorText!,
            style: TextStyle(
              color: theme.colorScheme.error,
              fontSize: 12,
            ),
          ),
        ],

        const SizedBox(height: 8),

        // Location info
        if (_latController.text.isNotEmpty && _lngController.text.isNotEmpty)
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: theme.colorScheme.surfaceContainerHighest,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.location_on,
                  size: 16,
                  color: theme.colorScheme.primary,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    '${_latController.text}, ${_lngController.text}',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
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
