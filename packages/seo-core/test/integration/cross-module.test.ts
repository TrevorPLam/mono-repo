/**
 * Cross-Module Integration Tests
 * 
 * Comprehensive test suite for testing integration between different SEO modules:
 * - Policy engine integration with other modules
 * - End-to-end SEO workflows
 * - Cross-module data flow and consistency
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  // Policy and Configuration
  createSEOPolicyEngine,
  createSEOConfigManager,
  
  // Metadata and Schema
  createMetadataNormalizer,
  normalizeMetadata,
  createSchemaGenerator,
  
  // URL handling
  createAdvancedUrlResolver,
  createUrlResolver,
  
  // Sitemap and Robots
  createSitemapGenerator,
  generateSitemap,
  createSitemapUrl,
  createRobotsTxtManager,
} from '../../src/index.js';
import type { 
  SEOPolicy, 
  SEOMetadata, 
  SEOConfig,
  UrlResolutionContext,
  SitemapUrl,
} from '../../src/types/index.js';

describe('Cross-Module Integration Tests', () => {
  let policyEngine: ReturnType<typeof createSEOPolicyEngine>;
  let configManager: ReturnType<typeof createSEOConfigManager>;
  let metadataNormalizer: ReturnType<typeof createMetadataNormalizer>;
  let schemaGenerator: ReturnType<typeof createSchemaGenerator>;
  let urlResolver: ReturnType<typeof createAdvancedUrlResolver>;

  beforeEach(() => {
    // Initialize all modules with consistent configuration
    const testPolicy: SEOPolicy = {
      global: {
        enforceTrailingSlash: false,
        titleTemplate: '%s | Test Site',
        maxTitleLength: 60,
        maxDescriptionLength: 160,
        defaultLocale: 'en-US',
      },
      canonical: {
        baseDomain: 'https://example.com',
        enforceHttps: true,
        removeQueryParams: true,
        allowedQueryParams: ['utm_source', 'utm_medium'],
      },
      sitemap: {
        defaultChangeFreq: 'weekly',
        defaultPriority: 0.8,
        excludePatterns: ['/admin/**', '/api/**'],
        includeOnlyPatterns: [],
        maxUrlsPerSitemap: 50000,
        enableImageSitemap: false,
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
    };

    const testConfig: SEOConfig = {
      domain: 'https://example.com',
      defaultLocale: 'en-US',
      policy: testPolicy,
    };

    const metadataOptions = {
      baseUrl: 'https://example.com',
      titleTemplate: '%s | Test Site',
      defaultLocale: 'en-US',
      enforceHttps: true,
      removeTrailingSlash: false,
      normalizeUrls: true,
      generateMissing: true,
      validateLengths: true,
      maxTitleLength: 60,
      maxDescriptionLength: 160,
    };

    const schemaOptions = {
      baseUrl: 'https://example.com',
      siteName: 'Test Site',
      defaultLocale: 'en-US',
      organization: {
        name: 'Test Organization',
        url: 'https://example.com',
        description: 'Test organization for integration testing',
      },
    };

    policyEngine = createSEOPolicyEngine(testPolicy);
    configManager = createSEOConfigManager(testConfig);
    metadataNormalizer = createMetadataNormalizer(metadataOptions);
    schemaGenerator = createSchemaGenerator(schemaOptions);
    urlResolver = createAdvancedUrlResolver();
  });

  describe('Policy Engine Integration', () => {
    it('should validate metadata using policy and normalize it', () => {
      const rawMetadata: SEOMetadata = {
        title: 'This is a very long title that exceeds the maximum recommended length for SEO purposes',
        description: 'Short',
        'og:title': 'Different Title',
        canonical: 'http://insecure.com/page',
      };

      // First validate with policy engine
      const validationResult = policyEngine.validateMetadata(rawMetadata);
      expect(validationResult.valid).toBe(false);
      expect(validationResult.errors.length).toBeGreaterThan(0);
      expect(validationResult.warnings.length).toBeGreaterThan(0);

      // Then normalize with metadata normalizer (using factory function)
      const normalizedMetadata = normalizeMetadata(rawMetadata, {
        trimWhitespace: true,
        normalizeTitleCase: true,
        generateMissingOG: true,
        generateMissingTwitter: true,
        removeDuplicates: true,
        validateUrls: true,
        defaultLocale: 'en-US',
      });
      expect(normalizedMetadata.title).toBeDefined();
      expect(normalizedMetadata.description).toBeDefined();
    });

    it('should use policy configuration for URL resolution', () => {
      const context: UrlResolutionContext = {
        url: 'https://www.example.com/test/page?utm_source=google&utm_campaign=spring',
        domain: 'example.com',
        protocol: 'https',
      };

      const resolvedUrl = urlResolver.resolveUrl(context.url, context);
      
      // Should apply policy rules from URL resolver
      expect(resolvedUrl).toBe('https://example.com/test/page');
    });
  });

  describe('Metadata to Schema Integration', () => {
    it('should generate schema from normalized metadata', () => {
      const metadata: SEOMetadata = {
        title: 'Test Article',
        description: 'This is a test article for integration testing',
        canonical: 'https://example.com/test-article',
        'og:type': 'article',
        'og:image': 'https://example.com/image.jpg',
      };

      // Normalize metadata first
      const normalizedMetadata = metadataNormalizer.normalize(metadata);
      
      // Generate schema from normalized metadata
      const articleSchema = schemaGenerator.generateArticleSchema({
        title: normalizedMetadata.title || '',
        description: normalizedMetadata.description || '',
        url: normalizedMetadata.canonical || '',
        image: normalizedMetadata['og:image'],
      });

      expect(articleSchema['@type']).toBe('Article');
      expect(articleSchema.headline).toBe('Test Article');
      expect(articleSchema.description).toBe('This is a test article for integration testing');
    });

    it('should create consistent website and organization schemas', () => {
      const websiteSchema = schemaGenerator.generateWebsiteSchema();
      const organizationSchema = schemaGenerator.generateOrganizationSchema();

      // Both should use the same base configuration
      expect(websiteSchema['@context']).toBe('https://schema.org');
      expect(organizationSchema['@context']).toBe('https://schema.org');
      
      expect(websiteSchema.name).toBe('Test Site');
      expect(organizationSchema.name).toBe('Test Organization');
      
      expect(websiteSchema.url).toBe('https://example.com');
      expect(organizationSchema.url).toBe('https://example.com');
    });
  });

  describe('URL Resolution Across Modules', () => {
    it('should maintain URL consistency across resolution and normalization', () => {
      const testUrl = 'https://WWW.Example.COM/Path/With/Dashes?utm_source=google#section';

      // Resolve with advanced URL resolver
      const context: UrlResolutionContext = {
        url: testUrl,
        domain: 'example.com',
        protocol: 'https',
      };
      const resolvedUrl = urlResolver.resolveUrl(testUrl, context);

      // Normalize metadata with the resolved URL
      const metadata: SEOMetadata = {
        title: 'Test Page',
        canonical: resolvedUrl,
      };
      const normalizedMetadata = metadataNormalizer.normalize(metadata);

      expect(resolvedUrl).toBe('https://example.com/path/with/dashes');
      expect(normalizedMetadata.canonical).toBe(resolvedUrl);
    });

    it('should handle breadcrumb schema generation with resolved URLs', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://example.com' },
        { name: 'Category', url: 'https://www.example.com/category/' },
        { name: 'Product', url: 'https://example.com/product?utm_source=test' },
      ];

      const context: UrlResolutionContext = {
        url: breadcrumbs[0].url,
        domain: 'example.com',
        protocol: 'https',
      };

      // Resolve all breadcrumb URLs
      const resolvedBreadcrumbs = breadcrumbs.map(breadcrumb => ({
        ...breadcrumb,
        url: urlResolver.resolveUrl(breadcrumb.url, context),
      }));

      const breadcrumbSchema = schemaGenerator.generateBreadcrumbSchema(resolvedBreadcrumbs);

      expect(breadcrumbSchema['@type']).toBe('BreadcrumbList');
      expect(breadcrumbSchema.itemListElement).toBeDefined();
      expect(Array.isArray(breadcrumbSchema.itemListElement)).toBe(true);
    });
  });

  describe('Configuration Integration', () => {
    it('should use configuration consistently across modules', () => {
      const config = configManager.getConfig();
      
      // Update configuration
      configManager.updateConfig({
        defaultLocale: 'fr-FR',
        policy: {
          global: {
            maxTitleLength: 70,
            titleTemplate: '%s | Site Français',
          },
        },
      });

      const updatedConfig = configManager.getConfig();
      expect(updatedConfig.defaultLocale).toBe('fr-FR');
      expect(updatedConfig.policy?.global?.maxTitleLength).toBe(70);

      // Create new instances with updated config
      const updatedPolicyEngine = createSEOPolicyEngine(updatedConfig.policy || {});
      const updatedMetadataNormalizer = createMetadataNormalizer({
        trimWhitespace: true,
        normalizeTitleCase: true,
        generateMissingOG: true,
        generateMissingTwitter: true,
        removeDuplicates: true,
        validateUrls: true,
        defaultLocale: updatedConfig.defaultLocale,
      });

      // Test with updated configuration
      const testMetadata: SEOMetadata = {
        title: 'Test Title',
        description: 'Test description',
      };

      const validationResult = updatedPolicyEngine.validateMetadata(testMetadata);
      const normalizedMetadata = updatedMetadataNormalizer.normalize(testMetadata);

      expect(validationResult.valid).toBe(true);
      expect(normalizedMetadata.title).toBe('Test Title | Site Français');
    });
  });

  describe('Sitemap Integration', () => {
    it('should integrate sitemap generation with URL resolution', () => {
      const testUrls = [
        'https://example.com/public-page',
        'https://www.example.com/another-page',
        'https://example.com/with-params?utm_source=test',
      ];

      // Resolve URLs first
      const context: UrlResolutionContext = {
        url: testUrls[0],
        domain: 'example.com',
        protocol: 'https',
      };
      const resolvedUrls = testUrls.map(url => urlResolver.resolveUrl(url, context));

      // Create sitemap URLs
      const sitemapUrls: SitemapUrl[] = resolvedUrls.map(url => 
        createSitemapUrl(url, {
          lastmod: '2023-01-01',
          changefreq: 'weekly',
          priority: 0.8,
        })
      );

      // Generate sitemap
      const sitemapOptions = {
        baseUrl: 'https://example.com',
        defaultChangeFreq: 'weekly' as const,
        defaultPriority: 0.8,
        excludePatterns: ['/admin/**', '/api/**'],
        maxUrlsPerSitemap: 50000,
        includeOnlyPatterns: [],
        enableImageSitemap: false,
        enableNewsSitemap: false,
      };

      const sitemap = generateSitemap(sitemapUrls, sitemapOptions);

      expect(sitemap).toContain('https://example.com/public-page');
      expect(sitemap).toContain('https://example.com/another-page');
      expect(sitemap).toContain('https://example.com/with-params');
    });
  });

  describe('End-to-End SEO Workflow', () => {
    it('should handle complete SEO workflow for a page', () => {
      const pageData = {
        url: 'https://www.example.com/products/awesome-product?utm_source=google&utm_medium=cpc',
        title: 'Awesome Product - Best Deals Online',
        description: 'Discover the awesome product with amazing features and benefits. Shop now for the best prices.',
        type: 'product',
        image: 'https://example.com/images/product.jpg',
        author: 'Product Team',
        publishedDate: '2023-01-01T00:00:00Z',
        modifiedDate: '2023-01-15T00:00:00Z',
      };

      // Step 1: URL Resolution
      const context: UrlResolutionContext = {
        url: pageData.url,
        domain: 'example.com',
        protocol: 'https',
      };
      const resolvedUrl = urlResolver.resolveUrl(pageData.url, context);

      // Step 2: Metadata Normalization
      const metadata: SEOMetadata = {
        title: pageData.title,
        description: pageData.description,
        canonical: resolvedUrl,
        'og:type': pageData.type,
        'og:image': pageData.image,
        'og:url': resolvedUrl,
        author: pageData.author,
        published_time: pageData.publishedDate,
        modified_time: pageData.modifiedDate,
      };
      const normalizedMetadata = metadataNormalizer.normalize(metadata);

      // Step 3: Policy Validation
      const validationResult = policyEngine.validateMetadata(normalizedMetadata);
      
      // Step 4: Schema Generation
      const articleSchema = schemaGenerator.generateArticleSchema({
        title: normalizedMetadata.title || '',
        description: normalizedMetadata.description || '',
        url: normalizedMetadata.canonical || '',
        author: normalizedMetadata.author,
        publishedDate: normalizedMetadata.published_time,
        modifiedDate: normalizedMetadata.modified_time,
        image: normalizedMetadata['og:image'],
      });

      // Assertions
      expect(resolvedUrl).toBe('https://example.com/products/awesome-product');
      expect(normalizedMetadata.canonical).toBe(resolvedUrl);
      expect(validationResult.valid).toBe(true);
      expect(articleSchema['@type']).toBe('Article');
      expect(articleSchema.headline).toContain('Awesome Product');
    });

    it('should handle blog post workflow', () => {
      const blogPost = {
        url: 'https://example.com/blog/2023/my-awesome-post',
        title: 'My Awesome Post: A Complete Guide',
        description: 'Learn everything about this awesome topic in our comprehensive guide.',
        author: 'Blog Author',
        publishedDate: '2023-01-01T00:00:00Z',
        tags: ['tutorial', 'guide', 'awesome'],
      };

      // Process through the workflow
      const context: UrlResolutionContext = {
        url: blogPost.url,
        domain: 'example.com',
        protocol: 'https',
      };
      const resolvedUrl = urlResolver.resolveUrl(blogPost.url, context);

      const metadata: SEOMetadata = {
        title: blogPost.title,
        description: blogPost.description,
        canonical: resolvedUrl,
        'og:type': 'article',
        author: blogPost.author,
        published_time: blogPost.publishedDate,
      };
      const normalizedMetadata = metadataNormalizer.normalize(metadata);

      const validationResult = policyEngine.validateMetadata(normalizedMetadata);
      const articleSchema = schemaGenerator.generateArticleSchema({
        title: normalizedMetadata.title || '',
        description: normalizedMetadata.description || '',
        url: normalizedMetadata.canonical || '',
        author: normalizedMetadata.author,
        publishedDate: normalizedMetadata.published_time,
      });

      // Blog-specific assertions
      expect(resolvedUrl).toBe('https://example.com/blog/2023/my-awesome-post');
      expect(validationResult.valid).toBe(true);
      expect(articleSchema['@type']).toBe('Article');
      expect(articleSchema.headline).toBe('My Awesome Post: A Complete Guide');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle errors gracefully across modules', () => {
      const invalidMetadata = {
        title: '', // Empty title should trigger validation error
        description: 'A'.repeat(300), // Too long description
        canonical: 'not-a-valid-url',
        'twitter:card': 'invalid-card-type',
      };

      // Each module should handle errors gracefully
      expect(() => policyEngine.validateMetadata(invalidMetadata)).not.toThrow();
      expect(() => metadataNormalizer.normalize(invalidMetadata)).not.toThrow();
      expect(() => urlResolver.resolveUrl('invalid-url', { url: 'invalid-url', domain: 'example.com', protocol: 'https' })).not.toThrow();

      const validationResult = policyEngine.validateMetadata(invalidMetadata);
      expect(validationResult.valid).toBe(false);
      expect(validationResult.errors.length).toBeGreaterThan(0);
    });

    it('should maintain data consistency when modules fail', () => {
      const partialMetadata = {
        title: 'Valid Title',
        // Missing description and other fields
      };

      const validationResult = policyEngine.validateMetadata(partialMetadata);
      const normalizedMetadata = metadataNormalizer.normalize(partialMetadata);

      // Even with validation errors, normalization should still work
      expect(validationResult.valid).toBe(false); // Missing required fields
      expect(normalizedMetadata.title).toBe('Valid Title | Test Site'); // Title template applied
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large volumes of URLs efficiently', () => {
      const largeUrlSet = Array.from({ length: 1000 }, (_, i) => 
        `https://example.com/page-${i}`
      );

      const startTime = Date.now();
      
      // Process URLs through multiple modules
      const processedUrls = largeUrlSet.map(url => {
        const context: UrlResolutionContext = {
          url,
          domain: 'example.com',
          protocol: 'https',
        };
        return urlResolver.resolveUrl(url, context);
      });

      const metadataSet = processedUrls.map(url => ({
        title: `Page ${url.split('-').pop()}`,
        canonical: url,
        description: 'Description for page',
      }));

      const validationResults = metadataSet.map(metadata => 
        policyEngine.validateMetadata(metadata)
      );

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Performance assertions
      expect(processingTime).toBeLessThan(1000); // Should complete within 1 second
      expect(processedUrls).toHaveLength(1000);
      expect(validationResults).toHaveLength(1000);
      
      // All processed URLs should be valid
      const validResults = validationResults.filter(result => result.valid);
      expect(validResults).toHaveLength(1000);
    });

    it('should handle concurrent operations safely', () => {
      const urls = [
        'https://example.com/page1',
        'https://example.com/page2',
        'https://example.com/page3',
      ];

      // Simulate concurrent operations
      const promises = urls.map(async url => {
        const context: UrlResolutionContext = {
          url,
          domain: 'example.com',
          protocol: 'https',
        };
        
        const resolvedUrl = urlResolver.resolveUrl(url, context);
        const metadata = {
          title: `Page ${url.split('/').pop()}`,
          canonical: resolvedUrl,
          description: 'Description',
        };
        
        return {
          resolvedUrl,
          validationResult: policyEngine.validateMetadata(metadata),
          normalizedMetadata: metadataNormalizer.normalize(metadata),
        };
      });

      // Should handle concurrent operations without errors
      expect(Promise.all(promises)).resolves.toBeDefined();
    });
  });
});
