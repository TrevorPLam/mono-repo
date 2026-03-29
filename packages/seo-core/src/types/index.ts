/**
 * SEO Core Types
 * 
 * Core types and interfaces for the SEO package
 */

import { z } from 'zod';

/**
 * Basic SEO metadata structure
 */
export interface SEOMetadata {
  /** Page title */
  title?: string;
  
  /** Meta description */
  description?: string;
  
  /** Canonical URL */
  canonical?: string;
  
  /** Robots meta tag */
  robots?: string;
  
  /** Author */
  author?: string;
  
  /** Published time */
  published_time?: string;
  
  /** Modified time */
  modified_time?: string;
  
  /** Open Graph metadata */
  'og:type'?: string;
  'og:url'?: string;
  'og:title'?: string;
  'og:description'?: string;
  'og:image'?: string;
  'og:locale'?: string;
  'og:site_name'?: string;
  
  /** Twitter Card metadata */
  'twitter:card'?: string;
  'twitter:site'?: string;
  'twitter:title'?: string;
  'twitter:description'?: string;
  'twitter:image'?: string;
  
  /** Additional metadata */
  [key: string]: string | undefined;
}

/**
 * SEO validation result
 */
export interface SEOValidationResult {
  /** Whether the validation passed */
  valid: boolean;
  
  /** Error messages */
  errors: string[];
  
  /** Warning messages */
  warnings: string[];
  
  /** Info messages */
  info: string[];
}

/**
 * SEO policy configuration
 */
export interface SEOPolicy {
  /** Global settings */
  global?: {
    enforceTrailingSlash?: boolean;
    titleTemplate?: string;
    maxTitleLength?: number;
    maxDescriptionLength?: number;
    defaultLocale?: string;
    enableStructuredData?: boolean;
    enableHreflang?: boolean;
  };
  
  /** Canonical URL policy */
  canonical?: {
    baseDomain: string;
    enforceHttps?: boolean;
    removeQueryParams?: boolean;
    allowedQueryParams?: string[];
    enforceTrailingSlash?: boolean;
  };
  
  /** Sitemap policy */
  sitemap?: {
    defaultChangeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    defaultPriority: number;
    excludePatterns: string[];
    includeOnlyPatterns: string[];
    maxUrlsPerSitemap: number;
    enableImageSitemap: boolean;
    enableNewsSitemap: boolean;
  };
  
  /** Robots.txt policy */
  robots?: {
    userAgentRules: Array<{
      userAgent: string;
      allow: string[];
      disallow: string[];
      crawlDelay?: number;
    }>;
    sitemaps: string[];
    host?: string;
  };
  
  /** Metadata validation rules */
  metadata?: {
    required: string[];
    recommended: string[];
    customRules: Array<{
      name: string;
      validator: string;
      message: string;
      severity: 'error' | 'warning' | 'info';
    }>;
  };
}

/**
 * Canonical URL policy
 */
export interface CanonicalPolicy {
  baseDomain: string;
  enforceHttps?: boolean;
  removeQueryParams?: boolean;
  allowedQueryParams?: string[];
  enforceTrailingSlash?: boolean;
}

/**
 * Sitemap URL entry
 */
export interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: SitemapImage[];
  news?: SitemapNews[];
}

/**
 * Sitemap image entry
 */
export interface SitemapImage {
  loc: string;
  caption?: string;
  geo_location?: string;
  title?: string;
  license?: string;
}

/**
 * Sitemap news entry
 */
export interface SitemapNews {
  publication: {
    name: string;
    language: string;
  };
  publication_date: string;
  title: string;
}

/**
 * Sitemap policy
 */
export interface SitemapPolicy {
  defaultChangeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  defaultPriority: number;
  excludePatterns: string[];
  includeOnlyPatterns: string[];
  maxUrlsPerSitemap: number;
  enableImageSitemap: boolean;
  enableNewsSitemap: boolean;
}

/**
 * Robots.txt policy
 */
export interface RobotsPolicy {
  userAgentRules: Array<{
    userAgent: string;
    allow: string[];
    disallow: string[];
    crawlDelay?: number;
  }>;
  sitemaps: string[];
  host?: string;
}

/**
 * URL resolution context
 */
export interface UrlResolutionContext {
  /** Current URL being processed */
  url: string;
  /** Base domain */
  domain: string;
  /** Protocol (http/https) */
  protocol: 'http' | 'https';
  /** Locale */
  locale?: string;
  /** Additional context */
  [key: string]: unknown;
}

/**
 * SEO configuration options
 */
export interface SEOConfig {
  /** Base domain for the site */
  domain: string;
  
  /** Default locale */
  defaultLocale?: string;
  
  /** Custom policy overrides */
  policy?: Partial<SEOPolicy>;
  
  /** Framework-specific adapters */
  adapters?: {
    [framework: string]: unknown;
  };
}

/**
 * Schema.org structured data types
 */
export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

/**
 * Hreflang entry
 */
export interface HreflangEntry {
  href: string;
  hreflang: string;
  rel?: string;
}

/**
 * SEO audit result
 */
export interface SEOAuditResult {
  /** Overall score (0-100) */
  score: number;
  
  /** Validation results by category */
  metadata: SEOValidationResult;
  technical: SEOValidationResult;
  content: SEOValidationResult;
  
  /** Recommendations */
  recommendations: Array<{
    type: 'critical' | 'important' | 'minor';
    category: string;
    message: string;
    effort: 'low' | 'medium' | 'high';
  }>;
  
  /** Audit timestamp */
  timestamp: string;
}

/**
 * SEO metrics
 */
export interface SEOMetrics {
  /** Total pages analyzed */
  totalPages: number;
  
  /** Pages with errors */
  pagesWithErrors: number;
  
  /** Pages with warnings */
  pagesWithWarnings: number;
  
  /** Average score */
  averageScore: number;
  
  /** Common issues */
  commonIssues: Array<{
    issue: string;
    count: number;
    severity: 'error' | 'warning' | 'info';
  }>;
}

/**
 * Export all schemas for validation
 */
export const SEOMetadataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  canonical: z.string().url().optional(),
  robots: z.string().optional(),
  author: z.string().optional(),
  published_time: z.string().optional(),
  modified_time: z.string().optional(),
  'og:type': z.string().optional(),
  'og:url': z.string().url().optional(),
  'og:title': z.string().optional(),
  'og:description': z.string().optional(),
  'og:image': z.string().url().optional(),
  'og:locale': z.string().optional(),
  'og:site_name': z.string().optional(),
  'twitter:card': z.enum(['summary', 'summary_large_image', 'app', 'player']).optional(),
  'twitter:site': z.string().optional(),
  'twitter:title': z.string().optional(),
  'twitter:description': z.string().optional(),
  'twitter:image': z.string().url().optional(),
}).passthrough();

export const SitemapUrlSchema = z.object({
  url: z.string().url(),
  lastmod: z.string().optional(),
  changefreq: z.enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']).optional(),
  priority: z.number().min(0).max(1).optional(),
  images: z.array(z.object({
    loc: z.string().url(),
    caption: z.string().optional(),
    geo_location: z.string().optional(),
    title: z.string().optional(),
    license: z.string().optional(),
  })).optional(),
  news: z.array(z.object({
    publication: z.object({
      name: z.string(),
      language: z.string(),
    }),
    publication_date: z.string(),
    title: z.string(),
  })).optional(),
});

export const HreflangEntrySchema = z.object({
  href: z.string().url(),
  hreflang: z.string(),
  rel: z.string().optional(),
});
