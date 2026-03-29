import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { tokens, semanticColors } from '../styles/tokens';

export const inputBase = style({
  display: 'block',
  width: '100%',
  fontFamily: tokens.typography.fontFamily.body,
  fontSize: tokens.typography.fontSize.md,
  lineHeight: tokens.typography.lineHeight.normal,
  color: tokens.colors.foreground.primary,
  backgroundColor: tokens.colors.background.primary,
  border: `1px solid ${tokens.colors.border.primary}`,
  borderRadius: tokens.borderRadius.md,
  transition: `all ${tokens.transitions.fast}`,
  selectors: {
    '&::placeholder': {
      color: tokens.colors.foreground.muted,
    },
    '&:disabled': {
      backgroundColor: tokens.colors.background.secondary,
      color: tokens.colors.foreground.muted,
      cursor: 'not-allowed',
      opacity: 0.7,
    },
    '&:focus-visible': {
      outline: 'none',
      borderColor: semanticColors.brand.accent,
      boxShadow: `0 0 0 2px ${semanticColors.brand.accent}20`,
    },
    '&:invalid:not(:focus)': {
      borderColor: tokens.colors.status.error,
    },
  },
});

export const inputVariants = recipe({
  base: inputBase,
  variants: {
    size: {
      xs: {
        padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
        minHeight: '24px',
        fontSize: tokens.typography.fontSize.xs,
      },
      sm: {
        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
        minHeight: '32px',
        fontSize: tokens.typography.fontSize.sm,
      },
      md: {
        padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
        minHeight: '40px',
        fontSize: tokens.typography.fontSize.md,
      },
      lg: {
        padding: `${tokens.spacing.lg} ${tokens.spacing.xl}`,
        minHeight: '48px',
        fontSize: tokens.typography.fontSize.lg,
      },
      xl: {
        padding: `${tokens.spacing.xl} ${tokens.spacing['2xl']}`,
        minHeight: '56px',
        fontSize: tokens.typography.fontSize.xl,
      },
    },
    tone: {
      neutral: {},
      primary: {
        selectors: {
          '&:focus-visible': {
            borderColor: semanticColors.brand.accent,
            boxShadow: `0 0 0 2px ${semanticColors.brand.accent}20`,
          },
        },
      },
      success: {
        selectors: {
          '&:focus-visible': {
            borderColor: tokens.colors.status.success,
            boxShadow: `0 0 0 2px ${tokens.colors.status.success}20`,
          },
        },
      },
      warning: {
        selectors: {
          '&:focus-visible': {
            borderColor: tokens.colors.status.warning,
            boxShadow: `0 0 0 2px ${tokens.colors.status.warning}20`,
          },
        },
      },
      error: {
        selectors: {
          '&:focus-visible': {
            borderColor: tokens.colors.status.error,
            boxShadow: `0 0 0 2px ${tokens.colors.status.error}20`,
          },
        },
      },
    },
    state: {
      default: {},
      error: {
        borderColor: tokens.colors.status.error,
        selectors: {
          '&:focus-visible': {
            borderColor: tokens.colors.status.error,
            boxShadow: `0 0 0 2px ${tokens.colors.status.error}20`,
          },
        },
      },
      success: {
        borderColor: tokens.colors.status.success,
        selectors: {
          '&:focus-visible': {
            borderColor: tokens.colors.status.success,
            boxShadow: `0 0 0 2px ${tokens.colors.status.success}20`,
          },
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'neutral',
    state: 'default',
  },
});
