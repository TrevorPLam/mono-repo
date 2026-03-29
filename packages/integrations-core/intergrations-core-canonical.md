# repo/integrations-core/intergrations-core-canonical.md

Below is the final source of truth for @repo/packages/integrations-core.

It is synchronized to the project context established across the canonical platform direction and the package-level architecture decisions for:
	•	@repo/contracts
	•	@repo/env
	•	@repo/db
	•	@repo/auth
	•	@repo/analytics
	•	@repo/observability
	•	monorepo security and deployment baselines
	•	the integrations architecture baseline already decided for the repo

This document is intended to stand on its own after this chat is deleted.

⸻

packages/integrations-core/ — Final Source of Truth

1. Purpose

packages/integrations-core is the shared integration infrastructure package for the monorepo.

It is the provider-neutral runtime spine that real adapter packages build on.

It exists to answer one question:

What reusable infrastructure should every real integration adapter share so apps and adapter packages do not each reinvent connection modeling, credentials, OAuth, webhook intake, queue jobs, retries, idempotency, trace propagation, and external API boundary handling?

This package is not a provider implementation package.

It is the common substrate for:
	•	connection and credential contracts
	•	OAuth primitives
	•	webhook challenge and delivery handling
	•	sync vocabulary
	•	queue/job envelopes
	•	retry, rate-limit, and pacing rules
	•	normalized error classification
	•	adapter runtime binding

⸻

2. Role in the monorepo

This package sits in the server-side infrastructure layer of the repo.

It must align with the project-wide baselines already established:
	•	pnpm + Turborepo monorepo
	•	compiled-first internal runtime packages
	•	apps bind context, packages define reusable infrastructure
	•	@repo/db owns storage and Prisma persistence
	•	@repo/contracts owns stable cross-package business/domain contracts
	•	@repo/env owns typed env access
	•	@repo/observability owns shared telemetry bootstrap and observability adapters
	•	OpenTelemetry-first observability
	•	Vercel Queues as the default async primitive
	•	QStash only when a provider workload truly needs quota-shaped external dispatch
	•	official Google libraries in provider packages for GA/Ads
	•	spec-backed REST adapters prefer openapi-typescript + openapi-fetch
	•	Meta adapters stay handwritten and runtime-validated unless the repo deliberately adopts a maintained spec/codegen path
	•	server-only discipline is mandatory for shared server modules
	•	no app-specific business workflow leakage into shared infra packages

This package should be:
	•	low-level
	•	provider-neutral
	•	Node-runtime-oriented
	•	idempotent by default
	•	queue-aware
	•	explicit rather than magical
	•	easy to compose
	•	hard to misuse
	•	not speculative
	•	not overbuilt

⸻

3. Final architectural decisions

These are the final decisions for this directory.

3.1 Core first, adapters second

packages/integrations-core comes first.

Real provider implementations live in real packages later, such as:
	•	packages/integrations-ga4/
	•	packages/integrations-google-ads/
	•	packages/integrations-meta/

No provider implementation code belongs in integrations-core.

3.2 Connection is first-class

The package does not assume:
	•	one org has only one connection per provider
	•	one provider maps to one external account
	•	one credential equals one connection forever

The package must model:
	•	multiple connections per org per provider
	•	one credential backing multiple external accounts/resources
	•	one connection linked to multiple external refs
	•	connection state and health separately from raw credential material

3.3 Credentials are multi-kind, not token-only

The package must support multiple credential kinds.

Canonical credential kinds:
	•	oauth_user
	•	oauth_service_account
	•	service_account
	•	api_key
	•	system_user_token
	•	app_secret_reference

This package must not force every provider into one “OAuth token set only” model.

3.4 App credentials and tenant credentials are separate

There are two credential layers:

App credentials
	•	provider app/client credentials
	•	developer tokens
	•	app secrets
	•	default API-version config tied to the firm/application

Tenant credentials
	•	org/connection-specific auth material
	•	OAuth token sets
	•	service-account references
	•	API key references
	•	system-user tokens

The package defines shapes and interfaces for both, but does not implement storage.

3.5 Webhook challenge and delivery are separate flows

The package must distinguish:
	•	endpoint verification / subscription challenge handling
	•	signed event delivery verification

These are not one generic operation.

3.6 Queue messages must be minimal, versioned, and pointer-based

Queue envelopes must stay small and stable.

They carry:
	•	identifiers
	•	minimal metadata
	•	cursor/checkpoint info
	•	correlation/trace context
	•	payload references when needed

They do not carry:
	•	giant raw webhook payloads
	•	large sync pages
	•	arbitrary blobs
	•	business objects that should be re-fetched or loaded elsewhere

3.7 Idempotency is mandatory

All retrying and external-delivery surfaces must assume duplicates:
	•	webhooks
	•	queue redelivery
	•	token refresh flows
	•	sync jobs
	•	health checks
	•	outbound requests with idempotency support

3.8 Vercel Queues are the default queue primitive

This package assumes Vercel Queues.

Do not create a generic queue abstraction framework.

vercel-queues.ts should stay thin and explicit.

3.9 QStash is an exception, not the default

Nothing in integrations-core assumes QStash.

If a later provider package truly needs quota-shaped outbound flow control, that is a deliberate adapter/app-level exception.

3.10 OAuth rules are strict

Canonical OAuth rules for this package:
	•	authorization code flow only
	•	PKCE by default
	•	exact redirect URI matching
	•	opaque state with TTL and integrity protection
	•	nonce supported separately where the protocol needs it
	•	refresh tokens treated as revocable, rotatable, and possibly expiring
	•	granted-vs-required scope comparison is first-class

No implicit flow support.

3.11 Runtime validation remains necessary

Even when an adapter uses generated types from openapi-typescript + openapi-fetch, external boundaries still need runtime guards where correctness matters.

Generated typing is not runtime trust.

3.12 Apps bind runtime context

Per-app runtime binding belongs in apps/*/lib/integrations.ts.

Apps bind:
	•	org context
	•	credential store implementations
	•	connection store implementations
	•	queue clients
	•	logger/tracing context
	•	payload-ref persistence hooks if needed
	•	adapter registry composition

integrations-core defines the contracts and helper surfaces.

3.13 This package is server-only and Node-runtime-oriented

It is not a browser package.

It is not an Edge-first package.

It is designed for server runtimes, especially the Node runtime used by protected Next.js app code and server-side integration workers.

⸻

4. Hard boundaries with other packages

@repo/contracts

@repo/contracts owns stable cross-package business/domain contracts.

@repo/integrations-core owns runtime/orchestration/transport/infrastructure contracts for external integrations.

Rule:
	•	if it is a business/domain contract reused across layers, it belongs in @repo/contracts
	•	if it is an integration runtime mechanism, it belongs in @repo/integrations-core

@repo/db

@repo/db owns persistence.

integrations-core may define interfaces like CredentialStore or ConnectionStore, but may not implement them against Prisma/DB here.

@repo/env

integrations-core should not read raw process.env.

If package-level env access is ever required, it must go through @repo/env, but the preferred model is still injected app credentials rather than direct env reads inside core.

@repo/observability

integrations-core must not own telemetry bootstrap.

It may define trace/correlation propagation helpers and accept injected logger/tracing context, but it should not become an observability framework.

@repo/auth

This package must not depend on auth/session logic.

Auth belongs in @repo/auth and app DALs, not in integration infrastructure.

@repo/analytics

This package must not contain business analytics or KPI tracking logic.

⸻

5. What this package owns

It owns:
	•	provider-agnostic integration contracts
	•	provider vocabulary and metadata
	•	connection runtime shapes and lifecycle helpers
	•	credential runtime shapes and store interfaces
	•	OAuth primitives
	•	webhook verification and normalization primitives
	•	sync cursor/checkpoint/window/result vocabulary
	•	queue job envelope and retry primitives
	•	idempotency and dedupe helpers
	•	rate-limit and pacing helpers
	•	provider-neutral error normalization
	•	HTTP boundary helpers for adapters
	•	runtime adapter registry and binding helpers
	•	integration-specific testing fakes and fixtures

It does not own:
	•	provider-specific SDK logic
	•	provider-specific request/response business logic
	•	app-specific workflow orchestration
	•	UI for connected accounts
	•	token storage implementation
	•	tenant resolution implementation
	•	reporting or analytics dashboards
	•	sync-result persistence
	•	global queue abstractions for unrelated workloads
	•	speculative “future maybe” adapter code

⸻

6. Final directory tree

packages/integrations-core/
├─ package.json
├─ tsconfig.json
├─ tsup.config.ts
├─ README.md
├─ src/
│  ├─ index.ts
│  ├─ contracts/
│  │  ├─ index.ts
│  │  ├─ provider.ts
│  │  ├─ capabilities.ts
│  │  ├─ adapter.ts
│  │  ├─ connection.ts
│  │  ├─ context.ts
│  │  ├─ credentials.ts
│  │  ├─ oauth.ts
│  │  ├─ webhook.ts
│  │  ├─ sync.ts
│  │  ├─ jobs.ts
│  │  ├─ rate-limit.ts
│  │  └─ failure.ts
│  ├─ provider/
│  │  ├─ index.ts
│  │  ├─ ids.ts
│  │  ├─ categories.ts
│  │  ├─ metadata.ts
│  │  └─ capabilities-map.ts
│  ├─ connection/
│  │  ├─ index.ts
│  │  ├─ connection-id.ts
│  │  ├─ connection-state.ts
│  │  ├─ external-account-ref.ts
│  │  ├─ connection-health.ts
│  │  ├─ connection-store.ts
│  │  ├─ lifecycle.ts
│  │  └─ reauth.ts
│  ├─ oauth/
│  │  ├─ index.ts
│  │  ├─ state.ts
│  │  ├─ pkce.ts
│  │  ├─ nonce.ts
│  │  ├─ callback.ts
│  │  ├─ scopes.ts
│  │  ├─ redirect-uri.ts
│  │  ├─ token-response.ts
│  │  └─ refresh-lifecycle.ts
│  ├─ credentials/
│  │  ├─ index.ts
│  │  ├─ credential-kind.ts
│  │  ├─ credential-store.ts
│  │  ├─ app-credentials.ts
│  │  ├─ tenant-credentials.ts
│  │  ├─ token-shapes.ts
│  │  ├─ token-expiry.ts
│  │  ├─ token-refresh.ts
│  │  ├─ secret-reference.ts
│  │  └─ encryption-metadata.ts
│  ├─ webhooks/
│  │  ├─ index.ts
│  │  ├─ raw-body.ts
│  │  ├─ delivery-metadata.ts
│  │  ├─ verify-signature.ts
│  │  ├─ subscription-challenge.ts
│  │  ├─ event-envelope.ts
│  │  ├─ intake.ts
│  │  ├─ enqueue.ts
│  │  ├─ idempotency.ts
│  │  └─ payload-ref.ts
│  ├─ sync/
│  │  ├─ index.ts
│  │  ├─ cursors.ts
│  │  ├─ checkpoints.ts
│  │  ├─ sync-window.ts
│  │  ├─ sync-mode.ts
│  │  ├─ sync-result.ts
│  │  ├─ incremental.ts
│  │  ├─ full-sync.ts
│  │  └─ replay.ts
│  ├─ queue/
│  │  ├─ index.ts
│  │  ├─ job-types.ts
│  │  ├─ job-envelope.ts
│  │  ├─ enqueue-job.ts
│  │  ├─ retry-policy.ts
│  │  ├─ dedupe-key.ts
│  │  ├─ failure-record.ts
│  │  ├─ replay-job.ts
│  │  ├─ poison-message.ts
│  │  └─ vercel-queues.ts
│  ├─ rate-limit/
│  │  ├─ index.ts
│  │  ├─ backoff.ts
│  │  ├─ retryable.ts
│  │  ├─ quotas.ts
│  │  ├─ concurrency.ts
│  │  ├─ pacing.ts
│  │  └─ windows.ts
│  ├─ http/
│  │  ├─ index.ts
│  │  ├─ create-client.ts
│  │  ├─ openapi-client.ts
│  │  ├─ request-context.ts
│  │  ├─ api-version.ts
│  │  ├─ idempotency-key.ts
│  │  ├─ conditional.ts
│  │  ├─ retries.ts
│  │  ├─ pagination.ts
│  │  └─ response-guards.ts
│  ├─ errors/
│  │  ├─ index.ts
│  │  ├─ integration-errors.ts
│  │  ├─ auth-errors.ts
│  │  ├─ credential-errors.ts
│  │  ├─ webhook-errors.ts
│  │  ├─ sync-errors.ts
│  │  ├─ queue-errors.ts
│  │  ├─ map-http-error.ts
│  │  └─ retry-classification.ts
│  ├─ runtime/
│  │  ├─ index.ts
│  │  ├─ adapter-registry.ts
│  │  ├─ bind-context.ts
│  │  ├─ resolve-provider.ts
│  │  ├─ trace-context.ts
│  │  └─ feature-flags.ts
│  ├─ validation/
│  │  ├─ index.ts
│  │  ├─ provider-ids.ts
│  │  ├─ connection-ids.ts
│  │  ├─ account-ids.ts
│  │  ├─ webhook-headers.ts
│  │  ├─ cursor-shapes.ts
│  │  ├─ scope-shapes.ts
│  │  └─ job-envelope.ts
│  ├─ types/
│  │  ├─ provider.ts
│  │  ├─ runtime.ts
│  │  ├─ connection.ts
│  │  ├─ oauth.ts
│  │  ├─ credentials.ts
│  │  ├─ webhook.ts
│  │  ├─ sync.ts
│  │  ├─ queue.ts
│  │  └─ http.ts
│  ├─ internal/
│  │  ├─ constants.ts
│  │  ├─ defaults.ts
│  │  ├─ schema-helpers.ts
│  │  ├─ result.ts
│  │  └─ server-only.ts
│  └─ testing/
│     ├─ index.ts
│     ├─ fake-adapter.ts
│     ├─ fake-connection-store.ts
│     ├─ fake-credential-store.ts
│     ├─ webhook-fixtures.ts
│     ├─ sync-fixtures.ts
│     ├─ queue-fixtures.ts
│     └─ http-fixtures.ts
└─ test/
   ├─ setup.ts
   ├─ contracts/
   │  ├─ adapter-contracts.test.ts
   │  ├─ capability-matrix.test.ts
   │  └─ connection-contracts.test.ts
   ├─ provider/
   │  ├─ ids.test.ts
   │  ├─ metadata.test.ts
   │  └─ capabilities-map.test.ts
   ├─ connection/
   │  ├─ connection-id.test.ts
   │  ├─ connection-state.test.ts
   │  ├─ external-account-ref.test.ts
   │  ├─ connection-health.test.ts
   │  ├─ lifecycle.test.ts
   │  └─ reauth.test.ts
   ├─ oauth/
   │  ├─ state.test.ts
   │  ├─ pkce.test.ts
   │  ├─ nonce.test.ts
   │  ├─ callback.test.ts
   │  ├─ scopes.test.ts
   │  ├─ redirect-uri.test.ts
   │  ├─ token-response.test.ts
   │  └─ refresh-lifecycle.test.ts
   ├─ credentials/
   │  ├─ credential-kind.test.ts
   │  ├─ app-credentials.test.ts
   │  ├─ tenant-credentials.test.ts
   │  ├─ token-shapes.test.ts
   │  ├─ token-expiry.test.ts
   │  ├─ token-refresh.test.ts
   │  ├─ secret-reference.test.ts
   │  └─ encryption-metadata.test.ts
   ├─ webhooks/
   │  ├─ raw-body.test.ts
   │  ├─ delivery-metadata.test.ts
   │  ├─ verify-signature.test.ts
   │  ├─ subscription-challenge.test.ts
   │  ├─ event-envelope.test.ts
   │  ├─ intake.test.ts
   │  ├─ enqueue.test.ts
   │  ├─ idempotency.test.ts
   │  └─ payload-ref.test.ts
   ├─ sync/
   │  ├─ cursors.test.ts
   │  ├─ checkpoints.test.ts
   │  ├─ sync-window.test.ts
   │  ├─ sync-mode.test.ts
   │  ├─ sync-result.test.ts
   │  ├─ incremental.test.ts
   │  ├─ full-sync.test.ts
   │  └─ replay.test.ts
   ├─ queue/
   │  ├─ job-types.test.ts
   │  ├─ job-envelope.test.ts
   │  ├─ enqueue-job.test.ts
   │  ├─ retry-policy.test.ts
   │  ├─ dedupe-key.test.ts
   │  ├─ failure-record.test.ts
   │  ├─ replay-job.test.ts
   │  ├─ poison-message.test.ts
   │  └─ vercel-queues.test.ts
   ├─ rate-limit/
   │  ├─ backoff.test.ts
   │  ├─ retryable.test.ts
   │  ├─ quotas.test.ts
   │  ├─ concurrency.test.ts
   │  ├─ pacing.test.ts
   │  └─ windows.test.ts
   ├─ http/
   │  ├─ create-client.test.ts
   │  ├─ openapi-client.test.ts
   │  ├─ request-context.test.ts
   │  ├─ api-version.test.ts
   │  ├─ idempotency-key.test.ts
   │  ├─ conditional.test.ts
   │  ├─ retries.test.ts
   │  ├─ pagination.test.ts
   │  └─ response-guards.test.ts
   ├─ errors/
   │  ├─ integration-errors.test.ts
   │  ├─ auth-errors.test.ts
   │  ├─ credential-errors.test.ts
   │  ├─ webhook-errors.test.ts
   │  ├─ sync-errors.test.ts
   │  ├─ queue-errors.test.ts
   │  ├─ map-http-error.test.ts
   │  └─ retry-classification.test.ts
   └─ runtime/
      ├─ adapter-registry.test.ts
      ├─ bind-context.test.ts
      ├─ resolve-provider.test.ts
      ├─ trace-context.test.ts
      └─ feature-flags.test.ts


⸻

7. Top-level file plan

package.json

This is a compiled runtime package with explicit public subpath exports.

It must include:
	•	package name @repo/integrations-core
	•	ESM package configuration
	•	build, clean, lint, test, and typecheck scripts
	•	explicit exports map
	•	types entry
	•	side-effect declaration kept conservative
	•	only the dependencies actually needed for low-level core functionality

Required scripts
At minimum:
	•	build
	•	clean
	•	lint
	•	test
	•	typecheck

Public exports
Canonical public entrypoints:
	•	@repo/integrations-core
	•	@repo/integrations-core/contracts
	•	@repo/integrations-core/provider
	•	@repo/integrations-core/connection
	•	@repo/integrations-core/oauth
	•	@repo/integrations-core/credentials
	•	@repo/integrations-core/webhooks
	•	@repo/integrations-core/sync
	•	@repo/integrations-core/queue
	•	@repo/integrations-core/rate-limit
	•	@repo/integrations-core/http
	•	@repo/integrations-core/errors
	•	@repo/integrations-core/runtime
	•	@repo/integrations-core/testing

Not publicly exported:
	•	internal/*
	•	raw src/... paths
	•	package-private validation helpers unless deliberately promoted later

tsconfig.json

Strict, server-oriented, compiled-first.

Rules:
	•	strict typechecking
	•	no sloppy optional handling
	•	declaration-friendly output
	•	no browser-bundle assumptions
	•	compatible with the workspace TypeScript baseline
	•	intended for Node/server usage, though compatible with standard Request/Response-shaped inputs

tsup.config.ts

Standard compiled runtime package build.

Requirements:
	•	ESM output
	•	declarations
	•	multiple entrypoints matching exports map
	•	sourcemaps
	•	clean dist
	•	preserve server-only boundaries
	•	no browser bundle target

README.md

This README is authoritative for package usage.

It must explain:
	•	purpose and role
	•	what belongs in core vs provider packages vs apps
	•	connection model
	•	credential model
	•	OAuth rules
	•	webhook challenge vs signed delivery rules
	•	queue envelope rules
	•	retry/failure/replay rules
	•	trace propagation expectations
	•	how apps/*/lib/integrations.ts should bind runtime context
	•	how to create a new real provider package
	•	forbidden patterns and drift signs

⸻

8. Public API philosophy

The root export should stay conservative.

src/index.ts should expose:
	•	the most important contracts
	•	provider vocabulary
	•	connection/credential/OAuth entrypoints
	•	webhook/sync/queue entrypoints
	•	normalized errors
	•	runtime binding surface

It must not flatten every file in the package into one giant surface.

Consumers should know whether they are importing:
	•	contracts
	•	credentials
	•	oauth
	•	webhooks
	•	sync
	•	queue
	•	rate-limit
	•	http
	•	runtime

⸻

9. File-by-file plan

src/index.ts

Root barrel for stable, high-value exports only.

It should re-export:
	•	essential contracts
	•	provider IDs and categories
	•	connection primitives
	•	credential/OAuth primitives
	•	webhook/sync/queue entrypoints
	•	error primitives
	•	runtime registry/binding entrypoints

It should not expose internal helpers or validation internals.

⸻

src/contracts/

This folder defines the main runtime contracts of the package.

contracts/index.ts

Barrel for approved contract exports.

contracts/provider.ts

Defines provider identity/runtime metadata contracts.

Owns shapes for:
	•	provider ID
	•	provider display name/label
	•	provider category
	•	provider metadata summary
	•	capability summary reference

contracts/capabilities.ts

Defines capability vocabulary.

Canonical capability groups include:
	•	auth capabilities
	•	webhook capabilities
	•	sync capabilities
	•	account-discovery capabilities
	•	refresh capabilities
	•	connection-health capabilities

This must be explicit and typed.

contracts/adapter.ts

The most important contract file in the package.

Defines the adapter surface.

Adapter capability blocks may include:
	•	auth start/connect
	•	callback exchange
	•	credential refresh
	•	subscription challenge handling
	•	webhook delivery verification
	•	webhook normalization
	•	incremental sync
	•	full sync
	•	connection validation/health check
	•	account/resource discovery

The contract should prefer explicit capability sections over inheritance-heavy abstractions.

contracts/connection.ts

Defines the first-class connection model.

Must support:
	•	connectionId
	•	organizationId
	•	provider
	•	credentialKind
	•	externalAccountRefs
	•	connection state
	•	connection health
	•	timestamps like last sync / last validation / reauth needed
	•	runtime-safe connection metadata

contracts/context.ts

Defines the bound runtime context injected into adapters.

Must include interfaces or hooks for:
	•	organization context
	•	logger
	•	trace/correlation context
	•	clock/time helpers
	•	credential store
	•	connection store
	•	queue interface
	•	optional feature flags
	•	optional payload-ref persistence hooks when needed

Adapters must receive bound context rather than reaching into app globals.

contracts/credentials.ts

Defines credential-related contracts:
	•	app credential shape contracts
	•	tenant credential shape contracts
	•	credential-store interfaces
	•	refresh result contracts
	•	invalidation/revocation contracts

contracts/oauth.ts

Defines OAuth-specific contracts:
	•	authorization URL build result
	•	callback input/result
	•	state payload assumptions
	•	scope requirements/grants
	•	token normalization shape
	•	refresh lifecycle result

contracts/webhook.ts

Defines webhook contracts for:
	•	raw delivery metadata
	•	signature verification result
	•	challenge result
	•	normalized event envelope
	•	enqueue-ready result
	•	payload ref usage

contracts/sync.ts

Defines sync contracts:
	•	sync mode
	•	cursor input/output
	•	checkpoint shape
	•	sync result summary
	•	replay intent
	•	overlap/lookback semantics

contracts/jobs.ts

Defines queue job contracts:
	•	job kind
	•	schema version
	•	dedupe key
	•	attempt metadata
	•	correlation metadata
	•	trace carrier shape
	•	payload ref
	•	enqueue result

contracts/rate-limit.ts

Defines quota and pacing contracts:
	•	quota window
	•	retry-after metadata
	•	concurrency bucket
	•	pacing descriptor
	•	rate-limit snapshot

contracts/failure.ts

Defines failure and replay contracts:
	•	terminal failure record shape
	•	retry exhaustion metadata
	•	poison-message classification
	•	replay request metadata
	•	operator-action-required markers

⸻

src/provider/

Provider vocabulary and lightweight provider metadata live here.

provider/index.ts

Barrel for provider exports.

provider/ids.ts

Canonical provider identifiers and helper types.

No provider implementation logic here.

provider/categories.ts

Provider category vocabulary, such as:
	•	ads
	•	analytics
	•	crm
	•	payments
	•	messaging
	•	ecommerce
	•	scheduling
	•	identity

provider/metadata.ts

Display-safe provider metadata.

May include:
	•	display name
	•	category
	•	auth mode hints
	•	lightweight docs label
	•	safe capability summary reference

provider/capabilities-map.ts

Maps provider metadata to capability declarations where helpful.

Must stay metadata-level, not implementation-level.

⸻

src/connection/

First-class connection modeling lives here.

connection/index.ts

Barrel for connection exports.

connection/connection-id.ts

Connection ID normalization and helper utilities.

Must enforce a stable connection identifier shape.

connection/connection-state.ts

Canonical connection lifecycle states.

At minimum:
	•	disconnected
	•	pending_auth
	•	connected
	•	degraded
	•	reauth_required
	•	disabled
	•	error

connection/external-account-ref.ts

Defines external account/resource references.

Supports:
	•	provider-specific opaque IDs
	•	optional parent-child relationships
	•	safe display labels
	•	multiple refs per connection

connection/connection-health.ts

Canonical health summary shapes.

Examples:
	•	healthy
	•	warning
	•	degraded
	•	broken

Health is separate from lifecycle state.

connection/connection-store.ts

Interface for connection persistence operations.

Examples:
	•	get by connection ID
	•	list connections for org/provider
	•	upsert metadata/state
	•	update health
	•	mark reauth required
	•	attach/update external refs
	•	update last sync / validation timestamps

This is an interface only. DB implementation belongs outside this package.

connection/lifecycle.ts

