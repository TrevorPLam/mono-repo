/**
 * Canonical URL Handling System
 * 
 * Handles canonical URL generation, validation, and resolution
 * according to SEO best practices and policy rules.
 */

import { z } from 'zod';
import type { CanonicalPolicy, SEOValidationResult, UrlResolutionContext } from '../types/index.js';

/**
 * Canonical URL generation options
 */
export interface CanonicalUrlOptions {
  /** Base domain for canonical URLs */
  baseDomain: string;
  
  /** Enforce HTTPS */
  enforceHttps?: boolean;
  
  /** Remove query parameters */
  removeQueryParams?: boolean;
  
  /** Allowed query parameters (when removeQueryParams is true) */
  allowedQueryParams?: string[];
  
  /** Enforce trailing slash */
  enforceTrailingSlash?: boolean;
  
  /** Remove hash fragments */
  removeHash?: boolean;
  
  /** Lowercase URLs */
  lowercase?: boolean;
  
  /** Custom URL transformations */
  transform?: (url: URL) => URL;
}

/**
 * Canonical URL manager class
 */
export class CanonicalUrlManager {
  private options: Required<CanonicalUrlOptions>;

  constructor(options: CanonicalUrlOptions) {
    this.options = {
      enforceHttps: true,
      removeQueryParams: true,
      allowedQueryParams: [],
      enforceTrailingSlash: false,
      removeHash: true,
      lowercase: true,
      transform: (url) => url,
      ...options,
    };
  }

