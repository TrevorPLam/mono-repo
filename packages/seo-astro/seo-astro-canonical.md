# repo/seo-astro/seo-astro-canonical.md

Below is the reconstructed `seo-astro` canonical document, rewritten into the repo’s established house style. It is grounded on the current package map, the `seo-core` adapter boundary, the app/package boundary docs, and the repo doc-writing rules. `packages/seo-astro` is defined as the Astro SEO adapter, `seo-core` explicitly assigns Astro mapping/build behavior to it, apps own app-local SEO inputs and route-level assembly, and repo docs prefer concrete stand-alone canonical docs over chat-shaped notes.    

---

# Below is the final source of truth for `packages/seo-astro/`, published internally as `@repo/seo-astro`.

It is synchronized to the project decisions already established across this project:

* pnpm + Turborepo monorepo
* compiled-first internal runtime packages
* Astro as the primary framework for public/content-heavy surfaces
* Next.js reserved for app/product/protected surfaces
* `@repo/seo-core` as the shared framework-agnostic SEO policy layer
* `@repo/seo-next` and `@repo/seo-astro` as thin framework adapters
* per-domain canonicals and sitemaps
* public demos/previews generally crawlable + noindex rather than robots-blocked
* code/content-file-first public sites
* app-local route ownership and SEO inputs
* strict package boundaries

A few repo-specific realities lock in the package shape:

* Astro is the main SEO-critical framework for early public and client sites.
* `@repo/seo-core` owns SEO policy, not rendering.
* `@repo/seo-astro` owns Astro adaptation.
* single-domain Astro surfaces may lean on build-time site configuration
* shared multi-tenant Astro hosts may not treat one global build-time site URL as canonical truth

## 1. Canonical package decision

`packages/seo-astro` is the shared Astro SEO adapter package for the monorepo.

It owns:

* Astro-facing adaptation of resolved SEO policy
* Astro page/layout/head helpers
* Astro-specific request and page context normalization for SEO
* Astro route helpers for `robots` and sitemap outputs
* Astro-safe JSON-LD rendering
* Astro-specific validation and misuse prevention
* ergonomic APIs that make correct SEO easier on Astro apps

It does not own:

* framework-agnostic SEO policy
* canonical URL policy itself
* robots/noindex policy itself
* query parameter SEO policy
* sitemap inclusion policy
* structured-data eligibility policy
* CMS querying
* DB access
* auth/session logic
* tenant resolution
* page composition
* content fetching
* analytics
* observability
* app-specific SEO decisions
* a second metadata policy engine

This package exists to answer one question:

How do Astro apps in this repo consume shared SEO policy correctly, safely, and ergonomically without re-implementing SEO rules at the app layer?

## 2. Final architectural stance

The package is:

* adapter-only
* Astro-native
* static-first
* request-aware only when explicitly needed
* domain-aware
* safe around multi-tenant canonical edge cases
* thin above `@repo/seo-core`
* ergonomic for public-site usage

That means:

* `@repo/seo-core` decides what SEO outcome is correct.
* `@repo/seo-astro` decides how that outcome is represented in Astro.
* apps still own route trees, layouts, content, and final page assembly.
* Astro conveniences may be used when they agree with repo policy.
* Astro conveniences must not override canonical truth.

## 3. Package boundary in the monorepo

`@repo/seo-astro` sits between:

* `@repo/seo-core`, which resolves normalized SEO outcomes
* Astro apps, which own routes, layouts, content, and app-local inputs

Conceptually:

* `@repo/contracts` = stable shared shapes
* `@repo/seo-core` = normalization, policy, and resolved SEO outcomes
* `@repo/seo-astro` = Astro-facing adapter layer
* Astro apps = route ownership, page composition, content, and app-edge wiring

This package may import:

* `@repo/seo-core`
* `@repo/contracts`
* Astro packages where the adapter surface actually requires them
* small utility libraries
* safe serialization helpers

