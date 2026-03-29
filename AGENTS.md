# repo/AGENTS.md

Root operating instructions for AI agents working in this repository.

Read this file first, then the nearest local `AGENTS.md`. Do not read `README.md` or `CONTRIBUTING.md` by default unless the task or a local rule requires it.

---

## Commands

```bash
pnpm install
pnpm turbo build
pnpm turbo test
pnpm turbo lint
pnpm turbo typecheck
````

Target a specific app or package when possible:

```bash
pnpm turbo build --filter=<target>
pnpm turbo test --filter=<target>
pnpm turbo lint --filter=<target>
pnpm turbo typecheck --filter=<target>
```

Verify with the narrowest valid commands first. Widen when shared packages, repo config, or cross-app impact is involved.

Never claim a command passed if you did not run it.

---

## Always

* Read the nearest local `AGENTS.md` before editing a subtree.
* Prefer the smallest valid change.
* Prefer existing patterns over invention.
* Prefer Astro-first, public-site-first solutions unless a narrower local rule says otherwise.
* Keep visible public-site implementation app-local unless reuse is clearly proven.
* Run validation before considering work complete.
* Update docs when changing a durable boundary, workflow, or rule.
* Link to canonical docs instead of restating policy.
* Be explicit about uncertainty, skipped validation, and substitutions.

---

## Ask first

* adding a dependency
* changing a dependency version
* creating a new package
* creating a new app family
* adding a new top-level directory
* changing CI/CD, deployment, or infra structure
* changing auth, tenancy, or database posture
* introducing Next.js, auth, database requirements, or protected-app patterns into public-site work
* moving app-specific UI or composition into shared packages
* introducing a new external platform or paid service
* making a broad refactor not required by the task

---

## Never

* hardcode or commit secrets, tokens, or credentials
* create vague root runtime folders like `src/`, `lib/`, `shared/`, `common/`, `utils/`, or `helpers/`
* create ad hoc root planning or workflow docs outside the approved docs structure
* put app business logic or surface composition into shared packages without proven reuse
* turn `packages/ui` or other shared packages into a warehouse for marketing sections or client-specific page composition
* treat adapter docs as canonical policy
* treat skills as the canonical home for architecture truth
* delete, weaken, or skip tests to force green
* invent structure when existing docs already define it

---

## Repo rules

* `apps/` = deployable applications
* `packages/` = shared libraries
* `docs/` = canonical documentation
* `infra/` = infrastructure-related material
* `scripts/` = justified operational scripts
* `tests/` = repo-level and cross-app tests

Root is control-plane only. Do not create new root runtime folders or vague shared buckets.

Real client sites live under `apps/sites/clients/<client-slug>`.

Prospect/demo work should usually remain non-permanent unless explicitly approved for repo inclusion.

Packages must keep public APIs narrow and must not absorb app-specific routing, layout, or brand-heavy UI.

---

## Git workflow

* branch prefixes: `feat/`, `fix/`, `docs/`, `chore/`
* Conventional Commits preferred
* keep changes small and reviewable
* do not push directly to `main`

---

## Docs update order

When a durable rule or workflow changes, update in this order:

1. canonical doc in `docs/`
2. affected local `README.md` or `AGENTS.md`
3. thin adapter docs if needed
4. skill docs if procedure changed

Do not update only an adapter doc and leave canonical docs stale.

---

## Large-task rule

For substantial or multi-session work, use a task packet under:

* `docs/features/<slug>/requirements.md`
* `docs/features/<slug>/plan.md`
* `docs/features/<slug>/tasks.md`
* `docs/features/<slug>/handoff.md`

When a task packet produces a durable repo decision, promote that truth into canonical docs.

---

## Testing

* Run the narrowest relevant validation after changes; widen for shared package or config changes.
* If a test fails, diagnose the cause instead of bypassing it.
* If validation cannot be run, state exactly what could not be run and why.

Posture:

* `packages/` → unit and boundary validation
* shared UI → component or Storybook checks where present
* public apps → smoke and accessibility checks
* repo config → broader workspace validation

---

## Security

* Never commit `.env` values, secrets, or private credentials.
* Never print sensitive values in logs, fixtures, screenshots, or docs.
* Prefer server-only boundaries for sensitive logic.
* Use repo env patterns instead of ad hoc `process.env` sprawl.

---

## Escalation

When unclear:

1. read the nearest local `AGENTS.md`
2. read the relevant canonical docs in `docs/`
3. prefer the more local, simple, and reversible change
4. stop and ask before making a broad structural decision

---

## Defaults

* Node.js: `22.x`
* pnpm: `10.x`
* Astro-first for current public-site work
* public sites first
* local-first, code/content-file-first
* private/proprietary unless an explicit license says otherwise

```

Main fixes were the unclosed command fence, replacing the decorative separators with real markdown rules, and normalizing all sections into valid markdown lists.
```
