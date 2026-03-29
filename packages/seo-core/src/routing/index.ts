/**
 * SEO Routing Utilities
 * 
 * Utilities for handling URL routing and path management
 */

import type { UrlResolutionContext } from '../types/index.js';

/**
 * URL resolution options
 */
export interface UrlResolutionOptions {
  /** Base domain */
  domain: string;
  
  /** Default protocol */
  protocol?: 'http' | 'https';
  
  /** Default locale */
  defaultLocale?: string;
  
  /** Path normalization options */
  normalizePath?: {
    /** Remove trailing slash */
    removeTrailingSlash?: boolean;
    /** Convert to lowercase */
    lowercase?: boolean;
  };
}

/**
 * URL resolver class
 */
export class UrlResolver {
  private options: Required<UrlResolutionOptions>;

  constructor(options: UrlResolutionOptions) {
    this.options = {
      protocol: 'https',
      defaultLocale: 'en-US',
      normalizePath: {
        removeTrailingSlash: false,
        lowercase: true,
      },
      ...options,
    };
  }

  /**
   * Resolve URL to absolute form
   */
  resolveUrl(url: string, context?: Partial<UrlResolutionContext>): string {
    // Handle absolute URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Build base URL
    const domain = context?.domain || this.options.domain;
    const protocol = context?.protocol || this.options.protocol;
    let absoluteUrl = `${protocol}://${domain}`;

    // Handle path
    if (!url.startsWith('/')) {
      url = '/' + url;
    }

    absoluteUrl += url;

    // Normalize path
    if (this.options.normalizePath) {
      absoluteUrl = this.normalizePath(absoluteUrl);
    }

    return absoluteUrl;
  }

  /**
   * Extract path from URL
   */
  extractPath(url: string): string {
    try {
      const parsed = new URL(url);
      return parsed.pathname;
    } catch {
      return url;
    }
  }

  /**
   * Extract domain from URL
   */
  extractDomain(url: string): string {
    try {
      const parsed = new URL(url);
      return parsed.hostname;
    } catch {
      return '';
    }
  }

  /**
   * Check if URL is internal to the domain
   */
  isInternalUrl(url: string, domain?: string): boolean {
    const targetDomain = domain || this.options.domain;
    const urlDomain = this.extractDomain(url);
    return urlDomain === new URL(targetDomain).hostname;
  }

  /**
   * Normalize path
   */
  private normalizePath(url: string): string {
    try {
      const parsed = new URL(url);
      let pathname = parsed.pathname;

      if (this.options.normalizePath?.lowercase) {
        pathname = pathname.toLowerCase();
      }

      if (this.options.normalizePath?.removeTrailingSlash) {
        if (pathname !== '/' && pathname.endsWith('/')) {
          pathname = pathname.slice(0, -1);
        }
      }

      parsed.pathname = pathname;
      return parsed.toString();
    } catch {
      return url;
    }
  }

  /**
   * Get URL context
   */
  getUrlContext(url: string): UrlResolutionContext {
    try {
      const parsed = new URL(url);
      return {
        url: parsed.pathname + parsed.search + parsed.hash,
        domain: parsed.hostname,
        protocol: parsed.protocol.slice(0, -1) as 'http' | 'https',
        locale: this.options.defaultLocale,
      };
    } catch {
      return {
        url,
        domain: this.options.domain,
        protocol: this.options.protocol,
        locale: this.options.defaultLocale,
      };
    }
  }
}

/**
 * Create URL resolver
 */
export function createUrlResolver(options: UrlResolutionOptions): UrlResolver {
  return new UrlResolver(options);
}

/**
 * Quick URL resolution
 */
export function resolveUrl(url: string, options: UrlResolutionOptions): string {
  const resolver = new UrlResolver(options);
  return resolver.resolveUrl(url);
}

/**
 * Extract path from URL
 */
export function extractPath(url: string): string {
  const resolver = new UrlResolver({ domain: '' });
  return resolver.extractPath(url);
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  const resolver = new UrlResolver({ domain: '' });
  return resolver.extractDomain(url);
}
