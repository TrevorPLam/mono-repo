# repo/contracts/contracts-canonical.md

packages/contracts/ — Final Source of Truth

0. Why this package exists

packages/contracts is the monorepo’s shared boundary contract package.

It defines the stable, repo-owned shapes that multiple parts of the system agree on when data crosses a boundary.

That includes:
	•	runtime-validated schemas
	•	inferred shared types
	•	DTOs
	•	queue payloads
	•	webhook normalization payloads
	•	integration-facing normalized shapes
	•	server-to-client exchange shapes
	•	multi-app domain payloads
	•	small framework-neutral transport envelopes

It does not include:
	•	database models
	•	Prisma types
	•	raw Better Auth objects
	•	framework request/response objects
	•	UI props
	•	app-local feature types
	•	provider-native payloads as public contracts
	•	business orchestration logic
	•	persistence helpers
	•	network code
	•	env access

This package answers one question:

What shapes are stable enough to be shared across boundaries in this repo?

⸻

1. Project context this package must obey

This package is not being designed in isolation. It must fit the rest of the monorepo.

1.1 Canonical platform fit

This repo is a compiled-first pnpm + Turborepo monorepo with:
	•	Astro for public/content-heavy surfaces
	•	Next.js for app/product surfaces
	•	PostgreSQL + Prisma in @repo/db
	•	Better Auth in @repo/auth
	•	multi-tenant organization-based architecture
	•	shared runtime packages with strict boundaries
	•	per-domain packages, not a giant shared junk drawer

So @repo/contracts must be:
	•	framework-neutral
	•	compiled-first
	•	safe across Astro and Next
	•	safe across browser/server/background usage
	•	dependency-light
	•	boundary-only

1.2 Auth fit

The repo’s auth baseline is intentionally minimal:
	•	invite-only auth initially
	•	minimal sign-in
	•	shared auth roles limited to platform_admin, staff, member
	•	real authorization lives in app DALs and Server Actions
	•	@repo/auth owns auth implementation

So @repo/contracts only holds normalized auth-adjacent exchange shapes, not auth logic.

1.3 DB fit

The repo uses Prisma and organization-based tenancy with RLS.

So @repo/contracts must:
	•	never mirror Prisma models
	•	never leak DB implementation details
	•	express boundary DTOs deliberately
	•	treat organizationId as a transport concept where needed, not a DB-layer concern

1.4 Analytics fit

The repo’s analytics architecture is:
	•	GTM Web for marketing surfaces
	•	code-first analytics for product apps
	•	server-first definitive conversions
	•	GA4 and Meta fan-out after durable capture
	•	per-brand/org isolation

So @repo/contracts must hold:
	•	canonical repo-owned analytics event names
	•	consent contracts
	•	attribution contracts
	•	definitive conversion payloads

It must not hold vendor event contracts.

1.5 Integrations fit

The repo’s integrations architecture is:
	•	staged adapter model
	•	normalized repo-owned payloads
	•	provider adapters map raw provider shapes into internal normalized contracts
	•	OAuth tokens stored in DB keyed by organization + platform
	•	webhooks verify fast, enqueue fast, process idempotently

So @repo/contracts must hold:
	•	provider IDs
	•	normalized OAuth status payloads
	•	non-secret credential metadata
	•	webhook normalization contracts
	•	sync job payloads

It must not become a provider SDK type mirror.

1.6 SEO fit

The repo’s SEO architecture is:
	•	framework-agnostic SEO core + adapters
	•	per-domain canonicals and sitemaps
	•	noindex for demos instead of robots blocking
	•	runtime tenant/domain-resolved SEO config

So @repo/contracts must hold:
	•	domain-aware SEO metadata
	•	canonical resolution payloads
	•	sitemap entry contracts
	•	robots/indexing contracts

1.7 Content fit

The current content strategy is:
	•	code/content-file first
	•	CMS optional later
	•	public sites need maximum flexibility
	•	shared demo/multi-tenant hosting exists
	•	clients may edit later, but not required for v1

So @repo/contracts should support:
	•	code/content-file usage immediately
	•	future structured content/CMS later
	•	block-based content contracts where genuinely shared
	•	provider-neutral media contracts

1.8 Product scope fit

Current real domain surfaces are:
	•	firm website
	•	client websites
	•	booking/product app
	•	no selected CRM/invoicing/reporting system of record yet
	•	client logins likely not needed in v1

So this package does need:
	•	organizations
	•	auth-adjacent normalized contracts
	•	booking
	•	analytics
	•	integrations
	•	SEO
	•	content
	•	events
	•	a tiny API transport layer

And it does not need:
	•	billing
	•	invoicing
	•	CRM
	•	observability contracts
	•	native/mobile-specific contracts
	•	internal admin mega-taxonomies

⸻

2. Final closed decisions

These are final. They are not open questions anymore.

2.1 Canonical schema library

This package uses Zod 4.

No mixed schema libraries are allowed inside packages/contracts.

2.2 Public shared contracts are JSON-safe by default

Even though some React boundaries can serialize more than plain JSON, this package standardizes on JSON-safe DTOs for shared public contracts.

Use:
	•	strings
	•	numbers
	•	booleans
	•	null
	•	arrays of JSON-safe values
	•	plain objects of JSON-safe values

Do not use in shared public contracts by default:
	•	Date
	•	Map
	•	Set
	•	bigint
	•	class instances
	•	provider-native objects
	•	opaque transformed runtime objects pretending to be wire contracts

Repo-wide transport rules:
	•	dates cross boundaries as ISO strings
	•	times cross boundaries as normalized strings
	•	money crosses boundaries as currency code + integer minor units
	•	IDs cross boundaries as validated opaque strings

