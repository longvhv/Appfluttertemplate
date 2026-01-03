import 'package:flutter/material.dart';

/// Stepper widget matching web app design
class AppStepper extends StatelessWidget {
  final int currentStep;
  final List<StepItem> steps;
  final ValueChanged<int>? onStepChanged;
  final StepperOrientation orientation;

  const AppStepper({
    Key? key,
    required this.currentStep,
    required this.steps,
    this.onStepChanged,
    this.orientation = StepperOrientation.horizontal,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (orientation == StepperOrientation.vertical) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (var i = 0; i < steps.length; i++) ...[
            _StepWidget(
              step: steps[i],
              index: i,
              isActive: i == currentStep,
              isCompleted: i < currentStep,
              onTap: onStepChanged != null ? () => onStepChanged!(i) : null,
              orientation: orientation,
            ),
            if (i < steps.length - 1)
              Padding(
                padding: const EdgeInsets.only(left: 16),
                child: Container(
                  width: 2,
                  height: 40,
                  color: i < currentStep
                      ? Theme.of(context).colorScheme.primary
                      : Colors.grey.shade300,
                ),
              ),
          ],
        ],
      );
    }

    return Row(
      children: [
        for (var i = 0; i < steps.length; i++) ...[
          Expanded(
            child: _StepWidget(
              step: steps[i],
              index: i,
              isActive: i == currentStep,
              isCompleted: i < currentStep,
              onTap: onStepChanged != null ? () => onStepChanged!(i) : null,
              orientation: orientation,
            ),
          ),
          if (i < steps.length - 1)
            Expanded(
              child: Container(
                height: 2,
                color: i < currentStep
                    ? Theme.of(context).colorScheme.primary
                    : Colors.grey.shade300,
              ),
            ),
        ],
      ],
    );
  }
}

class _StepWidget extends StatelessWidget {
  final StepItem step;
  final int index;
  final bool isActive;
  final bool isCompleted;
  final VoidCallback? onTap;
  final StepperOrientation orientation;

  const _StepWidget({
    required this.step,
    required this.index,
    required this.isActive,
    required this.isCompleted,
    this.onTap,
    required this.orientation,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    Widget content = Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Step indicator
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: isCompleted || isActive
                ? theme.colorScheme.primary
                : Colors.grey.shade300,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: isCompleted
                ? const Icon(Icons.check, size: 18, color: Colors.white)
                : Text(
                    '${index + 1}',
                    style: TextStyle(
                      color: isActive ? Colors.white : Colors.grey.shade600,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
          ),
        ),
        const SizedBox(height: 8),
        // Step label
        Text(
          step.title,
          style: theme.textTheme.bodySmall?.copyWith(
            fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
            color: isActive
                ? theme.colorScheme.primary
                : Colors.grey.shade600,
          ),
          textAlign: TextAlign.center,
        ),
        if (step.subtitle != null) ...[
          const SizedBox(height: 4),
          Text(
            step.subtitle!,
            style: theme.textTheme.bodySmall?.copyWith(
              color: Colors.grey.shade600,
              fontSize: 11,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ],
    );

    if (orientation == StepperOrientation.vertical) {
      content = Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: isCompleted || isActive
                  ? theme.colorScheme.primary
                  : Colors.grey.shade300,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: isCompleted
                  ? const Icon(Icons.check, size: 18, color: Colors.white)
                  : Text(
                      '${index + 1}',
                      style: TextStyle(
                        color: isActive ? Colors.white : Colors.grey.shade600,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  step.title,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
                    color: isActive
                        ? theme.colorScheme.primary
                        : Colors.grey.shade700,
                  ),
                ),
                if (step.subtitle != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    step.subtitle!,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: Colors.grey.shade600,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      );
    }

    if (onTap != null) {
      return InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: content,
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.all(8),
      child: content,
    );
  }
}

class StepItem {
  final String title;
  final String? subtitle;

  const StepItem({
    required this.title,
    this.subtitle,
  });
}

enum StepperOrientation {
  horizontal,
  vertical,
}
