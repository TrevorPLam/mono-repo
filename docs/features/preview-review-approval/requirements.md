# repo/docs/features/preview-review-approval/requirements.md

Status: Active  
Date: 2026-03-25

## Purpose

Capture the requirements, research synthesis, decision criteria, and recommended operating model for the repository's preview, review, and approval workflow.

This file is the working research and requirements layer for the feature packet. It is not the final canonical runbook.

---

## Problem statement

The repository already has contribution rules, draft-PR posture, screenshot expectations for visible UI changes, approval-sensitive change warnings, and a deployment/security baseline. What it does **not** yet have is a single durable workflow that explains how a change should move from branch to preview to stakeholder review to approval to production.

Without that workflow, several failure modes remain likely:

- preview links get shared without clear readiness criteria
- code review, stakeholder feedback, and production approval blur together
- visible changes are reviewed inconsistently
- approval state is implied instead of explicit
- the repo accumulates ad hoc staging and release habits instead of a bounded default model

---

## Goals

The workflow should:

- preserve the existing branch and PR contribution model
- define a clear difference between preview, review, and approval
- support visible public-site work without overfitting to internal product-app ceremony
- make stakeholder review easier without making previews casually public
- scale from the current public-sites-first repo to later higher-risk surfaces
- provide a maturity path for more advanced controls without requiring them on day one

---

## Non-goals

This work should **not**:

- redesign the hosting topology of the monorepo
- assume that every change needs a long-lived staging environment
- turn ordinary public-site work into enterprise release theater
- treat visual tooling as a replacement for code review or contributor judgment
- force feature-flag infrastructure into the current baseline before the repo needs it

---

## Current repo constraints that the workflow must respect

The adopted workflow must remain aligned with the current repo posture:

- work happens on branches and should not push directly to `main`
- draft PRs are encouraged for non-trivial work
- screenshots are expected for visible UI changes
- validation should start narrow and widen when blast radius grows
- high-blast-radius changes should stop and get approval first
- public-site delivery is the dominant near-term repo concern
- canonical durable process belongs in `docs/`, with active planning detail living in feature packets

---

## Research synthesis

### 1. Basics and fundamentals

The strongest current baseline is a three-layer model:

- **preview** = a deployable inspection surface for a branch or PR
- **review** = inspection and discussion across code, UI, behavior, and stakeholder expectations
- **approval** = a policy gate that allows advancement to the next environment or to production

Current platform behavior supports this separation well:

- GitHub environments support approval gates, branch restrictions, and deployment protection rules for jobs that reference an environment
- Vercel distinguishes Preview, Production, and optional Custom Environments such as `staging` or `QA`
- Vercel also distinguishes branch-specific preview URLs from commit-specific preview URLs, which is useful for deciding whether review is iterative or snapshot-based

This means the repo does **not** need to invent a custom conceptual model. It needs to adopt a clean operating model on top of standard platform capabilities.

### 2. Best practices

The strongest current best practices are:

- keep code review, stakeholder preview review, and deployment approval as separate lanes
- keep previews private or access-controlled by default
- require screenshots for visible UI work even when live previews exist
- use commit-specific links when the reviewer is approving a fixed version
- re-review when meaningful visible changes land after feedback
- avoid a permanent staging environment until there is a real cross-PR integration need
- avoid weakening preview protection just to let CI or automation access the deployment

Current tooling now supports these cleanly:

- GitHub rulesets can enforce stronger PR review behavior than basic branch protection alone
- GitHub required-review behavior can dismiss stale approvals, require comment resolution, and require approval of the latest reviewable push
- Vercel supports protected previews, invite-based external sharing, shareable links, and automation bypass for CI and testing
- Chromatic separates UI Tests from UI Review so visual regression protection and intentional visual signoff do not get conflated

### 3. Highest standards

The highest standard is **tiered enforcement**, not universal ceremony.

A mature workflow uses stronger controls only where risk is higher:

- baseline PR protection for all meaningful changes
- visible-work review expectations for public-site UI and content changes
- path-specific review rules for sensitive areas such as deployment, env, auth, or shared boundaries
- environment-based production approval for higher-risk promotions
- progressive rollout and fast rollback only when production risk justifies it

This matters for the repo because its current near-term work is public-site-heavy. The correct standard is high clarity and bounded safety, not default enterprise release bureaucracy on every ordinary change.

### 4. Enterprise solutions

The best-fit enterprise path for the repo is **native-first**:

- GitHub for PR review, rulesets, and environment approvals
- Vercel for previews, protected sharing, comments, custom environments, and rollout controls
- Chromatic for visual regression and UI-specific review when the cost is justified

Other enterprise options are real, but they are maturity upgrades, not baseline requirements:

- LaunchDarkly adds approval and release governance at the feature-flag level
- Neon adds database branch-per-preview workflows when realistic backend review environments are needed
- heavier release-control systems such as Harness or GitOps CD layers belong much later, if ever, for this repo shape

### 5. Innovative, unique, or novel techniques worth tracking

The most useful newer capabilities are:

- **path-scoped required reviewer rules** in GitHub rulesets for sensitive folders and files
- **protected previews with automation bypass** so CI and E2E tests can reach previews without making them open by default
- **preview-native comments** on Vercel deployments for stakeholder review tied to the actual rendered UI
- **commit-link vs branch-link review discipline** so teams stop mixing snapshot approval with moving-target review
- **database branch per preview** when review quality depends on realistic isolated data behavior
- **progressive rollout with 0% or small-fraction stages** for higher-risk production promotions
- **flag-level approvals and release pipelines** when deploy and release must be deliberately decoupled later

---

## Options considered

### Option A: Minimal PR-only workflow

Description:

