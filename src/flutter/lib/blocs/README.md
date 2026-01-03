# 🧩 BLoC State Management

Complete BLoC (Business Logic Component) implementation for Flutter app.

**Framework:** flutter_bloc ^8.1.6  
**Pattern:** BLoC Pattern with Events, States, and Streams  
**Persistence:** HydratedBloc for automatic state persistence

---

## 📦 Available BLoCs

### **1. AuthBloc** 🔐
Manages user authentication and profile.

**Events:**
- `CheckAuthStatusEvent` - Check current auth status
- `LoginEvent` - User login
- `RegisterEvent` - User registration
- `LogoutEvent` - User logout
- `ResetPasswordEvent` - Password reset
- `UpdateProfileEvent` - Update user profile
- `ChangePasswordEvent` - Change password
- `BiometricAuthEvent` - Biometric authentication

**States:**
- `AuthState.initial()` - Initial state
- `AuthState.loading()` - Loading state
- `AuthState.authenticated(user)` - Authenticated with user
- `AuthState.unauthenticated()` - Not authenticated
- `AuthState.error(message)` - Error state

**Usage:**
```dart
// Provide BLoC
BlocProvider(
  create: (context) => AuthBloc(),
  child: MyApp(),
)

// Login
context.read<AuthBloc>().add(LoginEvent(
  email: 'user@example.com',
  password: 'password123',
));

// Listen to state
BlocBuilder<AuthBloc, AuthState>(
  builder: (context, state) {
    if (state.isAuthenticated) {
      return Text('Welcome ${state.user!.name}');
    }
    return LoginScreen();
  },
)

// Listen to state changes
BlocListener<AuthBloc, AuthState>(
  listener: (context, state) {
    if (state.hasError) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(state.errorMessage!)),
      );
    }
  },
  child: MyWidget(),
)
```

---

### **2. ThemeBloc** 🎨
Manages app theme and dark mode.

**Events:**
- `ChangeThemeModeEvent(themeMode)` - Change theme mode
- `ToggleThemeEvent()` - Toggle between light/dark
- `LoadThemeEvent()` - Load saved theme
- `ResetThemeEvent()` - Reset to system default

**States:**
- `ThemeState` with `themeMode` and `isDark` properties

**Usage:**
```dart
// Change to dark mode
context.read<ThemeBloc>().add(
  ChangeThemeModeEvent(ThemeMode.dark),
);

// Toggle theme
context.read<ThemeBloc>().add(const ToggleThemeEvent());

// Listen to theme
BlocBuilder<ThemeBloc, ThemeState>(
  builder: (context, state) {
    return MaterialApp(
      themeMode: state.themeMode,
      theme: lightTheme,
      darkTheme: darkTheme,
    );
  },
)
```

---

### **3. LocaleBloc** 🌍
Manages app language and localization.

**Events:**
- `ChangeLocaleEvent(locale)` - Change to specific locale
- `ChangeToEnglishEvent()` - Switch to English
- `ChangeToVietnameseEvent()` - Switch to Vietnamese
- `LoadLocaleEvent()` - Load saved locale
- `ResetLocaleEvent()` - Reset to default

**States:**
- `LocaleState` with `locale`, `languageCode`, and `languageName`

**Usage:**
```dart
// Change to Vietnamese
context.read<LocaleBloc>().add(
  const ChangeToVietnameseEvent(),
);

// Change to specific locale
context.read<LocaleBloc>().add(
  ChangeLocaleEvent(const Locale('vi')),
);

// Listen to locale
BlocBuilder<LocaleBloc, LocaleState>(
  builder: (context, state) {
    return MaterialApp(
      locale: state.locale,
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
    );
  },
)
```

---

### **4. CounterBloc** 🔢
Example counter implementation.

**Events:**
- `IncrementCounterEvent()` - Increment by 1
- `DecrementCounterEvent()` - Decrement by 1
- `ResetCounterEvent()` - Reset to 0
- `SetCounterEvent(value)` - Set to specific value
- `AddToCounterEvent(value)` - Add specific value

**States:**
- `CounterState` with `value` and `lastUpdated`

**Usage:**
```dart
// Increment
context.read<CounterBloc>().add(const IncrementCounterEvent());

// Set value
context.read<CounterBloc>().add(SetCounterEvent(42));

// Listen to counter
BlocBuilder<CounterBloc, CounterState>(
  builder: (context, state) {
    return Text('Counter: ${state.value}');
  },
)
```

---

## 🏗️ Architecture

### **BLoC Pattern Structure**

