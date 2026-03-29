# repo/docs/operations/create-client-site.md

## Purpose

Define the standard runbook for creating a new real client site in this monorepo.

This document explains when to create a new client-site app, what should be in place before doing so, the default creation workflow, and what “done” looks like. It is an operations runbook, not the architectural source of truth for app boundaries or public-site posture.

---

## When to use this runbook

Use this runbook when:

- a real client site should be added to the repository
- a durable showcase site is being promoted into a real client-site app
- a client site needs to be created from the approved structural template

Do **not** use this runbook for:

- short-lived prospect or demo work that should remain non-permanent
- internal/protected apps
- broad refactors of the client-site template itself

For the architectural model behind client-site apps, see [`../architecture/apps.md`](../architecture/apps.md) and [`../architecture/public-sites.md`](../architecture/public-sites.md).

---

## Preconditions

Before creating a new client site, confirm all of the following:

- the work is a real client site, not temporary prospect work
- the site should exist as a separate app under `apps/sites/clients/`
- the client/site slug is approved
- the default app-per-client model is still the right fit
- any dependency additions or version changes have been approved if needed
- there is enough information to establish initial site identity, structure, and ownership

At minimum, have:

- approved client slug
- working site name
- initial page scope
- initial brand direction or placeholder direction
- known deployment expectation
- initial domain/DNS expectation if available

---

## Default location

Real client sites live at: