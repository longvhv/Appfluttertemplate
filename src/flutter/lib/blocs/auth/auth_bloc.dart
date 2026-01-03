import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';
import 'auth_event.dart';
import 'auth_state.dart';

/// BLoC for managing authentication
class AuthBloc extends HydratedBloc<AuthEvent, AuthState> {
  AuthBloc() : super(AuthState.initial()) {
    on<CheckAuthStatusEvent>(_onCheckAuthStatus);
    on<LoginEvent>(_onLogin);
    on<RegisterEvent>(_onRegister);
    on<LogoutEvent>(_onLogout);
    on<ResetPasswordEvent>(_onResetPassword);
    on<UpdateProfileEvent>(_onUpdateProfile);
    on<ChangePasswordEvent>(_onChangePassword);
    on<BiometricAuthEvent>(_onBiometricAuth);
  }

  /// Check authentication status
  Future<void> _onCheckAuthStatus(
    CheckAuthStatusEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthState.loading());

    // TODO: Implement actual auth check
    await Future.delayed(const Duration(milliseconds: 500));

    // If user exists in storage, restore session
    if (state.user != null) {
      emit(AuthState.authenticated(state.user!));
    } else {
      emit(AuthState.unauthenticated());
    }
  }

  /// Handle login
  Future<void> _onLogin(
    LoginEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthState.loading());

    try {
      // TODO: Implement actual login API call
      await Future.delayed(const Duration(seconds: 1));

      // Simulate successful login
      final user = User(
        id: '1',
        email: event.email,
        name: event.email.split('@')[0],
      );

      emit(AuthState.authenticated(user));
    } catch (e) {
      emit(AuthState.error(e.toString()));
    }
  }

  /// Handle registration
  Future<void> _onRegister(
    RegisterEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthState.loading());

    try {
      // TODO: Implement actual registration API call
      await Future.delayed(const Duration(seconds: 1));

      // Simulate successful registration
      final user = User(
        id: '1',
        email: event.email,
        name: event.name,
      );

      emit(AuthState.authenticated(user));
    } catch (e) {
      emit(AuthState.error(e.toString()));
    }
  }

  /// Handle logout
  Future<void> _onLogout(
    LogoutEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthState.loading());

    try {
      // TODO: Implement actual logout API call
      await Future.delayed(const Duration(milliseconds: 500));

      emit(AuthState.unauthenticated());
    } catch (e) {
      emit(AuthState.error(e.toString()));
    }
  }

  /// Handle password reset
  Future<void> _onResetPassword(
    ResetPasswordEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthState.loading());

    try {
      // TODO: Implement actual password reset API call
      await Future.delayed(const Duration(seconds: 1));

      emit(AuthState.unauthenticated());
    } catch (e) {
      emit(AuthState.error(e.toString()));
    }
  }

  /// Handle profile update
  Future<void> _onUpdateProfile(
    UpdateProfileEvent event,
    Emitter<AuthState> emit,
  ) async {
    if (state.user == null) return;

    emit(state.copyWith(status: AuthStatus.loading));

    try {
      // TODO: Implement actual profile update API call
      await Future.delayed(const Duration(seconds: 1));

      final updatedUser = state.user!.copyWith(
        name: event.name ?? state.user!.name,
        email: event.email ?? state.user!.email,
        avatarUrl: event.avatarUrl ?? state.user!.avatarUrl,
      );

      emit(AuthState.authenticated(updatedUser));
    } catch (e) {
      emit(state.copyWith(
        status: AuthStatus.error,
        errorMessage: e.toString(),
      ));
    }
  }

  /// Handle password change
  Future<void> _onChangePassword(
    ChangePasswordEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(state.copyWith(status: AuthStatus.loading));

    try {
      // TODO: Implement actual password change API call
      await Future.delayed(const Duration(seconds: 1));

      emit(state.copyWith(status: AuthStatus.authenticated));
    } catch (e) {
      emit(state.copyWith(
        status: AuthStatus.error,
        errorMessage: e.toString(),
      ));
    }
  }

  /// Handle biometric authentication
  Future<void> _onBiometricAuth(
    BiometricAuthEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthState.loading());

    try {
      // TODO: Implement biometric authentication
      await Future.delayed(const Duration(milliseconds: 500));

      if (state.user != null) {
        emit(AuthState.authenticated(state.user!));
      } else {
        emit(AuthState.unauthenticated());
      }
    } catch (e) {
      emit(AuthState.error(e.toString()));
    }
  }

  /// Serialize state to JSON for persistence
  @override
  AuthState? fromJson(Map<String, dynamic> json) {
    try {
      final statusIndex = json['status'] as int? ?? 0;
      final status = AuthStatus.values[statusIndex];

      User? user;
      if (json['user'] != null) {
        user = User.fromJson(json['user'] as Map<String, dynamic>);
      }

      return AuthState(
        status: status,
        user: user,
        errorMessage: json['errorMessage'] as String?,
      );
    } catch (e) {
      return AuthState.initial();
    }
  }

  /// Deserialize state from JSON
  @override
  Map<String, dynamic>? toJson(AuthState state) {
    return {
      'status': state.status.index,
      'user': state.user?.toJson(),
      'errorMessage': state.errorMessage,
    };
  }
}