It must not import:

* any app
* `@repo/db`
* `@repo/auth`
* `@repo/ui`
* `@repo/analytics`
* `@repo/observability`
* CMS SDKs
* browser-only packages as a default path

Reason:

* apps own route and content behavior
* `seo-core` owns policy
* `seo-astro` should stay low, boring, and framework-focused

## 4. Hard rules

### 4.1 Adapter only, never a second policy brain

If the question is:

* what should the canonical be
* whether this page should be noindex
* whether a query param belongs in the canonical
* whether a route belongs in the sitemap
* whether a schema type is eligible

the answer belongs in `@repo/seo-core`, not here.

### 4.2 Static-first is the default

Most Astro public pages should use a static or build-time SEO path.

Request-aware behavior is allowed, but it must be explicit.

### 4.3 Single-domain and shared-host behavior must be distinct

This package must make the distinction obvious between:

* single-domain Astro apps
* shared-host or multi-tenant Astro apps

A shared host may not rely on one build-time `site` URL as per-tenant canonical truth.

### 4.4 Absolute canonical truth beats ambient convenience

Astro’s `site` config and related conveniences are useful, but they are not automatically canonical truth in domain-sensitive deployments.

### 4.5 JSON-LD is first-class and safe

Structured data must be emitted as JSON-LD only.

Serialization must be centralized and safe.

### 4.6 Route helpers belong here, policy does not

Astro-specific robots and sitemap route output helpers belong in this package.

But their underlying inclusion/indexability rules still come from `@repo/seo-core`.

### 4.7 No hidden tenant resolution

This package must not do:

* DB lookups
* auth checks
* tenant discovery
* CMS calls
* domain ownership logic

Apps pass in already-resolved context.

### 4.8 No deep imports

Consumers import only from public entrypoints.

### 4.9 No page-section or rendering creep

This is not a page-component package.

No route trees, layouts, blog rendering systems, or site sections belong here.

## 5. Final directory shape

```text
packages/seo-astro/
├─ package.json
├─ tsconfig.json
├─ tsup.config.ts
├─ vitest.config.ts
├─ README.md
├─ src/
│  ├─ index.ts
│  ├─ head/
│  │  ├─ index.ts
│  │  ├─ build-static-seo.ts
│  │  ├─ build-request-seo.ts
│  │  ├─ resolve-head.ts
│  │  ├─ map-title.ts
│  │  ├─ map-meta.ts
│  │  ├─ map-links.ts
│  │  ├─ map-robots.ts
│  │  └─ validation.ts
│  ├─ components/
│  │  ├─ index.ts
│  │  ├─ SeoHead.astro
│  │  ├─ JsonLd.astro
│  │  └─ CanonicalLink.astro
│  ├─ routes/
│  │  ├─ index.ts
│  │  ├─ robots.ts
│  │  ├─ sitemap.ts
│  │  └─ sitemap-index.ts
│  ├─ context/
│  │  ├─ index.ts
│  │  ├─ astro-context.ts
│  │  ├─ request-origin.ts
│  │  ├─ pathname.ts
│  │  ├─ page-context.ts
│  │  ├─ tenant-context.ts
│  │  └─ origin-strategy.ts
│  ├─ resolution/
│  │  ├─ index.ts
│  │  ├─ resolve-astro-seo.ts
│  │  ├─ resolve-astro-canonical.ts
│  │  ├─ resolve-astro-robots.ts
│  │  ├─ resolve-astro-sitemap-entry.ts
│  │  └─ resolve-astro-schema.ts
│  ├─ schema/
│  │  ├─ index.ts
│  │  ├─ render-json-ld.ts
│  │  └─ safe-json.ts
│  ├─ dev/
│  │  ├─ index.ts
│  │  └─ SeoDebug.astro
│  ├─ types/
│  │  ├─ index.ts
│  │  ├─ context.ts
│  │  ├─ head.ts
│  │  ├─ routes.ts
│  │  └─ schema.ts
│  ├─ internal/
│  │  ├─ constants.ts
│  │  ├─ errors.ts
│  │  ├─ guards.ts
│  │  └─ normalize.ts
│  └─ testing/
│     ├─ index.ts
│     ├─ fixtures.ts
│     ├─ astro-context-builders.ts
│     └─ assertions.ts
└─ test/
   ├─ setup.ts
   ├─ head/
   │  ├─ build-static-seo.test.ts
   │  ├─ build-request-seo.test.ts
   │  ├─ map-title.test.ts
   │  ├─ map-meta.test.ts
   │  ├─ map-links.test.ts
   │  └─ map-robots.test.ts
   ├─ routes/
   │  ├─ robots.test.ts
   │  ├─ sitemap.test.ts
   │  └─ sitemap-index.test.ts
   ├─ context/
   │  ├─ astro-context.test.ts
   │  ├─ request-origin.test.ts
   │  ├─ pathname.test.ts
   │  ├─ page-context.test.ts
   │  └─ tenant-context.test.ts
   ├─ resolution/
   │  ├─ resolve-astro-seo.test.ts
   │  ├─ resolve-astro-canonical.test.ts
   │  ├─ resolve-astro-robots.test.ts
   │  ├─ resolve-astro-sitemap-entry.test.ts
   │  └─ resolve-astro-schema.test.ts
   └─ schema/
      ├─ render-json-ld.test.ts
      └─ safe-json.test.ts
```

