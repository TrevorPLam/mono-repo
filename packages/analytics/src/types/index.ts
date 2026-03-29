import { z } from 'zod'

/**
 * Core analytics type definitions
 * Based on 2026 best practices for privacy-first, server-side analytics
 */

// Surface types for three-surface analytics model
export const SurfaceSchema = z.enum(['marketing_site', 'product_app', 'trusted_server'])
export type Surface = z.infer<typeof SurfaceSchema>

// Provider types for multi-provider dispatch
export const ProviderSchema = z.enum(['ga4', 'meta', 'posthog'])
export type Provider = z.infer<typeof ProviderSchema>

// Consent states for privacy-compliant tracking
export const ConsentStateSchema = z.enum(['granted', 'denied', 'unknown'])
export type ConsentState = z.infer<typeof ConsentStateSchema>

// Event validation schema
export const AnalyticsEventSchema = z.object({
  name: z.string().min(1).max(50),
  surface: SurfaceSchema,
  provider: ProviderSchema.optional(),
  consent: ConsentStateSchema,
  timestamp: z.string().datetime(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  properties: z.record(z.unknown()).optional(),
  value: z.number().optional(),
  currency: z.string().optional()
})
export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>

// Provider configuration
export const ProviderConfigSchema = z.object({
  ga4: z.object({
    measurementId: z.string(),
    measurementSecret: z.string().optional(),
    apiSecret: z.string().optional()
  }).optional(),
  meta: z.object({
    pixelId: z.string(),
    accessToken: z.string().optional()
  }).optional(),
  posthog: z.object({
    apiKey: z.string(),
    host: z.string().optional()
  }).optional()
})
export type ProviderConfig = z.infer<typeof ProviderConfigSchema>

// Analytics configuration
export const AnalyticsConfigSchema = z.object({
  providers: ProviderConfigSchema,
  defaultSurface: SurfaceSchema,
  consentMode: z.enum(['strict', 'basic', 'disabled']).default('strict'),
  serverSide: z.boolean().default(true),
  debug: z.boolean().default(false)
})
export type AnalyticsConfig = z.infer<typeof AnalyticsConfigSchema>

// Dispatch result
export interface DispatchResult {
  provider: Provider
  success: boolean
  error?: string
  response?: unknown
}

// Consent management interface
export interface ConsentManager {
  getCurrentConsent(): ConsentState
  setConsent(consent: ConsentState): void
  onConsentChange(callback: (consent: ConsentState) => void): void
}
