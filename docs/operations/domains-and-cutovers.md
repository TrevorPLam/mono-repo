# repo/docs/operations/domains-and-cutovers.md

Status: Active
Date: 2026-03-25

## Purpose

Define the canonical workflow for attaching domains to deployable apps, planning DNS changes, executing cutovers, verifying SSL and redirects, handling SEO-sensitive domain moves, and preserving clean rollback and handoff paths.

This is an operations runbook. It explains how to perform domain and cutover work correctly in this repo. It does not replace the architecture docs that define app boundaries, deployment posture, or public-site ownership.  

---

## When to use this workflow

Use this workflow when:

* a real client site is being connected to its production domain
* an existing domain is moving onto a Vercel-hosted app in this repo
* an apex or `www` redirect policy is being established
* a subdomain such as `staging.example.com` or `preview.example.com` is being attached intentionally
* a client site is changing domains or hostnames
* a client handoff or ejection requires domain, DNS, or hosting transfer coordination

Do not use this workflow when:

* the work is only an internal preview on a `vercel.app` URL
* no DNS, hostname, redirect, or domain ownership change is involved
* the task is really a deployment rollback with no domain involvement
* the task is really an environment/secrets change
* the task is a registrar-to-registrar ownership transfer with no repo deployment impact

The repo’s docs model treats domains and cutovers as a distinct runbook topic, and the architecture already separates deployment/security posture from day-to-day operational workflows.  

---

## Expected outcome

By the end of this workflow:

* the correct deployable app owns the intended domain on the intended Vercel project
* DNS points to the right target
* SSL is valid
* one canonical production host is chosen
* alternate hosts redirect correctly
* SEO-sensitive domain moves use permanent redirects and appropriate Google site-move handling
* rollback is understood before traffic is moved
* the client’s ownership and transferability posture is preserved
* no unrelated secrets, records, or services were broken during the cutover

---

## Before you start

Read in this order:

1. `../../AGENTS.md`
2. `../../CONTRIBUTING.md`
3. `../architecture/public-sites.md`
4. `../architecture/deployment-security.md`
5. `../reference/env-matrix.md`
6. `./create-client-site.md`
7. `./deployment-and-rollbacks.md`

This runbook assumes the current repo posture:

* public sites are the primary deployable surfaces
* each real client site is its own app
* real deployables should map cleanly to bounded hosting projects
* client-site transferability matters
* client-specific secrets stay narrow in scope
* app-local site configuration remains app-owned rather than hidden in shared infrastructure

Those are already locked across the repo canon.    

---

## Canonical posture

### 1. Client control of the domain is the default

For real client sites, the domain should be controlled by the client or be clearly transferable to them. The deployment architecture should not assume firm-controlled DNS as the default, and the site model is intentionally built to preserve handoff and ejection paths.  

### 2. One deployable app = one hosting boundary

Each real deployable surface should map to a bounded app and a bounded hosting target. For this repo, the default is one Vercel project per deployable app, which keeps domain ownership, rollback blast radius, and secret scope cleaner.  

### 3. One canonical production host

Every production site should have one primary public hostname. If both apex and `www` are attached, one should redirect to the other rather than serving the site independently on both. Vercel’s current docs explicitly recommend configuring a redirect when both are attached, and note that redirecting apex to `www` gives Vercel more control over incoming traffic. ([Vercel][1])

### 4. Domain cutovers split into distinct classes

Treat these as different operational cases:

* **hosting-only cutover**: same public URLs, different hosting
* **domain move**: old hostname to new hostname, with URL changes
* **subdomain addition**: adding `www`, staging, preview, or other bounded hostnames
* **handoff/ejection**: moving ongoing ownership or operational control

Google treats host-only infrastructure changes differently from site moves with URL changes, so the runbook should not blur them. ([Google for Developers][2])

### 5. DNS authority changes are higher-risk than simple record changes

