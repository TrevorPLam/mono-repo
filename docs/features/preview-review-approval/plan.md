# repo/docs/features/preview-review-approval/plan.md

Status: Active  
Date: 2026-03-25

## Purpose

Describe the implementation plan for adopting the repository's preview, review, and approval workflow.

This plan turns the requirements and research synthesis into bounded documentation and policy work. It is not a general release-management strategy document.

---

## Desired outcome

The repository should end this work with:

- one canonical operations runbook for preview, review, and approval
- a clear default operating model for visible public-site work
- a documented maturity path for stronger protections without making them mandatory too early
- a short list of follow-up edits to existing canonical docs and thin enforcement surfaces

---

## Scope

### In scope

- create the feature packet for this workflow
- create the canonical operations runbook
- define the recommended default model and maturity path
- identify where future updates to existing docs should land

### Out of scope for this packet

- editing existing architecture docs in the same step unless specifically requested later
- configuring GitHub rulesets, environments, or Vercel settings directly
- selecting or purchasing additional release-governance vendors
- building internal release tooling

---

## Implementation approach

### Phase 1: Establish the working packet

Create and maintain:

- `requirements.md`
- `plan.md`
- `tasks.md`
- `handoff.md`

This packet should carry the research, recommendation, task breakdown, and state summary while the workflow is still being shaped.

### Phase 2: Establish the canonical runbook

Create `docs/operations/preview-review-approval.md` as the stable workflow home.

This file should define:

- when the workflow applies
- review lanes
- step-by-step flow
- decision rules
- completion criteria
- exception handling

### Phase 3: Decide cross-doc promotion targets

After the runbook is accepted, decide which durable truths need promotion into:

- `docs/architecture/deployment-security.md`
- `docs/architecture/testing.md`
- `CONTRIBUTING.md`
- `.github/PULL_REQUEST_TEMPLATE.md`

Only promote the stable rules, not the full research survey.

### Phase 4: Adopt in repo practice

After documentation is accepted, update operational surfaces and habits so the workflow is actually used:

- PR template fields
- review expectations
- preview sharing norms
- approval expectations for higher-risk production work

---

## Decision rules for implementation

### Keep the canonical runbook operational

The operations doc should describe what contributors should do, in order, with explicit defaults.

### Keep comparative research in the feature packet

Do not turn the operations runbook into a market scan of release tools.

### Prefer native-first configuration changes later

When implementation moves from documentation to tooling, prefer:

- GitHub-native PR and environment controls
- Vercel-native preview and review controls
- optional visual tooling only where the surface justifies it

### Avoid speculative permanent environments

Do not add long-lived `staging` or `QA` environments until there is a real integration or promotion need beyond ordinary previews.

---

## Deliverables

### Created in this packet

- `docs/features/preview-review-approval/requirements.md`
- `docs/features/preview-review-approval/plan.md`
- `docs/features/preview-review-approval/tasks.md`
- `docs/features/preview-review-approval/handoff.md`
- `docs/operations/preview-review-approval.md`

### Recommended next edits after acceptance

- update `docs/architecture/deployment-security.md`
- update `docs/architecture/testing.md`
- update `CONTRIBUTING.md`
- update `.github/PULL_REQUEST_TEMPLATE.md`

---

## Risks and mitigations

### Risk: Overbuilding too early

Mitigation:

- keep the baseline native-first and tiered
- defer stronger rollout and release-governance tooling until triggered by real risk

### Risk: Under-specifying stakeholder review

Mitigation:

- treat preview review as a first-class lane for visible work
- keep screenshot requirements in the PR even when a preview exists

### Risk: Stale approvals after meaningful changes

Mitigation:

- require visible re-review when material post-feedback changes land
- prefer commit-specific preview links for fixed signoff points

### Risk: Policy scattered across too many files

Mitigation:

- keep the runbook as the operational home
- promote only the durable architecture implications into architecture docs
- keep contribution and PR template edits thin

---

## Completion signal

This plan is complete when:

- the new files exist and read as native repo docs
- the runbook is strong enough to use as the canonical workflow home
- the feature packet clearly states what still needs promotion into existing docs
