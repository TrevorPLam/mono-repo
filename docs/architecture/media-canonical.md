# repo/docs/architecture/media-canonical.md

Below is a draft you can treat as the **canonical media/asset pipeline decision** for the repo, written to fit the current monorepo rules and updated with current external guidance as of March 25, 2026.

# Media / Asset Pipeline — Proposed Final Source of Truth

## 1. Purpose

This document defines how media and non-code assets should be handled across the monorepo.

It answers:

* what kinds of assets exist
* where each kind belongs
* what is committed to Git versus kept outside the repo
* when Astro-local assets are the right default
* when remote object storage is justified
* how SEO/social images should be modeled
* how editorial/blog imagery should work
* how the pipeline should preserve clean client handoff

This is a repo-level policy, not a one-off site preference.

## 2. Core decision

The default media model for this repo is:

**app-local, Astro-native, build-first media for ordinary public-site assets; file-like assets in `public/`; provider-neutral media contracts in `@repo/contracts`; remote media only when justified by real operational need.**

That follows the repo’s existing app/package boundaries: apps own local assets, content, routes, page composition, and site-specific SEO inputs, while packages own shared contracts, shared policy, and reusable primitives.  

It also matches Astro’s current guidance: Astro recommends keeping local images in `src/` when possible so Astro can transform, optimize, and bundle them, while files in `public/` are served as-is with no processing. ([Astro Docs][1])

## 3. Why this is the right fit for this repo

The repo has already established that public sites are Astro-first, code/content-file-first, and app-centric; real client sites live under `apps/sites/clients/<client-slug>/`; visible marketing composition stays app-local unless reuse is clearly proven; and public apps own local media and assets. 

The canonical public-site app contract already distinguishes:

* `public/` for unprocessed static public assets
* `src/assets/` for source assets used through the build pipeline

and explicitly says not to dump all media into `public/` by default. It also gives concrete examples like `src/assets/images/` and `src/assets/illustrations/` for public sites. 

The repo also already decided that `packages/contracts` should expose provider-neutral media DTOs in `src/content/media.ts`, including media asset DTOs, image asset DTOs, responsive source DTOs, and shared alt/caption fields, while excluding provider-native storage payloads. 

Separately, the SEO layer has already constrained scope: the shared SEO system should centralize policy and metadata mapping, but image generation itself is not the job of the adapter layer. In particular, `@repo/seo-next` explicitly does **not** own OG/Twitter image generation. 

So the repo is already pointing toward a model where:

* apps own actual site media choices
* packages own contracts and policy
* shared packages do **not** become a client-asset warehouse

## 4. Asset classes

Use these asset classes consistently.

### 4.1 Build-processed site visuals

Examples:

* page hero images
* editorial/blog imagery
* illustrations
* diagrams
* cards and marketing visuals
* local social/share image fallbacks when build-managed

These belong in `src/assets/` because they should flow through Astro’s build-time image pipeline whenever practical. Astro’s docs explicitly recommend `src/` for local images when possible so they can be transformed and optimized.  ([Astro Docs][1])

### 4.2 File-like public assets

Examples:

* favicons
* downloadable PDFs
* verification files
* manifest-adjacent files if used later
* robots-adjacent public files
* stable file-addressable assets that must keep a direct public URL

These belong in `public/`, because Astro serves them as-is without processing. That is exactly what `public/` is for in both the repo contract and Astro’s docs.  ([Astro Docs][1])

### 4.3 Shared media contracts

These belong in `packages/contracts/src/content/media.ts`, not in app folders and not in provider adapters. The contract package already defines that this file should hold provider-neutral media DTOs shared between content, SEO, and rendering boundaries. 

### 4.4 Working/source design files

Examples:

* layered PSD/AI files
* large brand export bundles
* raw design-system source exports
* client-delivered originals that are not web-ready delivery assets

These are **not** repo defaults. The repo should commit the web-delivery assets that are actually needed to build and ship the site, not automatically become the archive for all creative-production source files. That keeps the repo operationally lean and preserves clear delivery boundaries.

### 4.5 Remote-managed heavy media

Examples:

* large galleries
* frequently updated non-developer-managed media
* future user uploads
* media requiring many dynamic transformations
* media best served from object storage or edge transforms

These are not the baseline. They are an escalation path.

## 5. Placement rules

### 5.1 Default rule

If an asset is part of a shipped site and chosen by that site, it belongs in the app that ships it.

Typical locations:

* `apps/site-firm/src/assets/**`
* `apps/sites/clients/<client-slug>/src/assets/**`
* `apps/.../public/**`

