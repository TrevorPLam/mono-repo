# repo/docs/operations/forms-and-lead-handling.md

Status: Active  
Date: 2026-03-25

## Purpose

Define the canonical workflow for building, securing, operating, measuring, and following up on public-site forms and lead capture in this monorepo.

This runbook exists to keep form handling:

- operationally useful
- secure against common abuse
- accessible
- aligned with the repo’s public-site posture
- compatible with future CRM or booking evolution without forcing those systems too early

This is an operations runbook.  
It explains how forms and lead handling should be done correctly.  
It does not replace architecture docs or package constitutions.

---

## Scope

This runbook applies to:

- contact forms
- lead magnet / download forms
- newsletter or resource signup forms
- quote / inquiry / project intake forms
- discovery / qualification forms
- booking-adjacent intake forms on public sites
- form-triggered email notifications
- durable lead persistence when justified
- lead and conversion instrumentation
- anti-spam / anti-abuse controls
- operational follow-up and failure handling

This runbook is primarily for public sites.  
Protected internal apps may later add more complex workflows, but they do not change the baseline for ordinary public-site forms. :contentReference[oaicite:4]{index=4}

---

## Canonical posture

### 1. Forms are server-side submission flows, not loose client-only widgets

Public-site forms should use a structured server-side submission boundary. The repo’s public-site posture explicitly sets the default as server-side handling, email delivery for operational usefulness, and database persistence only when the workflow truly benefits from durable storage. :contentReference[oaicite:5]{index=5}

### 2. Email-first is the default operational path; durable storage is conditional

The baseline is not “every form writes to a database.”  
The baseline is:

- notify the operator quickly
- persist only when the form workflow benefits from durable storage
- avoid forcing product-app complexity onto ordinary public sites

That follows the repo’s public-site and DB-optional posture. :contentReference[oaicite:6]{index=6}

### 3. Forms stay app-owned

Apps own their actual form surfaces, field choices, post-submit UX, measurement choices, and operational context. Shared packages can provide contracts, analytics foundations, observability, or low-level form primitives, but app-level form and lead behavior should not be centralized just for convenience. :contentReference[oaicite:7]{index=7}

### 4. Browser UX matters, but the server is the trust boundary

Use browser-side hints and validation to improve completion rate, but do not trust them as the final gate. OWASP recommends validating input on the server, and MDN documents `autocomplete` as the correct way to guide browsers and autofill behavior for supported fields. :contentReference[oaicite:8]{index=8}

### 5. Accessibility is part of form operations, not optional polish

W3C continues to recommend WCAG 2.2 as the current accessibility target, and its forms guidance stresses correctly associated labels, instructions, validation, and usable feedback. :contentReference[oaicite:9]{index=9}

### 6. Abuse prevention is layered

Do not rely on a single anti-spam trick.  
Cloudflare Turnstile requires server-side token validation, and OWASP guidance supports layered controls such as validation, CSRF protection, and rate limiting for state-changing endpoints. :contentReference[oaicite:10]{index=10}

---

## Form classes

Use one of these classes per form.

### A. Simple contact / inquiry

Examples:

- contact page
- “request a quote”
- “ask a question”
- project inquiry

Default handling:

- server-side validation
- anti-abuse protection
- operator notification email
- optional durable storage if follow-up discipline or attribution requires it

### B. Lead magnet / resource capture

Examples:

- checklist download
- guide/template download
- gated article/resource

Default handling:

- server-side validation
- anti-abuse protection
- clear consent handling where follow-up email is involved
- delivery path for the asset or access link
- durable storage usually justified because this is a real lead funnel

### C. Newsletter / ongoing updates

Default handling:

- server-side validation
- anti-abuse protection
- explicit subscription intent
- integration with the selected mailing system when one exists
- suppression / unsubscribe handling belongs to the email platform, not custom app logic

### D. Discovery / qualification

Examples:

- project brief
- discovery request
- “is this a fit?” intake

Default handling:

- server-side validation
- anti-abuse protection
- durable storage usually justified
- operator notification
- optional routing by service, client profile, urgency, or source

### E. Booking-adjacent intake

