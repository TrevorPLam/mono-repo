# repo/env/env-canonical.md

packages/env/ — final source of truth

Purpose

packages/env is the single environment contract package for the monorepo.

It exists to make environment access:
	•	typed
	•	validated
	•	boundary-safe
	•	framework-aware
	•	explicit
	•	boring

This package does not exist to be clever. It exists to stop the repo from devolving into scattered process.env.*, accidental browser leakage, app-by-app reinvention, and silent runtime misconfiguration.

⸻

What this package owns

packages/env owns:
	•	env definition primitives
	•	env parsing and coercion
	•	env validation
	•	clear env-specific error messages
	•	server-only env concern modules
	•	browser-safe env concern modules
	•	app composition modules
	•	package composition modules
	•	a narrow public API for env contracts
	•	tests proving the contract behavior

⸻

What this package does not own

packages/env does not own:
	•	secret storage
	•	.env file loading
	•	Vercel project configuration
	•	vercel env pull
	•	Astro config loading
	•	Prisma CLI loading behavior
	•	feature flags
	•	business configuration
	•	tenant data
	•	client OAuth tokens
	•	arbitrary app config objects

If something is request-bound, tenant-bound, user-bound, or feature/business-bound, it probably does not belong here.

⸻

Non-negotiable design decisions

1. packages/env is framework-agnostic

It defines logical contracts and validation machinery.

It does not directly depend on:
	•	astro:env
	•	@next/env
	•	dotenv
	•	Vercel CLI behavior
	•	framework config loaders

That decision is necessary because Next and Astro expose env differently: Next loads .env* into process.env, while Astro uses import.meta.env in app code, only exposes PUBLIC_* to client code, and does not load .env into astro.config.* automatically. Astro’s astro:env is also limited to Astro context and cannot be used in astro.config.* or arbitrary scripts.  

2. Public/browser env is build-time public config only

Public env is only for safe public identifiers and harmless client-visible values.

It is not for:
	•	secrets
	•	mutable runtime browser config
	•	request-scoped values
	•	tenant secrets
	•	post-build deployment overrides

In Next, NEXT_PUBLIC_* is inlined into the client bundle at build time, frozen after build, and dynamic lookups are not inlined. Astro’s Vite-based env is also statically replaced at build time, and only PUBLIC_* is exposed to client code.  

3. next.config.* env is forbidden

Do not use next.config.js / next.config.ts env.

Next documents that variables specified there are always included in the JavaScript bundle, and the NEXT_PUBLIC_ prefix does not control exposure in that mechanism.  

4. This package does not load dotenv

No dotenv/config import lives in packages/env.

Loading belongs to callers:
	•	Next runtime
	•	Astro runtime
	•	Prisma config
	•	test setup
	•	app-local or package-local tooling

That keeps source binding explicit.

5. No third-party env abstraction library

Do not use:
	•	@t3-oss/env-*
	•	envalid
	•	envsafe
	•	zod as the primary runtime env contract layer

Use a tiny internal definition/parsing layer instead.

6. No raw ambient env outside approved boundaries

Outside:
	•	packages/env
	•	explicit app-local env binding files
	•	explicit tooling/config files that intentionally load env

the repo should not reach into raw env directly.

7. Server and browser entrypoints stay separate

No browser-facing path may import from server env modules.
No root barrel may export server env.
No all.ts may exist.

8. Browser binding is explicit, and Next client binding must use direct property reads

This is critical.

Because Next only inlines direct process.env.NEXT_PUBLIC_* references and does not inline dynamic access patterns like process.env[varName] or const env = process.env; env.NEXT_PUBLIC_X, Next client code must not pass raw process.env into a generic parser that reads keys dynamically. Instead, Next client binding files must build a literal source object with direct property reads.  

Correct Next client pattern:

createAppBookingBrowserEnv({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  NEXT_PUBLIC_GTM_CONTAINER_ID: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
})

Astro client binding can pass import.meta.env directly.

9. Turborepo env accounting is part of the contract

Using @repo/env is not enough by itself.

Turbo default env mode is strict, framework inference is per-package, .env files are not loaded by Turbo, passthrough vars exist separately, and Turbo recommends app/package-local .env over a monorepo root .env.  

So:
	•	task env ownership still belongs in turbo.json
	•	.env* changes still need to be accounted for in task inputs/globalDependencies
	•	per-app env ownership is the steady-state rule for this repo

10. Vercel normalization happens centrally

Vercel exposes system vars like VERCEL, VERCEL_TARGET_ENV, VERCEL_URL, and VERCEL_PROJECT_PRODUCTION_URL. VERCEL_URL and VERCEL_PROJECT_PRODUCTION_URL are host-only and omit https://, while VERCEL_PROJECT_PRODUCTION_URL is always set, even on preview deployments. That normalization belongs in src/server/vercel.ts, not in ad hoc app code.  

11. Prisma-specific loading is a caller concern

Prisma 7 moved CLI configuration into prisma.config.ts, which is where datasource URL loading is configured. packages/env defines the DB contract, but Prisma CLI loading remains the responsibility of packages/db/prisma.config.ts.  

