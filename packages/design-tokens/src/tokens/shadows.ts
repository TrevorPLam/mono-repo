/**
 * Shadow tokens for the design system
 * Elevation-based shadow system for depth and hierarchy
 */

import type { ShadowPrimitiveTokens } from '../schema/types';

export const primitiveShadows: ShadowPrimitiveTokens = {
  // Subtle shadows for minimal elevation
  'shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  
  // Default shadow for standard elevation
  'shadow-base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  
  // Medium shadow for cards and dropdowns
  'shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  
  // Large shadow for modals and elevated content
  'shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  
  // Extra large shadow for tooltips and popovers
  'shadow-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  
  // 2XL shadow for sidebars and large modals
  'shadow-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Inner shadow for pressed states and inset elements
  'shadow-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  
  // No shadow for flat elements
  'shadow-none': 'none',
};
