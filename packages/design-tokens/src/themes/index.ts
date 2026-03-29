/**
 * Theme System Implementation
 * Multi-theme support with runtime resolution and brand customization
 * Following W3C Design Tokens Format Module 2025.10 standards
 */

import type { ThemeTokens, DesignTokens, SemanticTokens } from '../schema/types';
import { semanticColors, semanticTypography, semanticSpacing, semanticSizing, semanticBorderRadius, semanticShadows, semanticMotion } from '../tokens/semantic';

// =============================================================================
// THEME REGISTRY SYSTEM
// =============================================================================

export interface ThemeRegistry {
  themes: Map<string, ThemeTokens>;
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

  /**
   * Register a new theme in the registry
   */
  registerTheme(theme: ThemeTokens): void {
    this.validateTheme(theme);
    this.registry.themes.set(theme.name, theme);
  }

  /**
   * Get a theme by name
   */
  getTheme(name: string): ThemeTokens | undefined {
    return this.registry.themes.get(name);
  }

  /**
   * Set the active theme
   */
  setActiveTheme(name: string): boolean {
    if (!this.registry.themes.has(name)) {
      console.warn(`Theme "${name}" not found in registry`);
      return false;
    }
    this.registry.activeTheme = name;
    return true;
  }

  /**
   * Get the currently active theme
   */
  getActiveTheme(): ThemeTokens {
    return this.registry.themes.get(this.registry.activeTheme) || this.registry.themes.get(this.registry.fallbackTheme)!;
  }

  /**
   * Resolve tokens with context-aware overrides
   */
  resolveTokens(context: ThemeResolutionContext): DesignTokens {
    const baseTheme = this.getTheme(context.themeId) || this.getActiveTheme();
    const resolvedTokens = this.deepClone(baseTheme.tokens);

    // Apply brand overrides if provided
    if (context.brandOverrides) {
      this.applyOverrides(resolvedTokens, context.brandOverrides);
    }

    return resolvedTokens;
  }

  /**
   * List all registered themes
   */
  listThemes(): Array<{ name: string; displayName: string; description?: string }> {
    return Array.from(this.registry.themes.values()).map(theme => ({
      name: theme.name,
      displayName: theme.displayName,
      ...(theme.description && { description: theme.description })
    }));
  }

  /**
   * Validate theme structure
   */
  private validateTheme(theme: ThemeTokens): void {
    if (!theme.name || !theme.displayName) {
      throw new Error('Theme must have name and displayName');
    }
    if (!theme.tokens || !theme.tokens.primitive || !theme.tokens.semantic) {
      throw new Error('Theme must have complete token structure');
    }
  }

  /**
   * Deep clone object to avoid mutations
   */
  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Apply overrides to tokens
   */
  private applyOverrides(tokens: DesignTokens, overrides: Record<string, any>): void {
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
      const pathParts = path.split('.');
      applyOverride(tokens, pathParts, value);
    });
  }
}

// Global theme registry instance
export const themeRegistry = new ThemeRegistryManager();

// =============================================================================
// DEFAULT THEME DEFINITIONS
// =============================================================================

/**
 * Default light theme - Base theme for the marketing firm
 */
export const defaultLightTheme: ThemeTokens = {
  name: 'default',
  displayName: 'Default Light',
  description: 'Default light theme for marketing firm websites',
  tokens: {
    primitive: {
      // Primitive tokens will be imported from the tokens directory
    } as any,
    semantic: {
      colors: semanticColors,
      typography: semanticTypography,
      spacing: semanticSpacing,
      sizing: semanticSizing,
      borderRadius: semanticBorderRadius,
      shadows: semanticShadows,
      motion: semanticMotion
    }
  }
};

/**
 * Dark theme variant
 */