12. Astro canonical URL truth stays explicit

Astro strongly recommends setting site, and uses it to generate sitemap and canonical URLs. That means site-firm and site-platform need an explicit app-level deployed URL input rather than relying on ambient preview hosts as canonical truth.  

⸻

Exact directory tree

No files beyond this tree should exist unless the package scope changes materially.

packages/env/
├─ package.json
├─ tsconfig.json
├─ tsup.config.ts
├─ README.md
├─ src/
│  ├─ index.ts
│  ├─ shared/
│  │  ├─ index.ts
│  │  ├─ primitives.ts
│  │  ├─ helpers.ts
│  │  ├─ errors.ts
│  │  └─ constants.ts
│  ├─ internal/
│  │  ├─ create-env.ts
│  │  ├─ parse.ts
│  │  ├─ access.ts
│  │  └─ server-only.ts
│  ├─ server/
│  │  ├─ index.ts
│  │  ├─ node.ts
│  │  ├─ core.ts
│  │  ├─ database.ts
│  │  ├─ auth.ts
│  │  ├─ observability.ts
│  │  ├─ analytics.ts
│  │  ├─ integrations.ts
│  │  ├─ storage.ts
│  │  └─ vercel.ts
│  ├─ browser/
│  │  ├─ index.ts
│  │  ├─ public.ts
│  │  ├─ analytics.ts
│  │  └─ app.ts
│  ├─ app/
│  │  ├─ index.ts
│  │  ├─ site-firm.ts
│  │  ├─ site-platform.ts
│  │  └─ app-booking.ts
│  └─ package/
│     ├─ index.ts
│     ├─ auth.ts
│     ├─ db.ts
│     ├─ analytics.ts
│     ├─ observability.ts
│     └─ integrations-core.ts
└─ test/
   ├─ fixtures/
   │  ├─ server.ts
   │  └─ browser.ts
   ├─ shared/
   │  ├─ helpers.test.ts
   │  └─ errors.test.ts
   ├─ server/
   │  ├─ node.test.ts
   │  ├─ core.test.ts
   │  ├─ database.test.ts
   │  ├─ auth.test.ts
   │  ├─ observability.test.ts
   │  ├─ analytics.test.ts
   │  ├─ integrations.test.ts
   │  ├─ storage.test.ts
   │  └─ vercel.test.ts
   ├─ browser/
   │  ├─ public.test.ts
   │  ├─ analytics.test.ts
   │  └─ app.test.ts
   ├─ app/
   │  ├─ site-firm.test.ts
   │  ├─ site-platform.test.ts
   │  └─ app-booking.test.ts
   └─ package/
      ├─ auth.test.ts
      ├─ db.test.ts
      ├─ analytics.test.ts
      ├─ observability.test.ts
      └─ integrations-core.test.ts


⸻

Public API

Only these public entrypoints exist:
	•	@repo/env
	•	@repo/env/server
	•	@repo/env/browser
	•	@repo/env/app
	•	@repo/env/package

