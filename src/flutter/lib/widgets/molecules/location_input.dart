/// Location Input Widget
/// 
/// A specialized input for selecting geographic locations with autocomplete.
/// 
/// Features:
/// - Location search
/// - Autocomplete suggestions
/// - Current location
/// - Coordinate display
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppLocationInput(
///   onChanged: (location) => print(location),
/// )
/// ```

library;

import 'package:flutter/material.dart';

class LocationData {
  final String name;
  final String address;
  final double? latitude;
  final double? longitude;

  const LocationData({
    required this.name,
    required this.address,
    this.latitude,
    this.longitude,
  });

  @override
  String toString() => name;
}

class AppLocationInput extends StatefulWidget {
  final LocationData? initialValue;
  final ValueChanged<LocationData>? onChanged;
  final String? label;
  final bool enabled;
  final bool showCurrentLocation;

  const AppLocationInput({
    super.key,
    this.initialValue,
    this.onChanged,
    this.label,
    this.enabled = true,
    this.showCurrentLocation = true,
  });

  @override
  State<AppLocationInput> createState() => _AppLocationInputState();
}

class _AppLocationInputState extends State<AppLocationInput> {
  late TextEditingController _controller;
  final FocusNode _focusNode = FocusNode();
  final LayerLink _layerLink = LayerLink();
  OverlayEntry? _overlayEntry;
  List<LocationData> _suggestions = [];
  LocationData? _selectedLocation;

  // Mock data for demonstration
  final List<LocationData> _mockLocations = const [
    LocationData(
      name: 'Hanoi',
      address: 'Hanoi, Vietnam',
      latitude: 21.0285,
      longitude: 105.8542,
    ),
    LocationData(
      name: 'Ho Chi Minh City',
      address: 'Ho Chi Minh City, Vietnam',
      latitude: 10.8231,
      longitude: 106.6297,
    ),
    LocationData(
      name: 'Da Nang',
      address: 'Da Nang, Vietnam',
      latitude: 16.0544,
      longitude: 108.2022,
    ),
    LocationData(
      name: 'Hoi An',
      address: 'Hoi An, Quang Nam, Vietnam',
      latitude: 15.8801,
      longitude: 108.3380,
    ),
    LocationData(
      name: 'Ha Long Bay',
      address: 'Ha Long, Quang Ninh, Vietnam',
      latitude: 20.9101,
      longitude: 107.1839,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _selectedLocation = widget.initialValue;
    _controller = TextEditingController(
      text: widget.initialValue?.name ?? '',
    );
    _controller.addListener(_onSearchChanged);
    _focusNode.addListener(_onFocusChanged);
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    _removeOverlay();
    super.dispose();
  }

  void _onSearchChanged() {
    final query = _controller.text.toLowerCase();
    
    if (query.isEmpty) {
      setState(() {
        _suggestions = [];
      });
      _removeOverlay();
      return;
    }

    // Filter mock locations
    setState(() {
      _suggestions = _mockLocations
          .where((loc) => 
              loc.name.toLowerCase().contains(query) ||
              loc.address.toLowerCase().contains(query))
          .toList();
    });

    if (_suggestions.isNotEmpty) {
      _showOverlay();
    } else {
      _removeOverlay();
    }
  }

  void _onFocusChanged() {
    if (!_focusNode.hasFocus) {
      _removeOverlay();
    }
  }

  void _showOverlay() {
    _removeOverlay();

    _overlayEntry = OverlayEntry(
      builder: (context) => Positioned(
        width: context.size?.width,
        child: CompositedTransformFollower(
          link: _layerLink,
          showWhenUnlinked: false,
          offset: const Offset(0, 60),
          child: Material(
            elevation: 4,
            borderRadius: BorderRadius.circular(8),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxHeight: 200),
              child: ListView.builder(
                shrinkWrap: true,
                padding: EdgeInsets.zero,
                itemCount: _suggestions.length,
                itemBuilder: (context, index) {
                  final location = _suggestions[index];
                  return ListTile(
                    leading: const Icon(Icons.location_on),
                    title: Text(location.name),
                    subtitle: Text(location.address),
                    onTap: () => _selectLocation(location),
                  );
                },
              ),
            ),
          ),
        ),
      ),
    );

    Overlay.of(context).insert(_overlayEntry!);
  }

  void _removeOverlay() {
    _overlayEntry?.remove();
    _overlayEntry = null;
  }

  void _selectLocation(LocationData location) {
    setState(() {
      _selectedLocation = location;
      _controller.text = location.name;
      _suggestions = [];
    });
    _removeOverlay();
    _focusNode.unfocus();
    widget.onChanged?.call(location);
  }

  void _getCurrentLocation() {
    // Mock current location
    const currentLocation = LocationData(
      name: 'Current Location',
      address: 'Your current location',
      latitude: 21.0285,
      longitude: 105.8542,
    );
    _selectLocation(currentLocation);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return CompositedTransformTarget(
      link: _layerLink,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: _controller,
            focusNode: _focusNode,
            enabled: widget.enabled,
            decoration: InputDecoration(
              labelText: widget.label ?? 'Location',
              hintText: 'Search for a location',
              border: const OutlineInputBorder(),
              prefixIcon: const Icon(Icons.search),
              suffixIcon: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (_controller.text.isNotEmpty)
                    IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        _controller.clear();
                        setState(() {
                          _selectedLocation = null;
                        });
                      },
                    ),
                  if (widget.showCurrentLocation)
                    IconButton(
                      icon: const Icon(Icons.my_location),
                      onPressed: _getCurrentLocation,
                      tooltip: 'Use current location',
                    ),
                ],
              ),
            ),
          ),

          // Selected location details
          if (_selectedLocation != null &&
              _selectedLocation!.latitude != null) ...[
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceContainerHighest,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.location_on,
                        size: 16,
                        color: theme.colorScheme.primary,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _selectedLocation!.address,
                          style: theme.textTheme.bodySmall,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Lat: ${_selectedLocation!.latitude?.toStringAsFixed(4)}, '
                    'Lng: ${_selectedLocation!.longitude?.toStringAsFixed(4)}',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