- use branches and PRs
- rely on screenshots and normal code review
- treat the preview as an informal convenience

Pros:

- lowest ceremony
- easy to adopt immediately

Cons:

- weak stakeholder review discipline
- unclear approval trail
- easy to blur “preview shared” with “approved for production”

Assessment:

Too weak as the long-term repo default.

### Option B: Native-first tiered workflow

Description:

- GitHub PR review remains the code-review spine
- Vercel preview becomes the review artifact for visible work
- previews remain private or controlled by default
- explicit promotion approval is added for higher-risk work
- stronger rulesets and rollout controls are layered in only where justified

Pros:

- matches current repo posture
- high clarity without overbuilding
- strong path to later maturity
- works well for public-site-first delivery

Cons:

- still requires disciplined human triage
- some advanced controls will remain policy until later tooling is configured

Assessment:

**Recommended default.**

### Option C: Enterprise-heavy release platform baseline

Description:

- adopt staging, approval gates, feature-flag release orchestration, and heavier deployment governance as the baseline for most work

Pros:

- maximum formal control
- can scale to complex product and compliance workflows later

Cons:

- too much ceremony for current repo reality
- increases tool and process burden before risk justifies it

Assessment:

Not recommended as the current baseline.

---

## Recommended operating model

Adopt **Option B: native-first tiered workflow**.

### Baseline now

Use:

- branch + PR workflow as the canonical contribution path
- draft PRs for non-trivial work that benefits from early feedback
- Vercel preview as the stakeholder review artifact for visible changes
- PR screenshots as the durable review snapshot inside GitHub
- explicit distinction between internal review, stakeholder preview review, and production approval

### Add when justified

Add these only when the repo actually needs them:

- one long-lived `staging` or `QA` custom environment when there is a genuine integration need across PRs
- Chromatic UI Tests and UI Review for shared UI or higher-risk visual surfaces
- protected production environment approvals in GitHub for higher-risk promotions
- Neon branch-per-preview when data-backed previews need realistic isolated state
- Vercel rolling releases for higher-risk production changes
- LaunchDarkly release approvals or pipelines when deploy and release must be separated

---

## Default policy recommendations

The workflow should adopt the following defaults:

- previews are review surfaces, not implicit launch approval
- previews should be private or controlled by default
- visible work requires screenshots in the PR even when a live preview exists
- stakeholder review should happen on the preview artifact, not in scattered side channels
- commit-specific preview URLs should be used for fixed signoff snapshots
- branch-specific preview URLs should be used for iterative review
- significant post-feedback changes should trigger re-review rather than relying on stale approval
- long-lived staging should be exceptional, not the substitute for disciplined ordinary preview review
- rollout controls should be reserved for genuinely higher-risk production promotions

---

## Open decisions still worth making explicitly

These decisions are still narrow enough that they should be resolved in follow-up implementation work:

1. What exact change classes require explicit production approval versus ordinary protected-branch merge?
2. Should preview deployments be protected for every app by default, or only for client-facing and non-public review cases?
3. Should commit-specific preview links be the default signoff artifact in the PR template for visible work?
4. When should Chromatic become mandatory versus optional?
5. What is the activation threshold for a long-lived `staging` environment?
6. At what point does the repo justify feature-flag release governance rather than deploy-only governance?

---

## Recommended follow-up implementation work

The next steps after this requirements pass are:

- finalize the operational runbook in `docs/operations/preview-review-approval.md`
- decide which parts of this posture belong in `docs/architecture/deployment-security.md`
- decide which visual-validation rules belong in `docs/architecture/testing.md`
- update `CONTRIBUTING.md` and `.github/PULL_REQUEST_TEMPLATE.md` as thin enforcement surfaces after the canonical workflow is accepted

---

## Reference research

Research confirmed on 2026-03-25 using current official sources.

### GitHub

- [Managing environments for deployment](https://docs.github.com/en/actions/reference/environments)
- [Deployment environments](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments)
- [Reviewing deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments)
- [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [Required reviewer rule is now generally available](https://github.blog/changelog/2026-02-17-required-reviewer-rule-is-now-generally-available/)

### Vercel

- [Environments](https://vercel.com/docs/custom-environments/)
- [How do I set up a staging environment on Vercel?](https://vercel.com/guides/set-up-a-staging-environment-on-vercel)
- [Sharing a Preview Deployment](https://vercel.com/docs/deployments/sharing-deployments)
- [Comments Overview](https://vercel.com/docs/comments)
- [Managing Comments on Preview Deployments](https://vercel.com/docs/comments/managing-comments)
- [Using Comments with Preview Deployments](https://vercel.com/docs/comments/using-comments)
- [Methods to bypass Deployment Protection](https://vercel.com/docs/security/deployment-protection/methods-to-bypass-deployment-protection)
- [Rolling Releases](https://vercel.com/docs/rolling-releases)
- [vercel rolling-release](https://vercel.com/docs/cli/rolling-release)

### Chromatic

- [Test how UIs look and function](https://www.chromatic.com/docs/test)
- [Mandatory PR checks](https://docs.chromatic.com/docs/mandatory-pr-checks/)
- [Manual UI Review](https://docs.chromatic.com/docs/manual-ui-review/)
- [UI Review powered by snapshots](https://www.chromatic.com/docs/review/)

### Neon

- [One branch per preview](https://neon.com/flow/branch-per-preview)
- [Branches](https://neon.com/flow/branches)

### LaunchDarkly

- [Requesting approvals](https://launchdarkly.com/docs/home/releases/approval-requests)
- [Approval request settings](https://launchdarkly.com/docs/home/releases/approvals-settings)
- [Release pipelines](https://launchdarkly.com/docs/home/releases/release-pipelines)
