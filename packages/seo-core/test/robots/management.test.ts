/**
 * Robots.txt Management System Tests
 * 
 * Comprehensive test suite for robots.txt management following 2026 best practices
 * Uses Vitest with type-safe mocks and AAA pattern
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { RobotsPolicy, SEOValidationResult } from '../../src/types/index.js';
import { 
  RobotsTxtManager, 
  createRobotsTxtManager,
  generateRobotsTxt,
  validateRobotsTxt,
  createDefaultRobotsTxt,
  createDevRobotsTxt,
  type RobotsTxtOptions
} from '../../src/robots/index.js';

describe('RobotsTxtManager', () => {
  let manager: RobotsTxtManager;
  let defaultOptions: RobotsTxtOptions;

  beforeEach(() => {
    defaultOptions = {
      userAgentRules: [
        {
          userAgent: '*',
          allow: ['/'],
          disallow: ['/admin/', '/api/'],
          crawlDelay: 1,
        },
      ],
      sitemaps: ['https://example.com/sitemap.xml'],
      host: 'example.com',
      directives: {
        'Custom-Directive': 'custom-value',
      },
    };
    
    manager = new RobotsTxtManager(defaultOptions);
  });

  describe('Constructor', () => {
    it('should initialize with default options when none provided', () => {
      const manager = new RobotsTxtManager();
      const policy = manager.getPolicy();

      expect(policy.userAgentRules).toHaveLength(1);
      expect(policy.userAgentRules[0].userAgent).toBe('*');
      expect(policy.userAgentRules[0].allow).toEqual(['/']);
      expect(policy.userAgentRules[0].disallow).toContain('/admin/');
      expect(policy.userAgentRules[0].disallow).toContain('/api/');
      expect(policy.sitemaps).toHaveLength(0);
    });

    it('should initialize with custom options', () => {
      const options: RobotsTxtOptions = {
        userAgentRules: [
          {
            userAgent: 'Googlebot',
            allow: ['/public/'],
            disallow: ['/private/'],
            crawlDelay: 2,
          },
        ],
        sitemaps: ['https://example.com/sitemap1.xml', 'https://example.com/sitemap2.xml'],
        host: 'example.com',
        directives: {
          'Custom-Header': 'custom-value',
        },
      };

      const manager = new RobotsTxtManager(options);
      const policy = manager.getPolicy();

      expect(policy.userAgentRules).toHaveLength(1);
      expect(policy.userAgentRules[0].userAgent).toBe('Googlebot');
      expect(policy.userAgentRules[0].allow).toEqual(['/public/']);
      expect(policy.userAgentRules[0].disallow).toEqual(['/private/']);
      expect(policy.sitemaps).toEqual(['https://example.com/sitemap1.xml', 'https://example.com/sitemap2.xml']);
      expect(policy.host).toBe('example.com');
    });
  });

  describe('generateRobotsTxt', () => {
    it('should generate basic robots.txt structure', () => {
      const manager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: ['/admin/'],
          },
        ],
      });

      const robotsTxt = manager.generateRobotsTxt();

      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Allow: /');
      expect(robotsTxt).toContain('Disallow: /admin/');
      expect(robotsTxt).toMatch(/User-agent: \*\nAllow: \/\nDisallow: \/admin\/\n/);
    });

    it('should include crawl delay when specified', () => {
      const manager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: ['/admin/'],
            crawlDelay: 5,
          },
        ],
      });

      const robotsTxt = manager.generateRobotsTxt();

      expect(robotsTxt).toContain('Crawl-delay: 5');
    });

    it('should include multiple user agent rules', () => {
      const manager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: ['/admin/'],
          },
          {
            userAgent: 'Googlebot',
            allow: ['/google-special/'],
            disallow: ['/no-google/'],
            crawlDelay: 2,
          },
        ],
      });

      const robotsTxt = manager.generateRobotsTxt();

      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('User-agent: Googlebot');
      expect(robotsTxt).toContain('Allow: /google-special/');
      expect(robotsTxt).toContain('Disallow: /no-google/');
      expect(robotsTxt).toContain('Crawl-delay: 2');
    });

    it('should include sitemaps when specified', () => {
      const manager = new RobotsTxtManager({
        sitemaps: [
          'https://example.com/sitemap1.xml',
          'https://example.com/sitemap2.xml',
        ],
      });

      const robotsTxt = manager.generateRobotsTxt();

      expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap1.xml');
      expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap2.xml');
    });

    it('should include host directive when specified', () => {
      const manager = new RobotsTxtManager({
        host: 'example.com',
      });

      const robotsTxt = manager.generateRobotsTxt();

      expect(robotsTxt).toContain('Host: example.com');
    });

    it('should include custom directives when specified', () => {
      const manager = new RobotsTxtManager({
        directives: {
          'Custom-Directive': 'custom-value',
          'Another-Directive': 'another-value',
        },
      });

      const robotsTxt = manager.generateRobotsTxt();

      expect(robotsTxt).toContain('Custom-Directive: custom-value');
      expect(robotsTxt).toContain('Another-Directive: another-value');
    });

    it('should handle empty allow and disallow arrays', () => {
      const manager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: [],
            disallow: [],
          },
        ],
      });

      const robotsTxt = manager.generateRobotsTxt();

      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).not.toContain('Allow:');
      expect(robotsTxt).not.toContain('Disallow:');
    });

    it('should maintain proper spacing and formatting', () => {
      const manager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: ['/admin/'],
          },
        ],
        sitemaps: ['https://example.com/sitemap.xml'],
        host: 'example.com',
      });

      const robotsTxt = manager.generateRobotsTxt();

      // Should have blank lines between sections
      expect(robotsTxt).toMatch(/\n\n/);
      // Should not end with extra newlines
      expect(robotsTxt).not.toMatch(/\n$/);
      // Should have proper line endings
      expect(robotsTxt).toMatch(/\r?\n/);
    });
  });

  describe('validateRobotsTxt', () => {
    describe('Valid Robots.txt', () => {
      it('should validate well-formed robots.txt', () => {
        const content = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Crawl-delay: 1

Sitemap: https://example.com/sitemap.xml
Host: example.com`;

        const result = manager.validateRobotsTxt(content);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should validate robots.txt with comments', () => {
        const content = `# This is a comment
User-agent: *
Allow: /
# Disallow admin section
Disallow: /admin/
# End of configuration`;

        const result = manager.validateRobotsTxt(content);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should validate robots.txt with multiple user agents', () => {
        const content = `User-agent: *
Disallow: /admin/

User-agent: Googlebot
Allow: /special/
Crawl-delay: 2

User-agent: Bingbot
Disallow: /no-bing/`;

        const result = manager.validateRobotsTxt(content);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    describe('Invalid Robots.txt', () => {
      it('should detect invalid crawl delay', () => {
        const content = `User-agent: *
Allow: /
Disallow: /admin/
Crawl-delay: invalid`;

        const result = manager.validateRobotsTxt(content);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Invalid Crawl-delay value');
      });

      it('should detect negative crawl delay', () => {
        const content = `User-agent: *
Allow: /
Disallow: /admin/
Crawl-delay: -5`;

        const result = manager.validateRobotsTxt(content);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Invalid Crawl-delay value');
      });

      it('should detect invalid sitemap URL', () => {
        const content = `User-agent: *
Allow: /

Sitemap: not-a-valid-url`;

        const result = manager.validateRobotsTxt(content);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Invalid sitemap URL: not-a-valid-url');
      });

      it('should detect malformed sitemap URL', () => {
        const content = `User-agent: *
Allow: /

Sitemap: https://[invalid-ipv6]:80/sitemap.xml`;

        const result = manager.validateRobotsTxt(content);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Invalid sitemap URL:');
      });
    });

    describe('Warnings', () => {
      it('should warn about allow directive without user agent', () => {
        const content = `Allow: /
Disallow: /admin/`;

        const result = manager.validateRobotsTxt(content);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain('Allow directive without User-agent');
      });

      it('should warn about disallow directive without user agent', () => {
        const content = `User-agent: *
Allow: /

Disallow: /admin/`;

        const result = manager.validateRobotsTxt(content);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain('Disallow directive without User-agent');
      });

      it('should warn about invalid host directive', () => {
        const content = `User-agent: *
Allow: /

Host: invalid-host`;

        const result = manager.validateRobotsTxt(content);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain('Host directive should be a valid domain');
      });

      it('should warn about conflicting allow/disallow rules', () => {
        const content = `User-agent: *
Allow: /admin/
Disallow: /admin/`;

        const result = manager.validateRobotsTxt(content);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain("Conflicting Allow/Disallow for path '/admin/' in User-agent '*'");
      });

      it('should warn about conflicting rules for specific user agent', () => {
        const content = `User-agent: Googlebot
Allow: /special/
Disallow: /special/

User-agent: *
Allow: /
Disallow: /admin/`;

        const result = manager.validateRobotsTxt(content);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain("Conflicting Allow/Disallow for path '/special/' in User-agent 'Googlebot'");
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty robots.txt', () => {
        const content = '';

        const result = manager.validateRobotsTxt(content);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(result.warnings).toHaveLength(0);
      });

      it('should handle robots.txt with only comments', () => {
        const content = `# Comment 1
# Comment 2
# Comment 3`;

        const result = manager.validateRobotsTxt(content);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should handle malformed lines gracefully', () => {
        const content = `User-agent: *
Allow: /
Invalid-line: without-proper-format
Disallow: /admin/`;

        const result = manager.validateRobotsTxt(content);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  });

  describe('User Agent Rule Management', () => {
    it('should add user agent rule', () => {
      const newRule = {
        userAgent: 'Bingbot',
        allow: ['/bing/'],
        disallow: ['/no-bing/'],
        crawlDelay: 3,
      };

      manager.addUserAgentRule(newRule);
      const policy = manager.getPolicy();

      expect(policy.userAgentRules).toHaveLength(2);
      expect(policy.userAgentRules[1]).toEqual(newRule);
    });

    it('should remove user agent rule', () => {
      const removed = manager.removeUserAgentRule('*');
      const policy = manager.getPolicy();

      expect(removed).toBe(true);
      expect(policy.userAgentRules).toHaveLength(0);
    });

    it('should return false when removing non-existent user agent', () => {
      const removed = manager.removeUserAgentRule('NonExistentBot');

      expect(removed).toBe(false);
    });

    it('should handle adding rule when no rules exist', () => {
      const manager = new RobotsTxtManager();
      manager.removeUserAgentRule('*'); // Remove default rule

      const newRule = {
        userAgent: 'CustomBot',
        allow: ['/custom/'],
        disallow: ['/no-custom/'],
      };

      manager.addUserAgentRule(newRule);
      const policy = manager.getPolicy();

      expect(policy.userAgentRules).toHaveLength(1);
      expect(policy.userAgentRules[0]).toEqual(newRule);
    });
  });

  describe('Sitemap Management', () => {
    it('should add sitemap', () => {
      const newSitemap = 'https://example.com/new-sitemap.xml';
      
      manager.addSitemap(newSitemap);
      const policy = manager.getPolicy();

      expect(policy.sitemaps).toContain(newSitemap);
      expect(policy.sitemaps).toHaveLength(2);
    });

    it('should not add duplicate sitemap', () => {
      const duplicateSitemap = 'https://example.com/sitemap.xml';
      
      manager.addSitemap(duplicateSitemap);
      const policy = manager.getPolicy();

      expect(policy.sitemaps).toHaveLength(1);
      expect(policy.sitemaps[0]).toBe(duplicateSitemap);
    });

    it('should remove sitemap', () => {
      const removed = manager.removeSitemap('https://example.com/sitemap.xml');
      const policy = manager.getPolicy();

      expect(removed).toBe(true);
      expect(policy.sitemaps).toHaveLength(0);
    });

    it('should return false when removing non-existent sitemap', () => {
      const removed = manager.removeSitemap('https://example.com/non-existent.xml');

      expect(removed).toBe(false);
    });

    it('should handle sitemap management when no sitemaps exist', () => {
      const manager = new RobotsTxtManager();
      
      manager.addSitemap('https://example.com/sitemap.xml');
      const policy = manager.getPolicy();

      expect(policy.sitemaps).toHaveLength(1);
      expect(policy.sitemaps[0]).toBe('https://example.com/sitemap.xml');
    });
  });

  describe('Directive Management', () => {
    it('should add custom directive', () => {
      manager.addDirective('New-Directive', 'new-value');
      const robotsTxt = manager.generateRobotsTxt();

      expect(robotsTxt).toContain('New-Directive: new-value');
    });

    it('should remove custom directive', () => {
      const removed = manager.removeDirective('Custom-Directive');
      const robotsTxt = manager.generateRobotsTxt();

      expect(removed).toBe(true);
      expect(robotsTxt).not.toContain('Custom-Directive: custom-value');
    });

    it('should return false when removing non-existent directive', () => {
      const removed = manager.removeDirective('NonExistentDirective');

      expect(removed).toBe(false);
    });

    it('should handle directive management when no directives exist', () => {
      const manager = new RobotsTxtManager();
      
      manager.addDirective('Test-Directive', 'test-value');
      const robotsTxt = manager.generateRobotsTxt();

      expect(robotsTxt).toContain('Test-Directive: test-value');
    });
  });

  describe('Host Management', () => {
    it('should set host directive', () => {
      manager.setHost('new-domain.com');
      const policy = manager.getPolicy();

      expect(policy.host).toBe('new-domain.com');
    });

    it('should update host in generated robots.txt', () => {
      manager.setHost('new-domain.com');
      const robotsTxt = manager.generateRobotsTxt();

      expect(robotsTxt).toContain('Host: new-domain.com');
      expect(robotsTxt).not.toContain('Host: example.com');
    });
  });

  describe('Policy Management', () => {
    it('should return current policy', () => {
      const policy = manager.getPolicy();

      expect(policy.userAgentRules).toEqual(defaultOptions.userAgentRules);
      expect(policy.sitemaps).toEqual(defaultOptions.sitemaps);
      expect(policy.host).toBe(defaultOptions.host);
    });

    it('should update policy partially', () => {
      const updates: Partial<RobotsPolicy> = {
        sitemaps: ['https://example.com/new-sitemap.xml'],
        host: 'new-domain.com',
      };

      manager.updatePolicy(updates);
      const policy = manager.getPolicy();

      expect(policy.userAgentRules).toEqual(defaultOptions.userAgentRules); // Unchanged
      expect(policy.sitemaps).toEqual(['https://example.com/new-sitemap.xml']);
      expect(policy.host).toBe('new-domain.com');
    });

    it('should update all policy properties', () => {
      const newPolicy: RobotsPolicy = {
        userAgentRules: [
          {
            userAgent: 'NewBot',
            allow: ['/new/'],
            disallow: ['/no-new/'],
          },
        ],
        sitemaps: ['https://example.com/new-sitemap.xml'],
        host: 'new-domain.com',
      };

      manager.updatePolicy(newPolicy);
      const policy = manager.getPolicy();

      expect(policy).toEqual(newPolicy);
    });

    it('should handle removing sitemaps in update', () => {
      const updates: Partial<RobotsPolicy> = {
        sitemaps: [],
      };

      manager.updatePolicy(updates);
      const policy = manager.getPolicy();

      expect(policy.sitemaps).toEqual([]);
    });

    it('should handle removing host in update', () => {
      const updates: Partial<RobotsPolicy> = {
        host: undefined,
      };

      manager.updatePolicy(updates);
      const policy = manager.getPolicy();

      expect(policy.host).toBeUndefined();
    });
  });

  describe('URL Permission Checking', () => {
    it('should allow URL when no rules match', () => {
      const manager = new RobotsTxtManager(); // Default allows everything
      
      expect(manager.isUrlAllowed('https://example.com/page')).toBe(true);
      expect(manager.isUrlAllowed('https://example.com/admin/page')).toBe(true);
    });

    it('should disallow URL based on rules', () => {
      const manager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: ['/admin/', '/api/'],
          },
        ],
      });

      expect(manager.isUrlAllowed('https://example.com/public/page')).toBe(true);
      expect(manager.isUrlAllowed('https://example.com/admin/dashboard')).toBe(false);
      expect(manager.isUrlAllowed('https://example.com/api/users')).toBe(false);
    });

    it('should respect allow rules over disallow', () => {
      const manager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/admin/public/'],
            disallow: ['/admin/'],
          },
        ],
      });

      expect(manager.isUrlAllowed('https://example.com/admin/public/page')).toBe(true);
      expect(manager.isUrlAllowed('https://example.com/admin/private/page')).toBe(false);
    });

    it('should handle user agent specific rules', () => {
      const manager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: ['/special/'],
          },
          {
            userAgent: 'Googlebot',
            allow: ['/special/'],
            disallow: [],
          },
        ],
      });

      expect(manager.isUrlAllowed('https://example.com/special/page', '*')).toBe(false);
      expect(manager.isUrlAllowed('https://example.com/special/page', 'Googlebot')).toBe(true);
      expect(manager.isUrlAllowed('https://example.com/special/page', 'OtherBot')).toBe(false);
    });

    it('should fallback to wildcard rules for unknown user agent', () => {
      const manager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: ['/admin/'],
          },
          {
            userAgent: 'Googlebot',
            allow: ['/admin/'],
            disallow: [],
          },
        ],
      });

      expect(manager.isUrlAllowed('https://example.com/admin/page', 'UnknownBot')).toBe(false);
    });

    it('should handle path matching with wildcards', () => {
      const manager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: ['/admin/*', '/api/*/private'],
          },
        ],
      });

      expect(manager.isUrlAllowed('https://example.com/admin/dashboard')).toBe(false);
      expect(manager.isUrlAllowed('https://example.com/admin/settings/profile')).toBe(false);
      expect(manager.isUrlAllowed('https://example.com/api/v1/private/data')).toBe(false);
      expect(manager.isUrlAllowed('https://example.com/api/v1/public/data')).toBe(true);
    });

    it('should handle root path special case', () => {
      const manager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: [],
          },
        ],
      });

      expect(manager.isUrlAllowed('https://example.com/')).toBe(true);
      expect(manager.isUrlAllowed('https://example.com/page')).toBe(true);
    });

    it('should handle empty pattern', () => {
      const manager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: [''],
          },
        ],
      });

      expect(manager.isUrlAllowed('https://example.com/page')).toBe(true);
    });

    it('should handle invalid URLs gracefully', () => {
      const manager = new RobotsTxtManager({
        userAgentRules: [
          {
            userAgent: '*',
            allow: ['/'],
            disallow: ['/admin/'],
          },
        ],
      });

      expect(() => {
        manager.isUrlAllowed('not-a-valid-url');
      }).toThrow();
    });
  });
});

