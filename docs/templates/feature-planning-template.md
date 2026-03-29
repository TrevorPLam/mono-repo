# feature-planning-template.md

Status: Template  
Date: 2026-03-24

## Purpose

Provide the standard planning template for feature-delivery work in this monorepo.

Use this template for `docs/features/<slug>/plan.md` when a task is substantial enough to need a bounded feature packet with explicit execution shape, sequencing, validation, and decision checkpoints.

This template is for **implementation planning**. It is not the canonical home for durable architecture truth.

---

## How to use this template

When creating a planning doc from this template:

- replace all placeholders
- keep the plan feature-scoped
- derive the plan from approved requirements
- separate execution phases from raw task lists
- call out decision points and risks explicitly
- link to canonical docs instead of copying policy
- keep the plan honest about what is known vs. still open

Do not leave template instructions in the final file.

---

# plan.md

Status: Active  
Date: `<YYYY-MM-DD>`

## Feature

`<feature-slug>`

## Planning summary

Summarize the intended execution shape for this feature.

State:

- what will be built or changed
- the expected implementation approach at a high level
- where the work will primarily live
- what the main sequencing logic is

Keep this short and execution-oriented.

---

## Inputs

List the documents or decisions this plan depends on.

Typical inputs:

- [`requirements.md`](./requirements.md)
- relevant canonical architecture docs
- relevant local `README.md`
- relevant local `AGENTS.md`
- prior approved feature packets
- approved design, content, or operational inputs

Use real relative links in the final file.

---

## Proposed execution shape

Describe the intended implementation shape in one or two short paragraphs.

Examples of what to cover:

- whether the work is app-local, package-local, or cross-surface
- whether it is mostly structural, UI, content, data, or operational
- whether it should be phased
- whether it touches shared boundaries

This section should orient the reader before the detailed phases.

---

## Scope checkpoints

List the boundaries that must remain true during execution.

Examples:

- visible composition stays app-local
- no new package creation without approval
- no auth activation in ordinary public-site work
- no DB requirement unless explicitly justified
- no vendor/platform expansion hidden inside implementation

This section keeps the plan aligned with architecture.

---

## Implementation phases

Break the work into bounded phases.

### Phase 1: `<phase name>`

Goal:

- `<goal 1>`
- `<goal 2>`

Expected outputs:

- `<output 1>`
- `<output 2>`

Notes:

- `<constraint, dependency, or sequencing note>`

### Phase 2: `<phase name>`

Goal:

- `<goal 1>`
- `<goal 2>`

Expected outputs:

- `<output 1>`
- `<output 2>`

Notes:

- `<constraint, dependency, or sequencing note>`

### Phase 3: `<phase name>`

Goal:

- `<goal 1>`
- `<goal 2>`

Expected outputs:

- `<output 1>`
- `<output 2>`

Notes:

- `<constraint, dependency, or sequencing note>`

Add or remove phases as needed. Keep them outcome-oriented.

---

## Work areas

List the repo areas likely to change.

Examples:

- `apps/<app-name>/...`
- `packages/<package-name>/...`
- `docs/...`
- `tests/...`

If useful, use a small table:

| Area | Why it changes | Expected blast radius |
|---|---|---|
| `<path-or-surface>` | `<reason>` | `<local/shared/broad>` |

This section should make the likely edit surface obvious.

---

## Dependencies and sequencing

Describe what must happen before other work can proceed.

Examples:

- local structure must be in place before UI composition
- contracts must be settled before integration wiring
- docs updates should happen alongside durable boundary changes
- validation should follow the narrowest-first rule unless blast radius widens

If there are blockers, name them explicitly.

---

## Open questions

List unresolved decisions that still matter to implementation.

Examples:

- `<open question 1>`
- `<open question 2>`
- `<open question 3>`

For each question, note whether it must be resolved:

- before implementation starts
- before a later phase
- before completion

Do not hide meaningful uncertainty.

---

## Risks

List the main implementation risks.

Examples:

- scope creep into adjacent architecture
- widening shared-package scope without justification
- hidden deployment or env changes
- unclear validation ownership
- content/design uncertainty blocking execution

If useful, use a small table:

| Risk | Why it matters | Mitigation |
|---|---|---|
| `<risk>` | `<impact>` | `<mitigation>` |

---

## Validation plan

Describe the expected validation shape.

Examples:

- start with filtered validation for the bounded target
- widen validation if shared packages or repo-wide settings are touched
- include accessibility checks where user-facing surfaces change
- include E2E only for critical flows where lower-layer validation is insufficient
- update docs alongside durable boundary changes

If helpful, note likely commands:

```bash
pnpm turbo lint --filter=<target>
pnpm turbo typecheck --filter=<target>
pnpm turbo test --filter=<target>
pnpm turbo build --filter=<target>
````

Keep this aligned with the repo command posture.

---

## Documentation plan

State what documentation should be updated as part of this work.

Examples:

* canonical architecture docs if durable truth changes
* local `README.md` or `AGENTS.md` files for affected subtrees
* reference docs if new durable inventory appears
* operations docs if the workflow changes
* adapter docs or skills only after canonical docs are aligned

This section helps prevent doc drift.

---

## Definition of implementation-ready

The plan is implementation-ready when all of the following are true:

* requirements are clear enough to act on
* work areas are known
* sequencing is understood
* major open questions are either resolved or explicitly deferred
* validation shape is known
* scope checkpoints are explicit
* no approval-sensitive change is being smuggled into execution

---

## Handoff to tasks

Once this plan is stable, break the work into `tasks.md`.

Tasks should be:

* concrete
* ordered where sequencing matters
* small enough to execute and review
* traceable back to phases and requirements

Do not let `tasks.md` drift away from this plan without updating the plan.

---

## Related docs

Link the most relevant docs for this plan.

Typical examples:

* [`requirements.md`](./requirements.md)
* relevant architecture docs
* relevant operations docs
* relevant reference docs
* local subtree docs

Use real relative links in the final file.

---

## Promotion note

If execution changes durable repo truth:

* update the relevant canonical doc in `docs/`
* update affected local `README.md` or `AGENTS.md`
* update adapter docs if needed
* update skills if a repeatable procedure changed

Do not leave durable truth trapped only in the plan.

---

## Template cleanup checklist

Before finalizing a plan created from this template:

* replace all placeholders
* remove template-only instructional text
* make phases concrete and outcome-oriented
* keep scope checkpoints explicit
* surface real open questions and risks
* convert all doc references into real relative markdown links
* align the validation plan with repo command posture
* keep the document feature-scoped and execution-ready