2.3 Schema-first

Default pattern:
	•	schema first
	•	inferred type second

Examples:
	•	OrganizationSummarySchema
	•	type OrganizationSummary = z.infer<typeof OrganizationSummarySchema>

If input and output intentionally differ:
	•	CreateReservationInputSchema
	•	type CreateReservationInput = z.input<typeof CreateReservationInputSchema>
	•	type CreateReservation = z.output<typeof CreateReservationInputSchema>

2.4 Unknown-key policy

Default:
	•	inbound write contracts use strict objects
	•	silent stripping is allowed only when deliberate
	•	loose passthrough objects are allowed only when deliberate

This package should not be casual about extra keys.

2.5 Framework neutrality is mandatory

This package must be safe to import from:
	•	Astro
	•	Next.js server code
	•	browser-safe code where appropriate
	•	tests
	•	background jobs
	•	integration adapters

So it must not depend on:
	•	React
	•	Next.js runtime objects
	•	Astro runtime objects
	•	@repo/db
	•	@repo/auth
	•	provider SDKs
	•	Node-only APIs in public code

2.6 Root package stays small

@repo/contracts root import stays intentionally small.

It exports:
	•	common low-level primitives
	•	only a few package-wide types if truly universal

All domain contracts are imported via subpaths.

2.7 Compiled-first package

This package is:
	•	ESM
	•	side-effect free
	•	compiled-first
	•	browser-safe unless private/internal
	•	not split into .server / .client

2.8 Provider-native types never become public repo contracts

Provider-generated and provider-native types belong in adapters or generated folders near adapters.

This package only holds repo-owned normalized contracts.

2.9 Contract changes are boundary changes

Changes here are treated as boundary changes.

Rules:
	•	additive change preferred
	•	broadening must be deliberate
	•	renames/removals require migration
	•	deprecate before removal
	•	silent drift is not allowed

2.10 Final package scope

This package includes these domains:
	•	common
	•	organizations
	•	auth
	•	booking
	•	analytics
	•	integrations
	•	seo
	•	content
	•	events
	•	api

It does not include speculative domains beyond that.

⸻

3. Final directory tree

packages/contracts/
├─ package.json
├─ tsconfig.json
├─ tsup.config.ts
├─ vitest.config.ts
├─ README.md
├─ src/
│  ├─ index.ts
│  ├─ common/
│  │  ├─ index.ts
│  │  ├─ ids.ts
│  │  ├─ json.ts
│  │  ├─ dates.ts
│  │  ├─ money.ts
│  │  ├─ pagination.ts
│  │  ├─ metadata.ts
│  │  └─ errors.ts
│  ├─ organizations/
│  │  ├─ index.ts
│  │  ├─ organization.ts
│  │  ├─ membership.ts
│  │  ├─ roles.ts
│  │  ├─ tenant-resolution.ts
│  │  └─ organization-settings.ts
│  ├─ auth/
│  │  ├─ index.ts
│  │  ├─ session.ts
│  │  ├─ user.ts
│  │  └─ permissions.ts
│  ├─ booking/
│  │  ├─ index.ts
│  │  ├─ services.ts
│  │  ├─ availability.ts
│  │  ├─ appointments.ts
│  │  ├─ intake.ts
│  │  └─ reservation.ts
│  ├─ analytics/
│  │  ├─ index.ts
│  │  ├─ events.ts
│  │  ├─ attribution.ts
│  │  ├─ conversions.ts
│  │  └─ consent.ts
│  ├─ integrations/
│  │  ├─ index.ts
│  │  ├─ providers.ts
│  │  ├─ oauth.ts
│  │  ├─ credentials.ts
│  │  ├─ webhooks.ts
│  │  └─ sync-jobs.ts
│  ├─ seo/
│  │  ├─ index.ts
│  │  ├─ metadata.ts
│  │  ├─ canonicals.ts
│  │  ├─ sitemap.ts
│  │  └─ robots.ts
│  ├─ content/
│  │  ├─ index.ts
│  │  ├─ pages.ts
│  │  ├─ navigation.ts
│  │  ├─ blocks.ts
│  │  └─ media.ts
│  ├─ events/
│  │  ├─ index.ts
│  │  ├─ internal-events.ts
│  │  ├─ queue-events.ts
│  │  └─ webhook-events.ts
│  ├─ api/
│  │  ├─ index.ts
│  │  └─ envelopes.ts
│  └─ internal/
│     ├─ constants.ts
│     ├─ schema-helpers.ts
│     └─ schema-metadata.ts
└─ test/
   ├─ setup.ts
   ├─ runtime/
   │  ├─ public-api.test.ts
   │  ├─ common/
   │  │  ├─ ids.test.ts
   │  │  ├─ json.test.ts
   │  │  ├─ dates.test.ts
   │  │  ├─ money.test.ts
   │  │  ├─ pagination.test.ts
   │  │  ├─ metadata.test.ts
   │  │  └─ errors.test.ts
   │  ├─ organizations/
   │  │  ├─ organization.test.ts
   │  │  ├─ membership.test.ts
   │  │  ├─ roles.test.ts
   │  │  ├─ tenant-resolution.test.ts
   │  │  └─ organization-settings.test.ts
   │  ├─ auth/
   │  │  ├─ session.test.ts
   │  │  ├─ user.test.ts
   │  │  └─ permissions.test.ts
   │  ├─ booking/
   │  │  ├─ services.test.ts
   │  │  ├─ availability.test.ts
   │  │  ├─ appointments.test.ts
   │  │  ├─ intake.test.ts
   │  │  └─ reservation.test.ts
   │  ├─ analytics/
   │  │  ├─ events.test.ts
   │  │  ├─ attribution.test.ts
   │  │  ├─ conversions.test.ts
   │  │  └─ consent.test.ts
   │  ├─ integrations/
   │  │  ├─ providers.test.ts
   │  │  ├─ oauth.test.ts
   │  │  ├─ credentials.test.ts
   │  │  ├─ webhooks.test.ts
   │  │  └─ sync-jobs.test.ts
   │  ├─ seo/
   │  │  ├─ metadata.test.ts
   │  │  ├─ canonicals.test.ts
   │  │  ├─ sitemap.test.ts
   │  │  └─ robots.test.ts
   │  ├─ content/
   │  │  ├─ pages.test.ts
   │  │  ├─ navigation.test.ts
   │  │  ├─ blocks.test.ts
   │  │  └─ media.test.ts
   │  ├─ events/
   │  │  ├─ internal-events.test.ts
   │  │  ├─ queue-events.test.ts
   │  │  └─ webhook-events.test.ts
   │  └─ api/
   │     └─ envelopes.test.ts
   └─ types/
      ├─ public-api.test-d.ts
      ├─ common.test-d.ts
      ├─ organizations.test-d.ts
      ├─ auth.test-d.ts
      ├─ booking.test-d.ts
      ├─ analytics.test-d.ts
      ├─ integrations.test-d.ts
      ├─ seo.test-d.ts
      ├─ content.test-d.ts
      ├─ events.test-d.ts
      └─ api.test-d.ts