describe('Utility Functions', () => {
  describe('createRobotsTxtManager', () => {
    it('should create RobotsTxtManager instance', () => {
      const manager = createRobotsTxtManager({
        host: 'example.com',
      });

      expect(manager).toBeInstanceOf(RobotsTxtManager);
    });

    it('should create manager with default options when none provided', () => {
      const manager = createRobotsTxtManager();
      const policy = manager.getPolicy();

      expect(policy.userAgentRules).toHaveLength(1);
      expect(policy.userAgentRules[0].userAgent).toBe('*');
    });
  });

  describe('generateRobotsTxt', () => {
    it('should generate robots.txt using options', () => {
      const options: RobotsTxtOptions = {
        userAgentRules: [
          {
            userAgent: 'Googlebot',
            allow: ['/google/'],
            disallow: ['/no-google/'],
          },
        ],
        host: 'example.com',
      };

      const robotsTxt = generateRobotsTxt(options);

      expect(robotsTxt).toContain('User-agent: Googlebot');
      expect(robotsTxt).toContain('Allow: /google/');
      expect(robotsTxt).toContain('Disallow: /no-google/');
      expect(robotsTxt).toContain('Host: example.com');
    });

    it('should generate default robots.txt when no options provided', () => {
      const robotsTxt = generateRobotsTxt();

      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Allow: /');
      expect(robotsTxt).toContain('Disallow: /admin/');
      expect(robotsTxt).toContain('Disallow: /api/');
    });
  });

  describe('validateRobotsTxt', () => {
    it('should validate robots.txt content', () => {
      const content = `User-agent: *
Allow: /
Disallow: /admin/`;

      const result = validateRobotsTxt(content);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect validation errors', () => {
      const content = `User-agent: *
Allow: /
Crawl-delay: invalid`;

      const result = validateRobotsTxt(content);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid Crawl-delay value');
    });
  });

  describe('createDefaultRobotsTxt', () => {
    it('should create default robots.txt for domain', () => {
      const robotsTxt = createDefaultRobotsTxt('example.com');

      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Allow: /');
      expect(robotsTxt).toContain('Disallow: /admin/');
      expect(robotsTxt).toContain('Disallow: /api/');
      expect(robotsTxt).toContain('Disallow: /private/');
      expect(robotsTxt).toContain('Disallow: /test/');
      expect(robotsTxt).toContain('Disallow: /dev/');
      expect(robotsTxt).toContain('Disallow: /temp/');
      expect(robotsTxt).toContain('Disallow: /cache/');
      expect(robotsTxt).toContain('Disallow: /_next/');
      expect(robotsTxt).toContain('Disallow: /.well-known/');
      expect(robotsTxt).toContain('Host: example.com');
    });

    it('should include sitemap when provided', () => {
      const robotsTxt = createDefaultRobotsTxt('example.com', 'https://example.com/sitemap.xml');

      expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap.xml');
    });

    it('should handle domain without sitemap', () => {
      const robotsTxt = createDefaultRobotsTxt('example.com');

      expect(robotsTxt).toContain('Host: example.com');
      expect(robotsTxt).not.toContain('Sitemap:');
    });
  });

  describe('createDevRobotsTxt', () => {
    it('should create development robots.txt', () => {
      const robotsTxt = createDevRobotsTxt();

      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Allow: /');
      expect(robotsTxt).toContain('Disallow: /');
      expect(robotsTxt).not.toContain('Sitemap:');
      expect(robotsTxt).not.toContain('Host:');
    });

    it('should disallow all crawling in development', () => {
      const robotsTxt = createDevRobotsTxt();

      // Should have both Allow and Disallow for root, which effectively disallows everything
      expect(robotsTxt).toContain('Allow: /');
      expect(robotsTxt).toContain('Disallow: /');
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complete e-commerce robots.txt setup', () => {
    const manager = new RobotsTxtManager({
      userAgentRules: [
        {
          userAgent: '*',
          allow: ['/'],
          disallow: [
            '/admin/',
            '/api/',
            '/checkout/',
            '/account/',
            '/wishlist/',
            '/compare/',
          ],
        },
        {
          userAgent: 'Googlebot',
          allow: ['/products/', '/categories/', '/blog/'],
          disallow: ['/admin/', '/api/'],
          crawlDelay: 2,
        },
        {
          userAgent: 'Bingbot',
          allow: ['/products/', '/categories/'],
          disallow: ['/admin/', '/api/', '/blog/'],
          crawlDelay: 3,
        },
      ],
      sitemaps: [
        'https://store.example.com/sitemap-products.xml',
        'https://store.example.com/sitemap-categories.xml',
        'https://store.example.com/sitemap-blog.xml',
      ],
      host: 'store.example.com',
      directives: {
        'Clean-param': 'utm_source&utm_medium&utm_campaign',
      },
    });

    const robotsTxt = manager.generateRobotsTxt();
    const validation = manager.validateRobotsTxt(robotsTxt);

    expect(validation.valid).toBe(true);
    expect(robotsTxt).toContain('User-agent: *');
    expect(robotsTxt).toContain('User-agent: Googlebot');
    expect(robotsTxt).toContain('User-agent: Bingbot');
    expect(robotsTxt).toContain('Disallow: /checkout/');
    expect(robotsTxt).toContain('Crawl-delay: 2');
    expect(robotsTxt).toContain('Crawl-delay: 3');
    expect(robotsTxt).toContain('Sitemap: https://store.example.com/sitemap-products.xml');
    expect(robotsTxt).toContain('Clean-param: utm_source&utm_medium&utm_campaign');

    // Test URL permissions
    expect(manager.isUrlAllowed('https://store.example.com/products/laptop')).toBe(true);
    expect(manager.isUrlAllowed('https://store.example.com/checkout/cart')).toBe(false);
    expect(manager.isUrlAllowed('https://store.example.com/blog/review', 'Googlebot')).toBe(true);
    expect(manager.isUrlAllowed('https://store.example.com/blog/review', 'Bingbot')).toBe(false);
  });

  it('should handle news website robots.txt configuration', () => {
    const manager = new RobotsTxtManager({
      userAgentRules: [
        {
          userAgent: '*',
          allow: ['/'],
          disallow: [
            '/admin/',
            '/api/',
            '/drafts/',
            '/internal/',
            '/preview/',
          ],
        },
        {
          userAgent: 'Googlebot',
          allow: ['/news/', '/articles/', '/author/'],
          disallow: ['/admin/', '/drafts/'],
          crawlDelay: 1,
        },
        {
          userAgent: 'Googlebot-News',
          allow: ['/news/', '/articles/'],
          disallow: ['/admin/', '/author/', '/internal/'],
          crawlDelay: 0.5,
        },
      ],
      sitemaps: [
        'https://news.example.com/sitemap-news.xml',
        'https://news.example.com/sitemap-articles.xml',
      ],
      host: 'news.example.com',
    });

    const robotsTxt = manager.generateRobotsTxt();

    expect(robotsTxt).toContain('User-agent: Googlebot-News');
    expect(robotsTxt).toContain('Crawl-delay: 0.5');
    expect(robotsTxt).toContain('Sitemap: https://news.example.com/sitemap-news.xml');

    // Test news-specific permissions
    expect(manager.isUrlAllowed('https://news.example.com/news/breaking-story', 'Googlebot-News')).toBe(true);
    expect(manager.isUrlAllowed('https://news.example.com/author/john-doe', 'Googlebot-News')).toBe(false);
    expect(manager.isUrlAllowed('https://news.example.com/draft/article-preview', 'Googlebot-News')).toBe(false);
    expect(manager.isUrlAllowed('https://news.example.com/author/john-doe', 'Googlebot')).toBe(true);
  });

  it('should handle multilingual website robots.txt', () => {
    const manager = new RobotsTxtManager({
      userAgentRules: [
        {
          userAgent: '*',
          allow: ['/'],
          disallow: [
            '/admin/',
            '/api/',
            '/locale/',
            '/_next/',
            '/.well-known/',
          ],
        },
      ],
      sitemaps: [
        'https://example.com/sitemap-en.xml',
        'https://example.com/sitemap-es.xml',
        'https://example.com/sitemap-fr.xml',
        'https://example.com/sitemap-index.xml',
      ],
      host: 'example.com',
      directives: {
        'Clean-param': 'lang&utm_source',
      },
    });

    const robotsTxt = manager.generateRobotsTxt();
    const validation = manager.validateRobotsTxt(robotsTxt);

    expect(validation.valid).toBe(true);
    expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap-en.xml');
    expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap-es.xml');
    expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap-fr.xml');
    expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap-index.xml');

    // Test URL permissions
    expect(manager.isUrlAllowed('https://example.com/en/home')).toBe(true);
    expect(manager.isUrlAllowed('https://example.com/es/inicio')).toBe(true);
    expect(manager.isUrlAllowed('https://example.com/fr/accueil')).toBe(true);
    expect(manager.isUrlAllowed('https://example.com/admin/dashboard')).toBe(false);
    expect(manager.isUrlAllowed('https://example.com/_next/static')).toBe(false);
  });

  it('should handle API-first application robots.txt', () => {
    const manager = new RobotsTxtManager({
      userAgentRules: [
        {
          userAgent: '*',
          allow: ['/api/docs', '/api/health'],
          disallow: ['/api/', '/admin/', '/internal/'],
        },
        {
          userAgent: 'Googlebot',
          allow: ['/api/docs', '/blog/', '/about'],
          disallow: ['/api/v1/', '/api/v2/', '/admin/'],
          crawlDelay: 1,
        },
      ],
      sitemaps: [
        'https://api.example.com/sitemap-api.xml',
        'https://api.example.com/sitemap-docs.xml',
      ],
      host: 'api.example.com',
    });

    const robotsTxt = manager.generateRobotsTxt();

    expect(robotsTxt).toContain('Allow: /api/docs');
    expect(robotsTxt).toContain('Allow: /api/health');
    expect(robotsTxt).toContain('Disallow: /api/');

    // Test API-specific permissions
    expect(manager.isUrlAllowed('https://api.example.com/api/docs')).toBe(true);
    expect(manager.isUrlAllowed('https://api.example.com/api/health')).toBe(true);
    expect(manager.isUrlAllowed('https://api.example.com/api/v1/users')).toBe(false);
    expect(manager.isUrlAllowed('https://api.example.com/blog/article', 'Googlebot')).toBe(true);
    expect(manager.isUrlAllowed('https://api.example.com/api/v1/users', 'Googlebot')).toBe(false);
  });

  it('should handle complex wildcard pattern matching', () => {
    const manager = new RobotsTxtManager({
      userAgentRules: [
        {
          userAgent: '*',
          allow: ['/public/', '/images/', '/css/', '/js/'],
          disallow: [
            '/admin/*',
            '/api/*/private/*',
            '/user/*/profile/*',
            '/download/*.pdf',
            '/temp/*',
          ],
        },
      ],
    });

    // Test various wildcard patterns
    expect(manager.isUrlAllowed('https://example.com/public/page')).toBe(true);
    expect(manager.isUrlAllowed('https://example.com/images/logo.png')).toBe(true);
    expect(manager.isUrlAllowed('https://example.com/admin/dashboard')).toBe(false);
    expect(manager.isUrlAllowed('https://example.com/admin/settings/profile')).toBe(false);
    expect(manager.isUrlAllowed('https://example.com/api/v1/private/data')).toBe(false);
    expect(manager.isUrlAllowed('https://example.com/api/v2/private/secret')).toBe(false);
    expect(manager.isUrlAllowed('https://example.com/api/v1/public/data')).toBe(true);
    expect(manager.isUrlAllowed('https://example.com/user/123/profile/settings')).toBe(false);
    expect(manager.isUrlAllowed('https://example.com/user/123/public/info')).toBe(true);
    expect(manager.isUrlAllowed('https://example.com/download/document.pdf')).toBe(false);
    expect(manager.isUrlAllowed('https://example.com/download/image.jpg')).toBe(true);
    expect(manager.isUrlAllowed('https://example.com/temp/cache/file')).toBe(false);
  });
});
