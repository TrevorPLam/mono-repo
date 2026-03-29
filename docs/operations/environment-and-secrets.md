# repo/docs/operations/environment-and-secrets.md

````md
# environment-and-secrets.md

Status: Active  
Date: 2026-03-25

## Purpose

Define the canonical workflow for classifying, creating, syncing, validating, rotating, and removing environment variables and secrets in this monorepo.

This runbook exists to make environment handling:

- narrow in scope
- explicit in ownership
- safe across public sites and future protected apps
- compatible with the repo’s shared `@repo/env` boundary
- predictable across local, preview, production, and CI workflows

This is an operations runbook.  
It explains how to handle env values correctly.  
It does not replace the architecture docs or the scan-friendly `reference/env-matrix.md`.

---

## When to use this workflow

Use this workflow when:

- a new environment variable is needed
- an existing value must be changed
- a secret must be rotated
- a value must be exposed to client code intentionally
- a Vercel project needs environment updates
- CI or deployment jobs need secret access
- a new app or package needs env binding through `@repo/env`

Do not use this workflow when:

- you are trying to decide the high-level architecture of `@repo/env`
- you need a reference matrix of env ownership by class
- you are inventorying all current variable names across apps
- you are writing down actual secret values
- you are treating docs as a secret store

For durable ownership and classification rules, see:

- `docs/reference/env-matrix.md`
- `docs/architecture/deployment-security.md`
- `packages/env` canonical docs / local README when implemented

---

## Expected outcome

By the end of this workflow:

- the value is classified correctly
- the value is scoped to the smallest truthful boundary
- the correct deployment environment(s) own it
- runtime access is wired through approved bindings
- local verification is possible without leaking secrets
- preview/production behavior is understood
- any required docs or config updates are complete
- no secret value was committed, logged, screenshotted, or documented unsafely

---

## Before you start

Read in this order:

1. `../../AGENTS.md`
2. `../../CONTRIBUTING.md`
3. `../reference/env-matrix.md`
4. `../architecture/deployment-security.md`
5. the relevant app/package local docs
6. the `@repo/env` canonical doc if the change affects runtime binding

This runbook assumes the repo’s current posture:

- public sites are the current priority
- app-local secret scope is preferred
- shared repo-level env should be rare
- server-only values should stay server-only
- `@repo/env` is the approved typed boundary for runtime access
- raw ambient env access should not sprawl across the repo
- public browser env is explicit and minimal, not a dumping ground for convenience data

Those rules are already established in the current repo docs. :contentReference[oaicite:4]{index=4} :contentReference[oaicite:5]{index=5} :contentReference[oaicite:6]{index=6}

---

## Canonical posture

### 1. System of record

The operational source of truth for deployed env values is the deployment platform boundary for the app that owns them.

In the current repo posture, that means:

- Vercel project environment variables are the default runtime system of record for deployable apps
- GitHub Actions secrets are for workflow execution, not app runtime configuration
- local files are convenience sync targets, not the authoritative long-term source of truth
- `@repo/env` is the typed runtime access boundary, not the secret store

This matches the repo’s deployment/security posture, env matrix, and env package design. :contentReference[oaicite:7]{index=7} :contentReference[oaicite:8]{index=8} :contentReference[oaicite:9]{index=9}

### 2. Smallest truthful scope wins

Choose the narrowest scope that is actually true:

- app-local first
- shared only when multiple bounded consumers truly need the same value
- server-only unless browser exposure is genuinely required
- project-level before team-wide when possible
- environment-specific before globally reused

The repo already treats client-specific secrets and narrow project scoping as the default posture. :contentReference[oaicite:10]{index=10} :contentReference[oaicite:11]{index=11}

### 3. Public browser env is not “safe by default”

A value does **not** become browser-safe just because it is “not super secret.”

Public browser env should contain only intentionally exposed public config.

In the current stack:

- Astro exposes only `PUBLIC_` variables to client-side code
- Next.js exposes client env only through `NEXT_PUBLIC_`
- Next public env is inlined at build time and frozen into the client bundle
- Astro client env is also build-time/static in the normal path

That means browser env is the wrong place for secrets, request-scoped values, mutable runtime toggles, or post-build deployment overrides. :contentReference[oaicite:12]{index=12}

### 4. Runtime access must stay explicit

The repo’s env package design is explicit:

- no hidden `dotenv` loading inside `packages/env`
- no raw ambient env sprawl outside approved binding points
- no `next.config.*` env usage
- explicit app-local binding files
- separate server and browser entrypoints
- Next client binding must use direct property reads
- Astro client binding can use `import.meta.env`

These are canonical repo decisions and should not be weakened in implementation. :contentReference[oaicite:13]{index=13} :contentReference[oaicite:14]{index=14}

### 5. Env work is deployment work

Changing an environment variable is not “just config.”

