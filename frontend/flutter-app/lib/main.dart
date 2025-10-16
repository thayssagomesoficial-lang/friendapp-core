import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import 'providers/auth_provider.dart';
import 'providers/user_provider.dart';
import 'providers/feed_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/personality/personality_test_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/feed/feed_screen.dart';
import 'screens/profile/profile_screen.dart';

void main() {
  runApp(const FriendApp());
}

class FriendApp extends StatelessWidget {
  const FriendApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => FeedProvider()),
      ],
      child: Consumer<AuthProvider>(
        builder: (context, authProvider, _) {
          return MaterialApp.router(
            title: 'FriendApp',
            debugShowCheckedModeBanner: false,
            theme: ThemeData(
              useMaterial3: true,
              colorScheme: ColorScheme.fromSeed(
                seedColor: const Color(0xFF6B4CE6),
                brightness: Brightness.light,
              ),
              textTheme: GoogleFonts.poppinsTextTheme(),
            ),
            darkTheme: ThemeData(
              useMaterial3: true,
              colorScheme: ColorScheme.fromSeed(
                seedColor: const Color(0xFF6B4CE6),
                brightness: Brightness.dark,
              ),
              textTheme: GoogleFonts.poppinsTextTheme(
                ThemeData.dark().textTheme,
              ),
            ),
            themeMode: ThemeMode.system,
            routerConfig: _router(authProvider),
          );
        },
      ),
    );
  }

  GoRouter _router(AuthProvider authProvider) {
    return GoRouter(
      initialLocation: '/',
      redirect: (context, state) {
        final isAuthenticated = authProvider.isAuthenticated;
        final isAuthRoute = state.matchedLocation.startsWith('/auth');

        if (!isAuthenticated && !isAuthRoute && state.matchedLocation != '/') {
          return '/auth/login';
        }

        if (isAuthenticated && isAuthRoute) {
          return '/home';
        }

        return null;
      },
      routes: [
        GoRoute(
          path: '/',
          builder: (context, state) => const SplashScreen(),
        ),
        GoRoute(
          path: '/auth/login',
          builder: (context, state) => const LoginScreen(),
        ),
        GoRoute(
          path: '/auth/register',
          builder: (context, state) => const RegisterScreen(),
        ),
        GoRoute(
          path: '/personality-test',
          builder: (context, state) => const PersonalityTestScreen(),
        ),
        GoRoute(
          path: '/home',
          builder: (context, state) => const HomeScreen(),
        ),
        GoRoute(
          path: '/feed',
          builder: (context, state) => const FeedScreen(),
        ),
        GoRoute(
          path: '/profile',
          builder: (context, state) => const ProfileScreen(),
        ),
      ],
    );
  }
}
