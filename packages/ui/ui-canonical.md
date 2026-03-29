# repo/ui/ui-canonical.md

packages/ui — final source of truth

This is the canonical plan for @repo/ui in this monorepo.

It is synchronized with the broader project decisions already established across the repo:
	•	the repo is a pnpm + Turborepo monorepo
	•	internal runtime packages are compiled-first
	•	Astro is for public/content-heavy web surfaces
	•	Next.js is for app/product surfaces
	•	styling is design tokens → Style Dictionary → vanilla-extract → app-edge Tailwind v4
	•	@repo/design-tokens is the single visual source of truth
	•	authorization, data access, analytics, observability, integrations, and server logic stay outside UI
	•	Storybook 9 + Vitest addon + a11y addon + Chromatic is the shared component review/testing surface
	•	future mobile stays separate from web UI
	•	strict package boundaries are mandatory because the repo is built heavily through agentic coding

This document is the final answer to:

What is packages/ui, what belongs in it, what does not belong in it, how is it structured, how is it built, how is it consumed, and what does every file do?

⸻

1. Canonical identity

packages/ui is the shared React UI system package for the monorepo.

It provides:
	•	reusable low-level UI primitives
	•	reusable design-system components
	•	reusable structural patterns
	•	shared UI-only hooks
	•	minimal shared UI infrastructure providers
	•	token-aligned styling glue
	•	Storybook stories for all stable shared surfaces
	•	package-local UI behavior/accessibility tests

It does not provide:
	•	app features
	•	product workflows
	•	business/domain components
	•	data fetching
	•	auth/session logic
	•	server-only code
	•	route-aware logic
	•	analytics side effects
	•	integration logic
	•	React Native or Expo UI
	•	universal UI for every framework in the repo

This package answers one question:

What React UI building blocks are shared enough to standardize across the web apps, and how are they implemented without leaking product logic?

⸻

2. Hard decisions

2.1 Framework scope

@repo/ui is a React web package.

It is primarily for:
	•	Next.js app/product surfaces
	•	React islands embedded inside Astro only when interactive shared UI is actually needed

It is not:
	•	the universal UI layer for all Astro templates
	•	a web-and-native shared component system
	•	a framework-neutral presentation abstraction

Implications:
	•	Astro surfaces default to .astro components for static/public UI
	•	@repo/ui is used in Astro only for true React islands or shared interactive widgets
	•	future Expo/mobile must not consume this package directly as though it were a cross-platform UI kit

⸻

2.2 Dependency graph role

@repo/ui sits:
	•	above @repo/design-tokens
	•	below the apps
	•	beside, not inside, other shared runtime packages

It may depend on:
	•	React / React DOM
	•	@repo/design-tokens
	•	vanilla-extract
	•	narrowly chosen accessibility/primitive libraries
	•	tiny helper utilities if clearly justified

It must not depend on:
	•	any app
	•	@repo/db
	•	@repo/auth
	•	@repo/analytics
	•	@repo/observability
	•	@repo/integrations-core
	•	server-only modules
	•	mobile-specific packages
	•	feature/business packages

@repo/contracts is allowed only very sparingly, and only for truly generic display-safe types if absolutely necessary.

⸻

2.3 Compiled-first package rule

packages/ui is a compiled-first internal runtime package.

It ships:
	•	ESM
	•	type declarations
	•	a clean public export map
	•	preserved module boundaries where useful
	•	preserved "use client" directives for client entrypoints

It does not ship:
	•	stories
	•	tests
	•	Storybook config
	•	app-specific code
	•	source-only internals that consumers must deep-import

Consumers must import only through curated public entrypoints.

⸻

2.4 Styling implementation rule

Shared UI internals are authored with vanilla-extract, not Tailwind-authored class strings.

Tailwind v4 still matters in the repo, but its job is:
	•	app-edge composition
	•	local page/layout utility usage in apps
	•	app-specific composition around shared components

Inside @repo/ui:
	•	use style, styleVariants, recipe, and a very small optional sprinkles surface
	•	consume tokens from @repo/design-tokens
	•	do not create a second token system
	•	do not rely on consuming apps to scan package source for class names
	•	do not hardcode a parallel visual language inside the UI package

⸻

2.5 Token and theme rule

@repo/design-tokens is the single visual source of truth.

@repo/ui may define:
	•	a theme contract bridge
	•	shared style recipes
	•	shared focus/layer/motion helpers
	•	optional runtime theming helpers if truly needed

@repo/ui may not define:
	•	a competing token source
	•	app-specific themes
	•	a heavy mandatory runtime theming system

Runtime theming is the exception, not the default.

⸻

2.6 Primitive foundation policy

Foundation order is:
	1.	semantic HTML
	2.	package-local composition/styling helpers
	3.	Radix Primitives when accessibility/interaction complexity justifies it

Radix is appropriate for:
	•	dialog/modal
	•	drawer
	•	dropdown menu
	•	tabs
	•	accordion
	•	tooltip
	•	toast
	•	switch
	•	some checkbox/radio patterns if needed

Do not mix multiple primitive ecosystems casually.

Advanced widget escalation goes elsewhere and later.

⸻

2.7 Server/client boundary policy

This package must be explicit about React Server Component boundaries.

Rules:
	•	purely presentational surfaces stay server-safe where possible
	•	client-only hooks and providers live in clearly client-only entrypoints
	•	interactive component families that require browser behavior get their own client-marked family entrypoints
	•	broad barrels must not accidentally turn the whole package client-side

Practical implications:
	•	root @repo/ui stays server-safe
	•	@repo/ui/primitives stays server-safe
	•	@repo/ui/components exports only server-safe component families
	•	interactive component families are imported from family subpaths
	•	@repo/ui/hooks is client-only
	•	@repo/ui/providers is client-only

⸻

2.8 Testing contract

Storybook is the primary shared component development and review surface.

