/// Barcode Input Widget
/// 
/// A specialized input for scanning and entering barcodes/QR codes.
/// 
/// Features:
/// - Manual barcode entry
/// - Camera scanner button
/// - Barcode validation
/// - Multiple format support
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppBarcodeInput(
///   onChanged: (barcode) => print(barcode),
///   barcodeType: BarcodeType.qr,
/// )
/// ```

library;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

enum BarcodeType {
  qr,
  ean13,
  ean8,
  code128,
  code39,
  upcA,
  upcE,
  any,
}

class AppBarcodeInput extends StatefulWidget {
  final String? initialValue;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onScanned;
  final BarcodeType barcodeType;
  final String? label;
  final String? hint;
  final bool enabled;
  final bool required;
  final String? errorText;
  final VoidCallback? onScanPressed;

  const AppBarcodeInput({
    super.key,
    this.initialValue,
    this.onChanged,
    this.onScanned,
    this.barcodeType = BarcodeType.any,
    this.label,
    this.hint,
    this.enabled = true,
    this.required = false,
    this.errorText,
    this.onScanPressed,
  });

  @override
  State<AppBarcodeInput> createState() => _AppBarcodeInputState();
}

class _AppBarcodeInputState extends State<AppBarcodeInput> {
  late TextEditingController _controller;
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialValue);
    _controller.addListener(() {
      widget.onChanged?.call(_controller.text);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  String get _barcodeTypeLabel {
    switch (widget.barcodeType) {
      case BarcodeType.qr:
        return 'QR Code';
      case BarcodeType.ean13:
        return 'EAN-13';
      case BarcodeType.ean8:
        return 'EAN-8';
      case BarcodeType.code128:
        return 'Code 128';
      case BarcodeType.code39:
        return 'Code 39';
      case BarcodeType.upcA:
        return 'UPC-A';
      case BarcodeType.upcE:
        return 'UPC-E';
      case BarcodeType.any:
        return 'Barcode';
    }
  }

  IconData get _barcodeIcon {
    if (widget.barcodeType == BarcodeType.qr) {
      return Icons.qr_code_2;
    }
    return Icons.barcode_reader;
  }

  List<TextInputFormatter> get _inputFormatters {
    switch (widget.barcodeType) {
      case BarcodeType.ean13:
        return [
          FilteringTextInputFormatter.digitsOnly,
          LengthLimitingTextInputFormatter(13),
        ];
      case BarcodeType.ean8:
        return [
          FilteringTextInputFormatter.digitsOnly,
          LengthLimitingTextInputFormatter(8),
        ];
      case BarcodeType.upcA:
        return [
          FilteringTextInputFormatter.digitsOnly,
          LengthLimitingTextInputFormatter(12),
        ];
      case BarcodeType.upcE:
        return [
          FilteringTextInputFormatter.digitsOnly,
          LengthLimitingTextInputFormatter(8),
        ];
      default:
        return [];
    }
  }

  void _handleScan() {
    if (widget.onScanPressed != null) {
      widget.onScanPressed!();
    } else {
      // Show scanner dialog (placeholder)
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Scan $_barcodeTypeLabel'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(_barcodeIcon, size: 120, color: Colors.grey),
              const SizedBox(height: 16),
              const Text('Camera scanner not implemented'),
              const SizedBox(height: 8),
              const Text(
                'Please use mobile_scanner package for real scanning',
                style: TextStyle(fontSize: 12, color: Colors.grey),
                textAlign: TextAlign.center,
              ),
            ],
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
        TextField(
          controller: _controller,
          focusNode: _focusNode,
          enabled: widget.enabled,
          inputFormatters: _inputFormatters,
          decoration: InputDecoration(
            labelText: _barcodeTypeLabel,
            hintText: widget.hint ?? 'Enter or scan $_barcodeTypeLabel',
            border: const OutlineInputBorder(),
            prefixIcon: Icon(_barcodeIcon),
            suffixIcon: IconButton(
              icon: const Icon(Icons.qr_code_scanner),
              tooltip: 'Scan $_barcodeTypeLabel',
              onPressed: widget.enabled ? _handleScan : null,
            ),
            errorText: widget.errorText,
          ),
          keyboardType: (widget.barcodeType == BarcodeType.ean13 ||
                  widget.barcodeType == BarcodeType.ean8 ||
                  widget.barcodeType == BarcodeType.upcA ||
                  widget.barcodeType == BarcodeType.upcE)
              ? TextInputType.number
              : TextInputType.text,
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Icon(
              Icons.info_outline,
              size: 14,
              color: theme.colorScheme.onSurfaceVariant,
            ),
            const SizedBox(width: 4),
            Expanded(
              child: Text(
                'Click scanner icon to use camera',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
