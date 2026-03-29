# repo/docs/reference/env-matrix.md

Status: Active  
Date: 2026-03-24

## Purpose

Provide a scan-friendly reference for environment-variable ownership, scope, and handling across this monorepo.

This document is the quick lookup surface for where environment values belong, how narrowly they should be scoped, which kinds of values are expected at which layer, and how contributors should think about server-only versus client-safe configuration. It is a reference document, not an architecture ADR or a secrets-management runbook.

---

## How to use this reference

Use this file when you need to quickly answer questions like:

- where a given environment variable should live
- whether a value belongs at the app level or is truly shared
- whether a value is server-only or client-safe
- when a secret should be project-scoped instead of broadly shared
- how to think about environment values for public sites vs. future protected apps
- which kinds of values should never be exposed to browser-facing code

For architectural rules, follow the linked canonical docs rather than relying on this file alone.

---

## Core posture

The current repo posture is:

- environment values should be scoped as narrowly as possible
- client-specific secrets belong only to the app or deployment project that needs them
- globally shared values should be rare and intentional
- server-only values must remain server-only
- client-safe public configuration should be explicitly separated from secrets
- shared packages should consume environment values only through deliberate boundaries
- public-site work should not casually inherit protected-app env complexity

For deployment and security posture, see [`../architecture/deployment-security.md`](../architecture/deployment-security.md).  
For data, auth, and integrations posture, see [`../architecture/data-auth-integrations.md`](../architecture/data-auth-integrations.md).

---

## Scope levels

Use these scope levels consistently when deciding where a value belongs.

| Scope | Meaning | Typical use |
|---|---|---|
| App-local | Only one deployable app needs the value | Client-specific API keys, domain settings, app-specific public config |
| Shared repo-level | More than one app or package truly needs the same non-sensitive value | Rare shared defaults, common non-secret runtime flags |
| Package-consumed | A shared package reads a value through an approved app/server boundary | Typed env access routed through shared env handling |
| Environment/provider-level | Value is managed by the deployment platform or infrastructure layer | Platform runtime flags, project secrets, deployment metadata |

Default to the smallest truthful scope.

---

## Sensitivity classes

Use these sensitivity classes when reasoning about env values.

| Class | Meaning | Examples | Browser-safe |
|---|---|---|---|
| Secret | Must not be exposed publicly | API secrets, private tokens, DB URLs, signing keys | No |
| Sensitive operational | Not always a secret, but should stay server-side | internal service URLs, webhook endpoints, admin IDs | Usually no |
| Public config | Safe for browser-facing use when intentionally exposed | public site URL, analytics public IDs, feature flags meant for client use | Yes, if explicitly intended |
| Build/runtime metadata | Non-secret environment markers | environment name, deployment target, commit metadata | Usually yes, but still deliberate |

Do not treat “not a secret” as automatic permission to expose a value to the browser.

---

## Environment ownership matrix

| Value type | Default owner | Default scope | Default runtime boundary | Notes |
|---|---|---|---|---|
| Client-specific secrets | Deployable app / deployment project | App-local | Server-only | Keep narrow; do not share across unrelated apps |
| Shared non-secret defaults | Shared env boundary if truly reused | Shared repo-level | Usually server-side unless explicitly public | Must justify repo-level scope |
| Database connection values | Protected app or shared server boundary | App-local or shared server infrastructure | Server-only | Not part of ordinary public-site defaults |
| Auth secrets and session config | Protected app auth boundary | App-local to auth-consuming surface | Server-only | Not for public-site apps by default |
| Integration tokens / OAuth secrets | Shared integration or server boundary | App-local unless truly shared | Server-only | Never browser-facing |
| Analytics public IDs | App-local site config | App-local | Client-safe if intentionally exposed | Separate from secret analytics credentials |
| Observability endpoints / tokens | Shared observability boundary or app server config | Usually app-local or server-shared | Server-only unless explicitly public | Avoid leaking operational tokens |
| Canonical site URLs / domain config | App-local site config | App-local | Usually safe as public config | Should still be explicit and typed |
| Feature flags | App-local or shared boundary depending on use | Usually app-local first | Server-only or client-safe depending on purpose | Default to smallest truthful scope |

---

## Public-site default matrix

For ordinary public-facing sites, use this default posture.

| Concern | Default posture |
|---|---|
| Secrets | Keep app-local and server-only |
| Public site config | Expose only what the browser truly needs |
| Analytics public identifiers | App-local and explicitly client-safe if used |
| Forms / integrations | Handle secret values server-side |
| Database values | Do not assume required |
| Auth values | Do not assume present |
| Domain / canonical config | App-local and explicit |
| Shared repo env | Rare; justify before widening |

Public sites should remain simple by default. Do not import protected-app env patterns casually.

For public-site posture, see [`../architecture/public-sites.md`](../architecture/public-sites.md).

---

## Protected-app future matrix

Protected or internal apps are deferred as the general repo priority, but this is the expected posture when they exist.

| Concern | Likely posture |
|---|---|
| Auth/session secrets | Required and server-only |
| Database credentials | Required for DB-backed flows; server-only |
| Integration credentials | Server-only with deliberate shared boundaries where justified |
| Public browser config | Explicit and minimal |
| Operational telemetry config | Shared where justified, but still boundary-aware |
| Authorization-sensitive values | Server-only and tightly scoped |

This is a future path, not the default for current public-site work.

---

## App vs package env rules

### Apps