This follows the app model that apps own local assets, content, site-specific configuration, and the final shipped surface. 

### 5.2 What is not allowed

Do **not** create:

* a root-level media bucket
* a generic `packages/media`
* a shared client-brand image warehouse
* a hidden media layer inside grouping directories
* a “common assets” dumping ground for public sites

That would violate the app/package split and the explicit rule that packages do not own client-specific site behavior or visible page composition. 

## 6. `src/assets/` vs `public/`

Use this rule:

### Put assets in `src/assets/` when:

* they are imported into Astro pages/components/content
* they should be optimized or transformed
* they are part of normal page rendering
* they may need responsive variants
* they are part of editorial or marketing composition

### Put assets in `public/` when:

* they must remain file-like
* they need a stable direct URL
* they should bypass the image pipeline
* they are downloadable documents or verification files
* they are favicon/manifest/robots-adjacent files

This split is supported by both the repo’s app contract and Astro’s own recommendation that `src/` is for processable local images and `public/` is for unprocessed assets.  ([Astro Docs][1])

## 7. Folder conventions

Inside public-site apps, use this default shape:

```text
src/assets/
  images/
    blog/
    pages/
    team/
    services/
  illustrations/
  social/

public/
  downloads/
  favicons/
  verification/
```

This fits the existing public-app contract examples, which already show `src/assets/images/` and `src/assets/illustrations/` as the canonical shape. 

## 8. Naming rules

Use descriptive, stable filenames. Recommended pattern:

`<semantic-name>--<variant>--v<NN>.<ext>`

Examples:

* `home-hero--desktop--v01.jpg`
* `local-seo-guide--card--v02.webp`
* `acme-team-photo--about--v01.jpg`
* `og-default--v01.png`

Rules:

* lowercase kebab-case only
* no spaces
* no `final-final-2`
* include variant only when it adds real meaning
* version only when replacing without changing the semantic role

## 9. Optimization defaults

### 9.1 Responsive images are the baseline

Responsive images should be the default for assets that render at materially different sizes across viewports. MDN still treats responsive images, via `srcset` and `sizes`, as the standard way to serve appropriate images across screen sizes and densities. ([MDN Web Docs][2])

### 9.2 Preserve intrinsic dimensions

Width and height should be known or declared whenever possible so space is reserved before load, reducing layout shift. MDN explicitly recommends using both width and height on images for this reason. ([MDN Web Docs][3])

### 9.3 Prefer Astro image tooling for local images

For local build-managed images, prefer Astro’s image components and image pipeline over hand-managed derivative sprawl. Astro provides built-in image optimization tooling and explicitly recommends `src/`-based local images for transformation and bundling. ([Astro Docs][1])

### 9.4 `public/` is not the default image bucket

Do not use `public/` as the default home for ordinary page imagery. Use it only when direct URL semantics or no-processing behavior is actually needed.  ([Astro Docs][1])

### 9.5 Video is a separate concern

Do not try to make the ordinary Astro asset pipeline the baseline for serious video delivery. Astro’s docs explicitly note there is no native video optimization pipeline and recommend a hosted video service for the demands of optimization and streaming. ([Astro Docs][1])

## 10. Metadata requirements

Every non-decorative image should support at least:

* `alt`
* optional `caption`
* optional `credit`
* optional `source/license`
* optional `width`
* optional `height`
* optional `focalPoint`

This belongs naturally in the provider-neutral media contract layer, because the contracts package already reserves shared alt/caption-capable media DTOs for content, SEO, and rendering boundaries. 

## 11. Editorial and blog image workflow

The repo already treats public-site content as app-local and code/content-file-first, with blog/resource capability expected from the start. That means editorial imagery should be content-adjacent and app-local, not pushed into a shared package or centralized media system. 

Recommended pattern:

* content entry owns image metadata
* asset file lives in `src/assets/images/blog/...`
* content references a local image import or a normalized `ImageAsset`
* optional semantic variants like `hero`, `card`, and `inline` are modeled in content, not in ad hoc naming folklore

This stays compatible with a future CMS because the shared contract remains provider-neutral. 

## 12. SEO and social image policy

### 12.1 Shared policy, app-local asset choice

The app chooses the actual image. Shared SEO packages own policy and normalization.

That is already consistent with the repo’s architecture: SEO policy belongs in shared SEO layers, while app-specific business SEO logic and asset choices do not. `@repo/seo-next` explicitly excludes OG/Twitter image generation from its scope. 

### 12.2 Site-level default OG image

Each site should have one stable branded fallback OG image.

