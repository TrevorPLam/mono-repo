import type { 
  AnalyticsEvent, 
  AnalyticsConfig, 
  Provider, 
  Surface, 
  ConsentState,
  DispatchResult,
  ConsentManager
} from './types'
import { eventRegistry } from './events'
import { providerRegistry } from './providers'
import { createConsentManager } from './consent'

/**
 * Main Analytics orchestration class
 * Coordinates all analytics functionality with privacy-first approach
 */

export class Analytics {
  private config: AnalyticsConfig
  private consentManager: ConsentManager
  private isInitialized = false
  private eventQueue: AnalyticsEvent[] = []

  constructor(config: AnalyticsConfig) {
    this.config = config
    this.consentManager = createConsentManager(config.defaultSurface)
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Initialize all configured providers
      const providers: Provider[] = []
      
      if (this.config.providers.ga4) {
        providers.push('ga4')
        await providerRegistry.initializeProvider('ga4', this.config.providers)
      }
      
      if (this.config.providers.meta) {
        providers.push('meta')
        await providerRegistry.initializeProvider('meta', this.config.providers)
      }
      
      if (this.config.providers.posthog) {
        providers.push('posthog')
        await providerRegistry.initializeProvider('posthog', this.config.providers)
      }

      // Set up consent change listener
      this.consentManager.onConsentChange((consent) => {
        this.handleConsentChange(consent)
      })

      this.isInitialized = true

      // Process queued events
      await this.processEventQueue()

      if (this.config.debug) {
        console.log('Analytics initialized with providers:', providers)
      }
    } catch (error) {
      console.error('Failed to initialize analytics:', error)
      throw error
    }
  }

  // Track a page view
  async trackPageView(params: {
    title: string
    location: string
    referrer?: string
    language?: string
    userId?: string
    sessionId?: string
  }): Promise<DispatchResult[]> {
    const event = eventRegistry.createEvent({
      name: 'page_view',
      surface: this.config.defaultSurface,
      consent: this.consentManager.getCurrentConsent(),
      properties: {
        page_title: params.title,
        page_location: params.location,
        page_referrer: params.referrer,
        page_language: params.language
      },
      userId: params.userId,
      sessionId: params.sessionId
    })

    return this.dispatchEvent(event)
  }

  // Track a custom event
  async trackEvent(eventName: string, params?: {
    properties?: Record<string, unknown>
    value?: number
    currency?: string
    userId?: string
    sessionId?: string
    provider?: Provider
  }): Promise<DispatchResult[]> {
    const event = eventRegistry.createEvent({
      name: eventName,
      surface: this.config.defaultSurface,
      consent: this.consentManager.getCurrentConsent(),
      properties: params?.properties,
      value: params?.value,
      currency: params?.currency,
      userId: params?.userId,
      sessionId: params?.sessionId,
      provider: params?.provider
    })

    return this.dispatchEvent(event)
  }

  // Track a conversion event
  async trackConversion(params: {
    type: 'lead' | 'sale' | 'signup' | 'download'
    value?: number
    currency?: string
    transactionId?: string
    userId?: string
    sessionId?: string
  }): Promise<DispatchResult[]> {
    const event = eventRegistry.createEvent({
      name: 'conversion',
      surface: this.config.defaultSurface,
      consent: this.consentManager.getCurrentConsent(),
      properties: {
        conversion_type: params.type,
        transaction_id: params.transactionId
      },
      value: params.value,
      currency: params.currency,
      userId: params.userId,
      sessionId: params.sessionId
    })

    return this.dispatchEvent(event)
  }

  // Track a form interaction
  async trackFormInteraction(params: {
    formName: string
    action: 'start' | 'submit' | 'abandon' | 'error'
    fieldErrors?: string[]
    userId?: string
    sessionId?: string
  }): Promise<DispatchResult[]> {
    const event = eventRegistry.createEvent({
      name: 'form_interaction',
      surface: this.config.defaultSurface,
      consent: this.consentManager.getCurrentConsent(),
      properties: {
        form_name: params.formName,
        form_action: params.action,
        field_errors: params.fieldErrors
      },
      userId: params.userId,
      sessionId: params.sessionId
    })

    return this.dispatchEvent(event)
  }

  // Internal method to dispatch an event
  private async dispatchEvent(event: AnalyticsEvent): Promise<DispatchResult[]> {
    if (!this.isInitialized) {
      this.eventQueue.push(event)
      if (this.config.debug) {
        console.log('Event queued (not initialized):', event.name)
      }
      return []
    }

    // Check consent before tracking
    if (!this.canTrack(event.consent)) {
      if (this.config.debug) {
        console.log('Event blocked due to consent:', event.name)
      }
      return []
    }

    const results: DispatchResult[] = []

    // Dispatch to specific provider if specified
    if (event.provider) {
      const result = await providerRegistry.dispatchToProvider(event.provider, event)
      results.push(result)
    } else {
      // Dispatch to all configured providers
      const providers: Provider[] = []
      
      if (this.config.providers.ga4) providers.push('ga4')
      if (this.config.providers.meta) providers.push('meta')
      if (this.config.providers.posthog) providers.push('posthog')

      for (const provider of providers) {
        const result = await providerRegistry.dispatchToProvider(provider, event)
        results.push(result)
      }
    }

    if (this.config.debug) {
      const successCount = results.filter(r => r.success).length
      console.log(`Event '${event.name}' dispatched to ${successCount}/${results.length} providers`)
    }

    return results
  }

  // Check if tracking is allowed based on consent
  private canTrack(consent: ConsentState): boolean {
    switch (this.config.consentMode) {
      case 'strict':
        return consent === 'granted'
      case 'basic':
        return consent !== 'denied'
      case 'disabled':
        return true
      default:
        return false
    }
  }

  // Handle consent changes
  private handleConsentChange(consent: ConsentState): void {
    if (this.config.debug) {
      console.log('Consent changed to:', consent)
    }

    // If consent is granted, process queued events
    if (consent === 'granted') {
      this.processEventQueue()
    }
  }

  // Process queued events
  private async processEventQueue(): Promise<void> {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()
      if (event) {
        await this.dispatchEvent(event)
      }
    }
  }

  // Get current consent state
  getCurrentConsent(): ConsentState {
    return this.consentManager.getCurrentConsent()
  }

  // Set consent state
  setConsent(consent: ConsentState): void {
    this.consentManager.setConsent(consent)
  }

  // Get configuration
  getConfig(): AnalyticsConfig {
    return { ...this.config }
  }

  // Check if analytics is initialized
  isReady(): boolean {
    return this.isInitialized
  }

  // Get registered events list
  getRegisteredEvents(): string[] {
    return eventRegistry.listRegisteredEvents()
  }

  // Get available providers
  getAvailableProviders(): Provider[] {
    return providerRegistry.listProviders()
  }

  // Server-side conversion tracking (for trusted_server surface)
  async trackServerConversion(params: {
    eventName: string
    userId?: string
    value?: number
    currency?: string
    metadata?: Record<string, unknown>
  }): Promise<DispatchResult[]> {
    const event: AnalyticsEvent = {
      name: params.eventName,
      surface: 'trusted_server',
      consent: 'granted', // Server-side events are considered consented
      timestamp: new Date().toISOString(),
      userId: params.userId,
      properties: params.metadata,
      value: params.value,
      currency: params.currency
    }

    return this.dispatchEvent(event)
  }
}

// Factory function to create analytics instance
export function createAnalytics(config: AnalyticsConfig): Analytics {
  return new Analytics(config)
}

// Export types
export * from './types'