Rules:
	•	every stable public shared component must have a story
	•	foundations stories are part of the package contract
	•	package tests focus on accessibility, interaction, keyboard behavior, controlled/uncontrolled behavior, and composition contracts
	•	Chromatic handles visual baselines
	•	Storybook-driven test flows are preferred for shared UI behavior when practical
	•	brittle style snapshots are discouraged

⸻

2.9 Pattern rule

patterns/ is allowed, but tightly constrained.

A pattern belongs here only when it is:
	•	structural
	•	presentational
	•	reusable across multiple apps
	•	composed through slots/children rather than business logic

Patterns must not become:
	•	feature flows
	•	business components
	•	route-aware screen scaffolds
	•	app-specific dashboards
	•	permission-aware shells

⸻

2.10 Mobile separation rule

Do not shape @repo/ui around future native/mobile reuse.

This package is for web React.

If mobile arrives later:
	•	share tokens, schemas, contracts, logic where appropriate
	•	do not force web UI components into native
	•	do not use packages/ui as a pseudo cross-platform abstraction

⸻

3. What belongs here vs what stays out

Belongs in @repo/ui
	•	layout primitives
	•	typography primitives
	•	basic form/control primitives
	•	display helpers
	•	reusable presentational components
	•	reusable structural patterns
	•	shared UI-only hooks
	•	minimal toast/theme providers
	•	UI styling bridge to tokens
	•	stories and targeted tests

Must stay in apps
	•	feature components
	•	screens/pages
	•	route-aware wrappers
	•	app-specific shells
	•	server actions
	•	DAL-aware forms
	•	auth-aware components
	•	analytics-aware components
	•	domain-specific badges, tables, panels, dashboards, wizards

Explicitly deferred from v1
	•	combobox/autocomplete
	•	date picker
	•	command palette
	•	virtualization
	•	rich data grid
	•	drag and drop
	•	advanced animation system
	•	charting components
	•	form orchestration framework
	•	React Hook Form bindings
	•	business workflows in disguise

⸻

4. Public API strategy

4.1 Allowed public entrypoints

These are the canonical public package entrypoints:

@repo/ui
@repo/ui/primitives
@repo/ui/components
@repo/ui/components/card
@repo/ui/components/badge
@repo/ui/components/alert
@repo/ui/components/avatar
@repo/ui/components/breadcrumb
@repo/ui/components/pagination
@repo/ui/components/table
@repo/ui/components/empty-state
@repo/ui/components/skeleton
@repo/ui/components/form-field
@repo/ui/components/modal
@repo/ui/components/drawer
@repo/ui/components/dropdown-menu
@repo/ui/components/tabs
@repo/ui/components/accordion
@repo/ui/components/tooltip
@repo/ui/components/toast
@repo/ui/patterns
@repo/ui/hooks
@repo/ui/styles
@repo/ui/providers

4.2 Root export rule

@repo/ui root exports only server-safe, common, stable surfaces.

It must not export client-only hooks or providers.

It should export:
	•	selected primitives
	•	selected server-safe components
	•	selected structural patterns
	•	selected style helpers if appropriate

It should not export:
	•	hooks
	•	providers
	•	interactive overlay families that would force the root barrel client-side

4.3 Components barrel rule

@repo/ui/components exports only server-safe component families.

It does not export:
	•	modal
	•	drawer
	•	dropdown-menu
	•	tabs
	•	accordion
	•	tooltip
	•	toast

Those must be imported from family subpaths.

4.4 Forbidden imports

Never allow:

@repo/ui/src/...
@repo/ui/internal/...
@repo/ui/components/card/card
@repo/ui/components/modal/modal

Deep imports into implementation files are forbidden.

⸻

5. Final directory shape

