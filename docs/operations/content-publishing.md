# repo/docs/operations/content-publishing.md

````md
# content-publishing.md

Status: Active  
Date: 2026-03-25

## Purpose

Define the canonical workflow for planning, authoring, reviewing, publishing, updating, and retiring public-site content in this monorepo.

This is an operations runbook.  
It explains how content gets published correctly.  
It does not redefine the repo’s public-site architecture.

For architectural defaults, see:

- `docs/architecture/public-sites.md`
- `docs/architecture/apps.md`
- `docs/architecture/seo-analytics-observability.md`

---

## Scope

This runbook applies to:

- `apps/site-firm`
- `apps/sites/clients/<client-slug>`
- page content
- blog posts
- resources
- lead magnets and downloadable assets
- legal pages when managed as repo content
- content updates that affect SEO, analytics, forms, or publishing metadata

This runbook covers both human-authored and AI-assisted content work.

---

## Canonical posture

### 1. Content is local-first and code/content-file-first

Public-site content is managed in the repo by default.

That means:

- content usually lives in app-local files
- publishing should work without a CMS by default
- version control is the normal editing history
- content changes should remain reviewable like code changes

This matches the repo’s public-site baseline: public sites are code/content-file-first, blog/resource capable from the start, and should not depend on a heavy CMS by default. :contentReference[oaicite:4]{index=4} :contentReference[oaicite:5]{index=5}

---

### 2. The app owns its published content

Published content belongs to the app that ships it.

Canonical location pattern:

- app-local content under `src/content/`
- app-local content model in `src/content.config.ts`
- app-local page assembly under `src/pages/`, `src/layouts/`, `src/sections/`, and related app-local folders

Do not centralize real site content into shared packages just to reduce duplication.  
Shared helpers or schemas may exist, but the content itself remains app-owned. :contentReference[oaicite:6]{index=6} :contentReference[oaicite:7]{index=7}

---

### 3. Astro content collections are the default publishing substrate

For structured local publishing, prefer Astro content collections.

Astro’s official content system supports optional schemas for validation and type safety, and supports local content from Markdown, MDX, Markdoc, YAML, TOML, and JSON. Astro also now supports live remote content collections, but those are an option, not the baseline for this repo. :contentReference[oaicite:8]{index=8}

Repo rule:

- default to build-time local collections
- use MDX only when embedded components are genuinely useful
- do not adopt remote/live content as the default authoring model without a separate decision

---

### 4. Publishing must stay reviewable

A content change is still a production change.

Default publishing flow is:

- edit content in branch
- preview it
- review it
- ship it through the normal deployment path
- verify it after publish

Content should not bypass normal preview and production workflows just because it is “only copy.”

---

### 5. Content is for people first, search second

Google’s current guidance remains explicit: create helpful, reliable, people-first content, use language people actually search for, and put those descriptive terms in prominent locations like titles, headings, alt text, and link text. :contentReference[oaicite:9]{index=9}

Repo rule:

- write for real users first
- optimize with SEO discipline
- never publish search-engine-first filler
- do not create pages whose main purpose is ranking rather than helping

---

### 6. Accessibility is part of publishing quality, not a later pass

WCAG 2.2 is the current W3C standard for accessible web content. It covers content structure, link purpose, input purpose, and other user-facing requirements that apply directly to publishing workflows. :contentReference[oaicite:10]{index=10}

Repo rule:

- headings, links, images, tables, downloads, and forms must be publish-ready accessibly
- accessibility is part of “done,” not optional polish

---

## What counts as publishable content

Typical content types for public sites include:

- static marketing pages
- service pages
- blog posts
- resource articles
- downloadable templates, checklists, or guides
- FAQ content
- legal pages
- template-library entries or showcase pages
- lightweight proof assets such as process writeups or methodology pages

The canonical public app shape already treats content as first-class, with app-local `src/content/`, app-local content config, and blog/resource capability from the start. :contentReference[oaicite:11]{index=11}

---

## Content ownership model

### Default editing model

The default editing model is agency-managed.

That means:

- the agency edits content in v1
- clients are not assumed to be direct editors
- client-editable systems may be added later only when justified
- the workflow should remain repo-friendly and explicit

This follows the current public-site editing posture already fixed in canonical docs. :contentReference[oaicite:12]{index=12}

### Operational owner per content change

Every meaningful content release should have:

- an editor or drafting owner
- a reviewer
- a publishing owner
- a final approver when client approval is required

For solo operation, these may be the same person.  
The requirement is explicit ownership, not headcount separation.

---

## Canonical content locations

### App-local content

Default location:

```text
<app-root>/src/content/
````

Common collection examples:

```text
src/content/
  blog/
  resources/
  pages/
  faqs/
  legal/
