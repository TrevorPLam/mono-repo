# repo/docs/reference/commands.md

Status: Active  
Date: 2026-03-24

## Purpose

Provide a scan-friendly reference for canonical repository commands.

This document is the quick lookup surface for installation, local development, validation, filtered workspace commands, and common command patterns contributors should use when working in this monorepo. It is a reference document, not an architecture ADR or a runbook.

---

## How to use this reference

Use this file when you need to quickly answer questions like:

- how to install dependencies
- how to run local development for one app or package
- how to run repo-wide validation
- how to target one app or package
- which order to run common validation commands in
- when to use filtered commands instead of workspace-wide commands
- what command patterns are expected in PR-ready work

For behavioral rules about validation honesty and escalation, see [`../../AGENTS.md`](../../AGENTS.md) and [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md).

---

## Core repo commands

These are the canonical baseline commands for the repo:

```bash
pnpm install
pnpm turbo build
pnpm turbo test
pnpm turbo lint
pnpm turbo typecheck
````

Use these when you need repo-wide installation or repo-wide validation.

---

## Local development command

Use this during active development to run the local dev server for one app or package.

```bash
pnpm turbo dev --filter=<target>
```

Guidance:

* prefer filtered local development for the surface you are actively working on
* do not run repo-wide `dev` unless you truly need multiple surfaces simultaneously
* use the real workspace target name for `<target>`

---

## Default validation order

For most implementation work, the default validation order is:

```bash
pnpm turbo lint --filter=<target>
pnpm turbo typecheck --filter=<target>
pnpm turbo test --filter=<target>
pnpm turbo build --filter=<target>
```

Guidance:

* start with the narrowest valid target
* run `build` last when build validation is warranted
* widen to repo-wide commands when the blast radius is shared or unclear

Do not claim a command passed unless it was actually run.

---

## Filtered command patterns

Use filtered commands when working in one bounded app or package.

### Filtered build

```bash
pnpm turbo build --filter=<target>
```

### Filtered test

```bash
pnpm turbo test --filter=<target>
```

### Filtered lint

```bash
pnpm turbo lint --filter=<target>
```

### Filtered typecheck

```bash
pnpm turbo typecheck --filter=<target>
```

Replace `<target>` with the appropriate app or package target name used by the workspace.

Use filtered commands first unless the work clearly affects shared or repo-wide behavior.

---

## Repo-wide validation commands

Use repo-wide validation when the change affects shared packages, repo config, tooling, or multiple surfaces.

```bash
pnpm turbo lint
pnpm turbo typecheck
pnpm turbo test
pnpm turbo build
```

Typical reasons to widen to repo-wide validation include:

* shared package changes
* repo-level config changes
* testing infrastructure changes
* multiple app changes
* unclear blast radius
* release or pre-merge confidence checks

---

## Installation and dependency commands

### Install dependencies

```bash
pnpm install
```

Use this after cloning or when dependency state changes.

### Dependency change caution

Adding or changing dependencies is approval-sensitive work.

Do not treat package-manager commands that change dependency state as routine edits. Follow the approval rules in [`../../AGENTS.md`](../../AGENTS.md) and [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md).

---

## Command selection guidance

### Use narrow commands first when:

* changing one app
* changing one package
* editing local documentation only
* touching one bounded surface with clear ownership

### Use broader commands when:

* changing shared packages used across multiple apps
* changing shared lint, test, build, or type settings
* changing workspace configuration
* changing testing infrastructure
* working across multiple bounded surfaces
* preparing a higher-confidence validation pass before merge

This repo prefers **narrowest valid command first, then widen when warranted**.

---

## Common command scenarios

### Validate one client site app

```bash
pnpm turbo lint --filter=<client-site-app>
pnpm turbo typecheck --filter=<client-site-app>
pnpm turbo test --filter=<client-site-app>
pnpm turbo build --filter=<client-site-app>
```

### Validate one shared package

```bash
pnpm turbo lint --filter=<package>
pnpm turbo typecheck --filter=<package>
pnpm turbo test --filter=<package>
pnpm turbo build --filter=<package>
```

### Validate shared-package changes with broader impact

```bash
pnpm turbo lint
pnpm turbo typecheck
pnpm turbo test
pnpm turbo build
```

### Install and run a broad workspace check

```bash
pnpm install
pnpm turbo lint
pnpm turbo typecheck
pnpm turbo test
pnpm turbo build
```

Use this when you need a fuller confidence pass across the repo.

---

## App and package targeting notes

Targets should refer to the actual workspace app or package being changed.

Examples in this document use placeholders such as:

* `<client-site-app>`
* `<package>`
* `<target>`

Use the real workspace target name defined by the repo.

If you are unsure what the valid target is, check:

* the nearest local `README.md`
* the nearest local `AGENTS.md`
* [`workspace-index.md`](./workspace-index.md)
* [`app-index.md`](./app-index.md)
* [`package-index.md`](./package-index.md)

---

## Validation honesty rules

When recording commands in PRs, handoffs, or summaries:

* list only commands you actually ran
* state clearly if a command was skipped
* state clearly if a command could not be run
* explain why broader validation was or was not used
* do not imply workspace-wide validation when only filtered validation was run

This reference documents command patterns. It does not authorize overstating validation.

---

## What this file should not do

This file should not become:

* a full package-manager manual
* a build-system design document
* a CI runbook
* a substitute for local app or package docs
* a speculative list of commands not yet approved by the repo
* a place to document one-off personal shell aliases

Keep it short, canonical, and focused on repo-supported command patterns.

---

## Notes on current state

This reference captures the canonical command posture for the repo.

Some commands may be structurally expected before every underlying app, package, or CI path is fully wired. Treat this file as the source for approved command patterns and validation shape, not as proof that every target is already implemented.

---

## Related docs

* [`workspace-index.md`](./workspace-index.md)
* [`app-index.md`](./app-index.md)
* [`package-index.md`](./package-index.md)
* [`../operations/create-client-site.md`](../operations/create-client-site.md)
* [`../architecture/testing.md`](../architecture/testing.md)
* [`../../AGENTS.md`](../../AGENTS.md)
* [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md)
* [`../../README.md`](../../README.md)