  /**
   * Generate canonical URL from a given URL
   */
  generateCanonicalUrl(url: string): string {
    try {
      const parsedUrl = new URL(url, this.options.baseDomain);
      
      // Apply transformations
      const canonical = this.options.transform(parsedUrl);

      // Enforce HTTPS
      if (this.options.enforceHttps && canonical.protocol !== 'https:') {
        canonical.protocol = 'https:';
      }

      // Set hostname to base domain if it's a relative URL
      if (!url.startsWith('http')) {
        canonical.hostname = new URL(this.options.baseDomain).hostname;
      }

      // Handle query parameters
      if (this.options.removeQueryParams) {
        const searchParams = new URLSearchParams();
        for (const [key, value] of canonical.searchParams) {
          if (this.options.allowedQueryParams.includes(key)) {
            searchParams.set(key, value);
          }
        }
        canonical.search = searchParams.toString();
      }

      // Remove hash fragments
      if (this.options.removeHash) {
        canonical.hash = '';
      }

      // Handle trailing slash
      if (this.options.enforceTrailingSlash) {
        if (!canonical.pathname.endsWith('/')) {
          canonical.pathname += '/';
        }
      } else {
        if (canonical.pathname !== '/' && canonical.pathname.endsWith('/')) {
          canonical.pathname = canonical.pathname.slice(0, -1);
        }
      }

      // Lowercase URL
      if (this.options.lowercase) {
        canonical.hostname = canonical.hostname.toLowerCase();
        canonical.pathname = canonical.pathname.toLowerCase();
        // Don't lowercase search params as they might be case-sensitive
      }

      return canonical.toString();
    } catch (error) {
      throw new Error(`Invalid URL: ${url}`);
    }
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
      if (this.options.enforceHttps && parsedUrl.protocol !== 'https:') {
        errors.push('Canonical URL must use HTTPS');
      }

      // Validate base domain
      const baseDomain = new URL(this.options.baseDomain);
      if (parsedUrl.hostname !== baseDomain.hostname) {
        errors.push(`Canonical URL hostname '${parsedUrl.hostname}' does not match base domain '${baseDomain.hostname}'`);
      }

      // Check for unwanted query parameters
      if (this.options.removeQueryParams && parsedUrl.search) {
        const searchParams = new URLSearchParams(parsedUrl.search);
        for (const [key] of searchParams) {
          if (!this.options.allowedQueryParams.includes(key)) {
            warnings.push(`Canonical URL contains query parameter '${key}' that should be removed`);
          }
        }
      }

      // Check trailing slash consistency
      if (this.options.enforceTrailingSlash && !parsedUrl.pathname.endsWith('/')) {
        warnings.push('Canonical URL should end with trailing slash');
      } else if (!this.options.enforceTrailingSlash && parsedUrl.pathname !== '/' && parsedUrl.pathname.endsWith('/')) {
        warnings.push('Canonical URL should not end with trailing slash');
      }

      // Check for hash fragments
      if (this.options.removeHash && parsedUrl.hash) {
        warnings.push('Canonical URL should not contain hash fragments');
      }

      // Check for uppercase letters
      if (this.options.lowercase && (parsedUrl.hostname !== parsedUrl.hostname.toLowerCase() || 
          parsedUrl.pathname !== parsedUrl.pathname.toLowerCase())) {
        warnings.push('Canonical URL should be lowercase');
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
   * Resolve canonical URL from context
   */
  resolveCanonicalUrl(context: UrlResolutionContext): string {
    const { url, domain, protocol, locale } = context;

    // Build base URL
    let canonicalUrl = url;
    
    // If URL is relative, make it absolute
    if (!url.startsWith('http')) {
      canonicalUrl = `${protocol}://${domain}${url.startsWith('/') ? url : '/' + url}`;
    }

    // Generate canonical URL
    return this.generateCanonicalUrl(canonicalUrl);
  }

  /**
   * Compare two URLs for canonical equivalence
   */
  areCanonicallyEquivalent(url1: string, url2: string): boolean {
    try {
      const canonical1 = this.generateCanonicalUrl(url1);
      const canonical2 = this.generateCanonicalUrl(url2);
      return canonical1 === canonical2;
    } catch {
      return false;
    }
  }

  /**
   * Get canonical URL policy
   */
  getPolicy(): CanonicalPolicy {
    return {
      baseDomain: this.options.baseDomain,
      enforceHttps: this.options.enforceHttps,
      removeQueryParams: this.options.removeQueryParams,
      allowedQueryParams: this.options.allowedQueryParams,
      enforceTrailingSlash: this.options.enforceTrailingSlash,
    };
  }

  /**
   * Update canonical URL policy
   */
  updatePolicy(updates: Partial<CanonicalPolicy>): void {
    this.options = { ...this.options, ...updates };
  }
}

/**
 * Create a canonical URL manager instance
 */
export function createCanonicalUrlManager(options: CanonicalUrlOptions): CanonicalUrlManager {
  return new CanonicalUrlManager(options);
}

/**
 * Quick canonical URL generation
 */
export function generateCanonicalUrl(url: string, options: CanonicalUrlOptions): string {
  const manager = new CanonicalUrlManager(options);
  return manager.generateCanonicalUrl(url);
}

/**
 * Quick canonical URL validation
 */
export function validateCanonicalUrl(url: string, options: CanonicalUrlOptions): SEOValidationResult {
  const manager = new CanonicalUrlManager(options);
  return manager.validateCanonicalUrl(url);
}

/**
 * Resolve relative URL to absolute canonical URL
 */
export function resolveCanonicalUrl(relativeUrl: string, baseDomain: string, protocol: 'http' | 'https' = 'https'): string {
  const manager = new CanonicalUrlManager({
    baseDomain,
    enforceHttps: protocol === 'https',
  });
  
  const context: UrlResolutionContext = {
    url: relativeUrl,
    domain: new URL(baseDomain).hostname,
    protocol,
  };
  
  return manager.resolveCanonicalUrl(context);
}

/**
 * Helper function to normalize URL path
 */
export function normalizeUrlPath(path: string, trailingSlash: boolean = false): string {
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  // Remove trailing slash unless it's the root or trailing slash is required
  if (path !== '/' && !trailingSlash && path.endsWith('/')) {
    path = path.slice(0, -1);
  } else if (trailingSlash && !path.endsWith('/')) {
    path += '/';
  }

  // Remove multiple consecutive slashes
  path = path.replace(/\/+/g, '/');

  return path;
}

/**
 * Helper function to extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }
}

/**
 * Helper function to check if URL is absolute
 */
export function isAbsoluteUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