```

Not every app needs every collection.
Use only the collections justified by the site.

### Content model registration

Default location:

```text
<app-root>/src/content.config.ts
```

This file owns:

* collection definitions
* schemas
* collection-specific validation rules
* app-local content typing decisions

Astro’s content collections are specifically designed for this kind of schema-backed local content modeling. ([Astro Documentation][1])

### Media and downloadable assets

Use the app’s local asset surfaces intentionally:

* `src/assets/` for build-pipeline imported assets
* `public/` for file-like public assets such as downloadable PDFs, verification files, and other direct-path artifacts

Do not dump all content assets into one bucket by habit.
Choose the location based on how the file is consumed by the built site. This matches the canonical public-app contract already established in the repo docs. 

---

## Content model rules

### Prefer structured frontmatter/schema over loose files

Each publishable collection should have an explicit schema where practical.

Typical fields may include:

* `title`
* `description`
* `slug`
* `publishedAt`
* `updatedAt`
* `draft`
* `author`
* `tags`
* `category`
* `image`
* `canonicalUrl`
* `noindex`
* `ogImage`
* `summary`
* `cta`
* `relatedEntries`

Why:

* content becomes type-safe
* authoring errors are caught early
* preview/build validation is stronger
* metadata handling stays predictable

Astro’s schema-backed collections are built for exactly this purpose. ([Astro Documentation][1])

### Prefer Markdown for ordinary editorial content

Default rule:

* use Markdown for ordinary text-first articles/pages
* use MDX only when content truly needs embedded components or richer authored composition
* do not reach for MDX by default just because it is more powerful

Astro supports both Markdown and MDX, but MDX should be a deliberate escalation, not the baseline for all content. ([Astro Documentation][2])

### Keep app-specific content models app-specific

Do not force all sites into one universal content schema.

Per-site flexibility is part of the repo’s public-site posture.
Shared schema helpers are acceptable; one rigid cross-site content model is not the default. 

---

## Publishing workflow

## 1. Decide the content type and goal

Before writing, identify:

* what type of content this is
* who it is for
* the primary user goal
* the business goal
* whether the page is evergreen, time-sensitive, campaign-bound, or temporary
* whether the page should be indexed
* whether the page needs a lead capture or conversion CTA

No drafting should begin without a clear purpose.

### Recommended goal categories

Use one primary goal:

* explain
* rank
* convert
* support sales
* capture leads
* educate existing clients
* establish authority
* support launch/campaign

Multiple secondary goals are fine, but one primary goal should dominate page structure.

---

## 2. Choose the right publishing surface

Decide whether the content belongs as:

* a routed page
* a blog/resource entry
* a legal/info page
* a downloadable asset with a landing page
* a template or showcase entry
* an update to an existing page rather than a net-new page

Do not create a new content type when an existing one fits.

---

## 3. Model the content before drafting

Before heavy writing, confirm:

* collection name
* schema fields
* slug/path strategy
* publish date behavior
* update date behavior
* taxonomy rules
* image requirements
* SEO metadata requirements
* whether draft mode is supported
* whether this content should appear in sitemap and RSS

This prevents later retrofits and broken metadata.

---

## 4. Draft the content

Draft into the correct app-local location.

Content should aim for:

* clear audience fit
* strong opening context
* scannable structure
* real substance
* internal linking opportunities
* one clear next step

Google’s guidance remains to focus on helpful, reliable, people-first material rather than content made primarily to manipulate rankings. ([Google for Developers][3])

### Required drafting standards

Every publishable page should have:

* one clear H1
* a useful title and meta description
* descriptive headings
* descriptive link text
* meaningful image alt text where images convey information
* one primary CTA when conversion matters
* visible and accurate authorship/date information where relevant
* no placeholder copy, TODOs, fake stats, or unverifiable claims

Google explicitly recommends descriptive words in titles, main headings, alt text, and link text. WCAG also requires that link purpose be determinable. ([Google for Developers][4])

---

## 5. Enrich for publish quality

Before review, complete all required enrichment.

### Metadata

Set and verify:

* title
* description
* canonical behavior
* Open Graph/Twitter share data as applicable
* index/noindex posture
* author and date data where relevant

### Structured data

Use structured data only when it matches visible page content.

For eligible article-like content, Article or BlogPosting markup can help search engines understand article pages. Breadcrumb markup can help users and search engines understand hierarchy. Google’s structured data guidance also requires that marked-up content be visible on the page and follow general structured-data policies. ([Google for Developers][5])

Default guidance:

* use article markup for real article/resource pages
* use breadcrumb markup when the page visibly participates in site hierarchy
* do not add speculative markup for features the page does not actually support

### Publication dates

If the page surfaces a published or updated date, keep it truthful and consistent.

Google can use date information for search presentation when useful, but date signals should be clear and not misleading. ([Google for Developers][6])

Default rule:

* `publishedAt` reflects first public release
* `updatedAt` changes only for meaningful editorial updates
* do not refresh dates for trivial typo fixes just to look fresh

### Images

Google’s current image guidance emphasizes discoverable HTML images, supported formats, image sitemaps where relevant, optimized speed/quality, and strong landing pages. ([Google for Developers][7])

Default rule:

* use real page-relevant images
* give informative alt text when the image adds meaning
* do not ship giant unoptimized images
* ensure each important image appears on a meaningful landing page, not as an orphan asset

---

## 6. Review in preview

All meaningful content changes should be reviewed in preview before production.

Review for:

* copy correctness
* formatting
* heading structure
* responsive behavior
* metadata
* canonical/noindex correctness
* internal links
* CTA behavior
* forms touched by the page
* image rendering
* download links
* structured data alignment with visible page content

Publishing without preview is not standard practice.

---

## 7. Validate before merge

Minimum validation for publishable content:

* content parses cleanly
* schema validation passes
* build succeeds
* target page renders
* no broken internal links in changed areas
* metadata is complete
* required images/assets resolve correctly
* no accidental draft/private content is shipping
* no accidental indexation of preview/demo/private pages
* accessibility smoke pass completed for changed content

The exact validation command set should remain narrow and relevant, but the page must be treated like a real release artifact.

---

## 8. Publish through the normal deploy path

Publishing happens through the standard deployment flow for the app/project.

That means:

* content changes ship via the normal branch/preview/production path
* content does not bypass environment and release controls
* post-publish verification is still required

This keeps publishing aligned with the repo’s deployment-first operational posture.

---

## 9. Verify after publish

After production publish, verify:

* page is reachable on the correct domain
* metadata is correct
* canonical/noindex rules are correct
* forms and downloads work
* key images render
* sitemap inclusion/exclusion is correct
* RSS inclusion is correct if applicable
* analytics/events tied to the page still work
* no obvious runtime or rendering issue exists

A published page is not done just because the deploy finished.

---

## SEO and discoverability rules

### People-first content is non-negotiable

Google’s ranking systems prioritize helpful, reliable content created for people, not content made mainly to game search systems. ([Google for Developers][3])

Operational rule:

* do not publish thin keyword-target pages with weak user value
* do not spin near-duplicate city/service pages without real differentiation
* do not create filler posts just to increase volume

### Use search language naturally in visible page elements

Google recommends using words people would use to look for the content, especially in titles, main headings, alt text, and link text. ([Google for Developers][4])

Operational rule:

* title, H1, description, headings, and internal links should match actual user language
* avoid vague titles like “Thoughts,” “Update,” or “News” when specificity is possible

### Maintain crawlable internal linking

Google recommends crawlable links so search engines can find other pages on the site. ([Google for Developers][4])

Operational rule:

* new content should usually link to at least one relevant existing page
* important hub pages should link to new important content
* do not strand content with no meaningful internal path

### Sitemap behavior

Astro’s official sitemap integration generates sitemap files and requires the site URL to be configured. It also supports filtering and custom pages. ([Astro Documentation][8])

Operational rule:

* indexable published content should normally appear in sitemap output
* noindex, private, or intentionally excluded content should be filtered appropriately
* do not rely on sitemap presence to fix weak internal linking

### RSS behavior

Astro’s official RSS package is the default fit for blogs and other content sites that publish recurring entries. ([Astro Documentation][9])

Operational rule:

* if a site has a true blog/resources stream, support RSS by default unless there is a reason not to
* include only real publishable entries
* exclude drafts and non-feed content types unless intentionally included

---

## Accessibility rules for publishing

### Headings

Use headings to reflect actual structure.

Rules:

* one clear H1 per page
* do not skip heading levels casually
* headings should summarize the section users are about to read

### Links

Link purpose must be clear.

Rules:

* avoid repeated generic link text like “click here” or “learn more” with no context
* CTA links should indicate destination or outcome
* linked images need accessible naming context too

WCAG 2.2 requires that link purpose be determinable from the link text or its context. ([W3C][10])

### Images

Rules:

* informative images need meaningful alt text
* decorative images should not produce noisy redundant alt text
* screenshots/diagrams used as educational content need explanatory treatment

### Downloads

Rules:

* label file type when useful
* avoid unexplained file downloads
* make sure downloadable resources have a meaningful landing context

### Forms embedded in content surfaces

Rules:

* field labels must be clear
* required fields should be obvious
* form purpose should be explicit
* success/failure states must be understandable

WCAG 2.2 includes requirements relevant to input purpose and overall accessible form interaction. ([W3C][11])

---

## Drafts, staging, and time-sensitive content

### Draft handling

Support explicit draft state in the content model where recurring publishing exists.

Rules:

* drafts must not leak into production indexes, feeds, or listings
* draft previews are acceptable
* draft status should be explicit, not inferred from filename conventions alone

### Scheduled content

If scheduled publishing is later introduced, the source of truth must be explicit.

Until then:

* publish by merge/deploy timing
* do not pretend a content item is scheduled if the site cannot enforce it correctly

### Time-sensitive pages

Examples:

* launch announcements
* campaign pages
* event pages
* temporary offers

Rules:

* define expiration or review date at creation time
* decide upfront whether it should be redirected, archived, noindexed, or updated later
* do not leave campaign pages to decay indefinitely

---

## Content refresh, corrections, and retirement

### Refreshing content

Refresh when:

* information is outdated
* examples are stale
* links are broken
* metadata no longer matches intent
* the page should be expanded materially

Meaningful refreshes may justify updating `updatedAt`.
Tiny typo fixes usually do not.

### Correcting content

When fixing factual or substantive errors:

* correct the page promptly
* verify all dependent metadata
* verify any downloadable or embedded assets
* avoid silent contradictions across related pages

### Retiring content

Retire content when it is:

* no longer true
* no longer useful
* replaced by a better page
* tied to an expired campaign or obsolete offer
* causing confusion or cannibalization

Retirement options:

* update in place
* redirect to the best successor page
* keep live but noindex
* archive with clear labeling
* remove completely when appropriate

Do not simply delete useful URLs without considering redirects and internal links.

---

## Content types and minimum standards

### Static marketing pages

Must have:

* clear goal
* strong title/H1
* conversion path
* metadata
* internal links
* current claims only

### Blog/resource articles

Must have:

* article schema eligibility review
* author/date handling
* category/tag handling if used
* RSS inclusion review
* share metadata
* useful intro and real takeaway value

### Lead magnets and downloadable resources

Must have:

* clear landing page
* explicit CTA
* asset verification
* legal/privacy checks if gated
* no broken file references
* measurement plan if used for lead capture

### Legal pages

Must have:

* clear source/owner
* effective date handling
* stable route
* no misleading marketing embellishment

---

## Anti-patterns

### Do not treat content as “not real engineering work”

Bad content publishing creates:

* broken SEO surfaces
* broken metadata
* broken routes
* broken feeds
* broken downloads
* inaccessible pages
* misleading production states

### Do not centralize content into shared packages by default

The repo’s content posture is app-local by default.
Shared packages support systems, not ownership of real site content.  

### Do not go CMS-first without a separate justification

This repo explicitly defers heavy CMS-first architecture by default.
Astro’s local content system is sufficient for the current baseline.  ([Astro Documentation][1])

### Do not publish search-engine-first filler

Google explicitly warns against content created mainly to manipulate rankings. ([Google for Developers][3])

### Do not fake freshness

Do not update dates, “new” labels, or revision signals unless the content meaningfully changed. ([Google for Developers][6])

### Do not add structured data for things the page does not visibly support

Structured data should reflect user-visible reality on the page. ([Google for Developers][12])

### Do not let drafts or private previews leak

Drafts, preview-only pages, and non-indexable content must stay out of public search surfaces, feeds, and production navigation unless intentionally published.

---

## Enterprise and later-stage options

These are valid later, but not canonical now:

* headless CMS adoption for direct client editing
* remote/live Astro content collections for fresh external content
* richer editorial workflows with scheduled publishing and approvals
* multilingual publishing systems
* enterprise DAM-backed media workflows
* editorial dashboards outside the repo

Astro now supports live remote content collections, which makes later remote/editorial models feasible, but that is a later maturity option rather than the default repo posture today. ([Astro Documentation][13])

Adopt these only when repeated operational need justifies them.

---

## Relationship to other docs

Related docs:

* `docs/architecture/public-sites.md`
* `docs/architecture/apps.md`
* `docs/architecture/seo-analytics-observability.md`
* `docs/operations/create-client-site.md`
* `docs/operations/local-development.md`
* `docs/operations/deployment-and-rollbacks.md`
* `docs/operations/forms-and-lead-handling.md`
* `docs/reference/env-matrix.md`
* `docs/reference/commands.md`

---

## Definition of done

Content publishing is being done correctly when:

* content is authored in the correct app-local place
* the content model is explicit and validated
* the page is helpful, accurate, and people-first
* metadata, dates, images, and links are complete
* accessibility basics are satisfied
* preview review happens before production
* production verification happens after publish
* drafts/private pages do not leak
* sitemap and RSS behavior are intentional
* update and retirement behavior are handled deliberately

---

## Final rule

Publish content the same way you want to maintain it later:

* structured
* reviewable
* accessible
* search-legible
* operationally boring
* easy to update
* honest about what it is for

Good publishing is not just writing copy.

It is content modeling, editorial judgment, metadata discipline, preview review, production verification, and long-term maintainability working together.