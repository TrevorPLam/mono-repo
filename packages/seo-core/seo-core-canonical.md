# repo/seo-core/seo-core-canonical.md

Below is the final Source of Truth for @repo/seo-core.

It is synthesized against the full project context already established across this project:
	•	pnpm + Turborepo monorepo
	•	compiled-first internal runtime packages
	•	Astro for public/content-heavy surfaces
	•	Next.js for app/product surfaces
	•	shared multi-tenant public-site hosting by default, with ejection path for outliers
	•	framework-agnostic shared SEO contract plus framework adapters
	•	per-domain canonicals and sitemaps
	•	CMS-driven metadata overlay supported, but no CMS dependency in core
	•	public demos should generally be crawlable + noindex, not robots-blocked
	•	pagination should self-canonical
	•	apps must not hardcode tenant SEO rules
	•	early sites are code/content-file first, not CMS-first

This document is the authoritative plan for packages/seo-core/ and should supersede earlier partial drafts.

⸻

packages/seo-core/

Purpose

@repo/seo-core is the framework-agnostic SEO policy engine for the monorepo.

It centralizes the rules that should never be improvised inside apps, layouts, pages, CMS integrations, or framework adapters:
	•	what valid SEO input looks like
	•	how metadata layers merge
	•	how canonical URLs are built
	•	how query parameters affect canonicals, indexing, and sitemap inclusion
	•	how robots/noindex policy is decided
	•	how sitemap entries are formed
	•	how structured data is scoped and built
	•	how tenant/domain/environment policy affects SEO outcomes
	•	how final SEO decisions are resolved deterministically

This package is not a renderer, not a crawler, not a CMS SDK, and not a framework integration layer.

It should feel like a policy brain, not a UI or framework package.

⸻

Role in the monorepo

@repo/seo-core sits between:
	•	@repo/contracts, which owns stable shared SEO-facing input contracts
	•	adapter packages like @repo/seo-astro and @repo/seo-next, which translate core SEO policy into framework-specific output

Conceptually:
	•	@repo/contracts = shared durable shapes
	•	@repo/seo-core = normalization, policy, and resolved outcomes
	•	@repo/seo-astro = Astro-facing adapter layer
	•	@repo/seo-next = Next-facing adapter layer

This package must remain:
	•	framework-neutral
	•	domain-aware
	•	tenant-aware
	•	deterministic
	•	lightweight
	•	hard to bypass

⸻

What this package owns

@repo/seo-core owns:
	•	metadata normalization rules
	•	metadata default rules
	•	metadata overlay/merge policy
	•	canonical URL policy
	•	path normalization policy
	•	query parameter SEO policy
	•	pagination canonical policy
	•	alternate URL policy for canonical aliases
	•	sitemap entry policy
	•	sitemap partitioning rules
	•	lastmod emission rules
	•	robots/noindex policy
	•	demo/preview/staging indexing policy
	•	structured-data builders
	•	structured-data scope rules
	•	tenant/domain/environment SEO config normalization
	•	route SEO descriptors and visibility policy
	•	final resolution orchestration
	•	runtime validation of SEO inputs and outputs
	•	deterministic decision reason codes
	•	test fixtures/builders for shared SEO behavior

⸻

What this package does not own

@repo/seo-core does not own:
	•	Astro components
	•	Next.js Metadata API objects directly
	•	robots.ts, sitemap.ts, or metadata file routes
	•	page rendering
	•	route discovery from framework routers
	•	CMS querying
	•	CMS SDK integration
	•	browser runtime behavior
	•	Search Console automation
	•	SEO audit tooling
	•	analytics attribution
	•	page-authoring systems
	•	app-local one-off SEO logic

⸻

Non-goals

This package is not trying to be:
	•	a rendering package
	•	a framework adapter
	•	a crawler
	•	an SEO report generator
	•	a content management abstraction
	•	a full internationalization SEO system
	•	a warehouse of every possible schema.org type
	•	a place for experimental page-level hacks

⸻

Core design philosophy

1. SEO policy belongs in shared code, not per-page improvisation

Apps must not each reinvent:
	•	canonical rules
	•	noindex rules
	•	query param treatment
	•	pagination behavior
	•	sitemap inclusion rules
	•	structured-data scope
	•	tenant/domain SEO resolution

Those belong in one shared package.

2. Framework glue stays out

This package defines what SEO means and how it resolves.

It does not define how Astro or Next inject that result into rendered output.

3. Domain and tenant awareness are first-class

This repo hosts multiple brands/domains and a shared multi-tenant host.

So @repo/seo-core must assume:
	•	canonical truth is domain-specific
	•	metadata may be tenant-specific
	•	sitemap scope is domain-specific
	•	indexing behavior may vary by environment/surface
	•	shared hosts cannot rely on one global static site URL as canonical truth

4. Safety beats local overrides

Lower-precedence overlays may enrich content.

They may not break higher-precedence safety policy such as:
	•	forced preview/demo noindex
	•	canonical host policy
	•	private-route exclusion
	•	disallowed query param treatment

5. Determinism matters

Given the same input, this package must produce the same output every time.

No fuzzy heuristics.

No hidden framework behavior.

No silent request-bound side effects.

6. Keep the core lightweight

This package should expose:
	•	contracts
	•	builders
	•	validators
	•	resolution functions

It should not accumulate:
	•	UI
	•	framework branches
	•	SDK clients
	•	runtime-specific hacks

⸻

