import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// CreditCardInput widget matching web app design
/// 
/// Matches web CreditCardInput component with all features:
/// - Card number with formatting
/// - Card type detection (Visa, Mastercard, Amex, Discover)
/// - Expiry date validation
/// - CVV input
/// - Cardholder name
/// - Card preview (optional)
class CreditCardInput extends StatefulWidget {
  final CardData? value;
  final ValueChanged<CardData>? onChanged;
  final bool disabled;
  final bool showCardPreview;

  const CreditCardInput({
    super.key,
    this.value,
    this.onChanged,
    this.disabled = false,
    this.showCardPreview = true,
  });

  @override
  State<CreditCardInput> createState() => _CreditCardInputState();
}

class _CreditCardInputState extends State<CreditCardInput> {
  late TextEditingController _numberController;
  late TextEditingController _nameController;
  late TextEditingController _expiryController;
  late TextEditingController _cvvController;

  CardType _cardType = CardType.unknown;

  @override
  void initState() {
    super.initState();
    _numberController = TextEditingController(text: widget.value?.number ?? '');
    _nameController = TextEditingController(text: widget.value?.name ?? '');
    _expiryController = TextEditingController(text: widget.value?.expiry ?? '');
    _cvvController = TextEditingController(text: widget.value?.cvv ?? '');

    _numberController.addListener(_detectCardType);
  }

  @override
  void dispose() {
    _numberController.dispose();
    _nameController.dispose();
    _expiryController.dispose();
    _cvvController.dispose();
    super.dispose();
  }

  void _detectCardType() {
    final number = _numberController.text.replaceAll(' ', '');
    CardType type = CardType.unknown;

    if (number.startsWith('4')) {
      type = CardType.visa;
    } else if (RegExp(r'^5[1-5]').hasMatch(number)) {
      type = CardType.mastercard;
    } else if (RegExp(r'^3[47]').hasMatch(number)) {
      type = CardType.amex;
    } else if (RegExp(r'^6(?:011|5)').hasMatch(number)) {
      type = CardType.discover;
    }

    if (type != _cardType) {
      setState(() => _cardType = type);
    }

    _notifyChange();
  }

  void _notifyChange() {
    widget.onChanged?.call(CardData(
      number: _numberController.text,
      name: _nameController.text,
      expiry: _expiryController.text,
      cvv: _cvvController.text,
    ));
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Card preview
        if (widget.showCardPreview) ...[
          Container(
            height: 200,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Icon(
                      _getCardIcon(),
                      size: 48,
                      color: Colors.white.withOpacity(0.9),
                    ),
                    Text(
                      _getCardTypeName(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                Text(
                  _numberController.text.isEmpty
                      ? '•••• •••• •••• ••••'
                      : _formatCardNumber(_numberController.text),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 2,
                  ),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'CARDHOLDER',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.7),
                            fontSize: 10,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _nameController.text.isEmpty
                              ? 'YOUR NAME'
                              : _nameController.text.toUpperCase(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'EXPIRES',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.7),
                            fontSize: 10,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _expiryController.text.isEmpty
                              ? 'MM/YY'
                              : _expiryController.text,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
        ],

        // Card number
        TextField(
          controller: _numberController,
          enabled: !widget.disabled,
          keyboardType: TextInputType.number,
          inputFormatters: [
            FilteringTextInputFormatter.digitsOnly,
            LengthLimitingTextInputFormatter(19),
            _CardNumberFormatter(),
          ],
          decoration: InputDecoration(
            labelText: 'Card Number',
            hintText: '1234 5678 9012 3456',
            prefixIcon: const Icon(Icons.credit_card),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          onChanged: (_) => _notifyChange(),
        ),

        const SizedBox(height: 16),

        // Name
        TextField(
          controller: _nameController,
          enabled: !widget.disabled,
          textCapitalization: TextCapitalization.words,
          decoration: InputDecoration(
            labelText: 'Cardholder Name',
            hintText: 'John Doe',
            prefixIcon: const Icon(Icons.person),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          onChanged: (_) => _notifyChange(),
        ),

        const SizedBox(height: 16),

        // Expiry and CVV
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _expiryController,
                enabled: !widget.disabled,
                keyboardType: TextInputType.number,
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(4),
                  _ExpiryDateFormatter(),
                ],
                decoration: InputDecoration(
                  labelText: 'Expiry Date',
                  hintText: 'MM/YY',
                  prefixIcon: const Icon(Icons.calendar_today),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onChanged: (_) => _notifyChange(),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextField(
                controller: _cvvController,
                enabled: !widget.disabled,
                keyboardType: TextInputType.number,
                obscureText: true,
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(
                    _cardType == CardType.amex ? 4 : 3,
                  ),
                ],
                decoration: InputDecoration(
                  labelText: 'CVV',
                  hintText: _cardType == CardType.amex ? '1234' : '123',
                  prefixIcon: const Icon(Icons.lock),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onChanged: (_) => _notifyChange(),
              ),
            ),
          ],
        ),
      ],
    );
  }

  IconData _getCardIcon() {
    switch (_cardType) {
      case CardType.visa:
      case CardType.mastercard:
      case CardType.amex:
      case CardType.discover:
        return Icons.credit_card;
      case CardType.unknown:
        return Icons.credit_card_outlined;
    }
  }

  String _getCardTypeName() {
    switch (_cardType) {
      case CardType.visa:
        return 'VISA';
      case CardType.mastercard:
        return 'MASTERCARD';
      case CardType.amex:
        return 'AMEX';
      case CardType.discover:
        return 'DISCOVER';
      case CardType.unknown:
        return '';
    }
  }

  String _formatCardNumber(String value) {
    final cleaned = value.replaceAll(' ', '');
    if (cleaned.isEmpty) return '';
    
    final buffer = StringBuffer();
    for (var i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 == 0) {
        buffer.write(' ');
      }
      buffer.write(cleaned[i]);
    }
    return buffer.toString();
  }
}

/// Card data model
class CardData {
  final String number;
  final String name;
  final String expiry;
  final String cvv;

  const CardData({
    required this.number,
    required this.name,
    required this.expiry,
    required this.cvv,
  });
}

/// Card types
enum CardType {
  visa,
  mastercard,
  amex,
  discover,
  unknown,
}

/// Card number formatter
class _CardNumberFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final text = newValue.text.replaceAll(' ', '');
    final buffer = StringBuffer();
    
    for (var i = 0; i < text.length; i++) {
      if (i > 0 && i % 4 == 0) {
        buffer.write(' ');
      }
      buffer.write(text[i]);
    }
    
    final formatted = buffer.toString();
    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}

/// Expiry date formatter
class _ExpiryDateFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final text = newValue.text.replaceAll('/', '');
    if (text.length <= 2) {
      return newValue.copyWith(text: text);
    }
    
    final formatted = '${text.substring(0, 2)}/${text.substring(2)}';
    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}