Helpers for legal state transitions and lifecycle event handling.

Prevents ad hoc state mutation rules.

connection/reauth.ts

Helpers and shapes for reauth-needed semantics.

Must make “reauth required soon/now” explicit and reusable.

⸻

src/oauth/

Reusable OAuth primitives only.

No provider-specific exchange logic belongs here.

oauth/index.ts

Barrel for OAuth exports.

oauth/state.ts

Security-critical state generation and verification.

Rules:
	•	opaque
	•	integrity protected
	•	TTL-bound
	•	minimal safe payload only
	•	no sensitive internal leakage

oauth/pkce.ts

PKCE generation and normalization helpers.

PKCE is the default expectation for auth code flows.

oauth/nonce.ts

Nonce helpers separate from state where protocol meaning differs.

oauth/callback.ts

Normalized callback orchestration helpers.

Handles:
	•	callback input normalization
	•	common validation outcomes
	•	generic result shape

It does not perform provider token exchange itself.

oauth/scopes.ts

Scope normalization and comparison helpers.

Must solve:
	•	order-independent comparison
	•	missing scopes
	•	extra scopes
	•	granted-vs-required summaries
	•	display-safe scope drift reporting

oauth/redirect-uri.ts

Redirect URI composition and exact-match validation helpers.

oauth/token-response.ts

Canonical token response normalization shapes.

Turns provider token responses into stable internal structures.

oauth/refresh-lifecycle.ts

Refresh lifecycle helpers.

Must model:
	•	refresh eligibility
	•	refresh-needed thresholds
	•	refresh rotation outcomes
	•	reauth-required fallback
	•	refresh-expiry-aware behavior when known

⸻

src/credentials/

Credential surfaces for both app-level and tenant-level auth material.

credentials/index.ts

Barrel for credentials exports.

credentials/credential-kind.ts

Canonical credential kind vocabulary and type guards.

This file is authoritative.

credentials/credential-store.ts

Core credential store interface.

Must support:
	•	fetch tenant credentials by connection or org/provider context
	•	upsert/update tenant credentials
	•	mark invalid
	•	record refresh outcomes
	•	record disconnect/revoke metadata
	•	resolve app credentials where needed through safe indirection

This is an interface only.

credentials/app-credentials.ts

Shapes for app-level credentials.

Examples:
	•	client ID reference
	•	client secret reference
	•	developer token reference
	•	app secret reference
	•	API version pinning metadata if tied to credential config

These are usually env-backed or secret-store-backed.

credentials/tenant-credentials.ts

Shapes for tenant-bound credentials.

Examples:
	•	OAuth token set
	•	service-account material reference
	•	API key reference
	•	system-user token metadata

credentials/token-shapes.ts

Canonical token-set shapes.

Must support:
	•	access token
	•	refresh token
	•	token type
	•	scopes
	•	access expiry
	•	refresh expiry if known
	•	issued-at/auth-time metadata when useful
	•	external subject/account hints

credentials/token-expiry.ts

Helpers for expiry evaluation and refresh thresholds.

credentials/token-refresh.ts

Provider-neutral refresh orchestration helpers.

Not the provider exchange implementation.

credentials/secret-reference.ts

Shape for secret indirection/reference.

Important because not all credentials should be carried raw through runtime objects.

credentials/encryption-metadata.ts

Metadata for encrypted-at-rest credential storage.

Examples:
	•	key version
	•	encrypted-at timestamp
	•	last rotated at
	•	method marker

No crypto implementation here.

⸻

src/webhooks/

Webhook intake is one of the highest-value parts of this package.

webhooks/index.ts

Barrel for webhook exports.

webhooks/raw-body.ts

Helpers and conventions for reading/preserving raw request bodies.

Critical because signature verification depends on exact bytes.

webhooks/delivery-metadata.ts

Canonical delivery metadata extraction and normalization.

Examples:
	•	delivery ID
	•	event timestamp
	•	signature headers
	•	retry indicator
	•	content type
	•	source IP metadata if the app provides it

webhooks/verify-signature.ts

Shared signature verification orchestration.

Defines the pattern and result contracts, not provider-specific algorithms.

webhooks/subscription-challenge.ts

Dedicated support for endpoint verification or subscription challenge flows.

Mandatory and separate from signed event delivery verification.

webhooks/event-envelope.ts

Canonical normalized webhook envelope.

Should include:
	•	provider
	•	event type
	•	external event ID if available
	•	delivery ID
	•	connection hint
	•	organization hint if known
	•	external account refs if known
	•	received timestamp
	•	minimal normalized payload or payload ref
	•	correlation/trace metadata

webhooks/intake.ts

Shared webhook intake flow.

Canonical path:
	1.	receive raw request-compatible primitives
	2.	detect challenge vs delivery
	3.	verify appropriately
	4.	normalize metadata
	5.	generate idempotency/dedupe key
	6.	produce payload ref if needed
	7.	return enqueue-ready result fast

webhooks/enqueue.ts

Shared enqueue helper for normalized webhook deliveries.

webhooks/idempotency.ts

Webhook-specific dedupe/idempotency helpers.

Must distinguish between:
	•	delivery-level dedupe
	•	logical event-level dedupe

webhooks/payload-ref.ts

Shapes and helpers for referencing large stored payloads outside queue messages.

Exists because queue messages must remain small.

⸻

src/sync/

Standardized sync vocabulary and helpers.

sync/index.ts

Barrel for sync exports.

sync/cursors.ts

Cursor shapes and helpers.

Must support:
	•	opaque cursors
	•	page tokens
	•	watermarks
	•	compound cursors

sync/checkpoints.ts

Checkpoint shapes and helpers for durable sync progress.

sync/sync-window.ts

Window helpers for bounded sync periods.

Must support:
	•	lookback
	•	overlap
	•	replay windows
	•	explicit start/end windows

sync/sync-mode.ts

Canonical sync modes.

At minimum:
	•	incremental
	•	full
	•	backfill
	•	replay

sync/sync-result.ts

Canonical sync result summary.

Should include:
	•	records seen
	•	created
	•	updated
	•	skipped
	•	failed
	•	next cursor
	•	checkpoint status
	•	partial/final status
	•	retry recommendation

sync/incremental.ts

Helpers for incremental sync orchestration vocabulary.

sync/full-sync.ts

Helpers for full sync orchestration vocabulary.

sync/replay.ts

Replay-specific helpers.

Important because recovery and reprocessing are first-class concepts.

⸻

src/queue/

Default queue contract layer for integration jobs.

queue/index.ts

Barrel for queue exports.

queue/job-types.ts

Canonical job kinds.

