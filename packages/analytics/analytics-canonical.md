# repo/analytics/analytics-canonical.md

packages/analytics/ — final source of truth

1. Purpose

packages/analytics is the shared analytics instrumentation package for the monorepo.

It owns the repo’s canonical analytics language and the runtime machinery required to emit analytics consistently across:
	•	public marketing sites
	•	multi-tenant client marketing sites
	•	future product apps
	•	trusted server conversion paths

It is the only package that should centralize:
	•	canonical analytics event names and registry metadata
	•	browser analytics facades
	•	consent-aware public tracking behavior
	•	GTM/data-layer interaction
	•	trusted server conversion capture
	•	GA4 Measurement Protocol dispatch
	•	Meta Conversions API dispatch
	•	optional PostHog browser/server dispatch for product apps
	•	framework-specific integration helpers for Astro and Next
	•	analytics-specific React hooks and provider wiring

It does not own:
	•	the source-of-truth business database
	•	dashboards or reporting
	•	warehouse transformations
	•	CRM routing
	•	queue orchestration
	•	product feature logic
	•	app DALs
	•	app-specific event vocabularies
	•	GTM container administration itself

The package exists to answer one question:

How do repo surfaces emit analytics consistently, safely, and provider-agnostically without every app reinventing instrumentation?

⸻

2. Package role in this repo

This repo is marketing-first, client-site-first, and AI-agent-built. That makes anti-drift boundaries more important than clever abstractions.

So packages/analytics is intentionally:
	•	marketing-heavy in v1
	•	server-conversion-aware from day one
	•	product-app-capable but not product-bloated
	•	strict about event vocabulary and provider boundaries
	•	framework-aware because Astro and Next integration are materially different
	•	tenant-aware because the repo is multi-tenant and domain-resolved

V1 priorities

In order:
	1.	apps/site-firm instrumentation
	2.	apps/site-platform instrumentation
	3.	trusted server lead/contact/booking conversion fan-out
	4.	apps/app-booking product/browser instrumentation
	5.	future product apps

That means the package must be excellent at:
	•	page views
	•	CTA clicks
	•	outbound/download/form events
	•	consent
	•	attribution capture
	•	GTM Web
	•	Google Tag Gateway config
	•	GA4 MP
	•	Meta CAPI
	•	server-first definitive conversions

And only structurally ready for broader product analytics.

⸻

3. Locked architectural decisions

These are fixed. They are not open options.

Surface model

There are exactly three analytics surfaces:
	•	marketing_site
	•	product_app
	•	trusted_server

Every event and runtime config path must declare its surface.

Provider model

Default provider behavior is fixed:
	•	marketing_site browser → GTM Web
	•	marketing_site trusted server → GA4 MP + Meta CAPI
	•	product_app browser → code-first analytics facade, PostHog-capable
	•	product_app trusted server → optional PostHog server adapter, off by default
	•	warehouse/reporting → out of scope for this package

Conversion model

All definitive business conversions are server-first.

Canonical trusted flow:
	1.	app validates the business action
	2.	app writes or queues the authoritative business fact
	3.	app calls analytics server capture helpers
	4.	this package normalizes and fans out to providers

Browser events may assist attribution or diagnostics, but are not the system of record.

Consent model

Consent is mandatory on public/marketing surfaces.

The package owns:
	•	canonical consent categories
	•	consent state shape
	•	provider consent mapping
	•	public-surface gating rules

Apps must not build provider-specific consent logic themselves.

Event naming model

All shared event names are registry-driven and canonical.

Apps do not invent shared event names locally.

Config model

Tenant/domain-aware analytics config resolves centrally in this package.

Apps pass in context; this package does not fetch tenant config from the database by itself.

Framework model

Astro and Next are both first-class, but different:
	•	Astro helpers only; no .astro files in this package
	•	Next may use TS/React helpers and components
	•	strict-CSP Next GTM path uses a shared nonce-aware wrapper path
	•	static Astro/public surfaces keep the lighter path

That split is deliberate because Astro treats normal scripts and is:inline scripts differently, and nonce-based CSP in Next has major rendering/caching implications.  

Pageview ownership model

This is fixed per surface:
	•	GTM-managed marketing sites → package-owned data-layer pageview path
	•	Next direct GoogleAnalytics path → provider auto pageview only if that app explicitly chooses that route
	•	product apps → package-owned pageview path
	•	no app may run provider auto-pageviews and package manual pageviews simultaneously

Next’s current docs explicitly say GA auto-tracks pageviews on history changes when Enhanced Measurement is enabled, so this must be controlled centrally.  

GTM security stance

Repo policy prefers:
	•	custom templates and template policies over broad allow/block dependence
	•	controlled data-layer shape
	•	first-party gateway capability
	•	CSP-aware deployment where needed

Google’s current GTM guidance recommends moving toward custom templates and template policies for improved security, while still supporting allow/block controls where necessary.  

PostHog stance

PostHog support exists, but is not the package’s primary v1 concern.

Defaults:
	•	browser adapter exists
	•	person_profiles: 'identified_only'
	•	no blanket autocapture assumption in package defaults
	•	server adapter exists for future use
	•	server adapter is off by default
	•	if server adapter is enabled in short-lived runtimes, it must flush/shutdown explicitly

That matches PostHog’s current docs on anonymous/identified behavior and Node shutdown in short-lived environments.  

⸻

4. Public package API

