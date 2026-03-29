/**
 * SEO Policy Engine Tests
 * 
 * Comprehensive test suite for the SEO policy engine covering:
 * - Policy configuration and validation
 * - Metadata validation
 * - Canonical URL validation
 * - Sitemap inclusion rules
 * - Robots.txt generation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  SEOPolicyEngine, 
  createSEOPolicyEngine, 
  SEOPolicySchema 
} from '../../src/policy/index.js';
import type { SEOPolicy, SEOMetadata } from '../../src/types/index.js';

describe('SEOPolicyEngine', () => {
  let engine: SEOPolicyEngine;
  let testPolicy: Partial<SEOPolicy>;

  beforeEach(() => {
    testPolicy = {
      global: {
        enforceTrailingSlash: false,
        titleTemplate: '%s | Test Site',
        maxTitleLength: 60,
        maxDescriptionLength: 160,
        defaultLocale: 'en-US',
        enableStructuredData: true,
        enableHreflang: true,
      },
      canonical: {
        baseDomain: 'https://example.com',
        enforceHttps: true,
        removeQueryParams: true,
        allowedQueryParams: ['utm_source'],
        enforceTrailingSlash: false,
      },
      sitemap: {
        defaultChangeFreq: 'weekly',
        defaultPriority: 0.8,
        excludePatterns: ['/admin/**', '/api/**'],
        includeOnlyPatterns: [],
        maxUrlsPerSitemap: 50000,
        enableImageSitemap: true,
        enableNewsSitemap: false,
      },
      robots: {
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: ['/admin/', '/api/'],
          },
        ],
        sitemaps: ['https://example.com/sitemap.xml'],
      },
      metadata: {
        required: ['title', 'description'],
        recommended: ['og:type', 'og:url', 'canonical'],
        customRules: [],
      },
    };
    
    engine = createSEOPolicyEngine(testPolicy);
  });

  describe('Constructor and Configuration', () => {
    it('should create engine with default policy when no policy provided', () => {
      const defaultEngine = new SEOPolicyEngine();
      const policy = defaultEngine.getPolicy();
      
      expect(policy.global?.maxTitleLength).toBe(60);
      expect(policy.global?.maxDescriptionLength).toBe(160);
      expect(policy.canonical?.baseDomain).toBe('https://example.com');
    });

    it('should create engine with custom policy', () => {
      const policy = engine.getPolicy();
      
      expect(policy.global?.titleTemplate).toBe('%s | Test Site');
      expect(policy.canonical?.baseDomain).toBe('https://example.com');
      expect(policy.sitemap?.defaultPriority).toBe(0.8);
    });

    it('should validate policy schema on creation', () => {
      expect(() => {
        new SEOPolicyEngine({
          global: {
            maxTitleLength: 10, // Too short, below minimum
          },
        });
      }).toThrow();
    });

    it('should update policy correctly', () => {
      engine.updatePolicy({
        global: {
          maxTitleLength: 70,
        },
      });
      
      const policy = engine.getPolicy();
      expect(policy.global?.maxTitleLength).toBe(70);
    });
  });

  describe('Metadata Validation', () => {
    it('should validate valid metadata successfully', () => {
      const validMetadata: SEOMetadata = {
        title: 'Test Page Title',
        description: 'This is a test page description that meets the length requirements and provides good context.',
        canonical: 'https://example.com/test-page',
        'og:type': 'website',
        'og:url': 'https://example.com/test-page',
        'og:title': 'Test Page Title',
        'og:description': 'This is a test page description.',
        'og:image': 'https://example.com/image.jpg',
        'twitter:card': 'summary_large_image',
        robots: 'index,follow',
      };

      const result = engine.validateMetadata(validMetadata);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should report missing required fields', () => {
      const incompleteMetadata: SEOMetadata = {
        title: 'Test Title',
        // Missing description
      };

      const result = engine.validateMetadata(incompleteMetadata);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Required metadata field \'description\' is missing');
    });

    it('should warn about title length issues', () => {
      const longTitleMetadata: SEOMetadata = {
        title: 'This title is way too long and exceeds the maximum recommended length for SEO purposes',
        description: 'Valid description length here.',
      };

      const result = engine.validateMetadata(longTitleMetadata);
      
      expect(result.warnings).toContain(
        expect.stringContaining('exceeds recommended length')
      );
    });

    it('should warn about short title', () => {
      const shortTitleMetadata: SEOMetadata = {
        title: 'Short',
        description: 'Valid description length here with enough characters to meet minimum requirements.',
      };

      const result = engine.validateMetadata(shortTitleMetadata);
      
      expect(result.warnings).toContain('Title is too short (minimum 30 characters recommended)');
    });

    it('should warn about description length issues', () => {
      const longDescMetadata: SEOMetadata = {
        title: 'Valid Title Length Here',
        description: 'This description is way too long and exceeds the maximum recommended length for meta descriptions which should be concise and compelling while staying within the SEO best practice guidelines.',
      };

      const result = engine.validateMetadata(longDescMetadata);
      
      expect(result.warnings).toContain(
        expect.stringContaining('exceeds recommended length')
      );
    });

    it('should warn about short description', () => {
      const shortDescMetadata: SEOMetadata = {
        title: 'Valid Title Length Here',
        description: 'Too short',
      };

      const result = engine.validateMetadata(shortDescMetadata);
      
      expect(result.warnings).toContain('Description is too short (minimum 100 characters recommended)');
    });

    it('should warn about inconsistent Open Graph tags', () => {
      const inconsistentMetadata: SEOMetadata = {
        title: 'Original Title',
        description: 'Valid description length here.',
        'og:title': 'Different Title',
        'og:description': 'Different description here.',
      };

      const result = engine.validateMetadata(inconsistentMetadata);
      
      expect(result.warnings).toContain('og:title differs from title');
      expect(result.warnings).toContain('og:description differs from description');
    });

    it('should validate Twitter Card types', () => {
      const invalidTwitterMetadata: SEOMetadata = {
        title: 'Valid Title',
        description: 'Valid description length here.',
        'twitter:card': 'invalid_type',
      };

      const result = engine.validateMetadata(invalidTwitterMetadata);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid twitter:card value: invalid_type');
    });

    it('should warn about missing recommended fields', () => {
      const minimalMetadata: SEOMetadata = {
        title: 'Valid Title Length Here',
        description: 'Valid description length here with enough characters.',
      };

      const result = engine.validateMetadata(minimalMetadata);
      
      expect(result.warnings).toContain('Recommended metadata field \'og:type\' is missing');
      expect(result.warnings).toContain('Recommended metadata field \'og:url\' is missing');
      expect(result.warnings).toContain('Recommended metadata field \'canonical\' is missing');
    });
  });

  describe('Canonical URL Validation', () => {
    it('should validate correct canonical URL', () => {
      const result = engine.validateCanonicalUrl('https://example.com/test-page');
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should enforce HTTPS requirement', () => {
      const result = engine.validateCanonicalUrl('http://example.com/test-page');
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Canonical URL must use HTTPS');
    });

    it('should validate base domain matching', () => {
      const result = engine.validateCanonicalUrl('https://different-site.com/test-page');
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        expect.stringContaining('does not match base domain')
      );
    });

    it('should warn about disallowed query parameters', () => {
      const result = engine.validateCanonicalUrl('https://example.com/test-page?utm_source=google&campaign=spring');
      
      expect(result.warnings).toContain(
        expect.stringContaining('query parameter \'campaign\' that should be removed')
      );
    });

    it('should allow allowed query parameters', () => {
      const result = engine.validateCanonicalUrl('https://example.com/test-page?utm_source=google');
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should warn about missing trailing slash when enforced', () => {
      engine.updatePolicy({
        canonical: {
          ...testPolicy.canonical!,
          enforceTrailingSlash: true,
        },
      });

      const result = engine.validateCanonicalUrl('https://example.com/test-page');
      
      expect(result.warnings).toContain('Canonical URL should end with trailing slash');
    });

    it('should handle invalid URL format', () => {
      const result = engine.validateCanonicalUrl('not-a-valid-url');
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid canonical URL format');
    });
  });

  describe('Sitemap Inclusion Rules', () => {
    it('should include URLs by default', () => {
      const result = engine.shouldIncludeInSitemap('https://example.com/regular-page');
      
      expect(result).toBe(true);
    });

    it('should exclude URLs matching exclude patterns', () => {
      expect(engine.shouldIncludeInSitemap('https://example.com/admin/dashboard')).toBe(false);
      expect(engine.shouldIncludeInSitemap('https://example.com/api/users')).toBe(false);
      expect(engine.shouldIncludeInSitemap('https://example.com/admin/settings')).toBe(false);
    });

    it('should handle wildcard patterns correctly', () => {
      expect(engine.shouldIncludeInSitemap('https://example.com/admin/sub/page')).toBe(false);
      expect(engine.shouldIncludeInSitemap('https://example.com/api/v1/users')).toBe(false);
    });

    it('should respect include-only patterns when specified', () => {
      engine.updatePolicy({
        sitemap: {
          ...testPolicy.sitemap!,
          includeOnlyPatterns: ['/blog/**', '/products/**'],
        },
      });

      expect(engine.shouldIncludeInSitemap('https://example.com/blog/post-1')).toBe(true);
      expect(engine.shouldIncludeInSitemap('https://example.com/products/item-1')).toBe(true);
      expect(engine.shouldIncludeInSitemap('https://example.com/about')).toBe(false);
    });

    it('should get appropriate sitemap defaults', () => {
      const shallowUrl = 'https://example.com/page';
      const deepUrl = 'https://example.com/category/subcategory/page';
      const blogUrl = 'https://example.com/blog/post-title';

      const shallowDefaults = engine.getSitemapDefaults(shallowUrl);
      const deepDefaults = engine.getSitemapDefaults(deepUrl);
      const blogDefaults = engine.getSitemapDefaults(blogUrl);

      expect(shallowDefaults.priority).toBe(0.8);
      expect(deepDefaults.priority).toBeLessThan(0.8);
      expect(blogDefaults.priority).toBeLessThan(0.8);
      
      expect(shallowDefaults.changeFreq).toBe('weekly');
    });
  });

  describe('Robots.txt Generation', () => {
    it('should generate valid robots.txt', () => {
      const robotsTxt = engine.generateRobotsTxt();
      
      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Allow: /');
      expect(robotsTxt).toContain('Disallow: /admin/');
      expect(robotsTxt).toContain('Disallow: /api/');
      expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap.xml');
    });

    it('should handle multiple user agents', () => {
      engine.updatePolicy({
        robots: {
          userAgentRules: [
            {
              userAgent: '*',
              allow: ['/'],
              disallow: ['/private/'],
            },
            {
              userAgent: 'Googlebot',
              allow: ['/'],
              disallow: ['/no-google/'],
              crawlDelay: 1,
            },
          ],
          sitemaps: [],
        },
      });

      const robotsTxt = engine.generateRobotsTxt();
      
      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('User-agent: Googlebot');
      expect(robotsTxt).toContain('Crawl-delay: 1');
    });

    it('should include host directive when specified', () => {
      engine.updatePolicy({
        robots: {
          ...testPolicy.robots!,
          host: 'example.com',
        },
      });

      const robotsTxt = engine.generateRobotsTxt();
      
      expect(robotsTxt).toContain('Host: example.com');
    });

    it('should return empty string when no robots policy', () => {
      const emptyEngine = new SEOPolicyEngine({ robots: undefined });
      const robotsTxt = emptyEngine.generateRobotsTxt();
      
      expect(robotsTxt).toBe('');
    });
  });

  describe('Pattern Matching', () => {
    it('should match wildcard patterns correctly', () => {
      // Access private method through type assertion for testing
      const engineAny = engine as any;
      
      expect(engineAny.matchesPattern('/admin/dashboard', '/admin/**')).toBe(true);
      expect(engineAny.matchesPattern('/admin/users/edit', '/admin/**')).toBe(true);
      expect(engineAny.matchesPattern('/api/v1/users', '/api/**')).toBe(true);
      expect(engineAny.matchesPattern('/about', '/admin/**')).toBe(false);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty metadata gracefully', () => {
      const result = engine.validateMetadata({});
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle null/undefined values', () => {
      expect(() => engine.validateMetadata(null as any)).not.toThrow();
      expect(() => engine.validateMetadata(undefined as any)).not.toThrow();
    });

    it('should handle malformed URLs in canonical validation', () => {
      const malformedUrls = [
        '',
        'not-a-url',
        'ftp://example.com/file',
        'javascript:alert(1)',
      ];

      malformedUrls.forEach(url => {
        const result = engine.validateCanonicalUrl(url);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('SEOPolicySchema Validation', () => {
  it('should validate valid policy schema', () => {
    const validPolicy = {
      global: {
        maxTitleLength: 60,
        maxDescriptionLength: 160,
      },
      canonical: {
        baseDomain: 'https://example.com',
      },
    };

    expect(() => SEOPolicySchema.parse(validPolicy)).not.toThrow();
  });

  it('should reject invalid policy schema', () => {
    const invalidPolicies = [
      { global: { maxTitleLength: 10 } }, // Too short
      { global: { maxDescriptionLength: 50 } }, // Too short  
      { canonical: { baseDomain: 'not-a-url' } }, // Invalid URL
      { sitemap: { defaultPriority: 2 } }, // Priority too high
      { sitemap: { maxUrlsPerSitemap: 100000 } }, // Too many URLs
    ];

    invalidPolicies.forEach(policy => {
      expect(() => SEOPolicySchema.parse(policy)).toThrow();
    });
  });
});

describe('createSEOPolicyEngine Factory', () => {
  it('should create SEOPolicyEngine instance', () => {
    const engine = createSEOPolicyEngine();
    
    expect(engine).toBeInstanceOf(SEOPolicyEngine);
  });

  it('should create engine with custom policy', () => {
    const customPolicy = {
      global: {
        titleTemplate: '%s | Custom Site',
      },
    };

    const engine = createSEOPolicyEngine(customPolicy);
    const policy = engine.getPolicy();
    
    expect(policy.global?.titleTemplate).toBe('%s | Custom Site');
  });
});
