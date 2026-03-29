# repo/CONTRIBUTING.md

How to contribute changes safely and consistently in this repository.

This is a human contribution workflow document. It covers branch workflow, validation, documentation updates, pull requests, approval-sensitive changes, and review expectations.

---

## Before you start

Read in this order:

1. `README.md`
2. `AGENTS.md`
3. nearest local `README.md`
4. nearest local `AGENTS.md`
5. relevant canonical docs in `docs/`

Do not start implementation until you understand the boundary you are changing.

---

## Working model

- Work in the shared repository using branches.
- Do not push directly to `main`.
- Open a pull request for meaningful changes.
- Use draft PRs early when feedback would help.
- Keep changes as small, reviewable, and reversible as possible.

Branch protection on `main` should enforce this. Until every protection is fully configured, treat no-direct-push-to-`main` as a hard rule.

---

## Branch naming

Use short, descriptive branch names with one of these prefixes:

- `feat/`
- `fix/`
- `docs/`
- `chore/`

Examples:

- `feat/client-site-template-cleanup`
- `fix/seo-canonical-handling`
- `docs/update-agent-tooling-guide`

---

## Commits

Conventional Commits are preferred. Exceptions are acceptable, but commit messages must still be clear, scoped, and reviewable.

Preferred format:

```text
type(scope): short description
````

Examples:

```text
feat(site-firm): add services landing page shell
fix(seo-astro): normalize canonical URL handling
docs(repo): tighten docs taxonomy
chore(ui): clean up package exports
```

---

## Standard contribution flow

1. Confirm the correct boundary for the work.
2. Create a branch.
3. Make the smallest valid change.
4. Run relevant validation.
5. Update docs if the change affects durable behavior; this may happen alongside implementation, not only after.
6. Open a draft or ready PR.
7. Respond to review.
8. Merge only after checks and review expectations are satisfied.

---

## Validation requirements

Validate your work before considering it ready for review.

Start with the narrowest valid command set for the area you changed, then widen if needed.

Typical workspace commands:

```bash
pnpm install
pnpm turbo build
pnpm turbo test
pnpm turbo lint
pnpm turbo typecheck
```

Typical filtered patterns:

```bash
pnpm turbo build --filter=<app-or-package>
pnpm turbo test --filter=<app-or-package>
pnpm turbo lint --filter=<app-or-package>
pnpm turbo typecheck --filter=<app-or-package>
```

### Default validation rule

For targeted changes, run the narrowest relevant checks first:

```bash
pnpm turbo lint --filter=<target>
pnpm turbo typecheck --filter=<target>
pnpm turbo test --filter=<target>
```

Widen validation when the change affects:

* shared packages
* repo-wide config
* multiple apps
* tooling or test infrastructure
* any area with unclear blast radius

Broader validation:

```bash
pnpm turbo lint
pnpm turbo typecheck
pnpm turbo test
```

### Validation expectations

* Do not mark work ready if you skipped relevant validation without saying so.
* Do not claim a command passed if you did not run it.
* If validation cannot be run, say exactly what you could not run and why.
* Do not weaken or remove tests just to get green results unless retiring obsolete tests is part of the task.

---

## Documentation update rules

Documentation must stay aligned with implementation.

Update docs in the same change when you modify a durable:

* boundary
* workflow
* policy
* structure rule
* contributor expectation

### Update order

When documentation changes are needed, update in this order:

1. canonical docs in `docs/`
2. relevant local `README.md` or `AGENTS.md`
3. thin adapter docs only if needed
4. skills only if the procedure changed

Do not update only an adapter doc and leave canonical docs stale.

---

## Pull request expectations

Every meaningful PR should be easy to understand and easy to review.

A pull request template should live at `.github/PULL_REQUEST_TEMPLATE.md`. It should enforce the expected fields at PR creation.

### PR should include

* a clear title
* a concise summary of what changed
* why the change exists
* validation performed
* any known limitations or deferred follow-up
* links to related docs, issues, or feature docs when applicable

### Required for visible UI changes

If a PR changes visible UI, include screenshots.

Examples:

* page layout change
* component styling change
* responsive behavior change
* new section or page
* meaningful content presentation change

If screenshots are not possible, explain why.

### Draft PRs

Draft PRs are encouraged when:

* the approach would benefit from early review
* the work spans multiple files or boundaries
* the final shape is still being refined
* the change has non-trivial blast radius

### Review expectations

PRs are reviewed by the repo owner. Keep PRs small enough to be reviewed in a single session whenever practical.

### Preview, review, and approval

For meaningful changes, especially visible work, the repo uses distinct review lanes:

- **Preview** - a deployable inspection surface for the branch or PR, not implicit production approval
- **Review** - inspection across code, UI, behavior, and stakeholder expectations  
- **Approval** - explicit gate for advancement to production when justified

Key expectations:
- Visible UI/content changes should be reviewed on the live preview and include screenshots in the PR
- Stakeholder review happens on the preview artifact; code review happens in the PR
- Meaningful post-feedback visible changes should trigger re-review rather than relying on stale approval
- Previews should be private or access-controlled by default where supported

For the complete workflow, see [`docs/operations/preview-review-approval.md`](docs/operations/preview-review-approval.md).

---

## Changes that require approval first

Stop and get approval before making any of the following changes:

* adding a new dependency
* changing a dependency version
* creating a new package
* creating a new app family
* adding a new top-level directory
* changing CI/CD, deployment, or infra structure
* changing auth strategy, tenancy model, or database posture
* moving app-specific UI or composition into shared packages
* introducing a new external platform or paid service
* making a broad refactor not required by the task

Approval should happen before implementation, not after a large change is already made.

---

## Dependency and version-change policy

Dependency work is high-impact and requires explicit approval.

This includes:

* adding a new package dependency
* replacing one dependency with another
* changing major, minor, or patch versions
* adding new runtime dependencies
* adding new build, test, lint, or tooling dependencies

When requesting approval, explain:

* what is changing
* why it is needed
* whether it is runtime or dev-only
* likely blast radius
* any simpler alternative considered

---

## Security and secrets

* Never commit secrets, credentials, tokens, or API keys.
* Never place secret values in docs, screenshots, logs, or fixtures.
* Keep client-specific secrets scoped as narrowly as possible.
* Prefer existing repo env patterns over ad hoc secret handling.
* Keep sensitive logic in server-side boundaries where appropriate.

If a task touches secrets, env configuration, auth, or client credentials, proceed carefully and document only non-secret operational details.

---

## Change-size guidance

Prefer small PRs.

Try not to combine unrelated work in one change, especially across:

* repo structure
* shared package internals
* visible site implementation
* content changes
* infra or deployment behavior
* documentation rewrites

Separate structural changes, refactors, and delivery work unless one task truly requires them together.

---

## If you are unsure

When unsure how to proceed:

1. check the nearest local docs
2. check canonical docs in `docs/`
3. choose the more conservative and reversible path
4. ask before making a broad or high-blast-radius change

---

## Final rule

Contribute in a way that keeps the repo understandable, reviewable, and maintainable.

Prefer small changes, explicit reasoning, honest validation, and documentation that stays aligned with reality.

```

The main fixes were the unclosed `text` code fence in the commits section, replacing decorative separators with proper markdown rules, and converting the indented sections into stable markdown headings and lists.

```
