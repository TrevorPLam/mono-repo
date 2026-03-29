/**
 * Canonical URL Management System Tests
 * 
 * Comprehensive test suite for canonical URL handling following 2026 best practices
 * Uses Vitest with type-safe mocks and AAA pattern
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { CanonicalPolicy, SEOValidationResult, UrlResolutionContext } from '../../src/types/index.js';
import { 
  CanonicalUrlManager, 
  createCanonicalUrlManager,
  generateCanonicalUrl,
  validateCanonicalUrl,
  resolveCanonicalUrl,
  normalizeUrlPath,
  extractDomain,
  isAbsoluteUrl,
  type CanonicalUrlOptions
} from '../../src/canonicals/index.js';

describe('CanonicalUrlManager', () => {
  let manager: CanonicalUrlManager;
  let defaultOptions: CanonicalUrlOptions;

  beforeEach(() => {
    defaultOptions = {
      baseDomain: 'https://example.com',
      enforceHttps: true,
      removeQueryParams: true,
      allowedQueryParams: [],
      enforceTrailingSlash: false,
      removeHash: true,
      lowercase: true,
    };
    
    manager = new CanonicalUrlManager(defaultOptions);
  });

  describe('Constructor', () => {
    it('should initialize with default options', () => {
      const manager = new CanonicalUrlManager({
        baseDomain: 'https://example.com',
      });

      expect(manager).toBeInstanceOf(CanonicalUrlManager);
      
      const policy = manager.getPolicy();
      expect(policy.enforceHttps).toBe(true);
      expect(policy.removeQueryParams).toBe(true);
      expect(policy.enforceTrailingSlash).toBe(false);
    });

    it('should accept custom options', () => {
      const options: CanonicalUrlOptions = {
        baseDomain: 'https://custom.com',
        enforceHttps: false,
        removeQueryParams: false,
        allowedQueryParams: ['utm_source', 'utm_medium'],
        enforceTrailingSlash: true,
        removeHash: false,
        lowercase: false,
      };

      const manager = new CanonicalUrlManager(options);
      const policy = manager.getPolicy();

      expect(policy.baseDomain).toBe('https://custom.com');
      expect(policy.enforceHttps).toBe(false);
      expect(policy.removeQueryParams).toBe(false);
      expect(policy.allowedQueryParams).toEqual(['utm_source', 'utm_medium']);
      expect(policy.enforceTrailingSlash).toBe(true);
    });
  });

  describe('generateCanonicalUrl', () => {
    describe('Basic URL Generation', () => {
      it('should generate canonical URL for absolute URL', () => {
        const url = 'https://example.com/page';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page');
      });

      it('should generate canonical URL for relative URL', () => {
        const url = '/page';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page');
      });

      it('should handle relative URL without leading slash', () => {
        const url = 'page';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page');
      });

      it('should handle root path', () => {
        const url = '/';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/');
      });

      it('should handle empty string as root', () => {
        const url = '';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/');
      });
    });

    describe('HTTPS Enforcement', () => {
      it('should enforce HTTPS when enabled', () => {
        const url = 'http://example.com/page';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page');
      });

      it('should preserve HTTPS when already HTTPS', () => {
        const url = 'https://example.com/page';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page');
      });

      it('should not enforce HTTPS when disabled', () => {
        const manager = new CanonicalUrlManager({
          baseDomain: 'http://example.com',
          enforceHttps: false,
        });

        const url = 'http://example.com/page';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('http://example.com/page');
      });
    });

    describe('Query Parameter Handling', () => {
      it('should remove all query parameters when enabled', () => {
        const url = 'https://example.com/page?utm_source=google&utm_medium=campaign&param=value';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page');
      });

      it('should keep allowed query parameters', () => {
        const manager = new CanonicalUrlManager({
          baseDomain: 'https://example.com',
          removeQueryParams: true,
          allowedQueryParams: ['utm_source', 'page'],
        });

        const url = 'https://example.com/page?utm_source=google&utm_medium=campaign&page=2';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page?utm_source=google&page=2');
      });

      it('should keep all query parameters when disabled', () => {
        const manager = new CanonicalUrlManager({
          baseDomain: 'https://example.com',
          removeQueryParams: false,
        });

        const url = 'https://example.com/page?utm_source=google&utm_medium=campaign';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page?utm_source=google&utm_medium=campaign');
      });

      it('should handle empty query parameters', () => {
        const url = 'https://example.com/page?';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page');
      });
    });

    describe('Hash Fragment Handling', () => {
      it('should remove hash fragments when enabled', () => {
        const url = 'https://example.com/page#section';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page');
      });

      it('should keep hash fragments when disabled', () => {
        const manager = new CanonicalUrlManager({
          baseDomain: 'https://example.com',
          removeHash: false,
        });

        const url = 'https://example.com/page#section';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page#section');
      });

      it('should handle empty hash', () => {
        const url = 'https://example.com/page#';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page');
      });
    });

    describe('Trailing Slash Handling', () => {
      it('should remove trailing slash when not enforced', () => {
        const url = 'https://example.com/page/';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page');
      });

      it('should add trailing slash when enforced', () => {
        const manager = new CanonicalUrlManager({
          baseDomain: 'https://example.com',
          enforceTrailingSlash: true,
        });

        const url = 'https://example.com/page';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page/');
      });

      it('should preserve root trailing slash', () => {
        const url = 'https://example.com/';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/');
      });

      it('should handle multiple trailing slashes', () => {
        const url = 'https://example.com/page///';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page');
      });
    });

    describe('Case Handling', () => {
      it('should lowercase hostname and path when enabled', () => {
        const url = 'https://EXAMPLE.com/PAGE/Path';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page/path');
      });

      it('should preserve case when disabled', () => {
        const manager = new CanonicalUrlManager({
          baseDomain: 'https://example.com',
          lowercase: false,
        });

        const url = 'https://EXAMPLE.com/PAGE';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://EXAMPLE.com/PAGE');
      });

      it('should not lowercase query parameters', () => {
        const manager = new CanonicalUrlManager({
          baseDomain: 'https://example.com',
          removeQueryParams: false,
          lowercase: true,
        });

        const url = 'https://example.com/page?Param=Value&UPPER=CASE';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page?Param=Value&UPPER=CASE');
      });
    });

    describe('Custom Transformations', () => {
      it('should apply custom transformation function', () => {
        const manager = new CanonicalUrlManager({
          baseDomain: 'https://example.com',
          transform: (url) => {
            // Add /blog prefix to all paths
            if (!url.pathname.startsWith('/blog')) {
              url.pathname = '/blog' + url.pathname;
            }
            return url;
          },
        });

        const url = 'https://example.com/article';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/blog/article');
      });

      it('should apply transformation before other rules', () => {
        const manager = new CanonicalUrlManager({
          baseDomain: 'https://example.com',
          transform: (url) => {
            url.pathname = url.pathname.toUpperCase();
            return url;
          },
          lowercase: true,
        });

        const url = 'https://example.com/path';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/PATH');
      });
    });

    describe('Error Handling', () => {
      it('should throw error for invalid URL', () => {
        expect(() => {
          manager.generateCanonicalUrl('not-a-valid-url');
        }).toThrow('Invalid URL: not-a-valid-url');
      });

      it('should throw error for malformed URL', () => {
        expect(() => {
          manager.generateCanonicalUrl('https://[invalid-ipv6]:80/');
        }).toThrow('Invalid URL:');
      });

      it('should handle URL with special characters', () => {
        const url = 'https://example.com/page with spaces';
        const canonical = manager.generateCanonicalUrl(url);

        expect(canonical).toBe('https://example.com/page%20with%20spaces');
      });
    });
  });

  describe('validateCanonicalUrl', () => {
    describe('HTTPS Validation', () => {
      it('should validate HTTPS URL when enforced', () => {
        const url = 'https://example.com/page';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should invalidate HTTP URL when HTTPS enforced', () => {
        const url = 'http://example.com/page';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Canonical URL must use HTTPS');
      });

      it('should pass HTTP validation when HTTPS not enforced', () => {
        const manager = new CanonicalUrlManager({
          baseDomain: 'https://example.com',
          enforceHttps: false,
        });

        const url = 'http://example.com/page';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(true);
        expect(result.errors).not.toContain('Canonical URL must use HTTPS');
      });
    });

    describe('Domain Validation', () => {
      it('should validate matching domain', () => {
        const url = 'https://example.com/page';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should invalidate different domain', () => {
        const url = 'https://otherdomain.com/page';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
          "Canonical URL hostname 'otherdomain.com' does not match base domain 'example.com'"
        );
      });

      it('should invalidate subdomain when not matching base', () => {
        const url = 'https://sub.example.com/page';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
          "Canonical URL hostname 'sub.example.com' does not match base domain 'example.com'"
        );
      });
    });

    describe('Query Parameter Validation', () => {
      it('should warn about unwanted query parameters', () => {
        const url = 'https://example.com/page?utm_source=google&utm_medium=campaign';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain(
          "Canonical URL contains query parameter 'utm_source' that should be removed"
        );
        expect(result.warnings).toContain(
          "Canonical URL contains query parameter 'utm_medium' that should be removed"
        );
      });

      it('should allow allowed query parameters', () => {
        const manager = new CanonicalUrlManager({
          baseDomain: 'https://example.com',
          removeQueryParams: true,
          allowedQueryParams: ['utm_source'],
        });

        const url = 'https://example.com/page?utm_source=google&utm_medium=campaign';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(true);
        expect(result.warnings).not.toContain(
          "Canonical URL contains query parameter 'utm_source' that should be removed"
        );
        expect(result.warnings).toContain(
          "Canonical URL contains query parameter 'utm_medium' that should be removed"
        );
      });

      it('should not validate query parameters when removal disabled', () => {
        const manager = new CanonicalUrlManager({
          baseDomain: 'https://example.com',
          removeQueryParams: false,
        });

        const url = 'https://example.com/page?param=value';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(true);
        expect(result.warnings).not.toContain(
          expect.stringMatching(/query parameter/)
        );
      });
    });

    describe('Trailing Slash Validation', () => {
      it('should warn about missing trailing slash when enforced', () => {
        const manager = new CanonicalUrlManager({
          baseDomain: 'https://example.com',
          enforceTrailingSlash: true,
        });

        const url = 'https://example.com/page';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain('Canonical URL should end with trailing slash');
      });

      it('should warn about extra trailing slash when not enforced', () => {
        const url = 'https://example.com/page/';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain('Canonical URL should not end with trailing slash');
      });

      it('should validate root path correctly', () => {
        const url = 'https://example.com/';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(true);
        expect(result.warnings).not.toContain(
          expect.stringMatching(/trailing slash/)
        );
      });
    });

    describe('Hash Fragment Validation', () => {
      it('should warn about hash fragments when removal enabled', () => {
        const url = 'https://example.com/page#section';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain('Canonical URL should not contain hash fragments');
      });

      it('should not warn about hash fragments when removal disabled', () => {
        const manager = new CanonicalUrlManager({
          baseDomain: 'https://example.com',
          removeHash: false,
        });

        const url = 'https://example.com/page#section';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(true);
        expect(result.warnings).not.toContain(
          expect.stringMatching(/hash fragments/)
        );
      });
    });

    describe('Case Validation', () => {
      it('should warn about uppercase when lowercase enforced', () => {
        const url = 'https://EXAMPLE.com/PAGE';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain('Canonical URL should be lowercase');
      });

      it('should not warn about case when lowercase disabled', () => {
        const manager = new CanonicalUrlManager({
          baseDomain: 'https://example.com',
          lowercase: false,
        });

        const url = 'https://EXAMPLE.com/PAGE';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(true);
        expect(result.warnings).not.toContain(
          expect.stringMatching(/should be lowercase/)
        );
      });
    });

    describe('Invalid URL Validation', () => {
      it('should handle invalid URL format', () => {
        const url = 'not-a-valid-url';
        const result = manager.validateCanonicalUrl(url);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(expect.stringMatching(/Invalid canonical URL format/));
      });
    });
  });

  describe('resolveCanonicalUrl', () => {
    it('should resolve relative URL to absolute', () => {
      const context: UrlResolutionContext = {
        url: '/page',
        domain: 'example.com',
        protocol: 'https',
      };

      const canonical = manager.resolveCanonicalUrl(context);

      expect(canonical).toBe('https://example.com/page');
    });

    it('should resolve relative URL without leading slash', () => {
      const context: UrlResolutionContext = {
        url: 'page',
        domain: 'example.com',
        protocol: 'https',
      };

      const canonical = manager.resolveCanonicalUrl(context);

      expect(canonical).toBe('https://example.com/page');
    });

    it('should preserve absolute URL', () => {
      const context: UrlResolutionContext = {
        url: 'https://example.com/page',
        domain: 'example.com',
        protocol: 'https',
      };

      const canonical = manager.resolveCanonicalUrl(context);

      expect(canonical).toBe('https://example.com/page');
    });

    it('should handle locale in context', () => {
      const context: UrlResolutionContext = {
        url: '/page',
        domain: 'example.com',
        protocol: 'https',
        locale: 'en-US',
      };

      const canonical = manager.resolveCanonicalUrl(context);

      expect(canonical).toBe('https://example.com/page');
    });
  });

  describe('areCanonicallyEquivalent', () => {
    it('should return true for equivalent URLs', () => {
      const url1 = 'https://example.com/page';
      const url2 = 'https://example.com/page/';

      expect(manager.areCanonicallyEquivalent(url1, url2)).toBe(true);
    });

    it('should return true for URLs with different query params', () => {
      const url1 = 'https://example.com/page';
      const url2 = 'https://example.com/page?utm_source=google';

      expect(manager.areCanonicallyEquivalent(url1, url2)).toBe(true);
    });

    it('should return true for URLs with different case', () => {
      const url1 = 'https://example.com/page';
      const url2 = 'https://EXAMPLE.com/PAGE';

      expect(manager.areCanonicallyEquivalent(url1, url2)).toBe(true);
    });

    it('should return false for different paths', () => {
      const url1 = 'https://example.com/page1';
      const url2 = 'https://example.com/page2';

      expect(manager.areCanonicallyEquivalent(url1, url2)).toBe(false);
    });

    it('should return false for invalid URLs', () => {
      const url1 = 'not-a-valid-url';
      const url2 = 'https://example.com/page';

      expect(manager.areCanonicallyEquivalent(url1, url2)).toBe(false);
    });
  });

  describe('Policy Management', () => {
    it('should return current policy', () => {
      const policy = manager.getPolicy();

      expect(policy.baseDomain).toBe('https://example.com');
      expect(policy.enforceHttps).toBe(true);
      expect(policy.removeQueryParams).toBe(true);
      expect(policy.allowedQueryParams).toEqual([]);
      expect(policy.enforceTrailingSlash).toBe(false);
    });

    it('should update policy', () => {
      const updates: Partial<CanonicalPolicy> = {
        enforceHttps: false,
        enforceTrailingSlash: true,
        allowedQueryParams: ['utm_source'],
      };

      manager.updatePolicy(updates);
      const policy = manager.getPolicy();

      expect(policy.enforceHttps).toBe(false);
      expect(policy.enforceTrailingSlash).toBe(true);
      expect(policy.allowedQueryParams).toEqual(['utm_source']);
    });
  });
});

describe('Utility Functions', () => {
  describe('createCanonicalUrlManager', () => {
    it('should create CanonicalUrlManager instance', () => {
      const manager = createCanonicalUrlManager({
        baseDomain: 'https://example.com',
      });

      expect(manager).toBeInstanceOf(CanonicalUrlManager);
    });
  });

  describe('generateCanonicalUrl', () => {
    it('should generate canonical URL using options', () => {
      const options: CanonicalUrlOptions = {
        baseDomain: 'https://example.com',
        removeQueryParams: true,
      };

      const canonical = generateCanonicalUrl('https://example.com/page?param=value', options);

      expect(canonical).toBe('https://example.com/page');
    });
  });

  describe('validateCanonicalUrl', () => {
    it('should validate canonical URL using options', () => {
      const options: CanonicalUrlOptions = {
        baseDomain: 'https://example.com',
        enforceHttps: true,
      };

      const result = validateCanonicalUrl('http://example.com/page', options);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Canonical URL must use HTTPS');
    });
  });

  describe('resolveCanonicalUrl', () => {
    it('should resolve relative URL to absolute canonical URL', () => {
      const canonical = resolveCanonicalUrl('/page', 'https://example.com');

      expect(canonical).toBe('https://example.com/page');
    });

    it('should use HTTP protocol when specified', () => {
      const canonical = resolveCanonicalUrl('/page', 'http://example.com', 'http');

      expect(canonical).toBe('http://example.com/page');
    });
  });

  describe('normalizeUrlPath', () => {
    it('should add leading slash if missing', () => {
      const path = normalizeUrlPath('page');
      expect(path).toBe('/page');
    });

    it('should preserve leading slash', () => {
      const path = normalizeUrlPath('/page');
      expect(path).toBe('/page');
    });

    it('should remove trailing slash by default', () => {
      const path = normalizeUrlPath('/page/');
      expect(path).toBe('/page');
    });

    it('should add trailing slash when requested', () => {
      const path = normalizeUrlPath('/page', true);
      expect(path).toBe('/page/');
    });

    it('should preserve root path', () => {
      const path = normalizeUrlPath('/');
      expect(path).toBe('/');
    });

    it('should remove multiple consecutive slashes', () => {
      const path = normalizeUrlPath('//page//path//');
      expect(path).toBe('/page/path');
    });
  });

  describe('extractDomain', () => {
    it('should extract domain from HTTPS URL', () => {
      const domain = extractDomain('https://example.com/page');
      expect(domain).toBe('example.com');
    });

    it('should extract domain from HTTP URL', () => {
      const domain = extractDomain('http://subdomain.example.com:8080/path');
      expect(domain).toBe('subdomain.example.com');
    });

    it('should throw error for invalid URL', () => {
      expect(() => {
        extractDomain('not-a-valid-url');
      }).toThrow('Invalid URL: not-a-valid-url');
    });
  });

  describe('isAbsoluteUrl', () => {
    it('should return true for absolute URLs', () => {
      expect(isAbsoluteUrl('https://example.com/page')).toBe(true);
      expect(isAbsoluteUrl('http://example.com/page')).toBe(true);
      expect(isAbsoluteUrl('ftp://example.com/file')).toBe(true);
    });

    it('should return false for relative URLs', () => {
      expect(isAbsoluteUrl('/page')).toBe(false);
      expect(isAbsoluteUrl('page')).toBe(false);
      expect(isAbsoluteUrl('./page')).toBe(false);
      expect(isAbsoluteUrl('../page')).toBe(false);
    });

    it('should return false for invalid URLs', () => {
      expect(isAbsoluteUrl('not-a-url')).toBe(false);
      expect(isAbsoluteUrl('')).toBe(false);
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complete canonical URL workflow', () => {
    const manager = new CanonicalUrlManager({
      baseDomain: 'https://example.com',
      enforceHttps: true,
      removeQueryParams: true,
      allowedQueryParams: ['utm_source'],
      enforceTrailingSlash: true,
      removeHash: true,
      lowercase: true,
    });

    // Test various URL formats
    const testCases = [
      {
        input: 'https://EXAMPLE.com/PAGE?utm_source=google&utm_medium=campaign#section',
        expected: 'https://example.com/page/?utm_source=google',
      },
      {
        input: '/relative/path',
        expected: 'https://example.com/relative/path/',
      },
      {
        input: 'http://example.com/old-path?param=value',
        expected: 'https://example.com/old-path/',
      },
    ];

    testCases.forEach(({ input, expected }) => {
      const canonical = manager.generateCanonicalUrl(input);
      expect(canonical).toBe(expected);
      
      const validation = manager.validateCanonicalUrl(canonical);
      expect(validation.valid).toBe(true);
    });
  });

  it('should handle e-commerce product URLs', () => {
    const manager = new CanonicalUrlManager({
      baseDomain: 'https://store.example.com',
      enforceHttps: true,
      removeQueryParams: true,
      allowedQueryParams: ['page', 'sort'],
      enforceTrailingSlash: false,
      removeHash: true,
      lowercase: true,
    });

    const productUrls = [
      'https://STORE.EXAMPLE.COM/products/wireless-headphones?page=2&sort=price#reviews',
      '/products/laptop-stand?color=black&utm_source=adwords',
      'https://store.example.com/collections/electronics/',
    ];

    productUrls.forEach(url => {
      const canonical = manager.generateCanonicalUrl(url);
      const validation = manager.validateCanonicalUrl(canonical);
      
      expect(validation.valid).toBe(true);
      expect(canonical).toMatch(/^https:\/\/store\.example\.com\/[a-z0-9\/-]*$/);
    });
  });

  it('should handle blog article URLs with date patterns', () => {
    const manager = new CanonicalUrlManager({
      baseDomain: 'https://blog.example.com',
      enforceHttps: true,
      removeQueryParams: true,
      enforceTrailingSlash: true,
      removeHash: true,
      lowercase: true,
      transform: (url) => {
        // Ensure blog posts have proper date structure
        if (url.pathname.match(/^\/\d{4}\/\d{2}\//)) {
          return url; // Already has date structure
        }
        // Add current date for posts without date
        const now = new Date();
        const datePath = `/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
        url.pathname = datePath + url.pathname;
        return url;
      },
    });

    const articleUrls = [
      '/technical-seo-guide',
      'https://BLOG.EXAMPLE.COM/2026/03/performance-optimization',
      '/how-to-implement-analytics?utm_source=newsletter',
    ];

    articleUrls.forEach(url => {
      const canonical = manager.generateCanonicalUrl(url);
      const validation = manager.validateCanonicalUrl(canonical);
      
      expect(validation.valid).toBe(true);
      expect(canonical).toMatch(/\/\d{4}\/\d{2}\//); // Should contain date pattern
    });
  });

  it('should handle multilingual site URLs', () => {
    const manager = new CanonicalUrlManager({
      baseDomain: 'https://example.com',
      enforceHttps: true,
      removeQueryParams: true,
      enforceTrailingSlash: false,
      removeHash: true,
      lowercase: true,
      transform: (url) => {
        // Ensure language prefix is present
        if (!url.pathname.match(/^\/[a-z]{2}\//)) {
          url.pathname = '/en' + url.pathname;
        }
        return url;
      },
    });

    const multilingualUrls = [
      '/page',
      'https://example.com/es/articulo',
      '/fr/article?lang=fr',
    ];

    multilingualUrls.forEach(url => {
      const canonical = manager.generateCanonicalUrl(url);
      const validation = manager.validateCanonicalUrl(canonical);
      
      expect(validation.valid).toBe(true);
      expect(canonical).toMatch(/^\/[a-z]{2}\//); // Should have language prefix
    });
  });
});
