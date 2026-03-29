/**
 * Typography tokens for the design system
 * Mobile-first responsive typography with accessibility focus
 */

import type { TypographyPrimitiveTokens } from '../schema/types';

export const primitiveTypography: TypographyPrimitiveTokens = {
  // Font families - System fonts for performance and consistency
  'font-family-sans': [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    '"Noto Sans"',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"'
  ],
  
  'font-family-serif': [
    'Georgia',
    'Cambria',
    '"Times New Roman"',
    'Times',
    'serif'
  ],
  
  'font-family-mono': [
    '"SF Mono"',
    'Monaco',
    'Inconsolata',
    '"Roboto Mono"',
    '"Source Code Pro"',
    'Menlo',
    'Consolas',
    '"DejaVu Sans Mono"',
    '"Bitstream Vera Sans Mono"',
    'monospace'
  ],
  
  'font-family-display': [
    '"Inter Display"',
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'sans-serif'
  ],

  // Font sizes - Mobile-first responsive scale using clamp()
  'font-size-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',     // 12px - 14px
  'font-size-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',        // 14px - 16px
  'font-size-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',        // 16px - 18px
  'font-size-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',        // 18px - 20px
  'font-size-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',         // 20px - 24px
  'font-size-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',         // 24px - 30px
  'font-size-3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)',     // 30px - 36px
  'font-size-4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)',          // 36px - 48px
  'font-size-5xl': 'clamp(3rem, 2.5rem + 2.5vw, 4rem)',              // 48px - 64px
  'font-size-6xl': 'clamp(3.75rem, 3rem + 3.75vw, 5rem)',            // 60px - 80px

  // Font weights - Following modern font weight standards
  'font-weight-thin': 100,
  'font-weight-light': 300,
  'font-weight-normal': 400,
  'font-weight-medium': 500,
  'font-weight-semibold': 600,
  'font-weight-bold': 700,
  'font-weight-extrabold': 800,
  'font-weight-black': 900,

  // Line heights - Optimized for readability
  'line-height-none': 1,
  'line-height-tight': 1.25,    // Good for headings
  'line-height-snug': 1.375,    // Compact text
  'line-height-normal': 1.5,     // Standard readability
  'line-height-relaxed': 1.625,  // Comfortable reading
  'line-height-loose': 2,        // Very spacious text

  // Letter spacing - Enhanced readability at different sizes
  'letter-spacing-tighter': '-0.05em',   // Tight tracking for large text
  'letter-spacing-tight': '-0.025em',    // Slightly tight
  'letter-spacing-normal': '0em',         // Normal tracking
  'letter-spacing-wide': '0.025em',      // Slightly wide
  'letter-spacing-wider': '0.05em',      // Wide tracking
  'letter-spacing-widest': '0.1em',      // Very wide tracking
};
