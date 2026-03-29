# repo/docs/architecture/public-sites.md

Status: Accepted  
Date: 2026-03-24

## Purpose

Define the default architecture and operating posture for public-facing sites in this monorepo.

This document explains what counts as a public site, how public sites are organized, what defaults apply to their implementation, and which patterns are intentionally deferred. It is the source of truth for public-site architecture, not a detailed implementation runbook.

---

## Public-site model

In this repository, public sites are the primary delivery surface.

Public sites include:

- the firm’s public site
- real client websites
- approved durable showcase sites when intentionally kept in the repo

The default public-site model is:

- the firm site is its own app
- each real client site is its own app
- early implementation is overwhelmingly Astro-first
- public sites are code/content-file-first by default
- visible site implementation stays app-local unless reuse is clearly proven
- shared packages support cross-cutting concerns, not final site composition

Public-site work is the current architectural center of gravity for this repo.

---

## Why this model exists

This model exists to preserve:

- strong flexibility across real client work
- clearer ownership and transferability for client sites
- simpler public-site delivery without premature protected-app complexity
- cleaner separation between site composition and shared foundations
- a repo shape that matches current business needs instead of speculative platform ambitions

The architecture is intentionally biased toward shipping real public sites well before broad internal-platform buildout.

---

## Site families

### `apps/site-firm`

`apps/site-firm` is the firm’s public site.

It is a real product surface, not a placeholder. It should own its own content structure, page composition, and public-site behavior while consuming shared foundations from `packages/` where appropriate.

### `apps/sites/clients/<client-slug>`

Each real client site is a separate app under `apps/sites/clients/<client-slug>`.

This is the default model for real client work. Client sites should not be forced into one rigid multi-tenant application shell by default.

Each client site should preserve room for:

- design variation
- content variation
- client-specific requirements
- cleaner ejection and transfer paths later

### Durable showcase or reusable public sites

A site may live in the repo as a durable non-client public site only when it is intentionally reusable or strategically worth preserving.

This should be the exception, not the default.

---

## Public-site responsibilities

Public sites own:

- routing
- page composition
- content assembly
- local content schemas and wiring
- app-specific SEO composition
- app-specific section composition
- site-local configuration
- final assembly of shared tokens, primitives, and adapters into real pages

Public sites are where the visible experience comes together.

---

## App-local-first rule

Public-site implementation is **app-local first**.

Keep these local to the site app by default:

- page composition
- visible sections
- site-specific layouts
- client-specific branding
- content structures tied to one site
- site-specific configuration
- composition of shared primitives into branded surfaces

Do not prematurely move visible site implementation into shared packages.

Temporary similarity between two sites is not enough to justify extraction.

---

## Shared-package relationship

Public sites consume shared foundations from `packages/`, but shared packages do not own public-site surfaces.

Shared packages may provide:

- contracts
- env handling
- design tokens
- UI primitives
- SEO policy engines and adapters
- analytics foundations
- observability foundations
- testing support

Public sites should compose these into real branded experiences.

The boundary remains foundational:

- `apps/` = deployable surfaces
- `packages/` = shared libraries

---

## Framework posture

Early public-site implementation should stay overwhelmingly Astro-first.

Astro is the default for current public-site work because it fits the current posture:

- content-heavy public surfaces
- marketing-oriented delivery
- mostly static or lightly dynamic pages
- strong separation from protected or stateful product assumptions

Next.js is not the default engine for current public-site delivery. It becomes active when a real protected, stateful, or operational workflow justifies it.

Public-site work should not casually import protected-app assumptions.

---

## Content model posture

Public sites are **code/content-file-first** by default.

That means:

- content should generally live in code or structured content files early on
- public-site delivery should not depend on a CMS by default
- local content workflows should remain simple, explicit, and repo-friendly
- blog and resource publishing should be supported from the start in a lightweight way

This supports fast delivery, strong version control, and predictable repo-local authoring.

---

## Editing posture

The default editing posture is agency-managed, code/content-file-first editing.

The current default is:

