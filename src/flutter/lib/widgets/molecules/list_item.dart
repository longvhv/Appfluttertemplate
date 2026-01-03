import 'package:flutter/material.dart';

/// List item widget matching web app design
class AppListItem extends StatelessWidget {
  final Widget? leading;
  final String? title;
  final Widget? titleWidget;
  final String? subtitle;
  final Widget? subtitleWidget;
  final Widget? trailing;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final bool selected;
  final EdgeInsets? contentPadding;
  final bool dense;
  final bool enabled;
  final Color? selectedColor;

  const AppListItem({
    Key? key,
    this.leading,
    this.title,
    this.titleWidget,
    this.subtitle,
    this.subtitleWidget,
    this.trailing,
    this.onTap,
    this.onLongPress,
    this.selected = false,
    this.contentPadding,
    this.dense = false,
    this.enabled = true,
    this.selectedColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Material(
      color: selected
          ? (selectedColor ?? theme.colorScheme.primary.withOpacity(0.1))
          : Colors.transparent,
      child: ListTile(
        enabled: enabled,
        dense: dense,
        contentPadding: contentPadding ?? const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 8,
        ),
        leading: leading,
        title: titleWidget ?? (title != null ? Text(title!) : null),
        subtitle: subtitleWidget ?? (subtitle != null ? Text(subtitle!) : null),
        trailing: trailing,
        onTap: onTap,
        onLongPress: onLongPress,
        selected: selected,
      ),
    );
  }
}

/// List item with avatar
class AvatarListItem extends StatelessWidget {
  final String? avatarUrl;
  final IconData? avatarIcon;
  final String? avatarText;
  final String title;
  final String? subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool selected;

  const AvatarListItem({
    Key? key,
    this.avatarUrl,
    this.avatarIcon,
    this.avatarText,
    required this.title,
    this.subtitle,
    this.trailing,
    this.onTap,
    this.selected = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppListItem(
      leading: CircleAvatar(
        backgroundImage: avatarUrl != null ? NetworkImage(avatarUrl!) : null,
        child: avatarUrl == null
            ? (avatarIcon != null
                ? Icon(avatarIcon, size: 24)
                : Text(avatarText ?? ''))
            : null,
      ),
      title: title,
      subtitle: subtitle,
      trailing: trailing,
      onTap: onTap,
      selected: selected,
    );
  }
}

/// List item with checkbox
class CheckboxListItem extends StatelessWidget {
  final String title;
  final String? subtitle;
  final bool value;
  final ValueChanged<bool?>? onChanged;
  final Widget? secondary;

  const CheckboxListItem({
    Key? key,
    required this.title,
    this.subtitle,
    required this.value,
    this.onChanged,
    this.secondary,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CheckboxListTile(
      title: Text(title),
      subtitle: subtitle != null ? Text(subtitle!) : null,
      value: value,
      onChanged: onChanged,
      secondary: secondary,
      controlAffinity: ListTileControlAffinity.leading,
    );
  }
}

/// List item with switch
class SwitchListItem extends StatelessWidget {
  final String title;
  final String? subtitle;
  final bool value;
  final ValueChanged<bool>? onChanged;
  final Widget? secondary;

  const SwitchListItem({
    Key? key,
    required this.title,
    this.subtitle,
    required this.value,
    this.onChanged,
    this.secondary,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SwitchListTile(
      title: Text(title),
      subtitle: subtitle != null ? Text(subtitle!) : null,
      value: value,
      onChanged: onChanged,
      secondary: secondary,
    );
  }
}

/// Expandable list item
class ExpandableListItem extends StatefulWidget {
  final String title;
  final String? subtitle;
  final Widget? leading;
  final List<Widget> children;
  final bool initiallyExpanded;

  const ExpandableListItem({
    Key? key,
    required this.title,
    this.subtitle,
    this.leading,
    required this.children,
    this.initiallyExpanded = false,
  }) : super(key: key);

  @override
  State<ExpandableListItem> createState() => _ExpandableListItemState();
}

class _ExpandableListItemState extends State<ExpandableListItem> {
  late bool _isExpanded;

  @override
  void initState() {
    super.initState();
    _isExpanded = widget.initiallyExpanded;
  }

  @override
  Widget build(BuildContext context) {
    return ExpansionTile(
      leading: widget.leading,
      title: Text(widget.title),
      subtitle: widget.subtitle != null ? Text(widget.subtitle!) : null,
      initiallyExpanded: widget.initiallyExpanded,
      children: widget.children,
      onExpansionChanged: (expanded) {
        setState(() => _isExpanded = expanded);
      },
    );
  }
}
