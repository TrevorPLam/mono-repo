# repo/root-canonical.md

Repository root: final source of truth

This is the canonical source of truth for the repository root.

The root is the control plane of the monorepo. It exists to define and enforce structure. It owns workspace membership, repo-wide policy, orchestration, CI/CD, docs entrypoints, and root automation. It does not own runtime feature code, product business logic, random helpers, or any vague shared-code bucket.

1) Canonical role of the root

The root has one job: make the rest of the repo legible and enforceable.

It must do all of the following:
	•	define the workspace and package manager policy
	•	define repo-wide build, lint, typecheck, and test orchestration
	•	define repo-wide governance and CI/CD
	•	provide short entrypoints for humans and agents
	•	house top-level directories with explicit boundaries
	•	prevent architectural drift

It must not do any of the following:
	•	contain runtime app code
	•	contain shared library code
	•	become a fallback dumping ground
	•	hold framework runtime files that belong to an app
	•	become a second home for package- or app-local concerns

2) Root rules that are non-negotiable

These are locked.

Structural boundaries
	•	apps/ contains deployable applications only
	•	packages/ contains reusable libraries only
	•	docs/ contains canonical documentation only
	•	infra/ contains infrastructure and platform configuration only
	•	scripts/ contains repo automation only
	•	tests/ contains cross-app E2E and smoke coverage only

Forbidden root directories and buckets

These must never exist at the repository root:
	•	src/
	•	lib/
	•	shared/
	•	common/
	•	utils/
	•	helpers/
	•	core/
	•	libs/

These must never be created as drift patterns:
	•	apps/client-*
	•	apps/admin
	•	apps/mobile
	•	packages/shared
	•	packages/common
	•	packages/misc

Import and ownership rules
	•	workspaces import other workspaces by package name only
	•	no cross-workspace relative imports
	•	no importing private internals from another app
	•	if something is truly shared, it earns a named package
	•	if something is app-specific, it stays in that app

3) Canonical root tree

repo/
├─ README.md
├─ AGENTS.md
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ .npmrc
├─ turbo.json
├─ tsconfig.base.json
├─ tsconfig.json
├─ eslint.config.mjs
├─ prettier.config.mjs
├─ .prettierignore
├─ .editorconfig
├─ .gitattributes
├─ .gitignore
├─ .git-blame-ignore-revs
├─ playwright.config.ts
├─ vitest.projects.ts
├─ .github/
│  ├─ CODEOWNERS
│  ├─ dependabot.yml
│  ├─ pull_request_template.md
│  └─ workflows/
│     ├─ ci.yml
│     ├─ reusable-quality.yml
│     ├─ deployment-checks.yml
│     ├─ preview-guards.yml
│     └─ dependency-hygiene.yml
├─ .storybook/
│  ├─ main.ts
│  └─ preview.ts
├─ apps/
│  ├─ README.md
│  ├─ site-firm/
│  ├─ site-platform/
│  └─ app-booking/
├─ packages/
│  ├─ README.md
│  ├─ auth/
│  ├─ db/
│  ├─ env/
│  ├─ contracts/
│  ├─ design-tokens/
│  ├─ ui/
│  ├─ analytics/
│  ├─ observability/
│  ├─ integrations-core/
│  ├─ seo-core/
│  ├─ seo-astro/
│  ├─ seo-next/
│  └─ testing/
├─ docs/
│  ├─ README.md
│  ├─ 00-foundation/
│  │  ├─ 00-canonical-platform-decision.md
│  │  ├─ 01-repo-map.md
│  │  ├─ 02-hard-rules.md
│  │  ├─ 03-glossary.md
│  │  └─ 04-decision-index.md
│  ├─ 10-architecture/
│  │  ├─ 11-app-topology.md
│  │  ├─ 12-package-boundaries.md
│  │  ├─ 13-auth-architecture.md
│  │  ├─ 14-data-architecture.md
│  │  ├─ 15-styling-system.md
│  │  ├─ 16-analytics-architecture.md
│  │  ├─ 17-seo-architecture.md
│  │  ├─ 18-integrations-architecture.md
│  │  ├─ 19-observability-architecture.md
│  │  ├─ 20-security-baseline.md
│  │  ├─ 21-testing-strategy.md
│  │  ├─ 22-deployment-topology.md
│  │  └─ 23-mobile-future.md
│  ├─ 20-apps/
│  │  ├─ site-firm.md
│  │  ├─ site-platform.md
│  │  └─ app-booking.md
│  ├─ 30-packages/
│  │  ├─ auth.md
│  │  ├─ db.md
│  │  ├─ env.md
│  │  ├─ contracts.md
│  │  ├─ design-tokens.md
│  │  ├─ ui.md
│  │  ├─ analytics.md
│  │  ├─ observability.md
│  │  ├─ integrations-core.md
│  │  ├─ seo-core.md
│  │  ├─ seo-astro.md
│  │  ├─ seo-next.md
│  │  └─ testing.md
│  ├─ 40-operations/
│  │  ├─ local-dev.md
│  │  ├─ db-migrations.md
│  │  ├─ access-and-secrets.md
│  │  ├─ deployment-rollout.md
│  │  ├─ rollback.md
│  │  └─ incident-response.md
│  ├─ 50-agents/
│  │  ├─ coding-rules.md
│  │  ├─ definition-of-done.md
│  │  ├─ directory-placement-rules.md
│  │  └─ task-template.md
│  └─ 90-work-tracking/
│     └─ TODO.md
├─ infra/
│  ├─ README.md
│  ├─ terraform/
│  │  ├─ README.md
│  │  ├─ modules/
│  │  │  ├─ vercel-project/
│  │  │  ├─ vercel-domain/
│  │  │  └─ shared-secrets-policy/
│  │  └─ environments/
│  │     ├─ production/
│  │     └─ preview/
│  ├─ otel/
│  │  ├─ README.md
│  │  ├─ collector.yaml
│  │  └─ processors/
│  └─ vercel/
│     ├─ README.md
│     └─ project-mapping.md
├─ scripts/
│  ├─ README.md
│  ├─ bootstrap/
│  ├─ checks/
│  ├─ codegen/
│  ├─ db/
│  ├─ tokens/
│  └─ vercel/
└─ tests/
   ├─ README.md
   ├─ e2e/
   ├─ smoke/
   ├─ fixtures/
   └─ global-setup.ts