Hard rules
	1.	No framework imports.
	2.	No app imports.
	3.	Canonicals are domain-aware by default.
	4.	Query parameter policy is centralized here.
	5.	Pagination self-canonicalizes.
	6.	Public demos/previews are generally crawlable + noindex, not robots-blocked.
	7.	Sitemaps contain canonical URLs only.
	8.	lastmod is emitted only when trustworthy.
	9.	priority and changefreq are compatibility-only and omitted by default.
	10.	Structured data is JSON-LD only.
	11.	WebSite schema is home-page-only.
	12.	Apps must not hardcode tenant SEO policy.
	13.	No CMS logic here.
	14.	No browser runtime behavior here.
	15.	No speculative future SEO systems without a real consumer.

⸻

Package boundary with @repo/contracts

This boundary must be explicit and enforced.

@repo/contracts owns

Stable SEO input contracts that may be shared across multiple packages, such as:
	•	tenant SEO config input
	•	domain SEO config input
	•	route SEO descriptor input
	•	CMS/content metadata overlay input
	•	schema-related input shapes that are truly shared

@repo/seo-core owns
	•	normalized internal forms
	•	resolved public SEO outputs
	•	merge rules
	•	validation rules
	•	deterministic builders
	•	decision reasons
	•	policy application

Rule

src/types/ inside seo-core must not become a duplicate contract layer.

It holds:
	•	resolved output types
	•	package-local public result types
	•	helper types that do not belong in @repo/contracts

⸻

Final directory shape

packages/seo-core/
├─ package.json
├─ tsconfig.json
├─ tsup.config.ts
├─ vitest.config.ts
├─ README.md
├─ src/
│  ├─ index.ts
│  ├─ metadata/
│  │  ├─ index.ts
│  │  ├─ page-metadata.ts
│  │  ├─ defaults.ts
│  │  ├─ overlay.ts
│  │  ├─ open-graph.ts
│  │  ├─ twitter.ts
│  │  ├─ images.ts
│  │  └─ validation.ts
│  ├─ canonicals/
│  │  ├─ index.ts
│  │  ├─ build-canonical-url.ts
│  │  ├─ normalize-path.ts
│  │  ├─ query-policy.ts
│  │  ├─ pagination.ts
│  │  ├─ alternate-urls.ts
│  │  └─ validation.ts
│  ├─ sitemap/
│  │  ├─ index.ts
│  │  ├─ sitemap-entry.ts
│  │  ├─ build-sitemap.ts
│  │  ├─ partition.ts
│  │  ├─ lastmod.ts
│  │  ├─ changefreq.ts
│  │  └─ validation.ts
│  ├─ robots/
│  │  ├─ index.ts
│  │  ├─ directives.ts
│  │  ├─ noindex-policy.ts
│  │  ├─ demo-policy.ts
│  │  ├─ policy-matrix.ts
│  │  └─ validation.ts
│  ├─ schema/
│  │  ├─ index.ts
│  │  ├─ organization.ts
│  │  ├─ website.ts
│  │  ├─ breadcrumb.ts
│  │  ├─ article.ts
│  │  ├─ local-business.ts
│  │  ├─ scope.ts
│  │  └─ graph.ts
│  ├─ config/
│  │  ├─ index.ts
│  │  ├─ seo-config.ts
│  │  ├─ tenant-config.ts
│  │  ├─ domain-config.ts
│  │  ├─ environment-policy.ts
│  │  └─ validation.ts
│  ├─ routing/
│  │  ├─ index.ts
│  │  ├─ route-seo.ts
│  │  ├─ path-policy.ts
│  │  ├─ slug-policy.ts
│  │  └─ visibility.ts
│  ├─ resolution/
│  │  ├─ index.ts
│  │  ├─ inputs.ts
│  │  ├─ precedence.ts
│  │  ├─ reasons.ts
│  │  ├─ resolve-seo.ts
│  │  ├─ resolve-canonical.ts
│  │  ├─ resolve-robots.ts
│  │  ├─ resolve-sitemap-entry.ts
│  │  └─ resolve-schema.ts
│  ├─ types/
│  │  ├─ metadata.ts
│  │  ├─ canonical.ts
│  │  ├─ sitemap.ts
│  │  ├─ robots.ts
│  │  ├─ schema.ts
│  │  ├─ config.ts
│  │  └─ resolution.ts
│  ├─ internal/
│  │  ├─ constants.ts
│  │  ├─ url.ts
│  │  └─ guards.ts
│  └─ testing/
│     ├─ fixtures.ts
│     ├─ metadata-builders.ts
│     ├─ sitemap-builders.ts
│     └─ resolution-builders.ts
└─ test/
   ├─ setup.ts
   ├─ metadata/
   │  ├─ defaults.test.ts
   │  ├─ overlay.test.ts
   │  ├─ open-graph.test.ts
   │  ├─ twitter.test.ts
   │  ├─ images.test.ts
   │  └─ validation.test.ts
   ├─ canonicals/
   │  ├─ normalize-path.test.ts
   │  ├─ query-policy.test.ts
   │  ├─ build-canonical-url.test.ts
   │  ├─ pagination.test.ts
   │  ├─ alternate-urls.test.ts
   │  └─ validation.test.ts
   ├─ sitemap/
   │  ├─ sitemap-entry.test.ts
   │  ├─ build-sitemap.test.ts
   │  ├─ partition.test.ts
   │  ├─ lastmod.test.ts
   │  ├─ changefreq.test.ts
   │  └─ validation.test.ts
   ├─ robots/
   │  ├─ directives.test.ts
   │  ├─ noindex-policy.test.ts
   │  ├─ demo-policy.test.ts
   │  ├─ policy-matrix.test.ts
   │  └─ validation.test.ts
   ├─ schema/
   │  ├─ website.test.ts
   │  ├─ organization.test.ts
   │  ├─ breadcrumb.test.ts
   │  ├─ article.test.ts
   │  ├─ local-business.test.ts
   │  ├─ scope.test.ts
   │  └─ graph.test.ts
   ├─ config/
   │  ├─ environment-policy.test.ts
   │  └─ validation.test.ts
   ├─ routing/
   │  ├─ path-policy.test.ts
   │  ├─ slug-policy.test.ts
   │  └─ visibility.test.ts
   └─ resolution/
      ├─ precedence.test.ts
      ├─ resolve-canonical.test.ts
      ├─ resolve-robots.test.ts
      ├─ resolve-sitemap-entry.test.ts
      ├─ resolve-schema.test.ts
      └─ resolve-seo.test.ts