Changing a DNS record and changing nameservers are not the same. Cloudflare’s DNS docs note that TTL controls how long records stay cached, while Vercel’s DNS docs note that nameserver changes can take up to 48 hours to propagate. This means nameserver cutovers should be treated as higher-risk and less reversible than routine A/CNAME updates. ([Cloudflare Docs][3])

### 6. Wildcard needs are an escalation, not a default

If you need wildcard custom domains, Vercel’s current platform docs require using Vercel nameservers so Vercel can manage the DNS challenges for wildcard SSL certificates. That is valid, but it should be a deliberate escalation rather than the baseline for ordinary client-site cutovers. ([Vercel][4])

---

## Standard workflow

### Step 1: Classify the cutover correctly

Before touching DNS or domains, decide which case applies:

* hosting-only cutover with no public URL change
* domain or subdomain move with URL changes
* first-time production domain attachment
* staging/branch subdomain assignment
* client handoff/ejection

Why this matters:

* hosting-only cutovers emphasize DNS, SSL, and rollback
* domain moves add redirect mapping and search implications
* branch/staging domains are optional and should stay bounded
* handoff/ejection emphasizes ownership and transferability first

Google’s current Search guidance distinguishes infrastructure changes from URL-changing site moves, and Vercel distinguishes production domains from domains assigned to other branches or environments. ([Google for Developers][2])

---

### Step 2: Confirm the ownership and authority boundary

Before making any change, identify all of the following:

* who owns the registrar account
* who controls the DNS zone today
* whether DNS is managed at the registrar, Cloudflare, or Vercel
* which Vercel team/project should own the hostname
* whether the client will keep DNS authority outside Vercel
* who has approval authority for the production change

Do not proceed with vague assumptions like “the agency probably has access somewhere.”

Repo-specific rule:

* preserve client control or transferability
* avoid operational setups that make the agency the only realistic future operator
* keep client-specific secrets narrow and project-local

That posture is already canonical.   

---

### Step 3: Decide the canonical production host

Choose exactly one:

* `example.com` as canonical, with `www.example.com` redirecting to it
* `www.example.com` as canonical, with `example.com` redirecting to it

Do not serve both as first-class production hosts.

Vercel’s current domain docs say to configure a redirect if both are attached, and their current redirect guidance notes that redirecting the apex to `www` gives Vercel more control over incoming traffic. ([Vercel][1])

Repo-specific rule:

* treat the canonical production host as app-local site configuration
* keep that choice aligned with the site’s SEO and deployment posture
* do not leave canonical-host behavior implicit

The repo already treats site-local configuration and app-local SEO composition as app responsibilities.  

---

### Step 4: Inventory the current DNS zone before changing anything

Before a real cutover, record the current relevant DNS state:

* apex web records
* `www` records
* redirect-related records if applicable
* TXT verification records
* CAA records
* MX / mail-related records
* any other records that would be affected by nameserver migration

Why this matters:

* Vercel’s domain troubleshooting docs call out missing CAA records as a common SSL problem
* Vercel’s DNS docs also distinguish web records from other records like MX, which still need to be preserved if you change DNS providers or nameservers

Do not treat “website points correctly” as equivalent to “the whole zone is safe.” ([Vercel][5])

---

### Step 5: Prepare the target Vercel project before touching live DNS

Attach the domain to the correct project first.

Vercel’s current CLI flow is:

```bash
vercel link
vercel domains add example.com my-project
vercel domains add www.example.com my-project
```

That is the current baseline Vercel setup flow for custom domains. Use `--force` only when reassigning a domain already attached elsewhere and only when you are certain that is the intended move. ([Vercel][1])

If the domain is environment-specific rather than universally production-bound, Vercel also supports assigning a domain to a specific environment or branch. Use that only when there is a real staging or non-production need. ([Vercel][6])

Repo-specific rule:

* one deployable app should own the live hostname
* do not attach the same real production domain to multiple unrelated projects casually
* keep domain ownership aligned with the bounded app model



---

### Step 6: Pre-generate SSL when zero-downtime matters

