/**
 * Token path constants and utilities
 */

// Core token paths
export const CORE_TOKEN_PATHS = {
  COLOR: 'core.color',
  SPACING: 'core.spacing',
  TYPOGRAPHY: 'core.typography',
  RADIUS: 'core.radius',
  SHADOW: 'core.shadow',
  BORDER: 'core.border',
  OPACITY: 'core.opacity',
  MOTION: 'core.motion',
  SIZE: 'core.size',
  BREAKPOINTS: 'core.breakpoints',
  Z_INDEX: 'core.z-index'
} as const;

// Semantic token paths
export const SEMANTIC_TOKEN_PATHS = {
  COLOR: 'semantic.color',
  SURFACE: 'semantic.surface',
  TEXT: 'semantic.text',
  BORDER: 'semantic.border',
  ICON: 'semantic.icon',
  FOCUS: 'semantic.focus',
  SPACING: 'semantic.spacing',
  TYPOGRAPHY: 'semantic.typography',
  ELEVATION: 'semantic.elevation',
  MOTION: 'semantic.motion'
} as const;

// Component token paths
export const COMPONENT_TOKEN_PATHS = {
  BUTTON: 'component.button',
  CARD: 'component.card',
  INPUT: 'component.input'
} as const;

// Theme paths
export const THEME_TOKEN_PATHS = {
  BASE_LIGHT: 'themes.base.light',
  BASE_DARK: 'themes.base.dark',
  BRAND_FIRM: 'themes.brand.firm',
  BRAND_PLATFORM: 'themes.brand.platform'
} as const;

// Utility functions
export const getTokenPath = (category: string, token: string): string => `${category}.${token}`;
export const getCSSVariableName = (path: string[]): string => `--repo-${path.join('-')}`;
export const getThemeSelector = (theme: string): string => `html[data-theme="${theme}"]`;
