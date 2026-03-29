import { z } from 'zod';
import type {
  ColorPrimitiveTokens,
  ColorSemanticTokens,
  TypographyPrimitiveTokens,
  TypographySemanticTokens,
  SpacingPrimitiveTokens,
  SpacingSemanticTokens,
  SizingPrimitiveTokens,
  SizingSemanticTokens,
  BorderRadiusPrimitiveTokens,
  BorderRadiusSemanticTokens,
  ShadowPrimitiveTokens,
  ShadowSemanticTokens,
  BreakpointTokens,
  MotionPrimitiveTokens,
  MotionSemanticTokens,
  DesignTokens,
  ThemeTokens,
  TextStyleToken,
  MotionToken
} from './types';

// =============================================================================
// UTILITY SCHEMAS
// =============================================================================

/**
 * Validates CSS color values (hex, rgb, rgba, hsl, hsla, named colors)
 */
export const ColorValueSchema = z.string().regex(
  /^(#([0-9a-fA-F]{3}){1,2}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)|hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)$/,
  {
    message: 'Invalid CSS color value. Must be hex, rgb, rgba, hsl, hsla, or named color.'
  }
);

/**
 * Validates CSS length values (px, rem, em, %, vw, vh, clamp(), etc.)
 */
export const LengthValueSchema = z.string().regex(
  /^(0|(\d+\.?\d*)(px|rem|em|%)|(\d+\.?\d*)(vw|vh|vmin|vmax)|(\d+\.?\d*)(ch|ex|cap|ic|lh|rlh)|clamp\(\s*[\d.]+(px|rem|em|vw|vh|%)\s*,\s*[\d.]+(px|rem|em|vw|vh|%)\s*,\s*[\d.]+(px|rem|em|vw|vh|%)\s*\)|-?\d+\.?\d*em)$/,
  {
    message: 'Invalid CSS length value. Must be a valid CSS length unit or clamp() function.'
  }
);

/**
 * Validates font family arrays (system fonts or web fonts)
 */
export const FontFamilySchema = z.array(z.string()).min(1, {
  message: 'Font family must have at least one font name.'
});

/**
 * Validates CSS shadow values
 */
export const ShadowValueSchema = z.string().min(1).regex(
  /^(none|inset\s+)?[\d\-\.\spxrememvhvw%(),\/rgbahslA-Z]+$/,
  {
    message: 'Invalid CSS shadow value. Must be a valid CSS box-shadow.'
  }
);

/**
 * Validates CSS timing function values
 */
export const TimingFunctionSchema = z.enum([
  'linear',
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'step-start',
  'step-end'
]).or(z.string().regex(/^cubic-bezier\(\s*-?[\d.]+\s*,\s*-?[\d.]+\s*,\s*-?[\d.]+\s*,\s*-?[\d.]+\s*\)$/, {
  message: 'Invalid CSS timing function. Must be a valid timing function.'
}));

/**
 * Validates CSS duration values
 */
export const DurationSchema = z.string().regex(/^\d+\.?\d*(s|ms)$/);

/**
 * Validates CSS font weight values
 */
export const FontWeightSchema = z.number().int().min(100).max(900);

/**
 * Validates CSS line height values
 */
export const LineHeightSchema = z.number().min(0).max(10);

/**
 * Validates CSS letter spacing values
 */
export const LetterSpacingSchema = LengthValueSchema;

// =============================================================================
// COLOR SCHEMAS
// =============================================================================

export const ColorScaleSchema = z.object({
  50: ColorValueSchema,
  100: ColorValueSchema,
  200: ColorValueSchema,
  300: ColorValueSchema,
  400: ColorValueSchema,
  500: ColorValueSchema,
  600: ColorValueSchema,
  700: ColorValueSchema,
  800: ColorValueSchema,
  900: ColorValueSchema,
  950: ColorValueSchema,
});

export const ColorPrimitiveTokensSchema = z.object({
  blue: ColorScaleSchema,
  gray: ColorScaleSchema,
  red: ColorScaleSchema,
  green: ColorScaleSchema,
  yellow: ColorScaleSchema,
  orange: ColorScaleSchema,
  purple: ColorScaleSchema,
  pink: ColorScaleSchema,
  white: ColorValueSchema,
  black: ColorValueSchema,
  transparent: z.literal('transparent'),
});

export const ColorSemanticTokensSchema = z.object({
  // Primary brand colors
  'color-primary': ColorValueSchema,
  'color-primary-hover': ColorValueSchema,
  'color-primary-active': ColorValueSchema,
  'color-primary-foreground': ColorValueSchema,
  
  // Secondary colors
  'color-secondary': ColorValueSchema,
  'color-secondary-hover': ColorValueSchema,
  'color-secondary-foreground': ColorValueSchema,
  
  // Accent colors
  'color-accent': ColorValueSchema,
  'color-accent-hover': ColorValueSchema,
  'color-accent-foreground': ColorValueSchema,
  
  // Background colors
  'color-background': ColorValueSchema,
  'color-background-secondary': ColorValueSchema,
  'color-background-tertiary': ColorValueSchema,
  'color-background-inverse': ColorValueSchema,
  
  // Surface colors
  'color-surface': ColorValueSchema,
  'color-surface-hover': ColorValueSchema,
  'color-surface-active': ColorValueSchema,
  'color-surface-inverse': ColorValueSchema,
  
  // Text colors
  'color-text-primary': ColorValueSchema,
  'color-text-secondary': ColorValueSchema,
  'color-text-tertiary': ColorValueSchema,
  'color-text-inverse': ColorValueSchema,
  'color-text-muted': ColorValueSchema,
  'color-text-disabled': ColorValueSchema,
  
  // Border colors
  'color-border': ColorValueSchema,
  'color-border-hover': ColorValueSchema,
  'color-border-active': ColorValueSchema,
  'color-border-inverse': ColorValueSchema,
  'color-border-muted': ColorValueSchema,
  
  // Status colors
  'color-success': ColorValueSchema,
  'color-success-hover': ColorValueSchema,
  'color-success-foreground': ColorValueSchema,
  'color-warning': ColorValueSchema,
  'color-warning-hover': ColorValueSchema,
  'color-warning-foreground': ColorValueSchema,
  'color-error': ColorValueSchema,
  'color-error-hover': ColorValueSchema,
  'color-error-foreground': ColorValueSchema,
  'color-info': ColorValueSchema,
  'color-info-hover': ColorValueSchema,
  'color-info-foreground': ColorValueSchema,
});

// =============================================================================
// TYPOGRAPHY SCHEMAS
// =============================================================================

export const TypographyPrimitiveTokensSchema = z.object({
  // Font families
  'font-family-sans': FontFamilySchema,
  'font-family-serif': FontFamilySchema,
  'font-family-mono': FontFamilySchema,
  'font-family-display': FontFamilySchema,
  
  // Font sizes
  'font-size-xs': LengthValueSchema,
  'font-size-sm': LengthValueSchema,
  'font-size-base': LengthValueSchema,
  'font-size-lg': LengthValueSchema,
  'font-size-xl': LengthValueSchema,
  'font-size-2xl': LengthValueSchema,
  'font-size-3xl': LengthValueSchema,
  'font-size-4xl': LengthValueSchema,
  'font-size-5xl': LengthValueSchema,
  'font-size-6xl': LengthValueSchema,
  
  // Font weights
  'font-weight-thin': FontWeightSchema,
  'font-weight-light': FontWeightSchema,
  'font-weight-normal': FontWeightSchema,
  'font-weight-medium': FontWeightSchema,
  'font-weight-semibold': FontWeightSchema,
  'font-weight-bold': FontWeightSchema,
  'font-weight-extrabold': FontWeightSchema,
  'font-weight-black': FontWeightSchema,
  
  // Line heights
  'line-height-none': LineHeightSchema,
  'line-height-tight': LineHeightSchema,
  'line-height-snug': LineHeightSchema,
  'line-height-normal': LineHeightSchema,
  'line-height-relaxed': LineHeightSchema,
  'line-height-loose': LineHeightSchema,
  
  // Letter spacing
  'letter-spacing-tighter': LetterSpacingSchema,
  'letter-spacing-tight': LetterSpacingSchema,
  'letter-spacing-normal': LetterSpacingSchema,
  'letter-spacing-wide': LetterSpacingSchema,
  'letter-spacing-wider': LetterSpacingSchema,
  'letter-spacing-widest': LetterSpacingSchema,
});

export const TextStyleTokenSchema = z.object({
  'font-family': z.string(),
  'font-size': LengthValueSchema,
  'font-weight': FontWeightSchema,
  'line-height': LineHeightSchema,
  'letter-spacing': LetterSpacingSchema,
});

export const TypographySemanticTokensSchema = z.object({
  'text-body-large': TextStyleTokenSchema,
  'text-body-medium': TextStyleTokenSchema,
  'text-body-small': TextStyleTokenSchema,
  'text-heading-1': TextStyleTokenSchema,
  'text-heading-2': TextStyleTokenSchema,
  'text-heading-3': TextStyleTokenSchema,
  'text-heading-4': TextStyleTokenSchema,
  'text-heading-5': TextStyleTokenSchema,
  'text-heading-6': TextStyleTokenSchema,
  'text-caption': TextStyleTokenSchema,
  'text-overline': TextStyleTokenSchema,
  'text-label': TextStyleTokenSchema,
  'text-code': TextStyleTokenSchema,
  'text-quote': TextStyleTokenSchema,
});

// =============================================================================
// SPACING SCHEMAS
// =============================================================================

export const SpacingPrimitiveTokensSchema = z.object({
  'space-0': LengthValueSchema,
  'space-px': LengthValueSchema,
  'space-0_5': LengthValueSchema,
  'space-1': LengthValueSchema,
  'space-1_5': LengthValueSchema,
  'space-2': LengthValueSchema,
  'space-2_5': LengthValueSchema,
  'space-3': LengthValueSchema,
  'space-3_5': LengthValueSchema,
  'space-4': LengthValueSchema,
  'space-5': LengthValueSchema,
  'space-6': LengthValueSchema,
  'space-7': LengthValueSchema,
  'space-8': LengthValueSchema,
  'space-9': LengthValueSchema,
  'space-10': LengthValueSchema,
  'space-11': LengthValueSchema,
  'space-12': LengthValueSchema,
  'space-14': LengthValueSchema,
  'space-16': LengthValueSchema,
  'space-20': LengthValueSchema,
  'space-24': LengthValueSchema,
  'space-28': LengthValueSchema,
  'space-32': LengthValueSchema,
  'space-36': LengthValueSchema,
  'space-40': LengthValueSchema,
  'space-44': LengthValueSchema,
  'space-48': LengthValueSchema,
  'space-52': LengthValueSchema,
  'space-56': LengthValueSchema,
  'space-60': LengthValueSchema,
  'space-64': LengthValueSchema,
  'space-72': LengthValueSchema,
  'space-80': LengthValueSchema,
  'space-96': LengthValueSchema,
});

export const SpacingSemanticTokensSchema = z.object({
  'space-component-padding-x': LengthValueSchema,
  'space-component-padding-y': LengthValueSchema,
  'space-component-margin-x': LengthValueSchema,
  'space-component-margin-y': LengthValueSchema,
  'space-section-padding-x': LengthValueSchema,
  'space-section-padding-y': LengthValueSchema,
  'space-container-padding-x': LengthValueSchema,
  'space-container-padding-y': LengthValueSchema,
  'space-gap': LengthValueSchema,
  'space-gap-sm': LengthValueSchema,
  'space-gap-lg': LengthValueSchema,
});

// =============================================================================
// SIZING SCHEMAS
// =============================================================================

export const SizingPrimitiveTokensSchema = z.object({
  // Component sizing
  'size-0': LengthValueSchema,
  'size-1': LengthValueSchema,
  'size-2': LengthValueSchema,
  'size-3': LengthValueSchema,
  'size-4': LengthValueSchema,
  'size-5': LengthValueSchema,
  'size-6': LengthValueSchema,
  'size-7': LengthValueSchema,
  'size-8': LengthValueSchema,
  'size-9': LengthValueSchema,
  'size-10': LengthValueSchema,
  'size-11': LengthValueSchema,
  'size-12': LengthValueSchema,
  'size-14': LengthValueSchema,
  'size-16': LengthValueSchema,
  'size-20': LengthValueSchema,
  'size-24': LengthValueSchema,
  'size-28': LengthValueSchema,
  'size-32': LengthValueSchema,
  'size-36': LengthValueSchema,
  'size-40': LengthValueSchema,
  'size-44': LengthValueSchema,
  'size-48': LengthValueSchema,
  'size-52': LengthValueSchema,
  'size-56': LengthValueSchema,
  'size-60': LengthValueSchema,
  'size-64': LengthValueSchema,
  'size-72': LengthValueSchema,
  'size-80': LengthValueSchema,
  'size-96': LengthValueSchema,
  
  // Icon sizing
  'size-icon-xs': LengthValueSchema,
  'size-icon-sm': LengthValueSchema,
  'size-icon-md': LengthValueSchema,
  'size-icon-lg': LengthValueSchema,
  'size-icon-xl': LengthValueSchema,
  
  // Container sizing
  'size-container-sm': LengthValueSchema,
  'size-container-md': LengthValueSchema,
  'size-container-lg': LengthValueSchema,
  'size-container-xl': LengthValueSchema,
  'size-container-full': LengthValueSchema,
});

export const SizingSemanticTokensSchema = z.object({
  'size-button-height': LengthValueSchema,
  'size-button-height-sm': LengthValueSchema,
  'size-button-height-lg': LengthValueSchema,
  'size-input-height': LengthValueSchema,
  'size-input-height-sm': LengthValueSchema,
  'size-input-height-lg': LengthValueSchema,
  'size-avatar-sm': LengthValueSchema,
  'size-avatar-md': LengthValueSchema,
  'size-avatar-lg': LengthValueSchema,
  'size-avatar-xl': LengthValueSchema,
});

// =============================================================================
// BORDER RADIUS SCHEMAS
// =============================================================================

export const BorderRadiusPrimitiveTokensSchema = z.object({
  'radius-none': LengthValueSchema,
  'radius-sm': LengthValueSchema,
  'radius-base': LengthValueSchema,
  'radius-md': LengthValueSchema,
  'radius-lg': LengthValueSchema,
  'radius-xl': LengthValueSchema,
  'radius-2xl': LengthValueSchema,
  'radius-3xl': LengthValueSchema,
  'radius-full': LengthValueSchema,
});

export const BorderRadiusSemanticTokensSchema = z.object({
  'radius-button': LengthValueSchema,
  'radius-input': LengthValueSchema,
  'radius-card': LengthValueSchema,
  'radius-modal': LengthValueSchema,
  'radius-badge': LengthValueSchema,
  'radius-avatar': LengthValueSchema,
});

// =============================================================================
// SHADOW SCHEMAS
// =============================================================================

export const ShadowPrimitiveTokensSchema = z.object({
  'shadow-sm': ShadowValueSchema,
  'shadow-base': ShadowValueSchema,
  'shadow-md': ShadowValueSchema,
  'shadow-lg': ShadowValueSchema,
  'shadow-xl': ShadowValueSchema,
  'shadow-2xl': ShadowValueSchema,
  'shadow-inner': ShadowValueSchema,
  'shadow-none': z.literal('none'),
});

export const ShadowSemanticTokensSchema = z.object({
  'shadow-button': ShadowValueSchema,
  'shadow-button-hover': ShadowValueSchema,
  'shadow-card': ShadowValueSchema,
  'shadow-card-hover': ShadowValueSchema,
  'shadow-modal': ShadowValueSchema,
  'shadow-dropdown': ShadowValueSchema,
  'shadow-tooltip': ShadowValueSchema,
});

// =============================================================================
// BREAKPOINT SCHEMAS
// =============================================================================

export const BreakpointTokensSchema = z.object({
  'breakpoint-xs': LengthValueSchema,
  'breakpoint-sm': LengthValueSchema,
  'breakpoint-md': LengthValueSchema,
  'breakpoint-lg': LengthValueSchema,
  'breakpoint-xl': LengthValueSchema,
  'breakpoint-2xl': LengthValueSchema,
});

// =============================================================================
// MOTION SCHEMAS
// =============================================================================

export const MotionPrimitiveTokensSchema = z.object({
  // Durations
  'duration-75': DurationSchema,
  'duration-100': DurationSchema,
  'duration-150': DurationSchema,
  'duration-200': DurationSchema,
  'duration-300': DurationSchema,
  'duration-500': DurationSchema,
  'duration-700': DurationSchema,
  'duration-1000': DurationSchema,
  
  // Timing functions
  'ease-linear': TimingFunctionSchema,
  'ease-in': TimingFunctionSchema,
  'ease-out': TimingFunctionSchema,
  'ease-in-out': TimingFunctionSchema,
  'ease-bounce': TimingFunctionSchema,
});

export const MotionTokenSchema = z.object({
  duration: DurationSchema,
  'ease-function': TimingFunctionSchema,
});

export const MotionSemanticTokensSchema = z.object({
  'motion-button': MotionTokenSchema,
  'motion-button-hover': MotionTokenSchema,
  'motion-modal': MotionTokenSchema,
  'motion-dropdown': MotionTokenSchema,
  'motion-tooltip': MotionTokenSchema,
  'motion-page-transition': MotionTokenSchema,
});

// =============================================================================
// COMPOSITE SCHEMAS
// =============================================================================

export const PrimitiveTokensSchema = z.object({
  colors: ColorPrimitiveTokensSchema,
  typography: TypographyPrimitiveTokensSchema,
  spacing: SpacingPrimitiveTokensSchema,
  sizing: SizingPrimitiveTokensSchema,
  borderRadius: BorderRadiusPrimitiveTokensSchema,
  shadows: ShadowPrimitiveTokensSchema,
  breakpoints: BreakpointTokensSchema,
  motion: MotionPrimitiveTokensSchema,
});

export const SemanticTokensSchema = z.object({
  colors: ColorSemanticTokensSchema,
  typography: TypographySemanticTokensSchema,
  spacing: SpacingSemanticTokensSchema,
  sizing: SizingSemanticTokensSchema,
  borderRadius: BorderRadiusSemanticTokensSchema,
  shadows: ShadowSemanticTokensSchema,
  motion: MotionSemanticTokensSchema,
});

export const DesignTokensSchema = z.object({
  primitive: PrimitiveTokensSchema,
  semantic: SemanticTokensSchema,
});

export const ThemeTokensSchema = z.object({
  name: z.string().min(1, 'Theme name is required'),
  displayName: z.string().min(1, 'Theme display name is required'),
  description: z.string().optional().nullable(),
  tokens: DesignTokensSchema,
  extends: z.array(z.string()).optional().nullable(),
});

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validates primitive tokens
 */
export function validatePrimitiveTokens(tokens: unknown): ColorPrimitiveTokens {
  return ColorPrimitiveTokensSchema.parse(tokens);
}

/**
 * Validates semantic tokens
 */
export function validateSemanticTokens(tokens: unknown): ColorSemanticTokens {
  return ColorSemanticTokensSchema.parse(tokens);
}

/**
 * Validates complete design tokens
 */
export function validateDesignTokens(tokens: unknown): DesignTokens {
  return DesignTokensSchema.parse(tokens);
}

/**
 * Validates theme tokens
 */
export function validateThemeTokens(theme: unknown): ThemeTokens {
  const result = ThemeTokensSchema.parse(theme);
  return result as ThemeTokens;
}

/**
 * Validates color contrast for accessibility (WCAG 2.1 AA)
 * This is a simplified version - in production, you'd use a proper color contrast library
 */
export function validateColorContrast(foreground: string, background: string): boolean {
  // This is a placeholder implementation
  // In a real implementation, you'd use a library like 'color-contrast'
  // to calculate the actual contrast ratio and ensure it meets WCAG standards
  return true; // Placeholder
}

// Export types for inference
export type ColorPrimitiveTokensType = z.infer<typeof ColorPrimitiveTokensSchema>;
export type ColorSemanticTokensType = z.infer<typeof ColorSemanticTokensSchema>;
export type DesignTokensType = z.infer<typeof DesignTokensSchema>;
export type ThemeTokensType = z.infer<typeof ThemeTokensSchema>;
