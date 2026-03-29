# repo/docs/features/preview-review-approval/tasks.md

Status: Active  
Date: 2026-03-25

## Purpose

Track the work needed to define, adopt, and operationalize the preview, review, and approval workflow.

---

## Current status

### Completed in this packet

- [x] define the correct documentation homes for the workflow material
- [x] synthesize research into a requirements document
- [x] create a canonical operations runbook
- [x] create the feature packet files for planning and handoff

### Still to do after this packet

- [ ] decide the exact threshold for explicit production approval
- [ ] decide the default preview protection posture across app types
- [ ] decide whether commit-specific preview links should be the default PR signoff artifact
- [ ] decide whether Chromatic is optional, recommended, or mandatory for any repo surface
- [ ] decide the activation threshold for a long-lived `staging` or `QA` environment
- [ ] decide the activation threshold for data-isolated preview environments

---

## Documentation follow-up tasks

### Canonical docs

- [ ] update `docs/architecture/deployment-security.md` with any durable preview-protection, environment-approval, or rollout-control rules that become canonical
- [ ] update `docs/architecture/testing.md` with any durable visual-validation or preview-validation posture that becomes canonical

### Thin enforcement surfaces

- [ ] update `CONTRIBUTING.md` with the concise contributor-facing summary of the new workflow
- [ ] update `.github/PULL_REQUEST_TEMPLATE.md` to include any final workflow fields such as preview type, stakeholder review state, or fixed signoff link expectations

---

## Policy decisions to settle

### Required before the workflow is considered fully adopted

- [ ] define which change classes require explicit production approval
- [ ] define which change classes can use ordinary protected-branch merge without a separate production hold point
- [ ] define when stale stakeholder approval must be refreshed after visible changes
- [ ] define what counts as a review-ready preview versus an intentionally early draft preview

### Useful but deferrable

- [ ] decide whether Vercel Comments should be a standard stakeholder feedback channel
- [ ] decide whether a shareable-link flow is acceptable for external reviewers or whether invite-only access should be the default
- [ ] decide whether Neon branch-per-preview is part of the default future data-backed workflow or only an exceptional option
- [ ] decide whether LaunchDarkly-style approval or release pipelines belong in the long-term maturity path

---

## Tooling and configuration follow-up

These are not part of the documentation packet itself, but they are the most likely implementation follow-ups.

- [ ] configure or tighten GitHub rulesets for `main`
- [ ] configure a protected production environment in GitHub if the repo decides to require environment approvals
- [ ] configure or confirm Vercel preview protection defaults
- [ ] confirm the sharing posture for external preview reviewers
- [ ] evaluate Chromatic for shared UI and higher-risk visual surfaces
- [ ] evaluate Vercel rolling releases only for higher-risk production surfaces

---

## Future-state adoption markers

Treat the workflow as fully adopted only when:

- [ ] contributors can tell which review lanes apply to a change without guesswork
- [ ] visible work consistently includes screenshots and preview review state
- [ ] production promotion state is explicit in meaningful PRs
- [ ] repo docs and thin enforcement surfaces no longer contradict the runbook
