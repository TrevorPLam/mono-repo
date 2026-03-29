# repo/seo-next/seo-next-canonical.md

Below is the final source of truth for @repo/seo-next.

It is synchronized to the entire project context already established across this project’s chats, including:
	•	the canonical platform decision
	•	the monorepo package boundary rules
	•	the SEO baseline
	•	the @repo/seo-core package plan
	•	the @repo/seo-astro package plan
	•	the security baseline
	•	the testing baseline
	•	the observability / package-boundary / compiled-package rules
	•	the fact that Astro is the main SEO-critical surface for public/client marketing sites, while Next.js is for product/protected app surfaces

This package is therefore not the primary marketing SEO package. It is the Next App Router adapter for the shared SEO system.

A few framework facts lock down this design:
	•	In Next.js App Router, metadata is configured either by exporting a static metadata object or a dynamic generateMetadata function; those are supported only in Server Components, and you cannot export both from the same segment. searchParams are only available to page segments. File-based metadata has higher priority than config-based metadata.  
	•	Relative URL metadata fields are composed against metadataBase; without metadataBase, relative URL-based metadata can fail.  
	•	Next supports robots.ts, sitemap.ts, and generateSitemaps(), and in Next 16 the id passed from generateSitemaps() into sitemap() is a Promise<string>.  
	•	Next recommends rendering JSON-LD with a native <script type="application/ld+json"> and escaping < in serialized JSON.  
	•	On Vercel, host and x-forwarded-host reflect the accessed host, and x-forwarded-proto reflects the forwarded protocol, typically https in production.  
	•	Google treats robots.txt as crawl control, not de-indexing; to keep a page out of Google, use noindex while still allowing crawl access. Google also treats sitemap URLs as hints and recommends clear canonical signals in HTML.  
	•	For localized alternates, Google supports fully qualified alternate URLs in HTML, HTTP headers, or sitemaps.  
	•	Under CSP, inline scripts require a nonce or hash unless weaker allowances are used; nonce-based flows are request-specific.  

⸻

1. Package identity

Purpose

@repo/seo-next is the Next.js adapter package that lets Next App Router apps consume shared SEO policy from @repo/seo-core without re-implementing canonical logic, robots policy, sitemap shaping, or structured-data rendering.

It owns:
	•	Next-specific metadata adaptation
	•	Next metadata-file route helpers
	•	request/page/path/origin normalization for Next surfaces
	•	safe JSON-LD rendering for React/Next server-rendered pages
	•	ergonomic helpers that make correct usage easier than ad hoc page-by-page SEO code

It does not own:
	•	SEO policy
	•	canonical policy
	•	preview / demo indexing policy
	•	sitemap inclusion policy
	•	tenant/domain business rules
	•	CMS fetching
	•	DB access
	•	auth/session logic
	•	page rendering
	•	OG/Twitter image generation
	•	PWA / manifest concerns
	•	app-specific business SEO logic

Role in the monorepo

This package sits:
	•	above @repo/seo-core
	•	beside @repo/seo-astro
	•	below Next apps such as apps/app-booking and future protected/product Next apps

It exists because the project deliberately chose:
	•	shared SEO policy in seo-core
	•	framework adapters per framework
	•	Astro-first public SEO
	•	Next-specific adapter logic only where Next surfaces need it

⸻

2. Final architectural decisions

Decision 1: this is an adapter, not a second SEO policy layer

All policy lives in @repo/seo-core.

@repo/seo-next only translates between:
	•	Next route/layout/page context
	•	resolved shared SEO output
	•	Next Metadata objects
	•	Next metadata-file route outputs
	•	React rendering of JSON-LD

If a rule feels like “what should the canonical be?” or “should this preview page be noindex?”, it belongs in seo-core, not here.

⸻

Decision 2: two metadata modes are required

This package will support two primary metadata flows:
	•	buildStaticMetadata(...)
	•	buildRequestMetadata(...)

That split is mandatory because static metadata should remain the default when request data is unnecessary, while request-derived metadata can make routes dynamic or partially dynamic. Next explicitly distinguishes static config-based metadata from dynamic generateMetadata.  

