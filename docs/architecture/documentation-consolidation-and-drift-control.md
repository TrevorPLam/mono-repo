# repo/docs/architecture/documentation-consolidation-and-drift-control.md

Status: Accepted
Date: 2026-03-25

## Purpose

Define how this repository consolidates documentation and prevents documentation drift.

This document establishes:

* the source-of-truth hierarchy
* what duplication is allowed and forbidden
* how durable truth moves between canonical docs, local docs, adapter docs, skills, and feature/task docs
* what maintenance rules and automation should exist to keep the documentation corpus aligned

It is the canonical policy for documentation consolidation and drift control. It is not a style guide, PR template, or one-off cleanup checklist.

## Why this document exists

This repo already defines the correct documentation model: one canonical layer in `docs/`, then narrower local docs, then thin adapters, then skills.  

The remaining problem is drift between documents that were written at different stages of planning. Current examples include:

* partial package inventories in root and reference docs that do not match the newer working reference
* older root-level canonical planning material that still assumes now-deferred app surfaces
* overlapping “source of truth” documents outside the main canonical docs layer

This policy exists to stop that pattern from continuing.

## Core decision

The repo uses **one canonical truth owner per durable fact**.

That means:

* every durable rule, boundary, workflow, inventory, or policy must have one primary canonical home
* lower layers may summarize or narrow that truth, but may not silently redefine it
* if the same truth appears in more than one durable place, one of those places is wrong, stale, or too broad

Consolidation means reducing authority duplication, not forcing every useful local document to disappear.

## Documentation hierarchy

The hierarchy is:

1. canonical docs in `docs/`
2. nearest relevant local `README.md` or `AGENTS.md`
3. thin adapter docs
4. skills
5. feature or task documents as temporary execution material

This matches the repo’s existing model and is non-negotiable.  

## Canonical ownership rules

### `docs/architecture/`

Owns stable design decisions, boundaries, structural posture, and cross-cutting architecture.

Examples:

* repo shape
* app model
* package model
* design-system posture
* deployment/security posture
* testing posture
* documentation architecture and drift policy

### `docs/operations/`

Owns repeatable workflows and runbooks.

Examples:

* creating a client site
* content publishing
* deployment and rollback
* environment/secrets handling
* syncing canonical docs, local docs, adapters, and skills

### `docs/reference/`

Owns lookup material, inventories, indexes, and scan-friendly summaries.

Examples:

* workspace index
* app index
* package index
* command reference
* env matrix
* glossary

### `docs/templates/`

Owns reusable authoring shells only.

### `docs/features/`

Owns active planning, implementation, and handoff material. Durable truth discovered here must be promoted into the proper canonical doc when settled.  

## Allowed duplication

The following duplication is allowed:

* short local summaries that point back to the canonical doc
* subtree-specific narrowing in local `README.md` and `AGENTS.md`
* tool-specific bridging text in adapter docs
* procedure text in skills, when the durable rule already exists canonically
* scan-friendly reference summaries that intentionally mirror canonical docs at a high level

Allowed duplication must be:

* shorter than the canonical source
* explicitly subordinate to it
* phrased as orientation or narrowing, not redefinition

## Forbidden duplication

The following duplication is forbidden:

* a second “source of truth” for the same architecture rule
* long copies of canonical policy text in `AGENTS.md`
* adapter docs that restate full repo architecture
* skills that become architecture archives
* reference docs that silently diverge from the canonical architecture or operations docs
* root or package/app docs that define durable policy already owned by canonical docs

If a document becomes long because it is carrying another document’s job, it should be split or reduced.

## Source-of-truth mapping rule

Every durable topic should have one explicit owner.

Minimum high-value owners now:

* repo structure → `docs/architecture/repo-shape.md`
* overall architecture → `docs/architecture/overview.md`
* app model → `docs/architecture/apps.md`
* package model → `docs/architecture/packages.md`
* public-site posture → `docs/architecture/public-sites.md`
* design-system posture → `docs/architecture/design-system.md`
* testing posture → `docs/architecture/testing.md`
* deployment/security posture → `docs/architecture/deployment-security.md`
* agent/tooling hierarchy → `docs/architecture/agent-tooling.md`
* documentation drift policy → this document
* package inventory → `docs/reference/package-index.md`
* app inventory → `docs/reference/app-index.md`
* workspace inventory → `docs/reference/workspace-index.md`

If a durable topic has no clear owner, that is a documentation bug.

## Consolidation rules

When multiple docs overlap, resolve them using this order:

### 1. Keep the best canonical owner

Prefer the document that:

* is in `docs/`
* has the correct job
* matches the current accepted repo direction
* is easier to keep current
* has the narrowest truthful scope

### 2. Demote or trim the duplicates

Do one of the following:

* replace with a short summary plus links
* mark as superseded
* remove conflicting sections
* convert into a reference summary if that is its real role

