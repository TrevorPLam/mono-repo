/**
 * SEO Policy Engine
 * 
 * Framework-agnostic SEO policy engine that provides validation,
 * normalization, and enforcement of SEO best practices across
 * different applications and frameworks.
 */

import { z } from 'zod';
import type { 
  SEOPolicy, 
  SEOValidationResult, 
  SEOMetadata, 
  CanonicalPolicy,
  SitemapPolicy,
  RobotsPolicy 
} from '../types/index.js';

/**
 * Core SEO policy configuration schema
 */
export const SEOPolicySchema = z.object({
  /**
   * Global SEO policy settings
   */
  global: z.object({
    /**
     * Enforce trailing slash consistency
     */
    enforceTrailingSlash: z.boolean().default(false),
    
    /**
     * Default title template
     */
    titleTemplate: z.string().default('%s | Default Site'),
    
    /**
     * Maximum title length
     */
    maxTitleLength: z.number().min(30).max(80).default(60),
    
    /**
     * Maximum description length
     */
    maxDescriptionLength: z.number().min(100).max(200).default(160),
    
    /**
     * Default locale
     */
    defaultLocale: z.string().default('en-US'),
    
    /**
     * Enable structured data validation
     */
    enableStructuredData: z.boolean().default(true),
    
    /**
     * Enable hreflang validation
     */
    enableHreflang: z.boolean().default(true),
  }).optional(),

  /**
   * Canonical URL policy
   */
  canonical: z.object({
    /**
     * Base domain for canonical URLs
     */
    baseDomain: z.string().url(),
    
    /**
     * Enforce HTTPS
     */
    enforceHttps: z.boolean().default(true),
    
    /**
     * Remove query parameters from canonicals
     */
    removeQueryParams: z.boolean().default(true),
    
    /**
     * Allowed query parameters (if removeQueryParams is true)
     */
    allowedQueryParams: z.array(z.string()).default([]),
    
    /**
     * Enforce trailing slash in canonicals
     */
    enforceTrailingSlash: z.boolean().default(false),
  }).optional(),

  /**
   * Sitemap policy
   */
  sitemap: z.object({
    /**
     * Default sitemap settings
     */
    defaultChangeFreq: z.enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']).default('weekly'),
    
    /**
     * Default priority
     */
    defaultPriority: z.number().min(0).max(1).default(0.8),
    
    /**
     * Exclude patterns
     */
    excludePatterns: z.array(z.string()).default([
      '/admin/**',
      '/api/**',
      '/private/**',
      '/test/**',
      '/dev/**',
    ]),
    
    /**
     * Include only patterns (if specified, only matching URLs are included)
     */
    includeOnlyPatterns: z.array(z.string()).default([]),
    
    /**
     * Maximum sitemap size (URL count)
     */
    maxUrlsPerSitemap: z.number().min(1).max(50000).default(50000),
    
    /**
     * Enable image sitemap
     */
    enableImageSitemap: z.boolean().default(true),
    
    /**
     * Enable news sitemap
     */
    enableNewsSitemap: z.boolean().default(false),
  }).optional(),

  /**
   * Robots.txt policy
   */
  robots: z.object({
    /**
     * Default user agent rules
     */
    userAgentRules: z.array(z.object({
      userAgent: z.string(),
      allow: z.array(z.string()).default([]),
      disallow: z.array(z.string()).default([]),
      crawlDelay: z.number().optional(),
    })).default([
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
          '/test/',
          '/dev/',
        ],
      },
    ]),
    
    /**
     * Sitemap URLs to include
     */
    sitemaps: z.array(z.string().url()).default([]),
    
    /**
     * Host directive (for Yandex)
     */
    host: z.string().optional(),
  }).optional(),

  /**
   * Metadata validation rules
   */
  metadata: z.object({
    /**
     * Required metadata fields
     */
    required: z.array(z.enum([
      'title',
      'description',
      'og:title',
      'og:description',
      'og:image',
      'twitter:card',
      'twitter:title',
      'twitter:description',
      'twitter:image',
    ])).default(['title', 'description']),
    
    /**
     * Recommended metadata fields
     */
    recommended: z.array(z.enum([
      'og:type',
      'og:url',
      'og:locale',
      'og:site_name',
      'twitter:site',
      'canonical',
      'robots',
      'author',
      'published_time',
      'modified_time',
    ])).default([
      'og:type',
      'og:url',
      'canonical',
      'robots',
    ]),
    
    /**
     * Custom validation rules
     */
    customRules: z.array(z.object({
      name: z.string(),
      validator: z.string(), // Validation function name
      message: z.string(),
      severity: z.enum(['error', 'warning', 'info']).default('warning'),
    })).default([]),
  }).optional(),
});

