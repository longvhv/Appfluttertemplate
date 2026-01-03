import 'package:flutter/material.dart';

/// AutoComplete input widget
class AutoCompleteInput<T> extends StatefulWidget {
  final String? label;
  final String? hintText;
  final List<T> options;
  final String Function(T) displayStringForOption;
  final ValueChanged<T?>? onSelected;
  final TextEditingController? controller;
  final String? errorText;
  final bool enabled;

  const AutoCompleteInput({
    Key? key,
    this.label,
    this.hintText,
    required this.options,
    required this.displayStringForOption,
    this.onSelected,
    this.controller,
    this.errorText,
    this.enabled = true,
  }) : super(key: key);

  @override
  State<AutoCompleteInput<T>> createState() => _AutoCompleteInputState<T>();
}

class _AutoCompleteInputState<T> extends State<AutoCompleteInput<T>> {
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
        Autocomplete<T>(
          optionsBuilder: (textEditingValue) {
            if (textEditingValue.text.isEmpty) {
              return const Iterable<T>.empty();
            }
            return widget.options.where((option) {
              final displayString =
                  widget.displayStringForOption(option).toLowerCase();
              return displayString.contains(textEditingValue.text.toLowerCase());
            });
          },
          displayStringForOption: widget.displayStringForOption,
          onSelected: widget.onSelected,
          fieldViewBuilder: (
            context,
            textEditingController,
            focusNode,
            onFieldSubmitted,
          ) {
            return TextFormField(
              controller: widget.controller ?? textEditingController,
              focusNode: focusNode,
              enabled: widget.enabled,
              decoration: InputDecoration(
                hintText: widget.hintText ?? 'Start typing...',
                errorText: widget.errorText,
                suffixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
              ),
            );
          },
          optionsViewBuilder: (context, onSelected, options) {
            return Align(
              alignment: Alignment.topLeft,
              child: Material(
                elevation: 4,
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  constraints: const BoxConstraints(maxHeight: 200),
                  width: 300,
                  child: ListView.builder(
                    padding: EdgeInsets.zero,
                    shrinkWrap: true,
                    itemCount: options.length,
                    itemBuilder: (context, index) {
                      final option = options.elementAt(index);
                      return InkWell(
                        onTap: () => onSelected(option),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                          child: Text(
                            widget.displayStringForOption(option),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}

/// AutoComplete with custom options rendering
class CustomAutoComplete<T> extends StatefulWidget {
  final String? label;
  final String? hintText;
  final Future<List<T>> Function(String) onSearch;
  final Widget Function(T) optionBuilder;
  final String Function(T) displayStringForOption;
  final ValueChanged<T?>? onSelected;
  final String? errorText;
  final bool enabled;
  final Duration debounce;

  const CustomAutoComplete({
    Key? key,
    this.label,
    this.hintText,
    required this.onSearch,
    required this.optionBuilder,
    required this.displayStringForOption,
    this.onSelected,
    this.errorText,
    this.enabled = true,
    this.debounce = const Duration(milliseconds: 500),
  }) : super(key: key);

  @override
  State<CustomAutoComplete<T>> createState() => _CustomAutoCompleteState<T>();
}

class _CustomAutoCompleteState<T> extends State<CustomAutoComplete<T>> {
  final TextEditingController _controller = TextEditingController();
  final FocusNode _focusNode = FocusNode();
  final LayerLink _layerLink = LayerLink();
  OverlayEntry? _overlayEntry;
  List<T> _options = [];
  bool _isLoading = false;

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    _removeOverlay();
    super.dispose();
  }

  void _removeOverlay() {
    _overlayEntry?.remove();
    _overlayEntry = null;
  }

  void _showOverlay() {
    _removeOverlay();

    _overlayEntry = OverlayEntry(
      builder: (context) => Positioned(
        width: 300,
        child: CompositedTransformFollower(
          link: _layerLink,
          showWhenUnlinked: false,
          offset: const Offset(0, 60),
          child: Material(
            elevation: 4,
            borderRadius: BorderRadius.circular(8),
            child: Container(
              constraints: const BoxConstraints(maxHeight: 200),
              child: _isLoading
                  ? const Center(
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: CircularProgressIndicator(),
                      ),
                    )
                  : _options.isEmpty
                      ? const Padding(
                          padding: EdgeInsets.all(16),
                          child: Text('No results found'),
                        )
                      : ListView.builder(
                          padding: EdgeInsets.zero,
                          shrinkWrap: true,
                          itemCount: _options.length,
                          itemBuilder: (context, index) {
                            final option = _options[index];
                            return InkWell(
                              onTap: () {
                                _controller.text = widget
                                    .displayStringForOption(option);
                                widget.onSelected?.call(option);
                                _removeOverlay();
                                _focusNode.unfocus();
                              },
                              child: Padding(
                                padding: const EdgeInsets.all(8),
                                child: widget.optionBuilder(option),
                              ),
                            );
                          },
                        ),
            ),
          ),
        ),
      ),
    );

    Overlay.of(context).insert(_overlayEntry!);
  }

  Future<void> _search(String query) async {
    if (query.isEmpty) {
      _removeOverlay();
      return;
    }

    setState(() {
      _isLoading = true;
    });

    _showOverlay();

    try {
      final results = await widget.onSearch(query);
      setState(() {
        _options = results;
        _isLoading = false;
      });
      _showOverlay();
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
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
          Text(
            widget.label!,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
        ],
        CompositedTransformTarget(
          link: _layerLink,
          child: TextFormField(
            controller: _controller,
            focusNode: _focusNode,
            enabled: widget.enabled,
            onChanged: (value) {
              Future.delayed(widget.debounce, () {
                if (_controller.text == value) {
                  _search(value);
                }
              });
            },
            decoration: InputDecoration(
              hintText: widget.hintText ?? 'Start typing...',
              errorText: widget.errorText,
              suffixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 12,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