## 6. Top-level file plan

### `package.json`

Purpose: compiled runtime package manifest with strict subpath exports.

Public exports:

* `@repo/seo-astro`
* `@repo/seo-astro/head`
* `@repo/seo-astro/routes`
* `@repo/seo-astro/schema`
* `@repo/seo-astro/testing`

Not public:

* `context`
* `resolution`
* `types`
* `internal`
* `src/*`

Rules:

* ESM only
* declaration output enabled
* explicit export map
* no deep imports
* side-effect behavior should stay conservative and truthful
* no app/framework drift hidden in package metadata

Dependencies should remain conceptually narrow:

* runtime deps: `@repo/seo-core`, Astro-facing helpers, tiny utility libs
* dev deps: TypeScript, tsup, Vitest
* no infra/business package dependencies

### `tsconfig.json`

Purpose: strict, compiled-first TypeScript config.

Rules:

* strict mode
* declaration-friendly
* no app path aliases
* no ambient browser assumptions across server-safe code
* Astro-specific needs handled intentionally, not loosely

### `tsup.config.ts`

Purpose: build the package as a compiled runtime adapter.

Rules:

* ESM output
* `.d.ts` generation
* subpath-aware entrypoints
* avoid flattening the whole package into one giant bundle
* keep adapter boundaries visible

### `vitest.config.ts`

Purpose: per-package test config.

Rules:

* node environment by default
* targeted Astro/component testing only where required
* `test/setup.ts` loaded once
* no live network calls
* use fixtures and adapter-specific builders

### `README.md`

Purpose: canonical local package guide for maintainers and consumers.

Required sections:

* purpose
* package boundary
* relationship to `@repo/seo-core`
* static vs request-aware usage
* single-domain vs shared-host behavior
* public exports
* canonical/origin rules
* sitemap/robots route helpers
* JSON-LD usage
* forbidden patterns
* testing philosophy

## 7. Root export plan

### `src/index.ts`

Purpose: conservative root export.

Should export only the safest common surfaces, such as:

* `buildStaticSeo`
* `buildRequestSeo`
* `SeoHead`
* `buildRobotsRoute`
* `buildSitemapRoute`
* `JsonLd`

Should not flatten the whole package.

The root should keep consumers aware of what they actually need:

* head builder
* route helper
* JSON-LD renderer
* testing helper

## 8. `src/head/`

