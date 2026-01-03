import 'package:flutter/material.dart';

/// Popover widget matching web app design
class AppPopover extends StatelessWidget {
  final Widget child;
  final Widget content;
  final PopoverPosition position;
  final double? width;
  final double? height;
  final EdgeInsets contentPadding;

  const AppPopover({
    Key? key,
    required this.child,
    required this.content,
    this.position = PopoverPosition.bottom,
    this.width,
    this.height,
    this.contentPadding = const EdgeInsets.all(16),
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton(
      child: child,
      offset: _getOffset(),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      itemBuilder: (context) => [
        PopupMenuItem(
          enabled: false,
          padding: EdgeInsets.zero,
          child: Container(
            width: width ?? 300,
            height: height,
            padding: contentPadding,
            child: content,
          ),
        ),
      ],
    );
  }

  Offset _getOffset() {
    switch (position) {
      case PopoverPosition.top:
        return const Offset(0, -10);
      case PopoverPosition.bottom:
        return const Offset(0, 10);
      case PopoverPosition.left:
        return const Offset(-10, 0);
      case PopoverPosition.right:
        return const Offset(10, 0);
    }
  }
}

enum PopoverPosition {
  top,
  bottom,
  left,
  right,
}

/// Custom popover with more control
class CustomPopover extends StatefulWidget {
  final Widget child;
  final Widget Function(BuildContext context, VoidCallback close) builder;
  final PopoverPosition position;

  const CustomPopover({
    Key? key,
    required this.child,
    required this.builder,
    this.position = PopoverPosition.bottom,
  }) : super(key: key);

  @override
  State<CustomPopover> createState() => _CustomPopoverState();
}

class _CustomPopoverState extends State<CustomPopover> {
  OverlayEntry? _overlayEntry;
  final LayerLink _layerLink = LayerLink();

  void _showPopover() {
    _overlayEntry = _createOverlayEntry();
    Overlay.of(context).insert(_overlayEntry!);
  }

  void _hidePopover() {
    _overlayEntry?.remove();
    _overlayEntry = null;
  }

  OverlayEntry _createOverlayEntry() {
    return OverlayEntry(
      builder: (context) => GestureDetector(
        onTap: _hidePopover,
        behavior: HitTestBehavior.translucent,
        child: Stack(
          children: [
            Positioned.fill(
              child: Container(color: Colors.transparent),
            ),
            Positioned(
              width: 300,
              child: CompositedTransformFollower(
                link: _layerLink,
                showWhenUnlinked: false,
                offset: _getOffset(),
                child: Material(
                  elevation: 8,
                  borderRadius: BorderRadius.circular(8),
                  child: widget.builder(context, _hidePopover),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Offset _getOffset() {
    switch (widget.position) {
      case PopoverPosition.top:
        return const Offset(0, -10);
      case PopoverPosition.bottom:
        return const Offset(0, 50);
      case PopoverPosition.left:
        return const Offset(-310, 0);
      case PopoverPosition.right:
        return const Offset(50, 0);
    }
  }

  @override
  Widget build(BuildContext context) {
    return CompositedTransformTarget(
      link: _layerLink,
      child: GestureDetector(
        onTap: () {
          if (_overlayEntry == null) {
            _showPopover();
          } else {
            _hidePopover();
          }
        },
        child: widget.child,
      ),
    );
  }

  @override
  void dispose() {
    _hidePopover();
    super.dispose();
  }
}