Apps are responsible for:

- wiring app-local environment values
- owning client-specific secrets
- deciding which public config is intentionally exposed
- ensuring secret values stay out of browser-facing code
- passing approved configuration into shared packages through supported interfaces

### Packages

Packages should:

- avoid ad hoc direct environment access when a shared env boundary exists
- consume environment values through deliberate supported patterns
- stay explicit about whether a value is server-only or client-safe
- avoid assuming ambient secret access just because they are shared code

Packages should not become hidden secret readers with unclear runtime ownership.

For package-boundary rules, see [`../architecture/packages.md`](../architecture/packages.md).

---

## Server-only vs client-safe rules

### Server-only values

These should remain server-only:

- DB URLs
- private API keys
- signing secrets
- OAuth client secrets
- webhook verification secrets
- internal admin tokens
- secret observability tokens
- any credential that would expand blast radius if exposed

### Client-safe values

These may be client-safe when explicitly intended:

- canonical public site URL
- public analytics identifier
- public feature flag values
- non-sensitive deployment metadata
- client-visible branding/config values

A value should be treated as server-only unless there is a clear reason it must be client-safe.

---

## Shared env boundary posture

A shared env package or env boundary should exist to reduce uncontrolled environment access.

That shared boundary should help with:

- validation
- typing
- runtime boundary clarity
- safer access patterns across apps and packages

It should not become:

- a justification to widen all env scope to repo-wide
- a dumping ground for unrelated runtime helpers
- a place that hides whether a value is actually app-local
- an excuse to expose server-only data to browser-facing consumers

Shared env handling should make narrow scoping easier, not weaker.

---

## Client-specific secret posture

Client-specific secrets should:

- live only in the deployment project or app that needs them
- remain server-only
- avoid reuse across unrelated client apps
- be documented operationally without exposing the secret value itself
- not be promoted to broad shared scope for convenience

This is especially important for real client sites, where isolation and transferability matter.

---

## Integration and credential posture

Values related to integrations should follow these defaults:

- public client-side identifiers may be exposed only when intentionally required
- secret provider credentials stay server-only
- durable tokens and integration state belong in deliberate server/shared infrastructure
- app-local hacks or undocumented env blobs are not acceptable long-term patterns

For integration architecture, see [`../architecture/data-auth-integrations.md`](../architecture/data-auth-integrations.md).

---

## Analytics and observability posture

Environment values for analytics and observability should remain distinct.

### Analytics

Typical analytics env values include:

- public measurement identifiers
- server-side measurement secrets
- environment-specific instrumentation toggles

Keep public analytics IDs distinct from any secret measurement or provider credential.

### Observability

Typical observability env values include:

- telemetry endpoints
- export tokens
- environment labels
- release identifiers

Operational telemetry configuration should not be treated as generic public site config unless it is intentionally safe to expose.

For architecture, see [`../architecture/seo-analytics-observability.md`](../architecture/seo-analytics-observability.md).

---

## Environment naming guidance

Environment variable names should be:

- explicit
- stable
- scoped by purpose
- understandable without guessing
- consistent with the boundary that owns them

Prefer names that make the runtime boundary obvious.

Good qualities:

- clearly identifies system or provider
- distinguishes public config from server-only values
- avoids vague names like `TOKEN`, `KEY`, or `URL` without context

This file does not prescribe a full naming scheme, but names should reduce ambiguity rather than add it.

---

## What to do when unsure

When unsure where a value belongs:

1. determine whether it is secret, sensitive, or public
2. determine which app or boundary actually needs it
3. choose the smallest truthful scope
4. keep it server-only unless browser exposure is clearly intended
5. check the nearest local docs and canonical architecture docs
6. ask before widening a value to shared repo scope

If a value feels like it could live “anywhere,” that usually means the ownership boundary is not yet clear enough.

---

## When to update this file

Update this matrix when:

- a new environment ownership pattern becomes canonical
- a new shared boundary changes how env values are consumed
- the repo’s public-site vs protected-app posture changes materially
- a new class of environment value becomes common enough to deserve explicit guidance
- scope or sensitivity rules change in a durable way

This file should reflect stable env-handling posture, not temporary local workarounds.

---

## What this file should not do

This file should not become:

- a secrets inventory
- a dump of actual variable names for every app
- a runbook for provisioning secrets
- a substitute for deployment platform documentation
- a place to store sensitive values or examples copied from real environments
- a per-app environment checklist

Keep it focused on ownership, scope, boundary, and classification.

---

## Notes on current state

This matrix reflects the canonical intended env-handling posture for the repo.

At the current stage, some app, package, or deployment boundaries may be structurally decided before all corresponding environment plumbing is fully implemented. Treat this file as the approved reference for env ownership and scope decisions, not as proof that every surface already has complete env wiring.

---

## Related docs

- [`../architecture/deployment-security.md`](../architecture/deployment-security.md)
- [`../architecture/data-auth-integrations.md`](../architecture/data-auth-integrations.md)
- [`../architecture/public-sites.md`](../architecture/public-sites.md)
- [`../architecture/packages.md`](../architecture/packages.md)
- [`../architecture/seo-analytics-observability.md`](../architecture/seo-analytics-observability.md)
- [`package-index.md`](./package-index.md)
- [`app-index.md`](./app-index.md)
- [`workspace-index.md`](./workspace-index.md)
- [`../../AGENTS.md`](../../AGENTS.md)
- [`../../README.md`](../../README.md)