⸻

Root files

package.json

This is a compiled-first runtime package.

Responsibilities
	•	declare the package identity
	•	expose only controlled public entrypoints
	•	define scripts
	•	declare module format
	•	declare side-effect-free behavior
	•	prevent deep-import dependency drift

Required characteristics
	•	"name": "@repo/seo-core"
	•	"type": "module"
	•	"sideEffects": false
	•	explicit exports
	•	types pointed at build artifacts
	•	no Astro/Next/browser dependencies
	•	only small utility/validation dependencies if needed

Required scripts
	•	build
	•	typecheck
	•	test
	•	test:watch
	•	lint
	•	clean

Exports map shape

The public API should expose controlled subpaths only.

{
  ".": "./dist/index.js",
  "./metadata": "./dist/metadata/index.js",
  "./canonicals": "./dist/canonicals/index.js",
  "./sitemap": "./dist/sitemap/index.js",
  "./robots": "./dist/robots/index.js",
  "./schema": "./dist/schema/index.js",
  "./config": "./dist/config/index.js",
  "./routing": "./dist/routing/index.js",
  "./resolution": "./dist/resolution/index.js"
}

Forbidden pattern

No imports like:

import { buildCanonicalUrl } from "@repo/seo-core/src/canonicals/build-canonical-url";

That breaks package boundaries immediately.

⸻

tsconfig.json

Responsibilities
	•	define package-local strict TS behavior
	•	support declaration output
	•	avoid framework leakage
	•	keep the package safe to consume from any server-side environment

Required characteristics
	•	strict mode on
	•	declaration support compatible with tsup
	•	no framework-specific TS assumptions
	•	no DOM-only dependency assumptions in core logic
	•	consistent module resolution with repo standards

⸻

tsup.config.ts

Responsibilities
	•	compile the package
	•	emit ESM build artifacts
	•	emit declarations
	•	build subpath entrypoints cleanly

Required characteristics
	•	ESM output
	•	sourcemaps
	•	declarations
	•	clean builds
	•	no framework plugins
	•	no hidden bundling tricks that collapse boundaries

⸻

vitest.config.ts

Responsibilities
	•	package-local test configuration
	•	node environment
	•	shared setup file usage
	•	stable path resolution

Required characteristics
	•	node test environment
	•	test/setup.ts loaded
	•	package-local coverage only if desired by repo policy

⸻

README.md

This README must be highly intentional.

Required sections
	•	purpose
	•	role in monorepo
	•	relationship to @repo/contracts, @repo/seo-next, and @repo/seo-astro
	•	public API
	•	canonical policy
	•	query parameter policy
	•	sitemap policy
	•	robots/noindex policy
	•	demo/preview policy
	•	structured-data scope rules
	•	precedence order
	•	allowed imports
	•	forbidden patterns
	•	extension rules
	•	test philosophy

This should be sufficient for an agentic coder to work in the package without guessing.

⸻

src/index.ts

Role

Root public entrypoint.

What it should export

Only the most important public surface:
	•	main resolution entrypoints
	•	high-value normalized result types
	•	config helpers/types that belong at the root
	•	selected helpers that are broadly useful

What it should not do

It should not flatten every internal helper into one giant namespace.

Consumers should still intentionally choose subpath entrypoints when working within one specific area.

⸻

src/metadata/

This folder owns shared metadata modeling, defaults, overlays, and validation.

metadata/index.ts

Role

Public export surface for metadata-related helpers and types.

Should export
	•	normalized metadata types
	•	default/overlay builders
	•	OG/Twitter/image helpers
	•	metadata validators

⸻

metadata/page-metadata.ts

Role

Defines the normalized metadata model used internally and publicly by seo-core.

Must cover
	•	title
	•	description
	•	canonical URL
	•	robots directives
	•	Open Graph data
	•	Twitter card data
	•	image metadata
	•	page type hints
	•	optional schema hints

Design rule

This is not a framework-specific metadata shape. It is the core resolved metadata model.

⸻

metadata/defaults.ts

Role

Defines metadata default rules.

Must own
	•	default site name handling
	•	title template or suffix behavior
	•	description fallback behavior
	•	default OG image behavior
	•	default Twitter card behavior
	•	omit-empty normalization rules

Hard rule

No app duplicates metadata defaults that belong here.

⸻

metadata/overlay.ts

Role

Defines how metadata layers merge.

This is one of the highest-value files in the package.

Official precedence order
	1.	environment policy
	2.	domain policy
	3.	tenant policy
	4.	route policy
	5.	content overlay
	6.	final page override

Safety constraint

Lower layers may enrich content fields.

They may not override higher-layer safety rules such as:
	•	forced preview/demo/staging noindex
	•	canonical host/origin policy
	•	private-route exclusion
	•	query-param restrictions
	•	sitemap exclusion rules

