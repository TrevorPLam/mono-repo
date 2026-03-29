/**
 * Robots.txt Manager Tests
 * 
 * Comprehensive test suite for robots.txt management covering:
 * - Robots.txt generation
 * - User agent rule management
 * - Sitemap inclusion
 * - Crawl delay configuration
 * - Robots.txt validation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  RobotsTxtManager,
  createRobotsTxtManager,
  generateRobotsTxt,
  validateRobotsTxt,
  createDefaultRobotsTxt,
  createDevRobotsTxt,
} from '../../src/robots/index.js';
import type { RobotsTxtOptions } from '../../src/robots/index.js';

describe('RobotsTxtManager', () => {
  let manager: RobotsTxtManager;
  let defaultOptions: RobotsTxtOptions;

  beforeEach(() => {
    defaultOptions = {
      userAgentRules: [
        {
          userAgent: '*',
          allow: ['/'],
          disallow: ['/admin/', '/api/', '/private/'],
          crawlDelay: undefined,
        },
      ],
      sitemaps: ['https://example.com/sitemap.xml'],
      host: 'example.com',
    };
    
    manager = createRobotsTxtManager(defaultOptions);
  });

  describe('Constructor and Configuration', () => {
    it('should create manager with default options', () => {
      const defaultManager = new RobotsTxtManager();
      
      expect(defaultManager).toBeInstanceOf(RobotsTxtManager);
    });

    it('should create manager with custom options', () => {
      const customManager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: 'Googlebot',
            allow: ['/public/'],
            disallow: ['/private/'],
            crawlDelay: 1,
          },
        ],
        sitemaps: ['https://custom.com/sitemap.xml'],
      });
      
      expect(customManager).toBeInstanceOf(RobotsTxtManager);
    });
  });

  describe('Robots.txt Generation', () => {
    it('should generate basic robots.txt', () => {
      const robotsTxt = manager.generateRobotsTxt();
      
      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Allow: /');
      expect(robotsTxt).toContain('Disallow: /admin/');
      expect(robotsTxt).toContain('Disallow: /api/');
      expect(robotsTxt).toContain('Disallow: /private/');
      expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap.xml');
      expect(robotsTxt).toContain('Host: example.com');
    });

    it('should generate robots.txt with multiple user agents', () => {
      const multiAgentManager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: ['/private/'],
          },
          {
            userAgent: 'Googlebot',
            allow: ['/public/', '/images/'],
            disallow: ['/no-google/'],
            crawlDelay: 1,
          },
          {
            userAgent: 'Bingbot',
            allow: ['/public/'],
            disallow: ['/admin/', '/api/'],
            crawlDelay: 2,
          },
        ],
        sitemaps: ['https://example.com/sitemap.xml'],
      });
      
      const robotsTxt = multiAgentManager.generateRobotsTxt();
      
      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('User-agent: Googlebot');
      expect(robotsTxt).toContain('User-agent: Bingbot');
      expect(robotsTxt).toContain('Crawl-delay: 1');
      expect(robotsTxt).toContain('Crawl-delay: 2');
    });

    it('should handle empty allow/disallow lists', () => {
      const minimalManager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: [],
            disallow: [],
          },
        ],
        sitemaps: [],
      });
      
      const robotsTxt = minimalManager.generateRobotsTxt();
      
      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).not.toContain('Allow:');
      expect(robotsTxt).not.toContain('Disallow:');
    });

    it('should handle missing sitemaps', () => {
      const noSitemapManager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: ['/private/'],
          },
        ],
        sitemaps: [],
      });
      
      const robotsTxt = noSitemapManager.generateRobotsTxt();
      
      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).not.toContain('Sitemap:');
    });

    it('should handle missing host', () => {
      const noHostManager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: ['/private/'],
          },
        ],
        sitemaps: ['https://example.com/sitemap.xml'],
      });
      
      const robotsTxt = noHostManager.generateRobotsTxt();
      
      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap.xml');
      expect(robotsTxt).not.toContain('Host:');
    });

    it('should format robots.txt correctly', () => {
      const robotsTxt = manager.generateRobotsTxt();
      
      // Check proper line endings and spacing
      expect(robotsTxt).toMatch(/User-agent: \*\s*\n/);
      expect(robotsTxt).toMatch(/Allow: \/\s*\n/);
      expect(robotsTxt).toMatch(/Disallow: \/admin\/\s*\n/);
      
      // Check blank lines between user agents
      const lines = robotsTxt.split('\n');
      const userAgentLines = lines.filter(line => line.startsWith('User-agent:'));
      expect(userAgentLines.length).toBeGreaterThan(0);
    });
  });

  describe('User Agent Rule Management', () => {
    it('should add user agent rule', () => {
      manager.addUserAgentRule({
        userAgent: 'Googlebot',
        allow: ['/public/'],
        disallow: ['/private/'],
        crawlDelay: 1,
      });
      
      const robotsTxt = manager.generateRobotsTxt();
      
      expect(robotsTxt).toContain('User-agent: Googlebot');
      expect(robotsTxt).toContain('Allow: /public/');
      expect(robotsTxt).toContain('Disallow: /private/');
      expect(robotsTxt).toContain('Crawl-delay: 1');
    });

    it('should update existing user agent rule', () => {
      manager.updateUserAgentRule('*', {
        allow: ['/new-public/'],
        disallow: ['/new-private/'],
        crawlDelay: 2,
      });
      
      const robotsTxt = manager.generateRobotsTxt();
      
      expect(robotsTxt).toContain('Allow: /new-public/');
      expect(robotsTxt).toContain('Disallow: /new-private/');
      expect(robotsTxt).toContain('Crawl-delay: 2');
    });

    it('should remove user agent rule', () => {
      manager.removeUserAgentRule('*');
      
      const robotsTxt = manager.generateRobotsTxt();
      
      expect(robotsTxt).not.toContain('User-agent: *');
    });

    it('should handle non-existent user agent in updates', () => {
      expect(() => manager.updateUserAgentRule('NonExistentBot', {
        allow: ['/test/'],
        disallow: [],
      })).not.toThrow();
      
      expect(() => manager.removeUserAgentRule('NonExistentBot')).not.toThrow();
    });
  });

  describe('Sitemap Management', () => {
    it('should add sitemap', () => {
      manager.addSitemap('https://example.com/sitemap2.xml');
      
      const robotsTxt = manager.generateRobotsTxt();
      
      expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap.xml');
      expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap2.xml');
    });

    it('should remove sitemap', () => {
      manager.removeSitemap('https://example.com/sitemap.xml');
      
      const robotsTxt = manager.generateRobotsTxt();
      
      expect(robotsTxt).not.toContain('Sitemap: https://example.com/sitemap.xml');
    });

    it('should handle duplicate sitemaps', () => {
      manager.addSitemap('https://example.com/sitemap.xml');
      manager.addSitemap('https://example.com/sitemap.xml');
      
      const robotsTxt = manager.generateRobotsTxt();
      
      // Should only appear once
      const matches = robotsTxt.match(/Sitemap: https:\/\/example\.com\/sitemap\.xml/g);
      expect(matches?.length).toBe(1);
    });
  });

  describe('Host Management', () => {
    it('should set host', () => {
      manager.setHost('newhost.com');
      
      const robotsTxt = manager.generateRobotsTxt();
      
      expect(robotsTxt).toContain('Host: newhost.com');
      expect(robotsTxt).not.toContain('Host: example.com');
    });

    it('should remove host', () => {
      manager.removeHost();
      
      const robotsTxt = manager.generateRobotsTxt();
      
      expect(robotsTxt).not.toContain('Host:');
    });
  });

  describe('Validation', () => {
    it('should validate valid robots.txt', () => {
      const validContent = `
        User-agent: *
        Allow: /
        Disallow: /private/
        Sitemap: https://example.com/sitemap.xml
      `;
      
      const result = manager.validateRobotsTxt(validContent);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid user agent format', () => {
      const invalidContent = `
        User-agent: 
        Allow: /
      `;
      
      const result = manager.validateRobotsTxt(invalidContent);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid user agent format');
    });

    it('should detect invalid URL format', () => {
      const invalidContent = `
        User-agent: *
        Allow: invalid-url-without-slash
        Disallow: /private/
      `;
      
      const result = manager.validateRobotsTxt(invalidContent);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid URL format in Allow directive');
    });

    it('should detect invalid sitemap URL', () => {
      const invalidContent = `
        User-agent: *
        Allow: /
        Sitemap: not-a-valid-url
      `;
      
      const result = manager.validateRobotsTxt(invalidContent);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid sitemap URL format');
    });

    it('should detect invalid crawl delay', () => {
      const invalidContent = `
        User-agent: *
        Crawl-delay: invalid
        Allow: /
      `;
      
      const result = manager.validateRobotsTxt(invalidContent);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid crawl delay value');
    });

    it('should provide warnings for common issues', () => {
      const contentWithWarnings = `
        User-agent: *
        Disallow: /
        Allow: /public/
        Sitemap: http://example.com/sitemap.xml
      `;
      
      const result = manager.validateRobotsTxt(contentWithWarnings);
      
      expect(result.warnings).toContain('Disallow / followed by specific allows - consider reordering');
      expect(result.warnings).toContain('Sitemap should use HTTPS');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty robots.txt', () => {
      const emptyManager = new RobotsTxtManager({
        userAgentRules: [],
        sitemaps: [],
      });
      
      const robotsTxt = emptyManager.generateRobotsTxt();
      
      expect(robotsTxt).toBe('');
    });

    it('should handle null/undefined inputs', () => {
      expect(() => manager.validateRobotsTxt(null as any)).not.toThrow();
      expect(() => manager.validateRobotsTxt(undefined as any)).not.toThrow();
      
      const result = manager.validateRobotsTxt(null as any);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle very large robots.txt', () => {
      const largeManager = new RobotsTxtManager({
        userAgentRules: Array.from({ length: 100 }, (_, i) => ({
          userAgent: `Bot${i}`,
          allow: [`/allowed${i}/`],
          disallow: [`/disallowed${i}/`],
        })),
        sitemaps: Array.from({ length: 50 }, (_, i) => 
          `https://example.com/sitemap${i}.xml`
        ),
      });
      
      expect(() => largeManager.generateRobotsTxt()).not.toThrow();
      
      const robotsTxt = largeManager.generateRobotsTxt();
      expect(robotsTxt.length).toBeGreaterThan(1000);
    });

    it('should handle special characters in paths', () => {
      const specialCharsManager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/path-with-dashes/', '/path_with_underscores/', '/path+with+plus/'],
            disallow: ['/path with spaces/', '/path-with-émojis-🎉/'],
          },
        ],
        sitemaps: [],
      });
      
      expect(() => specialCharsManager.generateRobotsTxt()).not.toThrow();
      
      const robotsTxt = specialCharsManager.generateRobotsTxt();
      expect(robotsTxt).toContain('/path-with-dashes/');
      expect(robotsTxt).toContain('/path_with_underscores/');
      expect(robotsTxt).toContain('/path+with+plus/');
    });
  });
});

describe('Factory Functions', () => {
  describe('createRobotsTxtManager', () => {
    it('should create RobotsTxtManager instance', () => {
      const manager = createRobotsTxtManager();
      
      expect(manager).toBeInstanceOf(RobotsTxtManager);
    });

    it('should create manager with custom options', () => {
      const options: RobotsTxtOptions = {
        userAgentRules: [
          {
            userAgent: 'Googlebot',
            allow: ['/public/'],
            disallow: ['/private/'],
          },
        ],
        sitemaps: ['https://custom.com/sitemap.xml'],
      };
      
      const manager = createRobotsTxtManager(options);
      
      expect(manager).toBeInstanceOf(RobotsTxtManager);
    });
  });

  describe('generateRobotsTxt', () => {
    it('should generate robots.txt using default options', () => {
      const options: RobotsTxtOptions = {
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: ['/private/'],
          },
        ],
        sitemaps: ['https://example.com/sitemap.xml'],
      };
      
      const robotsTxt = generateRobotsTxt(options);
      
      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Allow: /');
      expect(robotsTxt).toContain('Disallow: /private/');
      expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap.xml');
    });
  });

  describe('validateRobotsTxt', () => {
    it('should validate robots.txt content', () => {
      const validContent = `
        User-agent: *
        Allow: /
        Disallow: /private/
      `;
      
      const result = validateRobotsTxt(validContent);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should report validation errors', () => {
      const invalidContent = `
        User-agent: 
        Allow: /
      `;
      
      const result = validateRobotsTxt(invalidContent);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('createDefaultRobotsTxt', () => {
    it('should create default robots.txt for production', () => {
      const robotsTxt = createDefaultRobotsTxt('https://example.com');
      
      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Allow: /');
      expect(robotsTxt).toContain('Disallow: /admin/');
      expect(robotsTxt).toContain('Disallow: /api/');
      expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap.xml');
    });

    it('should handle custom domain', () => {
      const robotsTxt = createDefaultRobotsTxt('https://custom.com');
      
      expect(robotsTxt).toContain('Sitemap: https://custom.com/sitemap.xml');
    });
  });

  describe('createDevRobotsTxt', () => {
    it('should create development robots.txt', () => {
      const robotsTxt = createDevRobotsTxt();
      
      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Disallow: /');
      expect(robotsTxt).not.toContain('Allow: /');
      expect(robotsTxt).not.toContain('Sitemap:');
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complete robots.txt workflow', () => {
    const manager = createRobotsTxtManager({
      userAgentRules: [
        {
          userAgent: '*',
          allow: ['/'],
          disallow: ['/admin/', '/api/', '/private/'],
        },
        {
          userAgent: 'Googlebot',
          allow: ['/public/', '/images/'],
          disallow: ['/no-google/'],
          crawlDelay: 1,
        },
      ],
      sitemaps: [
        'https://example.com/sitemap.xml',
        'https://example.com/images-sitemap.xml',
      ],
      host: 'example.com',
    });
    
    // Generate robots.txt
    const robotsTxt = manager.generateRobotsTxt();
    
    // Validate generated content
    const validation = manager.validateRobotsTxt(robotsTxt);
    expect(validation.valid).toBe(true);
    
    // Update rules
    manager.addUserAgentRule({
      userAgent: 'Bingbot',
      allow: ['/public/'],
      disallow: ['/admin/'],
      crawlDelay: 2,
    });
    
    // Generate updated robots.txt
    const updatedRobotsTxt = manager.generateRobotsTxt();
    expect(updatedRobotsTxt).toContain('User-agent: Bingbot');
    expect(updatedRobotsTxt).toContain('Crawl-delay: 2');
  });

  it('should handle complex sitemap scenarios', () => {
    const manager = createRobotsTxtManager({
      userAgentRules: [
        {
          userAgent: '*',
          allow: ['/'],
          disallow: ['/private/'],
        },
      ],
      sitemaps: [
        'https://example.com/sitemap.xml',
        'https://example.com/sitemap-images.xml',
        'https://example.com/sitemap-videos.xml',
        'https://example.com/sitemap-news.xml',
      ],
    });
    
    const robotsTxt = manager.generateRobotsTxt();
    
    // Should include all sitemaps
    expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap.xml');
    expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap-images.xml');
    expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap-videos.xml');
    expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap-news.xml');
    
    // Remove some sitemaps
    manager.removeSitemap('https://example.com/sitemap-videos.xml');
    manager.removeSitemap('https://example.com/sitemap-news.xml');
    
    const updatedRobotsTxt = manager.generateRobotsTxt();
    expect(updatedRobotsTxt).not.toContain('Sitemap: https://example.com/sitemap-videos.xml');
    expect(updatedRobotsTxt).not.toContain('Sitemap: https://example.com/sitemap-news.xml');
    expect(updatedRobotsTxt).toContain('Sitemap: https://example.com/sitemap.xml');
    expect(updatedRobotsTxt).toContain('Sitemap: https://example.com/sitemap-images.xml');
  });
});
