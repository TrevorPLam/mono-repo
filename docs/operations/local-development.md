# repo/docs/operations/local-development.md

---

# Local Development Runbook

## Purpose

This runbook defines the **standard, canonical way to run the monorepo locally**.

It exists to ensure:

* Every developer (human or agent) follows the same workflow
* Local environments behave predictably across apps and packages
* Environment variables, database usage, and commands remain consistent
* Drift between local, preview, and production environments is minimized

This is a **runbook**, not a tutorial. It defines how the system is expected to be used.

---

## Scope

This applies to:

* All apps in `apps/`
* All packages in `packages/`
* All local development workflows (human + agentic coding tools)

---

## Principles

### 1. Filtered Development by Default

Never run the entire monorepo unless explicitly required.

Always scope commands to:

* A single app
* A single package
* A specific task

This keeps:

* Startup fast
* Logs readable
* Resource usage low

---

### 2. App-Local Execution

You do not “run the repo.”

You run:

* A specific app
* With its dependencies resolved automatically by Turborepo

---

### 3. Environment Variables Are Explicit

* No implicit root `.env` usage
* No shared global environment assumptions
* Each app owns its environment surface

---

### 4. Database Usage Is Conditional

Most local work (especially marketing sites) does **not require a database**.

Only initialize DB when:

* Working on a DB-backed feature
* Running server-side workflows that depend on persistence

---

### 5. Deterministic, Reproducible Setup

A fresh clone + standard commands should always produce:

* A working dev environment
* No hidden manual steps
* No machine-specific assumptions

---

## Prerequisites

### Required

* Node.js (current LTS)
* pnpm (workspace manager)
* Git

### Optional (only when needed)

* Vercel CLI (for env sync)
* Local PostgreSQL (if not using hosted dev DB)
* Docker (only if explicitly required later)

---

## Initial Setup

From repo root:

```bash
pnpm install
```

This:

* Installs all workspace dependencies
* Links packages correctly
* Prepares Turbo task graph

---

## Running Applications

### Start a Single App

```bash
pnpm --filter <app-name> dev
```

Examples:

```bash
pnpm --filter site-firm dev
pnpm --filter @apps/sites/clients/acme dev
```

---

### Why Filtering Matters

Filtering ensures:

* Only required packages build/run
* Faster startup times
* Clean logs
* Lower CPU/memory usage

Running `pnpm dev` at root is **not standard practice**.

---

## Working with Packages

### Build a Package

```bash
pnpm --filter @repo/<package> build
```

### Run Tests for a Package

```bash
pnpm --filter @repo/<package> test
```

### Watch Mode (if supported)

```bash
pnpm --filter @repo/<package> dev
```

---

## Environment Variables

### Source of Truth

Environment variables come from:

* Vercel project settings (canonical)
* Synced locally via CLI when needed

---

### Pull Environment Variables

```bash
vercel env pull
```

This creates:

```
.env.local
```

---

### Rules

* Never commit `.env` files
* Never define shared root `.env` as a dependency
* Each app must declare and own its required variables
* Packages must not read environment variables directly unless explicitly designed to

---

### Turbo + Env Awareness

Turborepo uses environment variables in task hashing.

Implications:

* Changing env values can invalidate cache
* Missing env variables can break builds

Always ensure required env vars exist before running tasks.

---

## Database (Optional Workflow)

### When to Use

Only when:

* Working on DB-backed features
* Running server logic that requires persistence

---

### Setup

Handled via `@repo/db`.

Typical flow:

```bash
pnpm --filter @repo/db migrate
pnpm --filter @repo/db seed
```

---

### Rules

* Local DB state must be reproducible
* Never rely on manual DB edits
* Seeds must be deterministic
* Do not run production migrations locally

---

## Adding a New App

Use the canonical structure:

```
apps/sites/clients/<client-slug>/
```

Then:

1. Install dependencies

```bash
pnpm install
```

2. Run the app

```bash
pnpm --filter <app-name> dev
```

---

## Common Workflows

### Start a Client Site

```bash
pnpm --filter @apps/sites/clients/<slug> dev
```

---

### Work on UI Package + Site Together

```bash
pnpm --filter @repo/ui dev
pnpm --filter <site-app> dev
```

---

### Run Tests

```bash
pnpm test
```

Or scoped:

```bash
pnpm --filter <target> test
```

---

## Debugging

### App Won’t Start

Check:

* Missing environment variables
* Dependency install (`pnpm install`)
* Incorrect filter name

---

### Changes Not Reflecting

Check:

* Package build status
* Turbo cache (try `--force`)

---

### Type Errors Across Packages

Run:

```bash
pnpm build
```

To ensure all packages are compiled correctly.

---

## Anti-Patterns (Do Not Do)

### ❌ Running Entire Repo by Default

```bash
pnpm dev
```

Avoid unless explicitly needed.

---

### ❌ Root-Level Shared `.env`

Leads to:

* Hidden dependencies
* Non-reproducible setups

---

### ❌ Direct Package Execution Without Filters

Always scope with `--filter`.

---

### ❌ Manual DB State Changes

All DB changes must go through:

* Migrations
* Seeds

---

## Advanced / Future (Not Default)

These are **not required today**, but may be adopted later:

### Dev Containers / Codespaces

Use when:

* Onboarding friction becomes high
* Environment drift becomes a problem

---

### Local Service Emulation

Examples:

* Queues
* Webhooks

Only introduce when:

* Real workflows require it
* Not speculative

---

## Relationship to Other Runbooks

This runbook connects to:

* `deployment-and-rollbacks.md` → how local work ships safely
* `environment-and-secrets.md` → deeper env management rules
* `content-publishing.md` → how content flows into sites

---

## Definition of Done (Local Dev)

Local development is considered correctly set up when:

* `pnpm install` succeeds
* A target app runs via `--filter`
* Required env variables are present
* (If applicable) DB migrations + seeds run successfully
* No manual or undocumented steps were required

---

## Final Notes

This runbook is intentionally strict.

Local development is the **foundation of everything else**:

* If it is inconsistent, everything downstream breaks
* If it is deterministic, everything else becomes predictable

Follow this exactly unless a new pattern is explicitly adopted and documented.

---

