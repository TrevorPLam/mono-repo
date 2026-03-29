# repo/docs/architecture/seo-analytics-observability.md

Status: Accepted  
Date: 2026-03-24

## Purpose

Define the architectural posture for SEO, analytics, and observability in this monorepo.

This document explains how these cross-cutting concerns should be structured across shared packages and apps, what responsibilities belong in the shared layer versus app-local implementation, and which assumptions are currently deferred.

It is the source of truth for SEO, analytics, and observability architecture, not an implementation runbook.

---

## Shared operational layer model

The current repo posture is:

- SEO, analytics, and observability are shared operational foundations
- shared packages provide policy, primitives, adapters, and infrastructure support
- apps remain responsible for app-local wiring and final surface composition
- public sites are the current primary consumers of these foundations
- shared operational consistency should not collapse app ownership or app-local variation

This model is optimized for:

- consistent cross-site foundations
- explicit package boundaries
- app-local control where surface needs differ
- reuse without over-centralization

---

## Why this model exists

This model exists to preserve:

- shared policy and implementation discipline for cross-cutting concerns
- cleaner app/package boundaries
- consistent foundations for public-site delivery
- tenant or site variation without rebuilding common infrastructure repeatedly
- a repo that can support future protected or internal apps without making them the default architecture now

SEO, analytics, and observability are important across multiple surfaces, but they should not become excuses to centralize app-specific page composition or runtime ownership.

---

## Layer responsibilities

### SEO layer

The SEO layer exists to provide shared search-facing policy and framework support.

It should cover concerns such as:

- canonical policy
- metadata normalization
- sitemap and robots posture
- structured-data support where justified
- domain-aware resolution rules
- framework adapters for supported app frameworks

The shared SEO layer should help apps produce correct, consistent SEO behavior without owning the app’s actual content model, route tree, or page composition.

### Analytics layer

The analytics layer exists to provide shared measurement foundations.

It should cover concerns such as:

- event contracts and naming discipline
- provider wiring strategy
- consent-aware browser instrumentation where applicable
- server-side measurement boundaries where appropriate
- tenant or site-aware configuration resolution
- testing and validation support for instrumentation

The shared analytics layer should make instrumentation more consistent and reliable without turning shared packages into site-specific tracking configuration warehouses.

### Observability layer

The observability layer exists to provide shared operational diagnostics foundations.

It should cover concerns such as:

- tracing bootstrap and propagation
- structured logging
- redaction posture
- shared telemetry configuration
- environment-sensitive export behavior
- operational error and runtime diagnostics support

The shared observability layer should improve runtime visibility and debugging without leaking into analytics or becoming a second app-behavior layer.

---

## Relationship to packages

This architecture is implemented through shared packages such as:

- `packages/seo-core`
- `packages/seo-astro`
- `packages/seo-next`
- `packages/analytics`
- `packages/observability`

These packages should provide shared policy, adapters, and infrastructure support.

They should not become the default home for:

- app-specific route ownership
- page-specific SEO composition
- site-specific content structures
- page-level analytics business decisions
- app-specific debugging hacks
- visible UI or app-surface composition

For broader shared-library boundary rules, see [`packages.md`](./packages.md).

---

## Relationship to apps

Apps consume these shared foundations and remain responsible for final app-local composition.

Apps should own things such as:

- page-specific metadata decisions within the shared SEO model
- app-local measurement choices at the surface layer
- app-local form and lead instrumentation usage
- app-local operational context and runtime assembly
- final routing and content structure that shared SEO utilities operate over

The boundary remains foundational:

- shared packages provide foundations
- apps assemble those foundations into real surfaces

Do not move app ownership into shared operational packages for convenience.

---

## SEO posture

The current SEO posture is:

- shared SEO policy should live centrally
- framework adapters should stay thin
- apps should remain responsible for their actual content and route surfaces
- canonical and sitemap behavior should be deliberate and domain-aware
- SEO should support public sites first without assuming one universal site architecture

For current public-site work, SEO should support:

- marketing pages
- service pages
- blog or resource content
- domain-correct canonicals
- lightweight structured-data support where appropriate
- search visibility without overcomplicating the authoring model

The shared SEO layer should improve correctness and consistency without forcing all sites into the same content architecture.

---

## Analytics posture

The current analytics posture is **shared foundation, app-local implementation**.

That means:

- event and measurement discipline should be centralized
- provider usage should be routed through shared package boundaries
- apps should not directly reinvent analytics foundations per site
- instrumentation decisions still need app-local context
- public-site analytics should remain aligned with consent, privacy, and operational clarity