packages/ui/
├─ package.json
├─ tsconfig.json
├─ tsup.config.ts
├─ vitest.config.ts
├─ README.md
├─ src/
│  ├─ index.ts
│  ├─ primitives/
│  │  ├─ index.ts
│  │  ├─ box.tsx
│  │  ├─ box.css.ts
│  │  ├─ stack.tsx
│  │  ├─ stack.css.ts
│  │  ├─ inline.tsx
│  │  ├─ inline.css.ts
│  │  ├─ text.tsx
│  │  ├─ text.css.ts
│  │  ├─ heading.tsx
│  │  ├─ heading.css.ts
│  │  ├─ button.tsx
│  │  ├─ button.css.ts
│  │  ├─ link.tsx
│  │  ├─ link.css.ts
│  │  ├─ input.tsx
│  │  ├─ input.css.ts
│  │  ├─ textarea.tsx
│  │  ├─ textarea.css.ts
│  │  ├─ select.tsx
│  │  ├─ select.css.ts
│  │  ├─ checkbox.tsx
│  │  ├─ checkbox.css.ts
│  │  ├─ radio-group.tsx
│  │  ├─ radio-group.css.ts
│  │  ├─ switch.tsx
│  │  ├─ switch.css.ts
│  │  ├─ label.tsx
│  │  ├─ label.css.ts
│  │  ├─ icon.tsx
│  │  ├─ icon.css.ts
│  │  ├─ image.tsx
│  │  ├─ image.css.ts
│  │  ├─ separator.tsx
│  │  ├─ separator.css.ts
│  │  ├─ spinner.tsx
│  │  ├─ spinner.css.ts
│  │  └─ visually-hidden.tsx
│  ├─ components/
│  │  ├─ index.ts
│  │  ├─ card/
│  │  │  ├─ index.ts
│  │  │  ├─ card.tsx
│  │  │  ├─ card-header.tsx
│  │  │  ├─ card-content.tsx
│  │  │  ├─ card-footer.tsx
│  │  │  └─ card.css.ts
│  │  ├─ badge/
│  │  │  ├─ index.ts
│  │  │  ├─ badge.tsx
│  │  │  └─ badge.css.ts
│  │  ├─ alert/
│  │  │  ├─ index.ts
│  │  │  ├─ alert.tsx
│  │  │  └─ alert.css.ts
│  │  ├─ avatar/
│  │  │  ├─ index.ts
│  │  │  ├─ avatar.tsx
│  │  │  └─ avatar.css.ts
│  │  ├─ breadcrumb/
│  │  │  ├─ index.ts
│  │  │  ├─ breadcrumb.tsx
│  │  │  └─ breadcrumb.css.ts
│  │  ├─ pagination/
│  │  │  ├─ index.ts
│  │  │  ├─ pagination.tsx
│  │  │  └─ pagination.css.ts
│  │  ├─ table/
│  │  │  ├─ index.ts
│  │  │  ├─ table.tsx
│  │  │  ├─ data-table-shell.tsx
│  │  │  └─ table.css.ts
│  │  ├─ empty-state/
│  │  │  ├─ index.ts
│  │  │  ├─ empty-state.tsx
│  │  │  └─ empty-state.css.ts
│  │  ├─ skeleton/
│  │  │  ├─ index.ts
│  │  │  ├─ skeleton.tsx
│  │  │  └─ skeleton.css.ts
│  │  ├─ form-field/
│  │  │  ├─ index.ts
│  │  │  ├─ form-field.tsx
│  │  │  ├─ field-error.tsx
│  │  │  ├─ field-hint.tsx
│  │  │  ├─ field-group.tsx
│  │  │  └─ form-field.css.ts
│  │  ├─ modal/
│  │  │  ├─ index.ts
│  │  │  ├─ modal.tsx
│  │  │  ├─ modal-header.tsx
│  │  │  ├─ modal-body.tsx
│  │  │  ├─ modal-footer.tsx
│  │  │  └─ modal.css.ts
│  │  ├─ drawer/
│  │  │  ├─ index.ts
│  │  │  ├─ drawer.tsx
│  │  │  └─ drawer.css.ts
│  │  ├─ dropdown-menu/
│  │  │  ├─ index.ts
│  │  │  ├─ dropdown-menu.tsx
│  │  │  └─ dropdown-menu.css.ts
│  │  ├─ tabs/
│  │  │  ├─ index.ts
│  │  │  ├─ tabs.tsx
│  │  │  └─ tabs.css.ts
│  │  ├─ accordion/
│  │  │  ├─ index.ts
│  │  │  ├─ accordion.tsx
│  │  │  └─ accordion.css.ts
│  │  ├─ tooltip/
│  │  │  ├─ index.ts
│  │  │  ├─ tooltip.tsx
│  │  │  └─ tooltip.css.ts
│  │  └─ toast/
│  │     ├─ index.ts
│  │     ├─ toast.tsx
│  │     └─ toast.css.ts
│  ├─ patterns/
│  │  ├─ index.ts
│  │  ├─ page-header.tsx
│  │  ├─ page-header.css.ts
│  │  ├─ section-header.tsx
│  │  ├─ section-header.css.ts
│  │  ├─ filter-bar.tsx
│  │  ├─ filter-bar.css.ts
│  │  ├─ stat-grid.tsx
│  │  ├─ stat-grid.css.ts
│  │  ├─ search-input.tsx
│  │  ├─ search-input.css.ts
│  │  ├─ settings-section.tsx
│  │  ├─ settings-section.css.ts
│  │  ├─ auth-shell.tsx
│  │  ├─ auth-shell.css.ts
│  │  ├─ dashboard-shell.tsx
│  │  ├─ dashboard-shell.css.ts
│  │  ├─ split-panel.tsx
│  │  └─ split-panel.css.ts
│  ├─ hooks/
│  │  ├─ index.ts
│  │  ├─ use-controllable-state.ts
│  │  ├─ use-media-query.ts
│  │  ├─ use-reduced-motion.ts
│  │  ├─ use-click-outside.ts
│  │  └─ use-focus-trap.ts
│  ├─ providers/
│  │  ├─ index.ts
│  │  ├─ toast-provider.tsx
│  │  └─ theme-provider.tsx
│  ├─ styles/
│  │  ├─ index.ts
│  │  ├─ tokens.ts
│  │  ├─ theme-contract.css.ts
│  │  ├─ themes.css.ts
│  │  ├─ sprinkles.css.ts
│  │  ├─ atoms.ts
│  │  ├─ recipes.css.ts
│  │  ├─ focus.css.ts
│  │  ├─ layers.css.ts
│  │  ├─ transitions.css.ts
│  │  ├─ reset.css.ts
│  │  └─ utilities.ts
│  ├─ types/
│  │  ├─ polymorphic.ts
│  │  ├─ common-props.ts
│  │  ├─ component-variants.ts
│  │  └─ states.ts
│  ├─ internal/
│  │  ├─ classnames.ts
│  │  ├─ slots.ts
│  │  ├─ data-attributes.ts
│  │  ├─ a11y.ts
│  │  ├─ refs.ts
│  │  ├─ dom.ts
│  │  └─ warnings.ts
│  └─ test-utils/
│     ├─ render.tsx
│     ├─ axe.ts
│     ├─ storybook.ts
│     └─ user-event.ts
├─ stories/
│  ├─ foundations/
│  │  ├─ colors.stories.tsx
│  │  ├─ typography.stories.tsx
│  │  ├─ spacing.stories.tsx
│  │  ├─ radius.stories.tsx
│  │  ├─ elevation.stories.tsx
│  │  ├─ motion.stories.tsx
│  │  └─ themes.stories.tsx
│  ├─ primitives/
│  │  ├─ box.stories.tsx
│  │  ├─ stack.stories.tsx
│  │  ├─ inline.stories.tsx
│  │  ├─ text.stories.tsx
│  │  ├─ heading.stories.tsx
│  │  ├─ button.stories.tsx
│  │  ├─ link.stories.tsx
│  │  ├─ input.stories.tsx
│  │  ├─ textarea.stories.tsx
│  │  ├─ select.stories.tsx
│  │  ├─ checkbox.stories.tsx
│  │  ├─ radio-group.stories.tsx
│  │  ├─ switch.stories.tsx
│  │  ├─ label.stories.tsx
│  │  ├─ icon.stories.tsx
│  │  ├─ image.stories.tsx
│  │  ├─ separator.stories.tsx
│  │  ├─ spinner.stories.tsx
│  │  └─ visually-hidden.stories.tsx
│  ├─ components/
│  │  ├─ card.stories.tsx
│  │  ├─ badge.stories.tsx
│  │  ├─ alert.stories.tsx
│  │  ├─ avatar.stories.tsx
│  │  ├─ breadcrumb.stories.tsx
│  │  ├─ pagination.stories.tsx
│  │  ├─ table.stories.tsx
│  │  ├─ empty-state.stories.tsx
│  │  ├─ skeleton.stories.tsx
│  │  ├─ form-field.stories.tsx
│  │  ├─ modal.stories.tsx
│  │  ├─ drawer.stories.tsx
│  │  ├─ dropdown-menu.stories.tsx
│  │  ├─ tabs.stories.tsx
│  │  ├─ accordion.stories.tsx
│  │  ├─ tooltip.stories.tsx
│  │  └─ toast.stories.tsx
│  └─ patterns/
│     ├─ page-header.stories.tsx
│     ├─ section-header.stories.tsx
│     ├─ filter-bar.stories.tsx
│     ├─ stat-grid.stories.tsx
│     ├─ search-input.stories.tsx
│     ├─ settings-section.stories.tsx
│     ├─ auth-shell.stories.tsx
│     ├─ dashboard-shell.stories.tsx
│     └─ split-panel.stories.tsx
├─ test/
│  ├─ setup/
│  │  └─ vitest.setup.ts
│  ├─ primitives/
│  │  ├─ button.test.tsx
│  │  ├─ input.test.tsx
│  │  ├─ checkbox.test.tsx
│  │  ├─ radio-group.test.tsx
│  │  └─ switch.test.tsx
│  ├─ components/
│  │  ├─ modal.test.tsx
│  │  ├─ dropdown-menu.test.tsx
│  │  ├─ tabs.test.tsx
│  │  ├─ accordion.test.tsx
│  │  ├─ tooltip.test.tsx
│  │  ├─ toast.test.tsx
│  │  └─ form-field.test.tsx
│  ├─ patterns/
│  │  ├─ dashboard-shell.test.tsx
│  │  └─ search-input.test.tsx
│  └─ hooks/
│     ├─ use-controllable-state.test.ts
│     ├─ use-click-outside.test.ts
│     └─ use-focus-trap.test.ts
└─ .storybook/
   ├─ main.ts
   ├─ preview.ts
   └─ manager.ts


