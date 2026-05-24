---
name: component-architecture
description: "Trigger: create component, new UI element, ABCD system, core component, module component. Implement the dual component architecture (Core ABCD vs Feature Modules)."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Apply this pattern when:
- Creating a new reusable UI component.
- Deciding whether a component belongs in the global `core` module or a specific feature module.
- Naming files and folders for components to maintain immediate traceability.

Do not use this pattern for page-level orchestration (see `page-section-architecture` skill) or layout components defined in `/layouts/`.

## Hard Rules

- **The component architecture is strictly divided into two domains**: Core (global) and Feature-Specific (module-local).

### 1. Core Module — ABCD + Layout System

Located in `app/components/` (currently) or `modules/_core/components/` (future modular structure). Uses **Vite's path-based auto-import naming**: the directory path dictates the component name.

**Categories and prefixes:**

| Category | Prefix | Folder | Role | Example |
|----------|--------|--------|------|---------|
| **Atom** | `A` | `a/[type]/` | Indivisible UI elements. Smallest building blocks that require context to have meaning. | `a/button/a-button-navigation.vue` → `<AButtonNavigation />` |
| **Base** | `B` | `b/[type]/` | Wrappers that standardize structure and behavior of more complex components. Can be used directly but exist primarily to be extended. | `b/modal/b-modal.vue` → `<BModal />` |
| **Composite** | `C` | `c/[type]/` | Semantic specializations of a Base. **MUST hardcode/restrict specific props** to enforce a design pattern (e.g., locking color to `error`). | `c/modal/c-modal-danger.vue` → `<CModalDanger />` |
| **Design** | `D` | `d/[type]/` | Complex, autonomous structures composed of Atoms, Bases, or Composites. May contain internal UI logic but not business logic. | `d/card/d-card-header.vue` → `<DCardHeader />` |
| **Layout** | `L` | `l/` | Scaffolding structures used within page layouts. Largest components defining page shells (navbar, sidebar, containers). | `l/l-navbar.vue` → `<LNavbar />` |

**Core constraints:**
- Components in core (A, B, C, D, L) MUST NOT contain business logic, API calls, or global state mutations (Pinia/stores).
- If a component needs to fetch data or manage business state, it is a Feature Component and MUST live in a specific module.
- Files use **kebab-case**: `a-button-navigation.vue`, not `AButtonNavigation.vue`.
- Each component file is co-located with its Storybook story: `a-button-navigation.stories.ts`.

### 2. Feature Modules — Local Components

Located in `modules/[module-name]/components/[type]/`. These exist in feature modules outside of `core`.

**Constraints:**
- DO NOT use A, B, C, D prefixes here.
- Names follow `[Type][ComponentName]` format based on their folder.
- Feature components CAN import core components; core components MUST NEVER import feature components.

**Common types:**

| Type | Folder | Role | Example |
|------|--------|------|---------|
| `section` | `components/section/` | Orchestrates API hooks, composes page blocks. See `page-section-architecture` skill. | `SectionMetrics.vue` |
| `layout` | `components/layout/` | Module-specific layout scaffolding (when the module needs its own layout beyond core's). | `LayoutSettings.vue` |
| `form` | `components/form/` | Smart form components with validation logic. | `FormLogin.vue` |
| `fields` | `components/fields/` | Dumb input collections. Presentational only. | `FieldsProfileSettings.vue` |
| `[custom]` | `components/[custom]/` | Any module-specific reusable piece. Folder name = type prefix. | `card/` → `CardMetric.vue`, `list/` → `ListUsers.vue` |

## Decision Gates

| Need | Action |
|------|--------|
| A generic button, input, or pill used across the app | Create an **Atom** (`a/[type]/a-[name].vue`) in core |
| A standardized wrapper for a UI library component | Create a **Base** (`b/[type]/b-[name].vue`) in core |
| A preconfigured variant of a Base (locked props) | Create a **Composite** (`c/[type]/c-[name].vue`) in core |
| A complex reusable structure (no business logic) | Create a **Design** (`d/[type]/d-[name].vue`) in core |
| A page shell structure (navbar, sidebar, container) | Create a **Layout** (`l/l-[name].vue`) in core |
| A reusable component specific to one feature | Create a **[Type]** (`[module]/components/[type]/[Type][Name].vue`) in the feature module |
| A component that fetches data or manages business state | It's a **Feature Component** — place it in a feature module, never in core |

## Execution Steps

1. Determine if the component is purely generic (cross-module) or feature-specific.
2. **If Core**: choose the ABCD+L category, create the file in the matching folder using kebab-case naming with the category prefix.
3. **If Feature**: create the type folder in `modules/[module]/components/[type]/` and name the component `[Type][Name].vue`.
4. Follow the project's Vue component conventions (see `vue-component-ts-conventions` or `vue-component-js-conventions` rules).
5. Co-locate the Storybook story file (`[name].stories.ts`) alongside the component (core components only).
6. **Dependency Rule**: Feature → Core imports are allowed. Core → Feature imports are FORBIDDEN.

## Output Contract

Return:
- The created/modified component file(s).
- A brief architectural note verifying: (a) the naming convention used (ABCD prefix vs [Type] prefix), (b) the domain chosen (core vs feature module), and (c) that no business logic exists in core components.

## References

- ABCD system docs: `app/components/Component-Organization-System.mdx`
- Core Atom: `app/components/a/button/a-button-navigation.vue`
- Core Base: `app/components/b/modal/b-modal.vue`
- Core Composite: `app/components/c/modal/c-modal-danger.vue`
- Core Design: `app/components/d/card/d-card-header.vue`
- Core Layout: `app/components/l/l-navbar.vue`
- Vue TS conventions: `.cursor/rules/vue-component-ts-conventions.mdc`
- Vue JS conventions: `.cursor/rules/vue-component-js-conventions.mdc`
- Section components: see `page-section-architecture` skill
