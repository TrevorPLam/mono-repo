/**
 * Sitemap Generation System
 * 
 * Generates XML sitemaps for SEO with support for regular sitemaps,
 * image sitemaps, and news sitemaps.
 */

import { z } from 'zod';
import type { SitemapPolicy, SitemapUrl, SitemapImage, SitemapNews } from '../types/index.js';

/**
 * Sitemap generation options
 */
export interface SitemapGenerationOptions {
  /** Base URL for the sitemap */
  baseUrl: string;
  
  /** Default change frequency */
  defaultChangeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  
  /** Default priority */
  defaultPriority?: number;
  
  /** Exclude patterns */
  excludePatterns?: string[];
  
  /** Include only patterns */
  includeOnlyPatterns?: string[];
  
  /** Maximum URLs per sitemap */
  maxUrlsPerSitemap?: number;
  
  /** Enable image sitemap */
  enableImageSitemap?: boolean;
  
  /** Enable news sitemap */
  enableNewsSitemap?: boolean;
  
  /** Last modification date */
  lastmod?: string;
  
  /** Custom URL filtering */
  filter?: (url: SitemapUrl) => boolean;
}

/**
 * Sitemap generator class
 */
export class SitemapGenerator {
  private options: Required<SitemapGenerationOptions>;

  constructor(options: SitemapGenerationOptions) {
    this.options = {
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
      lastmod: new Date().toISOString().split('T')[0],
      filter: (url) => true,
      ...options,
    };
  }

  /**
   * Generate sitemap XML from URLs
   */
  generateSitemap(urls: SitemapUrl[]): string {
    const filteredUrls = this.filterUrls(urls);
    const sitemaps = this.splitIntoSitemaps(filteredUrls);

    if (sitemaps.length === 1) {
      return this.generateSingleSitemap(sitemaps[0]);
    } else {
      return this.generateSitemapIndex(sitemaps);
    }
  }

