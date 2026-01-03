import React from 'react';
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppearanceProvider, useAppearance } from './contexts/AppearanceContext';
import { RootNavigator } from './navigation/RootNavigator';

/**
 * App Component - React Native
 * 
 * Root component with context providers and navigation
 */

const AppContent: React.FC = () => {
  const { isDark, theme } = useAppearance();

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <RootNavigator />
    </>
  );
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <AppearanceProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </AppearanceProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
};

export default App;
