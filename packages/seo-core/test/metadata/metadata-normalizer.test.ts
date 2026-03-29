/**
 * Metadata Normalizer Tests
 * 
 * Comprehensive test suite for metadata normalization covering:
 * - Metadata normalization and validation
 * - Title template processing
 * - Open Graph normalization
 * - Twitter Card normalization
 * - Custom normalization rules
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  MetadataNormalizer,
  createMetadataNormalizer,
  normalizeMetadata,
  validateMetadata,
} from '../../src/metadata/index.js';
import type { SEOMetadata, SEOValidationResult } from '../../src/types/index.js';
import type { MetadataNormalizationOptions } from '../../src/metadata/index.js';

describe('MetadataNormalizer', () => {
  let normalizer: MetadataNormalizer;
  let defaultOptions: MetadataNormalizationOptions;

  beforeEach(() => {
    defaultOptions = {
      baseUrl: 'https://example.com',
      titleTemplate: '%s | Test Site',
      defaultLocale: 'en-US',
      enforceHttps: true,
      removeTrailingSlash: false,
      addTrailingSlash: false,
      normalizeUrls: true,
      generateMissing: true,
      validateLengths: true,
      maxTitleLength: 60,
      maxDescriptionLength: 160,
    };
    
    normalizer = createMetadataNormalizer(defaultOptions);
  });

  describe('Constructor and Configuration', () => {
    it('should create normalizer with default options', () => {
      const defaultNormalizer = new MetadataNormalizer();
      const options = defaultNormalizer.getOptions();
      
      expect(options.titleTemplate).toBe('%s | %s');
      expect(options.maxTitleLength).toBe(60);
      expect(options.maxDescriptionLength).toBe(160);
    });

    it('should create normalizer with custom options', () => {
      const customOptions = {
        ...defaultOptions,
        titleTemplate: '%s - Custom Site',
        maxTitleLength: 70,
      };
      
      const customNormalizer = new MetadataNormalizer(customOptions);
      const options = customNormalizer.getOptions();
      
      expect(options.titleTemplate).toBe('%s - Custom Site');
      expect(options.maxTitleLength).toBe(70);
    });

    it('should update options correctly', () => {
      normalizer.updateOptions({
        titleTemplate: '%s | Updated Site',
        maxTitleLength: 65,
      });
      
      const options = normalizer.getOptions();
      expect(options.titleTemplate).toBe('%s | Updated Site');
      expect(options.maxTitleLength).toBe(65);
    });
  });

  describe('Title Normalization', () => {
    it('should apply title template correctly', () => {
      const metadata = { title: 'Page Title' };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.title).toBe('Page Title | Test Site');
    });

    it('should handle title template with multiple placeholders', () => {
      normalizer.updateOptions({
        titleTemplate: '%s | %s | Site',
      });
      
      const metadata = { title: 'Page Title' };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.title).toBe('Page Title | Test Site | Site');
    });

    it('should not override existing title if template is disabled', () => {
      normalizer.updateOptions({
        titleTemplate: '',
      });
      
      const metadata = { title: 'Original Title' };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.title).toBe('Original Title');
    });

    it('should truncate titles that exceed maximum length', () => {
      const longTitle = 'This is a very long title that exceeds the maximum recommended length for SEO purposes';
      const metadata = { title: longTitle };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.title?.length).toBeLessThanOrEqual(63); // Max length + ellipsis
      expect(normalized.title).toContain('...');
    });

    it('should generate title from description if missing', () => {
      const metadata = {
        description: 'This is a description that can be used to generate a title when no title is provided.',
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.title).toBeTruthy();
      expect(normalized.title?.length).toBeGreaterThan(0);
      expect(normalized.title?.length).toBeLessThanOrEqual(defaultOptions.maxTitleLength!);
    });

    it('should generate default title if no content available', () => {
      const metadata = {};
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.title).toBe('Test Site');
    });
  });

  describe('Description Normalization', () => {
    it('should keep valid descriptions unchanged', () => {
      const validDescription = 'This is a valid description that meets the length requirements and provides good context.';
      const metadata = { description: validDescription };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.description).toBe(validDescription);
    });

    it('should truncate descriptions that exceed maximum length', () => {
      const longDescription = 'This is a very long description that exceeds the maximum recommended length for meta descriptions which should be concise and compelling while staying within SEO best practice guidelines for search engine optimization.';
      const metadata = { description: longDescription };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.description?.length).toBeLessThanOrEqual(163); // Max length + ellipsis
      expect(normalized.description).toContain('...');
    });

    it('should generate description from title if missing', () => {
      const metadata = { title: 'Page Title Here' };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.description).toBeTruthy();
      expect(normalized.description?.length).toBeGreaterThan(100);
      expect(normalized.description?.length).toBeLessThanOrEqual(defaultOptions.maxDescriptionLength!);
    });

    it('should generate default description if no content available', () => {
      const metadata = {};
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.description).toBe('Welcome to Test Site');
    });
  });

  describe('URL Normalization', () => {
    it('should normalize relative URLs to absolute', () => {
      const metadata = {
        'og:url': '/page',
        canonical: '/page',
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['og:url']).toBe('https://example.com/page');
      expect(normalized.canonical).toBe('https://example.com/page');
    });

    it('should enforce HTTPS on URLs', () => {
      const metadata = {
        'og:url': 'http://example.com/page',
        canonical: 'http://example.com/page',
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['og:url']).toBe('https://example.com/page');
      expect(normalized.canonical).toBe('https://example.com/page');
    });

    it('should remove trailing slash when configured', () => {
      normalizer.updateOptions({
        removeTrailingSlash: true,
      });
      
      const metadata = {
        'og:url': 'https://example.com/page/',
        canonical: 'https://example.com/page/',
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['og:url']).toBe('https://example.com/page');
      expect(normalized.canonical).toBe('https://example.com/page');
    });

    it('should add trailing slash when configured', () => {
      normalizer.updateOptions({
        addTrailingSlash: true,
      });
      
      const metadata = {
        'og:url': 'https://example.com/page',
        canonical: 'https://example.com/page',
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['og:url']).toBe('https://example.com/page/');
      expect(normalized.canonical).toBe('https://example.com/page/');
    });

    it('should handle URL normalization edge cases', () => {
      const testCases = [
        { input: '//example.com/page', expected: 'https://example.com/page' },
        { input: 'https://sub.example.com/page', expected: 'https://sub.example.com/page' },
        { input: '/path/with/multiple/segments', expected: 'https://example.com/path/with/multiple/segments' },
      ];
      
      testCases.forEach(({ input, expected }) => {
        const metadata = { 'og:url': input };
        const normalized = normalizer.normalize(metadata);
        expect(normalized['og:url']).toBe(expected);
      });
    });
  });

  describe('Open Graph Normalization', () => {
    it('should copy title to og:title if missing', () => {
      const metadata = { title: 'Page Title' };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['og:title']).toBe('Page Title | Test Site');
    });

    it('should copy description to og:description if missing', () => {
      const metadata = { description: 'Page description' };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['og:description']).toBe('Page description');
    });

    it('should set default og:type if missing', () => {
      const metadata = {};
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['og:type']).toBe('website');
    });

    it('should set default og:locale if missing', () => {
      const metadata = {};
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['og:locale']).toBe('en-US');
    });

    it('should set og:site_name from title template', () => {
      const metadata = {};
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['og:site_name']).toBe('Test Site');
    });

    it('should normalize og:image URLs', () => {
      const metadata = { 'og:image': '/image.jpg' };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['og:image']).toBe('https://example.com/image.jpg');
    });
  });

  describe('Twitter Card Normalization', () => {
    it('should set default twitter:card if missing', () => {
      const metadata = {};
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['twitter:card']).toBe('summary_large_image');
    });

    it('should copy title to twitter:title if missing', () => {
      const metadata = { title: 'Page Title' };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['twitter:title']).toBe('Page Title | Test Site');
    });

    it('should copy description to twitter:description if missing', () => {
      const metadata = { description: 'Page description' };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['twitter:description']).toBe('Page description');
    });

    it('should copy og:image to twitter:image if missing', () => {
      const metadata = { 'og:image': 'https://example.com/image.jpg' };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['twitter:image']).toBe('https://example.com/image.jpg');
    });

    it('should normalize twitter:image URLs', () => {
      const metadata = { 'twitter:image': '/image.jpg' };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['twitter:image']).toBe('https://example.com/image.jpg');
    });
  });

  describe('Robots Meta Normalization', () => {
    it('should set default robots if missing', () => {
      const metadata = {};
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.robots).toBe('index,follow');
    });

    it('should preserve existing robots meta', () => {
      const metadata = { robots: 'noindex,nofollow' };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.robots).toBe('noindex,nofollow');
    });
  });

  describe('Author and Timestamp Normalization', () => {
    it('should set default author if missing and generateMissing is true', () => {
      normalizer.updateOptions({
        defaultAuthor: 'Test Author',
      });
      
      const metadata = {};
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.author).toBe('Test Author');
    });

    it('should preserve existing author', () => {
      const metadata = { author: 'Custom Author' };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.author).toBe('Custom Author');
    });

    it('should set current timestamp for published_time if missing', () => {
      const metadata = {};
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.published_time).toBeTruthy();
      expect(normalized.published_time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should preserve existing timestamps', () => {
      const timestamp = '2023-01-01T12:00:00Z';
      const metadata = { 
        published_time: timestamp,
        modified_time: timestamp,
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.published_time).toBe(timestamp);
      expect(normalized.modified_time).toBe(timestamp);
    });
  });

  describe('Custom Field Normalization', () => {
    it('should preserve custom fields', () => {
      const metadata = {
        'custom:field': 'value',
        'another:field': 'another value',
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['custom:field']).toBe('value');
      expect(normalized['another:field']).toBe('another value');
    });

    it('should handle custom normalization rules', () => {
      normalizer.updateOptions({
        customRules: [
          {
            field: 'custom:field',
            normalize: (value: string) => value.toUpperCase(),
          },
        ],
      });
      
      const metadata = { 'custom:field': 'lowercase' };
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['custom:field']).toBe('LOWERCASE');
    });
  });

  describe('Validation', () => {
    it('should validate metadata correctly', () => {
      const validMetadata = {
        title: 'Valid Title',
        description: 'Valid description with sufficient length.',
        canonical: 'https://example.com/page',
      };
      
      const result = normalizer.validate(validMetadata);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should report validation errors', () => {
      const invalidMetadata = {
        title: 'Short',
        description: 'Too short',
        canonical: 'not-a-url',
      };
      
      const result = normalizer.validate(invalidMetadata);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should provide validation warnings', () => {
      const metadata = {
        title: 'This title is too long and exceeds the recommended maximum length for SEO purposes',
        description: 'Valid description here.',
      };
      
      const result = normalizer.validate(metadata);
      
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null/undefined metadata', () => {
      expect(() => normalizer.normalize(null as any)).not.toThrow();
      expect(() => normalizer.normalize(undefined as any)).not.toThrow();
      
      const result1 = normalizer.normalize(null as any);
      const result2 = normalizer.normalize(undefined as any);
      
      expect(result1.title).toBeTruthy();
      expect(result2.title).toBeTruthy();
    });

    it('should handle empty metadata object', () => {
      const metadata = {};
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.title).toBeTruthy();
      expect(normalized.description).toBeTruthy();
      expect(normalized['og:type']).toBeTruthy();
      expect(normalized['twitter:card']).toBeTruthy();
    });

    it('should handle malformed URLs gracefully', () => {
      const metadata = {
        canonical: 'not-a-valid-url',
        'og:url': 'javascript:alert(1)',
      };
      
      expect(() => normalizer.normalize(metadata)).not.toThrow();
      
      const normalized = normalizer.normalize(metadata);
      expect(normalized.canonical).toBe('not-a-valid-url'); // Should preserve invalid URL
    });

    it('should handle very long strings', () => {
      const veryLongString = 'a'.repeat(10000);
      const metadata = {
        title: veryLongString,
        description: veryLongString,
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.title?.length).toBeLessThanOrEqual(63);
      expect(normalized.description?.length).toBeLessThanOrEqual(163);
    });
  });
});

describe('Factory Functions', () => {
  describe('createMetadataNormalizer', () => {
    it('should create MetadataNormalizer instance', () => {
      const normalizer = createMetadataNormalizer();
      
      expect(normalizer).toBeInstanceOf(MetadataNormalizer);
    });

    it('should create normalizer with custom options', () => {
      const options = {
        baseUrl: 'https://custom.com',
        titleTemplate: '%s | Custom',
      };
      
      const normalizer = createMetadataNormalizer(options);
      const config = normalizer.getOptions();
      
      expect(config.baseUrl).toBe('https://custom.com');
      expect(config.titleTemplate).toBe('%s | Custom');
    });
  });

  describe('normalizeMetadata', () => {
    it('should normalize metadata using default normalizer', () => {
      const metadata = { title: 'Test Title' };
      const normalized = normalizeMetadata(metadata, {
        baseUrl: 'https://example.com',
        titleTemplate: '%s | Site',
      });
      
      expect(normalized.title).toBe('Test Title | Site');
    });
  });

  describe('validateMetadata', () => {
    it('should validate metadata using default normalizer', () => {
      const validMetadata = {
        title: 'Valid Title',
        description: 'Valid description length here.',
      };
      
      const result = validateMetadata(validMetadata);
      
      expect(result.valid).toBe(true);
    });

    it('should validate with custom options', () => {
      const invalidMetadata = { title: 'x' };
      
      const result = validateMetadata(invalidMetadata, {
        maxTitleLength: 10,
        validateLengths: true,
      });
      
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });
});
