import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName } from 'react-native';
import { getTheme, Theme } from '../theme/tokens';

/**
 * Appearance Context - React Native Version
 * 
 * Migrated from web version with React Native's Appearance API
 * and AsyncStorage for persistence.
 */

export type ThemeMode = 'light' | 'dark' | 'auto';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
export type Density = 'comfortable' | 'compact' | 'spacious';

interface AppearanceSettings {
  themeMode: ThemeMode;
  fontSize: FontSize;
  density: Density;
  animations: boolean;
  highContrast: boolean;
}

interface AppearanceContextType {
  settings: AppearanceSettings;
  theme: Theme;
  isDark: boolean;
  updateThemeMode: (mode: ThemeMode) => void;
  updateFontSize: (size: FontSize) => void;
  updateDensity: (density: Density) => void;
  toggleAnimations: () => void;
  toggleHighContrast: () => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: AppearanceSettings = {
  themeMode: 'auto',
  fontSize: 'medium',
  density: 'comfortable',
  animations: true,
  highContrast: false,
};

const STORAGE_KEY = '@app_appearance_settings';

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

interface AppearanceProviderProps {
  children: ReactNode;
}

export const AppearanceProvider: React.FC<AppearanceProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppearanceSettings>(DEFAULT_SETTINGS);
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );
  const [isLoading, setIsLoading] = useState(true);

  // Determine if dark mode should be active
  const isDark = React.useMemo(() => {
    if (settings.themeMode === 'dark') return true;
    if (settings.themeMode === 'light') return false;
    return systemColorScheme === 'dark';
  }, [settings.themeMode, systemColorScheme]);

  // Get current theme
  const theme = React.useMemo(() => getTheme(isDark), [isDark]);

  // Load settings from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        }
      } catch (error) {
        console.error('Error loading appearance settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Listen to system color scheme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  // Save settings to AsyncStorage
  const saveSettings = async (newSettings: AppearanceSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving appearance settings:', error);
    }
  };

  const updateThemeMode = (mode: ThemeMode) => {
    saveSettings({ ...settings, themeMode: mode });
  };

  const updateFontSize = (size: FontSize) => {
    saveSettings({ ...settings, fontSize: size });
  };

  const updateDensity = (density: Density) => {
    saveSettings({ ...settings, density: density });
  };

  const toggleAnimations = () => {
    saveSettings({ ...settings, animations: !settings.animations });
  };

  const toggleHighContrast = () => {
    saveSettings({ ...settings, highContrast: !settings.highContrast });
  };

  const resetSettings = () => {
    saveSettings(DEFAULT_SETTINGS);
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <AppearanceContext.Provider
      value={{
        settings,
        theme,
        isDark,
        updateThemeMode,
        updateFontSize,
        updateDensity,
        toggleAnimations,
        toggleHighContrast,
        resetSettings,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = (): AppearanceContextType => {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error('useAppearance must be used within AppearanceProvider');
  }
  return context;
};

// Helper hook to get scaled font size based on settings
export const useScaledFontSize = (baseFontSize: number): number => {
  const { settings } = useAppearance();
  
  const multipliers: Record<FontSize, number> = {
    small: 0.875,
    medium: 1,
    large: 1.125,
    xlarge: 1.25,
  };
  
  return baseFontSize * multipliers[settings.fontSize];
};

// Helper hook to get scaled spacing based on density
export const useScaledSpacing = (baseSpacing: number): number => {
  const { settings } = useAppearance();
  
  const multipliers: Record<Density, number> = {
    compact: 0.75,
    comfortable: 1,
    spacious: 1.25,
  };
  
  return baseSpacing * multipliers[settings.density];
};
