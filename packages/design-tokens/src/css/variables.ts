/**
 * CSS variable names and utilities
 * Provides access to CSS custom property names for consumption
 */

export const cssVars = {
  // Core color variables
  colors: {
    blue: {
      50: 'var(--repo-core-color-blue-50)',
      100: 'var(--repo-core-color-blue-100)',
      200: 'var(--repo-core-color-blue-200)',
      300: 'var(--repo-core-color-blue-300)',
      400: 'var(--repo-core-color-blue-400)',
      500: 'var(--repo-core-color-blue-500)',
      600: 'var(--repo-core-color-blue-600)',
      700: 'var(--repo-core-color-blue-700)',
      800: 'var(--repo-core-color-blue-800)',
      900: 'var(--repo-core-color-blue-900)',
      950: 'var(--repo-core-color-blue-950)',
    },
    gray: {
      50: 'var(--repo-core-color-gray-50)',
      100: 'var(--repo-core-color-gray-100)',
      200: 'var(--repo-core-color-gray-200)',
      300: 'var(--repo-core-color-gray-300)',
      400: 'var(--repo-core-color-gray-400)',
      500: 'var(--repo-core-color-gray-500)',
      600: 'var(--repo-core-color-gray-600)',
      700: 'var(--repo-core-color-gray-700)',
      800: 'var(--repo-core-color-gray-800)',
      900: 'var(--repo-core-color-gray-900)',
      950: 'var(--repo-core-color-gray-950)',
    },
    // ... other colors would be expanded here
  },
  
  // Semantic color variables
  semantic: {
    text: {
      primary: 'var(--repo-semantic-text-primary)',
      secondary: 'var(--repo-semantic-text-secondary)',
      tertiary: 'var(--repo-semantic-text-tertiary)',
      muted: 'var(--repo-semantic-text-muted)',
      subtle: 'var(--repo-semantic-text-subtle)',
    },
    surface: {
      canvas: {
        primary: 'var(--repo-semantic-surface-canvas-primary)',
        secondary: 'var(--repo-semantic-surface-canvas-secondary)',
        tertiary: 'var(--repo-semantic-surface-canvas-tertiary)',
      },
      elevated: {
        primary: 'var(--repo-semantic-surface-elevated-primary)',
        secondary: 'var(--repo-semantic-surface-elevated-secondary)',
      },
    },
    // ... other semantic tokens
  },
  
  // Spacing variables
  spacing: {
    0: 'var(--repo-core-spacing-0)',
    px: 'var(--repo-core-spacing-px)',
    '0_5': 'var(--repo-core-spacing-0_5)',
    1: 'var(--repo-core-spacing-1)',
    2: 'var(--repo-core-spacing-2)',
    3: 'var(--repo-core-spacing-3)',
    4: 'var(--repo-core-spacing-4)',
    6: 'var(--repo-core-spacing-6)',
    8: 'var(--repo-core-spacing-8)',
    10: 'var(--repo-core-spacing-10)',
    12: 'var(--repo-core-spacing-12)',
    16: 'var(--repo-core-spacing-16)',
    20: 'var(--repo-core-spacing-20)',
    24: 'var(--repo-core-spacing-24)',
  },
  
  // Typography variables
  typography: {
    fontFamily: {
      sans: 'var(--repo-core-typography-fontFamily-sans)',
      serif: 'var(--repo-core-typography-fontFamily-serif)',
      mono: 'var(--repo-core-typography-fontFamily-mono)',
    },
    fontSize: {
      xs: 'var(--repo-core-typography-fontSize-xs)',
      sm: 'var(--repo-core-typography-fontSize-sm)',
      base: 'var(--repo-core-typography-fontSize-base)',
      lg: 'var(--repo-core-typography-fontSize-lg)',
      xl: 'var(--repo-core-typography-fontSize-xl)',
      '2xl': 'var(--repo-core-typography-fontSize-2xl)',
      '3xl': 'var(--repo-core-typography-fontSize-3xl)',
      '4xl': 'var(--repo-core-typography-fontSize-4xl)',
      '5xl': 'var(--repo-core-typography-fontSize-5xl)',
      '6xl': 'var(--repo-core-typography-fontSize-6xl)',
    },
    // ... other typography tokens
  },
  
  // Border radius variables
  borderRadius: {
    none: 'var(--repo-core-radius-none)',
    sm: 'var(--repo-core-radius-sm)',
    base: 'var(--repo-core-radius-base)',
    md: 'var(--repo-core-radius-md)',
    lg: 'var(--repo-core-radius-lg)',
    xl: 'var(--repo-core-radius-xl)',
    '2xl': 'var(--repo-core-radius-2xl)',
    '3xl': 'var(--repo-core-radius-3xl)',
    full: 'var(--repo-core-radius-full)',
  },
  
  // Shadow variables
  shadows: {
    xs: 'var(--repo-core-shadow-xs)',
    sm: 'var(--repo-core-shadow-sm)',
    base: 'var(--repo-core-shadow-base)',
    md: 'var(--repo-core-shadow-md)',
    lg: 'var(--repo-core-shadow-lg)',
    xl: 'var(--repo-core-shadow-xl)',
    '2xl': 'var(--repo-core-shadow-2xl)',
    inner: 'var(--repo-core-shadow-inner)',
  },
  
  // Motion variables
  transitions: {
    fast: 'var(--repo-core-motion-duration-fast)',
    normal: 'var(--repo-core-motion-duration-normal)',
    slow: 'var(--repo-core-motion-duration-slow)',
    slower: 'var(--repo-core-motion-duration-slower)',
  },
  
  // Z-index variables
  zIndex: {
    base: 'var(--repo-core-z-index-base)',
    raised: 'var(--repo-core-z-index-raised)',
    dropdown: 'var(--repo-core-z-index-dropdown)',
    sticky: 'var(--repo-core-z-index-sticky)',
    modal: 'var(--repo-core-z-index-modal)',
    popover: 'var(--repo-core-z-index-popover)',
    toast: 'var(--repo-core-z-index-toast)',
    tooltip: 'var(--repo-core-z-index-tooltip)',
  },
} as const;
