import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tokens } from '../styles';

export interface Theme {
  name: string;
  colors: typeof tokens.colors;
  typography: typeof tokens.typography;
  spacing: typeof tokens.spacing;
  sizing: typeof tokens.sizing;
  borderRadius: typeof tokens.borderRadius;
  shadows: typeof tokens.shadows;
  transitions: typeof tokens.transitions;
  zIndex: typeof tokens.zIndex;
}

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeName: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const defaultTheme: Theme = {
  name: 'default',
  colors: tokens.colors,
  typography: tokens.typography,
  spacing: tokens.spacing,
  sizing: tokens.sizing,
  borderRadius: tokens.borderRadius,
  shadows: tokens.shadows,
  transitions: tokens.transitions,
  zIndex: tokens.zIndex,
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  themeName?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme: initialTheme = defaultTheme,
  themeName: initialThemeName = 'default',
}) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    // In a real implementation, this would switch to a dark theme
    // For now, we'll just toggle the state
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    // Apply theme to CSS custom properties
    applyThemeToCSS(newTheme);
  };

  const applyThemeToCSS = (themeToApply: Theme) => {
    const root = document.documentElement;
    
    // Apply colors
    Object.entries(themeToApply.colors).forEach(([category, values]) => {
      if (typeof values === 'object' && values !== null) {
        Object.entries(values).forEach(([key, value]) => {
          const cssVar = `--color-${category}-${key}`;
          root.style.setProperty(cssVar, String(value));
        });
      }
    });

    // Apply spacing
    Object.entries(themeToApply.spacing).forEach(([key, value]) => {
      const cssVar = `--spacing-${key}`;
      root.style.setProperty(cssVar, String(value));
    });

    // Apply typography
    Object.entries(themeToApply.typography).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          const cssVar = `--typography-${key}-${subKey}`;
          root.style.setProperty(cssVar, String(subValue));
        });
      } else {
        const cssVar = `--typography-${key}`;
        root.style.setProperty(cssVar, String(value));
      }
    });
  };

  useEffect(() => {
    applyThemeToCSS(theme);
  }, [theme]);

  const value: ThemeContextValue = {
    theme,
    setTheme: handleSetTheme,
    themeName: initialThemeName,
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeContext };
