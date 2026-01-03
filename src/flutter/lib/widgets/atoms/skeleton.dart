import 'package:flutter/material.dart';

/// Skeleton widget matching web app design
/// 
/// Matches web Skeleton component with all features:
/// - 4 variants: text, circular, rectangular, rounded
/// - 3 animations: pulse, wave, none
/// - Custom width/height
/// - Pre-built patterns (text, avatar, card, button, list)
class AppSkeleton extends StatefulWidget {
  final SkeletonVariant variant;
  final double? width;
  final double? height;
  final SkeletonAnimation animation;

  const AppSkeleton({
    super.key,
    this.variant = SkeletonVariant.text,
    this.width,
    this.height,
    this.animation = SkeletonAnimation.pulse,
  });

  /// Text skeleton
  const AppSkeleton.text({
    super.key,
    this.width,
    this.height,
    this.animation = SkeletonAnimation.pulse,
  }) : variant = SkeletonVariant.text;

  /// Circular skeleton (for avatars)
  const AppSkeleton.circular({
    super.key,
    this.width,
    this.height,
    this.animation = SkeletonAnimation.pulse,
  }) : variant = SkeletonVariant.circular;

  /// Rectangular skeleton
  const AppSkeleton.rectangular({
    super.key,
    this.width,
    this.height,
    this.animation = SkeletonAnimation.pulse,
  }) : variant = SkeletonVariant.rectangular;

  /// Rounded skeleton
  const AppSkeleton.rounded({
    super.key,
    this.width,
    this.height,
    this.animation = SkeletonAnimation.pulse,
  }) : variant = SkeletonVariant.rounded;

  @override
  State<AppSkeleton> createState() => _AppSkeletonState();
}

class _AppSkeletonState extends State<AppSkeleton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    if (widget.animation != SkeletonAnimation.none) {
      _animation = Tween<double>(begin: 0.5, end: 1.0).animate(
        CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
      );
      _controller.repeat(reverse: true);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    final width = widget.width ?? _getDefaultWidth();
    final height = widget.height ?? _getDefaultHeight();

    if (widget.animation == SkeletonAnimation.none) {
      return _buildSkeleton(colorScheme, width, height, 1.0);
    }

    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return _buildSkeleton(colorScheme, width, height, _animation.value);
      },
    );
  }

  Widget _buildSkeleton(
    ColorScheme colorScheme,
    double width,
    double height,
    double opacity,
  ) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: colorScheme.surfaceVariant.withOpacity(opacity),
        borderRadius: _getBorderRadius(),
      ),
    );
  }

  double _getDefaultWidth() {
    switch (widget.variant) {
      case SkeletonVariant.text:
        return double.infinity;
      case SkeletonVariant.circular:
        return 48;
      case SkeletonVariant.rectangular:
        return double.infinity;
      case SkeletonVariant.rounded:
        return double.infinity;
    }
  }

  double _getDefaultHeight() {
    switch (widget.variant) {
      case SkeletonVariant.text:
        return 16;
      case SkeletonVariant.circular:
        return 48;
      case SkeletonVariant.rectangular:
        return 48;
      case SkeletonVariant.rounded:
        return 48;
    }
  }

  BorderRadius? _getBorderRadius() {
    switch (widget.variant) {
      case SkeletonVariant.text:
        return BorderRadius.circular(4);
      case SkeletonVariant.circular:
        return BorderRadius.circular(1000);
      case SkeletonVariant.rectangular:
        return null;
      case SkeletonVariant.rounded:
        return BorderRadius.circular(12);
    }
  }
}

/// Pre-built skeleton patterns

/// Text skeleton with multiple lines
class SkeletonText extends StatelessWidget {
  final int lines;
  final double? lastLineWidth;

  const SkeletonText({
    super.key,
    this.lines = 3,
    this.lastLineWidth,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: List.generate(lines, (index) {
        final isLastLine = index == lines - 1;
        return Padding(
          padding: EdgeInsets.only(bottom: index < lines - 1 ? 8 : 0),
          child: AppSkeleton.text(
            width: isLastLine && lastLineWidth != null ? lastLineWidth : null,
            height: 16,
          ),
        );
      }),
    );
  }
}

/// Avatar skeleton
class SkeletonAvatar extends StatelessWidget {
  final double size;

  const SkeletonAvatar({
    super.key,
    this.size = 40,
  });

  @override
  Widget build(BuildContext context) {
    return AppSkeleton.circular(
      width: size,
      height: size,
    );
  }
}

/// Card skeleton
class SkeletonCard extends StatelessWidget {
  final bool showImage;
  final bool showTitle;
  final bool showDescription;

  const SkeletonCard({
    super.key,
    this.showImage = true,
    this.showTitle = true,
    this.showDescription = true,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (showImage)
          const AppSkeleton.rounded(
            width: double.infinity,
            height: 200,
          ),
        if (showImage) const SizedBox(height: 16),
        if (showTitle)
          const AppSkeleton.text(
            width: 200,
            height: 24,
          ),
        if (showTitle && showDescription) const SizedBox(height: 8),
        if (showDescription) const SkeletonText(lines: 2),
      ],
    );
  }
}

/// Button skeleton
class SkeletonButton extends StatelessWidget {
  final double? width;
  final double? height;

  const SkeletonButton({
    super.key,
    this.width,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    return AppSkeleton.rounded(
      width: width ?? 96,
      height: height ?? 40,
    );
  }
}

/// List item skeleton
class SkeletonListItem extends StatelessWidget {
  const SkeletonListItem({super.key});

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          SkeletonAvatar(size: 48),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppSkeleton.text(width: 150, height: 16),
                SizedBox(height: 8),
                AppSkeleton.text(width: 100, height: 12),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Skeleton variants matching web app
enum SkeletonVariant {
  text,
  circular,
  rectangular,
  rounded,
}

/// Skeleton animations matching web app
enum SkeletonAnimation {
  pulse,
  wave,
  none,
}