/**
 * Metadata Normalization System Tests
 * 
 * Comprehensive test suite for metadata normalization following 2026 best practices
 * Uses Vitest with type-safe mocks and AAA pattern
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { SEOMetadata, SEOValidationResult } from '../../src/types/index.js';
import { 
  MetadataNormalizer, 
  createMetadataNormalizer,
  normalizeMetadata,
  validateMetadata,
  type MetadataNormalizationOptions
} from '../../src/metadata/index.js';

describe('MetadataNormalizer', () => {
  let normalizer: MetadataNormalizer;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Setup fresh normalizer for each test
    normalizer = new MetadataNormalizer();
    // Mock console to avoid noise in tests
    consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('Constructor', () => {
    it('should initialize with default options', () => {
      const normalizer = new MetadataNormalizer();
      expect(normalizer).toBeInstanceOf(MetadataNormalizer);
    });

    it('should accept custom options', () => {
      const options: MetadataNormalizationOptions = {
        trimWhitespace: false,
        normalizeTitleCase: false,
        generateMissingOG: false,
        generateMissingTwitter: false,
        removeDuplicates: false,
        validateUrls: false,
        defaultLocale: 'fr-FR',
      };
      
      const normalizer = new MetadataNormalizer(options);
      expect(normalizer).toBeInstanceOf(MetadataNormalizer);
    });
  });

  describe('normalize', () => {
    describe('Whitespace Trimming', () => {
      it('should trim whitespace from text fields when enabled', () => {
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

      it('should not trim whitespace when disabled', () => {
        const normalizer = new MetadataNormalizer({ trimWhitespace: false });
        const metadata: SEOMetadata = {
          title: '  Test Title  ',
          description: '  Test description  ',
        };

        const normalized = normalizer.normalize(metadata);

        expect(normalized.title).toBe('  Test Title  ');
        expect(normalized.description).toBe('  Test description  ');
      });

      it('should handle multiple consecutive spaces', () => {
        const metadata: SEOMetadata = {
          title: 'Test    Title     With     Spaces',
          description: 'Description  with  multiple   spaces',
        };

        const normalized = normalizer.normalize(metadata);

        expect(normalized.title).toBe('Test Title With Spaces');
        expect(normalized.description).toBe('Description with multiple spaces');
      });
    });

    describe('Title Normalization', () => {
      it('should normalize title case when enabled', () => {
        const metadata: SEOMetadata = {
          title: 'the quick brown fox jumps over the lazy dog',
        };

        const normalized = normalizer.normalize(metadata);

        expect(normalized.title).toBe('The Quick Brown Fox Jumps Over the Lazy Dog');
      });

      it('should preserve acronyms and technical terms', () => {
        const metadata: SEOMetadata = {
          title: 'seo api and url optimization for html and css in js applications',
        };

        const normalized = normalizer.normalize(metadata);

        expect(normalized.title).toBe('SEO API and URL Optimization for HTML and CSS in JS Applications');
      });

      it('should not normalize title case when disabled', () => {
        const normalizer = new MetadataNormalizer({ normalizeTitleCase: false });
        const metadata: SEOMetadata = {
          title: 'lowercase title should remain unchanged',
        };

        const normalized = normalizer.normalize(metadata);

        expect(normalized.title).toBe('lowercase title should remain unchanged');
      });

      it('should handle empty title gracefully', () => {
        const metadata: SEOMetadata = {};

        const normalized = normalizer.normalize(metadata);

        expect(normalized.title).toBeUndefined();
      });
    });

    describe('Open Graph Generation', () => {
      it('should generate missing Open Graph tags from basic metadata', () => {
        const metadata: SEOMetadata = {
          title: 'Test Title',
          description: 'Test Description',
        };

        const normalized = normalizer.normalize(metadata);

        expect(normalized['og:title']).toBe('Test Title');
        expect(normalized['og:description']).toBe('Test Description');
        expect(normalized['og:type']).toBe('website');
        expect(normalized['og:locale']).toBe('en-US');
      });

      it('should generate og:image from twitter:image when missing', () => {
        const metadata: SEOMetadata = {
          'twitter:image': 'https://example.com/twitter-image.jpg',
        };

        const normalized = normalizer.normalize(metadata);

        expect(normalized['og:image']).toBe('https://example.com/twitter-image.jpg');
      });

      it('should not override existing Open Graph tags', () => {
        const metadata: SEOMetadata = {
          title: 'Test Title',
          'og:title': 'Custom OG Title',
          'og:type': 'article',
        };

        const normalized = normalizer.normalize(metadata);

        expect(normalized['og:title']).toBe('Custom OG Title');
        expect(normalized['og:type']).toBe('article');
      });

      it('should not generate when disabled', () => {
        const normalizer = new MetadataNormalizer({ generateMissingOG: false });
        const metadata: SEOMetadata = {
          title: 'Test Title',
          description: 'Test Description',
        };

        const normalized = normalizer.normalize(metadata);

        expect(normalized['og:title']).toBeUndefined();
        expect(normalized['og:description']).toBeUndefined();
      });
    });

    describe('Twitter Card Generation', () => {
      it('should generate missing Twitter tags from Open Graph', () => {
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

      it('should fallback to basic metadata when OG is missing', () => {
        const metadata: SEOMetadata = {
          title: 'Basic Title',
          description: 'Basic Description',
        };

        const normalized = normalizer.normalize(metadata);

        expect(normalized['twitter:title']).toBe('Basic Title');
        expect(normalized['twitter:description']).toBe('Basic Description');
        expect(normalized['twitter:card']).toBe('summary_large_image');
      });

      it('should not override existing Twitter tags', () => {
        const metadata: SEOMetadata = {
          'og:title': 'OG Title',
          'twitter:title': 'Custom Twitter Title',
          'twitter:card': 'summary',
        };

        const normalized = normalizer.normalize(metadata);

        expect(normalized['twitter:title']).toBe('Custom Twitter Title');
        expect(normalized['twitter:card']).toBe('summary');
      });

      it('should not generate when disabled', () => {
        const normalizer = new MetadataNormalizer({ generateMissingTwitter: false });
        const metadata: SEOMetadata = {
          'og:title': 'OG Title',
        };

        const normalized = normalizer.normalize(metadata);

        expect(normalized['twitter:title']).toBeUndefined();
      });
    });

    describe('URL Validation', () => {
      it('should warn about non-HTTPS URLs in production', () => {
        const metadata: SEOMetadata = {
          canonical: 'http://example.com/page',
          'og:url': 'http://example.com/og',
        };

        normalizer.normalize(metadata);

        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('should use HTTPS: http://example.com/page')
        );
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('should use HTTPS: http://example.com/og')
        );
      });

      it('should allow HTTP for localhost', () => {
        const metadata: SEOMetadata = {
          canonical: 'http://localhost:3000/page',
          'og:url': 'http://127.0.0.1:3000/og',
        };

        normalizer.normalize(metadata);

        expect(consoleSpy).not.toHaveBeenCalled();
      });

      it('should warn about invalid URLs', () => {
        const metadata: SEOMetadata = {
          canonical: 'not-a-valid-url',
          'og:image': 'also-not-valid',
        };

        normalizer.normalize(metadata);

        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Invalid URL in canonical: not-a-valid-url')
        );
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Invalid URL in og:image: also-not-valid')
        );
      });

      it('should not validate when disabled', () => {
        const normalizer = new MetadataNormalizer({ validateUrls: false });
        const metadata: SEOMetadata = {
          canonical: 'not-a-valid-url',
        };

        normalizer.normalize(metadata);

        expect(consoleSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('validate', () => {
    describe('Title Validation', () => {
      it('should validate missing title as error', () => {
        const metadata: SEOMetadata = {
          description: 'A valid description that meets the minimum length requirement for testing purposes.',
        };

        const result = normalizer.validate(metadata);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Title is required');
      });

      it('should warn about short title', () => {
        const metadata: SEOMetadata = {
          title: 'Short',
          description: 'A valid description that meets the minimum length requirement for testing purposes.',
        };

        const result = normalizer.validate(metadata);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain('Title is too short (minimum 30 characters recommended)');
      });

      it('should warn about long title', () => {
        const metadata: SEOMetadata = {
          title: 'This is a very long title that exceeds the recommended maximum length for SEO purposes and should trigger a warning',
          description: 'A valid description that meets the minimum length requirement for testing purposes.',
        };

        const result = normalizer.validate(metadata);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain('Title is too long (maximum 60 characters recommended)');
      });

      it('should accept title within recommended range', () => {
        const metadata: SEOMetadata = {
          title: 'This is a good title length for SEO purposes',
          description: 'A valid description that meets the minimum length requirement for testing purposes.',
        };

        const result = normalizer.validate(metadata);

        expect(result.valid).toBe(true);
        expect(result.warnings).not.toContain(
          expect.stringMatching(/Title is (too short|too long)/)
        );
      });
    });

    describe('Description Validation', () => {
      it('should validate missing description as error', () => {
        const metadata: SEOMetadata = {
          title: 'A valid title that meets the minimum length requirement for SEO purposes',
        };

        const result = normalizer.validate(metadata);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Description is required');
      });

      it('should warn about short description', () => {
        const metadata: SEOMetadata = {
          title: 'A valid title that meets the minimum length requirement for SEO purposes',
          description: 'Too short',
        };

        const result = normalizer.validate(metadata);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain('Description is too short (minimum 100 characters recommended)');
      });

      it('should warn about long description', () => {
        const metadata: SEOMetadata = {
          title: 'A valid title that meets the minimum length requirement for SEO purposes',
          description: 'This is a very long description that exceeds the recommended maximum length for SEO purposes. It contains way too many characters and should trigger a warning in the validation system. Descriptions should be concise and to the point while still providing enough information to be useful for search engine optimization purposes.',
        };

        const result = normalizer.validate(metadata);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain('Description is too long (maximum 160 characters recommended)');
      });

      it('should accept description within recommended range', () => {
        const metadata: SEOMetadata = {
          title: 'A valid title that meets the minimum length requirement for SEO purposes',
          description: 'This is a good description length that meets the minimum requirement and stays within the maximum recommended length for SEO purposes while providing useful information.',
        };

        const result = normalizer.validate(metadata);

        expect(result.valid).toBe(true);
        expect(result.warnings).not.toContain(
          expect.stringMatching(/Description is (too short|too long)/)
        );
      });
    });

    describe('URL Validation', () => {
      it('should validate valid canonical URL', () => {
        const metadata: SEOMetadata = {
          title: 'A valid title that meets the minimum length requirement for SEO purposes',
          description: 'This is a good description length that meets the minimum requirement and stays within the maximum recommended length for SEO purposes while providing useful information.',
          canonical: 'https://example.com/page',
        };

        const result = normalizer.validate(metadata);

        expect(result.valid).toBe(true);
        expect(result.errors).not.toContain(expect.stringMatching(/canonical URL/i));
      });

      it('should validate invalid canonical URL', () => {
        const metadata: SEOMetadata = {
          title: 'A valid title that meets the minimum length requirement for SEO purposes',
          description: 'This is a good description length that meets the minimum requirement and stays within the maximum recommended length for SEO purposes while providing useful information.',
          canonical: 'not-a-valid-url',
        };

        const result = normalizer.validate(metadata);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Invalid canonical URL format');
      });

      it('should validate invalid og:image URL', () => {
        const metadata: SEOMetadata = {
          title: 'A valid title that meets the minimum length requirement for SEO purposes',
          description: 'This is a good description length that meets the minimum requirement and stays within the maximum recommended length for SEO purposes while providing useful information.',
          'og:image': 'invalid-image-url',
        };

        const result = normalizer.validate(metadata);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Invalid og:image URL format');
      });
    });

    describe('Twitter Card Validation', () => {
      it('should validate valid twitter:card values', () => {
        const validCards = ['summary', 'summary_large_image', 'app', 'player'];
        
        validCards.forEach(cardType => {
          const metadata: SEOMetadata = {
            title: 'A valid title that meets the minimum length requirement for SEO purposes',
            description: 'This is a good description length that meets the minimum requirement and stays within the maximum recommended length for SEO purposes while providing useful information.',
            'twitter:card': cardType,
          };

          const result = normalizer.validate(metadata);

          expect(result.valid).toBe(true);
          expect(result.warnings).not.toContain(
            expect.stringMatching(/Invalid twitter:card value/)
          );
        });
      });

      it('should warn about invalid twitter:card value', () => {
        const metadata: SEOMetadata = {
          title: 'A valid title that meets the minimum length requirement for SEO purposes',
          description: 'This is a good description length that meets the minimum requirement and stays within the maximum recommended length for SEO purposes while providing useful information.',
          'twitter:card': 'invalid_card_type',
        };

        const result = normalizer.validate(metadata);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain('Invalid twitter:card value: invalid_card_type');
      });
    });

    describe('Recommended Tags Validation', () => {
      it('should warn about missing recommended tags', () => {
        const metadata: SEOMetadata = {
          title: 'A valid title that meets the minimum length requirement for SEO purposes',
          description: 'This is a good description length that meets the minimum requirement and stays within the maximum recommended length for SEO purposes while providing useful information.',
        };

        const result = normalizer.validate(metadata);

        expect(result.warnings).toContain("Recommended tag 'og:type' is missing");
        expect(result.warnings).toContain("Recommended tag 'og:url' is missing");
        expect(result.warnings).toContain("Recommended tag 'canonical' is missing");
        expect(result.warnings).toContain("Recommended tag 'robots' is missing");
      });

      it('should not warn about present recommended tags', () => {
        const metadata: SEOMetadata = {
          title: 'A valid title that meets the minimum length requirement for SEO purposes',
          description: 'This is a good description length that meets the minimum requirement and stays within the maximum recommended length for SEO purposes while providing useful information.',
          'og:type': 'website',
          'og:url': 'https://example.com/page',
          canonical: 'https://example.com/canonical',
          robots: 'index,follow',
        };

        const result = normalizer.validate(metadata);

        expect(result.warnings).not.toContain(
          expect.stringMatching(/Recommended tag .* is missing/)
        );
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty metadata object', () => {
      const metadata: SEOMetadata = {};

      const normalized = normalizer.normalize(metadata);
      const result = normalizer.validate(metadata);

      expect(normalized).toEqual({});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Title is required');
      expect(result.errors).toContain('Description is required');
    });

    it('should handle null and undefined values gracefully', () => {
      const metadata: SEOMetadata = {
        title: undefined as any,
        description: null as any,
        'og:image': undefined as any,
      };

      const normalized = normalizer.normalize(metadata);
      const result = normalizer.validate(metadata);

      expect(normalized.title).toBeUndefined();
      expect(normalized.description).toBeNull();
      expect(result.valid).toBe(false);
    });

    it('should handle malformed URLs in validation', () => {
      const metadata: SEOMetadata = {
        title: 'A valid title that meets the minimum length requirement for SEO purposes',
        description: 'This is a good description length that meets the minimum requirement and stays within the maximum recommended length for SEO purposes while providing useful information.',
        canonical: 'htp://malformed-url',
        'og:image': 'https://[invalid-ipv6]:80/path/',
      };

      const result = normalizer.validate(metadata);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid canonical URL format');
      expect(result.errors).toContain('Invalid og:image URL format');
    });

    it('should handle extremely long strings', () => {
      const longTitle = 'A'.repeat(1000);
      const longDescription = 'B'.repeat(2000);
      
      const metadata: SEOMetadata = {
        title: longTitle,
        description: longDescription,
      };

      const result = normalizer.validate(metadata);

      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Title is too long (maximum 60 characters recommended)');
      expect(result.warnings).toContain('Description is too long (maximum 160 characters recommended)');
    });
  });
});

describe('Utility Functions', () => {
  describe('createMetadataNormalizer', () => {
    it('should create MetadataNormalizer instance', () => {
      const normalizer = createMetadataNormalizer();
      expect(normalizer).toBeInstanceOf(MetadataNormalizer);
    });

    it('should pass options to constructor', () => {
      const options: MetadataNormalizationOptions = {
        trimWhitespace: false,
        defaultLocale: 'fr-FR',
      };
      
      const normalizer = createMetadataNormalizer(options);
      expect(normalizer).toBeInstanceOf(MetadataNormalizer);
    });
  });

  describe('normalizeMetadata', () => {
    it('should normalize metadata using default options', () => {
      const metadata: SEOMetadata = {
        title: '  test title  ',
        description: '  test description  ',
      };

      const normalized = normalizeMetadata(metadata);

      expect(normalized.title).toBe('Test Title');
      expect(normalized.description).toBe('Test description');
      expect(normalized['og:title']).toBe('Test Title');
      expect(normalized['og:description']).toBe('Test description');
    });

    it('should accept custom options', () => {
      const metadata: SEOMetadata = {
        title: '  test title  ',
      };

      const options: MetadataNormalizationOptions = {
        trimWhitespace: false,
        generateMissingOG: false,
      };

      const normalized = normalizeMetadata(metadata, options);

      expect(normalized.title).toBe('  test title  ');
      expect(normalized['og:title']).toBeUndefined();
    });
  });

  describe('validateMetadata', () => {
    it('should validate metadata', () => {
      const metadata: SEOMetadata = {
        title: 'Valid Title Length For SEO',
        description: 'Valid description length that meets minimum requirements.',
      };

      const result = validateMetadata(metadata);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return validation errors for invalid metadata', () => {
      const metadata: SEOMetadata = {};

      const result = validateMetadata(metadata);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Title is required');
      expect(result.errors).toContain('Description is required');
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complete metadata normalization workflow', () => {
    const metadata: SEOMetadata = {
      title: '  the ultimate guide to seo optimization in 2026  ',
      description: '  learn the latest seo strategies and best practices for improving your search engine rankings and online visibility.  ',
      author: '  SEO Expert  ',
      'og:image': 'https://example.com/og-image.jpg',
      canonical: 'https://example.com/ultimate-seo-guide-2026',
    };

    const normalizer = new MetadataNormalizer();
    const normalized = normalizer.normalize(metadata);
    const validation = normalizer.validate(normalized);

    expect(normalized.title).toBe('The Ultimate Guide to SEO Optimization in 2026');
    expect(normalized.description).toBe('Learn the latest SEO strategies and best practices for improving your search engine rankings and online visibility.');
    expect(normalized.author).toBe('SEO Expert');
    expect(normalized['og:title']).toBe('The Ultimate Guide to SEO Optimization in 2026');
    expect(normalized['og:description']).toBe('Learn the latest SEO strategies and best practices for improving your search engine rankings and online visibility.');
    expect(normalized['og:type']).toBe('website');
    expect(normalized['twitter:card']).toBe('summary_large_image');
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('should handle real-world e-commerce product metadata', () => {
    const metadata: SEOMetadata = {
      title: 'premium wireless headphones - noise cancelling | brandname',
      description: 'Experience premium sound quality with our wireless headphones. Features active noise cancellation, 30-hour battery life, and superior comfort for all-day wear.',
      'og:type': 'product',
      'og:image': 'https://example.com/product-image.jpg',
      'og:price:amount': '299.99',
      'og:price:currency': 'USD',
      canonical: 'https://example.com/products/premium-wireless-headphones',
      robots: 'index,follow',
    };

    const normalizer = new MetadataNormalizer();
    const normalized = normalizer.normalize(metadata);
    const validation = normalizer.validate(normalized);

    expect(normalized['og:title']).toBe('Premium Wireless Headphones - Noise Cancelling | Brandname');
    expect(normalized['twitter:title']).toBe('Premium Wireless Headphones - Noise Cancelling | Brandname');
    expect(validation.valid).toBe(true);
    expect(validation.warnings).toHaveLength(0);
  });

  it('should handle blog article metadata with author information', () => {
    const metadata: SEOMetadata = {
      title: 'how to implement technical seo: a complete guide for developers',
      description: 'Learn how to implement technical SEO best practices in your web applications. This comprehensive guide covers metadata, structured data, site speed, and more.',
      author: 'John Doe',
      'og:type': 'article',
      'article:author': 'John Doe',
      'article:published_time': '2026-03-29T10:00:00Z',
      'article:modified_time': '2026-03-29T15:30:00Z',
      canonical: 'https://example.com/blog/technical-seo-guide',
      robots: 'index,follow',
    };

    const normalizer = new MetadataNormalizer();
    const normalized = normalizer.normalize(metadata);
    const validation = normalizer.validate(normalized);

    expect(normalized.title).toBe('How to Implement Technical SEO: A Complete Guide for Developers');
    expect(normalized['twitter:title']).toBe('How to Implement Technical SEO: A Complete Guide for Developers');
    expect(validation.valid).toBe(true);
    expect(validation.warnings).toHaveLength(0);
  });
});
