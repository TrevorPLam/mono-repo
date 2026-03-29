import { vars } from '@repo/design-tokens/css';

// Re-export design tokens as the single source of truth
export const tokens = vars;

// Token categories for easy access
export const colors = tokens.colors;
export const typography = tokens.typography;
export const spacing = tokens.spacing;
export const sizing = tokens.sizing;
export const borderRadius = tokens.borderRadius;
export const shadows = tokens.shadows;
export const transitions = tokens.transitions;
export const zIndex = tokens.zIndex;

// Semantic token mappings
export const semanticColors = {
  background: {
    primary: colors.background.primary,
    secondary: colors.background.secondary,
    muted: colors.background.muted,
    accent: colors.background.accent,
    inverse: colors.background.inverse,
  },
  foreground: {
    primary: colors.foreground.primary,
    secondary: colors.foreground.secondary,
    muted: colors.foreground.muted,
    accent: colors.foreground.accent,
    inverse: colors.foreground.inverse,
  },
  border: {
    primary: colors.border.primary,
    secondary: colors.border.secondary,
    muted: colors.border.muted,
    accent: colors.border.accent,
    inverse: colors.border.inverse,
  },
  brand: {
    primary: colors.brand.primary,
    secondary: colors.brand.secondary,
    accent: colors.brand.accent,
  },
  status: {
    success: colors.status.success,
    warning: colors.status.warning,
    error: colors.status.error,
    info: colors.status.info,
  },
};
