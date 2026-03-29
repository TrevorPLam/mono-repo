# runbook-template.md

Status: Template  
Date: 2026-03-24

## Purpose

Provide the standard template for repeatable operations and workflow runbooks in this monorepo.

Use this template for documents in `docs/operations/` that explain how to do a bounded piece of repo work correctly and consistently.

This template is for **repeatable workflow guidance**. It is not the canonical home for architecture decisions.

---

## How to use this template

When creating a runbook from this template:

- replace all placeholders
- delete sections that truly do not apply
- keep the workflow concrete and sequential
- link to canonical architecture docs instead of restating them
- describe the real current workflow, not an aspirational future state
- make the completion criteria explicit

Do not leave template instructions in the final runbook.

---

# `<runbook-name>.md`

Status: Active  
Date: `<YYYY-MM-DD>`

## Purpose

Describe the workflow this runbook covers.

State:

- what the workflow is for
- what kind of outcome it produces
- what it does not cover

Example prompts:

- Is this about creating, updating, validating, deploying, or documenting something?
- Is it for a recurring operational task?
- What architecture docs define the boundaries this runbook must follow?

---

## When to use this workflow

Use this workflow when:

- `<condition 1>`
- `<condition 2>`
- `<condition 3>`

Do not use this workflow when:

- `<out-of-scope case 1>`
- `<out-of-scope case 2>`
- `<out-of-scope case 3>`

Link to the relevant architecture doc if the scope boundary matters.

---

## Expected outcome

By the end of this workflow, the repo or system should have:

- `<outcome 1>`
- `<outcome 2>`
- `<outcome 3>`

The outcome should be framed as a real, verifiable end state.

---

## Before you start

Read in this order:

1. `<parent AGENTS or root AGENTS>`
2. `<nearest relevant local AGENTS>`
3. `<nearest relevant local README>`
4. `<most relevant canonical architecture doc>`
5. `<most relevant operations or reference doc>`

Use real relative links in the final file.

Also note any important assumptions:

- `<assumption 1>`
- `<assumption 2>`

---

## Preconditions

This workflow should usually begin only when all of the following are true:

- `<precondition 1>`
- `<precondition 2>`
- `<precondition 3>`

If the workflow would also require any of the following, stop and get approval first:

- `<approval-sensitive condition 1>`
- `<approval-sensitive condition 2>`
- `<approval-sensitive condition 3>`

This section should prevent accidental scope drift.

---

## Naming and placement rules

State any path, naming, or placement rules that apply.

Examples:

### Path rule

```text
<path-pattern>
````

### Naming rule

Use names that are:

* `<quality 1>`
* `<quality 2>`
* `<quality 3>`

Avoid:

* `<bad pattern 1>`
* `<bad pattern 2>`

Skip this section if the workflow does not create or place durable artifacts.

---

## Standard workflow

### Step 1: `<step name>`

Describe the action clearly.

Include:

* what to do
* what to check
* what to avoid

### Step 2: `<step name>`

Describe the next bounded action.

Use bullets when they help clarify sub-work:

* `<sub-action 1>`
* `<sub-action 2>`

### Step 3: `<step name>`

Continue the workflow in order.

If a command is useful, include it in a closed code fence:

```bash
<command>
```

### Step 4: `<step name>`

Describe the next concrete step.

State any local or architectural constraints that must be respected.

### Step 5: `<step name>`

Continue until the workflow reaches a real end state.

Only include as many steps as the workflow actually needs.

---

## Defaults and decision rules

Document the default posture contributors should follow during this workflow.

Examples:

### Default framework posture

* `<default 1>`
* `<default 2>`

### Default boundary posture

* `<default 1>`
* `<default 2>`

### Default content or implementation posture

* `<default 1>`
* `<default 2>`

This section is useful when the workflow has recurring judgment calls.

---

## Validation

State the validation expected before the workflow is considered complete.

Typical example:

```bash
pnpm turbo lint --filter=<target>
pnpm turbo typecheck --filter=<target>
pnpm turbo test --filter=<target>
pnpm turbo build --filter=<target>
```

Guidance you may include:

* start with the narrowest valid commands
* run `build` last when build validation is warranted
* widen validation when shared or repo-wide impact exists
* do not claim commands passed unless they were actually run

If this workflow sometimes cannot be fully validated, say how to record that honestly.

---

## Definition of done

This workflow is complete when all of the following are true:

* `<done condition 1>`
* `<done condition 2>`
* `<done condition 3>`
* `<done condition 4>`

These conditions should be concrete and verifiable.

---

## Failure and edge cases

### `<edge case 1>`

Describe what to do if this happens.

### `<edge case 2>`

Describe what to do if this happens.

### `<edge case 3>`

Describe what to do if this happens.

Use this section to prevent common workflow derailments.

---

## Common mistakes to avoid

Avoid these during this workflow:

* `<mistake 1>`
* `<mistake 2>`
* `<mistake 3>`
* `<mistake 4>`

Keep this concrete and shaped by likely failure modes.

---

## Escalation rules

Stop and ask before proceeding if the workflow also requires:

* `<escalation condition 1>`
* `<escalation condition 2>`
* `<escalation condition 3>`

This section should reflect real structural or approval-sensitive boundaries.

---

## Related docs

Link the most relevant supporting docs for this workflow.

Typical examples:

* canonical architecture docs
* local `AGENTS.md`
* local `README.md`
* related operations docs
* related reference docs
* related templates

Use real relative links in the final file.

---

## Template cleanup checklist

Before finalizing a runbook created from this template:

* replace all placeholders
* remove template-only instructional text
* keep only sections that actually apply
* make the steps concrete and sequential
* ensure all code fences are closed
* convert all doc references into real relative markdown links
* confirm the completion criteria are explicit
* keep the file short, accurate, and operational