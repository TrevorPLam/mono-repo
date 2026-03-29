# workspace-index.md

Status: Active  
Date: 2026-03-24

## Purpose

Provide a scan-friendly index of the monorepo workspace.

This document is the quick lookup surface for the repo’s major directories, bounded areas, and canonical navigation starting points. It is a reference document, not an architecture ADR or an implementation runbook.

---

## How to use this index

Use this file when you need to quickly answer questions like:

- what lives at the repo root
- where apps belong
- where packages belong
- where canonical docs live
- where repo-level support areas live
- where agent-tooling adapters and skills live

For detailed rules, follow the linked canonical docs rather than relying on this file alone.

---

## Workspace at a glance

```text
.
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── CONTRIBUTING.md
├── apps/
├── packages/
├── docs/
├── infra/
├── scripts/
├── tests/
├── .github/
├── .claude/
└── .agents/
````

---

## Root files

| Path              | Purpose                     | Notes                                             |
| ----------------- | --------------------------- | ------------------------------------------------- |
| `README.md`       | Human repo orientation      | Start here for human overview                     |
| `AGENTS.md`       | Root agent operating rules  | Start here for agent behavior                     |
| `CLAUDE.md`       | Thin tool-specific adapter  | Should stay thin and point back to canonical docs |
| `CONTRIBUTING.md` | Human contribution workflow | Branching, validation, PR, doc-update rules       |

---

## Top-level directories

| Path        | Purpose                                            | Notes                                                        |
| ----------- | -------------------------------------------------- | ------------------------------------------------------------ |
| `apps/`     | Deployable applications only                       | Public sites now; other app families only when justified     |
| `packages/` | Shared libraries only                              | Cross-cutting concerns with narrow public APIs               |
| `docs/`     | Canonical documentation library                    | Architecture, operations, reference, templates, feature docs |
| `infra/`    | Infrastructure-related material                    | Infra code, infra docs, and related assets                   |
| `scripts/`  | Justified operational scripts                      | Not a dumping ground for one-offs                            |
| `tests/`    | Repo-level and cross-app testing                   | For tests that do not naturally belong to one app or package |
| `.github/`  | GitHub-specific automation and adapter docs        | Workflows, PR template, Copilot instructions                 |
| `.claude/`  | Claude-oriented skills and adapter resources       | Thin tool-facing layer                                       |
| `.agents/`  | OpenAI/Codex-oriented skills and adapter resources | Thin tool-facing layer                                       |

For structural rules, see [`../architecture/repo-shape.md`](../architecture/repo-shape.md).

---

## Apps index

### Current app-family structure

```text
apps/
├── README.md
├── AGENTS.md
├── site-firm/
└── sites/
    ├── README.md
    ├── AGENTS.md
    └── clients/
        ├── README.md
        ├── AGENTS.md
        └── _template/