Examples of allowed overlays
	•	page title refinement
	•	page description override
	•	OG image override
	•	article headline/summary
	•	breadcrumb labels

Examples of forbidden lower-level overrides
	•	changing canonical host from primary domain to alias
	•	making preview routes indexable
	•	making filtered query URLs sitemap-eligible
	•	making private routes public

⸻

metadata/open-graph.ts

Role

Normalizes Open Graph output from the core metadata model.

Responsibilities
	•	derive OG title/description from normalized metadata
	•	align OG URL with resolved canonical
	•	normalize OG type
	•	normalize/resolve images
	•	enforce absolute image URLs in normalized output or validate them before adapter consumption

Rule

No separate app-local OG fallback chains.

⸻

metadata/twitter.ts

Role

Derives Twitter/X card output from normalized metadata.

Responsibilities
	•	derive from shared metadata fields
	•	choose card defaults centrally
	•	share image/title/description fallback logic

Rule

Keep it lightweight and derived. Do not create a second metadata system here.

⸻

metadata/images.ts

Role

Normalizes SEO image data.

Responsibilities
	•	resolve absolute image URLs
	•	validate URL shape
	•	normalize width/height when present
	•	normalize alt text
	•	select/fall back to default image when appropriate

Rule

This file centralizes image normalization so apps do not each invent their own rules.

⸻

metadata/validation.ts

Role

Validates metadata inputs and normalized metadata outputs.

Must check
	•	missing or empty title handling
	•	description invalidity
	•	malformed canonical URLs
	•	invalid OG/Twitter image URLs
	•	null/undefined merge failures
	•	invalid canonical/robots combinations

⸻

src/canonicals/

This folder owns canonical URL policy.

It is central to the repo’s SEO baseline.

canonicals/index.ts

Role

Public export surface for canonical-related helpers and types.

⸻

canonicals/build-canonical-url.ts

Role

Primary canonical builder.

Inputs should include
	•	canonical origin/domain
	•	normalized path
	•	visibility state
	•	query-policy outcome
	•	pagination state
	•	route descriptor
	•	tenant/domain policy

Outputs should include
	•	absolute canonical URL
	•	alternate URL metadata if applicable
	•	reason codes

Rule

Canonicals are domain-aware and deterministic by default.

⸻

canonicals/normalize-path.ts

Role

Central path normalization.

Must handle
	•	one leading slash
	•	duplicate slash cleanup
	•	fragment stripping
	•	trailing slash policy
	•	stable encoding rules
	•	reserved path cleanup as needed

Rule

Path normalization must not be duplicated across apps.

⸻

canonicals/query-policy.ts

Role

Central query parameter SEO policy.

This file is mandatory and critical.

It classifies params into buckets
	•	keepInCanonical
	•	stripFromCanonical
	•	forceNoindex
	•	excludeFromSitemap

Default rules

Tracking params:
	•	stripped from canonical
	•	excluded from sitemap

Filtering/sorting/search-state params:
	•	stripped from canonical
	•	typically force noindex
	•	excluded from sitemap unless explicitly approved

Pagination params:
	•	page may be preserved only on routes that support pagination
	•	page state should self-canonicalize

Unknown params:
	•	treated conservatively
	•	not canonical
	•	not sitemap-eligible
	•	may trigger noindex depending on route policy

Why this matters

Query params are where SEO drift happens fastest. This file prevents app-level improvisation.

⸻

canonicals/pagination.ts

Role

Defines canonical behavior for paginated routes.

Hard rules
	•	each page gets its own canonical
	•	page 2+ do not canonicalize back to page 1
	•	fragments are never used for pagination
	•	no rel=prev/next assumptions belong here
	•	pagination must be deterministic from route descriptor + query-policy outcome

⸻

canonicals/alternate-urls.ts

Role

Handles alternate URL relationships.

v1 scope
	•	primary vs alias canonical domains
	•	future extensibility point for localized alternates

Non-goal in v1

This file does not imply full hreflang rollout.

Localized alternate support is deferred until there is a real multilingual requirement and complete reciprocal alternate sets can be produced.

⸻

canonicals/validation.ts

Role

Validates canonical outcomes.

Must check
	•	absolute URL output
	•	valid origin
	•	no fragments
	•	disallowed params stripped
	•	pagination correctness
	•	alternate-set sanity if alternates exist

⸻

src/sitemap/

This folder owns sitemap inclusion and entry rules.

sitemap/index.ts

Role

Public export surface for sitemap helpers and types.

⸻

sitemap/sitemap-entry.ts

Role

Defines the normalized sitemap entry model.

Fields should include
	•	url
	•	lastModified?
	•	changeFrequency?
	•	priority?
	•	include
	•	reason

Policy
	•	canonical URLs only
	•	lastModified optional and trustworthy only
	•	changeFrequency optional compatibility field
	•	priority optional compatibility field

⸻

sitemap/build-sitemap.ts

Role

Builds normalized sitemap outputs.

Outputs may include
	•	entry arrays
	•	partitioned sitemap models
	•	sitemap-index models
	•	XML-ready normalized data structures

Rule

No framework response objects here.

⸻

sitemap/partition.ts

Role

Partitions large sitemap sets.

Responsibilities
	•	stable chunking
	•	stable chunk names
	•	sitemap index references
	•	predictable partition behavior

Importance

Useful for multi-tenant or content-heavy surfaces.

⸻

sitemap/lastmod.ts

Role

Defines when lastmod may be emitted.

Hard rules
	•	emit only when source data is trustworthy
	•	emit only when it represents a meaningful change
	•	do not guess
	•	do not use noisy timestamps that do not reflect true page/content change

