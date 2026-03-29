# repo/docs/architecture/agent-tooling.md

Status: Accepted  
Date: 2026-03-24

## Purpose

Define the architectural posture for AI-agent and tool-facing documentation in this monorepo.

This document explains how canonical docs, `AGENTS.md` files, adapter docs, and skills relate to one another, where durable truth belongs, how scope should narrow across the repo, and which assumptions are intentionally deferred.

It is the source of truth for agent-tooling architecture, not a prompt-writing guide or vendor-specific setup tutorial.

---

## Architecture summary

The current posture is:

- the repo uses one canonical documentation layer, then thin adapters
- durable architectural and workflow truth belongs in `docs/`
- `AGENTS.md` files define operational rules for AI agents at root and subtree levels
- local agent docs should narrow scope rather than restate repo-wide truth
- adapter files such as `CLAUDE.md` or GitHub instruction files should stay thin and point back to canonical docs
- skills should encode repeatable procedures, not become parallel architecture sources of truth
- task packets in `docs/features/` are for substantial work, but durable decisions must be promoted into canonical docs

This model is optimized for clarity, low drift, explicit source-of-truth ordering, and predictable behavior for both human and AI-assisted contributors.

---

## Why this architecture exists

This architecture exists to preserve:

- one stable explanation layer for the repo
- explicit operating rules for AI agents without duplicating all documentation
- consistent narrowing from repo-wide guidance to subtree-specific constraints
- lower drift across vendor-specific instruction surfaces
- better navigation for contributors using different tools
- cleaner separation between architecture truth, operational rules, and repeatable procedures

The architecture is intentionally biased toward **canonical docs first, scoped agent rules second, thin adapters third, and procedural skills last**.

---

## Core model

### Canonical docs first

`docs/` is the canonical explanation layer for the repository.

That means durable truth about:

- architecture
- workflows
- reference material
- templates
- feature-delivery document structure

should live there first.

Canonical docs are where the repo explains what is true and why.

For the docs model more broadly, see [`../README.md`](../README.md) and [`overview.md`](./overview.md).

### `AGENTS.md` defines operating behavior

`AGENTS.md` files define how AI agents should behave when working in the repo.

They should:

- establish reading order
- define execution and validation expectations
- state change-control rules
- constrain subtree behavior where needed
- point back to canonical docs instead of duplicating them

`AGENTS.md` files are operational control surfaces, not the primary home of architecture truth.

### Override-file posture

`AGENTS.override.md` may be placed in a directory to temporarily override the canonical local `AGENTS.md` for that level.

Use it for:

- branch-specific tighter constraints
- short-lived behavioral adjustments that should not alter the permanent file
- temporary local instructions needed for bounded work

Do not use it to accumulate durable rules. If an override rule becomes permanent, promote it into the canonical `AGENTS.md` for that level.

### Adapter docs stay thin

Tool-specific files such as:

- `CLAUDE.md`
- `.github/copilot-instructions.md`
- `.github/instructions/*`

should remain thin adapters.

They may:

- point a tool toward the right canonical docs
- express narrow tool-specific constraints
- bridge repository expectations into a vendor-specific format

They should not become parallel policy systems.

### Skills are procedural

Skills should encode repeatable procedures and workflows.

They are appropriate for:

- recurring execution patterns
- document or repo procedures
- bounded operational playbooks
- tool-usable step sequences

They are not the canonical home for long-term architecture truth.

---

## Documentation precedence

The current precedence model is:

1. canonical docs in `docs/`
2. nearest relevant `AGENTS.md`
3. thin adapter docs
4. skills for repeatable procedure execution

This means:

- if a durable architectural rule changes, update `docs/` first
- if subtree operating behavior changes, update the nearest `AGENTS.md`
- if a tool adapter needs alignment, update it after canonical truth is correct
- if a repeatable procedure changes, update the relevant skill after the canonical and operational layers are aligned

A lower layer should not quietly contradict a higher layer.

---

## Scope-narrowing model

Agent guidance should narrow as location becomes more specific.

The default model is:

- root `AGENTS.md` defines repo-wide operating rules
- subtree `AGENTS.md` files define more local constraints
- local rules may narrow or specialize behavior for their subtree
- local rules should not silently overturn canonical repo architecture without corresponding canonical doc updates

This model exists to keep instructions:

- relevant
- bounded
- easier to follow
- less repetitive
- less likely to drift

More local guidance should usually be more specific, not more expansive.

---

## Root agent-doc posture

The root `AGENTS.md` should define:

- baseline reading order
- repo-wide change-control rules
- validation expectations
- structural guardrails
- escalation rules
- default stack posture where relevant

It should not try to restate the full architecture library.

The root file is the always-on behavioral layer for the repo, not a replacement for `docs/`.

---

## Local agent-doc posture

Local `AGENTS.md` files should explain the rules for a bounded subtree.

They should typically cover:

- what the subtree is for
- what belongs and does not belong there
- what docs should be read first for that subtree
- local validation expectations where they differ materially
- local constraints that are important for correct edits

They should not duplicate large amounts of root or canonical content without a strong reason.

A good local `AGENTS.md` makes the local boundary clearer. It does not become a second full repo manual.

---