⸻

4. Top-level files

4.1 package.json

Purpose

Defines package identity, exports, scripts, and dependency boundaries.

Required decisions
	•	"name": "@repo/contracts"
	•	"type": "module"
	•	"sideEffects": false
	•	package is private/internal unless the repo’s package publishing strategy says otherwise
	•	files should include only built output and docs if the repo standard wants that

Public exports

Only these public exports exist:
	•	.
	•	./common
	•	./organizations
	•	./auth
	•	./booking
	•	./analytics
	•	./integrations
	•	./seo
	•	./content
	•	./events
	•	./api

No src/** deep import paths.
No internal/** exports.

Script expectations

At minimum:
	•	build
	•	clean
	•	typecheck
	•	test
	•	test:types

Optional only if the repo standard wants them:
	•	dev
	•	test:watch

Dependencies

Runtime:
	•	zod

Dev:
	•	typescript
	•	tsup
	•	vitest

No convenience utility pile.

⸻

4.2 tsconfig.json

Purpose

Strict TypeScript settings for a compiled-first shared runtime package.

Rules
	•	strict on
	•	exact optional property types on
	•	no unchecked indexed access
	•	no framework aliases
	•	no TS-only fake path resolution for external consumers
	•	compatible with package exports
	•	declaration emit compatible with tsup build

This package must compile like a normal shared runtime package, not like an app.

⸻

4.3 tsup.config.ts

Purpose

Defines compiled ESM build output.

Entry points

Build these entry points:
	•	src/index.ts
	•	src/common/index.ts
	•	src/organizations/index.ts
	•	src/auth/index.ts
	•	src/booking/index.ts
	•	src/analytics/index.ts
	•	src/integrations/index.ts
	•	src/seo/index.ts
	•	src/content/index.ts
	•	src/events/index.ts
	•	src/api/index.ts

Do not publish every leaf file as a direct entry point.

⸻

4.4 vitest.config.ts

Purpose

Owns package-local testing configuration.

Coverage

Must include:
	•	runtime tests under test/runtime/**
	•	type tests under test/types/**

This package needs a local config because its job is validation and type stability.

⸻

4.5 README.md

Purpose

This is one of the highest-leverage READMEs in the repo.

Must include
	•	what counts as a contract here
	•	what belongs here vs what does not
	•	JSON-safe contract rule
	•	schema-first policy
	•	strict object policy
	•	public export rules
	•	naming conventions
	•	how to decide whether something stays local
	•	examples of good contract candidates
	•	examples of drift signs
	•	test expectations
	•	how to add a new contract

This README exists to reduce agent drift.

⸻

5. Root source

5.1 src/index.ts

Purpose

Conservative root entrypoint.

Rule

The root exports only the common domain and, if absolutely necessary, a tiny number of universal package-wide symbols.

It does not export all domains.

Why

Root imports must stay safe and small.
Domain consumers should use subpath imports.

⸻

6. src/common/

This folder contains low-level cross-domain primitives only.

It must stay compact.

6.1 src/common/index.ts

Purpose

Barrel for common.

Rule

Exports only files from common.
No cross-domain re-exports.

⸻

6.2 src/common/ids.ts

Purpose

Validated opaque ID contracts.

What belongs here

Shared repo-owned ID shapes that cross boundaries.

Initial exports

At minimum:
	•	OrganizationIdSchema
	•	UserIdSchema
	•	SessionIdSchema
	•	BookingServiceIdSchema
	•	BookingAppointmentIdSchema
	•	IntegrationConnectionIdSchema
	•	ContentPageIdSchema
	•	MediaAssetIdSchema

And corresponding inferred types.

Rules
	•	IDs are opaque strings
	•	do not assume DB UUID implementation in public contract names
	•	do not encode persistence logic here
	•	only include IDs that truly cross boundaries

⸻

6.3 src/common/json.ts

Purpose

JSON-safe transport primitives.

Initial exports
	•	JsonPrimitiveSchema
	•	JsonValueSchema
	•	JsonObjectSchema
	•	optional JSON-safe record helper where useful

Rules
	•	this exists because public contracts are JSON-safe by default
	•	do not turn this into a generic util dump
	•	use it only where transport safety matters

⸻

6.4 src/common/dates.ts

Purpose

Shared date/time transport shapes.

Initial exports
	•	ISO datetime string schema
	•	date-only string schema
	•	time-only string schema if needed
	•	timezone string schema
	•	shared date range DTO
	•	shared time range DTO

Rules
	•	dates cross boundaries as strings
	•	no Date in shared public contracts
	•	range DTOs only if reused across domains

⸻

6.5 src/common/money.ts

Purpose

Shared money contracts.

Initial exports
	•	currency code schema
	•	minor-unit amount schema
	•	MoneySchema
	•	optional price range schema if genuinely reused

Rules
	•	no floating-point public money types
	•	formatting does not live here
	•	no provider money objects

⸻

6.6 src/common/pagination.ts

Purpose

Shared pagination contracts.

Final package decision

This package standardizes on cursor-first pagination for shared contracts.

Initial exports
	•	cursor pagination input
	•	validated page size
	•	cursor page info
	•	optional paginated list helper schema if reused

Rules
	•	do not build a giant generic query DSL
	•	page-number pagination may exist locally in apps if needed
	•	shared contracts prefer cursor semantics

⸻

6.7 src/common/metadata.ts

Purpose

Small shared metadata DTOs.

Initial exports
	•	created/updated timestamp DTO
	•	origin/source metadata DTO
	•	request/source-system metadata DTO
	•	idempotency metadata DTO if broadly reused

Rules
	•	keep thin
	•	not a random metadata junk drawer
	•	if metadata is domain-specific, keep it in its domain

⸻

6.8 src/common/errors.ts

Purpose

Exchange-safe error contracts.

Initial exports
	•	public error code schema
	•	validation issue schema
	•	public contract error DTO
	•	reusable issue list schema if useful

Rules
	•	no error classes
	•	no framework error wrappers
	•	api/envelopes.ts composes from this file instead of duplicating

⸻

7. src/organizations/

This folder contains multi-tenant organization and tenant-resolution contracts.

Important language rule:
	•	organization is the canonical tenant identity in the system
	•	tenant resolution is the runtime routing/domain-resolution concept
	•	do not invent a separate fake persisted tenant entity if one does not exist

7.1 src/organizations/index.ts

Barrel for organization domain files.

⸻

7.2 src/organizations/organization.ts

Purpose

Canonical organization DTOs.

Initial exports
	•	OrganizationSummarySchema
	•	OrganizationDetailSchema
	•	OrganizationSwitcherItemSchema
	•	OrganizationPublicDescriptorSchema

Rules
	•	not Prisma models
	•	no RLS mechanics
	•	only boundary-safe organization views

⸻

7.3 src/organizations/membership.ts

Purpose

Organization membership DTOs and inputs.

Initial exports
	•	membership summary DTO
	•	membership list item DTO
	•	membership status schema
	•	invite member input
	•	membership update input if shared

Rules
	•	keep aligned with simple invite-only baseline
	•	do not invent complex org permission systems
	•	use role vocabulary from organizations/roles.ts

⸻

7.4 src/organizations/roles.ts

Purpose

Canonical role vocabulary for organization and actor-facing transport.

Final role decision

This file owns the shared role vocabulary because it is the cleanest place to prevent drift.

Initial exports
	•	OrganizationRoleSchema with staff | member
	•	SystemRoleSchema with platform_admin
	•	ActorRoleSchema with platform_admin | staff | member

Rules
	•	role vocabulary is small and deliberate
	•	do not add feature-local permissions here
	•	auth/permissions.ts consumes this vocabulary, not the other way around

⸻

7.5 src/organizations/tenant-resolution.ts

Purpose

Host/domain/org resolution contracts.

Initial exports
	•	domain lookup input
	•	tenant resolution input
	•	tenant resolution result DTO
	•	active organization selection DTO
	•	not-found/fallback resolution result DTO

Rules
	•	no framework request objects
	•	no app-specific proxy/middleware types
	•	must be reusable by site-platform, app-booking, auth-adjacent code, and integrations

⸻

7.6 src/organizations/organization-settings.ts

Purpose

Shared organization settings DTOs.

Initial exports
	•	branding settings DTO
	•	analytics settings DTO
	•	integration enablement settings DTO
	•	public site settings DTO
	•	optional operational settings subset if truly shared

Rules
	•	do not dump all internal config here
	•	keep settings grouped by concern
	•	only cross-boundary settings views belong here

⸻

8. src/auth/

This folder is for normalized auth-adjacent exchange shapes only.

It is not auth implementation.

8.1 src/auth/index.ts

Barrel for auth domain files.

⸻

8.2 src/auth/session.ts

Purpose

Normalized session payload contracts.

Initial exports
	•	browser-safe session DTO
	•	server-to-client session snapshot DTO
	•	optional session result DTO
	•	session org-context DTO

Rules
	•	align with normalized Better Auth shape
	•	do not expose raw vendor session objects
	•	no auth logic

⸻

8.3 src/auth/user.ts

Purpose

Normalized user/actor DTOs.

Initial exports
	•	authenticated user summary DTO
	•	display-safe user DTO
	•	actor reference DTO
	•	minimal organization-aware actor DTO if reused

Rules
	•	no full DB user row shape
	•	no provider identity blobs
	•	only exchange-safe identity views

⸻

8.4 src/auth/permissions.ts

Purpose

Coarse access-result and auth-derived permission transport shapes.

Initial exports
	•	access decision/result DTO
	•	actor access summary DTO
	•	optional shared coarse permission key union only if actually reused
	•	role summary/view DTOs if needed

Rules
	•	consumes role vocabulary from organizations/roles.ts
	•	do not create a giant permission registry here
	•	fine-grained feature authorization stays in app DALs and app-local code

⸻

9. src/booking/

This is one of the core real product domains.

9.1 src/booking/index.ts

Barrel for booking domain files.

⸻

9.2 src/booking/services.ts

Purpose

Service catalog and service admin DTOs.

Initial exports
	•	service summary DTO
	•	service detail DTO
	•	service catalog item DTO
	•	service duration/pricing DTO
	•	create service input
	•	update service input

Rules
	•	use common/money
	•	keep persistence details out
	•	separate public catalog-facing and admin-facing views when needed

⸻

9.3 src/booking/availability.ts

Purpose

Scheduling and availability payloads.

Initial exports
	•	availability query input
	•	availability slot DTO
	•	blocked range DTO
	•	availability result DTO
	•	optional resource/provider availability summary if truly shared

Rules
	•	string-based time contracts only
	•	no calendar-provider raw payloads
	•	must work for public booking UI, server logic, and integration sync boundaries

⸻

9.4 src/booking/appointments.ts

Purpose

Appointment lifecycle DTOs.

Initial exports
	•	appointment summary DTO
	•	appointment detail DTO
	•	create appointment input
	•	reschedule appointment input
	•	cancel appointment input
	•	appointment confirmation summary DTO
	•	booking-specific status vocabulary if shared

Rules
	•	transport only
	•	business orchestration stays elsewhere

⸻

9.5 src/booking/intake.ts

Purpose

Pre-booking intake/form contracts.

Initial exports
	•	intake field kind vocabulary
	•	intake field definition DTO
	•	intake form definition DTO
	•	intake submission input
	•	normalized answer DTO

Rules
	•	use discriminated unions for varying field kinds
	•	keep UI rendering props out
	•	no vendor form-builder contracts

⸻

9.6 src/booking/reservation.ts

Purpose

Reservation/hold/confirmation contracts.

Final decision

This file is named reservation.ts, not checkout.ts, because the repo does not currently have a real payment/billing domain.

Initial exports
	•	reservation hold DTO
	•	start reservation input
	•	reservation expiration DTO
	•	reservation confirmation DTO

Rules
	•	reservation semantics only
	•	no payment gateway objects
	•	no billing/invoice contracts

⸻

10. src/analytics/

This folder contains repo-owned analytics contracts.

10.1 src/analytics/index.ts

Barrel for analytics files.

⸻

10.2 src/analytics/events.ts

Purpose

Canonical analytics event vocabulary and event payloads.

Initial event families

At minimum:
	•	page_viewed
	•	cta_clicked
	•	form_viewed
	•	form_submitted
	•	lead_submitted
	•	service_viewed
	•	booking_started
	•	booking_step_completed
	•	booking_completed
	•	consent_updated

Initial exports
	•	analytics event name schema
	•	base analytics event envelope
	•	discriminated analytics event union
	•	page/event context DTO

Rules
	•	event names are repo-owned
	•	use stable discriminators
	•	do not leak vendor event schema shapes into public contracts

⸻

10.3 src/analytics/attribution.ts

Purpose

Attribution and campaign context DTOs.

Initial exports
	•	UTM parameters DTO
	•	referrer/source-medium DTO
	•	click identifier DTO
	•	attribution context DTO

Rules
	•	normalized repo-owned shapes only
	•	provider-specific identifiers map into these
	•	no giant optional vendor blob

⸻

10.4 src/analytics/conversions.ts

Purpose

Definitive conversion contracts.

Initial exports
	•	lead conversion DTO
	•	booking conversion DTO
	•	server conversion envelope
	•	conversion source metadata DTO

Rules
	•	represents durable internal conversion shape before adapter fan-out
	•	downstream vendor payloads do not belong here

⸻

10.5 src/analytics/consent.ts

Purpose

Shared consent contracts.

Initial exports
	•	consent category vocabulary
	•	consent state vocabulary
	•	consent snapshot DTO
	•	consent update input

Rules
	•	use repo-owned consent categories
	•	adapters translate to vendor/platform categories later

⸻

11. src/integrations/

This folder contains normalized integration contracts.

11.1 src/integrations/index.ts

Barrel for integrations files.

⸻

11.2 src/integrations/providers.ts

Purpose

Canonical provider vocabulary and provider capability shapes.

Initial provider set

At minimum:
	•	ga4
	•	google_ads
	•	google_search_console
	•	google_tag_manager
	•	meta_ads
	•	meta_business
	•	mailchimp
	•	hubspot
	•	shopify

Initial exports
	•	provider ID schema
	•	provider capability tag schema
	•	connection status schema
	•	provider summary DTO

Rules
	•	provider IDs are repo-owned machine identifiers
	•	add new providers deliberately
	•	do not confuse machine IDs with display strings

⸻

11.3 src/integrations/oauth.ts

Purpose

OAuth exchange contracts.

Initial exports
	•	connect initiation input
	•	connect initiation result DTO
	•	callback result DTO
	•	connection summary DTO

Rules
	•	no token storage logic
	•	no raw provider OAuth payloads
	•	normalize provider differences

⸻

11.4 src/integrations/credentials.ts

Purpose

Non-secret credential metadata and health contracts.

Initial exports
	•	connection credential summary DTO
	•	token expiry summary DTO
	•	credential health DTO
	•	linked external account summary DTO

Rules
	•	no secrets
	•	no encrypted token row structure
	•	safe status/health view only

⸻

11.5 src/integrations/webhooks.ts

Purpose

Webhook receipt and normalization contracts.

Initial exports
	•	webhook receipt metadata DTO
	•	verification result DTO
	•	normalized incoming webhook DTO
	•	webhook dedupe metadata DTO

Rules
	•	verified/normalized shared shape only
	•	raw provider payloads stay out
	•	include provider event ID, occurrence time, receipt time, and org context where known

⸻

11.6 src/integrations/sync-jobs.ts

Purpose

Async sync-job payloads.

Initial exports
	•	sync job request DTO
	•	sync cursor/checkpoint DTO
	•	sync job envelope DTO
	•	sync result summary DTO

Rules
	•	include organization context
	•	include provider identity
	•	include idempotency-friendly identifiers where appropriate
	•	transport only, no runner logic

⸻

12. src/seo/

Framework-neutral SEO contracts.

12.1 src/seo/index.ts

Barrel for SEO files.

⸻

12.2 src/seo/metadata.ts

Purpose

Shared SEO metadata DTOs.

Initial exports
	•	SEO metadata DTO
	•	title/description/image DTO
	•	noindex/nofollow flags DTO
	•	canonical input subset if reused

Rules
	•	framework adapters map this to Astro/Next metadata
	•	framework-native metadata objects do not belong here

⸻

12.3 src/seo/canonicals.ts

Purpose

Canonical resolution contracts.

Initial exports
	•	canonical resolution input
	•	canonical resolution result
	•	pagination canonical policy DTO

Rules
	•	domain-aware and org-aware where needed
	•	core shared SEO contract
	•	do not bury canonical semantics inside app-local code

⸻

12.4 src/seo/sitemap.ts

Purpose

Sitemap contracts.

Initial exports
	•	sitemap entry DTO
	•	alternate entry DTO only if truly needed
	•	sitemap generation input/result DTO if reused

Rules
	•	minimal
	•	no speculative locale explosion
	•	transport shapes only

⸻

12.5 src/seo/robots.ts

Purpose

Robots/indexing policy contracts.

Initial exports
	•	robots directive DTO
	•	robots policy DTO
	•	indexing policy DTO
	•	demo/public noindex policy DTO

Rules
	•	align with demo-host noindex baseline
	•	no raw robots.txt string generation here

⸻

13. src/content/

Shared public-site content and rendering boundary contracts.

13.1 src/content/index.ts

Barrel for content files.

⸻

13.2 src/content/pages.ts

Purpose

Page-level content DTOs.

Initial exports
	•	content page summary DTO
	•	content page detail DTO
	•	page route/slug DTO
	•	page template vocabulary

Rules
	•	no Astro props
	•	no Next route objects
	•	can reference SEO, blocks, and media contracts cleanly

⸻

13.3 src/content/navigation.ts

Purpose

Reusable navigation DTOs.

Initial exports
	•	navigation item DTO
	•	navigation group DTO
	•	footer group DTO
	•	breadcrumb item DTO

Rules
	•	render-agnostic
	•	no component props
	•	content/site-aware, not framework-aware

⸻

13.4 src/content/blocks.ts

Purpose

Structured content block contracts.

Final block rule

All multi-shape content blocks use a stable type discriminator.

Initial shared block families

At minimum:
	•	hero block
	•	rich text block
	•	feature grid block
	•	testimonial block
	•	CTA block
	•	FAQ block
	•	media block

Plus a ContentBlock discriminated union.

Rules
	•	only genuinely shared blocks go here
	•	do not move every visual variant here
	•	render-only props stay local

⸻

13.5 src/content/media.ts

Purpose

Provider-neutral media DTOs.

Initial exports
	•	media asset DTO
	•	image asset DTO
	•	responsive source DTO
	•	alt/caption fields where shared

Rules
	•	no R2/provider response objects
	•	keep provider-neutral
	•	shared between content, SEO, and rendering boundaries

⸻

14. src/events/

Repo-owned internal event contracts.

14.1 src/events/index.ts

Barrel for event files.

⸻

14.2 src/events/internal-events.ts

Purpose

Canonical internal domain event names and payloads.

Initial event families

At minimum:
	•	organization created/updated
	•	organization settings updated
	•	membership invited/updated
	•	booking appointment created/rescheduled/canceled
	•	integration connection created/updated
	•	analytics conversion recorded
	•	content page published/updated

Initial exports
	•	internal event name schema
	•	internal event envelope
	•	discriminated internal event union

Rules
	•	repo-owned names only
	•	include org context where known
	•	stable event semantics

⸻

14.3 src/events/queue-events.ts

Purpose

Queue/job payload contracts.

Initial queue job families

At minimum:
	•	analytics fanout requested
	•	integration sync requested
	•	webhook normalization requested
	•	SEO revalidation requested
	•	content publish/revalidation requested

Initial exports
	•	queue job name schema
	•	queue job envelope
	•	specific job payload schemas

Rules
	•	include org/provider context where applicable
	•	idempotency matters
	•	no queue runner implementation details

⸻

14.4 src/events/webhook-events.ts

Purpose

Normalized webhook-origin internal event contracts after verification/ingestion.

Initial exports
	•	normalized webhook event name schema
	•	normalized webhook event envelope
	•	webhook-origin metadata DTO

Rules
	•	post-normalization layer only
	•	raw provider events stay out
	•	this is a repo-owned internal event surface

⸻

15. src/api/

This folder stays intentionally small.

The repo prefers framework-native edges and direct typed returns where clarity wins.

15.1 src/api/index.ts

Barrel for API transport contracts.

⸻

15.2 src/api/envelopes.ts

Purpose

Small reusable JSON API transport envelopes.

Initial exports
	•	success envelope schema
	•	error envelope schema
	•	paginated success envelope schema
	•	optional mutation acknowledgement schema only if multiple real APIs need it

Rules
	•	do not force every app response into wrappers
	•	compose error shapes from common/errors.ts
	•	no framework abstraction layer here

⸻

16. src/internal/

Package-private implementation helpers only.

No public exports.

16.1 src/internal/constants.ts

Purpose

Internal constants.

Allowed examples
	•	page-size defaults
	•	max length limits
	•	internal regexes
	•	schema metadata defaults

Rules
	•	if something is truly a public contract concept, it belongs elsewhere

⸻

16.2 src/internal/schema-helpers.ts

Purpose

Tiny internal schema-builder helpers.

Allowed examples
	•	opaque ID schema builder
	•	strict-object helper
	•	reusable schema fragment builders

Rules
	•	keep tiny
	•	not a generic schema toolkit
	•	helpers should reduce repetition without hiding meaning

⸻

16.3 src/internal/schema-metadata.ts

Purpose

Consistent top-level schema metadata attachment helper.

Rules
	•	only support consistent id, title, description, optional deprecation metadata
	•	do not turn into a giant registry system unless a real future need exists

⸻

17. Test plan

This package uses two test layers.

17.1 test/setup.ts

Purpose

Shared runtime test setup.

Rules
	•	minimal only
	•	no global mocks that hide contract failures

⸻

17.2 Runtime test files

These verify parse/fail behavior, strictness, and contract invariants.

test/runtime/public-api.test.ts

Verifies public import surfaces behave as expected and no accidental cross-domain leak appears in root exports.

test/runtime/common/ids.test.ts

Valid and invalid opaque IDs.

test/runtime/common/json.test.ts

JSON-safe payload acceptance/rejection.

test/runtime/common/dates.test.ts

ISO/date/time/timezone and range validation.

test/runtime/common/money.test.ts

Currency + minor-unit behavior.

test/runtime/common/pagination.test.ts

Cursor/page-size validation and page info behavior.

test/runtime/common/metadata.test.ts

Metadata DTO strictness and shared semantics.

test/runtime/common/errors.test.ts

Public error and validation issue payload behavior.

test/runtime/organizations/organization.test.ts

Organization DTO acceptance/rejection.

test/runtime/organizations/membership.test.ts

Membership inputs and status validation.

test/runtime/organizations/roles.test.ts

Role vocabulary stability.

test/runtime/organizations/tenant-resolution.test.ts

Resolution result shapes and fallback cases.

test/runtime/organizations/organization-settings.test.ts

Shared settings DTO validation.

test/runtime/auth/session.test.ts

Normalized session payload validation.

test/runtime/auth/user.test.ts

User/actor DTO validation.

test/runtime/auth/permissions.test.ts

Access-result payload validation.

test/runtime/booking/services.test.ts

Service DTOs and write input validation.

test/runtime/booking/availability.test.ts

Availability query/slot/range validation.

test/runtime/booking/appointments.test.ts

Appointment lifecycle input/output validation.

test/runtime/booking/intake.test.ts

Field kinds, form definitions, submissions, and answer normalization shapes.

test/runtime/booking/reservation.test.ts

Reservation hold/start/confirm payload validation.

test/runtime/analytics/events.test.ts

Event vocabulary and discriminated event union validation.

test/runtime/analytics/attribution.test.ts

UTM/referrer/click ID context validation.

test/runtime/analytics/conversions.test.ts

Definitive conversion payload validation.

test/runtime/analytics/consent.test.ts

Consent category/state/snapshot validation.

test/runtime/integrations/providers.test.ts

Provider vocabulary and provider status validation.

test/runtime/integrations/oauth.test.ts

OAuth connect/callback/result payload validation.

test/runtime/integrations/credentials.test.ts

Safe credential summary and health payload validation.

test/runtime/integrations/webhooks.test.ts

Webhook receipt, verification, and normalized event validation.

test/runtime/integrations/sync-jobs.test.ts

Sync request/cursor/result/idempotency-relevant payload validation.

test/runtime/seo/metadata.test.ts

SEO metadata DTO validation.

test/runtime/seo/canonicals.test.ts

Canonical input/result behavior.

test/runtime/seo/sitemap.test.ts

Sitemap entry validation.

test/runtime/seo/robots.test.ts

Robots/indexing/demo-noindex payload validation.

test/runtime/content/pages.test.ts

Page DTO validation.

test/runtime/content/navigation.test.ts

Navigation/footer/breadcrumb validation.

test/runtime/content/blocks.test.ts

Discriminated block union validation.

test/runtime/content/media.test.ts

Media DTO validation.

test/runtime/events/internal-events.test.ts

Internal event envelope/name/payload stability.

test/runtime/events/queue-events.test.ts

Queue job envelope/payload validation.

test/runtime/events/webhook-events.test.ts

Normalized webhook-event contract validation.

test/runtime/api/envelopes.test.ts

Success/error/paginated transport envelope validation.

⸻

17.3 Type test files

These verify inferred-type stability and narrowing.

test/types/public-api.test-d.ts

Public subpath type surfaces remain stable.

test/types/common.test-d.ts

Common primitive type inference remains correct.

test/types/organizations.test-d.ts

Org/membership/role/tenant-resolution types remain intentional.

test/types/auth.test-d.ts

Session/user/access result types remain stable.

test/types/booking.test-d.ts

Booking unions and write input types remain correct.

test/types/analytics.test-d.ts

Analytics event and conversion unions narrow properly.

test/types/integrations.test-d.ts

Provider/OAuth/webhook/sync types remain stable.

test/types/seo.test-d.ts

SEO types remain framework-neutral and narrow.

test/types/content.test-d.ts

Content blocks/pages/media/navigation unions narrow correctly.

test/types/events.test-d.ts

Internal and queue event unions remain stable.

test/types/api.test-d.ts

API transport envelope types remain intentional.

⸻

18. Public API rules

Allowed imports

Consumers may import only from:
	•	@repo/contracts
	•	@repo/contracts/common
	•	@repo/contracts/organizations
	•	@repo/contracts/auth
	•	@repo/contracts/booking
	•	@repo/contracts/analytics
	•	@repo/contracts/integrations
	•	@repo/contracts/seo
	•	@repo/contracts/content
	•	@repo/contracts/events
	•	@repo/contracts/api

Forbidden imports

Consumers must not import from:
	•	@repo/contracts/src/...
	•	@repo/contracts/internal/...
	•	built dist/* directly

No deep imports.

⸻

19. Naming conventions

These are final.

Schemas

Use Schema suffix.

Examples:
	•	OrganizationSummarySchema
	•	AvailabilitySlotSchema
	•	AnalyticsEventSchema

Types

Drop the suffix.

Examples:
	•	OrganizationSummary
	•	AvailabilitySlot
	•	AnalyticsEvent

Input schemas

Use InputSchema when the contract is specifically inbound.

Examples:
	•	InviteMemberInputSchema
	•	CreateAppointmentInputSchema

DTO names

Names must describe exchange purpose.

Good:
	•	OrganizationSummary
	•	ReservationConfirmation
	•	ConnectionCredentialSummary

Bad:
	•	OrganizationData
	•	Payload
	•	Thing
	•	ItemType

Discriminators
	•	content blocks use type
	•	analytics events use type
	•	internal events may use name
	•	queue events may use name

Be consistent inside each family.

⸻

20. Dependency and import boundaries

This package may import:
	•	zod
	•	package-private internal helpers inside itself

This package must not import:
	•	apps
	•	@repo/db
	•	@repo/auth
	•	@repo/ui
	•	provider SDKs
	•	framework packages
	•	process.env
	•	filesystem APIs
	•	network libraries
	•	logging

This package contains no side effects and no I/O.

⸻

21. What should never exist here

These are drift signs and are forbidden.

src/types/
src/models/
src/misc/
src/shared/
src/prisma/
src/database/
src/ui/
src/temp/
src/helpers/all.ts

Also forbidden:
	•	raw framework request/response contracts
	•	provider-native webhook payload re-exports
	•	generated provider/OpenAPI types promoted as repo contracts
	•	UI prop bags
	•	app-local DAL result shapes
	•	billing/invoice contracts
	•	CRM contracts
	•	observability payload contracts unless a real shared boundary later exists

⸻

22. Files that are intentionally absent

This is important because omission is part of the design.

These files do not exist:
	•	src/common/status.ts
	•	src/api/mutations.ts
	•	src/api/query-results.ts
	•	src/booking/checkout.ts
	•	src/content/templates.ts
	•	src/integrations/provider-native.ts

Why:
	•	no generic status dumping ground
	•	API layer stays intentionally small
	•	booking is not a billing/checkout domain yet
	•	page templates are small enough to live in pages.ts
	•	provider-native types stay out

⸻

23. General implementation pattern for all source files

Every public leaf file should:
	1.	define schemas first
	2.	export inferred types second
	3.	export only intentional public symbols
	4.	attach metadata to top-level public schemas where reasonable
	5.	avoid mixing unrelated contract families in one file

Every domain index.ts should:
	•	re-export only that domain’s public files
	•	never export from internal/

If a file grows too large:
	•	split within the same domain
	•	do not create vague overflow folders

⸻

24. Build order

Phase 1

Skeleton and package discipline:
	•	package.json
	•	tsconfig.json
	•	tsup.config.ts
	•	vitest.config.ts
	•	README.md
	•	src/index.ts
	•	all domain index.ts
	•	src/internal/*

Phase 2

Common primitives:
	•	ids.ts
	•	json.ts
	•	dates.ts
	•	money.ts
	•	pagination.ts
	•	metadata.ts
	•	errors.ts

Phase 3

Core multi-tenant and auth-adjacent:
	•	organizations/*
	•	auth/*

Phase 4

Booking:
	•	services.ts
	•	availability.ts
	•	appointments.ts
	•	intake.ts
	•	reservation.ts

Phase 5

Analytics and integrations:
	•	analytics/*
	•	integrations/*

Phase 6

SEO and content:
	•	seo/*
	•	content/*

Phase 7

Events and API:
	•	events/*
	•	api/envelopes.ts

Phase 8

Tests:
	•	runtime tests
	•	type tests
	•	public API sanity

⸻

25. Definition of done

packages/contracts is done when:
	•	the directory matches this source of truth
	•	the package is Zod-first
	•	the root export stays small
	•	domain contracts are subpath-based
	•	shared public contracts are JSON-safe by default
	•	no DB/auth/framework/provider leakage exists
	•	runtime tests cover parse/fail behavior
	•	type tests cover inference and narrowing stability
	•	README explains placement rules clearly
	•	no drift-sign folders or files exist

⸻

26. Non-goals

This package is not:
	•	a dumping ground for every reusable type
	•	the DB model layer
	•	the auth implementation layer
	•	a provider SDK wrapper
	•	a UI prop library
	•	a framework abstraction layer
	•	a billing or CRM package
	•	a general-purpose utilities package

It is a boundary contract package.

⸻

27. Final instruction to future agents

When deciding whether something belongs here, ask:
	1.	Does it cross a real boundary?
	2.	Does it need runtime validation?
	3.	Is it stable enough to standardize?
	4.	Is it framework-neutral?
	5.	Is it repo-owned rather than vendor-owned?
	6.	Would duplication elsewhere create drift?

If the answer is not clearly yes, keep it local.

The most important rule:

Do not make @repo/contracts bigger just because something is shared. Make it bigger only when a shared boundary needs a stable contract.