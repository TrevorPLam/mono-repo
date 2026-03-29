/**
 * Theme-Aware CSS Generator
 * Enhanced CSS generator with full theme system integration
 * Supports runtime theme switching and brand customization
 */

import type { DesignTokens, ThemeTokens } from '../schema/types';
import { themeRegistry, type ThemeResolutionContext } from '../themes';
import { 
  generateCSS as baseGenerateCSS,
  generateDesignTokensCSS as baseGenerateDesignTokensCSS,
  validateGeneratedCSS,
  type CSSGeneratorOptions,
  type CSSVariableMap
} from './css-generator';

// =============================================================================
// ENHANCED OPTIONS
// =============================================================================

export interface ThemeAwareCSSGeneratorOptions extends CSSGeneratorOptions {
  /** Generate CSS for specific themes only */
  themes?: string[];
  /** Include theme switching utilities */
  includeThemeSwitching?: boolean;
  /** Generate CSS for brand customizations */
  includeBrandCustomizations?: boolean;
  /** Generate responsive theme variables */
  includeResponsiveThemes?: boolean;
  /** Theme-aware CSS class prefix */
  themeClassPrefix?: string;
  /** Generate CSS custom properties for runtime switching */
  includeRuntimeCSS?: boolean;
}

export interface ThemeCSSOutput {
  /** Base CSS with default theme */
  baseCSS: string;
  /** Theme-specific CSS */
  themeCSS: { [themeName: string]: string };
  /** Brand customization CSS */
  brandCSS: { [brandId: string]: string };
  /** Runtime switching utilities */
  runtimeCSS: string;
  /** Complete combined CSS */
  combinedCSS: string;
  /** Variable mappings */
  variableMap: CSSVariableMap;
  /** Theme variable mappings */
  themesVariableMap: { [themeName: string]: CSSVariableMap };
}

// =============================================================================
// THEME-AWARE CSS GENERATION
// =============================================================================

/**
 * Generates theme-aware CSS with full theme system integration
 */
export function generateThemeAwareCSS(
  designTokens: DesignTokens,
  options: ThemeAwareCSSGeneratorOptions = {}
): ThemeCSSOutput {
  const {
    themes: targetThemes,
    includeThemeSwitching = true,
    includeBrandCustomizations = false,
    includeResponsiveThemes = false,
    themeClassPrefix = 'theme',
    includeRuntimeCSS = true,
    ...baseOptions
  } = options;

  // Get all themes or specific themes
  const allThemes = themeRegistry.listThemes();
  const selectedThemes = targetThemes 
    ? allThemes.filter(theme => targetThemes.includes(theme.name))
    : allThemes;

  // Get theme objects from registry
  const themeObjects = selectedThemes
    .map(theme => themeRegistry.getTheme(theme.name))
    .filter((theme): theme is ThemeTokens => theme !== undefined);

  // Generate base CSS
  const { css: baseCSS, variableMap, themesVariableMap } = baseGenerateCSS(
    designTokens,
    themeObjects,
    baseOptions
  );

  // Generate theme-specific CSS
  const themeCSS: { [themeName: string]: string } = {};
  for (const theme of selectedThemes) {
    themeCSS[theme.name] = generateThemeSpecificCSS(theme.name, baseOptions);
  }

  // Generate brand customization CSS
  const brandCSS: { [brandId: string]: string } = {};
  if (includeBrandCustomizations) {
    // This would integrate with the brand system
    // For now, we'll leave it empty as it requires brand profiles
  }

  // Generate runtime switching utilities
  const runtimeCSS = includeRuntimeCSS ? generateRuntimeCSS(themeObjects, {
    includeThemeSwitching,
    themeClassPrefix,
    ...baseOptions
  }) : '';

  // Combine all CSS
  let combinedCSS = baseCSS;
  
  if (Object.keys(themeCSS).length > 0) {
    combinedCSS += '\n/* Theme-Specific CSS */\n';
    combinedCSS += Object.values(themeCSS).join('\n');
  }

  if (Object.keys(brandCSS).length > 0) {
    combinedCSS += '\n/* Brand Customization CSS */\n';
    combinedCSS += Object.values(brandCSS).join('\n');
  }

  if (runtimeCSS) {
    combinedCSS += '\n/* Runtime Theme Switching */\n';
    combinedCSS += runtimeCSS;
  }

  return {
    baseCSS,
    themeCSS,
    brandCSS,
    runtimeCSS,
    combinedCSS,
    variableMap,
    themesVariableMap
  };
}

/**
 * Generates CSS for a specific theme
 */
