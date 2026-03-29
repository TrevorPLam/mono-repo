# tasks-template.md

Status: Template  
Date: 2026-03-24

## Purpose

Provide the standard task-breakdown template for feature-delivery work in this monorepo.

Use this template for `docs/features/<slug>/tasks.md` when a feature packet needs a concrete execution checklist derived from approved requirements and plan documents.

This template is for **task execution tracking**. It is not the canonical home for durable architecture truth.

---

## How to use this template

When creating a tasks doc from this template:

- replace all placeholders
- derive tasks from `requirements.md` and `plan.md`
- keep tasks concrete and execution-ready
- separate phases, milestones, and individual tasks clearly
- make task ordering explicit where sequencing matters
- keep tasks small enough to execute and review
- link to canonical docs instead of copying policy

Do not leave template instructions in the final file.

---

# tasks.md

Status: Active  
Date: `<YYYY-MM-DD>`

## Feature

`<feature-slug>`

## Task summary

Summarize what this task list is for.

State:

- what feature or change this task list supports
- whether the work is app-local, package-local, or cross-surface
- whether there are major sequencing constraints
- what counts as finishing the task list

Keep this short and execution-oriented.

---

## Inputs

This task list should usually be based on:

- [`requirements.md`](./requirements.md)
- [`plan.md`](./plan.md)
- relevant canonical architecture docs
- relevant local `README.md`
- relevant local `AGENTS.md`

Use real relative links in the final file.

---

## Task status legend

Use a simple status model consistently.

| Marker | Meaning |
|---|---|
| `[ ]` | Not started |
| `[-]` | In progress |
| `[x]` | Complete |
| `[!]` | Blocked or needs decision |

Do not mark work complete unless the task outcome is actually done.

---

## Scope checkpoints

These conditions must remain true while executing the task list:

- `<scope checkpoint 1>`
- `<scope checkpoint 2>`
- `<scope checkpoint 3>`

Examples:

- visible composition stays app-local
- no new package creation without approval
- no auth activation in ordinary public-site work
- no DB requirement unless explicitly justified
- no hidden vendor or deployment expansion

This section helps prevent task-level scope drift.

---

## Milestones

Break the work into a few bounded milestones.

### Milestone 1: `<milestone name>`

Goal:

- `<goal 1>`
- `<goal 2>`

Completion signal:

- `<completion signal>`

### Milestone 2: `<milestone name>`

Goal:

- `<goal 1>`
- `<goal 2>`

Completion signal:

- `<completion signal>`

### Milestone 3: `<milestone name>`

Goal:

- `<goal 1>`
- `<goal 2>`

Completion signal:

- `<completion signal>`

Add or remove milestones as needed.

---

## Task breakdown

### Milestone 1: `<milestone name>`

- [ ] `<task 1>`
- [ ] `<task 2>`
- [ ] `<task 3>`

Notes:

- `<important sequencing or boundary note>`

### Milestone 2: `<milestone name>`

- [ ] `<task 1>`
- [ ] `<task 2>`
- [ ] `<task 3>`

Notes:

- `<important sequencing or boundary note>`

### Milestone 3: `<milestone name>`

- [ ] `<task 1>`
- [ ] `<task 2>`
- [ ] `<task 3>`

Notes:

- `<important sequencing or boundary note>`

Tasks should describe observable work, not vague intent.

Good task qualities:

- one bounded action
- clear completion state
- traceable to the plan
- small enough to review

---

## Decision checkpoints

List the places where execution may need a stop-and-decide checkpoint.

Examples:

- [ ] confirm a local structure choice before broader implementation
- [ ] confirm a shared-boundary change before extracting code
- [ ] confirm validation scope if blast radius widens
- [ ] confirm doc-promotion need if durable truth changes

Use this section when a task list includes meaningful branch points.

---

## Validation tasks

Include the validation work needed before the feature is considered complete.

Typical example:

- [ ] run filtered lint for the affected target
- [ ] run filtered typecheck for the affected target
- [ ] run filtered test for the affected target
- [ ] run filtered build for the affected target if build validation is warranted
- [ ] widen validation if shared or repo-wide blast radius exists
- [ ] record honestly what was run and what was skipped

If specific commands help, include them in a closed code fence:

```bash id="kjwrjc"
pnpm turbo lint --filter=<target>
pnpm turbo typecheck --filter=<target>
pnpm turbo test --filter=<target>
pnpm turbo build --filter=<target>
````

Keep validation aligned with the repo command posture.

---

## Documentation tasks

Include the documentation work needed as part of execution.

Examples:

* [ ] update canonical docs if durable truth changes
* [ ] update affected local `README.md`
* [ ] update affected local `AGENTS.md`
* [ ] update reference docs if durable inventory changes
* [ ] update adapter docs if needed after canonical docs are aligned
* [ ] update skills if a repeatable procedure changed

This section helps prevent implementation-only completion.

---

## Blockers and dependencies

Track anything currently blocking or constraining execution.

| Item                      | Type                            | Status            | Notes    |
| ------------------------- | ------------------------------- | ----------------- | -------- |
| `<dependency-or-blocker>` | `<dependency/blocker/approval>` | `<open/resolved>` | `<note>` |

Use this section only when it adds real clarity.

---

## Completion checklist

This task list is complete when all of the following are true:

* [ ] all required milestone tasks are complete
* [ ] validation tasks are complete or honestly recorded as skipped
* [ ] documentation tasks are complete where required
* [ ] no unresolved blocker remains for the intended scope
* [ ] outputs match the approved requirements and plan
* [ ] no approval-sensitive change was smuggled into execution

---

## Handoff note

When the task list is complete:

* update `handoff.md` with the final state
* note what was completed
* note what was intentionally deferred
* note what validation ran
* note any doc promotion that occurred
* note any remaining follow-up work

Do not let the task list be the only record of what happened.

---

## Related docs

Link the most relevant docs for this task list.

Typical examples:

* [`requirements.md`](./requirements.md)
* [`plan.md`](./plan.md)
* relevant architecture docs
* relevant operations docs
* relevant reference docs
* local subtree docs

Use real relative links in the final file.

---

## Template cleanup checklist

Before finalizing a tasks doc created from this template:

* replace all placeholders
* remove template-only instructional text
* make tasks concrete and checkable
* keep milestones aligned with the plan
* make sequencing explicit where needed
* convert all doc references into real relative markdown links
* include validation and documentation tasks where applicable
* keep the task list execution-ready and honest