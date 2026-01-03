import 'package:flutter/material.dart';
import 'dart:io';

/// File upload widget with drag & drop zone
class FileUpload extends StatefulWidget {
  final String? label;
  final String? helpText;
  final ValueChanged<List<File>>? onFilesSelected;
  final List<String>? acceptedFileTypes;
  final int? maxFiles;
  final int? maxSizeInBytes;
  final bool multiple;

  const FileUpload({
    Key? key,
    this.label,
    this.helpText,
    this.onFilesSelected,
    this.acceptedFileTypes,
    this.maxFiles,
    this.maxSizeInBytes,
    this.multiple = true,
  }) : super(key: key);

  @override
  State<FileUpload> createState() => _FileUploadState();
}

class _FileUploadState extends State<FileUpload> {
  final List<File> _selectedFiles = [];
  bool _isDragging = false;

  void _handleFileSelection() async {
    // In a real app, you would use file_picker package
    // For now, this is a placeholder
    // final result = await FilePicker.platform.pickFiles(
    //   allowMultiple: widget.multiple,
    //   type: FileType.custom,
    //   allowedExtensions: widget.acceptedFileTypes,
    // );
    
    // Placeholder implementation
    widget.onFilesSelected?.call(_selectedFiles);
  }

  void _removeFile(int index) {
    setState(() {
      _selectedFiles.removeAt(index);
    });
    widget.onFilesSelected?.call(_selectedFiles);
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
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
        ],
        // Drop zone
        InkWell(
          onTap: _handleFileSelection,
          borderRadius: BorderRadius.circular(8),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              border: Border.all(
                color: _isDragging
                    ? theme.colorScheme.primary
                    : Colors.grey.shade300,
                width: _isDragging ? 2 : 1,
                style: BorderStyle.solid,
              ),
              borderRadius: BorderRadius.circular(8),
              color: _isDragging
                  ? theme.colorScheme.primary.withOpacity(0.05)
                  : Colors.grey.shade50,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.cloud_upload_outlined,
                  size: 48,
                  color: _isDragging
                      ? theme.colorScheme.primary
                      : Colors.grey.shade400,
                ),
                const SizedBox(height: 16),
                Text(
                  'Drag & drop files here',
                  style: theme.textTheme.bodyLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'or click to browse',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: Colors.grey.shade600,
                  ),
                ),
                if (widget.helpText != null) ...[
                  const SizedBox(height: 8),
                  Text(
                    widget.helpText!,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: Colors.grey.shade500,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ],
            ),
          ),
        ),
        // Selected files list
        if (_selectedFiles.isNotEmpty) ...[
          const SizedBox(height: 16),
          ...List.generate(_selectedFiles.length, (index) {
            final file = _selectedFiles[index];
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: _FileListItem(
                fileName: file.path.split('/').last,
                fileSize: _formatFileSize(0), // Placeholder
                onRemove: () => _removeFile(index),
              ),
            );
          }),
        ],
      ],
    );
  }
}

class _FileListItem extends StatelessWidget {
  final String fileName;
  final String fileSize;
  final VoidCallback onRemove;

  const _FileListItem({
    required this.fileName,
    required this.fileSize,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: theme.colorScheme.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Icon(
              Icons.insert_drive_file,
              color: theme.colorScheme.primary,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  fileName,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  fileSize,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: Colors.grey.shade600,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.close, size: 20),
            onPressed: onRemove,
            color: Colors.grey.shade600,
          ),
        ],
      ),
    );
  }
}

/// Image upload with preview
class ImageUpload extends StatefulWidget {
  final String? label;
  final ValueChanged<File?>? onImageSelected;
  final String? imageUrl;
  final double width;
  final double height;

  const ImageUpload({
    Key? key,
    this.label,
    this.onImageSelected,
    this.imageUrl,
    this.width = 200,
    this.height = 200,
  }) : super(key: key);

  @override
  State<ImageUpload> createState() => _ImageUploadState();
}

class _ImageUploadState extends State<ImageUpload> {
  File? _selectedImage;

  void _selectImage() async {
    // In a real app, use image_picker package
    // final picker = ImagePicker();
    // final image = await picker.pickImage(source: ImageSource.gallery);
    // if (image != null) {
    //   setState(() {
    //     _selectedImage = File(image.path);
    //   });
    //   widget.onImageSelected?.call(_selectedImage);
    // }
  }

  void _removeImage() {
    setState(() {
      _selectedImage = null;
    });
    widget.onImageSelected?.call(null);
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
        Stack(
          children: [
            InkWell(
              onTap: _selectImage,
              borderRadius: BorderRadius.circular(8),
              child: Container(
                width: widget.width,
                height: widget.height,
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.shade300),
                  borderRadius: BorderRadius.circular(8),
                  color: Colors.grey.shade50,
                  image: _selectedImage != null
                      ? DecorationImage(
                          image: FileImage(_selectedImage!),
                          fit: BoxFit.cover,
                        )
                      : widget.imageUrl != null
                          ? DecorationImage(
                              image: NetworkImage(widget.imageUrl!),
                              fit: BoxFit.cover,
                            )
                          : null,
                ),
                child: _selectedImage == null && widget.imageUrl == null
                    ? Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.add_photo_alternate_outlined,
                            size: 48,
                            color: Colors.grey.shade400,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Upload Image',
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      )
                    : null,
              ),
            ),
            if (_selectedImage != null || widget.imageUrl != null)
              Positioned(
                top: 8,
                right: 8,
                child: IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: _removeImage,
                  style: IconButton.styleFrom(
                    backgroundColor: Colors.black.withOpacity(0.5),
                    foregroundColor: Colors.white,
                  ),
                ),
              ),
          ],
        ),
      ],
    );
  }
}
