# Enterprise Design System --- AI Agent Execution Plan

## Mission

Implement a reusable, accessible Enterprise Design System package for
the existing frontend repository.

Use this document as the implementation contract. Work in the repository
that is already open. Inspect its actual structure and dependencies
before changing files. Adapt to the repository where needed; do not
assume the example architecture below already exists.

## Goals

-   Establish consistent design tokens and semantic theming.
-   Build reusable React + TypeScript components with stable, documented
    APIs.
-   Support light, dark, system, and brand themes.
-   Integrate correctly with Tailwind CSS v4.
-   Provide Storybook documentation, automated tests, and package
    exports.
-   Keep business logic out of the design-system package.
-   Make the package usable by multiple frontend applications.

## Non-goals

-   Do not build application-specific business workflows.
-   Do not replace existing application architecture without evidence
    that it is required.
-   Do not add dependencies when the repository already has a suitable
    solution.
-   Do not claim WCAG conformance based only on automated checks.

## Agent operating rules

1.  Start by inspecting the repository: package manager, workspace
    layout, React and TypeScript versions, Tailwind version, build
    tooling, linting, testing, Storybook, and existing UI primitives.
2.  Read relevant `package.json`, workspace configuration, TypeScript
    configuration, CSS entry points, and existing component conventions
    before editing.
3.  Preserve existing conventions unless they conflict with this
    specification. Record any necessary deviation in the final report.
4.  Make small, verifiable changes. Run relevant checks after each
    implementation phase.
5.  Do not overwrite existing files or remove dependencies without
    understanding their purpose.
6.  Do not invent repository details, test results, or completed work.
7.  If a required decision cannot be resolved from repository evidence,
    choose the smallest reversible option and document it. Ask the user
    only when the decision blocks safe progress.
8.  Keep public APIs typed and avoid `any`.
9.  Do not put product/business rules in reusable UI components.
10. Never mark a phase complete when its acceptance criteria have not
    been verified.

## Phase 0 --- Repository assessment

### Tasks

-   Identify repository root and package manager.
-   Inspect workspace structure and current app/package boundaries.
-   Identify React, TypeScript, Tailwind CSS, Vite, Storybook, and test
    versions.
-   Check whether Radix UI, Lucide React, `class-variance-authority`,
    `clsx`, and `tailwind-merge` are already installed.
-   Identify existing tokens, theme provider, `cn()` utility,
    components, tests, and documentation.
-   Run existing baseline checks where practical.

### Deliverable

Create or update `docs/design-system/implementation-assessment.md`
with: - Current architecture and relevant versions. - Reusable existing
infrastructure. - Gaps against this specification. - Planned file
changes and any deviations.

### Acceptance criteria

-   Assessment is based on repository inspection.
-   No implementation changes are made before the assessment is
    complete.
-   Existing baseline failures are recorded separately from new
    failures.

## Phase 1 --- Package foundation

### Tasks

-   Establish or adapt the design-system package using the repository's
    existing workspace conventions.
-   Use React + TypeScript and strict typing.
-   Configure package build output and public exports for supported
    module formats.
-   Treat React and React DOM as peer dependencies when publishing a
    reusable package.
-   Define CSS entry-point and consumption instructions.
-   Ensure package styles and Tailwind utilities are discoverable by
    consuming apps.
-   Avoid duplicating dependencies already provided by the workspace.

### Suggested package layout

Adapt to repository conventions; keep one consistent source of truth.

``` text
packages/design-system/
  src/
    tokens/
    themes/
    foundations/
    components/
    primitives/
    hooks/
    utils/
    styles/
    types/
    index.ts
  stories/
  tests/
  package.json
  tsconfig.json
```

### Acceptance criteria

-   Package builds successfully.
-   Public exports resolve without importing internal source paths.
-   TypeScript declarations are emitted if required by the repository's
    package strategy.
-   CSS and Tailwind integration work in a consuming app or a minimal
    verified fixture.
-   No duplicate or conflicting package layout remains.

## Phase 2 --- Design tokens and themes

### Token model

Use three layers:

1.  **Primitive tokens:** raw palette, spacing, radius, typography, and
    shadow values.
2.  **Semantic tokens:** meaning-based values such as background,
    foreground, surface, border, primary, success, warning, and danger.
3.  **Component tokens:** component-specific values only where semantic
    tokens are insufficient.

Prefer semantic tokens in components. Avoid hardcoded visual values when
a token exists.

### Required token groups

-   Color: primary, neutral, success, warning, danger/error, and info.
-   Typography: font family, sizes, weights, and line heights.
-   Spacing: consistent 4px base scale.
-   Radius: none, small, medium, large, extra-large, full.
-   Shadow: subtle, medium, large.
-   Focus ring and motion/reduced-motion tokens where useful.

Use the initial palette and scales from the existing `DESIGN-SYSTEM.md`
unless repository requirements justify a change. Document any change.

### Tailwind CSS v4 requirement

Use CSS-first configuration. Do not create self-referential custom
properties such as:

``` css
--color-primary: var(--color-primary);
```

Use distinct names for source variables and Tailwind theme variables.
Example pattern:

``` css
:root {
  --ds-color-primary: #2563eb;
}

@theme {
  --color-primary: var(--ds-color-primary);
}
```

Verify the exact syntax against the installed Tailwind version and test
generated utility classes.

### Theme behavior

Support: - `light` - `dark` - `system` - brand overrides

Define precedence clearly: explicit user selection overrides system
preference; brand overrides may replace semantic values without changing
component APIs. Avoid incorrect theme flash during initialization.
Persist preference using the repository's established mechanism; if none
exists, use a small documented browser-safe implementation.

### Acceptance criteria

