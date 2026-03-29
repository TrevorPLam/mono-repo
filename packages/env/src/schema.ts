import { z } from 'zod';

/**
 * Environment variable schema for the monorepo
 * 
 * This schema defines all environment variables used across the monorepo
 * with their types, validation rules, and default values where appropriate.
 */

const baseSchema = z.object({
  // Core application variables
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Database configuration
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  DIRECT_URL: z.string().url('DIRECT_URL must be a valid URL'),
  SHADOW_DATABASE_URL: z.string().url('SHADOW_DATABASE_URL must be a valid URL').optional(),
  TEST_DATABASE_URL: z.string().url('TEST_DATABASE_URL must be a valid URL').optional(),
  
  // Analytics configuration
  GA4_MEASUREMENT_ID: z.string().optional(),
  GTM_ID: z.string().optional(),
  META_PIXEL_ID: z.string().optional(),
  POSTHOG_API_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().url('POSTHOG_HOST must be a valid URL').optional(),
  
  // External services
  RESEND_API_KEY: z.string().optional(),
  VERCEL_PROJECT_ID: z.string().optional(),
  
  // Security
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters').optional(),
  ENCRYPTION_KEY: z.string().min(32, 'ENCRYPTION_KEY must be at least 32 characters').optional(),
  
  // Feature flags
  ENABLE_ANALYTICS: z.coerce.boolean().default(true),
  ENABLE_ERROR_REPORTING: z.coerce.boolean().default(true),
  ENABLE_PERFORMANCE_MONITORING: z.coerce.boolean().default(true),
  
  // Development
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  ENABLE_MOCK_DATA: z.coerce.boolean().default(false),
});

/**
 * Environment-specific schema variations
 */
const developmentSchema = baseSchema.extend({
  ENABLE_MOCK_DATA: z.coerce.boolean().default(true),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('debug'),
});

const productionSchema = baseSchema.extend({
  ENABLE_MOCK_DATA: z.coerce.boolean().default(false),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('warn'),
});

const testSchema = baseSchema.extend({
  DATABASE_URL: z.string().url(),
  TEST_DATABASE_URL: z.string().url(),
  ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  ENABLE_ERROR_REPORTING: z.coerce.boolean().default(false),
  ENABLE_PERFORMANCE_MONITORING: z.coerce.boolean().default(false),
});

/**
 * Get the appropriate schema based on NODE_ENV
 */
function getSchema() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  switch (nodeEnv) {
    case 'production':
      return productionSchema;
    case 'test':
      return testSchema;
    default:
      return developmentSchema;
  }
}

/**
 * The environment schema with conditional validation
 */
export const envSchema = getSchema();

/**
 * Type inference from the schema
 */
export type Env = z.infer<typeof envSchema>;