  /**
   * Generate single sitemap XML
   */
  generateSingleSitemap(urls: SitemapUrl[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';

    // Add namespaces for images and news if enabled
    if (this.options.enableImageSitemap) {
      xml += '  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
    }
    if (this.options.enableNewsSitemap) {
      xml += '  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n';
    }

    xml += '>\n';

    for (const urlEntry of urls) {
      xml += this.formatUrlEntry(urlEntry);
    }

    xml += '</urlset>';
    return xml;
  }

  /**
   * Generate sitemap index XML
   */
  generateSitemapIndex(sitemaps: SitemapUrl[][]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (let i = 0; i < sitemaps.length; i++) {
      const sitemapUrl = `${this.options.baseUrl}/sitemap-${i + 1}.xml`;
      const lastmod = this.options.lastmod;

      xml += '  <sitemap>\n';
      xml += `    <loc>${this.escapeXml(sitemapUrl)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '  </sitemap>\n';
    }

    xml += '</sitemapindex>';
    return xml;
  }

  /**
   * Format individual URL entry
   */
  private formatUrlEntry(urlEntry: SitemapUrl): string {
    let xml = '  <url>\n';
    xml += `    <loc>${this.escapeXml(urlEntry.url)}</loc>\n`;

    if (urlEntry.lastmod) {
      xml += `    <lastmod>${urlEntry.lastmod}</lastmod>\n`;
    } else if (this.options.lastmod) {
      xml += `    <lastmod>${this.options.lastmod}</lastmod>\n`;
    }

    if (urlEntry.changefreq) {
      xml += `    <changefreq>${urlEntry.changefreq}</changefreq>\n`;
    } else if (this.options.defaultChangeFreq) {
      xml += `    <changefreq>${this.options.defaultChangeFreq}</changefreq>\n`;
    }

    if (urlEntry.priority !== undefined) {
      xml += `    <priority>${urlEntry.priority.toFixed(1)}</priority>\n`;
    } else if (this.options.defaultPriority !== undefined) {
      xml += `    <priority>${this.options.defaultPriority.toFixed(1)}</priority>\n`;
    }

    // Add images
    if (this.options.enableImageSitemap && urlEntry.images) {
      for (const image of urlEntry.images) {
        xml += this.formatImageEntry(image);
      }
    }

    // Add news
    if (this.options.enableNewsSitemap && urlEntry.news) {
      for (const news of urlEntry.news) {
        xml += this.formatNewsEntry(news);
      }
    }

    xml += '  </url>\n';
    return xml;
  }

  /**
   * Format image entry
   */
  private formatImageEntry(image: SitemapImage): string {
    let xml = '    <image:image>\n';
    xml += `      <image:loc>${this.escapeXml(image.loc)}</image:loc>\n`;

    if (image.caption) {
      xml += `      <image:caption>${this.escapeXml(image.caption)}</image:caption>\n`;
    }

    if (image.geo_location) {
      xml += `      <image:geo_location>${this.escapeXml(image.geo_location)}</image:geo_location>\n`;
    }

    if (image.title) {
      xml += `      <image:title>${this.escapeXml(image.title)}</image:title>\n`;
    }

    if (image.license) {
      xml += `      <image:license>${this.escapeXml(image.license)}</image:license>\n`;
    }

    xml += '    </image:image>\n';
    return xml;
  }

  /**
   * Format news entry
   */
  private formatNewsEntry(news: SitemapNews): string {
    let xml = '    <news:news>\n';
    xml += '      <news:publication>\n';
    xml += `        <news:name>${this.escapeXml(news.publication.name)}</news:name>\n`;
    xml += `        <news:language>${this.escapeXml(news.publication.language)}</news:language>\n`;
    xml += '      </news:publication>\n';
    xml += `      <news:publication_date>${news.publication_date}</news:publication_date>\n`;
    xml += `      <news:title>${this.escapeXml(news.title)}</news:title>\n`;
    xml += '    </news:news>\n';
    return xml;
  }

  /**
   * Filter URLs based on patterns and custom filter
   */
  private filterUrls(urls: SitemapUrl[]): SitemapUrl[] {
    return urls.filter(url => {
      // Apply custom filter first
      if (!this.options.filter(url)) {
        return false;
      }

      // Check exclude patterns
      for (const pattern of this.options.excludePatterns) {
        if (this.matchesPattern(url.url, pattern)) {
          return false;
        }
      }

      // Check include-only patterns
      if (this.options.includeOnlyPatterns.length > 0) {
        for (const pattern of this.options.includeOnlyPatterns) {
          if (this.matchesPattern(url.url, pattern)) {
            return true;
          }
        }
        return false;
      }

      return true;
    });
  }

  /**
   * Split URLs into multiple sitemaps if needed
   */
  private splitIntoSitemaps(urls: SitemapUrl[]): SitemapUrl[][] {
    const sitemaps: SitemapUrl[][] = [];
    const maxSize = this.options.maxUrlsPerSitemap;

    for (let i = 0; i < urls.length; i += maxSize) {
      sitemaps.push(urls.slice(i, i + maxSize));
    }

    return sitemaps;
  }

  /**
   * Pattern matching (supports * wildcards)
   */
  private matchesPattern(url: string, pattern: string): boolean {
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\?\*/g, '.+') + '$'
    );
    return regex.test(url);
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Get sitemap policy
   */
  getPolicy(): SitemapPolicy {
    return {
      defaultChangeFreq: this.options.defaultChangeFreq,
      defaultPriority: this.options.defaultPriority,
      excludePatterns: this.options.excludePatterns,
      includeOnlyPatterns: this.options.includeOnlyPatterns,
      maxUrlsPerSitemap: this.options.maxUrlsPerSitemap,
      enableImageSitemap: this.options.enableImageSitemap,
      enableNewsSitemap: this.options.enableNewsSitemap,
    };
  }

  /**
   * Update sitemap policy
   */
  updatePolicy(updates: Partial<SitemapPolicy>): void {
    this.options = { ...this.options, ...updates };
  }
}

/**
 * Create a sitemap generator instance
 */
export function createSitemapGenerator(options: SitemapGenerationOptions): SitemapGenerator {
  return new SitemapGenerator(options);
}

/**
 * Quick sitemap generation
 */
export function generateSitemap(urls: SitemapUrl[], options: SitemapGenerationOptions): string {
  const generator = new SitemapGenerator(options);
  return generator.generateSitemap(urls);
}

/**
 * Create sitemap URL object
 */
export function createSitemapUrl(
  url: string,
  options: {
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
    images?: SitemapImage[];
    news?: SitemapNews[];
  } = {}
): SitemapUrl {
  return {
    url,
    lastmod: options.lastmod,
    changefreq: options.changefreq,
    priority: options.priority,
    images: options.images,
    news: options.news,
  };
}

/**
 * Create sitemap image object
 */
export function createSitemapImage(
  loc: string,
  options: {
    caption?: string;
    geo_location?: string;
    title?: string;
    license?: string;
  } = {}
): SitemapImage {
  return {
    loc,
    caption: options.caption,
    geo_location: options.geo_location,
    title: options.title,
    license: options.license,
  };
}

/**
 * Create sitemap news object
 */
export function createSitemapNews(
  publication: { name: string; language: string },
  publication_date: string,
  title: string
): SitemapNews {
  return {
    publication,
    publication_date,
    title,
  };
}

/**
 * Validate sitemap URL
 */
export function validateSitemapUrl(url: SitemapUrl): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate URL format
  try {
    new URL(url.url);
  } catch {
    errors.push('Invalid URL format');
  }

  // Validate priority
  if (url.priority !== undefined && (url.priority < 0 || url.priority > 1)) {
    errors.push('Priority must be between 0 and 1');
  }

  // Validate images
  if (url.images) {
    for (const image of url.images) {
      try {
        new URL(image.loc);
      } catch {
        errors.push(`Invalid image URL: ${image.loc}`);
      }
    }
  }

  // Validate news
  if (url.news) {
    for (const news of url.news) {
      if (!news.publication.name || !news.publication.language) {
        errors.push('News publication must have name and language');
      }
      if (!news.publication_date) {
        errors.push('News must have publication_date');
      }
      if (!news.title) {
        errors.push('News must have title');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
