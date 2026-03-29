/**
 * @repo/analytics - Privacy-first analytics infrastructure
 * 
 * Provides shared measurement foundations with:
 * - Multi-provider dispatch (GA4, Meta, PostHog)
 * - Consent-aware instrumentation
 * - Server-first conversion tracking
 * - Framework adapters (Astro, Next.js)
 */

export * from './types'
export * from './events'
export * from './providers'
export * from './consent'
export * from './adapters'

// Main analytics orchestration
export { Analytics } from './analytics'
