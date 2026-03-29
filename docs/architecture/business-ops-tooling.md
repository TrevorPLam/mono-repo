# repo/docs/architecture/business-ops-tooling.md

Status: Accepted  
Date: 2026-03-25

## Purpose

Define the canonical posture for business-ops tooling decisions that sit **outside the code architecture** of this monorepo.

This document explains:

- which business-ops domains need a system of record
- what the current default tooling posture is
- what should be bought now versus built later
- how external business systems should relate to the repo
- when the business should escalate from lightweight tools to heavier agency or enterprise systems

It is the source of truth for **business-ops tooling posture**, not a runbook for configuring any one vendor.

---

## Decision summary

The current business-ops tooling posture is:

- use a **modular external stack first**, not a custom internal business operating system
- keep one **clear system of record per domain**
- prefer **buy before build** for ordinary business operations
- delay internal software for CRM, billing, proposals, scheduling, client portals, and reporting until repeated operational pain proves the need
- choose tools with a credible path to stronger governance, exportability, and API access, even if the business is still small
- keep external systems connected to the repo through deliberate boundaries rather than allowing them to become hidden backend architecture

This posture is intentionally aligned with the broader repo direction:

- public-site delivery first
- Astro-first for public surfaces
- protected or internal app surfaces only when justified
- canonical docs in `docs/`
- broad business systems and internal platform complexity deferred until real need exists

---

## Why this posture exists

This posture exists to preserve:

- delivery focus on the firm site and real client sites
- low operational drag for a solo or lean operator
- clear source-of-truth ownership by business domain
- a clean future path to internal tooling without prematurely building it
- better transferability, handoff, and replaceability across client work and agency operations
- less tool sprawl, less duplicated data, and less accidental process drift

The goal is not to create the perfect agency tech stack on day one.

The goal is to create a **small, governable, replaceable operating stack** that supports real work now and gives the repo room to grow into richer internal systems later.

---

## Core principles

### 1. Systems of record are explicit

Every important business domain should have one clear source of truth.

A deal should not live partly in email, partly in notes, and partly in a task tool.
A client invoice should not be tracked manually in three places.
A signed agreement should not depend on memory or inbox search.

If a domain matters operationally, its owner system must be named.

### 2. Modular first, all-in-one later

The default posture is a modular stack:

- CRM for pipeline and customer relationship state
- work management for delivery execution
- docs/knowledge for SOPs and internal process
- billing/accounting for revenue and financial state
- automation for glue and notifications

Do not adopt a PSA or all-in-one agency operating system until the real pain is about:

- utilization
- capacity planning
- retainers and forecasting
- margin visibility
- quote-to-cash coordination
- overservicing detection

### 3. Buy before build

The repo should not absorb ordinary business software just because the business can code.

Build only when one or more of these are true:

- the problem is repeated and expensive
- the workflow is core to differentiation
- the external tools force harmful process compromises
- the business now has durable internal operational patterns worth encoding

### 4. No hidden backend in a SaaS tool

A third-party tool may be the operational system of record for a domain.
It should not quietly become the hidden backend for the whole company.

Examples of what to avoid:

- using Notion as a durable transactional database
- using Zapier as the primary logic layer for critical business workflows
- using a task tool as an accidental CRM
- using spreadsheets as the long-term finance or client-delivery system

### 5. Replaceability matters from the start

Chosen tools should have, at minimum:

- practical export paths
- stable URLs and durable records
- role-based access control
- a reasonable API or integration story
- a credible upgrade path as the firm grows

Avoid stacks that are easy to start but painful to leave.

### 6. Governance beats cleverness

A smaller, clearer stack is better than a more impressive but fragmented one.

The preferred stack should minimize:

- duplicate records
- unclear ownership
- hidden automation
- custom one-off workarounds
- AI or automation layers that act without reviewability

### 7. AI should sit near governed context

Use AI features that sit on top of real workspace systems and inherit their permissions, auditability, and context.
Do not build a custom internal agent platform first.
Do not treat generic chat tooling as a system of record.