Final rule
	•	Use buildStaticMetadata unless the route genuinely depends on request-derived host/origin data.
	•	Use buildRequestMetadata only when the accessed origin actually matters.

⸻

Decision 3: absolute URLs first, metadataBase second

Because this repo is domain-aware and some Next apps may be multi-tenant or custom-domain-sensitive, this adapter will prefer fully qualified URL outputs for:
	•	canonical
	•	alternates
	•	Open Graph URLs/images
	•	Twitter image URLs

metadataBase remains supported as a compatibility/input escape hatch for truly single-origin apps, but it is not the primary design. That avoids hidden single-host assumptions and reduces accidental cross-domain canonical mistakes. Next composes relative metadata URLs against metadataBase, so leaving that implicit is risky for domain-aware apps.  

⸻

Decision 4: origin resolution must be explicit

This package will not quietly call headers() deep inside convenience functions.

Instead, public usage supports two explicit strategies:
	•	explicitOrigin
	•	requestDerivedOrigin

That keeps the static/dynamic boundary visible to app authors and agentic coders.

Final rule
	•	Request-derived origin is opt-in.
	•	App-level code decides whether the route is request-aware.
	•	This package provides helpers to normalize origin, but not to secretly choose that path.

⸻

Decision 5: robots.ts and sitemap.ts are first-class adapter surfaces

These belong in @repo/seo-next because they are Next metadata-file outputs, not policy definitions. Next supports metadata files directly for these surfaces.  

Final rule
	•	Route helpers live here.
	•	Inclusion / indexing policy still lives in seo-core.

⸻

Decision 6: multi-sitemap support is included in v1

Even though the first Next app may be small, this adapter will support both:
	•	single sitemap
	•	multiple sitemap flows via generateSitemaps()

That is cheap to design now and expensive to retrofit later. Next 16’s Promise<string> id behavior is part of the contract.  

⸻

Decision 7: JSON-LD is native script, sanitized, and nonce-capable

JsonLd.tsx will render a native:

<script type="application/ld+json">

not next/script, matching Next’s guidance. Serialized JSON must be sanitized by escaping <. The component accepts an optional nonce prop for strict-CSP apps, but nonce generation and propagation remain app-level concerns.  

Final rule
	•	This package supports nonce usage.
	•	It does not generate or discover the nonce itself.
	•	CSP plumbing belongs to the app.

⸻

Decision 8: crawl control and index control stay separate

This package will treat:
	•	robots.ts as crawl control
	•	metadata robots fields as index control

Google is explicit that robots.txt is not a de-indexing mechanism and that noindex must be crawlable to be seen.  

Final rule

The adapter must not create contradictory states such as:
	•	block page in robots.txt
	•	also mark page noindex

That makes noindex ineffective.

⸻

Decision 9: manifest and metadata-image conventions are deferred

This v1 package will not include:
	•	manifest.ts
	•	opengraph-image.tsx
	•	twitter-image.tsx
	•	image-generation helpers

Next supports those metadata file conventions, but they expand scope into PWA/app-shell or image-generation concerns, which this package should not own in v1.  

⸻

Decision 10: package-local tests stay local

Testing structure is:
	•	src/testing/ for reusable adapter test helpers
	•	test/ for package-local behavior tests

There is no move to a generic packages/testing/ for this package’s actual behavior coverage.

⸻

3. Directory tree