For current public-site work, analytics should support concerns such as:

- pageview and engagement measurement
- form and lead-capture measurement
- campaign and attribution support where applicable
- lightweight site performance or behavior signals where justified
- future server-side measurement boundaries when implementation maturity requires them

Analytics should support business visibility without forcing every public site into a heavier product-analytics posture by default.

---

## Consent and privacy posture

Analytics and related browser-side measurement should respect consent and privacy posture.

That means:

- consent-aware instrumentation should be the default where relevant
- shared analytics boundaries should make compliant behavior easier to implement
- apps should not casually bypass shared consent or instrumentation rules
- privacy-sensitive handling belongs in deliberate boundaries, not scattered local hacks

Privacy and consent rules are cross-cutting operational constraints, not optional per-page preferences.

Detailed workflow and compliance procedures belong in operations docs.

---

## Observability posture

The current observability posture is **operational diagnostics first**.

That means:

- structured logs and tracing should support debugging and operational clarity
- observability should be redaction-aware
- shared exports and telemetry bootstrapping should be centralized where practical
- apps should gain diagnostics support from shared packages without losing app-local ownership

For current public-site work, observability should support:

- deploy/runtime debugging
- server-side error visibility
- operational tracing where applicable
- consistent logging posture
- enough diagnostics to support real client-facing delivery without forcing product-grade complexity everywhere

Observability should help operators understand behavior. It should not quietly become a second analytics system.

---

## Public-site posture

Public sites are the current primary consumers of this shared operational layer.

That means:

- SEO is immediately important and first-class
- analytics should support marketing and lead-generation use cases
- observability should support reliable public-site operations
- these foundations should serve public-site delivery without importing protected-app assumptions by default

Public-site work should use these shared layers deliberately, but should not become tightly coupled to product-app architecture that the repo has not justified yet.

For broader public-site posture, see [`public-sites.md`](./public-sites.md).

---

## Framework posture

Framework-specific support is valid when the adapter boundary is explicit and narrow.

That means:

- framework-agnostic policy should stay in framework-neutral packages where appropriate
- framework adapters may exist when there is a clear adapter role
- framework adapters should remain thin
- framework-specific support should not become a back door for app-specific runtime composition

This supports the current Astro-first public-site posture while still leaving room for justified future framework expansion.

---

## What should remain app-local

Even with strong shared foundations, these concerns should usually stay app-local:

- page-specific metadata choices
- page-level content structure
- route ownership
- content publishing structure
- site-specific campaign measurement decisions
- business-context interpretation of analytics data
- app-specific runtime debugging context

Shared packages can support these decisions, but should not swallow them.

---

## Alternatives considered

- **App-local SEO, analytics, and observability only** — rejected; loses shared discipline and repeats foundational work unnecessarily
- **One broad operational mega-layer with loose boundaries** — rejected; weakens ownership and encourages accidental coupling
- **Framework-specific logic mixed directly into app code everywhere** — rejected; repeats infrastructure and reduces consistency
- **Shared operational packages owning app-level content or routing concerns** — rejected; blurs package and app boundaries
- **Treating observability as interchangeable with analytics** — rejected; they serve different purposes and should remain distinct

---

## Trade-offs

This model makes some things easier:

- reusing cross-cutting operational foundations
- keeping SEO policy more consistent
- making analytics and observability setup more disciplined
- supporting public-site delivery with better operational structure
- guiding AI-assisted contributors toward clearer boundary decisions

It also makes some things harder:

- more discipline is required around app-local versus shared ownership
- some site-specific implementation detail still needs to be wired locally
- shared package APIs need restraint to avoid overgrowth
- operational maturity increases gradually rather than through one centralized all-in system

These trade-offs are intentional.

---

## What is deferred

The current architecture intentionally defers:

- product-app-first analytics posture across the repo
- heavy protected-app assumptions in public-site measurement
- overgrown framework-specific operational layers
- centralization of app-owned routing or content concerns into shared SEO packages
- treating observability as a universal business reporting layer
- speculative complexity beyond what real public-site delivery currently needs

Deferred, not default.

---

## Related docs

- [`overview.md`](./overview.md)
- [`apps.md`](./apps.md)
- [`packages.md`](./packages.md)
- [`public-sites.md`](./public-sites.md)
- [`design-system.md`](./design-system.md)
- [`testing.md`](./testing.md)
- [`deployment-security.md`](./deployment-security.md)