At minimum:
	•	webhook process
	•	token refresh
	•	connection validate
	•	connection account/resource discovery
	•	full sync
	•	incremental sync
	•	replay sync
	•	payload normalize/fetch if needed

queue/job-envelope.ts

Canonical job envelope.

This is one of the most important files in the package.

Required conceptual fields include:
	•	schemaVersion
	•	jobKind
	•	provider
	•	organizationId
	•	connectionId when relevant
	•	dedupeKey
	•	attempt metadata
	•	correlation ID
	•	trace metadata/carrier
	•	cursor/checkpoint references
	•	payload ref
	•	small job-specific metadata only

No large payloads.

queue/enqueue-job.ts

Shared enqueue helper that assembles a consistent job envelope.

queue/retry-policy.ts

Queue-level retry policy helpers.

Distinct from raw backoff math.

queue/dedupe-key.ts

Helpers for stable queue dedupe keys.

queue/failure-record.ts

Canonical terminal failure record shape.

Must be:
	•	small
	•	durable
	•	replay-friendly
	•	safe for logging or persistence

queue/replay-job.ts

Helpers for generating replay jobs from failure records or operator actions.

queue/poison-message.ts

Helpers and rules for retry exhaustion and poison-message classification.

The platform does not define the repo’s operational policy for this, so the package must.

queue/vercel-queues.ts

Thin Vercel Queues binding helpers.

Must stay thin and explicit.

⸻

src/rate-limit/

Shared quota/retry/pacing infrastructure.

rate-limit/index.ts

Barrel for rate-limit exports.

rate-limit/backoff.ts

Backoff helpers:
	•	exponential
	•	capped
	•	jittered

rate-limit/retryable.ts

Helpers for retryability decisions.

Must cooperate with normalized error classification.

rate-limit/quotas.ts

Quota shapes and helpers.

rate-limit/concurrency.ts

Concurrency shaping helpers for provider- or account-level parallelism control.

rate-limit/pacing.ts

Helpers for paced dispatch when quotas are known.

rate-limit/windows.ts

Time-window helpers for quota and retry timing.

⸻

src/http/

Shared outbound HTTP boundary helpers.

This does not replace official SDKs where the repo already decided to use them.

http/index.ts

Barrel for HTTP exports.

http/create-client.ts

Shared client creation conventions.

Should standardize:
	•	base headers
	•	timeout handling
	•	retry hooks
	•	trace header injection
	•	safe request metadata

http/openapi-client.ts

Helper for spec-backed REST adapters using the repo-preferred default.

http/request-context.ts

Outbound request metadata helpers.

Should support:
	•	correlation IDs
	•	trace carrier injection
	•	retry attempt metadata
	•	tenant-safe request tags

http/api-version.ts

Helpers for explicit API-version header or option handling.

http/idempotency-key.ts

Helpers for outbound idempotency keys when provider APIs support them.

http/conditional.ts

Helpers for conditional requests.

Examples:
	•	ETag
	•	If-None-Match
	•	If-Modified-Since

http/retries.ts

HTTP retry orchestration.

http/pagination.ts

Generic pagination helpers.

http/response-guards.ts

Runtime response validation or guard helpers.

Required in principle even if kept lightweight.

⸻

src/errors/

Normalized integration error system.

errors/index.ts

Barrel for error exports.

errors/integration-errors.ts

Canonical provider-neutral error classes or tagged variants.

Should include categories such as:
	•	auth failure
	•	credential invalid
	•	rate limited
	•	transient upstream failure
	•	permanent upstream failure
	•	invalid webhook signature
	•	unsupported capability
	•	sync conflict
	•	replay required
	•	operator action required

errors/auth-errors.ts

OAuth/auth-specific normalized errors.

errors/credential-errors.ts

Credential and secret-related errors.

errors/webhook-errors.ts

Webhook verification and intake errors.

errors/sync-errors.ts

Sync orchestration and cursor/checkpoint errors.

errors/queue-errors.ts

Queue/replay/failure-path errors.

errors/map-http-error.ts

Maps raw HTTP/transport/provider failures into normalized integration errors.

errors/retry-classification.ts

Classifies errors into:
	•	retryable
	•	terminal
	•	operator-action-required

This is critical for queue behavior.

⸻

src/runtime/

Runtime glue for adapter composition.

runtime/index.ts

Barrel for runtime exports.

runtime/adapter-registry.ts

Registry structure for available adapters.

Must be explicit and typed.

runtime/bind-context.ts

Binds runtime context into adapter instances.

