/**
 * Theme System Tests
 * Comprehensive test suite for theme system functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { 
  themeRegistry, 
  tokenResolver, 
  defaultLightTheme, 
  darkTheme, 
  initializeThemes,
  createBrandTheme,
  type BrandCustomization,
  type ThemeResolutionContext
} from '../index';
import { 
  validateThemeRegistry,
  validateBrandCustomization,
  validateThemeBrandCompatibility
} from '../validation';
import { generateThemeAwareCSS } from '../../utils/theme-css-generator';

describe('Theme Registry', () => {
  beforeEach(() => {
    // Reset registry before each test
    themeRegistry.setActiveTheme('default');
  });

  it('should register and retrieve themes', () => {
    const testTheme = {
      name: 'test-theme',
      displayName: 'Test Theme',
      tokens: defaultLightTheme.tokens
    };

    themeRegistry.registerTheme(testTheme);
    
    const retrieved = themeRegistry.getTheme('test-theme');
    expect(retrieved).toEqual(testTheme);
  });

  it('should set and get active theme', () => {
    const success = themeRegistry.setActiveTheme('dark');
    expect(success).toBe(true);
    
    const activeTheme = themeRegistry.getActiveTheme();
    expect(activeTheme.name).toBe('dark');
  });

  it('should validate theme structure', () => {
    const invalidTheme = {
      name: '',
      displayName: 'Invalid Theme',
      tokens: defaultLightTheme.tokens
    };

    expect(() => themeRegistry.registerTheme(invalidTheme)).toThrow();
  });

  it('should resolve tokens with context', () => {
    const context: ThemeResolutionContext = {
      themeId: 'default',
      brandOverrides: {
        'semantic.colors.color-primary': '#ff0000'
      }
    };

    const tokens = themeRegistry.resolveTokens(context);
    expect(tokens.semantic.colors['color-primary']).toBe('#ff0000');
  });

  it('should list all available themes', () => {
    const themes = themeRegistry.listThemes();
    expect(themes.length).toBeGreaterThan(0);
    expect(themes[0]).toHaveProperty('name');
    expect(themes[0]).toHaveProperty('displayName');
  });
});

describe('Token Resolver', () => {
  beforeEach(() => {
    tokenResolver.setTheme('default');
  });

  it('should resolve token values by path', () => {
    const primaryColor = tokenResolver.resolveToken('semantic.colors.color-primary');
    expect(primaryColor).toBe('#3b82f6');
  });

  it('should handle brand overrides', () => {
    tokenResolver.setBrandOverrides({
      'semantic.colors.color-primary': '#ff0000'
    });

    const primaryColor = tokenResolver.resolveToken('semantic.colors.color-primary');
    expect(primaryColor).toBe('#ff0000');
  });

  it('should return undefined for invalid paths', () => {
    const invalid = tokenResolver.resolveToken('invalid.path');
    expect(invalid).toBeUndefined();
  });

  it('should get all resolved tokens', () => {
    const tokens = tokenResolver.getAllTokens();
    expect(tokens).toHaveProperty('semantic');
    expect(tokens.semantic).toHaveProperty('colors');
  });
});

describe('Theme Initialization', () => {
  it('should initialize with default themes', () => {
    initializeThemes();
    
    const themes = themeRegistry.listThemes();
    expect(themes.some(t => t.name === 'default')).toBe(true);
    expect(themes.some(t => t.name === 'dark')).toBe(true);
    expect(themes.some(t => t.name === 'high-contrast')).toBe(true);
  });

  it('should set default as active theme', () => {
    initializeThemes();
    
    const activeTheme = themeRegistry.getActiveTheme();
    expect(activeTheme.name).toBe('default');
  });
});

describe('Brand Customization', () => {
  it('should create brand theme from customization', () => {
    const customization: BrandCustomization = {
      id: 'test-brand',
      name: 'Test Brand',
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00',
      borderRadius: '0.5rem'
    };

    const brandTheme = createBrandTheme(customization);
    
    expect(brandTheme.name).toBe('test-brand');
    expect(brandTheme.displayName).toBe('Test Brand');
    expect(brandTheme.tokens.semantic.colors['color-primary']).toBe('#ff0000');
    expect(brandTheme.tokens.semantic.borderRadius['radius-button']).toBe('0.5rem');
  });

  it('should apply custom fonts', () => {
    const customization: BrandCustomization = {
      id: 'font-brand',
      name: 'Font Brand',
      fontFamily: '"Custom Font", sans-serif'
    };

    const brandTheme = createBrandTheme(customization);
    
    const headingFont = brandTheme.tokens.semantic.typography['text-heading-1']['font-family'];
    expect(headingFont).toContain('Custom Font');
  });

  it('should handle custom tokens', () => {
    const customization: BrandCustomization = {
      id: 'custom-brand',
      name: 'Custom Brand',
      customTokens: {
        'semantic.colors.custom-brand': '#purple',
        'semantic.spacing.custom-large': '2rem'
      }
    };

    const brandTheme = createBrandTheme(customization);
    
    expect((brandTheme.tokens.semantic.colors as any)['custom-brand']).toBe('#purple');
    expect((brandTheme.tokens.semantic.spacing as any)['custom-large']).toBe('2rem');
  });
});

describe('Theme Validation', () => {
  it('should validate theme registry', () => {
    const registry = {
      themes: new Map([['default', defaultLightTheme]]),
      activeTheme: 'default',
      fallbackTheme: 'default'
    };

    const result = validateThemeRegistry(registry);
    expect(result).toHaveProperty('themes');
    expect(result).toHaveProperty('activeTheme');
  });

  it('should validate brand customization', () => {
    const customization: BrandCustomization = {
      id: 'valid-brand',
      name: 'Valid Brand',
      primaryColor: '#ff0000'
    };

    const result = validateBrandCustomization(customization);
    expect(result.id).toBe('valid-brand');
    expect(result.name).toBe('Valid Brand');
  });

  it('should validate theme-brand compatibility', () => {
    const customization: BrandCustomization = {
      id: 'compatible-brand',
      name: 'Compatible Brand',
      primaryColor: '#ff0000'
    };

    const compatibility = validateThemeBrandCompatibility(defaultLightTheme, customization);
    expect(compatibility.valid).toBe(true);
    expect(compatibility.errors).toHaveLength(0);
  });

  it('should detect incompatible colors', () => {
    const customization: BrandCustomization = {
      id: 'incompatible-brand',
      name: 'Incompatible Brand',
      primaryColor: 'invalid-color'
    };

    const compatibility = validateThemeBrandCompatibility(defaultLightTheme, customization);
    expect(compatibility.valid).toBe(false);
    expect(compatibility.errors.length).toBeGreaterThan(0);
  });
});

describe('Theme CSS Generation', () => {
  it('should generate theme-aware CSS', () => {
    initializeThemes();
    
    const cssOutput = generateThemeAwareCSS(defaultLightTheme.tokens, {
      includeThemeSwitching: true,
      includeComments: true
    });

    expect(cssOutput.baseCSS).toContain('--token-semantic');
    expect(cssOutput.runtimeCSS).toContain('theme-transition');
    expect(cssOutput.combinedCSS).toContain('/* Theme-Specific CSS */');
  });

  it('should generate CSS for specific themes', () => {
    initializeThemes();
    
    const cssOutput = generateThemeAwareCSS(defaultLightTheme.tokens, {
      themes: ['dark'],
      includeThemeSwitching: false
    });

    expect(cssOutput.themeCSS).toHaveProperty('dark');
    expect(Object.keys(cssOutput.themeCSS)).toHaveLength(1);
  });

  it('should include theme switching utilities', () => {
    initializeThemes();
    
    const cssOutput = generateThemeAwareCSS(defaultLightTheme.tokens, {
      includeThemeSwitching: true,
      themeClassPrefix: 'custom-theme'
    });

    expect(cssOutput.runtimeCSS).toContain('.custom-theme-default');
    expect(cssOutput.runtimeCSS).toContain('.theme-transition');
  });

  it('should validate generated CSS', () => {
    initializeThemes();
    
    const cssOutput = generateThemeAwareCSS(defaultLightTheme.tokens);
    
    // This would use the validation function
    expect(cssOutput.combinedCSS).toContain('--');
    expect(cssOutput.variableMap).toHaveProperty('--token-semantic-colors-color-primary');
  });
});