⸻

6. Top-level files

package.json

This defines the package identity, exports, scripts, and dependency boundaries.

It must:
	•	name the package @repo/ui
	•	mark it as a workspace package
	•	define the compiled output entrypoints
	•	define the public export map
	•	define types
	•	define build/typecheck/test/storybook scripts
	•	separate runtime dependencies from dev tooling
	•	keep runtime dependencies intentionally small

It must not:
	•	expose source file deep paths
	•	blur dev dependencies into runtime dependencies
	•	quietly absorb large feature dependencies

Expected scripts:
	•	build
	•	clean
	•	typecheck
	•	test
	•	test:watch
	•	storybook
	•	build-storybook

Export map intent:
	•	root
	•	primitives
	•	components
	•	patterns
	•	hooks
	•	styles
	•	providers
	•	explicit component-family subpaths

Important build rule:
	•	family subpaths for client-only interactive components must resolve to family entrypoints that preserve "use client"

⸻

tsconfig.json

This applies the repo’s strict TypeScript baseline to the package.

It must:
	•	enable strictness
	•	support React JSX
	•	align with compiled declaration output
	•	keep typing readable and maintainable

It must not:
	•	encourage excessive type gymnastics
	•	introduce package-local TS conventions that differ from the repo

⸻

tsup.config.ts

This defines the compiled output.

It must:
	•	emit ESM
	•	emit type declarations
	•	exclude stories/tests/Storybook files
	•	preserve client directives
	•	preserve clean entry structure
	•	compile like a runtime package, not an app

It must not:
	•	bundle Storybook
	•	bundle tests
	•	erase "use client" on interactive family entrypoints

⸻

vitest.config.ts

This defines package-local test behavior.

It exists because packages/ui is one of the most test-critical runtime packages in the repo.

It should:
	•	point to test/setup/vitest.setup.ts
	•	use jsdom/browser-appropriate config for component testing
	•	keep scope package-local
	•	integrate with the repo testing baseline cleanly

⸻

README.md

This is one of the highest-value anti-drift files in the repo.

It must explain:
	•	package purpose
	•	what belongs here
	•	what must stay in apps
	•	framework scope
	•	public entrypoints
	•	client/server boundary rules
	•	styling rules
	•	token rules
	•	dependency rules
	•	story/test expectations
	•	component admission criteria
	•	examples of good and bad additions
	•	deferred/non-goal widgets

This README should be blunt, practical, and written for agentic implementers.

⸻

7. src/ overview

src/index.ts

This is the conservative root export.

It must export only server-safe common surfaces.

It should usually export:
	•	common primitives
	•	selected server-safe components
	•	selected server-safe patterns
	•	selected style helpers if necessary

It must not export:
	•	hooks
	•	providers
	•	interactive overlay families
	•	anything that would force the root entrypoint client-side

⸻

8. src/primitives/

This is the foundation layer.

Primitive rules:
	•	token-aligned
	•	semantic HTML first
	•	narrow props
	•	presentational
	•	accessible
	•	no business logic
	•	no routing assumptions
	•	no server-only behavior
	•	minimal abstraction

primitives/index.ts

Curated public barrel for all primitives.

This stays server-safe.

⸻

Layout primitives

box.tsx
The lowest-level layout wrapper.

It provides a consistent structural container abstraction and may support limited semantic element override.

It must not become an all-purpose styling escape hatch.

box.css.ts
Base layout styles and any shared structural reset decisions for Box.