- agency edits the site in v1
- client editing is optional, not assumed
- limited structured editing may be introduced later where justified
- heavy CMS-driven editing is deferred by default

The goal is to preserve implementation speed and structural clarity without ruling out future client-editable paths.

---

## Blog and publishing posture

Public sites should be able to support blog, article, or resource-style publishing from the start when needed.

This does not require a heavy CMS-first architecture.

The preferred posture is:

- lightweight publishing support
- local-first authoring
- structured content where useful
- per-site flexibility in how publishing is exposed

Publishing capability is part of the public-site baseline, not a speculative add-on.

---

## Data and backend posture

Public sites should remain DB-optional by default.

That means:

- a public site should not require a database unless its real needs justify one
- public-site rendering should not depend on a DB being in the critical path by default
- backend capabilities may exist where needed, but should not be imposed everywhere

This keeps early public-site architecture lighter and better aligned with actual site needs.

---

## Forms posture

Public-site forms should use a structured server-side submission boundary.

The default operational posture is:

- server-side handling, not loose client-only flows
- email delivery for operational usefulness
- database persistence where the form workflow benefits from durable storage

Form architecture should stay intentional and should not force a larger product-app posture onto ordinary public-site work.

---

## Transferability posture

Real client sites should preserve transferability as a first-class concern.

That means the architecture should avoid:

- unnecessary coupling across unrelated client sites
- rigid dependence on one multi-tenant app shell
- avoidable vendor or repo entanglement in visible site composition
- ownership models that make the agency the only realistic operator

Site architecture should support a clean future handoff or ejection path when needed.

---

## Prospect and demo posture

Prospect or demo work should usually remain temporary and non-permanent.

It should not become a durable repo app unless at least one of the following is true:

- it is intentionally reusable
- it is strategically valuable as a durable showcase
- it is highly likely to graduate into a real client site

Most prospect work should stay as preview deployments or other temporary delivery artifacts rather than permanent repo surfaces.

---

## What public sites should not become

Public sites should not become:

- disguised protected apps without a real reason
- forced consumers of heavy CMS-first systems by default
- over-centralized shells that flatten client variation
- dumping grounds for speculative shared abstractions
- thin skins over a shared page-section warehouse

Public-site architecture should stay aligned with actual delivery needs.

---

## Alternatives considered

- **Single multi-tenant app for all real client sites** — rejected as the default; weakens isolation, transferability, and client-specific flexibility
- **Next.js-first for all public sites** — rejected for the current posture; adds product-style complexity before it is justified
- **Heavy CMS-first architecture by default** — rejected; early public sites should remain code/content-file-first unless real editing needs justify more
- **Shared section library as the main delivery model** — rejected; over-centralizes visible site implementation before reuse is proven
- **Permanent repo apps for ordinary prospect work** — rejected; creates clutter and weakens structural discipline

---

## Trade-offs

This public-site model makes some things easier:

- strong variation across client sites
- cleaner bounded ownership per site
- clearer transfer and ejection paths
- simpler early delivery for content-heavy public surfaces
- better alignment with the current business model

It also makes some things harder:

- more separate app surfaces to manage as client count grows
- less early standardization across visible site composition
- more deliberate extraction work before something becomes shared
- client-editable workflows are deferred instead of solved universally up front

These trade-offs are intentional.

---

## What is deferred

The current public-site posture intentionally defers:

- broad protected/internal app assumptions in public-site work
- heavy CMS-first editing systems
- one rigid multi-tenant shell for all real client sites
- over-centralized shared marketing-section systems
- database-required posture for every site
- permanent repo placement for ordinary demo or prospect work

These are not ruled out forever. They are simply not the default assumptions now.

---

## Related docs

- [`overview.md`](./overview.md)
- [`repo-shape.md`](./repo-shape.md)
- [`apps.md`](./apps.md)
- [`packages.md`](./packages.md)
- [`design-system.md`](./design-system.md)
- [`seo-analytics-observability.md`](./seo-analytics-observability.md)
- [`deployment-security.md`](./deployment-security.md)
