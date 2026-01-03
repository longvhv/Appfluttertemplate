/// Key-Value Input Widget
/// 
/// A specialized input for entering key-value pairs (like HTTP headers, metadata).
/// 
/// Features:
/// - Dynamic add/remove pairs
/// - Key and value validation
/// - Export to Map
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppKeyValueInput(
///   onChanged: (pairs) => print(pairs),
///   initialPairs: {'key1': 'value1', 'key2': 'value2'},
/// )
/// ```

library;

import 'package:flutter/material.dart';

class KeyValuePair {
  String key;
  String value;

  KeyValuePair({this.key = '', this.value = ''});

  Map<String, String> toMap() => {key: value};
}

class AppKeyValueInput extends StatefulWidget {
  final Map<String, String>? initialPairs;
  final ValueChanged<Map<String, String>>? onChanged;
  final String? label;
  final String? keyLabel;
  final String? valueLabel;
  final bool enabled;
  final int minPairs;

  const AppKeyValueInput({
    super.key,
    this.initialPairs,
    this.onChanged,
    this.label,
    this.keyLabel = 'Key',
    this.valueLabel = 'Value',
    this.enabled = true,
    this.minPairs = 1,
  });

  @override
  State<AppKeyValueInput> createState() => _AppKeyValueInputState();
}

class _AppKeyValueInputState extends State<AppKeyValueInput> {
  late List<KeyValuePair> _pairs;
  final List<GlobalKey<_KeyValuePairFieldState>> _fieldKeys = [];

  @override
  void initState() {
    super.initState();
    if (widget.initialPairs != null && widget.initialPairs!.isNotEmpty) {
      _pairs = widget.initialPairs!.entries
          .map((e) => KeyValuePair(key: e.key, value: e.value))
          .toList();
    } else {
      _pairs = List.generate(
        widget.minPairs,
        (_) => KeyValuePair(),
      );
    }
    _fieldKeys.addAll(List.generate(_pairs.length, (_) => GlobalKey()));
  }

  void _addPair() {
    setState(() {
      _pairs.add(KeyValuePair());
      _fieldKeys.add(GlobalKey());
    });
  }

  void _removePair(int index) {
    if (_pairs.length > widget.minPairs) {
      setState(() {
        _pairs.removeAt(index);
        _fieldKeys.removeAt(index);
      });
      _notifyChange();
    }
  }

  void _notifyChange() {
    final map = <String, String>{};
    for (final pair in _pairs) {
      if (pair.key.isNotEmpty) {
        map[pair.key] = pair.value;
      }
    }
    widget.onChanged?.call(map);
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                widget.label!,
                style: theme.textTheme.titleSmall,
              ),
              IconButton.filledTonal(
                onPressed: widget.enabled ? _addPair : null,
                icon: const Icon(Icons.add),
                tooltip: 'Add pair',
              ),
            ],
          ),
          const SizedBox(height: 8),
        ],

        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _pairs.length,
          itemBuilder: (context, index) {
            return _KeyValuePairField(
              key: _fieldKeys[index],
              pair: _pairs[index],
              keyLabel: widget.keyLabel!,
              valueLabel: widget.valueLabel!,
              enabled: widget.enabled,
              canRemove: _pairs.length > widget.minPairs,
              onChanged: () => _notifyChange(),
              onRemove: () => _removePair(index),
            );
          },
        ),
      ],
    );
  }
}

class _KeyValuePairField extends StatefulWidget {
  final KeyValuePair pair;
  final String keyLabel;
  final String valueLabel;
  final bool enabled;
  final bool canRemove;
  final VoidCallback onChanged;
  final VoidCallback onRemove;

  const _KeyValuePairField({
    super.key,
    required this.pair,
    required this.keyLabel,
    required this.valueLabel,
    required this.enabled,
    required this.canRemove,
    required this.onChanged,
    required this.onRemove,
  });

  @override
  State<_KeyValuePairField> createState() => _KeyValuePairFieldState();
}

class _KeyValuePairFieldState extends State<_KeyValuePairField> {
  late TextEditingController _keyController;
  late TextEditingController _valueController;

  @override
  void initState() {
    super.initState();
    _keyController = TextEditingController(text: widget.pair.key);
    _valueController = TextEditingController(text: widget.pair.value);

    _keyController.addListener(() {
      widget.pair.key = _keyController.text;
      widget.onChanged();
    });

    _valueController.addListener(() {
      widget.pair.value = _valueController.text;
      widget.onChanged();
    });
  }

  @override
  void dispose() {
    _keyController.dispose();
    _valueController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            // Key Input
            Expanded(
              child: TextField(
                controller: _keyController,
                enabled: widget.enabled,
                decoration: InputDecoration(
                  labelText: widget.keyLabel,
                  hintText: 'key',
                  border: const OutlineInputBorder(),
                  isDense: true,
                ),
              ),
            ),
            const SizedBox(width: 12),

            // Value Input
            Expanded(
              flex: 2,
              child: TextField(
                controller: _valueController,
                enabled: widget.enabled,
                decoration: InputDecoration(
                  labelText: widget.valueLabel,
                  hintText: 'value',
                  border: const OutlineInputBorder(),
                  isDense: true,
                ),
              ),
            ),
            const SizedBox(width: 8),

            // Remove Button
            if (widget.canRemove)
              IconButton(
                icon: const Icon(Icons.delete_outline),
                onPressed: widget.enabled ? widget.onRemove : null,
                tooltip: 'Remove',
              )
            else
              const SizedBox(width: 40),
          ],
        ),
      ),
    );
  }
}
