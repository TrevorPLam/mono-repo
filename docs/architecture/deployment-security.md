# repo/docs/architecture/deployment-security.md

Status: Accepted  
Date: 2026-03-24

## Purpose

Define the architectural posture for deployment and security in this monorepo.

This document explains how deployable surfaces should be hosted, how deployment boundaries map to the repo, how secrets and runtime trust should be handled, and which security defaults are expected at the architecture level. It is the source of truth for deployment and security posture, not a runbook for provisioning, incident response, or day-to-day operations.

---

## Architecture summary

The current posture is:

- deployable surfaces map to bounded apps in the monorepo
- hosting should favor low-friction multi-project deployment rather than one runtime shell for everything
- public-site delivery comes first, with Astro as the dominant current public-site framework
- deployment boundaries should align with ownership, rollback safety, and secret isolation
- security should be enforced through clear runtime boundaries, least-privilege secret placement, and explicit server-only behavior
- stronger controls should be added where risk is real, not speculatively everywhere at once

This model is optimized for shipping public-facing work safely while preserving a clean path to more sensitive protected surfaces later.

---

## Why this architecture exists

This posture exists to preserve:

- bounded deployment surfaces
- safer rollbacks and clearer blast-radius control
- cleaner separation of client-specific secrets and infrastructure concerns
- predictable behavior for humans and AI-assisted contributors
- practical security defaults without turning every public site into a hardened internal app
- a deployment model that can scale with more apps without collapsing into one shared runtime

The architecture is intentionally biased toward **bounded deployables, deliberate secret scope, and server-only trust boundaries**.

---

## Deployment model

### Deployable surfaces map to apps

Each real deployable surface should correspond to an app-level boundary.

That means:

- the firm site is deployed as its own app surface
- real client sites are deployed as separate app surfaces
- later protected or internal apps should also deploy as bounded app surfaces when justified

This keeps deployment ownership aligned with app ownership.

### Multi-project hosting posture

The preferred deployment model is multi-project hosting, where each deployable app maps cleanly to its own deployment target.

This supports:

- cleaner rollback boundaries
- clearer secret isolation
- more predictable build and deploy behavior
- easier client-specific hosting separation when needed

The current default deployment target is Vercel, using separate projects per app. If a client requires alternative hosting, the same bounded-app model still applies.

### Public-sites-first deployment posture

Public sites are the primary deployment concern right now.

That means:

- deployment workflows should optimize for public-site delivery first
- Astro public-site deployments should remain straightforward and low-friction
- protected/internal deployment complexity should not become the default burden for public-site work

---

## Hosting topology

### Bounded app projects

Each deployable app should have a clear hosting boundary.

That boundary should make it easy to answer:

- what code is deployed here
- what secrets belong here
- what domain points here
- what rollback affects here

This is especially important for client sites, where infrastructure isolation and transferability matter.

### Domain posture

Each client site should be hosted under a domain the client controls or can transfer.

The architecture should not assume firm-controlled DNS as the default. Deployment setup should preserve the client’s ability to take over DNS or hosting responsibility without requiring a redesign of the site architecture.

### Client-site posture

Real client sites should preserve a clear ejection and handoff path.

That means the deployment model should avoid unnecessary coupling that would make it difficult to:

- separate a client site from the main operating model later
- transfer hosting responsibility
- isolate client-specific infrastructure behavior

### Prospect and demo posture

Short-lived prospect or demo work should usually not become permanent hosted app surfaces in the main repo topology by default.

Temporary preview behavior is preferred unless the work becomes durable enough to justify a real app boundary.

---

## Build and release posture

### Git-first deployment model

The default deployment model should favor source-driven deployments tied to normal repo workflows.

That means deploys should trigger from branch merges, approved branch flows, or tags rather than from manual artifact uploads or external triggers disconnected from the repository.

### Safe rollback posture

Rollback capability should be treated as a first-class architectural concern.

That means deployment boundaries should support:

- reverting one app without reverting unrelated apps
- safer release isolation
- bounded operational impact when a deployment fails

### Expand-contract mindset

When schema, integration, or deployment compatibility changes are introduced, favor staged evolution over brittle all-at-once transitions.

This is especially important once protected or data-backed surfaces become more active.

---

## Secret and configuration posture

### Least-privilege secret scope

Secrets should be scoped as narrowly as practical.

That means:

- client-specific secrets should not be treated as broad shared defaults
- secrets should be attached to the smallest reasonable deployment boundary
- global secrets should exist only when they are truly global

### Server-only trust boundaries

Sensitive logic and sensitive configuration should remain in server-only boundaries.

That includes:

- secret handling
- credential usage
- privileged provider calls
- durable authorization checks
- sensitive operational workflows

Client-facing code should not become a convenience path for secret or privileged behavior.

### Environment handling

Environment access should be explicit, validated, and centrally shaped through shared env patterns.

This reduces:

- ad hoc secret access
- inconsistent variable naming
- accidental client exposure
- drift between deployment targets

---

## Runtime security posture

### Public sites are not protected apps by default

Public-facing sites should remain public by default.

They should not casually absorb:

- auth-first architecture
- session-heavy assumptions
- internal-app middleware posture
- security controls designed for protected surfaces that do not match the actual risk

