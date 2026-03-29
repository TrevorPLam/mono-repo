import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { tokens, semanticColors } from '../styles/tokens';

export const buttonBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.spacing.xs,
  border: 'none',
  borderRadius: tokens.borderRadius.md,
  fontFamily: tokens.typography.fontFamily.body,
  fontWeight: tokens.typography.fontWeight.medium,
  lineHeight: tokens.typography.lineHeight.tight,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: `all ${tokens.transitions.fast}`,
  selectors: {
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    '&:focus-visible': {
      outline: `2px solid ${semanticColors.brand.primary}`,
      outlineOffset: '2px',
    },
  },
});

export const buttonVariants = recipe({
  base: buttonBase,
  variants: {
    size: {
      xs: {
        fontSize: tokens.typography.fontSize.xs,
        padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
        minHeight: '24px',
      },
      sm: {
        fontSize: tokens.typography.fontSize.sm,
        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
        minHeight: '32px',
      },
      md: {
        fontSize: tokens.typography.fontSize.md,
        padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
        minHeight: '40px',
      },
      lg: {
        fontSize: tokens.typography.fontSize.lg,
        padding: `${tokens.spacing.lg} ${tokens.spacing.xl}`,
        minHeight: '48px',
      },
      xl: {
        fontSize: tokens.typography.fontSize.xl,
        padding: `${tokens.spacing.xl} ${tokens.spacing['2xl']}`,
        minHeight: '56px',
      },
    },
    tone: {
      neutral: {
        backgroundColor: semanticColors.background.secondary,
        color: semanticColors.foreground.primary,
        '&:hover:not(:disabled)': {
          backgroundColor: semanticColors.background.muted,
        },
        '&:active:not(:disabled)': {
          backgroundColor: semanticColors.background.muted,
        },
      },
      primary: {
        backgroundColor: semanticColors.brand.primary,
        color: semanticColors.background.inverse,
        '&:hover:not(:disabled)': {
          backgroundColor: semanticColors.brand.secondary,
        },
        '&:active:not(:disabled)': {
          backgroundColor: semanticColors.brand.accent,
        },
      },
      secondary: {
        backgroundColor: 'transparent',
        color: semanticColors.brand.primary,
        border: `1px solid ${semanticColors.brand.primary}`,
        '&:hover:not(:disabled)': {
          backgroundColor: semanticColors.brand.primary,
          color: semanticColors.background.inverse,
        },
        '&:active:not(:disabled)': {
          backgroundColor: semanticColors.brand.secondary,
          color: semanticColors.background.inverse,
        },
      },
      accent: {
        backgroundColor: semanticColors.brand.accent,
        color: semanticColors.foreground.primary,
        '&:hover:not(:disabled)': {
          backgroundColor: semanticColors.brand.primary,
          color: semanticColors.background.inverse,
        },
        '&:active:not(:disabled)': {
          backgroundColor: semanticColors.brand.secondary,
          color: semanticColors.background.inverse,
        },
      },
      success: {
        backgroundColor: semanticColors.status.success,
        color: semanticColors.background.inverse,
        '&:hover:not(:disabled)': {
          backgroundColor: semanticColors.status.success,
          opacity: 0.9,
        },
        '&:active:not(:disabled)': {
          backgroundColor: semanticColors.status.success,
          opacity: 0.8,
        },
      },
      warning: {
        backgroundColor: semanticColors.status.warning,
        color: semanticColors.foreground.primary,
        '&:hover:not(:disabled)': {
          backgroundColor: semanticColors.status.warning,
          opacity: 0.9,
        },
        '&:active:not(:disabled)': {
          backgroundColor: semanticColors.status.warning,
          opacity: 0.8,
        },
      },
      error: {
        backgroundColor: semanticColors.status.error,
        color: semanticColors.background.inverse,
        '&:hover:not(:disabled)': {
          backgroundColor: semanticColors.status.error,
          opacity: 0.9,
        },
        '&:active:not(:disabled)': {
          backgroundColor: semanticColors.status.error,
          opacity: 0.8,
        },
      },
    },
    variant: {
      solid: {},
      outline: {
        backgroundColor: 'transparent',
        borderWidth: '1px',
        borderStyle: 'solid',
        '&:hover:not(:disabled)': {
          backgroundColor: tokens.colors.background.secondary,
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        '&:hover:not(:disabled)': {
          backgroundColor: tokens.colors.background.secondary,
        },
      },
      link: {
        backgroundColor: 'transparent',
        border: 'none',
        textDecoration: 'underline',
        textUnderlineOffset: '2px',
        '&:hover:not(:disabled)': {
          textDecoration: 'none',
        },
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        variant: 'outline',
        tone: 'neutral',
      },
      style: {
        borderColor: tokens.colors.border.primary,
        color: tokens.colors.foreground.primary,
        selectors: {
          '&:hover:not(:disabled)': {
            borderColor: tokens.colors.border.secondary,
          },
        },
      },
    },
    {
      variants: {
        variant: 'outline',
        tone: 'primary',
      },
      style: {
        borderColor: semanticColors.brand.accent,
        color: semanticColors.brand.accent,
        selectors: {
          '&:hover:not(:disabled)': {
            borderColor: semanticColors.brand.accent,
            color: semanticColors.brand.accent,
          },
        },
      },
    },
    {
      variants: {
        variant: 'outline',
        tone: 'success',
      },
      style: {
        borderColor: tokens.colors.status.success,
        color: tokens.colors.status.success,
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: tokens.colors.status.success,
            color: tokens.colors.background.inverse,
          },
        },
      },
    },
    {
      variants: {
        variant: 'outline',
        tone: 'warning',
      },
      style: {
        borderColor: tokens.colors.status.warning,
        color: tokens.colors.status.warning,
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: tokens.colors.status.warning,
            color: tokens.colors.foreground.primary,
          },
        },
      },
    },
    {
      variants: {
        variant: 'outline',
        tone: 'error',
      },
      style: {
        borderColor: tokens.colors.status.error,
        color: tokens.colors.status.error,
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: tokens.colors.status.warning,
            color: tokens.colors.background.inverse,
          },
        },
      },
    },
    {
      variants: {
        variant: 'ghost',
        tone: 'neutral',
      },
      style: {
        color: tokens.colors.foreground.primary,
      },
    },
    {
      variants: {
        variant: 'ghost',
        tone: 'primary',
      },
      style: {
        color: semanticColors.brand.accent,
      },
    },
    {
      variants: {
        variant: 'ghost',
        tone: 'success',
      },
      style: {
        color: tokens.colors.status.success,
      },
    },
    {
      variants: {
        variant: 'ghost',
        tone: 'warning',
      },
      style: {
        color: tokens.colors.status.warning,
      },
    },
    {
      variants: {
        variant: 'ghost',
        tone: 'error',
      },
      style: {
        color: tokens.colors.status.error,
      },
    },
    {
      variants: {
        variant: 'link',
        tone: 'neutral',
      },
      style: {
        color: tokens.colors.foreground.primary,
      },
    },
    {
      variants: {
        variant: 'link',
        tone: 'primary',
      },
      style: {
        color: semanticColors.brand.accent,
      },
    },
    {
      variants: {
        variant: 'link',
        tone: 'success',
      },
      style: {
        color: tokens.colors.status.success,
      },
    },
    {
      variants: {
        variant: 'link',
        tone: 'warning',
      },
      style: {
        color: tokens.colors.status.warning,
      },
    },
    {
      variants: {
        variant: 'link',
        tone: 'error',
      },
      style: {
        color: tokens.colors.status.error,
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    tone: 'neutral',
    variant: 'solid',
  },
});