Only these public subpaths exist:
	•	@repo/analytics
	•	@repo/analytics/client
	•	@repo/analytics/server
	•	@repo/analytics/consent
	•	@repo/analytics/config
	•	@repo/analytics/react
	•	@repo/analytics/framework/astro
	•	@repo/analytics/framework/next
	•	@repo/analytics/testing

No app may deep-import from src/.

No app may import provider adapter internals directly.

No app may import internal/ or providers/ subfolders.

⸻

5. Dependency boundaries

Allowed imports

This package may import from:
	•	@repo/contracts
	•	@repo/env
	•	small runtime-safe utilities
	•	React only in React/Next surfaces
	•	approved vendor SDKs only inside provider adapters

Avoid by default

This package should avoid importing from:
	•	any app
	•	@repo/db for core logic
	•	@repo/auth
	•	@repo/ui
	•	@repo/observability as a hard dependency
	•	@repo/integrations-core unless a future adapter truly needs it

Reason

This package is infrastructure, not business logic, not auth logic, not UI logic, and not reporting logic.

⸻

6. Canonical directory tree

packages/analytics/
├─ package.json
├─ tsconfig.json
├─ tsup.config.ts
├─ vitest.config.ts
├─ README.md
├─ docs/
│  ├─ event-catalog.md
│  ├─ consent-policy.md
│  ├─ provider-matrix.md
│  ├─ gtm-security-policy.md
│  ├─ astro-integration.md
│  ├─ next-integration.md
│  └─ verification-playbook.md
├─ src/
│  ├─ index.ts
│  ├─ events/
│  │  ├─ index.ts
│  │  ├─ names.ts
│  │  ├─ categories.ts
│  │  ├─ surfaces.ts
│  │  ├─ trust.ts
│  │  ├─ privacy.ts
│  │  ├─ catalog.ts
│  │  ├─ marketing.ts
│  │  ├─ product.ts
│  │  ├─ conversions.ts
│  │  ├─ schemas.ts
│  │  ├─ params.ts
│  │  ├─ provider-aliases.ts
│  │  └─ mappers.ts
│  ├─ client/
│  │  ├─ index.ts
│  │  ├─ browser-analytics.ts
│  │  ├─ marketing-track.ts
│  │  ├─ product-track.ts
│  │  ├─ pageview.ts
│  │  ├─ identify.ts
│  │  ├─ consent-aware-track.ts
│  │  ├─ data-layer.ts
│  │  ├─ browser-context.ts
│  │  ├─ browser-ids.ts
│  │  └─ queue.ts
│  ├─ server/
│  │  ├─ index.ts
│  │  ├─ capture-event.ts
│  │  ├─ capture-conversion.ts
│  │  ├─ normalize-server-event.ts
│  │  ├─ build-event-context.ts
│  │  ├─ idempotency.ts
│  │  ├─ correlation.ts
│  │  ├─ persistence.ts
│  │  ├─ server-context.ts
│  │  ├─ enrich.ts
│  │  ├─ transport.ts
│  │  ├─ fanout/
│  │  │  ├─ index.ts
│  │  │  ├─ dispatch-event.ts
│  │  │  ├─ dispatch-conversion.ts
│  │  │  ├─ resolve-sinks.ts
│  │  │  └─ results.ts
│  │  └─ attribution/
│  │     ├─ index.ts
│  │     ├─ parse-attribution.ts
│  │     ├─ merge-attribution.ts
│  │     ├─ click-ids.ts
│  │     └─ attribution-params.ts
│  ├─ consent/
│  │  ├─ index.ts
│  │  ├─ categories.ts
│  │  ├─ state.ts
│  │  ├─ policy.ts
│  │  ├─ can-track.ts
│  │  ├─ cookie.ts
│  │  ├─ region.ts
│  │  ├─ map-google-consent.ts
│  │  └─ map-posthog-consent.ts
│  ├─ config/
│  │  ├─ index.ts
│  │  ├─ surfaces.ts
│  │  ├─ provider-matrix.ts
│  │  ├─ resolve-runtime-config.ts
│  │  ├─ marketing-site-config.ts
│  │  ├─ product-app-config.ts
│  │  ├─ tenant-config.ts
│  │  ├─ provider-config.ts
│  │  ├─ gateway-config.ts
│  │  └─ validation.ts
│  ├─ providers/
│  │  ├─ index.ts
│  │  ├─ gtm/
│  │  │  ├─ index.ts
│  │  │  ├─ browser.ts
│  │  │  ├─ payloads.ts
│  │  │  └─ consent.ts
│  │  ├─ ga4/
│  │  │  ├─ index.ts
│  │  │  ├─ measurement-protocol.ts
│  │  │  ├─ payloads.ts
│  │  │  ├─ map-event.ts
│  │  │  └─ validate.ts
│  │  ├─ meta/
│  │  │  ├─ index.ts
│  │  │  ├─ conversions-api.ts
│  │  │  ├─ payloads.ts
│  │  │  ├─ map-event.ts
│  │  │  └─ hashing.ts
│  │  ├─ posthog/
│  │  │  ├─ index.ts
│  │  │  ├─ browser.ts
│  │  │  ├─ server.ts
│  │  │  ├─ map-event.ts
│  │  │  └─ config.ts
│  │  └─ shared/
│  │     ├─ provider-types.ts
│  │     ├─ payload-helpers.ts
│  │     ├─ response-types.ts
│  │     ├─ retry.ts
│  │     └─ redaction.ts
│  ├─ framework/
│  │  ├─ index.ts
│  │  ├─ astro/
│  │  │  ├─ index.ts
│  │  │  ├─ marketing-bootstrap.ts
│  │  │  ├─ data-layer-bootstrap.ts
│  │  │  └─ gateway-script.ts
│  │  └─ next/
│  │     ├─ index.ts
│  │     ├─ nonce.ts
│  │     ├─ google-tag-manager.tsx
│  │     ├─ google-tag-gateway.tsx
│  │     └─ pageview-listener.tsx
│  ├─ pipeline/
│  │  ├─ index.ts
│  │  ├─ with-consent.ts
│  │  ├─ with-context.ts
│  │  ├─ with-idempotency.ts
│  │  └─ with-debug.ts
│  ├─ react/
│  │  ├─ index.ts
│  │  ├─ analytics-provider.tsx
│  │  ├─ use-track.ts
│  │  ├─ use-pageview.ts
│  │  ├─ use-consent.ts
│  │  ├─ use-analytics-context.ts
│  │  └─ use-product-analytics.ts
│  ├─ debug/
│  │  ├─ index.ts
│  │  ├─ logger.ts
│  │  ├─ flags.ts
│  │  ├─ redact.ts
│  │  └─ dev-warnings.ts
│  ├─ types/
│  │  ├─ context.ts
│  │  ├─ events.ts
│  │  ├─ config.ts
│  │  ├─ client.ts
│  │  ├─ server.ts
│  │  ├─ providers.ts
│  │  └─ consent.ts
│  ├─ internal/
│  │  ├─ constants.ts
│  │  ├─ defaults.ts
│  │  ├─ guards.ts
│  │  ├─ schema.ts
│  │  ├─ browser-only.ts
│  │  └─ server-only.ts
│  └─ testing/
│     ├─ index.ts
│     ├─ fixtures.ts
│     ├─ event-builders.ts
│     ├─ fake-provider.ts
│     ├─ fake-runtime-config.ts
│     └─ fake-consent.ts
└─ test/
   ├─ events/
   │  ├─ catalog.test.ts
   │  ├─ schemas.test.ts
   │  └─ provider-aliases.test.ts
   ├─ consent/
   │  ├─ can-track.test.ts
   │  ├─ policy.test.ts
   │  └─ map-google-consent.test.ts
   ├─ config/
   │  ├─ resolve-runtime-config.test.ts
   │  ├─ provider-matrix.test.ts
   │  └─ validation.test.ts
   ├─ client/
   │  ├─ browser-analytics.test.ts
   │  ├─ data-layer.test.ts
   │  └─ pageview.test.ts
   ├─ server/
   │  ├─ capture-event.test.ts
   │  ├─ capture-conversion.test.ts
   │  ├─ idempotency.test.ts
   │  └─ resolve-sinks.test.ts
   ├─ providers/
   │  ├─ ga4.test.ts
   │  ├─ meta.test.ts
   │  ├─ posthog.test.ts
   │  └─ gtm.test.ts
   ├─ framework/
   │  ├─ astro-bootstrap.test.ts
   │  └─ next-nonce.test.tsx
   └─ react/
      ├─ analytics-provider.test.tsx
      ├─ use-track.test.tsx
      └─ use-pageview.test.tsx


