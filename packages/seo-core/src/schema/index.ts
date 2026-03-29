/**
 * Schema.org Structured Data System
 * 
 * Generates and validates schema.org structured data for SEO
 */

import { z } from 'zod';
import type { StructuredData, SEOValidationResult } from '../types/index.js';

/**
 * Schema generation options
 */
export interface SchemaGenerationOptions {
  /** Base URL for the site */
  baseUrl: string;
  
  /** Site name */
  siteName: string;
  
  /** Default locale */
  defaultLocale?: string;
  
  /** Organization/website information */
  organization?: {
    name: string;
    url: string;
    logo?: string;
    description?: string;
  };
}

/**
 * Schema generator class
 */
export class SchemaGenerator {
  private options: Required<SchemaGenerationOptions>;

  constructor(options: SchemaGenerationOptions) {
    this.options = {
      defaultLocale: 'en-US',
      organization: {
        name: options.siteName,
        url: options.baseUrl,
      },
      ...options,
    };
  }

  /**
   * Generate basic website schema
   */
  generateWebsiteSchema(): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.options.siteName,
      url: this.options.baseUrl,
      inLanguage: this.options.defaultLocale,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.options.baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  }

  /**
   * Generate organization schema
   */
  generateOrganizationSchema(): StructuredData {
    const org = this.options.organization!;

    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: org.name,
      url: org.url,
      logo: org.logo,
      description: org.description,
    };
  }

  /**
   * Generate article schema
   */
  generateArticleSchema(options: {
    title: string;
    description: string;
    url: string;
    author?: string;
    publishedDate?: string;
    modifiedDate?: string;
    image?: string;
  }): StructuredData {
    const schema: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: options.title,
      description: options.description,
      url: options.url,
      datePublished: options.publishedDate,
      dateModified: options.modifiedDate || options.publishedDate,
      author: options.author ? {
        '@type': 'Person',
        name: options.author,
      } : undefined,
      publisher: {
        '@type': 'Organization',
        name: this.options.organization!.name,
        logo: this.options.organization!.logo ? {
          '@type': 'ImageObject',
          url: this.options.organization!.logo,
        } : undefined,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': options.url,
      },
    };

    if (options.image) {
      schema.image = {
        '@type': 'ImageObject',
        url: options.image,
      };
    }

    return schema;
  }

  /**
   * Generate breadcrumb list schema
   */
  generateBreadcrumbSchema(breadcrumbs: Array<{
    name: string;
    url: string;
  }>): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: breadcrumb.url,
      })),
    };
  }

  /**
   * Generate local business schema
   */
  generateLocalBusinessSchema(options: {
    name: string;
    description?: string;
    url?: string;
    telephone?: string;
    address?: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    geo?: {
      latitude: number;
      longitude: number;
    };
    openingHours?: string[];
  }): StructuredData {
    const schema: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: options.name,
      description: options.description,
      url: options.url || this.options.baseUrl,
      telephone: options.telephone,
      address: options.address ? {
        '@type': 'PostalAddress',
        ...options.address,
      } : undefined,
      geo: options.geo ? {
        '@type': 'GeoCoordinates',
        latitude: options.geo.latitude,
        longitude: options.geo.longitude,
      } : undefined,
      openingHoursSpecification: options.openingHours?.map(hours => ({
        '@type': 'OpeningHoursSpecification',
        opens: hours,
      })),
    };

    return schema;
  }

  /**
   * Validate schema structure
   */
  validateSchema(schema: StructuredData): SEOValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    if (!schema['@context']) {
      errors.push('Schema missing @context');
    }

    if (!schema['@type']) {
      errors.push('Schema missing @type');
    }

    // Validate context
    if (schema['@context'] && !schema['@context'].includes('schema.org')) {
      warnings.push('Schema @context should include schema.org');
    }

    // Validate specific schema types
    switch (schema['@type']) {
      case 'WebSite':
        if (!schema.name) {
          errors.push('WebSite schema missing name');
        }
        if (!schema.url) {
          errors.push('WebSite schema missing url');
        }
        break;

      case 'Article':
        if (!schema.headline) {
          errors.push('Article schema missing headline');
        }
        if (!schema.description) {
          warnings.push('Article schema missing description');
        }
        break;

      case 'Organization':
        if (!schema.name) {
          errors.push('Organization schema missing name');
        }
        if (!schema.url) {
          warnings.push('Organization schema missing url');
        }
        break;

      case 'LocalBusiness':
        if (!schema.name) {
          errors.push('LocalBusiness schema missing name');
        }
        if (!schema.address && !schema.telephone) {
          warnings.push('LocalBusiness schema should have address or telephone');
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      info: [],
    };
  }

  /**
   * Convert schema to JSON-LD script tag
   */
  schemaToScriptTag(schema: StructuredData): string {
    const json = JSON.stringify(schema, null, 2);
    return `<script type="application/ld+json">\n${json}\n</script>`;
  }
}

/**
 * Create a schema generator instance
 */
export function createSchemaGenerator(options: SchemaGenerationOptions): SchemaGenerator {
  return new SchemaGenerator(options);
}

/**
 * Quick schema generation functions
 */
export function generateWebsiteSchema(options: SchemaGenerationOptions): StructuredData {
  const generator = new SchemaGenerator(options);
  return generator.generateWebsiteSchema();
}

export function generateArticleSchema(
  articleOptions: {
    title: string;
    description: string;
    url: string;
    author?: string;
    publishedDate?: string;
    modifiedDate?: string;
    image?: string;
  },
  generatorOptions: SchemaGenerationOptions
): StructuredData {
  const generator = new SchemaGenerator(generatorOptions);
  return generator.generateArticleSchema(articleOptions);
}

export function generateBreadcrumbSchema(
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>
): StructuredData {
  const generator = new SchemaGenerator({
    baseUrl: '',
    siteName: '',
  });
  return generator.generateBreadcrumbSchema(breadcrumbs);
}

/**
 * Validate schema
 */
export function validateSchema(schema: StructuredData): SEOValidationResult {
  const generator = new SchemaGenerator({
    baseUrl: '',
    siteName: '',
  });
  return generator.validateSchema(schema);
}

/**
 * Convert schema to script tag
 */
export function schemaToScriptTag(schema: StructuredData): string {
  const generator = new SchemaGenerator({
    baseUrl: '',
    siteName: '',
  });
  return generator.schemaToScriptTag(schema);
}
