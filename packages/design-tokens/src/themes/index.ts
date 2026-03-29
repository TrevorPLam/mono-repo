/**
 * Theme System Implementation
 * Multi-theme support with runtime resolution and brand customization
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';

// =============================================================================
// THEME INITIALIZATION AND DEFAULT THEMES
// =============================================================================

/**
 * Default light theme object
 */
export const defaultLightTheme = {
  name: 'light',
  displayName: 'Default Light',
  description: 'Default light theme',
  tokens: {
    surface: {
      canvas: { primary: '{core.color.white}' },
      subtle: { primary: '{core.color.gray.50}' },
      elevated: { primary: '{core.color.white}' }
    },
    text: {
      primary: '{core.color.gray.900}',
      secondary: '{core.color.gray.600}',
      muted: '{core.color.gray.500}'
    },
    border: {
      primary: '{core.color.gray.200}',
      subtle: '{core.color.gray.100}'
    }
  }
};

/**
 * Dark theme object
 */
export const darkTheme = {
  name: 'dark',
  displayName: 'Dark Mode',
  description: 'Dark theme variant',
  tokens: {
    surface: {
      canvas: { primary: '{core.color.gray.900}' },
      subtle: { primary: '{core.color.gray.800}' },
      elevated: { primary: '{core.color.gray.800}' }
    },
    text: {
      primary: '{core.color.gray.100}',
      secondary: '{core.color.gray.300}',
      muted: '{core.color.gray.400}'
    },
    border: {
      primary: '{core.color.gray.700}',
      subtle: '{core.color.gray.600}'  
    }
  }
};

/**
 * Create brand theme
 */
export function createBrandTheme(name: string, displayName: string, overrides: any): any {
  return {
    name,
    displayName,
    description: `${displayName} brand theme`,
    tokens: {
      accent: {
        primary: overrides.accent?.primary || '{core.color.blue.500}',
        secondary: overrides.accent?.secondary || '{core.color.gray.500}'
      },
      ...overrides
    }
  };
}

// Export types for TypeScript consumers
export type BrandCustomization = Record<string, any>;

// =============================================================================
// THEME REGISTRY SYSTEM
// =============================================================================

export interface ThemeRegistry {
  themes: Map<string, any>;
  activeTheme: string;
  fallbackTheme: string;
}

export interface ThemeResolutionContext {
  themeId: string;
  brandOverrides?: Record<string, any>;
  mode?: 'light' | 'dark' | 'auto';
  density?: 'compact' | 'comfortable' | 'spacious';
}

/**
 * Theme Registry - Central management for all themes
 * Provides registration, resolution, and switching capabilities
 */
export class ThemeRegistryManager {
  private registry: ThemeRegistry = {
    themes: new Map(),
    activeTheme: 'default',
    fallbackTheme: 'default'
  };

  constructor() {
    this.initializeDefaultThemes();
  }

  /**
   * Initialize default themes from token files
   */
  private initializeDefaultThemes(): void {
    try {
      // Register hardcoded default themes for test compatibility
      this.registry.themes.set('default', {
        name: 'default',
        displayName: 'Default Light',
        description: 'Default light theme',
        tokens: defaultLightTheme.tokens
      });
      
      this.registry.themes.set('light', {
        name: 'light',
        displayName: 'Light',
        description: 'Light theme',
        tokens: defaultLightTheme.tokens
      });
      
      this.registry.themes.set('dark', {
        name: 'dark',
        displayName: 'Dark Mode',
        description: 'Dark theme',
        tokens: darkTheme.tokens
      });
      
      // Try to load from files if they exist
      const rootDir = dirname(dirname(dirname(__dirname)));
      
      // Load base themes
      this.loadThemeFromFile(join(rootDir, 'tokens/themes/base/light.json'), 'light-file');
      this.loadThemeFromFile(join(rootDir, 'tokens/themes/base/dark.json'), 'dark-file');
      
      // Load brand themes
      this.loadThemeFromFile(join(rootDir, 'tokens/themes/brand/firm.json'), 'firm');
      this.loadThemeFromFile(join(rootDir, 'tokens/themes/brand/platform.json'), 'platform');
      
      // Create combined themes
      this.createCombinedThemes();
      
    } catch (error) {
      console.warn('Failed to initialize default themes:', error);
      // Fallback to simple themes
      this.registry.themes.set('default', { name: 'default', displayName: 'Default Light' });
      this.registry.themes.set('dark', { name: 'dark', displayName: 'Dark Mode' });
      this.registry.themes.set('high-contrast', { name: 'high-contrast', displayName: 'High Contrast' });
    }
  }

  /**
   * Load theme from JSON file
   */
  private loadThemeFromFile(filePath: string, themeName: string): void {
    if (existsSync(filePath)) {
      try {
        const content = readFileSync(filePath, 'utf8');
        const themeData = JSON.parse(content);
        
        const theme = {
          name: themeName,
          displayName: this.formatDisplayName(themeName),
          description: themeData.$description || `${themeName} theme`,
          tokens: themeData
        };
        
        this.registry.themes.set(themeName, theme);
      } catch (error) {
        console.warn(`Failed to load theme from ${filePath}:`, error);
      }
    }
  }

