/**
 * Border radius tokens for the design system
 * Consistent border radius values for rounded elements
 */

import type { BorderRadiusPrimitiveTokens } from '../schema/types';

export const primitiveBorderRadius: BorderRadiusPrimitiveTokens = {
  // No border radius for sharp edges
  'radius-none': '0',
  
  // Extra small radius for subtle rounding
  'radius-sm': '0.125rem',    // 2px
  
  // Base radius for standard elements
  'radius-base': '0.25rem',     // 4px
  
  // Medium radius for buttons and inputs
  'radius-md': '0.375rem',      // 6px
  
  // Large radius for cards and containers
  'radius-lg': '0.5rem',        // 8px
  
  // Extra large radius for prominent elements
  'radius-xl': '0.75rem',       // 12px
  
  // 2XL radius for special elements
  'radius-2xl': '1rem',         // 16px
  
  // 3XL radius for avatars and badges
  'radius-3xl': '1.5rem',       // 24px
  
  // Full radius for circular elements
  'radius-full': '9999px',
};
