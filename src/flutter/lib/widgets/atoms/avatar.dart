import 'package:flutter/material.dart';

/// Avatar widget matching web app design
/// 
/// Matches web Avatar component with all features:
/// - 6 sizes: xs, sm, md, lg, xl, 2xl
/// - Image with fallback
/// - Text initials
/// - Icon fallback
/// - Badge support
/// - Gradient background
class AppAvatar extends StatelessWidget {
  final String? src;
  final String? alt;
  final String? name;
  final AvatarSize size;
  final Widget? fallback;
  final Widget? badge;
  final VoidCallback? onTap;

  const AppAvatar({
    super.key,
    this.src,
    this.alt,
    this.name,
    this.size = AvatarSize.md,
    this.fallback,
    this.badge,
    this.onTap,
  });

  /// Extra small avatar
  const AppAvatar.xs({
    super.key,
    this.src,
    this.alt,
    this.name,
    this.fallback,
    this.badge,
    this.onTap,
  }) : size = AvatarSize.xs;

  /// Small avatar
  const AppAvatar.sm({
    super.key,
    this.src,
    this.alt,
    this.name,
    this.fallback,
    this.badge,
    this.onTap,
  }) : size = AvatarSize.sm;

  /// Medium avatar
  const AppAvatar.md({
    super.key,
    this.src,
    this.alt,
    this.name,
    this.fallback,
    this.badge,
    this.onTap,
  }) : size = AvatarSize.md;

  /// Large avatar
  const AppAvatar.lg({
    super.key,
    this.src,
    this.alt,
    this.name,
    this.fallback,
    this.badge,
    this.onTap,
  }) : size = AvatarSize.lg;

  /// Extra large avatar
  const AppAvatar.xl({
    super.key,
    this.src,
    this.alt,
    this.name,
    this.fallback,
    this.badge,
    this.onTap,
  }) : size = AvatarSize.xl;

  /// 2X large avatar
  const AppAvatar.xxl({
    super.key,
    this.src,
    this.alt,
    this.name,
    this.fallback,
    this.badge,
    this.onTap,
  }) : size = AvatarSize.xxl;

  @override
  Widget build(BuildContext context) {
    final avatarSize = _getAvatarSize();
    
    Widget avatarWidget = GestureDetector(
      onTap: onTap,
      child: Container(
        width: avatarSize,
        height: avatarSize,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: const LinearGradient(
            colors: [
              Color(0xFF6366F1), // Indigo
              Color(0xFF8B5CF6), // Purple
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: ClipOval(
          child: _buildContent(),
        ),
      ),
    );

    // Add badge if provided
    if (badge != null) {
      avatarWidget = Stack(
        clipBehavior: Clip.none,
        children: [
          avatarWidget,
          Positioned(
            bottom: -4,
            right: -4,
            child: badge!,
          ),
        ],
      );
    }

    return avatarWidget;
  }

  Widget _buildContent() {
    // Show image if available
    if (src != null && src!.isNotEmpty) {
      return Image.network(
        src!,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          return _buildFallbackContent();
        },
      );
    }

    return _buildFallbackContent();
  }

  Widget _buildFallbackContent() {
    // Show initials if name is provided
    if (name != null && name!.isNotEmpty) {
      return Center(
        child: Text(
          _getInitials(name!),
          style: TextStyle(
            fontSize: _getTextSize(),
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
      );
    }

    // Show custom fallback or default icon
    if (fallback != null) {
      return Center(child: fallback!);
    }

    return Icon(
      Icons.person,
      size: _getIconSize(),
      color: Colors.white,
    );
  }

  String _getInitials(String name) {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[parts.length - 1][0]}'.toUpperCase();
    }
    return name.substring(0, name.length >= 2 ? 2 : 1).toUpperCase();
  }

  double _getAvatarSize() {
    switch (size) {
      case AvatarSize.xs:
        return 24;
      case AvatarSize.sm:
        return 32;
      case AvatarSize.md:
        return 40;
      case AvatarSize.lg:
        return 48;
      case AvatarSize.xl:
        return 64;
      case AvatarSize.xxl:
        return 96;
    }
  }

  double _getTextSize() {
    switch (size) {
      case AvatarSize.xs:
        return 12;
      case AvatarSize.sm:
        return 14;
      case AvatarSize.md:
        return 16;
      case AvatarSize.lg:
        return 18;
      case AvatarSize.xl:
        return 24;
      case AvatarSize.xxl:
        return 36;
    }
  }

  double _getIconSize() {
    switch (size) {
      case AvatarSize.xs:
        return 12;
      case AvatarSize.sm:
        return 16;
      case AvatarSize.md:
        return 20;
      case AvatarSize.lg:
        return 24;
      case AvatarSize.xl:
        return 32;
      case AvatarSize.xxl:
        return 48;
    }
  }
}

/// Avatar sizes matching web app
enum AvatarSize {
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
}