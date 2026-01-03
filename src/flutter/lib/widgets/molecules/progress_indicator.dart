import 'package:flutter/material.dart';

/// Progress indicator with steps
class StepProgressIndicator extends StatelessWidget {
  final int totalSteps;
  final int currentStep;
  final Color? activeColor;
  final Color? inactiveColor;
  final double height;
  final bool showLabels;
  final List<String>? labels;

  const StepProgressIndicator({
    Key? key,
    required this.totalSteps,
    required this.currentStep,
    this.activeColor,
    this.inactiveColor,
    this.height = 4,
    this.showLabels = false,
    this.labels,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final active = activeColor ?? theme.colorScheme.primary;
    final inactive = inactiveColor ?? Colors.grey.shade300;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: List.generate(totalSteps, (index) {
            final isActive = index < currentStep;
            return Expanded(
              child: Container(
                height: height,
                margin: EdgeInsets.only(
                  right: index < totalSteps - 1 ? 4 : 0,
                ),
                decoration: BoxDecoration(
                  color: isActive ? active : inactive,
                  borderRadius: BorderRadius.circular(height / 2),
                ),
              ),
            );
          }),
        ),
        if (showLabels && labels != null) ...[
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(
              labels!.length,
              (index) => Text(
                labels![index],
                style: theme.textTheme.bodySmall?.copyWith(
                  color: index < currentStep
                      ? active
                      : Colors.grey.shade600,
                  fontWeight: index < currentStep
                      ? FontWeight.w600
                      : FontWeight.normal,
                ),
              ),
            ),
          ),
        ],
      ],
    );
  }
}

/// Circular progress indicator with percentage
class CircularProgressIndicator extends StatelessWidget {
  final double value; // 0.0 to 1.0
  final double size;
  final double strokeWidth;
  final Color? color;
  final Color? backgroundColor;
  final bool showPercentage;
  final Widget? child;

  const CircularProgressIndicator({
    Key? key,
    required this.value,
    this.size = 100,
    this.strokeWidth = 8,
    this.color,
    this.backgroundColor,
    this.showPercentage = true,
    this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final progressColor = color ?? theme.colorScheme.primary;
    final bgColor = backgroundColor ?? Colors.grey.shade200;

    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          SizedBox(
            width: size,
            height: size,
            child: CircularProgressIndicator(
              value: value,
              strokeWidth: strokeWidth,
              valueColor: AlwaysStoppedAnimation<Color>(progressColor),
              backgroundColor: bgColor,
            ),
          ),
          if (child != null)
            child!
          else if (showPercentage)
            Text(
              '${(value * 100).toInt()}%',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: progressColor,
              ),
            ),
        ],
      ),
    );
  }
}

/// Loading overlay
class LoadingOverlay extends StatelessWidget {
  final bool isLoading;
  final Widget child;
  final String? message;
  final Color? overlayColor;

  const LoadingOverlay({
    Key? key,
    required this.isLoading,
    required this.child,
    this.message,
    this.overlayColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        if (isLoading)
          Positioned.fill(
            child: Container(
              color: overlayColor ?? Colors.black.withOpacity(0.5),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                    if (message != null) ...[
                      const SizedBox(height: 16),
                      Text(
                        message!,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }
}