```
lib/blocs/
├── auth/
│   ├── auth_bloc.dart       # BLoC implementation
│   ├── auth_event.dart      # Events
│   └── auth_state.dart      # States
├── theme/
│   ├── theme_bloc.dart
│   ├── theme_event.dart
│   └── theme_state.dart
├── locale/
│   ├── locale_bloc.dart
│   ├── locale_event.dart
│   └── locale_state.dart
├── counter/
│   ├── counter_bloc.dart
│   ├── counter_event.dart
│   └── counter_state.dart
├── app_bloc_observer.dart   # Observer for debugging
└── blocs.dart               # Barrel export
```

### **Event → BLoC → State Flow**

```
┌─────────┐      ┌──────────┐      ┌─────────┐
│  Event  │ ───> │   BLoC   │ ───> │  State  │
└─────────┘      └──────────┘      └─────────┘
                       │
                       ▼
                  ┌──────────┐
                  │  Logic   │
                  │   API    │
                  │ Database │
                  └──────────┘
```

---

## 🎯 Usage Patterns

### **1. BlocProvider**
Provides BLoC to widget tree.

```dart
BlocProvider(
  create: (context) => AuthBloc(),
  child: MyApp(),
)

// Multiple providers
MultiBlocProvider(
  providers: [
    BlocProvider(create: (context) => AuthBloc()),
    BlocProvider(create: (context) => ThemeBloc()),
    BlocProvider(create: (context) => LocaleBloc()),
  ],
  child: MyApp(),
)
```

### **2. BlocBuilder**
Rebuilds widget when state changes.

```dart
BlocBuilder<AuthBloc, AuthState>(
  builder: (context, state) {
    if (state.isLoading) {
      return CircularProgressIndicator();
    }
    if (state.isAuthenticated) {
      return HomeScreen();
    }
    return LoginScreen();
  },
)
```

### **3. BlocListener**
Listens to state changes for side effects.

```dart
BlocListener<AuthBloc, AuthState>(
  listener: (context, state) {
    if (state.hasError) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(state.errorMessage!)),
      );
    }
    if (state.isAuthenticated) {
      Navigator.pushReplacementNamed(context, '/home');
    }
  },
  child: MyWidget(),
)
```

### **4. BlocConsumer**
Combines BlocBuilder and BlocListener.

```dart
BlocConsumer<AuthBloc, AuthState>(
  listener: (context, state) {
    if (state.hasError) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(state.errorMessage!)),
      );
    }
  },
  builder: (context, state) {
    if (state.isLoading) {
      return CircularProgressIndicator();
    }
    return MyWidget();
  },
)
```

### **5. BlocSelector**
Rebuilds only when specific state property changes.

```dart
BlocSelector<AuthBloc, AuthState, String?>(
  selector: (state) => state.user?.name,
  builder: (context, userName) {
    return Text('Welcome $userName');
  },
)
```

---

## 🔄 State Persistence

All BLoCs use **HydratedBloc** for automatic state persistence.

### **How it works:**

1. State is automatically saved to disk when it changes
2. State is automatically restored when app restarts
3. Uses `path_provider` to find app storage directory

### **Implementation:**

```dart
class MyBloc extends HydratedBloc<MyEvent, MyState> {
  MyBloc() : super(MyState.initial());

  @override
  MyState? fromJson(Map<String, dynamic> json) {
    // Deserialize from JSON
    return MyState.fromJson(json);
  }

  @override
  Map<String, dynamic>? toJson(MyState state) {
    // Serialize to JSON
    return state.toJson();
  }
}
```

### **Storage Location:**

- **Android:** `/data/data/<package>/app_flutter/hydrated_bloc`
- **iOS:** `<Documents>/hydrated_bloc`
- **Web:** LocalStorage
- **Desktop:** Application Documents

---

## 📊 BLoC Observer

Custom observer for debugging and logging.

### **Features:**
- ✅ Logs BLoC creation
- ✅ Logs events
- ✅ Logs state changes
- ✅ Logs transitions
- ✅ Logs errors
- ✅ Pretty printing with emojis
- ✅ Timestamps

### **Setup:**

```dart
void main() async {
  Bloc.observer = AppBlocObserver();
  runApp(MyApp());
}
```

### **Console Output:**

```
📦 onCreate: AuthBloc
📨 Event: AuthBloc | LoginEvent(email: user@example.com)
🔄 Transition: AuthBloc | Transition { 
  currentState: AuthState.initial(), 
  event: LoginEvent(...), 
  nextState: AuthState.loading() 
}
📝 Change: AuthBloc | Change { 
  currentState: AuthState.initial(), 
  nextState: AuthState.loading() 
}
```

---

## 🧪 Testing

### **1. Unit Testing BLoCs**

