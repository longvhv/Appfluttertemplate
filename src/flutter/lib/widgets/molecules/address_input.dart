/// Address Input Widget
/// 
/// A specialized input component for entering complete addresses with street,
/// city, state, zip code, and country fields.
/// 
/// Features:
/// - Multi-field address input
/// - Country selector
/// - Validation support
/// - Auto-complete integration
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppAddressInput(
///   onChanged: (address) => print(address),
///   initialValue: Address(
///     street: '123 Main St',
///     city: 'New York',
///   ),
/// )
/// ```

library;

import 'package:flutter/material.dart';

/// Address data model
class Address {
  final String street;
  final String city;
  final String state;
  final String zipCode;
  final String country;

  const Address({
    this.street = '',
    this.city = '',
    this.state = '',
    this.zipCode = '',
    this.country = 'Vietnam',
  });

  Address copyWith({
    String? street,
    String? city,
    String? state,
    String? zipCode,
    String? country,
  }) {
    return Address(
      street: street ?? this.street,
      city: city ?? this.city,
      state: state ?? this.state,
      zipCode: zipCode ?? this.zipCode,
      country: country ?? this.country,
    );
  }

  Map<String, String> toMap() {
    return {
      'street': street,
      'city': city,
      'state': state,
      'zipCode': zipCode,
      'country': country,
    };
  }

  @override
  String toString() {
    return '$street, $city, $state $zipCode, $country';
  }
}

/// Address Input Widget
class AppAddressInput extends StatefulWidget {
  final Address? initialValue;
  final ValueChanged<Address>? onChanged;
  final String? label;
  final bool enabled;
  final bool required;
  final String? errorText;

  const AppAddressInput({
    super.key,
    this.initialValue,
    this.onChanged,
    this.label,
    this.enabled = true,
    this.required = false,
    this.errorText,
  });

  @override
  State<AppAddressInput> createState() => _AppAddressInputState();
}

class _AppAddressInputState extends State<AppAddressInput> {
  late TextEditingController _streetController;
  late TextEditingController _cityController;
  late TextEditingController _stateController;
  late TextEditingController _zipController;
  late String _selectedCountry;

  final List<String> _countries = [
    'Vietnam',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Singapore',
    'Japan',
    'South Korea',
    'Thailand',
    'Malaysia',
  ];

  @override
  void initState() {
    super.initState();
    _streetController = TextEditingController(text: widget.initialValue?.street ?? '');
    _cityController = TextEditingController(text: widget.initialValue?.city ?? '');
    _stateController = TextEditingController(text: widget.initialValue?.state ?? '');
    _zipController = TextEditingController(text: widget.initialValue?.zipCode ?? '');
    _selectedCountry = widget.initialValue?.country ?? 'Vietnam';

    _streetController.addListener(_notifyChange);
    _cityController.addListener(_notifyChange);
    _stateController.addListener(_notifyChange);
    _zipController.addListener(_notifyChange);
  }

  @override
  void dispose() {
    _streetController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _zipController.dispose();
    super.dispose();
  }

  void _notifyChange() {
    widget.onChanged?.call(Address(
      street: _streetController.text,
      city: _cityController.text,
      state: _stateController.text,
      zipCode: _zipController.text,
      country: _selectedCountry,
    ));
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.label != null) ...[
          Row(
            children: [
              Text(
                widget.label!,
                style: theme.textTheme.titleSmall,
              ),
              if (widget.required)
                Text(
                  ' *',
                  style: TextStyle(color: theme.colorScheme.error),
                ),
            ],
          ),
          const SizedBox(height: 8),
        ],

        // Street Address
        TextField(
          controller: _streetController,
          enabled: widget.enabled,
          decoration: InputDecoration(
            labelText: 'Street Address',
            hintText: '123 Main Street',
            border: const OutlineInputBorder(),
            prefixIcon: const Icon(Icons.home_outlined),
          ),
        ),
        const SizedBox(height: 12),

        // City
        TextField(
          controller: _cityController,
          enabled: widget.enabled,
          decoration: InputDecoration(
            labelText: 'City',
            hintText: 'Hanoi',
            border: const OutlineInputBorder(),
            prefixIcon: const Icon(Icons.location_city_outlined),
          ),
        ),
        const SizedBox(height: 12),

        // State & Zip Code (Row)
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _stateController,
                enabled: widget.enabled,
                decoration: InputDecoration(
                  labelText: 'State/Province',
                  hintText: 'Hanoi',
                  border: const OutlineInputBorder(),
                  prefixIcon: const Icon(Icons.map_outlined),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: TextField(
                controller: _zipController,
                enabled: widget.enabled,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'Zip/Postal Code',
                  hintText: '100000',
                  border: const OutlineInputBorder(),
                  prefixIcon: const Icon(Icons.pin_outlined),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),

        // Country
        DropdownButtonFormField<String>(
          value: _selectedCountry,
          isExpanded: true,
          decoration: InputDecoration(
            labelText: 'Country',
            border: const OutlineInputBorder(),
            prefixIcon: const Icon(Icons.public_outlined),
          ),
          items: _countries.map((country) {
            return DropdownMenuItem(
              value: country,
              child: Text(country),
            );
          }).toList(),
          onChanged: widget.enabled
              ? (value) {
                  if (value != null) {
                    setState(() {
                      _selectedCountry = value;
                    });
                    _notifyChange();
                  }
                }
              : null,
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
      ],
    );
  }
}
