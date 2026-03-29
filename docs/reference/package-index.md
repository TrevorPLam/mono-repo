# package-index.md

Status: Active  
Date: 2026-03-24

## Purpose

Provide a scan-friendly index of the shared packages in this monorepo.

This document is the quick lookup surface for package boundaries, responsibilities, and navigation. It is a reference document, not an architecture ADR or an implementation guide.

---

## How to use this index

Use this file when you need to quickly answer questions like:

- which shared packages exist
- what each package is responsible for
- where a new piece of logic should live
- whether something belongs in a package or an app
- how packages relate to each other

For detailed rules, follow the linked canonical docs rather than relying on this file alone.

---

## Packages at a glance

```text
packages/
├── contracts/
├── env/
├── design-tokens/
├── ui/
├── seo-core/
├── seo-astro/
├── analytics/
├── observability/
└── testing/
````

---

## Package map

| Package                   | Purpose                                    | Notes                                             |
| ------------------------- | ------------------------------------------ | ------------------------------------------------- |
| `packages/contracts/`     | Shared schemas and boundary contracts      | Schema-first, validation at boundaries            |
| `packages/env/`           | Environment validation and typed access    | Single source for env parsing and safety          |
| `packages/design-tokens/` | Token architecture and generation pipeline | Global token structure, not per-site styling      |
| `packages/ui/`            | Shared UI primitives                       | Primitive-first, not a section or layout system   |
| `packages/seo-core/`      | Framework-agnostic SEO policy layer        | Canonical SEO rules and resolution                |
| `packages/seo-astro/`     | Astro SEO adapter                          | Thin adapter for Astro surfaces                   |
| `packages/analytics/`     | Shared analytics instrumentation           | Event model, provider wiring, tracking boundaries |
| `packages/observability/` | Shared telemetry and diagnostics           | Logs, traces, structured telemetry                |
| `packages/testing/`       | Shared testing support                     | Utilities, mocks, cross-cutting test helpers      |

---

## Package posture

The current package posture is:

* packages are shared libraries only
* packages exist to serve multiple apps or workflows
* packages expose narrow, explicit public APIs
* packages should remain framework-aware only when necessary, via explicit adapters
* packages should not absorb app-specific behavior

Packages are foundational, not product surfaces.

For canonical rules, see [`../architecture/packages.md`](../architecture/packages.md).

---

## What belongs in packages

Packages are appropriate for:

* cross-app logic
* shared contracts and schemas
* environment handling and validation
* shared infrastructure boundaries such as SEO, analytics, and observability
* reusable UI primitives
* token systems and styling infrastructure
* shared testing utilities

A package should exist because **multiple apps benefit from it**, not because code needs a place to live.

---

## What does not belong in packages

Packages should not become:

* a dumping ground for “maybe reusable later” code
* a home for client-specific logic
* a place for page composition or layouts
* a warehouse for marketing sections
* a hidden extension of a single app

Examples of what should stay in apps:

* page-level composition
* branded sections
* site-specific layouts
* client-specific content structures
* route-level decisions

For app boundaries, see [`../architecture/apps.md`](../architecture/apps.md).

---

## Package creation rule

Create a new package only when:

* more than one app or workflow needs the functionality, or
* a clear shared boundary exists, such as contracts, tokens, analytics, or observability, and
* the interface can be defined cleanly and narrowly

Do not create a package:

* for one-off usage
* to reduce file size in an app
* to “prepare for future reuse” without real demand

For full rules, see [`../architecture/packages.md`](../architecture/packages.md).

---

## Package interaction model

Packages should:

* depend on other packages only when boundaries are clear
* avoid circular dependencies
* expose stable public entrypoints
* hide internal implementation details

Apps should:

* consume packages through public APIs only
* not deep-import internal package files
* compose packages into real surfaces

---

## Design-system relationship

The design system is split across packages and apps:

* `packages/design-tokens/` → global token system
* `packages/ui/` → shared primitives
* apps → visible composition, layouts, and branding

This separation ensures:

* consistency at the foundation level
* flexibility at the app level

For full posture, see [`../architecture/design-system.md`](../architecture/design-system.md).

---

## SEO, analytics, and observability relationship

These concerns are handled via shared packages:

* SEO → `seo-core` + `seo-astro`
* analytics → `analytics`
* observability → `observability`

Packages define:

* policy
* instrumentation boundaries
* provider integrations

Apps define:

* how those are used in real surfaces
* route-level behavior
* content-specific decisions

For full posture, see [`../architecture/seo-analytics-observability.md`](../architecture/seo-analytics-observability.md).

---

## Testing relationship

Testing is shared and local:

* `packages/testing/` → shared utilities and support
* apps and packages → their own tests

Do not move all tests into the shared package.

For testing posture, see [`../architecture/testing.md`](../architecture/testing.md).

---

## Package-related reading paths

### To understand package boundaries

1. [`../architecture/packages.md`](../architecture/packages.md)
2. [`../architecture/apps.md`](../architecture/apps.md)
3. [`../architecture/design-system.md`](../architecture/design-system.md)

### To understand shared infrastructure

1. [`../architecture/seo-analytics-observability.md`](../architecture/seo-analytics-observability.md)
2. [`../architecture/data-auth-integrations.md`](../architecture/data-auth-integrations.md)
3. [`../architecture/deployment-security.md`](../architecture/deployment-security.md)

### To implement or modify a package

1. [`../../AGENTS.md`](../../AGENTS.md)
2. nearest package `AGENTS.md`
3. relevant canonical architecture doc
4. related templates in [`../templates/`](../templates/)

---

## Notes on current state

This index reflects the canonical planned package set.

Some packages may evolve, expand, or be introduced later as real needs emerge. Treat this file as a reference surface for intended package boundaries, not as a frozen inventory.

---

## Maintenance rule

Keep this file aligned with the actual package set.

When a package is:

* added
* removed
* renamed
* materially repurposed

update this index in the same change.

---

## Related docs

* [`../architecture/overview.md`](../architecture/overview.md)
* [`../architecture/packages.md`](../architecture/packages.md)
* [`../architecture/design-system.md`](../architecture/design-system.md)
* [`../architecture/seo-analytics-observability.md`](../architecture/seo-analytics-observability.md)
* [`../architecture/data-auth-integrations.md`](../architecture/data-auth-integrations.md)
* [`workspace-index.md`](./workspace-index.md)
* [`app-index.md`](./app-index.md)