⸻

7. Top-level files

package.json

Purpose: package identity, subpath exports, scripts, peer/runtime dependency boundary.

Must include explicit exports for:
	•	.
	•	./client
	•	./server
	•	./consent
	•	./config
	•	./react
	•	./framework/astro
	•	./framework/next
	•	./testing

Must not expose:
	•	./providers/*
	•	./internal/*
	•	./events/*
	•	./src/*

Scripts:
	•	build
	•	clean
	•	dev
	•	typecheck
	•	test

tsconfig.json

Purpose: strict compiled-first package config.

Must:
	•	inherit repo base TS config
	•	support subpath entrypoints
	•	keep server/browser boundaries visible
	•	avoid leaking DOM types into server-only surfaces unnecessarily

tsup.config.ts

Purpose: ESM + declaration build.

Must emit clean entrypoints for:
	•	root
	•	client
	•	server
	•	consent
	•	config
	•	react
	•	framework/astro
	•	framework/next
	•	testing

No deep internal bundling tricks.
No surprise CJS unless repo later requires it.

vitest.config.ts

Purpose: package-local contract testing.

Needs:
	•	jsdom for client/react/framework-next tests
	•	node env for server/provider/config tests
	•	package-local coverage
	•	alias support aligned to package exports

README.md

Purpose: the package’s main anti-drift document.

Must explain:
	•	what belongs here
	•	what must never go here
	•	browser vs server responsibilities
	•	authoritative conversion model
	•	consent model
	•	event registry rules
	•	GTM/Gateway rules
	•	Astro/Next integration rules
	•	pageview ownership
	•	how to add an event
	•	how to add a provider
	•	forbidden patterns

⸻

8. Local docs

docs/event-catalog.md

Human-readable mirror of the canonical registry.

Each event documents:
	•	canonical name
	•	category
	•	allowed surfaces
	•	trust class
	•	privacy class
	•	required params
	•	optional params
	•	provider aliases
	•	idempotency strategy
	•	conversion eligibility

docs/consent-policy.md

Explains:
	•	consent categories
	•	default public-site behavior
	•	region-aware defaults
	•	event/category gating
	•	Google consent mapping
	•	when product apps may differ

This doc exists because Google’s current consent docs require setting default consent before measurement, updating it on user interaction, and supporting v2’s ad_user_data and ad_personalization fields.  

docs/provider-matrix.md

Documents which providers run on which surfaces and why.

docs/gtm-security-policy.md

Documents:
	•	data-layer ownership
	•	custom template preference
	•	template policy preference
	•	allow/block usage only when justified
	•	CSP/nonces when required
	•	gateway usage rules

This is aligned with Google’s current GTM CSP and restriction/template-policy guidance.  

docs/astro-integration.md

Documents the Astro integration recipe:
	•	processed local scripts
	•	is:inline external script path
	•	data-layer bootstrap timing
	•	how to inject gateway script URLs
	•	where app code owns placement

docs/next-integration.md

Documents the Next integration recipe:
	•	normal GTM path
	•	gateway path
	•	strict-CSP nonce-aware path
	•	pageview ownership rules
	•	product-app React provider setup

docs/verification-playbook.md

Documents how to verify:
	•	consent behavior
	•	data-layer contents
	•	GA4 MP payload validation
	•	GA4 realtime visibility
	•	Meta request sanity
	•	PostHog capture
	•	booking/lead conversion end-to-end

This matters because GA4 MP’s production endpoint can accept requests while payloads are still logically wrong, so validation must be treated as first-class.  

⸻

9. src/index.ts

Conservative root export only.

May export:
	•	canonical event names
	•	category/surface/trust/privacy types
	•	a few small shared types

Must not flatten the entire package.

Reason: consumers should still know whether they are using client, server, consent, config, or React surfaces.

⸻

10. src/events/

This is the contract core.

events/index.ts

Stable barrel for event registry surface.

events/names.ts

Literal event-name constants and event-name type.

Single source of truth for canonical event names.

events/categories.ts

Defines fixed categories:
	•	marketing
	•	product
	•	conversion
	•	consent
	•	diagnostic

events/surfaces.ts

Defines fixed event surfaces:
	•	marketing_site
	•	product_app
	•	trusted_server

events/trust.ts

Defines trust classes:
	•	browser_hint
	•	browser_observed
	•	server_observed
	•	authoritative

events/privacy.ts

Defines privacy classes:
	•	public_behavioral
	•	pseudonymous_operational
	•	sensitive_blocked

Any event marked sensitive_blocked may not fan out to providers.

events/catalog.ts

The most important file in the package.

Every event must be declared here with:
	•	canonical name
	•	primary category
	•	allowed surfaces
	•	trust class
	•	privacy class
	•	browser allowed boolean
	•	trusted-server allowed boolean
	•	required params
	•	optional params
	•	provider aliases
	•	idempotency strategy
	•	key-event/conversion flag
	•	public-site consent requirements
	•	provider eligibility overrides if any

This is the operational source of truth for validation and routing.

events/marketing.ts

Defines marketing/public events.

Initial v1 set:
	•	page_viewed
	•	cta_clicked
	•	outbound_link_clicked
	•	file_downloaded
	•	form_started
	•	form_submitted
	•	lead_submitted
	•	contact_requested

events/product.ts

Defines product-app events.

Initial v1 set:
	•	auth_sign_in_viewed
	•	auth_signed_in
	•	dashboard_viewed
	•	booking_started
	•	booking_step_completed
	•	booking_completed
	•	settings_updated

events/conversions.ts

Defines authoritative conversion subset.

Initial authoritative conversions:
	•	lead_submitted
	•	contact_requested
	•	booking_completed

events/schemas.ts

Runtime schemas for canonical event payloads.

Should compose with @repo/contracts where shared domain payloads already exist.

events/params.ts

Reusable typed parameter fragments:
	•	page context
	•	UTM/campaign params
	•	lead fields
	•	booking identifiers
	•	attribution fragments
	•	link target fragments

events/provider-aliases.ts

Centralized provider naming parity.

Examples:
	•	auth_signed_in → GA4 login
	•	lead_submitted → GA4 generate_lead
	•	Meta standard-event aliases where appropriate

Apps must never encode this mapping themselves.

events/mappers.ts

Registry lookup and normalization helpers that turn catalog metadata into dispatch-ready forms.

⸻

11. Initial canonical event catalog

This is the starting package registry.

Marketing browser-safe events
	•	page_viewed
	•	cta_clicked
	•	outbound_link_clicked
	•	file_downloaded
	•	form_started
	•	form_submitted

Marketing authoritative server events
	•	lead_submitted
	•	contact_requested

Product browser-safe events
	•	auth_sign_in_viewed
	•	dashboard_viewed
	•	booking_started
	•	booking_step_completed
	•	settings_updated

Product authoritative server events
	•	auth_signed_in
	•	booking_completed

Consent events
	•	consent_updated

Diagnostic events
	•	provider_dispatch_succeeded
	•	provider_dispatch_failed

Diagnostic events are internal diagnostics. They are not automatically provider-routed.

⸻

12. src/client/

Browser-side analytics surface.

client/index.ts

Public client entrypoint.

client/browser-analytics.ts

Main browser facade.

Responsibilities:
	•	accept resolved runtime config
	•	expose track()
	•	expose pageview()
	•	expose identify()
	•	enforce surface policy
	•	delegate to marketing/product implementations

This is the browser API apps should use.

client/marketing-track.ts

Browser tracking helper for marketing/public surfaces.

Responsibilities:
	•	consent checks
	•	GTM/data-layer dispatch
	•	public-surface event restrictions
	•	marketing pageview defaults

client/product-track.ts

Browser tracking helper for product apps.

Responsibilities:
	•	product-app event dispatch
	•	optional PostHog browser delegation
	•	package-owned product pageview policy
	•	no GTM assumptions

client/pageview.ts

Canonical pageview normalization.

Purpose:
	•	one pageview API
	•	dedupe guardrails
	•	surface-aware behavior
	•	prevent provider/manual double counting

client/identify.ts

Browser-side identity association.

Rules:
	•	not used on public marketing surfaces by default
	•	product apps may call after stable identity exists
	•	must respect consent/privacy policy where relevant

client/consent-aware-track.ts

Wrapper that denies or allows browser event emission based on consent rules.

client/data-layer.ts

Canonical GTM data-layer helper.

Owns the required shared payload shape.

Required base keys:
	•	event
	•	analytics_event
	•	analytics_surface
	•	tenant_key
	•	domain
	•	page_path
	•	page_url
	•	event_id when available
	•	consent snapshot where relevant
	•	canonical event payload fragment

This is mandatory because GTM uses the event key to trigger behavior and Google recommends pushing page-relevant variables predictably and early.  

client/browser-context.ts

Collects browser context consistently:
	•	route/path
	•	full URL
	•	title
	•	referrer
	•	locale/language
	•	timestamp
	•	surface markers

client/browser-ids.ts

Browser identifier helpers:
	•	anonymous session/browser IDs
	•	event correlation IDs
	•	read or derive browser-side IDs used for server fan-out handoff

client/queue.ts

Minimal client-side queue/debounce helper if needed.

Not an internal event bus.
Not a persistence layer.

⸻

13. src/server/

Trusted server-side analytics logic.

server/index.ts

Public server entrypoint.

server/capture-event.ts

Generic server analytics entrypoint for non-authoritative but server-observed analytics events.

server/capture-conversion.ts

Strict entrypoint for authoritative conversions.

Must enforce:
	•	event exists in registry
	•	event is marked authoritative-eligible
	•	payload passes schema
	•	idempotency strategy exists
	•	event/correlation IDs are present or derivable
	•	sink resolution uses the provider matrix

server/normalize-server-event.ts

Normalizes raw server payloads into canonical event DTOs.

server/build-event-context.ts

Builds canonical server-side context:
	•	surface
	•	tenant key / organization ID if available
	•	domain
	•	request metadata
	•	attribution
	•	consent snapshot if relevant
	•	actor reference if allowed
	•	browser/client identifiers if available
	•	timestamp

server/idempotency.ts

Defines deduplication policy.

Hard rules:
	•	every authoritative conversion has a canonical event_id
	•	retries reuse the same event_id
	•	if a durable business ID exists, it should anchor dedup semantics
	•	provider dispatch layers do not invent fresh conversion IDs after normalization
	•	if browser + server representations of the same business event coexist, they must be dedup-compatible where provider semantics expect shared IDs

This is especially important because Meta dedup logic depends on matching identifiers across browser/server representations, and GA4 server events also benefit from aligned session/client context.  

server/correlation.ts

Helpers for:
	•	request ID
	•	event ID
	•	lead ID
	•	booking ID
	•	dispatch correlation metadata

server/persistence.ts

Defines persistence interfaces this package composes with.

Important: this package does not become the authoritative event store.

It only defines contracts like:
	•	persist authoritative analytics record
	•	record provider dispatch result
	•	read existing dispatch/idempotency record if needed

App/server layers provide implementations.

server/server-context.ts

Builds server-runtime metadata:
	•	environment
	•	runtime kind
	•	deployment hints
	•	debug flags
	•	timestamp precision

server/enrich.ts

Server enrichment helpers:
	•	attach attribution fragments
	•	attach routing metadata
	•	normalize page/surface context
	•	add source-specific defaults

server/transport.ts

Shared low-level network helper layer.

Responsibilities:
	•	timeout policy
	•	header shaping
	•	standardized result envelopes
	•	retry strategy handoff

server/fanout/index.ts

Barrel for fan-out internals.

server/fanout/dispatch-event.ts

Dispatches general canonical events to active sinks.

server/fanout/dispatch-conversion.ts

Dispatches authoritative conversions to active sinks.

Separate from general dispatch because conversion policy is stricter.

server/fanout/resolve-sinks.ts

Resolves active sinks based on:
	•	event category
	•	trust class
	•	surface
	•	tenant/domain config
	•	provider matrix
	•	environment

server/fanout/results.ts

Normalizes provider result objects for:
	•	persistence
	•	logging
	•	retry handling
	•	diagnostics

server/attribution/index.ts

Barrel for attribution helpers.

server/attribution/parse-attribution.ts

Parses attribution from request/query/cookies/body/headers.

server/attribution/merge-attribution.ts

Merges attribution from multiple sources into canonical shape.

server/attribution/click-ids.ts

Helpers for click IDs:
	•	gclid
	•	gbraid
	•	wbraid
	•	fbclid

server/attribution/attribution-params.ts

Schema fragments and helpers for attribution payloads.

⸻

14. src/consent/

Consent and privacy control plane.

consent/index.ts

Public consent entrypoint.

consent/categories.ts

Defines canonical consent categories:
	•	necessary
	•	analytics
	•	advertising
	•	personalization

consent/state.ts

Defines normalized consent state:
	•	per-category values
	•	unknown/unset handling
	•	region
	•	timestamp
	•	source of decision
	•	versionable shape

consent/policy.ts

Repo-level consent policy.

This is not just types. It holds real decisions such as:
	•	public-site defaults
	•	region-aware default behavior
	•	which event categories require analytics consent
	•	which advertising routes require advertising consent
	•	which events are blocked regardless

consent/can-track.ts

Single-purpose decision function.

Input:
	•	event metadata
	•	runtime surface
	•	consent state

Output:
	•	allow/deny
	•	reason code

consent/cookie.ts

Consent cookie helpers only.

No generalized cookie utility sprawl.

consent/region.ts

Region classification helpers for region-aware consent defaults.

consent/map-google-consent.ts

Maps canonical consent state into Google consent-mode fields.

This matters because current Google consent mode expects default consent before measurement and supports ad_user_data plus ad_personalization.  

consent/map-posthog-consent.ts

Maps consent state into PostHog-friendly behavior:
	•	opt-out
	•	identify gating
	•	future cookieless mode support if needed

⸻

15. src/config/

Analytics runtime config layer.

config/index.ts

Public config entrypoint.

config/surfaces.ts

Runtime surface definitions and helpers.

config/provider-matrix.ts

Canonical provider matrix.

Default matrix:
	•	marketing_site browser → GTM enabled
	•	marketing_site trusted server → GA4 MP + Meta CAPI enabled
	•	product_app browser → PostHog-capable, app-controlled
	•	product_app trusted server → PostHog server off by default
	•	trusted_server conversion dispatch → GA4 MP + Meta CAPI when event is conversion-eligible

config/resolve-runtime-config.ts

Primary config resolver.

Input:
	•	surface
	•	domain
	•	tenant key / organization key
	•	environment
	•	app-provided config fragments

Output:
	•	one normalized runtime config object

config/marketing-site-config.ts

Types/defaults for marketing/public sites:
	•	GTM ID
	•	data-layer name
	•	consent mode behavior
	•	gateway settings
	•	GA4/Meta trusted-server hints

config/product-app-config.ts

Types/defaults for product apps:
	•	PostHog browser config
	•	pageview strategy
	•	identify policy
	•	optional server adapter enablement

config/tenant-config.ts

Tenant-aware config shapes apps pass in.

Important: defines shape only. Does not fetch tenant config itself.

config/provider-config.ts

Provider-specific config shapes and normalization helpers.

config/gateway-config.ts

Google Tag Gateway / first-party delivery config.

Includes:
	•	gateway enabled boolean
	•	gtmScriptUrl
	•	gateway origin
	•	same-origin/same-site hints
	•	fallback path

This is first-class because Google’s current docs explicitly support GTM gateway setups, including CDN/load-balancer use and Cloudflare setup paths.  

config/validation.ts

Runtime config validation.

Invalid config should fail clearly, not silently degrade.

⸻

16. src/providers/

Provider adapters live here and nowhere else.

providers/index.ts

Internal-only barrel.

providers/gtm/index.ts

GTM adapter barrel.

providers/gtm/browser.ts

Browser GTM adapter.

Responsibilities:
	•	use canonical data-layer helper
	•	initialize container assumptions
	•	centralize GTM-specific browser behavior

providers/gtm/payloads.ts

Maps canonical marketing events into GTM/data-layer payloads.

providers/gtm/consent.ts

Provider-specific Google/GTM consent wiring helpers.

providers/ga4/index.ts

GA4 adapter barrel.

providers/ga4/measurement-protocol.ts

Low-level GA4 MP transport.

Must support:
	•	POST requests
	•	request shaping
	•	host switching if EU routing is configured
	•	request-level metadata

Google’s current docs document HTTP POST, EU host support, and session/engagement requirements for realtime visibility.  

providers/ga4/payloads.ts

Builds GA4 MP request bodies from canonical events.

Must intentionally carry:
	•	client_id when available
	•	session_id when available
	•	engagement_time_msec when required for realtime visibility
	•	consent fields when appropriate

Because GA4 MP augments existing tagging and joins MP events to previous tagging context via identifiers like client_id.  

providers/ga4/map-event.ts

Canonical-to-GA4 event mapping.

Use recommended GA4 names deliberately where beneficial.

providers/ga4/validate.ts

Development/test validation helpers.

Use GA validation/debug flow, not just HTTP success.

providers/meta/index.ts

Meta adapter barrel.

providers/meta/conversions-api.ts

Low-level Meta CAPI transport.

providers/meta/payloads.ts

Builds Meta request payloads from canonical events.

providers/meta/map-event.ts

Canonical-to-Meta mapping logic.

providers/meta/hashing.ts

Identifier hashing helpers required for Meta payloads where applicable.

providers/posthog/index.ts

PostHog adapter barrel.

providers/posthog/browser.ts

Browser adapter for product apps.

Default posture:
	•	available
	•	opt-in by runtime config
	•	no package-level blanket autocapture assumption

providers/posthog/server.ts

Server adapter for product apps.

Exists for future use, but off by default in the provider matrix.

Must explicitly support flush/shutdown handling in short-lived runtimes. PostHog’s current Node docs call this out directly.  

providers/posthog/map-event.ts

Canonical-to-PostHog mapping logic.

providers/posthog/config.ts

PostHog defaults and guardrails.

Fixed default stance:
	•	person_profiles: 'identified_only'
	•	no implicit identify on public surfaces
	•	no package-level assumption that autocapture is desired

This reflects PostHog’s current documented defaults and recommendations.  

providers/shared/provider-types.ts

Stable internal provider adapter interfaces.

providers/shared/payload-helpers.ts

Shared payload-building helpers.

providers/shared/response-types.ts

Normalized provider result types.

providers/shared/retry.ts

Retry/backoff helper types.

providers/shared/redaction.ts

Shared payload redaction helpers before debug/logging.

⸻

17. src/framework/

Framework-aware integration layer.

This folder exists because the repo is intentionally Astro + Next, and those integration surfaces behave differently.

framework/index.ts

Public framework barrel.

framework/astro/index.ts

Public Astro helper barrel.

framework/astro/marketing-bootstrap.ts

Returns the values needed to bootstrap marketing analytics in Astro app code.

No .astro component here; helper only.

framework/astro/data-layer-bootstrap.ts

Builds the early-page data-layer bootstrap payload for Astro surfaces.

Important because Astro public pages often want minimal JS, and GTM/page context must be injected predictably. Astro’s processed script vs is:inline split is exactly why this helper exists.  

framework/astro/gateway-script.ts

Builds correct external script/gateway configuration for Astro marketing surfaces.

Use when GTM is delivered first-party or from external/public URLs.

framework/next/index.ts

Public Next helper barrel.

framework/next/nonce.ts

Nonce-reading/extraction helpers for strict-CSP Next apps.

framework/next/google-tag-manager.tsx

Shared Next GTM wrapper for standard Next usage.

framework/next/google-tag-gateway.tsx

Shared Next wrapper for GTM gateway mode.

Needed because gtmScriptUrl support is part of current Next guidance and matches the repo’s first-party tag delivery baseline.  

framework/next/pageview-listener.tsx

Client component for package-owned pageview behavior in Next product apps.

Prevents duplicate pageviews.

⸻

18. src/pipeline/

Composition helpers for analytics pipelines.

These are not framework middleware.

pipeline/index.ts

Barrel.

pipeline/with-consent.ts

Wraps track/capture flows with consent checks.

pipeline/with-context.ts

Adds normalized analytics context.

pipeline/with-idempotency.ts

Wraps authoritative conversion flows with dedup logic.

pipeline/with-debug.ts

Adds approved debug behavior without polluting main logic.

⸻

19. src/react/

React integration surface for Next apps and shared React consumers.

react/index.ts

Public React entrypoint.

react/analytics-provider.tsx

Lightweight provider for resolved analytics runtime config and browser analytics facade access.

Not a general app-state store.

react/use-track.ts

Primary browser track hook.

react/use-pageview.ts

Package-owned pageview hook.

react/use-consent.ts

Hook for reading/updating consent state where appropriate.

react/use-analytics-context.ts

Hook for resolved analytics context.

react/use-product-analytics.ts

Higher-level convenience hook for product apps.

Keeps product-app code from scattering low-level analytics calls everywhere.

⸻

20. src/debug/

Debugging and local diagnostics.

debug/index.ts

Barrel.

debug/logger.ts

Pluggable analytics debug logger.

Must not hard-depend on repo observability infrastructure.

debug/flags.ts

Debug flag helpers.

debug/redact.ts

Redaction utilities for safe payload logging.

debug/dev-warnings.ts

Development-only warnings such as:
	•	event missing from registry
	•	event blocked by consent
	•	provider not enabled for surface
	•	pageview path conflict
	•	unsupported deep import attempt
	•	authoritative conversion missing idempotency metadata

⸻

21. src/types/

Stable package-facing types.

types/context.ts

Analytics context types.

types/events.ts

Canonical event types.

types/config.ts

Resolved config types.

types/client.ts

Client facade types.

types/server.ts

Server facade types.

types/providers.ts

Provider result/config types.

types/consent.ts

Consent-state types.

⸻

22. src/internal/

Private boring internals.

internal/constants.ts

Internal string constants and markers.

internal/defaults.ts

Package default values.

internal/guards.ts

Internal assertions/guards.

internal/schema.ts

Private schema helpers.

internal/browser-only.ts

Boundary guard for browser-only imports.

internal/server-only.ts

Boundary guard for server-only imports.

⸻

23. src/testing/

Testing helpers exported through @repo/analytics/testing.

testing/index.ts

Testing barrel.

testing/fixtures.ts

Stable payload fixtures.

testing/event-builders.ts

Helpers to build valid canonical events quickly.

testing/fake-provider.ts

Provider test double.

testing/fake-runtime-config.ts

Resolved-config test helper.

testing/fake-consent.ts

Consent-state test helper.

⸻

24. test/

Contract tests only.

test/events/catalog.test.ts

Asserts registry consistency.

test/events/schemas.test.ts

Asserts schema alignment with registry metadata.

test/events/provider-aliases.test.ts

Asserts provider aliasing is stable and intentional.

test/consent/can-track.test.ts

Tests core consent gate logic.

test/consent/policy.test.ts

Tests repo consent policy.

test/consent/map-google-consent.test.ts

Tests Google consent-mode mapping.

test/config/resolve-runtime-config.test.ts

Tests config resolution across surface/domain/tenant inputs.

test/config/provider-matrix.test.ts

Tests provider routing defaults.

test/config/validation.test.ts

Tests invalid config rejection.

test/client/browser-analytics.test.ts

Tests public client facade behavior.

test/client/data-layer.test.ts

Tests canonical data-layer payload shape and ordering assumptions.

test/client/pageview.test.ts

Tests dedupe/pageview ownership rules.

test/server/capture-event.test.ts

Tests generic server capture.

test/server/capture-conversion.test.ts

Tests authoritative conversion capture.

test/server/idempotency.test.ts

Tests dedup semantics.

test/server/resolve-sinks.test.ts

Tests sink routing by surface/event/config.

test/providers/ga4.test.ts

Tests GA4 mapping and request building.

test/providers/meta.test.ts

Tests Meta mapping and payload shaping.

test/providers/posthog.test.ts

Tests PostHog defaults/mapping behavior.

test/providers/gtm.test.ts

Tests GTM payload behavior.

test/framework/astro-bootstrap.test.ts

Tests Astro helper outputs.

test/framework/next-nonce.test.tsx

Tests nonce-aware Next helpers.

test/react/analytics-provider.test.tsx

Tests provider wiring.

test/react/use-track.test.tsx

Tests browser track hook behavior.

test/react/use-pageview.test.tsx

Tests pageview hook behavior.

⸻

25. Behavior by app class

apps/site-firm

Uses:
	•	marketing_site surface
	•	GTM browser path
	•	consent-aware public tracking
	•	server-first lead_submitted / contact_requested
	•	gateway-capable config
	•	no PostHog by default

apps/site-platform

Uses:
	•	marketing_site surface
	•	per-domain/per-tenant resolved config
	•	per-brand GTM/GA4/Meta IDs
	•	consent-aware public tracking
	•	server-first lead/contact conversions
	•	gateway-capable config

apps/app-booking

Uses:
	•	product_app browser surface
	•	shared React provider/hooks
	•	package-owned pageview handling
	•	booking browser events
	•	authoritative booking_completed on server
	•	optional PostHog browser path
	•	PostHog server path only if explicitly enabled later

⸻

26. Hard rules

Event registry rules
	1.	Every event must exist in src/events/catalog.ts.
	2.	Every event has exactly one primary category.
	3.	Every event declares allowed surfaces.
	4.	Every event declares trust class and privacy class.
	5.	Every authoritative conversion declares idempotency strategy.
	6.	Apps never define provider aliases.
	7.	Shared events must be added here before app use.

Consent rules
	1.	Public marketing browser tracking is consent-aware by default.
	2.	necessary is not analytics permission.
	3.	Advertising dispatch is never inferred from analytics consent alone.
	4.	Consent changes emit consent_updated.
	5.	Apps do not implement their own Google consent mapping.

Idempotency rules
	1.	Every authoritative conversion has an event_id.
	2.	Retries preserve the same event_id.
	3.	Provider layers do not generate fresh conversion IDs post-normalization.
	4.	Durable business IDs should anchor dedup strategy.
	5.	Browser/server versions of the same conversion must be dedup-compatible if both exist.

Provider rules
	1.	Apps do not import supported vendor SDKs directly.
	2.	GTM is the canonical marketing/public browser path.
	3.	GA4 MP and Meta CAPI are trusted-server fan-out paths.
	4.	PostHog is product-app-oriented, not the default public-site path.
	5.	Provider config branching does not happen in components.

Framework rules
	1.	No .astro files in this package.
	2.	No ad hoc GTM snippets in Next apps.
	3.	Strict-CSP Next GTM uses shared nonce-aware wrappers.
	4.	Astro/public surfaces do not inherit strict-CSP dynamic-rendering costs unnecessarily.

These framework/CSP distinctions are directly justified by Astro script handling and Next’s nonce/CSP rendering tradeoffs.  

⸻

27. What must not exist here

These are drift smells and should be rejected:
	•	src/dashboard/
	•	src/reports/
	•	src/sql/
	•	src/warehouse/
	•	src/crm/
	•	src/app-booking/
	•	src/site-firm/
	•	src/site-platform/
	•	src/business/
	•	src/misc/
	•	src/utils/all.ts

Also forbidden:
	•	raw vendor calls in app code when package support exists
	•	per-app event name dictionaries
	•	provider branching inside UI components
	•	direct DB writes inside provider adapters
	•	analytics code that assumes a single tenant
	•	reporting logic inside this package

⸻

28. Build order

Phase 1

Top-level files, exports, README, docs skeleton, types, internal guards.

Phase 2

Event registry, schemas, categories, trust/privacy model.

Phase 3

Consent layer, config layer, provider matrix.

Phase 4

Client browser facade, data layer, marketing browser path.

Phase 5

Server capture, idempotency, attribution, sink resolution, fan-out.

Phase 6

Provider adapters: GTM, GA4, Meta, PostHog.

Phase 7

Framework helpers: Astro and Next.

Phase 8

React provider/hooks.

Phase 9

Contract tests and verification playbook completion.

⸻

29. Definition of done

packages/analytics is done when:
	•	apps can emit canonical analytics events without vendor-specific code
	•	public-site tracking is consent-gated through shared helpers
	•	GTM/data-layer behavior is centralized
	•	tenant/domain-aware runtime config resolves centrally
	•	trusted server conversions are normalized and dispatched through stable helpers
	•	GA4 and Meta adapters work behind stable internal interfaces
	•	PostHog browser support exists for product apps
	•	strict-CSP Next GTM has a shared wrapper path
	•	Astro marketing surfaces have a shared bootstrap path
	•	event registry, provider matrix, and consent rules are documented and tested
	•	no reporting, warehouse, CRM, or app-business logic has leaked in

⸻

30. Non-goals

This package is not:
	•	the data warehouse
	•	the reporting engine
	•	the dashboard layer
	•	the CRM router
	•	the GTM container administration system
	•	the source-of-truth event store
	•	the queue system
	•	the general internal event bus
	•	the product feature-flag layer

It is shared analytics instrumentation infrastructure.

⸻

31. Final call

This is the final source of truth for @repo/packages/analytics.

The most important decisions are now fully locked:
	•	marketing-first, product-safe package shape
	•	explicit event registry
	•	explicit consent layer
	•	explicit idempotency layer
	•	explicit provider matrix
	•	explicit Astro and Next integration layers
	•	explicit GTM/Gateway handling
	•	explicit pageview ownership
	•	explicit server-first conversion policy
	•	explicit rule that apps never talk to supported analytics vendors directly

This directory plan is the canonical implementation target.