packages/seo-next/
├─ package.json
├─ tsconfig.json
├─ tsup.config.ts
├─ README.md
├─ src/
│  ├─ index.ts
│  ├─ metadata/
│  │  ├─ index.ts
│  │  ├─ build-metadata.ts
│  │  ├─ build-static-metadata.ts
│  │  ├─ build-request-metadata.ts
│  │  ├─ resolve-metadata.ts
│  │  ├─ map-to-next-metadata.ts
│  │  ├─ map-title.ts
│  │  ├─ map-open-graph.ts
│  │  ├─ map-twitter.ts
│  │  ├─ map-robots.ts
│  │  ├─ map-alternates.ts
│  │  └─ validation.ts
│  ├─ routes/
│  │  ├─ index.ts
│  │  ├─ robots.ts
│  │  ├─ sitemap.ts
│  │  └─ generate-sitemaps.ts
│  ├─ context/
│  │  ├─ index.ts
│  │  ├─ headers-origin.ts
│  │  ├─ request-url.ts
│  │  ├─ params-path.ts
│  │  ├─ page-context.ts
│  │  ├─ tenant-context.ts
│  │  └─ origin-strategy.ts
│  ├─ resolution/
│  │  ├─ index.ts
│  │  ├─ resolve-next-seo.ts
│  │  ├─ resolve-next-canonical.ts
│  │  ├─ resolve-next-robots.ts
│  │  ├─ resolve-next-sitemap-entry.ts
│  │  └─ resolve-next-schema.ts
│  ├─ schema/
│  │  ├─ index.ts
│  │  ├─ JsonLd.tsx
│  │  ├─ render-json-ld.ts
│  │  └─ safe-json.ts
│  ├─ dev/
│  │  ├─ index.ts
│  │  └─ SeoDebug.tsx
│  ├─ types/
│  │  ├─ index.ts
│  │  ├─ context.ts
│  │  ├─ metadata.ts
│  │  ├─ routes.ts
│  │  └─ schema.ts
│  ├─ internal/
│  │  ├─ constants.ts
│  │  ├─ errors.ts
│  │  ├─ guards.ts
│  │  ├─ normalize.ts
│  │  └─ server-only.ts
│  └─ testing/
│     ├─ index.ts
│     ├─ fixtures.ts
│     ├─ next-context-builders.ts
│     └─ assertions.ts
└─ test/
   ├─ metadata/
   │  ├─ build-static-metadata.test.ts
   │  ├─ build-request-metadata.test.ts
   │  ├─ map-title.test.ts
   │  ├─ map-alternates.test.ts
   │  ├─ map-open-graph.test.ts
   │  ├─ map-twitter.test.ts
   │  └─ map-robots.test.ts
   ├─ routes/
   │  ├─ robots.test.ts
   │  ├─ sitemap.test.ts
   │  └─ generate-sitemaps.test.ts
   ├─ context/
   │  ├─ headers-origin.test.ts
   │  ├─ params-path.test.ts
   │  ├─ page-context.test.ts
   │  └─ tenant-context.test.ts
   ├─ resolution/
   │  ├─ resolve-next-seo.test.ts
   │  ├─ resolve-next-canonical.test.ts
   │  ├─ resolve-next-robots.test.ts
   │  ├─ resolve-next-sitemap-entry.test.ts
   │  └─ resolve-next-schema.test.ts
   └─ schema/
      ├─ JsonLd.test.tsx
      ├─ render-json-ld.test.ts
      └─ safe-json.test.ts


⸻

4. Top-level files

package.json

Purpose

Defines package identity, scripts, dependencies, and public exports.

Required behavior

This package exposes a small public API:
	•	@repo/seo-next
	•	@repo/seo-next/metadata
	•	@repo/seo-next/routes
	•	@repo/seo-next/schema
	•	@repo/seo-next/testing

Required decisions
	•	"type": "module"
	•	"sideEffects": false
	•	compiled package with explicit exports
	•	next, react, and react-dom should be peer dependencies or aligned with repo convention
	•	direct dependency on @repo/seo-core
	•	no app imports
	•	no @repo/db, @repo/auth, @repo/ui, @repo/analytics

Scripts
	•	build
	•	clean
	•	lint
	•	test
	•	typecheck

No weird package-specific build scripts.

⸻

tsconfig.json

Purpose

Strict TypeScript config for a compiled Next adapter package.

Required behavior
	•	extends repo shared strict TS baseline
	•	supports TSX for JsonLd.tsx and SeoDebug.tsx
	•	declaration generation handled by tsup
	•	no client component assumptions
	•	server-safe by default

Important boundary

Metadata helpers and route helpers are server-only concepts. Next metadata APIs are server-side only.  

⸻

tsup.config.ts

Purpose

Build config for ESM + declarations with explicit entrypoints.

Required outputs
	•	root entrypoint
	•	metadata
	•	routes
	•	schema
	•	testing

Rule

No custom build cleverness unless absolutely required.

⸻

README.md

Purpose

The package README is a hard guardrail for agentic coding.