## Adapter-doc posture

Adapter docs exist because tools differ in how they read repo instructions.

The repo may include thin adapter surfaces such as:

- `CLAUDE.md`
- GitHub instruction files
- mirrored skill directories for tool compatibility

These files should:

- stay short
- point back to canonical docs and the nearest `AGENTS.md`
- encode only the minimum vendor-specific adaptation needed
- avoid restating architecture truth in full

At minimum, a `CLAUDE.md` adapter should:

- reference the root `AGENTS.md` as the primary behavioral source
- note any tool-specific behavioral differences that materially affect usage
- avoid restating structural rules already defined in canonical docs

If a tool adapter becomes long or architecture-heavy, that usually signals misplaced truth.

---

## Skills posture

Skills should be used for **repeatable procedures**, not as a substitute documentation system.

Skills are appropriate when a workflow needs:

- bounded steps
- repeatable execution
- reusable instructions across tasks
- structured operational guidance for tools

Skills should not become the default location for:

- repo architecture
- package boundaries
- app-family strategy
- canonical workflow policy
- source-of-truth hierarchy

If a skill depends on a durable repo rule, that rule should already exist in canonical docs or the relevant `AGENTS.md`.

---

## Task-packet posture

Substantial or multi-session work should use task packets under `docs/features/<slug>/`.

These packets may include:

- requirements
- plan
- tasks
- handoff

Task packets are useful for execution tracking and bounded delivery work.

They are not the final resting place for durable architecture truth.

When a task packet produces a lasting repo decision, that truth should be promoted into canonical docs and, where needed, reflected in local `AGENTS.md`, adapters, or skills.

---

## Update-order posture

When a durable repo rule or workflow changes, update in this order:

1. canonical doc in `docs/`
2. affected local `README.md` or `AGENTS.md`
3. thin adapter docs where needed
4. skill docs where procedure changed

This prevents drift and makes source-of-truth order explicit.

Do not update only a lower layer and leave the canonical layer stale.

---

## Relationship to repo architecture

The agent-tooling layer sits on top of the repo architecture. It does not replace it.

That means:

- repo shape is still defined by canonical architecture docs
- app and package boundaries still come from canonical docs
- deployment, security, testing, and public-site posture still come from canonical docs
- agent docs and adapters only govern how contributors and tools should navigate and modify those systems

The agent-tooling layer is a control and interpretation layer, not a runtime architecture layer.

---

## Drift prevention rules

To prevent instruction drift:

- put durable truth in one canonical place first
- link instead of copying wherever possible
- keep adapter docs thin
- keep local `AGENTS.md` files bounded to their subtree
- treat skills as procedures, not architecture archives
- promote durable decisions out of task packets once settled

Drift usually happens when convenience copies accumulate across layers. This architecture explicitly resists that.

---

## What belongs where

### Put it in `docs/` when it is:

- durable
- repo-relevant
- explanatory
- architectural
- operationally canonical
- useful across multiple tools or contributors

### Put it in `AGENTS.md` when it is:

- an agent operating rule
- a reading-order rule
- a validation expectation
- a subtree behavior constraint
- a change-control instruction

### Put it in an adapter doc when it is:

- tool-specific
- format-specific
- minimal
- only needed to bridge the repo model into that tool

### Put it in a skill when it is:

- a repeatable procedure
- a reusable bounded workflow
- step-oriented operational guidance

### Put it in `docs/features/` when it is:

- active work planning
- task tracking
- delivery handoff
- feature-scoped execution material

---

## Alternatives considered

- **One giant root instruction file containing everything** — rejected; becomes bloated, expensive, and drift-prone
- **Vendor-specific docs as parallel truth systems** — rejected; creates contradiction and maintenance overhead
- **Skills as the primary architecture memory layer** — rejected; procedures and architecture truth are not the same thing
- **No local `AGENTS.md` files** — rejected; subtree-specific constraints need a bounded home
- **Task packets as permanent architecture storage** — rejected; delivery documents and canonical architecture serve different purposes

---

## Trade-offs

This architecture makes some things easier:

- finding the right source of truth
- keeping vendor-specific instruction layers thinner
- narrowing guidance as work becomes more local
- reducing duplication across doc types
- guiding AI agents toward more predictable repo behavior

It also makes some things harder:

- contributors must respect source-of-truth order rather than editing the nearest convenient file
- some information must be promoted deliberately rather than left where it first appeared
- thin adapter docs require discipline because they are tempting places to stash extra policy
- skills must remain constrained even when they seem like a convenient documentation surface

These trade-offs are intentional.

---

## What is deferred

The current posture intentionally defers:

- broad vendor-specific instruction systems with independent policy ownership
- skill-first repo architecture documentation
- oversized always-on agent context files that duplicate the docs tree
- speculative adapter layers for tools the repo is not actively using
- treating task packets as permanent architecture records

These are deferred, not forbidden.

---

## Related docs

- [`overview.md`](./overview.md)
- [`repo-shape.md`](./repo-shape.md)
- [`apps.md`](./apps.md)
- [`packages.md`](./packages.md)
- [`testing.md`](./testing.md)
- [`deployment-security.md`](./deployment-security.md)
- [`../README.md`](../README.md)