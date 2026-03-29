import { envSchema, type Env } from './schema';

/**
 * Validated environment variables
 * 
 * This object provides type-safe access to environment variables
 * with runtime validation. Accessing undefined variables will throw
 * a descriptive error during application startup.
 */

let _env: Env | undefined;

/**
 * Get validated environment variables
 * 
 * Validates all environment variables against the schema and returns
 * a typed object. This should be called once during application startup.
 * 
 * @throws {Error} If environment variables are invalid
 */
export function getEnv(): Env {
  if (_env !== undefined) {
    return _env;
  }

  try {
    _env = envSchema.parse(process.env);
    return _env;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Environment validation failed: ${error.message}`);
    }
    throw new Error('Environment validation failed with unknown error');
  }
}

/**
 * Environment variables proxy
 * 
 * Provides direct access to validated environment variables.
 * The first access will trigger validation.
 */
export const env = new Proxy({} as Env, {
  get(_target, prop: keyof Env) {
    const env = getEnv();
    return env[prop];
  },
  
  has(_target, prop: keyof Env) {
    const env = getEnv();
    return prop in env;
  },
  
  ownKeys(_target) {
    const env = getEnv();
    return Object.keys(env) as (keyof Env)[];
  },
  
  getOwnPropertyDescriptor(_target, prop: keyof Env) {
    const env = getEnv();
    const descriptor = Object.getOwnPropertyDescriptor(env, prop);
    if (descriptor) {
      return descriptor;
    }
    return undefined;
  }
});

/**
 * Environment utilities
 */

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development';
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return env.NODE_ENV === 'production';
}

/**
 * Check if we're in test mode
 */
export function isTest(): boolean {
  return env.NODE_ENV === 'test';
}

/**
 * Get the current log level
 */
export function getLogLevel(): 'error' | 'warn' | 'info' | 'debug' {
  return env.LOG_LEVEL;
}

/**
 * Check if analytics are enabled
 */
export function isAnalyticsEnabled(): boolean {
  return env.ENABLE_ANALYTICS;
}

/**
 * Check if error reporting is enabled
 */
export function isErrorReportingEnabled(): boolean {
  return env.ENABLE_ERROR_REPORTING;
}

/**
 * Check if performance monitoring is enabled
 */
export function isPerformanceMonitoringEnabled(): boolean {
  return env.ENABLE_PERFORMANCE_MONITORING;
}

/**
 * Check if mock data is enabled (development only)
 */
export function isMockDataEnabled(): boolean {
  return env.ENABLE_MOCK_DATA;
}

/**
 * Get database configuration
 */
export function getDatabaseConfig() {
  return {
    url: env.DATABASE_URL,
    directUrl: env.DIRECT_URL,
    shadowUrl: env.SHADOW_DATABASE_URL,
    testUrl: env.TEST_DATABASE_URL,
  };
}

/**
 * Get analytics configuration
 */
export function getAnalyticsConfig() {
  return {
    ga4MeasurementId: env.GA4_MEASUREMENT_ID,
    gtmId: env.GTM_ID,
    metaPixelId: env.META_PIXEL_ID,
    posthogApiKey: env.POSTHOG_API_KEY,
    posthogHost: env.POSTHOG_HOST,
    enabled: env.ENABLE_ANALYTICS,
  };
}

/**
 * Validate environment at module load time
 * 
 * This ensures that invalid environment variables are caught
 * early in the application lifecycle.
 */
try {
  getEnv();
} catch (error) {
  // Log the error but don't throw to allow the application to start
  // in environments where environment variables might be set later
  console.error('Environment validation failed:', error);
}