Required sections
	•	purpose
	•	package role in repo
	•	relation to @repo/seo-core
	•	supported modes: static vs request-aware metadata
	•	origin strategies
	•	generateMetadata usage
	•	robots.ts usage
	•	sitemap.ts and generateSitemaps() usage
	•	JSON-LD usage
	•	CSP/nonce notes
	•	file-based metadata precedence
	•	proxy.ts matcher exclusion rule for metadata files
	•	forbidden patterns
	•	troubleshooting wrong canonical/origin behavior

Next file-based metadata conventions take precedence over config-based metadata, and metadata files should be excluded from proxy matching concerns.  

⸻

5. src/ root

src/index.ts

Purpose

Conservative root export surface.

Export

Only stable top-level helpers:
	•	buildStaticMetadata
	•	buildRequestMetadata
	•	buildRobotsRoute
	•	buildSitemapRoute
	•	buildGenerateSitemaps
	•	JsonLd

Optionally selected public types.

Must not export
	•	raw internal mappers
	•	internal guards
	•	dev helpers
	•	server-only markers
	•	low-level context internals by default

⸻

6. src/metadata/

This folder is the core Next metadata adapter surface.

metadata/index.ts

Purpose

Public entrypoint for metadata helpers.

Export
	•	buildStaticMetadata
	•	buildRequestMetadata
	•	resolveMetadata
	•	selected public metadata types

⸻

metadata/build-metadata.ts

Purpose

Internal orchestration shared by static and request-aware builders.

Responsibilities
	•	normalize metadata input
	•	validate it
	•	invoke Next-facing resolution
	•	map resolved output to Next Metadata
	•	return final metadata object

Rule

Not intended as primary public API.

⸻

metadata/build-static-metadata.ts

Purpose

Primary metadata builder for routes that do not depend on request headers or host-derived runtime data.

Use for
	•	stable app layouts
	•	single-origin pages
	•	routes where canonical/origin is known ahead of time
	•	routes where no request-specific SEO logic is needed

Public contract

A straightforward synchronous or async-safe builder that does not imply request-derived metadata.

Hard rule

This is the default path.

Next recommends static metadata when request information is unnecessary.  

⸻

metadata/build-request-metadata.ts

Purpose

Primary metadata builder for routes whose SEO depends on the accessed request origin or other request-derived data.

Use for
	•	custom-domain flows
	•	host-sensitive tenant routes
	•	genuinely request-aware metadata

Public contract

Returns Promise<Metadata> and makes request awareness obvious at the callsite.

Hard rule

This builder must not hide that it is request-aware.

Request-sensitive metadata can make an otherwise static route dynamic or partially dynamic.  

⸻

metadata/resolve-metadata.ts

Purpose

Bridge between adapter inputs and core SEO resolution.

Responsibilities
	•	normalize Next-facing input into shared resolution input
	•	call resolve-next-seo
	•	return a resolved shared SEO object ready for mapping

Rule

This is the seam between “framework input” and “shared SEO output.”

⸻

metadata/map-to-next-metadata.ts

Purpose

Single place where resolved shared SEO output becomes Next Metadata.

Responsibilities
	•	map title
	•	map description
	•	map alternates
	•	map robots
	•	map Open Graph
	•	map Twitter
	•	include any supported extra metadata fields

Rule

This file absorbs framework-specific shape changes.

⸻

metadata/map-title.ts

Purpose

Centralized handling of Next title semantics.

Why this file exists

Title inheritance in Next is specific enough that app authors should not improvise it. Next distinguishes title, title.default, title.template, and title.absolute, and title.template applies only to child segments, not the same segment.  

Responsibilities
	•	map plain title values
	•	map template/default combinations
	•	guard against invalid template usage
	•	support absolute title overrides

⸻

metadata/map-open-graph.ts

Purpose

Map resolved shared Open Graph data to Next openGraph.

Responsibilities
	•	map OG title/description/url/type/images
	•	require absolute URL outputs
	•	avoid platform policy invention
	•	avoid image generation or fetching

⸻

metadata/map-twitter.ts

Purpose

Map resolved shared Twitter/X metadata to Next twitter.

Responsibilities
	•	adapt title/description/images/card type
	•	keep mapping thin
	•	avoid provider-specific policy

⸻

metadata/map-robots.ts