export const darkTheme: ThemeTokens = {
  name: 'dark',
  displayName: 'Dark Mode',
  description: 'Dark theme variant for low-light environments',
  tokens: {
    primitive: defaultLightTheme.tokens.primitive,
    semantic: {
      ...defaultLightTheme.tokens.semantic,
      colors: {
        // Invert background and text colors for dark mode
        ...defaultLightTheme.tokens.semantic.colors,
        'color-background': '#111827',        // gray-900
        'color-background-secondary': '#1f2937', // gray-800
        'color-background-tertiary': '#374151',  // gray-700
        'color-background-inverse': '#ffffff',   // white
        'color-surface': '#1f2937',              // gray-800
        'color-surface-hover': '#374151',       // gray-700
        'color-surface-active': '#4b5563',      // gray-600
        'color-surface-inverse': '#f3f4f6',     // gray-100
        'color-text-primary': '#f9fafb',         // gray-50
        'color-text-secondary': '#d1d5db',      // gray-300
        'color-text-tertiary': '#9ca3af',       // gray-400
        'color-text-inverse': '#111827',         // gray-900
        'color-text-muted': '#6b7280',          // gray-500
        'color-text-disabled': '#4b5563',       // gray-600
        'color-border': '#374151',              // gray-700
        'color-border-hover': '#4b5563',         // gray-600
        'color-border-active': '#6b7280',        // gray-500
        'color-border-inverse': '#f3f4f6',       // gray-100
        'color-border-muted': '#1f2937',        // gray-800
      }
    }
  }
};

/**
 * High contrast theme for accessibility
 */
export const highContrastTheme: ThemeTokens = {
  name: 'high-contrast',
  displayName: 'High Contrast',
  description: 'High contrast theme for accessibility compliance',
  tokens: {
    primitive: defaultLightTheme.tokens.primitive,
    semantic: {
      ...defaultLightTheme.tokens.semantic,
      colors: {
        ...defaultLightTheme.tokens.semantic.colors,
        'color-primary': '#0000ff',             // Pure blue
        'color-primary-hover': '#0000cc',       // Darker blue
        'color-primary-active': '#000099',      // Even darker blue
        'color-text-primary': '#000000',         // Pure black
        'color-text-secondary': '#333333',       // Dark gray
        'color-text-tertiary': '#666666',       // Medium gray
        'color-text-inverse': '#ffffff',         // Pure white
        'color-border': '#000000',              // Pure black
        'color-border-hover': '#333333',         // Dark gray
        'color-border-active': '#666666',        // Medium gray
        'color-background': '#ffffff',            // Pure white
        'color-surface': '#ffffff',              // Pure white
      }
    }
  }
};

// =============================================================================
// THEME INITIALIZATION
// =============================================================================

/**
 * Initialize the theme registry with default themes
 */
export function initializeThemes(): void {
  themeRegistry.registerTheme(defaultLightTheme);
  themeRegistry.registerTheme(darkTheme);
  themeRegistry.registerTheme(highContrastTheme);
  
  // Set default as active theme
  themeRegistry.setActiveTheme('default');
}

// =============================================================================
// BRAND CUSTOMIZATION SYSTEM
// =============================================================================

export interface BrandCustomization {
  id: string;
  name: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  borderRadius?: string;
  customTokens?: Record<string, any>;
}

/**
 * Create a custom theme from brand customization
 */
export function createBrandTheme(customization: BrandCustomization): ThemeTokens {
  const baseTheme = defaultLightTheme;
  const brandTokens: Partial<SemanticTokens> = {
    colors: {
      ...baseTheme.tokens.semantic.colors
    },
    borderRadius: {
      ...baseTheme.tokens.semantic.borderRadius
    },
    typography: {
      ...baseTheme.tokens.semantic.typography
    }
  };

  // Apply brand color customization
  if (customization.primaryColor) {
    brandTokens.colors!['color-primary'] = customization.primaryColor;
    brandTokens.colors!['color-primary-hover'] = customization.primaryColor;
    brandTokens.colors!['color-primary-active'] = customization.primaryColor;
  }

  if (customization.secondaryColor) {
    brandTokens.colors!['color-secondary'] = customization.secondaryColor;
    brandTokens.colors!['color-secondary-hover'] = customization.secondaryColor;
  }

  if (customization.accentColor) {
    brandTokens.colors!['color-accent'] = customization.accentColor;
    brandTokens.colors!['color-accent-hover'] = customization.accentColor;
  }

  // Apply border radius customization
  if (customization.borderRadius) {
    Object.keys(brandTokens.borderRadius!).forEach(key => {
      (brandTokens.borderRadius as any)[key] = customization.borderRadius;
    });
  }

  // Apply custom font family
  if (customization.fontFamily) {
    Object.keys(brandTokens.typography!).forEach(key => {
      const textStyle = (brandTokens.typography as any)[key];
      if (textStyle && textStyle['font-family']) {
        textStyle['font-family'] = customization.fontFamily;
      }
    });
  }

  // Apply any custom tokens
  if (customization.customTokens) {
    Object.entries(customization.customTokens).forEach(([path, value]) => {
      const pathParts = path.split('.');
      let target: any = brandTokens;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (part && !target[part]) {
          target[part] = {};
        }
        if (part) target = target[part];
      }
      
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart) target[lastPart] = value;
    });
  }

  return {
    name: customization.id,
    displayName: customization.name,
    description: `Custom theme for ${customization.name}`,
    tokens: {
      primitive: baseTheme.tokens.primitive,
      semantic: {
        ...baseTheme.tokens.semantic,
        ...brandTokens
      } as SemanticTokens
    }
  };
}