Public sites should still be secure, but their security posture should match their role.

### Protected surfaces get stronger controls

When protected or internal apps are introduced, they should receive stricter runtime controls than ordinary public sites.

That includes stronger assumptions around:

- auth and authorization
- server-only logic
- secret usage
- request protection
- data handling
- CSP and runtime hardening where appropriate

### Explicit server-module boundaries

Shared server-side modules should be clearly server-only.

This prevents sensitive logic from drifting into client-consumable code paths.

---

## CSP and browser security posture

### Surface-aware CSP

Content Security Policy should be applied according to surface risk.

The current posture is:

- dynamic or sensitive protected surfaces may justify nonce-based CSP and stricter runtime controls
- static public marketing surfaces should prefer a strict static allowlist baseline
- CSP strategy should match the actual runtime and risk profile of the surface

### Security header posture

Beyond CSP, public surfaces should ship with a deliberate baseline of security headers appropriate to their content and risk profile.

The exact header values belong in operational runbooks and deployment configuration, but the architectural expectation is that no public surface ships without an intentional header baseline. Shared defaults should be managed centrally where the platform allows rather than configured ad hoc per app.

### Avoid one-size-fits-all hardening

Public sites, simple static surfaces, and later protected apps do not all need the exact same browser-security posture.

Security controls should be strong, but they should also be appropriate to the surface.

---

## Preview and deployment control posture

### Preview protection and access control

Preview deployments should default to controlled sharing rather than open public access.

That means:
- previews are review surfaces, not implicit production approval
- previews should remain private or access-controlled by default where feasible
- use invite-based or explicit sharing when outside reviewers need access
- distinguish between commit-specific preview links (fixed signoff snapshots) and branch-specific preview links (iterative review)

### Production approval posture

Production promotion may require explicit environment-based approval for higher-risk changes.

Higher-risk categories include:
- materially user-visible changes
- production content or messaging changes
- deployment, environment, or domain behavior changes
- changes with rollback risk beyond simple copy or style adjustments

Ordinary low-risk public-site changes can follow the normal protected-branch path.

### Rollout controls and staging

Rollout controls and long-lived staging environments should be justified by real need:
- gradual release only when risk justifies the extra operational surface
- long-lived staging/QA environments only when there is genuine cross-PR integration need
- avoid permanent staging as compensation for weak ordinary preview review

For the complete workflow, see [`../operations/preview-review-approval.md`](../operations/preview-review-approval.md).

---

## Dependency and supply-chain posture

### Conservative dependency additions

New dependencies should be added deliberately, not casually.

Shared or deployment-affecting dependencies have especially high blast radius and should be treated as architectural decisions when they materially change runtime posture.

### Current toolchain discipline

The repo should favor:

- pinned and current package-management discipline
- explicit workspace boundaries
- predictable installs
- controlled build behavior

This reduces avoidable deployment and supply-chain instability.

---

## Relationship to the rest of the architecture

Deployment and security are cross-cutting, but they should not erase other architectural boundaries.

### Deployment does not redefine app boundaries

Hosting convenience should not become the reason to blur the line between apps and packages.

### Security does not justify speculative complexity

Security should be strong, but it should not be used as a reason to preemptively turn simple public sites into heavy protected systems without need.

### Infrastructure remains support, not center of gravity

Infrastructure should support the repo architecture rather than silently redefining it.

---

## Alternatives considered

- **One shared runtime for most or all surfaces** — rejected; weakens rollback isolation, secret isolation, and ownership clarity
- **Broad shared secret scope across many apps** — rejected; increases blast radius and weakens client-specific isolation
- **Auth-heavy security posture for every public site** — rejected; mismatches the current role of ordinary public-facing surfaces
- **Ad hoc per-app deployment conventions with no shared posture** — rejected; creates drift and inconsistent operational risk
- **Deployment and security treated as purely operational concerns outside architecture** — rejected; these choices materially shape app boundaries and trust boundaries

---

## Trade-offs

This architecture makes some things easier:

- bounded deployment ownership
- safer rollback isolation
- cleaner client-specific secret scope
- clearer trust boundaries
- more predictable hosting decisions as the repo grows

It also makes some things harder:

- more explicit setup for each real deployable surface
- less convenience from broad shared hosting assumptions
- more up-front discipline in secret placement and runtime boundaries
- some operational complexity is accepted in exchange for better isolation

These trade-offs are intentional.

---

## What is deferred

The current posture intentionally defers:

- heavier protected-app security controls on ordinary public sites
- speculative enterprise-grade controls on surfaces that do not yet justify them
- broad internal-platform deployment topology before internal apps are real
- deployment unification that would blur current app boundaries
- security hardening that exists only to satisfy hypothetical future surfaces rather than current risk

These are deferred, not forbidden.

---

## Related docs

- [`overview.md`](./overview.md)
- [`repo-shape.md`](./repo-shape.md)
- [`apps.md`](./apps.md)
- [`public-sites.md`](./public-sites.md)
- [`data-auth-integrations.md`](./data-auth-integrations.md)
- [`seo-analytics-observability.md`](./seo-analytics-observability.md)
- [`testing.md`](./testing.md)