---

## Business-ops domains and current ownership model

| Domain | What it owns | Current posture | Default owner type |
| --- | --- | --- | --- |
| CRM / pipeline | leads, contacts, deals, stage movement | buy now | dedicated CRM |
| Work management | tasks, projects, recurring delivery work | buy now | work management platform |
| Knowledge / SOPs | internal procedures, meeting notes, working playbooks | buy now | knowledge workspace |
| Files / collaboration | email, calendar, docs, cloud storage | buy now | collaboration suite |
| Agreements | proposals, signatures, executed agreements | buy now | agreement / e-sign tool |
| Billing / payments | invoices, payment collection, recurring billing | buy now | billing platform |
| Accounting | books, reconciliation, accounting truth | defer until needed but likely buy | accounting platform |
| Automation | notifications, handoffs, workflow glue | buy now, lightly | automation tool |
| Reporting / dashboards | monthly client reporting and operational visibility | light now, build later if justified | mixed / later internal |
| Scheduling | meeting booking and lightweight intake | optional, narrow | simple external tool if needed |
| Time tracking / utilization | hours, capacity, profitability inputs | defer until truly needed | later PSA or time tool |

---

## Recommended default stack now

This is the current recommended default stack for the business at its present stage.

### Collaboration backbone

**Google Workspace**

Use as the baseline for:

- email
- calendar
- Drive storage
- shared docs and spreadsheets
- client-facing communication primitives

This is the safest general collaboration backbone and creates the fewest weird operational dependencies.

### CRM / pipeline

**HubSpot** as the default current recommendation.

Use it for:

- lead capture routing
- contact records
- deal pipeline stages
- basic sales notes and follow-up state

Why this wins now:

- it is a real CRM, not a repurposed task board
- it is appropriate early
- it has a credible growth path
- it avoids building a CRM too soon

### Work management

**Asana** as the default current recommendation.

Use it for:

- client onboarding projects
- recurring SEO/content/analytics work
- implementation checklists
- delivery task ownership
- review and approval steps where lightweight workflow is enough

Why this wins now:

- it fits service delivery better than a product-development-first tool
- it is strong enough without forcing PSA complexity yet
- it creates a clean later decision point if the business needs deeper resource and margin management

### Knowledge / SOPs

**Notion** as the default current recommendation.

Use it for:

- SOPs
- internal operating notes
- meeting notes
- process checklists
- working playbooks
- internal reference pages

Important rule:

Notion is the knowledge layer, not the transactional backend.
Durable repo-relevant truth still belongs in `docs/` when it becomes canonical.

### Billing / payments

**Stripe** as the default current recommendation for billing and collection.

Use it for:

- invoices
- payment collection
- recurring billing if needed
- clean client-facing payment flows

### Accounting

**QuickBooks** is the default later addition when bookkeeping and accounting maturity justify it.

Use it once the business needs a real accounting back office rather than just payment collection.

### Agreements / signatures

**Docusign** as the default current recommendation.

Use it for:

- agreements requiring signature
- executed contract storage references
- a clean path from simple e-sign to more serious agreement lifecycle tooling later if ever needed

### Automation / glue

**Zapier** as the default current recommendation.

Use it for:

- simple lead routing
- inbox or Slack notifications
- CRM handoffs
- lightweight internal process glue

Rule:

Keep automations shallow, documented, and reversible.
Do not let automation become the hidden process architecture of the firm.

---

## Recommended system-of-record map

The following map should be treated as the current default:

| Domain | System of record | Notes |
| --- | --- | --- |
| Contacts and deals | HubSpot | CRM owns contact and pipeline truth |
| Project and task execution | Asana | task state should not live primarily in email or chat |
| SOPs and internal working knowledge | Notion | promote durable repo-relevant rules into `docs/` |
| Email and calendar | Google Workspace | operational communication backbone |
| Files and shared documents | Google Drive | do not turn the repo into raw business file storage |
| Signed agreements | Docusign | agreement state should not depend on inbox memory |
| Billing and collections | Stripe | payment truth belongs here, not in notes or task boards |
| Accounting truth | QuickBooks later | add when finance ops require a real accounting system |
| Workflow glue | Zapier | not a source of truth |

