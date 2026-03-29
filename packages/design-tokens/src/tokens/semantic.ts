/**
 * Semantic tokens for the design system
 * Maps primitive tokens to meaningful semantic names
 * Provides context and usage guidance for consistent application
 */

import type {
  ColorSemanticTokens,
  TypographySemanticTokens,
  SpacingSemanticTokens,
  SizingSemanticTokens,
  BorderRadiusSemanticTokens,
  ShadowSemanticTokens,
  MotionSemanticTokens,
} from '../schema/types';

export const semanticColors: ColorSemanticTokens = {
  // Primary brand colors - Using blue as primary
  'color-primary': '#3b82f6',           // blue-500
  'color-primary-hover': '#2563eb',       // blue-600
  'color-primary-active': '#1d4ed8',      // blue-700
  'color-primary-foreground': '#ffffff',    // white (for contrast)

  // Secondary colors - Using gray as secondary
  'color-secondary': '#6b7280',          // gray-500
  'color-secondary-hover': '#4b5563',      // gray-600
  'color-secondary-foreground': '#ffffff',  // white

  // Accent colors - Using purple for special elements
  'color-accent': '#a855f7',             // purple-500
  'color-accent-hover': '#9333ea',       // purple-600
  'color-accent-foreground': '#ffffff',    // white

  // Background colors
  'color-background': '#ffffff',            // white
  'color-background-secondary': '#f9fafb',   // gray-50
  'color-background-tertiary': '#f3f4f6',  // gray-100
  'color-background-inverse': '#111827',     // gray-900

  // Surface colors - For cards, panels, etc.
  'color-surface': '#ffffff',               // white
  'color-surface-hover': '#f9fafb',        // gray-50
  'color-surface-active': '#f3f4f6',      // gray-100
  'color-surface-inverse': '#374151',       // gray-700

  // Text colors - Optimized for readability
  'color-text-primary': '#111827',          // gray-900
  'color-text-secondary': '#6b7280',       // gray-500
  'color-text-tertiary': '#9ca3af',       // gray-400
  'color-text-inverse': '#ffffff',          // white
  'color-text-muted': '#9ca3af',          // gray-400
  'color-text-disabled': '#d1d5db',       // gray-300

  // Border colors
  'color-border': '#e5e7eb',              // gray-200
  'color-border-hover': '#d1d5db',         // gray-300
  'color-border-active': '#9ca3af',        // gray-400
  'color-border-inverse': '#374151',       // gray-700
  'color-border-muted': '#f3f4f6',        // gray-100

  // Status colors - Clear visual feedback
  'color-success': '#22c55e',             // green-500
  'color-success-hover': '#16a34a',       // green-600
  'color-success-foreground': '#ffffff',    // white

  'color-warning': '#f59e0b',             // yellow-500
  'color-warning-hover': '#d97706',       // yellow-600
  'color-warning-foreground': '#111827',   // gray-900

  'color-error': '#ef4444',               // red-500
  'color-error-hover': '#dc2626',         // red-600
  'color-error-foreground': '#ffffff',      // white

  'color-info': '#3b82f6',               // blue-500
  'color-info-hover': '#2563eb',           // blue-600
  'color-info-foreground': '#ffffff',      // white
};

