/// Markdown Input Widget
/// 
/// A specialized input for writing and previewing Markdown content.
/// 
/// Features:
/// - Markdown editing
/// - Live preview
/// - Toolbar with formatting buttons
/// - Split view (edit/preview)
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppMarkdownInput(
///   onChanged: (markdown) => print(markdown),
/// )
/// ```

library;

import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

enum MarkdownViewMode { edit, preview, split }

class AppMarkdownInput extends StatefulWidget {
  final String? initialValue;
  final ValueChanged<String>? onChanged;
  final String? label;
  final bool enabled;
  final bool showToolbar;
  final int minLines;
  final int maxLines;

  const AppMarkdownInput({
    super.key,
    this.initialValue,
    this.onChanged,
    this.label,
    this.enabled = true,
    this.showToolbar = true,
    this.minLines = 10,
    this.maxLines = 20,
  });

  @override
  State<AppMarkdownInput> createState() => _AppMarkdownInputState();
}

class _AppMarkdownInputState extends State<AppMarkdownInput> {
  late TextEditingController _controller;
  MarkdownViewMode _viewMode = MarkdownViewMode.edit;

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
    super.dispose();
  }

  void _insertMarkdown(String before, [String after = '']) {
    final selection = _controller.selection;
    final text = _controller.text;
    final selectedText = selection.textInside(text);

    final newText = text.replaceRange(
      selection.start,
      selection.end,
      '$before$selectedText$after',
    );

    _controller.text = newText;
    _controller.selection = TextSelection.collapsed(
      offset: selection.start + before.length + selectedText.length,
    );
  }

  void _insertBold() => _insertMarkdown('**', '**');
  void _insertItalic() => _insertMarkdown('*', '*');
  void _insertHeading() => _insertMarkdown('## ');
  void _insertLink() => _insertMarkdown('[', '](url)');
  void _insertCode() => _insertMarkdown('`', '`');
  void _insertList() => _insertMarkdown('- ');

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

        // Toolbar
        if (widget.showToolbar) ...[
          Card(
            child: Padding(
              padding: const EdgeInsets.all(8),
              child: Row(
                children: [
                  // Format buttons
                  IconButton(
                    icon: const Icon(Icons.format_bold, size: 20),
                    onPressed: widget.enabled ? _insertBold : null,
                    tooltip: 'Bold',
                  ),
                  IconButton(
                    icon: const Icon(Icons.format_italic, size: 20),
                    onPressed: widget.enabled ? _insertItalic : null,
                    tooltip: 'Italic',
                  ),
                  IconButton(
                    icon: const Icon(Icons.title, size: 20),
                    onPressed: widget.enabled ? _insertHeading : null,
                    tooltip: 'Heading',
                  ),
                  IconButton(
                    icon: const Icon(Icons.link, size: 20),
                    onPressed: widget.enabled ? _insertLink : null,
                    tooltip: 'Link',
                  ),
                  IconButton(
                    icon: const Icon(Icons.code, size: 20),
                    onPressed: widget.enabled ? _insertCode : null,
                    tooltip: 'Code',
                  ),
                  IconButton(
                    icon: const Icon(Icons.format_list_bulleted, size: 20),
                    onPressed: widget.enabled ? _insertList : null,
                    tooltip: 'List',
                  ),

                  const Spacer(),

                  // View mode toggle
                  SegmentedButton<MarkdownViewMode>(
                    segments: const [
                      ButtonSegment(
                        value: MarkdownViewMode.edit,
                        icon: Icon(Icons.edit, size: 16),
                      ),
                      ButtonSegment(
                        value: MarkdownViewMode.preview,
                        icon: Icon(Icons.visibility, size: 16),
                      ),
                      ButtonSegment(
                        value: MarkdownViewMode.split,
                        icon: Icon(Icons.view_column, size: 16),
                      ),
                    ],
                    selected: {_viewMode},
                    onSelectionChanged: (Set<MarkdownViewMode> newSelection) {
                      setState(() {
                        _viewMode = newSelection.first;
                      });
                    },
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
        ],

        // Content area
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: theme.colorScheme.outline),
            borderRadius: BorderRadius.circular(8),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: _buildContentArea(),
          ),
        ),
      ],
    );
  }

  Widget _buildContentArea() {
    switch (_viewMode) {
      case MarkdownViewMode.edit:
        return _buildEditor();
      case MarkdownViewMode.preview:
        return _buildPreview();
      case MarkdownViewMode.split:
        return Row(
          children: [
            Expanded(child: _buildEditor()),
            const VerticalDivider(width: 1),
            Expanded(child: _buildPreview()),
          ],
        );
    }
  }

  Widget _buildEditor() {
    return TextField(
      controller: _controller,
      enabled: widget.enabled,
      minLines: widget.minLines,
      maxLines: widget.maxLines,
      style: const TextStyle(fontFamily: 'monospace', fontSize: 14),
      decoration: const InputDecoration(
        hintText: 'Write markdown here...',
        border: InputBorder.none,
        contentPadding: EdgeInsets.all(16),
      ),
    );
  }

  Widget _buildPreview() {
    return Container(
      constraints: BoxConstraints(
        minHeight: widget.minLines * 24.0,
        maxHeight: widget.maxLines * 24.0,
      ),
      child: Markdown(
        data: _controller.text.isEmpty
            ? '_No content to preview_'
            : _controller.text,
        shrinkWrap: true,
        padding: const EdgeInsets.all(16),
      ),
    );
  }
}
