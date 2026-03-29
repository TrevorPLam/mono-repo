/**
 * CSS utilities for design tokens
 * Provides theme selectors and CSS variable utilities
 */

// Re-export Vanilla Extract variables
export * from './variables';

// CSS selector utilities
export const selectors = {
  root: ':root',
  light: 'html[data-theme="light"]',
  dark: 'html[data-theme="dark"]',
  brand: {
    firm: 'html[data-brand="firm"]',
    platform: 'html[data-brand="platform"]'
  }
} as const;

/**
 * Generate CSS selector for theme combination
 */
export function getThemeSelector(theme?: string, brand?: string): string {
  if (!theme && !brand) return selectors.root;
  
  const parts: string[] = [];
  if (theme) parts.push(`html[data-theme="${theme}"]`);
  if (brand) parts.push(`html[data-brand="${brand}"]`);
  
  return parts.join('');
}

/**
 * Create CSS custom property name
 */
export function createCSSVar(category: string, name: string): string {
  return `--repo-${category}-${name}`;
}

/**
 * Get CSS custom property value
 */
export function getCSSVar(category: string, name: string): string {
  return `var(${createCSSVar(category, name)})`;
}
