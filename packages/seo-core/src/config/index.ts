/**
 * SEO Configuration Management
 * 
 * Central configuration management for SEO settings
 */

import { z } from 'zod';
import type { SEOConfig, SEOPolicy } from '../types/index.js';

/**
 * SEO configuration schema
 */
export const SEOConfigSchema = z.object({
  domain: z.string().url(),
  defaultLocale: z.string().default('en-US'),
  policy: z.object({}).optional(),
  adapters: z.record(z.unknown()).optional(),
});

/**
 * SEO configuration manager class
 */
export class SEOConfigManager {
  private config: SEOConfig;

  constructor(config: SEOConfig) {
    const validatedConfig = SEOConfigSchema.parse(config);
    this.config = validatedConfig;
  }

  /**
   * Get current configuration
   */
  getConfig(): SEOConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<SEOConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Get domain
   */
  getDomain(): string {
    return this.config.domain;
  }

  /**
   * Get default locale
   */
  getDefaultLocale(): string {
    return this.config.defaultLocale || 'en-US';
  }

  /**
   * Get policy configuration
   */
  getPolicy(): Partial<SEOPolicy> | undefined {
    return this.config.policy;
  }

  /**
   * Update policy configuration
   */
  updatePolicy(policy: Partial<SEOPolicy>): void {
    this.config.policy = { ...this.config.policy, ...policy };
  }

  /**
   * Get framework adapter
   */
  getAdapter(framework: string): unknown {
    return this.config.adapters?.[framework];
  }

  /**
   * Set framework adapter
   */
  setAdapter(framework: string, adapter: unknown): void {
    if (!this.config.adapters) {
      this.config.adapters = {};
    }
    this.config.adapters[framework] = adapter;
  }
}

/**
 * Create SEO configuration manager
 */
export function createSEOConfigManager(config: SEOConfig): SEOConfigManager {
  return new SEOConfigManager(config);
}

/**
 * Create default SEO configuration
 */
export function createDefaultSEOConfig(domain: string): SEOConfig {
  return {
    domain,
    defaultLocale: 'en-US',
    policy: {},
    adapters: {},
  };
}

// Re-export SEOConfig type
export type { SEOConfig };
