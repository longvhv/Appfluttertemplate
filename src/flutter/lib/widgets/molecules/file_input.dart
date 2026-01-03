/// File Input Widget
/// 
/// A simple file picker button (alternative to FileUpload).
/// 
/// Features:
/// - File selection
/// - File type filtering
/// - Multiple file selection
/// - File info display
/// - Material Design 3 styling
///
/// Example:
/// ```dart
/// AppFileInput(
///   onChanged: (files) => print(files),
///   allowMultiple: true,
/// )
/// ```

library;

import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';

class AppFileInput extends StatefulWidget {
  final ValueChanged<List<PlatformFile>>? onChanged;
  final String? label;
  final List<String>? allowedExtensions;
  final bool allowMultiple;
  final bool enabled;

  const AppFileInput({
    super.key,
    this.onChanged,
    this.label,
    this.allowedExtensions,
    this.allowMultiple = false,
    this.enabled = true,
  });

  @override
  State<AppFileInput> createState() => _AppFileInputState();
}

class _AppFileInputState extends State<AppFileInput> {
  List<PlatformFile> _selectedFiles = [];

  Future<void> _pickFiles() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        allowMultiple: widget.allowMultiple,
        type: widget.allowedExtensions != null
            ? FileType.custom
            : FileType.any,
        allowedExtensions: widget.allowedExtensions,
      );

      if (result != null) {
        setState(() {
          _selectedFiles = result.files;
        });
        widget.onChanged?.call(_selectedFiles);
      }
    } catch (e) {
      // Handle error
      debugPrint('Error picking files: $e');
    }
  }

  void _removeFile(int index) {
    setState(() {
      _selectedFiles.removeAt(index);
    });
    widget.onChanged?.call(_selectedFiles);
  }

  String _formatFileSize(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
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

        // Pick button
        OutlinedButton.icon(
          onPressed: widget.enabled ? _pickFiles : null,
          icon: const Icon(Icons.attach_file),
          label: Text(
            widget.allowMultiple ? 'Choose Files' : 'Choose File',
          ),
        ),

        // Selected files
        if (_selectedFiles.isNotEmpty) ...[
          const SizedBox(height: 12),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _selectedFiles.length,
            itemBuilder: (context, index) {
              final file = _selectedFiles[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 8),
                child: ListTile(
                  leading: const Icon(Icons.insert_drive_file),
                  title: Text(file.name),
                  subtitle: Text(_formatFileSize(file.size)),
                  trailing: IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => _removeFile(index),
                  ),
                ),
              );
            },
          ),
        ],
      ],
    );
  }
}
