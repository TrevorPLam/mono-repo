# package-readme-template.md

Status: Template  
Date: 2026-03-24

## Purpose

Provide the standard local `README.md` template for a shared package in this monorepo.

Use this template for package-level `README.md` files inside `packages/`. It is designed to keep local package documentation short, scannable, and aligned with canonical repo rules.

This template is for **local package orientation**. It is not the canonical home for architecture truth.

---

## How to use this template

When creating a new package-level `README.md`:

- replace all placeholders
- delete sections that truly do not apply
- keep the file short and specific to the package
- link to canonical docs instead of copying policy
- describe the package as it actually exists, not as a wishlist
- make the package boundary obvious

Do not leave template instructions in the final package README.

---

# `<package-name>`

Short description of what this package is and why it exists.

Example:

> Shared token architecture and generation pipeline for the monorepo.  
> This package owns common token structure, validation, and generated token artifacts used by multiple apps and packages.

---

## Purpose

Describe the package’s role in one or two short paragraphs.

Include:

- what kind of shared concern it owns
- what consumers it supports
- what it explicitly does not own
- why it exists as a package rather than app-local code

Example prompts:

- Is this a foundation package, adapter package, or support package?
- What boundary does it protect?
- What kind of reuse justifies its existence?

---

## Package family

State the package family clearly.

Choose the one that applies:

- foundation
- design foundation
- policy core
- framework adapter
- operational foundation
- support foundation
- other approved package family: `<describe>`

---

## Path

```text
<package-path>
````

Examples:

```text
packages/contracts/
```

```text
packages/design-tokens/
```

```text
packages/ui/
```

---

## What this package owns

List the responsibilities that belong in this package.

Typical examples:

* shared schemas and contracts
* env validation and typed access
* token structure and generation
* reusable UI primitives
* framework-agnostic policy logic
* thin framework adapter behavior
* shared instrumentation boundaries
* shared testing support

Only keep items that are actually true for this package.

---

## What does not belong here

List nearby concerns that should stay elsewhere.

Typical examples:

* app routing
* page composition
* client-specific branding
* visible marketing sections
* site-specific content structures
* app-local business workflows
* repo-level operational scripts
* vague shared helpers unrelated to the package boundary

This section should help contributors avoid widening the package casually.

---

## Consumers

Briefly describe who or what usually consumes this package.

Examples:

* public site apps
* shared packages
* Astro-specific surfaces
* internal server-side boundaries
* testing workflows

If helpful, use bullets:

* `<consumer 1>`
* `<consumer 2>`
* `<consumer 3>`

Keep this high-level.

---

## Public API expectations

Describe the intended shape of the package’s public API.

Examples:

* exports should stay narrow and explicit
* consumers should use supported entry points only
* deep imports are discouraged unless explicitly allowed
* internal structure may change without becoming public contract

If the package has notable subpath exports, mention them briefly.

Do not turn this section into a full API reference.

---

## Structure notes

Briefly explain the important local structure inside this package.

Keep this high-level.

Example:

* `src/` contains the package implementation
* `src/server/` contains server-only entry points
* `src/client/` contains client-safe entry points
* `generated/` contains committed or generated artifacts defined by the package contract
* `tests/` contains package-local tests

Document only the local structure that materially helps contributors navigate the package.

---

## Key local rules

Document the most important local constraints.

Examples:

* keep the package boundary narrow
* do not absorb app-level composition
* do not expose internal implementation accidentally
* preserve framework-neutral posture unless this is an approved adapter package
* keep server-only and client-safe boundaries explicit
* do not turn this package into a generic helper bucket

This section should be short and package-specific.

---

## Commonly related packages

List the packages most commonly adjacent to this one.

Examples:

* `@repo/contracts`
* `@repo/env`
* `@repo/design-tokens`
* `@repo/ui`
* `@repo/seo-core`
* `@repo/seo-astro`
* `@repo/analytics`
* `@repo/observability`
* `@repo/testing`

Only list packages that are actually relevant.

---

## Local development

Document the most common local workflow for this package.

Example:

```bash
pnpm turbo dev --filter=<package-target>
```

If `dev` is not meaningful for this package, remove this section or replace it with the most relevant local command pattern.

For canonical command posture, see the repo command reference.

---

## Validation

List the expected narrow validation commands for this package.

Example:

```bash
pnpm turbo lint --filter=<package-target>
pnpm turbo typecheck --filter=<package-target>
pnpm turbo test --filter=<package-target>
pnpm turbo build --filter=<package-target>
```

If the package has special validation expectations, note them briefly.

Examples:

* representative script execution is required
* Storybook validation is relevant
* generated artifacts must be refreshed or verified
* server-only boundaries must remain explicit

Do not claim these were run in the README. This section is guidance only.

---

## Environment notes

Document only non-secret environment guidance relevant to the package.

Examples:

* whether the package consumes env through `@repo/env`
* whether values must remain server-only
* whether the package is client-safe by default
* whether public config must be passed explicitly by the app

Do not put real values in this file.

---

## Related docs

Link the most relevant canonical docs for this package.

Typical examples:

* [`docs/architecture/packages.md`](../../docs/architecture/packages.md)
* [`docs/architecture/design-system.md`](../../docs/architecture/design-system.md)
* [`docs/architecture/data-auth-integrations.md`](../../docs/architecture/data-auth-integrations.md)
* [`docs/architecture/seo-analytics-observability.md`](../../docs/architecture/seo-analytics-observability.md)
* [`docs/architecture/testing.md`](../../docs/architecture/testing.md)
* [`docs/reference/package-index.md`](../../docs/reference/package-index.md)
* [`docs/reference/commands.md`](../../docs/reference/commands.md)
* [`docs/reference/env-matrix.md`](../../docs/reference/env-matrix.md)

Adjust the relative paths to match the package location.

---

## Template cleanup checklist

Before finalizing a package README created from this template:

* replace all placeholders
* remove template-only instructional text
* confirm the package name and path are correct
* keep only sections that apply
* make the package boundary obvious
* confirm related-doc links resolve correctly from the package location
* keep the file short, accurate, and local in scope