Examples of acceptable sources
	•	content update timestamp from a trusted source
	•	publish/update timestamp from controlled content files
	•	domain/tenant source-of-truth content metadata

Examples of unacceptable sources
	•	random file touch times
	•	preview deploy times
	•	guessed “today” timestamps
	•	cache refresh times

⸻

sitemap/changefreq.ts

Role

Compatibility helper for changefreq.

Policy
	•	optional
	•	omitted by default
	•	not relied on as a meaningful signal
	•	never guessed with fake precision

⸻

sitemap/validation.ts

Role

Validates sitemap entries and sitemap builds.

Must check
	•	canonical absolute URLs only
	•	excluded/noindex/private URLs not mistakenly included
	•	lastmod sanity
	•	partition/index consistency
	•	no duplicate canonical URLs

⸻

src/robots/

This folder owns crawl/index policy.

robots/index.ts

Role

Public export surface for robots/noindex helpers and types.

⸻

robots/directives.ts

Role

Defines normalized robots directive structures.

Must support
	•	meta robots style modeling
	•	header-style modeling for adapter serialization later

Core directives in v1
	•	index,follow
	•	noindex,follow
	•	noindex,nofollow

Optional extensions

Only add when there is a real use case:
	•	max-snippet
	•	max-image-preview
	•	noarchive

⸻

robots/noindex-policy.ts

Role

Core noindex decision engine.

Inputs should include
	•	environment
	•	route visibility
	•	route descriptor
	•	query-policy outcome
	•	domain policy
	•	tenant policy

Outputs should include
	•	resolved robots directives
	•	sitemap eligibility signal
	•	reason code(s)

⸻

robots/demo-policy.ts

Role

Encodes the explicit repo rule for public demos and preview-like surfaces.

Hard policy

Public demo/preview/example pages should generally:
	•	remain crawlable
	•	resolve to noindex
	•	not rely on robots.txt as the primary suppression mechanism

Why this exists

This is one of the easiest rules for agents to get wrong. A dedicated file makes it explicit.

⸻

robots/policy-matrix.ts

Role

Defines the human-readable environment/surface decision matrix.

Required scenarios
	•	production + public + indexable
	•	production + public + explicit noindex route
	•	preview + public
	•	staging + public
	•	demo + public
	•	development/local
	•	private/gated
	•	internal-only
	•	unknown/misconfigured

Importance

This should be the clearest single reference file for broad robots/indexing behavior.

⸻

robots/validation.ts

Role

Validates robots outcomes.

Must check
	•	preview/demo routes are not accidentally indexable
	•	private routes do not resolve to public indexable
	•	noindex sitemap contradictions
	•	impossible directive combinations rejected

⸻

src/schema/

This folder owns structured-data object builders and schema scope rules.

schema/index.ts

Role

Public export surface for schema builders and types.

⸻

schema/organization.ts

Role

Builds Organization JSON-LD.

Intended scope
	•	firm home page
	•	firm about page
	•	tenant brand/about page where appropriate

Rule

Not emitted site-wide by default.

⸻

schema/website.ts

Role

Builds WebSite JSON-LD.

Hard rule

Home-page only.

Why

This repo supports multiple domains/subdomains. WebSite should represent the site identity for that domain, not arbitrary subdirectory sections.

⸻

schema/breadcrumb.ts

Role

Builds breadcrumb JSON-LD.

Use only when

The page has a real breadcrumb hierarchy.

Rule

Do not emit breadcrumb schema for routes that do not actually expose meaningful breadcrumb semantics.

⸻

schema/article.ts

Role

Builds article/news/blog schema.

Use only when

The route truly represents an article-like content object.

Rule

Do not use this on generic service or landing pages.

⸻

schema/local-business.ts

Role

Builds local business schema.

Use only when

The tenant/site truly represents a local business presence.

Rule

Do not automatically apply this to every client site.

⸻

schema/scope.ts

Role

Determines whether a schema type is eligible for the current page.

This is a mandatory anti-drift file.

It prevents
	•	WebSite schema on every route
	•	Organization schema everywhere by default
	•	article schema on non-article routes
	•	local business schema on non-business pages
	•	search-facing schema on intentionally noindex demo/preview pages by default

Repo policy

Schema that exists to support search eligibility should generally be suppressed on intentionally noindex demo/preview pages.

⸻

schema/graph.ts

Role

Combines applicable schema objects into one JSON-LD graph payload.

Rules
	•	JSON-LD only
	•	stable order
	•	dedupe nodes
	•	include only in-scope nodes
	•	no framework serialization here

⸻

src/config/

This folder owns SEO configuration inputs and policy normalization.

config/index.ts

Role

Public export surface for SEO config helpers and types.

⸻

config/seo-config.ts

Role

Defines root SEO config shape for a surface.

Should include
	•	site identity defaults
	•	metadata defaults
	•	canonical defaults
	•	robots defaults
	•	sitemap defaults
	•	schema defaults
	•	query param policy defaults

Importance

This is the central config contract inside the package.

⸻

config/tenant-config.ts

Role

Defines tenant-level SEO config.

This is a critical file because tenant SEO must not be hardcoded in apps.

Must cover
	•	tenant/brand display name
	•	primary canonical domain
	•	alias domains
	•	default OG image
	•	title templates or suffix rules
	•	indexing mode defaults
	•	schema defaults
	•	optional business identity data
	•	optional demo/public-example flags

Design note

Because early sites are code/content-file first and no CMS is chosen yet, this config must work perfectly with static/content-file sourced inputs.

⸻

config/domain-config.ts

Role

Defines domain-level SEO behavior.

