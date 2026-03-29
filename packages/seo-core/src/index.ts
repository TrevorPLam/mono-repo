/**
 * @repo/seo-core
 * 
 * Framework-agnostic SEO policy engine for the monorepo
 */

// Core policy engine
export { SEOPolicyEngine, createSEOPolicyEngine, SEOPolicySchema } from './policy/index.js';

// Types and schemas
export type {
  SEOPolicy,
  SEOValidationResult,
  SEOMetadata,
  CanonicalPolicy,
  SitemapPolicy,
  RobotsPolicy,
  UrlResolutionContext,
  StructuredData,
  HreflangEntry,
  SEOAuditResult,
  SEOMetrics,
  SitemapUrl,
  SitemapImage,
  SitemapNews,
} from './types/index.js';

export {
  SEOMetadataSchema,
  SitemapUrlSchema,
  HreflangEntrySchema,
} from './types/index.js';

// Metadata normalization
export {
  MetadataNormalizer,
  createMetadataNormalizer,
  normalizeMetadata,
  validateMetadata,
} from './metadata/index.js';
export type { MetadataNormalizationOptions } from './metadata/index.js';

// Canonical URL handling
export {
  CanonicalUrlManager,
  createCanonicalUrlManager,
  generateCanonicalUrl,
  validateCanonicalUrl,
  resolveCanonicalUrl as resolveCanonicalUrlFromManager,
  normalizeUrlPath,
  isAbsoluteUrl,
} from './canonicals/index.js';
export type { CanonicalUrlOptions } from './canonicals/index.js';

// Sitemap generation
export {
  SitemapGenerator,
  createSitemapGenerator,
  generateSitemap,
  createSitemapUrl,
  createSitemapImage,
  createSitemapNews,
  validateSitemapUrl,
} from './sitemap/index.js';
export type { SitemapGenerationOptions } from './sitemap/index.js';

// Robots.txt management
export {
  RobotsTxtManager,
  createRobotsTxtManager,
  generateRobotsTxt,
  validateRobotsTxt,
  createDefaultRobotsTxt,
  createDevRobotsTxt,
} from './robots/index.js';
export type { RobotsTxtOptions } from './robots/index.js';

// Schema.org structured data
export {
  SchemaGenerator,
  createSchemaGenerator,
  generateWebsiteSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  validateSchema,
  schemaToScriptTag,
} from './schema/index.js';
export type { SchemaGenerationOptions } from './schema/index.js';

// Configuration management
export {
  SEOConfigManager,
  createSEOConfigManager,
  createDefaultSEOConfig,
} from './config/index.js';
export { SEOConfigSchema } from './config/index.js';
export type { SEOConfig } from './config/index.js';

// Routing utilities
export {
  UrlResolver,
  createUrlResolver,
  resolveUrl,
  extractPath as extractPathFromUrl,
  extractDomain as extractDomainFromUrl,
} from './routing/index.js';
export type { UrlResolutionOptions as RoutingOptions } from './routing/index.js';

// URL resolution
export {
  AdvancedUrlResolver,
  createAdvancedUrlResolver,
  resolveCanonicalUrl,
  areUrlsEquivalent,
} from './resolution/index.js';
export type { UrlResolutionOptions as ResolutionOptions } from './resolution/index.js';
