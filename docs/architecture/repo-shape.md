# repo/docs/architecture/repo-shape.md

Status: Accepted  
Date: 2026-03-24

## Purpose

Define the canonical top-level structure of the monorepo.

This document explains what belongs in each top-level directory, what does not belong there, and why the repo is intentionally shaped this way. It is the source of truth for repository structure, not a runtime guide or contribution workflow document.

---

## Repository shape

The canonical top-level structure is:

```text
.
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── CONTRIBUTING.md
├── apps/
├── packages/
├── docs/
├── infra/
├── scripts/
├── tests/
├── .github/
├── .claude/
└── .agents/
````

This structure separates:

* deployable surfaces
* shared libraries
* canonical documentation
* support areas
* tool and agent adapters

The root exists to coordinate the workspace, not to act as a catch-all code area.

---

## Why this shape exists

This shape exists to preserve:

* clear app vs package boundaries
* predictable navigation for humans and agents
* low structural ambiguity
* controlled reuse instead of ad hoc shared code
* a clean distinction between canonical docs, runtime code, and tooling
* a monorepo that scales by adding bounded areas rather than vague folders

The structure is intentionally biased toward explicitness over convenience.

---

## Top-level directory rules

### Root files

The root contains control-plane files and repo-wide entry points.

Examples:

* `README.md`
* `AGENTS.md`
* `CONTRIBUTING.md`
* workspace and tool configuration files
* top-level coordination docs

The root should explain, govern, and coordinate. It should not become a runtime code layer.

### `apps/`

`apps/` contains deployable applications only.

Examples:

* the firm site
* real client sites
* any later justified protected or internal apps

Apps own:

* routing
* page and surface composition
* app-local content wiring
* surface-specific behavior

Apps do not exist to hold shared utility code that belongs in `packages/`.

### `packages/`

`packages/` contains shared libraries only.

Examples:

* contracts
* env handling
* design tokens
* UI primitives
* SEO
* analytics
* observability
* testing support

Packages own reusable cross-cutting concerns. They should remain narrow, explicit, and boundary-driven.

Packages do not own app-level page composition, routing, or brand-heavy site implementation.

### `docs/`

`docs/` contains the canonical documentation layer.

Examples:

* architecture
* operations
* reference
* templates
* feature-delivery docs

Durable truth belongs here, not scattered across tool adapters or ad hoc planning files.

### `infra/`

`infra/` contains infrastructure-related material.

This includes infrastructure code, infra docs, or infra-supporting assets when they become necessary.

Infrastructure concerns should be isolated from app and package implementation.

### `scripts/`

`scripts/` contains justified operational scripts.

Scripts here should be:

* reusable
* narrow in purpose
* clearly named
* worth keeping

This directory should not become a dumping ground for one-off convenience files.

### `tests/`

`tests/` contains repo-level and cross-app testing surfaces.

This area exists for tests that do not belong naturally inside one app or one package.

Ordinary local tests should stay near the code they validate unless there is a repo-level reason to centralize them.

### `.github/`

`.github/` contains GitHub-specific repository automation and thin tool-specific instructions.

Examples:

* workflow files
* pull request template
* Copilot instructions

This area should stay specific to GitHub platform behavior and adapter concerns.

### `.claude/` and `.agents/`

These directories contain skill and tool-specific agent resources.

They should remain thin, procedural, and aligned with canonical docs rather than acting as parallel architecture sources of truth.

---

## Forbidden root drift

The following do not belong as vague top-level runtime directories:

* `src/`
* `lib/`
* `shared/`
* `common/`
* `utils/`
* `helpers/`
* `core/`
* `misc/`

These names are too vague and weaken structural clarity.

If code is deployable, it belongs in `apps/`.
If code is reusable and shared, it belongs in `packages/`.
If content is durable explanation, it belongs in `docs/`.

---

## Structural rules

### Control-plane root only

The repository root is for coordination, not runtime sprawl.

Do not place app logic, package internals, or casual utility code at the root.

### Explicit families only

Top-level directories should exist only when they represent a real structural category with clear ownership.

Do not create new top-level families casually.

### App and package boundaries are not optional

The difference between `apps/` and `packages/` is foundational:

* apps are deployable surfaces
* packages are shared libraries

Do not blur that line for convenience.

### Canonical docs are separate from implementation

Documentation structure should stay distinct from implementation structure.

Do not bury canonical repo truth inside runtime directories.

---

## Alternatives considered

* **Root-level shared code folders** — rejected; creates ambiguity and weakens app and package boundaries
* **Single broad runtime tree with apps and packages mixed together** — rejected; harms navigation and boundary clarity
* **Multiple vague support folders at the root** — rejected; encourages drift and makes ownership unclear
* **Tool-specific docs as parallel structure sources** — rejected; canonical truth should stay in `docs/`, with adapters pointing back to it

---

## Trade-offs

This structure makes some things easier:

* locating where code belongs
* enforcing clear boundaries
* scaling the repo with less ambiguity
* guiding AI agents toward the right placement decisions
* keeping documentation and runtime concerns separate

It also makes some things harder:

* less freedom to drop quick shared code into convenient root folders
* more up-front discipline when deciding whether something belongs in an app or package
* more explicit documentation work when introducing a genuinely new structural category

These costs are intentional and preferable to long-term structural drift.

---

## What is deferred

The current top-level shape intentionally does not include:

* mobile app families
* extra admin or internal app families unless justified
* vague shared runtime buckets
* root-level planning or workflow files outside the approved docs system
* speculative new structural categories without a clear need

These can be introduced later only when a real architectural need exists.

---

## Related docs

* [`overview.md`](./overview.md)
* [`apps.md`](./apps.md)
* [`packages.md`](./packages.md)
* [`public-sites.md`](./public-sites.md)
* [`agent-tooling.md`](./agent-tooling.md)

---
