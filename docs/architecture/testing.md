# repo/docs/architecture/testing.md

Status: Accepted  
Date: 2026-03-24

## Purpose

Define the architectural posture for testing in this monorepo.

This document explains how testing responsibilities are divided across apps, packages, and repo-level surfaces, which testing tools and patterns are part of the current default model, and how validation depth should scale with the kind of surface being built.

It is the source of truth for testing architecture, not a test-writing tutorial or CI runbook.

---

## Architecture summary

The current testing posture is:

- testing is surface-aware rather than uniform across the whole repo
- package tests are primarily Vitest-based and live close to the code they validate
- a root Vitest projects setup may exist for local developer experience, but package-local test ownership remains primary
- shared UI should use Storybook as the primary component-testing surface
- visual review and visual regression should be handled through Chromatic where justified
- end-to-end testing should use Playwright against production builds in CI
- accessibility checks should be part of the default testing posture for public surfaces
- repo-level and cross-app tests belong in `tests/`, not inside arbitrary app or package folders
- mocking and network simulation should use shared, deliberate patterns rather than per-surface improvisation

This model is optimized for public-site delivery first, strong package boundaries, realistic app validation, and controlled testing complexity.

---

## Why this architecture exists

This architecture exists to preserve:

- testing depth that matches real risk
- stronger boundaries between unit, component, integration, and end-to-end testing
- local ownership of tests where code ownership is local
- shared testing infrastructure where common patterns really exist
- lower friction for package and public-site iteration
- a path to richer product-app testing later without imposing that burden on every current surface

The repo is intentionally biased toward **surface-appropriate testing** rather than one universal testing standard copied everywhere.

---

## Core testing model

### Surface-aware testing

Testing expectations should vary by surface type.

The repo currently contains or plans for surfaces such as:

- shared packages
- shared UI foundations
- public-facing apps
- future protected or internal apps
- repo-level and cross-app workflows

These surfaces do not all need the same testing depth.

### Local-first test ownership

Tests should usually live near the code they validate.

That means:

- package tests belong in the package unless they are truly cross-package
- app tests belong in the app unless they are truly cross-app
- repo-level tests belong in `tests/`

This keeps ownership clearer and reduces ambiguity about what a given test is asserting.

### Cross-app and repo-level testing is explicit

The `tests/` directory exists for:

- repo-level test support
- cross-app end-to-end coverage
- cross-surface integration scenarios
- validation that does not naturally belong to one package or one app

It should not become a dumping ground for tests that simply were not placed carefully.

For repo-structure rules, see [`repo-shape.md`](./repo-shape.md).

---

## Testing by surface type

### Shared packages

Shared packages should generally emphasize:

- unit tests
- boundary tests
- schema or contract validation
- adapter-level tests where relevant

Package tests should verify the package’s declared public behavior without depending excessively on unrelated app behavior.

For current package posture, see [`packages.md`](./packages.md).

### Shared UI

Shared UI should use component-focused testing as a first-class validation layer.

The current posture is:

- Storybook is the primary component-testing surface for shared UI
- Storybook-based behavioral testing is preferred where supported
- accessibility checks should be built into shared UI validation where appropriate
- visual review or visual regression should be handled through Chromatic where justified

Shared UI should be tested as reusable primitives and bounded components, not as if it owns app-level page composition.

For design-system posture, see [`design-system.md`](./design-system.md).

### Public-facing apps

Public-facing sites should emphasize:

- smoke coverage
- accessibility coverage
- critical interaction coverage
- selective end-to-end coverage for user-important flows

The current repo posture does not require product-app-grade test depth for every public site by default.

Public sites should be tested proportionately to their real risk:

- rendering confidence
- navigation confidence
- form and lead-capture confidence
- basic publishing confidence
- accessibility and regression confidence

For public-site posture, see [`public-sites.md`](./public-sites.md).

### Future protected or internal apps

Protected or internal apps are deferred as a general repo priority, but when they exist, they should generally carry heavier testing expectations than ordinary public sites.

That likely includes more emphasis on:

- business-logic testing
- authorization-sensitive testing
- integration coverage
- end-to-end workflow testing

That future posture should activate only when those surfaces actually exist.

---

## Tooling posture

### Vitest posture

Vitest is the default package and library testing tool.

The current posture is:

- package-local Vitest usage is primary
- CI should execute package test scripts through Turborepo orchestration
- a root Vitest projects configuration may exist for local DX, but it should not replace package-local ownership or clear package test scripts

Testing architecture should stay simple enough that package boundaries remain visible in how tests are run.

### Storybook posture

Storybook is the primary component-testing surface for shared UI.

That means it should support:

- component review
- isolated component scenarios
- UI behavior verification where appropriate
- accessibility checks for reusable components
- visual review workflows

Storybook should reinforce primitive-first UI architecture rather than becoming a second app shell.

### Chromatic posture

Chromatic is appropriate for cloud visual baselines and review of shared UI and other justified visual surfaces.

It should be used to strengthen confidence in visual changes, not as a substitute for app-level ownership or thoughtful review.

### Playwright posture

Playwright is the default end-to-end testing tool.

The current posture is:

- run E2E against production builds in CI
- use it selectively for critical user flows and cross-surface confidence
- keep E2E coverage intentional rather than bloated
- include accessibility checks where they add real confidence

For current public-site work, E2E should focus on flows that matter operationally.

### Accessibility testing posture

Accessibility should be part of default validation rather than a later add-on.

The current posture includes:

- component-level accessibility checks where appropriate
- page-level accessibility checks in app testing where appropriate
- `@axe-core/playwright` or equivalent page-level validation in E2E flows where justified