Must cover
	•	origin
	•	primary vs alias domain role
	•	environment classification for that domain
	•	canonical policy
	•	site name
	•	robots mode
	•	sitemap mode
	•	alternate-domain relationships

Importance

Canonical truth is domain-specific in this repo.

⸻

config/environment-policy.ts

Role

Defines environment SEO policy.

This is one of the most important files in the package.

Required environment classes
	•	production
	•	preview
	•	staging
	•	demo
	•	development
	•	unknown

Must decide
	•	default indexability
	•	default sitemap eligibility
	•	default schema eligibility
	•	default canonical confidence rules

Rule

Environment policy is highest precedence.

⸻

config/validation.ts

Role

Validates SEO config inputs.

Must check
	•	invalid/malformed canonical origins
	•	duplicate primary domains
	•	impossible environment/domain combos
	•	missing required site identity data
	•	invalid alias/primary relationships

⸻

src/routing/

This folder ties route semantics to SEO policy without importing any framework router.

routing/index.ts

Role

Public export surface for route SEO helpers and types.

⸻

routing/route-seo.ts

Role

Defines route-level SEO descriptors.

Must cover
	•	route kind
	•	visibility intent
	•	sitemap eligibility intent
	•	pagination support
	•	query-policy overrides
	•	content-type hints
	•	schema-scope hints

Rule

This file describes SEO semantics, not route discovery.

⸻

routing/path-policy.ts

Role

Defines path-level SEO treatment rules.

Must cover
	•	reserved segments
	•	excluded/internal paths
	•	normalization edge cases
	•	path-level canonical restrictions
	•	hidden route treatment

⸻

routing/slug-policy.ts

Role

Defines slug normalization and validation.

Must cover
	•	empty slug handling
	•	stable cleanup
	•	encoding expectations
	•	rejection of bad slug patterns
	•	normalization of human-readable slug shapes

⸻

routing/visibility.ts

Role

Defines normalized visibility/indexability vocabulary.

Canonical states
	•	publicIndexable
	•	publicNoindex
	•	publicExcluded
	•	privateGated
	•	internalOnly

Importance

This vocabulary should be reused across the package to avoid ambiguous booleans.

⸻

src/resolution/

This folder is the operational heart of the package.

resolution/index.ts

Role

Public export surface for resolution helpers and types.

⸻

resolution/inputs.ts

Role

Defines normalized resolution input bundle.

Canonical input model

type ResolveSeoInput = {
  environment: SeoEnvironment
  domain: DomainSeoConfig
  tenant: TenantSeoConfig
  route: RouteSeoDescriptor
  path: string
  query?: URLSearchParams | Record<string, string | string[] | undefined>
  contentOverlay?: SeoContentOverlay
  pageOverride?: SeoPageOverride
}

Rule

Resolution should take normalized explicit inputs, not hidden framework context.

⸻

resolution/precedence.ts

Role

Defines and enforces the official merge order.

This file is mandatory.

Official precedence
	1.	environment policy
	2.	domain policy
	3.	tenant policy
	4.	route policy
	5.	content overlay
	6.	final page override

Safety rule

Lower-precedence layers may not violate higher-precedence safety constraints.

Importance

This is one of the three most important files in the package.

⸻

resolution/reasons.ts

Role

Defines machine-readable decision reasons.

Example reason codes
	•	preview_noindex
	•	demo_noindex
	•	staging_noindex
	•	private_route_excluded
	•	filtered_query_noindex
	•	tracking_params_stripped
	•	page_param_allowed
	•	domain_alias_noncanonical
	•	website_schema_homepage_only
	•	schema_suppressed_on_noindex_surface
	•	lastmod_untrusted_omitted

Why this exists

Reason codes make debugging, testing, logging, and adapter behavior much easier.

⸻

resolution/resolve-canonical.ts

Role

Resolves canonical output from normalized inputs.

Responsibilities
	•	normalize path
	•	apply query policy
	•	apply pagination policy
	•	apply domain/alias policy
	•	emit reasons

⸻

resolution/resolve-robots.ts

Role

Resolves robots/indexability from normalized inputs.

Responsibilities
	•	apply environment policy
	•	apply visibility rules
	•	apply route/query policy
	•	emit reasons
	•	determine if sitemap eligibility should be blocked

⸻

resolution/resolve-sitemap-entry.ts

Role

Resolves final sitemap entry or exclusion.

Responsibilities
	•	ensure canonical URL availability
	•	ensure robots policy permits inclusion
	•	enforce canonical-only inclusion
	•	apply lastmod policy
	•	emit reason for exclusion or inclusion

⸻

resolution/resolve-schema.ts

Role

Resolves schema eligibility and builds final graph.

Responsibilities
	•	apply scope rules
	•	suppress inappropriate schema
	•	build graph in stable order
	•	emit reasons

⸻

resolution/resolve-seo.ts

Role

Primary package entrypoint and highest-value function.

Canonical signature

function resolveSeo(input: ResolveSeoInput): ResolvedSeo

ResolvedSeo should include
	•	normalized metadata
	•	canonical result
	•	robots result
	•	sitemap result or null
	•	schema graph result or null
	•	decision reasons

Importance

This is the default API agents should use first.

⸻

src/types/

This folder holds package-local public types.

types/metadata.ts

Role

Resolved metadata result types.

Should include
	•	normalized metadata types
	•	OG/Twitter/image result types

⸻

types/canonical.ts

Role

Canonical result types.

Should include
	•	canonical URL result
	•	alternate URL result
	•	query-policy result types
	•	pagination result types

⸻

types/sitemap.ts

Role

Sitemap result types.

