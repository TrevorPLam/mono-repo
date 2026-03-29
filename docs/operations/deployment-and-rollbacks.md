# repo/docs/operations/deployment-and-rollbacks.md

Status: Active  
Date: 2026-03-25

## Purpose

Define the canonical deployment, promotion, rollback, and immediate incident-response workflow for this monorepo.

This runbook exists so that deployable surfaces ship in a repeatable, low-drift, low-surprise way across public sites and future protected apps.

This document is a workflow runbook, not a platform ADR.  
For structural deployment posture, see the architecture docs.  
For local setup, see `operations/local-development.md`.

---

## Scope

This runbook applies to:

- `apps/site-firm`
- `apps/sites/clients/<client-slug>`
- future deployable apps added under the canonical repo model
- preview deployments
- production deployments
- rollback handling
- deploys that include configuration, content, code, and schema changes

This runbook does **not** replace a deeper DB migration runbook or domains/cutover runbook if those are later split into dedicated docs.

---

## Canonical posture

### 1. One deployable surface = one Vercel project

Each real deployable app/site should map to its own Vercel project.

That keeps:

- domains isolated
- environment variables scoped correctly
- rollback blast radius smaller
- project-level settings understandable
- client separation clean

In a monorepo, Vercel supports multiple projects connected to one repository, and each project can target its own root directory and deployment settings. :contentReference[oaicite:3]{index=3}

---

### 2. Git-based Vercel deployments are the default

The default deployment model is:

- push / PR creates preview deployment
- merge to the production branch creates a production candidate
- Vercel performs the actual build and hosting workflow
- GitHub Actions act primarily as validation and deployment checks, not as the main deploy engine

This keeps deploy history, previews, promotion, and rollback aligned with the hosting platform. Vercel’s deployment model centers on previews, promotions, and production deploys, while GitHub environments are best used for gating and protection around jobs that target protected environments. :contentReference[oaicite:4]{index=4}

---

### 3. Preview before production

No meaningful production deployment should happen without a preview artifact first.

Default rule:

- every non-trivial change gets a preview deployment
- preview is the review surface
- production is a promotion decision, not the first time a change is seen running

For public-site work, this is the main safety barrier before production.

---

### 4. Rollback must be fast, boring, and reversible

The first rollback tool is platform-level application rollback, not ad hoc hotfixing on production.

On Vercel, production rollback switches traffic back to an earlier deployment at the routing layer and takes effect within seconds rather than requiring a rebuild. :contentReference[oaicite:5]{index=5}

That makes rollback the default first response for:

- broken app code
- broken content/config release
- bad static asset release
- regressions introduced by a recent production deployment

---

### 5. Database changes must be backward-compatible at deploy time

Application rollback is easy. Database rollback often is not.

Therefore:

- production schema changes must be backward-compatible during rollout
- destructive schema changes require an expand-and-contract sequence
- app deploys must not depend on unsafe, same-moment destructive DB changes
- “just roll the DB back” is not an acceptable default operating assumption

Prisma’s current production guidance remains:
- use `migrate deploy` in production
- never use `migrate dev` in production
- use expand-and-contract when changing production schemas in ways that could break running code or data compatibility. :contentReference[oaicite:6]{index=6}

---

## Deployment environments

### Local

Used for implementation and local verification.

Characteristics:

- developer- or agent-run
- may use local or shared dev services
- not authoritative for release readiness by itself

### Preview

Used for review, QA, client review, and pre-production validation.

Characteristics:

- URL-addressable
- branch/PR scoped
- safest place to review visual, content, routing, and integration changes before production

### Production

Used for live public traffic.

Characteristics:

- attached to real public domains
- subject to stronger protection and review standards
- must preserve rollback readiness

GitHub environments can enforce branch restrictions, required approvals, and protection rules for jobs that reference them. :contentReference[oaicite:7]{index=7}

---

## Release types

### Type A — content/config only

Examples:

- copy updates
- image swaps
- blog/resource content changes
- metadata/SEO changes
- redirect updates
- non-structural analytics/tag changes

Expected handling:

- preview review
- lightweight production promotion
- rollback via previous deployment if needed

### Type B — normal code release

Examples:

- layout/component changes
- new pages
- routing changes
- form workflow updates
- shared package updates
- observability/analytics changes

Expected handling:

- preview review
- required validation checks
- standard production deployment
- rollback ready

### Type C — high-risk release

Examples:

- navigation/information architecture changes
- major shared package refactors
- domain or DNS cutover coupling
- auth/session behavior changes in future protected apps
- data model changes
- releases with migration coupling
- large cross-app dependency updates

Expected handling:

- tighter preflight
- explicit owner
- stronger verification plan
- consider staged release / rolling release
- rollback operator and fallback plan identified before promotion