Purpose

Map resolved index/follow/bot directives to Next metadata robots fields.

Responsibilities
	•	preserve core SEO policy
	•	avoid contradicting crawl-route policy
	•	keep index control in metadata

Google separates crawl control from indexing control.  

⸻

metadata/map-alternates.ts

Purpose

Map canonical and alternate URL outcomes into Next alternates.

Responsibilities
	•	emit absolute canonical URLs
	•	support future language alternates cleanly
	•	preserve shape for future hreflang growth
	•	never guess locale relationships

Google expects fully qualified alternate URLs and supports alternate-language annotations in head, headers, or sitemaps.  

⸻

metadata/validation.ts

Purpose

Fail-fast validation for metadata builder input and mapped output.

Must validate
	•	missing origin when absolute URLs are required
	•	malformed canonical URL
	•	malformed alternates map
	•	invalid title template/default combinations
	•	static/request builder misuse
	•	unsafe mixed input shapes

Rule

Errors should be precise and helpful.

⸻

7. src/routes/

This folder contains helpers for Next metadata-file routes.

routes/index.ts

Purpose

Public entrypoint for route helpers.

Export
	•	buildRobotsRoute
	•	buildSitemapRoute
	•	buildGenerateSitemaps

⸻

routes/robots.ts

Purpose

Build a MetadataRoute.Robots output for app/robots.ts.

Responsibilities
	•	adapt crawl policy from resolved/core inputs
	•	map to Next’s robots route shape
	•	stay crawl-focused, not index-focused

Hard rule

No duplicate index policy here.

Google says robots.txt controls crawler access and is not a mechanism for removing pages from Search.  

⸻

routes/sitemap.ts

Purpose

Build a single sitemap route output for app/sitemap.ts.

Responsibilities
	•	adapt resolved sitemap entries into MetadataRoute.Sitemap
	•	preserve lastModified and related sitemap metadata
	•	include canonical-preferred URLs only
	•	avoid inclusion-policy invention

Sitemaps are hints, and Google treats sitemap URLs as suggestions rather than commands.  

⸻

routes/generate-sitemaps.ts

Purpose

Support Next’s generateSitemaps() for multi-sitemap routing.

Responsibilities
	•	generate shard descriptors
	•	support Next 16 async id expectations
	•	keep multi-sitemap logic ergonomic for consumers

Hard rule

This helper is included in v1.

Next 16 passes the id to sitemap() as a Promise<string>.  

⸻

8. src/context/

This folder adapts runtime and route context into a normalized SEO adapter context.

context/index.ts

Purpose

Selective export of public context helpers and types.

⸻

context/headers-origin.ts

Purpose

Normalize origin from request headers.

Responsibilities
	•	parse host
	•	parse x-forwarded-host
	•	parse x-forwarded-proto
	•	construct normalized absolute origin
	•	reject obviously invalid values

Must not do
	•	tenant DB lookups
	•	domain ownership validation
	•	CMS lookups
	•	auth/session checks

On Vercel, host / x-forwarded-host and x-forwarded-proto are the key inputs here.  

⸻

context/request-url.ts

Purpose

Build a normalized request URL abstraction.

Responsibilities
	•	combine origin and pathname
	•	normalize slashes
	•	preserve query only when explicitly needed
	•	provide a stable URL input for resolution/mapping

⸻

context/params-path.ts

Purpose

Turn route params into normalized path strings.

Must handle
	•	simple params
	•	catch-all params
	•	optional catch-all params
	•	empty values
	•	slash normalization
	•	safe decoding

Rule

App routes should not hand-roll dynamic-param path logic.

⸻

context/page-context.ts

Purpose

Normalize app-provided page metadata context into a stable adapter shape.

Example fields
	•	pathname
	•	routeKind
	•	pageType
	•	isProtectedSurface
	•	isPreviewLikeSurface
	•	pagination
	•	indexabilityHint

Rule

This adapts app knowledge. It does not decide policy.

⸻

context/tenant-context.ts

Purpose

Adapt app-resolved tenant/domain context into the shape expected by seo-core.

Must not do
	•	DB access
	•	auth access
	•	domain discovery
	•	tenant resolution logic

It only transforms already-resolved app data.

