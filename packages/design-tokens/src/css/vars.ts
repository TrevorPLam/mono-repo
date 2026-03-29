/**
 * CSS Variables for Design Tokens
 * Vanilla Extract integration for type-safe CSS variables
 */

import { createVar } from '@vanilla-extract/css';

// Create CSS variables for tokens
export const vars = {
  colors: {
    foreground: {
      primary: createVar('color-foreground-primary'),
      secondary: createVar('color-foreground-secondary'),
      muted: createVar('color-foreground-muted'),
      accent: createVar('color-foreground-accent'),
      inverse: createVar('color-foreground-inverse'),
    },
    background: {
      primary: createVar('color-background-primary'),
      secondary: createVar('color-background-secondary'),
      muted: createVar('color-background-muted'),
      accent: createVar('color-background-accent'),
      inverse: createVar('color-background-inverse'),
    },
    border: {
      primary: createVar('color-border-primary'),
      secondary: createVar('color-border-secondary'),
      muted: createVar('color-border-muted'),
      accent: createVar('color-border-accent'),
      inverse: createVar('color-border-inverse'),
    },
    brand: {
      primary: createVar('color-brand-primary'),
      secondary: createVar('color-brand-secondary'),
      accent: createVar('color-brand-accent'),
    },
    status: {
      success: createVar('color-status-success'),
      warning: createVar('color-status-warning'),
      error: createVar('color-status-error'),
      info: createVar('color-status-info'),
    },
  },
  typography: {
    fontFamily: {
      body: createVar('font-family-body'),
      heading: createVar('font-family-heading'),
      mono: createVar('font-family-mono'),
    },
    fontSize: {
      xs: createVar('font-size-xs'),
      sm: createVar('font-size-sm'),
      md: createVar('font-size-md'),
      lg: createVar('font-size-lg'),
      xl: createVar('font-size-xl'),
      '2xl': createVar('font-size-2xl'),
      '3xl': createVar('font-size-3xl'),
      '4xl': createVar('font-size-4xl'),
      '5xl': createVar('font-size-5xl'),
    },
    fontWeight: {
      light: createVar('font-weight-light'),
      normal: createVar('font-weight-normal'),
      medium: createVar('font-weight-medium'),
      semibold: createVar('font-weight-semibold'),
      bold: createVar('font-weight-bold'),
    },
    lineHeight: {
      tight: createVar('line-height-tight'),
      normal: createVar('line-height-normal'),
      relaxed: createVar('line-height-relaxed'),
    },
    letterSpacing: {
      tight: createVar('letter-spacing-tight'),
      normal: createVar('letter-spacing-normal'),
      wide: createVar('letter-spacing-wide'),
    },
  },
  spacing: {
    xs: createVar('spacing-xs'),
    sm: createVar('spacing-sm'),
    md: createVar('spacing-md'),
    lg: createVar('spacing-lg'),
    xl: createVar('spacing-xl'),
    '2xl': createVar('spacing-2xl'),
    '3xl': createVar('spacing-3xl'),
    '4xl': createVar('spacing-4xl'),
    '5xl': createVar('spacing-5xl'),
    '6xl': createVar('spacing-6xl'),
  },
  sizing: {
    xs: createVar('size-xs'),
    sm: createVar('size-sm'),
    md: createVar('size-md'),
    lg: createVar('size-lg'),
    xl: createVar('size-xl'),
    '2xl': createVar('size-2xl'),
    '3xl': createVar('size-3xl'),
    '4xl': createVar('size-4xl'),
    '5xl': createVar('size-5xl'),
    '6xl': createVar('size-6xl'),
    full: createVar('size-full'),
    screen: createVar('size-screen'),
  },
  borderRadius: {
    none: createVar('border-radius-none'),
    sm: createVar('border-radius-sm'),
    md: createVar('border-radius-md'),
    lg: createVar('border-radius-lg'),
    xl: createVar('border-radius-xl'),
    '2xl': createVar('border-radius-2xl'),
    '3xl': createVar('border-radius-3xl'),
    full: createVar('border-radius-full'),
  },
  shadows: {
    xs: createVar('shadow-xs'),
    sm: createVar('shadow-sm'),
    md: createVar('shadow-md'),
    lg: createVar('shadow-lg'),
    xl: createVar('shadow-xl'),
    '2xl': createVar('shadow-2xl'),
    inner: createVar('shadow-inner'),
  },
  transitions: {
    fast: createVar('transition-fast'),
    normal: createVar('transition-normal'),
    slow: createVar('transition-slow'),
  },
  zIndex: {
    base: createVar('z-index-base'),
    above: createVar('z-index-above'),
    modal: createVar('z-index-modal'),
    tooltip: createVar('z-index-tooltip'),
    maximum: createVar('z-index-maximum'),
  },
} as const;