/**
 * SEO Policy Engine class
 */
export class SEOPolicyEngine {
  private policy: SEOPolicy;

  constructor(policy: Partial<SEOPolicy> = {}) {
    const validatedPolicy = SEOPolicySchema.parse(policy);
    this.policy = {
      global: {
        enforceTrailingSlash: false,
        titleTemplate: '%s | Default Site',
        maxTitleLength: 60,
        maxDescriptionLength: 160,
        defaultLocale: 'en-US',
        enableStructuredData: true,
        enableHreflang: true,
        ...validatedPolicy.global,
      },
      canonical: {
        baseDomain: 'https://example.com',
        enforceHttps: true,
        removeQueryParams: true,
        allowedQueryParams: [],
        enforceTrailingSlash: false,
        ...validatedPolicy.canonical,
      },
      sitemap: {
        defaultChangeFreq: 'weekly',
        defaultPriority: 0.8,
        excludePatterns: [
          '/admin/**',
          '/api/**',
          '/private/**',
          '/test/**',
          '/dev/**',
        ],
        includeOnlyPatterns: [],
        maxUrlsPerSitemap: 50000,
        enableImageSitemap: true,
        enableNewsSitemap: false,
        ...validatedPolicy.sitemap,
      },
      robots: {
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: [
              '/admin/',
              '/api/',
              '/private/',
              '/test/',
              '/dev/',
            ],
          },
        ],
        sitemaps: [],
        ...validatedPolicy.robots,
      },
      metadata: {
        required: ['title', 'description'],
        recommended: [
          'og:type',
          'og:url',
          'canonical',
          'robots',
        ],
        customRules: [],
        ...validatedPolicy.metadata,
      },
      ...validatedPolicy,
    };
  }

  /**
   * Get the current policy configuration
   */
  getPolicy(): SEOPolicy {
    return { ...this.policy };
  }

  /**
   * Update policy configuration
   */
  updatePolicy(updates: Partial<SEOPolicy>): void {
    const newPolicy = SEOPolicySchema.parse({ ...this.policy, ...updates });
    this.policy = newPolicy;
  }

  /**
   * Validate SEO metadata against policy
   */
  validateMetadata(metadata: SEOMetadata): SEOValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const info: string[] = [];

    // Validate required fields
    if (this.policy.metadata?.required) {
      for (const field of this.policy.metadata.required) {
        if (!metadata[field]) {
          errors.push(`Required metadata field '${field}' is missing`);
        }
      }
    }

    // Validate title
    if (metadata.title) {
      if (metadata.title.length > (this.policy.global?.maxTitleLength ?? 60)) {
        warnings.push(`Title exceeds recommended length of ${this.policy.global?.maxTitleLength} characters`);
      }
      if (metadata.title.length < 30) {
        warnings.push('Title is too short (minimum 30 characters recommended)');
      }
    }

    // Validate description
    if (metadata.description) {
      if (metadata.description.length > (this.policy.global?.maxDescriptionLength ?? 160)) {
        warnings.push(`Description exceeds recommended length of ${this.policy.global?.maxDescriptionLength} characters`);
      }
      if (metadata.description.length < 100) {
        warnings.push('Description is too short (minimum 100 characters recommended)');
      }
    }

    // Validate canonical URL
    if (metadata.canonical) {
      const canonicalValidation = this.validateCanonicalUrl(metadata.canonical);
      errors.push(...canonicalValidation.errors);
      warnings.push(...canonicalValidation.warnings);
    }

    // Validate Open Graph tags
    if (metadata['og:title'] && metadata.title && metadata['og:title'] !== metadata.title) {
      warnings.push('og:title differs from title - consider keeping them consistent');
    }

    if (metadata['og:description'] && metadata.description && metadata['og:description'] !== metadata.description) {
      warnings.push('og:description differs from description - consider keeping them consistent');
    }

    // Validate Twitter Card
    if (metadata['twitter:card'] && !['summary', 'summary_large_image', 'app', 'player'].includes(metadata['twitter:card'])) {
      errors.push(`Invalid twitter:card value: ${metadata['twitter:card']}`);
    }

    // Check recommended fields
    if (this.policy.metadata?.recommended) {
      for (const field of this.policy.metadata.recommended) {
        if (!metadata[field]) {
          warnings.push(`Recommended metadata field '${field}' is missing`);
        }
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
   * Validate canonical URL against policy
   */
  validateCanonicalUrl(url: string): SEOValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const parsedUrl = new URL(url);

      // Validate HTTPS
      if (this.policy.canonical?.enforceHttps && parsedUrl.protocol !== 'https:') {
        errors.push('Canonical URL must use HTTPS');
      }

      // Validate base domain
      if (this.policy.canonical?.baseDomain) {
        const baseDomain = new URL(this.policy.canonical.baseDomain);
        if (parsedUrl.hostname !== baseDomain.hostname) {
          errors.push(`Canonical URL hostname '${parsedUrl.hostname}' does not match base domain '${baseDomain.hostname}'`);
        }
      }

      // Remove query parameters
      if (this.policy.canonical?.removeQueryParams && parsedUrl.search) {
        const allowedParams = this.policy.canonical.allowedQueryParams ?? [];
        const searchParams = new URLSearchParams(parsedUrl.search);
        
        for (const [key] of searchParams) {
          if (!allowedParams.includes(key)) {
            warnings.push(`Canonical URL contains query parameter '${key}' that should be removed`);
          }
        }
      }

      // Validate trailing slash
      if (this.policy.canonical?.enforceTrailingSlash) {
        if (!parsedUrl.pathname.endsWith('/')) {
          warnings.push('Canonical URL should end with trailing slash');
        }
      }
    } catch (error) {
      errors.push(`Invalid canonical URL format: ${error}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      info: [],
    };
  }

  /**
   * Check if URL should be included in sitemap
   */
  shouldIncludeInSitemap(url: string): boolean {
    const { sitemap } = this.policy;

    if (!sitemap) return true;

    // Check exclude patterns
    for (const pattern of sitemap.excludePatterns) {
      if (this.matchesPattern(url, pattern)) {
        return false;
      }
    }

    // Check include-only patterns
    if (sitemap.includeOnlyPatterns.length > 0) {
      for (const pattern of sitemap.includeOnlyPatterns) {
        if (this.matchesPattern(url, pattern)) {
          return true;
        }
      }
      return false;
    }

    return true;
  }

  /**
   * Get default sitemap settings for a URL
   */
  getSitemapDefaults(url: string): {
    changeFreq: string;
    priority: number;
  } {
    const { sitemap } = this.policy;

    // Determine priority based on URL depth and importance
    let priority = sitemap?.defaultPriority ?? 0.8;
    
    // Lower priority for deeper pages
    const depth = url.split('/').length - 1;
    if (depth > 3) {
      priority = Math.max(0.3, priority - 0.1 * (depth - 3));
    }

    // Lower priority for certain patterns
    const lowerPriorityPatterns = ['/blog/', '/news/', '/articles/'];
    for (const pattern of lowerPriorityPatterns) {
      if (url.includes(pattern)) {
        priority = Math.max(0.6, priority - 0.1);
        break;
      }
    }

    return {
      changeFreq: sitemap?.defaultChangeFreq ?? 'weekly',
      priority,
    };
  }

  /**
   * Generate robots.txt content
   */
  generateRobotsTxt(): string {
    const { robots } = this.policy;
    if (!robots) return '';

    let content = '';

    // User agent rules
    for (const rule of robots.userAgentRules) {
      content += `User-agent: ${rule.userAgent}\n`;
      
      for (const allow of rule.allow) {
        content += `Allow: ${allow}\n`;
      }
      
      for (const disallow of rule.disallow) {
        content += `Disallow: ${disallow}\n`;
      }
      
      if (rule.crawlDelay) {
        content += `Crawl-delay: ${rule.crawlDelay}\n`;
      }
      
      content += '\n';
    }

    // Sitemaps
    for (const sitemap of robots.sitemaps) {
      content += `Sitemap: ${sitemap}\n`;
    }

    // Host directive
    if (robots.host) {
      content += `Host: ${robots.host}\n`;
    }

    return content.trim();
  }

  /**
   * Simple pattern matching (supports * wildcards)
   */
  private matchesPattern(url: string, pattern: string): boolean {
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\?\*/g, '.+') + '$'
    );
    return regex.test(url);
  }
}

/**
 * Create a default SEO policy engine instance
 */
export function createSEOPolicyEngine(policy?: Partial<SEOPolicy>): SEOPolicyEngine {
  return new SEOPolicyEngine(policy);
}

/**
 * Export types and utilities
 */
export type { SEOPolicy, SEOValidationResult, SEOMetadata };
