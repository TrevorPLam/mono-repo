/**
 * URL Resolution Tests
 * 
 * Comprehensive test suite for advanced URL resolution and canonicalization covering:
 * - URL resolution and canonicalization
 * - Protocol and domain preferences
 * - Path normalization
 * - Query parameter processing
 * - URL equivalence checking
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  AdvancedUrlResolver,
  createAdvancedUrlResolver,
  resolveCanonicalUrl,
  areUrlsEquivalent,
} from '../../src/resolution/index.js';
import type { UrlResolutionContext } from '../../src/types/index.js';
import type { UrlResolutionOptions } from '../../src/resolution/index.js';

describe('AdvancedUrlResolver', () => {
  let resolver: AdvancedUrlResolver;
  let defaultContext: UrlResolutionContext;

  beforeEach(() => {
    const defaultOptions: UrlResolutionOptions = {
      preferredProtocol: 'https',
      preferredDomain: 'non-www',
      trailingSlash: false,
      lowercase: true,
      removeQueryParams: true,
      allowedQueryParams: [],
    };

    resolver = createAdvancedUrlResolver(defaultOptions);
    defaultContext = {
      url: 'https://example.com/test-page',
      domain: 'example.com',
      protocol: 'https',
      locale: 'en-US',
    };
  });

  describe('Constructor and Configuration', () => {
    it('should create resolver with default options', () => {
      const defaultResolver = new AdvancedUrlResolver();
      
      expect(defaultResolver).toBeInstanceOf(AdvancedUrlResolver);
    });

    it('should create resolver with custom options', () => {
      const customOptions: UrlResolutionOptions = {
        preferredProtocol: 'http',
        preferredDomain: 'www',
        trailingSlash: true,
        lowercase: false,
        removeQueryParams: false,
        allowedQueryParams: ['utm_source', 'utm_medium'],
      };

      const customResolver = new AdvancedUrlResolver(customOptions);
      
      expect(customResolver).toBeInstanceOf(AdvancedUrlResolver);
    });

    it('should merge custom options with defaults', () => {
      const partialOptions = {
        preferredProtocol: 'http' as const,
        trailingSlash: true,
      };

      const resolver = new AdvancedUrlResolver(partialOptions);
      
      // Should use custom values for specified options
      expect(resolver.resolveUrl('/test', defaultContext)).toContain('http://');
      
      // Should use defaults for unspecified options
      expect(resolver.resolveUrl('/TEST', defaultContext)).toContain('/test'); // lowercase enabled by default
    });
  });

  describe('URL Resolution', () => {
    it('should resolve relative URLs', () => {
      const result = resolver.resolveUrl('/test-page', defaultContext);
      
      expect(result).toBe('https://example.com/test-page');
    });

    it('should resolve absolute URLs', () => {
      const result = resolver.resolveUrl('https://example.com/absolute', defaultContext);
      
      expect(result).toBe('https://example.com/absolute');
    });

    it('should resolve URLs with query parameters', () => {
      const result = resolver.resolveUrl('/test?param=value&other=test', defaultContext);
      
      expect(result).toBe('https://example.com/test');
    });

    it('should resolve URLs with fragments', () => {
      const result = resolver.resolveUrl('/test#section', defaultContext);
      
      expect(result).toBe('https://example.com/test');
    });

    it('should handle URLs with both query and fragment', () => {
      const result = resolver.resolveUrl('/test?param=value#section', defaultContext);
      
      expect(result).toBe('https://example.com/test');
    });
  });

  describe('Protocol Preferences', () => {
    it('should enforce HTTPS preference', () => {
      const httpsResolver = new AdvancedUrlResolver({ preferredProtocol: 'https' });
      
      const result = httpsResolver.resolveUrl('http://example.com/test', defaultContext);
      
      expect(result).toBe('https://example.com/test');
    });

    it('should enforce HTTP preference', () => {
      const httpResolver = new AdvancedUrlResolver({ preferredProtocol: 'http' });
      
      const result = httpResolver.resolveUrl('https://example.com/test', defaultContext);
      
      expect(result).toBe('http://example.com/test');
    });

    it('should preserve protocol when already preferred', () => {
      const result = resolver.resolveUrl('https://example.com/test', defaultContext);
      
      expect(result).toBe('https://example.com/test');
    });
  });

  describe('Domain Preferences', () => {
    it('should enforce non-www preference', () => {
      const nonWwwResolver = new AdvancedUrlResolver({ preferredDomain: 'non-www' });
      
      const result = nonWwwResolver.resolveUrl('https://www.example.com/test', defaultContext);
      
      expect(result).toBe('https://example.com/test');
    });

    it('should enforce www preference', () => {
      const wwwResolver = new AdvancedUrlResolver({ preferredDomain: 'www' });
      
      const result = wwwResolver.resolveUrl('https://example.com/test', defaultContext);
      
      expect(result).toBe('https://www.example.com/test');
    });

    it('should preserve domain when already preferred', () => {
      const result = resolver.resolveUrl('https://example.com/test', defaultContext);
      
      expect(result).toBe('https://example.com/test');
    });

    it('should handle subdomains correctly', () => {
      const result = resolver.resolveUrl('https://sub.example.com/test', defaultContext);
      
      expect(result).toBe('https://sub.example.com/test'); // Subdomains preserved
    });
  });

  describe('Trailing Slash Preferences', () => {
    it('should remove trailing slash when not preferred', () => {
      const noSlashResolver = new AdvancedUrlResolver({ trailingSlash: false });
      
      const result = noSlashResolver.resolveUrl('https://example.com/test/', defaultContext);
      
      expect(result).toBe('https://example.com/test');
    });

    it('should add trailing slash when preferred', () => {
      const slashResolver = new AdvancedUrlResolver({ trailingSlash: true });
      
      const result = slashResolver.resolveUrl('https://example.com/test', defaultContext);
      
      expect(result).toBe('https://example.com/test/');
    });

    it('should handle root path correctly', () => {
      const slashResolver = new AdvancedUrlResolver({ trailingSlash: true });
      
      const result = slashResolver.resolveUrl('https://example.com/', defaultContext);
      
      expect(result).toBe('https://example.com/');
    });

    it('should preserve trailing slash when already correct', () => {
      const slashResolver = new AdvancedUrlResolver({ trailingSlash: true });
      
      const result = slashResolver.resolveUrl('https://example.com/test/', defaultContext);
      
      expect(result).toBe('https://example.com/test/');
    });
  });

  describe('Case Normalization', () => {
    it('should convert to lowercase when enabled', () => {
      const lowercaseResolver = new AdvancedUrlResolver({ lowercase: true });
      
      const result = lowercaseResolver.resolveUrl('https://EXAMPLE.com/TEST-PATH', defaultContext);
      
      expect(result).toBe('https://example.com/test-path');
    });

    it('should preserve case when disabled', () => {
      const caseResolver = new AdvancedUrlResolver({ lowercase: false });
      
      const result = caseResolver.resolveUrl('https://EXAMPLE.com/TEST-PATH', defaultContext);
      
      expect(result).toBe('https://EXAMPLE.com/TEST-PATH');
    });

    it('should handle mixed case correctly', () => {
      const result = resolver.resolveUrl('https://Example.Com/Test-Path', defaultContext);
      
      expect(result).toBe('https://example.com/test-path');
    });
  });

  describe('Query Parameter Processing', () => {
    it('should remove all query parameters when removeQueryParams is true', () => {
      const removeResolver = new AdvancedUrlResolver({ 
        removeQueryParams: true,
        allowedQueryParams: [],
      });
      
      const result = removeResolver.resolveUrl('https://example.com/test?utm_source=google&utm_medium=campaign&param=value', defaultContext);
      
      expect(result).toBe('https://example.com/test');
    });

    it('should keep allowed query parameters', () => {
      const allowResolver = new AdvancedUrlResolver({
        removeQueryParams: true,
        allowedQueryParams: ['utm_source', 'utm_medium'],
      });
      
      const result = allowResolver.resolveUrl('https://example.com/test?utm_source=google&utm_medium=campaign&param=value', defaultContext);
      
      expect(result).toBe('https://example.com/test?utm_source=google&utm_medium=campaign');
    });

    it('should preserve all query parameters when removeQueryParams is false', () => {
      const preserveResolver = new AdvancedUrlResolver({ removeQueryParams: false });
      
      const result = preserveResolver.resolveUrl('https://example.com/test?utm_source=google&utm_medium=campaign', defaultContext);
      
      expect(result).toBe('https://example.com/test?utm_source=google&utm_medium=campaign');
    });

    it('should handle empty query parameters', () => {
      const result = resolver.resolveUrl('https://example.com/test?', defaultContext);
      
      expect(result).toBe('https://example.com/test');
    });

    it('should handle multiple query parameters with same name', () => {
      const result = resolver.resolveUrl('https://example.com/test?param=value1&param=value2', defaultContext);
      
      expect(result).toBe('https://example.com/test');
    });
  });

  describe('Path Normalization', () => {
    it('should normalize multiple slashes', () => {
      const result = resolver.resolveUrl('https://example.com//test//path', defaultContext);
      
      expect(result).toBe('https://example.com/test/path');
    });

    it('should handle dot segments', () => {
      const result = resolver.resolveUrl('https://example.com/test/./path', defaultContext);
      
      expect(result).toBe('https://example.com/test/path');
    });

    it('should handle double dot segments', () => {
      const result = resolver.resolveUrl('https://example.com/test/../path', defaultContext);
      
      expect(result).toBe('https://example.com/path');
    });

    it('should handle complex path normalization', () => {
      const result = resolver.resolveUrl('https://example.com/test/./sub/../path/./file', defaultContext);
      
      expect(result).toBe('https://example.com/test/path/file');
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid URLs', () => {
      const invalidUrls = [
        '',
        'not-a-url',
        'ftp://example.com/file',
        'javascript:alert(1)',
      ];

      invalidUrls.forEach(url => {
        expect(() => resolver.resolveUrl(url, defaultContext)).toThrow();
      });
    });

    it('should handle malformed context gracefully', () => {
      const malformedContext: UrlResolutionContext = {
        url: '/test',
        domain: '',
        protocol: 'https' as const,
      };

      expect(() => resolver.resolveUrl('/test', malformedContext)).not.toThrow();
    });
  });
});

describe('URL Equivalence', () => {
  describe('areUrlsEquivalent', () => {
    const testContext: UrlResolutionContext = {
      url: 'https://example.com/test',
      domain: 'example.com',
      protocol: 'https',
    };

    it('should detect equivalent URLs', () => {
      const equivalentPairs = [
        ['https://example.com/test', 'https://example.com/test'],
        ['https://example.com/test/', 'https://example.com/test'],
        ['https://www.example.com/test', 'https://example.com/test'],
        ['https://EXAMPLE.com/test', 'https://example.com/test'],
        ['https://example.com/test?utm_source=google', 'https://example.com/test'],
        ['https://example.com/test#section', 'https://example.com/test'],
      ];

      equivalentPairs.forEach(([url1, url2]) => {
        expect(areUrlsEquivalent(url1, url2, testContext)).toBe(true);
      });
    });

    it('should detect non-equivalent URLs', () => {
      const nonEquivalentPairs = [
        ['https://example.com/test', 'https://example.com/other'],
        ['https://example.com/test', 'https://other.com/test'],
        ['https://example.com/test?param=value', 'https://example.com/test?param=other'],
        ['http://example.com/test', 'https://example.com/test'],
      ];

      nonEquivalentPairs.forEach(([url1, url2]) => {
        expect(areUrlsEquivalent(url1, url2, testContext)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      expect(areUrlsEquivalent('', '', testContext)).toBe(true);
      expect(areUrlsEquivalent('https://example.com', '', testContext)).toBe(false);
      expect(areUrlsEquivalent('https://example.com', 'not-a-url', testContext)).toBe(false);
    });
  });
});

describe('resolveCanonicalUrl Factory Function', () => {
  it('should resolve canonical URL with default options', () => {
    const context: UrlResolutionContext = {
      url: 'https://www.example.com/Test/Page/?utm_source=google#section',
      domain: 'example.com',
      protocol: 'https',
    };

    const result = resolveCanonicalUrl(context.url, context);

    expect(result).toBe('https://example.com/test/page');
  });

  it('should resolve canonical URL with custom options', () => {
    const options: UrlResolutionOptions = {
      preferredProtocol: 'https',
      preferredDomain: 'www',
      trailingSlash: true,
      lowercase: true,
      removeQueryParams: false,
    };

    const context: UrlResolutionContext = {
      url: 'http://example.com/test?param=value',
      domain: 'example.com',
      protocol: 'http',
    };

    const result = resolveCanonicalUrl(context.url, context, options);

    expect(result).toBe('https://www.example.com/test/?param=value');
  });

  it('should handle relative URLs in context', () => {
    const context: UrlResolutionContext = {
      url: '/test/page',
      domain: 'example.com',
      protocol: 'https',
    };

    const result = resolveCanonicalUrl(context.url, context);

    expect(result).toBe('https://example.com/test/page');
  });
});

describe('createAdvancedUrlResolver Factory Function', () => {
  it('should create AdvancedUrlResolver instance', () => {
    const resolver = createAdvancedUrlResolver();
    
    expect(resolver).toBeInstanceOf(AdvancedUrlResolver);
  });

  it('should create resolver with custom options', () => {
    const options: UrlResolutionOptions = {
      preferredProtocol: 'http',
      preferredDomain: 'www',
    };

    const resolver = createAdvancedUrlResolver(options);
    
    expect(resolver).toBeInstanceOf(AdvancedUrlResolver);
  });
});

describe('Integration with Context', () => {
  it('should use context domain for relative URLs', () => {
    const context: UrlResolutionContext = {
      url: '/relative-path',
      domain: 'context-domain.com',
      protocol: 'https',
    };

    const testResolver = createAdvancedUrlResolver();
    const result = testResolver.resolveUrl(context.url, context);

    expect(result).toBe('https://context-domain.com/relative-path');
  });

  it('should use context protocol', () => {
    const context: UrlResolutionContext = {
      url: '/test',
      domain: 'example.com',
      protocol: 'http',
    };

    const testResolver = createAdvancedUrlResolver();
    const result = testResolver.resolveUrl(context.url, context);

    expect(result).toBe('https://example.com/test'); // Resolver prefers HTTPS
  });

  it('should handle context with additional properties', () => {
    const context: UrlResolutionContext = {
      url: '/test',
      domain: 'example.com',
      protocol: 'https',
      locale: 'en-US',
      customProperty: 'custom-value',
    };

    const testResolver = createAdvancedUrlResolver();
    const result = testResolver.resolveUrl(context.url, context);

    expect(result).toBe('https://example.com/test');
  });
});

describe('Edge Cases and Complex Scenarios', () => {
  let testResolver: AdvancedUrlResolver;
  
  beforeEach(() => {
    testResolver = createAdvancedUrlResolver();
  });

  it('should handle international domain names', () => {
    const context: UrlResolutionContext = {
      url: 'https://测试.com/test',
      domain: '测试.com',
      protocol: 'https',
    };
    
    const result = testResolver.resolveUrl('https://测试.com/test', context);
    
    expect(result).toBe('https://测试.com/test');
  });

  it('should handle very long URLs', () => {
    const context: UrlResolutionContext = {
      url: '/test',
      domain: 'example.com',
      protocol: 'https',
    };
    
    const longPath = '/'.repeat(100) + 'test';
    const result = testResolver.resolveUrl(`https://example.com${longPath}`, context);
    
    expect(result).toContain('https://example.com');
    expect(result).toContain('/test');
  });

  it('should handle URLs with special characters', () => {
    const context: UrlResolutionContext = {
      url: '/test',
      domain: 'example.com',
      protocol: 'https',
    };
    
    const specialUrl = 'https://example.com/test-path_with-special.chars%20and%20spaces';
    const result = testResolver.resolveUrl(specialUrl, context);
    
    expect(result).toBe('https://example.com/test-path_with-special.chars%20and%20spaces');
  });

  it('should handle port numbers', () => {
    const context: UrlResolutionContext = {
      url: '/test',
      domain: 'example.com',
      protocol: 'https',
    };
    
    const result = testResolver.resolveUrl('https://example.com:8080/test', context);
    
    expect(result).toBe('https://example.com:8080/test');
  });

  it('should handle authentication in URLs', () => {
    const context: UrlResolutionContext = {
      url: '/test',
      domain: 'example.com',
      protocol: 'https',
    };
    
    const result = testResolver.resolveUrl('https://user:pass@example.com/test', context);
    
    expect(result).toBe('https://user:pass@example.com/test');
  });
});
