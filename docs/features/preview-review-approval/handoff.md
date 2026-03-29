# repo/docs/features/preview-review-approval/handoff.md

Status: Active  
Date: 2026-03-25

## Purpose

Summarize what this feature packet produced, what decisions were reached, and what still remains before the workflow is fully adopted across the repo.

---

## What this packet created

This packet created the following new files:

- `docs/features/preview-review-approval/requirements.md`
- `docs/features/preview-review-approval/plan.md`
- `docs/features/preview-review-approval/tasks.md`
- `docs/features/preview-review-approval/handoff.md`
- `docs/operations/preview-review-approval.md`

---

## What was decided

### Documentation placement

The material from this thread should not live in one giant architecture file.

The adopted documentation shape is:

- comparative research, open questions, and recommendation logic live in the feature packet
- the actual repeatable workflow lives in `docs/operations/preview-review-approval.md`
- only durable architectural implications should later be promoted into existing architecture docs

### Workflow model

The recommended operating model is:

- branch + PR as the canonical contribution path
- preview deployment as the review artifact for visible work
- screenshots in the PR as a durable scan-friendly review artifact
- explicit distinction between code review, stakeholder review, and production approval
- tiered stronger controls only when risk justifies them

### Maturity path

The recommended maturity path is:

1. native-first baseline using GitHub + Vercel
2. stronger PR rules and environment approvals where justified
3. visual review tooling for the surfaces that need it
4. data-isolated previews, rollout control, or flag-level release governance only when real operational need appears

---

## What remains unresolved

The packet intentionally leaves several narrow implementation decisions open:

- the exact threshold for explicit production approval
- whether preview protection should be universal or surface-specific
- whether commit-specific preview links should be the default signoff artifact
- whether Chromatic becomes optional, recommended, or mandatory anywhere
- when a long-lived `staging` or `QA` environment is justified
- when release-governance tooling beyond GitHub and Vercel becomes worth the complexity

These are recorded in `tasks.md` and should be resolved before the workflow is treated as fully operationalized.

---

## Recommended next changes outside this packet

After reviewing the new files, the most likely next edits are:

- tighten `docs/architecture/deployment-security.md` where preview protection, environment approvals, or rollout posture becomes canonical
- tighten `docs/architecture/testing.md` where visual or preview validation posture becomes canonical
- update `CONTRIBUTING.md` with the short contributor-facing summary of the workflow
- update `.github/PULL_REQUEST_TEMPLATE.md` so the review artifact and approval state are captured consistently

---

## Validation note

This packet is documentation-only.

No repository code, CI configuration, GitHub rulesets, or Vercel settings were changed as part of this step.
