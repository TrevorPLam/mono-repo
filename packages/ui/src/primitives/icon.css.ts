import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { tokens, semanticColors } from '../styles/tokens';

export const iconBase = style({
  display: 'inline-block',
  verticalAlign: 'middle',
  flexShrink: 0,
  shapeRendering: 'geometricPrecision',
});

export const iconVariants = recipe({
  base: iconBase,
  variants: {
    size: {
      xs: {
        width: tokens.sizing.xs,
        height: tokens.sizing.xs,
      },
      sm: {
        width: tokens.sizing.sm,
        height: tokens.sizing.sm,
      },
      md: {
        width: tokens.sizing.md,
        height: tokens.sizing.md,
      },
      lg: {
        width: tokens.sizing.lg,
        height: tokens.sizing.lg,
      },
      xl: {
        width: tokens.sizing.xl,
        height: tokens.sizing.xl,
      },
      '2xl': {
        width: tokens.sizing['2xl'],
        height: tokens.sizing['2xl'],
      },
      '3xl': {
        width: tokens.sizing['3xl'],
        height: tokens.sizing['3xl'],
      },
      '4xl': {
        width: tokens.sizing['4xl'],
        height: tokens.sizing['4xl'],
      },
      '5xl': {
        width: tokens.sizing['5xl'],
        height: tokens.sizing['5xl'],
      },
    },
    color: {
      neutral: {
        color: semanticColors.foreground.primary,
      },
      primary: {
        color: semanticColors.brand.primary,
      },
      secondary: {
        color: semanticColors.foreground.secondary,
      },
      accent: {
        color: semanticColors.brand.accent,
      },
      success: {
        color: semanticColors.status.success,
      },
      warning: {
        color: semanticColors.status.warning,
      },
      error: {
        color: semanticColors.status.error,
      },
      inherit: {
        color: 'inherit',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'neutral',
  },
});
