/**
 * CSS Custom Properties Generator
 * Transforms design tokens into CSS custom properties with modern best practices
 */

import type { DesignTokens, ThemeTokens } from '../schema/types';
import { semanticTokens, primitiveTokens } from '../tokens';

export interface CSSGeneratorOptions {
  /** Include primitive tokens in output */
  includePrimitives?: boolean;
  /** Include semantic tokens in output */
  includeSemantics?: boolean;
  /** Add CSS comments for documentation */
  includeComments?: boolean;
  /** Generate @property rules for type safety */
  includeTypedProperties?: boolean;
  /** Theme prefix for CSS variables */
  themePrefix?: string;
  /** Generate minified output */
  minify?: boolean;
}

export interface CSSVariableMap {
  /** CSS variable name to token path mapping */
  [variableName: string]: string;
}

/**
 * Converts camelCase or kebab-case to CSS custom property format
 */
function toCSSVariable(tokenPath: string[], prefix: string = 'token'): string {
  return `--${prefix}-${tokenPath.join('-')}`;
}

/**
 * Sanitizes CSS values and handles special cases
 */
function sanitizeCSSValue(value: any): string {
  if (typeof value === 'string') {
    // Handle CSS functions and special values
    if (value.includes('calc(') || value.includes('var(') || value.includes('clamp(')) {
      return value;
    }
    // Handle quoted values
    if (value.includes('"') || value.includes("'")) {
      return value;
    }
    // Handle space-separated values (like font families)
    if (value.includes(' ') && !value.includes('calc(') && !value.includes('var(')) {
      return value.includes(',') ? value : `"${value}"`;
    }
    return value;
  }
  return String(value);
}

/**
 * Generates CSS @property rules for typed custom properties
 */
function generateTypedProperty(name: string, value: string, type: 'color' | 'length' | 'number' | 'percentage' | 'angle' | 'time' | 'resolution' | 'url' | 'string' = 'string'): string {
  return `@property ${name} {
  syntax: '*';
  inherits: true;
  initial-value: ${sanitizeCSSValue(value)};
}`;
}

/**
 * Generates CSS custom properties from token object
 */
function generateCSSFromTokens(
  tokens: any,
  tokenPath: string[] = [],
  options: CSSGeneratorOptions,
  variableMap: CSSVariableMap = {}
): { css: string; variableMap: CSSVariableMap } {
  let css = '';
  const prefix = options.themePrefix || 'token';

  for (const [key, value] of Object.entries(tokens)) {
    const currentPath = [...tokenPath, key];
    const cssVarName = toCSSVariable(currentPath, prefix);

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively handle nested objects
      const nested = generateCSSFromTokens(value, currentPath, options, variableMap);
      css += nested.css;
      variableMap = { ...variableMap, ...nested.variableMap };
    } else {
      // Generate CSS custom property
      variableMap[cssVarName] = currentPath.join('.');
      
      if (options.includeComments) {
        css += `/* ${currentPath.join('.')} */\n`;
      }

      const sanitizedValue = sanitizeCSSValue(value);

      if (options.includeTypedProperties) {
        // Try to infer type from token path
        let propertyType: string = 'string';
        if (currentPath.includes('color')) propertyType = 'color';
        else if (currentPath.some(p => ['size', 'spacing', 'width', 'height', 'radius', 'border'].includes(p))) propertyType = 'length';
        else if (currentPath.some(p => ['opacity', 'z-index'].includes(p))) propertyType = 'number';
        else if (currentPath.some(p => ['duration', 'delay'].includes(p))) propertyType = 'time';
        else if (currentPath.some(p => ['angle'].includes(p))) propertyType = 'angle';

        css += generateTypedProperty(cssVarName, sanitizedValue, propertyType as any) + '\n\n';
      }

      css += `${cssVarName}: ${sanitizedValue};\n\n`;
    }
  }

  return { css, variableMap };
}

/**
 * Generates theme-aware CSS with data attributes
 */
function generateThemeCSS(theme: ThemeTokens, themeName: string, options: CSSGeneratorOptions): { css: string; variableMap: CSSVariableMap } {
  const prefix = options.themePrefix || 'token';
  const themePrefix = `--${prefix}-${themeName}`;
  
  let css = '';
  if (options.includeComments) {
    css += `\n/* Theme: ${themeName} */\n`;
    css += `/* Generated: ${new Date().toISOString()} */\n\n`;
  }

  css += `[data-theme="${themeName}"] {\n`;

  const { css: themeVars, variableMap } = generateCSSFromTokens(
    theme.tokens,
    [],
    { ...options, themePrefix: `${prefix}-${themeName}` },
    {}
  );

  // Indent theme variables
  css += themeVars.split('\n').map(line => line ? `  ${line}` : line).join('\n');
  css += '}\n\n';

  return { css, variableMap };
}

/**
 * Main CSS generator function
 */
