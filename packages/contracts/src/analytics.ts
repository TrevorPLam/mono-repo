import { z } from 'zod';

/**
 * Analytics event contracts and validation schemas
 * 
 * This module defines the canonical event schemas used across
 * the monorepo for analytics tracking and validation.
 */

// Base event structure
export const BaseEventSchema = z.object({
  eventId: z.string().uuid(),
  timestamp: z.string().datetime(),
  sessionId: z.string().optional(),
  userId: z.string().optional(),
  organizationId: z.string().optional(),
  surface: z.enum(['marketing_site', 'product_app', 'trusted_server']),
  version: z.string().default('1.0'),
});

// Page view events
export const PageViewEventSchema = BaseEventSchema.extend({
  eventType: z.literal('page_view'),
  properties: z.object({
    page: z.string(),
    title: z.string(),
    url: z.string().url(),
    referrer: z.string().url().optional(),
    userAgent: z.string().optional(),
    screenResolution: z.string().optional(),
    viewport: z.object({
      width: z.number(),
      height: z.number(),
    }).optional(),
  }),
});

// Conversion events
export const ConversionEventSchema = BaseEventSchema.extend({
  eventType: z.literal('conversion'),
  properties: z.object({
    conversionType: z.enum(['lead', 'sale', 'signup', 'download', 'contact']),
    value: z.number().optional(),
    currency: z.string().optional(),
    orderId: z.string().optional(),
    productId: z.string().optional(),
    quantity: z.number().optional(),
    metadata: z.record(z.unknown()).optional(),
  }),
});

// Form interaction events
export const FormInteractionEventSchema = BaseEventSchema.extend({
  eventType: z.literal('form_interaction'),
  properties: z.object({
    formId: z.string(),
    formName: z.string(),
    action: z.enum(['view', 'start', 'submit', 'abandon']),
    step: z.number().optional(),
    totalSteps: z.number().optional(),
    fields: z.array(z.string()).optional(),
    errors: z.array(z.string()).optional(),
  }),
});

// Content engagement events
export const ContentEngagementEventSchema = BaseEventSchema.extend({
  eventType: z.literal('content_engagement'),
  properties: z.object({
    contentType: z.enum(['article', 'video', 'case_study', 'whitepaper']),
    contentId: z.string(),
    action: z.enum(['view', 'click', 'share', 'download', 'bookmark']),
    duration: z.number().optional(),
    progress: z.number().min(0).max(1).optional(),
    source: z.string().optional(),
  }),
});

// Search events
export const SearchEventSchema = BaseEventSchema.extend({
  eventType: z.literal('search'),
  properties: z.object({
    query: z.string(),
    category: z.string().optional(),
    resultsCount: z.number().optional(),
    clickedResult: z.object({
      position: z.number(),
      title: z.string(),
      url: z.string().url(),
    }).optional(),
    filters: z.record(z.string()).optional(),
  }),
});

// Error events
export const ErrorEventSchema = BaseEventSchema.extend({
  eventType: z.literal('error'),
  properties: z.object({
    errorType: z.enum(['javascript', 'network', 'validation', 'server']),
    message: z.string(),
    stack: z.string().optional(),
    url: z.string().url(),
    line: z.number().optional(),
    column: z.number().optional(),
    context: z.record(z.unknown()).optional(),
  }),
});

// Performance events
export const PerformanceEventSchema = BaseEventSchema.extend({
  eventType: z.literal('performance'),
  properties: z.object({
    metric: z.enum(['FCP', 'LCP', 'CLS', 'INP', 'TTFB']),
    value: z.number(),
    target: z.string().optional(),
    rating: z.enum(['good', 'needs_improvement', 'poor']).optional(),
    navigationType: z.enum(['navigate', 'reload', 'back_forward']).optional(),
  }),
});

// Union of all event types
export const AnalyticsEventSchema = z.discriminatedUnion('eventType', [
  PageViewEventSchema,
  ConversionEventSchema,
  FormInteractionEventSchema,
  ContentEngagementEventSchema,
  SearchEventSchema,
  ErrorEventSchema,
  PerformanceEventSchema,
]);

// Type exports
export type BaseEvent = z.infer<typeof BaseEventSchema>;
export type PageViewEvent = z.infer<typeof PageViewEventSchema>;
export type ConversionEvent = z.infer<typeof ConversionEventSchema>;
export type FormInteractionEvent = z.infer<typeof FormInteractionEventSchema>;
export type ContentEngagementEvent = z.infer<typeof ContentEngagementEventSchema>;
export type SearchEvent = z.infer<typeof SearchEventSchema>;
export type ErrorEvent = z.infer<typeof ErrorEventSchema>;
export type PerformanceEvent = z.infer<typeof PerformanceEventSchema>;
export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

// Consent categories for GDPR compliance
export const ConsentCategorySchema = z.enum([
  'necessary',
  'analytics',
  'marketing',
  'personalization',
  'uncategorized',
]);

export type ConsentCategory = z.infer<typeof ConsentCategorySchema>;

// Analytics surface types
export const AnalyticsSurfaceSchema = z.enum([
  'marketing_site',
  'product_app', 
  'trusted_server',
]);

export type AnalyticsSurface = z.infer<typeof AnalyticsSurfaceSchema>;

// Provider configuration
export const ProviderConfigSchema = z.object({
  googleAnalytics: z.object({
    measurementId: z.string(),
    enabled: z.boolean(),
  }).optional(),
  googleTagManager: z.object({
    containerId: z.string(),
    enabled: z.boolean(),
  }).optional(),
  metaPixel: z.object({
    pixelId: z.string(),
    enabled: z.boolean(),
  }).optional(),
  posthog: z.object({
    apiKey: z.string(),
    host: z.string().url(),
    enabled: z.boolean(),
  }).optional(),
});

export type ProviderConfig = z.infer<typeof ProviderConfigSchema>;
