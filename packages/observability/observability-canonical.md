# repo/observability/observability-canonical.md

Below is the final source of truth for packages/observability/, published internally as @repo/observability.

It is synchronized to the project decisions already established across this project: pnpm + Turborepo, compiled-first runtime packages, @repo/env as the env contract, Astro for public/content surfaces, Next.js for app/product surfaces, OpenTelemetry-first observability, Collector-first production export, Axiom as the primary logs/traces backend, selective Sentry on approved Next.js apps, strict package boundaries, and a hard separation between observability and analytics.

A few current ecosystem facts lock in the package shape: Next.js has both instrumentation.ts for server startup and instrumentation-client.ts for client startup; proxy.ts is a network-boundary feature and defaults to the Node.js runtime; Astro request-scoped values flow through context.locals and Astro.locals; OpenTelemetry recommends using the Collector in production; the OpenTelemetry Node.js logging library is still under development; Axiom’s OTel metrics support is still in public preview; Vercel Trace Drains use OTLP/HTTP and do not forward custom Edge-runtime spans; and Sentry’s coexistence path for an existing OTel setup uses skipOpenTelemetrySetup: true.  

1. Canonical package decision

packages/observability is the shared operational telemetry package for the monorepo.

It owns:
	•	OpenTelemetry bootstrap and shared runtime configuration
	•	tracing helpers and span conventions
	•	structured logging helpers
	•	redaction and scrubbing rules
	•	request, job, and correlation context propagation
	•	framework adapters for Next.js and Astro
	•	a narrow browser operational telemetry surface
	•	OTLP transport/export configuration helpers
	•	sampling defaults and environment-aware observability behavior
	•	optional Sentry helpers for approved apps

It does not own:
	•	business analytics
	•	KPI reporting
	•	attribution logic
	•	dashboards
	•	warehouse models
	•	alerting policy documents
	•	feature-specific logging vocabularies invented inside apps
	•	“misc debug utils”
	•	collector deployment manifests

This package exists to answer one question:

How does the repo emit traces, logs, and operational telemetry consistently, safely, and with strict boundaries across apps and shared packages?

2. Final architectural stance

The package is:
	•	traces-first
	•	structured-logs-first
	•	redaction-first
	•	Collector-first in production
	•	OTLP/HTTP-first as the default transport
	•	browser telemetry narrow by design
	•	Sentry opt-in and secondary
	•	metrics intentionally thin

That means:
	•	OTel is the standard for resources, traces, context propagation, and export plumbing.
	•	Structured logs are the main developer-facing logging API because OTel’s Node.js logging library is not mature enough to make the authoring model the center of the package.  
	•	Production telemetry should flow to a Collector first, then to vendors like Axiom. OpenTelemetry and Axiom both support Collector-centric production topologies.  
	•	The default protocol should be OTLP/HTTP, which aligns cleanly with Vercel Trace Drains and OTel’s OTLP env model.  
	•	Browser telemetry must stay operational only: web vitals, selected browser errors, and lightweight navigation/perf context. Next’s client instrumentation file exists for that sort of early client-side monitoring code.  
	•	Metrics stay intentionally small because Axiom’s OTel metrics are still public preview.  

3. Package boundary in the monorepo

@repo/observability sits low in the dependency graph.

