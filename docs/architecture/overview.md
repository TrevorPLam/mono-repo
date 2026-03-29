# repo/docs/architecture/overview.md

Status: Accepted  
Date: 2026-03-24

## Purpose

Provide the high-level architectural view of the monorepo.

This document explains the repo’s overall shape, the major structural layers inside it, the operating posture that guides implementation, and the main trade-offs behind the current design. It is the architecture entry point, not a package-by-package or app-by-app deep dive.

---

## Architecture summary

This repository uses a pnpm + Turborepo monorepo structure with a public-sites-first delivery model.

The current architectural posture is:

- Astro-first for public-facing site work
- real client websites as separate apps
- shared packages for reusable cross-cutting concerns only
- local-first content and code/content-file-first public-site implementation
- canonical documentation in `docs/`
- protected or internal app surfaces only when justified by real workflow needs

---

## Why this architecture exists

This architecture exists to support the current business and delivery model:

- the firm’s public site is a real product surface
- client websites need strong variation and should not be forced into one over-centralized app model
- shared packages should support reuse without swallowing app-specific implementation
- the repo needs to work well for both humans and AI-assisted development
- durable rules and workflows need a clear canonical home

The structure is intentionally biased toward clarity, transferability, and controlled reuse over speculative platform buildout.

---

## Core structural layers

### 1. Apps

`apps/` contains deployable application surfaces.

This includes:

- the firm site
- real client sites
- any later justified protected or internal apps

Apps own composition, routing, and surface-specific behavior.

### 2. Packages

`packages/` contains shared libraries.

These packages hold reusable cross-cutting concerns such as:

- contracts
- environment handling
- design tokens
- UI primitives
- SEO infrastructure
- analytics infrastructure
- observability infrastructure
- testing support

Packages are not deployable surfaces and should not absorb app-specific page composition or brand-heavy implementation.

### 3. Canonical docs

`docs/` contains the canonical explanation layer.

This includes:

- architecture decisions
- operational runbooks
- reference docs
- templates
- feature-delivery doc structures

### 4. Support areas

The repo also contains governed support directories:

- `infra/` for infrastructure-related material
- `scripts/` for justified operational scripts
- `tests/` for repo-level and cross-app testing surfaces

---

## Core architectural rules

### Apps are deployable surfaces

Deployable software belongs in `apps/`.

Real client sites are separate apps by default and live under `apps/sites/clients/<client-slug>`.

### Packages are shared libraries

Reusable code belongs in `packages/`.

Packages must remain narrow, intentional, and boundary-driven.

### Root is control-plane only

The repository root owns coordination, not app or runtime sprawl.

Vague runtime buckets such as `src/`, `lib/`, `shared/`, `common/`, or `utils/` do not belong at the root.

### Docs are canonical truth

Durable architecture and workflow truth belongs in `docs/`, not scattered across adapters, tasks, or ad hoc planning files.

---

## Public-site model

The current implementation emphasis is on public websites.

That means:

- the firm site is an app
- real client sites are separate apps
- early implementation should stay overwhelmingly Astro-first
- public sites should remain local-first and code/content-file-first
- visible site implementation should stay app-local unless reuse is clearly proven

This preserves flexibility across client work while still allowing shared foundations where they genuinely belong.

---

## Package model

The shared package layer is intentionally limited to reusable concerns with clear cross-app value.

The package layer should support:

- consistency
- reuse
- boundaries
- maintainability

It should not become:

- a dumping ground for semi-reused helpers
- a place for page-level composition
- a warehouse for visible marketing sections
- a substitute for app-local implementation

---

## Documentation model

The documentation system follows one canonical layer, then thin adapters.

That means:

- canonical truth belongs in `docs/`
- local `README.md` and `AGENTS.md` files narrow the rules for a subtree
- adapter docs should remain thin
- skills should encode repeatable procedures
- feature and task docs should hold execution detail, not long-term architecture truth

---

## Agent and tooling layer

The repo includes an explicit AI tooling layer that operates on top of the architecture:

- root and local `AGENTS.md` files for agent behavior
- thin adapter docs such as `CLAUDE.md` and GitHub instruction files
- skills for repeatable procedures
- task packets in `docs/features/` for substantial work

This layer governs how the repo is navigated and modified by AI tools. It is not a deployable or runtime architecture layer.

---

## Alternatives considered

- **Next.js for all sites** — rejected for early public-site work; adds complexity before protected or stateful workflows are justified
- **Single multi-tenant app for all real client sites** — rejected; reduces transferability, isolation, and client-specific flexibility
- **No shared packages** — rejected; design tokens, contracts, env handling, SEO, analytics, and observability have clear cross-app value
- **Heavy CMS-first editing model** — rejected as the default; early public sites should remain local-first and code/content-file-first
- **Broad internal-platform buildout first** — rejected; current business value is in shipping public sites, not speculative internal systems

---

## Trade-offs

This architecture makes some things easier:

- flexible client-site variation
- clearer handoff and transferability
- stronger package boundaries
- cleaner AI-agent control surfaces
- lower risk of over-centralized public-site abstraction

It also makes some things harder:

- more deployable apps to manage as client count grows
- less immediate standardization across visible site sections
- more deliberate work required before extracting shared abstractions
- future protected or internal app patterns are deferred instead of solved early
- some cross-site consistency must be maintained through discipline rather than one rigid app shell

---

## What is deferred

The current architecture intentionally defers several things until justified:

- broad internal or admin app expansion
- client portals
- heavy CMS-driven editing systems
- speculative multi-tenant app models for real client sites
- over-centralized shared marketing section systems
- unnecessary auth, DB, or protected-app patterns in public-site work

These are not ruled out forever. They are simply not default assumptions.

---

## Related docs

- [`repo-shape.md`](./repo-shape.md)
- [`apps.md`](./apps.md)
- [`packages.md`](./packages.md)
- [`public-sites.md`](./public-sites.md)
- [`design-system.md`](./design-system.md)
- [`deployment-security.md`](./deployment-security.md)
- [`testing.md`](./testing.md)
- [`agent-tooling.md`](./agent-tooling.md)