On Vercel, env changes apply to **new** deployments, not old ones. After changing a variable, you must redeploy the project for the change to reach a deployment. :contentReference[oaicite:15]{index=15}

---

## Classification model

Before adding or editing anything, classify the value on four axes.

### A. Sensitivity

Choose one:

- **Secret** — exposure would materially expand risk
- **Sensitive operational** — not always a secret, but should still stay server-side
- **Public config** — intentionally client-safe
- **Build/runtime metadata** — non-secret environment markers or deployment metadata

This is the repo’s canonical classification model. :contentReference[oaicite:16]{index=16}

### B. Owner

Choose the boundary that truly owns the value:

- one deployable app
- one shared runtime package through approved composition
- one CI environment
- one deployment platform boundary
- rarely, a broader shared repo boundary

### C. Runtime boundary

Choose one:

- server-only
- client-safe
- CI-only
- tooling/config-only

### D. Environment target

Choose which real environments need it:

- Development
- Preview
- Production
- optionally a justified custom environment such as staging or QA

Vercel supports development, preview, production, and custom environments; custom environments are available on Pro and Enterprise plans. :contentReference[oaicite:17]{index=17}

---

## Standard workflow

## Step 1: Decide whether the value should exist at all

Before creating a variable, confirm:

- what exact problem it solves
- which code path reads it
- whether an existing value already covers the use case
- whether this should be config, secret, or actual data
- whether the value belongs in env at all rather than code/content/DB/provider settings

Do **not** add env variables for:

- vague future flexibility
- app-local business data that belongs in content or storage
- per-user or request-scoped values
- secrets that are only being added because a shared package is reading ambient env ad hoc

If the only reason a value exists is “something might need it later,” stop.

---

## Step 2: Choose the smallest truthful owner and scope

Use the current repo defaults:

### Ordinary public sites

Default posture:

- secrets stay app-local and server-only
- public config is minimal
- analytics public IDs are app-local if used
- DB and auth env should not be assumed
- domain/canonical config is app-local and explicit
- shared repo-level env is rare

That is already the approved public-site env posture. :contentReference[oaicite:18]{index=18}

### Future protected/internal apps

Expected posture:

- auth/session secrets required and server-only
- DB credentials server-only
- integration credentials server-only
- public browser config still explicit and minimal

That remains a future path, not the default current burden for public sites. :contentReference[oaicite:19]{index=19}

### CI/workflow-only values

Use GitHub Actions secrets only when the value is for workflow execution rather than app runtime.

GitHub supports repository, environment, and organization secrets; choose the narrowest truthful one. Environment secrets are appropriate when the workflow job is tied to a protected deployment environment. :contentReference[oaicite:20]{index=20}

---

## Step 3: Choose the correct storage target

### A. Vercel project environment variables

Use this for deployable app runtime values.

Default rule:

- app runtime config lives on the app’s Vercel project
- client-site secrets should stay on that client site’s project
- do not widen to team-wide unless the value is truly global

Vercel lets you configure variables per environment and per project, and team-wide variables also exist when justified. :contentReference[oaicite:21]{index=21}

### B. GitHub Actions secrets

Use this for CI/CD or workflow execution values.

Important current GitHub rules:

- secrets must be explicitly referenced in a workflow to be readable
- environment secrets can be protected by required reviewers
- actions secrets are not passed to workflows triggered by forked PRs
- GitHub automatically redacts stored secret values printed in logs, but redaction is not a substitute for safe handling

These are current GitHub constraints and should shape workflow design. :contentReference[oaicite:22]{index=22}

### C. Local env files

Use local files only as a local developer convenience target.

They are not the canonical source of truth.

Default local file posture:

- keep local env app-local where practical
- do not normalize a root monorepo `.env`
- never commit actual env files
- prefer explicit file names such as `.env.local` when pulling or creating local copies
- treat local files as synced working copies, not durable authority

This matches the repo’s env package and Turborepo posture. :contentReference[oaicite:23]{index=23} :contentReference[oaicite:24]{index=24}

---

## Step 4: Add or update the value on Vercel correctly

### Link the project first

The current Vercel multi-environment guide expects a linked project before managing variables through the CLI:

```bash
vercel link
````

([Vercel][1])

### Add a normal variable

Use the correct environment target:

```bash
vercel env add KEY_NAME production
vercel env add KEY_NAME preview
vercel env add KEY_NAME development
```

Vercel’s current guide also supports piping values through stdin where appropriate. ([Vercel][1])

### Add a sensitive variable

For secrets in production/preview, use Vercel sensitive variables:

```bash
vercel env add API_SECRET production --sensitive
```

Current Vercel behavior:

* sensitive vars hide their values after creation
* their current values are non-readable later in the dashboard
* the key name remains fixed
* sensitive variables are only available for preview and production, not development
* teams can enforce a policy that newly created preview/production variables are sensitive by default

([Vercel][1])

### Add branch-specific preview overrides only when necessary

Vercel supports preview overrides tied to a Git branch, and branch-specific preview vars override the generic preview value with the same name.

Use this only for real branch-specific needs, not as a casual config sprawl pattern. ([Vercel][2])

### Remember redeploy behavior

After changing a variable on Vercel:

* the change does not affect already-created deployments
* you must redeploy to apply it to a deployment

Treat “env updated” and “deployment updated” as separate events. ([Vercel][3])

---

## Step 5: Wire runtime access through approved boundaries

### Apps must bind explicitly

Do not read raw ambient env throughout the app.

Use explicit local binding files that call the relevant `@repo/env` app creator.

### Next.js rules

For Next:

* non-`NEXT_PUBLIC_` values are server-only
* `NEXT_PUBLIC_` values are inlined into browser bundles at build time
* after build, those public values are frozen
* dynamic lookups are not inlined
* therefore client bindings must use direct property reads, not a generic loop over `process.env`

This matches both current Next.js docs and the repo’s env package design. ([Next.js][4]) 

### Astro rules

For Astro:

* app/runtime code reads env through `import.meta.env`
* only `PUBLIC_` values are exposed to client code
* `.env` values are not available through `import.meta.env` inside `astro.config.*`
* `astro:env` is limited to Astro context; config files and arbitrary scripts must fall back to `process.env` or explicit loading

This matches current Astro docs and the repo’s env package rules. ([Astro Docs][5]) 

### Repo-specific env package rules

Keep these hard rules:

* no `dotenv` loading inside `packages/env`
* no `next.config.* env`
* no browser modules importing server env
* no raw `process.env` spread across the repo outside approved boundaries
* no second env abstraction system per app
* no wildcard deep imports into `@repo/env`

These are already part of the current package canon.  

---

## Step 6: Coordinate Turborepo and caller behavior

Using `@repo/env` is not enough by itself.

Turborepo’s current strict-mode behavior matters:

* Strict Mode filters task runtime env to variables declared in `env` / `globalEnv`
* Strict Mode improves cache safety
* passthrough env is for values needed at runtime but not hash-affecting
* `.env` files are not loaded by Turbo itself
* CI vendor vars may need explicit accounting if framework inference does not cover them

The repo’s env package canon already expects strict env accounting and app/package-local ownership. ([Turborepo][6]) 

When a new variable affects build/test/dev tasks:

1. update the relevant env contract/binding
2. update `turbo.json` env accounting if the task needs it
3. update task inputs/global dependencies when `.env*` changes must invalidate cache
4. keep passthrough usage rare and deliberate

Do not “fix” missing env by switching the repo casually into loose mode.

---

## Step 7: Pull and verify locally

### For Vercel CLI workflows

Vercel currently supports two useful sync patterns:

#### A. Pull to `.vercel/` for `vercel dev` / `vercel build`

```bash
vercel pull --environment=preview
vercel pull --environment=production
```

This stores environment values and project settings under `.vercel/` for offline CLI usage. ([Vercel][1])

#### B. Export to a local env file for framework-local dev

```bash
vercel env pull .env.local
```

Vercel’s CLI supports exporting development variables into a local env file, and `vercel env pull` can write to a file you choose. ([Vercel][7])

### Important local rule

Prefer explicit output files and app-local placement.

Do **not** normalize an undocumented root `.env` habit just because the CLI can create one by default. That would conflict with the repo’s app-local env ownership posture. 

### `vercel dev` note

If you are using `vercel dev`, Vercel automatically downloads Development environment variables into memory, so a separate `vercel env pull` is not required for that path. ([Vercel][2])

### Local verification commands

Examples:

```bash
vercel env run -e preview -- pnpm turbo build --filter=<target>
vercel env run -e production -- pnpm turbo test --filter=<target>
```

Vercel’s current multi-environment guide explicitly supports `vercel env run` for commands against a specific environment target. ([Vercel][1])

---

## Step 8: Validate the right things

Minimum validation after an env/secrets change should include, as applicable:

* the value exists in the intended target environment
* the wrong environments do **not** have it by accident
* local binding/parsing succeeds
* preview build/runtime behavior is correct
* production deploy behavior is correct after redeploy
* browser code only sees intentionally public values
* no secret value appeared in console logs, screenshots, docs, fixtures, or PR text

Use the narrowest valid command set first, then widen if the blast radius is shared.

---

## Rotation workflow

Rotate a secret when:

* compromise is suspected
* the upstream provider credential changed
* a team member or vendor access boundary changed
* periodic rotation is part of policy
* a client handoff/ejection requires fresh credentials

### Rotation sequence

1. create or obtain the replacement credential
2. add/update it in the correct platform boundary
3. keep the old value valid temporarily if zero-downtime cutover is needed
4. pull locally or verify through preview
5. redeploy the affected app(s)
6. validate real behavior
7. revoke/remove the old credential
8. note the operational change without recording the secret itself

For Vercel-sensitive variables, the current value is hidden when edited, so treat rotation as replace-and-verify rather than “read back and compare.” ([Vercel][8])

---

## Removal and deprecation workflow

Remove a value only when all consumers are gone.

Sequence:

1. find the runtime readers
2. remove code/config readers first or gate them safely
3. remove Turbo/env accounting if no longer needed
4. remove local references
5. remove the Vercel or GitHub secret
6. redeploy if runtime deployments were using it
7. update any reference docs affected by the removal

For Vercel, `vercel env rm KEY_NAME <environment>` removes the variable from a specific target, with optional `--yes` for automated flows. ([Vercel][1])

---

## GitHub Actions rules

Use GitHub secrets only for workflow concerns.

### Choose the right GitHub scope

* repository secret — repository-wide workflow use
* environment secret — jobs targeting a specific environment
* organization secret — genuinely shared multi-repo use

GitHub documents all three scopes and their access model. ([GitHub Docs][9])

### Keep permissions narrow

GitHub recommends minimum permissions, read-only where possible, and service/app-style credentials instead of broad user tokens when available. ([GitHub Docs][10])

### Know the fork restrictions

GitHub’s current rules matter:

* actions secrets are not passed to workflows triggered by fork PRs
* public repositories can require approval before fork PR workflows run
* settings exist that can deliberately send secrets to fork PR workflows, but that materially raises risk and should not be turned on casually

([GitHub Docs][9])

### Redaction is not enough

GitHub automatically redacts stored secret values in logs, but redaction is not guaranteed for every transformation of the value. Do not rely on masking as your primary protection. ([GitHub Docs][10])

---

## What must never happen

* committing `.env` files
* pasting secret values into docs, tickets, PRs, screenshots, fixtures, or chats
* widening app-local client secrets into broad shared scope for convenience
* putting server secrets into browser env
* using `next.config.* env`
* reading raw ambient env everywhere instead of binding it
* letting packages become hidden secret readers with unclear ownership
* creating a root monorepo `.env` habit as the default
* changing Vercel env and assuming existing deployments updated automatically
* rotating a secret without verifying the replacement path first

The repo’s contribution rules already ban exposing secret values in docs, logs, screenshots, and fixtures. 

---

## Later-stage and enterprise options

These are valid **later** maturity paths, but they are not the current repo baseline.

### AWS Secrets Manager

AWS positions Secrets Manager as a way to securely store, retrieve, manage, and rotate credentials, API keys, OAuth tokens, and other secrets through their lifecycle. ([AWS Documentation][11])

### HashiCorp Vault

Vault’s current documentation emphasizes centralized secret management, credential rotation, generated credentials, auditing, and compliance-oriented control. ([HashiCorp Developer][12])

### 1Password Secrets Automation

1Password’s current platform supports service accounts or Connect servers for app/infrastructure secret automation, with service accounts positioned for automated access and Connect for more control and caching in your infrastructure. ([1Password Developer][13])

### Repo rule for later adoption

Do not adopt a centralized enterprise secrets manager just because it sounds more “serious.”

Escalate only when Vercel project env + GitHub workflow secrets stop being operationally sufficient because of:

* cross-environment rotation burden
* audit/compliance requirements
* dynamic secret generation needs
* multi-runtime secret distribution complexity
* repeated operational pain that the current model no longer handles cleanly

Until then, keep the baseline boring.

---

## Relationship to other docs

Related canonical docs:

* `docs/reference/env-matrix.md`
* `docs/reference/commands.md`
* `docs/architecture/deployment-security.md`
* `docs/architecture/data-auth-integrations.md`
* `docs/architecture/public-sites.md`
* `docs/operations/local-development.md`
* `docs/operations/deployment-and-rollbacks.md`

Related package canon:

* `packages/env`
* `packages/auth`
* `packages/db`
* `packages/analytics`
* `packages/observability`
* `packages/integrations-core`

---

## Definition of done

This workflow is being followed correctly when:

* each value has a clear owner
* each value has the smallest truthful scope
* browser exposure is explicit rather than accidental
* runtime access flows through approved bindings
* Turbo/env accounting remains correct
* local verification is possible without leaking secrets
* preview/production behavior is verified after redeploy where required
* GitHub workflow secrets are scoped deliberately
* rotated secrets are replaced and validated before revocation
* no secret value was committed or surfaced unsafely

---

## Final rule

Environment handling should be boring.

A value is handled correctly when:

* ownership is obvious
* scope is narrow
* runtime access is explicit
* client exposure is intentional
* platform storage matches the real consumer
* local verification is possible
* rotation and removal are routine
* nothing sensitive leaked while doing any of the above