⸻

stack.tsx
Vertical composition primitive for spacing, alignment, and ordered layout.

This standardizes vertical spacing patterns without requiring app-local ad hoc wrappers.

stack.css.ts
Token-driven gap/alignment recipes for Stack.

⸻

inline.tsx
Horizontal composition primitive for inline/flex arrangements, wrapping, spacing, and alignment.

inline.css.ts
Token-driven horizontal spacing and alignment styles for Inline.

⸻

Typography primitives

text.tsx
Shared text primitive for semantic and visual text variants.

It should support consistent tone/size/weight handling without becoming a full typography engine.

text.css.ts
Token-aligned text styles and semantic display variants.

⸻

heading.tsx
Heading primitive with semantic heading levels and controlled visual variants.

Semantic level and visual appearance should be related but not overcomplicated.

heading.css.ts
Heading scale, weight, and spacing recipes.

⸻

Form/control primitives

button.tsx
Shared button primitive.

It may support:
	•	variant
	•	tone
	•	size
	•	disabled
	•	loading
	•	icon slot

It must not become a giant do-everything prop matrix.

button.css.ts
Button recipes, state styles, and focus behavior.

⸻

link.tsx
Shared presentational link primitive.

It must remain UI-only and must not wrap framework routers directly.

Framework-specific routing wrappers stay in apps.

link.css.ts
Link tone, underline, hover, and focus styles.

⸻

input.tsx
Shared text input primitive.

This is a presentational input wrapper, not a form framework.

input.css.ts
Text input states: default, focus, invalid, disabled, readOnly.

⸻

textarea.tsx
Shared textarea primitive.

textarea.css.ts
Textarea sizing and state styles.

⸻

select.tsx
Basic select primitive.

This is the native/basic select surface in v1.

It is not a custom combobox.

select.css.ts
Select layout and state styles.

⸻

checkbox.tsx
Shared checkbox primitive.

This may use semantic native input plus styled indicator, or Radix if needed for consistency.

checkbox.css.ts
Checkbox state styles and indicator visuals.

⸻

radio-group.tsx
Shared radio group primitive.

It centralizes grouped labeling and selection semantics.

radio-group.css.ts
Radio indicator/group spacing and state styles.

⸻

switch.tsx
Shared switch/toggle primitive.

Radix is acceptable here if it simplifies accessibility and state handling.

switch.css.ts
Switch track/thumb/state styles.

⸻

label.tsx
Shared label primitive.

It should encourage correct input association and help normalize label styling.

label.css.ts
Label spacing, tone, and state styles.

⸻

Display helpers

icon.tsx
Thin icon wrapper surface.

Important rule: the package does not become an SVG icon warehouse.

icon.tsx defines a rendering contract, sizing behavior, and alignment semantics.

icon.css.ts
Icon size and alignment helpers.

⸻

image.tsx
Presentational image wrapper.

It must not assume Next image optimization or framework-specific behavior.

Framework-specific image adapters stay outside this package.

image.css.ts
Image border radius/object-fit/display helpers.

⸻

separator.tsx
Shared divider/separator primitive.

separator.css.ts
Horizontal/vertical separator styling.

⸻

spinner.tsx
Shared loading spinner primitive.

spinner.css.ts
Spinner size and motion styles.

⸻

visually-hidden.tsx
Screen-reader-only visibility helper.

This is a foundational accessibility utility and does not need a paired .css.ts file.

⸻

9. src/components/

These are reusable design-system components composed from primitives.

Component rules:
	•	reusable across multiple apps
	•	presentational
	•	accessibility-centralized where needed
	•	no app logic
	•	no route logic
	•	no analytics
	•	no auth awareness
	•	no data orchestration

components/index.ts

This is the server-safe components barrel.

It exports only server-safe families:
	•	card
	•	badge
	•	alert
	•	avatar
	•	breadcrumb
	•	pagination
	•	table
	•	empty-state
	•	skeleton
	•	form-field

It must not export client-only families.

⸻

card/

card/index.ts
Family barrel for the card surface.

card/card.tsx
Root card container.

card/card-header.tsx
Structured header slot.

card/card-content.tsx
Main content region.

card/card-footer.tsx
Footer/action region.

card/card.css.ts
Card surface styles: border, radius, padding, elevation, spacing.

Card remains generic and structural.

⸻

badge/

badge/index.ts
Family barrel.

badge/badge.tsx
Small presentational badge surface.

This may represent generic tones or variants, but must not encode business statuses directly.

badge/badge.css.ts
Badge tone, size, and shape styles.

⸻

alert/

alert/index.ts
Family barrel.

alert/alert.tsx
Shared alert/status surface for generic informational, success, warning, and error messaging.

alert/alert.css.ts
Alert layout and tone variants.

⸻

avatar/

avatar/index.ts
Family barrel.

avatar/avatar.tsx
Shared avatar display with fallback handling.

avatar/avatar.css.ts
Avatar size, shape, and fallback alignment styles.

⸻

breadcrumb/

breadcrumb/index.ts
Family barrel.

breadcrumb/breadcrumb.tsx
Presentational breadcrumb surface.

It must remain route-agnostic.

breadcrumb/breadcrumb.css.ts
Breadcrumb spacing and separator styles.

⸻

pagination/

pagination/index.ts
Family barrel.

pagination/pagination.tsx
Structural pagination control.

It must not handle data loading or routing internally.

pagination/pagination.css.ts
Pagination layout, item sizing, active/disabled state styles.

⸻

table/

table/index.ts
Family barrel.

table/table.tsx
Simple presentational table surface.

It must not implement sorting, filtering, virtualization, or data logic.

table/data-table-shell.tsx
Structural shell for more complex app tables.

Allowed responsibilities:
	•	toolbar slot
	•	loading slot/region
	•	empty state slot
	•	footer/pagination slot

Forbidden responsibilities:
	•	data fetching
	•	server coordination
	•	app-specific filtering logic
	•	column schema engines