4) Root files: exact purpose and ownership

README.md

This is the human entrypoint.

It should explain:
	•	what the repo is
	•	which three deployable apps exist
	•	how the monorepo is divided between apps, packages, docs, infra, scripts, and tests
	•	how to get started locally
	•	the most common root commands
	•	which docs to read first

It should not duplicate the architecture docs. It is a front door, not the whole house.

AGENTS.md

This is the shortest high-signal agent brief.

It should contain:
	•	repo mission in a few lines
	•	hard placement rules
	•	forbidden directories
	•	the difference between apps, packages, docs, infra, scripts, and tests
	•	the exact docs agents should read first

It should stay short. It is not a second architecture manual.

package.json

This is the root workspace manifest.

It owns:
	•	root-level scripts only
	•	root devDependencies only
	•	repo metadata
	•	packageManager
	•	engines

It does not own:
	•	app runtime dependencies
	•	shared business logic
	•	config that already has a dedicated config file

Canonical root scripts

These are the root orchestration scripts to standardize on:
	•	dev
	•	dev:firm
	•	dev:platform
	•	dev:booking
	•	build
	•	lint
	•	typecheck
	•	test
	•	test:unit
	•	test:e2e
	•	storybook
	•	format
	•	format:check
	•	check
	•	db:generate
	•	db:migrate
	•	tokens:build

Rules for scripts:
	•	root scripts orchestrate, they do not replace local scripts
	•	local apps and packages still define their own scripts
	•	root scripts should be boring, predictable pass-throughs

pnpm-lock.yaml

Committed and required. Deterministic installs are part of the repo baseline.

pnpm-workspace.yaml

This file owns:
	•	workspace membership
	•	structured pnpm workspace policy
	•	build-script approval policy
	•	repo-level pnpm security settings that belong in YAML

