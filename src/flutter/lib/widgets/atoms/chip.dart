import 'package:flutter/material.dart';

/// Chip widget for tags, labels, and selections
class AppChip extends StatelessWidget {
  final String label;
  final IconData? icon;
  final VoidCallback? onTap;
  final VoidCallback? onDelete;
  final ChipVariant variant;
  final ChipSize size;
  final Color? backgroundColor;
  final Color? textColor;
  final bool selected;

  const AppChip({
    Key? key,
    required this.label,
    this.icon,
    this.onTap,
    this.onDelete,
    this.variant = ChipVariant.primary,
    this.size = ChipSize.medium,
    this.backgroundColor,
    this.textColor,
    this.selected = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Material(
      color: _getBackgroundColor(theme),
      borderRadius: BorderRadius.circular(100),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(100),
        child: Container(
          padding: _getPadding(),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) ...[
                Icon(
                  icon,
                  size: _getIconSize(),
                  color: _getTextColor(theme),
                ),
                SizedBox(width: size == ChipSize.small ? 4 : 6),
              ],
              Text(
                label,
                style: TextStyle(
                  color: _getTextColor(theme),
                  fontSize: _getFontSize(),
                  fontWeight: selected ? FontWeight.w600 : FontWeight.w500,
                ),
              ),
              if (onDelete != null) ...[
                SizedBox(width: size == ChipSize.small ? 4 : 6),
                GestureDetector(
                  onTap: onDelete,
                  child: Icon(
                    Icons.close,
                    size: _getIconSize(),
                    color: _getTextColor(theme),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Color _getBackgroundColor(ThemeData theme) {
    if (backgroundColor != null) return backgroundColor!;

    if (selected) {
      switch (variant) {
        case ChipVariant.primary:
          return theme.colorScheme.primary;
        case ChipVariant.secondary:
          return theme.colorScheme.secondary;
        case ChipVariant.success:
          return Colors.green;
        case ChipVariant.warning:
          return Colors.orange;
        case ChipVariant.error:
          return Colors.red;
        case ChipVariant.neutral:
          return Colors.grey;
      }
    }

    return theme.colorScheme.primary.withOpacity(0.1);
  }

  Color _getTextColor(ThemeData theme) {
    if (textColor != null) return textColor!;

    if (selected) {
      return Colors.white;
    }

    switch (variant) {
      case ChipVariant.primary:
        return theme.colorScheme.primary;
      case ChipVariant.secondary:
        return theme.colorScheme.secondary;
      case ChipVariant.success:
        return Colors.green;
      case ChipVariant.warning:
        return Colors.orange;
      case ChipVariant.error:
        return Colors.red;
      case ChipVariant.neutral:
        return Colors.grey.shade700;
    }
  }

  EdgeInsets _getPadding() {
    switch (size) {
      case ChipSize.small:
        return const EdgeInsets.symmetric(horizontal: 8, vertical: 4);
      case ChipSize.medium:
        return const EdgeInsets.symmetric(horizontal: 12, vertical: 6);
      case ChipSize.large:
        return const EdgeInsets.symmetric(horizontal: 16, vertical: 8);
    }
  }

  double _getFontSize() {
    switch (size) {
      case ChipSize.small:
        return 12;
      case ChipSize.medium:
        return 14;
      case ChipSize.large:
        return 16;
    }
  }

  double _getIconSize() {
    switch (size) {
      case ChipSize.small:
        return 14;
      case ChipSize.medium:
        return 16;
      case ChipSize.large:
        return 18;
    }
  }
}

enum ChipVariant {
  primary,
  secondary,
  success,
  warning,
  error,
  neutral,
}

enum ChipSize {
  small,
  medium,
  large,
}

/// Chip Input - for adding/removing multiple chips
class ChipInput extends StatefulWidget {
  final List<String> values;
  final ValueChanged<List<String>> onChanged;
  final String? hintText;
  final int? maxChips;

  const ChipInput({
    Key? key,
    required this.values,
    required this.onChanged,
    this.hintText,
    this.maxChips,
  }) : super(key: key);

  @override
  State<ChipInput> createState() => _ChipInputState();
}

class _ChipInputState extends State<ChipInput> {
  final _controller = TextEditingController();
  final _focusNode = FocusNode();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(8),
      ),
      padding: const EdgeInsets.all(8),
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: [
          ...widget.values.map((value) => AppChip(
                label: value,
                size: ChipSize.small,
                onDelete: () {
                  final newValues = List<String>.from(widget.values);
                  newValues.remove(value);
                  widget.onChanged(newValues);
                },
              )),
          if (widget.maxChips == null || widget.values.length < widget.maxChips!)
            SizedBox(
              width: 120,
              child: TextField(
                controller: _controller,
                focusNode: _focusNode,
                decoration: InputDecoration(
                  hintText: widget.hintText ?? 'Add...',
                  border: InputBorder.none,
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                ),
                onSubmitted: (value) {
                  if (value.isNotEmpty) {
                    final newValues = List<String>.from(widget.values);
                    newValues.add(value);
                    widget.onChanged(newValues);
                    _controller.clear();
                    _focusNode.requestFocus();
                  }
                },
              ),
            ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }
}