⸻

context/origin-strategy.ts

Purpose

Define the public origin-strategy model.

Final strategies
	•	explicitOrigin
	•	requestDerivedOrigin

Why this file exists

It makes the static vs request-aware split part of the type system and public API.

⸻

9. src/resolution/

This folder composes normalized Next context with shared SEO resolution.

resolution/index.ts

Purpose

Selective exports for stable resolution helpers.

⸻

resolution/resolve-next-seo.ts

Purpose

Primary composition point between normalized adapter context and @repo/seo-core.

Responsibilities
	•	accept normalized Next context + SEO inputs
	•	call seo-core
	•	return resolved shared SEO output

This is the main internal resolver.

⸻

resolution/resolve-next-canonical.ts

Purpose

Focused canonical resolution helper.

Use

When mapping or routes need canonical output without invoking the full metadata path.

⸻

resolution/resolve-next-robots.ts

Purpose

Focused robots/indexability resolution helper.

Use

Keeps metadata and route helpers from re-deriving the same logic.

⸻

resolution/resolve-next-sitemap-entry.ts

Purpose

Map or adapt sitemap entities to the shape needed by route helpers.

⸻

resolution/resolve-next-schema.ts

Purpose

Produce resolved structured-data output for the JSON-LD renderer.

Rule

Keeps JsonLd.tsx mostly render-only.

⸻

10. src/schema/

This folder handles structured-data rendering.

schema/index.ts

Purpose

Public schema entrypoint.

Export
	•	JsonLd
	•	renderJsonLd
	•	safeJsonLdString

⸻

schema/JsonLd.tsx

Purpose

Primary React component for rendering JSON-LD in Next layouts/pages.

Final behavior
	•	native <script type="application/ld+json">
	•	accepts value
	•	accepts optional id
	•	accepts optional nonce
	•	no client directive
	•	render-only, no policy logic

Next recommends using a native script element for JSON-LD.  

⸻

schema/render-json-ld.ts

Purpose

Centralized serialization of structured data.

Responsibilities
	•	stable serialization
	•	delegate escaping to safe-json.ts
	•	avoid page-level ad hoc JSON.stringify

⸻

schema/safe-json.ts

Purpose

Escaping and sanitization boundary for JSON-LD serialization.

Minimum requirement
	•	replace < with \u003c

Next explicitly recommends sanitizing serialized JSON-LD strings that way.  

Final rule

This file is mandatory, not optional polish.

⸻

11. src/dev/

This folder is dev-only and not public API.

dev/index.ts

Purpose

Internal convenience re-exports for dev helpers.

⸻

dev/SeoDebug.tsx

Purpose

Optional debug surface for inspecting resolved SEO output in dev/preview.

Rules
	•	not public API
	•	not production UI
	•	no business logic
	•	optional and lightweight

⸻

12. src/types/

Only package-specific adapter types live here.

types/index.ts

Purpose

Selective type re-exports for public consumption.

⸻

types/context.ts

Contains
	•	origin strategy types
	•	normalized request context types
	•	normalized page context types
	•	normalized tenant context types

⸻

types/metadata.ts

Contains
	•	StaticMetadataInput
	•	RequestMetadataInput
	•	internal normalized metadata input types
	•	resolved metadata mapping types

Important rule

Separate layout-safe and page-safe shapes where appropriate, because searchParams are only available in page segments in Next.  

⸻

types/routes.ts

Contains
	•	RobotsRouteInput
	•	SitemapRouteInput
	•	GenerateSitemapsInput
	•	output helper types

⸻

types/schema.ts

Contains
	•	JsonLdProps
	•	render helper input types
	•	resolved schema value types

Rule

Keep this tight. No dumping ground.

⸻

13. src/internal/

Private implementation details.

internal/constants.ts

Purpose

Package-local defaults and internal labels.

Examples
	•	empty metadata defaults
	•	route kind constants
	•	supported origin strategy values
	•	internal field names

⸻

internal/errors.ts

Purpose

Typed, specific adapter errors.

Expected errors
	•	SeoNextValidationError
	•	SeoNextOriginError
	•	SeoNextContextError

⸻

internal/guards.ts

Purpose

Small type/value guards.

