/**
 * Robots.txt Management System
 * 
 * Generates and manages robots.txt files according to SEO best practices
 * and policy rules.
 */

import { z } from 'zod';
import type { RobotsPolicy, SEOValidationResult } from '../types/index.js';

/**
 * Robots.txt generation options
 */
export interface RobotsTxtOptions {
  /** User agent rules */
  userAgentRules?: Array<{
    userAgent: string;
    allow: string[];
    disallow: string[];
    crawlDelay?: number;
  }>;
  
  /** Sitemap URLs to include */
  sitemaps?: string[];
  
  /** Host directive (for Yandex) */
  host?: string;
  
  /** Additional directives */
  directives?: Record<string, string>;
}

/**
 * Robots.txt manager class
 */
export class RobotsTxtManager {
  private options: RobotsTxtOptions;

  constructor(options: RobotsTxtOptions = {}) {
    this.options = {
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
      directives: {},
      ...options,
    };
  }

  /**
   * Generate robots.txt content
   */
  generateRobotsTxt(): string {
    let content = '';

    // User agent rules
    if (this.options.userAgentRules) {
      for (const rule of this.options.userAgentRules) {
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
    }

    // Additional directives
    if (this.options.directives) {
      for (const [directive, value] of Object.entries(this.options.directives)) {
        content += `${directive}: ${value}\n`;
      }
      
      if (Object.keys(this.options.directives).length > 0) {
        content += '\n';
      }
    }

    // Sitemaps
    if (this.options.sitemaps) {
      for (const sitemap of this.options.sitemaps) {
        content += `Sitemap: ${sitemap}\n`;
      }
    }

    // Host directive
    if (this.options.host) {
      content += `Host: ${this.options.host}\n`;
    }

    return content.trim();
  }

  /**
   * Validate robots.txt content
   */
  validateRobotsTxt(content: string): SEOValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const lines = content.split('\n').map((line: string) => line.trim()).filter((line: string) => line && !line.startsWith('#'));
      
      let currentUserAgent: string | null = null;
      const userAgentRules = new Map<string, { allow: string[]; disallow: string[] }>();

      for (const line of lines) {
        if (line.startsWith('User-agent:')) {
          currentUserAgent = line.split(':')[1].trim();
          if (!userAgentRules.has(currentUserAgent)) {
            userAgentRules.set(currentUserAgent, { allow: [], disallow: [] });
          }
        } else if (line.startsWith('Allow:')) {
          if (currentUserAgent) {
            const path = line.split(':')[1].trim();
            userAgentRules.get(currentUserAgent)?.allow.push(path);
          } else {
            warnings.push('Allow directive without User-agent');
          }
        } else if (line.startsWith('Disallow:')) {
          if (currentUserAgent) {
            const path = line.split(':')[1].trim();
            userAgentRules.get(currentUserAgent)?.disallow.push(path);
          } else {
            warnings.push('Disallow directive without User-agent');
          }
        } else if (line.startsWith('Crawl-delay:')) {
          const delay = parseFloat(line.split(':')[1].trim());
          if (isNaN(delay) || delay < 0) {
            errors.push('Invalid Crawl-delay value');
          }
        } else if (line.startsWith('Sitemap:')) {
          const url = line.split(':')[1].trim();
          try {
            new URL(url);
          } catch {
            errors.push(`Invalid sitemap URL: ${url}`);
          }
        } else if (line.startsWith('Host:')) {
          const host = line.split(':')[1].trim();
          if (!host.includes('.')) {
            warnings.push('Host directive should be a valid domain');
          }
        }
      }

      // Check for conflicting rules
      for (const [userAgent, rules] of userAgentRules) {
        for (const allow of rules.allow) {
          for (const disallow of rules.disallow) {
            if (allow === disallow) {
              warnings.push(`Conflicting Allow/Disallow for path '${allow}' in User-agent '${userAgent}'`);
            }
          }
        }
      }

    } catch (error) {
      errors.push(`Error parsing robots.txt: ${error}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      info: [],
    };
  }

  /**
   * Add user agent rule
   */
  addUserAgentRule(rule: {
    userAgent: string;
    allow: string[];
    disallow: string[];
    crawlDelay?: number;
  }): void {
    if (!this.options.userAgentRules) {
      this.options.userAgentRules = [];
    }
    this.options.userAgentRules.push(rule);
  }

  /**
   * Remove user agent rule
   */
  removeUserAgentRule(userAgent: string): boolean {
    if (!this.options.userAgentRules) return false;
    const index = this.options.userAgentRules.findIndex((rule: any) => rule.userAgent === userAgent);
    if (index !== -1) {
      this.options.userAgentRules.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Add sitemap
   */
  addSitemap(sitemap: string): void {
    if (!this.options.sitemaps) {
      this.options.sitemaps = [];
    }
    if (!this.options.sitemaps.includes(sitemap)) {
      this.options.sitemaps.push(sitemap);
    }
  }

  /**
   * Remove sitemap
   */
  removeSitemap(sitemap: string): boolean {
    if (!this.options.sitemaps) return false;
    const index = this.options.sitemaps.indexOf(sitemap);
    if (index !== -1) {
      this.options.sitemaps.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Set host directive
   */
  setHost(host: string): void {
    this.options.host = host;
  }

  /**
   * Add custom directive
   */
  addDirective(directive: string, value: string): void {
    if (!this.options.directives) {
      this.options.directives = {};
    }
    this.options.directives[directive] = value;
  }

  /**
   * Remove custom directive
   */
  removeDirective(directive: string): boolean {
    if (this.options.directives && directive in this.options.directives) {
      delete this.options.directives[directive];
      return true;
    }
    return false;
  }

  /**
   * Get robots.txt policy
   */
  getPolicy(): RobotsPolicy {
    return {
      userAgentRules: this.options.userAgentRules || [],
      sitemaps: this.options.sitemaps || [],
      host: this.options.host,
    };
  }

  /**
   * Update robots.txt policy
   */
  updatePolicy(updates: Partial<RobotsPolicy>): void {
    if (updates.userAgentRules) {
      this.options.userAgentRules = updates.userAgentRules;
    }
    if (updates.sitemaps) {
      this.options.sitemaps = updates.sitemaps;
    }
    if (updates.host !== undefined) {
      this.options.host = updates.host;
    }
  }

  /**
   * Check if URL is allowed for a specific user agent
   */
  isUrlAllowed(url: string, userAgent: string = '*'): boolean {
    const path = new URL(url).pathname;
    
    // Find rules for the user agent (or wildcard)
    let rules = this.options.userAgentRules?.find((rule: any) => rule.userAgent === userAgent);
    if (!rules) {
      rules = this.options.userAgentRules?.find((rule: any) => rule.userAgent === '*');
    }
    
    if (!rules) {
      return true; // Default to allow if no rules found
    }

    // Check disallow rules first
    for (const disallow of rules.disallow) {
      if (this.matchesPath(path, disallow)) {
        // Check if there's a more specific allow rule
        for (const allow of rules.allow) {
          if (this.matchesPath(path, allow) && allow.length >= disallow.length) {
            return true;
          }
        }
        return false;
      }
    }

    // Check allow rules
    for (const allow of rules.allow) {
      if (this.matchesPath(path, allow)) {
        return true;
      }
    }

    return true; // Default to allow
  }

  /**
   * Path matching with wildcards
   */
  private matchesPath(path: string, pattern: string): boolean {
    if (pattern === '/') {
      return true;
    }
    
    if (pattern === '') {
      return false;
    }

    // Convert pattern to regex
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\$/, '\\$') + '$'
    );
    
    return regex.test(path);
  }
}

/**
 * Create a robots.txt manager instance
 */
export function createRobotsTxtManager(options?: RobotsTxtOptions): RobotsTxtManager {
  return new RobotsTxtManager(options);
}

/**
 * Quick robots.txt generation
 */
export function generateRobotsTxt(options?: RobotsTxtOptions): string {
  const manager = new RobotsTxtManager(options);
  return manager.generateRobotsTxt();
}

/**
 * Quick robots.txt validation
 */
export function validateRobotsTxt(content: string): SEOValidationResult {
  const manager = new RobotsTxtManager();
  return manager.validateRobotsTxt(content);
}

/**
 * Create default robots.txt for a typical website
 */
export function createDefaultRobotsTxt(domain: string, sitemapUrl?: string): string {
  const options: RobotsTxtOptions = {
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
          '/temp/',
          '/cache/',
          '/_next/',
          '/.well-known/',
        ],
      },
    ],
    host: domain,
  };

  if (sitemapUrl) {
    options.sitemaps = [sitemapUrl];
  }

  const manager = new RobotsTxtManager(options);
  return manager.generateRobotsTxt();
}

/**
 * Create robots.txt for a development environment
 */
export function createDevRobotsTxt(): string {
  const options: RobotsTxtOptions = {
    userAgentRules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/'],
      },
    ],
  };

  const manager = new RobotsTxtManager(options);
  return manager.generateRobotsTxt();
}
