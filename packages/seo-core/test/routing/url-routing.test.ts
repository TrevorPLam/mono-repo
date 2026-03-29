/**
 * URL Routing Tests
 * 
 * Comprehensive test suite for SEO routing utilities covering:
 * - URL resolution and absolute URL generation
 * - Path extraction and domain extraction
 * - Path normalization
 * - Context-aware URL handling
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  UrlResolver,
  createUrlResolver,
  resolveUrl,
  extractPath as extractPathFromUrl,
  extractDomain as extractDomainFromUrl,
} from '../../src/routing/index.js';
import type { UrlResolutionContext } from '../../src/types/index.js';
import type { UrlResolutionOptions } from '../../src/routing/index.js';

describe('UrlResolver', () => {
  let resolver: UrlResolver;
  let defaultOptions: UrlResolutionOptions;

  beforeEach(() => {
    defaultOptions = {
      domain: 'https://example.com',
      protocol: 'https',
      defaultLocale: 'en-US',
      normalizePath: {
        removeTrailingSlash: false,
        lowercase: true,
      },
    };
    
    resolver = createUrlResolver(defaultOptions);
  });

  describe('Constructor and Configuration', () => {
    it('should create resolver with default options', () => {
      const defaultResolver = new UrlResolver({
        domain: 'https://test.com',
      });
      
      expect(defaultResolver).toBeInstanceOf(UrlResolver);
    });

    it('should create resolver with custom options', () => {
      const customOptions: UrlResolutionOptions = {
        domain: 'https://custom.com',
        protocol: 'http',
        defaultLocale: 'fr-FR',
        normalizePath: {
          removeTrailingSlash: true,
          lowercase: false,
        },
      };

      const customResolver = new UrlResolver(customOptions);
      
      expect(customResolver).toBeInstanceOf(UrlResolver);
    });

    it('should merge custom options with defaults', () => {
      const partialOptions = {
        domain: 'https://partial.com',
        protocol: 'http' as const,
      };

      const resolver = new UrlResolver(partialOptions);
      
      // Should use custom values for specified options
      const result = resolver.resolveUrl('/test');
      expect(result).toContain('http://partial.com');
      
      // Should use defaults for unspecified options
      expect(result).toContain('/test'); // lowercase enabled by default
    });
  });

  describe('URL Resolution', () => {
    it('should resolve relative URLs to absolute', () => {
      const result = resolver.resolveUrl('/test-page');
      
      expect(result).toBe('https://example.com/test-page');
    });

    it('should handle relative URLs without leading slash', () => {
      const result = resolver.resolveUrl('test-page');
      
      expect(result).toBe('https://example.com/test-page');
    });

    it('should preserve absolute URLs', () => {
      const absoluteUrl = 'https://external.com/test-page';
      const result = resolver.resolveUrl(absoluteUrl);
      
      expect(result).toBe(absoluteUrl);
    });

    it('should handle HTTP absolute URLs', () => {
      const httpUrl = 'http://external.com/test-page';
      const result = resolver.resolveUrl(httpUrl);
      
      expect(result).toBe(httpUrl);
    });

    it('should handle complex relative paths', () => {
      const result = resolver.resolveUrl('/category/subcategory/product');
      
      expect(result).toBe('https://example.com/category/subcategory/product');
    });

    it('should handle URLs with query parameters', () => {
      const result = resolver.resolveUrl('/search?q=test&category=all');
      
      expect(result).toBe('https://example.com/search?q=test&category=all');
    });

    it('should handle URLs with fragments', () => {
      const result = resolver.resolveUrl('/page#section');
      
      expect(result).toBe('https://example.com/page#section');
    });

    it('should handle root path', () => {
      const result = resolver.resolveUrl('/');
      
      expect(result).toBe('https://example.com/');
    });

    it('should handle empty path', () => {
      const result = resolver.resolveUrl('');
      
      expect(result).toBe('https://example.com/');
    });
  });

  describe('Context-Aware Resolution', () => {
    it('should use context domain when provided', () => {
      const context: Partial<UrlResolutionContext> = {
        domain: 'context-domain.com',
        protocol: 'https',
      };

      const result = resolver.resolveUrl('/test', context);
      
      expect(result).toBe('https://context-domain.com/test');
    });

    it('should use context protocol when provided', () => {
      const context: Partial<UrlResolutionContext> = {
        domain: 'example.com',
        protocol: 'http',
      };

      const result = resolver.resolveUrl('/test', context);
      
      expect(result).toBe('http://example.com/test');
    });

    it('should fall back to resolver options when context not provided', () => {
      const result = resolver.resolveUrl('/test');
      
      expect(result).toBe('https://example.com/test');
    });

    it('should override resolver options with context', () => {
      const context: Partial<UrlResolutionContext> = {
        domain: 'override.com',
        protocol: 'http',
      };

      const result = resolver.resolveUrl('/test', context);
      
      expect(result).toBe('http://override.com/test');
    });

    it('should handle partial context', () => {
      const context: Partial<UrlResolutionContext> = {
        domain: 'partial.com',
        // protocol missing, should use default
      };

      const result = resolver.resolveUrl('/test', context);
      
      expect(result).toBe('https://partial.com/test');
    });
  });

  describe('Path Normalization', () => {
    it('should convert to lowercase when enabled', () => {
      const lowercaseResolver = new UrlResolver({
        domain: 'https://example.com',
        normalizePath: {
          removeTrailingSlash: false,
          lowercase: true,
        },
      });

      const result = lowercaseResolver.resolveUrl('/TEST-PATH');
      
      expect(result).toBe('https://example.com/test-path');
    });

    it('should preserve case when disabled', () => {
      const caseResolver = new UrlResolver({
        domain: 'https://example.com',
        normalizePath: {
          removeTrailingSlash: false,
          lowercase: false,
        },
      });

      const result = caseResolver.resolveUrl('/TEST-PATH');
      
      expect(result).toBe('https://example.com/TEST-PATH');
    });

    it('should remove trailing slash when enabled', () => {
      const slashResolver = new UrlResolver({
        domain: 'https://example.com',
        normalizePath: {
          removeTrailingSlash: true,
          lowercase: true,
        },
      });

      const result = slashResolver.resolveUrl('/test-path/');
      
      expect(result).toBe('https://example.com/test-path');
    });

    it('should preserve trailing slash when disabled', () => {
      const noSlashResolver = new UrlResolver({
        domain: 'https://example.com',
        normalizePath: {
          removeTrailingSlash: false,
          lowercase: true,
        },
      });

      const result = noSlashResolver.resolveUrl('/test-path/');
      
      expect(result).toBe('https://example.com/test-path/');
    });

    it('should handle root path with trailing slash removal', () => {
      const slashResolver = new UrlResolver({
        domain: 'https://example.com',
        normalizePath: {
          removeTrailingSlash: true,
          lowercase: true,
        },
      });

      const result = slashResolver.resolveUrl('/');
      
      expect(result).toBe('https://example.com/');
    });

    it('should normalize multiple slashes', () => {
      const result = resolver.resolveUrl('//test//path//');
      
      expect(result).toBe('https://example.com/test/path');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty URL', () => {
      const result = resolver.resolveUrl('');
      
      expect(result).toBe('https://example.com/');
    });

    it('should handle only slashes', () => {
      const result = resolver.resolveUrl('///');
      
      expect(result).toBe('https://example.com/');
    });

    it('should handle URLs with special characters', () => {
      const specialUrl = '/test-path_with-special.chars%20and%20spaces';
      const result = resolver.resolveUrl(specialUrl);
      
      expect(result).toBe('https://example.com/test-path_with-special.chars%20and%20spaces');
    });

    it('should handle Unicode characters', () => {
      const unicodeUrl = '/测试路径';
      const result = resolver.resolveUrl(unicodeUrl);
      
      expect(result).toBe('https://example.com/测试路径');
    });

    it('should handle very long URLs', () => {
      const longPath = '/'.repeat(100) + 'test';
      const result = resolver.resolveUrl(longPath);
      
      expect(result).toContain('https://example.com');
      expect(result).toContain('/test');
    });
  });
});

describe('Path Extraction', () => {
  describe('extractPath', () => {
    it('should extract path from valid URL', () => {
      const path = extractPathFromUrl('https://example.com/test/path/page');
      
      expect(path).toBe('/test/path/page');
    });

    it('should extract path from URL with query', () => {
      const path = extractPathFromUrl('https://example.com/test/path?param=value&other=test');
      
      expect(path).toBe('/test/path');
    });

    it('should extract path from URL with fragment', () => {
      const path = extractPathFromUrl('https://example.com/test/path#section');
      
      expect(path).toBe('/test/path');
    });

    it('should extract path from URL with both query and fragment', () => {
      const path = extractPathFromUrl('https://example.com/test/path?param=value#section');
      
      expect(path).toBe('/test/path');
    });

    it('should handle root path', () => {
      const path = extractPathFromUrl('https://example.com/');
      
      expect(path).toBe('/');
    });

    it('should handle URL without path', () => {
      const path = extractPathFromUrl('https://example.com');
      
      expect(path).toBe('/');
    });

    it('should handle URLs with port', () => {
      const path = extractPathFromUrl('https://example.com:8080/test/path');
      
      expect(path).toBe('/test/path');
    });

    it('should handle URLs with authentication', () => {
      const path = extractPathFromUrl('https://user:pass@example.com/test/path');
      
      expect(path).toBe('/test/path');
    });

    it('should return input string when not a valid URL', () => {
      const path = extractPathFromUrl('/not/a/url');
      
      expect(path).toBe('/not/a/url');
    });

    it('should handle empty string', () => {
      const path = extractPathFromUrl('');
      
      expect(path).toBe('');
    });

    it('should handle relative URLs', () => {
      const path = extractPathFromUrl('/relative/path');
      
      expect(path).toBe('/relative/path');
    });

    it('should handle complex paths with dots', () => {
      const path = extractPathFromUrl('https://example.com/test/../path/./file');
      
      expect(path).toBe('/test/../path/./file');
    });
  });
});

describe('Domain Extraction', () => {
  describe('extractDomain', () => {
    it('should extract domain from valid URL', () => {
      const domain = extractDomainFromUrl('https://example.com/test/path');
      
      expect(domain).toBe('example.com');
    });

    it('should extract domain from URL with www', () => {
      const domain = extractDomainFromUrl('https://www.example.com/test');
      
      expect(domain).toBe('www.example.com');
    });

    it('should extract domain from HTTP URL', () => {
      const domain = extractDomainFromUrl('http://example.com/test');
      
      expect(domain).toBe('example.com');
    });

    it('should extract domain from URL with port', () => {
      const domain = extractDomainFromUrl('https://example.com:8080/test');
      
      expect(domain).toBe('example.com');
    });

    it('should extract domain from URL with authentication', () => {
      const domain = extractDomainFromUrl('https://user:pass@example.com/test');
      
      expect(domain).toBe('example.com');
    });

    it('should handle root domain', () => {
      const domain = extractDomainFromUrl('https://example.com/');
      
      expect(domain).toBe('example.com');
    });

    it('should handle URL without path', () => {
      const domain = extractDomainFromUrl('https://example.com');
      
      expect(domain).toBe('example.com');
    });

    it('should handle subdomains', () => {
      const domain = extractDomainFromUrl('https://sub.example.com/test');
      
      expect(domain).toBe('sub.example.com');
    });

    it('should handle complex subdomains', () => {
      const domain = extractDomainFromUrl('https://api.v2.example.com/test');
      
      expect(domain).toBe('api.v2.example.com');
    });

    it('should return empty string for invalid URLs', () => {
      const domain = extractDomainFromUrl('not-a-url');
      
      expect(domain).toBe('');
    });

    it('should return empty string for empty input', () => {
      const domain = extractDomainFromUrl('');
      
      expect(domain).toBe('');
    });

    it('should handle relative URLs', () => {
      const domain = extractDomainFromUrl('/relative/path');
      
      expect(domain).toBe('');
    });

    it('should handle international domain names', () => {
      const domain = extractDomainFromUrl('https://测试.com/test');
      
      expect(domain).toBe('测试.com');
    });
  });
});

describe('Factory Functions', () => {
  describe('createUrlResolver', () => {
    it('should create UrlResolver instance', () => {
      const resolver = createUrlResolver({
        domain: 'https://factory.com',
      });
      
      expect(resolver).toBeInstanceOf(UrlResolver);
    });

    it('should create resolver with default options', () => {
      const resolver = createUrlResolver({
        domain: 'https://test.com',
      });
      
      const result = resolver.resolveUrl('/test');
      expect(result).toBe('https://test.com/test');
    });
  });

  describe('resolveUrl factory function', () => {
    it('should resolve URL with default options', () => {
      const result = resolveUrl('/test', {
        domain: 'https://factory.com',
        protocol: 'https',
      });

      expect(result).toBe('https://factory.com/test');
    });

    it('should resolve URL with custom options', () => {
      const options: UrlResolutionOptions = {
        domain: 'https://custom.com',
        protocol: 'http',
        normalizePath: {
          removeTrailingSlash: true,
          lowercase: false,
        },
      };

      const result = resolveUrl('/TEST-PATH/', options);
      
      expect(result).toBe('http://custom.com/TEST-PATH');
    });

    it('should use context when provided', () => {
      const options: UrlResolutionOptions = {
        domain: 'https://context.com',
        protocol: 'https',
      };

      const result = resolveUrl('/test', options);
      
      expect(result).toBe('https://context.com/test');
    });

    it('should fall back to options when context not provided', () => {
      const options: UrlResolutionOptions = {
        domain: 'https://options.com',
        protocol: 'https',
      };

      const result = resolveUrl('/test', options);
      
      expect(result).toBe('https://options.com/test');
    });
  });
});

describe('Integration Tests', () => {
  let testResolver: UrlResolver;

  beforeEach(() => {
    testResolver = createUrlResolver({
      domain: 'https://example.com',
      protocol: 'https',
    });
  });

  it('should work together with path and domain extraction', () => {
    const originalUrl = 'https://example.com/test/path/page';
    
    const path = extractPathFromUrl(originalUrl);
    const domain = extractDomainFromUrl(originalUrl);
    
    expect(path).toBe('/test/path/page');
    expect(domain).toBe('example.com');
    
    // Reconstruct URL using resolver
    const reconstructed = testResolver.resolveUrl(path);
    
    expect(reconstructed).toBe(originalUrl);
  });

  it('should handle complex URL scenarios', () => {
    const complexUrl = 'https://user:pass@sub.example.com:8080/api/v1/users?active=true#admin';
    
    const path = extractPathFromUrl(complexUrl);
    const domain = extractDomainFromUrl(complexUrl);
    
    expect(path).toBe('/api/v1/users');
    expect(domain).toBe('sub.example.com');
    
    const resolver = createUrlResolver({
      domain: `https://${domain}`,
      protocol: 'https',
    });
    
    const resolved = resolver.resolveUrl(path);
    expect(resolved).toBe('https://sub.example.com/api/v1/users');
  });

  it('should maintain consistency across operations', () => {
    const testCases = [
      '/simple/path',
      '/complex/path/with/segments',
      '/path-with-dashes',
      '/path_with_underscores',
      '/path+with+plus',
      '/path%20with%20spaces',
    ];

    testCases.forEach(testPath => {
      const resolved = testResolver.resolveUrl(testPath);
      const extractedPath = extractPathFromUrl(resolved);
      const extractedDomain = extractDomainFromUrl(resolved);
      
      expect(extractedPath).toBe(testPath);
      expect(extractedDomain).toBe('example.com');
    });
  });
});

describe('Error Handling and Edge Cases', () => {
  let testResolver: UrlResolver;

  beforeEach(() => {
    testResolver = createUrlResolver({
      domain: 'https://example.com',
      protocol: 'https',
    });
  });

  it('should handle malformed URLs gracefully', () => {
    const malformedUrls = [
      'https://',
      'http://',
      'ftp://example.com',
      'javascript:alert(1)',
      'not-a-url-at-all',
    ];

    malformedUrls.forEach(url => {
      expect(() => extractPathFromUrl(url)).not.toThrow();
      expect(() => extractDomainFromUrl(url)).not.toThrow();
    });
  });

  it('should handle null and undefined inputs', () => {
    expect(() => extractPathFromUrl(null as any)).not.toThrow();
    expect(() => extractPathFromUrl(undefined as any)).not.toThrow();
    expect(() => extractDomainFromUrl(null as any)).not.toThrow();
    expect(() => extractDomainFromUrl(undefined as any)).not.toThrow();
  });

  it('should handle very long URLs', () => {
    const longPath = '/'.repeat(1000) + 'test';
    const longUrl = `https://example.com${longPath}`;
    
    const path = extractPathFromUrl(longUrl);
    const domain = extractDomainFromUrl(longUrl);
    
    expect(path).toBe(longPath);
    expect(domain).toBe('example.com');
  });

  it('should handle URLs with many query parameters', () => {
    const urlWithManyParams = '/test?param1=value1&param2=value2&param3=value3&param4=value4';
    const result = testResolver.resolveUrl(urlWithManyParams);
    
    expect(result).toBe('https://example.com/test?param1=value1&param2=value2&param3=value3&param4=value4');
  });
});
