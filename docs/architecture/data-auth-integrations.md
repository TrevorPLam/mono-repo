# repo/docs/architecture/data-auth-integrations.md

Status: Accepted  
Date: 2026-03-24

## Purpose

Define the architectural posture for data, authentication, and third-party integrations in this monorepo.

This document explains how database usage, auth, and integrations fit into the current repo model, what is in scope now, and which assumptions are intentionally deferred. It is the source of truth for these architectural boundaries, not a runbook for migrations, auth setup, or provider onboarding.

---

## Architecture summary

The current posture is:

- the repo is designed to support a shared database architecture, but early public sites should remain DB-optional by default
- authentication is not part of public-site architecture
- auth is reserved for justified protected app surfaces
- integrations use a staged shared-core plus real-adapter model
- credentials, tokens, and integration state belong in deliberate shared infrastructure, not scattered app code
- webhook and async integration flows should be fast to acknowledge, queued where appropriate, and idempotent in downstream handling

This model is optimized for current business needs: public-site delivery first, with a coherent path to richer internal or protected workflows later.

---

## Why this model exists

This model exists to preserve:

- low-friction delivery for public-facing sites
- a clean path to more serious internal or protected app needs later
- separation between public-site concerns and protected application concerns
- deliberate ownership of secrets, credentials, and integration state
- shared infrastructure that can scale when real operational needs appear
- strong boundaries for AI-assisted and human contributors

The architecture is intentionally biased toward **coherent foundations without making the database, auth, or integrations the critical path for every app**.

---

## Data posture

### Shared database foundation

The repo is designed to support a real shared database architecture, but it should not be forced into early public-site work by default.

The database layer exists to support:

- shared operational state when truly needed
- protected or internal workflows
- durable data beyond simple static/content-file needs
- integrations and token storage where appropriate
- future serious app behavior that requires persistence

### DB-optional public sites

Early public-facing sites should remain DB-optional unless a real need justifies persistence.

That means public sites should not casually introduce database dependence for:

- simple page rendering
- basic content publishing
- ordinary marketing-site behavior
- speculative future needs

For early public sites, prefer static content files and lightweight server-side handling where possible before introducing durable database persistence.

Where data storage is needed, it should be introduced deliberately and with a clear architectural reason.

### Tenancy-aware future path

The shared data posture assumes a future path for tenant-aware operational state, but that does not mean every current site or workflow should adopt tenancy-heavy patterns immediately.

Tenant-aware operational state should live in deliberate shared infrastructure and protected apps, not in public-site apps by default.

For repo-wide deployment and security posture, see [`deployment-security.md`](./deployment-security.md).

---

## Authentication posture

### Public sites do not own auth

Authentication is not part of the default public-site model.

Public-facing Astro sites should remain public unless a real protected workflow justifies otherwise.

This means public-site work should not casually absorb:

- login requirements
- user/session complexity
- protected-app routing assumptions
- auth-driven application architecture

For public-site posture, see [`public-sites.md`](./public-sites.md).

### Auth is for justified protected surfaces

Auth exists for protected app surfaces when a real workflow needs it.

The current posture is:

- auth is reserved for true protected or internal apps
- auth should not be introduced into an app just because the capability exists elsewhere in the repo
- authorization belongs in deliberate server-side boundaries, not in vague client-side checks or convenience middleware patterns

### Shared auth foundation

The repo’s auth foundation should be shared and centralized rather than reimplemented per app.

That shared foundation should support:

- consistent session handling
- explicit auth boundaries
- durable server-side authorization patterns
- future protected/internal app growth without rewriting auth from scratch

Apps should call into a shared auth layer rather than each reimplementing session and authorization logic.

Auth-specific assumptions should not leak into generic shared packages that also serve public-site work.

It should not turn every surface into an auth-first application.

---

## Integration posture

### Shared integration core

Integrations should use a staged architecture:

- shared integration core for common infrastructure
- real provider adapters only when needed
- per-app wiring only where app context, tenant context, credentials, or logging must be bound

This keeps provider concerns deliberate rather than scattering third-party logic across apps.

### Integration state belongs in shared infrastructure

Credentials, OAuth tokens, provider state, and other durable integration concerns should live in shared infrastructure with explicit ownership and secure handling.

These concerns should not live as:

- scattered app-local env hacks
- hidden client-side code
- undocumented local files
- ad hoc provider-specific blobs without ownership rules

### When to create a shared adapter

Create a shared provider adapter when all of the following are true:

- more than one app or workflow needs the provider
- a stable, narrow interface can be defined
- credentials and durable state are already centralized or have a clear shared ownership model

### Webhook and async posture

Webhook and async integration flows should follow these high-level rules:

- verify quickly
- acknowledge quickly
- enqueue where needed
- keep downstream consumers idempotent
- separate ingress from longer-running processing

This keeps third-party integrations reliable without forcing synchronous provider work into the request path.

---

## Relationship between data, auth, and integrations

These three layers are related, but they should not collapse into one undifferentiated system.

### Data is not auth

The existence of a shared database does not mean an app needs auth.

### Auth is not a default requirement for integrations

An integration may require durable tokens or credentials without making the entire repo auth-first.

### Integrations are not an excuse to overbuild app architecture

Adding one external provider should not trigger a speculative internal platform buildout.

The repo should adopt only the complexity required by the real workflow in front of it.

---

## Current implementation posture

At the current stage, the repo should optimize for:

- public-site delivery first
- DB use only where justified
- auth only where a real protected surface exists
- integration support that is real but not over-generalized
- gradual escalation from simple site work to richer operational systems

This means current work should prefer:

- local-first site implementation
- minimal persistence unless needed
- no casual auth activation in public sites
- no provider-specific sprawl across the repo

---

## Alternatives considered

- **DB-first architecture for all apps** — rejected; would overcomplicate early public-site work and make persistence the default before justified
- **Auth-first architecture for public and private surfaces alike** — rejected; current repo priorities are public-site delivery, not universal protected-app behavior
- **App-local integrations with no shared core** — rejected; would scatter credentials, provider logic, and webhook handling across the repo
- **One broad internal platform built up front** — rejected; current business needs do not justify full internal-platform complexity yet
- **No shared data/auth/integration infrastructure at all** — rejected; would create costly rewrites when real protected workflows or provider needs appear

---

## Trade-offs

This model makes some things easier:

- keeping public sites simple
- delaying unnecessary auth and DB complexity
- introducing shared infrastructure only when it creates real leverage
- maintaining clearer ownership of credentials and provider state
- scaling into richer workflows later without starting from zero

It also makes some things harder:

- some future protected-app or operational capabilities require deliberate activation rather than being prebuilt everywhere
- persistence and integration decisions require more judgment up front
- contributors cannot assume every app already has DB/auth primitives wired in locally
- some implementation work is deferred until the real need appears

These trade-offs are intentional.

---

## What is deferred

The current posture intentionally defers:

- broad protected/internal app expansion
- auth as a default assumption for public sites
- DB-heavy architecture for ordinary marketing sites
- speculative provider abstraction before real provider usage exists
- broad internal platforms built ahead of actual operating need
- rich org-switched or client-portal behavior as the default repo assumption

These are deferred, not forbidden.

---

## Related docs

- [`overview.md`](./overview.md)
- [`apps.md`](./apps.md)
- [`public-sites.md`](./public-sites.md)
- [`packages.md`](./packages.md)
- [`deployment-security.md`](./deployment-security.md)
- [`seo-analytics-observability.md`](./seo-analytics-observability.md)