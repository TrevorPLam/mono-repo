/**
 * Vanilla Extract integration
 * Provides contract for Vanilla Extract theming
 */

import { createVar } from '@vanilla-extract/css';

// Create Vanilla Extract variables that map to CSS custom properties
export const contract = {
  colors: {
    // Core colors
    blue: {
      50: createVar('core-color-blue-50'),
      100: createVar('core-color-blue-100'),
      500: createVar('core-color-blue-500'),
      600: createVar('core-color-blue-600'),
      900: createVar('core-color-blue-900'),
    },
    gray: {
      50: createVar('core-color-gray-50'),
      100: createVar('core-color-gray-100'),
      500: createVar('core-color-gray-500'),
      900: createVar('core-color-gray-900'),
    },
  },
  
  // Semantic colors
  semantic: {
    text: {
      primary: createVar('semantic-text-primary'),
      secondary: createVar('semantic-text-secondary'),
    },
    surface: {
      canvas: createVar('semantic-surface-canvas-primary'),
      elevated: createVar('semantic-surface-elevated-primary'),
    },
  },
  
  spacing: {
    1: createVar('core-spacing-1'),
    2: createVar('core-spacing-2'),
    4: createVar('core-spacing-4'),
    8: createVar('core-spacing-8'),
  },
  
  borderRadius: {
    sm: createVar('core-radius-sm'),
    base: createVar('core-radius-base'),
    lg: createVar('core-radius-lg'),
  },
  
  typography: {
    fontFamily: {
      sans: createVar('core-typography-fontFamily-sans'),
      mono: createVar('core-typography-fontFamily-mono'),
    },
    fontSize: {
      sm: createVar('core-typography-fontSize-sm'),
      base: createVar('core-typography-fontSize-base'),
      lg: createVar('core-typography-fontSize-lg'),
    },
  },
} as const;

/**
 * Create a theme contract for Vanilla Extract
 */
export function createThemeContract(tokens: typeof contract) {
  return tokens;
}

/**
 * Get CSS custom property name for a Vanilla Extract variable
 */
export function getCSSVarName(variable: string): string {
  return `var(--repo-${variable})`;
}