table/table.css.ts
Table spacing, borders, header/body/cell styles.

⸻

empty-state/

empty-state/index.ts
Family barrel.

empty-state/empty-state.tsx
Generic empty-state presentation surface.

empty-state/empty-state.css.ts
Layout, spacing, tone, and optional icon region styles.

⸻

skeleton/

skeleton/index.ts
Family barrel.

skeleton/skeleton.tsx
Shared loading placeholder primitive.

skeleton/skeleton.css.ts
Animation and shape styles.

⸻

form-field/

form-field/index.ts
Family barrel.

This remains server-safe because it is purely structural/presentational.

form-field/form-field.tsx
Field wrapper surface for label/control/hint/error structure.

form-field/field-error.tsx
Error text region.

form-field/field-hint.tsx
Hint/help text region.

form-field/field-group.tsx
Group wrapper for related controls.

form-field/form-field.css.ts
Field spacing and text layout rules.

Critical rule: this family is not tied to React Hook Form or any validation framework.

⸻

Interactive component families

These families are public, but they are imported through family subpaths, not @repo/ui/components.

Their index.ts files are the public entrypoints and must preserve "use client".

⸻

modal/

modal/index.ts
Client-marked family entrypoint.

modal/modal.tsx
Root dialog/modal surface.

This is likely built on Radix Dialog.

modal/modal-header.tsx
Header slot.

modal/modal-body.tsx
Body region.

modal/modal-footer.tsx
Footer/action region.

modal/modal.css.ts
Overlay, panel, spacing, focus, motion, and layer styles.

Modal remains structural. No business flow logic.

⸻

drawer/

drawer/index.ts
Client-marked family entrypoint.

drawer/drawer.tsx
Edge panel overlay surface.

Likely built from dialog primitives.

drawer/drawer.css.ts
Drawer positioning and transition styles.

⸻

dropdown-menu/

dropdown-menu/index.ts
Client-marked family entrypoint.

dropdown-menu/dropdown-menu.tsx
Shared dropdown menu surface and composition primitives.

Likely based on Radix Dropdown Menu.

dropdown-menu/dropdown-menu.css.ts
Menu surface, item state, spacing, focus, and layering styles.

⸻

tabs/

tabs/index.ts
Client-marked family entrypoint.

tabs/tabs.tsx
Shared tabset surface.

Likely based on Radix Tabs.

tabs/tabs.css.ts
Tab trigger/content layout and state styles.

⸻

accordion/

accordion/index.ts
Client-marked family entrypoint.

accordion/accordion.tsx
Shared accordion surface.

accordion/accordion.css.ts
Accordion trigger/content/open-state styles.

⸻

tooltip/

tooltip/index.ts
Client-marked family entrypoint.

tooltip/tooltip.tsx
Accessible tooltip surface.

Tooltips are for hints, not feature logic.

tooltip/tooltip.css.ts
Tooltip bubble, motion, arrow, and layer styles.

⸻

toast/

toast/index.ts
Client-marked family entrypoint.

toast/toast.tsx
Toast presentation surface.

The state/queue mechanism lives in toast-provider.

toast/toast.css.ts
Toast layout, tone, and motion styles.

⸻

10. src/patterns/

Patterns are reusable structural compositions only.

All patterns should stay server-safe unless a future revision proves otherwise.

patterns/index.ts

Curated public barrel for pattern components.

⸻

page-header.tsx

Structural page heading region.

Allowed:
	•	title
	•	subtitle
	•	eyebrow
	•	action slot

Forbidden:
	•	route logic
	•	page data logic

page-header.css.ts

Spacing, alignment, and responsive layout for page headers.

⸻

section-header.tsx

Structural section heading wrapper.

section-header.css.ts

Section spacing and action-slot alignment.

⸻

filter-bar.tsx

Structural wrapper for filter/search/action controls.

Important: this does not implement filtering behavior.

filter-bar.css.ts

Responsive arrangement and spacing styles.

⸻

stat-grid.tsx

Structural grid for presentational metrics/stats.

Important: this is layout only, not analytics semantics.

stat-grid.css.ts

Grid and spacing styles.

⸻

search-input.tsx

Structural search-input pattern composed from primitives.

Important: no search orchestration.

search-input.css.ts

Icon, spacing, and layout styling for the pattern.

⸻

settings-section.tsx

Structural wrapper for settings/preferences sections.

settings-section.css.ts

Spacing, grouping, and header/content layout.

⸻

auth-shell.tsx

Structural wrapper for auth-like screens.

Allowed:
	•	centered container
	•	content card
	•	artwork/aside slot
	•	header/body/footer slots

Forbidden:
	•	auth provider logic
	•	redirect/session logic
	•	app-specific auth workflow rules

auth-shell.css.ts

Responsive shell layout and spacing.

⸻

dashboard-shell.tsx

Structural dashboard layout only.

Allowed:
	•	header slot
	•	sidebar slot
	•	content slot
	•	optional aside slot

Forbidden:
	•	navigation state
	•	tenant logic
	•	permission logic
	•	route logic

dashboard-shell.css.ts

Shell layout, spacing, and responsive breakpoint styles.

⸻

split-panel.tsx

Structural two-panel layout surface.

It may support simple orientation and sizing props, but not workspace/business behavior.

split-panel.css.ts

Panel layout and divider spacing styles.

⸻

11. src/hooks/

This folder stays deliberately small.

All hooks here are UI-only and client-only.

hooks/index.ts

Client-marked public barrel for package hooks.

It exports only reusable UI behavior hooks.

⸻

use-controllable-state.ts

Controlled/uncontrolled state helper for reusable components.

⸻

use-media-query.ts

Client-only media query hook for responsive behavior.

Must be UI-scoped, not app-state-scoped.

⸻

use-reduced-motion.ts

Hook for user reduced-motion preference.

Used to support accessibility-aware interactions.

⸻

use-click-outside.ts

DOM interaction hook for overlays and popovers.

⸻

use-focus-trap.ts