Examples
	•	is absolute URL
	•	is non-empty locale key
	•	is array param
	•	is valid title template shape

⸻

internal/normalize.ts

Purpose

Shared normalization utilities.

Responsibilities
	•	path cleanup
	•	slash normalization
	•	URL normalization
	•	locale normalization

⸻

internal/server-only.ts

Purpose

Mark modules and boundaries that must remain server-only.

Why

Metadata APIs and request-bound helpers are server-oriented in Next.  

⸻

14. src/testing/

Reusable test support.

testing/index.ts

Purpose

Public testing entrypoint.

Export
	•	fixtures
	•	context builders
	•	shared assertions

⸻

testing/fixtures.ts

Purpose

Stable fixtures representing resolved shared SEO outputs and common adapter inputs.

Rule

Use fixtures to test adapter behavior, not to re-test core policy.

⸻

testing/next-context-builders.ts

Purpose

Builders for realistic test inputs.

Must support
	•	static metadata context
	•	request-derived origin context
	•	dynamic route params
	•	preview-like surfaces
	•	multi-sitemap contexts

⸻

testing/assertions.ts

Purpose

Shared assertions for frequent adapter outcomes.

Examples
	•	canonical output is absolute
	•	alternates shape is correct
	•	robots shape matches expectation
	•	JSON-LD is sanitized
	•	title mapping behaves correctly

⸻

15. test/

Package-local behavior tests.

test/metadata/

build-static-metadata.test.ts

Covers static metadata path.

build-request-metadata.test.ts

Covers request-aware metadata path.

map-title.test.ts

Covers title/default/template/absolute behavior.

map-alternates.test.ts

Covers canonical + alternates mapping.

map-open-graph.test.ts

Covers OG mapping.

map-twitter.test.ts

Covers Twitter mapping.

map-robots.test.ts

Covers metadata robots mapping.

⸻

test/routes/

robots.test.ts

Covers robots route output.

sitemap.test.ts

Covers single sitemap route output.

generate-sitemaps.test.ts

Covers multi-sitemap helper behavior and Next 16 async id expectations.  

⸻

test/context/

headers-origin.test.ts

Covers origin derivation from Vercel-style headers.

params-path.test.ts

Covers dynamic param normalization.

page-context.test.ts

Covers normalized page context.

tenant-context.test.ts

Covers tenant context shaping.

⸻

test/resolution/

resolve-next-seo.test.ts

Covers end-to-end adapter-to-core composition.

resolve-next-canonical.test.ts

Covers canonical-only resolution.

resolve-next-robots.test.ts

Covers robots resolution.

resolve-next-sitemap-entry.test.ts

Covers sitemap entry adaptation.

resolve-next-schema.test.ts

Covers schema resolution.

⸻

test/schema/

JsonLd.test.tsx

Covers render output and optional nonce passthrough.

render-json-ld.test.ts

Covers serialization.

safe-json.test.ts

Covers sanitization.

⸻

16. Public API contract

@repo/seo-next

Exports
	•	buildStaticMetadata
	•	buildRequestMetadata
	•	buildRobotsRoute
	•	buildSitemapRoute
	•	buildGenerateSitemaps
	•	JsonLd

This root entrypoint stays small.

⸻

@repo/seo-next/metadata

Exports
	•	buildStaticMetadata
	•	buildRequestMetadata
	•	resolveMetadata
	•	selected metadata types

⸻

@repo/seo-next/routes

Exports
	•	buildRobotsRoute
	•	buildSitemapRoute
	•	buildGenerateSitemaps

⸻

@repo/seo-next/schema

Exports
	•	JsonLd
	•	renderJsonLd
	•	safeJsonLdString

⸻

@repo/seo-next/testing

Exports
	•	fixtures
	•	next context builders
	•	assertions

⸻

17. Allowed imports

Allowed
	•	@repo/seo-core
	•	next
	•	react
	•	very small utility libraries if justified

Disallowed
	•	any app package
	•	@repo/db
	•	@repo/auth
	•	@repo/ui
	•	@repo/analytics
	•	CMS SDKs
	•	ORM packages
	•	queue packages

This package must remain a thin adapter with no app/service dependencies.

⸻

18. Consumer rules

Rule 1

