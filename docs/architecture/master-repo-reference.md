# repo/docs/architecture/master-repo-reference.md

Status: Canonical working reference  
Scope: Repository-wide tooling, package ownership, workspace boundaries, and dependency policy  
Validated: 2026-03-25

---

## 1. Purpose

This document is the single working reference for the repository’s structure, tooling, dependency ownership, and implementation boundaries.

It replaces any older single-app setup checklists as the canonical repo-level baseline.

This repository is:

- a `pnpm` + `Turborepo` monorepo
- Astro-first for public sites
- compiled-first for shared packages
- local-content-first for early site content
- Next.js-later, only when a real protected internal product surface exists

This document is intentionally practical. It defines what belongs in the repo now, what is deferred, and what should not be adopted as baseline.

---

## 2. Core platform decisions

### 2.1 Repo shape

The root is the control plane only.

Canonical top-level structure:

```text
root/
├── README.md
├── AGENTS.md
├── apps/
│   ├── site-firm/
│   └── sites/
│       └── clients/
│           └── <client-slug>/
├── packages/
│   ├── auth/
│   ├── db/
│   ├── contracts/
│   ├── design-tokens/
│   ├── ui/
│   ├── analytics/
│   ├── observability/
│   ├── integrations-core/
│   ├── seo-core/
│   ├── seo-astro/
│   ├── seo-next/
│   ├── env/
│   └── testing/
├── docs/
├── infra/
├── scripts/
├── tests/
├── .github/
└── .storybook/
```

Forbidden root drift:

- no `src/` at root
- no `lib/`, `shared/`, `common/`, `utils/`, `helpers/`, `core/`, or vague catch-all buckets at root
- no application runtime code at root

The root owns only:

- workspace membership
- orchestration
- repository governance
- CI/CD
- root-level configs
- documentation entrypoints
- boundary enforcement

### 2.2 App model

Default public site model:

- `apps/site-firm` for the agency site
- `apps/sites/clients/<client-slug>` for each real client site

Default implementation rules:

- Astro-first for public sites
- code/content-file-first for v1
- shared packages for real reuse
- app-local marketing sections by default
- no client-specific apps outside the agreed sites structure unless deliberately justified

### 2.3 Next.js policy

Next.js is not the baseline public-site framework in this repo.

Next.js becomes active only when a real protected/stateful internal operator workflow exists.

Until that happens:

- do not treat `next` as a repo-wide dependency
- do not treat `eslint-config-next` as a repo-wide dependency
- do not standardize Next-specific observability, auth, or SEO tooling as if they are currently active everywhere

---

## 3. Canonical root control-plane files

The root should maintain these files as the main repo control plane:

- `package.json`
- `pnpm-workspace.yaml`
- `pnpm-lock.yaml`
- `.npmrc`
- `.nvmrc`
- `turbo.json`
- `tsconfig.base.json`
- `tsconfig.json`
- `eslint.config.*`
- `prettier.config.*` or equivalent Prettier config
- `vitest.workspace.ts` or equivalent root Vitest workspace config
- `knip.json`
- `.github/` workflows and governance files
- `.storybook/` only if Storybook is active for `@repo/ui`
- `.editorconfig`
- `.gitattributes`
- `.gitignore`

Not canonical root defaults:

- `.mise.toml` as the CI Node version source of truth
- `biome.json` as root baseline
- `lefthook.yml` as baseline unless hooks strategy is deliberately changed
- `.syncpackrc.json` unless Syncpack is deliberately adopted

---

## 4. Package manager policy

## 4.1 Baseline

Use `pnpm` 10.x as the canonical package manager baseline.

Use:

- committed lockfile
- frozen installs in CI
- catalogs in `pnpm-workspace.yaml`
- strict workspace dependency hygiene

### 4.2 Catalog policy

Use pnpm catalogs as the primary anti-drift mechanism.

Typical catalog-owned packages include:

- `typescript`
- `react`
- `react-dom`
- `tailwindcss`
- `zod`
- selected OpenTelemetry packages

Preferred policy:

- use `catalog:` wherever a dependency is intentionally catalog-managed
- use `workspace:*` for local workspace packages
- keep catalog-managed versions centralized

### 4.3 Hardening policy

Use pnpm 10 hardening features deliberately, not blindly.

Good baseline direction:

- `engine-strict=true`
- `strict-peer-dependencies=true`
- `prefer-workspace-packages=true`
- no hoisting strategy that weakens dependency boundaries unless a real package requires it

Optional later hardening:

- `catalogMode: strict`
- `minimumReleaseAge`
- `trustPolicy`
- `blockExoticSubdeps`
- `allowBuilds`

Not baseline by default:

- `enableGlobalVirtualStore`

Reason: it is still an advanced/experimental setting and should not be silently normalized into the repo baseline.

---

## 5. Turborepo policy

Use Turborepo as the monorepo task orchestrator.

Turborepo is the right fit because it:

- works naturally with `pnpm` workspaces
- adds caching and parallelism without forcing a heavy project-graph framework
- matches the repo’s low-intrusion architecture goals
- aligns well with Vercel-based deployment workflows

### 5.1 Root Turborepo rules

Canonical Turborepo baseline:

- root `turbo.json`
- workspace tasks remain package-owned through normal scripts
- strict environment discipline
- outputs declared only where meaningful
- persistent `dev` tasks are non-cached

Recommended baseline patterns:

- `build` depends on upstream `build`
- database codegen tasks are wired into consumers where needed
- `dev` is persistent and non-cached
- `test` declares coverage outputs if generated

### 5.2 Useful root scripts

Typical root scripts:

- `dev`
- `build`
- `lint`
- `type-check`
- `test`
- `check`
- filtered app/package scripts where useful

`--filter` should be used heavily for targeted work.

### 5.3 Generators

Turborepo generators are valid for repeatable scaffolding, especially:

- new client-site creation
- new package scaffolding
- new docs/runbook stubs

A generator is preferred over copy-paste when the structure is standardized.

### 5.4 Remote cache

Canonical now:

- use normal Turborepo remote caching if enabled via Vercel

Later only:

- self-hosted turbo cache
- cache signing hardening

---

## 6. TypeScript policy

Use TypeScript project references for shared packages and any workspace graph that benefits from incremental builds.

### 6.1 Root TypeScript baseline

`tsconfig.base.json` should set the common repo baseline.

Recommended compiler direction:

- `strict: true`
- `target: ES2022`
- `module: ESNext`
- `moduleResolution: Bundler`
- `verbatimModuleSyntax: true`
- `isolatedModules: true`
- `noUncheckedIndexedAccess: true`

### 6.2 Package reference rules

For packages that participate in project references:

- `composite: true`
- `declaration: true`
- `declarationMap: true`

`declarationMap` is especially valuable because it keeps editor and agent navigation on source files instead of `.d.ts` output.

### 6.3 Root `tsconfig.json`

Root `tsconfig.json` should act as the orchestration point for project references, not as a place for runtime app code.

---

## 7. Package authoring policy

All shared runtime packages should be compiled-first.

### 7.1 Public API rules

Use explicit `exports` maps.

Rules:

- no raw-source exports as public API
- no deep-import free-for-all
- only documented entrypoints are public
- server-only and client-only surfaces should be split deliberately when needed

### 7.2 `exports` condition ordering

When using conditional exports that include types, put `types` first in the condition object.

### 7.3 Package boundaries

Every major package should have a local `README.md` covering:

- purpose
- what belongs here
- what does not belong here
- allowed imports
- forbidden imports
- commands
- related docs

---

## 8. Workspace dependency ownership matrix

This section defines which workspace owns which dependencies.

## 8.1 Root workspace

Root owns repo-wide control-plane tooling.

Canonical root `devDependencies`:

- `turbo`
- `typescript`
- `eslint`
- `prettier`
- `vitest`
- `@playwright/test`
- `@axe-core/playwright`
- `msw`
- `knip`

Storybook root ownership, only if Storybook is active:

- `storybook`
- `@storybook/react-vite`
- `@storybook/addon-a11y`
- `@storybook/addon-vitest`

Root should not own runtime framework dependencies for apps by default.

## 8.2 `apps/site-firm`

Owns the agency public site framework/tooling.

Canonical dependencies/devDependencies:

- `astro`
- `tailwindcss`
- `@tailwindcss/vite`
- `@astrojs/sitemap`

Conditional later:

- `@astrojs/mdx`
- `@astrojs/react`
- `react`
- `react-dom`
- `@types/react`
- `@types/react-dom`

Internal package usage as needed:

- `@repo/design-tokens`
- `@repo/seo-core`
- `@repo/seo-astro`
- `@repo/analytics`
- `@repo/contracts`
- `@repo/observability` only if actually wired

## 8.3 `apps/sites/clients/<client-slug>`

Each real client site follows the same baseline as `apps/site-firm` unless a justified exception exists.

Canonical dependencies/devDependencies:

- `astro`
- `tailwindcss`
- `@tailwindcss/vite`
- `@astrojs/sitemap`

Conditional later:

- `@astrojs/mdx`
- `@astrojs/react`
- `react`
- `react-dom`
- `@types/react`
- `@types/react-dom`

## 8.4 `packages/contracts`

Purpose: schema-first boundary contract package.

Canonical dependency:

- `zod`

No framework/runtime sprawl belongs here.

## 8.5 `packages/db`

Purpose: Prisma/PostgreSQL database package.

Canonical dependencies:

- `@prisma/client`
- `@prisma/adapter-neon`

Canonical `devDependencies`:

- `prisma`

Rules:

- Prisma client output should be package-owned, not default `node_modules` output
- this package owns migrations, generation, and DB scripts

## 8.6 `packages/auth`

Purpose: auth package for protected app surfaces.

Canonical dependency:

- `better-auth`

Internal dependencies as needed:

- `@repo/db`
- `@repo/contracts`

Do not expand auth scope beyond the already-accepted repo baseline without a real use case.

## 8.7 `packages/design-tokens`

Purpose: token infrastructure package.

Canonical dependency:

- `@vanilla-extract/css`

Canonical `devDependency`:

- `style-dictionary`

No app frameworks belong here.

## 8.8 `packages/ui`

Purpose: shared React UI system package.

Canonical `peerDependencies`:

- `react`
- `react-dom`

Canonical `devDependencies`:

- `react`
- `react-dom`
- `@types/react`
- `@types/react-dom`
- `@vanilla-extract/css`

Internal dependency:

- `@repo/design-tokens`

## 8.9 `packages/observability`

Purpose: shared OpenTelemetry-first observability package.

Canonical dependencies:

- `@opentelemetry/api`
- `@opentelemetry/sdk-node`
- `@opentelemetry/exporter-trace-otlp-http`

Conditional later:

- `@sentry/nextjs` only when a real high-value Next app deliberately uses Sentry

## 8.10 `packages/analytics`

Purpose: shared analytics abstraction package.

Canonical now:

- keep vendor dependencies minimal unless a real surface requires them

Conditional later:

- `posthog-js`
- `posthog-node`
- other provider SDKs only when a concrete adapter/surface requires them

Apps should not import analytics vendors directly if the shared package is meant to own the abstraction.

## 8.11 `packages/seo-core`

Purpose: framework-agnostic SEO policy engine.

Canonical third-party dependencies:

- none required beyond what is truly needed

Internal dependency:

- `@repo/contracts`

No Astro- or Next-specific packages belong here.

## 8.12 `packages/seo-astro`

Purpose: Astro SEO adapter.

Recommended model:

- `peerDependencies`: `astro`
- `devDependencies`: `astro` if needed for local build/test

Keep it thin.

## 8.13 `packages/seo-next`

Purpose: Next SEO adapter.

Status now:

- may exist as a planned/stub package
- do not activate its Next dependency stack until a real protected Next app exists

When activated later:

- `next`
- `eslint-config-next`

---

## 9. Astro policy

### 9.1 Public-site baseline

Astro is the default framework for public sites in this repo.