Focus trapping helper for modal/drawer-like surfaces if needed.

⸻

12. src/providers/

This folder stays tiny and client-only.

providers/index.ts

Client-marked public barrel.

Exports only shared UI infrastructure providers.

⸻

toast-provider.tsx

Queue/state/provider infrastructure for toast presentation.

This is UI infrastructure only.

⸻

theme-provider.tsx

Minimal runtime theme provider only if runtime theme switching is actually needed.

This must stay lightweight and optional.

⸻

13. src/styles/

This folder contains the styling glue layer for the package.

styles/index.ts

Curated public style exports.

This should export only intentionally public style helpers.

⸻

tokens.ts

Thin adapter/bridge from @repo/design-tokens.

This must never become a second token source of truth.

⸻

theme-contract.css.ts

Defines the vanilla-extract theme contract used by the package.

This exists so themes and styling stay aligned with tokens without coupling every style to one concrete theme class.

⸻

themes.css.ts

Concrete shared theme implementations, if needed.

This should stay minimal.

⸻

sprinkles.css.ts

Tiny constrained sprinkles surface, only if justified.

It must stay small and token-aligned.

⸻

atoms.ts

Thin optional convenience layer over sprinkles and shared style composition.

This is allowed only as a light ergonomic layer, not a second styling framework.

⸻

recipes.css.ts

Shared reusable component recipes and variant patterns.

⸻

focus.css.ts

Shared focus-ring and focus-visible styling helpers.

This is important enough to deserve a dedicated file because consistent focus behavior is a package-level accessibility contract.

⸻

layers.css.ts

Shared z-index/layering helpers.

All overlay layers should come from tokens/helpers, not ad hoc magic numbers inside components.

⸻

transitions.css.ts

Shared motion/transition helpers aligned with tokenized motion values.

⸻

reset.css.ts

Optional package-level baseline/reset styles.

This is opt-in and intentionally imported where needed, especially Storybook preview.

It must not silently change app behavior.

⸻

utilities.ts

Very small styling helper utilities only.

It must not become a giant misc bucket.

⸻

14. src/types/

These are package-local type helpers.

This folder is internal by default and not a public entrypoint.

polymorphic.ts

Minimal type helpers for leaf polymorphism where justified.

Important rule: keep this understandable. Do not build a type maze.

⸻

common-props.ts

Shared prop shapes such as children, className, asChild if deliberately supported.

⸻

component-variants.ts

Shared variant unions and package-level vocabulary for things like size/tone/intent where centralization helps.

⸻

states.ts

Shared UI state types such as disabled, invalid, loading, readOnly.

⸻

15. src/internal/

Private implementation helpers. Never publicly exported.

classnames.ts

Small class/value composition helper if needed.

slots.ts

Slot composition helpers for structured components.

data-attributes.ts

Helpers for consistent data-* state attributes.

a11y.ts

Accessibility-specific helpers for IDs, aria wiring, and semantics.

refs.ts

Ref composition helpers.

dom.ts

Small DOM utilities for UI internals only.

warnings.ts

Development-time warnings for misuse of package APIs if useful.

This folder must stay boring, small, and private.

⸻

16. src/test-utils/

Package-local testing helpers.

render.tsx

Shared render wrapper for component tests.

axe.ts

Accessibility assertion helper.

storybook.ts

Helpers that make story-driven test usage easier.

user-event.ts

Shared setup/wrapper for Testing Library user-event.

This folder is package-local only. It is not a cross-repo testing utility package.

⸻

17. stories/

Storybook is the primary visual and behavioral review surface.

stories/foundations/

These make the design system legible to humans and agents.

colors.stories.tsx
Shows semantic color usage.

typography.stories.tsx
Shows type scale and semantic text usage.

spacing.stories.tsx
Shows spacing tokens and layout spacing rhythm.

radius.stories.tsx
Shows corner radius usage.

elevation.stories.tsx
Shows surface/elevation styles.

motion.stories.tsx
Shows motion values and transition usage.

themes.stories.tsx
Shows theme application examples.

⸻

stories/primitives/

Each primitive story should demonstrate:
	•	default state
	•	major variants
	•	disabled/error/loading states if applicable
	•	composition examples
	•	accessibility-relevant behavior where useful

All primitive story files listed in the directory map are required.

⸻

stories/components/

Each component story should demonstrate:
	•	default usage
	•	major variants
	•	long/empty/edge cases
	•	structural composition
	•	interaction behavior where applicable

Interactive families must get meaningful stories, not just one trivial example.

⸻

stories/patterns/

Each pattern story should demonstrate:
	•	structural intent
	•	slot usage
	•	responsive behavior
	•	examples of proper composition
	•	where the pattern stops and app logic begins

Patterns must be shown as structure, not as fake feature flows.

⸻

18. test/

Tests are targeted and high-value.

test/setup/vitest.setup.ts

Package test setup.

Used for:
	•	jest-dom style setup
	•	any shared test environment initialization
	•	consistent package-local behavior

⸻

test/primitives/

These tests validate critical primitive behavior.

button.test.tsx
Keyboard, disabled/loading, accessibility semantics.

input.test.tsx
Labeling, invalid/disabled semantics, basic interaction behavior.

checkbox.test.tsx
Accessible association and checked behavior.

radio-group.test.tsx
Grouped semantics and keyboard behavior.

switch.test.tsx
Accessible checked/toggle behavior.

⸻

test/components/

These tests focus on the hardest shared component interactions.

modal.test.tsx
Focus management, close behavior, labeling, keyboard handling.

dropdown-menu.test.tsx
Trigger/menu interaction and keyboard navigation.

tabs.test.tsx
Selection semantics and keyboard behavior.

accordion.test.tsx
Expansion/collapse and accessible structure.

tooltip.test.tsx
Accessible trigger/content behavior.

toast.test.tsx
Presentation and provider/state interaction sanity.

form-field.test.tsx
Structural accessibility relationships between label, hint, error, and control.