Should include
	•	sitemap entry type
	•	sitemap partition type
	•	sitemap build result type

⸻

types/robots.ts

Role

Robots result types.

Should include
	•	directives model
	•	noindex policy result
	•	robots result type

⸻

types/schema.ts

Role

Schema result types.

Should include
	•	schema node types
	•	graph types
	•	schema-scope result types

⸻

types/config.ts

Role

Public config result/helper types.

Should include
	•	normalized config types
	•	env/domain/tenant helper types

⸻

types/resolution.ts

Role

Main resolution types.

Should include
	•	ResolveSeoInput
	•	ResolvedSeo
	•	SeoDecisionReason

⸻

src/internal/

Private implementation helpers only.

internal/constants.ts

Role

Internal constants and static lookup sets.

Could include
	•	default tracking params
	•	reserved path names
	•	default image preview rules
	•	internal enum-like arrays

Rule

Do not make this a second public API.

⸻

internal/url.ts

Role

Small internal URL helpers.

Could include
	•	origin joining
	•	query cleanup helpers
	•	URL safety helpers

⸻

internal/guards.ts

Role

Tiny internal type/value guards.

Rule

Keep boring and private.

⸻

src/testing/

Reusable test helpers for this package only.

testing/fixtures.ts

Role

Canonical package test fixtures.

Must include fixture scenarios for
	•	production public page
	•	preview page
	•	staging page
	•	demo/public-example page
	•	private/gated page
	•	paginated collection page
	•	filtered collection page
	•	article page
	•	alias-domain page

⸻

testing/metadata-builders.ts

Role

Metadata test factories.

Purpose

Reduce repetitive setup in metadata tests.

⸻

testing/sitemap-builders.ts

Role

Sitemap entry/build factories.

Purpose

Make sitemap tests readable and deterministic.

⸻

testing/resolution-builders.ts

Role

End-to-end resolution fixture builders.

Purpose

Support clean resolveSeo() integration-style tests.

⸻

test/

The test/ directory mirrors policy areas, not frameworks.

test/setup.ts

Role

Shared test setup.

Rule

No browser/framework bootstrapping.

⸻

test/metadata/defaults.test.ts

Tests metadata defaults.

test/metadata/overlay.test.ts

Tests precedence-safe metadata overlay behavior.

test/metadata/open-graph.test.ts

Tests OG normalization and canonical alignment.

test/metadata/twitter.test.ts

Tests Twitter derivation behavior.

test/metadata/images.test.ts

Tests image normalization and validation.

test/metadata/validation.test.ts

Tests invalid metadata rejection.

⸻

test/canonicals/normalize-path.test.ts

Tests path normalization.

test/canonicals/query-policy.test.ts

Tests parameter bucketing and route-specific query behavior.

test/canonicals/build-canonical-url.test.ts

Tests canonical building across domains, aliases, and path/query states.

test/canonicals/pagination.test.ts

Tests self-canonical pagination behavior.

test/canonicals/alternate-urls.test.ts

Tests alias/alternate relationship behavior.

test/canonicals/validation.test.ts

Tests invalid canonical outcomes.

⸻

test/sitemap/sitemap-entry.test.ts

Tests normalized sitemap entry behavior.

test/sitemap/build-sitemap.test.ts

Tests full sitemap build behavior.

test/sitemap/partition.test.ts

Tests partitioning and stable chunk generation.

test/sitemap/lastmod.test.ts

Tests trustworthy lastmod behavior.

test/sitemap/changefreq.test.ts

Tests compatibility-only changefreq behavior.

test/sitemap/validation.test.ts

Tests invalid inclusion cases.

⸻

test/robots/directives.test.ts

Tests directive encoding/modeling.

test/robots/noindex-policy.test.ts

Tests core noindex resolution.

test/robots/demo-policy.test.ts

Tests public demo/preview crawlable-noindex behavior.

test/robots/policy-matrix.test.ts

Tests environment/surface matrix outcomes.

test/robots/validation.test.ts

Tests contradictions and invalid combinations.

⸻

test/schema/website.test.ts

Tests home-page-only WebSite behavior.

test/schema/organization.test.ts

Tests Organization scope rules.

test/schema/breadcrumb.test.ts

Tests breadcrumb graph behavior.

test/schema/article.test.ts

Tests article-only applicability.

test/schema/local-business.test.ts

Tests local business applicability.

test/schema/scope.test.ts

Tests schema gating and noindex suppression rules.

test/schema/graph.test.ts

Tests graph assembly, order, and dedupe.

⸻

test/config/environment-policy.test.ts

Tests env-specific defaults and restrictions.

test/config/validation.test.ts

Tests invalid config rejection.

⸻

test/routing/path-policy.test.ts

Tests path-level SEO rules.

test/routing/slug-policy.test.ts

Tests slug normalization/validation.

test/routing/visibility.test.ts

Tests visibility classification.

⸻

test/resolution/precedence.test.ts

Tests official merge order and safety invariants.

test/resolution/resolve-canonical.test.ts

Tests canonical resolution end-to-end.

test/resolution/resolve-robots.test.ts

Tests robots resolution end-to-end.

test/resolution/resolve-sitemap-entry.test.ts

Tests sitemap resolution end-to-end.

test/resolution/resolve-schema.test.ts

Tests schema resolution end-to-end.

test/resolution/resolve-seo.test.ts

Tests full package behavior with real-world combined inputs.

⸻

Public API contract

