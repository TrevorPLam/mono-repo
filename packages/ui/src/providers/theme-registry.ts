import { tokens } from '../styles';
import type { Theme } from './theme-provider';

export interface ThemeDefinition {
  name: string;
  displayName: string;
  description?: string;
  isDark?: boolean;
  colors?: Partial<typeof tokens.colors>;
  typography?: Partial<typeof tokens.typography>;
  spacing?: Partial<typeof tokens.spacing>;
  sizing?: Partial<typeof tokens.sizing>;
  borderRadius?: Partial<typeof tokens.borderRadius>;
  shadows?: Partial<typeof tokens.shadows>;
  transitions?: Partial<typeof tokens.transitions>;
  zIndex?: Partial<typeof tokens.zIndex>;
}

export class ThemeRegistry {
  private static instance: ThemeRegistry;
  private themes: Map<string, Theme> = new Map();
  private defaultTheme: Theme;

  private constructor() {
    this.defaultTheme = {
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
    // Register default theme as a definition
    this.registerThemeFromDefinition({
      name: 'default',
      displayName: 'Default Theme',
      description: 'Default theme',
      isDark: false,
    });
  }

  public static getInstance(): ThemeRegistry {
    if (!ThemeRegistry.instance) {
      ThemeRegistry.instance = new ThemeRegistry();
    }
    return ThemeRegistry.instance;
  }

  public registerTheme(definition: ThemeDefinition): Theme {
    const theme: Theme = {
      name: definition.name,
      colors: { ...this.defaultTheme.colors, ...definition.colors },
      typography: { ...this.defaultTheme.typography, ...definition.typography },
      spacing: { ...this.defaultTheme.spacing, ...definition.spacing },
      sizing: { ...this.defaultTheme.sizing, ...definition.sizing },
      borderRadius: { ...this.defaultTheme.borderRadius, ...definition.borderRadius },
      shadows: { ...this.defaultTheme.shadows, ...definition.shadows },
      transitions: { ...this.defaultTheme.transitions, ...definition.transitions },
      zIndex: { ...this.defaultTheme.zIndex, ...definition.zIndex },
    };

    this.themes.set(definition.name, theme);
    return theme;
  }

  public registerThemeFromDefinition(definition: ThemeDefinition): void {
    this.registerTheme(definition);
  }

  public getTheme(name: string): Theme | undefined {
    return this.themes.get(name);
  }

  public getAllThemes(): Theme[] {
    return Array.from(this.themes.values());
  }

  public getThemeNames(): string[] {
    return Array.from(this.themes.keys());
  }

  public getDefaultTheme(): Theme {
    return this.defaultTheme;
  }

  public hasTheme(name: string): boolean {
    return this.themes.has(name);
  }

  public removeTheme(name: string): boolean {
    if (name === 'default') {
      throw new Error('Cannot remove the default theme');
    }
    return this.themes.delete(name);
  }

  public validateTheme(theme: Theme): boolean {
    // Basic validation to ensure all required properties exist
    const requiredKeys = ['colors', 'typography', 'spacing', 'sizing', 'borderRadius', 'shadows', 'transitions', 'zIndex'];
    return requiredKeys.every(key => key in theme && theme[key as keyof Theme] !== undefined);
  }
}

// Export singleton instance
export const themeRegistry = ThemeRegistry.getInstance();

// Predefined theme variations
export const lightTheme: ThemeDefinition = {
  name: 'light',
  displayName: 'Light Theme',
  description: 'Default light theme',
  isDark: false,
};

export const darkTheme: ThemeDefinition = {
  name: 'dark',
  displayName: 'Dark Theme',
  description: 'Dark theme variant',
  isDark: true,
  colors: {
    background: {
      primary: 'var(--token-primitive-colors-gray-950)',
      secondary: 'var(--token-primitive-colors-gray-900)',
      muted: 'var(--token-primitive-colors-gray-800)',
      accent: 'var(--token-primitive-colors-gray-900)',
      inverse: 'var(--token-primitive-colors-gray-50)',
    },
    foreground: {
      primary: 'var(--token-primitive-colors-gray-50)',
      secondary: 'var(--token-primitive-colors-gray-300)',
      muted: 'var(--token-primitive-colors-gray-400)',
      accent: 'var(--token-primitive-colors-gray-100)',
      inverse: 'var(--token-primitive-colors-gray-950)',
    },
    border: {
      primary: 'var(--token-primitive-colors-gray-800)',
      secondary: 'var(--token-primitive-colors-gray-700)',
      muted: 'var(--token-primitive-colors-gray-600)',
      accent: 'var(--token-primitive-colors-gray-800)',
      inverse: 'var(--token-primitive-colors-gray-300)',
    },
  },
};

// Register predefined themes
themeRegistry.registerThemeFromDefinition(lightTheme);
themeRegistry.registerThemeFromDefinition(darkTheme);