This folder owns Astro head adaptation.

### `src/head/index.ts`

Public entrypoint for head-related helpers.

### `src/head/build-static-seo.ts`

Purpose: default builder for static or build-time-known Astro pages.

Use when:

* origin is explicit and stable
* the app is single-domain
* the page does not depend on runtime host truth
* the page can safely rely on build-time SEO input

This should be the default path.

### `src/head/build-request-seo.ts`

Purpose: request-aware builder for host-sensitive or tenant-sensitive Astro pages.

Use when:

* canonical origin depends on the incoming request
* the surface is shared-host or multi-tenant
* per-request domain truth matters

This should be explicit at the callsite.

### `src/head/resolve-head.ts`

Purpose: internal bridge from Astro-facing input to resolved head output.

Responsibilities:

* normalize adapter inputs
* invoke `resolve-astro-seo`
* return mapped head-ready output

### `src/head/map-title.ts`

Purpose: centralized title mapping.

Responsibilities:

* normalize title composition
* support title-template behavior where appropriate
* prevent app-local title drift

### `src/head/map-meta.ts`

Purpose: map resolved SEO metadata into Astro meta-tag output.

Responsibilities:

* description
* OG/Twitter tags
* metadata fallbacks already resolved upstream

### `src/head/map-links.ts`

Purpose: map canonical and related links.

Responsibilities:

* canonical tag output
* alternate links when appropriate
* absolute URL discipline

### `src/head/map-robots.ts`

Purpose: map resolved robots output into Astro meta output.

Responsibilities:

* serialize index/follow rules correctly
* avoid app-local robots string improvisation

### `src/head/validation.ts`

Purpose: fail fast on bad adapter input or invalid mapped output.

Must catch:

* missing origin when required
* malformed canonical URLs
* invalid static/request mode usage
* impossible head output states

## 9. `src/components/`

This folder owns Astro-native output components.

### `src/components/index.ts`

Selective export surface for stable components.

### `src/components/SeoHead.astro`

Purpose: primary Astro component for rendering resolved SEO head output.

Responsibilities:

* title
* meta tags
* canonical links
* robots meta
* optional structured data inclusion

This should be the main ergonomic surface for ordinary Astro pages and layouts.

### `src/components/JsonLd.astro`

Purpose: safe JSON-LD output component.

Responsibilities:

* emit `<script type="application/ld+json">`
* use centralized safe serialization
* avoid ad hoc inline JSON string hacks

### `src/components/CanonicalLink.astro`

Purpose: thin canonical link primitive for low-level cases.

Rule:

* keep it simple
* do not encourage bypassing the main SEO flow

## 10. `src/routes/`

This folder owns Astro route/output helpers.

### `src/routes/index.ts`

Public route-helper entrypoint.

### `src/routes/robots.ts`

Purpose: build Astro route output for robots-related behavior.

Responsibilities:

* adapt resolved crawl policy into route output
* keep crawl directives aligned with shared policy
* avoid inventing index policy locally

### `src/routes/sitemap.ts`

Purpose: build Astro sitemap output.

Responsibilities:

* convert resolved sitemap entries into route output
* preserve canonical-only discipline
* include trustworthy `lastmod` only

### `src/routes/sitemap-index.ts`

Purpose: build sitemap index output when partitioned sitemaps are needed.

Responsibilities:

* stable index generation
* stable partition references
* support larger or multi-tenant surfaces

## 11. `src/context/`

This folder owns Astro context normalization.

### `src/context/index.ts`

Selective exports for public context helpers and types.

### `src/context/astro-context.ts`

Purpose: normalize Astro page or request context for SEO usage.

Responsibilities:

* unify Astro-facing inputs
* keep Astro-specific shape handling out of app code

### `src/context/request-origin.ts`

Purpose: normalize request-derived origin.

Responsibilities:

* parse origin safely
* normalize absolute URL origin
* reject invalid inputs

