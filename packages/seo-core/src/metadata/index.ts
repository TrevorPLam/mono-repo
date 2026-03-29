/**
 * Metadata Normalization System
 * 
 * Normalizes and standardizes SEO metadata across different formats
 * and ensures consistency with best practices.
 */

import { z } from 'zod';
import type { SEOMetadata, SEOValidationResult } from '../types/index.js';

/**
 * Metadata normalization options
 */
export interface MetadataNormalizationOptions {
  /** Trim whitespace from text fields */
  trimWhitespace?: boolean;
  
  /** Normalize title casing */
  normalizeTitleCase?: boolean;
  
  /** Generate missing Open Graph tags from basic metadata */
  generateMissingOG?: boolean;
  
  /** Generate missing Twitter Card tags from Open Graph */
  generateMissingTwitter?: boolean;
  
  /** Remove duplicate metadata */
  removeDuplicates?: boolean;
  
  /** Validate URLs in metadata */
  validateUrls?: boolean;
  
  /** Default locale for missing locale tags */
  defaultLocale?: string;
}

/**
 * Metadata normalizer class
 */
export class MetadataNormalizer {
  private options: Required<MetadataNormalizationOptions>;

  constructor(options: MetadataNormalizationOptions = {}) {
    this.options = {
      trimWhitespace: true,
      normalizeTitleCase: true,
      generateMissingOG: true,
      generateMissingTwitter: true,
      removeDuplicates: true,
      validateUrls: true,
      defaultLocale: 'en-US',
      ...options,
    };
  }

  /**
   * Normalize metadata object
   */
  normalize(metadata: SEOMetadata): SEOMetadata {
    const normalized = { ...metadata };

    // Trim whitespace from text fields
    if (this.options.trimWhitespace) {
      this.trimTextFields(normalized);
    }

    // Normalize title casing
    if (this.options.normalizeTitleCase && normalized.title) {
      normalized.title = this.normalizeTitle(normalized.title);
    }

    // Generate missing Open Graph tags
    if (this.options.generateMissingOG) {
      this.generateMissingOpenGraph(normalized);
    }

    // Generate missing Twitter Card tags
    if (this.options.generateMissingTwitter) {
      this.generateMissingTwitter(normalized);
    }

    // Remove duplicates
    if (this.options.removeDuplicates) {
      this.removeDuplicateValues(normalized);
    }

    // Validate URLs
    if (this.options.validateUrls) {
      this.validateMetadataUrls(normalized);
    }

    return normalized;
  }

  /**
   * Validate normalized metadata
   */
  validate(metadata: SEOMetadata): SEOValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const info: string[] = [];

    // Validate title
    if (!metadata.title) {
      errors.push('Title is required');
    } else if (metadata.title.length < 30) {
      warnings.push('Title is too short (minimum 30 characters recommended)');
    } else if (metadata.title.length > 60) {
      warnings.push('Title is too long (maximum 60 characters recommended)');
    }

    // Validate description
    if (!metadata.description) {
      errors.push('Description is required');
    } else if (metadata.description.length < 100) {
      warnings.push('Description is too short (minimum 100 characters recommended)');
    } else if (metadata.description.length > 160) {
      warnings.push('Description is too long (maximum 160 characters recommended)');
    }

    // Validate canonical URL
    if (metadata.canonical) {
      try {
        new URL(metadata.canonical);
      } catch {
        errors.push('Invalid canonical URL format');
      }
    }

    // Validate Open Graph image
    if (metadata['og:image']) {
      try {
        new URL(metadata['og:image']);
      } catch {
        errors.push('Invalid og:image URL format');
      }
    }

    // Validate Twitter consistency
    if (metadata['twitter:card'] && !['summary', 'summary_large_image', 'app', 'player'].includes(metadata['twitter:card'])) {
      warnings.push(`Invalid twitter:card value: ${metadata['twitter:card']}`);
    }