If a form is pre-booking or booking intake, it should align with the repo’s booking/intake contract direction rather than inventing a parallel ad hoc schema. The contracts canon already reserves booking intake as a normalized boundary domain and analytics already reserves `form_viewed`, `form_submitted`, and `lead_submitted` event families. :contentReference[oaicite:11]{index=11}

---

## Choose the smallest truthful flow

Before building a form, decide:

- what user action it represents
- what the operator needs to do next
- whether this is just a notification flow or a true lead record flow
- whether the submission needs durable state
- whether the submission needs attribution data
- whether the flow should trigger only email, only storage, or both
- whether this is a generic lead or a domain-specific intake

Do not build a heavyweight lead system when a lightweight operator notification flow is enough.  
Do not build a throwaway email-only flow when follow-up discipline, attribution, or routing clearly requires durable storage.

---

## Default architecture

### Submission boundary

The canonical baseline is:

1. browser submits to a server-side endpoint or action
2. server validates and normalizes input
3. server verifies anti-abuse signals
4. server performs allowed side effects
5. server returns a safe success/failure response
6. operator notifications, storage writes, and analytics happen from that server boundary

This matches the repo’s public-site form posture and analytics ownership model. :contentReference[oaicite:12]{index=12} :contentReference[oaicite:13]{index=13}

### Astro implementation note

For Astro apps, Astro’s current docs recommend Actions over raw API endpoints for many form flows because Actions provide type-safe server functions, HTML form integration, and Zod-backed validation. That does **not** make Actions a repo-wide architecture law, but they are the strongest current default candidate for Astro-based public-site forms when they fit the use case. :contentReference[oaicite:14]{index=14}

### Future Next.js note

If a later protected/internal Next app owns a form flow, keep the same operational rules:

- server-side submission boundary
- shared contracts where justified
- explicit validation
- app-owned orchestration
- no client-only trust

The framework can change; the runbook does not.

---

## Field design rules

### Collect only what the flow truly needs

Prefer the minimum field set that still supports the next operational step.

For many public-site forms, the default useful minimum is:

- name
- email
- brief message or intent
- optional context field only if it materially improves routing

Add more fields only when they clearly improve triage, qualification, or downstream handling.

### Use browser semantics correctly

Use proper HTML input types and `autocomplete` hints where they fit. MDN documents `autocomplete` as the standard mechanism for telling the browser what kind of information is expected, and it applies to form controls such as text inputs, textareas, selects, and forms. :contentReference[oaicite:15]{index=15}

Examples:

- `autocomplete="name"`
- `autocomplete="email"`
- `autocomplete="tel"`
- `autocomplete="organization"`

These improve completion speed without changing the server trust boundary. :contentReference[oaicite:16]{index=16}

### Accessibility rules

All fields must have clear labels associated with their controls. W3C’s forms tutorial explicitly recommends explicit or implicit label association so assistive technologies and click targets work correctly. Use instructions and error feedback where needed, not placeholder text as the only explanation. :contentReference[oaicite:17]{index=17}

### Avoid hidden ambiguity

Do not use vague field labels like:

- “Info”
- “Details”
- “Business”

Prefer labels that tell both the user and the operator what the field means.

---

## Validation rules

### Server-side validation is mandatory

OWASP’s Input Validation Cheat Sheet remains clear: validate on the server so malformed or unexpected data does not persist or trigger downstream malfunction. Client-side validation is helpful UX, not final enforcement. :contentReference[oaicite:18]{index=18}

### Shared schema rule

Define the submission schema once and reuse it across:

- browser-side validation where helpful
- server-side parsing and normalization
- durable persistence logic
- analytics mapping if needed

This matches the repo’s overall contracts posture and helps prevent drift. The contracts canon is explicitly schema-first and boundary-focused. :contentReference[oaicite:19]{index=19}

### Strictness rule

Reject or deliberately normalize unexpected keys.  
Do not silently accept arbitrary payload expansion.

### Sanitization rule

Validation and sanitization are not the same thing. Validate structure and meaning first; sanitize only where output context requires it. OWASP separates these concerns for good reason. :contentReference[oaicite:20]{index=20}

---

## Anti-abuse and anti-spam stack

### Baseline stack

The default baseline for public-site forms should be layered:

1. server-side validation
2. CSRF protection where the framework does not already provide it
3. anti-bot check
4. lightweight rate limiting on the submission path
5. logging and monitoring for abuse patterns
6. no trust in hidden fields or client-only checks alone

