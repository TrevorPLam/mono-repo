/**
 * Canonical URL Manager Tests
 * 
 * Comprehensive test suite for canonical URL management covering:
 * - Canonical URL generation
 * - URL normalization and validation
 * - HTTPS enforcement
 * - Query parameter handling
 * - Trailing slash management
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  CanonicalUrlManager,
  createCanonicalUrlManager,
  generateCanonicalUrl,
  validateCanonicalUrl,
  resolveCanonicalUrl as resolveCanonicalUrlFromManager,
  normalizeUrlPath,
  isAbsoluteUrl,
} from '../../src/canonicals/index.js';
import type { CanonicalUrlOptions } from '../../src/canonicals/index.js';

describe('CanonicalUrlManager', () => {
  let manager: CanonicalUrlManager;
  let defaultOptions: CanonicalUrlOptions;

  beforeEach(() => {
    defaultOptions = {
      baseDomain: 'https://example.com',
      enforceHttps: true,
      removeQueryParams: true,
      allowedQueryParams: ['utm_source', 'utm_medium', 'utm_campaign'],
      enforceTrailingSlash: false,
    };
    
    manager = createCanonicalUrlManager(defaultOptions);
  });

  describe('Constructor and Configuration', () => {
    it('should create manager with default options', () => {
      const defaultManager = new CanonicalUrlManager();
      
      expect(defaultManager).toBeInstanceOf(CanonicalUrlManager);
    });

    it('should create manager with custom options', () => {
      const customManager = new CanonicalUrlManager({
        baseDomain: 'https://custom.com',
        enforceTrailingSlash: true,
        removeQueryParams: false,
      });
      
      expect(customManager).toBeInstanceOf(CanonicalUrlManager);
    });
  });

  describe('Canonical URL Generation', () => {
    it('should generate canonical URL from relative path', () => {
      const result = manager.generateCanonical('/page');
      
      expect(result).toBe('https://example.com/page');
    });

    it('should generate canonical URL from absolute URL', () => {
      const result = manager.generateCanonical('https://example.com/page');
      
      expect(result).toBe('https://example.com/page');
    });

    it('should enforce HTTPS', () => {
      const result = manager.generateCanonical('http://example.com/page');
      
      expect(result).toBe('https://example.com/page');
    });

    it('should remove query parameters by default', () => {
      const result = manager.generateCanonical('/page?param=value&other=test');
      
      expect(result).toBe('https://example.com/page');
    });

    it('should keep allowed query parameters', () => {
      const result = manager.generateCanonical('/page?utm_source=google&utm_medium=cpc&other=test');
      
      expect(result).toBe('https://example.com/page?utm_source=google&utm_medium=cpc');
    });

    it('should add trailing slash when enforced', () => {
      const slashManager = new CanonicalUrlManager({
        ...defaultOptions,
        enforceTrailingSlash: true,
      });
      
      const result = slashManager.generateCanonical('/page');
      
      expect(result).toBe('https://example.com/page/');
    });

    it('should remove trailing slash when not enforced', () => {
      const result = manager.generateCanonical('/page/');
      
      expect(result).toBe('https://example.com/page');
    });

    it('should handle complex paths', () => {
      const testCases = [
        { input: '/category/product', expected: 'https://example.com/category/product' },
        { input: '/category/subcategory/product', expected: 'https://example.com/category/subcategory/product' },
        { input: '/category/product/', expected: 'https://example.com/category/product' },
        { input: '/', expected: 'https://example.com/' },
        { input: '', expected: 'https://example.com/' },
      ];
      
      testCases.forEach(({ input, expected }) => {
        const result = manager.generateCanonical(input);
        expect(result).toBe(expected);
      });
    });

    it('should handle URL encoding', () => {
      const result = manager.generateCanonical('/page with spaces');
      
      expect(result).toBe('https://example.com/page%20with%20spaces');
    });
  });

  describe('URL Validation', () => {
    it('should validate correct canonical URLs', () => {
      const validUrls = [
        'https://example.com/page',
        'https://example.com/category/product',
        'https://example.com/page?utm_source=google',
      ];
      
      validUrls.forEach(url => {
        const result = manager.validateCanonical(url);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject HTTP URLs when HTTPS enforced', () => {
      const result = manager.validateCanonical('http://example.com/page');
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Canonical URL must use HTTPS');
    });

    it('should allow HTTP URLs when HTTPS not enforced', () => const noHttpsManager = new CanonicalUrlManager({
        ...defaultOptions,
        enforceHttps: false,
      });
      
      const result = noHttpsManager.validateCanonical('http://example.com/page');
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate base domain matching', () => {
      const result = manager.validateCanonical('https://different-site.com/page');
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        expect.stringContaining('does not match base domain')
      );
    });

    it('should warn about disallowed query parameters', () => {
      const result = manager.validateCanonical('https://example.com/page?param=value&other=test');
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain(
        expect.stringContaining('query parameter \'param\' that should be removed')
      );
      expect(result.warnings).toContain(
        expect.stringContaining('query parameter \'other\' that should be removed')
      );
    });

    it('should allow allowed query parameters', () => {
      const result = manager.validateCanonical('https://example.com/page?utm_source=google&utm_medium=cpc');
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should warn about missing trailing slash when enforced', () => {
      const slashManager = new CanonicalUrlManager({
        ...defaultOptions,
        enforceTrailingSlash: true,
      });
      
      const result = slashManager.validateCanonical('https://example.com/page');
      
      expect(result.warnings).toContain('Canonical URL should end with trailing slash');
    });

    it('should handle invalid URL formats', () => {
      const invalidUrls = [
        'not-a-url',
        'javascript:alert(1)',
        'ftp://example.com/file',
        '',
      ];
      
      invalidUrls.forEach(url => {
        const result = manager.validateCanonical(url);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('URL Resolution', () => {
    it('should resolve relative URLs to absolute', () => {
      const result = manager.resolveCanonical('/page');
      
      expect(result).toBe('https://example.com/page');
    });

    it('should resolve absolute URLs with validation', () => {
      const result = manager.resolveCanonical('https://example.com/page');
      
      expect(result).toBe('https://example.com/page');
    });

    it('should return null for invalid URLs', () => {
      const result = (manager as any).resolveCanonical('not-a-valid-url');
      
      expect(result).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings', () => {
      const generateResult = manager.generateCanonical('');
      const validateResult = manager.validateCanonical('');
      
      expect(generateResult).toBe('https://example.com/');
      expect(validateResult.valid).toBe(false);
    });

    it('should handle null/undefined inputs', () => {
      expect(() => manager.generateCanonical(null as any)).not.toThrow();
      expect(() => manager.generateCanonical(undefined as any)).not.toThrow();
      expect(() => manager.validateCanonical(null as any)).not.toThrow();
      expect(() => manager.validateCanonical(undefined as any)).not.toThrow();
    });

    it('should handle special characters in paths', () => {
      const testCases = [
        { input: '/page-with-dashes', expected: 'https://example.com/page-with-dashes' },
        { input: '/page_with_underscores', expected: 'https://example.com/page_with_underscores' },
        { input: '/page.with.dots', expected: 'https://example.com/page.with.dots' },
        { input: '/page+with+plus', expected: 'https://example.com/page+with+plus' },
      ];
      
      testCases.forEach(({ input, expected }) => {
        const result = manager.generateCanonical(input);
        expect(result).toBe(expected);
      });
    });

    it('should handle Unicode characters', () => {
      const result = manager.generateCanonical('/page-with-émojis-🎉');
      
      expect(result).toContain('page-with-%C3%A9mojis-%F0%9F%8E%89');
    });

    it('should handle very long URLs', () => {
      const longPath = '/' + 'a'.repeat(1000);
      
      expect(() => manager.generateCanonical(longPath)).not.toThrow();
      
      const result = manager.generateCanonical(longPath);
      expect(result).toContain('example.com');
    });
  });
});

describe('Utility Functions', () => {
  describe('generateCanonicalUrl', () => {
    it('should generate canonical URL using default options', () => {
      const result = generateCanonicalUrl('/page', 'https://example.com');
      
      expect(result).toBe('https://example.com/page');
    });

    it('should use custom options', () => {
      const options: CanonicalUrlOptions = {
        baseDomain: 'https://custom.com',
        enforceTrailingSlash: true,
      };
      
      const result = generateCanonicalUrl('/page', options.baseDomain, options);
      
      expect(result).toBe('https://custom.com/page/');
    });
  });

  describe('validateCanonicalUrl', () => {
    it('should validate canonical URL with default options', () => {
      const result = validateCanonicalUrl('https://example.com/page');
      
      expect(result.valid).toBe(true);
    });

    it('should validate with custom options', () => {
      const options: CanonicalUrlOptions = {
        baseDomain: 'https://custom.com',
        enforceHttps: true,
      };
      
      const result = validateCanonicalUrl('https://custom.com/page', options);
      
      expect(result.valid).toBe(true);
    });

    it('should reject URLs with different domain', () => {
      const options: CanonicalUrlOptions = {
        baseDomain: 'https://example.com',
      };
      
      const result = validateCanonicalUrl('https://different.com/page', options);
      
      expect(result.valid).toBe(false);
    });
  });

  describe('resolveCanonicalUrl', () => {
    it('should resolve canonical URL correctly', () => {
      const result = resolveCanonicalUrlFromManager('/page', 'https://example.com');
      
      expect(result).toBe('https://example.com/page');
    });

    it('should return null for invalid URLs', () => {
      const result = resolveCanonicalUrlFromManager('not-a-url', 'https://example.com');
      
      expect(result).toBeNull();
    });
  });

  describe('normalizeUrlPath', () => {
    it('should normalize URL paths', () => {
      const testCases = [
        { input: '//double//slash', expected: '/double/slash' },
        { input: 'no-leading-slash', expected: '/no-leading-slash' },
        { input: '/trailing/slash/', expected: '/trailing/slash' },
        { input: '/', expected: '/' },
        { input: '', expected: '/' },
      ];
      
      testCases.forEach(({ input, expected }) => {
        const result = normalizeUrlPath(input);
        expect(result).toBe(expected);
      });
    });

    it('should handle URL encoded characters', () => {
      const result = normalizeUrlPath('/page%20with%20spaces');
      
      expect(result).toBe('/page%20with%20spaces');
    });
  });

  describe('isAbsoluteUrl', () => {
    it('should identify absolute URLs correctly', () => {
      const absoluteUrls = [
        'https://example.com/page',
        'http://example.com/page',
        'ftp://example.com/file',
        '//example.com/page',
      ];
      
      absoluteUrls.forEach(url => {
        expect(isAbsoluteUrl(url)).toBe(true);
      });
    });

    it('should identify relative URLs correctly', () => {
      const relativeUrls = [
        '/page',
        'page',
        '../page',
        './page',
        '?query=value',
        '#fragment',
      ];
      
      relativeUrls.forEach(url => {
        expect(isAbsoluteUrl(url)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      const edgeCases = [
        { input: '', expected: false },
        { input: 'not-a-url', expected: false },
        { input: '://invalid', expected: false },
      ];
      
      edgeCases.forEach(({ input, expected }) => {
        expect(isAbsoluteUrl(input)).toBe(expected);
      });
    });
  });
});

describe('Factory Functions', () => {
  describe('createCanonicalUrlManager', () => {
    it('should create CanonicalUrlManager instance', () => {
      const manager = createCanonicalUrlManager();
      
      expect(manager).toBeInstanceOf(CanonicalUrlManager);
    });

    it('should create manager with custom options', () => {
      const options: CanonicalUrlOptions = {
        baseDomain: 'https://custom.com',
        enforceTrailingSlash: true,
      };
      
      const manager = createCanonicalUrlManager(options);
      
      expect(manager).toBeInstanceOf(CanonicalUrlManager);
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complete workflow', () => {
    const manager = createCanonicalUrlManager({
      baseDomain: 'https://example.com',
      enforceHttps: true,
      removeQueryParams: true,
      allowedQueryParams: ['utm_source'],
      enforceTrailingSlash: true,
    });
    
    // Generate canonical
    const canonical = manager.generateCanonical('/page?utm_source=google&other=test');
    expect(canonical).toBe('https://example.com/page/?utm_source=google');
    
    // Validate canonical
    const validation = manager.validateCanonical(canonical);
    expect(validation.valid).toBe(true);
    expect(validation.warnings).toHaveLength(0);
    
    // Resolve canonical
    const resolved = manager.resolveCanonical(canonical);
    expect(resolved).toBe(canonical);
  });

  it('should handle multiple operations consistently', () => {
    const testUrls = [
      '/page',
      '/category/product',
      '/page?utm_source=google&utm_medium=cpc',
      'https://example.com/absolute/path',
    ];
    
    testUrls.forEach(url => {
      const canonical = manager.generateCanonical(url);
      const validation = manager.validateCanonical(canonical);
      
      expect(canonical).toBeTruthy();
      expect(canonical).toMatch(/^https:\/\/example\.com/);
      expect(validation.valid).toBe(true);
    });
  });
});