This file must not do tenant discovery.

### `src/context/pathname.ts`

Purpose: centralized pathname normalization.

Responsibilities:

* one leading slash
* fragment stripping
* duplicate slash cleanup
* stable trailing slash policy

### `src/context/page-context.ts`

Purpose: normalize app-provided page context.

Example concerns:

* page type
* route visibility hints
* preview-like surface flags
* pagination hints

### `src/context/tenant-context.ts`

Purpose: adapt already-resolved tenant or domain context into the form expected by the adapter.

Rule:

* transformation only
* no lookups

### `src/context/origin-strategy.ts`

Purpose: define explicit public origin strategy types.

Final strategies:

* `explicitOrigin`
* `requestDerivedOrigin`

This file makes the single-domain vs shared-host distinction part of the package API.

## 12. `src/resolution/`

This folder composes Astro-normalized context with `@repo/seo-core`.

### `src/resolution/index.ts`

Selective export surface.

### `src/resolution/resolve-astro-seo.ts`

Purpose: main internal resolver for Astro adaptation.

Responsibilities:

* accept normalized Astro context
* call `@repo/seo-core`
* return adapter-ready resolved SEO

### `src/resolution/resolve-astro-canonical.ts`

Purpose: focused canonical resolution helper for Astro consumers.

### `src/resolution/resolve-astro-robots.ts`

Purpose: focused robots helper.

### `src/resolution/resolve-astro-sitemap-entry.ts`

Purpose: adapt resolved sitemap entities into route-helper-friendly form.

### `src/resolution/resolve-astro-schema.ts`

Purpose: produce resolved schema output for Astro rendering.

Rule:

* schema eligibility still comes from core policy

## 13. `src/schema/`

This folder owns Astro-safe schema rendering support.

### `src/schema/index.ts`

Public schema helper entrypoint.

### `src/schema/render-json-ld.ts`

Purpose: render normalized schema graph into JSON-LD text safely.

Responsibilities:

* stable serialization
* valid JSON output
* central rendering path

### `src/schema/safe-json.ts`

Purpose: safe serialization helper.

Responsibilities:

* escape unsafe sequences
* preserve JSON validity
* protect inline script contexts

## 14. `src/dev/`

This folder is optional and narrow.

### `src/dev/index.ts`

Selective dev-only exports.

### `src/dev/SeoDebug.astro`

Purpose: local development inspection helper for resolved SEO.

Rules:

* optional
* non-canonical
* must not become a second implementation path

## 15. `src/types/`

This folder owns package-local public result types.

### `src/types/index.ts`

Selective public type exports.

### `src/types/context.ts`

Normalized Astro adapter context types.

### `src/types/head.ts`

Head builder input/output types.

### `src/types/routes.ts`

Route helper input/output types.

### `src/types/schema.ts`

Schema rendering types.

Rule:

* this is not a second contracts package
* shared cross-package shapes still belong in `@repo/contracts`

## 16. `src/internal/`

Internal helpers only.

### `src/internal/constants.ts`

Package-local constants.

### `src/internal/errors.ts`

Adapter-specific error messages and error types.

### `src/internal/guards.ts`

Internal type and invariant guards.

### `src/internal/normalize.ts`

Shared low-level normalization helpers.

Rule:

* no consumer imports from `internal`

## 17. `src/testing/`

Reusable testing support for this package.

### `src/testing/index.ts`

Selective testing export surface.

### `src/testing/fixtures.ts`

Stable adapter fixtures.

### `src/testing/astro-context-builders.ts`

Builders for static and request-aware Astro scenarios.

### `src/testing/assertions.ts`

Common canonical/head/route/schema assertions.

## 18. Test philosophy

This package should test:

* static vs request-aware correctness
* single-domain vs shared-host correctness
* canonical mapping correctness
* robots route output correctness
* sitemap route output correctness
* JSON-LD safety
* adapter misuse detection
* Astro adapter behavior, not broad framework snapshot trivia

