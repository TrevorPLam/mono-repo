import { z } from 'zod'
import type { AnalyticsEvent, Surface, Provider, ConsentState } from '../types'
import { AnalyticsEventSchema } from '../types'

/**
 * Event registry with validation
 * Centralizes event naming discipline and schema validation
 */

// Standard event categories for marketing analytics
export const EventCategorySchema = z.enum([
  'page_view',
  'user_engagement', 
  'conversion',
  'form_interaction',
  'content_consumption',
  'navigation',
  'search',
  'error'
])
export type EventCategory = z.infer<typeof EventCategorySchema>

// Predefined event schemas for consistency
export const StandardEvents = {
  page_view: z.object({
    page_title: z.string(),
    page_location: z.string().url(),
    page_referrer: z.string().url().optional(),
    page_language: z.string().optional()
  }),
  
  user_engagement: z.object({
    engagement_type: z.enum(['scroll', 'click', 'focus', 'hover']),
    target_element: z.string().optional(),
    engagement_value: z.number().optional()
  }),
  
  conversion: z.object({
    conversion_type: z.enum(['lead', 'sale', 'signup', 'download']),
    conversion_value: z.number().optional(),
    currency: z.string().optional(),
    transaction_id: z.string().optional()
  }),
  
  form_interaction: z.object({
    form_name: z.string(),
    form_action: z.enum(['start', 'submit', 'abandon', 'error']),
    field_errors: z.array(z.string()).optional()
  }),
  
  content_consumption: z.object({
    content_type: z.enum(['article', 'video', 'resource', 'case_study']),
    content_id: z.string().optional(),
    consumption_duration: z.number().optional(), // in seconds
    completion_rate: z.number().min(0).max(1).optional()
  }),
  
  navigation: z.object({
    navigation_type: z.enum(['menu', 'breadcrumb', 'pagination', 'search']),
    destination: z.string().optional(),
    source: z.string().optional()
  }),
  
  search: z.object({
    search_term: z.string(),
    search_results_count: z.number().optional(),
    search_category: z.string().optional()
  }),
  
  error: z.object({
    error_type: z.enum(['javascript', 'network', 'form_validation', 'server']),
    error_message: z.string().optional(),
    error_context: z.record(z.unknown()).optional()
  })
} as const

// Event registry class
export class EventRegistry {
  private static instance: EventRegistry
  private customEvents: Map<string, z.ZodSchema> = new Map()

  static getInstance(): EventRegistry {
    if (!EventRegistry.instance) {
      EventRegistry.instance = new EventRegistry()
    }
    return EventRegistry.instance
  }

  // Register a custom event schema
  registerCustomEvent(eventName: string, schema: z.ZodSchema): void {
    this.customEvents.set(eventName, schema)
  }

  // Validate an event against its schema
  validateEvent(event: Partial<AnalyticsEvent>): AnalyticsEvent {
    const eventName = event.name
    if (!eventName) {
      throw new Error('Event name is required')
    }

    // Check if it's a standard event
    const standardEventSchema = StandardEvents[eventName as keyof typeof StandardEvents]
    if (standardEventSchema) {
      const schema = AnalyticsEventSchema.extend({
        properties: standardEventSchema
      })
      return schema.parse(event)
    }

    // Check if it's a custom event
    const customEventSchema = this.customEvents.get(eventName)
    if (customEventSchema) {
      const schema = AnalyticsEventSchema.extend({
        properties: customEventSchema
      })
      return schema.parse(event)
    }

    // Fallback to basic validation for unknown events
    console.warn(`Unknown event '${eventName}', using basic validation`)
    return AnalyticsEventSchema.parse(event)
  }

  // Create a validated event
  createEvent(params: {
    name: string
    surface: Surface
    consent: ConsentState
    properties?: Record<string, unknown>
    userId?: string
    sessionId?: string
    value?: number
    currency?: string
    provider?: Provider
  }): AnalyticsEvent {
    return this.validateEvent({
      name: params.name,
      surface: params.surface,
      consent: params.consent,
      timestamp: new Date().toISOString(),
      userId: params.userId,
      sessionId: params.sessionId,
      properties: params.properties,
      value: params.value,
      currency: params.currency,
      provider: params.provider
    })
  }

  // List all registered events
  listRegisteredEvents(): string[] {
    const standardEvents = Object.keys(StandardEvents)
    const customEvents = Array.from(this.customEvents.keys())
    return [...standardEvents, ...customEvents]
  }
}

// Export singleton instance
export const eventRegistry = EventRegistry.getInstance()

// Export types
export * from '../types'
