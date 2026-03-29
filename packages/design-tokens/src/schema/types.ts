/**
 * Design token type definitions for the marketing firm design system
 * Following three-layer architecture: primitive → semantic → component
 */

// =============================================================================
// COLOR TOKENS
// =============================================================================

export interface ColorPrimitiveTokens {
  // Base color palette - brand agnostic
  blue: ColorScale;
  gray: ColorScale;
  red: ColorScale;
  green: ColorScale;
  yellow: ColorScale;
  orange: ColorScale;
  purple: ColorScale;
  pink: ColorScale;
  
  // Neutral colors for UI elements
  white: string;
  black: string;
  transparent: string;
}

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface ColorSemanticTokens {
  // Primary brand colors
  'color-primary': string;
  'color-primary-hover': string;
  'color-primary-active': string;
  'color-primary-foreground': string;
  
  // Secondary colors
  'color-secondary': string;
  'color-secondary-hover': string;
  'color-secondary-foreground': string;
  
  // Accent colors
  'color-accent': string;
  'color-accent-hover': string;
  'color-accent-foreground': string;
  
  // Background colors
  'color-background': string;
  'color-background-secondary': string;
  'color-background-tertiary': string;
  'color-background-inverse': string;
  
  // Surface colors
  'color-surface': string;
  'color-surface-hover': string;
  'color-surface-active': string;
  'color-surface-inverse': string;
  
  // Text colors
  'color-text-primary': string;
  'color-text-secondary': string;
  'color-text-tertiary': string;
  'color-text-inverse': string;
  'color-text-muted': string;
  'color-text-disabled': string;
  
  // Border colors
  'color-border': string;
  'color-border-hover': string;
  'color-border-active': string;
  'color-border-inverse': string;
  'color-border-muted': string;
  
  // Status colors
  'color-success': string;
  'color-success-hover': string;
  'color-success-foreground': string;
  'color-warning': string;
  'color-warning-hover': string;
  'color-warning-foreground': string;
  'color-error': string;
  'color-error-hover': string;
  'color-error-foreground': string;
  'color-info': string;
  'color-info-hover': string;
  'color-info-foreground': string;
}

// =============================================================================
// TYPOGRAPHY TOKENS
// =============================================================================

export interface TypographyPrimitiveTokens {
  // Font families
  'font-family-sans': string[];
  'font-family-serif': string[];
  'font-family-mono': string[];
  'font-family-display': string[];
  
  // Font sizes - mobile-first responsive scale
  'font-size-xs': string;
  'font-size-sm': string;
  'font-size-base': string;
  'font-size-lg': string;
  'font-size-xl': string;
  'font-size-2xl': string;
  'font-size-3xl': string;
  'font-size-4xl': string;
  'font-size-5xl': string;
  'font-size-6xl': string;
  
  // Font weights
  'font-weight-thin': number;
  'font-weight-light': number;
  'font-weight-normal': number;
  'font-weight-medium': number;
  'font-weight-semibold': number;
  'font-weight-bold': number;
  'font-weight-extrabold': number;
  'font-weight-black': number;
  
  // Line heights
  'line-height-none': number;
  'line-height-tight': number;
  'line-height-snug': number;
  'line-height-normal': number;
  'line-height-relaxed': number;
  'line-height-loose': number;
  
  // Letter spacing
  'letter-spacing-tighter': string;
  'letter-spacing-tight': string;
  'letter-spacing-normal': string;
  'letter-spacing-wide': string;
  'letter-spacing-wider': string;
  'letter-spacing-widest': string;
}

export interface TypographySemanticTokens {
  // Text styles for specific use cases
  'text-body-large': TextStyleToken;
  'text-body-medium': TextStyleToken;
  'text-body-small': TextStyleToken;
  'text-heading-1': TextStyleToken;
  'text-heading-2': TextStyleToken;
  'text-heading-3': TextStyleToken;
  'text-heading-4': TextStyleToken;
  'text-heading-5': TextStyleToken;
  'text-heading-6': TextStyleToken;
  'text-caption': TextStyleToken;
  'text-overline': TextStyleToken;
  'text-label': TextStyleToken;
  'text-code': TextStyleToken;
  'text-quote': TextStyleToken;
}

export interface TextStyleToken {
  'font-family': string;
  'font-size': string;
  'font-weight': number;
  'line-height': number;
  'letter-spacing': string;
}

// =============================================================================
// SPACING TOKENS
// =============================================================================

export interface SpacingPrimitiveTokens {
  // 4px base scale system
  'space-0': string;
  'space-px': string;
  'space-0_5': string;
  'space-1': string;
  'space-1_5': string;
  'space-2': string;
  'space-2_5': string;
  'space-3': string;
  'space-3_5': string;
  'space-4': string;
  'space-5': string;
  'space-6': string;
  'space-7': string;
  'space-8': string;
  'space-9': string;
  'space-10': string;
  'space-11': string;
  'space-12': string;
  'space-14': string;
  'space-16': string;
  'space-20': string;
  'space-24': string;
  'space-28': string;
  'space-32': string;
  'space-36': string;
  'space-40': string;
  'space-44': string;
  'space-48': string;
  'space-52': string;
  'space-56': string;
  'space-60': string;
  'space-64': string;
  'space-72': string;
  'space-80': string;
  'space-96': string;
}