There are no public subpaths for:
	•	@repo/env/shared
	•	@repo/env/internal
	•	@repo/env/server/*
	•	@repo/env/browser/*
	•	@repo/env/app/*
	•	@repo/env/package/*

The package API is intentionally narrow.

⸻

Top-level files

package.json

Purpose

Defines the package as a compiled internal runtime package with a narrow exports surface.

Required contents
	•	"name": "@repo/env"
	•	"private": true
	•	"type": "module"
	•	"sideEffects": false
	•	"files": ["dist"]

Scripts
	•	"build": "tsup"
	•	"dev": "tsup --watch"
	•	"clean": "rm -rf dist .turbo"
	•	"typecheck": "tsc --noEmit"
	•	"test": "vitest run"

Exports

Must export exactly:
	•	.
	•	./server
	•	./browser
	•	./app
	•	./package

Dependency rules

Runtime dependencies should be zero unless an extremely small utility becomes unavoidable.
This package should not pull in large runtime libraries.

⸻

tsconfig.json

Purpose

Strict TypeScript config for a compiled internal package.

Rules
	•	extends repo base TS config
	•	strict mode on
	•	declaration-friendly
	•	ESM assumptions only
	•	no app path aliases
	•	no browser/server blur
	•	no implicit DOM usage in server code

⸻

tsup.config.ts

Purpose

Build config for a compiled-first runtime package.

Decisions
	•	ESM only
	•	declarations enabled
	•	sourcemaps enabled
	•	one entry per public entrypoint
	•	no bundling magic
	•	no extra format targets

Entries
	•	src/index.ts
	•	src/server/index.ts
	•	src/browser/index.ts
	•	src/app/index.ts
	•	src/package/index.ts

⸻

README.md

Purpose

This is a load-bearing package README. It should be strong enough that an agent can follow the env model without inventing a second one.

Required sections
	•	package purpose
	•	why raw env access is forbidden
	•	framework binding model
	•	Next vs Astro differences
	•	why next.config.* env is banned
	•	public env build-time rules
	•	browser binding rules for Next and Astro
	•	server vs browser placement rules
	•	raw env inventory
	•	naming rules
	•	how to add a new variable
	•	how to add a new concern module
	•	how to add a new app composition module
	•	how to add a new package composition module
	•	Turborepo env accounting reminder
	•	Vercel normalization reminder
	•	Prisma CLI exception note
	•	correct import examples
	•	forbidden import examples

⸻

src/index.ts

Purpose

Conservative root export.

What it exports

Only safe shared types and errors, for example:
	•	EnvContractError
	•	EnvMissingValueError
	•	EnvInvalidValueError
	•	EnvBoundaryViolationError
	•	type EnvSource
	•	PUBLIC_ENV_PREFIXES
	•	NODE_ENVS
	•	LOG_LEVELS

What it does not export
	•	server env creators
	•	browser env creators
	•	app composition creators
	•	package composition creators

Importing @repo/env alone must never risk dragging server configuration into a client path.

⸻

src/shared/

This folder contains reusable definitions and helpers.
It is internal to the package, not a public subpath.

src/shared/index.ts

Purpose

Local internal barrel for package implementation.

Exports
	•	primitives
	•	helpers
	•	constants
	•	error classes

⸻

src/shared/primitives.ts

Purpose

Defines the internal env-definition DSL primitives.

Exported primitive builders
	•	stringVar()
	•	urlVar()
	•	enumVar()
	•	booleanVar()
	•	integerVar()
	•	csvVar()

Supported common options
	•	from
	•	fromAnyOf
	•	required
	•	defaultValue
	•	description
	•	allowEmpty
	•	validate optional post-parse validator

Canonical behavior
	•	strings are trimmed
	•	URLs are validated but returned as trimmed strings
	•	booleans accept true/false, 1/0, yes/no, on/off
	•	integers reject floats
	•	CSV trims items and drops empties

Important rule

This file contains primitive definition builders only.
No module composition logic belongs here.

⸻

src/shared/helpers.ts

Purpose

Shared helper types and small definition helpers.

Exports
	•	type EnvSource = Record<string, unknown>
	•	type EnvDefinition<T>
	•	type EnvShape
	•	type InferEnv<TShape>
	•	requiredInProduction()
	•	optionalInDevelopment()
	•	withDefault()
	•	publicKey()
	•	publicKeys()
	•	freezeEnvObject()

Important rule

publicKey() and publicKeys() validate that browser/public raw keys use approved public prefixes.

⸻

src/shared/errors.ts

Purpose

Canonical env-specific error classes and formatting.

Exports
	•	EnvContractError
	•	EnvMissingValueError
	•	EnvInvalidValueError
	•	EnvBoundaryViolationError
	•	formatEnvErrorMessage()

Error message requirements

Every thrown error must include:
	•	module name
	•	logical key
	•	raw key or candidate raw keys
	•	expected type/rule
	•	whether the value was missing, empty, or invalid

Style rule

Error messages should be optimized for debugging by agents, not just humans.

⸻

src/shared/constants.ts

Purpose

Small stable constants only.

Exports
	•	NODE_ENVS = ['development', 'test', 'production']
	•	LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error']
	•	VERCEL_ENVS = ['development', 'preview', 'production']
	•	PUBLIC_ENV_PREFIXES = ['NEXT_PUBLIC_', 'PUBLIC_']

Important rule

Do not turn this into a generic constants junk drawer.

⸻

src/internal/

This folder is private implementation machinery.

src/internal/create-env.ts

Purpose

Single execution engine for env module creation.

Exports
	•	createEnvModule()

Responsibilities
	•	read from a source object
	•	resolve key mappings
	•	parse and validate values
	•	build clear errors
	•	freeze the returned object
	•	optionally memoize process-env-based server getters

Memoization rule

Memoize only when:
	•	the module is using default process.env
	•	the getter path is the package’s default getter

Do not memoize arbitrary caller-supplied fixture objects.

⸻

src/internal/parse.ts

Purpose

Implementation of primitive parsing.

Internal parse functions
	•	parseString
	•	parseUrl
	•	parseEnum
	•	parseBoolean
	•	parseInteger
	•	parseCsv

Important rule

This file contains parsing only.
No concern-module logic and no app/package composition logic.

⸻

src/internal/access.ts

Purpose

Source-access normalization.

Exports
	•	readSourceValue()
	•	readMappedSourceValue()
	•	normalizeRawValue()

Required behavior
	•	handle unknown
	•	preserve booleans/numbers when present
	•	trim strings
	•	distinguish missing from empty
	•	support fallback order via fromAnyOf

⸻

src/internal/server-only.ts

Purpose

Generic server-runtime assertion without framework coupling.

Exports
	•	assertServerRuntime(moduleName: string)

Rules
	•	no dependency on Next’s server-only
	•	no framework-specific imports
	•	light runtime assertion only

Next apps may still add their own app-local server-only imports in server entrypoints. This package stays portable.

⸻

src/server/

Everything here is server-only.

Shared pattern for every server module

Each file exports:
	•	a type
	•	createXEnv(source = process.env)
	•	getXEnv() memoized getter

Server modules may default to process.env because server code runs in Node/server runtimes where that access model is valid. Next also documents that non-NEXT_PUBLIC_ env is server-only by default.  

⸻

src/server/index.ts

Purpose

Public server entrypoint.

Exports

All server types and all server creator/getter functions.

⸻

src/server/node.ts

Purpose

Canonical Node/runtime env.

Raw keys
	•	NODE_ENV
	•	CI

Exports
	•	type NodeServerEnv
	•	createNodeServerEnv()
	•	getNodeServerEnv()

Logical fields
	•	nodeEnv
	•	isDevelopment
	•	isTest
	•	isProduction
	•	isCI

Rules
	•	NODE_ENV is required
	•	allowed values are development, test, production
	•	CI defaults to false

Next documents those as the relevant NODE_ENV values in its env loading model.  

⸻

src/server/core.ts

Purpose

Small shared operational server env.

Raw keys
	•	LOG_LEVEL

Exports
	•	type CoreServerEnv
	•	createCoreServerEnv()
	•	getCoreServerEnv()

Logical fields
	•	logLevel

Rules
	•	defaults to info
	•	allowed values from LOG_LEVELS

This file intentionally stays small.

⸻

src/server/database.ts

Purpose

Database contract shared by apps and @repo/db.

Raw keys
	•	DATABASE_URL
	•	DATABASE_MIGRATION_URL
	•	SHADOW_DATABASE_URL

Exports
	•	type DatabaseServerEnv
	•	createDatabaseServerEnv()
	•	getDatabaseServerEnv()

Logical fields
	•	databaseUrl
	•	databaseMigrationUrl
	•	shadowDatabaseUrl

Rules
	•	DATABASE_URL is required in the generic runtime module
	•	DATABASE_MIGRATION_URL is optional here
	•	SHADOW_DATABASE_URL is optional here

Project-specific interpretation
	•	runtime code uses databaseUrl
	•	migration tooling may tighten databaseMigrationUrl
	•	Prisma CLI behavior remains owned by packages/db/prisma.config.ts

Prisma 7’s config model makes the datasource URL live in prisma.config.ts, and Prisma’s upgrade guidance says the CLI migration URL behavior now flows through that config file.  

⸻

src/server/auth.ts

Purpose

Auth server env for @repo/auth and protected apps.

Raw keys
	•	BETTER_AUTH_SECRET
	•	BETTER_AUTH_TRUSTED_ORIGINS

Exports
	•	type AuthServerEnv
	•	createAuthServerEnv()
	•	getAuthServerEnv()

Logical fields
	•	betterAuthSecret
	•	betterAuthTrustedOrigins

Rules
	•	BETTER_AUTH_SECRET required when auth is used
	•	trusted origins parsed as CSV URL list
	•	no OAuth env here yet, because OAuth is deferred in the v1 auth baseline

⸻

src/server/observability.ts

Purpose

Observability runtime env.

Raw keys
	•	OTEL_EXPORTER_OTLP_ENDPOINT
	•	OTEL_EXPORTER_OTLP_HEADERS
	•	AXIOM_TOKEN
	•	AXIOM_DATASET
	•	SENTRY_DSN

Exports
	•	type ObservabilityServerEnv
	•	createObservabilityServerEnv()
	•	getObservabilityServerEnv()

Logical fields
	•	otlpEndpoint
	•	otlpHeaders
	•	axiomToken
	•	axiomDataset
	•	sentryDsn

Rules

All optional at the shared-module level.

⸻

src/server/analytics.ts

Purpose

Server analytics / conversion env.

Raw keys
	•	GA_MEASUREMENT_ID
	•	GA_MEASUREMENT_PROTOCOL_SECRET
	•	META_CAPI_TOKEN
	•	POSTHOG_API_KEY

Exports
	•	type AnalyticsServerEnv
	•	createAnalyticsServerEnv()
	•	getAnalyticsServerEnv()

Logical fields
	•	gaMeasurementId
	•	gaMeasurementProtocolSecret
	•	metaCapiToken
	•	posthogApiKey

Rules

All optional in the shared module.
App/package compositions can tighten requiredness later if needed.

⸻

src/server/integrations.ts

Purpose

Shared integration infrastructure env.

Raw keys
	•	GOOGLE_CLIENT_ID
	•	GOOGLE_CLIENT_SECRET
	•	META_APP_ID
	•	META_APP_SECRET

Exports
	•	type IntegrationsServerEnv
	•	createIntegrationsServerEnv()
	•	getIntegrationsServerEnv()

Logical fields
	•	googleClientId
	•	googleClientSecret
	•	metaAppId
	•	metaAppSecret

Rules

All optional initially.

Important distinction

This file is for firm-level app credentials and provider secrets.
It is not for client OAuth tokens stored in the database.

⸻

src/server/storage.ts

Purpose

Cloudflare R2 / storage env.

Raw keys
	•	R2_ACCOUNT_ID
	•	R2_ACCESS_KEY_ID
	•	R2_SECRET_ACCESS_KEY
	•	R2_BUCKET_NAME
	•	R2_PUBLIC_BASE_URL

Exports
	•	type StorageServerEnv
	•	createStorageServerEnv()
	•	getStorageServerEnv()

Logical fields
	•	r2AccountId
	•	r2AccessKeyId
	•	r2SecretAccessKey
	•	r2BucketName
	•	r2PublicBaseUrl

Rules
	•	first four required when storage is actually in use
	•	public base URL optional

⸻

src/server/vercel.ts

Purpose

Normalize Vercel runtime/build metadata.

Raw keys
	•	VERCEL
	•	VERCEL_ENV
	•	VERCEL_TARGET_ENV
	•	VERCEL_URL
	•	VERCEL_PROJECT_PRODUCTION_URL
	•	VERCEL_GIT_COMMIT_REF
	•	VERCEL_GIT_COMMIT_SHA
	•	VERCEL_DEPLOYMENT_ID

Exports
	•	type VercelServerEnv
	•	createVercelServerEnv()
	•	getVercelServerEnv()

Logical fields
	•	isVercel
	•	vercelEnv
	•	vercelTargetEnv
	•	deploymentHost
	•	deploymentUrl
	•	productionHost
	•	productionUrl
	•	gitBranch
	•	gitCommitSha
	•	deploymentId

Rules
	•	normalize host-only vars to full https:// URLs in derived fields
	•	callers must never hand-roll https://${VERCEL_URL}
	•	VERCEL_TARGET_ENV may contain custom environment names
	•	productionUrl uses VERCEL_PROJECT_PRODUCTION_URL when available

These behaviors follow Vercel’s documented system-variable semantics.  

⸻

src/browser/

Everything here is browser-safe only.

Shared pattern for every browser module

Each file exports:
	•	a type
	•	createXEnv(source: EnvSource)

There is no default getter for browser env.
The caller must pass an explicit source object.

This is deliberate because Astro client env comes from import.meta.env, and Next client env must avoid dynamic process.env access to preserve build-time inlining.  

⸻

src/browser/index.ts

Purpose

Public browser entrypoint.

Exports

All browser types and browser creator functions.

⸻

src/browser/public.ts

Purpose

Generic browser-safe public config.

Supported raw keys by convention

Astro-style:
	•	PUBLIC_SITE_URL
	•	PUBLIC_ASSET_BASE_URL

Next-style:
	•	NEXT_PUBLIC_APP_URL
	•	NEXT_PUBLIC_ASSET_BASE_URL

Exports
	•	type PublicBrowserEnv
	•	createPublicBrowserEnv(source)

Logical fields
	•	appUrl
	•	assetBaseUrl

Rules
	•	both optional
	•	only public-safe values allowed
	•	module validates that candidate raw keys use approved public prefixes

⸻

src/browser/analytics.ts

Purpose

Browser-safe analytics identifiers.

Supported raw keys by convention

Astro:
	•	PUBLIC_GA_MEASUREMENT_ID
	•	PUBLIC_GTM_CONTAINER_ID

Next:
	•	NEXT_PUBLIC_GA_MEASUREMENT_ID
	•	NEXT_PUBLIC_GTM_CONTAINER_ID
	•	NEXT_PUBLIC_POSTHOG_KEY
	•	NEXT_PUBLIC_POSTHOG_HOST

Exports
	•	type AnalyticsBrowserEnv
	•	createAnalyticsBrowserEnv(source)

Logical fields
	•	gaMeasurementId
	•	gtmContainerId
	•	posthogKey
	•	posthogHost

Rules

All optional.
These are public identifiers only.

⸻

src/browser/app.ts

Purpose

Tiny browser-safe app runtime markers not covered elsewhere.

Supported raw keys by convention

Astro:
	•	PUBLIC_APP_ENV

Next:
	•	NEXT_PUBLIC_APP_ENV

Exports
	•	type AppBrowserEnv
	•	createAppBrowserEnv(source)

Logical fields
	•	publicAppEnv

Rule

This file must stay tiny.
It must not become a miscellaneous browser config dump.

⸻

src/app/

This folder defines env compositions for deployable apps.

These files stay thin.
They compose concern modules and app-specific requiredness.
They do not invent new parsing logic.

Shared pattern

Each app file exports:
	•	server env type
	•	browser env type
	•	server env creator
	•	browser env creator

⸻

src/app/index.ts

Purpose

Public app entrypoint.

Exports
	•	createSiteFirmServerEnv
	•	createSiteFirmBrowserEnv
	•	createSitePlatformServerEnv
	•	createSitePlatformBrowserEnv
	•	createAppBookingServerEnv
	•	createAppBookingBrowserEnv
	•	related types

⸻

src/app/site-firm.ts

Purpose

Composition for the Astro firm website.

Server raw key
	•	SITE_URL

Server composition includes
	•	node env
	•	core env
	•	vercel env
	•	required siteUrl

Browser composition includes
	•	public browser env
	•	analytics browser env
	•	app browser env

Exports
	•	type SiteFirmServerEnv
	•	type SiteFirmBrowserEnv
	•	createSiteFirmServerEnv(source)
	•	createSiteFirmBrowserEnv(source)

Rules
	•	SITE_URL required
	•	no db env
	•	no auth env
	•	no integrations env
	•	no storage env unless the app truly starts using it

Why SITE_URL is required

Astro recommends a final deployed URL because it uses site for sitemap and canonical generation.  

⸻

src/app/site-platform.ts

Purpose

Composition for the shared Astro multi-tenant site host.

Server raw key
	•	SITE_URL

Server composition includes
	•	node env
	•	core env
	•	vercel env
	•	required siteUrl

Browser composition includes
	•	public browser env
	•	analytics browser env
	•	app browser env

Exports
	•	type SitePlatformServerEnv
	•	type SitePlatformBrowserEnv
	•	createSitePlatformServerEnv(source)
	•	createSitePlatformBrowserEnv(source)

Rules
	•	SITE_URL required
	•	keep v1 lean
	•	no db/auth here
	•	do not add storage or integrations until a real use appears

⸻

src/app/app-booking.ts

Purpose

Composition for the protected Next.js app.

Server raw key
	•	APP_URL

Server composition includes
	•	node env
	•	core env
	•	vercel env
	•	required appUrl
	•	auth env
	•	database env
	•	observability env
	•	analytics server env
	•	integrations env

Browser composition includes
	•	public browser env
	•	analytics browser env
	•	app browser env

Exports
	•	type AppBookingServerEnv
	•	type AppBookingBrowserEnv
	•	createAppBookingServerEnv(source)
	•	createAppBookingBrowserEnv(source)

Rules
	•	APP_URL required
	•	includes db + auth
	•	browser composition is public-only
	•	server fields must never appear in browser composition

⸻

src/package/

This folder defines env compositions for shared runtime packages so that packages do not stitch env shape together ad hoc.

Package composition creators may default to process.env.

src/package/index.ts

Purpose

Public package entrypoint.

Exports

All package composition creators and types.

⸻

src/package/auth.ts

Purpose

Env composition for @repo/auth.

Composition includes
	•	auth env
	•	node env
	•	core env
	•	vercel env

Exports
	•	type AuthPackageEnv
	•	createAuthPackageEnv(source = process.env)
	•	getAuthPackageEnv()

Rules
	•	keep minimal
	•	no database env
	•	no app URL requirement
	•	no OAuth additions until OAuth is actually adopted

⸻

src/package/db.ts

Purpose

Env composition for @repo/db.

Composition includes
	•	database env
	•	node env
	•	core env

Exports
	•	type DbPackageEnv
	•	createDbPackageEnv(source = process.env)
	•	getDbPackageEnv()

Rules
	•	runtime code uses databaseUrl
	•	migration tooling may use databaseMigrationUrl
	•	Prisma loading remains outside this package

⸻

src/package/analytics.ts

Purpose

Env composition for @repo/analytics.

Composition includes
	•	analytics server env
	•	node env
	•	core env
	•	vercel env

Exports
	•	type AnalyticsPackageEnv
	•	createAnalyticsPackageEnv(source = process.env)
	•	getAnalyticsPackageEnv()

⸻

src/package/observability.ts

Purpose

Env composition for @repo/observability.

Composition includes
	•	observability env
	•	node env
	•	core env
	•	vercel env

Exports
	•	type ObservabilityPackageEnv
	•	createObservabilityPackageEnv(source = process.env)
	•	getObservabilityPackageEnv()

⸻

src/package/integrations-core.ts

Purpose

Env composition for @repo/integrations-core.

Composition includes
	•	integrations env
	•	node env
	•	core env
	•	vercel env

Exports
	•	type IntegrationsCorePackageEnv
	•	createIntegrationsCorePackageEnv(source = process.env)
	•	getIntegrationsCorePackageEnv()

⸻

test/

This package is tested as a contract package, not as a parser toy.

test/fixtures/server.ts

Purpose

Explicit server-side fixtures.

Contents

Fixtures such as:
	•	minimalNodeSource
	•	validDatabaseSource
	•	validAuthSource
	•	vercelPreviewSource
	•	vercelProductionSource
	•	invalidUrlSource
	•	missingRequiredSource

Rule

Use fixtures instead of mutating ambient env wherever possible.

⸻

test/fixtures/browser.ts

Purpose

Explicit browser-side fixtures.

Contents

Fixtures such as:
	•	astroMarketingBrowserSource
	•	nextProductBrowserSource
	•	emptyBrowserSource
	•	invalidBrowserUrlSource

⸻

test/shared/helpers.test.ts

Covers
	•	helper behavior
	•	default handling
	•	production/dev requiredness helpers
	•	public prefix helpers

⸻

test/shared/errors.test.ts

Covers
	•	error class selection
	•	formatted messages
	•	missing vs empty vs invalid distinctions

⸻

test/server/node.test.ts

Covers
	•	NODE_ENV parsing
	•	CI coercion
	•	derived booleans

⸻

test/server/core.test.ts

Covers
	•	log level default
	•	invalid enum rejection

⸻

test/server/database.test.ts

Covers
	•	required DATABASE_URL
	•	optional migration URL
	•	optional shadow URL
	•	invalid URL rejection

⸻

test/server/auth.test.ts

Covers
	•	required secret
	•	trusted origins CSV parsing
	•	invalid origin list rejection

⸻

test/server/observability.test.ts

Covers
	•	optionality
	•	empty handling
	•	no accidental requiredness

⸻

test/server/analytics.test.ts

Covers
	•	optional analytics secrets
	•	empty value handling

⸻

test/server/integrations.test.ts

Covers
	•	optional credentials
	•	shape stability

⸻

test/server/storage.test.ts

Covers
	•	required R2 fields when used
	•	optional public base URL

⸻

test/server/vercel.test.ts

Covers
	•	protocol normalization
	•	preview vs production derived URLs
	•	VERCEL_ENV and VERCEL_TARGET_ENV
	•	git metadata

⸻

test/browser/public.test.ts

Covers
	•	Astro and Next public key mapping
	•	optional fields
	•	prefix enforcement

⸻

test/browser/analytics.test.ts

Covers
	•	GA/GTM/PostHog public identifiers
	•	optional mapping behavior

⸻

test/browser/app.test.ts

Covers
	•	app env marker mapping
	•	contract-level separation from server secrets

⸻

test/app/site-firm.test.ts

Covers
	•	composition shape
	•	required SITE_URL
	•	no db/auth leakage

⸻

test/app/site-platform.test.ts

Covers
	•	composition shape
	•	required SITE_URL
	•	lean composition

⸻

test/app/app-booking.test.ts

Covers
	•	full protected app composition
	•	required APP_URL
	•	db/auth inclusion
	•	browser/server separation

⸻

test/package/auth.test.ts

Covers
	•	auth package composition shape

⸻

test/package/db.test.ts

Covers
	•	db package composition shape
	•	migration URL optionality in generic package composition

⸻

test/package/analytics.test.ts

Covers
	•	analytics package composition shape

⸻

test/package/observability.test.ts

Covers
	•	observability package composition shape

⸻

test/package/integrations-core.test.ts

Covers
	•	integrations-core package composition shape

⸻

Canonical raw env inventory

This is the initial supported inventory.

Shared server env

Node/runtime
	•	NODE_ENV required
	•	CI optional

Core
	•	LOG_LEVEL optional, default info

Database
	•	DATABASE_URL required
	•	DATABASE_MIGRATION_URL optional
	•	SHADOW_DATABASE_URL optional

Auth
	•	BETTER_AUTH_SECRET required when auth is used
	•	BETTER_AUTH_TRUSTED_ORIGINS optional

Observability
	•	OTEL_EXPORTER_OTLP_ENDPOINT optional
	•	OTEL_EXPORTER_OTLP_HEADERS optional
	•	AXIOM_TOKEN optional
	•	AXIOM_DATASET optional
	•	SENTRY_DSN optional

Analytics
	•	GA_MEASUREMENT_ID optional
	•	GA_MEASUREMENT_PROTOCOL_SECRET optional
	•	META_CAPI_TOKEN optional
	•	POSTHOG_API_KEY optional

Integrations
	•	GOOGLE_CLIENT_ID optional
	•	GOOGLE_CLIENT_SECRET optional
	•	META_APP_ID optional
	•	META_APP_SECRET optional

Storage
	•	R2_ACCOUNT_ID required when storage is used
	•	R2_ACCESS_KEY_ID required when storage is used
	•	R2_SECRET_ACCESS_KEY required when storage is used
	•	R2_BUCKET_NAME required when storage is used
	•	R2_PUBLIC_BASE_URL optional

Vercel
	•	VERCEL optional
	•	VERCEL_ENV optional
	•	VERCEL_TARGET_ENV optional
	•	VERCEL_URL optional
	•	VERCEL_PROJECT_PRODUCTION_URL optional
	•	VERCEL_GIT_COMMIT_REF optional
	•	VERCEL_GIT_COMMIT_SHA optional
	•	VERCEL_DEPLOYMENT_ID optional

App-specific server env

Astro apps
	•	SITE_URL required

Protected Next apps
	•	APP_URL required

Browser-safe env

Astro
	•	PUBLIC_SITE_URL optional
	•	PUBLIC_ASSET_BASE_URL optional
	•	PUBLIC_GA_MEASUREMENT_ID optional
	•	PUBLIC_GTM_CONTAINER_ID optional
	•	PUBLIC_APP_ENV optional

Next
	•	NEXT_PUBLIC_APP_URL optional
	•	NEXT_PUBLIC_ASSET_BASE_URL optional
	•	NEXT_PUBLIC_GA_MEASUREMENT_ID optional
	•	NEXT_PUBLIC_GTM_CONTAINER_ID optional
	•	NEXT_PUBLIC_POSTHOG_KEY optional
	•	NEXT_PUBLIC_POSTHOG_HOST optional
	•	NEXT_PUBLIC_APP_ENV optional

Naming rule

Use simple project-scoped names like SITE_URL and APP_URL, not monorepo-global novelty names.

⸻

Import rules

Allowed imports into packages/env

Allowed:
	•	standard TS/JS runtime utilities
	•	no app code
	•	no higher-level runtime packages

Forbidden:
	•	@repo/auth
	•	@repo/db
	•	@repo/ui
	•	@repo/analytics
	•	@repo/observability
	•	feature packages
	•	app code

This package must stay low in the dependency graph.

Allowed imports from consumers

Server code

Use:
	•	@repo/env/server
	•	@repo/env/app
	•	@repo/env/package

Browser code

Use:
	•	@repo/env/browser
	•	@repo/env/app
through app-local binding files

Root import

@repo/env is only for safe shared types/errors/constants.

⸻

Required consumer binding patterns

These files are outside packages/env, but this package’s design assumes they exist.

Next server binding

// apps/app-booking/src/env/server.ts
import { createAppBookingServerEnv } from '@repo/env/app';

export const serverEnv = createAppBookingServerEnv(process.env);

Next client binding

// apps/app-booking/src/env/client.ts
import { createAppBookingBrowserEnv } from '@repo/env/app';

export const clientEnv = createAppBookingBrowserEnv({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  NEXT_PUBLIC_GTM_CONTAINER_ID: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
});

This literal-object pattern is required because Next does not inline dynamic lookups.  

Astro server binding

// apps/site-firm/src/env/server.ts
import { createSiteFirmServerEnv } from '@repo/env/app';

export const serverEnv = createSiteFirmServerEnv(process.env);

Astro client binding

// apps/site-firm/src/env/client.ts
import { createSiteFirmBrowserEnv } from '@repo/env/app';

export const clientEnv = createSiteFirmBrowserEnv(import.meta.env);

Astro uses import.meta.env in app code, exposes only PUBLIC_* to client code, and does not make .env values available through import.meta.env in astro.config.*.  

Astro config-time rule

If an Astro config file needs env:
	•	use process.env
	•	or use local vite loadEnv in the app

Do not expect packages/env to solve Astro config-time loading. Astro documents that import.meta.env cannot access .env values in astro.config.*, and with pnpm you need vite installed locally to use loadEnv.  

Next tooling/test rule

If a Next-oriented config or test runner needs .env* loading outside runtime, use @next/env in that caller, not inside packages/env. Next documents loadEnvConfig for ORM/test-runner scenarios and has special .env.test behavior.  

Prisma rule

packages/db/prisma.config.ts owns Prisma CLI env loading.
That file may use Prisma’s documented config APIs and dotenv loading, but that exception stays in packages/db, not here.  

⸻

Turborepo coordination rules

This package defines contracts.
It does not replace turbo.json.

Repo policy
	•	keep Turbo in strict env mode
	•	declare task env in env / globalEnv
	•	use passThroughEnv only for truly non-hash-affecting values
	•	account for .env* changes in task inputs/globalDependencies
	•	prefer app/package-local .env ownership over a root monorepo .env

Turbo documents strict mode as the default, framework inference as per-package, .env as not loaded by Turbo itself, and recommends placing .env files in the packages where they are used.  

⸻

Vercel coordination rules

Repo policy
	•	project-level env is the default for client-specific values
	•	team-level env only for truly global non-client values
	•	server/vercel.ts is the only place that normalizes Vercel hosts/URLs
	•	canonical production URLs come from explicit app config first
	•	Vercel deployment hosts are fallbacks or preview/runtime helpers, not canonical truth

Vercel documents separate Production / Preview / Development environments, project-vs-team scope, vercel env pull, and the semantics of the system vars used here.  

⸻

Forbidden patterns

Hard no:
	•	src/lib/
	•	src/utils/misc.ts
	•	src/all.ts
	•	src/client-and-server.ts
	•	src/secrets/
	•	src/feature-flags/
	•	wildcard export maps
	•	deep public imports
	•	hidden dotenv loading inside this package
	•	next.config.* env
	•	browser modules importing server modules
	•	mutation of returned env objects
	•	raw process.env usage spread across the repo

⸻

Implementation order

Phase 1
	•	package.json
	•	tsconfig.json
	•	tsup.config.ts
	•	README.md
	•	folder skeleton

Phase 2
	•	shared/errors.ts
	•	shared/constants.ts
	•	shared/helpers.ts
	•	shared/primitives.ts

Phase 3
	•	internal/access.ts
	•	internal/parse.ts
	•	internal/server-only.ts
	•	internal/create-env.ts

Phase 4
	•	all src/server/*
	•	src/server/index.ts

Phase 5
	•	all src/browser/*
	•	src/browser/index.ts

Phase 6
	•	all src/app/*
	•	src/app/index.ts

Phase 7
	•	all src/package/*
	•	src/package/index.ts

Phase 8
	•	src/index.ts
	•	fixtures
	•	all tests

⸻

Definition of done

packages/env is done when:
	•	all env access flows through explicit validated contracts
	•	server and browser entrypoints are fully separate
	•	browser binding is explicit
	•	Next client binding uses direct property-read source objects
	•	app composition modules exist for every deployable app
	•	package composition modules exist for every runtime package in scope
	•	no dotenv loading exists inside packages/env
	•	no next.config.* env exists anywhere
	•	Vercel normalization is centralized
	•	Prisma CLI loading remains outside the package
	•	README documents the inventory and rules clearly
	•	tests cover missing, invalid, defaulted, and composed behavior
	•	the package stays tiny, explicit, and boring

This is the final source of truth for @repo/env.