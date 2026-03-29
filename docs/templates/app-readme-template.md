# app-readme-template.md

Status: Template  
Date: 2026-03-24

## Purpose

Provide the standard local `README.md` template for a deployable app in this monorepo.

Use this template for real app surfaces in `apps/`. It is designed to keep local app documentation short, scannable, and aligned with canonical repo rules.

This template is not a substitute for canonical architecture docs. It is the local orientation layer for one app.

---

## How to use this template

When creating a new app-level `README.md`:

- replace all placeholder values
- delete sections that truly do not apply
- keep the file short and specific to the app
- link to canonical docs instead of copying policy
- describe the app as it actually exists, not as a wishlist

Do not leave instructional template notes in the final app README.

---

# `<app-name>`

Short description of what this app is and why it exists.

Example:

> Public website for the firm.  
> This app owns the firm’s public-facing marketing pages, service pages, resource content, and lead-capture surface.

---

## Purpose

Describe the app’s role in one or two short paragraphs.

Include:

- what kind of surface it is
- who it serves
- what it owns
- what it does not own

Example prompts:

- Is this a public site, a client site, or a protected internal surface?
- What user or business need does it serve?
- What belongs here instead of in shared packages?

---

## App type

State the app family clearly.

Choose the one that applies:

- public firm site
- public client site
- protected internal app
- other approved app type: `<describe>`

---

## Path

```text
<app-path>
````

Examples:

```text
apps/site-firm/
```

```text
apps/sites/clients/<client-slug>/
```

---

## What this app owns

List the responsibilities that belong in this app.

Typical examples:

* route tree
* page composition
* local content structure
* app-specific configuration
* app-local SEO composition
* visible sections and layouts
* final assembly of shared primitives into real pages

Only keep items that are actually true for this app.

---

## What does not belong here

List nearby concerns that should stay elsewhere.

Typical examples:

* shared schemas and contracts
* shared token infrastructure
* shared primitive UI
* shared analytics infrastructure
* shared observability infrastructure
* app-agnostic SEO policy
* app-external infra configuration
* repo-wide scripts or test infrastructure

Link to canonical docs when helpful.

---

## Structure notes

Briefly explain the important local structure inside this app.

Keep this high-level.

Example:

* `src/pages/` owns route-level page entrypoints
* `src/components/` holds app-local UI composition
* `src/content/` holds local-first content files
* `public/` holds public static assets

Do not document every folder unless the app truly needs that level of explanation.

---

## Key local rules

Document the most important local constraints.

Examples:

* keep visible site composition app-local unless reuse is clearly proven
* do not move branded sections into shared packages
* keep client-specific content structures local to this app
* do not introduce auth or DB assumptions without approval
* prefer shared tokens and primitives over local reinvention

This section should be short and app-specific.

---

## Shared packages commonly used here

List the shared packages this app normally consumes.

Example:

* `@repo/design-tokens`
* `@repo/ui`
* `@repo/seo-core`
* `@repo/seo-astro`
* `@repo/analytics`
* `@repo/observability`
* `@repo/contracts`
* `@repo/env`

Only list packages that are actually relevant to the app.

---

## Local development

Document the most common local workflow for this app.

Example:

```bash
pnpm turbo dev --filter=<app-target>
```

Add only the commands a contributor is most likely to need.

For the canonical command posture, see [`../reference/commands.md`](../reference/commands.md) or the nearest applicable docs path for the app location.

---

## Validation

List the expected narrow validation commands for this app.

Example:

```bash
pnpm turbo lint --filter=<app-target>
pnpm turbo typecheck --filter=<app-target>
pnpm turbo test --filter=<app-target>
pnpm turbo build --filter=<app-target>
```

If this app has special validation expectations, note them briefly.

Do not claim these were run in the README. This section is guidance only.

---

## Environment notes

Document only non-secret environment guidance.

Examples:

* which kinds of env values this app expects
* whether it uses public config values
* whether it has app-local secret scope
* whether browser-safe config must be exposed explicitly

Do not put real values in this file.

For env ownership rules, see the canonical env reference.

---

## Related docs

Link the most relevant canonical docs for this app.

Typical examples:

* [`docs/architecture/apps.md`](../../docs/architecture/apps.md)
* [`docs/architecture/public-sites.md`](../../docs/architecture/public-sites.md)
* [`docs/architecture/packages.md`](../../docs/architecture/packages.md)
* [`docs/architecture/design-system.md`](../../docs/architecture/design-system.md)
* [`docs/architecture/data-auth-integrations.md`](../../docs/architecture/data-auth-integrations.md)
* [`docs/architecture/seo-analytics-observability.md`](../../docs/architecture/seo-analytics-observability.md)
* [`docs/architecture/testing.md`](../../docs/architecture/testing.md)
* [`docs/architecture/deployment-security.md`](../../docs/architecture/deployment-security.md)

Adjust the relative paths to match the app location.

---

## Template cleanup checklist

Before finalizing an app README created from this template:

* replace all placeholders
* remove template-only instructional text
* confirm the app name and path are correct
* keep only sections that apply
* confirm related-doc links resolve correctly from the app’s location
* keep the file short, accurate, and local in scope