    // Check for missing recommended tags
    const recommendedTags = ['og:type', 'og:url', 'canonical', 'robots'];
    for (const tag of recommendedTags) {
      if (!metadata[tag]) {
        warnings.push(`Recommended tag '${tag}' is missing`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      info,
    };
  }

  /**
   * Trim whitespace from text fields
   */
  private trimTextFields(metadata: SEOMetadata): void {
    const textFields = [
      'title',
      'description',
      'author',
      'og:title',
      'og:description',
      'og:site_name',
      'twitter:title',
      'twitter:description',
      'twitter:site',
    ];

    for (const field of textFields) {
      if (metadata[field]) {
        metadata[field] = metadata[field]!.trim().replace(/\s+/g, ' ');
      }
    }
  }

  /**
   * Normalize title casing (title case with exceptions)
   */
  private normalizeTitle(title: string): string {
    const exceptions = new Set([
      'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by',
      'in', 'of', 'with', 'as', 'up', 'out', 'so', 'yet', 'is', 'was', 'are', 'were',
      'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
      'shall', 'should', 'can', 'could', 'may', 'might', 'must', 'SEO', 'API', 'URL',
      'HTML', 'CSS', 'JS', 'JSON', 'XML', 'HTTP', 'HTTPS', 'UI', 'UX', 'SaaS', 'B2B',
    ]);

    return title
      .toLowerCase()
      .split(' ')
      .map((word, index) => {
        if (index === 0 || !exceptions.has(word.toLowerCase())) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word.toLowerCase();
      })
      .join(' ');
  }

  /**
   * Generate missing Open Graph tags from basic metadata
   */
  private generateMissingOpenGraph(metadata: SEOMetadata): void {
    // Generate og:title from title
    if (!metadata['og:title'] && metadata.title) {
      metadata['og:title'] = metadata.title;
    }

    // Generate og:description from description
    if (!metadata['og:description'] && metadata.description) {
      metadata['og:description'] = metadata.description;
    }

    // Generate og:image from twitter:image
    if (!metadata['og:image'] && metadata['twitter:image']) {
      metadata['og:image'] = metadata['twitter:image'];
    }

    // Set default og:type
    if (!metadata['og:type']) {
      metadata['og:type'] = 'website';
    }

    // Set default og:locale
    if (!metadata['og:locale']) {
      metadata['og:locale'] = this.options.defaultLocale;
    }
  }

  /**
   * Generate missing Twitter Card tags from Open Graph
   */
  private generateMissingTwitter(metadata: SEOMetadata): void {
    // Generate twitter:title from og:title or title
    if (!metadata['twitter:title']) {
      if (metadata['og:title']) {
        metadata['twitter:title'] = metadata['og:title'];
      } else if (metadata.title) {
        metadata['twitter:title'] = metadata.title;
      }
    }

    // Generate twitter:description from og:description or description
    if (!metadata['twitter:description']) {
      if (metadata['og:description']) {
        metadata['twitter:description'] = metadata['og:description'];
      } else if (metadata.description) {
        metadata['twitter:description'] = metadata.description;
      }
    }

    // Generate twitter:image from og:image
    if (!metadata['twitter:image'] && metadata['og:image']) {
      metadata['twitter:image'] = metadata['og:image'];
    }

    // Set default twitter:card
    if (!metadata['twitter:card']) {
      metadata['twitter:card'] = 'summary_large_image';
    }
  }

  /**
   * Remove duplicate values (e.g., if og:title equals title)
   */
  private removeDuplicateValues(metadata: SEOMetadata): void {
    // Keep Open Graph tags if they're the same as basic tags
    // (don't remove them as they might be required by some platforms)
  }

  /**
   * Validate URLs in metadata
   */
  private validateMetadataUrls(metadata: SEOMetadata): void {
    const urlFields = ['canonical', 'og:url', 'og:image', 'twitter:image'];

    for (const field of urlFields) {
      const value = metadata[field];
      if (value) {
        try {
          const url = new URL(value);
          // Ensure HTTPS for production URLs
          if (url.protocol !== 'https:' && !url.hostname.includes('localhost') && !url.hostname.includes('127.0.0.1')) {
            console.warn(`URL ${field} should use HTTPS: ${value}`);
          }
        } catch (error) {
          console.warn(`Invalid URL in ${field}: ${value}`);
        }
      }
    }
  }
}

/**
 * Create a metadata normalizer instance
 */
export function createMetadataNormalizer(options?: MetadataNormalizationOptions): MetadataNormalizer {
  return new MetadataNormalizer(options);
}

/**
 * Quick normalize function
 */
export function normalizeMetadata(metadata: SEOMetadata, options?: MetadataNormalizationOptions): SEOMetadata {
  const normalizer = new MetadataNormalizer(options);
  return normalizer.normalize(metadata);
}

/**
 * Quick validate function
 */
export function validateMetadata(metadata: SEOMetadata): SEOValidationResult {
  const normalizer = new MetadataNormalizer();
  return normalizer.validate(metadata);
}
