import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';
import 'counter_event.dart';
import 'counter_state.dart';

/// BLoC for managing counter (Example)
class CounterBloc extends HydratedBloc<CounterEvent, CounterState> {
  CounterBloc() : super(CounterState.initial()) {
    on<IncrementCounterEvent>(_onIncrement);
    on<DecrementCounterEvent>(_onDecrement);
    on<ResetCounterEvent>(_onReset);
    on<SetCounterEvent>(_onSetValue);
    on<AddToCounterEvent>(_onAddValue);
  }

  /// Handle increment
  void _onIncrement(
    IncrementCounterEvent event,
    Emitter<CounterState> emit,
  ) {
    emit(state.copyWith(
      value: state.value + 1,
      lastUpdated: DateTime.now(),
    ));
  }

  /// Handle decrement
  void _onDecrement(
    DecrementCounterEvent event,
    Emitter<CounterState> emit,
  ) {
    emit(state.copyWith(
      value: state.value - 1,
      lastUpdated: DateTime.now(),
    ));
  }

  /// Handle reset
  void _onReset(
    ResetCounterEvent event,
    Emitter<CounterState> emit,
  ) {
    emit(CounterState.initial());
  }

  /// Handle set value
  void _onSetValue(
    SetCounterEvent event,
    Emitter<CounterState> emit,
  ) {
    emit(state.copyWith(
      value: event.value,
      lastUpdated: DateTime.now(),
    ));
  }

  /// Handle add value
  void _onAddValue(
    AddToCounterEvent event,
    Emitter<CounterState> emit,
  ) {
    emit(state.copyWith(
      value: state.value + event.value,
      lastUpdated: DateTime.now(),
    ));
  }

  /// Serialize state to JSON for persistence
  @override
  CounterState? fromJson(Map<String, dynamic> json) {
    try {
      return CounterState(
        value: json['value'] as int? ?? 0,
        lastUpdated: DateTime.parse(
          json['lastUpdated'] as String? ?? DateTime.now().toIso8601String(),
        ),
      );
    } catch (e) {
      return CounterState.initial();
    }
  }

  /// Deserialize state from JSON
  @override
  Map<String, dynamic>? toJson(CounterState state) {
    return {
      'value': state.value,
      'lastUpdated': state.lastUpdated.toIso8601String(),
    };
  }
}
