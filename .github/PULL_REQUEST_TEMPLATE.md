# Pull Request

## Summary

Describe what changed.

<!-- @reviewer if applicable -->

## Why this change exists

Explain the problem, goal, or reason for the change.

## Scope

Select or describe the areas touched:

- [ ] app(s)
- [ ] package(s)
- [ ] docs
- [ ] tests
- [ ] repo config/tooling
- [ ] infra/deployment
- [ ] other: <!-- describe -->

## Validation performed

List the commands you ran and their outcomes.

Typical targeted validation:

```text
pnpm turbo lint --filter=<target>
pnpm turbo typecheck --filter=<target>
pnpm turbo test --filter=<target>
````

Broader validation, if applicable:

```text
pnpm turbo lint
pnpm turbo typecheck
pnpm turbo test
```

### Validation status

Explain any skipped or unavailable validation:

<!-- explain -->

## Documentation updates

* [ ] No documentation update was needed
* [ ] I updated canonical docs in `docs/`
* [ ] I updated local `README.md` and/or `AGENTS.md`
* [ ] I updated thin adapter docs where needed
* [ ] I updated skill docs where procedure changed

### Docs changed

<!-- list paths or explain -->

## UI changes

* [ ] No visible UI changes
* [ ] This PR changes visible UI and includes screenshots
* [ ] This PR changes visible UI but screenshots are not possible; explanation included below

### Screenshots / notes

<!-- attach screenshots or explain -->

## Preview and review

### Preview details

* [ ] No preview needed
* [ ] Preview link included below
* [ ] Preview is private/access-controlled

### Preview link

<!-- add preview URL -->

### Preview type

* [ ] Branch-specific preview (iterative review)
* [ ] Commit-specific preview (fixed approval snapshot)

### Review status

* [ ] Internal code review complete
* [ ] Stakeholder preview review complete
* [ ] Re-review needed after meaningful changes

### Visible changes verification

* [ ] Screenshots included for visible UI changes
* [ ] Stakeholder-visible changes reviewed on preview
* [ ] Preview link reflects current state for approval

## Approval-sensitive changes

Check any that apply:

* [ ] new dependency added
* [ ] dependency version changed
* [ ] new package created
* [ ] new app family introduced
* [ ] new top-level directory added
* [ ] CI/CD, deployment, or infra structure changed
* [ ] auth, tenancy, or database posture changed
* [ ] app-specific UI/composition moved into shared packages
* [ ] new external platform or paid service introduced
* [ ] broad refactor beyond the immediate task

### Approval context

<!-- link approval or explain -->

### Production approval requirements

* [ ] This PR does not require explicit production approval
* [ ] This PR requires explicit approval before production promotion
* [ ] High-risk deployment/infra/auth/env/tenancy posture changed

### Re-review trigger

* [ ] No meaningful changes since last review round
* [ ] Meaningful visible changes made after feedback - re-review required

## Known limitations or deferred follow-up

<!-- List anything intentionally left for later, or remove this section if none. -->

## Related links

<!-- Link related issues, feature docs, or canonical docs. Remove lines that do not apply. -->

* Issue:
* Feature docs:
* Related docs: `docs/operations/preview-review-approval.md`
* Feature packet: `docs/features/preview-review-approval/` (if applicable)

## Final checklist

* [ ] I did not push directly to `main`
* [ ] This PR is scoped to the smallest reasonable change
* [ ] I followed local docs and `AGENTS.md`
* [ ] I did not claim validation I did not run
* [ ] I kept docs aligned with durable behavior changes
* [ ] I used a draft PR if early feedback was needed

```

The main fixes were the unclosed validation code fence, converting the pseudo-bullet sections into real markdown checklists, and restoring proper headings so GitHub renders the template cleanly.
```
