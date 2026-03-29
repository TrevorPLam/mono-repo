# repo/docs/reference/app-index.md

Status: Active  
Date: 2026-03-24

## Purpose

Provide a scan-friendly index of deployable apps in this monorepo.

This document is the reference surface for app inventory, app-family placement, app purpose, and the minimum navigation context needed to work in or around an app. It is a reference document, not an architecture ADR or an operations runbook.

---

## How to use this index

Use this file when you need to quickly answer questions like:

- which deployable apps exist
- where a given app lives
- whether an app is public, client-facing, internal, or template-only
- which app family a surface belongs to
- where to start reading before changing an app
- whether an app is real, template-only, planned, or not yet present

For app-boundary rules, follow the linked architecture docs rather than relying on this file alone.

---

## App model reminder

In this repo:

- apps are deployable surfaces
- real client sites are separate apps by default
- public-facing sites are the current priority
- visible site composition stays app-local unless reuse is clearly proven
- protected or internal apps are deferred until justified

For the full app model, see [`apps.md`](../architecture/apps.md).  
For public-site posture, see [`public-sites.md`](../architecture/public-sites.md).

---

## App-family structure

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
````

---

## App inventory

| App                  | Path                            | Type              | Status              | Purpose                                             | Notes                                                                              |
| -------------------- | ------------------------------- | ----------------- | ------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Firm site            | `apps/site-firm/`               | Public site       | Planned / canonical | Firm public website                                 | Real public product surface; lives at `apps/` root because it is not a client site |
| Client site template | `apps/sites/clients/_template/` | Template scaffold | Planned / canonical | Structural starting point for new real client sites | Not a real deployed client app; scaffold only                                      |

---

## Client-site inventory

Use this section to track real client-site apps once they become durable repo surfaces.

| Client   | Slug | Path | Status                            | Notes                                                                                         |
| -------- | ---- | ---- | --------------------------------- | --------------------------------------------------------------------------------------------- |
| None yet | —    | —    | No durable client apps listed yet | Add entries here when a real client site is created under `apps/sites/clients/<client-slug>/` |

### Client-site entry rules

Add a client site to this index only when:

* it is real client work
* it has become a durable repo app
* it lives at `apps/sites/clients/<client-slug>/`
* local `README.md` and `AGENTS.md` exist for the app
* it is no longer ordinary prospect or preview-only work

Do not list:

* throwaway demos
* temporary prospect work
* abandoned experiments
* template scaffolds other than `_template/`

For the creation workflow, see [`create-client-site.md`](../operations/create-client-site.md).

---

## App-family map

| Path                            | Purpose                         | Notes                                                             |
| ------------------------------- | ------------------------------- | ----------------------------------------------------------------- |
| `apps/`                         | Deployable applications only    | Root app family container                                         |
| `apps/site-firm/`               | Firm public site                | Public-facing firm surface; not a client site                     |
| `apps/sites/`                   | Grouping layer for website apps | Helps separate website surfaces from future non-site app families |
| `apps/sites/clients/`           | Real client website apps        | Default home for durable client sites                             |
| `apps/sites/clients/_template/` | Client-site scaffold            | Structural template, not a finished design                        |

---

## Status meanings

Use these statuses consistently in this file:

| Status              | Meaning                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------- |
| Planned / canonical | The path or app is part of the approved repo shape, even if implementation is incomplete  |
| Active              | The app exists and is an active maintained surface                                        |
| Template-only       | The path exists only as a scaffold or structural starting point                           |
| Deprecated          | The app still exists for transition reasons but should not be used as the default pattern |
| Archived            | The app is no longer active and is retained only for history or controlled transition     |

Choose the smallest truthful status. Do not mark an app active if it is only structurally planned.

---

## Reading paths by app type

### To work in the firm site

1. `apps/AGENTS.md`
2. the nearest local `README.md`
3. the nearest local `AGENTS.md`
4. [`apps.md`](../architecture/apps.md)
5. [`public-sites.md`](../architecture/public-sites.md)
6. [`design-system.md`](../architecture/design-system.md)

### To work in a real client site

1. `apps/AGENTS.md`
2. `apps/sites/AGENTS.md`
3. `apps/sites/clients/AGENTS.md`
4. the client app’s local `README.md`
5. the client app’s local `AGENTS.md`
6. [`public-sites.md`](../architecture/public-sites.md)
7. [`packages.md`](../architecture/packages.md)
8. [`design-system.md`](../architecture/design-system.md)

### To create a new client site

1. [`create-client-site.md`](../operations/create-client-site.md)
2. [`apps.md`](../architecture/apps.md)
3. [`public-sites.md`](../architecture/public-sites.md)
4. [`packages.md`](../architecture/packages.md)
5. [`design-system.md`](../architecture/design-system.md)

---

## App rules summary

* apps are deployable units, not shared-code containers
* real client sites belong under `apps/sites/clients/<client-slug>/`
* the firm site belongs at `apps/site-firm/`
* app-local docs are required for real app surfaces
* app-local visible composition stays in the app unless reuse is clearly proven
* auth, DB-heavy runtime behavior, or protected-app assumptions do not belong in ordinary public-site work by default

---

## When to update this file

Update this index when:

* a new durable app is added
* an app changes status materially
* an app is archived, deprecated, or removed from active use
* an app family changes in canonical structure
* a template path becomes active or vice versa
* an app’s path or role changes in a way that affects navigation

This file should change in the same PR as the app inventory change whenever possible.

---

## What this file should not do

This file should not become:

* a replacement for app-local `README.md` files
* an architecture ADR
* a deployment runbook
* a backlog of future app ideas
* a prospect tracker
* a place to document detailed implementation notes for one app

Keep it short, scannable, and inventory-focused.

---

## Notes on current state

This index reflects the canonical intended app structure.

At the current stage, some app paths may be structurally decided before their implementation is complete. Treat this file as an accurate reference surface for approved app shape and app inventory, not as proof that every listed app is already fully built.

---

## Related docs

* [`apps.md`](../architecture/apps.md)
* [`public-sites.md`](../architecture/public-sites.md)
* [`packages.md`](../architecture/packages.md)
* [`design-system.md`](../architecture/design-system.md)
* [`create-client-site.md`](../operations/create-client-site.md)
* [`workspace-index.md`](./workspace-index.md)
* [`../README.md`](../README.md)
* [`../../README.md`](../../README.md)