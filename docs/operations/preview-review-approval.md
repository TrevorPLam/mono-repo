# repo/docs/operations/preview-review-approval.md

Status: Active  
Date: 2026-03-25

## Purpose

Define the standard preview, review, and approval workflow for meaningful repository changes.

This runbook explains how work should move from branch to preview to review to approval to production. It covers internal review, stakeholder preview review, feedback handling, approval gates, and production promotion expectations.

It is a repeatable workflow document, not the architectural source of truth for deployment topology, testing architecture, or repo-wide contribution policy.

---

## When to use this workflow

Use this workflow when:

- a change is meaningful enough to warrant a pull request
- a change affects visible UI, content, behavior, configuration, or deployment behavior
- a stakeholder, client, or repo owner needs a preview before merge or promotion
- a production promotion decision needs an explicit review trail

Do **not** use this workflow for:

- trivial local-only spikes that will not be proposed for merge
- purely disposable prospect/demo work that should remain outside the durable repo workflow
- emergency production response outside the normal branch and PR flow; treat those cases as exceptions and document them after the fact

For the structural boundaries this workflow must respect, see [`../architecture/deployment-security.md`](../architecture/deployment-security.md), [`../architecture/testing.md`](../architecture/testing.md), and [`../architecture/public-sites.md`](../architecture/public-sites.md).

---

## Expected outcome

By the end of this workflow, the repo should have:

- a reviewed and documented change set in a PR
- a clear preview review trail for meaningful visible work
- explicit approval state for anything that should advance to production
- a bounded production promotion decision with rollback awareness
- follow-up tasks split cleanly instead of hidden inside the original PR

---

## Before you start

Read in this order:

1. `../../AGENTS.md`
2. `../../CONTRIBUTING.md`
3. nearest local `AGENTS.md`
4. nearest local `README.md`
5. [`../architecture/deployment-security.md`](../architecture/deployment-security.md)
6. [`../architecture/testing.md`](../architecture/testing.md)
7. [`../architecture/public-sites.md`](../architecture/public-sites.md)

Assume the following unless a narrower local rule says otherwise:

- `main` is the protected production-bound branch
- meaningful work happens on a branch and is proposed through a PR
- visible UI work should include screenshots in the PR
- previews are review surfaces, not automatic launch approval
- validation should start narrow and widen when blast radius grows

---

## Preconditions

This workflow should usually begin only when all of the following are true:

- the correct app, package, or docs boundary for the change is understood
- the change can be described in a reviewable scope
- the author can state what kind of review is needed: code, visual, stakeholder, deployment, or some combination
- the expected validation depth is known well enough to avoid pretending a change is ready when it is not

Stop and get approval before proceeding if the change would:

- add or change dependencies
- alter CI, deployment, environment, domain, or secret posture
- change a shared package boundary in a way that could affect multiple apps
- introduce protected-app, auth, or data-backed patterns into public-site work without prior approval

---

## Review lanes

Treat review as distinct lanes instead of one undifferentiated approval step.

### Code review

Use the pull request as the canonical review surface for implementation, structure, validation, and documentation alignment.

### Visual review

Use screenshots, visual diffs, or preview-specific comments when the change affects how the UI looks or reads.

### Stakeholder review

Use the preview deployment to gather feedback from the repo owner, client, or other stakeholders on the live result.

### Deployment approval

Use an explicit approval gate before production promotion when the change has enough user or operational impact to justify it.

Preview review does **not** replace code review, and code review does **not** replace stakeholder signoff for visible work.

---

## Standard workflow

### Step 1: Classify the change

Decide what kind of review the change needs before implementation drifts too far.

Classify the change across these dimensions:

- visible UI or content change
- implementation-only change
- shared-boundary or multi-app change
- approval-sensitive deployment or configuration change
- high-uncertainty change that should open as a draft PR early

Minimum rule:

- if the change is visible, expect screenshots and preview review
- if the change is shared or approval-sensitive, widen validation and review expectations early

### Step 2: Create the branch and open the PR

Create a branch using normal repo naming conventions and open a draft PR early when the work benefits from feedback.

The PR should establish:

- what changed
- why the change exists
- what validation has run so far
- whether screenshots are included
- whether the change is approval-sensitive
- whether stakeholder preview review will be needed

If the work is still being shaped, prefer a draft PR rather than waiting until the change is large and unclear.

### Step 3: Make the preview review-ready

Before sharing a preview, make it coherent enough to review.

That means:

- the preview should render the intended surface without obvious broken states that are unrelated to the work
- seed content or placeholder states should be clear enough that reviewers are not guessing what is intentional
- screenshots in the PR should roughly match the preview being shared
- known limitations should be called out directly in the PR

Do not share a preview as though it is approval-ready when it is still obviously incomplete.

