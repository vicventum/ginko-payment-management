---
name: page-section-architecture
description: "Trigger: create page, UI layout, new view, add section, component structure. Implement the Layout -> Page -> Section architecture for Vue."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Apply this pattern when:
- Creating a new Vue page in `modules/[module]/pages/` or a feature module.
- Refactoring a monolithic page into modular sections.
- Adding a new distinct content block to an existing page.

Do not use this pattern for isolated atomic components (buttons, inputs) or generic wrappers (cards, modals).

## Hard Rules

- **1. Layout**: Every Vue page MUST be wrapped in a layout structure. This can be done via Vue Router's named layouts or by manually wrapping the page content with a Layout component (e.g., `<DashboardLayout>`) if the page requires specific internal scaffolding.
- **2. Page as Orchestrator**: The Vue Page (`.vue` file in a route or module) composes the view. It uses semantic HTML `<section>` tags (or other appropriate semantics) to wrap each imported Section component.
- **3. Flow Margins**: Spacing between sections MUST be handled at the Page level using downward margins on the `<section>` wrappers (e.g., `class="mb-8"` or `mb-10`). 
   - *Never* mix top and bottom margins for structural flow.
   - *Never* hardcode structural flow margins inside the `Section[Name]` component itself. Keep it reusable.
- **4. Section Components**: Located in `modules/[module-name]/components/section/Section[Name].vue`. They act as feature containers. They are exclusive to feature modules and should NEVER be placed in the global `_core`.
- **5. Data Fetching & Hooks**:
   - *Data Fetching*: Call composables (TanStack Query or custom hooks) directly inside the `Section` component. You do NOT need to lift state to the Page unless absolutely necessary for sibling coordination. Let global state (e.g., Pinia) or cache invalidation handle reactivity.
   - *If Shared State is strictly needed*: Lift the state to the `Page` component and pass data/handlers down as props.
- **6. Presentation**: Sections delegate rendering to smaller UI components (Cards, Forms, Lists) from the module or `_core`. Sections handle the "glue" (data + logic), while the internal components remain as pure/presentational as possible.

## Decision Gates

| Need | Action |
|------|--------|
| Defining the global page shell | Use a named layout or wrap in a Layout component |
| Stacking blocks vertically on a page | Wrap blocks in `<section class="mb-X">` inside the Page |
| Grouping a feature's UI and API logic | Create a **Section** component in `modules/[module]/components/section/` |
| Displaying dumb UI inside a section | Pass props to pure/presentational Feature or Core components |
| Where to call API hooks? | Inside the **Section**. Only lift to **Page** if shared across sections. |

## Execution Steps

1. Create or locate the page in the appropriate module `pages/` directory.
2. Ensure the page uses the correct layout (via a wrapper component or route config).
3. Create the required `Section` components in `modules/[module]/components/section/`.
4. In the Page, import the `Section` components and wrap each in a `<section class="mb-[size]">`.
5. Inside the `Section`, call the necessary composables or API hooks.
6. Compose the UI inside the `Section` using smaller components (Atoms, Bases, Composites, Designs, or local Feature components), passing down data as props.

## Output Contract

Return:
- The created/modified files (Page, Sections, Feature components).
- A brief architectural note explaining the data fetching placement (Page vs Section) and the layout wrapper used.

## References

- Section Component Pattern: see `component-architecture` skill.
- Core Layouts: `app/components/l/`