Prefer buildStaticMetadata whenever request data is not truly needed. Next favors static metadata for stable routes.  

Rule 2

Use buildRequestMetadata only when origin depends on the actual request host.

Rule 3

Do not export both metadata and generateMetadata in one route segment. Next disallows that.  

Rule 4

Do not rely on a single hardcoded root metadataBase for domain-sensitive apps. Prefer adapter-produced absolute URLs.  

Rule 5

Exclude metadata files from proxy.ts matchers and do not duplicate the same concern across file-based and config-based metadata. Next treats file-based metadata as higher priority.  

Rule 6

Do not use robots.txt to de-index pages. Use metadata robots / noindex while still permitting crawl access.  

Rule 7

JSON-LD in strict-CSP apps must receive a nonce from app-level CSP plumbing when nonce-based inline-script allowances are used. CSP nonces are request-specific.  

Rule 8

Do not fetch CMS/content in this package.

Rule 9

Do not resolve tenant/business logic in this package.

⸻

19. What must not exist

These are drift markers and should not be created:

packages/seo-next/src/cms/
packages/seo-next/src/content-fetching/
packages/seo-next/src/db/
packages/seo-next/src/auth/
packages/seo-next/src/business/
packages/seo-next/src/page-specific/
packages/seo-next/src/images/
packages/seo-next/src/manifest/
packages/seo-next/src/ui/
packages/seo-next/src/misc/


⸻

20. Explicitly deferred scope

Not part of v1:
	•	manifest.ts
	•	opengraph-image.tsx
	•	twitter-image.tsx
	•	metadata-image generation helpers
	•	non-HTML canonical HTTP-header helpers
	•	CMS integrations
	•	locale negotiation logic
	•	PWA behavior
	•	domain trust verification logic
	•	app-specific SEO presets

Google supports canonical HTTP headers for non-HTML resources, and Google also supports localized alternates in headers and sitemaps, but this package is intentionally not taking on those non-HTML/header-oriented extensions in v1.  

⸻

21. Implementation order

Phase 1: skeleton
	•	top-level files
	•	exports map
	•	README
	•	folder structure

Phase 2: metadata path
	•	metadata types
	•	build-static-metadata
	•	build-request-metadata
	•	resolution bridge
	•	title / alternates / robots / OG / Twitter mapping
	•	validation

Phase 3: context path
	•	origin strategy
	•	header-origin normalization
	•	request URL normalization
	•	params path normalization
	•	page / tenant context shaping

Phase 4: routes
	•	robots helper
	•	sitemap helper
	•	generateSitemaps helper

Phase 5: schema
	•	safe JSON serialization
	•	render-json-ld
	•	JsonLd

Phase 6: tests
	•	package-local behavior tests
	•	README examples verified against API shape

⸻

22. Definition of done

@repo/seo-next is done when:
	•	Next apps can generate metadata through shared helpers instead of local Metadata invention
	•	static and request-aware metadata paths are clearly separated
	•	canonical, alternates, robots, OG, and Twitter mapping are centralized
	•	request/domain/page context can be normalized without leaking business logic
	•	route helpers exist for robots.ts, single sitemap, and multi-sitemap flows
	•	JSON-LD is rendered through one safe centralized helper
	•	public exports are small and clean
	•	no SEO policy is duplicated outside @repo/seo-core
	•	tests cover adapter behavior without re-testing core policy
	•	the README is strong enough to prevent drift by agentic coders

⸻

23. Non-goals

This package is not:
	•	a second SEO policy layer
	•	a CMS layer
	•	a page rendering package
	•	a tenant resolution service
	•	a CSP/middleware package
	•	an OG image package
	•	a PWA package
	•	a business logic layer

It is the Next App Router adapter for the shared SEO system.

⸻

24. Final call

This is the canonical directory plan for @repo/seo-next.

The decisions that matter most are:
	•	thin adapter above seo-core
	•	two metadata modes
	•	absolute-URL-first outputs
	•	explicit origin strategies
	•	first-class route helpers
	•	safe JSON-LD with optional nonce support
	•	strict separation of crawl control vs index control
	•	no manifest / image-generation / CMS scope in v1

This should now be treated as the final source of truth for this directory.