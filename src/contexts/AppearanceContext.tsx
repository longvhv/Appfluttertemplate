import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'auto';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type Density = 'compact' | 'normal' | 'comfortable';

interface AppearanceSettings {
  theme: Theme;
  fontSize: FontSize;
  density: Density;
  animations: boolean;
  highContrast: boolean;
}

interface AppearanceContextType {
  settings: AppearanceSettings;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  setDensity: (density: Density) => void;
  setAnimations: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  isDarkMode: boolean;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

const defaultSettings: AppearanceSettings = {
  theme: 'light',
  fontSize: 'medium',
  density: 'normal',
  animations: true,
  highContrast: false,
};

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppearanceSettings>(() => {
    const saved = localStorage.getItem('appearance-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appearance-settings', JSON.stringify(settings));
  }, [settings]);

  // Handle theme changes and system preference
  useEffect(() => {
    const updateTheme = () => {
      if (settings.theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
      } else {
        setIsDarkMode(settings.theme === 'dark');
      }
    };

    updateTheme();

    if (settings.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [settings.theme]);

  // Apply theme class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Apply font size class to document
  useEffect(() => {
    document.documentElement.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    document.documentElement.classList.add(`font-${settings.fontSize}`);
  }, [settings.fontSize]);

  // Apply density class to document
  useEffect(() => {
    document.documentElement.classList.remove('density-compact', 'density-normal', 'density-comfortable');
    document.documentElement.classList.add(`density-${settings.density}`);
  }, [settings.density]);

  // Apply high contrast class to document
  useEffect(() => {
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [settings.highContrast]);

  // Apply animations preference
  useEffect(() => {
    if (!settings.animations) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [settings.animations]);

  const value: AppearanceContextType = {
    settings,
    setTheme: (theme) => setSettings((prev) => ({ ...prev, theme })),
    setFontSize: (fontSize) => setSettings((prev) => ({ ...prev, fontSize })),
    setDensity: (density) => setSettings((prev) => ({ ...prev, density })),
    setAnimations: (animations) => setSettings((prev) => ({ ...prev, animations })),
    setHighContrast: (highContrast) => setSettings((prev) => ({ ...prev, highContrast })),
    isDarkMode,
  };

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error('useAppearance must be used within AppearanceProvider');
  }
  return context;
}
