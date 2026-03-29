/**
 * SEO Configuration Manager Tests
 * 
 * Comprehensive test suite for SEO configuration management covering:
 * - Configuration creation and validation
 * - Configuration updates and management
 * - Policy configuration handling
 * - Framework adapter management
 * - Default configuration generation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  SEOConfigManager,
  createSEOConfigManager,
  createDefaultSEOConfig,
  SEOConfigSchema,
} from '../../src/config/index.js';
import type { SEOConfig, SEOPolicy } from '../../src/types/index.js';

describe('SEOConfigManager', () => {
  let configManager: SEOConfigManager;
  let defaultConfig: SEOConfig;

  beforeEach(() => {
    defaultConfig = {
      domain: 'https://example.com',
      defaultLocale: 'en-US',
      policy: {
        global: {
          maxTitleLength: 60,
          maxDescriptionLength: 160,
        },
      },
      adapters: {
        astro: { someConfig: true },
        nextjs: { otherConfig: false },
      },
    };
    
    configManager = createSEOConfigManager(defaultConfig);
  });

  describe('Constructor and Configuration', () => {
    it('should create config manager with valid configuration', () => {
      expect(configManager).toBeInstanceOf(SEOConfigManager);
      
      const config = configManager.getConfig();
      expect(config.domain).toBe('https://example.com');
      expect(config.defaultLocale).toBe('en-US');
      expect(config.policy).toBeDefined();
      expect(config.adapters).toBeDefined();
    });

    it('should validate configuration with SEOConfigSchema', () => {
      const validConfig = {
        domain: 'https://test.com',
        defaultLocale: 'en-GB',
      };

      expect(() => new SEOConfigManager(validConfig)).not.toThrow();
    });

    it('should reject invalid configuration', () => {
      const invalidConfigs = [
        { domain: 'not-a-url' }, // Invalid URL
        { domain: 123 }, // Wrong type
        {}, // Missing required domain
      ];

      invalidConfigs.forEach(config => {
        expect(() => new SEOConfigManager(config as any)).toThrow();
      });
    });

    it('should use default values for optional fields', () => {
      const minimalConfig = { domain: 'https://minimal.com' };
      const minimalManager = new SEOConfigManager(minimalConfig);
      
      const config = minimalManager.getConfig();
      expect(config.defaultLocale).toBe('en-US');
      expect(config.policy).toBeUndefined();
      expect(config.adapters).toBeUndefined();
    });
  });

  describe('Configuration Management', () => {
    it('should get current configuration', () => {
      const config = configManager.getConfig();
      
      expect(config).toEqual(defaultConfig);
      expect(config).not.toBe(defaultConfig); // Should be a copy
    });

    it('should update configuration', () => {
      const updates: Partial<SEOConfig> = {
        defaultLocale: 'fr-FR',
        policy: {
          global: {
            titleTemplate: '%s | French Site',
          },
        },
      };

      configManager.updateConfig(updates);
      
      const config = configManager.getConfig();
      expect(config.domain).toBe('https://example.com'); // Unchanged
      expect(config.defaultLocale).toBe('fr-FR'); // Updated
      expect(config.policy?.global?.titleTemplate).toBe('%s | French Site'); // Updated
    });

    it('should merge updates with existing configuration', () => {
      const updates = {
        defaultLocale: 'de-DE',
        adapters: {
          vue: { vueConfig: true },
        },
      };

      configManager.updateConfig(updates);
      
      const config = configManager.getConfig();
      expect(config.domain).toBe('https://example.com');
      expect(config.defaultLocale).toBe('de-DE');
      expect(config.adapters?.astro).toBeDefined(); // Original adapter preserved
      expect(config.adapters?.vue).toBeDefined(); // New adapter added
    });

    it('should handle empty updates', () => {
      const originalConfig = configManager.getConfig();
      
      configManager.updateConfig({});
      
      const config = configManager.getConfig();
      expect(config).toEqual(originalConfig);
    });
  });

  describe('Domain Management', () => {
    it('should get domain', () => {
      expect(configManager.getDomain()).toBe('https://example.com');
    });

    it('should return domain after updates', () => {
      configManager.updateConfig({ domain: 'https://updated.com' });
      
      expect(configManager.getDomain()).toBe('https://updated.com');
    });
  });

  describe('Locale Management', () => {
    it('should get default locale', () => {
      expect(configManager.getDefaultLocale()).toBe('en-US');
    });

    it('should return fallback locale when not set', () => {
      const minimalManager = new SEOConfigManager({ domain: 'https://test.com' });
      
      expect(minimalManager.getDefaultLocale()).toBe('en-US');
    });

    it('should return updated locale', () => {
      configManager.updateConfig({ defaultLocale: 'es-ES' });
      
      expect(configManager.getDefaultLocale()).toBe('es-ES');
    });
  });

  describe('Policy Configuration', () => {
    it('should get policy configuration', () => {
      const policy = configManager.getPolicy();
      
      expect(policy).toBeDefined();
      expect(policy?.global?.maxTitleLength).toBe(60);
    });

    it('should return undefined when no policy set', () => {
      const minimalManager = new SEOConfigManager({ domain: 'https://test.com' });
      
      expect(minimalManager.getPolicy()).toBeUndefined();
    });

    it('should update policy configuration', () => {
      const policyUpdate: Partial<SEOPolicy> = {
        global: {
          maxTitleLength: 70,
          enforceTrailingSlash: true,
        },
        canonical: {
          baseDomain: 'https://example.com',
          enforceHttps: true,
        },
      };

      configManager.updatePolicy(policyUpdate);
      
      const policy = configManager.getPolicy();
      expect(policy?.global?.maxTitleLength).toBe(70);
      expect(policy?.global?.enforceTrailingSlash).toBe(true);
      expect(policy?.canonical?.baseDomain).toBe('https://example.com');
    });

    it('should merge policy updates with existing policy', () => {
      configManager.updatePolicy({
        canonical: {
          baseDomain: 'https://canonical.com',
        },
      });

      const policy = configManager.getPolicy();
      expect(policy?.global?.maxTitleLength).toBe(60); // Original preserved
      expect(policy?.canonical?.baseDomain).toBe('https://canonical.com'); // New added
    });

    it('should handle empty policy updates', () => {
      const originalPolicy = configManager.getPolicy();
      
      configManager.updatePolicy({});
      
      const policy = configManager.getPolicy();
      expect(policy).toEqual(originalPolicy);
    });
  });

  describe('Framework Adapter Management', () => {
    it('should get framework adapter', () => {
      const astroAdapter = configManager.getAdapter('astro');
      const nextjsAdapter = configManager.getAdapter('nextjs');
      const unknownAdapter = configManager.getAdapter('unknown');

      expect(astroAdapter).toEqual({ someConfig: true });
      expect(nextjsAdapter).toEqual({ otherConfig: false });
      expect(unknownAdapter).toBeUndefined();
    });

    it('should return undefined for adapter when none exist', () => {
      const minimalManager = new SEOConfigManager({ domain: 'https://test.com' });
      
      expect(minimalManager.getAdapter('astro')).toBeUndefined();
    });

    it('should set framework adapter', () => {
      const newAdapter = { config: 'value', version: '1.0' };
      
      configManager.setAdapter('vue', newAdapter);
      
      const adapter = configManager.getAdapter('vue');
      expect(adapter).toEqual(newAdapter);
    });

    it('should create adapters object if it does not exist', () => {
      const minimalManager = new SEOConfigManager({ domain: 'https://test.com' });
      
      minimalManager.setAdapter('svelte', { svelteConfig: true });
      
      const adapter = minimalManager.getAdapter('svelte');
      expect(adapter).toEqual({ svelteConfig: true });
    });

    it('should overwrite existing adapter', () => {
      const originalAdapter = configManager.getAdapter('astro');
      expect(originalAdapter).toEqual({ someConfig: true });

      const newAdapter = { newConfig: 'updated' };
      configManager.setAdapter('astro', newAdapter);

      const updatedAdapter = configManager.getAdapter('astro');
      expect(updatedAdapter).toEqual(newAdapter);
    });

    it('should preserve other adapters when setting new one', () => {
      configManager.setAdapter('react', { reactConfig: true });
      
      const astroAdapter = configManager.getAdapter('astro');
      const nextjsAdapter = configManager.getAdapter('nextjs');
      const reactAdapter = configManager.getAdapter('react');

      expect(astroAdapter).toEqual({ someConfig: true });
      expect(nextjsAdapter).toEqual({ otherConfig: false });
      expect(reactAdapter).toEqual({ reactConfig: true });
    });
  });

  describe('Configuration Immutability', () => {
    it('should return copies of configuration', () => {
      const config1 = configManager.getConfig();
      const config2 = configManager.getConfig();
      
      expect(config1).toEqual(config2);
      expect(config1).not.toBe(config2); // Different objects
    });

    it('should not allow external mutation of returned config', () => {
      const config = configManager.getConfig();
      (config as any).domain = 'https://malicious.com';
      
      const freshConfig = configManager.getConfig();
      expect(freshConfig.domain).toBe('https://example.com');
    });

    it('should not allow external mutation of returned policy', () => {
      const policy = configManager.getPolicy();
      (policy as any).global = { maxTitleLength: 999 };
      
      const freshPolicy = configManager.getPolicy();
      expect(freshPolicy?.global?.maxTitleLength).toBe(60);
    });

    it('should not allow external mutation of returned adapters', () => {
      const adapters = configManager.getConfig().adapters;
      (adapters as any).malicious = 'value';
      
      const freshAdapters = configManager.getConfig().adapters;
      expect(freshAdapters?.malicious).toBeUndefined();
    });
  });
});

describe('SEOConfigSchema Validation', () => {
  it('should validate complete configuration', () => {
    const validConfig = {
      domain: 'https://example.com',
      defaultLocale: 'en-US',
      policy: {
        global: {
          maxTitleLength: 60,
        },
      },
      adapters: {
        astro: { config: true },
      },
    };

    expect(() => SEOConfigSchema.parse(validConfig)).not.toThrow();
  });

  it('should validate minimal configuration', () => {
    const minimalConfig = {
      domain: 'https://minimal.com',
    };

    expect(() => SEOConfigSchema.parse(minimalConfig)).not.toThrow();
  });

  it('should use default values', () => {
    const config = SEOConfigSchema.parse({
      domain: 'https://example.com',
    });

    expect(config.defaultLocale).toBe('en-US');
    expect(config.policy).toBeUndefined();
    expect(config.adapters).toBeUndefined();
  });

  it('should reject invalid domain', () => {
    const invalidConfigs = [
      { domain: 'not-a-url' },
      { domain: 'ftp://example.com' },
      { domain: '' },
      { domain: null },
      { domain: undefined },
    ];

    invalidConfigs.forEach(config => {
      expect(() => SEOConfigSchema.parse(config)).toThrow();
    });
  });

  it('should reject invalid locale types', () => {
    const invalidConfigs = [
      { domain: 'https://example.com', defaultLocale: 123 },
      { domain: 'https://example.com', defaultLocale: {} },
      { domain: 'https://example.com', defaultLocale: [] },
    ];

    invalidConfigs.forEach(config => {
      expect(() => SEOConfigSchema.parse(config)).toThrow();
    });
  });

  it('should accept valid adapter configurations', () => {
    const configWithAdapters = {
      domain: 'https://example.com',
      adapters: {
        astro: { some: 'config' },
        nextjs: { other: 'config' },
        custom: { complex: { nested: 'value' } },
      },
    };

    expect(() => SEOConfigSchema.parse(configWithAdapters)).not.toThrow();
  });
});

describe('Factory Functions', () => {
  describe('createSEOConfigManager', () => {
    it('should create SEOConfigManager instance', () => {
      const config = { domain: 'https://factory.com' };
      const manager = createSEOConfigManager(config);
      
      expect(manager).toBeInstanceOf(SEOConfigManager);
      expect(manager.getDomain()).toBe('https://factory.com');
    });

    it('should validate configuration through factory', () => {
      const invalidConfig = { domain: 'invalid-url' };
      
      expect(() => createSEOConfigManager(invalidConfig as any)).toThrow();
    });
  });

  describe('createDefaultSEOConfig', () => {
    it('should create default configuration with domain', () => {
      const config = createDefaultSEOConfig('https://default.com');
      
      expect(config.domain).toBe('https://default.com');
      expect(config.defaultLocale).toBe('en-US');
      expect(config.policy).toEqual({});
      expect(config.adapters).toEqual({});
    });

    it('should handle different domains', () => {
      const domains = [
        'https://example.com',
        'https://subdomain.example.com',
        'https://another-site.org',
      ];

      domains.forEach(domain => {
        const config = createDefaultSEOConfig(domain);
        expect(config.domain).toBe(domain);
        expect(config.defaultLocale).toBe('en-US');
      });
    });

    it('should return immutable default objects', () => {
      const config1 = createDefaultSEOConfig('https://test.com');
      const config2 = createDefaultSEOConfig('https://test.com');
      
      expect(config1).toEqual(config2);
      expect(config1).not.toBe(config2);
      expect(config1.policy).not.toBe(config2.policy);
      expect(config1.adapters).not.toBe(config2.adapters);
    });
  });
});

describe('Edge Cases and Error Handling', () => {
  it('should handle null/undefined inputs gracefully', () => {
    expect(() => new SEOConfigManager(null as any)).toThrow();
    expect(() => new SEOConfigManager(undefined as any)).toThrow();
  });

  it('should handle configuration with only required fields', () => {
    const minimalConfig = { domain: 'https://minimal.com' };
    const manager = new SEOConfigManager(minimalConfig);
    
    expect(manager.getDomain()).toBe('https://minimal.com');
    expect(manager.getDefaultLocale()).toBe('en-US');
    expect(manager.getPolicy()).toBeUndefined();
    expect(manager.getAdapter('any')).toBeUndefined();
  });

  it('should handle complex nested adapter configurations', () => {
    const complexAdapters = {
      astro: {
        integration: {
          enabled: true,
          options: {
            optimize: true,
            minify: false,
          },
        },
        middleware: {
          authentication: false,
          analytics: true,
        },
      },
      nextjs: {
        server: {
          port: 3000,
          host: 'localhost',
        },
        client: {
          routing: 'app-router',
          styling: 'tailwind',
        },
      },
    };

    const config = {
      domain: 'https://complex.com',
      adapters: complexAdapters,
    };

    const manager = new SEOConfigManager(config);
    
    expect(manager.getAdapter('astro')).toEqual(complexAdapters.astro);
    expect(manager.getAdapter('nextjs')).toEqual(complexAdapters.nextjs);
  });

  it('should handle very long domain names', () => {
    const longDomain = 'https://' + 'a'.repeat(100) + '.com';
    const config = { domain: longDomain };
    
    expect(() => new SEOConfigManager(config)).not.toThrow();
  });

  it('should handle special characters in locale', () => {
    const specialLocales = [
      'en-US',
      'fr-FR',
      'de-DE',
      'es-ES',
      'pt-BR',
      'zh-CN',
      'ja-JP',
    ];

    specialLocales.forEach(locale => {
      const config = { domain: 'https://example.com', defaultLocale: locale };
      expect(() => new SEOConfigManager(config)).not.toThrow();
      
      const manager = new SEOConfigManager(config);
      expect(manager.getDefaultLocale()).toBe(locale);
    });
  });
});