describe('Theme Switching', () => {
  it('should handle theme switching workflow', () => {
    initializeThemes();
    
    // Test switching to dark theme
    const success = themeRegistry.setActiveTheme('dark');
    expect(success).toBe(true);
    
    const activeTheme = themeRegistry.getActiveTheme();
    expect(activeTheme.name).toBe('dark');
    expect(activeTheme.tokens.semantic.colors['color-background']).toBe('#111827');
  });

  it('should handle invalid theme switching', () => {
    const success = themeRegistry.setActiveTheme('non-existent-theme');
    expect(success).toBe(false);
    
    // Should still be on previous theme
    const activeTheme = themeRegistry.getActiveTheme();
    expect(activeTheme.name).toBe('default');
  });
});

describe('Theme Performance', () => {
  it('should handle large token sets efficiently', () => {
    const start = performance.now();
    
    // Resolve tokens multiple times
    for (let i = 0; i < 1000; i++) {
      tokenResolver.resolveToken('semantic.colors.color-primary');
    }
    
    const end = performance.now();
    const duration = end - start;
    
    // Should complete within reasonable time (adjust threshold as needed)
    expect(duration).toBeLessThan(100); // 100ms
  });

  it('should handle theme registry operations efficiently', () => {
    initializeThemes();
    
    const start = performance.now();
    
    // List themes multiple times
    for (let i = 0; i < 100; i++) {
      themeRegistry.listThemes();
    }
    
    const end = performance.now();
    const duration = end - start;
    
    expect(duration).toBeLessThan(50); // 50ms
  });
});

