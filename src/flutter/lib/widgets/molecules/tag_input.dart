import 'package:flutter/material.dart';

/// Tag input widget for multiple tags
/// 
/// Provides:
/// - Add/remove tags
/// - Chip-style display
/// - Custom validation
/// - Max tags limit
class AppTagInput extends StatefulWidget {
  final String? label;
  final String? hint;
  final List<String> initialTags;
  final int? maxTags;
  final ValueChanged<List<String>>? onChanged;
  final String? Function(String)? validateTag;

  const AppTagInput({
    super.key,
    this.label,
    this.hint = 'Type and press Enter',
    this.initialTags = const [],
    this.maxTags,
    this.onChanged,
    this.validateTag,
  });

  @override
  State<AppTagInput> createState() => _AppTagInputState();
}

class _AppTagInputState extends State<AppTagInput> {
  late List<String> _tags;
  late TextEditingController _controller;
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _tags = List.from(widget.initialTags);
    _controller = TextEditingController();
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _addTag(String tag) {
    final trimmed = tag.trim();
    
    if (trimmed.isEmpty) return;
    if (_tags.contains(trimmed)) return;
    if (widget.maxTags != null && _tags.length >= widget.maxTags!) return;
    
    // Validate tag
    if (widget.validateTag != null) {
      final error = widget.validateTag!(trimmed);
      if (error != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error)),
        );
        return;
      }
    }

    setState(() {
      _tags.add(trimmed);
      _controller.clear();
    });
    
    widget.onChanged?.call(_tags);
  }

  void _removeTag(String tag) {
    setState(() {
      _tags.remove(tag);
    });
    widget.onChanged?.call(_tags);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
        ],
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: colorScheme.outline),
            borderRadius: BorderRadius.circular(8),
          ),
          padding: const EdgeInsets.all(8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Tags display
              if (_tags.isNotEmpty)
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _tags.map((tag) {
                    return Chip(
                      label: Text(tag),
                      onDeleted: () => _removeTag(tag),
                      deleteIcon: const Icon(Icons.close, size: 18),
                    );
                  }).toList(),
                ),
              
              if (_tags.isNotEmpty) const SizedBox(height: 8),
              
              // Input field
              TextField(
                controller: _controller,
                focusNode: _focusNode,
                decoration: InputDecoration(
                  hintText: widget.hint,
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  suffixIcon: widget.maxTags != null
                      ? Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: Text(
                            '${_tags.length}/${widget.maxTags}',
                            style: theme.textTheme.bodySmall,
                          ),
                        )
                      : null,
                  suffixIconConstraints: const BoxConstraints(
                    minWidth: 0,
                    minHeight: 0,
                  ),
                ),
                textInputAction: TextInputAction.done,
                onSubmitted: _addTag,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
