# handoff-template.md

Status: Template  
Date: 2026-03-24

## Purpose

Provide the standard handoff template for feature-delivery work in this monorepo.

Use this template for `docs/features/<slug>/handoff.md` when a feature packet needs a clear final record of what was completed, what changed, what validation ran, what was deferred, and what the next person needs to know.

This template is for **handoff and completion state**. It is not the canonical home for durable architecture truth.

---

## How to use this template

When creating a handoff doc from this template:

- replace all placeholders
- describe the real final state of the work
- keep the handoff feature-scoped
- distinguish completed work from deferred work clearly
- record validation honestly
- link to canonical docs instead of copying policy
- promote durable repo truth out of the feature packet when needed

Do not leave template instructions in the final handoff.

---

# handoff.md

Status: Active  
Date: `<YYYY-MM-DD>`

## Feature

`<feature-slug>`

## Handoff summary

Summarize the final state of the work.

State:

- what was completed
- what was intentionally deferred
- whether the work is ready for continuation, review, or merge
- what the next person should understand first

Keep this short and direct.

---

## Inputs

This handoff should usually be read with:

- [`requirements.md`](./requirements.md)
- [`plan.md`](./plan.md)
- [`tasks.md`](./tasks.md)
- relevant canonical architecture docs
- relevant local `README.md`
- relevant local `AGENTS.md`

Use real relative links in the final file.

---

## Final state

Describe the feature’s current state in plain language.

Include:

- what now exists
- what changed materially
- which surfaces were affected
- whether the intended scope was fully completed or only partially completed

This section should help a new reader understand the state without re-reading the full packet first.

---

## Completed work

List the work that is actually complete.

Examples:

- `<completed item 1>`
- `<completed item 2>`
- `<completed item 3>`

Keep this factual and outcome-based.

---

## Deferred or incomplete work

List the work that was intentionally left for later or remains unfinished.

Examples:

- `<deferred item 1>`
- `<deferred item 2>`
- `<deferred item 3>`

For each deferred item, note briefly whether it is:

- intentionally deferred
- blocked
- out of current scope
- waiting on approval
- waiting on another dependency

---

## Changed areas

List the repo areas affected by the work.

Examples:

- `apps/<app-name>/...`
- `packages/<package-name>/...`
- `docs/...`
- `tests/...`

If helpful, use a table:

| Area | What changed | Why it changed |
|---|---|---|
| `<path-or-surface>` | `<change summary>` | `<reason>` |

This section should make the blast radius visible.

---

## Validation run

Record the validation that actually ran.

Examples:

- `<command>` — passed
- `<command>` — failed, later resolved
- `<command>` — not run
- `<command>` — blocked by `<reason>`

If helpful, include the commands in a fenced block:

```bash
<command 1>
<command 2>
<command 3>
````

### Validation notes

Use this subsection to state:

* what was intentionally skipped
* what could not be run
* what broader validation may still be warranted
* any caveat the next person should know

Do not imply validation happened if it did not.

---

## Documentation updates

List the documentation changes that were made.

Examples:

* canonical docs updated
* local `README.md` updated
* local `AGENTS.md` updated
* reference docs updated
* adapter docs updated
* skills updated

If no doc updates were needed, say so explicitly.

---

## Durable truth promotion

State whether any durable repo truth was promoted out of the feature packet.

Examples:

* promoted into `docs/architecture/...`
* promoted into `docs/operations/...`
* reflected in local `README.md` or `AGENTS.md`
* no durable truth change was created

This section prevents durable decisions from remaining trapped only inside the feature docs.

---

## Open follow-up work

List the next likely actions, if any.

Examples:

* `<follow-up item 1>`
* `<follow-up item 2>`
* `<follow-up item 3>`

These should be actionable and bounded.

Do not turn this into a vague backlog.

---

## Risks or caveats

List any remaining concerns the next person should know.

Examples:

* `<risk or caveat 1>`
* `<risk or caveat 2>`

Use this section for things like:

* incomplete validation confidence
* unresolved edge cases
* temporary compromises
* known fragility
* pending architectural confirmation

---

## Ready-for status

Choose the one that best fits the handoff state:

* ready for review
* ready for continuation
* ready for merge
* blocked pending decision
* blocked pending dependency
* archived as partial work

Use the smallest truthful status.

---

## Recommended next read

List the best reading order for the next person picking up the work.

Typical example:

1. this `handoff.md`
2. `tasks.md`
3. `plan.md`
4. `requirements.md`
5. the most relevant canonical docs

This section should minimize restart cost.

---

## Related docs

Link the most relevant docs for this handoff.

Typical examples:

* [`requirements.md`](./requirements.md)
* [`plan.md`](./plan.md)
* [`tasks.md`](./tasks.md)
* relevant architecture docs
* relevant operations docs
* relevant reference docs
* local subtree docs

Use real relative links in the final file.

---

## Template cleanup checklist

Before finalizing a handoff doc created from this template:

* replace all placeholders
* remove template-only instructional text
* distinguish completed work from deferred work clearly
* record validation honestly
* note doc updates explicitly
* note whether durable truth was promoted
* convert all doc references into real relative markdown links
* keep the handoff concise, factual, and restart-friendly