/**
 * Schema Generator Tests
 * 
 * Comprehensive test suite for Schema.org structured data generation covering:
 * - Website schema generation
 * - Organization schema generation
 * - Article schema generation
 * - Breadcrumb schema generation
 * - Schema validation
 * - Script tag generation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  SchemaGenerator,
  createSchemaGenerator,
  generateWebsiteSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  validateSchema,
  schemaToScriptTag,
} from '../../src/schema/index.js';
import type { StructuredData } from '../../src/types/index.js';
import type { SchemaGenerationOptions } from '../../src/schema/index.js';

describe('SchemaGenerator', () => {
  let generator: SchemaGenerator;
  let defaultOptions: SchemaGenerationOptions;

  beforeEach(() => {
    defaultOptions = {
      baseUrl: 'https://example.com',
      siteName: 'Example Site',
      defaultLocale: 'en-US',
      organization: {
        name: 'Example Company',
        url: 'https://example.com',
        logo: 'https://example.com/logo.png',
        description: 'Example company description',
      },
    };
    
    generator = createSchemaGenerator(defaultOptions);
  });

  describe('Constructor and Configuration', () => {
    it('should create generator with default options', () => {
      const minimalGenerator = createSchemaGenerator({
        baseUrl: 'https://test.com',
        siteName: 'Test Site',
      });

      expect(minimalGenerator).toBeInstanceOf(SchemaGenerator);
    });

    it('should create generator with custom options', () => {
      const customOptions: SchemaGenerationOptions = {
        baseUrl: 'https://custom.com',
        siteName: 'Custom Site',
        defaultLocale: 'en-GB',
        organization: {
          name: 'Custom Org',
          url: 'https://custom.com',
          logo: 'https://custom.com/logo.jpg',
          description: 'Custom organization',
        },
      };

      const customGenerator = createSchemaGenerator(customOptions);
      
      expect(customGenerator).toBeInstanceOf(SchemaGenerator);
    });

    it('should use default values for missing options', () => {
      const minimalGenerator = createSchemaGenerator({
        baseUrl: 'https://test.com',
        siteName: 'Test Site',
      });

      const websiteSchema = minimalGenerator.generateWebsiteSchema();
      
      expect(websiteSchema.inLanguage).toBe('en-US');
      expect(websiteSchema.url).toBe('https://test.com');
      expect(websiteSchema.name).toBe('Test Site');
    });
  });

  describe('Website Schema Generation', () => {
    it('should generate valid website schema', () => {
      const schema = generator.generateWebsiteSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema.name).toBe('Example Site');
      expect(schema.url).toBe('https://example.com');
      expect(schema.inLanguage).toBe('en-US');
      expect(schema.potentialAction).toBeDefined();
    });

    it('should generate search action correctly', () => {
      const schema = generator.generateWebsiteSchema();
      const searchAction = schema.potentialAction as any;

      expect(searchAction['@type']).toBe('SearchAction');
      expect(searchAction.target).toBe('https://example.com/search?q={search_term_string}');
      expect(searchAction['query-input']).toBe('required name=search_term_string');
    });

    it('should use custom locale in website schema', () => {
      const customGenerator = createSchemaGenerator({
        baseUrl: 'https://example.com',
        siteName: 'Example Site',
        defaultLocale: 'fr-FR',
      });

      const schema = customGenerator.generateWebsiteSchema();
      
      expect(schema.inLanguage).toBe('fr-FR');
    });
  });

  describe('Organization Schema Generation', () => {
    it('should generate valid organization schema', () => {
      const schema = generator.generateOrganizationSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Organization');
      expect(schema.name).toBe('Example Company');
      expect(schema.url).toBe('https://example.com');
      expect(schema.logo).toBe('https://example.com/logo.png');
      expect(schema.description).toBe('Example company description');
    });

    it('should handle minimal organization data', () => {
      const minimalGenerator = createSchemaGenerator({
        baseUrl: 'https://test.com',
        siteName: 'Test Site',
      });

      const schema = minimalGenerator.generateOrganizationSchema();
      
      expect(schema.name).toBe('Test Site');
      expect(schema.url).toBe('https://test.com');
      expect(schema.logo).toBeUndefined();
      expect(schema.description).toBeUndefined();
    });

    it('should use default organization from site info', () => {
      const minimalGenerator = createSchemaGenerator({
        baseUrl: 'https://test.com',
        siteName: 'Test Site',
      });

      const schema = minimalGenerator.generateOrganizationSchema();
      
      expect(schema.name).toBe('Test Site');
      expect(schema.url).toBe('https://test.com');
    });
  });

  describe('Article Schema Generation', () => {
    it('should generate valid article schema with minimal data', () => {
      const articleOptions = {
        title: 'Test Article',
        description: 'Test article description',
        url: 'https://example.com/test-article',
      };

      const schema = generator.generateArticleSchema(articleOptions);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Article');
      expect(schema.headline).toBe('Test Article');
      expect(schema.description).toBe('Test article description');
      expect(schema.url).toBe('https://example.com/test-article');
    });

    it('should generate article schema with all optional fields', () => {
      const articleOptions = {
        title: 'Complete Article',
        description: 'Complete article description',
        url: 'https://example.com/complete-article',
        author: 'John Doe',
        publishedDate: '2023-01-01T00:00:00Z',
        modifiedDate: '2023-01-02T00:00:00Z',
        image: 'https://example.com/image.jpg',
      };

      const schema = generator.generateArticleSchema(articleOptions);

      expect(schema.author).toBe('John Doe');
      expect(schema.datePublished).toBe('2023-01-01T00:00:00Z');
      expect(schema.dateModified).toBe('2023-01-02T00:00:00Z');
      expect(schema.image).toBe('https://example.com/image.jpg');
    });

    it('should handle missing optional fields gracefully', () => {
      const articleOptions = {
        title: 'Minimal Article',
        description: 'Minimal description',
        url: 'https://example.com/minimal',
      };

      const schema = generator.generateArticleSchema(articleOptions);

      expect(schema.author).toBeUndefined();
      expect(schema.datePublished).toBeUndefined();
      expect(schema.dateModified).toBeUndefined();
      expect(schema.image).toBeUndefined();
    });
  });

  describe('Breadcrumb Schema Generation', () => {
    it('should generate valid breadcrumb schema', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://example.com' },
        { name: 'Category', url: 'https://example.com/category' },
        { name: 'Subcategory', url: 'https://example.com/category/subcategory' },
        { name: 'Current Page', url: 'https://example.com/category/subcategory/page' },
      ];

      const schema = generator.generateBreadcrumbSchema(breadcrumbs);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toBeDefined();
      expect(Array.isArray(schema.itemListElement)).toBe(true);
      expect(schema.itemListElement).toHaveLength(4);
    });

    it('should generate breadcrumb items with correct structure', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://example.com' },
        { name: 'Page', url: 'https://example.com/page' },
      ];

      const schema = generator.generateBreadcrumbSchema(breadcrumbs);
      const items = schema.itemListElement as any[];

      expect(items[0]).toEqual({
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://example.com',
      });

      expect(items[1]).toEqual({
        '@type': 'ListItem',
        position: 2,
        name: 'Page',
        item: 'https://example.com/page',
      });
    });

    it('should handle single breadcrumb', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://example.com' },
      ];

      const schema = generator.generateBreadcrumbSchema(breadcrumbs);
      const items = schema.itemListElement as any[];

      expect(items).toHaveLength(1);
      expect(items[0].position).toBe(1);
    });

    it('should handle empty breadcrumbs', () => {
      const schema = generator.generateBreadcrumbSchema([]);
      const items = schema.itemListElement as any[];

      expect(items).toEqual([]);
    });
  });

  describe('Schema Validation', () => {
    it('should validate correct schema', () => {
      const validSchema: StructuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Test Site',
        url: 'https://example.com',
      };

      const result = validateSchema(validSchema);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const invalidSchema: StructuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Test Site',
        // Missing url
      };

      const result = validateSchema(invalidSchema);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect invalid @context', () => {
      const invalidSchema = {
        '@context': 'https://invalid-schema.org',
        '@type': 'WebSite',
        name: 'Test Site',
        url: 'https://example.com',
      };

      const result = validateSchema(invalidSchema);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid @context value');
    });

    it('should detect invalid @type', () => {
      const invalidSchema: StructuredData = {
        '@context': 'https://schema.org',
        '@type': 'InvalidType',
        name: 'Test Site',
        url: 'https://example.com',
      };

      const result = validateSchema(invalidSchema);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Unsupported schema type: InvalidType');
    });

    it('should validate article schema specific fields', () => {
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Article Title',
        description: 'Article description',
        url: 'https://example.com/article',
      };

      const result = validateSchema(articleSchema);

      expect(result.valid).toBe(true);
    });

    it('should detect missing article required fields', () => {
      const invalidArticle = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Article Title',
        // Missing description and url
      };

      const result = validateSchema(invalidArticle);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Article schema requires description');
      expect(result.errors).toContain('Article schema requires url');
    });
  });

  describe('Script Tag Generation', () => {
    it('should generate valid JSON-LD script tag', () => {
      const schema: StructuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Test Site',
        url: 'https://example.com',
      };

      const scriptTag = schemaToScriptTag(schema);

      expect(scriptTag).toContain('<script type="application/ld+json">');
      expect(scriptTag).toContain('</script>');
      expect(scriptTag).toContain('"@context":"https://schema.org"');
      expect(scriptTag).toContain('"@type":"WebSite"');
      expect(scriptTag).toContain('"name":"Test Site"');
    });

    it('should escape special characters in script tag', () => {
      const schema: StructuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Test "Site" with & special <characters>',
        url: 'https://example.com',
      };

      const scriptTag = schemaToScriptTag(schema);

      expect(scriptTag).toContain('Test \\"Site\\" with & special <characters>');
    });

    it('should handle complex nested schema', () => {
      const complexSchema: StructuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Complex Site',
        url: 'https://example.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://example.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      };

      const scriptTag = schemaToScriptTag(complexSchema);

      expect(scriptTag).toContain('"potentialAction":{');
      expect(scriptTag).toContain('"@type":"SearchAction"');
    });

    it('should handle empty schema gracefully', () => {
      const emptySchema: StructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Thing',
      };

      const scriptTag = schemaToScriptTag(emptySchema);

      expect(scriptTag).toContain('<script type="application/ld+json">');
      expect(scriptTag).toContain('</script>');
    });
  });

  describe('Factory Functions', () => {
    it('should create schema generator with factory function', () => {
      const factoryGenerator = createSchemaGenerator(defaultOptions);
      
      expect(factoryGenerator).toBeInstanceOf(SchemaGenerator);
      
      const websiteSchema = factoryGenerator.generateWebsiteSchema();
      expect(websiteSchema.name).toBe('Example Site');
    });

    it('should generate website schema with factory function', () => {
      const schema = generateWebsiteSchema(defaultOptions);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema.name).toBe('Example Site');
      expect(schema.url).toBe('https://example.com');
    });

    it('should generate article schema with factory function', () => {
      const articleOptions = {
        title: 'Factory Article',
        description: 'Factory article description',
        url: 'https://example.com/factory-article',
      };

      const schema = generateArticleSchema(articleOptions, defaultOptions);

      expect(schema['@type']).toBe('Article');
      expect(schema.headline).toBe('Factory Article');
      expect(schema.description).toBe('Factory article description');
    });

    it('should generate breadcrumb schema with factory function', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://example.com' },
        { name: 'Factory', url: 'https://example.com/factory' },
      ];

      const schema = generateBreadcrumbSchema(breadcrumbs);

      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(2);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null/undefined inputs gracefully', () => {
      expect(() => validateSchema(null as any)).not.toThrow();
      expect(() => validateSchema(undefined as any)).not.toThrow();
      expect(() => schemaToScriptTag(null as any)).not.toThrow();
      expect(() => schemaToScriptTag(undefined as any)).not.toThrow();
    });

    it('should handle malformed schema objects', () => {
      const malformedSchemas = [
        null,
        undefined,
        'string-instead-of-object',
        123,
        [],
        { invalidProperty: 'value' },
      ];

      malformedSchemas.forEach(schema => {
        const result = validateSchema(schema as any);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    it('should handle very long titles and descriptions', () => {
      const longTitle = 'A'.repeat(200);
      const longDescription = 'B'.repeat(500);

      const articleOptions = {
        title: longTitle,
        description: longDescription,
        url: 'https://example.com/long-article',
      };

      const schema = generator.generateArticleSchema(articleOptions);
      
      expect(schema.headline).toBe(longTitle);
      expect(schema.description).toBe(longDescription);
    });

    it('should handle special characters in URLs', () => {
      const articleOptions = {
        title: 'Special Characters',
        description: 'Article with special characters',
        url: 'https://example.com/path-with-dashes_and_underscores?param=value&other=123#fragment',
      };

      const schema = generator.generateArticleSchema(articleOptions);
      
      expect(schema.url).toBe(articleOptions.url);
    });
  });
});
