/// Charts Widget
/// 
/// A comprehensive chart component library using fl_chart package.
/// 
/// Features:
/// - Line charts
/// - Bar charts
/// - Pie charts
/// - Area charts
/// - Material Design 3 styling
/// - Gradient support
/// - Interactive tooltips
///
/// Example:
/// ```dart
/// AppLineChart(
///   data: [1, 3, 5, 2, 4],
///   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
/// )
/// ```

library;

import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

/// Line Chart Widget
class AppLineChart extends StatelessWidget {
  final List<double> data;
  final List<String>? labels;
  final String? title;
  final Color? lineColor;
  final bool showDots;
  final bool showArea;
  final bool curved;
  final double height;

  const AppLineChart({
    super.key,
    required this.data,
    this.labels,
    this.title,
    this.lineColor,
    this.showDots = true,
    this.showArea = false,
    this.curved = true,
    this.height = 250,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final color = lineColor ?? theme.colorScheme.primary;

    final spots = data.asMap().entries.map((entry) {
      return FlSpot(entry.key.toDouble(), entry.value);
    }).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (title != null) ...[
          Text(
            title!,
            style: theme.textTheme.titleMedium,
          ),
          const SizedBox(height: 16),
        ],
        SizedBox(
          height: height,
          child: LineChart(
            LineChartData(
              gridData: FlGridData(
                show: true,
                drawVerticalLine: false,
                horizontalInterval: 1,
                getDrawingHorizontalLine: (value) {
                  return FlLine(
                    color: theme.colorScheme.outlineVariant.withOpacity(0.3),
                    strokeWidth: 1,
                  );
                },
              ),
              titlesData: FlTitlesData(
                show: true,
                rightTitles: const AxisTitles(
                  sideTitles: SideTitles(showTitles: false),
                ),
                topTitles: const AxisTitles(
                  sideTitles: SideTitles(showTitles: false),
                ),
                bottomTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: labels != null,
                    getTitlesWidget: (value, meta) {
                      if (labels == null || value.toInt() >= labels!.length) {
                        return const SizedBox();
                      }
                      return Padding(
                        padding: const EdgeInsets.only(top: 8.0),
                        child: Text(
                          labels![value.toInt()],
                          style: theme.textTheme.bodySmall,
                        ),
                      );
                    },
                  ),
                ),
              ),
              borderData: FlBorderData(show: false),
              lineBarsData: [
                LineChartBarData(
                  spots: spots,
                  isCurved: curved,
                  color: color,
                  barWidth: 3,
                  isStrokeCapRound: true,
                  dotData: FlDotData(show: showDots),
                  belowBarData: BarAreaData(
                    show: showArea,
                    color: color.withOpacity(0.1),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

/// Bar Chart Widget
class AppBarChart extends StatelessWidget {
  final List<double> data;
  final List<String>? labels;
  final String? title;
  final Color? barColor;
  final double height;

  const AppBarChart({
    super.key,
    required this.data,
    this.labels,
    this.title,
    this.barColor,
    this.height = 250,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final color = barColor ?? theme.colorScheme.primary;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (title != null) ...[
          Text(
            title!,
            style: theme.textTheme.titleMedium,
          ),
          const SizedBox(height: 16),
        ],
        SizedBox(
          height: height,
          child: BarChart(
            BarChartData(
              alignment: BarChartAlignment.spaceAround,
              maxY: data.reduce((a, b) => a > b ? a : b) * 1.2,
              barGroups: data.asMap().entries.map((entry) {
                return BarChartGroupData(
                  x: entry.key,
                  barRods: [
                    BarChartRodData(
                      toY: entry.value,
                      color: color,
                      width: 16,
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(4),
                      ),
                    ),
                  ],
                );
              }).toList(),
              gridData: FlGridData(
                show: true,
                drawVerticalLine: false,
                horizontalInterval: 1,
                getDrawingHorizontalLine: (value) {
                  return FlLine(
                    color: theme.colorScheme.outlineVariant.withOpacity(0.3),
                    strokeWidth: 1,
                  );
                },
              ),
              titlesData: FlTitlesData(
                show: true,
                rightTitles: const AxisTitles(
                  sideTitles: SideTitles(showTitles: false),
                ),
                topTitles: const AxisTitles(
                  sideTitles: SideTitles(showTitles: false),
                ),
                bottomTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: labels != null,
                    getTitlesWidget: (value, meta) {
                      if (labels == null || value.toInt() >= labels!.length) {
                        return const SizedBox();
                      }
                      return Padding(
                        padding: const EdgeInsets.only(top: 8.0),
                        child: Text(
                          labels![value.toInt()],
                          style: theme.textTheme.bodySmall,
                        ),
                      );
                    },
                  ),
                ),
              ),
              borderData: FlBorderData(show: false),
            ),
          ),
        ),
      ],
    );
  }
}

/// Pie Chart Widget
class AppPieChart extends StatelessWidget {
  final List<double> data;
  final List<String>? labels;
  final List<Color>? colors;
  final String? title;
  final double height;

  const AppPieChart({
    super.key,
    required this.data,
    this.labels,
    this.colors,
    this.title,
    this.height = 250,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    final defaultColors = [
      theme.colorScheme.primary,
      theme.colorScheme.secondary,
      theme.colorScheme.tertiary,
      Colors.orange,
      Colors.green,
      Colors.purple,
      Colors.pink,
      Colors.teal,
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (title != null) ...[
          Text(
            title!,
            style: theme.textTheme.titleMedium,
          ),
          const SizedBox(height: 16),
        ],
        SizedBox(
          height: height,
          child: PieChart(
            PieChartData(
              sections: data.asMap().entries.map((entry) {
                final index = entry.key;
                final value = entry.value;
                final color = colors != null && index < colors!.length
                    ? colors![index]
                    : defaultColors[index % defaultColors.length];

                return PieChartSectionData(
                  value: value,
                  color: color,
                  title: labels != null && index < labels!.length
                      ? labels![index]
                      : '${value.toStringAsFixed(1)}%',
                  radius: 60,
                  titleStyle: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                );
              }).toList(),
              sectionsSpace: 2,
              centerSpaceRadius: 40,
            ),
          ),
        ),
      ],
    );
  }
}