---

## What should not be built yet

Do **not** build the following as repo-level internal software right now:

- CRM
- proposal generator
- billing or invoicing system
- accounting system
- scheduling platform
- client portal
- agency dashboard as the primary operating system
- custom agent platform for business operations
- all-in-one internal PSA replacement

These are all valid later possibilities.
They are not current baseline needs.

The business should not pay the complexity cost of internal software before repeated operational need exists.

---

## What is likely to be built later

The most plausible future internal builds are:

### 1. Internal operator app

This is the highest-confidence future internal app.

Trigger conditions:

- multiple internal operational workflows become repetitive
- reporting and delivery status must be seen in one place
- team, contractor, or client coordination outgrows lightweight tooling
- the business has enough durable internal state to justify a protected app

Likely responsibilities:

- internal client overview
- cross-client delivery status
- internal workflow execution surfaces
- selected reporting and ops visibility
- controlled integration views across external systems

### 2. Reporting system

Trigger conditions:

- monthly reporting becomes slow, repetitive, or error-prone
- the business needs a consistent portfolio view across clients
- external analytics systems are insufficient for internal review needs

Likely posture:

- external source systems remain primary for raw platform data
- the internal layer becomes a reporting and orchestration surface, not a reinvention of the source systems

### 3. Content or publishing operations layer

Trigger conditions:

- blog or publishing workflows become repetitive across multiple clients
- editorial coordination needs stronger structure than docs + tasks alone

### 4. Media / asset operations tooling

Trigger conditions:

- asset intake, approvals, optimization, and handoff become repeated friction
- the media pipeline grows beyond simple app-local and Drive-based handling

---

## Decision triggers for heavier tooling

### Move from Asana to a PSA when:

- utilization becomes a weekly management concern
- resourcing and capacity planning matter operationally
- retainers and budgets need tighter project linkage
- margin visibility becomes more important than simple task coordination
- quote-to-project-to-billing flow is causing real friction

At that stage, evaluate **Productive first** and **Scoro second** as the primary PSA candidates.

### Move from Zapier to a heavier automation platform when:

- automations become multi-step and fragile
- operational observability of automations matters
- auditability and admin governance become much more important
- secrets handling and environment separation need stronger control

At that stage:

- evaluate **Make** as the next step up from Zapier
- evaluate **Workato** only when enterprise-grade integration governance is truly warranted

### Move from HubSpot to a heavier CRM platform when:

- CRM becomes a genuine enterprise process platform need
- multiple operators, approvals, custom process layers, or internal platform integrations make the current CRM posture limiting

At that stage, evaluate **Salesforce** deliberately, not by default.

### Move from Docusign eSignature to broader agreement lifecycle tooling when:

- signature is no longer the hard part
- approvals, repository behavior, searchability, and lifecycle controls become the hard part

---

## Tools that are good but not the current default

### Pipedrive

Good when a lighter, more sales-only CRM posture is preferred.
Not the current default because the broader growth path is weaker than the current HubSpot recommendation.

### ClickUp

Good when a more all-in-one work surface is desired.
Not the current default because it increases the risk of one tool quietly becoming tasks + docs + CRM-lite all at once.

### Linear

Excellent product-development tooling.
Not the right default business-ops spine for the current stage of this firm.
It is more likely to matter later for internal product/software work than for day-one service delivery operations.

### PandaDoc

Good when proposal generation, approval, signature, and payment need to feel more tightly bundled.
Not the current default because the business does not yet need proposal workflow sophistication to dictate the whole agreement stack.

---

## Security and governance posture for business tools

The chosen business-ops stack should follow these rules:

### Client systems are client-owned where practical