If you are migrating an existing live domain onto Vercel and want to reduce cutover risk, pre-generate the certificate before changing DNS. Vercel now supports pre-generating SSL certificates before updating DNS, which is specifically intended to support smoother domain migrations. Vercel also automatically attempts to generate certificates for domains once added, using Let’s Encrypt, after DNS validation succeeds. ([Vercel][7])

Use this especially when:

* the domain already serves real traffic
* downtime intolerance is low
* the client cares about launch smoothness
* the migration window is narrow

---

### Step 7: Lower TTL in advance when you control external DNS

If DNS is managed outside Vercel and the timing matters, lower TTL in advance before the planned cutover window.

Cloudflare’s DNS docs explain that TTL controls how long records stay cached, and lower TTLs let updates reach end users faster. That does not eliminate all propagation uncertainty, but it reduces cache drag for ordinary record changes. ([Cloudflare Docs][3])

Do this only when:

* you control the existing DNS zone
* you know which records will change
* you have enough lead time before the cutover

Do **not** confuse this with nameserver propagation. Vercel’s DNS docs note that nameserver changes can still take up to 48 hours to propagate. ([Vercel][8])

---

### Step 8: Make the correct DNS change for the domain type

Vercel’s current domain docs distinguish by record type:

* apex domain → A record
* subdomain → CNAME record

For wildcard domains, Vercel requires nameserver-based setup. ([Vercel][6])

Operational rule:

* prefer the smallest DNS change that achieves the goal
* do not migrate nameservers unless there is a real reason
* keep existing non-web records intact if nameservers move
* document exactly which records changed

---

### Step 9: Verify DNS and SSL before treating the cutover as done

At minimum, verify:

* the domain resolves to the intended target
* Vercel shows the domain as correctly configured
* the SSL certificate is valid
* the canonical host serves successfully
* the alternate host redirects correctly
* the app is attached to the intended project/environment

Vercel’s troubleshooting docs explicitly recommend checking record configuration and using `dig`, and their SSL docs explain that certificates only become usable once DNS validation succeeds. For pre-generated certificates, Vercel’s documented `curl --resolve ...` flow is useful before the final cutover. ([Vercel][5])

Useful verification commands:

```bash
dig example.com
dig www.example.com
curl https://example.com --resolve example.com:443:76.76.21.21 -I
```

Use the `curl --resolve` approach only when following Vercel’s documented pre-generated certificate flow. ([Vercel][5])

---

### Step 10: Handle SEO-sensitive domain moves correctly

If the public URL is changing, treat this as a real site move.

Google’s current guidance for site moves emphasizes preparing URL mapping and using permanent server-side redirects for moved URLs. Google’s redirect guidance specifically recommends permanent server-side redirects, and says 301 and 308 indicate a permanent move. Google’s Change of Address tool should be used when moving from one domain or subdomain to another, after the move and redirects are already in place. ([Google for Developers][9])

Operational rule:

* map old URL paths to new URL paths deliberately
* use permanent redirects, not temporary ones
* do not leave the old site live without redirects
* do not treat DNS cutover alone as an SEO migration plan

Also update app-local canonical configuration. The repo’s env and SEO posture already assumes explicit site URL inputs and domain-aware canonical handling, especially for Astro surfaces.  

---

### Step 11: Update environment and site-local configuration deliberately

After the domain decision is final, update the app’s site URL configuration and any safe browser-visible public URL configuration that depends on it.

Repo-specific defaults already require explicit app-level URL inputs such as `SITE_URL`, and the env/reference posture says values should stay scoped to the smallest truthful owner.  

Do not widen client-specific domain settings into broad shared repo config for convenience.

---

### Step 12: Verify the production surface after traffic moves

After cutover, verify all of the following on the real public domain:

* homepage loads
* one deep page loads
* canonical host redirect works
* TLS is valid
* robots/sitemap/canonical behavior matches intent
* forms still submit correctly
* analytics and observability wiring are still sane for the production host
* mail-related records still work if nameservers changed