export function generateCSS(
  designTokens: DesignTokens,
  themes: ThemeTokens[] = [],
  options: CSSGeneratorOptions = {}
): { css: string; variableMap: CSSVariableMap; themesVariableMap: { [themeName: string]: CSSVariableMap } } {
  const {
    includePrimitives = true,
    includeSemantics = true,
    includeComments = true,
    includeTypedProperties = false,
    minify = false,
  } = options;

  let css = '';
  let variableMap: CSSVariableMap = {};
  const themesVariableMap: { [themeName: string]: CSSVariableMap } = {};

  // Add header comment
  if (includeComments && !minify) {
    css += `/* 
 * Design Tokens CSS Custom Properties
 * Generated: ${new Date().toISOString()}
 * Framework: Framework-agnostic
 * Best Practices: @property typed values, semantic naming, theme-aware
 */\n\n`;
  }

  // Generate base tokens
  if (includePrimitives) {
    if (includeComments && !minify) {
      css += '/* Primitive Tokens */\n';
    }
    
    const { css: primitiveCSS, variableMap: primitiveMap } = generateCSSFromTokens(
      designTokens.primitive,
      ['primitive'],
      options,
      {}
    );
    
    css += primitiveCSS;
    variableMap = { ...variableMap, ...primitiveMap };
  }

  if (includeSemantics) {
    if (includeComments && !minify) {
      css += '/* Semantic Tokens */\n';
    }
    
    const { css: semanticCSS, variableMap: semanticMap } = generateCSSFromTokens(
      designTokens.semantic,
      ['semantic'],
      options,
      {}
    );
    
    css += semanticCSS;
    variableMap = { ...variableMap, ...semanticMap };
  }

  // Generate theme-specific CSS
  if (themes.length > 0) {
    if (includeComments && !minify) {
      css += '/* Theme Variations */\n';
    }
    
    for (const theme of themes) {
      const { css: themeCSS, variableMap: themeMap } = generateThemeCSS(theme, theme.name, options);
      css += themeCSS;
      themesVariableMap[theme.name] = themeMap;
    }
  }

  // Add utility CSS classes for common patterns
  if (includeSemantics) {
    if (includeComments && !minify) {
      css += '/* Utility Classes */\n';
    }
    
    css += generateUtilityCSS(options);
  }

  // Minify if requested
  if (minify) {
    css = css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\n/g, '') // Remove all newlines
      .replace(/;\s*/g, ';') // Remove space after semicolons
      .replace(/\{\s*/g, '{') // Remove space after opening brace
      .replace(/\s*\}/g, '}') // Remove space before closing brace
      .replace(/:\s*/g, ':') // Remove space after colon
      .trim();
  }

  return { css, variableMap, themesVariableMap };
}

/**
 * Generates utility CSS classes for common token usage patterns
 */
function generateUtilityCSS(options: CSSGeneratorOptions): string {
  const prefix = options.themePrefix || 'token';
  let css = '';

  // Color utilities
  css += `.text-foreground { color: var(--${prefix}-semantic-colors-text-foreground); }\n`;
  css += `.text-background { color: var(--${prefix}-semantic-colors-text-background); }\n`;
  css += `.bg-primary { background-color: var(--${prefix}-semantic-colors-background-primary); }\n`;
  css += `.bg-secondary { background-color: var(--${prefix}-semantic-colors-background-secondary); }\n`;

  // Spacing utilities
  css += `.p-sm { padding: var(--${prefix}-semantic-spacing-sm); }\n`;
  css += `.p-md { padding: var(--${prefix}-semantic-spacing-md); }\n`;
  css += `.p-lg { padding: var(--${prefix}-semantic-spacing-lg); }\n`;
  css += `.m-sm { margin: var(--${prefix}-semantic-spacing-sm); }\n`;
  css += `.m-md { margin: var(--${prefix}-semantic-spacing-md); }\n`;
  css += `.m-lg { margin: var(--${prefix}-semantic-spacing-lg); }\n`;

  // Typography utilities
  css += `.text-heading { font: var(--${prefix}-semantic-typography-heading-lg); }\n`;
  css += `.text-body { font: var(--${prefix}-semantic-typography-body-md); }\n`;
  css += `.text-caption { font: var(--${prefix}-semantic-typography-caption); }\n`;

  css += '\n';

  return css;
}

/**
 * Validates generated CSS for common issues
 */
export function validateGeneratedCSS(css: string): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for CSS syntax issues
  const cssVariableRegex = /--[a-zA-Z0-9-]+:/g;
  const variables = css.match(cssVariableRegex) || [];

  // Check for duplicate variable declarations
  const uniqueVars = new Set<string>();
  for (const variable of variables) {
    const varName = variable.replace(':', '');
    if (uniqueVars.has(varName)) {
      warnings.push(`Duplicate CSS variable declaration: ${varName}`);
    }
    uniqueVars.add(varName);
  }

  // Check for invalid CSS values
  const lines = css.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;
    
    if (line.includes(':') && !line.startsWith('/*') && !line.startsWith('@property')) {
      const parts = line.split(':');
      if (parts.length < 2) continue;
      
      const property = parts[0]?.trim();
      const value = parts.slice(1).join(':').trim();
      
      if (!property || !property.startsWith('--')) continue;
      
      // Check for empty values
      if (!value || value === ';') {
        errors.push(`Empty CSS value for ${property} at line ${i + 1}`);
      }
      
      // Check for unterminated values
      if (!value.endsWith(';')) {
        warnings.push(`Missing semicolon for ${property} at line ${i + 1}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Convenience function to generate CSS with default design tokens
 */
export function generateDesignTokensCSS(options: CSSGeneratorOptions = {}): ReturnType<typeof generateCSS> {
  return generateCSS(
    {
      primitive: primitiveTokens,
      semantic: semanticTokens,
    },
    [], // No themes yet - will be added in Task 5
    options
  );
}