Locked workspace membership
	•	apps/*
	•	packages/*

Locked pnpm baseline

These are already accepted project decisions and belong in the root package-manager posture:
	•	pnpm latest 10.x baseline, with 10.26+ minimum
	•	committed lockfile
	•	frozen installs in CI
	•	allowBuilds
	•	blockExoticSubdeps
	•	minimumReleaseAge
	•	optional trust policy with no-downgrade posture if adopted

This file must not become a note-taking area.

.npmrc

This is repo-wide package-manager behavior.

It should own install policy and strictness defaults, not secrets.

Examples of what belongs conceptually:
	•	engine strictness
	•	workspace install behavior
	•	package-manager policy
	•	repo-wide defaults that do not belong in pnpm-workspace.yaml

This file must stay clean and minimal.

turbo.json

This is the root task graph.

It owns:
	•	task definitions
	•	dependency edges
	•	outputs
	•	caching behavior
	•	env hashing rules

Locked Turborepo posture

Already settled project decisions:
	•	keep task defaults simple
	•	no default dependsOn for test beyond what is truly needed
	•	no custom inputs unless necessary later
	•	use strict env accounting
	•	use signed remote cache
	•	keep build graph explicit and boring

Canonical task surface

At minimum, root should model:
	•	dev
	•	build
	•	lint
	•	typecheck
	•	test
	•	storybook
	•	tokens:build

tsconfig.base.json

Shared TypeScript baseline.

It owns:
	•	strict compiler defaults
	•	shared module resolution
	•	shared JSX and module behavior
	•	repo-wide TS stance

It does not own:
	•	project references
	•	app-local includes/excludes
	•	per-package emit details

tsconfig.json

Root solution-style TS entrypoint.

It should:
	•	extend tsconfig.base.json
	•	use files: []
	•	serve as the editor/tooling anchor
	•	optionally hold references if useful

It is not a second base config.

eslint.config.mjs

This is one of the most important anti-drift files in the root.

It must enforce:
	•	repo-wide lint policy
	•	import boundaries
	•	no cross-app private imports
	•	no server-only code in browser/client surfaces
	•	no vendor SDK imports directly in apps when a shared package exists
	•	ignores for generated files and outputs
	•	script/test/storybook overrides where needed

This is where structural enforcement becomes part of normal development, not just docs.

prettier.config.mjs

Minimal formatting policy for the entire repo.

The goal is consistency, not cleverness.

.prettierignore

Ignore file for build output, caches, reports, and other artifacts that should not be rewritten.

.editorconfig

Normalizes editor behavior across tools.

This should lock basics like:
	•	LF endings
	•	final newline
	•	indentation defaults
	•	trailing whitespace trimming

.gitattributes

Owns text normalization and generated-file marking where useful.

This is where committed generated outputs can be marked as generated to keep diffs cleaner.

.gitignore

Ignore file for:
	•	node_modules
	•	build outputs
	•	coverage
	•	test artifacts
	•	local env files
	•	caches
	•	temp output

It must not ignore committed source-of-truth files.

.git-blame-ignore-revs

Keep this from day one.

It exists so large formatting or codemod commits do not ruin future blame history.

playwright.config.ts

Root Playwright orchestrator.

It owns cross-app E2E and smoke behavior only.

It should define:
	•	browser projects
	•	retries
	•	reporter behavior
	•	local vs CI settings
	•	base URL strategy
	•	global setup

It does not own package-level testing.

vitest.projects.ts

This is the root local-DX Vitest index.

It exists to make monorepo test ergonomics better, while package-local tests still live with the code.

5) .github/: final plan

.github/ is part of the root control plane.

.github/CODEOWNERS

Required.

Even for a solo repo, this is worth having because it formalizes sensitive surfaces and protects future scale.

It should cover at least:
	•	.github/
	•	apps/
	•	packages/
	•	docs/
	•	infra/
	•	scripts/
	•	tests/

.github/dependabot.yml

Included, but conservative.

This should cover:
	•	npm dependencies
	•	GitHub Actions dependencies

Cadence should stay sane. The goal is dependency hygiene, not PR spam.

.github/pull_request_template.md

Required.

It should ask for:
	•	summary
	•	why the change is needed
	•	affected paths
	•	env or migration impact
	•	tests run
	•	docs updated or not needed
	•	rollout or rollback notes where relevant

This improves both human review and agent-generated PR quality.

.github/workflows/reusable-quality.yml

Reusable workflow for common quality jobs.

It should centralize:
	•	checkout
	•	pnpm setup/install
	•	cache-aware tool setup
	•	lint
	•	typecheck
	•	unit and integration tests
	•	builds where appropriate

This reduces workflow drift.

.github/workflows/ci.yml

Primary quality gate.

It should run on pull requests and important branch pushes.

It should call the reusable quality workflow and publish stable check names.

This is the main required status check.

.github/workflows/deployment-checks.yml

Release and promotion guardrail workflow.

It should verify deployment-relevant conditions without duplicating the whole of CI.

Examples of what belongs here:
	•	deployment gating checks
	•	migration safety notes or validation
	•	required rollout/rollback notes when applicable
	•	any stable check names Vercel promotion depends on

.github/workflows/preview-guards.yml

Structural and preview-safety enforcement workflow.

This is where policy gets teeth.

It should catch things like:
	•	forbidden path creation
	•	accidental apps/client-*
	•	forbidden root directories
	•	missing docs updates when architectural files change
	•	obviously unsafe migration or platform changes

.github/workflows/dependency-hygiene.yml

Scheduled or manual dependency hygiene workflow.

It should cover:
	•	lockfile consistency
	•	pnpm policy checks
	•	dependency audit/reporting
	•	outdated/deprecated dependency reporting
	•	generated artifact consistency if needed

6) .storybook/: final plan

Shared Storybook config stays at the root.

.storybook/main.ts

Owns:
	•	story globs
	•	addons
	•	framework integration
	•	docs/test integration setup

.storybook/preview.ts

Owns:
	•	global decorators
	•	parameters
	•	providers or wrappers needed by stories
	•	consistent Storybook defaults

No extra Storybook config files should be added until they are needed.

7) Root-owned top-level directories

apps/

Deployable surfaces only.

Required contents
	•	README.md
	•	site-firm/
	•	site-platform/
	•	app-booking/

apps/README.md

This should explain:
	•	what earns an app
	•	deployables only
	•	why apps/client-* is forbidden by default
	•	which current apps are canonical
	•	how to decide app vs package placement

packages/

Reusable libraries only.

Required contents
	•	README.md
	•	auth/
	•	db/
	•	env/
	•	contracts/
	•	design-tokens/
	•	ui/
	•	analytics/
	•	observability/
	•	integrations-core/
	•	seo-core/
	•	seo-astro/
	•	seo-next/
	•	testing/

packages/README.md

This should explain:
	•	what earns a package
	•	naming rules
	•	public API expectations
	•	import-boundary rules
	•	the ban on vague shared buckets
	•	the rule against speculative empty packages

docs/

Canonical reference library.

Required contents
	•	README.md
	•	00-foundation/
	•	10-architecture/
	•	20-apps/
	•	30-packages/
	•	40-operations/
	•	50-agents/
	•	90-work-tracking/

docs/README.md

This should explain doc structure and reading order.

Locked docs split

This is already settled and should not drift:
	•	foundation docs for repo-wide truth
	•	architecture docs by concern
	•	focused docs for each app
	•	focused docs for each package
	•	ops/runbooks separate from architecture
	•	agent rules separate from architecture
	•	work tracking separate from architecture

infra/

Platform and deployment infrastructure only.

Required contents
	•	README.md
	•	terraform/
	•	otel/
	•	vercel/

infra/README.md

This should explain:
	•	infrastructure-only scope
	•	relationship to docs
	•	what is authoritative in code vs in docs

infra/terraform/

Must contain:
	•	README.md
	•	modules/
	•	environments/

Modules are already locked as:
	•	vercel-project/
	•	vercel-domain/
	•	shared-secrets-policy/

Environments are:
	•	production/
	•	preview/

infra/otel/

Must contain:
	•	README.md
	•	collector.yaml
	•	processors/

infra/vercel/

Must contain:
	•	README.md
	•	project-mapping.md

No root vercel.json is part of the plan.

scripts/

Repo automation only.

Required contents
	•	README.md
	•	bootstrap/
	•	checks/
	•	codegen/
	•	db/
	•	tokens/
	•	vercel/

scripts/README.md

This should explain:
	•	automation-only scope
	•	naming conventions
	•	how scripts are invoked from root scripts
	•	when something belongs here vs inside a package

tests/

Cross-app E2E and smoke only.

Required contents
	•	README.md
	•	e2e/
	•	smoke/
	•	fixtures/
	•	global-setup.ts

tests/README.md

This should explain:
	•	root tests are cross-surface only
	•	local unit/integration tests live with code
	•	how Playwright is organized

8) Root governance decisions that live in platform settings, not git files

These are part of the source of truth even though they are not ordinary committed files.

GitHub governance

Locked decisions:
	•	GitHub rulesets are the main governance layer
	•	the default branch is protected
	•	required checks must have stable names
	•	CODEOWNERS review is enforced on sensitive paths
	•	secret scanning and push protection are enabled
	•	GitHub environments exist for preview and production
	•	merge queue is not enabled yet
	•	squash merge is the default merge posture unless later team scale changes that

CI/CD security posture

Locked decisions:
	•	reusable workflows are the standard pattern
	•	OIDC is preferred for cloud auth
	•	long-lived cloud credentials in GitHub are avoided unless unavoidable
	•	dependency review is part of PR hygiene
	•	code scanning is enabled
	•	provenance/attestation is part of release hardening when relevant

Vercel posture

Locked decisions:
	•	one Vercel project per deployable app
	•	native monorepo detection is preferred
	•	native skip-unaffected behavior is preferred
	•	Deployment Checks gate promotion
	•	Terraform is the long-term source of truth for projects/domains/settings
	•	no root vercel.json unless a later need justifies it

9) Files and tools explicitly not included at the root

These are deliberate non-creations.

Do not add these now:
	•	LICENSE
	•	CONTRIBUTING.md
	•	SECURITY.md
	•	.nvmrc
	•	.node-version
	•	Makefile
	•	Taskfile.yml
	•	docker-compose.yml
	•	compose.yml
	•	vercel.json
	•	.env
	•	.env.example
	•	.env.local
	•	.husky/
	•	commitlint.config.*
	•	.lintstagedrc.*
	•	.changeset/
	•	renovate.json

Why they are excluded:
	•	they do not materially improve the current solo/private repo posture
	•	some duplicate better sources of truth
	•	some add complexity without enough return yet
	•	some are future-scale tooling, not present-need tooling

10) Root conventions that help coding agents

These are locked because your repo is explicitly being built in an agentic workflow.

Every major app and package gets a local README

Each major app and package must include a local README.md with:
	•	purpose
	•	what belongs here
	•	what does not belong here
	•	allowed imports
	•	forbidden imports
	•	key commands
	•	related docs

This lets an agent work locally without reloading the entire repo mental model every time.

Root directory READMEs are required

These must exist:
	•	apps/README.md
	•	packages/README.md
	•	docs/README.md
	•	infra/README.md
	•	scripts/README.md
	•	tests/README.md

Root should prefer explicitness over convenience

If a new thing does not clearly belong somewhere, the answer is not “make a helper folder.” The answer is “decide the correct boundary.”

11) Root scaffolding order

Build the root in this order:

Phase 1: policy and workspace
	•	package.json
	•	pnpm-lock.yaml
	•	pnpm-workspace.yaml
	•	.npmrc
	•	turbo.json

Phase 2: typing, linting, formatting, repo hygiene
	•	tsconfig.base.json
	•	tsconfig.json
	•	eslint.config.mjs
	•	prettier.config.mjs
	•	.prettierignore
	•	.editorconfig
	•	.gitattributes
	•	.gitignore
	•	.git-blame-ignore-revs

Phase 3: entrypoints
	•	README.md
	•	AGENTS.md

Phase 4: governance and CI/CD
	•	.github/CODEOWNERS
	•	.github/dependabot.yml
	•	.github/pull_request_template.md
	•	.github/workflows/reusable-quality.yml
	•	.github/workflows/ci.yml
	•	.github/workflows/deployment-checks.yml
	•	.github/workflows/preview-guards.yml
	•	.github/workflows/dependency-hygiene.yml

Phase 5: shared testing and Storybook orchestration
	•	playwright.config.ts
	•	vitest.projects.ts
	•	.storybook/main.ts
	•	.storybook/preview.ts

Phase 6: top-level directories and guardrail READMEs
	•	apps/README.md
	•	packages/README.md
	•	docs/README.md
	•	infra/README.md
	•	scripts/README.md
	•	tests/README.md

Phase 7: scaffold subtrees

Then create the app, package, docs, infra, scripts, and tests subtrees already locked elsewhere in the project.

12) Definition of done for the repository root

The root is complete when all of the following are true:
	•	every canonical root file exists
	•	every canonical top-level directory exists
	•	every required root-owned README exists
	•	workspace membership is wired and deterministic
	•	root scripts orchestrate the repo cleanly
	•	lint, typecheck, test, and build can be run from the root
	•	GitHub governance files exist and are aligned with the policy
	•	root contains no runtime app or package code
	•	forbidden root patterns are both documented and enforced
	•	a human or agent can determine correct placement without guessing

13) Final closed decisions

There are no meaningful root-architecture decisions left open.

Locked decisions now include:
	•	root is the control plane only
	•	add AGENTS.md
	•	keep committed lockfile
	•	use both tsconfig.base.json and root tsconfig.json
	•	use flat ESLint config
	•	use vitest.projects.ts
	•	use Prettier plus .prettierignore
	•	use .editorconfig
	•	use .gitattributes
	•	use .git-blame-ignore-revs
	•	include .github/dependabot.yml
	•	use reusable workflows
	•	do not place framework runtime config files at the root
	•	do not add a root-wide env example now
	•	do not add root Docker/Vercel project config files now
	•	do not add vague shared buckets ever

This is the final source of truth for the repository root.