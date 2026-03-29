# docs/README.md

Canonical documentation entry point for this repository.

This directory is the stable documentation layer for the monorepo. It exists to keep architecture truth, workflows, reference material, and reusable templates in one place so local docs, adapter docs, and skills can stay thin and aligned.

---

## Purpose

Use `docs/` for documentation that should remain durable, repo-relevant, and easy to find.

This is where contributors should look for:

- stable architecture decisions
- operational workflows and runbooks
- reference and lookup material
- reusable authoring templates
- feature-delivery document structure

Do not use `docs/` as a dumping ground for temporary notes, scratch work, or tool-specific instruction duplicates.

---

## Documentation model

This repo uses **one canonical layer, then thin adapters**.

That means:

- `docs/` holds stable repo truth
- local `README.md` and `AGENTS.md` files explain and constrain a subtree
- root docs provide repo-wide orientation and baseline operating rules
- tool-specific files should point back here rather than restating policy
- skills should encode repeatable procedures, not architecture truth

If a rule or workflow is durable and repo-relevant, it should usually live here first.

---

## Directory structure

```text
docs/
├── README.md
├── architecture/
├── operations/
├── reference/
├── templates/
└── features/
````

---

## File naming convention

Documentation file names use kebab-case.

Examples:

* `repo-shape.md`
* `public-sites.md`
* `env-matrix.md`
* `runbook-template.md`

Avoid camelCase, PascalCase, and snake_case for doc file names.

---

## What belongs where

### `architecture/`

Use for stable design decisions and structural truths.

Examples:

* repo shape
* app model
* package boundaries
* public-site strategy
* design-system philosophy
* deployment and security posture
* testing strategy
* agent-tooling model

Architecture docs should explain:

* the current decision
* why it exists
* what it constrains
* what is intentionally deferred

Architecture docs should follow an ADR-lite structure.

Each architecture doc should include near the top:

* a status line, such as `Status: Accepted`, `Status: Superseded by <doc>`, or `Status: Deprecated`
* a decision date or last-confirmed date in ISO style when possible, such as `Date: 2026-03-24`

Guidance:

* use **decision date** when the document records a new or changed decision
* use **last confirmed** only when an existing decision was reviewed and reaffirmed without substantive change
* if both are useful, include both explicitly rather than combining them into one ambiguous line

If a decision is later superseded, the older doc should note the superseding doc rather than being deleted. Preserve the decision trail.

### `operations/`

Use for workflows, runbooks, and repeatable process guidance.

Examples:

* local development workflow
* creating a client site
* content publishing
* forms and lead handling
* environment and secrets process
* deployment and rollback expectations
* domains and cutovers
* DB migration posture
* syncing canonical docs, adapters, and skills

Operations docs should help someone do a thing correctly, not explain the entire architecture of the repo.

### `reference/`

Use for lookup, indexes, and scan-friendly reference material.

Examples:

* workspace index
* app index
* package index
* command reference
* env matrix
* glossary
* AI tooling matrix

Reference docs should be easy to scan, low-opinion, and kept current.

### `templates/`

Use for reusable document shells.

Examples:

* app README template
* package README template
* local AGENTS template
* runbook template
* feature requirements template
* feature planning template
* task template
* handoff template
* skill template

Templates should be short, opinionated, and aligned with canonical repo rules.

### `features/`

Use for feature-delivery documentation that sits between temporary execution work and stable architecture truth.

Examples:

* requirements
* implementation plan
* task breakdown
* handoff notes

Feature docs have three lifecycle states:

* **Active** — in planning or delivery
* **Shipped** — implementation is complete; durable decisions should be promoted into canonical docs where appropriate
* **Archived** — feature delivery detail is no longer active and should be moved out of the active feature workspace if archival structure is introduced

Do not leave feature docs in an effectively active state after the work has shipped. If a feature decision becomes durable repo policy, promote that truth into the appropriate canonical doc elsewhere in `docs/`.

---

## Relationship to other docs

For baseline repo reading order and doc precedence, see:

* [`../AGENTS.md`](../AGENTS.md)
* [`../README.md`](../README.md)
* [`../CONTRIBUTING.md`](../CONTRIBUTING.md)

Use local subtree docs for the most specific working constraints. Use tool adapters only as thin wrappers around canonical docs.

---

## Writing rules for docs in this directory

### Keep one job per document

A document in `docs/` should primarily do one thing:

* define architecture
* describe a workflow
* provide reference material
* provide a template
* describe feature-delivery structure

Do not mix multiple jobs into one file unless there is a clear reason.

### Link instead of copy

If truth already exists elsewhere in `docs/`, link to it rather than rewriting it.

Use short summaries where helpful, but avoid drifting duplicates.

### Prefer stable content

Docs here should favor:

* purpose
* ownership
* boundaries
* decision rules
* expected workflows
* related docs

Avoid turning canonical docs into changelogs, brainstorming notes, or temporary task scratchpads.

### Write for both humans and AI-assisted contributors

These docs should be readable by a human scanning the repo and explicit enough for an AI agent to follow correctly.

That means:

* use concrete headings
* prefer direct language
* keep scope obvious
* make update order and source-of-truth order explicit when relevant

### Keep examples realistic

Where examples are useful, use repo-shaped examples rather than generic placeholders.

---

## Canonical update order

When a durable rule or workflow changes, update docs in this order:

1. the relevant canonical doc in `docs/`
2. affected local `README.md` or `AGENTS.md`
3. thin adapter docs only if needed
4. skill docs only if the procedure changed

Do not update only an adapter doc and leave canonical docs stale.

---

## When to add a new doc here

Add a new canonical doc when:

* the information is durable enough to matter beyond one task
* multiple contributors or tools need the same guidance
* the topic does not belong only to one local subtree
* the information would otherwise be repeated across multiple files

Do not add a new doc here when:

* the content is temporary task planning
* the content belongs only to one app or package
* the content is tool-specific adapter guidance
* the content is better expressed as a skill procedure
* the content duplicates an existing canonical doc

---

## Suggested reading paths

### To understand the repo at a high level

1. [`architecture/overview.md`](architecture/overview.md)
2. [`architecture/repo-shape.md`](architecture/repo-shape.md)
3. [`architecture/apps.md`](architecture/apps.md)
4. [`architecture/packages.md`](architecture/packages.md)

### To understand current public-site strategy

1. [`architecture/public-sites.md`](architecture/public-sites.md)
2. [`architecture/design-system.md`](architecture/design-system.md)
3. [`architecture/seo-analytics-observability.md`](architecture/seo-analytics-observability.md)

### To understand workflows and operations

1. [`operations/local-development.md`](operations/local-development.md)
2. [`operations/create-client-site.md`](operations/create-client-site.md)
3. [`operations/content-publishing.md`](operations/content-publishing.md)
4. [`operations/deployment-and-rollbacks.md`](operations/deployment-and-rollbacks.md)

### To look something up quickly

1. [`reference/workspace-index.md`](reference/workspace-index.md)
2. [`reference/app-index.md`](reference/app-index.md)
3. [`reference/package-index.md`](reference/package-index.md)
4. [`reference/commands.md`](reference/commands.md)
5. [`reference/env-matrix.md`](reference/env-matrix.md)

### To author new docs consistently

1. [`templates/runbook-template.md`](templates/runbook-template.md)
2. [`templates/agents-template.md`](templates/agents-template.md)
3. [`templates/app-readme-template.md`](templates/app-readme-template.md)
4. [`templates/package-readme-template.md`](templates/package-readme-template.md)
5. [`templates/feature-planning-template.md`](templates/feature-planning-template.md)
6. [`templates/skill-template.md`](templates/skill-template.md)

---

## Maintenance rule

If a canonical document is no longer the right source of truth, move or consolidate the truth rather than leaving conflicting files behind.

---

## Final rule

Treat `docs/` as the canonical explanation layer for the repo.

Put durable truth here once. Let local docs narrow it. Let adapters point to it. Let skills operationalize it.

---