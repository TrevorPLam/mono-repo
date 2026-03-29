import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { tokens, semanticColors } from '../styles/tokens';

export const textBase = style({
  fontFamily: tokens.typography.fontFamily.body,
  color: semanticColors.foreground.primary,
  margin: 0,
  wordWrap: 'break-word',
});

export const textVariants = recipe({
  base: textBase,
  variants: {
    size: {
      xs: {
        fontSize: tokens.typography.fontSize.xs,
        lineHeight: tokens.typography.lineHeight.tight,
      },
      sm: {
        fontSize: tokens.typography.fontSize.sm,
        lineHeight: tokens.typography.lineHeight.tight,
      },
      md: {
        fontSize: tokens.typography.fontSize.md,
        lineHeight: tokens.typography.lineHeight.normal,
      },
      lg: {
        fontSize: tokens.typography.fontSize.lg,
        lineHeight: tokens.typography.lineHeight.relaxed,
      },
      xl: {
        fontSize: tokens.typography.fontSize.xl,
        lineHeight: tokens.typography.lineHeight.relaxed,
      },
    },
    tone: {
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
    },
    weight: {
      light: {
        fontWeight: tokens.typography.fontWeight.light,
      },
      normal: {
        fontWeight: tokens.typography.fontWeight.normal,
      },
      medium: {
        fontWeight: tokens.typography.fontWeight.medium,
      },
      semibold: {
        fontWeight: tokens.typography.fontWeight.semibold,
      },
      bold: {
        fontWeight: tokens.typography.fontWeight.bold,
      },
    },
    align: {
      left: {
        textAlign: 'left',
      },
      center: {
        textAlign: 'center',
      },
      right: {
        textAlign: 'right',
      },
      justify: {
        textAlign: 'justify',
      },
    },
    decoration: {
      none: {
        textDecoration: 'none',
      },
      underline: {
        textDecoration: 'underline',
        textUnderlineOffset: '2px',
      },
      overline: {
        textDecoration: 'overline',
        textUnderlineOffset: '2px',
      },
      'line-through': {
        textDecoration: 'line-through',
      },
    },
    transform: {
      none: {
        textTransform: 'none',
      },
      uppercase: {
        textTransform: 'uppercase',
      },
      lowercase: {
        textTransform: 'lowercase',
      },
      capitalize: {
        textTransform: 'capitalize',
      },
    },
    leading: {
      none: {
        lineHeight: 1,
      },
      tight: {
        lineHeight: tokens.typography.lineHeight.tight,
      },
      normal: {
        lineHeight: tokens.typography.lineHeight.normal,
      },
      relaxed: {
        lineHeight: tokens.typography.lineHeight.relaxed,
      },
      loose: {
        lineHeight: 2,
      },
    },
    tracking: {
      tight: {
        letterSpacing: '-0.025em',
      },
      normal: {
        letterSpacing: '0em',
      },
      wide: {
        letterSpacing: '0.025em',
      },
      wider: {
        letterSpacing: '0.05em',
      },
      widest: {
        letterSpacing: '0.1em',
      },
    },
    truncate: {
      true: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
    italic: {
      true: {
        fontStyle: 'italic',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'neutral',
    weight: 'normal',
    align: 'left',
    decoration: 'none',
    transform: 'none',
    leading: 'normal',
    tracking: 'normal',
    truncate: false,
    italic: false,
  },
});