### Step 4: Complete internal review first

Internal review should happen before or alongside broader stakeholder review.

Check:

- boundary correctness
- implementation reasonableness
- validation honesty and sufficiency
- documentation updates where durable workflow or structure changed
- whether any remaining issues are defects, intentional follow-up, or scope creep

If the change is not internally coherent, do not escalate it for client or stakeholder approval yet.

### Step 5: Share the preview intentionally

Use the preview deployment as the stakeholder review surface.

Default sharing posture:

- previews should remain private or access-controlled by default
- use invite-based or explicit sharing when outside reviewers need access
- use a **commit-specific** preview link when you need a fixed approval snapshot
- use a **branch-specific** preview link when you want iterative review on the latest branch state

If the preview supports comments, treat preview comments as review input, not as the canonical location for structural repo policy.

### Step 6: Collect and triage feedback

Every comment or request should be classified before new work is folded into the PR.

Classify feedback as one of:

- defect
- design or content adjustment
- approval blocker
- scope increase
- deferred follow-up
- non-actionable preference note

Do not allow one preview review cycle to silently absorb unrelated work. Split true follow-up into separate work when needed.

### Step 7: Re-review after meaningful changes

If feedback results in meaningful new commits:

- update screenshots when the visible result changed materially
- call out what changed since the last review round
- re-run the narrowest relevant validation, widening if the blast radius changed
- re-request review if the previous approval is no longer a trustworthy signal

Visible work should not rely on stale screenshots or stale approval after significant changes.

### Step 8: Make the promotion decision explicit

Before production promotion, state whether the change is:

- approved for merge and production
- approved for merge but not yet for production promotion
- blocked pending a named issue
- ready only for further staging or QA

Use an explicit approval moment when any of the following is true:

- the change is materially user-visible
- the change affects production content or messaging
- the change alters deployment, environment, or domain behavior
- the change has rollback risk beyond a simple copy or style adjustment

### Step 9: Promote safely

Merge and promote only after the required review lanes are satisfied.

Promotion posture:

- ordinary low-risk public-site changes can usually follow the normal protected-branch path
- higher-risk changes may justify a protected production environment approval gate
- if rollout control exists, use gradual release only when the risk justifies the extra operational surface
- if the promotion is intentionally held after merge, record why and who owns the next step

### Step 10: Close the loop

Before considering the workflow complete:

- resolve or disposition review comments
- make sure the PR tells the final story of what shipped
- split remaining work into follow-up tasks instead of leaving it implied
- promote any new durable repo rule into canonical docs

---

## Defaults and decision rules

### Preview is not approval

A preview deployment proves that the work can be inspected. It does not, by itself, authorize production promotion.

### Private-by-default preview posture

Preview deployments should default to controlled sharing rather than open public access.

### Fixed link vs moving link

Use:

- commit-specific links for signoff snapshots
- branch-specific links for ongoing iterative review

### Screenshots remain required for visible UI changes

Even when a live preview exists, screenshots still belong in the PR because they improve scanability and preserve review context.

### Keep stakeholder feedback on the artifact, not in architecture docs

Preview comments and stakeholder review should discuss the change being reviewed. Durable structural rules still belong in canonical docs.

### Add long-lived staging only when there is a real cross-PR integration need

Do not create a permanent staging environment just to compensate for weak ordinary preview review.

### Add data-isolated previews only when the workflow actually needs them

Database-per-preview or branch-per-preview posture is justified only when realistic data behavior matters for the review outcome.

### Rollout controls belong to higher-risk production promotion

Canary or rolling rollout controls are valuable, but they should not become default ceremony for ordinary low-risk public-site changes.

---

## Validation

Before marking a change ready for final review or approval, confirm:

- the narrowest relevant lint, typecheck, test, or smoke checks were run
- wider validation was added when the change touched shared packages, repo config, deployment behavior, or multiple apps
- the PR states clearly what was run and what was not run
- visible changes include updated screenshots if the final state differs materially from earlier review rounds

For validation architecture, see [`../architecture/testing.md`](../architecture/testing.md).

---

## Completion criteria

This workflow is complete when all of the following are true:

- the PR reflects the final scope that was actually reviewed
- required review lanes are complete for the change type
- production promotion state is explicit
- unresolved items are either fixed, documented, or split into follow-up work
- any durable workflow change has been promoted into canonical docs where appropriate

---

## Exceptions and escalation

Use extra care and explicit owner approval when:

- production needs to be restored urgently
- a preview cannot be shared normally because of access, environment, or data constraints
- stakeholder signoff is unavailable but the work is time-sensitive
- a merged change must be held from production or rolled back after promotion

If you use an exception path, document:

- why the standard workflow was not used
- what review and validation still happened
- who approved the exception
- what follow-up work is required to return to the normal path