The repo already treats SEO, analytics, and observability as shared foundations assembled app-locally, so this verification belongs at the app surface, not only at infra level. 

If the move involved a full domain change, also verify Search Console property ownership and submit the Change of Address action when appropriate. ([Google Help][10])

---

### Step 13: Know the rollback path before the window closes

Rollback is different depending on what changed:

* **app-only issue** → use the normal deployment rollback path
* **DNS record issue** → restore the prior records if the old system is still live
* **nameserver migration issue** → rollback is slower and higher-friction
* **domain reassignment issue on Vercel** → restore the previous attachment/redirect configuration

Vercel’s current domain docs note that domain assignment is tied to deployments and branch/environment behavior, while nameserver propagation remains slower and external to deployment rollback speed. That is why DNS and nameserver work should be treated as a different rollback class from ordinary code releases. ([Vercel][11])

Operational rule:

* keep the old system intact until the new one is verified
* do not destroy the old redirect or hosting path during the same minute you cut over
* record the exact prior DNS state before changing anything

---

### Step 14: Preserve handoff and ejection readiness

Document the final live state:

* registrar owner
* DNS authority
* canonical host decision
* redirect behavior
* which Vercel project owns the hostname
* whether SSL is platform-managed or enterprise-custom
* what non-web DNS records must be preserved
* who can approve and execute future changes

This repo’s public-site, deployment, and media canon all treat transferability and client handoff as first-class concerns, so domain setup must not become an agency lock-in trap.   

---

## Defaults and decision rules

### Default ownership posture

* client controls the domain or has a clean transfer path
* agency may manage the Vercel project during the relationship
* do not let the agency become the only practical domain operator
* keep domain-specific secrets and project settings narrow in scope

 

### Default hosting posture

* one deployable app maps to one Vercel project
* real production domains belong to bounded app projects
* ordinary public sites do not need multi-tenant domain machinery by default

 

### Default DNS posture

* preserve the current DNS authority unless a real reason justifies changing it
* prefer record updates over nameserver migrations when possible
* use nameserver migration deliberately for cases like wildcard management or centralized DNS handling

Vercel supports both third-party DNS and Vercel nameservers, but wildcard management specifically requires the nameserver path. ([Vercel][12])

### Default redirect posture

* choose one canonical public host
* redirect all alternates to it
* use permanent redirects for true long-term host changes

([Vercel][1])

### Default SEO posture

* treat a hostname change as a real SEO event
* use permanent redirects
* update canonical assumptions
* use Change of Address only for true domain/subdomain moves, not for HTTP→HTTPS alone

Google’s current Change of Address help explicitly says not to use that tool for HTTP→HTTPS moves. ([Google Help][10])

### Default staging posture

* do not create permanent staging domains by habit
* use branch-assigned domains only when a real staging surface is justified
* ordinary preview work can stay on preview URLs unless a custom hostname is operationally useful

Vercel supports assigning domains to Git branches, but that is optional infrastructure, not baseline repo posture. ([Vercel][13])

---

## Validation

For domain and cutover work, validation is operational rather than compile-only.

Use the smallest truthful validation set first:

```bash
dig example.com
dig www.example.com
curl -I https://example.com
curl -I https://www.example.com
```

When using Vercel CLI setup:

```bash
vercel link
vercel domains add example.com my-project
vercel domains add www.example.com my-project
```

When using Vercel’s documented pre-generated certificate flow:

```bash
curl https://example.com --resolve example.com:443:76.76.21.21 -I
```

These are current documented Vercel and DNS verification patterns. ([Vercel][1])

Also verify the app surface itself after the domain resolves:

* key pages render
* redirects behave correctly
* forms still work
* SSL is valid
* robots/sitemap/canonical behavior matches intent

Do not claim validation passed unless you actually performed it. That is already a repo contribution rule. 

---

## Failure and edge cases

### Domain already attached elsewhere

If Vercel says the domain is associated with another account or project, use the documented verification flow first. Vercel’s domain troubleshooting docs note that a domain can only be associated with one personal account or team at a time, and may require TXT-based verification to prove access. ([Vercel][5])