### 9.2 Styling

Tailwind 4 should be integrated through the official Vite plugin path.

Do not use `@astrojs/tailwind` as the baseline.

### 9.3 Content model

Use local content collections for v1.

Default content posture:

- local files
- typed collections where appropriate
- blog/resource support planned from the start
- no CMS required for early sites

### 9.4 React inside Astro

React inside Astro is conditional, not assumed.

Only add:

- `@astrojs/react`
- `react`
- `react-dom`

when a site actually needs React islands or consumes React-only shared components.

### 9.5 Shared packages in Astro

Default policy:

- shared packages should be compiled-first
- use `vite.ssr.noExternal` only when genuinely needed for a package Astro/Vite must bundle directly

---

## 10. Storybook policy

Storybook is not a general repo baseline for every surface.

It is justified when `@repo/ui` is active as a real React component system.

If Storybook is enabled, use:

- `storybook`
- `@storybook/react-vite`
- `@storybook/addon-a11y`
- `@storybook/addon-vitest`

Do not use `@storybook/html-vite` for the shared React UI package.

Storybook lives at root through `.storybook/`, but it exists to serve `packages/ui`.

---

## 11. Testing policy

### 11.1 Unit and package tests

Use Vitest as the shared baseline.

Recommended posture:

- unit tests colocated within packages/apps where appropriate
- root Vitest workspace config for orchestration
- shared test presets only where they reduce real duplication

### 11.2 E2E tests

Use Playwright for E2E.

Root `tests/` should be reserved for:

- cross-package integration tests
- full-system E2E
- browser-level flows that do not naturally belong to a single package

### 11.3 Accessibility checks

Use `@axe-core/playwright` for browser-level accessibility assertions.

### 11.4 Mocking

Use MSW as the shared mocking layer where network mocking is useful.

### 11.5 Dead-code auditing

Use Knip as the dead-code and dependency-audit layer.

Knip config should be workspace-aware, not treated like a single-package config.

---

## 12. Linting and formatting policy

Current repo baseline:

- ESLint
- Prettier

Do not silently replace the repo baseline with Biome or Oxlint.

Those tools may be evaluated later, but they are not canonical now.

Reason:

- the repo already has a locked ESLint/Prettier baseline
- changing that is a deliberate migration decision, not a background optimization

---

## 13. Git hooks and commit policy

Canonical now:

- commit standards may use Conventional Commits if adopted at the repo level
- commitlint is valid if release/versioning workflows depend on it

Not canonical by default:

- Husky as a required baseline
- Lefthook as a required baseline

If hooks are adopted, choose one intentionally and document why.

---

## 14. Release/versioning policy

Not all advanced release tooling belongs in v1 by default.

### 14.1 Canonical now

- normal repo version control
- dependency updates through Renovate
- package boundary discipline

### 14.2 Later only

- Changesets, once package publishing/versioning needs justify it
- Syncpack, once version-audit overhead is worth it

Do not make release tooling more complex than the current package/distribution model requires.

---

## 15. CI/CD and GitHub policy

### 15.1 GitHub Actions

Use GitHub Actions for CI/CD and Deployment Checks.

Canonical CI posture:

- setup Node from `.nvmrc` and/or `package.json#engines`
- explicit pnpm caching
- frozen lockfile install
- run lint, type-check, and relevant tests

Do not use `.mise.toml` as the documented `actions/setup-node` version-file baseline.

### 15.2 Rulesets and branch protection

Use GitHub rulesets / branch protection appropriate to the repo plan.

Minimum direction:

- require PRs to merge to protected branches
- require passing status checks
- block force pushes to protected branches
- use CODEOWNERS where useful

### 15.3 Secrets and environments

Use environment-scoped secrets and approval gates where production deployment risk justifies them.

OIDC-based cloud auth is a valid target for later maturity, but it should be adopted deliberately rather than stuffed into the baseline without active need.

---

## 16. Observability policy

Observability remains OpenTelemetry-first.

Canonical now:

- shared `@repo/observability`
- OTLP/HTTP-friendly architecture
- keep observability separate from product analytics vocabulary

