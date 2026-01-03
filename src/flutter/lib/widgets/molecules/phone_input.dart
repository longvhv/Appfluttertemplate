import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Phone number input with country code
class PhoneInput extends StatefulWidget {
  final String? label;
  final String? hintText;
  final String? helperText;
  final String? errorText;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final String defaultCountryCode;
  final bool enabled;

  const PhoneInput({
    Key? key,
    this.label,
    this.hintText,
    this.helperText,
    this.errorText,
    this.controller,
    this.onChanged,
    this.defaultCountryCode = '+1',
    this.enabled = true,
  }) : super(key: key);

  @override
  State<PhoneInput> createState() => _PhoneInputState();
}

class _PhoneInputState extends State<PhoneInput> {
  late String _selectedCountryCode;
  final List<CountryCode> _countryCodes = [
    CountryCode(code: '+1', country: 'US', flag: '🇺🇸'),
    CountryCode(code: '+44', country: 'UK', flag: '🇬🇧'),
    CountryCode(code: '+84', country: 'VN', flag: '🇻🇳'),
    CountryCode(code: '+86', country: 'CN', flag: '🇨🇳'),
    CountryCode(code: '+81', country: 'JP', flag: '🇯🇵'),
    CountryCode(code: '+82', country: 'KR', flag: '🇰🇷'),
    CountryCode(code: '+65', country: 'SG', flag: '🇸🇬'),
    CountryCode(code: '+91', country: 'IN', flag: '🇮🇳'),
  ];

  @override
  void initState() {
    super.initState();
    _selectedCountryCode = widget.defaultCountryCode;
  }

  void _showCountryCodePicker() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        child: ListView.builder(
          itemCount: _countryCodes.length,
          itemBuilder: (context, index) {
            final country = _countryCodes[index];
            return ListTile(
              leading: Text(
                country.flag,
                style: const TextStyle(fontSize: 24),
              ),
              title: Text(country.country),
              trailing: Text(
                country.code,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
              ),
              onTap: () {
                setState(() {
                  _selectedCountryCode = country.code;
                });
                Navigator.pop(context);
              },
            );
          },
        ),
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
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
        ],
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Country code selector
            InkWell(
              onTap: widget.enabled ? _showCountryCodePicker : null,
              borderRadius: BorderRadius.circular(8),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 16,
                ),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.shade300),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      _countryCodes
                          .firstWhere((c) => c.code == _selectedCountryCode)
                          .flag,
                      style: const TextStyle(fontSize: 20),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      _selectedCountryCode,
                      style: theme.textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(width: 4),
                    const Icon(Icons.arrow_drop_down, size: 20),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 8),
            // Phone number input
            Expanded(
              child: TextFormField(
                controller: widget.controller,
                enabled: widget.enabled,
                keyboardType: TextInputType.phone,
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(15),
                ],
                onChanged: widget.onChanged,
                decoration: InputDecoration(
                  hintText: widget.hintText ?? '123 456 7890',
                  helperText: widget.helperText,
                  errorText: widget.errorText,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class CountryCode {
  final String code;
  final String country;
  final String flag;

  CountryCode({
    required this.code,
    required this.country,
    required this.flag,
  });
}
