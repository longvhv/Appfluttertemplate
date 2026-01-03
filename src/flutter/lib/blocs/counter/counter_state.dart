import 'package:equatable/equatable.dart';

/// State for CounterBloc
class CounterState extends Equatable {
  final int value;
  final DateTime lastUpdated;

  const CounterState({
    required this.value,
    required this.lastUpdated,
  });

  /// Initial state
  factory CounterState.initial() {
    return CounterState(
      value: 0,
      lastUpdated: DateTime.now(),
    );
  }

  /// Create a copy with updated fields
  CounterState copyWith({
    int? value,
    DateTime? lastUpdated,
  }) {
    return CounterState(
      value: value ?? this.value,
      lastUpdated: lastUpdated ?? this.lastUpdated,
    );
  }

  /// Check if counter is positive
  bool get isPositive => value > 0;

  /// Check if counter is negative
  bool get isNegative => value < 0;

  /// Check if counter is zero
  bool get isZero => value == 0;

  @override
  List<Object?> get props => [value, lastUpdated];

  @override
  String toString() => 'CounterState(value: $value, lastUpdated: $lastUpdated)';
}
