import 'package:flutter/material.dart';

/// Progress steps widget showing multi-step progress
/// 
/// Provides:
/// - Step-by-step indicator
/// - Current step highlighting
/// - Completed/incomplete states
/// - Vertical/horizontal layout
class AppProgressSteps extends StatelessWidget {
  final List<StepItem> steps;
  final int currentStep;
  final Axis direction;
  final bool showLabels;

  const AppProgressSteps({
    super.key,
    required this.steps,
    required this.currentStep,
    this.direction = Axis.horizontal,
    this.showLabels = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    if (direction == Axis.horizontal) {
      return Row(
        children: List.generate(steps.length * 2 - 1, (index) {
          if (index.isOdd) {
            // Connector line
            final stepIndex = index ~/ 2;
            final isCompleted = stepIndex < currentStep;
            
            return Expanded(
              child: Container(
                height: 2,
                color: isCompleted
                    ? colorScheme.primary
                    : colorScheme.outlineVariant,
              ),
            );
          } else {
            // Step circle
            final stepIndex = index ~/ 2;
            final step = steps[stepIndex];
            final isCompleted = stepIndex < currentStep;
            final isCurrent = stepIndex == currentStep;

            return Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildStepCircle(
                  context,
                  step,
                  stepIndex + 1,
                  isCompleted,
                  isCurrent,
                ),
                if (showLabels) ...[
                  const SizedBox(height: 8),
                  SizedBox(
                    width: 80,
                    child: Text(
                      step.label,
                      textAlign: TextAlign.center,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: isCurrent
                            ? colorScheme.primary
                            : colorScheme.onSurfaceVariant,
                        fontWeight: isCurrent
                            ? FontWeight.w600
                            : FontWeight.normal,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ],
            );
          }
        }),
      );
    } else {
      // Vertical layout
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: List.generate(steps.length, (index) {
          final step = steps[index];
          final isCompleted = index < currentStep;
          final isCurrent = index == currentStep;
          final isLast = index == steps.length - 1;

          return Column(
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Column(
                    children: [
                      _buildStepCircle(
                        context,
                        step,
                        index + 1,
                        isCompleted,
                        isCurrent,
                      ),
                      if (!isLast)
                        Container(
                          width: 2,
                          height: 40,
                          margin: const EdgeInsets.symmetric(vertical: 4),
                          color: isCompleted
                              ? colorScheme.primary
                              : colorScheme.outlineVariant,
                        ),
                    ],
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            step.label,
                            style: theme.textTheme.bodyLarge?.copyWith(
                              fontWeight: isCurrent
                                  ? FontWeight.w600
                                  : FontWeight.normal,
                              color: isCurrent
                                  ? colorScheme.primary
                                  : colorScheme.onSurface,
                            ),
                          ),
                          if (step.subtitle != null) ...[
                            const SizedBox(height: 4),
                            Text(
                              step.subtitle!,
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          );
        }),
      );
    }
  }

  Widget _buildStepCircle(
    BuildContext context,
    StepItem step,
    int number,
    bool isCompleted,
    bool isCurrent,
  ) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: isCompleted
            ? colorScheme.primary
            : isCurrent
                ? colorScheme.primaryContainer
                : colorScheme.surfaceVariant,
        border: isCurrent
            ? Border.all(
                color: colorScheme.primary,
                width: 2,
              )
            : null,
      ),
      child: Center(
        child: isCompleted
            ? Icon(
                Icons.check,
                size: 20,
                color: colorScheme.onPrimary,
              )
            : Text(
                number.toString(),
                style: theme.textTheme.bodyLarge?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: isCurrent
                      ? colorScheme.onPrimaryContainer
                      : colorScheme.onSurfaceVariant,
                ),
              ),
      ),
    );
  }
}

/// Step item model
class StepItem {
  final String label;
  final String? subtitle;

  const StepItem({
    required this.label,
    this.subtitle,
  });
}