Recommended location:

* `src/assets/social/og-default.*` if build-managed
* `public/og-default.*` only when you deliberately want a stable file-addressed asset

### 12.3 Page-level override

Pages, posts, and resources may override the default when justified.

### 12.4 Use absolute URLs in SEO output

The repo already prefers absolute URLs for canonical, alternates, Open Graph URLs/images, and Twitter image URLs in domain-aware contexts. 

### 12.5 Preserve OG-compatible image metadata

The Open Graph protocol supports `og:image` and structured properties including secure URL, MIME type, width, and height. So the media model should preserve enough metadata to emit those fields cleanly when useful. ([Open Graph][4])

### 12.6 No dynamic OG generation as the default for public sites

For v1 public sites, use static or build-managed branded fallbacks plus page overrides. Dynamic image generation is optional later, not the baseline.

## 13. Contracts shape

The shared contract package should expose provider-neutral media shapes from `@repo/contracts/content`, not provider-specific storage payloads. That is already the repo rule. 

Recommended contract family:

* `MediaAsset`
* `ImageAsset`
* `ResponsiveSource`
* `MediaCredit`
* `FocalPoint`

Rules:

* JSON-safe only
* no Cloudflare/Cloudinary/S3/R2 response objects in public contracts
* no framework-native props in contracts
* contracts describe exchange shapes, not storage implementation

That fits the broader `@repo/contracts` package rules of JSON-safe DTOs, framework neutrality, and provider-neutral public contracts. 

## 14. Commit-local vs remote storage

### 14.1 Default: commit local

For ordinary public-site assets that ship with the site and change with code/content, the default is to commit them locally in the app. That fits both the repo’s app-local assembly model and Astro’s `src/`-first image guidance.  ([Astro Docs][1])

### 14.2 Escalate to remote storage only when justified

Remote storage becomes justified when one or more of these is true:

* asset volume makes Git operationally painful
* non-developers need direct asset operations
* media changes frequently without code deploys
* many responsive/transformed variants are needed on demand
* user uploads become a real product feature
* large galleries or media-heavy experiences make local commit flow awkward

## 15. Recommended remote escalation path

If remote media becomes necessary, the first serious path should be object storage plus edge transforms, not a full DAM by default.

A strong fit for the current platform direction is:

* originals in Cloudflare R2
* transformed delivery at the edge when justified

That is the best “stage two” path. A full DAM remains a much later escalation.

## 16. Security posture for future uploads

Uploads are not the current baseline for ordinary public sites, but the rule should be explicit now:

If the repo later supports uploads, follow OWASP’s file upload guidance: allowlist extensions, validate file types, control filenames, limit size, and treat uploads as potentially hostile input. ([OWASP Cheat Sheet Series][5])

That means no casual public-site upload hacks.

## 17. Client handoff and ejection

The media pipeline must preserve clean transferability.

Therefore:

* site-delivery assets should remain app-local and exportable by default
* the client should be able to receive all production-ready site assets cleanly
* working/source design files may be handed off separately if they are not in Git
* remote media should not become an agency-lock-in dependency by accident

This fits the repo’s broader app ownership and separate-client-app model, where each real client site is its own app and owns its shipped identity locally. 

## 18. CI and QA

Start light but deliberate.

Recommended initial checks:

* fail on broken local asset references
* warn or fail on oversized committed images above agreed thresholds
* require alt metadata where the content model expects it
* smoke-check critical routes for missing images
* review Lighthouse or page-performance regressions on media-heavy pages

This is consistent with the repo’s broader posture of intentional guardrails instead of speculative overengineering. 

## 19. Final decision summary

Lock in this rule:

**Default to app-local, Astro-native media.**
Use:

* `src/assets/` for build-processed site visuals
* `public/` only for unprocessed, file-like public assets
* `@repo/contracts/content` for provider-neutral media DTOs
* remote object storage only when justified by real operational need
* no full DAM as the baseline
* no shared client-media warehouse in packages

That is the cleanest fit with the repo’s current architecture, the app contract, the contracts package plan, and the current state of Astro and web image best practices.    ([Astro Docs][1])

## 20. Immediate follow-on decisions

The remaining practical implementation choices are now much narrower:

1. Define the exact `ImageAsset` / `ResponsiveSource` contract in `packages/contracts`.
2. Add app-level folder and naming conventions to the public-site template/readme surfaces.
3. Decide the initial file-size thresholds and lint/CI checks.
4. Decide whether the first OG fallback should be build-managed or direct-file managed.
5. Define the exact cutoff that triggers R2/remote media adoption.