⸻

test/patterns/

These validate structural contracts, not business behavior.

dashboard-shell.test.tsx
Slot rendering and structural layout expectations.

search-input.test.tsx
Presentational search input composition sanity.

⸻

test/hooks/

These validate UI hook correctness.

use-controllable-state.test.ts
Controlled/uncontrolled behavior consistency.

use-click-outside.test.ts
Outside interaction correctness and cleanup.

use-focus-trap.test.ts
Focus containment correctness and cleanup.

⸻

19. .storybook/

main.ts

Storybook package config.

This should align with the repo’s Storybook 9 direction and the chosen builder setup.

⸻

preview.ts

Global decorators, theme handling, optional reset import, and a11y config.

⸻

manager.ts

Storybook UI configuration only.

Keep it package-scoped and small.

⸻

20. Naming, implementation, and coding rules

File naming

Use:
	•	kebab-case for filenames
	•	*.tsx for components
	•	*.css.ts for vanilla-extract files
	•	index.ts only for intentional folder barrels

Do not invent alternate naming patterns.

⸻

Component family rule

Any public family with multiple related pieces must use a folder.

Example:

card/
├─ index.ts
├─ card.tsx
├─ card-header.tsx
├─ card-content.tsx
├─ card-footer.tsx
└─ card.css.ts

This makes structure obvious to humans and agents.

⸻

One style file per family rule

Each public component family should usually have a single primary *.css.ts file.

Do not scatter styles across many micro files without a strong reason.

⸻

Ref and composition rule

Leaf components must be:
	•	ref-friendly
	•	prop-spreading where composition requires it
	•	understandable

Support ecosystem composition, but do not let the package devolve into polymorphic type tricks.

⸻

Variant rule

Variant vocabularies must stay:
	•	small
	•	consistent
	•	semantically named
	•	token-aligned

Avoid giant overlapping prop matrices.

⸻

Accessibility rule

Shared UI is responsible for:
	•	keyboard usability
	•	correct roles/labels
	•	visible focus treatment
	•	semantic defaults
	•	reduced-motion awareness where relevant
	•	proper disabled/invalid/readOnly semantics

Accessibility is not optional polish. It is part of the package contract.

⸻

21. Dependency policy

Allowed runtime dependencies
	•	react
	•	react-dom
	•	@repo/design-tokens
	•	vanilla-extract packages
	•	Radix packages when justified
	•	tiny helper utilities if truly needed

Avoid by default
	•	charting libraries
	•	rich data-table frameworks
	•	form orchestration frameworks
	•	animation frameworks
	•	business SDKs
	•	app/router packages
	•	Next-specific runtime helpers inside shared primitives

⸻

22. What must not exist in this directory

These are drift signals and are forbidden:

packages/ui/src/features/
packages/ui/src/business/
packages/ui/src/booking/
packages/ui/src/admin/
packages/ui/src/client-specific/
packages/ui/src/data/
packages/ui/src/api/
packages/ui/src/services/
packages/ui/src/server/
packages/ui/src/utils/misc.ts

Also forbidden:
	•	domain-specific components
	•	route-specific wrappers
	•	app-specific dashboards
	•	auth-aware shells with logic
	•	analytics-aware panels
	•	DAL-aware forms
	•	feature workflows disguised as patterns

⸻

23. Build order

Phase 1 — scaffold

Create:
	•	top-level config files
	•	export map
	•	README
	•	source folders
	•	Storybook config
	•	Vitest config and setup

Phase 2 — styling foundation

Implement:
	•	token bridge
	•	theme contract
	•	themes if needed
	•	focus/layer/transition helpers
	•	optional sprinkles
	•	reset

Phase 3 — primitives

Implement:
	•	layout primitives
	•	typography primitives
	•	form/control primitives
	•	display helpers

Phase 4 — server-safe components

Implement:
	•	card
	•	badge
	•	alert
	•	avatar
	•	breadcrumb
	•	pagination
	•	table
	•	empty-state
	•	skeleton
	•	form-field

Phase 5 — interactive families

Implement:
	•	modal
	•	drawer
	•	dropdown-menu
	•	tabs
	•	accordion
	•	tooltip
	•	toast

Phase 6 — patterns

Implement:
	•	page header
	•	section header
	•	filter bar
	•	stat grid
	•	search input
	•	settings section
	•	auth shell
	•	dashboard shell
	•	split panel

Phase 7 — hooks and providers

Implement:
	•	hooks
	•	toast provider
	•	theme provider only if justified

Phase 8 — stories and tests

Add:
	•	foundations stories
	•	primitive stories
	•	component stories
	•	pattern stories
	•	targeted high-value tests
	•	Storybook test integration
	•	Chromatic baseline coverage

⸻

24. Definition of done

packages/ui is done when:
	•	the package has a clean public API
	•	all shared styling is token-driven
	•	client/server boundaries are explicit
	•	primitives are accessible and composable
	•	shared components stay presentational
	•	interactive families are isolated to proper client entrypoints
	•	patterns remain structural
	•	no server/business dependencies leak in
	•	stories cover the stable public surface
	•	targeted tests cover accessibility and interaction fundamentals
	•	the README is strong enough to prevent agentic drift

⸻

25. Non-goals

This package is not:
	•	a feature library
	•	a domain component library
	•	an Astro template system
	•	a React Native UI kit
	•	a business workflow engine
	•	a forms framework
	•	a charting system
	•	a data-grid system
	•	an animation playground
	•	a dumping ground for “shared” code

⸻

26. Final truth

The most important truths for packages/ui are:
	•	it is a shared React web UI package
	•	it is presentational first
	•	it is compiled first
	•	it is token-driven
	•	it uses vanilla-extract for internals
	•	it keeps root and broad barrels server-safe
	•	it isolates interactive families via client-marked family entrypoints
	•	it treats Storybook as part of the package contract
	•	it keeps patterns structural
	•	it aggressively resists becoming a business/component landfill

This is the final source of truth for @repo/ui.