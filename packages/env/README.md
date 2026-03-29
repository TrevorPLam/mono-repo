# @repo/env

Environment variable validation and typed access for the monorepo.

## Purpose

This package provides:
- Type-safe environment variable access
- Runtime validation of environment variables
- Centralized environment schema definition
- Development-time environment checking

## Usage

```typescript
import { env } from '@repo/env';

// Type-safe access with runtime validation
const databaseUrl = env.DATABASE_URL;
const nodeEnv = env.NODE_ENV;
```

## Environment Variables

### Core Variables
- `NODE_ENV` - Application environment (development, production, test)
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct database connection for migrations
- `SHADOW_DATABASE_URL` - Shadow database for testing

### Analytics Variables
- `GA4_MEASUREMENT_ID` - Google Analytics 4 measurement ID
- `GTM_ID` - Google Tag Manager container ID
- `META_PIXEL_ID` - Meta Pixel ID

### External Services
- `RESEND_API_KEY` - Email service API key
- `VERCEL_PROJECT_ID` - Vercel project identifier

## Development

Add new environment variables to `src/schema.ts` and they'll be automatically validated and typed.
