/**
 * Token type definitions
 * Provides type definitions for design token values
 */

export type TokenValue = 
  | string
  | number
  | string[]
  | Record<string, any>;

export type ColorToken = TokenValue;
export type DimensionToken = TokenValue;
export type FontFamilyToken = string[];
export type FontWeightToken = number;
export type NumberToken = number;
export type DurationToken = string;
export type CubicBezierToken = string;
export type ShadowToken = string;
export type StrokeWidthToken = string;
export type StrokeStyleToken = string;

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

export interface TokenDefinition<T extends TokenType = TokenType> {
  $value: T extends 'color' ? ColorToken :
          T extends 'dimension' ? DimensionToken :
          T extends 'fontFamily' ? FontFamilyToken :
          T extends 'fontWeight' ? FontWeightToken :
          T extends 'number' ? NumberToken :
          T extends 'duration' ? DurationToken :
          T extends 'cubicBezier' ? CubicBezierToken :
          T extends 'shadow' ? ShadowToken :
          T extends 'strokeWidth' ? StrokeWidthToken :
          T extends 'strokeStyle' ? StrokeStyleToken :
          TokenValue;
  $type: T;
  $description?: string;
  $deprecated?: boolean;
}

export interface CoreToken {
  category: 'core';
  type: string;
  value: TokenValue;
  description?: string;
}

export interface SemanticToken {
  category: 'semantic';
  type: string;
  value: TokenValue;
  description?: string;
}

export interface ComponentToken {
  category: 'component';
  type: string;
  value: TokenValue;
  description?: string;
}

export type DesignToken = CoreToken | SemanticToken | ComponentToken;

/**
 * Type guards for token types
 */
export function isColorToken(token: DesignToken): token is DesignToken & { value: ColorToken } {
  return typeof token.value === 'string' && (
    token.value.startsWith('#') ||
    token.value.startsWith('rgb') ||
    token.value.startsWith('hsl') ||
    /^[a-zA-Z]+$/.test(token.value)
  );
}

export function isDimensionToken(token: DesignToken): token is DesignToken & { value: DimensionToken } {
  return typeof token.value === 'string' && (
    token.value.includes('px') ||
    token.value.includes('rem') ||
    token.value.includes('em') ||
    token.value.includes('%') ||
    token.value.includes('vw') ||
    token.value.includes('vh')
  );
}

export function isFontFamilyToken(token: DesignToken): token is DesignToken & { value: FontFamilyToken } {
  return Array.isArray(token.value) && token.value.every(v => typeof v === 'string');
}

export function isNumberToken(token: DesignToken): token is DesignToken & { value: NumberToken } {
  return typeof token.value === 'number';
}