export const semanticTypography: TypographySemanticTokens = {
  // Text styles for different use cases
  'text-body-large': {
    'font-family': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    'font-size': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)', // 18px - 20px
    'font-weight': 400,
    'line-height': 1.625,
    'letter-spacing': '0em',
  },
  
  'text-body-medium': {
    'font-family': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    'font-size': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', // 16px - 18px
    'font-weight': 400,
    'line-height': 1.5,
    'letter-spacing': '0em',
  },
  
  'text-body-small': {
    'font-family': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    'font-size': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', // 14px - 16px
    'font-weight': 400,
    'line-height': 1.5,
    'letter-spacing': '0em',
  },

  // Heading styles
  'text-heading-1': {
    'font-family': '"Inter Display", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'font-size': 'clamp(3.75rem, 3rem + 3.75vw, 5rem)', // 60px - 80px
    'font-weight': 700,
    'line-height': 1.25,
    'letter-spacing': '-0.025em',
  },
  
  'text-heading-2': {
    'font-family': '"Inter Display", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'font-size': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)', // 36px - 48px
    'font-weight': 600,
    'line-height': 1.25,
    'letter-spacing': '-0.025em',
  },
  
  'text-heading-3': {
    'font-family': '"Inter Display", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'font-size': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)', // 30px - 36px
    'font-weight': 600,
    'line-height': 1.25,
    'letter-spacing': '-0.025em',
  },
  
  'text-heading-4': {
    'font-family': '"Inter Display", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'font-size': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)', // 24px - 30px
    'font-weight': 600,
    'line-height': 1.375,
    'letter-spacing': '-0.025em',
  },
  
  'text-heading-5': {
    'font-family': '"Inter Display", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'font-size': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', // 20px - 24px
    'font-weight': 600,
    'line-height': 1.375,
    'letter-spacing': '0em',
  },
  
  'text-heading-6': {
    'font-family': '"Inter Display", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'font-size': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)', // 18px - 20px
    'font-weight': 600,
    'line-height': 1.375,
    'letter-spacing': '0em',
  },

  // Specialized text styles
  'text-caption': {
    'font-family': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    'font-size': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', // 12px - 14px
    'font-weight': 400,
    'line-height': 1.25,
    'letter-spacing': '0.025em',
  },
  
  'text-overline': {
    'font-family': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    'font-size': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', // 12px - 14px
    'font-weight': 500,
    'line-height': 1,
    'letter-spacing': '0.1em',
  },
  
  'text-label': {
    'font-family': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    'font-size': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', // 14px - 16px
    'font-weight': 500,
    'line-height': 1.25,
    'letter-spacing': '0.025em',
  },
  
  'text-code': {
    'font-family': '"SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", Menlo, Consolas, monospace',
    'font-size': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', // 14px - 16px
    'font-weight': 400,
    'line-height': 1.5,
    'letter-spacing': '0em',
  },
  
  'text-quote': {
    'font-family': 'Georgia, Cambria, "Times New Roman", Times, serif',
    'font-size': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)', // 18px - 20px
    'font-weight': 400,
    'line-height': 1.625,
    'letter-spacing': '0em',
  },
};

export const semanticSpacing: SpacingSemanticTokens = {
  // Component-specific spacing
  'space-component-padding-x': '1rem',      // 16px
  'space-component-padding-y': '0.75rem',     // 12px
  'space-component-margin-x': '0.5rem',       // 8px
  'space-component-margin-y': '0.5rem',       // 8px
  'space-section-padding-x': '2rem',         // 32px
  'space-section-padding-y': '3rem',         // 48px
  'space-container-padding-x': '1.5rem',      // 24px
  'space-container-padding-y': '2rem',        // 32px
  'space-gap': '1rem',                       // 16px
  'space-gap-sm': '0.5rem',                 // 8px
  'space-gap-lg': '1.5rem',                 // 24px
};

export const semanticSizing: SizingSemanticTokens = {
  // Component-specific sizing
  'size-button-height': '2.5rem',           // 40px
  'size-button-height-sm': '2rem',            // 32px
  'size-button-height-lg': '3rem',            // 48px
  'size-input-height': '2.5rem',             // 40px
  'size-input-height-sm': '2rem',             // 32px
  'size-input-height-lg': '3rem',             // 48px
  'size-avatar-sm': '2rem',                  // 32px
  'size-avatar-md': '2.5rem',                // 40px
  'size-avatar-lg': '3rem',                  // 48px
  'size-avatar-xl': '4rem',                  // 64px
};

export const semanticBorderRadius: BorderRadiusSemanticTokens = {
  // Component-specific border radius
  'radius-button': '0.375rem',              // 6px
  'radius-input': '0.25rem',                // 4px
  'radius-card': '0.5rem',                  // 8px
  'radius-modal': '0.75rem',                // 12px
  'radius-badge': '9999px',                 // Full (circular)
  'radius-avatar': '9999px',                // Full (circular)
};

export const semanticShadows: ShadowSemanticTokens = {
  // Component-specific shadows
  'shadow-button': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  'shadow-button-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  'shadow-card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  'shadow-card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  'shadow-modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  'shadow-dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  'shadow-tooltip': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const semanticMotion: MotionSemanticTokens = {
  // Component-specific motion
  'motion-button': {
    duration: '150ms',
    'ease-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  'motion-button-hover': {
    duration: '100ms',
    'ease-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  'motion-modal': {
    duration: '300ms',
    'ease-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  'motion-dropdown': {
    duration: '200ms',
    'ease-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  'motion-tooltip': {
    duration: '150ms',
    'ease-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  'motion-page-transition': {
    duration: '500ms',
    'ease-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