The package should feel like this:
	•	@repo/seo-core → primary resolution API and key result types
	•	@repo/seo-core/metadata → metadata builders/defaults/validators
	•	@repo/seo-core/canonicals → canonical and query policy helpers
	•	@repo/seo-core/sitemap → sitemap entry/build helpers
	•	@repo/seo-core/robots → robots/noindex policy helpers
	•	@repo/seo-core/schema → structured-data builders and scope helpers
	•	@repo/seo-core/config → SEO config helpers and validators
	•	@repo/seo-core/routing → route/path/visibility policy helpers
	•	@repo/seo-core/resolution → high-level resolution APIs

⸻

Core types and signatures

These should define the package’s public mental model.

type SeoEnvironment =
  | "production"
  | "preview"
  | "staging"
  | "demo"
  | "development"
  | "unknown";

type RouteVisibility =
  | "publicIndexable"
  | "publicNoindex"
  | "publicExcluded"
  | "privateGated"
  | "internalOnly";

type QueryParamDisposition =
  | "keepInCanonical"
  | "stripFromCanonical"
  | "forceNoindex"
  | "excludeFromSitemap";

type ResolvedSeo = {
  metadata: ResolvedPageMetadata;
  canonical: ResolvedCanonical;
  robots: ResolvedRobots;
  sitemap: ResolvedSitemapEntry | null;
  schema: ResolvedSchemaGraph | null;
  reasons: readonly SeoDecisionReason[];
};

Primary public functions:

function resolveSeo(input: ResolveSeoInput): ResolvedSeo;

function buildCanonicalUrl(
  input: BuildCanonicalUrlInput,
): ResolvedCanonical;

function resolveRobots(
  input: ResolveRobotsInput,
): ResolvedRobots;

function resolveSitemapEntry(
  input: ResolveSitemapEntryInput,
): ResolvedSitemapEntry | null;

function resolveSchema(
  input: ResolveSchemaInput,
): ResolvedSchemaGraph | null;


⸻

Allowed imports

@repo/seo-core may import from:
	•	@repo/contracts
	•	small validation libraries
	•	small utility libraries
	•	standard platform-safe URL helpers

It must not import from:
	•	any app
	•	@repo/db
	•	@repo/auth
	•	@repo/ui
	•	@repo/analytics
	•	Astro packages
	•	Next packages
	•	CMS SDKs
	•	browser-only packages

⸻

Adapter expectations

@repo/seo-core is not the framework output layer.

@repo/seo-next will own
	•	mapping resolved metadata into Next Metadata API objects
	•	handling metadataBase
	•	generating Next robots.ts and sitemap.ts outputs
	•	serializing normalized robots directives for Next
	•	any Next-specific caveats around metadata resolution

@repo/seo-astro will own
	•	mapping resolved SEO into Astro layouts/components/routes
	•	using Astro-native sitemap/canonical conveniences when appropriate
	•	handling single-domain build behavior vs shared multi-tenant host behavior

Important repo-specific rule

Single-domain Astro surfaces may lean on build-time site configuration.

Shared multi-tenant hosts may not treat one global build-time site URL as per-tenant canonical truth.

That distinction is critical to this repo’s design.

⸻

What must not exist

These are explicit drift signs:

packages/seo-core/src/next/
packages/seo-core/src/astro/
packages/seo-core/src/cms/
packages/seo-core/src/client/
packages/seo-core/src/page-components/
packages/seo-core/src/blog-rendering/
packages/seo-core/src/search-console/
packages/seo-core/src/misc/

Especially misc/.

If a file does not clearly belong somewhere, the package design should be revisited instead of creating a junk drawer.

⸻

Coding rules inside this package
	•	prefer pure functions
	•	prefer explicit normalized inputs
	•	prefer return values with reason codes over silent booleans
	•	reject invalid states early
	•	keep public API surfaces narrow
	•	keep schema builders intentionally small
	•	reuse shared contract types when appropriate
	•	never let lower-precedence content override higher-precedence safety policy
	•	never infer public/indexable state from guesswork
	•	write tests for policy and resolution, not framework snapshots

⸻

Implementation order

Phase 1: skeleton and boundaries

Create:
	•	root package files
	•	exports map
	•	README
	•	config/
	•	routing/
	•	types/
	•	internal/

Goal: establish boundaries and public API.

Phase 2: core SEO policy

Create:
	•	metadata/
	•	canonicals/
	•	robots/
	•	sitemap/

Goal: encode core policy rules.

Phase 3: operational resolution

Create:
	•	resolution/
	•	full resolveSeo() flow
	•	reason codes

Goal: make the package usable end-to-end.

Phase 4: structured data

Create:
	•	schema/
	•	scope rules
	•	graph builder

Goal: add route-aware structured-data support without overbuilding.

Phase 5: validation and tests

Create:
	•	validators
	•	fixtures
	•	full test matrix
	•	README polish

Goal: make the package safe, explainable, and hard to misuse.

⸻

Definition of done

@repo/seo-core is done when:
	•	all shared SEO policy for the repo lives here
	•	resolveSeo() produces deterministic outputs
	•	canonical generation is domain-aware and tested
	•	query parameter policy is centralized and tested
	•	robots/noindex policy is centralized and tested
	•	sitemap policy is centralized and tested
	•	metadata defaults and overlays are explicit and tested
	•	schema scope is explicit and tested
	•	tenant/domain/environment SEO policy is validated and centralized
	•	no Astro/Next/CMS logic has leaked into the package
	•	the README is sufficient for agentic implementation without guesswork

⸻

Final call

This is the final source of truth for @repo/seo-core.

The three most important files in the entire package are:
	•	src/resolution/resolve-seo.ts
	•	src/resolution/precedence.ts
	•	src/canonicals/query-policy.ts

Those three files are what prevent the rest of the repo from drifting into app-local SEO improvisation.