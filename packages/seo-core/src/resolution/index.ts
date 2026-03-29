/**
 * URL Resolution System
 * 
 * Advanced URL resolution and canonicalization utilities
 */

import type { UrlResolutionContext } from '../types/index.js';

/**
 * URL resolution options
 */
export interface UrlResolutionOptions {
  /** Preferred protocol */
  preferredProtocol?: 'http' | 'https';
  
  /** Preferred domain (www vs non-www) */
  preferredDomain?: 'www' | 'non-www';
  
  /** Trailing slash preference */
  trailingSlash?: boolean;
  
  /** Lowercase URLs */
  lowercase?: boolean;
  
  /** Remove query parameters */
  removeQueryParams?: boolean;
  
  /** Allowed query parameters */
  allowedQueryParams?: string[];
}

/**
 * URL resolver with advanced canonicalization
 */
export class AdvancedUrlResolver {
  private options: Required<UrlResolutionOptions>;

  constructor(options: UrlResolutionOptions = {}) {
    this.options = {
      preferredProtocol: 'https',
      preferredDomain: 'non-www',
      trailingSlash: false,
      lowercase: true,
      removeQueryParams: true,
      allowedQueryParams: [],
      ...options,
    };
  }

  /**
   * Resolve and canonicalize URL
   */
  resolveUrl(url: string, context: UrlResolutionContext): string {
    try {
      let parsedUrl = new URL(url, `${context.protocol}://${context.domain}`);

      // Apply protocol preference
      if (this.options.preferredProtocol) {
        parsedUrl.protocol = this.options.preferredProtocol + ':';
      }

      // Apply domain preference
      parsedUrl = this.applyDomainPreference(parsedUrl);

      // Apply path normalization
      parsedUrl = this.normalizePath(parsedUrl);

      // Apply query parameter rules
      parsedUrl = this.processQueryParams(parsedUrl);

      // Apply lowercase
      if (this.options.lowercase) {
        parsedUrl.hostname = parsedUrl.hostname.toLowerCase();
        parsedUrl.pathname = parsedUrl.pathname.toLowerCase();
      }

      // Remove hash
      parsedUrl.hash = '';

      return parsedUrl.toString();
    } catch (error) {
      throw new Error(`Invalid URL resolution: ${error}`);
    }
  }

  /**
   * Apply domain preference (www vs non-www)
   */
  private applyDomainPreference(url: URL): URL {
    const hostname = url.hostname;
    
    if (this.options.preferredDomain === 'www') {
      if (!hostname.startsWith('www.')) {
        url.hostname = 'www.' + hostname;
      }
    } else {
      if (hostname.startsWith('www.')) {
        url.hostname = hostname.replace('www.', '');
      }
    }

    return url;
  }

  /**
   * Normalize path
   */
  private normalizePath(url: URL): URL {
    let pathname = url.pathname;

    // Remove multiple slashes
    pathname = pathname.replace(/\/+/g, '/');

    // Apply trailing slash preference
    if (this.options.trailingSlash) {
      if (!pathname.endsWith('/')) {
        pathname += '/';
      }
    } else {
      if (pathname !== '/' && pathname.endsWith('/')) {
        pathname = pathname.slice(0, -1);
      }
    }

    url.pathname = pathname;
    return url;
  }

  /**
   * Process query parameters
   */
  private processQueryParams(url: URL): URL {
    if (this.options.removeQueryParams) {
      const searchParams = new URLSearchParams();
      
      for (const [key, value] of url.searchParams) {
        if (this.options.allowedQueryParams.includes(key)) {
          searchParams.set(key, value);
        }
      }
      
      url.search = searchParams.toString();
    }

    return url;
  }

  /**
   * Check if two URLs are canonically equivalent
   */
  areEquivalent(url1: string, url2: string, context: UrlResolutionContext): boolean {
    try {
      const resolved1 = this.resolveUrl(url1, context);
      const resolved2 = this.resolveUrl(url2, context);
      return resolved1 === resolved2;
    } catch {
      return false;
    }
  }

  /**
   * Get URL priority for sitemap ordering
   */
  getUrlPriority(url: string): number {
    let priority = 0.8; // Default priority

    // Higher priority for homepage
    if (url === '/' || url === '') {
      priority = 1.0;
    }
    // Lower priority for deeper pages
    else {
      const depth = url.split('/').length - 1;
      priority = Math.max(0.3, priority - depth * 0.1);
    }

    // Lower priority for certain patterns
    const lowerPriorityPatterns = ['/blog/', '/news/', '/articles/', '/category/'];
    for (const pattern of lowerPriorityPatterns) {
      if (url.includes(pattern)) {
        priority = Math.max(0.6, priority - 0.1);
        break;
      }
    }

    return priority;
  }

  /**
   * Determine change frequency based on URL pattern
   */
  getChangeFrequency(url: string): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
    // Homepage changes frequently
    if (url === '/' || url === '') {
      return 'daily';
    }

    // Blog/news pages change frequently
    if (url.includes('/blog/') || url.includes('/news/') || url.includes('/articles/')) {
      return 'weekly';
    }

    // Category pages change moderately
    if (url.includes('/category/') || url.includes('/tag/')) {
      return 'weekly';
    }

    // Static pages change rarely
    if (url.includes('/about/') || url.includes('/contact/') || url.includes('/services/')) {
      return 'monthly';
    }

    return 'weekly'; // Default
  }
}

/**
 * Create advanced URL resolver
 */
export function createAdvancedUrlResolver(options?: UrlResolutionOptions): AdvancedUrlResolver {
  return new AdvancedUrlResolver(options);
}

/**
 * Quick URL resolution
 */
export function resolveCanonicalUrl(url: string, context: UrlResolutionContext, options?: UrlResolutionOptions): string {
  const resolver = new AdvancedUrlResolver(options);
  return resolver.resolveUrl(url, context);
}

/**
 * Check URL equivalence
 */
export function areUrlsEquivalent(url1: string, url2: string, context: UrlResolutionContext, options?: UrlResolutionOptions): boolean {
  const resolver = new AdvancedUrlResolver(options);
  return resolver.areEquivalent(url1, url2, context);
}