describe('Theme Error Handling', () => {
  it('should handle missing themes gracefully', () => {
    const missingTheme = themeRegistry.getTheme('non-existent');
    expect(missingTheme).toBeUndefined();
  });

  it('should handle invalid token paths', () => {
    const result = tokenResolver.resolveToken('');
    expect(result).toBeUndefined();
  });

  it('should handle circular references in overrides', () => {
    // This would test for infinite loops in token resolution
    tokenResolver.setBrandOverrides({
      'semantic.colors.color-primary': '{semantic.colors.color-primary}'
    });
    
    // Should not hang or crash
    const result = tokenResolver.resolveToken('semantic.colors.color-primary');
    expect(typeof result).toBe('string');
  });
});

describe('Theme Accessibility', () => {
  it('should maintain accessibility in dark theme', () => {
    const darkThemeTokens = themeRegistry.getTheme('dark')?.tokens.semantic;
    
    if (darkThemeTokens) {
      // Check that text and background colors provide contrast
      const textColor = darkThemeTokens.colors['color-text-primary'];
      const backgroundColor = darkThemeTokens.colors['color-background'];
      
      expect(textColor).toBe('#f9fafb'); // Light text
      expect(backgroundColor).toBe('#111827'); // Dark background
    }
  });

  it('should maintain accessibility in high contrast theme', () => {
    const highContrastTheme = themeRegistry.getTheme('high-contrast')?.tokens.semantic;
    
    if (highContrastTheme) {
      const textColor = highContrastTheme.colors['color-text-primary'];
      const backgroundColor = highContrastTheme.colors['color-background'];
      
      expect(textColor).toBe('#000000'); // Pure black
      expect(backgroundColor).toBe('#ffffff'); // Pure white
    }
  });
});
