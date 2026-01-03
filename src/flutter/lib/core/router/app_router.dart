import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../screens/home_screen.dart';
import '../../screens/login_screen.dart';
import '../../screens/register_screen.dart';
import '../../screens/forgot_password_screen.dart';
import '../../screens/profile_screen.dart';
import '../../screens/settings_screen.dart';
import '../../screens/notifications_screen.dart';
import '../../screens/appearance_screen.dart';
import '../../screens/language_screen.dart';
import '../../screens/privacy_security_screen.dart';
import '../../screens/devices_screen.dart';
import '../../screens/change_password_screen.dart';
import '../../screens/help_screen.dart';
import '../../screens/faq_screen.dart';
import '../../screens/whats_new_screen.dart';
import '../../widgets/layout/main_layout.dart';

/// App Router Provider
final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/home',
    debugLogDiagnostics: true,
    routes: [
      // Authentication Routes
      GoRoute(
        path: '/login',
        name: 'login',
        pageBuilder: (context, state) => MaterialPage(
          key: state.pageKey,
          child: const LoginScreen(),
        ),
      ),
      GoRoute(
        path: '/register',
        name: 'register',
        pageBuilder: (context, state) => MaterialPage(
          key: state.pageKey,
          child: const RegisterScreen(),
        ),
      ),
      GoRoute(
        path: '/forgot-password',
        name: 'forgot-password',
        pageBuilder: (context, state) => MaterialPage(
          key: state.pageKey,
          child: const ForgotPasswordScreen(),
        ),
      ),

      // Main App Routes (with bottom navigation)
      ShellRoute(
        builder: (context, state, child) {
          return MainLayout(child: child);
        },
        routes: [
          GoRoute(
            path: '/home',
            name: 'home',
            pageBuilder: (context, state) => NoTransitionPage(
              key: state.pageKey,
              child: const HomeScreen(),
            ),
          ),
          GoRoute(
            path: '/notifications',
            name: 'notifications',
            pageBuilder: (context, state) => NoTransitionPage(
              key: state.pageKey,
              child: const NotificationsScreen(),
            ),
          ),
          GoRoute(
            path: '/profile',
            name: 'profile',
            pageBuilder: (context, state) => NoTransitionPage(
              key: state.pageKey,
              child: const ProfileScreen(),
            ),
          ),
          GoRoute(
            path: '/settings',
            name: 'settings',
            pageBuilder: (context, state) => NoTransitionPage(
              key: state.pageKey,
              child: const SettingsScreen(),
            ),
          ),
        ],
      ),

      // Settings Sub-Routes
      GoRoute(
        path: '/appearance',
        name: 'appearance',
        pageBuilder: (context, state) => MaterialPage(
          key: state.pageKey,
          child: const AppearanceScreen(),
        ),
      ),
      GoRoute(
        path: '/language',
        name: 'language',
        pageBuilder: (context, state) => MaterialPage(
          key: state.pageKey,
          child: const LanguageScreen(),
        ),
      ),
      GoRoute(
        path: '/privacy-security',
        name: 'privacy-security',
        pageBuilder: (context, state) => MaterialPage(
          key: state.pageKey,
          child: const PrivacySecurityScreen(),
        ),
      ),
      GoRoute(
        path: '/devices',
        name: 'devices',
        pageBuilder: (context, state) => MaterialPage(
          key: state.pageKey,
          child: const DevicesScreen(),
        ),
      ),
      GoRoute(
        path: '/change-password',
        name: 'change-password',
        pageBuilder: (context, state) => MaterialPage(
          key: state.pageKey,
          child: const ChangePasswordScreen(),
        ),
      ),

      // Help & Support Routes
      GoRoute(
        path: '/help',
        name: 'help',
        pageBuilder: (context, state) => MaterialPage(
          key: state.pageKey,
          child: const HelpScreen(),
        ),
      ),
      GoRoute(
        path: '/faq',
        name: 'faq',
        pageBuilder: (context, state) => MaterialPage(
          key: state.pageKey,
          child: const FAQScreen(),
        ),
      ),
      GoRoute(
        path: '/whats-new',
        name: 'whats-new',
        pageBuilder: (context, state) => MaterialPage(
          key: state.pageKey,
          child: const WhatsNewScreen(),
        ),
      ),
    ],
    
    // Error handling
    errorBuilder: (context, state) => Scaffold(
      appBar: AppBar(
        title: const Text('Error'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            Text(
              'Page not found',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              state.uri.toString(),
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.go('/home'),
              child: const Text('Go to Home'),
            ),
          ],
        ),
      ),
    ),
  );
});