This must align with app-level apps/*/lib/integrations.ts.

runtime/resolve-provider.ts

Provider-to-adapter resolution.

runtime/trace-context.ts

Trace propagation helpers.

Must align with the repo’s OpenTelemetry-first posture and support propagation across:
	•	inbound webhook to queue job
	•	queue job to outbound provider request
	•	retry/replay paths

runtime/feature-flags.ts

Only integration-runtime infrastructure toggles belong here.

No product feature flags.

⸻

src/validation/

Runtime validation helpers for integration primitives.

These are primarily package-internal unless a concrete shared use case appears.

validation/index.ts

Barrel only if any validation helpers are intentionally public. Otherwise keep this narrow.

validation/provider-ids.ts

Provider ID validation.

validation/connection-ids.ts

Connection ID validation.

validation/account-ids.ts

External account/resource ID validation.

validation/webhook-headers.ts

Required header validation for webhook flows.

validation/cursor-shapes.ts

Cursor structure validation.

validation/scope-shapes.ts

Scope normalization validation.

validation/job-envelope.ts

Queue job envelope validation.

⸻

src/types/

Package-specific TypeScript helper types only.

This folder is not a dumping ground.

types/provider.ts

Provider helper types.

types/runtime.ts

Runtime helper types.

types/connection.ts

Connection helper types.

types/oauth.ts

OAuth helper types.

types/credentials.ts

Credential helper types.

types/webhook.ts

Webhook helper types.

types/sync.ts

Sync helper types.

types/queue.ts

Queue helper types.

types/http.ts

HTTP helper types.

⸻

src/internal/

Package-private implementation helpers.

Never publicly exported.

internal/constants.ts

Internal names and constants.

internal/defaults.ts

Package default values.

internal/schema-helpers.ts

Small internal validation helpers.

internal/result.ts

Small internal result/utility helpers if needed.

internal/server-only.ts

Server-only boundary marker/import.

This package should use server-only discipline aggressively.

⸻

src/testing/

Shared test fixtures and fakes for internal tests and downstream consumers.

testing/index.ts

Barrel for testing exports.

testing/fake-adapter.ts

Fake adapter for runtime/app binding tests.

testing/fake-connection-store.ts

Fake connection store implementation.

testing/fake-credential-store.ts

Fake credential store implementation.

testing/webhook-fixtures.ts

Reusable webhook fixtures.

testing/sync-fixtures.ts

Reusable sync fixtures.

testing/queue-fixtures.ts

Reusable queue fixtures.

testing/http-fixtures.ts

Reusable outbound HTTP fixtures.

⸻

10. Test file plan

test/setup.ts

Common test setup for package tests.

test/contracts/
	•	adapter-contracts.test.ts — validates adapter contract assumptions and required capability shape.
	•	capability-matrix.test.ts — validates capability combinations and typing.
	•	connection-contracts.test.ts — validates connection contract invariants.

test/provider/
	•	ids.test.ts — validates provider ID vocabulary and helpers.
	•	metadata.test.ts — validates provider metadata completeness and safe shape.
	•	capabilities-map.test.ts — validates provider-to-capability summaries.

test/connection/
	•	connection-id.test.ts — stable connection ID shape and normalization.
	•	connection-state.test.ts — lifecycle state set and state semantics.
	•	external-account-ref.test.ts — multiple-account/reference modeling.
	•	connection-health.test.ts — health state normalization.
	•	lifecycle.test.ts — legal connection state transitions.
	•	reauth.test.ts — reauth-required semantics and transitions.

test/oauth/
	•	state.test.ts — state generation, TTL, integrity, invalid-state cases.
	•	pkce.test.ts — verifier/challenge generation and matching.
	•	nonce.test.ts — nonce generation and validation.
	•	callback.test.ts — callback normalization and edge cases.
	•	scopes.test.ts — scope normalization and comparison.
	•	redirect-uri.test.ts — exact redirect URI matching logic.
	•	token-response.test.ts — token response normalization.
	•	refresh-lifecycle.test.ts — refresh eligibility and reauth fallback.

test/credentials/
	•	credential-kind.test.ts — credential kind vocabulary and guards.
	•	app-credentials.test.ts — app credential shape semantics.
	•	tenant-credentials.test.ts — tenant credential shape semantics.
	•	token-shapes.test.ts — token model normalization.
	•	token-expiry.test.ts — expiry/refresh threshold logic.
	•	token-refresh.test.ts — provider-neutral refresh orchestration helpers.
	•	secret-reference.test.ts — secret ref shape handling.
	•	encryption-metadata.test.ts — encrypted-at-rest metadata invariants.

test/webhooks/
	•	raw-body.test.ts — raw body preservation assumptions.
	•	delivery-metadata.test.ts — delivery header/metadata normalization.
	•	verify-signature.test.ts — signature verification orchestration contract.
	•	subscription-challenge.test.ts — challenge flow handling.
	•	event-envelope.test.ts — normalized webhook envelope shape.
	•	intake.test.ts — challenge-vs-delivery intake branching.
	•	enqueue.test.ts — enqueue-ready webhook behavior.
	•	idempotency.test.ts — delivery and logical-event dedupe keys.
	•	payload-ref.test.ts — payload ref behavior for large bodies.

test/sync/
	•	cursors.test.ts — cursor normalization and stability.
	•	checkpoints.test.ts — checkpoint semantics.
	•	sync-window.test.ts — overlap/lookback/replay windows.
	•	sync-mode.test.ts — sync mode vocabulary.
	•	sync-result.test.ts — canonical sync result summaries.
	•	incremental.test.ts — incremental sync helper behavior.
	•	full-sync.test.ts — full-sync helper behavior.
	•	replay.test.ts — replay request behavior.

test/queue/
	•	job-types.test.ts — canonical job vocabulary.
	•	job-envelope.test.ts — envelope schema stability and versioning.
	•	enqueue-job.test.ts — enqueue helper metadata assembly.
	•	retry-policy.test.ts — retry policy decisions.
	•	dedupe-key.test.ts — dedupe-key stability.
	•	failure-record.test.ts — durable terminal failure record shape.
	•	replay-job.test.ts — replay job generation.
	•	poison-message.test.ts — poison-message classification.
	•	vercel-queues.test.ts — thin queue binding assumptions.

test/rate-limit/
	•	backoff.test.ts — backoff behavior.
	•	retryable.test.ts — retryability helpers.
	•	quotas.test.ts — quota window helpers.
	•	concurrency.test.ts — concurrency shaping behavior.
	•	pacing.test.ts — pacing helpers.
	•	windows.test.ts — rate-limit window calculations.

test/http/
	•	create-client.test.ts — client creation defaults.
	•	openapi-client.test.ts — spec-backed helper assumptions.
	•	request-context.test.ts — outbound context propagation.
	•	api-version.test.ts — API version header/option helpers.
	•	idempotency-key.test.ts — outbound idempotency key rules.
	•	conditional.test.ts — conditional request helper behavior.
	•	retries.test.ts — HTTP retry orchestration.
	•	pagination.test.ts — pagination helper behavior.
	•	response-guards.test.ts — runtime response guard behavior.

test/errors/
	•	integration-errors.test.ts — canonical error categories.
	•	auth-errors.test.ts — auth error shape.
	•	credential-errors.test.ts — credential error shape.
	•	webhook-errors.test.ts — webhook error shape.
	•	sync-errors.test.ts — sync error shape.
	•	queue-errors.test.ts — queue error shape.
	•	map-http-error.test.ts — raw transport-to-normalized error mapping.
	•	retry-classification.test.ts — retry/terminal/operator classification.

test/runtime/
	•	adapter-registry.test.ts — registry behavior.
	•	bind-context.test.ts — bound context behavior.
	•	resolve-provider.test.ts — adapter resolution behavior.
	•	trace-context.test.ts — trace propagation helpers.
	•	feature-flags.test.ts — runtime feature-flag semantics.

⸻

11. Canonical import rules

Allowed imports inside this package:
	•	@repo/contracts
	•	@repo/env only when truly justified
	•	standard library / Node / Web Crypto / Request-Response compatible types
	•	small runtime validation utilities
	•	small HTTP utilities
	•	OpenAPI helper packages
	•	queue-related packages thinly
	•	observability types or tiny helper surfaces only if needed

Avoid importing:
	•	@repo/db
	•	@repo/auth
	•	@repo/ui
	•	@repo/analytics
	•	app code
	•	heavy provider SDKs
	•	business workflow packages

Core rule:

prefer injected dependencies over hard coupling

⸻

12. App binding model

Per-app binding belongs in apps/*/lib/integrations.ts.

That file should bind:
	•	adapter registry
	•	queue client
	•	credential store implementation
	•	connection store implementation
	•	logger/tracing carrier hooks
	•	org resolution hooks
	•	payload ref persistence hooks if needed
	•	integration-runtime feature flags allowed by contract

