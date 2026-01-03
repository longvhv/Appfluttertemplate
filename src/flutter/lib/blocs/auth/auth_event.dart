import 'package:equatable/equatable.dart';

/// Events for AuthBloc
abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

/// Event to check authentication status
class CheckAuthStatusEvent extends AuthEvent {
  const CheckAuthStatusEvent();
}

/// Event to login
class LoginEvent extends AuthEvent {
  final String email;
  final String password;

  const LoginEvent({
    required this.email,
    required this.password,
  });

  @override
  List<Object?> get props => [email, password];
}

/// Event to register
class RegisterEvent extends AuthEvent {
  final String email;
  final String password;
  final String name;

  const RegisterEvent({
    required this.email,
    required this.password,
    required this.name,
  });

  @override
  List<Object?> get props => [email, password, name];
}

/// Event to logout
class LogoutEvent extends AuthEvent {
  const LogoutEvent();
}

/// Event to reset password
class ResetPasswordEvent extends AuthEvent {
  final String email;

  const ResetPasswordEvent(this.email);

  @override
  List<Object?> get props => [email];
}

/// Event to update user profile
class UpdateProfileEvent extends AuthEvent {
  final String? name;
  final String? email;
  final String? avatarUrl;

  const UpdateProfileEvent({
    this.name,
    this.email,
    this.avatarUrl,
  });

  @override
  List<Object?> get props => [name, email, avatarUrl];
}

/// Event to change password
class ChangePasswordEvent extends AuthEvent {
  final String currentPassword;
  final String newPassword;

  const ChangePasswordEvent({
    required this.currentPassword,
    required this.newPassword,
  });

  @override
  List<Object?> get props => [currentPassword, newPassword];
}

/// Event for biometric authentication
class BiometricAuthEvent extends AuthEvent {
  const BiometricAuthEvent();
}
