import 'package:flutter/material.dart';

/// Avatar widget with support for images, text, and icons
class AppAvatar extends StatelessWidget {
  final String? imageUrl;
  final String? text;
  final IconData? icon;
  final double size;
  final Color? backgroundColor;
  final Color? textColor;
  final VoidCallback? onTap;
  final bool showBadge;
  final Color? badgeColor;
  final String? badgeText;

  const AppAvatar({
    Key? key,
    this.imageUrl,
    this.text,
    this.icon,
    this.size = 40,
    this.backgroundColor,
    this.textColor,
    this.onTap,
    this.showBadge = false,
    this.badgeColor,
    this.badgeText,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    Widget avatar = CircleAvatar(
      radius: size / 2,
      backgroundColor: backgroundColor ?? theme.colorScheme.primary,
      backgroundImage: imageUrl != null ? NetworkImage(imageUrl!) : null,
      child: imageUrl == null
          ? (icon != null
              ? Icon(icon, size: size * 0.5, color: textColor ?? Colors.white)
              : Text(
                  text ?? '',
                  style: TextStyle(
                    fontSize: size * 0.4,
                    color: textColor ?? Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ))
          : null,
    );

    if (showBadge) {
      avatar = Stack(
        clipBehavior: Clip.none,
        children: [
          avatar,
          Positioned(
            right: 0,
            bottom: 0,
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: badgeColor ?? Colors.green,
                shape: BoxShape.circle,
                border: Border.all(
                  color: theme.scaffoldBackgroundColor,
                  width: 2,
                ),
              ),
              child: badgeText != null
                  ? Text(
                      badgeText!,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    )
                  : const SizedBox(width: 8, height: 8),
            ),
          ),
        ],
      );
    }

    if (onTap != null) {
      return InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(size),
        child: avatar,
      );
    }

    return avatar;
  }
}

/// Avatar Group - displays multiple avatars with overlap
class AvatarGroup extends StatelessWidget {
  final List<String> imageUrls;
  final int maxCount;
  final double size;
  final double overlap;

  const AvatarGroup({
    Key? key,
    required this.imageUrls,
    this.maxCount = 4,
    this.size = 40,
    this.overlap = 12,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final displayCount = imageUrls.length > maxCount ? maxCount : imageUrls.length;
    final remaining = imageUrls.length - maxCount;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(displayCount + (remaining > 0 ? 1 : 0), (index) {
        if (index == displayCount && remaining > 0) {
          // Show "+N" avatar
          return Transform.translate(
            offset: Offset(-overlap * index, 0),
            child: AppAvatar(
              size: size,
              text: '+$remaining',
              backgroundColor: Colors.grey.shade300,
              textColor: Colors.black87,
            ),
          );
        }

        return Transform.translate(
          offset: Offset(-overlap * index, 0),
          child: Container(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: Theme.of(context).scaffoldBackgroundColor,
                width: 2,
              ),
            ),
            child: AppAvatar(
              size: size,
              imageUrl: imageUrls[index],
            ),
          ),
        );
      }),
    );
  }
}