It may import:
	•	@repo/env
	•	OpenTelemetry packages
	•	framework packages only inside framework adapter surfaces
	•	tiny utility libraries
	•	Sentry packages only inside src/sentry/*

It must not import:
	•	any app
	•	@repo/db
	•	@repo/auth
	•	@repo/ui
	•	@repo/analytics
	•	@repo/integrations-core

Reason:
	•	@repo/analytics owns business and marketing analytics.
	•	@repo/observability owns operational telemetry.
	•	@repo/db and @repo/auth should be instrumented by helpers from this package, not depended on by it.
	•	infra packages stay low and boring.

4. Hard rules

4.1 OpenTelemetry-first, but not OTel-logs-first

Use OTel for trace/resource/context/export conventions. Keep developer-facing logs as structured logs. The current OTel Node.js docs still say the logging library is under development.  

4.2 Collector-first in production

Apps and workers should export to the Collector by default, not directly to vendors. Collector-first is an OTel best practice and matches Axiom’s reference architectures.  

4.3 OTLP/HTTP is the default wire protocol

Use OTLP/HTTP as the default export protocol unless a very specific runtime justifies something else. OTel documents the base/per-signal OTLP env model, and Vercel Trace Drains use OTLP/HTTP binary protobuf.  

4.4 proxy.ts stays tiny

proxy.ts is a network-boundary tool, defaults to Node.js runtime, and should not become a general execution layer for business logic or heavyweight telemetry work.  

4.5 Browser telemetry stays narrow

No funnels, no attribution, no feature usage analytics, no product KPI events. Only operational signals.

4.6 Redaction is mandatory

No shared helper may casually emit secrets, tokens, cookies, auth headers, or raw request bodies.

4.7 Framework bootstrap belongs in adapters

Apps should keep tiny app-local boot files and delegate to this package. That is especially important for Next’s instrumentation.ts and instrumentation-client.ts, which are explicit framework lifecycle boundaries.  

4.8 Sentry is opt-in and secondary

Sentry is allowed only on approved apps. When used alongside an existing OTel setup, shared helpers must own the custom coexistence path via skipOpenTelemetrySetup: true.  

4.9 Metrics remain intentionally thin

Do not build a large metrics abstraction layer in v1. Axiom’s OTel metrics support is still public preview.  

4.10 No deep imports

Consumers import from public subpath entrypoints only.

5. Final directory shape

packages/observability/
├─ package.json
├─ tsconfig.json
├─ tsup.config.ts
├─ vitest.config.ts
├─ README.md
├─ src/
│  ├─ index.ts
│  ├─ core/
│  │  ├─ index.ts
│  │  ├─ resource.ts
│  │  ├─ service-metadata.ts
│  │  ├─ semantic-attributes.ts
│  │  ├─ tracer.ts
│  │  ├─ logger.ts
│  │  ├─ metrics.ts
│  │  ├─ context.ts
│  │  └─ runtime-env.ts
│  ├─ config/
│  │  ├─ index.ts
│  │  ├─ otlp.ts
│  │  ├─ sampling.ts
│  │  ├─ exporters.ts
│  │  ├─ resources.ts
│  │  ├─ logging.ts
│  │  └─ validation.ts
│  ├─ policies/
│  │  ├─ index.ts
│  │  ├─ span-naming.ts
│  │  ├─ log-events.ts
│  │  ├─ redaction-policy.ts
│  │  └─ sampling-policy.ts
│  ├─ next/
│  │  ├─ index.ts
│  │  ├─ instrumentation.ts
│  │  ├─ instrumentation-client.ts
│  │  ├─ proxy.ts
│  │  ├─ route-handlers.ts
│  │  ├─ server-actions.ts
│  │  ├─ request-context.ts
│  │  └─ errors.ts
│  ├─ astro/
│  │  ├─ index.ts
│  │  ├─ instrumentation.ts
│  │  ├─ middleware.ts
│  │  ├─ request-context.ts
│  │  └─ errors.ts
│  ├─ browser/
│  │  ├─ index.ts
│  │  ├─ bootstrap.ts
│  │  ├─ web-vitals.ts
│  │  ├─ errors.ts
│  │  ├─ navigation.ts
│  │  └─ session.ts
│  ├─ tracing/
│  │  ├─ index.ts
│  │  ├─ spans.ts
│  │  ├─ span-names.ts
│  │  ├─ attributes.ts
│  │  ├─ with-span.ts
│  │  ├─ http.ts
│  │  ├─ db.ts
│  │  └─ queue.ts
│  ├─ logging/
│  │  ├─ index.ts
│  │  ├─ create-logger.ts
│  │  ├─ log-levels.ts
│  │  ├─ log-event-names.ts
│  │  ├─ serializers.ts
│  │  ├─ sinks.ts
│  │  └─ correlation.ts
│  ├─ redaction/
│  │  ├─ index.ts
│  │  ├─ redact.ts
│  │  ├─ keys.ts
│  │  ├─ headers.ts
│  │  ├─ urls.ts
│  │  └─ payloads.ts
│  ├─ sentry/
│  │  ├─ index.ts
│  │  ├─ next.ts
│  │  ├─ browser.ts
│  │  ├─ edge.ts
│  │  ├─ config.ts
│  │  └─ filters.ts
│  ├─ otel/
│  │  ├─ index.ts
│  │  ├─ node-sdk.ts
│  │  ├─ providers.ts
│  │  ├─ processors.ts
│  │  ├─ propagators.ts
│  │  └─ instrumentations.ts
│  ├─ types/
│  │  ├─ telemetry.ts
│  │  ├─ logging.ts
│  │  ├─ tracing.ts
│  │  └─ runtime.ts
│  ├─ internal/
│  │  ├─ constants.ts
│  │  ├─ guards.ts
│  │  └─ server-only.ts
│  └─ testing/
│     ├─ index.ts
│     ├─ fake-exporter.ts
│     ├─ log-fixtures.ts
│     └─ span-fixtures.ts
└─ test/
   ├─ setup.ts
   ├─ config/
   │  ├─ otlp.test.ts
   │  ├─ sampling.test.ts
   │  ├─ logging.test.ts
   │  └─ validation.test.ts
   ├─ tracing/
   │  ├─ span-names.test.ts
   │  ├─ with-span.test.ts
   │  ├─ http.test.ts
   │  └─ queue.test.ts
   ├─ logging/
   │  ├─ create-logger.test.ts
   │  ├─ serializers.test.ts
   │  ├─ correlation.test.ts
   │  └─ sinks.test.ts
   ├─ redaction/
   │  ├─ redact.test.ts
   │  ├─ headers.test.ts
   │  ├─ urls.test.ts
   │  └─ payloads.test.ts
   ├─ next/
   │  ├─ request-context.test.ts
   │  ├─ route-handlers.test.ts
   │  ├─ server-actions.test.ts
   │  └─ proxy.test.ts
   ├─ astro/
   │  ├─ middleware.test.ts
   │  └─ request-context.test.ts
   └─ browser/
      ├─ web-vitals.test.ts
      ├─ errors.test.ts
      └─ navigation.test.ts

6. Top-level file plan

package.json

Purpose: compiled runtime package manifest with strict subpath exports.

Public exports:
	•	@repo/observability
	•	@repo/observability/core
	•	@repo/observability/config
	•	@repo/observability/next
	•	@repo/observability/astro
	•	@repo/observability/browser
	•	@repo/observability/tracing
	•	@repo/observability/logging
	•	@repo/observability/redaction
	•	@repo/observability/sentry
	•	@repo/observability/otel
	•	@repo/observability/testing

Not public:
	•	policies
	•	types
	•	internal
	•	src/*

Rules:
	•	ESM only.
	•	Declarations emitted.
	•	Clear export map.
	•	No deep imports.
	•	Do not broadly mark the package as side-effect free if any bootstrap entrypoints intentionally perform setup.

Dependencies should be grouped conceptually like this:
	•	runtime deps: OTel packages, small utility deps
	•	optional peer-style surface deps: Next/Astro/Sentry packages only for their entrypoints if you want tighter install discipline
	•	dev deps: Vitest, TS, tsup

tsconfig.json

Purpose: strict, compiled-first, boundary-aware TypeScript config.

Rules:
	•	strict mode
	•	declaration-friendly
	•	no repo-app path aliases
	•	no accidental DOM bleed into server modules
	•	entrypoint design, not ambient typing hacks, enforces browser/server separation

tsup.config.ts

Purpose: build the package as a compiled runtime package.

Rules:
	•	ESM output
	•	.d.ts generation
	•	subpath-aware entrypoints
	•	externalize large framework/vendor deps
	•	avoid one giant flattened bundle that blurs server and browser boundaries

vitest.config.ts

Purpose: per-package test config aligned to repo testing baseline.

Rules:
	•	Node test environment by default
	•	jsdom only where browser helpers need it
	•	test/setup.ts loaded once
	•	no real network or vendor export calls
	•	use fake exporters and fixtures

README.md

Purpose: canonical local guide for package consumers and maintainers.

Required sections:
	•	purpose
	•	package boundary
	•	architecture stance
	•	transport model
	•	logs vs traces vs browser telemetry
	•	redaction policy
	•	sampling posture
	•	Next.js integration
	•	Astro integration
	•	browser integration
	•	Sentry rules
	•	public exports
	•	forbidden patterns
	•	testing strategy

7. Root export plan

src/index.ts

Purpose: conservative root export.

Should export only the safest common surfaces, for example:
	•	selected core helpers
	•	selected tracing helpers
	•	selected logging helpers
	•	top-level redaction entrypoint

Should not flatten the whole package.

The root should make consumers ask themselves what they actually need:
	•	core metadata?
	•	logging?
	•	tracing?
	•	Next adapter?
	•	Astro adapter?
	•	browser helper?

8. src/core/

This is the shared telemetry foundation.

src/core/index.ts

Re-export only broad, stable primitives.

src/core/resource.ts

Purpose: build the canonical OTel resource object.

Owns:
	•	service name
	•	service version
	•	deployment environment
	•	runtime kind
	•	app/package identity
	•	deployment metadata

Design rule:
	•	resource values should be normalized here, not reinvented in apps.

src/core/service-metadata.ts

Purpose: normalize service metadata for apps and workers.

Owns:
	•	app name normalization
	•	package name normalization
	•	environment naming
	•	deployment ID naming
	•	service class naming

This is where you prevent service-name drift.

src/core/semantic-attributes.ts

Purpose: single source of truth for repo-level semantic attribute keys.

Examples:
	•	repo.organization.id
	•	repo.tenant.domain
	•	repo.request.id
	•	repo.correlation.id
	•	repo.queue.job.name
	•	repo.integration.provider
	•	repo.user.role_class

Rule:
	•	if a stable repo-level key exists here, apps must use it instead of inventing a new one.

src/core/tracer.ts

Purpose: tracer acquisition helper.

Owns:
	•	getting a tracer instance
	•	tracer namespace conventions
	•	safe lazy access patterns

src/core/logger.ts

Purpose: thin bridge to the structured logging surface.

Owns:
	•	shared logger accessor
	•	shared defaults
	•	convenience entry into logging/create-logger.ts

src/core/metrics.ts

Purpose: tiny future-proof metrics surface.

Rules:
	•	keep it minimal
	•	no large metrics abstraction
	•	no “observability completeness” expansion pressure
	•	okay to expose only small helpers or no-op-safe utilities

src/core/context.ts

Purpose: shared context propagation helpers.

Owns:
	•	request ID helpers
	•	correlation ID helpers
	•	tenant context
	•	trace/log context linkage
	•	job-run context

src/core/runtime-env.ts

Purpose: observability runtime mode logic.

Owns:
	•	local/dev/test/preview/prod behavior
	•	telemetry enabled/disabled logic
	•	export-on/off defaults
	•	console-vs-network mode hints

9. src/config/

This directory resolves runtime observability configuration.

src/config/index.ts

Public config entrypoint.

src/config/otlp.ts

Purpose: normalize OTLP transport config.

Owns:
	•	base OTLP endpoint
	•	per-signal endpoint overrides
	•	headers
	•	protocol
	•	timeout defaults

Repo decision:
	•	default protocol is OTLP/HTTP
	•	base endpoint + per-signal override semantics must follow OTel’s documented model
	•	production targets the Collector by default, not vendors directly  

src/config/sampling.ts

Purpose: compute runtime sampling values from environment + policy.

Owns:
	•	environment-specific defaults
	•	app-class overrides
	•	explicit sampler config

src/config/exporters.ts

Purpose: assemble exporter and sink choices.

Owns:
	•	trace exporter wiring
	•	optional log export plumbing
	•	console exporters in local dev
	•	test no-op/fake export paths

src/config/resources.ts

Purpose: assemble resource config inputs before materializing the OTel resource.

This separates raw config from built runtime objects.

src/config/logging.ts

Purpose: resolve log-level and sink config.

Owns:
	•	log levels by environment
	•	pretty dev console mode
	•	structured output mode
	•	sink selection policy

src/config/validation.ts

Purpose: fail fast on bad observability config.

Rules:
	•	do not silently misconfigure telemetry
	•	invalid endpoint/header/protocol combos should fail early
	•	test envs may explicitly no-op, but not ambiguously

10. src/policies/

This directory holds internal package policy code.

It is not a primary public API, but it is an important maintenance boundary.

src/policies/index.ts

Internal re-exports.

src/policies/span-naming.ts

Purpose: canonical span naming policy.

Owns:
	•	span name classes
	•	prefixes
	•	allowed patterns
	•	reserved names

src/policies/log-events.ts

Purpose: canonical log event naming policy.

Owns:
	•	allowed event namespaces
	•	event naming style
	•	reserved names
	•	deprecation path for renamed events

src/policies/redaction-policy.ts

Purpose: package-owned safety defaults.

Owns:
	•	default sensitive keys
	•	default header policy
	•	default URL query handling
	•	truncation rules

src/policies/sampling-policy.ts

Purpose: package-owned sampling defaults.

Owns:
	•	sampling matrix by environment
	•	app-class defaults
	•	special cases for queues/webhooks/high-value apps

11. src/next/

This folder exists because Next’s observability-related file conventions are actual lifecycle boundaries. instrumentation.ts runs when a new server instance starts, instrumentation-client.ts runs before the app becomes interactive, and proxy.ts is a server-side network-boundary feature that defaults to Node runtime.  

src/next/index.ts

Public Next adapter entrypoint.

src/next/instrumentation.ts

Purpose: shared helper for app-local instrumentation.ts.

Responsibilities:
	•	initialize server-side OTel bootstrap once
	•	register NodeSDK where needed
	•	attach approved instrumentations
	•	keep app-local instrumentation.ts tiny

This is the main Next server observability entry.

src/next/instrumentation-client.ts

Purpose: shared helper for app-local instrumentation-client.ts.

Responsibilities:
	•	call into browser bootstrap
	•	initialize web vitals and approved client-side monitoring
	•	stay lightweight

This file exists because current Next.js treats client instrumentation as a first-class file convention for monitoring/observability startup.  

src/next/proxy.ts

Purpose: helper for app-local proxy.ts.

Responsibilities:
	•	set up request/correlation IDs
	•	attach safe request metadata
	•	optionally measure tiny request-boundary timing
	•	never become a full telemetry engine

Rules:
	•	no heavy auth
	•	no complex business logic
	•	no giant serialization work
	•	no deep runtime dependencies

src/next/route-handlers.ts

Purpose: consistent Route Handler instrumentation.

Responsibilities:
	•	request span wrappers
	•	structured logs
	•	correlation IDs
	•	normalized errors
	•	safe request/response metadata shape

src/next/server-actions.ts

Purpose: consistent Server Action instrumentation.

Responsibilities:
	•	span naming
	•	action correlation
	•	safe input metadata
	•	normalized exceptions
	•	action-level logs

src/next/request-context.ts

Purpose: Next-specific request-context extraction and storage.

Responsibilities:
	•	read request identifiers
	•	normalize inbound context
	•	expose repo-standard context fields

src/next/errors.ts

Purpose: Next-specific error normalization and capture utilities.

12. src/astro/

Astro middleware is the right place to attach request-scoped values because context.locals flows through the request lifecycle and becomes available via Astro.locals.  

src/astro/index.ts

Public Astro adapter entrypoint.

src/astro/instrumentation.ts

Purpose: Astro bootstrap glue.

Responsibilities:
	•	initialize server-side telemetry where appropriate
	•	expose common setup path for Astro apps

src/astro/middleware.ts

Purpose: shared middleware helper.

Responsibilities:
	•	initialize request context
	•	attach tenant/domain metadata
	•	expose values through locals
	•	keep request telemetry light and safe

Rules:
	•	middleware should enrich context, not become a business-logic layer

src/astro/request-context.ts

Purpose: read/write observability values via Astro locals.

src/astro/errors.ts

Purpose: Astro-specific error normalization and capture.

13. src/browser/

This folder is intentionally narrow.

src/browser/index.ts

Public browser entrypoint.

src/browser/bootstrap.ts

Purpose: shared lightweight bootstrap for browser operational telemetry.

Responsibilities:
	•	initialize web vitals
	•	initialize selected error capture
	•	initialize tiny navigation/perf hooks

src/browser/web-vitals.ts

Purpose: web-vitals collection helpers.

src/browser/errors.ts

Purpose: selected browser error capture.

Responsibilities:
	•	uncaught errors
	•	unhandled rejections
	•	safe message/stack shaping
	•	redaction-aware payload preparation

src/browser/navigation.ts

Purpose: lightweight navigation timing and route/perf helpers.

src/browser/session.ts

Purpose: minimal browser correlation context.

Rules:
	•	no analytics identity
	•	no attribution state
	•	no marketing data
	•	no user profiling behavior

14. src/tracing/

This is the shared tracing contract and helper layer.

src/tracing/index.ts

Public tracing entrypoint.

src/tracing/spans.ts

Purpose: general span lifecycle helpers.

Responsibilities:
	•	create child spans
	•	add safe attributes
	•	set status
	•	record exceptions
	•	end spans consistently

src/tracing/span-names.ts

Purpose: public span name constants or re-exports.

src/tracing/attributes.ts

Purpose: attribute helpers and trace-level convenience constants.

src/tracing/with-span.ts

Purpose: high-leverage wrapper for executing code within a named span.

This should become the most commonly used span helper in app and package code.

src/tracing/http.ts

Purpose: HTTP-oriented span helpers.

src/tracing/db.ts

Purpose: infra-level DB operation span helpers.

Rule:
	•	this does not replace DALs or Prisma behavior
	•	it only helps standardize higher-level DB operation tracing when needed

src/tracing/queue.ts

Purpose: queue/job span helpers.

Important because async jobs and webhook consumers are part of the project architecture.

15. src/logging/

This is the primary developer-facing log surface.

src/logging/index.ts

Public logging entrypoint.

src/logging/create-logger.ts

Purpose: main logger factory.

Responsibilities:
	•	structured log envelope
	•	level handling
	•	default metadata
	•	redaction pass
	•	correlation injection
	•	sink routing

This is the canonical logging authoring API for the repo.

src/logging/log-levels.ts

Purpose: canonical log-level vocabulary.

Use one shared set of levels across the repo.

src/logging/log-event-names.ts

Purpose: stable repo log event names.

Examples:
	•	request.started
	•	request.completed
	•	request.failed
	•	server_action.started
	•	server_action.failed
	•	queue.job.started
	•	queue.job.completed
	•	queue.job.failed
	•	auth.session.invalid
	•	integration.sync.failed

src/logging/serializers.ts

Purpose: safe serializers.

Owns serializers for:
	•	errors
	•	requests
	•	responses
	•	queue metadata
	•	integration metadata

All serializers must respect redaction rules.

src/logging/sinks.ts

Purpose: central sink wiring.

Examples:
	•	structured console sink
	•	local pretty console sink
	•	OTLP log-transport wrapper if used
	•	test no-op sink

src/logging/correlation.ts

Purpose: correlation and trace-linkage helpers.

16. src/redaction/

This is one of the most important areas of the package.

src/redaction/index.ts

Public redaction entrypoint.

src/redaction/redact.ts

Purpose: primary redaction function.

Everything that leaves the process through shared log, tracing, or Sentry helpers should route through this logic directly or indirectly.

src/redaction/keys.ts

Purpose: sensitive key-name patterns.

Examples:
	•	password
	•	token
	•	authorization
	•	secret
	•	cookie
	•	apiKey
	•	session

src/redaction/headers.ts

Purpose: header-specific redaction.

Auth-like headers must be stripped or masked by default.

src/redaction/urls.ts

Purpose: query-param and URL-piece redaction.

src/redaction/payloads.ts

Purpose: structured payload redaction and truncation.

Rules:
	•	large payloads should be summarized or truncated, not dumped whole
	•	request bodies are not casually emitted
	•	redaction happens recursively

17. src/sentry/

Sentry is allowed, but only as a selective opt-in layer.

Current Sentry docs for Next.js support manual App Router/Turbopack-era setup, and Sentry documents a custom coexistence path for existing OTel setups using skipOpenTelemetrySetup: true. Sentry also supports filters like beforeSend, beforeSendTransaction, beforeSendLog, allowUrls, and denyUrls.  

src/sentry/index.ts

Public Sentry entrypoint.

src/sentry/next.ts

Purpose: helper for Next server-side Sentry integration.

Responsibilities:
	•	initialize Sentry on approved apps
	•	apply package-owned filters
	•	wire coexistence with the shared OTel setup

src/sentry/browser.ts

Purpose: helper for approved browser-side Sentry usage.

src/sentry/edge.ts

Purpose: optional helper for rare approved Edge-runtime Sentry cases.

This is not a primary path. Vercel Trace Drains do not forward custom Edge-runtime spans.  

src/sentry/config.ts

Purpose: central config builder.

Responsibilities:
	•	DSN rules
	•	environment/release naming
	•	sample-rate defaults
	•	coexistence flags
	•	approved feature toggles

src/sentry/filters.ts

Purpose: mandatory filtering and scrubbing.

Responsibilities:
	•	beforeSend
	•	beforeSendTransaction
	•	optional beforeSendLog
	•	noise filters for bots/health checks
	•	URL/domain filters
	•	shared redaction reuse

18. src/otel/

This is the lower-level implementation layer.

src/otel/index.ts

Public advanced OTel entrypoint.

Intended for specialized runtimes like worker apps, job runners, or advanced setup code.

src/otel/node-sdk.ts

Purpose: manual NodeSDK bootstrap helper.

Rules:
	•	initialize early
	•	stay explicit
	•	favor Collector export

OTel documents that initialization needs to happen before instrumented libraries are loaded, and Collector-first production export is best practice.  

src/otel/providers.ts

Purpose: provider setup helpers.

Owns:
	•	tracer provider setup
	•	logger provider plumbing if used
	•	tiny meter provider support if needed

src/otel/processors.ts

Purpose: processor assembly.

Examples:
	•	batch span processors
	•	redaction-aware enrichment processors
	•	env-specific processors

src/otel/propagators.ts

Purpose: context propagation configuration.

src/otel/instrumentations.ts

Purpose: approved instrumentation assembly.

Repo rule:
	•	prefer explicit instrumentation lists in shared package code
	•	do not default to giant metapackages in this package
	•	OTel’s JS docs note that metapackages increase dependency graph size and individual libraries are preferred when you know what you need  

19. src/types/

Internal package API types.

src/types/telemetry.ts

Telemetry config and bootstrap types.

src/types/logging.ts

Structured logging payload/interface types.

src/types/tracing.ts

Span helper and attribute types.

src/types/runtime.ts

Runtime/environment/shared surface types.

Rule:
	•	this is not a generic dumping ground

20. src/internal/

Package-private boring details.

src/internal/constants.ts

Internal constants.

src/internal/guards.ts

Small value/type guards.

src/internal/server-only.ts

Server-only marker/import guards.

Rule:
	•	never exported publicly

21. src/testing/

Testing helpers for this package and other repo tests.

src/testing/index.ts

Public testing entrypoint.

src/testing/fake-exporter.ts

Fake exporter for traces/logs.

src/testing/log-fixtures.ts

Stable structured log fixtures.

src/testing/span-fixtures.ts

Stable span fixtures.

22. test/

The test suite should focus on the package’s contracts and safety guarantees, not on vendor internals.

test/setup.ts

Shared test initialization.

test/config/*

Covers:
	•	OTLP config resolution
	•	sampling config
	•	logging config
	•	validation failures

test/tracing/*

Covers:
	•	span naming
	•	withSpan
	•	HTTP helpers
	•	queue helpers

test/logging/*

Covers:
	•	logger shape
	•	serializer behavior
	•	correlation injection
	•	sink routing

test/redaction/*

Covers:
	•	key redaction
	•	header redaction
	•	URL redaction
	•	payload truncation/redaction

test/next/*

Covers:
	•	request context
	•	Route Handler wrappers
	•	Server Action wrappers
	•	Proxy helper staying lightweight

test/astro/*

Covers:
	•	middleware locals behavior
	•	request context propagation

test/browser/*

Covers:
	•	web vitals helpers
	•	browser error shaping
	•	navigation hooks

23. Public API contract

Only these entrypoints are intended for consumers:
	•	@repo/observability
	•	@repo/observability/core
	•	@repo/observability/config
	•	@repo/observability/next
	•	@repo/observability/astro
	•	@repo/observability/browser
	•	@repo/observability/tracing
	•	@repo/observability/logging
	•	@repo/observability/redaction
	•	@repo/observability/sentry
	•	@repo/observability/otel
	•	@repo/observability/testing

Not public:
	•	policies
	•	types
	•	internal

24. Naming standards

Span names

Use stable, operation-oriented names.

Patterns:
	•	http.request
	•	http.client
	•	route_handler.execute
	•	server_action.execute
	•	queue.job.execute
	•	db.query
	•	integration.sync

Log event names

Use stable dot-separated event names.

Patterns:
	•	request.started
	•	request.completed
	•	request.failed
	•	queue.job.started
	•	queue.job.completed
	•	queue.job.failed
	•	server_action.started
	•	server_action.failed

Attributes

Use canonical repo keys from core/semantic-attributes.ts whenever a matching key exists.

25. OTLP and env contract

This package must align with the repo-wide env discipline in @repo/env.

The observability package should consume normalized env helpers from @repo/env, not raw process.env scattered across modules.

The transport model must support:
	•	one base OTLP endpoint
	•	per-signal overrides when required
	•	header injection
	•	protocol configuration
	•	timeout defaults

This follows OTel’s documented OTLP exporter configuration model, where signal-specific options override base options.  

Repo rule:
	•	apps should almost never hand-roll OTLP env parsing themselves
	•	this package should centralize that parsing and validation

26. Sampling policy

This package must encode default sampling posture so apps do not improvise.

Locked shape:
	•	local/dev: high visibility, cheap sinks, verbose logs, permissive tracing
	•	test/CI: deterministic or no-op export, no network, fake exporters
	•	preview: export enabled when configured, moderate tracing
	•	production public sites: moderate tracing, very narrow browser telemetry
	•	production product apps: more valuable server-side tracing
	•	queue/webhook workers: explicit tracing with budget-aware defaults

Exact numbers belong in policies/sampling-policy.ts, but the structure above is fixed.

27. Redaction policy

Locked posture:
	•	redact by default
	•	strip auth-like headers
	•	recursively redact known sensitive keys
	•	redact sensitive query params
	•	truncate large bodies
	•	do not dump raw payloads casually
	•	serializers must not bypass redaction
	•	Sentry filters must reuse the same policy

28. Browser policy

Browser telemetry is allowed only for operational signals.

Allowed:
	•	web vitals
	•	selected uncaught client errors
	•	minimal navigation/performance context

Not allowed:
	•	product analytics events
	•	attribution state
	•	adtech identifiers
	•	funnel instrumentation
	•	feature-usage business metrics

29. Sentry policy

Sentry is not the default observability path.

Allowed only on approved high-value Next.js apps.

Rules:
	•	must use package-owned config builders
	•	must use package-owned filters
	•	must respect shared redaction rules
	•	must use custom OTel coexistence when the app already uses shared OTel bootstrap
	•	browser Sentry is opt-in, not automatic
	•	Edge Sentry is exceptional, not baseline

30. What must not exist in this package

These are drift signs and should not be created:

src/analytics/
src/reports/
src/dashboard/
src/business/
src/warehouse/
src/misc/
src/debug-all/
src/marketing/
src/feature-flags/

Also rejected by design:
	•	a large metrics platform layer
	•	collector deployment config in this package
	•	app-specific alerting rules
	•	feature/business event emitters
	•	direct warehouse/reporting logic

31. Expected usage outside the package

This plan assumes apps keep tiny local framework files and delegate into this package.

For Next apps:
	•	instrumentation.ts
	•	instrumentation-client.ts
	•	proxy.ts
	•	sentry.server.config.ts
	•	sentry.edge.config.ts only when truly needed

For Astro apps:
	•	src/middleware.ts
	•	tiny local setup files if required

That matches the current framework conventions for Next and Astro.  

32. Build order

Phase 1:
	•	top-level files
	•	export map
	•	core
	•	config
	•	logging
	•	tracing
	•	redaction

Phase 2:
	•	otel
	•	next
	•	astro

Phase 3:
	•	browser
	•	sentry

Phase 4:
	•	testing
	•	test suite
	•	README hardening
	•	package polish

33. Definition of done

packages/observability is done when:
	•	apps can bootstrap server telemetry consistently through shared Next and Astro adapters
	•	client bootstrap has a defined instrumentation-client path
	•	structured logs are standardized
	•	tracing helpers are standardized
	•	redaction is centralized and tested
	•	OTLP config is centralized
	•	Collector-first export is the default posture
	•	Sentry is selective and filtered
	•	browser telemetry remains narrow
	•	no business analytics logic has leaked in
	•	consumers do not need deep imports

34. Final locked decisions

These decisions are now fixed for this directory:
	•	include next/instrumentation-client.ts
	•	keep next/proxy.ts tiny
	•	include a narrow browser/ surface
	•	include sentry/edge.ts as optional, not primary
	•	include policies/ as internal policy code
	•	include otel/ as an advanced public subpath
	•	keep core/metrics.ts minimal
	•	structured logs are the main developer-facing log API
	•	default transport is OTLP/HTTP
	•	Collector-first export is the norm
	•	do not put collector deployment manifests in this package
	•	do not mix observability with analytics

This is the final source of truth for packages/observability.