This package should make that binding straightforward and strongly typed.

⸻

13. Future real provider package pattern

A real provider package should:
	•	depend on @repo/integrations-core
	•	implement the adapter contracts from core
	•	keep provider SDK/client logic local
	•	keep provider request/response normalization local
	•	use core OAuth/webhook/queue/sync/error primitives
	•	avoid reimplementing common idempotency, backoff, and connection vocabulary

This package must not pre-scaffold provider directories.

⸻

14. Runtime and observability rules

This package aligns with the repo’s OpenTelemetry-first baseline.

It must support propagation of trace/correlation metadata across:
	•	inbound webhook to queue job
	•	queue job to outbound provider request
	•	retry and replay flows

It should not bootstrap tracing itself.

It should expose the propagation shape/helpers needed to cooperate with @repo/observability.

⸻

15. Queue and failure rules

Canonical queue rules:
	•	minimal payloads only
	•	schema version required
	•	dedupe key required where meaningful
	•	correlation metadata required
	•	trace propagation required
	•	no large raw payloads in job envelopes
	•	retry policy must use normalized error classification
	•	terminal failure records must be stable
	•	replay helpers must exist

Canonical failure concepts:
	•	retryable failure
	•	terminal failure
	•	operator-action-required failure
	•	poison message
	•	failure record
	•	replay request
	•	replay job

Adapters must not invent one-off retry exhaustion behavior.

⸻

16. What must never exist here

These are drift signs and are forbidden:

packages/integrations-core/src/google/
packages/integrations-core/src/meta/
packages/integrations-core/src/facebook/
packages/integrations-core/src/ga4/
packages/integrations-core/src/google-ads/
packages/integrations-core/src/business/
packages/integrations-core/src/dashboard/
packages/integrations-core/src/app-booking/
packages/integrations-core/src/client-specific/
packages/integrations-core/src/misc/
packages/integrations-core/src/shared-provider-impl/

Also forbidden:
	•	direct Prisma/DB implementations
	•	auth/session logic
	•	UI helpers
	•	analytics KPI logic
	•	provider SDK wrappers for future hypothetical work
	•	global workflow orchestration unrelated to integrations

⸻

17. Rejected alternatives

These are explicitly rejected for this package:
	•	Single credential model only for OAuth tokens — rejected because provider auth models vary.
	•	One org + one provider = one connection — rejected because many providers are multi-account and manager-account oriented.
	•	One generic webhook verifier for every case — rejected because challenge flows and signed delivery are different.
	•	Large queue payloads for convenience — rejected because envelopes must stay minimal and durable.
	•	Generic queue framework abstraction — rejected because Vercel Queues is the baseline and thin bindings are preferred.
	•	Provider implementation folders inside core — rejected because this package is not an adapter warehouse.
	•	Core package reading env directly as a norm — rejected because apps should bind app credentials or use @repo/env deliberately.
	•	Observability bootstrap inside integrations-core — rejected because telemetry ownership belongs in @repo/observability.

⸻

18. Build order

Phase 1 — package skeleton

Create:
	•	top-level package files
	•	exports map
	•	directory scaffolding
	•	index.ts barrels

Phase 2 — contract layer

Implement first:
	•	contracts/*
	•	provider/*
	•	connection/connection-state.ts
	•	credentials/credential-kind.ts
	•	queue/job-types.ts

These establish vocabulary and boundaries first.

Phase 3 — connection and credential infrastructure

Implement:
	•	connection store interfaces and lifecycle helpers
	•	credential store interfaces
	•	token shapes
	•	secret references
	•	encryption metadata
	•	token expiry logic

Phase 4 — OAuth primitives

Implement:
	•	state
	•	PKCE
	•	nonce
	•	scopes
	•	redirect URI
	•	callback normalization
	•	refresh lifecycle

Phase 5 — webhook primitives

Implement:
	•	raw body helpers
	•	delivery metadata
	•	signature verification orchestration
	•	challenge handling
	•	event envelope
	•	intake
	•	idempotency
	•	payload refs
	•	enqueue helpers

Phase 6 — sync and queue primitives

Implement:
	•	cursors
	•	checkpoints
	•	sync windows
	•	sync results
	•	replay helpers
	•	job envelope
	•	enqueue helper
	•	retry policy
	•	failure record
	•	poison-message handling
	•	replay jobs

Phase 7 — HTTP and errors

Implement:
	•	create client
	•	request context
	•	API version
	•	idempotency keys
	•	conditional requests
	•	retries
	•	pagination
	•	response guards
	•	normalized errors
	•	retry classification
	•	transport error mapping

Phase 8 — runtime composition

Implement:
	•	adapter registry
	•	bind context
	•	resolve provider
	•	trace context
	•	runtime feature flags

Phase 9 — testing helpers and tests

Implement:
	•	fakes and fixtures
	•	package tests across all major surfaces

⸻

19. Definition of done

packages/integrations-core is done when:
	•	public entrypoints are explicit and stable
	•	adapter contracts are clear and capability-driven
	•	connection is first-class
	•	credential model supports more than plain OAuth tokens
	•	OAuth primitives are secure and reusable
	•	webhook handling supports both challenge and signed delivery
	•	queue envelopes are minimal, versioned, and idempotency-aware
	•	failure and replay semantics are standardized
	•	sync vocabulary is explicit and reusable
	•	HTTP boundary helpers exist for common adapter concerns
	•	runtime adapter binding is clean and app-driven
	•	no provider-specific business logic has leaked in
	•	README clearly teaches how adapters and apps should use the package
	•	tests cover the infrastructure contract rather than provider internals

⸻

20. Non-goals

This package is not trying to be:
	•	a provider implementation warehouse
	•	a CRM/ETL product by itself
	•	a business automation layer
	•	a reporting system for sync health
	•	a UI package for connected accounts
	•	a secrets manager
	•	a generic workflow engine
	•	a general-purpose async infra package for the whole repo

It is shared integration infrastructure.

⸻

21. Final summary

packages/integrations-core is the repo’s server-only, provider-neutral, connection-aware integration infrastructure package.

Its key architectural commitments are:
	•	connection is first-class
	•	credentials are multi-kind
	•	app credentials and tenant credentials are separate
	•	OAuth is strict
	•	webhooks split challenge from delivery
	•	queue envelopes are minimal and versioned
	•	idempotency is mandatory
	•	failure and replay are explicit
	•	runtime context is app-bound
	•	provider implementations do not live here

This is the final source of truth for @repo/packages/integrations-core.