For client-facing operational systems, prefer a posture where the client owns the core long-lived system and the agency is granted role-based access rather than permanent sole ownership.

### Least privilege by default

Use the narrowest truthful access model possible.
Do not grant admin rights casually.
Do not let one shared login become the agency norm.

### MFA and role-based access

Every serious business-ops system should support:

- MFA
- separate user accounts
- role-based permissions
- practical offboarding

### Narrow secret scope

Client-specific credentials, tokens, and secrets should remain narrowly scoped and server-side where appropriate.
Do not normalize broad secret sharing just because the team is small.

### Auditability beats convenience

Prefer tools and process designs that make it possible to answer:

- who changed this
- who approved this
- where this record lives
- how this automation fired
- how this account can be handed off or revoked

---

## AI and automation posture

The business should treat AI as an acceleration layer, not a system of record.

### Allowed posture

- AI summarization inside real workspaces
- AI drafting inside CRM, docs, or work tools where governance is acceptable
- AI-assisted search and synthesis across approved systems
- lightweight automation for internal routing and reminders

### Disallowed default posture

- custom internal agent platform as baseline business infrastructure
- uncontrolled agent actions across billing, agreements, or client systems
- silent automations with no owner, no logs, and no rollback path
- giving one tool de facto authority over multiple operational domains without explicit approval

---

## Relationship to the repo

This document is about business systems outside the code architecture, but it still constrains repo decisions.

### The repo should not become the business-ops backend by accident

Do not create internal apps just because a workflow exists.
Create them only when the workflow is important enough, repeated enough, and stable enough to justify software ownership.

### External systems should integrate through clear boundaries

When the repo eventually integrates with CRM, billing, analytics, or other business systems:

- credentials should have clear ownership
- system-of-record boundaries should remain explicit
- the repo should consume approved interfaces, not ad hoc exports and copy-paste processes forever
- one integration should not trigger speculative internal-platform buildout

### New paid tools are a governed decision

Introducing a new external platform or paid service is an approval-sensitive change in the repo’s operating model and should be documented as such.

---

## Practical adoption order

Use this order unless a clear business reason justifies deviation.

### Phase 1: small managed-core stack

Adopt now:

- Google Workspace
- HubSpot
- Asana
- Notion
- Stripe
- Docusign
- Zapier

This is the current recommended operating baseline.

### Phase 2: finance and ops maturity

Add when justified:

- QuickBooks
- a lightweight scheduling tool if truly needed
- more formal client reporting workflows
- more deliberate asset and publishing operations

### Phase 3: agency-scale operations

Evaluate only when pain is real:

- Productive or Scoro
- Make or Workato
- internal operator app
- internal reporting system
- deeper agreement lifecycle tooling
- heavier CRM or enterprise integration platforms

---

## Rules for revisiting this document

Revisit this document when one or more of the following becomes true:

- the business adds recurring team members or contractors
- more than a handful of real clients are active at once
- monthly reporting becomes a major time sink
- capacity planning, utilization, or profitability become active management problems
- the firm adopts a true protected internal app
- the business chooses a real accounting system of record
- the business chooses a PSA or enterprise automation platform
- the business changes its default client ownership or handoff posture

If one of those happens, update this document first, then update any related operations runbooks, local docs, or adapter docs that depend on it.

---

## Non-goals

This document does not:

- prescribe exact vendor configuration steps
- define CRM pipeline stage names in detail
- define onboarding task templates in detail
- define invoicing policy or accounting method
- define reporting templates
- define a client communication policy in full
- replace future runbooks for onboarding, reporting, agreements, or billing

Those can be added later as operations docs if this posture hardens into repeated workflows.

---

## Related docs

- `docs/architecture/overview.md`
- `docs/architecture/repo-shape.md`
- `docs/architecture/public-sites.md`
- `docs/architecture/data-auth-integrations.md`
- `docs/architecture/deployment-security.md`
- `docs/reference/env-matrix.md`
- `docs/operations/create-client-site.md`

