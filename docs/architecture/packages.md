# repo/docs/architecture/packages.md

Status: Accepted  
Date: 2026-03-24

## Purpose

Define what counts as a package in this monorepo, what responsibilities belong in `packages/`, and what must remain in apps instead.

This document is the source of truth for shared-library boundaries. It does not define detailed internals for every package, contribution workflow, or app-specific implementation rules.

---

## Package model

In this repository, **packages are shared libraries**.

A package is a bounded, reusable unit that exists to support multiple apps or multiple bounded parts of the repo through a clear public API.

Packages provide shared foundations such as:

- contracts
- environment handling
- design tokens
- UI primitives
- SEO infrastructure
- analytics infrastructure
- observability infrastructure
- testing support

Packages are not deployable surfaces. They do not own final page composition, routing, brand-heavy implementation, or client-specific site behavior.

---

## Why this model exists

The package model exists to preserve:

- clear separation between deployable apps and shared libraries
- intentional reuse instead of ad hoc shared code
- narrow public APIs
- easier maintenance across multiple apps
- predictable navigation for humans and AI-assisted contributors
- stronger boundaries around cross-cutting concerns

The repo is intentionally biased toward **small, explicit, boundary-driven packages** rather than broad shared-code buckets.

---

## Core package rule

Packages exist for **real shared value**.

A package should usually exist because it provides one or more of the following:

- a reusable cross-app concern
- a stable boundary contract
- a framework adapter around shared logic
- a canonical shared primitive or infrastructure layer
- a reusable test-support surface

A package should not exist just to avoid relative imports, to centralize app-specific code prematurely, or to create a vague abstraction without proven reuse.

---

## Current package posture

The current shared package layer is intentionally focused on reusable cross-cutting concerns only.

The planned package map includes:

- `contracts/`
- `env/`
- `design-tokens/`
- `ui/`
- `seo-core/`
- `seo-astro/`
- `analytics/`
- `observability/`
- `testing/`

Additional packages may exist later when justified, but the default posture is to keep the shared layer narrow and deliberate.

---

## What packages own

Packages may own:

- shared schemas, types, and boundary contracts
- typed environment access and validation
- token systems and styling foundations
- reusable UI primitives and low-level presentational building blocks
- framework-agnostic policy engines
- framework adapter layers
- shared instrumentation and telemetry utilities
- shared testing utilities and support infrastructure

Packages should provide stable, documented entry points for these concerns.

---

## What packages do not own

Packages should not own:

- app routing
- page composition
- client-specific layouts
- client-specific visual sections
- brand-heavy marketing implementation
- one-off utilities with unclear reuse
- business logic that belongs only to one app surface
- content wiring that belongs to a single site or page
- ad hoc shared folders masquerading as package boundaries

Packages also should not become dumping grounds for “might be reusable later” code.

---

## Relationship to apps

Packages support apps. Apps compose packages into real surfaces.

The boundary is foundational:

- `apps/` = deployable surfaces
- `packages/` = shared libraries

Apps own final user-facing composition. Packages provide reusable foundations that apps consume.

Do not move app-level composition into packages unless reuse is clearly proven and the extracted API remains appropriately narrow.

---

## Public-API rule

Every package should expose a **small, intentional public API**.

That means:

- exports should be explicit
- consumers should use supported entry points
- deep imports should be avoided unless explicitly allowed
- internal structure can evolve without turning into public contract by accident

A package is successful when consumers can understand what it provides without reading its entire internal implementation.

---

## Boundary-driven reuse rule

Reuse alone is not enough. The reuse must also be **the right kind of reuse**.

Good package candidates usually have these properties:

- used by more than one app or bounded surface
- conceptually stable
- not tied to one client brand or one page
- likely to benefit from centralized testing or governance
- clear enough to describe in one package purpose statement

Poor package candidates usually have these properties:

- page-specific
- marketing-section-specific
- heavily branded
- only shared because two current apps happen to look similar
- likely to fragment once real variation appears

---

## App-local-first safeguard

This repo follows an **app-local-first** rule for visible public-site implementation.

That means packages should generally **not** absorb:

- visible marketing sections
- page templates
- client-specific components
- site-specific composition patterns
- local content structures
- branded page-level UI

Even if two sites temporarily share something similar, that alone is not enough to justify promoting it into a shared package.

---

## Package families

### Foundation packages

These provide low-level, repo-wide shared building blocks.

Examples:

- `contracts/`
- `env/`
- `design-tokens/`

These packages define stable shared boundaries or infrastructure that many other areas depend on.

### Experience and presentation support packages

These provide reusable presentation foundations without owning app surfaces.

Examples:

- `ui/`
- `seo-core/`
- `seo-astro/`

These packages help apps implement consistent behavior while leaving final composition inside the app.

### Operational support packages

These provide shared instrumentation, diagnostics, or testing support.

Examples:

- `analytics/`
- `observability/`
- `testing/`

These packages improve consistency and maintainability across the workspace without becoming runtime surface owners.

---

## Package quality expectations

Packages should generally be:

- narrow in purpose
- explicit in ownership
- documented locally
- safe to consume through their public API
- aligned with canonical docs
- designed to minimize accidental coupling

A shared package should feel more constrained than an app, not less.

---

## When to create a new package

Create a new package only when:

- the concern is genuinely shared
- the boundary is clear enough to name precisely
- keeping it app-local would create repeated cross-app maintenance burden
- it does not belong in an existing package
- the public API can remain small and intentional

Creating a package is a structural decision, not a casual convenience move.

Approval is required before creating a new package.

---

## When not to create a new package

Do not create a new package when:

- the code is only needed by one app
- the reuse is speculative
- the code is mostly page or section composition
- the need is better solved by app-local organization
- the package would become a vague “shared helpers” bucket
- the package boundary cannot be described clearly

In these cases, keep the code local until a real shared boundary emerges.

---

## Alternatives considered

- **Broad shared utilities package** — rejected; encourages vague ownership and long-term package drift
- **Minimal or no package layer** — rejected; contracts, tokens, env handling, SEO, analytics, observability, and testing have real shared value
- **Moving visible site composition into packages early** — rejected; over-centralizes public-site implementation before reuse is proven
- **Using packages as a convenience abstraction layer for every repeated snippet** — rejected; weakens clarity and encourages premature extraction

---

## Trade-offs

This package model makes some things easier:

- enforcing shared boundaries
- centralizing true cross-cutting concerns
- keeping apps focused on deployable surfaces
- maintaining consistent infrastructure across the repo
- guiding AI-assisted contributors toward the right placement decisions

It also makes some things harder:

- more discipline is required before extracting shared code
- duplicated local implementation may exist for a while before extraction is justified
- package creation becomes a deliberate architectural step rather than a quick convenience move
- shared APIs need active restraint to stay narrow

These trade-offs are intentional and preferable to turning the shared layer into a vague warehouse.

---

## What is deferred

The current package model intentionally defers:

- speculative package creation
- broad helper buckets
- centralized page-section libraries
- client-brand-specific shared libraries
- over-abstracted shared surface composition
- package proliferation without strong boundary justification

These may become appropriate later, but they are not the default posture now.

---

## Related docs

- [`overview.md`](./overview.md)
- [`repo-shape.md`](./repo-shape.md)
- [`apps.md`](./apps.md)
- [`public-sites.md`](./public-sites.md)
- [`design-system.md`](./design-system.md)
- [`agent-tooling.md`](./agent-tooling.md)

---