OWASP recommends built-in CSRF protection where available and backend token validation when it is not. Cloudflare recommends server-side Turnstile verification, not client-only checking. Cloudflare also documents rate limiting as a standard defense for abusive endpoints. :contentReference[oaicite:21]{index=21}

### Turnstile default

Cloudflare Turnstile is the preferred default anti-bot fit for public-site forms in this repo’s current operating posture.

Important current facts from Cloudflare:

- Turnstile does not require Cloudflare’s CDN to be used
- every widget has a sitekey and secret key
- server-side Siteverify validation is mandatory
- tokens can be forged if you skip server validation
- tokens expire after 5 minutes
- tokens are single-use

:contentReference[oaicite:22]{index=22}

### Advanced Turnstile options

For higher-abuse scenarios, Cloudflare now documents:

- Ephemeral IDs for stronger abuse/fraud detection across rotating IPs
- Pre-clearance for issuing clearance cookies across protected domains

These are later-stage options, not the default burden for every simple contact form. :contentReference[oaicite:23]{index=23}

### Rate limiting

If a form endpoint starts seeing abuse or is materially business-critical, add rate limiting. Cloudflare documents rate limiting rules as a standard mechanism to protect endpoints from abuse and excessive submission volume. :contentReference[oaicite:24]{index=24}

### Honeypots

A honeypot field can be an additional low-cost signal, but it is not enough by itself. Treat it as additive only.

---

## Storage and delivery decisions

### Email-only flow

Use email-only when:

- the form volume is low
- one person handles follow-up
- long-term attribution or pipeline reporting is not yet required
- the operator mainly needs prompt notification

Email-only still requires:

- validation
- anti-abuse
- reliable sender configuration
- logging
- clear response handling

### Email plus durable storage

Use email plus storage when:

- follow-up discipline matters
- multiple states or routing steps exist
- attribution matters
- duplicate submission handling matters
- the lead should survive missed inbox notifications
- the form is a real funnel asset, not just a contact box

This is the default posture for lead magnets, multi-step qualification, and booking-adjacent intake.

### Storage only

Rare for public sites.  
Use only when the operator workflow is intentionally decoupled from email and another queue/CRM/process already owns response handling.

### DB posture

The repo’s public-site model is DB-optional by default, so durable persistence should be justified per workflow rather than forced into every site. :contentReference[oaicite:25]{index=25}

---

## Email delivery rules

### Operational notification email

If a form sends an operator notification email, the email should be treated as an operational alert, not the sole system of record unless the flow is intentionally email-only.

### Sender authentication

Email deliverability depends on domain authentication. Current Google sender guidance says all senders should set up SPF or DKIM, while bulk senders must set up SPF, DKIM, and DMARC. DMARC builds on SPF and DKIM and adds policy/reporting around the visible author domain. :contentReference[oaicite:26]{index=26}

### Domain verification with modern email APIs

Modern email providers require verified sending domains. Resend’s current docs require SPF and DKIM records to verify a domain, with DMARC recommended for added trust, and they require use of a domain you control. :contentReference[oaicite:27]{index=27}

### Delivery-event reconciliation

If the chosen email provider supports webhooks, use them for mature flows. Resend’s current webhook docs expose delivery, bounce, failure, and delay events; that is the right model for reconciling “we attempted to notify someone” versus “the message actually bounced or failed.” :contentReference[oaicite:28]{index=28}

### Local testing

Use a local SMTP sink or provider sandbox during development so local form testing does not send real external mail. This is an operational recommendation for safe testing, not a requirement to standardize on one mail stack.

---

## Lead record posture

### What a durable lead record should include

If you persist leads, store the smallest useful durable shape, such as:

- lead identifier
- submission timestamp
- form type
- source site/app
- normalized contact data
- normalized message / intent data
- attribution context if captured
- anti-abuse verification result summary
- notification status summary if relevant
- follow-up status

### Keep contracts normalized

Lead records should align to repo-owned contracts where justified:

- analytics event families like `form_viewed`, `form_submitted`, and `lead_submitted`
- attribution DTOs
- any booking intake contracts for booking-adjacent flows

The contracts canon already defines these as repo-owned normalized boundaries. :contentReference[oaicite:29]{index=29}