Prefer behavior assertions over giant rendered markup snapshots.

## 19. Allowed public usage patterns

Good usage patterns:

* app resolves local page and domain context
* app calls `buildStaticSeo()` for normal single-domain pages
* app calls `buildRequestSeo()` only when runtime host truth matters
* app renders `SeoHead.astro`
* app uses package route helpers for robots and sitemap outputs
* app uses `JsonLd.astro` rather than hand-rolled JSON script strings

## 20. Forbidden patterns

Do not allow:

* app-local canonical logic duplicated in layouts when shared helpers already exist
* shared-host apps relying on one build-time `site` URL as canonical truth
* tenant resolution hidden inside the adapter
* ad hoc JSON-LD string construction across pages
* deep imports into `src/*`
* framework policy invented here instead of delegated from core
* sitemap inclusion logic re-implemented at the app layer
* robots.txt used as the primary noindex mechanism for demo/preview pages

## 21. What must not exist in this package

These are drift signs and should not be created:

* `src/cms/`
* `src/db/`
* `src/auth/`
* `src/page-components/`
* `src/sections/`
* `src/blog-rendering/`
* `src/content-fetching/`
* `src/client/`
* `src/analytics/`
* `src/observability/`
* `src/misc/`

Also rejected by design:

* hidden tenant discovery
* page composition systems
* app-level layout shells
* framework-neutral SEO policy duplicated from `seo-core`
* broad browser runtime logic
* speculative multilingual abstractions without a real consumer

## 22. Expected usage outside the package

This package assumes Astro apps keep small local ownership files and delegate into shared packages.

For a typical Astro app:

* route files stay in the app
* layouts stay in the app
* content stays in the app
* app-local SEO inputs stay in the app
* the app delegates head resolution and route output to `@repo/seo-astro`

That matches the repo’s app contract:

* apps own route trees
* apps own page composition
* apps own content
* packages provide shared capability

## 23. Build order

Phase 1:

* top-level files
* export map
* `head/`
* `context/`
* `types/`
* `internal/`

Goal: establish the package boundary and main Astro-facing entrypoints.

Phase 2:

* `resolution/`
* static and request-aware builders
* head mapping
* validation

Goal: make the package usable for page-level head output.

Phase 3:

* `components/`
* `schema/`
* JSON-LD safety

Goal: provide ergonomic Astro-native rendering surfaces.

Phase 4:

* `routes/`
* robots helper
* sitemap helper
* sitemap index helper

Goal: complete Astro route/output adaptation.

Phase 5:

* `testing/`
* full test matrix
* README hardening
* package polish

Goal: make the package safe, explainable, and hard to misuse.

## 24. Definition of done

`packages/seo-astro` is done when:

* Astro apps can consume shared SEO policy without inventing local canonical/noindex/sitemap logic
* static SEO is the default, obvious path
* request-aware SEO is explicit and safe when needed
* the single-domain vs shared-host distinction is encoded in the API and tested
* `SeoHead.astro` covers ordinary page/layout use cleanly
* sitemap and robots helpers are thin and policy-faithful
* JSON-LD output is safe and reusable
* no app/business/CMS/DB logic has leaked into the package
* consumers do not need deep imports
* the README is sufficient for agentic implementation without guesswork

## 25. Final locked decisions

These decisions are now fixed for this directory:

* `@repo/seo-astro` is an Astro adapter, not a second SEO policy layer
* Astro is the primary SEO-critical framework for early public sites
* static-first is the default posture
* request-aware origin handling is explicit, not ambient
* single-domain and shared-host behavior must stay separate
* JSON-LD rendering is first-class and centralized
* route helpers for robots and sitemap belong here
* tenant resolution does not belong here
* public API stays narrow
* no deep imports
* no page-composition creep

This is the final source of truth for `packages/seo-astro`.