// =============================================================================
// RUNTIME TOKEN RESOLUTION
// =============================================================================

/**
 * Runtime token resolver for dynamic theme switching
 */
export class TokenResolver {
  private currentTheme: string = 'default';
  private brandOverrides: Record<string, any> = {};

  /**
   * Set the current theme
   */
  setTheme(themeId: string): void {
    this.currentTheme = themeId;
  }

  /**
   * Set brand overrides
   */
  setBrandOverrides(overrides: Record<string, any>): void {
    this.brandOverrides = overrides;
  }

  /**
   * Resolve a token value by path
   */
  resolveToken(path: string): any {
    const context: ThemeResolutionContext = {
      themeId: this.currentTheme,
      brandOverrides: this.brandOverrides
    };

    const tokens = themeRegistry.resolveTokens(context);
    const pathParts = path.split('.');
    
    let value: any = tokens;
    for (const part of pathParts) {
      if (value && typeof value === 'object' && part in value) {
        value = (value as any)[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Get all resolved tokens
   */
  getAllTokens(): DesignTokens {
    const context: ThemeResolutionContext = {
      themeId: this.currentTheme,
      brandOverrides: this.brandOverrides
    };
    return themeRegistry.resolveTokens(context);
  }
}

// Global token resolver instance
export const tokenResolver = new TokenResolver();

// =============================================================================
// EXPORTS
// =============================================================================

export const themes = {
  default: defaultLightTheme,
  dark: darkTheme,
  highContrast: highContrastTheme
};

// Re-export theme switching utilities
export * from './switcher';

// Re-export brand customization utilities
export * from './brand';

// Re-export theme validation utilities (specific exports to avoid conflicts)
export {
  ThemeRegistrySchema,
  ThemeResolutionContextSchema,
  BrandCustomizationSchema,
  ValidationClientBrandProfileSchema,
  ValidationBrandPresetSchema,
  ThemeSwitchOptionsSchema,
  AutoThemeOptionsSchema,
  ThemeStorageOptionsSchema,
  ThemeAccessibilitySchema,
  ThemePerformanceSchema,
  ThemeSystemConfigSchema,
  validateThemeRegistry,
  validateThemeResolutionContext,
  validateBrandCustomization,
  validateClientBrandProfile,
  validateBrandPreset,
  validateThemeSwitchOptions,
  validateAutoThemeOptions,
  validateThemeStorageOptions,
  validateThemeSystemConfig,
  validateThemeBrandCompatibility,
  validateThemeTransitionPerformance,
  validateBrandProfileStatusTransition,
  type ThemeRegistryType,
  type ThemeResolutionContextType,
  type BrandCustomizationType,
  type ValidationClientBrandProfileType,
  type ValidationBrandPresetType,
  type ThemeSwitchOptionsType,
  type AutoThemeOptionsType,
  type ThemeStorageOptionsType,
  type ThemeSystemConfigType,
  type ThemeRegistry as IThemeRegistry,
  type ThemeResolutionContext as IThemeResolutionContext,
  type BrandCustomization as IBrandCustomization,
  type ValidationClientBrandProfile as IValidationClientBrandProfile,
  type ValidationBrandPreset as IValidationBrandPreset
} from './validation';
