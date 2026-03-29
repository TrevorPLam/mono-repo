/**
 * Tests for CSS Custom Properties Generator
 */

import { describe, it, expect } from 'vitest';
import { generateCSS, generateDesignTokensCSS, validateGeneratedCSS } from './css-generator';
import { primitiveTokens, semanticTokens } from '../tokens';

describe('CSS Generator', () => {
  describe('generateDesignTokensCSS', () => {
    it('should generate CSS with default options', () => {
      const { css, variableMap } = generateDesignTokensCSS();
      
      expect(css).toContain('/*');
      expect(css).toContain('--token-primitive');
      expect(css).toContain('--token-semantic');
      expect(Object.keys(variableMap).length).toBeGreaterThan(0);
    });

    it('should generate CSS without comments when minified', () => {
      const { css } = generateDesignTokensCSS({ minify: true });
      
      expect(css).not.toContain('/*');
      expect(css).not.toContain('\n\n');
    });

    it('should include @property rules when typed properties are enabled', () => {
      const { css } = generateDesignTokensCSS({ includeTypedProperties: true });
      
      expect(css).toContain('@property');
      expect(css).toContain('syntax:');
      expect(css).toContain('inherits:');
    });

    it('should generate only primitive tokens when semantics are disabled', () => {
      const { css } = generateDesignTokensCSS({ includeSemantics: false });
      
      expect(css).toContain('--token-primitive');
      expect(css).not.toContain('--token-semantic');
    });

    it('should generate only semantic tokens when primitives are disabled', () => {
      const { css } = generateDesignTokensCSS({ includePrimitives: false });
      
      expect(css).not.toContain('--token-primitive');
      expect(css).toContain('--token-semantic');
    });
  });

  describe('generateCSS', () => {
    it('should handle actual design tokens', () => {
      const { css, variableMap } = generateCSS({
        primitive: primitiveTokens,
        semantic: semanticTokens
      });
      
      expect(css).toContain('--token-primitive');
      expect(css).toContain('--token-semantic');
      expect(Object.keys(variableMap).length).toBeGreaterThan(0);
    });

    it('should generate theme-specific CSS', () => {
      const themes = [
        {
          name: 'dark',
          displayName: 'Dark Theme',
          tokens: {
            primitive: primitiveTokens,
            semantic: semanticTokens
          }
        }
      ];

      const { css } = generateCSS({
        primitive: primitiveTokens,
        semantic: semanticTokens
      }, themes);
      
      expect(css).toContain('[data-theme="dark"]');
      expect(css).toContain('--token-dark-primitive');
      expect(css).toContain('--token-dark-semantic');
    });

    it('should use custom theme prefix', () => {
      const { css } = generateCSS({
        primitive: primitiveTokens,
        semantic: semanticTokens
      }, [], { themePrefix: 'custom' });
      
      expect(css).toContain('--custom-primitive');
      expect(css).toContain('--custom-semantic');
    });
  });

  describe('validateGeneratedCSS', () => {
    it('should validate correct CSS', () => {
      const validCSS = `
        :root {
          --color-primary: #000000;
          --color-text: #ffffff;
        }
      `;

      const result = validateGeneratedCSS(validCSS);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect empty CSS values', () => {
      const invalidCSS = `
        :root {
          --color-primary: ;
        }
      `;

      const result = validateGeneratedCSS(invalidCSS);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Empty CSS value');
    });

    it('should detect missing semicolons', () => {
      const cssWithWarning = `
        :root {
          --color-primary: #000000
        }
      `;

      const result = validateGeneratedCSS(cssWithWarning);
      
      expect(result.isValid).toBe(true); // Still valid, just warning
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('Missing semicolon');
    });

    it('should detect duplicate CSS variables', () => {
      const duplicateCSS = `
        :root {
          --color-primary: #000000;
          --color-primary: #ffffff;
        }
      `;

      const result = validateGeneratedCSS(duplicateCSS);
      
      expect(result.isValid).toBe(true); // Still valid, just warning
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('Duplicate CSS variable');
    });
  });

  describe('CSS value sanitization', () => {
    it('should handle complex values in actual tokens', () => {
      const { css } = generateDesignTokensCSS();
      
      // Should handle complex values like shadows and spacing
      expect(css).toContain('shadow');
      expect(css).toContain('space');
    });

    it('should handle font families correctly', () => {
      const { css } = generateDesignTokensCSS();
      
      // Should handle font family arrays
      expect(css).toContain('font-family');
    });
  });

  describe('Utility CSS generation', () => {
    it('should include utility classes', () => {
      const { css } = generateDesignTokensCSS();
      
      expect(css).toContain('.text-foreground');
      expect(css).toContain('.bg-primary');
      expect(css).toContain('.p-md');
      expect(css).toContain('.text-heading');
    });

    it('should use semantic tokens in utilities', () => {
      const { css } = generateDesignTokensCSS();
      
      expect(css).toContain('var(--token-semantic-colors-text-foreground)');
      expect(css).toContain('var(--token-semantic-colors-background-primary)');
      expect(css).toContain('var(--token-semantic-spacing-md)');
    });
  });

  describe('Performance and size', () => {
    it('should generate reasonable number of variables', () => {
      const { variableMap } = generateDesignTokensCSS();
      
      // Should generate a reasonable number of CSS variables
      const variableCount = Object.keys(variableMap).length;
      expect(variableCount).toBeGreaterThan(50);
      expect(variableCount).toBeLessThan(500); // Sanity check
    });

    it('should reduce size when minified', () => {
      const { css: normalCSS } = generateDesignTokensCSS({ minify: false });
      const { css: minifiedCSS } = generateDesignTokensCSS({ minify: true });
      
      const sizeReduction = (normalCSS.length - minifiedCSS.length) / normalCSS.length;
      expect(sizeReduction).toBeGreaterThan(0.02); // At least 2% reduction (more realistic for CSS variables)
    });
  });
});
