# repo/auth/auth-canonical.md

Context Drop:

packages/auth/ — final canonical source of truth

Package purpose

packages/auth is the single authentication package for protected Next.js apps in the monorepo.

It owns:
	•	Better Auth initialization
	•	Prisma adapter wiring to @repo/db
	•	normalized auth user and session mapping
	•	server-side session helpers
	•	thin browser-safe auth client helpers
	•	coarse shared auth roles and coarse shared grants
	•	auth-specific error types and error normalization

It does not own:
	•	app DAL authorization
	•	tenant membership logic
	•	org switching
	•	feature-level permissions
	•	invitation UI
	•	admin user management UI
	•	public signup UI
	•	OAuth provider setup
	•	Astro public-site auth
	•	route files inside apps
	•	Prisma schema or migrations
	•	email delivery plumbing

This package answers:
	•	who is the current authenticated user?
	•	is there a valid session?
	•	what coarse shared auth role does that user have?

It does not answer:
	•	may this user perform a specific business action in a specific app?

That answer belongs in app DALs, route handlers, Server Actions, and protected server components.

Final decisions already made

These are settled.
	•	Auth method for v1: email + password only
	•	Account model for v1: invite-only / controlled provisioning
	•	No public self-serve signup
	•	No OAuth
	•	No magic links
	•	No passkeys
	•	No 2FA
	•	No Better Auth organization plugin
	•	No cross-subdomain cookies
	•	No secondary session storage
	•	No cookie cache
	•	No feature-level authorization in this package
	•	No auth runtime for public Astro sites

Shared role model

The only shared roles in this package are:
	•	platform_admin
	•	staff
	•	member

The only shared coarse grants in this package are:
	•	platform.manage
	•	staff.access
	•	member.access

These are deliberately broad. This package is not a policy engine.

Normalized auth contracts

The canonical normalized shared user shape is:
	•	id: string
	•	email: string
	•	name: string | null
	•	image: string | null
	•	emailVerified: boolean
	•	role: AuthRole

The canonical normalized server session shape is:
	•	id: string
	•	expiresAt: Date
	•	user: AuthUser

The canonical normalized client session shape is:
	•	id: string
	•	expiresAt: string
	•	user: AuthUser

Apps should depend on these normalized contracts rather than Better Auth’s raw payloads.

Runtime posture

Each protected Next app mounts its own app/api/auth/[...all]/route.ts and uses the shared auth instance from this package. Auth route handlers should explicitly run on the Node.js runtime. getSession and requireSession in this package should wrap Better Auth server access, while proxy.ts in apps remains limited to optimistic redirect behavior rather than real authorization. Better Auth’s Next integration and Next’s runtime model support exactly that arrangement.  

Session posture

Session policy is frozen for v1:
	•	DB-backed sessions only
	•	7-day session expiration
	•	1-day update age
	•	1-day fresh age
	•	cookie cache disabled
	•	no secondary storage
	•	no stateless session redesign

Those values align with Better Auth’s documented session model and keep revocation behavior conservative. Cookie cache stays off until profiling proves the tradeoff is worthwhile.  

Cookie, origin, and base URL posture

This package uses same-origin auth per protected app. Cookies are host-only by default, secure in production, httpOnly, and SameSite=Lax. BETTER_AUTH_URL or equivalent normalized env must be set explicitly; request inference is not the default strategy. trustedOrigins is centralized in one config file and must safely handle request === undefined. Cross-subdomain cookies are not enabled in v1 and require a future explicit architecture change.  

Rate limiting posture

Do not create custom rate-limit abstractions in v1. Better Auth already includes built-in rate limiting, and its defaults are sufficient until a concrete abuse pattern requires custom tuning. packages/auth may configure it later, but v1 does not add a dedicated rate-limit.ts file.  

Package boundary posture

packages/auth is a compiled-first runtime package with a strict export surface. The only public entrypoints are:
	•	@repo/auth
	•	@repo/auth/server
	•	@repo/auth/client

No deep imports are allowed. Node’s exports field should encapsulate the public API, and TypeScript resolution must respect exports rather than bypassing package boundaries with monorepo path aliases.  

⸻

Final directory shape