```dart
void main() {
  group('CounterBloc', () {
    late CounterBloc counterBloc;

    setUp(() {
      counterBloc = CounterBloc();
    });

    tearDown(() {
      counterBloc.close();
    });

    test('initial state is 0', () {
      expect(counterBloc.state.value, equals(0));
    });

    blocTest<CounterBloc, CounterState>(
      'emits [1] when IncrementCounterEvent is added',
      build: () => counterBloc,
      act: (bloc) => bloc.add(const IncrementCounterEvent()),
      expect: () => [
        isA<CounterState>().having(
          (s) => s.value,
          'value',
          equals(1),
        ),
      ],
    );
  });
}
```

### **2. Widget Testing with BLoCs**

```dart
testWidgets('shows login screen when unauthenticated', (tester) async {
  await tester.pumpWidget(
    BlocProvider(
      create: (context) => AuthBloc(),
      child: MaterialApp(home: MyApp()),
    ),
  );

  expect(find.byType(LoginScreen), findsOneWidget);
});
```

---

## 🎨 Best Practices

### **1. Single Responsibility**
Each BLoC should handle one feature or domain.

✅ Good:
```dart
AuthBloc - Authentication only
ThemeBloc - Theme only
```

❌ Bad:
```dart
AppBloc - Everything
```

### **2. Use Equatable**
Always extend Equatable for events and states.

```dart
class MyEvent extends Equatable {
  @override
  List<Object?> get props => [];
}
```

### **3. Descriptive Names**
Use clear, descriptive names for events and states.

✅ Good:
```dart
LoginEvent
AuthState.authenticated(user)
```

❌ Bad:
```dart
Event1
State2
```

### **4. Error Handling**
Always handle errors in BLoCs.

```dart
try {
  // API call
} catch (e) {
  emit(MyState.error(e.toString()));
}
```

### **5. Loading States**
Show loading indicators during async operations.

```dart
emit(MyState.loading());
final data = await api.fetch();
emit(MyState.success(data));
```

---

## 🔧 Advanced Features

### **1. BLoC Concurrency**

```dart
on<MyEvent>(
  _onMyEvent,
  transformer: sequential(),  // Process events sequentially
);

on<MyEvent>(
  _onMyEvent,
  transformer: concurrent(),  // Process events concurrently
);

on<MyEvent>(
  _onMyEvent,
  transformer: restartable(),  // Cancel previous, start new
);

on<MyEvent>(
  _onMyEvent,
  transformer: droppable(),  // Ignore if processing
);
```

### **2. Replay BLoC**

```dart
class MyBloc extends ReplayBloc<MyEvent, MyState> {
  MyBloc() : super(MyState.initial());

  // Undo last state change
  bloc.undo();

  // Redo last undo
  bloc.redo();

  // Check if can undo/redo
  bloc.canUndo;
  bloc.canRedo;
}
```

### **3. Stream Transformers**

```dart
on<SearchEvent>(
  _onSearch,
  transformer: debounce(Duration(milliseconds: 300)),
);

EventTransformer<E> debounce<E>(Duration duration) {
  return (events, mapper) => events.debounceTime(duration).flatMap(mapper);
}
```

---

## 📚 Resources

### **Official Documentation**
- [flutter_bloc](https://pub.dev/packages/flutter_bloc)
- [bloc](https://pub.dev/packages/bloc)
- [hydrated_bloc](https://pub.dev/packages/hydrated_bloc)
- [BLoC Library](https://bloclibrary.dev)

### **Tutorials**
- [BLoC Architecture Tutorial](https://bloclibrary.dev/tutorials/flutter-counter/)
- [State Management Guide](https://bloclibrary.dev/state-management/)

### **Examples**
- See `/lib/blocs/` for implementations
- Check tests for usage examples

---

## ✅ Migration from Riverpod

### **Provider → BlocProvider**

**Before (Riverpod):**
```dart
final counterProvider = StateProvider<int>((ref) => 0);

ProviderScope(
  child: MyApp(),
)

final count = ref.watch(counterProvider);
ref.read(counterProvider.notifier).state++;
```

**After (BLoC):**
```dart
class CounterBloc extends Bloc<CounterEvent, CounterState> {...}

BlocProvider(
  create: (context) => CounterBloc(),
  child: MyApp(),
)

BlocBuilder<CounterBloc, CounterState>(
  builder: (context, state) => Text('${state.value}'),
)

context.read<CounterBloc>().add(IncrementCounterEvent());
```

---

**🎉 BLoC State Management is ready to use!**

**Total BLoCs:** 4 (Auth, Theme, Locale, Counter)  
**Pattern:** Event-Driven Architecture  
**Persistence:** Automatic with HydratedBloc  
**Testing:** Full support with bloc_test  
**Debugging:** AppBlocObserver with logging

---

**Last Updated:** January 3, 2026  
**Version:** 1.0.0
