# repo/testing/testing-canonical.md

Source of Truth: packages/testing (@repo/testing)

This is the canonical plan for the shared testing infrastructure package in the monorepo.

It supersedes earlier drafts for this directory and is synchronized to the project’s current architecture decisions across:
	•	canonical platform direction
	•	testing baseline
	•	packages/auth
	•	packages/contracts
	•	packages/db
	•	packages/env
	•	packages/ui
	•	packages/analytics
	•	packages/integrations-core
	•	packages/observability
	•	packages/seo-core
	•	packages/seo-astro
	•	packages/seo-next

⸻

1. Purpose

packages/testing is the shared test infrastructure package for the monorepo.

Its job is to provide the reusable primitives that let packages and apps test consistently without duplicating setup, mocks, factories, fixtures, render wrappers, accessibility helpers, and generic Playwright support.

It exists to make testing:
	•	consistent
	•	deterministic
	•	boundary-safe
	•	easy for agentic coders to consume
	•	hard to turn into a junk drawer

It does not exist to centralize the repo’s actual business tests.

Actual feature tests stay with the package or app they verify.

⸻

2. Role in the monorepo

packages/testing sits alongside other foundational packages and supports them without taking ownership of their runtime behavior.

It must fit these repo-wide decisions:
	•	the monorepo is compiled-first
	•	package boundaries are strict
	•	@repo/contracts owns shared contracts and schemas
	•	@repo/auth owns auth/session primitives
	•	@repo/db is foundational and boring, not a shared app logic layer
	•	@repo/ui uses Storybook as the primary component-development and component-testing surface
	•	Vitest runs per package in CI
	•	root Vitest Projects exist for local DX aggregation only
	•	MSW is the standard HTTP mocking layer
	•	Playwright is the E2E layer
	•	accessibility is layered:
	•	Storybook/component level
	•	Playwright/page level
	•	manual review still matters
	•	Pact is limited to internal providers you control and is not a day-one concern here

This package must help those decisions work together without blurring them.

⸻

3. What this package owns

packages/testing owns:
	•	shared Vitest setup helpers
	•	shared test env mutation helpers
	•	shared low-level test spies and timer helpers
	•	MSW request handlers, scenarios, response builders, and Node/browser binding helpers
	•	deterministic factories aligned to shared contracts and normalized domain shapes
	•	stable fixtures for recognizable sample data
	•	thin React test helpers for shared/component-level use
	•	generic Playwright helper glue
	•	shared accessibility config and helper utilities
	•	shared schema/payload assertion helpers that validate against existing contracts
	•	package self-tests that verify its own public API and safety guarantees

⸻

4. What this package does not own

packages/testing does not own:
	•	production code
	•	app business logic
	•	app-local or package-local feature tests
	•	Storybook configuration
	•	Chromatic configuration
	•	root Vitest configuration for the monorepo
	•	root Playwright configuration for the monorepo
	•	DB test harnesses
	•	Prisma helpers
	•	integration test environments that behave like fake backends
	•	business workflow simulators
	•	shared schemas or contracts
	•	a second contracts layer
	•	visual regression infrastructure
	•	app-specific E2E flows
	•	analytics runtime behavior
	•	observability runtime behavior
	•	SEO runtime behavior

⸻

5. Hard architectural boundaries

Allowed imports

packages/testing may import from:
	•	@repo/contracts
	•	normalized type-only surfaces from @repo/auth when justified
	•	React and React DOM
	•	Vitest
	•	MSW
	•	Testing Library packages
	•	Playwright packages
	•	axe-related testing packages
	•	small utility libraries only when clearly justified

Avoid or reject imports from

