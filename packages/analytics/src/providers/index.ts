import type { AnalyticsEvent, Provider, ProviderConfig, DispatchResult } from '../types'

/**
 * Multi-provider analytics system
 * Supports GA4 Measurement Protocol, Meta Conversions API, and PostHog
 */

// Base provider interface
export interface AnalyticsProvider {
  readonly name: Provider
  initialize(config: ProviderConfig): Promise<void>
  dispatch(event: AnalyticsEvent): Promise<DispatchResult>
  validateConfig(config: ProviderConfig): boolean
}

// GA4 Measurement Protocol Provider
export class GA4Provider implements AnalyticsProvider {
  readonly name = 'ga4' as Provider
  private config?: ProviderConfig['ga4']

  async initialize(config: ProviderConfig): Promise<void> {
    if (!this.validateConfig(config)) {
      throw new Error('Invalid GA4 configuration')
    }
    this.config = config.ga4
  }

  validateConfig(config: ProviderConfig): boolean {
    return !!(config.ga4?.measurementId)
  }

  async dispatch(event: AnalyticsEvent): Promise<DispatchResult> {
    if (!this.config) {
      return {
        provider: this.name,
        success: false,
        error: 'Provider not initialized'
      }
    }

    try {
      // GA4 Measurement Protocol v2 implementation
      const payload = this.buildGA4Payload(event)
      const response = await this.sendToGA4(payload)
      
      return {
        provider: this.name,
        success: true,
        response
      }
    } catch (error) {
      return {
        provider: this.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private buildGA4Payload(event: AnalyticsEvent): Record<string, any> {
    const payload: Record<string, any> = {
      measurement_id: this.config!.measurementId,
      event_name: event.name,
      timestamp_micros: new Date(event.timestamp).getTime() * 1000, // Convert to microseconds
    }

    // Add user data if available
    if (event.userId) {
      payload.user_id = event.userId
    }

    if (event.sessionId) {
      payload.session_id = event.sessionId
    }

    // Add event parameters
    const params: Record<string, any> = {}
    
    if (event.properties) {
      Object.assign(params, event.properties)
    }

    if (event.value !== undefined) {
      params.value = event.value
    }

    if (event.currency) {
      params.currency = event.currency
    }

    // Add surface information
    params.surface = event.surface

    // Add consent information
    params.consent_state = event.consent

    if (Object.keys(params).length > 0) {
      payload.event_params = Object.entries(params).map(([key, value]) => ({
        name: key,
        value: value
      }))
    }

    return payload
  }

  private async sendToGA4(payload: Record<string, any>): Promise<any> {
    const url = 'https://www.google-analytics.com/mp/collect'
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add API secret if available (for server-side)
    if (this.config!.apiSecret) {
      headers['Authorization'] = `Bearer ${this.config!.apiSecret}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`GA4 API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}

// Meta Conversions API Provider
export class MetaProvider implements AnalyticsProvider {
  readonly name = 'meta' as Provider
  private config?: ProviderConfig['meta']

  async initialize(config: ProviderConfig): Promise<void> {
    if (!this.validateConfig(config)) {
      throw new Error('Invalid Meta configuration')
    }
    this.config = config.meta
  }

  validateConfig(config: ProviderConfig): boolean {
    return !!(config.meta?.pixelId)
  }

  async dispatch(event: AnalyticsEvent): Promise<DispatchResult> {
    if (!this.config) {
      return {
        provider: this.name,
        success: false,
        error: 'Provider not initialized'
      }
    }

    try {
      const payload = this.buildMetaPayload(event)
      const response = await this.sendToMeta(payload)
      
      return {
        provider: this.name,
        success: true,
        response
      }
    } catch (error) {
      return {
        provider: this.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private buildMetaPayload(event: AnalyticsEvent): Record<string, any> {
    const payload: Record<string, any> = {
      pixel_id: this.config!.pixelId,
      event_name: this.mapEventName(event.name),
      event_time: Math.floor(new Date(event.timestamp).getTime() / 1000),
      action_source: 'website'
    }

    // Add user data
    const userData: Record<string, any> = {}
    
    if (event.userId) {
      userData.external_id = event.userId
    }

    if (event.sessionId) {
      userData.client_user_agent = navigator.userAgent
      userData.client_ip_address = '{{client_ip_address}}' // Meta will replace this
    }

    if (Object.keys(userData).length > 0) {
      payload.user_data = userData
    }

    // Add custom data
    const customData: Record<string, any> = {}
    
    if (event.properties) {
      Object.assign(customData, event.properties)
    }

    if (event.value !== undefined) {
      customData.value = event.value
    }

    if (event.currency) {
      customData.currency = event.currency
    }

    customData.surface = event.surface

    if (Object.keys(customData).length > 0) {
      payload.custom_data = customData
    }

    return payload
  }

  private mapEventName(eventName: string): string {
    // Map standard events to Meta Conversions API event names
    const eventMapping: Record<string, string> = {
      'page_view': 'PageView',
      'conversion': 'Purchase',
      'form_interaction': 'Lead',
      'user_engagement': 'Engagement',
      'content_consumption': 'ViewContent',
      'search': 'Search'
    }

    return eventMapping[eventName] || 'CustomEvent'
  }

  private async sendToMeta(payload: Record<string, any>): Promise<any> {
    const url = 'https://graph.facebook.com/v19.0/conversions'
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add access token if available
    if (this.config!.accessToken) {
      headers['Authorization'] = `Bearer ${this.config!.accessToken}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Meta API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}

// PostHog Provider
export class PostHogProvider implements AnalyticsProvider {
  readonly name = 'posthog' as Provider
  private config?: ProviderConfig['posthog']

  async initialize(config: ProviderConfig): Promise<void> {
    if (!this.validateConfig(config)) {
      throw new Error('Invalid PostHog configuration')
    }
    this.config = config.posthog
  }

  validateConfig(config: ProviderConfig): boolean {
    return !!(config.posthog?.apiKey)
  }

  async dispatch(event: AnalyticsEvent): Promise<DispatchResult> {
    if (!this.config) {
      return {
        provider: this.name,
        success: false,
        error: 'Provider not initialized'
      }
    }

    try {
      const payload = this.buildPostHogPayload(event)
      const response = await this.sendToPostHog(payload)
      
      return {
        provider: this.name,
        success: true,
        response
      }
    } catch (error) {
      return {
        provider: this.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private buildPostHogPayload(event: AnalyticsEvent): Record<string, any> {
    const payload: Record<string, any> = {
      event: event.name,
      timestamp: new Date(event.timestamp).toISOString(),
      properties: {
        ...event.properties,
        surface: event.surface,
        consent_state: event.consent
      }
    }

    // Add user identifiers
    if (event.userId) {
      payload.distinct_id = event.userId
    }

    if (event.sessionId) {
      payload.properties.session_id = event.sessionId
    }

    // Add value and currency
    if (event.value !== undefined) {
      payload.properties.$value = event.value
    }

    if (event.currency) {
      payload.properties.$currency = event.currency
    }

    return payload
  }

  private async sendToPostHog(payload: Record<string, any>): Promise<any> {
    const host = this.config!.host || 'https://app.posthog.com'
    const url = `${host}/capture/`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        api_key: this.config!.apiKey,
        ...payload
      })
    })

    if (!response.ok) {
      throw new Error(`PostHog API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}

// Provider registry
export class ProviderRegistry {
  private providers: Map<Provider, AnalyticsProvider> = new Map()

  constructor() {
    // Register default providers
    this.providers.set('ga4', new GA4Provider())
    this.providers.set('meta', new MetaProvider())
    this.providers.set('posthog', new PostHogProvider())
  }

  registerProvider(provider: AnalyticsProvider): void {
    this.providers.set(provider.name, provider)
  }

  getProvider(name: Provider): AnalyticsProvider | undefined {
    return this.providers.get(name)
  }

  listProviders(): Provider[] {
    return Array.from(this.providers.keys())
  }

  async initializeProvider(name: Provider, config: ProviderConfig): Promise<void> {
    const provider = this.getProvider(name)
    if (!provider) {
      throw new Error(`Provider '${name}' not found`)
    }

    await provider.initialize(config)
  }

  async dispatchToProvider(name: Provider, event: AnalyticsEvent): Promise<DispatchResult> {
    const provider = this.getProvider(name)
    if (!provider) {
      return {
        provider: name,
        success: false,
        error: `Provider '${name}' not found`
      }
    }

    return provider.dispatch(event)
  }
}

// Export singleton instance
export const providerRegistry = new ProviderRegistry()

// Export types
export * from '../types'