packages/auth/
├─ package.json
├─ tsconfig.json
├─ tsup.config.ts
├─ README.md
├─ src/
│  ├─ index.ts
│  ├─ shared/
│  │  ├─ index.ts
│  │  ├─ constants.ts
│  │  ├─ types.ts
│  │  └─ schemas/
│  │     ├─ sign-in.ts
│  │     └─ session.ts
│  ├─ server/
│  │  ├─ index.ts
│  │  ├─ auth.ts
│  │  ├─ config/
│  │  │  ├─ base-config.ts
│  │  │  ├─ base-url.ts
│  │  │  ├─ cookies.ts
│  │  │  ├─ email-password.ts
│  │  │  ├─ plugins.ts
│  │  │  ├─ session.ts
│  │  │  └─ trusted-origins.ts
│  │  ├─ adapters/
│  │  │  └─ prisma-adapter.ts
│  │  ├─ domain/
│  │  │  └─ auth-errors.ts
│  │  ├─ mappers/
│  │  │  ├─ map-session.ts
│  │  │  └─ map-session-user.ts
│  │  ├─ session/
│  │  │  ├─ get-session.ts
│  │  │  ├─ require-session.ts
│  │  │  ├─ get-session-user.ts
│  │  │  └─ session-types.ts
│  │  ├─ permissions/
│  │  │  ├─ index.ts
│  │  │  ├─ roles.ts
│  │  │  ├─ grants.ts
│  │  │  └─ predicates.ts
│  │  ├─ guards/
│  │  │  ├─ assert-authenticated.ts
│  │  │  ├─ assert-role.ts
│  │  │  └─ assert-permission.ts
│  │  └─ utils/
│  │     ├─ normalize-auth-error.ts
│  │     └─ server-only.ts
│  └─ client/
│     ├─ index.ts
│     ├─ client.ts
│     ├─ hooks/
│     │  ├─ use-session.ts
│     │  └─ use-auth-user.ts
│     └─ types/
│        └─ client-session.ts
└─ test/
   ├─ fixtures/
   │  ├─ raw-session.ts
   │  └─ raw-user.ts
   ├─ server/
   │  ├─ get-session.test.ts
   │  ├─ require-session.test.ts
   │  ├─ map-session.test.ts
   │  ├─ map-session-user.test.ts
   │  ├─ normalize-auth-error.test.ts
   │  └─ permissions.test.ts
   └─ shared/
      ├─ sign-in-schema.test.ts
      └─ session-schema.test.ts


⸻

Top-level files

package.json

This package is private to the workspace and must expose a strict exports map.