For higher-risk deploys, Vercel’s current cautious-release feature is Rolling Releases, which gradually shifts traffic and supports monitoring plus abort. Vercel also recommends Skew Protection alongside Rolling Releases so client and server stay on the same deployment version during gradual rollout. :contentReference[oaicite:8]{index=8}

---

## Ownership

Every production deployment should have:

- a release owner
- a rollback operator (can be the same person for solo operation)
- a validation surface
- a post-deploy verification plan

For this repo’s current solo-operator posture, those roles may all be the same person.  
The point is not headcount separation; the point is explicit responsibility.

---

## Standard deployment workflow

### 1. Confirm scope

Before deploying, identify:

- which app/project is changing
- whether the change is Type A, B, or C
- whether any shared packages are involved
- whether any schema/env/domain changes are involved
- whether a plain app rollback would fully recover the system if needed

If the answer to the last question is “no,” treat the release as high risk.

---

### 2. Validate before preview approval

Minimum expectations before production:

- install/build/lint/typecheck pass at the required scope
- relevant tests pass
- preview deployment exists and is viewable
- critical pages/routes render correctly
- key forms and integrations smoke-test successfully
- no missing env/config values
- no known blocker left unresolved

Use filtered validation wherever possible.  
Do not rely on a vague “it built once locally.”

---

### 3. Review the preview deployment

Review should cover, as applicable:

- layout and responsive behavior
- content correctness
- metadata and SEO-critical pages
- forms
- analytics triggers that matter for the release
- redirects / rewrites
- robots / noindex posture where relevant
- client-visible defects
- console/runtime errors on critical paths

For client work, this preview is the client-safe review surface unless a different approval workflow is later documented.

---

### 4. Gate production

Production deploys should be gated by the smallest useful set of controls.

Canonical rule:

- keep branch protection and CI status checks authoritative for code validation
- use GitHub environments for approval/secret access where production gating is needed
- use Vercel Deployment Checks intentionally, not redundantly

This matters because Vercel currently documents edge cases and race conditions when Deployment Checks are combined with GitHub branch protection/rulesets and GitHub-backed checks in overlapping ways. GitHub environments, meanwhile, already support branch restrictions, required reviewers, and other protection rules. :contentReference[oaicite:9]{index=9}

Practical rule:

- do not create duplicate gates that express the same policy in both systems unless there is a clear reason
- prefer one clear source of truth for merge gating and one clear source of truth for deployment approval

---

### 5. Promote to production

Default production path:

- merge approved change to the production branch
- allow Vercel Git deployment to build and promote normally
- for higher-risk releases, use manual promotion or rolling release when appropriate
- confirm the exact deployment ID / commit that reached production

Vercel supports normal production promotion, manual promotion, and rolling release options. :contentReference[oaicite:10]{index=10}

---

### 6. Verify production immediately

Immediately after production promotion, verify:

- homepage and key landing pages
- primary navigation
- one representative deep page
- one form submission path if the release touches forms
- robots/sitemap/canonical-critical surfaces if SEO-related
- key third-party integrations touched by the change
- error logs / telemetry for obvious spikes
- correct domain routing

Do not consider a release “done” just because the deploy succeeded.

---

## Production database posture

### Rules

- never run development migration commands in production
- production uses committed migration files only
- use `prisma migrate deploy` for production/staging migration application
- use expand-and-contract for incompatible changes
- do not pair destructive DB change and irreversible app expectation in one fragile release
- if a migration materially changes data shape, define forward-fix and fallback behavior before deploy

Prisma explicitly documents `migrate dev` as development-only and `migrate deploy` as the production command, and it recommends expand-and-contract for low-downtime production schema evolution. :contentReference[oaicite:11]{index=11}

### Operational implication

A production rollback plan must answer:

1. can the old app version still run against the new schema?
2. if not, why is this deployment being treated as safe?
3. what is the forward-fix plan if rollback is not sufficient?

If those are unanswered, the release is not ready.

---

## Rollback decision tree

### Case 1 — bad app/content/config deployment, no incompatible DB change

Examples:

- broken page rendering
- broken styling/layout
- bad copy or asset release
- redirect mistake
- bad analytics snippet
- broken client-side script
- env/config issue isolated to recent deployment

Action:

1. rollback production to last known good deployment
2. verify key routes
3. pause further promotion
4. investigate root cause
5. ship a clean corrective release later

This is the normal rollback path.

Vercel’s rollback is designed for this exact case and restores production traffic to a previous deployment quickly. :contentReference[oaicite:12]{index=12}

---

### Case 2 — deployment includes DB change but old app remains compatible

Action:

1. rollback the app deployment
2. keep the compatible schema in place
3. assess whether a forward-fix or later cleanup migration is needed
4. do not rush a destructive DB rollback

This is the preferred schema-release design.

---

### Case 3 — deployment includes incompatible or damaging DB/data change

Examples:

- destructive migration already applied
- data backfill introduced corruption
- application and schema are no longer mutually compatible

Action:

1. treat as an incident, not a normal rollback
2. stabilize traffic first if app rollback still reduces harm
3. stop further deploys
4. assess data integrity and migration state
5. use explicit DB recovery procedure, not improvisation
6. document exactly what changed before attempting recovery

Important rule:

- do not assume a down migration is the safest answer
- do not use development reset workflows in production
- preserve evidence before making the situation worse

Prisma’s production docs emphasize migration history, `migrate deploy`, migration status tooling, and deliberate resolution workflows rather than casual reset/undo behavior in production. :contentReference[oaicite:13]{index=13}

---

### Case 4 — bad production due to secret/env/config change

Action:

1. determine whether rollback or config correction is faster and safer
2. if the broken behavior is tied only to the current deployment, rollback first
3. if the secret/config is platform-level and affects all deployments, correct the config and redeploy or revalidate
4. verify that preview/prod env separation is still correct

Do not treat env mistakes as “just code bugs.”  
They often outlive a single deployment.

---

## Rolling releases

### When to use

Prefer Rolling Releases for:

- higher-risk app changes
- changes affecting critical paths
- releases where observing live metrics before full promotion is valuable
- future internal apps with stateful user flows

### When not to use

Do not require rolling release overhead for:

- routine low-risk content changes
- tiny styling fixes
- trivial client-site edits with low blast radius

### Policy

Use Rolling Releases selectively, not universally.

If enabled:

- define success/failure signals before rollout
- watch logs/metrics during rollout
- abort early rather than hoping a bad rollout self-corrects
- pair with Skew Protection where relevant

Vercel’s current rolling release flow supports staged traffic rollout, monitoring, and abort, and Vercel explicitly recommends Skew Protection with Rolling Releases. :contentReference[oaicite:14]{index=14}

---

## Preview protection and controlled access

Preview deployments are often review surfaces, not public launch surfaces.

When review access should be restricted, Vercel currently supports deployment protection methods including Vercel Authentication, Password Protection, and Trusted IPs. :contentReference[oaicite:15]{index=15}

Default guidance:

- ordinary internal/client review previews may use lightweight protection
- avoid leaving sensitive previews broadly public unless intentional
- choose the least burdensome method that still fits the risk

---

## Deployment checklist

### Pre-deploy

- target app/project identified
- release type identified
- preview exists
- validation checks passed
- required env vars present
- migration review completed if applicable
- rollback path known
- owner identified
- client/stakeholder approval captured if required

### At deploy time

- confirm correct branch / project / environment
- verify whether deploy is automatic, manually promoted, or staged
- note deployment ID / URL
- avoid mixing unrelated risky changes into one release

### Post-deploy

- verify key paths manually
- check logs/errors
- verify forms/integrations if touched
- verify domain routing
- confirm no urgent rollback trigger exists
- record outcome if the release was high-risk

---

## Rollback checklist

- identify last known good deployment
- confirm whether DB compatibility exists
- rollback traffic to known good deployment
- verify key routes and flows
- disable or pause further promotion if needed
- document incident window, symptoms, and suspected cause
- only resume shipping after root cause is understood enough to avoid repetition

---

## Anti-patterns

### Do not deploy first and “see what happens”

Preview exists to reduce surprises.

### Do not treat every change as equally safe

Content edits and schema-coupled releases are not the same risk class.

### Do not rely on database rollback as the primary safety net

App rollback is easy; data recovery often is not.

### Do not use `migrate dev` or reset-style workflows in production

Those are development workflows, not production recovery procedures. :contentReference[oaicite:16]{index=16}

### Do not duplicate approval logic in too many systems

Overlapping GitHub rulesets, environment approvals, and Vercel deployment checks can create confusion and race conditions rather than safety. :contentReference[oaicite:17]{index=17}

### Do not ship destructive schema changes without compatibility planning

Expand first, migrate data if needed, contract later. :contentReference[oaicite:18]{index=18}

---

## Relationship to other docs

Related canonical docs:

- `operations/local-development.md`
- `operations/content-publishing.md`
- `operations/environment-and-secrets.md`
- `operations/domains-and-cutovers.md`
- `operations/db-migration-posture.md`
- `architecture/deployment-security.md`
- `reference/commands.md`
- `reference/env-matrix.md`

If a future doc creates more specific policy for domains, environments, or DB migration handling, that doc may narrow this runbook without replacing its core release/rollback flow.

---

## Definition of done

This runbook is being followed correctly when:

- every real production change has a preview-first path
- production deploys have a known owner and rollback path
- rollback can be executed quickly for app-only failures
- schema changes are designed for compatibility
- production gating is clear rather than duplicated
- release verification happens after promotion, not just before it

---

## Final rule

A release is not safe because it is small.  
A release is safe because:

- the blast radius is understood
- the validation was appropriate
- the rollback path is real
- the database posture is compatible
- the operator knows exactly what to do if production goes bad