# agents-template.md

Status: Template  
Date: 2026-03-24

## Purpose

Provide the standard local `AGENTS.md` template for a bounded subtree in this monorepo.

Use this template for local agent-operating files inside areas such as `apps/`, `apps/sites/`, `apps/sites/clients/`, `packages/`, or individual app and package directories.

This template is for **behavioral and boundary guidance**. It is not the canonical home for architecture truth.

---

## How to use this template

When creating a local `AGENTS.md`:

- replace all placeholders
- delete sections that truly do not apply
- keep the file short and specific to the subtree
- narrow the scope relative to parent `AGENTS.md` files
- link to canonical docs instead of copying architecture policy
- describe the subtree as it actually exists, not as a wishlist

Do not leave template instructions in the final file.

---

# AGENTS.md

Local operating instructions for AI agents working in `<subtree-path>`.

Read this file after the parent `AGENTS.md` files and before editing this subtree.

This file narrows repo-wide rules for this subtree. It does not replace canonical docs in `docs/`.

---

## Scope

This file applies to:

```text
<subtree-path>
````

Examples:

```text
apps/
```

```text
apps/sites/
```

```text
apps/sites/clients/
```

```text
apps/site-firm/
```

```text
packages/
```

```text
packages/ui/
```

If a deeper local `AGENTS.md` exists, that deeper file may add more specific constraints for its own subtree.

---

## What this subtree is for

Describe the purpose of this subtree in one or two short paragraphs.

Include:

* what belongs here
* what does not belong here
* what kind of work is normal here
* what kind of work should be treated as out of scope or escalation-worthy

Example prompts:

* Is this a grouping layer, a real runtime surface, or a shared-library area?
* Does this subtree mainly hold apps, packages, templates, docs, or support material?
* What common placement mistakes should agents avoid here?

---

## Read before editing

Read in this order before changing this subtree:

1. the parent `AGENTS.md`
2. this local `AGENTS.md`
3. the nearest local `README.md`
4. the most relevant canonical docs for this subtree

Typical canonical docs to link here:

* `<relative-path-to-docs-architecture-overview>`
* `<relative-path-to-docs-architecture-apps-or-packages>`
* `<relative-path-to-other-relevant-canonical-docs>`

Use real relative links in the final file.

---

## Local boundary rules

List the most important subtree-specific boundaries.

Examples:

* keep visible public-site composition local to the app
* do not create new shared packages from this subtree without approval
* do not treat templates as production implementation
* do not move client-specific behavior into shared packages
* keep this subtree focused on deployable surfaces only
* keep this subtree focused on shared-library code only

Keep this section short and specific.

---

## Always

List the behaviors that should always happen in this subtree.

Typical examples:

* read the nearest local docs before editing
* prefer the smallest valid change
* preserve existing local structure unless change is justified
* update local docs when durable local rules change
* use shared packages only through supported public APIs
* keep app-local composition inside the app
* keep package APIs narrow and explicit

Only include rules that are truly relevant to this subtree.

---

## Never

List the local anti-patterns for this subtree.

Typical examples:

* do not invent new local structure when the subtree already defines it
* do not place shared code here if it belongs in `packages/`
* do not place app-specific composition in shared-library areas
* do not turn this subtree into a dumping ground for temporary work
* do not hardcode secrets or credentials
* do not widen scope casually

This section is usually more useful when it is concrete.

---

## Validation

Document the narrowest normal validation expectations for this subtree.

Examples:

```bash
pnpm turbo lint --filter=<target>
pnpm turbo typecheck --filter=<target>
pnpm turbo test --filter=<target>
pnpm turbo build --filter=<target>
```

Guidance you may include:

* start with filtered validation
* widen validation when shared or cross-surface impact exists
* run `build` last when build validation is warranted
* do not claim commands passed unless they were actually run

If this subtree has special validation rules, state them briefly.

---

## Common tasks in this subtree

List the kinds of work agents will commonly do here.

Examples:

* create a new client site from the approved template
* update app-local sections and content wiring
* refine shared primitives without widening package scope
* update local docs for a bounded surface
* add or update package exports within existing boundaries

This helps keep edits aligned with the subtree’s real purpose.

---

## Escalate before doing any of the following

List the local changes that should trigger escalation.

Typical examples:

* creating a new package
* creating a new app family
* changing auth posture
* introducing DB-required runtime behavior
* adding a new vendor or paid service
* widening a shared package’s purpose
* changing deployment structure
* introducing a new top-level folder under this subtree
* deviating from the approved template or local contract

This section should reflect real local risk, not generic caution.

---

## Override-file note

`AGENTS.override.md` may temporarily override this file for branch-specific or short-lived work in this subtree.

Do not treat override files as the permanent home of durable rules.

If an override becomes durable, promote it into this canonical local `AGENTS.md`.

---

## Related docs

Link the most relevant docs for this subtree.

Typical examples:

* parent `AGENTS.md`
* local `README.md`
* canonical architecture docs
* relevant operations docs
* relevant reference docs
* relevant templates

Use real relative links in the final file.

---

## Template cleanup checklist

Before finalizing a local `AGENTS.md` created from this template:

* replace all placeholders
* remove template-only instructional text
* confirm the subtree path is correct
* keep only sections that actually apply
* make sure the file narrows parent rules instead of duplicating them
* convert all doc references into real relative markdown links
* keep the file short, concrete, and behavioral