function generateThemeSpecificCSS(
  themeName: string, 
  options: CSSGeneratorOptions
): string {
  const theme = themeRegistry.getTheme(themeName);
  if (!theme) {
    throw new Error(`Theme "${themeName}" not found in registry`);
  }

  const prefix = options.themePrefix || 'token';
  let css = '';

  // Generate theme-specific CSS with data attributes
  css += `[data-theme="${themeName}"] {\n`;

  // Process all semantic tokens for this theme
  const processTokens = (tokens: any, path: string[] = []): void => {
    Object.entries(tokens).forEach(([key, value]) => {
      const currentPath = [...path, key];
      
      if (typeof value === 'object' && value !== null) {
        processTokens(value, currentPath);
      } else {
        const cssVarName = toCSSVariable(currentPath, prefix);
        const sanitizedValue = sanitizeCSSValue(value);
        css += `  ${cssVarName}: ${sanitizedValue};\n`;
      }
    });
  };

  processTokens(theme.tokens.semantic);
  css += '}\n\n';

  return css;
}

/**
 * Generates runtime CSS utilities for theme switching
 */
function generateRuntimeCSS(
  themes: ThemeTokens[],
  options: {
    includeThemeSwitching: boolean;
    themeClassPrefix: string;
  }
): string {
  if (!options.includeThemeSwitching) return '';

  let css = '';

  // Generate theme class utilities
  css += '/* Theme Class Utilities */\n';
  for (const theme of themes) {
    css += `.${options.themeClassPrefix}-${theme.name} {\n`;
    
    // Apply theme variables as CSS custom properties
    const processTokens = (tokens: any, path: string[] = []): void => {
      Object.entries(tokens).forEach(([key, value]) => {
        const currentPath = [...path, key];
        
        if (typeof value === 'object' && value !== null) {
          processTokens(value, currentPath);
        } else {
          const cssVarName = toCSSVariable(currentPath, 'token');
          const sanitizedValue = sanitizeCSSValue(value);
          css += `  ${cssVarName}: ${sanitizedValue};\n`;
        }
      });
    };

    processTokens(theme.tokens.semantic);
    css += '}\n\n';
  }

  // Generate theme transition utilities
  css += '/* Theme Transition Utilities */\n';
  css += '.theme-transition {\n';
  css += '  transition: all 300ms ease-in-out;\n';
  css += '}\n\n';

  css += '.theme-transition * {\n';
  css += '  transition: inherit !important;\n';
  css += '}\n\n';

  // Generate theme-aware component utilities
  css += '/* Theme-Aware Component Utilities */\n';
  css += '[data-theme] {\n';
  css += '  color-scheme: light;\n';
  css += '}\n\n';

  css += '[data-theme="dark"] {\n';
  css += '  color-scheme: dark;\n';
  css += '}\n\n';

  return css;
}

// =============================================================================
// BRAND CUSTOMIZATION CSS GENERATION
// =============================================================================

/**
 * Generates CSS for brand customizations
 */
export function generateBrandCSS(
  brandId: string,
  brandTokens: any,
  options: CSSGeneratorOptions = {}
): string {
  const prefix = options.themePrefix || 'token';
  let css = '';

  css += `/* Brand Customization: ${brandId} */\n`;
  css += `[data-brand="${brandId}"] {\n`;

  const processTokens = (tokens: any, path: string[] = []): void => {
    Object.entries(tokens).forEach(([key, value]) => {
      const currentPath = [...path, key];
      
      if (typeof value === 'object' && value !== null) {
        processTokens(value, currentPath);
      } else {
        const cssVarName = toCSSVariable(currentPath, prefix);
        const sanitizedValue = sanitizeCSSValue(value);
        css += `  ${cssVarName}: ${sanitizedValue};\n`;
      }
    });
  };

  processTokens(brandTokens);
  css += '}\n\n';

  return css;
}

// =============================================================================
// RESPONSIVE THEME CSS GENERATION
// =============================================================================

/**
 * Generates responsive theme CSS
 */