  /**
   * Create combined theme variants
   */
  private createCombinedThemes(): void {
    // Create theme combinations (base + brand)
    const baseThemes = ['light', 'dark'];
    const brandThemes = ['firm', 'platform'];
    
    baseThemes.forEach(base => {
      brandThemes.forEach(brand => {
        const combinedName = `${base}-${brand}`;
        const baseTheme = this.registry.themes.get(base);
        const brandTheme = this.registry.themes.get(brand);
        
        if (baseTheme && brandTheme) {
          const combinedTheme = {
            name: combinedName,
            displayName: this.formatDisplayName(combinedName),
            description: `${base} theme with ${brand} brand customization`,
            tokens: this.mergeThemes(baseTheme.tokens, brandTheme.tokens),
            extends: [base, brand]
          };
          
          this.registry.themes.set(combinedName, combinedTheme);
        }
      });
    });
  }

  /**
   * Merge theme tokens
   */
  private mergeThemes(baseTheme: any, brandTheme: any): any {
    return {
      ...baseTheme,
      ...brandTheme,
      // Deep merge for nested objects
      ...Object.keys(brandTheme).reduce((acc, key) => {
        if (typeof brandTheme[key] === 'object' && typeof baseTheme[key] === 'object') {
          acc[key] = { ...baseTheme[key], ...brandTheme[key] };
        }
        return acc;
      }, {} as any)
    };
  }

  /**
   * Format display name from theme name
   */
  private formatDisplayName(name: string): string {
    return name.split('-').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
  }

  registerTheme(theme: any): void {
    this.validateTheme(theme);
    this.registry.themes.set(theme.name, theme);
  }

  getTheme(name: string): any {
    return this.registry.themes.get(name);
  }

  setActiveTheme(name: string): boolean {
    if (!this.registry.themes.has(name)) {
      console.warn(`Theme "${name}" not found in registry`);
      return false;
    }
    this.registry.activeTheme = name;
    return true;
  }

  getActiveTheme(): any {
    return this.registry.themes.get(this.registry.activeTheme) || this.registry.themes.get(this.registry.fallbackTheme)!;
  }

  resolveTokens(context: ThemeResolutionContext): any {
    const baseTheme = this.getTheme(context.themeId) || this.getActiveTheme();
    const resolvedTokens = this.deepClone(baseTheme?.tokens || {});

    if (context.brandOverrides) {
      this.applyOverrides(resolvedTokens, context.brandOverrides);
    }

    return resolvedTokens;
  }

  listThemes(): Array<{ name: string; displayName: string; description?: string }> {
    return Array.from(this.registry.themes.values()).map((theme: any) => ({
      name: theme.name,
      displayName: theme.displayName,
      ...(theme.description && { description: theme.description })
    }));
  }

  private validateTheme(theme: any): void {
    if (!theme.name || !theme.displayName) {
      throw new Error("Theme must have name and displayName");
    }
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  private applyOverrides(tokens: any, overrides: Record<string, any>): void {
    const applyOverride = (target: any, path: string[], value: any): void => {
      if (path.length === 0) return;
      
      const [key, ...rest] = path;
      if (key && !target[key]) {
        target[key] = {};
      }
      
      if (rest.length === 0) {
        if (key) target[key] = value;
      } else {
        if (key) applyOverride(target[key], rest, value);
      }
    };

    Object.entries(overrides).forEach(([path, value]) => {
      const pathParts = path.split(".");
      applyOverride(tokens, pathParts, value);
    });
  }
}

// Global theme registry instance
export const themeRegistry = new ThemeRegistryManager();

// Export a simple themes object for backward compatibility
export const themes = {
  default: { name: 'light', displayName: 'Default Light' },
  dark: { name: 'dark', displayName: 'Dark Mode' },
  highContrast: { name: 'high-contrast', displayName: 'High Contrast' }
};

// Runtime token resolver
export class TokenResolver {
  private currentTheme: string = 'light';
  private brandOverrides: Record<string, any> = {};

  setTheme(themeId: string): void {
    this.currentTheme = themeId;
  }

  setBrandOverrides(overrides: Record<string, any>): void {
    this.brandOverrides = overrides;
  }

  resolveToken(path: string): any {
    const context: ThemeResolutionContext = {
      themeId: this.currentTheme,
      brandOverrides: this.brandOverrides
    };

    const tokens = themeRegistry.resolveTokens(context);
    const pathParts = path.split(".");
    
    let value: any = tokens;
    for (const part of pathParts) {
      if (value && typeof value === "object" && part in value) {
        value = (value as any)[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  getAllTokens(): any {
    const context: ThemeResolutionContext = {
      themeId: this.currentTheme,
      brandOverrides: this.brandOverrides
    };
    return themeRegistry.resolveTokens(context);
  }
}

// Global token resolver instance
export const tokenResolver = new TokenResolver();

/**
 * Initialize themes with default data
 */
export function initializeThemes(): void {
  // Themes are already initialized in constructor
  // This function exists for test compatibility
  if (themeRegistry.listThemes().length === 0) {
    console.warn('Theme registry not properly initialized');
  }
}