### SSL will not issue

Check:

* correct DNS target
* propagation status
* CAA records
* wildcard/nameserver mismatch

Vercel’s current troubleshooting docs identify missing CAA records and wildcard-without-nameserver setup as common causes. ([Vercel][5])

### Email breaks after nameserver migration

This usually means non-web DNS records were not preserved. Reconcile MX/TXT/mail-related records before treating the domain move as complete. Vercel’s docs explicitly distinguish ordinary web records from MX-style records and warn that DNS configuration must still account for mail services. ([Vercel][5])

### Canonical or indexing state is wrong after cutover

Re-check:

* canonical host selection
* redirect behavior
* site URL env/config
* sitemap output
* noindex / preview logic
* Change of Address applicability

The repo’s SEO system is intentionally domain-aware, so wrong host assumptions should be treated as an app configuration problem, not hand-waved.  

### Nameserver change is still propagating

Do not assume this is instant. Vercel documents that nameserver changes can take up to 48 hours to propagate. Plan around that. ([Vercel][8])

---

## Common mistakes to avoid

Avoid these during domain and cutover work:

* treating registrar ownership, DNS authority, and hosting ownership as the same thing
* serving both apex and `www` without a redirect plan
* moving nameservers when a simple record update would have been enough
* changing DNS before the target Vercel project is ready
* skipping SSL verification
* changing a hostname without a redirect mapping plan
* using temporary redirects for permanent site moves
* assuming DNS propagation equals application readiness
* forgetting non-web DNS records during nameserver migration
* turning a client domain into agency lock-in

These mistakes directly conflict with the repo’s transferability and bounded-deployable posture.  

---

## Later-stage and enterprise options

These are valid when justified, but they are not the default burden for ordinary public-site cutovers.

### 1. Branch-bound staging domains

Vercel supports assigning a domain to a Git branch so that deployments from that branch receive the hostname automatically. This is useful for a true staging subdomain, but it should remain intentional rather than universal. ([Vercel][13])

### 2. Pre-generated certificates for low-risk migrations

Vercel now supports pre-generating SSL certificates before DNS changes, including from the dashboard, specifically to make domain migrations smoother and lower-downtime. ([Vercel][7])

### 3. Domain Connect or zone import

Vercel’s current domain tooling supports Domain Connect and zone import paths to help migrate DNS records from external providers. These are helpful when you have a real need to reduce manual DNS work, but they are optional operational tools, not part of the repo’s baseline architecture. ([Vercel][14])

### 4. Enterprise custom SSL

Vercel’s current SSL docs say Enterprise teams can upload custom SSL certificates. That is a real option for clients with certificate-management requirements, but the default remains platform-managed certificates. ([Vercel][15])

### 5. Infra-as-code domain automation

The repo’s own canonical root direction already anticipates `infra/terraform/modules/vercel-domain/` and related Vercel infra surfaces. That is the right long-term automation direction when domain operations become repetitive enough to justify codification. 

---

## Related docs

* `../architecture/public-sites.md`
* `../architecture/deployment-security.md`
* `../architecture/seo-analytics-observability.md`
* `../reference/env-matrix.md`
* `./create-client-site.md`
* `./environment-and-secrets.md`
* `./deployment-and-rollbacks.md`

---

## Definition of done

This workflow is complete when all of the following are true:

* the correct app/project owns the intended hostname
* DNS points where it should
* SSL is valid
* one canonical production host is chosen
* alternate hosts redirect correctly
* SEO-sensitive moves use permanent redirects and appropriate Google migration handling
* rollback is understood
* the client’s ownership and handoff posture remains intact
* no unrelated DNS/service breakage was introduced

---

## Final rule

A domain cutover is not “just DNS.”

In this repo, it is a coordination point between:

* bounded deployable ownership
* client transferability
* secret scope
* SSL readiness
* redirect correctness
* SEO continuity
* rollback reality

Treat it like a real production workflow, because it is.
