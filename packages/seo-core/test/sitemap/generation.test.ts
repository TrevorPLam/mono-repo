/**
 * Sitemap Generation System Tests
 * 
 * Comprehensive test suite for sitemap generation following 2026 best practices
 * Uses Vitest with type-safe mocks and AAA pattern
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { SitemapPolicy, SitemapUrl, SitemapImage, SitemapNews } from '../../src/types/index.js';
import { 
  SitemapGenerator, 
  createSitemapGenerator,
  generateSitemap,
  createSitemapUrl,
  createSitemapImage,
  createSitemapNews,
  validateSitemapUrl,
  type SitemapGenerationOptions
} from '../../src/sitemap/index.js';

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
      lastmod: '2026-03-29',
      filter: (url) => true,
    };
    
    generator = new SitemapGenerator(defaultOptions);
  });

  describe('Constructor', () => {
    it('should initialize with default options', () => {
      const generator = new SitemapGenerator({
        baseUrl: 'https://example.com',
      });

      expect(generator).toBeInstanceOf(SitemapGenerator);
      
      const policy = generator.getPolicy();
      expect(policy.defaultChangeFreq).toBe('weekly');
      expect(policy.defaultPriority).toBe(0.8);
      expect(policy.excludePatterns).toContain('/admin/**');
      expect(policy.maxUrlsPerSitemap).toBe(50000);
      expect(policy.enableImageSitemap).toBe(true);
      expect(policy.enableNewsSitemap).toBe(false);
    });

    it('should accept custom options', () => {
      const options: SitemapGenerationOptions = {
        baseUrl: 'https://custom.com',
        defaultChangeFreq: 'daily',
        defaultPriority: 0.5,
        excludePatterns: ['/private/**'],
        includeOnlyPatterns: ['/blog/**'],
        maxUrlsPerSitemap: 1000,
        enableImageSitemap: false,
        enableNewsSitemap: true,
        lastmod: '2026-01-01',
      };

      const generator = new SitemapGenerator(options);
      const policy = generator.getPolicy();

      expect(policy.defaultChangeFreq).toBe('daily');
      expect(policy.defaultPriority).toBe(0.5);
      expect(policy.excludePatterns).toEqual(['/private/**']);
      expect(policy.includeOnlyPatterns).toEqual(['/blog/**']);
      expect(policy.maxUrlsPerSitemap).toBe(1000);
      expect(policy.enableImageSitemap).toBe(false);
      expect(policy.enableNewsSitemap).toBe(true);
    });
  });

  describe('generateSitemap', () => {
    describe('Single Sitemap Generation', () => {
      it('should generate basic sitemap XML', () => {
        const urls: SitemapUrl[] = [
          { url: 'https://example.com/page1' },
          { url: 'https://example.com/page2' },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
        expect(sitemap).toContain('<url><loc>https://example.com/page1</loc></url>');
        expect(sitemap).toContain('<url><loc>https://example.com/page2</loc></url>');
        expect(sitemap).toContain('</urlset>');
      });

      it('should include image namespace when enabled', () => {
        const urls: SitemapUrl[] = [{ url: 'https://example.com/page1' }];
        
        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
      });

      it('should include news namespace when enabled', () => {
        const generator = new SitemapGenerator({
          ...defaultOptions,
          enableNewsSitemap: true,
        });

        const urls: SitemapUrl[] = [{ url: 'https://example.com/page1' }];
        
        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"');
      });

      it('should include both namespaces when both enabled', () => {
        const generator = new SitemapGenerator({
          ...defaultOptions,
          enableImageSitemap: true,
          enableNewsSitemap: true,
        });

        const urls: SitemapUrl[] = [{ url: 'https://example.com/page1' }];
        
        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
        expect(sitemap).toContain('xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"');
      });
    });

    describe('Sitemap Index Generation', () => {
      it('should generate sitemap index when URLs exceed max per sitemap', () => {
        const generator = new SitemapGenerator({
          ...defaultOptions,
          maxUrlsPerSitemap: 2,
        });

        const urls: SitemapUrl[] = [
          { url: 'https://example.com/page1' },
          { url: 'https://example.com/page2' },
          { url: 'https://example.com/page3' },
          { url: 'https://example.com/page4' },
          { url: 'https://example.com/page5' },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(sitemap).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
        expect(sitemap).toContain('<sitemap><loc>https://example.com/sitemap-1.xml</loc><lastmod>2026-03-29</lastmod></sitemap>');
        expect(sitemap).toContain('<sitemap><loc>https://example.com/sitemap-2.xml</loc><lastmod>2026-03-29</lastmod></sitemap>');
        expect(sitemap).toContain('<sitemap><loc>https://example.com/sitemap-3.xml</loc><lastmod>2026-03-29</lastmod></sitemap>');
        expect(sitemap).toContain('</sitemapindex>');
      });

      it('should handle exact max URLs per sitemap', () => {
        const generator = new SitemapGenerator({
          ...defaultOptions,
          maxUrlsPerSitemap: 3,
        });

        const urls: SitemapUrl[] = [
          { url: 'https://example.com/page1' },
          { url: 'https://example.com/page2' },
          { url: 'https://example.com/page3' },
        ];

        const sitemap = generator.generateSitemap(urls);

        // Should generate single sitemap, not index
        expect(sitemap).toContain('<urlset');
        expect(sitemap).not.toContain('<sitemapindex');
      });
    });

    describe('URL Entry Formatting', () => {
      it('should include lastmod when provided', () => {
        const urls: SitemapUrl[] = [
          { url: 'https://example.com/page1', lastmod: '2026-03-29' },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('<lastmod>2026-03-29</lastmod>');
      });

      it('should use default lastmod when not provided', () => {
        const urls: SitemapUrl[] = [
          { url: 'https://example.com/page1' },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('<lastmod>2026-03-29</lastmod>');
      });

      it('should include changefreq when provided', () => {
        const urls: SitemapUrl[] = [
          { url: 'https://example.com/page1', changefreq: 'daily' },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('<changefreq>daily</changefreq>');
      });

      it('should use default changefreq when not provided', () => {
        const urls: SitemapUrl[] = [
          { url: 'https://example.com/page1' },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('<changefreq>weekly</changefreq>');
      });

      it('should include priority when provided', () => {
        const urls: SitemapUrl[] = [
          { url: 'https://example.com/page1', priority: 1.0 },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('<priority>1.0</priority>');
      });

      it('should use default priority when not provided', () => {
        const urls: SitemapUrl[] = [
          { url: 'https://example.com/page1' },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('<priority>0.8</priority>');
      });

      it('should format priority with one decimal place', () => {
        const urls: SitemapUrl[] = [
          { url: 'https://example.com/page1', priority: 0.666666 },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('<priority>0.7</priority>');
      });
    });

    describe('Image Sitemap', () => {
      it('should include image entries when enabled', () => {
        const urls: SitemapUrl[] = [
          {
            url: 'https://example.com/page1',
            images: [
              { loc: 'https://example.com/image1.jpg' },
              { loc: 'https://example.com/image2.jpg' },
            ],
          },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('<image:image>');
        expect(sitemap).toContain('<image:loc>https://example.com/image1.jpg</image:loc>');
        expect(sitemap).toContain('<image:loc>https://example.com/image2.jpg</image:loc>');
        expect(sitemap).toContain('</image:image>');
      });

      it('should include all image properties', () => {
        const urls: SitemapUrl[] = [
          {
            url: 'https://example.com/page1',
            images: [
              {
                loc: 'https://example.com/image1.jpg',
                caption: 'Test image caption',
                geo_location: 'New York, NY',
                title: 'Test Image Title',
                license: 'https://example.com/license',
              },
            ],
          },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('<image:caption>Test image caption</image:caption>');
        expect(sitemap).toContain('<image:geo_location>New York, NY</image:geo_location>');
        expect(sitemap).toContain('<image:title>Test Image Title</image:title>');
        expect(sitemap).toContain('<image:license>https://example.com/license</image:license>');
      });

      it('should not include images when disabled', () => {
        const generator = new SitemapGenerator({
          ...defaultOptions,
          enableImageSitemap: false,
        });

        const urls: SitemapUrl[] = [
          {
            url: 'https://example.com/page1',
            images: [{ loc: 'https://example.com/image1.jpg' }],
          },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).not.toContain('<image:image>');
        expect(sitemap).not.toContain('xmlns:image=');
      });
    });

    describe('News Sitemap', () => {
      it('should include news entries when enabled', () => {
        const generator = new SitemapGenerator({
          ...defaultOptions,
          enableNewsSitemap: true,
        });

        const urls: SitemapUrl[] = [
          {
            url: 'https://example.com/news1',
            news: [
              {
                publication: { name: 'Example News', language: 'en' },
                publication_date: '2026-03-29',
                title: 'Breaking News Story',
              },
            ],
          },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('<news:news>');
        expect(sitemap).toContain('<news:publication>');
        expect(sitemap).toContain('<news:name>Example News</news:name>');
        expect(sitemap).toContain('<news:language>en</news:language>');
        expect(sitemap).toContain('<news:publication_date>2026-03-29</news:publication_date>');
        expect(sitemap).toContain('<news:title>Breaking News Story</news:title>');
        expect(sitemap).toContain('</news:news>');
      });

      it('should not include news when disabled', () => {
        const urls: SitemapUrl[] = [
          {
            url: 'https://example.com/news1',
            news: [
              {
                publication: { name: 'Example News', language: 'en' },
                publication_date: '2026-03-29',
                title: 'Breaking News Story',
              },
            ],
          },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).not.toContain('<news:news>');
        expect(sitemap).not.toContain('xmlns:news=');
      });
    });

    describe('XML Escaping', () => {
      it('should escape XML special characters in URLs', () => {
        const urls: SitemapUrl[] = [
          { url: 'https://example.com/page?param=value&other=test' },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('<loc>https://example.com/page?param=value&amp;other=test</loc>');
      });

      it('should escape XML special characters in image properties', () => {
        const urls: SitemapUrl[] = [
          {
            url: 'https://example.com/page1',
            images: [
              {
                loc: 'https://example.com/image.jpg',
                caption: 'Image with "quotes" & <brackets>',
                title: 'Title with \'apostrophes\'',
              },
            ],
          },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('<image:caption>Image with &quot;quotes&quot; &amp; &lt;brackets&gt;</image:caption>');
        expect(sitemap).toContain('<image:title>Title with &#39;apostrophes&#39;</image:title>');
      });

      it('should escape XML special characters in news properties', () => {
        const generator = new SitemapGenerator({
          ...defaultOptions,
          enableNewsSitemap: true,
        });

        const urls: SitemapUrl[] = [
          {
            url: 'https://example.com/news1',
            news: [
              {
                publication: { name: 'News & "Events"', language: 'en' },
                publication_date: '2026-03-29',
                title: 'Story about <important> topic',
              },
            ],
          },
        ];

        const sitemap = generator.generateSitemap(urls);

        expect(sitemap).toContain('<news:name>News &amp; &quot;Events&quot;</news:name>');
        expect(sitemap).toContain('<news:title>Story about &lt;important&gt; topic</news:title>');
      });
    });
  });

  describe('URL Filtering', () => {
    it('should exclude URLs matching exclude patterns', () => {
      const urls: SitemapUrl[] = [
        { url: 'https://example.com/page1' },
        { url: 'https://example.com/admin/dashboard' },
        { url: 'https://example.com/api/users' },
        { url: 'https://example.com/page2' },
      ];

      const sitemap = generator.generateSitemap(urls);

      expect(sitemap).toContain('https://example.com/page1');
      expect(sitemap).toContain('https://example.com/page2');
      expect(sitemap).not.toContain('https://example.com/admin/dashboard');
      expect(sitemap).not.toContain('https://example.com/api/users');
    });

    it('should include only URLs matching include-only patterns', () => {
      const generator = new SitemapGenerator({
        ...defaultOptions,
        includeOnlyPatterns: ['/blog/**'],
      });

      const urls: SitemapUrl[] = [
        { url: 'https://example.com/blog/post1' },
        { url: 'https://example.com/blog/post2' },
        { url: 'https://example.com/page1' },
        { url: 'https://example.com/admin/dashboard' },
      ];

      const sitemap = generator.generateSitemap(urls);

      expect(sitemap).toContain('https://example.com/blog/post1');
      expect(sitemap).toContain('https://example.com/blog/post2');
      expect(sitemap).not.toContain('https://example.com/page1');
      expect(sitemap).not.toContain('https://example.com/admin/dashboard');
    });

    it('should apply custom filter function', () => {
      const generator = new SitemapGenerator({
        ...defaultOptions,
        filter: (url) => url.url.includes('/important-'),
      });

      const urls: SitemapUrl[] = [
        { url: 'https://example.com/important-page1' },
        { url: 'https://example.com/important-page2' },
        { url: 'https://example.com/regular-page' },
      ];

      const sitemap = generator.generateSitemap(urls);

      expect(sitemap).toContain('https://example.com/important-page1');
      expect(sitemap).toContain('https://example.com/important-page2');
      expect(sitemap).not.toContain('https://example.com/regular-page');
    });

    it('should support wildcard patterns', () => {
      const urls: SitemapUrl[] = [
        { url: 'https://example.com/admin/users' },
        { url: 'https://example.com/admin/settings' },
        { url: 'https://example.com/api/v1/users' },
        { url: 'https://example.com/api/v2/posts' },
        { url: 'https://example.com/page1' },
      ];

      const sitemap = generator.generateSitemap(urls);

      expect(sitemap).not.toContain('https://example.com/admin/users');
      expect(sitemap).not.toContain('https://example.com/admin/settings');
      expect(sitemap).not.toContain('https://example.com/api/v1/users');
      expect(sitemap).not.toContain('https://example.com/api/v2/posts');
      expect(sitemap).toContain('https://example.com/page1');
    });
  });

  describe('Policy Management', () => {
    it('should return current policy', () => {
      const policy = generator.getPolicy();

      expect(policy.defaultChangeFreq).toBe('weekly');
      expect(policy.defaultPriority).toBe(0.8);
      expect(policy.excludePatterns).toContain('/admin/**');
      expect(policy.maxUrlsPerSitemap).toBe(50000);
    });

    it('should update policy', () => {
      const updates: Partial<SitemapPolicy> = {
        defaultChangeFreq: 'daily',
        defaultPriority: 0.5,
        enableImageSitemap: false,
      };

      generator.updatePolicy(updates);
      const policy = generator.getPolicy();

      expect(policy.defaultChangeFreq).toBe('daily');
      expect(policy.defaultPriority).toBe(0.5);
      expect(policy.enableImageSitemap).toBe(false);
    });
  });
});

describe('Utility Functions', () => {
  describe('createSitemapGenerator', () => {
    it('should create SitemapGenerator instance', () => {
      const generator = createSitemapGenerator({
        baseUrl: 'https://example.com',
      });

      expect(generator).toBeInstanceOf(SitemapGenerator);
    });
  });

  describe('generateSitemap', () => {
    it('should generate sitemap using options', () => {
      const urls: SitemapUrl[] = [{ url: 'https://example.com/page1' }];
      const options: SitemapGenerationOptions = {
        baseUrl: 'https://example.com',
        defaultPriority: 0.5,
      };

      const sitemap = generateSitemap(urls, options);

      expect(sitemap).toContain('<priority>0.5</priority>');
    });
  });

  describe('createSitemapUrl', () => {
    it('should create sitemap URL with minimal options', () => {
      const url = createSitemapUrl('https://example.com/page');

      expect(url.url).toBe('https://example.com/page');
      expect(url.lastmod).toBeUndefined();
      expect(url.changefreq).toBeUndefined();
      expect(url.priority).toBeUndefined();
    });

    it('should create sitemap URL with all options', () => {
      const image = createSitemapImage('https://example.com/image.jpg');
      const news = createSitemapNews(
        { name: 'Test News', language: 'en' },
        '2026-03-29',
        'Test Title'
      );

      const url = createSitemapUrl('https://example.com/page', {
        lastmod: '2026-03-29',
        changefreq: 'daily',
        priority: 1.0,
        images: [image],
        news: [news],
      });

      expect(url.url).toBe('https://example.com/page');
      expect(url.lastmod).toBe('2026-03-29');
      expect(url.changefreq).toBe('daily');
      expect(url.priority).toBe(1.0);
      expect(url.images).toEqual([image]);
      expect(url.news).toEqual([news]);
    });
  });

  describe('createSitemapImage', () => {
    it('should create sitemap image with minimal options', () => {
      const image = createSitemapImage('https://example.com/image.jpg');

      expect(image.loc).toBe('https://example.com/image.jpg');
      expect(image.caption).toBeUndefined();
      expect(image.geo_location).toBeUndefined();
      expect(image.title).toBeUndefined();
      expect(image.license).toBeUndefined();
    });

    it('should create sitemap image with all options', () => {
      const image = createSitemapImage('https://example.com/image.jpg', {
        caption: 'Test Caption',
        geo_location: 'New York, NY',
        title: 'Test Title',
        license: 'https://example.com/license',
      });

      expect(image.loc).toBe('https://example.com/image.jpg');
      expect(image.caption).toBe('Test Caption');
      expect(image.geo_location).toBe('New York, NY');
      expect(image.title).toBe('Test Title');
      expect(image.license).toBe('https://example.com/license');
    });
  });

  describe('createSitemapNews', () => {
    it('should create sitemap news object', () => {
      const news = createSitemapNews(
        { name: 'Test News', language: 'en' },
        '2026-03-29',
        'Test Title'
      );

      expect(news.publication.name).toBe('Test News');
      expect(news.publication.language).toBe('en');
      expect(news.publication_date).toBe('2026-03-29');
      expect(news.title).toBe('Test Title');
    });
  });

  describe('validateSitemapUrl', () => {
    it('should validate valid sitemap URL', () => {
      const url: SitemapUrl = {
        url: 'https://example.com/page',
        priority: 0.8,
      };

      const result = validateSitemapUrl(url);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should invalidate invalid URL format', () => {
      const url: SitemapUrl = {
        url: 'not-a-valid-url',
      };

      const result = validateSitemapUrl(url);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid URL format');
    });

    it('should invalidate priority out of range', () => {
      const url: SitemapUrl = {
        url: 'https://example.com/page',
        priority: 1.5,
      };

      const result = validateSitemapUrl(url);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Priority must be between 0 and 1');
    });

    it('should invalidate negative priority', () => {
      const url: SitemapUrl = {
        url: 'https://example.com/page',
        priority: -0.1,
      };

      const result = validateSitemapUrl(url);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Priority must be between 0 and 1');
    });

    it('should validate valid images', () => {
      const url: SitemapUrl = {
        url: 'https://example.com/page',
        images: [
          { loc: 'https://example.com/image1.jpg' },
          { loc: 'https://example.com/image2.jpg' },
        ],
      };

      const result = validateSitemapUrl(url);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should invalidate invalid image URLs', () => {
      const url: SitemapUrl = {
        url: 'https://example.com/page',
        images: [
          { loc: 'https://example.com/valid-image.jpg' },
          { loc: 'invalid-image-url' },
        ],
      };

      const result = validateSitemapUrl(url);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid image URL: invalid-image-url');
    });

    it('should validate valid news', () => {
      const url: SitemapUrl = {
        url: 'https://example.com/page',
        news: [
          {
            publication: { name: 'Test News', language: 'en' },
            publication_date: '2026-03-29',
            title: 'Test Title',
          },
        ],
      };

      const result = validateSitemapUrl(url);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should invalidate missing publication name', () => {
      const url: SitemapUrl = {
        url: 'https://example.com/page',
        news: [
          {
            publication: { name: '', language: 'en' },
            publication_date: '2026-03-29',
            title: 'Test Title',
          },
        ],
      };

      const result = validateSitemapUrl(url);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('News publication must have name and language');
    });

    it('should invalidate missing publication date', () => {
      const url: SitemapUrl = {
        url: 'https://example.com/page',
        news: [
          {
            publication: { name: 'Test News', language: 'en' },
            publication_date: '',
            title: 'Test Title',
          },
        ],
      };

      const result = validateSitemapUrl(url);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('News must have publication_date');
    });

    it('should invalidate missing title', () => {
      const url: SitemapUrl = {
        url: 'https://example.com/page',
        news: [
          {
            publication: { name: 'Test News', language: 'en' },
            publication_date: '2026-03-29',
            title: '',
          },
        ],
      };

      const result = validateSitemapUrl(url);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('News must have title');
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complete e-commerce sitemap generation', () => {
    const generator = new SitemapGenerator({
      baseUrl: 'https://store.example.com',
      defaultChangeFreq: 'weekly',
      defaultPriority: 0.8,
      excludePatterns: ['/admin/**', '/checkout/**'],
      enableImageSitemap: true,
      enableNewsSitemap: false,
    });

    const urls: SitemapUrl[] = [
      {
        url: 'https://store.example.com/',
        changefreq: 'daily',
        priority: 1.0,
      },
      {
        url: 'https://store.example.com/products/wireless-headphones',
        changefreq: 'weekly',
        priority: 0.8,
        images: [
          {
            loc: 'https://store.example.com/images/headphones-main.jpg',
            caption: 'Premium Wireless Headphones - Black Color',
            title: 'Wireless Headphones Product Image',
          },
          {
            loc: 'https://store.example.com/images/headphones-detail.jpg',
            caption: 'Wireless Headphones Detail View',
          },
        ],
      },
      {
        url: 'https://store.example.com/categories/electronics',
        changefreq: 'weekly',
        priority: 0.6,
      },
      {
        url: 'https://store.example.com/blog/review-wireless-headphones',
        changefreq: 'monthly',
        priority: 0.7,
        images: [
          {
            loc: 'https://store.example.com/blog/images/review-hero.jpg',
            title: 'Wireless Headphones Review',
          },
        ],
      },
    ];

    const sitemap = generator.generateSitemap(urls);

    // Verify structure
    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(sitemap).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
    
    // Verify URLs
    expect(sitemap).toContain('<loc>https://store.example.com/</loc>');
    expect(sitemap).toContain('<changefreq>daily</changefreq>');
    expect(sitemap).toContain('<priority>1.0</priority>');
    
    expect(sitemap).toContain('<loc>https://store.example.com/products/wireless-headphones</loc>');
    expect(sitemap).toContain('<changefreq>weekly</changefreq>');
    expect(sitemap).toContain('<priority>0.8</priority>');
    
    // Verify images
    expect(sitemap).toContain('<image:loc>https://store.example.com/images/headphones-main.jpg</image:loc>');
    expect(sitemap).toContain('<image:caption>Premium Wireless Headphones - Black Color</image:caption>');
    expect(sitemap).toContain('<image:title>Wireless Headphones Product Image</image:title>');
  });

  it('should handle news website sitemap generation', () => {
    const generator = new SitemapGenerator({
      baseUrl: 'https://news.example.com',
      defaultChangeFreq: 'hourly',
      defaultPriority: 0.9,
      excludePatterns: ['/admin/**', '/drafts/**'],
      enableImageSitemap: true,
      enableNewsSitemap: true,
    });

    const urls: SitemapUrl[] = [
      {
        url: 'https://news.example.com/breaking-tech-story',
        changefreq: 'hourly',
        priority: 1.0,
        lastmod: '2026-03-29T10:00:00Z',
        news: [
          {
            publication: { name: 'Tech Daily News', language: 'en' },
            publication_date: '2026-03-29T09:30:00Z',
            title: 'Breaking: Major Technology Breakthrough Announced',
          },
        ],
        images: [
          {
            loc: 'https://news.example.com/images/tech-breakthrough.jpg',
            caption: 'Technology breakthrough announcement press conference',
            title: 'Tech Breakthrough News Image',
          },
        ],
      },
      {
        url: 'https://news.example.com/world-updates',
        changefreq: 'hourly',
        priority: 0.8,
        lastmod: '2026-03-29T11:30:00Z',
        news: [
          {
            publication: { name: 'Tech Daily News', language: 'en' },
            publication_date: '2026-03-29T11:00:00Z',
            title: 'Latest World Updates and Analysis',
          },
        ],
      },
    ];

    const sitemap = generator.generateSitemap(urls);

    // Verify namespaces
    expect(sitemap).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
    expect(sitemap).toContain('xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"');
    
    // Verify news entries
    expect(sitemap).toContain('<news:news>');
    expect(sitemap).toContain('<news:name>Tech Daily News</news:name>');
    expect(sitemap).toContain('<news:language>en</news:language>');
    expect(sitemap).toContain('<news:publication_date>2026-03-29T09:30:00Z</news:publication_date>');
    expect(sitemap).toContain('<news:title>Breaking: Major Technology Breakthrough Announced</news:title>');
    
    // Verify images in news context
    expect(sitemap).toContain('<image:loc>https://news.example.com/images/tech-breakthrough.jpg</image:loc>');
    expect(sitemap).toContain('<image:caption>Technology breakthrough announcement press conference</image:caption>');
  });

  it('should handle large sitemap with index generation', () => {
    const generator = new SitemapGenerator({
      baseUrl: 'https://blog.example.com',
      maxUrlsPerSitemap: 1000,
      enableImageSitemap: false,
      enableNewsSitemap: false,
    });

    // Generate 2500 blog post URLs
    const urls: SitemapUrl[] = [];
    for (let i = 1; i <= 2500; i++) {
      urls.push({
        url: `https://blog.example.com/post-${i}`,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: '2026-03-29',
      });
    }

    const sitemap = generator.generateSitemap(urls);

    // Should generate sitemap index
    expect(sitemap).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(sitemap).toContain('<sitemap><loc>https://blog.example.com/sitemap-1.xml</loc>');
    expect(sitemap).toContain('<sitemap><loc>https://blog.example.com/sitemap-2.xml</loc>');
    expect(sitemap).toContain('<sitemap><loc>https://blog.example.com/sitemap-3.xml</loc>');
    expect(sitemap).not.toContain('<sitemap><loc>https://blog.example.com/sitemap-4.xml</loc>');
  });

  it('should handle multilingual website sitemap', () => {
    const generator = new SitemapGenerator({
      baseUrl: 'https://example.com',
      includeOnlyPatterns: ['/en/**', '/es/**', '/fr/**'],
      enableImageSitemap: true,
      enableNewsSitemap: false,
    });

    const urls: SitemapUrl[] = [
      {
        url: 'https://example.com/en/home',
        changefreq: 'weekly',
        priority: 1.0,
        images: [
          {
            loc: 'https://example.com/images/home-en.jpg',
            title: 'Home Page English',
          },
        ],
      },
      {
        url: 'https://example.com/es/inicio',
        changefreq: 'weekly',
        priority: 1.0,
        images: [
          {
            loc: 'https://example.com/images/home-es.jpg',
            title: 'Página de Inicio Español',
          },
        ],
      },
      {
        url: 'https://example.com/fr/accueil',
        changefreq: 'weekly',
        priority: 1.0,
        images: [
          {
            loc: 'https://example.com/images/home-fr.jpg',
            title: 'Page d\'Accueil Français',
          },
        ],
      },
      {
        url: 'https://example.com/admin/dashboard', // Should be excluded
        changefreq: 'daily',
        priority: 0.1,
      },
    ];

    const sitemap = generator.generateSitemap(urls);

    // Should include language pages
    expect(sitemap).toContain('<loc>https://example.com/en/home</loc>');
    expect(sitemap).toContain('<loc>https://example.com/es/inicio</loc>');
    expect(sitemap).toContain('<loc>https://example.com/fr/accueil</loc>');
    
    // Should exclude admin page
    expect(sitemap).not.toContain('<loc>https://example.com/admin/dashboard</loc>');
    
    // Should include images with proper titles
    expect(sitemap).toContain('<image:title>Home Page English</image:title>');
    expect(sitemap).toContain('<image:title>Página de Inicio Español</image:title>');
    expect(sitemap).toContain('<image:title>Page d\'Accueil Français</image:title>');
  });
});
