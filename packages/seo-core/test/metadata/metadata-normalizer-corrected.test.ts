/**
 * Metadata Normalizer Tests
 * 
 * Comprehensive test suite for metadata normalization covering:
 * - Metadata normalization and validation
 * - Title case normalization
 * - Open Graph generation
 * - Twitter Card generation
 * - URL validation
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

  beforeEach(() => {
    normalizer = new MetadataNormalizer({
      defaultLocale: 'en-US',
      trimWhitespace: true,
      normalizeTitleCase: true,
      generateMissingOG: true,
      generateMissingTwitter: true,
      removeDuplicates: true,
      validateUrls: true,
    });
  });

  describe('Constructor and Configuration', () => {
    it('should create normalizer with default options', () => {
      const defaultNormalizer = new MetadataNormalizer();
      
      expect(defaultNormalizer).toBeInstanceOf(MetadataNormalizer);
    });

    it('should create normalizer with custom options', () => {
      const customNormalizer = new MetadataNormalizer({
        defaultLocale: 'fr-FR',
        trimWhitespace: false,
        normalizeTitleCase: false,
      });
      
      expect(customNormalizer).toBeInstanceOf(MetadataNormalizer);
    });
  });

  describe('Whitespace Trimming', () => {
    it('should trim whitespace from text fields', () => {
      const metadata: SEOMetadata = {
        title: '  Test Title  ',
        description: '  Test description with  extra spaces  ',
        author: '  Test Author  ',
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.title).toBe('Test Title');
      expect(normalized.description).toBe('Test description with extra spaces');
      expect(normalized.author).toBe('Test Author');
    });

    it('should normalize multiple spaces to single space', () => {
      const metadata: SEOMetadata = {
        title: 'Test    Title    With    Multiple    Spaces',
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.title).toBe('Test Title With Multiple Spaces');
    });

    it('should preserve whitespace when trimWhitespace is false', () => {
      const noTrimNormalizer = new MetadataNormalizer({ trimWhitespace: false });
      const metadata: SEOMetadata = {
        title: '  Test Title  ',
      };
      
      const normalized = noTrimNormalizer.normalize(metadata);
      
      expect(normalized.title).toBe('  Test Title  ');
    });
  });

  describe('Title Case Normalization', () => {
    it('should normalize title case correctly', () => {
      const testCases = [
        { input: 'test title', expected: 'Test Title' },
        { input: 'TEST TITLE', expected: 'Test Title' },
        { input: 'tEsT tItLe', expected: 'Test Title' },
        { input: 'the quick brown fox', expected: 'The Quick Brown Fox' },
        { input: 'a tale of two cities', expected: 'A Tale of Two Cities' },
      ];
      
      testCases.forEach(({ input, expected }) => {
        const metadata: SEOMetadata = { title: input };
        const normalized = normalizer.normalize(metadata);
        expect(normalized.title).toBe(expected);
      });
    });

    it('should preserve exceptions in lowercase', () => {
      const testCases = [
        { input: 'SEO Best Practices', expected: 'SEO Best Practices' },
        { input: 'API Documentation', expected: 'API Documentation' },
        { input: 'URL Structure', expected: 'URL Structure' },
        { input: 'HTML and CSS', expected: 'HTML and CSS' },
        { input: 'The UI UX Design', expected: 'The UI UX Design' },
      ];
      
      testCases.forEach(({ input, expected }) => {
        const metadata: SEOMetadata = { title: input };
        const normalized = normalizer.normalize(metadata);
        expect(normalized.title).toBe(expected);
      });
    });

    it('should preserve title case when normalizeTitleCase is false', () => {
      const noNormalizeNormalizer = new MetadataNormalizer({ normalizeTitleCase: false });
      const metadata: SEOMetadata = {
        title: 'CUSTOM TITLE FORMAT',
      };
      
      const normalized = noNormalizeNormalizer.normalize(metadata);
      
      expect(normalized.title).toBe('CUSTOM TITLE FORMAT');
    });
  });

  describe('Open Graph Generation', () => {
    it('should generate missing Open Graph tags from basic metadata', () => {
      const metadata: SEOMetadata = {
        title: 'Test Title',
        description: 'Test description',
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['og:title']).toBe('Test Title');
      expect(normalized['og:description']).toBe('Test description');
      expect(normalized['og:type']).toBe('website');
      expect(normalized['og:locale']).toBe('en-US');
    });

    it('should not overwrite existing Open Graph tags', () => {
      const metadata: SEOMetadata = {
        title: 'Test Title',
        description: 'Test description',
        'og:title': 'Custom OG Title',
        'og:type': 'article',
        'og:locale': 'fr-FR',
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['og:title']).toBe('Custom OG Title');
      expect(normalized['og:description']).toBe('Test description');
      expect(normalized['og:type']).toBe('article');
      expect(normalized['og:locale']).toBe('fr-FR');
    });

    it('should generate og:image from twitter:image', () => {
      const metadata: SEOMetadata = {
        'twitter:image': 'https://example.com/image.jpg',
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['og:image']).toBe('https://example.com/image.jpg');
    });

    it('should not generate Open Graph tags when generateMissingOG is false', () => {
      const noOGNormalizer = new MetadataNormalizer({ generateMissingOG: false });
      const metadata: SEOMetadata = {
        title: 'Test Title',
        description: 'Test description',
      };
      
      const normalized = noOGNormalizer.normalize(metadata);
      
      expect(normalized['og:title']).toBeUndefined();
      expect(normalized['og:description']).toBeUndefined();
      expect(normalized['og:type']).toBeUndefined();
    });
  });

  describe('Twitter Card Generation', () => {
    it('should generate missing Twitter Card tags from Open Graph', () => {
      const metadata: SEOMetadata = {
        'og:title': 'OG Title',
        'og:description': 'OG Description',
        'og:image': 'https://example.com/og-image.jpg',
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['twitter:title']).toBe('OG Title');
      expect(normalized['twitter:description']).toBe('OG Description');
      expect(normalized['twitter:image']).toBe('https://example.com/og-image.jpg');
      expect(normalized['twitter:card']).toBe('summary_large_image');
    });

    it('should generate Twitter tags from basic metadata as fallback', () => {
      const metadata: SEOMetadata = {
        title: 'Test Title',
        description: 'Test description',
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['twitter:title']).toBe('Test Title');
      expect(normalized['twitter:description']).toBe('Test description');
      expect(normalized['twitter:card']).toBe('summary_large_image');
    });

    it('should not overwrite existing Twitter Card tags', () => {
      const metadata: SEOMetadata = {
        'twitter:title': 'Custom Twitter Title',
        'twitter:card': 'summary',
        'twitter:description': 'Custom Twitter Description',
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized['twitter:title']).toBe('Custom Twitter Title');
      expect(normalized['twitter:card']).toBe('summary');
      expect(normalized['twitter:description']).toBe('Custom Twitter Description');
    });

    it('should not generate Twitter tags when generateMissingTwitter is false', () => {
      const noTwitterNormalizer = new MetadataNormalizer({ generateMissingTwitter: false });
      const metadata: SEOMetadata = {
        'og:title': 'OG Title',
        'og:description': 'OG Description',
      };
      
      const normalized = noTwitterNormalizer.normalize(metadata);
      
      expect(normalized['twitter:title']).toBeUndefined();
      expect(normalized['twitter:description']).toBeUndefined();
      expect(normalized['twitter:card']).toBeUndefined();
    });
  });

  describe('URL Validation', () => {
    it('should validate URLs in metadata', () => {
      const metadata: SEOMetadata = {
        canonical: 'https://example.com/page',
        'og:url': 'https://example.com/page',
        'og:image': 'https://example.com/image.jpg',
        'twitter:image': 'https://example.com/twitter-image.jpg',
      };
      
      // Should not throw and should preserve valid URLs
      expect(() => normalizer.normalize(metadata)).not.toThrow();
      
      const normalized = normalizer.normalize(metadata);
      expect(normalized.canonical).toBe('https://example.com/page');
      expect(normalized['og:url']).toBe('https://example.com/page');
      expect(normalized['og:image']).toBe('https://example.com/image.jpg');
      expect(normalized['twitter:image']).toBe('https://example.com/twitter-image.jpg');
    });

    it('should handle invalid URLs gracefully', () => {
      const metadata: SEOMetadata = {
        canonical: 'not-a-valid-url',
        'og:image': 'also-not-valid',
      };
      
      // Should not throw, just preserve the invalid URLs
      expect(() => normalizer.normalize(metadata)).not.toThrow();
      
      const normalized = normalizer.normalize(metadata);
      expect(normalized.canonical).toBe('not-a-valid-url');
      expect(normalized['og:image']).toBe('also-not-valid');
    });

    it('should not validate URLs when validateUrls is false', () => {
      const noValidateNormalizer = new MetadataNormalizer({ validateUrls: false });
      const metadata: SEOMetadata = {
        canonical: 'not-a-valid-url',
      };
      
      expect(() => noValidateNormalizer.normalize(metadata)).not.toThrow();
    });
  });

  describe('Duplicate Removal', () => {
    it('should preserve metadata structure', () => {
      const metadata: SEOMetadata = {
        title: 'Test Title',
        'og:title': 'Test Title', // Same as title
        description: 'Test Description',
        'og:description': 'Test Description', // Same as description
      };
      
      const normalized = normalizer.normalize(metadata);
      
      // Should preserve both sets (implementation may change)
      expect(normalized.title).toBe('Test Title');
      expect(normalized['og:title']).toBe('Test Title');
      expect(normalized.description).toBe('Test Description');
      expect(normalized['og:description']).toBe('Test Description');
    });
  });

  describe('Validation', () => {
    it('should validate complete metadata successfully', () => {
      const validMetadata: SEOMetadata = {
        title: 'This is a valid title that meets length requirements',
        description: 'This is a valid description that meets the minimum length requirements and provides good context for search engines and users.',
        canonical: 'https://example.com/page',
        'og:type': 'website',
        'og:url': 'https://example.com/page',
        robots: 'index,follow',
      };
      
      const result = normalizer.validate(validMetadata);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should report missing required fields', () => {
      const incompleteMetadata: SEOMetadata = {
        title: 'Short',
        // Missing description
      };
      
      const result = normalizer.validate(incompleteMetadata);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Title is required');
      expect(result.errors).toContain('Description is required');
    });

    it('should warn about title length issues', () => {
      const testCases = [
        {
          title: 'Short',
          expectedWarning: 'Title is too short (minimum 30 characters recommended)',
        },
        {
          title: 'This title is way too long and exceeds the maximum recommended length for SEO purposes',
          expectedWarning: 'Title is too long (maximum 60 characters recommended)',
        },
      ];
      
      testCases.forEach(({ title, expectedWarning }) => {
        const metadata: SEOMetadata = {
          title,
          description: 'Valid description length here with sufficient characters to meet minimum requirements.',
        };
        
        const result = normalizer.validate(metadata);
        expect(result.warnings).toContain(expectedWarning);
      });
    });

    it('should warn about description length issues', () => {
      const testCases = [
        {
          description: 'Too short',
          expectedWarning: 'Description is too short (minimum 100 characters recommended)',
        },
        {
          description: 'This description is way too long and exceeds the maximum recommended length for meta descriptions which should be concise and compelling while staying within SEO best practices.',
          expectedWarning: 'Description is too long (maximum 160 characters recommended)',
        },
      ];
      
      testCases.forEach(({ description, expectedWarning }) => {
        const metadata: SEOMetadata = {
          title: 'Valid Title Length Here For SEO Requirements',
          description,
        };
        
        const result = normalizer.validate(metadata);
        expect(result.warnings).toContain(expectedWarning);
      });
    });

    it('should validate URL formats', () => {
      const invalidMetadata: SEOMetadata = {
        title: 'Valid Title Length Here For SEO Requirements',
        description: 'Valid description length here with sufficient characters to meet minimum requirements.',
        canonical: 'not-a-valid-url',
        'og:image': 'also-not-valid',
      };
      
      const result = normalizer.validate(invalidMetadata);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid canonical URL format');
      expect(result.errors).toContain('Invalid og:image URL format');
    });

    it('should warn about invalid twitter:card values', () => {
      const metadata: SEOMetadata = {
        title: 'Valid Title Length Here For SEO Requirements',
        description: 'Valid description length here with sufficient characters to meet minimum requirements.',
        'twitter:card': 'invalid_card_type',
      };
      
      const result = normalizer.validate(metadata);
      
      expect(result.warnings).toContain('Invalid twitter:card value: invalid_card_type');
    });

    it('should warn about missing recommended tags', () => {
      const minimalMetadata: SEOMetadata = {
        title: 'Valid Title Length Here For SEO Requirements',
        description: 'Valid description length here with sufficient characters to meet minimum requirements.',
      };
      
      const result = normalizer.validate(minimalMetadata);
      
      expect(result.warnings).toContain('Recommended tag \'og:type\' is missing');
      expect(result.warnings).toContain('Recommended tag \'og:url\' is missing');
      expect(result.warnings).toContain('Recommended tag \'canonical\' is missing');
      expect(result.warnings).toContain('Recommended tag \'robots\' is missing');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null/undefined metadata', () => {
      expect(() => normalizer.normalize(null as any)).not.toThrow();
      expect(() => normalizer.normalize(undefined as any)).not.toThrow();
      
      const result1 = normalizer.normalize(null as any);
      const result2 = normalizer.normalize(undefined as any);
      
      expect(result1).toEqual({});
      expect(result2).toEqual({});
    });

    it('should handle empty metadata object', () => {
      const metadata: SEOMetadata = {};
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized).toEqual({});
    });

    it('should handle very long strings', () => {
      const veryLongString = 'a'.repeat(10000);
      const metadata: SEOMetadata = {
        title: veryLongString,
        description: veryLongString,
      };
      
      expect(() => normalizer.normalize(metadata)).not.toThrow();
      
      const normalized = normalizer.normalize(metadata);
      expect(normalized.title).toBe(veryLongString);
      expect(normalized.description).toBe(veryLongString);
    });

    it('should handle special characters in text', () => {
      const metadata: SEOMetadata = {
        title: 'Test & Title • With • Special • Characters',
        description: 'Description with "quotes" and \'apostrophes\' and & symbols.',
      };
      
      const normalized = normalizer.normalize(metadata);
      
      expect(normalized.title).toBe('Test & Title • With • Special • Characters');
      expect(normalized.description).toBe('Description with "quotes" and \'apostrophes\' and & symbols.');
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
      const options: MetadataNormalizationOptions = {
        defaultLocale: 'fr-FR',
        trimWhitespace: false,
        normalizeTitleCase: false,
      };
      
      const normalizer = createMetadataNormalizer(options);
      
      expect(normalizer).toBeInstanceOf(MetadataNormalizer);
    });
  });

  describe('normalizeMetadata', () => {
    it('should normalize metadata using provided options', () => {
      const metadata: SEOMetadata = { title: '  test title  ' };
      const options: MetadataNormalizationOptions = {
        trimWhitespace: true,
        normalizeTitleCase: true,
      };
      
      const normalized = normalizeMetadata(metadata, options);
      
      expect(normalized.title).toBe('Test Title');
    });

    it('should use default options when none provided', () => {
      const metadata: SEOMetadata = { title: '  test title  ' };
      
      const normalized = normalizeMetadata(metadata);
      
      expect(normalized.title).toBe('Test Title');
    });
  });

  describe('validateMetadata', () => {
    it('should validate metadata using default normalizer', () => {
      const validMetadata: SEOMetadata = {
        title: 'Valid Title Length Here For SEO Requirements',
        description: 'Valid description length here with sufficient characters to meet minimum requirements.',
      };
      
      const result = validateMetadata(validMetadata);
      
      expect(result.valid).toBe(true);
    });

    it('should report validation errors', () => {
      const invalidMetadata: SEOMetadata = {
        title: 'Short',
        description: 'Too short',
      };
      
      const result = validateMetadata(invalidMetadata);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