### Do not store secrets in lead records

Store submission outcome and provider references, not raw secret values, tokens, or verification secrets. That is consistent with the repo’s env and observability posture. :contentReference[oaicite:30]{index=30} :contentReference[oaicite:31]{index=31}

---

## Analytics and attribution

### App-local implementation, shared foundations

Form and lead instrumentation should stay app-local while using shared analytics foundations. The architecture doc is explicit that form and lead instrumentation belongs to app-local implementation choices, even when event discipline is centralized. :contentReference[oaicite:32]{index=32}

### Minimum event model

For real lead forms, the default event family should usually include:

- `form_viewed`
- `form_submitted`
- `lead_submitted` when the submission represents a true lead
- conversion follow-through events later if the workflow becomes richer

The contracts canon already reserves these event families. :contentReference[oaicite:33]{index=33}

### Attribution capture

Capture attribution only when it is operationally useful.  
Examples:

- UTM parameters
- referring page
- landing page path
- campaign click identifiers where justified

The contracts canon already provides attribution DTO direction, so do not invent vendor-native blobs when repo-owned normalized shapes are enough. :contentReference[oaicite:34]{index=34}

### Consent-aware measurement

The repo’s analytics posture says consent-aware instrumentation should be the default where relevant and that privacy-sensitive behavior belongs in deliberate boundaries rather than per-page hacks. Form measurement must follow that posture. :contentReference[oaicite:35]{index=35}

---

## Operator workflow

### Immediate response path

Every meaningful lead form should answer:

- who gets notified
- how fast they are expected to respond
- what counts as the first response
- where the operator sees missed/bounced notifications
- what happens if email delivery fails

Do not stop at “the form submits successfully.”

### Suggested default statuses

If durable storage exists, use a small status vocabulary such as:

- new
- acknowledged
- qualified
- not-a-fit
- archived

Keep it small until a real CRM process exists.

### Duplicate submissions

Decide how duplicates are handled:

- accept and store separately
- detect and flag
- merge only when a real operational rule exists

Do not silently drop real user submissions unless there is a deliberate dedupe policy.

---

## Post-submit UX

### Success response

Show a clear success message that tells the user what happens next.  
Avoid vague responses like “Submitted.”

A useful success state usually includes:

- confirmation that the message/request was received
- what to expect next
- fallback contact route if needed

### Failure response

Return safe, understandable errors.

Separate:

- validation errors the user can fix
- temporary system issues
- abuse-blocked or rejected attempts

Do not leak internals, secret names, provider responses, or stack traces.

### Redirects vs in-place success

Either is acceptable.  
Pick the simpler truthful experience for the site:

- in-place success for light forms
- dedicated thank-you page when attribution, next-step education, or resource delivery warrants it

---

## Accessibility requirements

### Labels

Every control needs a proper label associated with it. W3C’s forms tutorial remains explicit on this point. :contentReference[oaicite:36]{index=36}

### Instructions

Where input expectations are non-obvious, provide instructions outside placeholder text.

### Error identification

Users need understandable validation feedback they can act on. WCAG 2.2 remains the current recommendation for accessibility work, and its form-related guidance covers labels, instructions, and error handling. :contentReference[oaicite:37]{index=37}

### Keyboard and focus behavior

Submission, validation feedback, and success/error states must be usable without a mouse.

### Reduced-friction autofill

Use correct `autocomplete` values where appropriate to reduce friction without weakening validation. :contentReference[oaicite:38]{index=38}

---

## Security and privacy handling

### CSRF

If the chosen framework/path does not give you built-in CSRF protection, add it for state-changing submissions. OWASP explicitly recommends using built-in CSRF protection when the framework provides it, or backend token validation when it does not. :contentReference[oaicite:39]{index=39}

### Logging

Log security-relevant events and operational failures, but keep logs redaction-aware. OWASP’s Logging Cheat Sheet emphasizes application logging for security events, and the repo’s observability posture explicitly requires redaction-aware diagnostics. :contentReference[oaicite:40]{index=40} :contentReference[oaicite:41]{index=41}

Useful log events include:

- validation failure counts
- abuse rejection counts
- Turnstile verification failures
- mail send failures
- webhook delivery/bounce events
- repeated submission spikes
- unexpected schema mismatch