Conditional later:

- selective Sentry on high-value Next apps
- stronger collector/gateway hardening as infrastructure matures

---

## 17. Documentation policy

Documentation exists to support both human maintainers and agentic coding workflows.

High-value docs for this repo:

- `docs/architecture/monorepo-map.md`
- `docs/architecture/package-contracts.md`
- ADRs for foundational decisions
- runbooks for repeated operational flows
- local package/app READMEs

The documentation library should optimize for:

- authority
- specificity
- low ambiguity
- low token waste
- clear boundaries
- stable decisions that prevent agent drift

---

## 18. Directory deep-dive policy

### 18.1 `scripts/`

Scripts should be tightly governed.

Rules:

- no vague script dumping ground
- prefer scripts that are context-free or operationally narrow
- no feature/business logic living in `scripts/`
- document purpose of non-trivial scripts

### 18.2 `tests/`

Root `tests/` is for cross-workspace integration and E2E only.

### 18.3 `infra/`

Owns infrastructure-as-code, environment provisioning, platform integration, and local infra helpers.

### 18.4 `docs/`

Owns architecture docs, ADRs, runbooks, and other stable references.

---

## 19. What is canonical now vs later vs rejected

## 19.1 Canonical now

- pnpm 10.x
- Turborepo
- TypeScript project references
- Astro-first public-site architecture
- Tailwind 4 via Vite plugin in Astro apps
- local content collections for v1
- compiled-first shared packages
- explicit `exports` maps
- Prisma package-owned client output
- Zod in `@repo/contracts`
- Better Auth in `@repo/auth`
- OpenTelemetry baseline in `@repo/observability`
- Vitest
- Playwright
- `@axe-core/playwright`
- MSW
- Knip
- Storybook only when actively serving `@repo/ui`
- ESLint + Prettier
- GitHub Actions + standard protected branch governance

## 19.2 Later / conditional

- Next.js app activation
- `eslint-config-next`
- `@astrojs/mdx`
- React in Astro sites
- PostHog packages
- Sentry in Next apps
- Changesets
- Syncpack
- Dev Containers
- `mise`
- self-hosted Turbo cache
- stronger pnpm hardening knobs once intentionally adopted

## 19.3 Rejected as baseline

- `@astrojs/tailwind`
- treating Next.js as a current repo-wide dependency baseline
- `@storybook/html-vite` for the React UI package
- using `.mise.toml` as CI Node-version source of truth
- enabling experimental pnpm global virtual store as a default repo policy
- silently switching the repo to Biome/Oxlint
- promoting a giant flat single-app dependency list into monorepo source-of-truth

---

## 20. Recommended workspace build/install activation order

Recommended activation order:

1. root control-plane tooling
2. `packages/contracts`
3. `packages/design-tokens`
4. `packages/db`
5. `packages/auth`
6. `packages/ui`
7. `packages/observability`
8. `packages/seo-core`
9. `packages/seo-astro`
10. `apps/site-firm`
11. first client-site template/app
12. analytics/provider extras only when actually needed
13. Next-only surfaces later

This keeps the repo graph aligned with actual dependencies:

- contracts/tokens/data foundations first
- adapters second
- apps last

---

## 21. Implementation notes for future repo docs

This document is the high-level master reference.

It should be supported by more focused documents, not replaced by them.

Recommended companion docs:

- `docs/architecture/monorepo-map.md`
- `docs/architecture/dependency-ownership.md`
- `docs/architecture/tooling-policy.md`
- `docs/architecture/testing-strategy.md`
- `docs/architecture/documentation-strategy.md`
- ADRs for decisions that must not be reopened casually

---

## 22. Final rule

When planning or adding a dependency, always answer these questions before installation:

1. Which workspace owns it?
2. Is it canonical now, conditional later, or rejected?
3. Does it belong to the root control plane or to a specific surface?
4. Does it strengthen boundaries, or blur them?
5. Does it solve an active problem, or is it speculative?

If those questions are not answered clearly, the dependency should not be added yet.