It must include:
	•	"type": "module"
	•	"private": true
	•	explicit exports for ., ./server, and ./client
	•	types and runtime targets pointing at dist/**
	•	no wildcard export patterns
	•	no ./* escape hatch

Conceptual export shape:

{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./server": {
      "types": "./dist/server/index.d.ts",
      "default": "./dist/server/index.js"
    },
    "./client": {
      "types": "./dist/client/index.d.ts",
      "default": "./dist/client/index.js"
    }
  }
}

Dependencies should include:
	•	better-auth
	•	server-only
	•	zod
	•	@repo/db
	•	@repo/env

Peer dependencies should include:
	•	next
	•	react

Dev dependencies should include:
	•	typescript
	•	tsup
	•	vitest

Do not add:
	•	@repo/ui
	•	@repo/analytics
	•	app packages
	•	feature packages
	•	ORM packages beyond what @repo/db already abstracts

tsconfig.json

This package extends the repo package baseline and stays strict.

Requirements:
	•	strict mode on
	•	declaration-friendly build
	•	modern module resolution that respects package exports
	•	no package-local path alias maze
	•	internal imports use relative paths

Do not use tsconfig paths to bypass actual workspace package resolution; that breaks the package contract TypeScript is supposed to respect.  

tsup.config.ts

This package is compiled-first.

Build rules:
	•	ESM only
	•	d.ts generation enabled
	•	clean output directory
	•	three explicit entrypoints:
	•	src/index.ts
	•	src/server/index.ts
	•	src/client/index.ts

Do not flatten the package into one bundle that erases public entrypoint boundaries.

README.md

This README is mandatory.

It must explain:
	•	package purpose
	•	what belongs here
	•	what does not belong here
	•	public entrypoints
	•	upstream contracts with @repo/db and @repo/env
	•	per-app mounting pattern
	•	how protected apps should consume it
	•	forbidden patterns
	•	related repo docs

⸻

src/index.ts

Root entrypoint for @repo/auth.

Exports only shared-safe material from src/shared.

It must not export:
	•	auth
	•	server session helpers
	•	server errors
	•	client hooks
	•	Better Auth internals

Purpose: let any package import auth-safe types and schemas without dragging in server code.

⸻

src/shared/

This folder is safe for any consumer.

src/shared/index.ts

Shared barrel.

Exports:
	•	constants
	•	types
	•	schemas

Nothing else.

src/shared/constants.ts

Defines canonical shared constants.

Contents:
	•	AUTH_ROLES
	•	AUTH_PERMISSIONS
	•	AUTH_API_PREFIX = "/api/auth"

Do not define app page-route constants here.

src/shared/types.ts

Defines shared-safe types.

Must include:
	•	AuthRole
	•	AuthPermission
	•	AuthUser
	•	SignInInput

Canonical AuthUser:
	•	id
	•	email
	•	name
	•	image
	•	emailVerified
	•	role

Do not place server-only session types here.

src/shared/schemas/sign-in.ts

Defines the v1 sign-in input schema with Zod.

Fields:
	•	email
	•	password

This schema validates only shape and baseline format. No business logic.

src/shared/schemas/session.ts

Defines the client-safe normalized session schema with Zod.

Fields:
	•	id
	•	expiresAt
	•	user

expiresAt is a string here because this schema is for serialized/client-safe session payloads.

⸻

src/server/

Everything here is server-only.

src/server/index.ts

The public @repo/auth/server entrypoint.

Exports:
	•	auth
	•	getSession
	•	requireSession
	•	getSessionUser
	•	ServerAuthSession
	•	UnauthenticatedAuthError
	•	ForbiddenAuthError
	•	InvalidSessionAuthError
	•	hasRole
	•	hasAnyRole
	•	hasPermission
	•	assertAuthenticated
	•	assertRole
	•	assertPermission

No vendor-noisy exports.

src/server/auth.ts

The single Better Auth initialization file.

Responsibilities:
	•	import the server-only marker
	•	create the Better Auth instance exactly once
	•	compose config from config/*
	•	attach the Prisma adapter
	•	export auth

Use the standard better-auth package import in v1. Do not prematurely optimize to a minimal variant unless you validate it against the exact feature set later.

This file must not contain:
	•	app page routing logic
	•	invite workflows
	•	provisioning flows
	•	feature authorization
	•	email delivery
	•	per-app policy branches

src/server/config/base-config.ts

Builds the final Better Auth config object.

It composes:
	•	base URL config
	•	cookie config
	•	session config
	•	trusted origins
	•	email/password config
	•	plugin list

This file keeps auth.ts boring.

src/server/config/base-url.ts

Owns base URL policy.

Rules:
	•	use explicit base URL from @repo/env
	•	do not rely on incoming-request inference by default
	•	support dynamic host allowlisting only when a protected app genuinely needs previews or multiple domains

Better Auth documents baseURL, recommends setting it explicitly, and uses /api/auth as the default base path.  

src/server/config/cookies.ts

Owns cookie defaults.

V1 defaults:
	•	secure in production
	•	httpOnly
	•	SameSite=Lax
	•	host-only cookies
	•	no shared cross-subdomain domain

Cross-subdomain cookies stay off until a later deliberate architecture decision. Better Auth’s cookie docs support that conservative stance.  

src/server/config/email-password.ts

Owns the v1 auth-method config.

What it freezes:
	•	email/password authentication is enabled
	•	this package does not export or encourage public sign-up flows
	•	this package assumes invite-only provisioning outside itself

Because I did not find a strong official email/password “disable signup” doc, this file must not pretend there is a guaranteed built-in switch unless implementation confirms one. Keep the package surface sign-in-centric, not sign-up-centric.  

src/server/config/plugins.ts

Defines the Better Auth plugin list.

V1 plugin list:
	•	nextCookies() last

No other plugins are included in v1.

Explicitly excluded:
	•	organization plugin
	•	OAuth proxy
	•	2FA
	•	passkeys
	•	email OTP
	•	magic link
	•	tenant-specific plugins

Better Auth’s Next integration explicitly calls out nextCookies() for cookie-setting auth calls in Server Actions.  

src/server/config/session.ts

Freezes session behavior.

V1 values:
	•	7-day expiry
	•	1-day update age
	•	1-day fresh age
	•	cookie cache disabled
	•	DB-backed sessions only
	•	no secondary storage

Those values align with Better Auth’s documented session system and keep security behavior conservative.  

src/server/config/trusted-origins.ts

Owns origin validation.

Responsibilities:
	•	centralize trusted-origin config
	•	keep same-origin default
	•	merge optional extra origins from normalized env only when necessary
	•	safely handle request === undefined

Better Auth explicitly documents that request can be undefined during initialization and direct auth.api calls, so this logic must not assume request presence.  

src/server/adapters/prisma-adapter.ts

The only adapter file in v1.

Responsibilities:
	•	import Prisma client from @repo/db
	•	create Better Auth Prisma adapter
	•	isolate DB adapter wiring in one place

Do not:
	•	create alternate ORM paths
	•	own Prisma schema here
	•	run migrations here

src/server/domain/auth-errors.ts

Defines standard auth error classes.

Required classes:
	•	UnauthenticatedAuthError
	•	ForbiddenAuthError
	•	InvalidSessionAuthError

Each should include a stable code property:
	•	UNAUTHENTICATED
	•	FORBIDDEN
	•	INVALID_SESSION

Apps should catch these classes, not parse arbitrary strings.

src/server/mappers/map-session.ts

Maps raw Better Auth session payloads to normalized server session objects.

Input: Better Auth session response.
Output: ServerAuthSession.

This is the only place that should understand raw session response shape.

src/server/mappers/map-session-user.ts

Maps raw Better Auth user payloads to normalized AuthUser.

Responsibilities:
	•	coerce nullable values
	•	normalize emailVerified
	•	normalize role
	•	prevent vendor shape leakage

This is the isolation point for auth-user shape churn.

src/server/session/session-types.ts

Defines server-only normalized session types.

Must include:
	•	ServerAuthSession

expiresAt is a Date here.

src/server/session/get-session.ts

Optional-auth helper.

Behavior:
	•	no arguments
	•	reads request headers using Next server APIs
	•	calls Better Auth session retrieval
	•	maps raw result with map-session
	•	returns ServerAuthSession | null

Do not wrap this with React cache() here. If an app wants memoization per render pass, that belongs in the app DAL, which aligns with Next’s own auth guidance. Better Auth’s server-side usage requires headers for session reads.  

src/server/session/require-session.ts

Hard-auth helper.

Behavior:
	•	calls getSession()
	•	throws UnauthenticatedAuthError if missing
	•	returns ServerAuthSession

This should be the default helper in protected server actions, protected route handlers, and DAL entrypoints.

src/server/session/get-session-user.ts

Identity-only convenience helper.

Behavior:
	•	returns AuthUser | null

Use this for callers that only need the normalized user. If the caller already has a session, it should use session.user directly instead of refetching.

src/server/permissions/index.ts

Exports the supported coarse permission API.

src/server/permissions/roles.ts

Defines role constants and helpers.

Canonical roles:
	•	platform_admin
	•	staff
	•	member

This file must align with src/shared/constants.ts.

src/server/permissions/grants.ts

Defines the only allowed role-to-grant mapping:
	•	platform_admin → platform.manage, staff.access, member.access
	•	staff → staff.access
	•	member → member.access

Nothing more.

src/server/permissions/predicates.ts

Pure predicates only.

Must include:
	•	hasRole(user, role)
	•	hasAnyRole(user, roles)
	•	hasPermission(user, permission)

Requirements:
	•	pure
	•	deterministic
	•	framework-free
	•	trivial to test

src/server/guards/assert-authenticated.ts

Assertion helper.

Input: nullable session.
Output: non-null session or UnauthenticatedAuthError.

src/server/guards/assert-role.ts

Assertion helper.

Input: user + required role or roles.
Output: user or ForbiddenAuthError.

src/server/guards/assert-permission.ts

Assertion helper.

Input: user + required coarse permission.
Output: user or ForbiddenAuthError.

These helpers support shared coarse checks only. They are not a substitute for app DAL authorization.

src/server/utils/normalize-auth-error.ts

Normalizes unknown or vendor-native errors into package-standard auth errors.

This gives apps one predictable error surface.

src/server/utils/server-only.ts

Tiny server-only marker module.

Purpose:
	•	establish the server-only boundary for the package
	•	be imported by src/server/index.ts, src/server/auth.ts, and any sensitive server internals as needed

⸻

src/client/

The client surface is intentionally thin.

src/client/index.ts

Public @repo/auth/client entrypoint.

Exports:
	•	authClient
	•	useSession
	•	useAuthUser
	•	ClientAuthSession

Nothing else.

src/client/client.ts

Creates the singleton Better Auth client for React/Next consumption.

Use Better Auth’s React client API here. Keep it same-origin by default and do not encode redirect or feature logic in the client initializer. Better Auth’s Next docs show the React client being created from better-auth/react.  

src/client/hooks/use-session.ts

Thin hook wrapper.

Responsibilities:
	•	call the Better Auth client session hook
	•	normalize the result to ClientAuthSession | null
	•	keep return shape stable for consumers

Do not add business branching here.

src/client/hooks/use-auth-user.ts

Convenience hook.

Responsibilities:
	•	derive and return normalized AuthUser | null
	•	save components from repeatedly parsing session objects

src/client/types/client-session.ts

Defines client-safe normalized session typing.

Canonical shape:
	•	id: string
	•	expiresAt: string
	•	user: AuthUser

No Date objects.

⸻

test/

Tests validate your wrapper contract, not Better Auth internals.

test/fixtures/raw-user.ts

Contains raw Better Auth-like user fixtures for mapping tests.

Cases to include:
	•	fully populated user
	•	null name
	•	null image
	•	missing role fallback
	•	verified and unverified email variants

test/fixtures/raw-session.ts

Contains raw Better Auth-like session fixtures.

Cases to include:
	•	valid session
	•	missing user edge case
	•	malformed expiration edge case if needed for normalization tests

test/server/get-session.test.ts

Must verify:
	•	null when no session
	•	normalized session on success
	•	error normalization on vendor failure

test/server/require-session.test.ts

Must verify:
	•	returns normalized session when present
	•	throws UnauthenticatedAuthError when absent

test/server/map-session.test.ts

Must verify:
	•	raw session maps to normalized ServerAuthSession
	•	expiration normalization
	•	user mapping delegation

test/server/map-session-user.test.ts

Must verify:
	•	role normalization
	•	emailVerified normalization
	•	nullable cleanup
	•	stable AuthUser shape

test/server/normalize-auth-error.test.ts

Must verify:
	•	vendor-like auth failures map to package-standard errors
	•	unknown failures fail closed safely

test/server/permissions.test.ts

Must verify:
	•	hasRole
	•	hasAnyRole
	•	hasPermission
	•	role-to-grant mapping
	•	guard helpers

test/shared/sign-in-schema.test.ts

Must verify:
	•	valid email/password input passes
	•	malformed email fails
	•	empty or invalid password fails according to chosen baseline rules

test/shared/session-schema.test.ts

Must verify:
	•	client-safe session parses
	•	serialized date requirement enforced
	•	malformed user/session shapes fail

⸻

External contracts this package depends on

@repo/db

@repo/db must provide:
	•	shared Prisma client instance
	•	Better Auth-compatible auth tables and relations
	•	Prisma migrations
	•	User.role field aligned with platform_admin | staff | member
	•	auth indexes appropriate for session/account lookup
	•	Prisma client generation during builds

Prisma’s deployment docs recommend regenerating the client during Vercel builds or checking in generated artifacts to avoid stale clients.  

This package does not own:
	•	schema.prisma
	•	migrations
	•	client generation

@repo/env

packages/auth reads auth env only through @repo/env.

Minimum env contract:
	•	BETTER_AUTH_SECRET
	•	BETTER_AUTH_URL
	•	app environment mode
	•	optional explicit trusted origins
	•	optional allowed hosts only if preview or multi-domain hosting truly needs them

Do not scatter process.env access across auth helpers.

Protected Next apps

Each protected app must own:
	•	app/api/auth/[...all]/route.ts

That file must:
	•	import the shared auth instance
	•	mount Better Auth with toNextJsHandler(auth)
	•	export runtime = "nodejs"

Better Auth recommends keeping the default /api/auth/[...all] pattern, and Next’s Node runtime is the right fit for this package’s server dependencies.  

App DALs

Apps own:
	•	feature authorization
	•	tenant checks
	•	resource ownership checks
	•	role interpretation beyond the coarse shared layer
	•	any React cache() memoization of auth verification per render pass

That logic must not move into packages/auth.

⸻

Explicit non-goals

These do not belong in packages/auth now:
	•	OAuth providers
	•	magic link auth
	•	email OTP
	•	passkeys
	•	2FA
	•	Better Auth organizations
	•	org switching
	•	invitation UI
	•	admin user management UI
	•	password reset UI
	•	email verification UI
	•	analytics/event tracking
	•	feature entitlements
	•	tenant-scoped business roles
	•	app-specific redirect policy
	•	app route constants
	•	auth middleware/proxy abstraction layer
	•	schema migration scripts

⸻

Files and folders that must not exist

If these appear, the package is drifting:

packages/auth/src/lib/
packages/auth/src/server/booking/
packages/auth/src/server/tenant-specific/
packages/auth/src/client/admin/
packages/auth/src/organizations/
packages/auth/src/middleware/
packages/auth/src/policies/
packages/auth/src/feature-flags/
packages/auth/src/server/routes/


⸻

Build order

Implement in this order.

Phase 1: package boundary

Create:
	•	package.json
	•	tsconfig.json
	•	tsup.config.ts
	•	README.md
	•	src/index.ts
	•	src/shared/index.ts
	•	src/server/index.ts
	•	src/client/index.ts

Phase 2: shared contracts

Create:
	•	src/shared/constants.ts
	•	src/shared/types.ts
	•	src/shared/schemas/sign-in.ts
	•	src/shared/schemas/session.ts

Phase 3: server config and adapter

Create:
	•	src/server/utils/server-only.ts
	•	src/server/adapters/prisma-adapter.ts
	•	src/server/config/base-url.ts
	•	src/server/config/cookies.ts
	•	src/server/config/email-password.ts
	•	src/server/config/plugins.ts
	•	src/server/config/session.ts
	•	src/server/config/trusted-origins.ts
	•	src/server/config/base-config.ts
	•	src/server/auth.ts

Phase 4: normalization layer

Create:
	•	src/server/domain/auth-errors.ts
	•	src/server/utils/normalize-auth-error.ts
	•	src/server/mappers/map-session-user.ts
	•	src/server/mappers/map-session.ts
	•	src/server/session/session-types.ts

Phase 5: server helper API

Create:
	•	src/server/session/get-session.ts
	•	src/server/session/require-session.ts
	•	src/server/session/get-session-user.ts

Phase 6: permissions and guards

Create:
	•	src/server/permissions/roles.ts
	•	src/server/permissions/grants.ts
	•	src/server/permissions/predicates.ts
	•	src/server/permissions/index.ts
	•	src/server/guards/assert-authenticated.ts
	•	src/server/guards/assert-role.ts
	•	src/server/guards/assert-permission.ts

Phase 7: client surface

Create:
	•	src/client/client.ts
	•	src/client/types/client-session.ts
	•	src/client/hooks/use-session.ts
	•	src/client/hooks/use-auth-user.ts

Phase 8: fixtures and tests

Create:
	•	test/fixtures/raw-user.ts
	•	test/fixtures/raw-session.ts
	•	all test/server/**
	•	all test/shared/**

⸻

Definition of done

packages/auth is done when:
	•	Better Auth is initialized in exactly one file
	•	Prisma adapter wiring goes only through @repo/db
	•	email/password sign-in works for controlled users
	•	the package surface does not rely on undocumented signup-disabling behavior
	•	normalized auth user/session contracts are stable and documented
	•	@repo/auth/server exposes the settled server API
	•	@repo/auth/client exposes the settled thin client API
	•	coarse shared roles and grants are implemented exactly as specified
	•	no app-specific authorization leaked into the package
	•	exports map prevents deep-import drift
	•	tests cover mapping, session helpers, permissions, guards, and shared schemas
	•	root README clearly states boundaries and non-goals

Final verdict

There are no meaningful open architecture questions left for packages/auth/.

This is now the canonical, implementation-safe source of truth for the directory:
	•	server-first
	•	Better Auth + Prisma
	•	email/password only
	•	invite-only by product surface
	•	no public signup surface
	•	no OAuth
	•	no org plugin
	•	no cookie cache
	•	no cross-subdomain cookies
	•	strict exports
	•	thin client
	•	coarse shared roles only
	•	all real authorization stays in apps
