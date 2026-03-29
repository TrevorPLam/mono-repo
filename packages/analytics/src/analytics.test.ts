import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createAnalytics } from './analytics'
import { AnalyticsConfig } from './types'

// Mock fetch for testing
global.fetch = vi.fn()

// Set timeout for tests to prevent hanging
vi.setConfig({ testTimeout: 3000 })

describe('Analytics', () => {
  let analyticsConfig: AnalyticsConfig

  beforeEach(() => {
    vi.clearAllMocks()
    
    analyticsConfig = {
      providers: {
        ga4: {
          measurementId: 'G-TEST123456',
          apiSecret: 'test-secret'
        },
        meta: {
          pixelId: '1234567890',
          accessToken: 'test-token'
        },
        posthog: {
          apiKey: 'test-api-key',
          host: 'https://test.posthog.com'
        }
      },
      defaultSurface: 'marketing_site',
      consentMode: 'strict',
      serverSide: true,
      debug: false
    }

    // Mock successful fetch responses by default
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({})
    } as Response)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should create analytics instance', () => {
    const analytics = createAnalytics(analyticsConfig)
    expect(analytics).toBeDefined()
    expect(analytics.getConfig()).toEqual(analyticsConfig)
    expect(analytics.isReady()).toBe(false)
  })

  it('should manage consent state without initialization', () => {
    const analytics = createAnalytics(analyticsConfig)
    
    expect(analytics.getCurrentConsent()).toBe('unknown')
    
    analytics.setConsent('granted')
    expect(analytics.getCurrentConsent()).toBe('granted')
    
    analytics.setConsent('denied')
    expect(analytics.getCurrentConsent()).toBe('denied')
  })

  it('should queue events when not initialized', async () => {
    const analytics = createAnalytics(analyticsConfig)
    
    // Track event before initialization - should queue
    const results = await analytics.trackPageView({
      title: 'Test Page',
      location: 'https://example.com/test'
    })

    // Should resolve immediately with empty results since not initialized
    expect(results).toHaveLength(0)
  })

  it('should initialize successfully', async () => {
    const analytics = createAnalytics(analyticsConfig)
    
    await analytics.initialize()
    expect(analytics.isReady()).toBe(true)
  })

  it('should respect consent settings', async () => {
    const analytics = createAnalytics({
      ...analyticsConfig,
      consentMode: 'strict'
    })
    
    await analytics.initialize()
    
    // Test with denied consent
    analytics.setConsent('denied')
    
    const results = await analytics.trackPageView({
      title: 'Test Page',
      location: 'https://example.com/test'
    })

    expect(results).toHaveLength(0) // No events should be sent
  })

  it('should get registered events and providers', () => {
    const analytics = createAnalytics(analyticsConfig)
    
    const events = analytics.getRegisteredEvents()
    expect(events).toContain('page_view')
    expect(events).toContain('conversion')
    expect(events).toContain('form_interaction')
    
    const providers = analytics.getAvailableProviders()
    expect(providers).toContain('ga4')
    expect(providers).toContain('meta')
    expect(providers).toContain('posthog')
  })
})
