/**
 * Design tokens exports
 * Provides access to all primitive and semantic tokens
 */

// Export primitive tokens
export { primitiveColors } from './colors';
export { primitiveTypography } from './typography';
export { primitiveSpacing } from './spacing';
export { primitiveSizing } from './sizing';
export { primitiveBorderRadius } from './border-radius';
export { primitiveShadows } from './shadows';
export { breakpointTokens } from './breakpoints';
export { primitiveMotion } from './motion';

// Export semantic tokens
export { 
  semanticColors,
  semanticTypography,
  semanticSpacing,
  semanticSizing,
  semanticBorderRadius,
  semanticShadows,
  semanticMotion,
} from './semantic';

// Export combined token objects
import { primitiveColors } from './colors';
import { primitiveTypography } from './typography';
import { primitiveSpacing } from './spacing';
import { primitiveSizing } from './sizing';
import { primitiveBorderRadius } from './border-radius';
import { primitiveShadows } from './shadows';
import { breakpointTokens } from './breakpoints';
import { primitiveMotion } from './motion';

import {
  semanticColors,
  semanticTypography,
  semanticSpacing,
  semanticSizing,
  semanticBorderRadius,
  semanticShadows,
  semanticMotion,
} from './semantic';

import type { PrimitiveTokens, SemanticTokens, DesignTokens } from '../schema/types';

// Combined primitive tokens
export const primitiveTokens: PrimitiveTokens = {
  colors: primitiveColors,
  typography: primitiveTypography,
  spacing: primitiveSpacing,
  sizing: primitiveSizing,
  borderRadius: primitiveBorderRadius,
  shadows: primitiveShadows,
  breakpoints: breakpointTokens,
  motion: primitiveMotion,
};

// Combined semantic tokens
export const semanticTokens: SemanticTokens = {
  colors: semanticColors,
  typography: semanticTypography,
  spacing: semanticSpacing,
  sizing: semanticSizing,
  borderRadius: semanticBorderRadius,
  shadows: semanticShadows,
  motion: semanticMotion,
};

// Complete design tokens
export const designTokens: DesignTokens = {
  primitive: primitiveTokens,
  semantic: semanticTokens,
};

// Default export
export default designTokens;
