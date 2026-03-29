# repo/docs/architecture/design-system.md

Status: Accepted  
Date: 2026-03-24

## Purpose

Define the design-system architecture for this monorepo.

This document explains how shared design foundations are structured, what belongs in the shared token and UI layers, what must remain app-local, and how consistency is achieved without forcing visual sameness across the firm site and client sites.

It is the source of truth for design-system boundaries, not a component inventory or implementation tutorial.

---

## Design-system model

The design system in this repo is a **shared foundation layer, not a shared site-composition system**.

Its job is to provide:

- a common token architecture
- reusable low-level UI primitives
- consistent styling foundations
- controlled theming within a shared structure
- a stable base for multiple public sites

Its job is not to provide:

- full branded site kits
- page-level composition systems
- shared marketing-section libraries by default
- one visual system that all sites must look like

The repo is intentionally designed so that **shared design structure exists centrally, while visible site expression remains local to each app unless reuse is clearly proven**.

---

## Why this model exists

This model exists to preserve:

- consistency at the foundation level
- flexibility at the site level
- strong app/package boundaries
- easier long-term maintenance of tokens and primitives
- freedom for client sites to differ meaningfully
- a shared design infrastructure that supports reuse without flattening brand variation

The design system is intentionally biased toward **shared primitives and shared token structure**, not toward over-centralized visual composition.

---

## Core layers

### `packages/design-tokens`

`packages/design-tokens` is the shared token infrastructure layer.

It owns the common token architecture and generation pipeline for the repo.

It is responsible for things such as:

- authored token definitions
- token validation
- semantic token structure
- theme/token generation artifacts
- CSS variable outputs
- framework-facing token outputs where defined
- deterministic token contracts used by consumers

It provides the shared design language structure, not final app styling decisions.

### `packages/ui`

`packages/ui` is the shared UI system package.

It provides reusable UI foundations such as:

- primitives
- low-level presentational components
- structural patterns
- minimal UI hooks/providers where justified
- token-driven styling foundations

It exists to give apps reliable reusable building blocks, not to own final site composition.

### App-local design layer

Apps own the visible expression of the design system.

That includes:

- section composition
- page-level layouts
- brand-heavy styling decisions
- site-specific interaction patterns
- composition of shared primitives into actual branded experiences

This layer remains app-local by default.

---

## Design-token posture

The token layer exists to provide **shared structure with controlled local expression**.

That means:

- token architecture is shared
- semantic layering is shared
- generation and validation are shared
- sites can provide their own theme values within that shared structure
- site-specific token extensions should be rare and governed

The token layer should support consistency in how design decisions are expressed, without requiring the same visual outcome across every site.

### Token-level goals

The token system should support:

- stable cross-site design foundations
- semantic-first consumption
- predictable theming
- low-level reuse across apps and packages
- controlled evolution over time

### Token-level anti-goals

The token system should not become:

- a client-specific styling dump
- a loose pile of one-off tokens
- an excuse to centralize full site visuals
- a substitute for app-local design decisions

---

## UI package posture

`packages/ui` should remain **primitive-first** and **presentationally bounded**.

It should provide:

- reusable primitives
- low-level composable UI building blocks
- token-driven styling
- shared accessibility-conscious foundations
- reusable structural patterns where they remain generic

It should not become:

- a warehouse for marketing sections
- the default home for firm-site composition
- the default home for client-site composition
- a holding area for brand-heavy page fragments
- a place where app-specific business or routing concerns leak in

A shared UI package is successful when apps can build real surfaces with it without the package becoming the owner of those surfaces.

---

## App-local-first rule for visible UI

Visible public-site composition is **app-local first**.

Keep these app-local by default:

- hero sections
- testimonial bands
- CTA sections
- service-page compositions
- branded landing-page assemblies
- client-specific layout patterns
- site-specific content presentation

Do not promote these into `packages/ui` simply because two sites temporarily resemble each other.

Extraction into the shared UI layer is justified only when the reuse is:

- real
- repeated
- boundary-clear
- generic enough to survive variation across sites

---

## Consistency model

Consistency in this repo comes primarily from:

- shared token structure
- shared primitive quality
- shared package boundaries
- shared accessibility and implementation discipline
- shared documentation and decision rules

Consistency does **not** come primarily from forcing every site to reuse the same visible sections.

This allows the firm site and client sites to remain meaningfully different while still benefiting from common foundations.

---

## Theming model

The theming posture is **shared model, site-local values**.

That means:

- themes should fit within the shared token architecture
- each site may express its own theme values within that system
- cross-site sameness is not the goal
- theme drift should be controlled structurally, not eliminated visually

Theme variation is expected. Structural chaos is not.

---

## Relationship to apps

Apps consume the design system. The design system does not own app surfaces.

The boundary is:

- `packages/design-tokens` provides shared token infrastructure
- `packages/ui` provides shared UI foundations
- apps compose those foundations into actual public-facing experiences

Apps remain responsible for final branded outcomes.

Do not blur this boundary by moving page-level design ownership into shared packages prematurely.

---

## Relationship to public-site architecture

The design-system model is intentionally aligned with the public-site model.

That means:

- public sites stay app-local first
- visible composition stays local unless reuse is clearly proven
- the shared design layer supports flexibility rather than flattening it
- real client sites are free to diverge meaningfully while still using common foundations

For the public-site architecture itself, see [`public-sites.md`](./public-sites.md).

---

## Extraction rule

Promote something into the design-system layer only when all of the following are true:

- it is reused or clearly about to be reused across bounded surfaces
- the boundary can be described precisely
- the shared version will remain generic enough to survive brand variation
- moving it into a package improves clarity rather than hiding app ownership
- the exported API can stay narrow and intentional

If these conditions are not met, keep it local to the app.

---

## Quality expectations

Shared design-system code should generally be:

- token-driven
- documented
- composable
- narrow in public surface
- accessibility-conscious
- safe to consume without deep internal knowledge
- stable enough to justify central ownership

The shared layer should feel more disciplined than app-local code, not less.

---

## Alternatives considered

- **One shared section library as the main delivery model** — rejected; over-centralizes visible site composition before reuse is proven
- **No shared design system at all** — rejected; tokens and primitives provide clear cross-app value
- **One visually unified system for all firm and client sites** — rejected; weakens client flexibility and pushes the repo toward sameness
- **Client-specific design systems inside shared packages** — rejected; blurs ownership and weakens boundaries
- **Using `packages/ui` as a general-purpose shared fragments bucket** — rejected; encourages long-term drift

---

## Trade-offs

This model makes some things easier:

- preserving strong site-to-site variation
- maintaining clear shared-design boundaries
- reusing token and primitive foundations safely
- evolving shared design infrastructure without owning every surface
- keeping AI-assisted contributors from over-extracting visible UI too early

It also makes some things harder:

- some visible UI duplication may exist before extraction is justified
- shared section systems emerge more slowly
- more discipline is required to decide what truly belongs in the shared layer
- site-level design consistency depends partly on judgment, not just centralization

These trade-offs are intentional.

---

## What is deferred

The current design-system model intentionally defers:

- broad shared marketing-section systems
- centralized ownership of page-level composition
- client-brand-specific component libraries in shared packages
- visual unification across all sites
- aggressive extraction of section-level UI before reuse is proven

These are deferred, not forbidden.

---

## Related docs

- [`overview.md`](./overview.md)
- [`apps.md`](./apps.md)
- [`packages.md`](./packages.md)
- [`public-sites.md`](./public-sites.md)
- [`seo-analytics-observability.md`](./seo-analytics-observability.md)
- [`testing.md`](./testing.md)