-   Light and dark themes define all required semantic tokens.
-   Theme switching updates components without reload.
-   System preference is respected when selected.
-   Theme preference persistence works.
-   Brand overrides can replace semantic tokens.
-   No self-referential CSS variables.
-   Contrast is checked for documented foreground/background pairs;
    failures are fixed or explicitly documented.

## Phase 3 --- Component API and core components

### API conventions

-   Use TypeScript strict typing.
-   Use native semantic elements where appropriate.
-   Preserve native attributes and event handlers.
-   Support `className` where it is useful and safe.
-   Use consistent `variant` and `size` names.
-   Provide disabled, focus-visible, hover, and loading states where
    relevant.
-   Support controlled and uncontrolled behavior only where it makes
    sense; document the contract.
-   Use refs where consumers reasonably need them.
-   Keep component APIs minimal and composable.
-   Use Radix UI for complex interactions when already available or when
    justified; do not rebuild accessibility primitives without reason.

### Initial component set

Implement and verify these first:

-   Button
-   Input
-   Textarea
-   Label
-   Badge
-   Checkbox
-   Radio
-   Switch
-   Spinner
-   Skeleton
-   Card

Do not begin advanced components until core components meet acceptance
criteria.

### Button minimum contract

-   Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`
-   Sizes: `sm`, `md`, `lg`
-   Native button attributes and event behavior
-   Disabled state
-   Loading state when applicable
-   Visible keyboard focus
-   Optional leading/trailing content without breaking accessible naming

### Form component requirements

-   Label association.
-   Disabled and invalid states.
-   Error/help text association.
-   Keyboard operation.
-   Clear controlled/uncontrolled contract where relevant.
-   No reliance on color alone to communicate errors.

### Acceptance criteria

-   Each component has typed public props.
-   Each interactive component supports keyboard use and visible focus.
-   Components use semantic tokens.
-   Each component has tests for key states and interactions.
-   No component contains application-specific business logic.

## Phase 4 --- Advanced components and patterns

After Phase 3 passes, implement in this order:

1.  Dialog
2.  Select and Combobox
3.  Dropdown Menu
4.  Tabs and Accordion
5.  Tooltip and Popover
6.  Toast
7.  Pagination
8.  Data Table
9.  Layout primitives and application patterns

For each component: - Prefer proven accessible primitives for complex
interactions. - Document keyboard behavior and focus management. - Test
empty, loading, disabled, error, and boundary states where relevant. -
Keep data fetching and business rules outside the design system.

## Phase 5 --- Storybook and documentation

### Required documentation per component

-   Purpose and description.
-   Import and usage example.
-   Props/API.
-   Variants and sizes.
-   States and interaction behavior.
-   Accessibility notes and keyboard behavior.
-   Do / Don't guidance.

### Required Storybook coverage

-   Foundations: colors, typography, spacing, radius, shadows.
-   Core components: all public variants and key states.
-   Themes: light and dark.
-   Patterns: only reusable, business-agnostic patterns.

### Acceptance criteria

-   Storybook starts and builds successfully.
-   Stories cover public variants and important states.
-   Examples use public package exports.
-   Documentation does not claim unsupported accessibility compliance.

## Phase 6 --- Quality gates

### Required checks

Use scripts already defined by the repository. Add missing scripts only
when needed.

-   Type checking.
-   Linting.
-   Unit/component tests.
-   Accessibility checks for representative interactive components.
-   Production package build.
-   Storybook build.
-   Consumer integration check.

Use Playwright for end-to-end tests when the repository already supports
it or when required to verify real consumer behavior.

### Test requirements

-   Test component behavior, not implementation details.
-   Cover keyboard interaction and disabled/error/loading states.
-   Verify light and dark theme behavior.
-   Check accessible names, labels, and error associations.
-   Record known limitations of automated accessibility tools.

### Acceptance criteria

-   All relevant checks pass, or existing unrelated failures are clearly
    identified.
-   No new TypeScript, lint, test, or build errors are introduced.
-   Manual checks are listed separately from automated checks.

## Phase 7 --- Package release readiness

### Tasks

-   Confirm public exports and CSS import path.
-   Document installation and Tailwind v4 setup for consuming apps.
-   Configure versioning and changelog conventions.
-   Document peer dependencies and supported versions.
-   Define contribution, review, and deprecation rules.
-   Verify package consumption from a separate app or workspace package.

### Acceptance criteria

-   A consuming app can import components and styles using documented
    public paths.
-   Release instructions are reproducible.
-   Breaking changes and deprecations have documented handling.

## Governance

-   Every new component requires design/API review, tests, and
    documentation.
-   Public API changes require backward-compatibility review.
-   Use semantic versioning: major for breaking changes, minor for
    compatible features, patch for fixes.
-   Keep `CHANGELOG.md` current.
-   Define component ownership and deprecation period in repository
    documentation.

## Definition of done

Design System is ready for initial adoption when:

-   [ ] Repository assessment is complete.
-   [ ] Package builds and exports work.
-   [ ] Design tokens and semantic themes are defined.
-   [ ] Light, dark, system, and brand behavior is verified.
-   [ ] Core components meet API, accessibility, and test requirements.
-   [ ] Storybook builds and documents public APIs.
-   [ ] Consumer app integration is verified.
-   [ ] Typecheck, lint, tests, and production build pass.
-   [ ] Installation, theming, contribution, and release instructions
    exist.
-   [ ] Deviations, limitations, and remaining work are documented.

## Final agent report

At completion, report:

1.  Summary of implemented work.
2.  Files added or changed.
3.  Architecture decisions and deviations from this plan.
4.  Commands run and exact results.
5.  Tests/checks passed and failed.
6.  Known limitations and unresolved issues.
7.  Recommended next step.

Do not report completion for work that was not implemented or verified.