```

### App-family map

| Path                            | Purpose                         | Notes                                      |
| ------------------------------- | ------------------------------- | ------------------------------------------ |
| `apps/site-firm/`               | Firm public site                | Real public product surface                |
| `apps/sites/`                   | Grouping layer for website apps | Keeps public-site families organized       |
| `apps/sites/clients/`           | Real client website apps        | Default home for durable client sites      |
| `apps/sites/clients/_template/` | Client-site starting scaffold   | Structural template, not a finished design |

### App rules summary

* apps are deployable surfaces
* real client sites live under `apps/sites/clients/<client-slug>/`
* public-site work is the current priority
* visible public-site composition stays app-local unless reuse is clearly proven
* protected or internal apps are deferred until justified

For app-boundary rules, see [`../architecture/apps.md`](../architecture/apps.md).
For public-site posture, see [`../architecture/public-sites.md`](../architecture/public-sites.md).

---

## Packages index

### Current package map

| Path                      | Purpose                                            | Notes                                         |
| ------------------------- | -------------------------------------------------- | --------------------------------------------- |
| `packages/contracts/`     | Shared schemas, types, and boundary contracts      | Boundary package, schema-first                |
| `packages/env/`           | Environment validation and typed access            | Shared env boundary                           |
| `packages/design-tokens/` | Shared token architecture and generation pipeline  | Common token structure, not full site styling |
| `packages/ui/`            | Shared primitives and low-level UI building blocks | Primitive-first, not a section warehouse      |
| `packages/seo-core/`      | Framework-agnostic SEO policy layer                | Shared SEO rules and resolution               |
| `packages/seo-astro/`     | Astro SEO adapter                                  | Thin Astro-specific SEO support               |
| `packages/analytics/`     | Shared analytics instrumentation layer             | Shared instrumentation boundaries             |
| `packages/observability/` | Shared operational telemetry layer                 | Logs, traces, diagnostics                     |
| `packages/testing/`       | Shared testing support                             | Narrow shared test helpers and support        |

### Package rules summary

* packages are shared libraries
* packages do not own page composition or client-specific site behavior
* package APIs should stay narrow and explicit
* shared UI stays primitive-first
* visible marketing composition stays app-local unless reuse is clearly proven

For package-boundary rules, see [`../architecture/packages.md`](../architecture/packages.md).
For design-system posture, see [`../architecture/design-system.md`](../architecture/design-system.md).
For SEO, analytics, and observability posture, see [`../architecture/seo-analytics-observability.md`](../architecture/seo-analytics-observability.md).

---

## Docs index

### Docs structure

```text
docs/
├── README.md
├── architecture/
├── operations/
├── reference/
├── templates/
└── features/
```

### Docs map

| Path                 | Purpose                       | Notes                                |
| -------------------- | ----------------------------- | ------------------------------------ |
| `docs/README.md`     | Canonical docs entry point    | Explains doc model and reading paths |
| `docs/architecture/` | Stable architecture decisions | ADR-lite posture docs                |
| `docs/operations/`   | Workflows and runbooks        | How to do repeatable repo work       |
| `docs/reference/`    | Lookup and index docs         | Scan-friendly reference surfaces     |
| `docs/templates/`    | Reusable document shells      | Starting points for repo docs        |
| `docs/features/`     | Feature-delivery packets      | Requirements, plan, tasks, handoff   |

For the documentation model, see [`../README.md`](../README.md).
For agent-tooling hierarchy, see [`../architecture/agent-tooling.md`](../architecture/agent-tooling.md).

---

## Infrastructure and support areas

| Path       | Purpose                                  | Notes                                            |
| ---------- | ---------------------------------------- | ------------------------------------------------ |
| `infra/`   | Infrastructure code and related material | Should remain distinct from app and package code |
| `scripts/` | Operational and maintenance scripts      | Keep narrow, named, and justified                |
| `tests/`   | Repo-level and cross-app tests           | Not a substitute for local app/package tests     |

For deployment and security posture, see [`../architecture/deployment-security.md`](../architecture/deployment-security.md).
For testing posture, see [`../architecture/testing.md`](../architecture/testing.md).

---

## Agent-tooling and adapter areas

| Path                              | Purpose                                | Notes                                    |
| --------------------------------- | -------------------------------------- | ---------------------------------------- |
| `AGENTS.md`                       | Root agent operating rules             | Primary repo-wide behavioral layer       |
| local `AGENTS.md` files           | Subtree-specific agent rules           | Narrower scope, more local constraints   |
| `CLAUDE.md`                       | Thin adapter doc                       | Tool-facing bridge, not canonical truth  |
| `.github/copilot-instructions.md` | GitHub/Copilot adapter doc             | Thin and tool-specific                   |
| `.github/instructions/`           | Additional GitHub instruction surfaces | Keep minimal and aligned                 |
| `.claude/skills/`                 | Claude-facing skill directory          | Procedural skills                        |
| `.agents/skills/`                 | OpenAI/Codex-facing skill directory    | Mirrored or equivalent procedural skills |

### Agent-tooling rules summary

* canonical truth belongs in `docs/`
* `AGENTS.md` files define operational behavior
* adapter docs stay thin
* skills are procedural, not architectural
* task packets in `docs/features/` must promote durable decisions upward

For the full model, see [`../architecture/agent-tooling.md`](../architecture/agent-tooling.md).

---

## Recommended reading paths

### To understand the repo quickly

1. [`../../README.md`](../../README.md)
2. [`../README.md`](../README.md)
3. [`../architecture/overview.md`](../architecture/overview.md)
4. [`../architecture/repo-shape.md`](../architecture/repo-shape.md)

### To understand apps and public sites

1. [`../architecture/apps.md`](../architecture/apps.md)
2. [`../architecture/public-sites.md`](../architecture/public-sites.md)
3. [`../operations/create-client-site.md`](../operations/create-client-site.md)

### To understand packages and shared foundations

1. [`../architecture/packages.md`](../architecture/packages.md)
2. [`../architecture/design-system.md`](../architecture/design-system.md)
3. [`../architecture/seo-analytics-observability.md`](../architecture/seo-analytics-observability.md)
4. [`../architecture/data-auth-integrations.md`](../architecture/data-auth-integrations.md)

### To understand repo operations and controls

1. [`../../AGENTS.md`](../../AGENTS.md)
2. [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md)
3. [`../architecture/deployment-security.md`](../architecture/deployment-security.md)
4. [`../architecture/testing.md`](../architecture/testing.md)
5. [`../architecture/agent-tooling.md`](../architecture/agent-tooling.md)

---

## Notes on current state

This index reflects the canonical planned workspace structure.

Some paths may be structurally decided before they are fully implemented. Treat this file as a navigation and reference surface for the intended repo shape, not as a guarantee that every listed area is already complete.

---

## Related docs

* [`../architecture/overview.md`](../architecture/overview.md)
* [`../architecture/repo-shape.md`](../architecture/repo-shape.md)
* [`../architecture/apps.md`](../architecture/apps.md)
* [`../architecture/packages.md`](../architecture/packages.md)
* [`../architecture/agent-tooling.md`](../architecture/agent-tooling.md)
* [`../operations/create-client-site.md`](../operations/create-client-site.md)
* [`../README.md`](../README.md)
* [`../../README.md`](../../README.md)