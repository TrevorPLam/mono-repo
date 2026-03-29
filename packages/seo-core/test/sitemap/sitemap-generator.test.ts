/**
 * Sitemap Generator Tests
 * 
 * Comprehensive test suite for sitemap generation covering:
 * - Sitemap URL creation and validation
 * - XML sitemap generation
 * - Image sitemap support
 * - News sitemap support
 * - Sitemap index generation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  SitemapGenerator,
  createSitemapGenerator,
  generateSitemap,
  createSitemapUrl,
  createSitemapImage,
  createSitemapNews,
  validateSitemapUrl,
} from '../../src/sitemap/index.js';
import type { SitemapGenerationOptions, SitemapUrl, SitemapImage, SitemapNews } from '../../src/types/index.js';

describe('SitemapGenerator', () => {
  let generator: SitemapGenerator;
  let defaultOptions: SitemapGenerationOptions;

  beforeEach(() => {
    defaultOptions = {
      baseUrl: 'https://example.com',
      defaultChangeFreq: 'weekly',
      defaultPriority: 0.8,
      excludePatterns: ['/admin/**', '/api/**'],
      includeOnlyPatterns: [],
      maxUrlsPerSitemap: 50000,
      enableImageSitemap: true,
      enableNewsSitemap: false,
      lastmodDefault: '2023-01-01',
      validateUrls: true,
    };
    
    generator = createSitemapGenerator(defaultOptions);
  });

  describe('Constructor and Configuration', () => {
    it('should create generator with default options', () => {
      const defaultGenerator = new SitemapGenerator();
      
      expect(defaultGenerator).toBeInstanceOf(SitemapGenerator);
    });

    it('should create generator with custom options', () => {
      const customGenerator = new SitemapGenerator({
        baseUrl: 'https://custom.com',
        defaultPriority: 0.9,
        enableNewsSitemap: true,
      });
      
      expect(customGenerator).toBeInstanceOf(SitemapGenerator);
    });
  });

  describe('Sitemap URL Creation', () => {
    it('should create sitemap URL with minimal data', () => {
      const result = createSitemapUrl('https://example.com/page');
      
      expect(result.url).toBe('https://example.com/page');
      expect(result.lastmod).toBeUndefined();
      expect(result.changefreq).toBeUndefined();
      expect(result.priority).toBeUndefined();
    });

    it('should create sitemap URL with full data', () => {
      const urlData: SitemapUrl = {
        url: 'https://example.com/page',
        lastmod: '2023-12-01',
        changefreq: 'daily',
        priority: 1.0,
      };
      
      const result = createSitemapUrl(urlData.url, urlData);
      
      expect(result.url).toBe('https://example.com/page');
      expect(result.lastmod).toBe('2023-12-01');
      expect(result.changefreq).toBe('daily');
      expect(result.priority).toBe(1.0);
    });

    it('should apply defaults from generator', () => {
      const result = generator.createUrl('/page');
      
      expect(result.url).toBe('https://example.com/page');
      expect(result.changefreq).toBe('weekly');
      expect(result.priority).toBe(0.8);
    });

    it('should handle relative URLs', () => {
      const result = generator.createUrl('/page');
      
      expect(result.url).toBe('https://example.com/page');
    });

    it('should validate URL format', () => {
      expect(() => createSitemapUrl('not-a-url')).toThrow();
    });
  });

  describe('Sitemap Image Creation', () => {
    it('should create sitemap image with minimal data', () => {
      const result = createSitemapImage('https://example.com/image.jpg');
      
      expect(result.loc).toBe('https://example.com/image.jpg');
      expect(result.caption).toBeUndefined();
      expect(result.geo_location).toBeUndefined();
      expect(result.title).toBeUndefined();
      expect(result.license).toBeUndefined();
    });

    it('should create sitemap image with full data', () => {
      const imageData: SitemapImage = {
        loc: 'https://example.com/image.jpg',
        caption: 'Test image caption',
        geo_location: 'New York, NY',
        title: 'Test Image Title',
        license: 'https://creativecommons.org/licenses/by/4.0/',
      };
      
      const result = createSitemapImage(imageData.loc, imageData);
      
      expect(result.loc).toBe('https://example.com/image.jpg');
      expect(result.caption).toBe('Test image caption');
      expect(result.geo_location).toBe('New York, NY');
      expect(result.title).toBe('Test Image Title');
      expect(result.license).toBe('https://creativecommons.org/licenses/by/4.0/');
    });

    it('should validate image URL', () => {
      expect(() => createSitemapImage('not-a-url')).toThrow();
    });
  });

  describe('Sitemap News Creation', () => {
    it('should create sitemap news with required data', () => {
      const result = createSitemapNews({
        publication: {
          name: 'Example News',
          language: 'en',
        },
        publication_date: '2023-12-01T12:00:00Z',
        title: 'Breaking News Story',
      });
      
      expect(result.publication.name).toBe('Example News');
      expect(result.publication.language).toBe('en');
      expect(result.publication_date).toBe('2023-12-01T12:00:00Z');
      expect(result.title).toBe('Breaking News Story');
    });

    it('should validate required fields', () => {
      expect(() => createSitemapNews({
        publication: {
          name: '',
          language: 'en',
        },
        publication_date: '2023-12-01T12:00:00Z',
        title: 'Title',
      })).toThrow();

      expect(() => createSitemapNews({
        publication: {
          name: 'News',
          language: '',
        },
        publication_date: '2023-12-01T12:00:00Z',
        title: 'Title',
      })).toThrow();

      expect(() => createSitemapNews({
        publication: {
          name: 'News',
          language: 'en',
        },
        publication_date: '',
        title: 'Title',
      })).toThrow();

      expect(() => createSitemapNews({
        publication: {
          name: 'News',
          language: 'en',
        },
        publication_date: '2023-12-01T12:00:00Z',
        title: '',
      })).toThrow();
    });
  });

  describe('Sitemap Generation', () => {
    it('should generate basic XML sitemap', () => {
      const urls = [
        { url: 'https://example.com/' },
        { url: 'https://example.com/about' },
        { url: 'https://example.com/contact' },
      ];
      
      const sitemap = generator.generateSitemap(urls);
      
      expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(sitemap).toContain('<url><loc>https://example.com/</loc></url>');
      expect(sitemap).toContain('<url><loc>https://example.com/about</loc></url>');
      expect(sitemap).toContain('<url><loc>https://example.com/contact</loc></url>');
      expect(sitemap).toContain('</urlset>');
    });

    it('should generate sitemap with full URL data', () => {
      const urls: SitemapUrl[] = [
        {
          url: 'https://example.com/page',
          lastmod: '2023-12-01',
          changefreq: 'daily',
          priority: 1.0,
        },
      ];
      
      const sitemap = generator.generateSitemap(urls);
      
      expect(sitemap).toContain('<url><loc>https://example.com/page</loc>');
      expect(sitemap).toContain('<lastmod>2023-12-01</lastmod>');
      expect(sitemap).toContain('<changefreq>daily</changefreq>');
      expect(sitemap).toContain('<priority>1.0</priority>');
      expect(sitemap).toContain('</url>');
    });

    it('should include image sitemap data when enabled', () => {
      const urls: SitemapUrl[] = [
        {
          url: 'https://example.com/page',
          images: [
            {
              loc: 'https://example.com/image1.jpg',
              caption: 'Test Image 1',
            },
            {
              loc: 'https://example.com/image2.jpg',
              title: 'Test Image 2',
            },
          ],
        },
      ];
      
      const sitemap = generator.generateSitemap(urls);
      
      expect(sitemap).toContain('<image:image>');
      expect(sitemap).toContain('<image:loc>https://example.com/image1.jpg</image:loc>');
      expect(sitemap).toContain('<image:caption>Test Image 1</image:caption>');
      expect(sitemap).toContain('<image:loc>https://example.com/image2.jpg</image:loc>');
      expect(sitemap).toContain('<image:title>Test Image 2</image:title>');
      expect(sitemap).toContain('</image:image>');
    });

    it('should include news sitemap data when enabled', () => {
      const newsGenerator = new SitemapGenerator({
        ...defaultOptions,
        enableNewsSitemap: true,
      });
      
      const urls: SitemapUrl[] = [
        {
          url: 'https://example.com/news-article',
          news: [
            {
              publication: {
                name: 'Example News',
                language: 'en',
              },
              publication_date: '2023-12-01T12:00:00Z',
              title: 'Breaking News',
            },
          ],
        },
      ];
      
      const sitemap = newsGenerator.generateSitemap(urls);
      
      expect(sitemap).toContain('<news:news>');
      expect(sitemap).toContain('<news:publication>');
      expect(sitemap).toContain('<news:name>Example News</news:name>');
      expect(sitemap).toContain('<news:language>en</news:language>');
      expect(sitemap).toContain('</news:publication>');
      expect(sitemap).toContain('<news:publication_date>2023-12-01T12:00:00Z</news:publication_date>');
      expect(sitemap).toContain('<news:title>Breaking News</news:title>');
      expect(sitemap).toContain('</news:news>');
    });

    it('should handle exclude patterns', () => {
      const urls = [
        { url: 'https://example.com/public-page' },
        { url: 'https://example.com/admin/dashboard' },
        { url: 'https://example.com/api/users' },
        { url: 'https://example.com/admin/settings' },
      ];
      
      const sitemap = generator.generateSitemap(urls);
      
      expect(sitemap).toContain('https://example.com/public-page');
      expect(sitemap).not.toContain('https://example.com/admin/dashboard');
      expect(sitemap).not.toContain('https://example.com/api/users');
      expect(sitemap).not.toContain('https://example.com/admin/settings');
    });

    it('should handle include-only patterns', () => {
      const includeOnlyGenerator = new SitemapGenerator({
        ...defaultOptions,
        includeOnlyPatterns: ['/blog/**', '/products/**'],
      });
      
      const urls = [
        { url: 'https://example.com/blog/post-1' },
        { url: 'https://example.com/products/item-1' },
        { url: 'https://example.com/about' },
        { url: 'https://example.com/contact' },
      ];
      
      const sitemap = includeOnlyGenerator.generateSitemap(urls);
      
      expect(sitemap).toContain('https://example.com/blog/post-1');
      expect(sitemap).toContain('https://example.com/products/item-1');
      expect(sitemap).not.toContain('https://example.com/about');
      expect(sitemap).not.toContain('https://example.com/contact');
    });

    it('should split into multiple sitemaps when URL count exceeds limit', () => {
      const largeGenerator = new SitemapGenerator({
        ...defaultOptions,
        maxUrlsPerSitemap: 3,
      });
      
      const urls = Array.from({ length: 10 }, (_, i) => ({
        url: `https://example.com/page-${i + 1}`,
      }));
      
      const sitemaps = largeGenerator.generateSitemapIndex(urls);
      
      expect(sitemaps).toHaveLength(4); // 10 URLs / 3 per sitemap = 4 sitemaps
      expect(sitemaps[0]).toContain('page-1');
      expect(sitemaps[0]).toContain('page-2');
      expect(sitemaps[0]).toContain('page-3');
      expect(sitemaps[1]).toContain('page-4');
      expect(sitemaps[1]).toContain('page-5');
      expect(sitemaps[1]).toContain('page-6');
    });
  });

  describe('URL Validation', () => {
    it('should validate valid sitemap URLs', () => {
      const validUrls: SitemapUrl[] = [
        { url: 'https://example.com/page' },
        { url: 'https://example.com/category/product' },
        {
          url: 'https://example.com/page',
          lastmod: '2023-12-01',
          changefreq: 'weekly',
          priority: 0.8,
        },
      ];
      
      validUrls.forEach(url => {
        const result = validateSitemapUrl(url);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject invalid sitemap URLs', () => {
      const invalidUrls = [
        { url: 'not-a-url' },
        { url: '' },
        { url: 'ftp://example.com/file' },
      ];
      
      invalidUrls.forEach(url => {
        const result = validateSitemapUrl(url);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    it('should validate priority range', () => {
      const result = validateSitemapUrl({
        url: 'https://example.com/page',
        priority: 1.5, // Invalid - should be 0.0 to 1.0
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Priority must be between 0.0 and 1.0');
    });

    it('should validate changefreq values', () => {
      const result = validateSitemapUrl({
        url: 'https://example.com/page',
        changefreq: 'invalid' as any,
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid changefreq value');
    });

    it('should validate date formats', () => {
      const result = validateSitemapUrl({
        url: 'https://example.com/page',
        lastmod: 'invalid-date',
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid lastmod date format');
    });
  });

  describe('Pattern Matching', () => {
    it('should match wildcard patterns correctly', () => {
      const testCases = [
        { pattern: '/admin/**', url: '/admin/dashboard', shouldMatch: true },
        { pattern: '/admin/**', url: '/admin/users/edit', shouldMatch: true },
        { pattern: '/admin/**', url: '/about', shouldMatch: false },
        { pattern: '/api/**', url: '/api/v1/users', shouldMatch: true },
        { pattern: '/api/**', url: '/api', shouldMatch: true },
        { pattern: '/api/**', url: '/api-docs', shouldMatch: false },
      ];
      
      testCases.forEach(({ pattern, url, shouldMatch }) => {
        const matches = (generator as any).matchesPattern(url, pattern);
        expect(matches).toBe(shouldMatch);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty URL list', () => {
      const sitemap = generator.generateSitemap([]);
      
      expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(sitemap).toContain('</urlset>');
    });

    it('should handle null/undefined inputs', () => {
      expect(() => generator.generateSitemap(null as any)).not.toThrow();
      expect(() => generator.generateSitemap(undefined as any)).not.toThrow();
      
      const sitemap = generator.generateSitemap(null as any);
      expect(sitemap).toContain('</urlset>');
    });

    it('should handle special characters in URLs', () => {
      const urls = [
        { url: 'https://example.com/page-with-dashes' },
        { url: 'https://example.com/page_with_underscores' },
        { url: 'https://example.com/page+with+plus' },
        { url: 'https://example.com/page with spaces' },
      ];
      
      expect(() => generator.generateSitemap(urls)).not.toThrow();
      
      const sitemap = generator.generateSitemap(urls);
      expect(sitemap).toContain('page-with-dashes');
      expect(sitemap).toContain('page_with_underscores');
      expect(sitemap).toContain('page+with+plus');
      expect(sitemap).toContain('page%20with%20spaces');
    });

    it('should handle Unicode characters', () => {
      const urls = [
        { url: 'https://example.com/page-with-émojis-🎉' },
      ];
      
      expect(() => generator.generateSitemap(urls)).not.toThrow();
      
      const sitemap = generator.generateSitemap(urls);
      expect(sitemap).toContain('page-with-%C3%A9mojis-%F0%9F%8E%89');
    });
  });
});

describe('Factory Functions', () => {
  describe('createSitemapGenerator', () => {
    it('should create SitemapGenerator instance', () => {
      const generator = createSitemapGenerator();
      
      expect(generator).toBeInstanceOf(SitemapGenerator);
    });

    it('should create generator with custom options', () => {
      const options: SitemapGenerationOptions = {
        baseUrl: 'https://custom.com',
        defaultPriority: 0.9,
      };
      
      const generator = createSitemapGenerator(options);
      
      expect(generator).toBeInstanceOf(SitemapGenerator);
    });
  });

  describe('generateSitemap', () => {
    it('should generate sitemap using default options', () => {
      const urls = [{ url: 'https://example.com/page' }];
      
      const sitemap = generateSitemap(urls, { baseUrl: 'https://example.com' });
      
      expect(sitemap).toContain('https://example.com/page');
    });

    it('should use custom options', () => {
      const urls = [{ url: 'https://example.com/page' }];
      const options: SitemapGenerationOptions = {
        baseUrl: 'https://custom.com',
        defaultPriority: 0.9,
      };
      
      const sitemap = generateSitemap(urls, options);
      
      expect(sitemap).toContain('https://custom.com/page');
      expect(sitemap).toContain('<priority>0.9</priority>');
    });
  });

  describe('validateSitemapUrl', () => {
    it('should validate sitemap URL with default options', () => {
      const url: SitemapUrl = { url: 'https://example.com/page' };
      
      const result = validateSitemapUrl(url);
      
      expect(result.valid).toBe(true);
    });

    it('should report validation errors', () => {
      const url: SitemapUrl = { url: 'not-a-valid-url' };
      
      const result = validateSitemapUrl(url);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complete sitemap generation workflow', () => {
    const generator = createSitemapGenerator({
      baseUrl: 'https://example.com',
      defaultChangeFreq: 'weekly',
      defaultPriority: 0.8,
      enableImageSitemap: true,
      enableNewsSitemap: true,
    });
    
    const urls: SitemapUrl[] = [
      {
        url: 'https://example.com/blog/post-1',
        lastmod: '2023-12-01',
        changefreq: 'daily',
        priority: 1.0,
        images: [
          {
            loc: 'https://example.com/blog-image.jpg',
            caption: 'Blog post image',
          },
        ],
      },
      {
        url: 'https://example.com/news/breaking',
        lastmod: '2023-12-01T12:00:00Z',
        changefreq: 'hourly',
        priority: 0.9,
        news: [
          {
            publication: {
              name: 'Example News',
              language: 'en',
            },
            publication_date: '2023-12-01T12:00:00Z',
            title: 'Breaking News Story',
          },
        ],
      },
    ];
    
    const sitemap = generator.generateSitemap(urls);
    
    expect(sitemap).toContain('https://example.com/blog/post-1');
    expect(sitemap).toContain('https://example.com/news/breaking');
    expect(sitemap).toContain('<image:image>');
    expect(sitemap).toContain('<news:news>');
    expect(sitemap).toContain('<lastmod>2023-12-01</lastmod>');
    expect(sitemap).toContain('<changefreq>daily</changefreq>');
    expect(sitemap).toContain('<priority>1.0</priority>');
  });

  it('should handle large sitemap generation', () => {
    const generator = createSitemapGenerator({
      baseUrl: 'https://example.com',
      maxUrlsPerSitemap: 1000,
    });
    
    const urls = Array.from({ length: 2500 }, (_, i) => ({
      url: `https://example.com/page-${i + 1}`,
      lastmod: '2023-12-01',
      changefreq: 'weekly' as const,
      priority: 0.8,
    }));
    
    expect(() => generator.generateSitemapIndex(urls)).not.toThrow();
    
    const sitemaps = generator.generateSitemapIndex(urls);
    expect(sitemaps.length).toBe(3); // 2500 URLs / 1000 per sitemap = 3 sitemaps
  });
});
