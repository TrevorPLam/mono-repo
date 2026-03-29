# repo/README.md

# Marketing Firm Mono Repository - Your Dedicated Marketer

A pnpm + Turborepo monorepo for a digital marketing firm. It is designed to ship the firm's public website and real client websites as separate apps, supported by shared packages for cross-cutting concerns like design tokens, UI primitives, SEO, analytics, observability, and testing.

> **Status**
>
> This repository is being deliberately planned and documented before broad implementation.
> Some paths and conventions described here are canonical structure decisions, not a claim that every app, package, workflow, or automation is already fully built.

---

## What this repo is for

This repo exists to support:

- the firm's public website
- real client websites as separate apps
- shared technical foundations used across those sites
- a canonical documentation system for humans
- future protected or internal app surfaces only when justified by real workflow needs

The current delivery posture is:

- Astro-first
- public sites first
- code/content-file-first
- shared packages kept narrow and intentional
- protected/internal apps deferred until justified

---

## Prerequisites

Before working in this repo, use the current supported toolchain:

- Node.js: 22.x
- pnpm: 10.x
- Git

For environment setup and command lookup, see:

- `docs/reference/commands.md`
- `docs/reference/env-matrix.md`
- `docs/operations/environment-and-secrets.md`

---

## Quick start

```bash
git clone <repo-url>
cd <repo-folder>
pnpm install
pnpm turbo build
pnpm turbo test

For app-specific or package-specific commands, check the nearest local docs and the command reference in docs/reference/commands.md.

⸻

Current scope

In scope now
	•	the firm’s public site
	•	real client sites as separate apps
	•	shared packages for reusable cross-cutting concerns
	•	local-first content and blog/resource publishing for public sites
	•	foundational documentation, deployment structure, and operational runbooks

Deferred until justified
	•	client portals
	•	broad internal/admin apps
	•	heavy CMS-driven editing systems
	•	speculative abstractions
	•	product-style authenticated surfaces without a real workflow need
	•	broad business-ops systems built before repeated operational need is proven

⸻

Repository structure

.
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── CONTRIBUTING.md
├── apps/
│   ├── README.md
│   ├── AGENTS.md
│   ├── site-firm/
│   └── sites/
│       ├── README.md
│       ├── AGENTS.md
│       └── clients/
│           ├── README.md
│           ├── AGENTS.md
│           └── _template/
├── packages/
│   ├── README.md
│   ├── AGENTS.md
│   ├── contracts/
│   ├── env/
│   ├── design-tokens/
│   ├── ui/
│   ├── seo-core/
│   ├── seo-astro/
│   ├── analytics/
│   ├── observability/
│   └── testing/
├── docs/
│   ├── README.md
│   ├── architecture/
│   ├── operations/
│   ├── reference/
│   ├── templates/
│   └── features/
├── infra/
├── scripts/
├── tests/
├── .github/
│   ├── copilot-instructions.md
│   └── instructions/
├── .claude/
│   └── skills/
└── .agents/
    └── skills/


⸻

Directory map

Path	Purpose
apps/	Deployable applications only
packages/	Shared libraries only
docs/	Canonical documentation library
infra/	Infrastructure-related material
scripts/	Justified operational and maintenance scripts
tests/	Repo-level and cross-app testing surfaces
.github/	GitHub automation and thin tool-specific instructions
.claude/skills/	Skill procedures for Claude-style usage
.agents/skills/	Mirrored skill procedures for OpenAI/Codex-style usage


⸻

Package map

Package	Purpose
contracts/	Shared schemas, types, and boundary contracts
env/	Environment variable validation and typed access
design-tokens/	Shared token system for design primitives and themes
ui/	Reusable UI primitives and low-level presentational building blocks
seo-core/	Framework-agnostic SEO policy and resolution logic
seo-astro/	Astro adapter layer for shared SEO behavior
analytics/	Shared analytics instrumentation and event handling support
observability/	Logging, tracing, telemetry, and operational diagnostics support
testing/	Shared testing utilities and test-support infrastructure


⸻

Documentation model

This repo uses one canonical documentation layer, then thin adapters.

Canonical sources
	•	docs/architecture/ — stable system decisions
	•	docs/operations/ — workflows and runbooks
	•	docs/reference/ — indexes and lookup docs
	•	docs/templates/ — reusable document shells
	•	docs/features/ — feature-delivery document structure

Root docs
	•	README.md — human orientation
	•	CONTRIBUTING.md — human contribution workflow
	•	AGENTS.md — root agent operating rules

Local docs

Local README.md and AGENTS.md files explain and constrain specific subtrees.

Adapter docs

Files like CLAUDE.md and GitHub instruction files should remain thin and point back to canonical docs.

⸻

Where to start

To understand the repo

Read:
	1.	README.md
	2.	docs/README.md
	3.	docs/architecture/overview.md
	4.	docs/architecture/repo-shape.md

To work in an app

Read:
	1.	the nearest app README.md
	2.	the nearest app AGENTS.md
	3.	docs/architecture/apps.md
	4.	docs/architecture/public-sites.md

To work in a package

Read:
	1.	packages/README.md
	2.	packages/AGENTS.md
	3.	the package’s local README.md
	4.	the package’s local AGENTS.md
	5.	docs/architecture/packages.md

To contribute a change

Read:
	1.	CONTRIBUTING.md
	2.	the nearest local docs
	3.	any relevant canonical docs in docs/

⸻

License and usage

Unless an explicit license file says otherwise, treat this repository as private and proprietary.

Do not assume open-source usage rights.