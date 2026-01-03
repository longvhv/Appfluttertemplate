import 'package:flutter/material.dart';

/// Avatar group widget showing multiple avatars
/// 
/// Provides:
/// - Stacked avatar display
/// - Max visible count
/// - Overflow indicator
/// - Size variants
class AppAvatarGroup extends StatelessWidget {
  final List<String> images;
  final List<String> names;
  final int maxVisible;
  final double size;
  final double overlap;

  const AppAvatarGroup({
    super.key,
    required this.images,
    required this.names,
    this.maxVisible = 3,
    this.size = 40,
    this.overlap = 0.7,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    final visibleCount = maxVisible.clamp(1, images.length);
    final remainingCount = images.length - visibleCount;

    return SizedBox(
      height: size,
      child: Stack(
        children: [
          // Visible avatars
          ...List.generate(visibleCount, (index) {
            final leftOffset = index * size * overlap;
            
            return Positioned(
              left: leftOffset,
              child: Container(
                width: size,
                height: size,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: colorScheme.surface,
                    width: 2,
                  ),
                ),
                child: CircleAvatar(
                  radius: size / 2,
                  backgroundImage: images[index].isNotEmpty
                      ? NetworkImage(images[index])
                      : null,
                  child: images[index].isEmpty
                      ? Text(
                          names[index].substring(0, 1).toUpperCase(),
                          style: TextStyle(
                            fontSize: size * 0.4,
                            fontWeight: FontWeight.w600,
                          ),
                        )
                      : null,
                ),
              ),
            );
          }),

          // Overflow indicator
          if (remainingCount > 0)
            Positioned(
              left: visibleCount * size * overlap,
              child: Container(
                width: size,
                height: size,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: colorScheme.secondaryContainer,
                  border: Border.all(
                    color: colorScheme.surface,
                    width: 2,
                  ),
                ),
                child: Center(
                  child: Text(
                    '+$remainingCount',
                    style: TextStyle(
                      fontSize: size * 0.35,
                      fontWeight: FontWeight.w600,
                      color: colorScheme.onSecondaryContainer,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
