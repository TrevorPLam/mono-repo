# feature-requirements-template.md

Status: Template  
Date: 2026-03-24

## Purpose

Provide the standard requirements template for feature-delivery work in this monorepo.

Use this template for `docs/features/<slug>/requirements.md` when a task is substantial enough to need a bounded feature packet with explicit scope, goals, constraints, and acceptance criteria.

This template is for **feature-scoped requirements**. It is not the canonical home for durable architecture truth.

---

## How to use this template

When creating a requirements doc from this template:

- replace all placeholders
- keep the document feature-scoped
- describe the real problem and intended outcome
- link to canonical architecture docs instead of copying them
- separate requirements from implementation details
- make non-goals explicit
- make acceptance criteria concrete

Do not leave template instructions in the final file.

---

# requirements.md

Status: Active  
Date: `<YYYY-MM-DD>`

## Feature

`<feature-slug>`

## Summary

Provide a short summary of the feature.

State:

- what the feature is
- why it exists
- who or what it serves
- what change it is expected to produce

Keep this short and plain.

---

## Problem

Describe the problem this feature is solving.

Include:

- what is not working, missing, or unclear today
- why the issue matters
- what risk, friction, or missed opportunity exists if it is not addressed

This section should explain the need, not the implementation.

---

## Goal

State the primary goal of the feature in one or two short paragraphs.

A good goal is:

- outcome-focused
- bounded
- understandable without implementation detail

Example prompts:

- What should be true after this work is complete?
- What user, operator, or business outcome should improve?
- What should this feature enable that is not enabled now?

---

## In scope

List what this feature includes.

Examples:

- `<scope item 1>`
- `<scope item 2>`
- `<scope item 3>`

Only include work that is truly part of this feature.

---

## Out of scope

List what this feature explicitly does not include.

Examples:

- `<non-goal 1>`
- `<non-goal 2>`
- `<non-goal 3>`

This section is important for preventing feature creep.

---

## Users or primary consumers

Describe who will use or be affected by this feature.

Examples:

- internal operator
- repo contributor
- public-site visitor
- client-site maintainer
- AI-assisted contributor
- deployment or operations workflow owner

If there is more than one consumer, name the primary one.

---

## Preconditions and assumptions

List the assumptions that must be true for this feature to make sense.

Examples:

- `<assumption 1>`
- `<assumption 2>`
- `<assumption 3>`

Include only assumptions that materially shape the feature.

---

## Constraints

List the architectural, product, workflow, or delivery constraints that apply.

Examples:

- must follow current public-site posture
- must keep visible composition app-local
- must not introduce auth into ordinary public-site work
- must not require a new package without approval
- must preserve current deployment boundaries

Link to canonical docs where helpful.

---

## Functional requirements

List the required behaviors or outputs of the feature.

Use numbered items when order or traceability matters.

1. `<functional requirement 1>`
2. `<functional requirement 2>`
3. `<functional requirement 3>`

Each requirement should be:

- testable
- concrete
- feature-scoped
- understandable without guessing

---

## Non-functional requirements

List quality requirements that matter for this feature.

Examples:

- performance expectations
- accessibility expectations
- maintainability expectations
- documentation expectations
- observability expectations
- security expectations

Example format:

- `<non-functional requirement 1>`
- `<non-functional requirement 2>`
- `<non-functional requirement 3>`

Only include requirements that actually matter for the feature.

---

## UX or content requirements

Include this section when the feature affects user-facing experience, content, or authoring flow.

Examples:

- `<UX requirement 1>`
- `<content requirement 1>`
- `<content requirement 2>`

Remove this section if not relevant.

---

## Data, auth, and integration considerations

Include this section when the feature touches persistence, auth, or external systems.

Describe only what is relevant:

- whether data persistence is needed
- whether auth is required
- whether integrations are required
- whether secrets or env values are involved
- whether any existing boundary must be respected

Keep this requirement-level, not implementation-level.

Remove this section if not relevant.

---

## Dependencies

List the things this feature depends on.

Examples:

- existing package capability
- prior architecture decision
- another feature packet
- external service availability
- approved content or design input

Use bullets or a short table.

---

## Risks and edge cases

List the meaningful risks, edge cases, or failure conditions.

Examples:

- `<risk 1>`
- `<risk 2>`
- `<edge case 1>`
- `<edge case 2>`

This section should help shape the later plan and task breakdown.

---

## Acceptance criteria

List the conditions that must be true for the feature to be considered complete.

Examples:

- `<acceptance criterion 1>`
- `<acceptance criterion 2>`
- `<acceptance criterion 3>`
- `<acceptance criterion 4>`

Acceptance criteria should be concrete and verifiable.

They should describe outcomes, not just activity.

---

## Deliverables

List the expected outputs of the feature work.

Examples:

- code changes in a bounded app or package
- updated local docs
- updated canonical docs
- updated reference docs
- tests or validation updates
- rollout-ready configuration

Keep this aligned with the actual feature scope.

---

## Validation expectations

Describe the kind of validation this feature will likely require.

Examples:

- narrow app validation
- shared-package validation
- E2E validation for critical flows
- documentation review
- accessibility checks
- broader workspace checks if shared boundaries are touched

This section can stay high-level. The exact commands usually belong in `plan.md` or `tasks.md`.

---

## Related docs

Link the most relevant docs for the feature.

Typical examples:

- relevant architecture docs
- relevant operations docs
- relevant reference docs
- local subtree docs
- related feature packets

Use real relative links in the final file.

---

## Promotion note

If this feature creates or changes durable repo truth:

- update the relevant canonical doc in `docs/`
- update affected local `README.md` or `AGENTS.md`
- update adapter docs if needed
- update skills if a repeatable procedure changed

Do not leave durable truth trapped only in the feature packet.

---

## Template cleanup checklist

Before finalizing a requirements doc created from this template:

- replace all placeholders
- remove template-only instructional text
- keep implementation detail out of requirements
- make scope and non-goals explicit
- make acceptance criteria concrete
- convert all doc references into real relative markdown links
- keep the document feature-scoped and readable