import 'package:equatable/equatable.dart';

/// Events for CounterBloc
abstract class CounterEvent extends Equatable {
  const CounterEvent();

  @override
  List<Object?> get props => [];
}

/// Event to increment counter
class IncrementCounterEvent extends CounterEvent {
  const IncrementCounterEvent();
}

/// Event to decrement counter
class DecrementCounterEvent extends CounterEvent {
  const DecrementCounterEvent();
}

/// Event to reset counter
class ResetCounterEvent extends CounterEvent {
  const ResetCounterEvent();
}

/// Event to set counter to specific value
class SetCounterEvent extends CounterEvent {
  final int value;

  const SetCounterEvent(this.value);

  @override
  List<Object?> get props => [value];
}

/// Event to add to counter
class AddToCounterEvent extends CounterEvent {
  final int value;

  const AddToCounterEvent(this.value);

  @override
  List<Object?> get props => [value];
}