Accessibility is shared responsibility, but the testing architecture should make it easier to catch regressions early.

---

## Mocking and fixture posture

### Shared mocking approach

Mocking should be deliberate and shared where common patterns exist.

The current posture is:

- MSW is the shared network-mocking layer
- mocks should be reusable where the same external or internal boundary is exercised repeatedly
- mocking should support realism without tightly coupling tests to fragile implementation detail

### Fixture posture

Fixtures should be:

- scoped to the boundary being tested
- realistic enough to catch boundary issues
- small enough to stay maintainable
- safe from secret leakage or accidental sensitive data inclusion

Recorded fixtures may be appropriate for third-party integrations where live dependency is undesirable.

For broader data and integrations posture, see [`data-auth-integrations.md`](./data-auth-integrations.md).

---

## Contract and provider-boundary testing posture

The repo should distinguish between internal and third-party boundaries.

### Internal boundaries

For internal providers or repo-controlled service boundaries, stronger contract-style validation may be justified.

### Third-party providers

For third-party SaaS and external APIs, the default posture is more conservative.

That means:

- prefer generated types or official specs where available
- add runtime schema validation where appropriate
- validate behavior against realistic fixtures or recorded responses
- avoid overcommitting to heavy contract-testing machinery unless the repo truly controls both sides

Testing should reflect actual ownership and leverage, not copy enterprise patterns where they do not fit the repo.

---

## Review-quality validation for visible work

### Screenshots and preview-based review

Visible UI work requires both durable PR artifacts and live preview review.

That means:
- screenshots remain required for visible UI changes in PRs as durable review context
- preview-based review complements, but does not replace, PR review and validation
- screenshots should roughly match the preview being shared for review
- meaningful post-feedback visible changes should trigger re-review with updated screenshots

### Visual review and visual regression tooling

Visual validation tooling is a maturity-layer tool, not a universal requirement.

Current posture:
- visual review tooling (such as Chromatic) is appropriate for shared UI or higher-risk visual surfaces
- visual regression protection strengthens confidence but is not mandatory everywhere today
- accessibility and E2E validation against previews can be part of the workflow where justified

### Tiered and risk-based validation

Validation should remain tiered and risk-based:
- narrow by default for ordinary changes
- broader when blast radius or shared-surface risk increases
- visual regression and accessibility checks scale with surface importance and user impact

For the complete workflow, see [`../operations/preview-review-approval.md`](../operations/preview-review-approval.md).

---

## CI and workspace posture

### Turborepo testing posture

Turborepo should orchestrate test execution through package and app scripts.

The current posture is:

- keep test defaults simple
- avoid unnecessary global test coupling
- do not add broad `dependsOn` behavior for test by default
- refine task inputs only when real need appears

Testing orchestration should support clear boundaries rather than hide them.

### Validation scaling rule

Validation depth should scale with blast radius.

In general:

- narrow package changes should start with narrow validation
- shared package changes may justify broader affected-surface validation
- repo configuration or testing-infrastructure changes justify broader workspace checks
- cross-app user-flow changes may justify E2E expansion

This is consistent with the broader repo rule of verifying with the narrowest valid commands first, then widening when warranted.

---

## What should remain local vs shared

### Keep local by default

These should usually stay local to the app or package:

- surface-specific test helpers
- app-specific rendered scenarios
- package-internal edge-case assertions
- local component behavior tests tied to one bounded surface

### Promote into shared testing infrastructure only when justified

Move testing helpers or utilities into shared testing support only when:

- more than one bounded surface needs them
- the boundary is clear
- the helper improves consistency without hiding ownership
- the shared version will remain narrow and maintainable

Testing infrastructure should not become a vague “test-utils” dumping ground.

---

## Alternatives considered

- **One uniform testing burden for every surface** — rejected; public sites, shared packages, and future protected apps have different risk profiles
- **Centralized repo-level test ownership for most tests** — rejected; weakens local ownership and blurs boundaries
- **End-to-end-first testing for all current work** — rejected; too heavy for the current repo posture
- **No shared component-testing surface** — rejected; shared UI benefits from Storybook-centered validation
- **Direct live-provider dependence in most tests** — rejected; reduces reliability and increases fragility
- **Treating visual review as optional for shared UI** — rejected; reusable UI benefits from deliberate visual validation

---

## Trade-offs

This architecture makes some things easier:

- matching validation depth to actual risk
- keeping package and app ownership clearer
- validating shared UI in a more realistic reusable surface
- maintaining stronger confidence in important public-site flows
- preventing test infrastructure from collapsing boundaries between surfaces

It also makes some things harder:

- testing approaches vary by surface instead of feeling uniform
- some contributors must decide more carefully which test layer is appropriate
- shared UI review adds process compared with purely local component checks
- cross-surface confidence sometimes requires multiple complementary test layers instead of one simple answer

These trade-offs are intentional.

---

## What is deferred

The current testing posture intentionally defers:

- product-app-grade testing depth as a default for every public site
- heavy contract-testing machinery for boundaries the repo does not control
- broad centralized test infrastructure beyond what current surfaces justify
- speculative test abstraction for every repeated helper
- overbuilt CI dependency graphs for test execution
- aggressive end-to-end coverage expansion before real workflow risk demands it

These are deferred, not forbidden.

---

## Related docs

- [`overview.md`](./overview.md)
- [`repo-shape.md`](./repo-shape.md)
- [`packages.md`](./packages.md)
- [`public-sites.md`](./public-sites.md)
- [`design-system.md`](./design-system.md)
- [`data-auth-integrations.md`](./data-auth-integrations.md)
- [`deployment-security.md`](./deployment-security.md)