export function generateResponsiveThemeCSS(
  themes: ThemeTokens[],
  breakpoints: { [key: string]: string },
  options: CSSGeneratorOptions = {}
): string {
  let css = '';

  css += '/* Responsive Theme CSS */\n';

  // Generate responsive theme variations
  Object.entries(breakpoints).forEach(([breakpointName, breakpointValue]) => {
    css += `@media (min-width: ${breakpointValue}) {\n`;
    
    for (const theme of themes) {
      css += `  [data-theme="${theme.name}"] {\n`;
      
      // Process tokens with responsive adjustments
      const processTokens = (tokens: any, path: string[] = []): void => {
        Object.entries(tokens).forEach(([key, value]) => {
          const currentPath = [...path, key];
          
          if (typeof value === 'object' && value !== null) {
            processTokens(value, currentPath);
          } else {
            // Apply responsive adjustments for certain token types
            const adjustedValue = getResponsiveTokenValue(value, currentPath, breakpointName);
            if (adjustedValue !== value) {
              const cssVarName = toCSSVariable(currentPath, 'token');
              css += `    ${cssVarName}: ${adjustedValue};\n`;
            }
          }
        });
      };

      processTokens(theme.tokens.semantic);
      css += '  }\n';
    }
    
    css += '}\n\n';
  });

  return css;
}

/**
 * Gets responsive token value based on breakpoint
 */
function getResponsiveTokenValue(value: any, path: string[], breakpoint: string): any {
  // This is a simplified implementation
  // In a real system, you'd have more sophisticated responsive scaling
  
  if (path.includes('font-size') && typeof value === 'string') {
    // Scale font sizes for larger breakpoints
    if (breakpoint === 'md' && value.includes('rem')) {
      const size = parseFloat(value);
      return `${size * 1.1}rem`;
    } else if (breakpoint === 'lg' && value.includes('rem')) {
      const size = parseFloat(value);
      return `${size * 1.2}rem`;
    }
  }

  if (path.includes('spacing') && typeof value === 'string') {
    // Scale spacing for larger breakpoints
    if (breakpoint === 'lg' && value.includes('rem')) {
      const size = parseFloat(value);
      return `${size * 1.25}rem`;
    }
  }

  return value;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

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
      return value;
    }
  }
  
  return String(value);
}

// =============================================================================
// ENHANCED CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Enhanced design tokens CSS generator with theme awareness
 */
export function generateThemeAwareDesignTokensCSS(
  options: ThemeAwareCSSGeneratorOptions = {}
): ThemeCSSOutput {
  // Import semantic and primitive tokens
  const { semanticTokens, primitiveTokens } = require('../tokens');
  
  return generateThemeAwareCSS(
    {
      primitive: primitiveTokens,
      semantic: semanticTokens,
    },
    options
  );
}

/**
 * Generate CSS for specific theme resolution context
 */
export function generateContextualCSS(
  context: ThemeResolutionContext,
  options: CSSGeneratorOptions = {}
): { css: string; variableMap: CSSVariableMap } {
  const tokens = themeRegistry.resolveTokens(context);
  
  return baseGenerateCSS(tokens, [], {
    ...options,
    themePrefix: context.themeId
  });
}

// =============================================================================
// VALIDATION ENHANCEMENTS
// =============================================================================

/**
 * Enhanced validation for theme-aware CSS
 */
export function validateThemeAwareCSS(cssOutput: ThemeCSSOutput): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  themeValidation: { [themeName: string]: { isValid: boolean; issues: string[] } };
} {
  const baseValidation = validateGeneratedCSS(cssOutput.combinedCSS);
  const themeValidation: { [themeName: string]: { isValid: boolean; issues: string[] } } = {};

  // Validate each theme's CSS
  Object.entries(cssOutput.themeCSS).forEach(([themeName, themeCSS]) => {
    const themeResult = validateGeneratedCSS(themeCSS);
    themeValidation[themeName] = {
      isValid: themeResult.isValid,
      issues: [...themeResult.errors, ...themeResult.warnings]
    };
  });

  // Validate brand CSS
  Object.entries(cssOutput.brandCSS).forEach(([brandId, brandCSS]) => {
    const brandResult = validateGeneratedCSS(brandCSS);
    themeValidation[`brand-${brandId}`] = {
      isValid: brandResult.isValid,
      issues: [...brandResult.errors, ...brandResult.warnings]
    };
  });

  const allIssues = Object.values(themeValidation).flatMap(tv => tv.issues);
  const allErrors = [...baseValidation.errors, ...allIssues.filter(issue => 
    issue.toLowerCase().includes('error') || issue.toLowerCase().includes('invalid')
  )];
  const allWarnings = [...baseValidation.warnings, ...allIssues.filter(issue => 
    !issue.toLowerCase().includes('error') && !issue.toLowerCase().includes('invalid')
  )];

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    themeValidation
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  baseGenerateCSS as generateCSS,
  baseGenerateDesignTokensCSS as generateDesignTokensCSS,
  validateGeneratedCSS,
  type CSSGeneratorOptions,
  type CSSVariableMap
};
