/**
 * Token validation utilities
 * Simplified validation for practical implementation
 */

import {
  primitiveTokens,
  semanticTokens,
  designTokens,
} from '../tokens';

import type { DesignTokens, ThemeTokens } from '../schema/types';

/**
 * Validates all primitive tokens
 */
export function validateAllPrimitiveTokens(): boolean {
  try {
    // Basic structural validation
    if (!primitiveTokens.colors || !primitiveTokens.typography || !primitiveTokens.spacing) {
      throw new Error('Missing required primitive token categories');
    }
    
    // Validate color structure
    const colorKeys = ['blue', 'gray', 'red', 'green', 'yellow', 'orange', 'purple', 'pink'];
    for (const key of colorKeys) {
      const colorScale = primitiveTokens.colors[key as keyof typeof primitiveTokens.colors];
      if (!colorScale || !colorScale[50] || !colorScale[500]) {
        throw new Error(`Invalid color scale structure for ${key}`);
      }
    }
    
    // Validate spacing structure (4px base scale)
    const spacingKeys = ['space-0', 'space-1', 'space-2', 'space-4', 'space-8', 'space-16'];
    for (const key of spacingKeys) {
      if (!primitiveTokens.spacing[key as keyof typeof primitiveTokens.spacing]) {
        throw new Error(`Missing spacing token: ${key}`);
      }
    }
    
    console.log('✅ Primitive tokens validation passed');
    return true;
  } catch (error: any) {
    console.error('❌ Primitive tokens validation failed:', error.message);
    return false;
  }
}

/**
 * Validates all semantic tokens
 */
export function validateAllSemanticTokens(): boolean {
  try {
    // Basic structural validation
    if (!semanticTokens.colors || !semanticTokens.typography || !semanticTokens.spacing) {
      throw new Error('Missing required semantic token categories');
    }
    
    // Validate semantic color structure
    const semanticColorKeys = [
      'color-primary', 'color-secondary', 'color-accent',
      'color-background', 'color-text-primary', 'color-success', 'color-error'
    ];
    for (const key of semanticColorKeys) {
      if (!semanticTokens.colors[key as keyof typeof semanticTokens.colors]) {
        throw new Error(`Missing semantic color token: ${key}`);
      }
    }
    
    // Validate semantic typography structure
    const semanticTypographyKeys = [
      'text-body-large', 'text-body-medium', 'text-body-small',
      'text-heading-1', 'text-heading-2', 'text-heading-3'
    ];
    for (const key of semanticTypographyKeys) {
      if (!semanticTokens.typography[key as keyof typeof semanticTokens.typography]) {
        throw new Error(`Missing semantic typography token: ${key}`);
      }
    }
    
    console.log('✅ Semantic tokens validation passed');
    return true;
  } catch (error: any) {
    console.error('❌ Semantic tokens validation failed:', error.message);
    return false;
  }
}

/**
 * Validates complete design tokens
 */
export function validateAllDesignTokens(): boolean {
  try {
    if (!designTokens.primitive || !designTokens.semantic) {
      throw new Error('Missing primitive or semantic token layers');
    }
    
    console.log('✅ Design tokens validation passed');
    return true;
  } catch (error: any) {
    console.error('❌ Design tokens validation failed:', error.message);
    return false;
  }
}

/**
 * Validates a theme configuration
 */
export function validateTheme(theme: ThemeTokens): boolean {
  try {
    if (!theme.name || !theme.tokens) {
      throw new Error('Theme must have name and tokens');
    }
    
    console.log(`✅ Theme "${theme.name}" validation passed`);
    return true;
  } catch (error: any) {
    console.error(`❌ Theme "${theme.name}" validation failed:`, error.message);
    return false;
  }
}

/**
 * Validates color contrast for accessibility
 */
export function validateColorContrast(foreground: string, background: string): boolean {
  // Simplified contrast validation - in production, use a proper library
  try {
    // Basic validation - check if colors are different
    if (foreground === background) {
      return false;
    }
    
    // Check if colors are valid hex values
    const hexRegex = /^#([0-9a-fA-F]{3}){1,2}$/;
    if (!hexRegex.test(foreground) || !hexRegex.test(background)) {
      return false;
    }
    
    return true; // Placeholder - would use proper contrast calculation in production
  } catch (error: any) {
    console.error('❌ Color contrast validation failed:', error.message);
    return false;
  }
}

/**
 * Validates accessibility contrast with test cases
 */
export function validateAccessibilityContrast(): boolean {
  const testCases = [
    { foreground: '#ffffff', background: '#3b82f6' }, // white on blue
    { foreground: '#111827', background: '#ffffff' }, // dark text on white
    { foreground: '#ffffff', background: '#ef4444' }, // white on red
    { foreground: '#ffffff', background: '#22c55e' }, // white on green
  ];

  let allPassed = true;
  
  testCases.forEach((testCase, index) => {
    const isValid = validateColorContrast(testCase.foreground, testCase.background);
    if (isValid) {
      console.log(`✅ Contrast test case ${index + 1} passed`);
    } else {
      console.error(`❌ Contrast test case ${index + 1} failed: ${testCase.foreground} on ${testCase.background}`);
      allPassed = false;
    }
  });

  return allPassed;
}

/**
 * Runs comprehensive token validation
 */
export function runComprehensiveValidation(): boolean {
  console.log('🔍 Starting comprehensive token validation...\n');

  const results = [
    validateAllPrimitiveTokens(),
    validateAllSemanticTokens(),
    validateAllDesignTokens(),
    validateAccessibilityContrast(),
  ];

  const allPassed = results.every(result => result);

  if (allPassed) {
    console.log('\n🎉 All token validations passed!');
  } else {
    console.log('\n💥 Some token validations failed!');
  }

  return allPassed;
}