export interface SpacingSemanticTokens {
  // Component-specific spacing
  'space-component-padding-x': string;
  'space-component-padding-y': string;
  'space-component-margin-x': string;
  'space-component-margin-y': string;
  'space-section-padding-x': string;
  'space-section-padding-y': string;
  'space-container-padding-x': string;
  'space-container-padding-y': string;
  'space-gap': string;
  'space-gap-sm': string;
  'space-gap-lg': string;
}

// =============================================================================
// SIZING TOKENS
// =============================================================================

export interface SizingPrimitiveTokens {
  // Component sizing
  'size-0': string;
  'size-1': string;
  'size-2': string;
  'size-3': string;
  'size-4': string;
  'size-5': string;
  'size-6': string;
  'size-7': string;
  'size-8': string;
  'size-9': string;
  'size-10': string;
  'size-11': string;
  'size-12': string;
  'size-14': string;
  'size-16': string;
  'size-20': string;
  'size-24': string;
  'size-28': string;
  'size-32': string;
  'size-36': string;
  'size-40': string;
  'size-44': string;
  'size-48': string;
  'size-52': string;
  'size-56': string;
  'size-60': string;
  'size-64': string;
  'size-72': string;
  'size-80': string;
  'size-96': string;
  
  // Icon sizing
  'size-icon-xs': string;
  'size-icon-sm': string;
  'size-icon-md': string;
  'size-icon-lg': string;
  'size-icon-xl': string;
  
  // Container sizing
  'size-container-sm': string;
  'size-container-md': string;
  'size-container-lg': string;
  'size-container-xl': string;
  'size-container-full': string;
}

export interface SizingSemanticTokens {
  // Component-specific sizing
  'size-button-height': string;
  'size-button-height-sm': string;
  'size-button-height-lg': string;
  'size-input-height': string;
  'size-input-height-sm': string;
  'size-input-height-lg': string;
  'size-avatar-sm': string;
  'size-avatar-md': string;
  'size-avatar-lg': string;
  'size-avatar-xl': string;
}

// =============================================================================
// BORDER RADIUS TOKENS
// =============================================================================

export interface BorderRadiusPrimitiveTokens {
  'radius-none': string;
  'radius-sm': string;
  'radius-base': string;
  'radius-md': string;
  'radius-lg': string;
  'radius-xl': string;
  'radius-2xl': string;
  'radius-3xl': string;
  'radius-full': string;
}

export interface BorderRadiusSemanticTokens {
  'radius-button': string;
  'radius-input': string;
  'radius-card': string;
  'radius-modal': string;
  'radius-badge': string;
  'radius-avatar': string;
}

// =============================================================================
// SHADOW TOKENS
// =============================================================================

export interface ShadowPrimitiveTokens {
  'shadow-sm': string;
  'shadow-base': string;
  'shadow-md': string;
  'shadow-lg': string;
  'shadow-xl': string;
  'shadow-2xl': string;
  'shadow-inner': string;
  'shadow-none': string;
}

export interface ShadowSemanticTokens {
  'shadow-button': string;
  'shadow-button-hover': string;
  'shadow-card': string;
  'shadow-card-hover': string;
  'shadow-modal': string;
  'shadow-dropdown': string;
  'shadow-tooltip': string;
}

// =============================================================================
// BREAKPOINT TOKENS
// =============================================================================

export interface BreakpointTokens {
  'breakpoint-xs': string;
  'breakpoint-sm': string;
  'breakpoint-md': string;
  'breakpoint-lg': string;
  'breakpoint-xl': string;
  'breakpoint-2xl': string;
}

// =============================================================================
// MOTION TOKENS
// =============================================================================

export interface MotionPrimitiveTokens {
  'duration-75': string;
  'duration-100': string;
  'duration-150': string;
  'duration-200': string;
  'duration-300': string;
  'duration-500': string;
  'duration-700': string;
  'duration-1000': string;
  
  'ease-linear': string;
  'ease-in': string;
  'ease-out': string;
  'ease-in-out': string;
  'ease-bounce': string;
}

export interface MotionSemanticTokens {
  'motion-button': MotionToken;
  'motion-button-hover': MotionToken;
  'motion-modal': MotionToken;
  'motion-dropdown': MotionToken;
  'motion-tooltip': MotionToken;
  'motion-page-transition': MotionToken;
}

export interface MotionToken {
  duration: string;
  'ease-function': string;
}

// =============================================================================
// COMPOSITE TOKEN INTERFACES
// =============================================================================

export interface PrimitiveTokens {
  colors: ColorPrimitiveTokens;
  typography: TypographyPrimitiveTokens;
  spacing: SpacingPrimitiveTokens;
  sizing: SizingPrimitiveTokens;
  borderRadius: BorderRadiusPrimitiveTokens;
  shadows: ShadowPrimitiveTokens;
  breakpoints: BreakpointTokens;
  motion: MotionPrimitiveTokens;
}

export interface SemanticTokens {
  colors: ColorSemanticTokens;
  typography: TypographySemanticTokens;
  spacing: SpacingSemanticTokens;
  sizing: SizingSemanticTokens;
  borderRadius: BorderRadiusSemanticTokens;
  shadows: ShadowSemanticTokens;
  motion: MotionSemanticTokens;
}

export interface DesignTokens {
  primitive: PrimitiveTokens;
  semantic: SemanticTokens;
}

export interface ThemeTokens {
  name: string;
  displayName: string;
  description?: string | null;
  tokens: DesignTokens;
  extends?: string[] | null; // Allow theme inheritance
}
