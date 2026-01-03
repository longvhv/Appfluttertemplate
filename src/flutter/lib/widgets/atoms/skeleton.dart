import 'package:flutter/material.dart';

/// Skeleton loader widget for loading states
class AppSkeleton extends StatelessWidget {
  final double? width;
  final double? height;
  final SkeletonShape shape;
  final BorderRadius? borderRadius;

  const AppSkeleton({
    Key? key,
    this.width,
    this.height,
    this.shape = SkeletonShape.rectangle,
    this.borderRadius,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final baseColor = isDark ? Colors.grey.shade800 : Colors.grey.shade300;
    final highlightColor = isDark ? Colors.grey.shade700 : Colors.grey.shade100;

    Widget skeleton = Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: baseColor,
        borderRadius: _getBorderRadius(),
        shape: shape == SkeletonShape.circle ? BoxShape.circle : BoxShape.rectangle,
      ),
    );

    // Add shimmer effect
    return AnimatedContainer(
      duration: const Duration(milliseconds: 1000),
      child: ShaderMask(
        shaderCallback: (bounds) {
          return LinearGradient(
            colors: [baseColor, highlightColor, baseColor],
            stops: const [0.0, 0.5, 1.0],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ).createShader(bounds);
        },
        child: skeleton,
      ),
    );
  }

  BorderRadius? _getBorderRadius() {
    if (shape == SkeletonShape.circle) return null;
    if (borderRadius != null) return borderRadius;
    return BorderRadius.circular(4);
  }
}

enum SkeletonShape {
  rectangle,
  circle,
}

/// Pre-defined skeleton loaders
class SkeletonLoaders {
  /// Text line skeleton
  static Widget text({
    double? width,
    double height = 16,
  }) {
    return AppSkeleton(
      width: width,
      height: height,
      shape: SkeletonShape.rectangle,
      borderRadius: BorderRadius.circular(4),
    );
  }

  /// Avatar skeleton
  static Widget avatar({
    double size = 40,
  }) {
    return AppSkeleton(
      width: size,
      height: size,
      shape: SkeletonShape.circle,
    );
  }

  /// Card skeleton
  static Widget card({
    double? width,
    double height = 200,
  }) {
    return AppSkeleton(
      width: width,
      height: height,
      shape: SkeletonShape.rectangle,
      borderRadius: BorderRadius.circular(12),
    );
  }

  /// List item skeleton
  static Widget listItem() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Row(
        children: [
          avatar(size: 48),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                text(width: double.infinity, height: 16),
                const SizedBox(height: 8),
                text(width: 200, height: 14),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// Profile skeleton
  static Widget profile() {
    return Column(
      children: [
        avatar(size: 80),
        const SizedBox(height: 16),
        text(width: 150, height: 20),
        const SizedBox(height: 8),
        text(width: 200, height: 16),
      ],
    );
  }
}