packages/testing should not import from:
	•	any apps/*
	•	@repo/db runtime code
	•	@repo/analytics runtime code
	•	@repo/observability runtime code
	•	@repo/integrations-core runtime code unless a pure type-only import is clearly justified
	•	server-only production modules
	•	route handlers or app DAL code
	•	vendor SDK runtime clients from production packages

Why this matters

This package is test infrastructure, not a stealth shared runtime layer.

If this package imports production runtime packages too freely, it stops being infrastructure and starts becoming a hidden dependency chain.

⸻

6. Final closed decisions

These are the final decisions for this directory.

Package identity
	•	directory: packages/testing
	•	package name: @repo/testing

Ownership and scope
	•	shared test infrastructure only
	•	no feature-test centralization
	•	no app-specific business helpers
	•	no DB/runtime leakage
	•	no fake backend frameworks

Storybook boundary
	•	Storybook remains the primary shared UI component-testing surface
	•	packages/testing may support Storybook consumers
	•	packages/testing does not own .storybook
	•	packages/testing does not create a competing component-testing strategy for @repo/ui

Vitest boundary
	•	packages/apps own their own test configs
	•	root Vitest Projects are for local DX aggregation only
	•	packages/testing may export config builders/fragments
	•	packages/testing does not own the repo root Vitest config
	•	packages/testing does have its own local vitest.config.ts for self-tests

Playwright boundary
	•	packages/testing does not own root playwright.config.ts
	•	packages/testing exports helper functions and fixture composers only
	•	it must not export a repo-global Playwright test

Contract boundary
	•	src/contracts/ is rejected
	•	the package uses src/assertions/
	•	assertions validate against @repo/contracts
	•	this package never defines shared schema ownership

MSW boundary
	•	MSW is the shared HTTP mocking layer
	•	handlers are organized by system boundary, not app feature
	•	Node and browser binding must remain explicit
	•	no hidden singleton “global server” magic
	•	no fake backend engine

Determinism boundary
	•	day-one factories are deterministic
	•	hidden randomness is rejected
	•	faker-style approaches are not used on day one

SEO boundary
	•	no src/msw/handlers/seo.ts on day one
	•	the SEO packages are mostly pure-function/config surfaces, not a shared mocked HTTP boundary

DB boundary
	•	no DB factories
	•	no Prisma helpers
	•	no DB writes
	•	no database integration harnesses inside this package

Pact boundary
	•	no src/pact/
	•	Pact is deferred until a real internal provider/consumer need exists

Next.js testing reality
	•	do not design this package around pretending every Next App Router surface is unit-test-friendly
	•	async Server Component coverage remains E2E-first
	•	this package should not create misleading abstractions around that limitation

⸻

7. Design principles

7.1 Share infrastructure, not assertions

This package shares things like:
	•	setup
	•	handlers
	•	scenarios
	•	factories
	•	fixtures
	•	wrappers
	•	helper utilities

It does not centralize business assertions or feature cases.

7.2 Prefer realistic boundaries

Mocks should model:
	•	network boundaries
	•	service boundaries
	•	provider responses
	•	normalized domain payloads

They should not become a second app runtime.

7.3 Deterministic by default

Factories and helpers should produce stable results unless the caller explicitly changes them.

Determinism is better for:
	•	debugging
	•	reproducibility
	•	CI reliability
	•	agentic coding

7.4 Thin abstractions only

Every helper should be:
	•	obviously useful
	•	easy to understand
	•	easy to delete
	•	easy to replace locally if it turns out not to be broadly reusable

7.5 Boundary-safe by construction

Every new file should answer:
	•	is this really shared infrastructure?
	•	does this preserve package boundaries?
	•	does this keep business logic near the code under test?

If not, it should not live here.

⸻

8. Final directory shape

packages/testing/
├─ package.json
├─ tsconfig.json
├─ tsup.config.ts
├─ vitest.config.ts
├─ README.md
├─ src/
│  ├─ index.ts
│  ├─ vitest/
│  │  ├─ index.ts
│  │  ├─ setup.ts
│  │  ├─ matchers.ts
│  │  ├─ fake-time.ts
│  │  ├─ env.ts
│  │  ├─ spies.ts
│  │  └─ config.ts
│  ├─ msw/
│  │  ├─ index.ts
│  │  ├─ server.ts
│  │  ├─ browser.ts
│  │  ├─ handlers/
│  │  │  ├─ index.ts
│  │  │  ├─ auth.ts
│  │  │  ├─ analytics.ts
│  │  │  ├─ integrations.ts
│  │  │  └─ storage.ts
│  │  ├─ scenarios/
│  │  │  ├─ index.ts
│  │  │  ├─ success.ts
│  │  │  ├─ errors.ts
│  │  │  └─ latency.ts
│  │  └─ responses/
│  │     ├─ index.ts
│  │     ├─ json.ts
│  │     ├─ errors.ts
│  │     └─ pagination.ts
│  ├─ factories/
│  │  ├─ index.ts
│  │  ├─ common/
│  │  │  ├─ ids.ts
│  │  │  ├─ dates.ts
│  │  │  └─ money.ts
│  │  ├─ organizations/
│  │  │  ├─ organization.ts
│  │  │  └─ membership.ts
│  │  ├─ auth/
│  │  │  ├─ user.ts
│  │  │  └─ session.ts
│  │  ├─ booking/
│  │  │  ├─ service.ts
│  │  │  ├─ availability.ts
│  │  │  ├─ appointment.ts
│  │  │  └─ intake.ts
│  │  ├─ analytics/
│  │  │  └─ event.ts
│  │  └─ integrations/
│  │     ├─ credential.ts
│  │     ├─ webhook.ts
│  │     └─ sync-job.ts
│  ├─ fixtures/
│  │  ├─ index.ts
│  │  ├─ organizations.ts
│  │  ├─ auth.ts
│  │  ├─ booking.ts
│  │  ├─ analytics.ts
│  │  └─ integrations.ts
│  ├─ react/
│  │  ├─ index.ts
│  │  ├─ render.tsx
│  │  ├─ providers.tsx
│  │  ├─ user-event.ts
│  │  └─ router-mocks.ts
│  ├─ playwright/
│  │  ├─ index.ts
│  │  ├─ auth.ts
│  │  ├─ a11y.ts
│  │  ├─ fixtures.ts
│  │  ├─ routes.ts
│  │  ├─ storage-state.ts
│  │  └─ wait-for.ts
│  ├─ accessibility/
│  │  ├─ index.ts
│  │  ├─ axe.ts
│  │  ├─ rules.ts
│  │  └─ helpers.ts
│  ├─ assertions/
│  │  ├─ index.ts
│  │  ├─ schema.ts
│  │  └─ payload.ts
│  ├─ env/
│  │  ├─ index.ts
│  │  └─ guards.ts
│  └─ internal/
│     ├─ constants.ts
│     └─ guards.ts
└─ test/
   ├─ smoke/
   │  └─ public-api.test.ts
   ├─ vitest/
   │  ├─ setup.test.ts
   │  ├─ matchers.test.ts
   │  ├─ fake-time.test.ts
   │  ├─ env.test.ts
   │  ├─ spies.test.ts
   │  └─ config.test.ts
   ├─ msw/
   │  ├─ server.test.ts
   │  ├─ browser.test.ts
   │  ├─ responses.test.ts
   │  ├─ scenarios.test.ts
   │  ├─ auth-handlers.test.ts
   │  ├─ analytics-handlers.test.ts
   │  ├─ integrations-handlers.test.ts
   │  └─ storage-handlers.test.ts
   ├─ factories/
   │  ├─ common.test.ts
   │  ├─ organizations.test.ts
   │  ├─ auth.test.ts
   │  ├─ booking.test.ts
   │  ├─ analytics.test.ts
   │  └─ integrations.test.ts
   ├─ react/
   │  ├─ render.test.tsx
   │  ├─ providers.test.tsx
   │  ├─ user-event.test.ts
   │  └─ router-mocks.test.ts
   ├─ playwright/
   │  ├─ auth.test.ts
   │  ├─ a11y.test.ts
   │  ├─ fixtures.test.ts
   │  ├─ routes.test.ts
   │  ├─ storage-state.test.ts
   │  └─ wait-for.test.ts
   ├─ accessibility/
   │  ├─ axe.test.ts
   │  ├─ rules.test.ts
   │  └─ helpers.test.ts
   ├─ assertions/
   │  ├─ schema.test.ts
   │  └─ payload.test.ts
   └─ env/
      └─ guards.test.ts


⸻

9. Top-level files

package.json

Purpose

Defines the package boundary, public entrypoints, scripts, and dependency policy.

Requirements
	•	package name: @repo/testing
	•	private: true
	•	type: "module"
	•	explicit exports
	•	no deep-import encouragement
	•	sideEffects: false
	•	clean subpath entrypoints

Required public exports
	•	.
	•	./vitest
	•	./msw
	•	./factories
	•	./fixtures
	•	./react
	•	./playwright
	•	./accessibility
	•	./assertions
	•	./env
	•	./package.json

Example conceptual exports map

{
  "name": "@repo/testing",
  "private": true,
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./vitest": {
      "types": "./dist/vitest/index.d.ts",
      "import": "./dist/vitest/index.js"
    },
    "./msw": {
      "types": "./dist/msw/index.d.ts",
      "import": "./dist/msw/index.js"
    },
    "./factories": {
      "types": "./dist/factories/index.d.ts",
      "import": "./dist/factories/index.js"
    },
    "./fixtures": {
      "types": "./dist/fixtures/index.d.ts",
      "import": "./dist/fixtures/index.js"
    },
    "./react": {
      "types": "./dist/react/index.d.ts",
      "import": "./dist/react/index.js"
    },
    "./playwright": {
      "types": "./dist/playwright/index.d.ts",
      "import": "./dist/playwright/index.js"
    },
    "./accessibility": {
      "types": "./dist/accessibility/index.d.ts",
      "import": "./dist/accessibility/index.js"
    },
    "./assertions": {
      "types": "./dist/assertions/index.d.ts",
      "import": "./dist/assertions/index.js"
    },
    "./env": {
      "types": "./dist/env/index.d.ts",
      "import": "./dist/env/index.js"
    },
    "./package.json": "./package.json"
  }
}

Scripts

Required scripts:
	•	build
	•	clean
	•	lint
	•	typecheck
	•	test
	•	test:watch

Conceptual scripts:

{
  "scripts": {
    "build": "tsup",
    "clean": "rimraf dist coverage .turbo",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run --config vitest.config.ts",
    "test:watch": "vitest --config vitest.config.ts"
  }
}

Dependency policy

Runtime deps
	•	msw
	•	@testing-library/react
	•	@testing-library/user-event
	•	@testing-library/jest-dom
	•	axe-core
	•	@axe-core/playwright

Dev deps
	•	vitest
	•	jsdom
	•	@playwright/test
	•	tsup
	•	typescript
	•	rimraf
	•	eslint
	•	@types/node

Peer deps
	•	react
	•	react-dom

Explicitly rejected dependencies on day one
	•	faker
	•	@faker-js/faker
	•	@mswjs/data
	•	nock
	•	sinon
	•	supertest
	•	pact
	•	Prisma
	•	DB drivers

⸻

tsconfig.json

Purpose

Provides strict TypeScript behavior for a compiled test-helpers package with both Node-oriented and browser-oriented surfaces.

Rules
	•	extend the repo base config
	•	ESM-compatible
	•	React JSX enabled
	•	no path aliases that bypass public package boundaries
	•	source should not rely on global Vitest types
	•	tests import Vitest symbols explicitly
	•	declaration output compatible with tsup

Key intent

This package must support:
	•	Node helper authoring
	•	DOM helper authoring
	•	React helper authoring

without collapsing everything into one fuzzy environment model.

⸻

tsup.config.ts

Purpose

Builds all public entrypoints cleanly.

Requirements
	•	emit ESM
	•	emit declarations
	•	preserve subpath boundaries
	•	keep output simple
	•	avoid unnecessary bundling complexity
	•	treat heavy test libraries as external where appropriate

Required entrypoints
	•	src/index.ts
	•	src/vitest/index.ts
	•	src/msw/index.ts
	•	src/factories/index.ts
	•	src/fixtures/index.ts
	•	src/react/index.ts
	•	src/playwright/index.ts
	•	src/accessibility/index.ts
	•	src/assertions/index.ts
	•	src/env/index.ts

⸻

vitest.config.ts

Purpose

Package-local self-test config.

This file exists for testing @repo/testing itself.

Requirements
	•	does not imply ownership of the monorepo’s root Vitest config
	•	supports multiple environment needs
	•	splits tests cleanly between Node and JSDOM where appropriate

Recommended structure
	•	a Node-oriented test project for most tests
	•	a JSDOM-oriented test project for React and DOM-related tests

This mirrors the repo testing baseline without centralizing ownership.

⸻

README.md

Purpose

Prevents this package from drifting into a junk drawer.

Required sections
	•	purpose
	•	role in the monorepo
	•	what belongs here
	•	what does not belong here
	•	public entrypoints
	•	how to consume Vitest helpers
	•	MSW conventions
	•	factory conventions
	•	fixture conventions
	•	React helper conventions
	•	Playwright helper conventions
	•	accessibility helper conventions
	•	assertion helper conventions
	•	env safety conventions
	•	forbidden patterns
	•	examples
	•	how to add a new shared utility

⸻

10. src/ root

src/index.ts

Purpose

Conservative root barrel.

What it should export

Only low-common-denominator, environment-safe surfaces:
	•	factories
	•	fixtures
	•	assertions
	•	env helpers

What it should not export

Do not re-export:
	•	React helpers
	•	Playwright helpers
	•	MSW helpers
	•	Vitest helpers

Those should remain explicit subpath imports.

Why

This keeps the root API small and avoids surprising environment-specific imports.

⸻

11. src/vitest/

This folder owns shared Vitest infrastructure.

src/vitest/index.ts

Public barrel for the Vitest subpath.

Exports:
	•	setup module
	•	matchers
	•	fake-time helpers
	•	env helpers
	•	spy helpers
	•	config builders

⸻

src/vitest/setup.ts

Purpose

Shared setup module for Vitest consumers.

Responsibilities
	•	register @testing-library/jest-dom/vitest
	•	restore mocks after each test
	•	restore real timers after each test
	•	perform common cleanup hooks
	•	restore mutated env state if the helper layer tracks it

Hard rules
	•	do not auto-start MSW here
	•	do not install app-specific globals here
	•	do not add heavy polyfills casually
	•	do not mutate process-wide behavior beyond normal cleanup/setup needs

Value

This is one of the highest-value files in the package because it reduces repeated setup boilerplate while staying safe.

⸻

src/vitest/matchers.ts

Purpose

Small, reusable custom matchers.

Good examples
	•	toHaveIsoDateString
	•	toBeSerializableJson
	•	toHaveNoUndefinedDeep

Bad examples
	•	business-domain matchers
	•	overly clever matchers that obscure intent
	•	matchers that duplicate native or Testing Library assertions without real value

Rule

Keep this file small and high-signal.

⸻

src/vitest/fake-time.ts

Purpose

Deterministic time helpers.

Suggested exports
	•	freezeTime(date)
	•	advanceTime(ms)
	•	runAllTimers()
	•	restoreTime()

Rules
	•	deterministic only
	•	do not leave fake timers installed across test boundaries
	•	do not wrap domain workflows here
	•	keep it low-level

⸻

src/vitest/env.ts

Purpose

Helpers for mutating env safely in tests.

Suggested exports
	•	snapshotEnv()
	•	restoreEnv(snapshot)
	•	setTestEnv(overrides)
	•	withTestEnv(overrides, fn)

Rules
	•	mutations must be explicit
	•	cleanup must be easy
	•	do not infer secrets
	•	do not turn this into a config-ownership layer

⸻

src/vitest/spies.ts

Purpose

Low-level reusable spy helpers.

Suggested exports
	•	createConsoleSpy()
	•	suppressConsoleError()
	•	spyOnNow()
	•	spyOnRandom()

Rules
	•	generic only
	•	no network mocking
	•	no app behavior shortcuts
	•	helpers must be easy to restore

⸻

src/vitest/config.ts

Purpose

Reusable config fragments/builders for other packages.

Suggested exports
	•	createNodeVitestProject()
	•	createJsdomVitestProject()
	•	baseCoverageConfig
	•	baseAliasConfig

Rules
	•	builders/fragments only
	•	not root test ownership
	•	generic and boundary-safe
	•	no package-specific app knowledge

⸻

12. src/msw/

This folder owns shared HTTP mocking primitives.

src/msw/index.ts

Public barrel for MSW helpers.

Exports:
	•	server helpers
	•	browser helpers
	•	handlers
	•	scenarios
	•	response builders

⸻

src/msw/server.ts

Purpose

Node-side MSW setup helpers.

Important rule

Do not export a hidden singleton server used across the entire repo.

Suggested exports
	•	createMswServer(...handlers)
	•	installMswServerLifecycle(server)

Rules
	•	explicit binding
	•	Node/Vitest usage only
	•	no global magic
	•	no hidden shared mutable state

⸻

src/msw/browser.ts

Purpose

Browser-side MSW worker helpers.

Suggested exports
	•	createMswWorker(...handlers)
	•	startMswWorker(worker, options?)

Rules
	•	browser contexts only
	•	Storybook/browser mode support only
	•	do not auto-start on import
	•	keep worker startup explicit

⸻

src/msw/handlers/index.ts

Purpose

Barrel for grouped handler builders and default collections.

Rule

Group handlers by system boundary, not app feature.

⸻

src/msw/handlers/auth.ts

Purpose

Mock normalized auth/session HTTP boundaries.

Good exports
	•	createSessionHandler()
	•	createCurrentUserHandler()
	•	createSignOutHandler()
	•	defaultAuthHandlers

Rules
	•	align to normalized auth shapes from the repo’s auth model
	•	do not encode onboarding flows or business roles
	•	do not depend on DB runtime
	•	do not mirror raw vendor payloads unless there is a very good reason

⸻

src/msw/handlers/analytics.ts

Purpose

Mock analytics/provider boundaries.

Good exports
	•	createGa4MeasurementProtocolHandler()
	•	createMetaCapiHandler()
	•	createInternalAnalyticsIngestHandler()
	•	defaultAnalyticsHandlers

Rules
	•	model provider/network boundaries
	•	do not encode reporting logic
	•	do not own attribution business rules
	•	do not behave like analytics runtime code

This must align with the repo’s analytics decision: server-first definitive conversions and provider fan-out from trusted edges.

⸻

src/msw/handlers/integrations.ts

Purpose

Mock generic integrations boundaries.

Good exports
	•	createOAuthTokenExchangeHandler()
	•	createOAuthRefreshHandler()
	•	createWebhookAckHandler()
	•	createRateLimitedApiHandler()

Rules
	•	generic/provider-neutral where possible
	•	no giant provider catalog
	•	no fake SaaS platform implementations
	•	no runtime ownership leakage from integrations-core

This must fit the staged adapter model without turning testing into a simulation framework.

⸻

src/msw/handlers/storage.ts

Purpose

Mock storage/network boundaries.

Good exports
	•	createSignedUploadUrlHandler()
	•	createObjectUploadHandler()
	•	createObjectDownloadHandler()
	•	defaultStorageHandlers

Rules
	•	boundary-level only
	•	no media business rules
	•	no transform pipeline ownership

⸻

src/msw/scenarios/index.ts

Barrel for scenario compositions.

⸻

src/msw/scenarios/success.ts

Purpose

Reusable happy-path handler collections.

Examples
	•	authSuccessScenario
	•	analyticsSuccessScenario
	•	integrationsSuccessScenario
	•	storageSuccessScenario

⸻

src/msw/scenarios/errors.ts

Purpose

Reusable failure-mode scenario collections.

Examples
	•	authUnauthorizedScenario
	•	analyticsFailureScenario
	•	integrationsRateLimitedScenario
	•	storageNotFoundScenario

⸻

src/msw/scenarios/latency.ts

Purpose

Latency and slowness helpers.

Examples
	•	withFixedDelay(ms, handlers)
	•	withJitter(range, handlers)
	•	slowNetworkScenario

Rules
	•	composable only
	•	no DSL
	•	no fake backend runtime
	•	no implicit global delays

⸻

src/msw/responses/index.ts

Barrel for response builders.

⸻

src/msw/responses/json.ts

Purpose

Simple JSON response helpers.

Suggested exports
	•	jsonResponse(status, body, init?)
	•	okJson(body, init?)
	•	createdJson(body, init?)
	•	noContent()

Rule

Keep payload-building boring and explicit.

⸻

src/msw/responses/errors.ts

Purpose

Standard error response helpers.

Suggested exports
	•	badRequestError(message, details?)
	•	unauthorizedError(message?)
	•	forbiddenError(message?)
	•	notFoundError(resource?)
	•	serverError(message?)

Rule

Standardize the shape enough to reduce duplication, but do not invent an in-house API framework.

⸻

src/msw/responses/pagination.ts

Purpose

Pagination response helpers.

Suggested exports
	•	offsetPage(items, meta)
	•	cursorPage(items, nextCursor?)

Rules
	•	support common test cases
	•	align with repo contract style when relevant
	•	stay generic

⸻

13. src/factories/

This folder owns deterministic data builders aligned to shared contracts and normalized domain surfaces.

src/factories/index.ts

Barrel for public factory exports.

⸻

src/factories/common/ids.ts

Purpose

Deterministic ID helpers.

Suggested exports
	•	makeId(prefix?)
	•	makeUuidLike()
	•	sequence(prefix?)

Rules
	•	deterministic by default
	•	avoid hidden randomness
	•	any mutable sequence behavior must be obvious and resettable

⸻

src/factories/common/dates.ts

Purpose

Deterministic date helpers.

Suggested exports
	•	fixedDate()
	•	daysFrom(base, offset)
	•	isoDate(date)
	•	isoDateTime(date)

Rules
	•	timezone-safe
	•	explicit
	•	do not depend on wall-clock time unless explicitly requested

⸻

src/factories/common/money.ts

Purpose

Simple money/value-shape helpers.

Suggested exports
	•	money(amount, currency?)
	•	cents(value)
	•	zeroMoney(currency?)

Rules
	•	follow normalized contract shape
	•	not a financial calculation engine

⸻

src/factories/organizations/organization.ts

Purpose

Organization factory aligned to the repo’s multi-tenant architecture.

Suggested export
	•	makeOrganization(overrides?)

Rule

Align to organizationId-centric domain modeling, not speculative auth-vendor organization features.

⸻

src/factories/organizations/membership.ts

Purpose

Membership factory.

Suggested export
	•	makeMembership(overrides?)

Rules
	•	normalized domain shape only
	•	no DB writes
	•	no auth-plugin assumptions

⸻

src/factories/auth/user.ts

Purpose

Normalized user factory.

Suggested export
	•	makeUser(overrides?)

Rules
	•	align with the repo’s normalized auth user surface
	•	do not mirror raw provider payloads by default

⸻

src/factories/auth/session.ts

Purpose

Normalized session factory.

Suggested export
	•	makeSession(overrides?)

Rules
	•	align to shared auth/session usage
	•	no vendor internals
	•	include organization context only where it belongs in actual shared normalized shapes

⸻

src/factories/booking/service.ts

Purpose

Booking service factory.

Suggested export
	•	makeBookingService(overrides?)

Why booking belongs here

The repo already has app-booking as a real surface, so booking is a first-class shared test domain.

⸻

src/factories/booking/availability.ts

Purpose

Availability-slot factory.

Suggested export
	•	makeAvailabilitySlot(overrides?)

⸻

src/factories/booking/appointment.ts

Purpose

Appointment factory.

Suggested export
	•	makeAppointment(overrides?)

⸻

src/factories/booking/intake.ts

Purpose

Intake submission factory.

Suggested export
	•	makeIntakeSubmission(overrides?)

Rules for booking factories
	•	align to booking contracts
	•	no workflow orchestration
	•	no route/UI assumptions
	•	no DB writes

⸻

src/factories/analytics/event.ts

Purpose

Analytics event factory.

Suggested export
	•	makeAnalyticsEvent(overrides?)

Rules
	•	align to shared analytics event contracts
	•	provider-neutral by default
	•	do not default to vendor-native raw payloads

⸻

src/factories/integrations/credential.ts

Purpose

Integration credential metadata factory.

Suggested export
	•	makeIntegrationCredential(overrides?)

⸻

src/factories/integrations/webhook.ts

Purpose

Webhook envelope factory.

Suggested export
	•	makeWebhookEnvelope(overrides?)

⸻

src/factories/integrations/sync-job.ts

Purpose

Sync job payload factory.

Suggested export
	•	makeSyncJob(overrides?)

Rules for integrations factories
	•	align to integration contracts and queue/job envelope shapes
	•	no provider SDK coupling
	•	no runtime adapter behavior
	•	no DB writes

⸻

14. src/fixtures/

This folder owns stable, named sample data.

Use fixtures when you want recognizable reusable data.

Use factories when you want flexible data with overrides.

src/fixtures/index.ts

Barrel for fixture exports.

⸻

src/fixtures/organizations.ts

Purpose

Stable organization sample data.

Example fixture names
	•	acmeOrganization
	•	acmeOwnerMembership

⸻

src/fixtures/auth.ts

Purpose

Stable auth sample data.

Example fixture names
	•	testUser
	•	adminUser
	•	testSession

⸻

src/fixtures/booking.ts

Purpose

Stable booking sample data.

Example fixture names
	•	consultationService
	•	defaultAvailabilitySlot
	•	confirmedAppointment

⸻

src/fixtures/analytics.ts

Purpose

Stable analytics sample data.

Example fixture names
	•	pageViewEvent
	•	leadCapturedEvent

⸻

src/fixtures/integrations.ts

Purpose

Stable integration sample data.

Example fixture names
	•	googleAdsCredential
	•	genericWebhookEnvelope
	•	syncJobQueued

Rules
	•	keep fixtures small and obvious
	•	no fixture files that act like scenario engines
	•	do not put giant fake datasets here

⸻

15. src/react/

This folder owns thin React testing helpers.

It exists mainly for shared packages like @repo/ui and React-based app components that need a light shared test wrapper.

It must not become a second app runtime.

src/react/index.ts

Public barrel for React helpers.

⸻

src/react/render.tsx

Purpose

Custom render helper for React tests.

Suggested exports
	•	render(ui, options?)

Possibly later:
	•	renderHook re-export only if there is a real cross-package need

Rules
	•	thin wrapper only
	•	use generic providers
	•	no app business providers
	•	no app imports
	•	no heavy data-client ownership on day one

⸻

src/react/providers.tsx

Purpose

Generic test provider composition.

Suggested exports
	•	TestProviders
	•	composeProviders(...wrappers)
	•	createTestWrapper(options?)

Rules
	•	no giant provider stack
	•	no app-specific providers
	•	no auth workflow logic
	•	no repo-wide query client ownership unless a real justified shared need emerges later

This file must stay boring.

⸻

src/react/user-event.ts

Purpose

Configured userEvent helpers.

Suggested exports
	•	createUser()

Rules
	•	consistent defaults
	•	no global singleton user instance
	•	no hidden delays unless explicitly configured

⸻

src/react/router-mocks.ts

Purpose

Minimal Next navigation mocking support for component tests.

Suggested exports
	•	mockPathname(path)
	•	mockSearchParams(params)
	•	mockRouter(pushImpl?)
	•	resetRouterMocks()

Rules
	•	minimal only
	•	no route business flows
	•	no app-specific path assumptions
	•	do not pretend this solves all App Router testing challenges

⸻

16. src/playwright/

This folder owns generic Playwright helper glue.

It does not own root Playwright config and does not export a global test.

src/playwright/index.ts

Public barrel for Playwright helpers.

⸻

src/playwright/auth.ts

Purpose

Generic auth/bootstrap helpers for E2E tests.

Suggested exports
	•	loginViaUi(page, options?)
	•	loginViaRequest(request, options?)
	•	ensureAuthenticated(page, options?)

Rules
	•	generic only
	•	no app-specific business journeys
	•	no role escalation workflows
	•	no org-switching workflow logic unless that becomes a real shared need later

This must fit the repo’s auth decision: normalized auth usage and app-owned authorization.

⸻

src/playwright/a11y.ts

Purpose

Page-level accessibility helpers.

Suggested exports
	•	runA11yScan(page, options?)
	•	expectNoCriticalViolations(result)

Rules
	•	wraps @axe-core/playwright
	•	page-level only
	•	does not claim to replace manual accessibility review
	•	keep the API explicit

⸻

src/playwright/fixtures.ts

Purpose

Helper functions for composing app-owned Playwright fixtures.

Suggested exports
	•	createAuthFixture()
	•	createStorageStateFixture()

Rules
	•	do not export a repo-global test
	•	do not own browsers, projects, or base URLs
	•	do not hide app suite ownership

⸻

src/playwright/routes.ts

Purpose

Generic route/navigation assertions.

Suggested exports
	•	expectCurrentPath(page, path)
	•	expectSearchParam(page, key, value)
	•	waitForPath(page, matcher)

Rules
	•	generic user-visible routing assertions only
	•	no flow logic
	•	encourage resilient assertions, not brittle string hacks

⸻

src/playwright/storage-state.ts

Purpose

Storage-state helpers.

Suggested exports
	•	saveStorageState(context, path)
	•	loadStorageStatePath(name)
	•	createNamedStorageState(name)

Rules
	•	generic
	•	filesystem-safe
	•	no app-specific account assumptions
	•	intended to support reusable login/auth state patterns

⸻

src/playwright/wait-for.ts

Purpose

Small explicit waiting helpers.

Suggested exports
	•	waitForNetworkIdleLike(page)
	•	waitForStableUrl(page, matcher)

Rules
	•	very small
	•	conservative
	•	do not normalize sloppy waiting
	•	prefer built-in Playwright assertions whenever possible

Important repo rule

Do not casually normalize mixed Playwright route interception and MSW service-worker-based mocking in the same test path.

This package should document the distinction, not blur it.

⸻

17. src/accessibility/

This folder owns shared accessibility helper primitives.

It supports Storybook/component consumers and Playwright/page consumers without owning either testing surface.

src/accessibility/index.ts

Public barrel.

⸻

src/accessibility/axe.ts

Purpose

Shared axe configuration helpers.

Suggested exports
	•	defaultAxeRules
	•	createAxeConfig(overrides?)
	•	normalizeA11yViolations(results)

Uses

Can be consumed by:
	•	Storybook setup
	•	DOM-level tests
	•	Playwright helpers

⸻

src/accessibility/rules.ts

Purpose

Centralized rule configuration and narrow temporary suppressions.

Suggested exports
	•	defaultA11yRuleConfig
	•	temporaryRuleOverrides

Hard rules
	•	suppressions must be rare
	•	suppressions must be explicit
	•	suppressions should carry a clear reason in comments
	•	do not create a broad “ignore a11y” escape hatch

⸻

src/accessibility/helpers.ts

Purpose

Small accessibility assertion/formatting helpers.

Suggested exports
	•	formatViolations(violations)
	•	hasCriticalViolations(violations)
	•	expectNoSeriousViolations(violations)

Rules
	•	helper layer only
	•	not a second testing framework
	•	useful for failure readability and reuse

⸻

18. src/assertions/

This folder exists to help tests assert against existing contracts and payload rules.

It must not become a second contract layer.

src/assertions/index.ts

Public barrel.

⸻

src/assertions/schema.ts

Purpose

Schema assertion helpers.

Suggested exports
	•	assertSchemaParses(schema, data)
	•	expectSchemaFailure(schema, data)

Implementation rule

Accept any schema-like object with parse or safeParse.

Hard rule

Do not define shared schemas here.

⸻

src/assertions/payload.ts

Purpose

Generic payload-shape assertions.

Suggested exports
	•	assertSerializableJson(value)
	•	assertNoUndefinedDeep(value)
	•	assertHeaderSubset(actual, expected)
	•	assertPlainObject(value)

Rules
	•	payload-level only
	•	no business ownership
	•	no duplicate contract definitions

⸻

19. src/env/

This folder owns test-specific environment safety.

src/env/index.ts

Public barrel.

Suggested exports
	•	withTestEnv
	•	setTestEnv
	•	resetTestEnv
	•	env guard helpers

⸻

src/env/guards.ts

Purpose

Generic safety guards.

Suggested exports
	•	assertNotProductionEnv()
	•	assertNodeTestEnv()

Potential later addition only if a real consumer emerges:
	•	assertSafeTestDatabaseUrl(url)

Day-one rule

Do not add DB-specific guards until a real testing consumer requires them.

Keep this folder generic and small.

⸻

20. src/internal/

Private implementation details only.

Nothing here is part of the public API.

src/internal/constants.ts

Purpose

Package-private defaults and constants.

Examples
	•	default dates
	•	internal prefixes
	•	default currencies
	•	internal timeout values

⸻

src/internal/guards.ts

Purpose

Private invariant helpers.

Examples
	•	internal object guards
	•	invariant assertions used by public helpers

Rule

Never export from the public API.

⸻

21. test/ directory

These tests verify the package itself.

They are not repo-wide business tests.

test/smoke/public-api.test.ts

Purpose

Verify public entrypoint shape.

Should check
	•	expected exports exist
	•	internal folders are not exposed
	•	root barrel stays conservative

⸻

test/vitest/setup.test.ts

Purpose

Verify setup behavior.

Should check
	•	matcher registration
	•	mock restoration
	•	timer restoration
	•	cleanup behavior
	•	env reset expectations

⸻

test/vitest/matchers.test.ts

Purpose

Verify custom matchers.

Should check
	•	correctness
	•	clear failure messages
	•	registration behavior

⸻

test/vitest/fake-time.test.ts

Purpose

Verify deterministic time control.

Should check
	•	freezing
	•	advancing
	•	restoration
	•	cleanup safety

⸻

test/vitest/env.test.ts

Purpose

Verify env mutation helpers.

Should check
	•	snapshot/restore
	•	scoped overrides
	•	no leakage between tests

⸻

test/vitest/spies.test.ts

Purpose

Verify spy helpers.

Should check
	•	console suppression
	•	cleanup
	•	stable spy behavior

⸻

test/vitest/config.test.ts

Purpose

Verify config builders/fragments.

Should check
	•	Node defaults
	•	JSDOM defaults
	•	no hidden root ownership assumptions

⸻

test/msw/server.test.ts

Purpose

Verify Node/server helper behavior.

Should check
	•	factory creation
	•	lifecycle support
	•	explicit binding/reset usage

⸻

test/msw/browser.test.ts

Purpose

Verify browser worker helper behavior.

Should check
	•	worker factory shape
	•	start helper behavior
	•	no auto-start side effects

⸻

test/msw/responses.test.ts

Purpose

Verify JSON/error/pagination builders.

Should check
	•	status handling
	•	body shape
	•	pagination helpers
	•	consistency

⸻

test/msw/scenarios.test.ts

Purpose

Verify scenario composition.

Should check
	•	success/error combinations
	•	latency composition
	•	absence of surprising mutation

⸻

test/msw/auth-handlers.test.ts

Purpose

Verify auth handler correctness.

Should check
	•	session/current-user payloads
	•	sign-out behavior
	•	contract alignment with normalized auth shapes

⸻

test/msw/analytics-handlers.test.ts

Purpose

Verify analytics boundary handlers.

Should check
	•	response shapes
	•	success/failure paths
	•	provider-boundary behavior

⸻

test/msw/integrations-handlers.test.ts

Purpose

Verify generic integration handlers.

Should check
	•	OAuth exchanges
	•	refresh behavior
	•	rate-limit responses
	•	webhook ack behavior

⸻

test/msw/storage-handlers.test.ts

Purpose

Verify storage handlers.

Should check
	•	signed URL responses
	•	upload/download payloads
	•	common error cases

⸻

test/factories/common.test.ts

Purpose

Verify common deterministic helpers.

Should check
	•	IDs
	•	dates
	•	money helpers

⸻

test/factories/organizations.test.ts

Purpose

Verify organization and membership factories.

Should check
	•	defaults
	•	override behavior
	•	shape alignment

⸻

test/factories/auth.test.ts

Purpose

Verify user/session factories.

Should check
	•	normalized shape correctness
	•	override semantics
	•	absence of vendor-specific assumptions

⸻

test/factories/booking.test.ts

Purpose

Verify booking factories.

Should check
	•	service
	•	availability
	•	appointment
	•	intake
	•	deterministic defaults

⸻

test/factories/analytics.test.ts

Purpose

Verify analytics event factory.

Should check
	•	contract alignment
	•	deterministic defaults
	•	provider-neutral baseline shape

⸻

test/factories/integrations.test.ts

Purpose

Verify integrations factories.

Should check
	•	credential shape
	•	webhook envelope shape
	•	sync job shape
	•	override behavior

⸻

test/react/render.test.tsx

Purpose

Verify custom render behavior.

Should check
	•	wrapper composition
	•	render behavior
	•	no hidden provider surprises

⸻

test/react/providers.test.tsx

Purpose

Verify provider composition utilities.

Should check
	•	nesting order
	•	caller-supplied wrappers
	•	composition correctness

⸻

test/react/user-event.test.ts

Purpose

Verify user-event helper behavior.

Should check
	•	instance creation
	•	consistent defaults
	•	no shared global singleton surprises

⸻

test/react/router-mocks.test.ts

Purpose

Verify minimal router mocks.

Should check
	•	pathname mocking
	•	search param mocking
	•	router reset behavior

⸻

test/playwright/auth.test.ts

Purpose

Verify generic auth helper composition.

Should check
	•	options handling
	•	absence of app-specific assumptions
	•	helper behavior boundaries

⸻

test/playwright/a11y.test.ts

Purpose

Verify page-level a11y helpers.

Should check
	•	scan wrapper behavior
	•	violation normalization
	•	assertion helpers

⸻

test/playwright/fixtures.test.ts

Purpose

Verify fixture-composer helpers.

Should check
	•	composition output
	•	no global test export
	•	app-owned extension assumptions

⸻

test/playwright/routes.test.ts

Purpose

Verify route assertion helpers.

Should check
	•	path checks
	•	query param checks
	•	matcher behavior

⸻

test/playwright/storage-state.test.ts

Purpose

Verify storage-state helpers.

Should check
	•	path generation
	•	naming behavior
	•	save/load logic

⸻

test/playwright/wait-for.test.ts

Purpose

Verify explicit wait helpers.

Should check
	•	conservative behavior
	•	no infinite polling assumptions
	•	helper semantics

⸻

test/accessibility/axe.test.ts

Purpose

Verify axe config helpers.

Should check
	•	config generation
	•	normalization helpers
	•	predictable defaults

⸻

test/accessibility/rules.test.ts

Purpose

Verify rule-override behavior.

Should check
	•	override mechanics
	•	no blanket disabling
	•	reasoned shape

⸻

test/accessibility/helpers.test.ts

Purpose

Verify a11y helper behavior.

Should check
	•	formatting
	•	severity detection
	•	assertion behavior

⸻

test/assertions/schema.test.ts

Purpose

Verify schema assertion helpers.

Should check
	•	parse vs safeParse support
	•	success/failure handling
	•	readable messages

⸻

test/assertions/payload.test.ts

Purpose

Verify payload assertion helpers.

Should check
	•	serializability
	•	undefined detection
	•	header subset behavior
	•	plain object checks

⸻

test/env/guards.test.ts

Purpose

Verify safety guards.

Should check
	•	production env guard behavior
	•	Node test env checks
	•	failure message clarity

⸻

22. Public API contract

These are the intended consumption patterns.

Good examples

import { makeOrganization, testUser, assertSchemaParses } from "@repo/testing";
import { freezeTime, withTestEnv } from "@repo/testing/vitest";
import { createMswServer, okJson } from "@repo/testing/msw";
import { makeAppointment } from "@repo/testing/factories";
import { consultationService } from "@repo/testing/fixtures";
import { render, createUser } from "@repo/testing/react";
import { runA11yScan } from "@repo/testing/playwright";
import { createAxeConfig } from "@repo/testing/accessibility";
import { assertSerializableJson } from "@repo/testing/assertions";
import { assertNotProductionEnv } from "@repo/testing/env";

Forbidden example

import { something } from "@repo/testing/src/msw/server";

No deep imports into src/*.

⸻

23. What each subpath is for

@repo/testing

Use for:
	•	common factories
	•	fixtures
	•	assertions
	•	env helpers

It should feel small and boring.

⸻

@repo/testing/vitest

Use for:
	•	setup imports
	•	timer helpers
	•	env mutation helpers
	•	low-level spies
	•	config builders

⸻

@repo/testing/msw

Use for:
	•	request handlers
	•	response helpers
	•	scenarios
	•	Node/browser MSW binding helpers

⸻

@repo/testing/factories

Use for:
	•	deterministic domain builders

⸻

@repo/testing/fixtures

Use for:
	•	stable named example data

⸻

@repo/testing/react

Use for:
	•	thin shared render wrappers
	•	provider composition
	•	user-event setup
	•	minimal router mocks

⸻

@repo/testing/playwright

Use for:
	•	generic auth helpers
	•	fixture composition helpers
	•	storage-state helpers
	•	route helpers
	•	page-level a11y helpers

⸻

@repo/testing/accessibility

Use for:
	•	axe configuration
	•	a11y helper utilities
	•	narrow rule configuration

⸻

@repo/testing/assertions

Use for:
	•	schema assertions
	•	payload assertions

⸻

@repo/testing/env

Use for:
	•	env safety helpers
	•	environment guardrails

⸻

24. Rules for coding inside this package

Rule 1: Shared infra only

No feature workflows.
No business journeys.
No centralized feature test suites.

Rule 2: Deterministic first

Factories must be deterministic by default.

Rule 3: Contracts over persistence internals

Use shared contracts and normalized shapes.
Do not model raw DB rows by default.

Rule 4: No app imports

Never import from apps/*.

Rule 5: No DB runtime

No Prisma.
No DB writes.
No test DB harnesses here.

Rule 6: No Storybook ownership

You may support Storybook consumers.
You do not own Storybook config.

Rule 7: No Playwright ownership

You may export helpers.
You do not own root Playwright config.
You do not export a global test.

Rule 8: No giant provider stacks

React wrappers must stay thin and generic.

Rule 9: No singleton magic

Avoid hidden global ownership for:
	•	MSW servers
	•	timers
	•	env mutation
	•	Playwright fixtures
	•	mutable sequences

Rule 10: No junk-drawer helpers

Every new helper must have multiple real consumers or a strong obvious reason to exist.

⸻

25. Files and folders that must not exist

These are drift signs and should be treated as mistakes:

packages/testing/src/app-booking/
packages/testing/src/features/
packages/testing/src/business/
packages/testing/src/db/
packages/testing/src/db-runtime/
packages/testing/src/prisma/
packages/testing/src/seo/
packages/testing/src/e2e-flows/
packages/testing/src/global/
packages/testing/src/misc/
packages/testing/src/utils/
packages/testing/src/experimental/
packages/testing/src/pact/
packages/testing/src/contracts/
packages/testing/src/storybook/
packages/testing/src/chromatic/
packages/testing/src/next-app/
packages/testing/src/astro-app/

Also avoid:
	•	giant JSON fixture dumps
	•	fake backend DSLs
	•	route-handler copies
	•	package-local domain layers that belong elsewhere

⸻

26. Build order

Phase 1: skeleton

Create:
	•	package metadata
	•	exports map
	•	tsconfig
	•	tsup config
	•	local vitest config
	•	README
	•	folder scaffolds
	•	public barrels

⸻

Phase 2: Vitest and env foundation

Implement:
	•	src/vitest/setup.ts
	•	src/vitest/fake-time.ts
	•	src/vitest/env.ts
	•	src/vitest/spies.ts
	•	src/vitest/config.ts
	•	src/env/index.ts
	•	src/env/guards.ts

⸻

Phase 3: factories and fixtures

Implement:
	•	common factories
	•	organizations/auth factories
	•	booking factories
	•	analytics factory
	•	integrations factories
	•	named fixtures

⸻

Phase 4: assertions and accessibility base

Implement:
	•	src/assertions/schema.ts
	•	src/assertions/payload.ts
	•	src/accessibility/axe.ts
	•	src/accessibility/rules.ts
	•	src/accessibility/helpers.ts

⸻

Phase 5: React helpers

Implement:
	•	src/react/providers.tsx
	•	src/react/render.tsx
	•	src/react/user-event.ts
	•	src/react/router-mocks.ts

⸻

Phase 6: MSW

Implement:
	•	response builders
	•	server/browser factories
	•	grouped handlers
	•	scenario composition

⸻

Phase 7: Playwright helpers

Implement:
	•	auth helpers
	•	a11y helpers
	•	fixture composers
	•	route helpers
	•	storage-state helpers
	•	wait helpers

⸻

Phase 8: package self-tests

Implement the entire test/ tree and confirm:
	•	public API stays stable
	•	no accidental internals leak
	•	helpers are deterministic and safe

⸻

27. Definition of done

packages/testing is done when:
	•	it builds cleanly as a compiled internal package
	•	subpath exports are explicit and stable
	•	package-local self-tests run cleanly
	•	Vitest setup and env helpers are usable across packages/apps
	•	factories exist for the main shared domains:
	•	organizations
	•	auth
	•	booking
	•	analytics
	•	integrations
	•	fixtures provide stable recognizable sample data
	•	MSW helpers support explicit Node and browser binding
	•	React helpers are thin and generic
	•	Playwright helpers compose into app-owned suites without taking over ownership
	•	accessibility helpers are reusable but not suppression engines
	•	assertion helpers validate against existing contracts without duplicating them
	•	env guards exist and are meaningful
	•	no app-specific logic has leaked into the package
	•	no DB/runtime logic has leaked into the package
	•	the README clearly teaches what belongs here and what does not

⸻

28. Non-goals

This package is not:
	•	a centralized repo-wide test suite
	•	a fake backend
	•	a DB harness
	•	a Storybook owner
	•	a Playwright owner
	•	a contract-definition package
	•	a business workflow simulator
	•	a visual regression framework
	•	a catch-all utilities package

⸻

29. Final implementation guidance for agentic coding

When building packages/testing, prefer:
	•	explicit imports over globals
	•	composition over inheritance
	•	small files over abstraction-heavy files
	•	deterministic defaults over random generation
	•	contract-aligned shapes over persistence internals
	•	provider-boundary mocks over fake-app simulations
	•	thin wrappers over giant “smart” wrappers

Every file in this package should be easy to explain in one sentence.

If a helper is only used by one app or one package, it probably belongs locally, not here.

⸻

30. Final summary

packages/testing is the repo’s shared testing infrastructure package.

It provides:
	•	Vitest helpers
	•	MSW primitives
	•	deterministic factories
	•	stable fixtures
	•	thin React helpers
	•	generic Playwright support
	•	accessibility helpers
	•	assertion helpers
	•	env safety helpers

It does not provide:
	•	feature tests
	•	business flows
	•	root config ownership
	•	Storybook ownership
	•	Playwright ownership
	•	DB harnesses
	•	schema ownership
	•	fake backends

This document is the final source of truth for packages/testing / @repo/testing.