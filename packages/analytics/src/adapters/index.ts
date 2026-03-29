import type { AnalyticsEvent, Surface, ConsentState } from '../types'

/**
 * Framework adapters for Astro and Next.js
 * Provides seamless integration with supported app frameworks
 */

// Base adapter interface
export interface FrameworkAdapter {
  readonly name: string
  readonly framework: 'astro' | 'nextjs'
  initialize(): Promise<void>
  trackPageView(params: PageViewParams): Promise<void>
  trackEvent(params: EventParams): Promise<void>
  getCurrentSurface(): Surface
  getUserId(): string | undefined
  getSessionId(): string | undefined
}

// Common parameter types
export interface PageViewParams {
  title: string
  location: string
  referrer?: string
  language?: string
}

export interface EventParams {
  name: string
  properties?: Record<string, unknown>
  value?: number
  currency?: string
}

// Astro Adapter
export class AstroAdapter implements FrameworkAdapter {
  readonly name = 'astro'
  readonly framework = 'astro' as const

  async initialize(): Promise<void> {
    // Astro-specific initialization
    // This would be called in an Astro middleware or integration
  }

  trackPageView(params: PageViewParams): Promise<void> {
    // Implementation for Astro page view tracking
    // This would integrate with Astro's routing system
    return Promise.resolve()
  }

  trackEvent(params: EventParams): Promise<void> {
    // Implementation for Astro event tracking
    return Promise.resolve()
  }

  getCurrentSurface(): Surface {
    // Astro apps are typically marketing sites
    return 'marketing_site'
  }

  getUserId(): string | undefined {
    // Get user ID from Astro session or context
    return undefined
  }

  getSessionId(): string | undefined {
    // Get session ID from Astro session
    return undefined
  }
}

// Next.js Adapter
export class NextjsAdapter implements FrameworkAdapter {
  readonly name = 'nextjs'
  readonly framework = 'nextjs' as const

  async initialize(): Promise<void> {
    // Next.js-specific initialization
    // This could integrate with Next.js analytics or middleware
  }

  trackPageView(params: PageViewParams): Promise<void> {
    // Implementation for Next.js page view tracking
    // This could integrate with Next.js router events
    return Promise.resolve()
  }

  trackEvent(params: EventParams): Promise<void> {
    // Implementation for Next.js event tracking
    return Promise.resolve()
  }

  getCurrentSurface(): Surface {
    // Next.js apps could be product apps or marketing sites
    // This logic could be based on environment or configuration
    return 'product_app'
  }

  getUserId(): string | undefined {
    // Get user ID from Next.js session or authentication
    return undefined
  }

  getSessionId(): string | undefined {
    // Get session ID from Next.js session
    return undefined
  }
}

// Adapter factory
export function createAdapter(framework: 'astro' | 'nextjs'): FrameworkAdapter {
  switch (framework) {
    case 'astro':
      return new AstroAdapter()
    case 'nextjs':
      return new NextjsAdapter()
    default:
      throw new Error(`Unsupported framework: ${framework}`)
  }
}

// Analytics integration helper
export class AnalyticsIntegration {
  private adapter: FrameworkAdapter
  private eventQueue: AnalyticsEvent[] = []
  private isInitialized = false

  constructor(adapter: FrameworkAdapter) {
    this.adapter = adapter
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    await this.adapter.initialize()
    this.isInitialized = true

    // Process any queued events
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()
      if (event) {
        // Dispatch the event through the main analytics system
        // This would connect to the main Analytics class
      }
    }
  }

  async trackPageView(params: PageViewParams): Promise<void> {
    if (!this.isInitialized) {
      // Queue the event for later processing
      const event: AnalyticsEvent = {
        name: 'page_view',
        surface: this.adapter.getCurrentSurface(),
        consent: 'unknown', // Would get from consent manager
        timestamp: new Date().toISOString(),
        userId: this.adapter.getUserId(),
        sessionId: this.adapter.getSessionId(),
        properties: {
          page_title: params.title,
          page_location: params.location,
          page_referrer: params.referrer,
          page_language: params.language
        }
      }
      this.eventQueue.push(event)
      return
    }

    await this.adapter.trackPageView(params)
  }

  async trackEvent(params: EventParams): Promise<void> {
    if (!this.isInitialized) {
      // Queue the event for later processing
      const event: AnalyticsEvent = {
        name: params.name,
        surface: this.adapter.getCurrentSurface(),
        consent: 'unknown', // Would get from consent manager
        timestamp: new Date().toISOString(),
        userId: this.adapter.getUserId(),
        sessionId: this.adapter.getSessionId(),
        properties: params.properties,
        value: params.value,
        currency: params.currency
      }
      this.eventQueue.push(event)
      return
    }

    await this.adapter.trackEvent(params)
  }

  getAdapter(): FrameworkAdapter {
    return this.adapter
  }

  isReady(): boolean {
    return this.isInitialized
  }
}

// Export types
export * from '../types'