### 3. Preserve history without preserving conflict

Do not keep an older doc looking active if it has been superseded. The older doc should explicitly say so, or its durable truth should be absorbed and the old file retired.

This follows the repo’s existing rule that superseded architecture docs should point to the newer source rather than leaving silent conflict behind. 

## Drift signals

Treat these as documentation smell:

* “final source of truth” files outside the main canonical docs layer
* one file saying “current” and another saying “planned” for the same thing without clear lifecycle language
* package or app inventories that omit accepted bounded surfaces
* root docs that contain architecture depth better owned by `docs/architecture/`
* reference docs that contain policy language instead of summary language
* local `AGENTS.md` files that read like a second architecture manual
* feature/task docs that still hold settled durable rules

## Required metadata for canonical docs

Canonical docs should carry enough metadata to make drift obvious.

Minimum for architecture docs:

* Status
* Date or Last confirmed
* clear Purpose
* related docs when helpful

This is already the repo’s pattern and should remain so. 

For high-change operational and reference docs, add “Status: Active” when useful.

## Docs-as-code operating rules

Treat documentation like code:

* update durable docs in the same change as the durable implementation or policy change
* review documentation changes in PRs
* prefer small, reviewable updates
* never update only a lower layer if the canonical layer changed

This is consistent with the repo’s contribution rules and with current docs-as-code best practice.  ([writethedocs.org][2])

## Content-shaping rule

Use the current repo folder taxonomy, but shape content with Diátaxis principles.

That means:

* architecture docs should primarily explain
* runbooks should primarily tell someone how to do something
* reference docs should remain lookup-oriented
* tutorials, if later needed, should be distinct from architecture and runbooks

Do not replace the repo’s current `architecture/`, `operations/`, `reference/`, `templates/`, `features/` structure. Use Diátaxis to improve content discipline inside it.  ([Diátaxis][1])

## Automation requirements

The repo should add anti-drift automation in stages.

### Stage 1: baseline checks

* markdown linting or equivalent structural checks
* broken-link checking
* forbidden-placeholder scanning
* filename convention checks
* required metadata checks for canonical docs

### Stage 2: prose and terminology checks

Use Vale or an equivalent style-linting layer for:

* terminology consistency
* heading consistency
* passive/hedged language where undesirable
* banned phrases
* style-guide enforcement

Vale is a strong fit because it is explicitly designed for configurable prose linting and supports GitHub Actions. ([Vale][3])

### Stage 3: drift-specific checks

Add custom checks for:

* duplicate or near-duplicate canonical doc titles
* “source of truth” language outside approved canonical surfaces
* stale files marked canonical after being superseded
* inventory mismatches between architecture docs and reference indexes
* feature docs that remain active after shipping without promotion of durable decisions

## Review and governance rules

For durable documentation changes:

* canonical docs change first
* local docs update second if narrowing behavior changed
* adapter docs update third if tool-specific alignment is needed
* skills update fourth if procedure changed

That rule is already part of the repo model and should remain explicit.  

For higher-signal review:

* changes to architecture docs should receive deliberate review
* changes to shared reference docs should be checked for consistency with architecture docs
* local docs should be reviewed for unnecessary copied policy text

## Enterprise and advanced options

If the repo later needs stronger documentation operations, the escalation path is:

* Git-native docs with stricter review gates first
* reusable content/fragments only for truly repeated normative text
* corpus-wide quality scoring and audits
* search-driven maintenance from analytics
* catalog-linked docs only if the repo evolves into a broader internal platform

That matches where the enterprise tooling market is strongest today: GitBook for reusable content and merge rules, ReadMe for lint-plus-audit scoring, Read the Docs for search analytics, and Backstage TechDocs when docs need to be attached to a software catalog. ([GitBook][5])

## What is not justified now

The repo should not currently adopt as the primary solution:

* a separate external platform as the canonical home for architecture truth
* heavy docs versioning by default
* skill-first architecture storage
* giant always-on instruction files that duplicate the docs tree
* reusable-content machinery for every repeated sentence

That would add process before the repo has stabilized enough to justify it. Current guidance from Docusaurus also supports being conservative about versioning unless there is a real need. ([Docusaurus][4])

## Immediate cleanup plan

Apply this policy first to the currently visible drift:

1. choose one canonical root/platform baseline and demote conflicting older root “source of truth” files
2. align root README, workspace index, and package index to the accepted current package and app inventory
3. explicitly retire or supersede docs that still imply `site-platform`, `app-booking`, or other currently deferred surfaces as active defaults
4. add this document under `docs/operations/` or `docs/architecture/` depending on whether you want it treated primarily as workflow policy or documentation architecture
5. add a docs-maintenance checklist to PR review and future CI

## Final rule

Put durable truth in one place.
Let local docs narrow it.
Let adapters point to it.
Let skills operationalize it.
Delete or demote anything that tries to be a second canonical owner.