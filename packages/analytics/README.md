# @repo/analytics

Privacy-first analytics infrastructure for multi-provider measurement in 2026.

## Overview

This package provides shared measurement foundations with:

- **Multi-provider dispatch**: GA4 Measurement Protocol, Meta Conversions API, PostHog
- **Consent-aware instrumentation**: GDPR/CCPA compliant tracking
- **Server-first conversion tracking**: Reliable measurement that bypasses ad blockers
- **Framework adapters**: Seamless integration with Astro and Next.js
- **Three-surface analytics**: marketing_site, product_app, trusted_server

## Installation

```bash
pnpm add @repo/analytics
```

## Quick Start

```typescript
import { createAnalytics } from '@repo/analytics'

// Initialize analytics
const analytics = createAnalytics({
  providers: {
    ga4: {
      measurementId: 'G-XXXXXXXXXX',
      apiSecret: 'your-api-secret'
    },
    meta: {
      pixelId: 'your-pixel-id',
      accessToken: 'your-access-token'
    },
    posthog: {
      apiKey: 'your-posthog-api-key'
    }
  },
  defaultSurface: 'marketing_site',
  consentMode: 'strict',
  serverSide: true,
  debug: process.env.NODE_ENV === 'development'
})

await analytics.initialize()

// Track a page view
await analytics.trackPageView({
  title: 'Home Page',
  location: 'https://example.com',
  language: 'en'
})

// Track a conversion
await analytics.trackConversion({
  type: 'lead',
  value: 100,
  currency: 'USD',
  transactionId: 'txn_123'
})
```

## Architecture

### Three-Surface Model

1. **marketing_site**: Public marketing websites and landing pages
2. **product_app**: Protected applications with authentication
3. **trusted_server**: Server-side conversion tracking

### Provider Support

- **GA4 Measurement Protocol**: Server-side Google Analytics 4
- **Meta Conversions API**: Server-side Facebook/Meta tracking
- **PostHog**: Product analytics and user behavior

### Consent Management

Built-in consent management supporting:

- Strict consent mode (opt-in only)
- Basic consent mode (opt-out allowed)
- Disabled consent mode (always track)

## API Reference

### Core Methods

#### `trackPageView(params)`
Track page navigation events.

```typescript
await analytics.trackPageView({
  title: string
  location: string
  referrer?: string
  language?: string
  userId?: string
  sessionId?: string
})
```

#### `trackEvent(name, params)`
Track custom events.

```typescript
await analytics.trackEvent('button_click', {
  properties: {
    button_id: 'cta-primary',
    page_section: 'hero'
  },
  userId?: string,
  sessionId?: string,
  provider?: 'ga4' | 'meta' | 'posthog'
})
```

#### `trackConversion(params)`
Track conversion events.

```typescript
await analytics.trackConversion({
  type: 'lead' | 'sale' | 'signup' | 'download'
  value?: number
  currency?: string
  transactionId?: string
  userId?: string
  sessionId?: string
})
```

#### `trackFormInteraction(params)`
Track form interactions.

```typescript
await analytics.trackFormInteraction({
  formName: string
  action: 'start' | 'submit' | 'abandon' | 'error'
  fieldErrors?: string[]
  userId?: string
  sessionId?: string
})
```

### Consent Management

#### `getCurrentConsent()`
Get current consent state.

```typescript
const consent = analytics.getCurrentConsent()
// returns: 'granted' | 'denied' | 'unknown'
```

#### `setConsent(consent)`
Set consent state.

```typescript
analytics.setConsent('granted')
```

## Framework Integration

### Astro Integration

```typescript
import { createAdapter } from '@repo/analytics/adapters'
import { AnalyticsIntegration } from '@repo/analytics/adapters'

const adapter = createAdapter('astro')
const integration = new AnalyticsIntegration(adapter)

await integration.initialize()

// Track page views automatically
await integration.trackPageView({
  title: 'My Page',
  location: Astro.url.href
})
```

### Next.js Integration

```typescript
import { createAdapter } from '@repo/analytics/adapters'
import { AnalyticsIntegration } from '@repo/analytics/adapters'

const adapter = createAdapter('nextjs')
const integration = new AnalyticsIntegration(adapter)

await integration.initialize()

// Track events in React components
await integration.trackEvent({
  name: 'button_click',
  properties: { button_id: 'submit' }
})
```

## Event Registry

Standard events are pre-defined with validation schemas:

- `page_view`: Page navigation
- `user_engagement`: User interactions
- `conversion`: Conversion events
- `form_interaction`: Form usage
- `content_consumption`: Content engagement
- `navigation`: Navigation events
- `search`: Search queries
- `error`: Error tracking

### Custom Events

Register custom event schemas:

```typescript
import { eventRegistry } from '@repo/analytics/events'
import { z } from 'zod'

eventRegistry.registerCustomEvent('custom_event', z.object({
  custom_field: z.string(),
  numeric_value: z.number()
}))
```

## Server-Side Tracking

For trusted_server surface, use server-side conversion tracking:

```typescript
await analytics.trackServerConversion({
  eventName: 'purchase_completed',
  userId: 'user_123',
  value: 99.99,
  currency: 'USD',
  metadata: {
    product_id: 'prod_456',
    order_id: 'order_789'
  }
})
```

## Configuration

### AnalyticsConfig

```typescript
interface AnalyticsConfig {
  providers: {
    ga4?: {
      measurementId: string
      measurementSecret?: string
      apiSecret?: string
    }
    meta?: {
      pixelId: string
      accessToken?: string
    }
    posthog?: {
      apiKey: string
      host?: string
    }
  }
  defaultSurface: 'marketing_site' | 'product_app' | 'trusted_server'
  consentMode: 'strict' | 'basic' | 'disabled'
  serverSide: boolean
  debug: boolean
}
```

## Privacy & Compliance

- **GDPR Compliant**: Consent-aware tracking
- **CCPA Ready**: Opt-out mechanisms
- **Cookie-less**: Server-first measurement
- **Data Minimization**: Only collect necessary data

## Development

```bash
# Build
pnpm build

# Test
pnpm test

# Development mode
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## Architecture Principles

This package follows the monorepo architecture principles:

- **Shared foundations**: Provides cross-cutting analytics infrastructure
- **App-local composition**: Apps own final surface implementation
- **Privacy-first**: Consent-aware by default
- **Multi-provider**: Avoids vendor lock-in
- **Server-side**: Reliable measurement in 2026

## Related Packages

- `@repo/contracts`: Shared type definitions
- `@repo/env`: Environment configuration
- `@repo/seo-core`: SEO infrastructure

## Support

For questions and support, refer to the canonical documentation:

- [`docs/architecture/seo-analytics-observability.md`](../../docs/architecture/seo-analytics-observability.md)
- [`docs/architecture/packages.md`](../../docs/architecture/packages.md)