### Do not over-log

Do not log:

- secret values
- full anti-bot tokens
- raw provider credentials
- full message bodies in places that widen exposure unnecessarily
- sensitive internal traces in public error surfaces

### Privacy posture

Collect only what the workflow genuinely needs, and keep consent-sensitive follow-up explicit. The repo already treats privacy and consent as cross-cutting operational constraints rather than casual page-level preferences. :contentReference[oaicite:42]{index=42}

---

## Enterprise and later-stage options

These are valid later-stage paths, but they are not the default for ordinary public-site work in this repo.

### HubSpot

HubSpot’s current docs support creating forms, embedding them on external sites, sharing hosted links, adding conditional logic, and styling embedded forms. That makes HubSpot a strong later option when CRM-native lead ownership matters more than fully repo-owned form handling. :contentReference[oaicite:43]{index=43}

### Salesforce

Salesforce Web-to-Lead remains a standard enterprise option, but Salesforce’s own docs note a 500-leads-per-day limit for Web-to-Lead capture. Use it when the Salesforce lead object is the real system of record, not as a default for every lightweight public-site form. :contentReference[oaicite:44]{index=44}

### Adobe Marketo

Adobe Marketo continues to support embedded Forms 2.0 and a JavaScript Forms API, making it suitable when enterprise marketing automation is already the system of record. :contentReference[oaicite:45]{index=45}

### Repo rule for escalation

Escalate to CRM-native or MA-native forms only when one of these becomes true:

- the CRM/MA platform is now the canonical lead system of record
- routing/scoring/nurture complexity exceeds what the site flow should own
- reporting, compliance, or sales operations require direct platform-native capture
- embed/vendor trade-offs are operationally worth it

Until then, keep the baseline simple, explicit, and app-owned.

---

## Anti-patterns

### Do not trust client-side validation as final enforcement

Server-side validation is mandatory. :contentReference[oaicite:46]{index=46}

### Do not make every public site DB-required just because forms exist

The repo’s public-site posture is DB-optional by default. :contentReference[oaicite:47]{index=47}

### Do not make email the only safety net when missed follow-up matters

Use durable storage when the workflow requires it.

### Do not move app-owned form behavior into shared packages prematurely

Form and lead instrumentation is app-local by design. :contentReference[oaicite:48]{index=48}

### Do not rely on CAPTCHA alone

Use layered defenses: validation, CSRF, anti-bot verification, and rate limiting as needed. :contentReference[oaicite:49]{index=49}

### Do not expose secrets to browser code

Form integrations and credentials stay server-side. :contentReference[oaicite:50]{index=50}

### Do not skip sender authentication on production mail

Deliverability depends on proper SPF/DKIM, and DMARC becomes essential as volume and trust requirements increase. :contentReference[oaicite:51]{index=51}

### Do not let “temporary” CRM bypasses become the real system accidentally

If a CRM or automation platform becomes the real owner, document that explicitly and update the runbook.

---

## Relationship to other docs

Related canonical docs:

- `docs/architecture/public-sites.md`
- `docs/architecture/seo-analytics-observability.md`
- `docs/operations/environment-and-secrets.md`
- `docs/operations/content-publishing.md`
- `docs/operations/deployment-and-rollbacks.md`
- `docs/reference/env-matrix.md`
- `docs/reference/commands.md`

Related package directions:

- `packages/contracts`
- `packages/analytics`
- `packages/observability`
- `packages/env`
- future booking intake surfaces where applicable

---

## Definition of done

A form/lead flow is done correctly when:

- the form has a clear class and purpose
- field scope is minimal and intentional
- accessibility basics are satisfied
- server-side validation is implemented
- anti-abuse protection is layered
- secrets stay server-side
- operator notification works
- durable storage exists when the workflow truly needs it
- analytics and attribution are intentional
- delivery failures and abuse patterns are observable
- post-submit UX is clear
- the implementation fits the public-site baseline instead of forcing product-app complexity

---

## Final rule

A good public-site form is not “just a form.”

It is:

- a server-side submission boundary
- a validated contract
- an accessibility surface
- an abuse target that must be defended
- an operational workflow that must actually notify or persist
- a measurable lead event when the business cares about it

Treat it like a real production flow, because it is.