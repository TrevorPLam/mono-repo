/**
 * Token type definitions
 */

// DTCG token types
export type TokenType = 
  | 'color'
  | 'dimension' 
  | 'fontFamily'
  | 'fontWeight'
  | 'number'
  | 'duration'
  | 'cubicBezier'
  | 'shadow'
  | 'strokeWidth'
  | 'strokeStyle';

// Token structure
export interface Token<T = TokenType> {
  $value: T | string; // string for references
  $type: T;
  $description?: string;
  $deprecated?: boolean;
}

// Core token value types
export type ColorValue = string; // hex, rgb, oklch, or reference
export type DimensionValue = string | number; // px, rem, em, %, or reference
export type FontFamilyValue = string[]; // array of font names
export type FontWeightValue = number; // 100-900
export type NumberValue = number;
export type DurationValue = string; // s, ms, or reference
export type CubicBezierValue = string; // cubic-bezier() or reference
export type ShadowValue = string; // box-shadow or reference
export type StrokeWidthValue = number; // px or reference
export type StrokeStyleValue = string; // solid, dashed, dotted, etc.

// Core token types
export type CoreColorToken = Token<'color'>;
export type CoreSpacingToken = Token<'dimension'>;
export type CoreTypographyToken = Token<'fontFamily' | 'fontWeight' | 'dimension' | 'number'>;
export type CoreRadiusToken = Token<'dimension'>;
export type CoreShadowToken = Token<'shadow'>;
export type CoreBorderToken = Token<'strokeWidth' | 'strokeStyle'>;
export type CoreOpacityToken = Token<'number'>;
export type CoreMotionToken = Token<'duration' | 'cubicBezier'>;
export type CoreSizeToken = Token<'dimension'>;
export type CoreBreakpointToken = Token<'dimension'>;
export type CoreZIndexToken = Token<'number'>;

// Semantic token types
export type SemanticColorToken = Token<'color'>;
export type SemanticSurfaceToken = Token<'color'>;
export type SemanticTextToken = Token<'color'>;
export type SemanticBorderToken = Token<'color'>;
export type SemanticIconToken = Token<'color'>;
export type SemanticFocusToken = Token<'color' | 'dimension'>;
export type SemanticSpacingToken = Token<'dimension'>;
export type SemanticTypographyToken = Token<'dimension' | 'fontWeight'>;
export type SemanticElevationToken = Token<'shadow'>;
export type SemanticMotionToken = Token<'duration' | 'cubicBezier'>;

// Component token types
export type ComponentGeometryToken = Token<'dimension'>;
export type ComponentStateToken = Token<'color' | 'shadow'>;
export type ComponentInteractionToken = Token<'duration' | 'cubicBezier'>;

// Theme types
export type ThemeOverlay = Record<string, Token<any>>;
export type ThemeConfig = {
  name: string;
  description?: string;
  overrides: ThemeOverlay;
};
